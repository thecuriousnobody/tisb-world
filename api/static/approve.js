// POST { item: { content, linkedin_text?, facebook_text?, platforms?, images?,
//                scheduled_at, client_ref }, postNow?: boolean }
//
// Approves a static marketing post: validates, enforces the blackout, wraps
// every URL in per-platform tisb.world/go/<code> tracking links (registered in
// KV), and commits a `kind: "campaign"` item into content/queue.json on the
// content-engine repo. The posting workflow picks it up when scheduled_at is due.
//
// postNow sets scheduled_at to now and dispatches the workflow WITHOUT force —
// the campaign fires because it is due; the venture rotation is not dragged along.

import crypto from 'node:crypto';
import { kv } from '@vercel/kv';
import { verifyAdmin } from '../dropzone/_lib/auth.js';
import { getFile, putFile } from '../dropzone/_lib/github.js';
import { BLACKOUT } from '../dropzone/_lib/blackout.js';

const QUEUE_PATH = 'content/queue.json';
const MAX_TEXT = 10_000;
const MAX_IMAGES = 4;
const X_LIMIT = 280;
const TCO_LENGTH = 23; // X wraps every URL in t.co at a fixed 23 chars
const URL_RE = /https?:\/\/[^\s)\]}"']+/g;
const BLOB_HOST_RE = /\.public\.blob\.vercel-storage\.com$/;

const PLATFORMS = ['x', 'linkedin', 'facebook'];

function newCode() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(7);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

/** Trailing punctuation belongs to the sentence, not the URL. */
function cleanUrl(raw) {
  return raw.replace(/[.,!?;:]+$/, '');
}

