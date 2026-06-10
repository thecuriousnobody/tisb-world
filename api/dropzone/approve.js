// POST { item: { startup, content, x_thread?, linkedin_text, facebook_text }, postNow?: boolean }
// Commits the approved post into content/queue.json on the content-engine repo.
// postNow additionally fires the posting workflow with force=true.

import { verifyAdmin } from './_lib/auth.js';
import { getFile, putFile, dispatchPostNow } from './_lib/github.js';
import { BLACKOUT, VENTURES } from './_lib/blackout.js';

const QUEUE_PATH = 'content/queue.json';
const MAX_TEXT = 10_000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { item, postNow } = req.body || {};
  if (!item || !VENTURES.includes(item.startup)) {
    return res.status(400).json({ error: 'Invalid or missing venture.' });
  }
  const texts = [item.content, ...(item.x_thread || []), item.linkedin_text, item.facebook_text];
  if (!item.content || !item.linkedin_text || !item.facebook_text) {
    return res.status(400).json({ error: 'A rendition is empty — fill in all three.' });
  }
  for (const t of texts) {
    if (t && (typeof t !== 'string' || t.length > MAX_TEXT)) {
      return res.status(400).json({ error: 'Rendition too long.' });
    }
  }
  if (BLACKOUT.test(texts.filter(Boolean).join('\n'))) {
    return res.status(422).json({ error: 'Angel Mentor blackout — cannot queue this.' });
  }

  const queueItem = {
    id: `drop_${Date.now()}`,
    startup: item.startup,
    type: 'drop',
    content: item.content,
    ...(item.x_thread && item.x_thread.length > 0 ? { thread: item.x_thread } : {}),
    linkedin_text: item.linkedin_text,
    facebook_text: item.facebook_text,
    created_at: new Date().toISOString(),
    approved_by: admin.email,
  };

  // Append with one retry on stale SHA (cron may have shifted the queue mid-flight)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const file = await getFile(QUEUE_PATH);
      const queue = file ? JSON.parse(file.text) : [];
      queue.push(queueItem);
      await putFile(
        QUEUE_PATH,
        JSON.stringify(queue, null, 2) + '\n',
        file?.sha,
        `Drop Zone: queue ${queueItem.startup} post (${queueItem.id})`
      );
      if (postNow) await dispatchPostNow();
      return res.status(200).json({
        ok: true,
        id: queueItem.id,
        queueDepth: queue.length,
        postNow: !!postNow,
      });
    } catch (err) {
      if (err.status === 409 && attempt === 0) continue;
      return res.status(502).json({ error: `Could not commit to queue: ${err.message}. Retry.` });
    }
  }
}
