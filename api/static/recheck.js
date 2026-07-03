// POST — dispatch the content-engine "Check accounts" workflow, which resolves
// which real accounts each platform credential belongs to and commits the
// result to platform-status.json (~60s round trip; the UI re-polls status).

import { verifyAdmin } from '../dropzone/_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const pat = process.env.GITHUB_CONTENT_PAT;
  const repo = process.env.CONTENT_REPO || 'thecuriousnobody/content-engine';
  const r = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/accounts.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'tisb-static-drop',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  );
  if (r.status !== 204) {
    const body = await r.text();
    return res
      .status(502)
      .json({ error: `Could not start account check: ${r.status} ${body.substring(0, 120)}` });
  }
  return res.status(200).json({ ok: true });
}