function effectiveXLength(text) {
  return text.replace(URL_RE, 'x'.repeat(TCO_LENGTH)).length;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { item, postNow } = req.body || {};
  if (!item || typeof item !== 'object') {
    return res.status(400).json({ error: 'Missing item.' });
  }

  // --- basic shape ---------------------------------------------------------
  if (!item.content || typeof item.content !== 'string') {
    return res.status(400).json({ error: 'Post text is empty.' });
  }
  if (!item.client_ref || typeof item.client_ref !== 'string' || item.client_ref.length > 100) {
    return res.status(400).json({ error: 'Missing draft reference (client_ref).' });
  }
  const platforms = {
    x: item.platforms?.x !== false,
    linkedin: item.platforms?.linkedin !== false,
    facebook: item.platforms?.facebook !== false,
  };
  if (!PLATFORMS.some((p) => platforms[p])) {
    return res.status(400).json({ error: 'Enable at least one platform.' });
  }

  // Resolve each enabled platform's text (override or main copy).
  const rawTexts = {
    x: item.content,
    linkedin: item.linkedin_text || item.content,
    facebook: item.facebook_text || item.content,
  };
  for (const p of PLATFORMS) {
    if (typeof rawTexts[p] !== 'string' || rawTexts[p].length > MAX_TEXT) {
      return res.status(400).json({ error: `${p} text is invalid or too long.` });
    }
  }

  // --- blackout (server-side, same rule as every other publish path) -------
  if (BLACKOUT.test(PLATFORMS.map((p) => rawTexts[p]).join('\n'))) {
    return res.status(422).json({ error: 'Angel Mentor blackout — cannot queue this.' });
  }

  // --- schedule -------------------------------------------------------------
  let scheduledAt = postNow ? new Date() : new Date(item.scheduled_at || NaN);
  if (Number.isNaN(scheduledAt.getTime())) {
    return res.status(400).json({ error: 'Pick a date and time.' });
  }
  const now = Date.now();
  if (scheduledAt.getTime() < now - 5 * 60_000) {
    return res.status(400).json({ error: 'Scheduled time is in the past.' });
  }
  if (scheduledAt.getTime() > now + 365 * 24 * 3_600_000) {
    return res.status(400).json({ error: 'Scheduled time is more than a year out.' });
  }

  // --- images ---------------------------------------------------------------
  const images = Array.isArray(item.images) ? item.images : [];
  if (images.length > MAX_IMAGES) {
    return res.status(400).json({ error: `At most ${MAX_IMAGES} images.` });
  }
  for (const img of images) {
    let host;
    try {
      host = new URL(img.url).hostname;
    } catch {
      return res.status(400).json({ error: 'Invalid image URL.' });
    }
    if (!BLOB_HOST_RE.test(host)) {
      return res.status(400).json({ error: 'Images must be uploaded through this page.' });
    }
  }

  // --- idempotency: same draft approved twice = one queue item --------------
  let file;
  try {
    file = await getFile(QUEUE_PATH);
  } catch (err) {
    return res.status(502).json({ error: `Could not read queue: ${err.message}` });
  }
  const existingQueue = file ? JSON.parse(file.text) : [];
  const dup = existingQueue.find((q) => q.client_ref === item.client_ref);
  if (dup) {
    return res.status(200).json({ ok: true, id: dup.id, duplicate: true });
  }

  const id = `static_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  // --- link wrapping: per-destination, per-platform go-codes ----------------
  // Skipped entirely when the post opts out (trackLinks:false) so raw URLs stay
  // in the text and X/LinkedIn can render the link's Open Graph preview card.
  const trackLinks = item.trackLinks !== false;
  const links = [];
  const wrapped = { ...rawTexts };
  if (trackLinks) {
    const destSet = new Set();
    for (const p of PLATFORMS) {
      if (!platforms[p]) continue;
      for (const m of rawTexts[p].match(URL_RE) || []) destSet.add(cleanUrl(m));
    }
    try {
      for (const dest of destSet) {
        const codes = {};
        for (const p of PLATFORMS) {
          if (!platforms[p] || !wrapped[p].includes(dest)) continue;
          let code = newCode();
          // NX guards the (astronomically unlikely) collision; regenerate once.
          let okSet = await kv.set(
            `go:${code}`,
            { dest, post_id: id, platform: p, created_at: new Date().toISOString() },
            { nx: true }
          );
          if (okSet === null) {
            code = newCode();
            okSet = await kv.set(
              `go:${code}`,
              { dest, post_id: id, platform: p, created_at: new Date().toISOString() },
              { nx: true }
            );
            if (okSet === null) throw new Error('Could not allocate a tracking code.');
          }
          codes[p] = code;
          wrapped[p] = wrapped[p].split(dest).join(`https://www.tisb.world/go/${code}`);
        }
        if (Object.keys(codes).length > 0) links.push({ dest, codes });
      }
    } catch (err) {
      return res.status(502).json({ error: `Click-tracking setup failed: ${err.message}. Retry.` });
    }
  }

  // --- X length check AFTER wrapping ----------------------------------------
  if (platforms.x && effectiveXLength(wrapped.x) > X_LIMIT) {
    return res.status(400).json({
      error: `X text is ${effectiveXLength(wrapped.x)} chars after link wrapping (max ${X_LIMIT}). Shorten it or disable X.`,
    });
  }

  const queueItem = {
    id,
    kind: 'campaign',
    startup: 'tisb',
    type: 'static',
    content: wrapped.x,
    ...(platforms.linkedin ? { linkedin_text: wrapped.linkedin } : {}),
    ...(platforms.facebook ? { facebook_text: wrapped.facebook } : {}),
    platforms,
    track_links: trackLinks,
    ...(images.length > 0
      ? { images: images.map((i) => ({ url: i.url, contentType: i.contentType || 'image/jpeg', size: i.size })) }
      : {}),
    ...(links.length > 0 ? { links } : {}),
    scheduled_at: scheduledAt.toISOString(),
    client_ref: item.client_ref,
    created_at: new Date().toISOString(),
    approved_by: admin.email,
  };

  // Append with one retry on stale SHA (posting cron may commit mid-flight).
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const f = attempt === 0 ? file : await getFile(QUEUE_PATH);
      const queue = f ? JSON.parse(f.text) : [];
      if (queue.find((q) => q.client_ref === item.client_ref)) {
        return res.status(200).json({ ok: true, id, duplicate: true });
      }
      queue.push(queueItem);
      await putFile(
        QUEUE_PATH,
        JSON.stringify(queue, null, 2) + '\n',
        f?.sha,
        `Static Drop: queue campaign ${id} for ${queueItem.scheduled_at}`
      );
      if (postNow) await dispatchDue();
      return res.status(200).json({
        ok: true,
        id,
        scheduled_at: queueItem.scheduled_at,
        links: links.length,
        postNow: !!postNow,
      });
    } catch (err) {
      if (err.status === 409 && attempt === 0) continue;
      return res.status(502).json({ error: `Could not commit to queue: ${err.message}. Retry.` });
    }
  }
}

/** Fire the posting workflow without forcing the rotation along with it. */
async function dispatchDue() {
  const pat = process.env.GITHUB_CONTENT_PAT;
  const repo = process.env.CONTENT_REPO || 'thecuriousnobody/content-engine';
  const r = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/post.yml/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tisb-static-drop',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main', inputs: { force: false } }),
  });
  if (r.status !== 204) {
    const body = await r.text();
    throw new Error(`Workflow dispatch failed: ${r.status} ${body.substring(0, 120)}`);
  }
}
