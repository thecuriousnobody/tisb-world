// POST { transcript, image?: { media_type, data } }
// → { venture, x: { content, thread }, linkedin_text, facebook_text }
// Claude shapes a raw ramble (+ optional screenshot for context) into three
// platform renditions in Rajeev's voice, using the venture voice docs from
// the content-engine repo as the single source of truth.

import { verifyAdmin } from './_lib/auth.js';
import { getFile } from './_lib/github.js';
import { BLACKOUT, VENTURES } from './_lib/blackout.js';

const VOICE_FILES = VENTURES.map((id) => `skills/${id}-voice.md`);
const MAX_TRANSCRIPT = 8_000;
const MAX_IMAGE_B64 = 3_500_000; // ~2.6MB image, under Vercel's body limit
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

let voiceCache = { text: null, at: 0 };
const VOICE_TTL_MS = 10 * 60 * 1000;

async function loadVoices() {
  if (voiceCache.text && Date.now() - voiceCache.at < VOICE_TTL_MS) return voiceCache.text;
  const files = await Promise.all(VOICE_FILES.map((p) => getFile(p)));
  const text = files
    .map((f, i) => (f ? `## VOICE DOC: ${VENTURES[i]}\n${f.text}` : ''))
    .filter(Boolean)
    .join('\n\n---\n\n');
  voiceCache = { text, at: Date.now() };
  return text;
}

const SYSTEM = `You turn Rajeev Kumar's raw spoken ramble (and optional screenshot) into social posts for ONE of his ventures.

ABSOLUTE RULES:
1. Use ONLY facts present in the ramble or visible in the screenshot. NEVER invent numbers, user counts, week numbers, dates, or milestones. If the ramble has no metric, the post has no metric.
2. Never mention "Angel Mentor" or any unreleased venture.
3. Pick the single venture the ramble is about from: stackday, desilo, swychbox, podcastbots, autonomylabs. Autonomy Labs is BUILDING (waitlist only) — never imply it is shipping.
4. Write in Rajeev's voice per the voice docs: authentic, systems-thinking, no corporate speak, no hashtag spam.

OUTPUT: exactly one JSON object, no markdown fences, no commentary:
{
  "venture": "<id>",
  "x": { "content": "<first tweet, <=270 chars>", "thread": ["<optional follow-up tweets, each <=270 chars>"] },
  "linkedin_text": "<longer rendition, short paragraphs, blank lines between>",
  "facebook_text": "<casual conversational rendition>"
}
Use a thread only if the idea genuinely needs it; most drops should be a single tweet (empty thread array).`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { transcript, image } = req.body || {};
  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    return res.status(400).json({ error: 'Empty transcript — say something first.' });
  }
  if (transcript.length > MAX_TRANSCRIPT) {
    return res.status(400).json({ error: `Transcript too long (max ${MAX_TRANSCRIPT} chars).` });
  }
  if (BLACKOUT.test(transcript)) {
    return res.status(422).json({
      error: 'That mentions Angel Mentor — full public blackout until Dr. Jeffries clears it. Re-record without it.',
    });
  }
  if (image) {
    if (!ALLOWED_IMAGE_TYPES.includes(image.media_type) || typeof image.data !== 'string') {
      return res.status(400).json({ error: 'Unsupported image type.' });
    }
    if (image.data.length > MAX_IMAGE_B64) {
      return res.status(400).json({ error: 'Screenshot too large — keep it under ~2.5MB.' });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured.' });

  let voices;
  try {
    voices = await loadVoices();
  } catch (err) {
    return res.status(502).json({ error: `Could not load voice docs from GitHub: ${err.message}` });
  }

  const content = [];
  if (image) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: image.media_type, data: image.data },
    });
  }
  content.push({
    type: 'text',
    text: `${voices}\n\n---\n\nRAJEEV'S RAMBLE (verbatim transcript):\n"""\n${transcript.trim()}\n"""\n\nShape it. JSON only.`,
  });

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{ role: 'user', content }],
    }),
  });
  if (!r.ok) {
    const body = await r.text();
    return res.status(502).json({ error: `Claude call failed (${r.status}): ${body.substring(0, 150)}` });
  }
  const msg = await r.json();
  const raw = (msg.content || []).map((b) => b.text || '').join('');

  let draft;
  try {
    const jsonText = raw.replace(/^```(json)?/m, '').replace(/```\s*$/m, '').trim();
    draft = JSON.parse(jsonText);
  } catch {
    return res.status(502).json({ error: 'Claude returned malformed JSON — hit SHAPE IT again.' });
  }

  if (!VENTURES.includes(draft.venture)) {
    return res.status(502).json({ error: `Unknown venture "${draft.venture}" — hit SHAPE IT again.` });
  }
  const allText = [draft.x?.content, ...(draft.x?.thread || []), draft.linkedin_text, draft.facebook_text]
    .filter(Boolean)
    .join('\n');
  if (BLACKOUT.test(allText)) {
    return res.status(422).json({ error: 'Draft tripped the Angel Mentor blackout filter. Re-record.' });
  }
  if (!draft.x?.content || !draft.linkedin_text || !draft.facebook_text) {
    return res.status(502).json({ error: 'Draft missing a rendition — hit SHAPE IT again.' });
  }

  return res.status(200).json({
    venture: draft.venture,
    x: { content: draft.x.content, thread: draft.x.thread || [] },
    linkedin_text: draft.linkedin_text,
    facebook_text: draft.facebook_text,
  });
}
