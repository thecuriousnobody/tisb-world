// Thin GitHub API client for the content-engine repo (queue-as-database).

const REPO = process.env.CONTENT_REPO || 'thecuriousnobody/content-engine';
const API = 'https://api.github.com';

function headers() {
  const pat = process.env.GITHUB_CONTENT_PAT;
  if (!pat) throw new Error('GITHUB_CONTENT_PAT is not configured');
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'tisb-dropzone',
  };
}

export async function getFile(path) {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}?ref=main`, { headers: headers() });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${path} failed: ${r.status}`);
  const j = await r.json();
  return { sha: j.sha, text: Buffer.from(j.content, 'base64').toString('utf-8') };
}

export async function putFile(path, text, sha, message) {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, 'utf-8').toString('base64'),
      sha: sha || undefined,
      branch: 'main',
    }),
  });
  if (!r.ok) {
    const body = await r.text();
    const err = new Error(`GitHub PUT ${path} failed: ${r.status} ${body.substring(0, 120)}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

export async function latestWorkflowRuns(limit = 3) {
  const r = await fetch(
    `${API}/repos/${REPO}/actions/workflows/post.yml/runs?per_page=${limit}`,
    { headers: headers() }
  );
  if (!r.ok) return [];
  const j = await r.json();
  return (j.workflow_runs || []).map((run) => ({
    status: run.status,
    conclusion: run.conclusion,
    created_at: run.created_at,
    html_url: run.html_url,
    event: run.event,
  }));
}

export async function dispatchPostNow() {
  const r = await fetch(`${API}/repos/${REPO}/actions/workflows/post.yml/dispatches`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'main', inputs: { force: true } }),
  });
  if (r.status !== 204) {
    const body = await r.text();
    throw new Error(`Workflow dispatch failed: ${r.status} ${body.substring(0, 120)}`);
  }
}
