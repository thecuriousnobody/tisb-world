// GET — pending scheduled campaigns, recently posted campaigns, and the
// posting workflow's recent runs (same strip the Drop Zone shows).

import { verifyAdmin } from '../dropzone/_lib/auth.js';
import { getFile, latestWorkflowRuns } from '../dropzone/_lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  try {
    const [queueFile, postedFile, statusFile, runs] = await Promise.all([
      getFile('content/queue.json'),
      getFile('content/posted.json'),
      getFile('content/platform-status.json'),
      latestWorkflowRuns(3),
    ]);

    const queue = queueFile ? JSON.parse(queueFile.text) : [];
    const posted = postedFile ? JSON.parse(postedFile.text) : [];
    const platformStatus = statusFile ? JSON.parse(statusFile.text) : {};

    const scheduled = queue
      .filter((i) => i.kind === 'campaign')
      .sort((a, b) => (a.scheduled_at < b.scheduled_at ? -1 : 1));

    const recentCampaigns = posted
      .filter((i) => i.kind === 'campaign')
      .slice(-10)
      .reverse();

    return res.status(200).json({
      scheduled,
      recentCampaigns,
      queueDepth: queue.length,
      linkedinTokenExpires: platformStatus.linkedin_token_expires || null,
      runs,
    });
  } catch (err) {
    return res.status(502).json({ error: `Could not read status: ${err.message}` });
  }
}
