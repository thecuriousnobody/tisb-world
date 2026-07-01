// POST { id } — remove a scheduled campaign item from the queue before it posts.

import { verifyAdmin } from '../dropzone/_lib/auth.js';
import { getFile, putFile } from '../dropzone/_lib/github.js';

const QUEUE_PATH = 'content/queue.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { id } = req.body || {};
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id.' });

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const file = await getFile(QUEUE_PATH);
      const queue = file ? JSON.parse(file.text) : [];
      const idx = queue.findIndex((i) => i.id === id && i.kind === 'campaign');
      if (idx < 0) {
        // Already posted or already cancelled — either way it's gone.
        return res.status(404).json({ error: 'Not in the queue (already posted or cancelled).' });
      }
      queue.splice(idx, 1);
      await putFile(
        QUEUE_PATH,
        JSON.stringify(queue, null, 2) + '\n',
        file?.sha,
        `Static Drop: cancel campaign ${id} (by ${admin.email})`
      );
      return res.status(200).json({ ok: true, id });
    } catch (err) {
      if (err.status === 409 && attempt === 0) continue;
      return res.status(502).json({ error: `Could not cancel: ${err.message}. Retry.` });
    }
  }
}
