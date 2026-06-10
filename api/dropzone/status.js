// GET → pipeline status strip: last workflow runs, queue depth,
// last posted item's per-platform results, LinkedIn token expiry countdown.

import { verifyAdmin } from './_lib/auth.js';
import { getFile, latestWorkflowRuns } from './_lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  try {
    const [queueFile, postedFile, platformFile, runs] = await Promise.all([
      getFile('content/queue.json'),
      getFile('content/posted.json'),
      getFile('content/platform-status.json'),
      latestWorkflowRuns(3),
    ]);

    const queue = queueFile ? JSON.parse(queueFile.text) : [];
    const posted = postedFile ? JSON.parse(postedFile.text) : [];
    const last = posted[posted.length - 1] || null;

    let linkedinDaysLeft = null;
    if (platformFile) {
      const platform = JSON.parse(platformFile.text);
      if (platform.linkedin_token_expires) {
        linkedinDaysLeft = Math.floor(
          (new Date(platform.linkedin_token_expires).getTime() - Date.now()) / 86_400_000
        );
      }
    }

    return res.status(200).json({
      queueDepth: queue.length,
      nextUp: queue[0] ? { startup: queue[0].startup, preview: queue[0].content.substring(0, 80) } : null,
      lastPost: last
        ? {
            startup: last.startup,
            posted_at: last.posted_at,
            x: last.tweet_id ? (last.thread_complete === false ? 'partial' : 'posted') : 'failed',
            tweet_url: last.tweet_url || null,
            linkedin: last.linkedin_status || 'unknown',
            facebook: last.facebook_status || 'unknown',
          }
        : null,
      runs,
      linkedinDaysLeft,
    });
  } catch (err) {
    return res.status(502).json({ error: `Status fetch failed: ${err.message}` });
  }
}
