// GET — campaign engagement metrics, read from the content-engine repo.
// Written weekly by that repo's metrics workflow (metrics/campaign-metrics.json).

import { verifyAdmin } from '../dropzone/_lib/auth.js';
import { getFile } from '../dropzone/_lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  try {
    const file = await getFile('metrics/campaign-metrics.json');
    const metrics = file ? JSON.parse(file.text) : {};
    return res.status(200).json({ metrics, fetched: !!file });
  } catch (err) {
    return res.status(502).json({ error: `Could not read metrics: ${err.message}` });
  }
}
