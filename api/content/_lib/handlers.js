import { listPosts, getPost, createPost, deletePost, findDuePosts, updatePost } from './storage.js';
import { publishPost, platformStatus } from './publish.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export async function postsHandler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return send(res, 200, {});

  try {
    if (req.method === 'GET') {
      const posts = await listPosts();
      return send(res, 200, { posts, platforms: platformStatus() });
    }
    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.body && !body.image_url) {
        return send(res, 400, { error: 'Post must include body text or image_url' });
      }
      if (!Array.isArray(body.platforms) || body.platforms.length === 0) {
        return send(res, 400, { error: 'Pick at least one platform' });
      }
      const post = await createPost(body);
      return send(res, 201, { post });
    }
    if (req.method === 'DELETE') {
      const url = new URL(req.url, 'http://localhost');
      const id = url.searchParams.get('id') || (await readJsonBody(req)).id;
      if (!id) return send(res, 400, { error: 'Missing id' });
      const ok = await deletePost(id);
      return send(res, ok ? 200 : 404, { ok });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('posts handler error', err);
    return send(res, 500, { error: err.message || 'Internal error' });
  }
}

export async function publishHandler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return send(res, 200, {});
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  try {
    const body = await readJsonBody(req);
    const id = body.id;
    if (!id) return send(res, 400, { error: 'Missing id' });
    const post = await getPost(id);
    if (!post) return send(res, 404, { error: 'Post not found' });
    const updated = await publishPost(post);
    return send(res, 200, { post: updated });
  } catch (err) {
    console.error('publish handler error', err);
    return send(res, 500, { error: err.message || 'Internal error' });
  }
}

export async function cronHandler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return send(res, 200, {});

  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    const provided = auth.replace(/^Bearer\s+/i, '');
    if (provided !== secret) return send(res, 401, { error: 'Unauthorized' });
  }

  try {
    const due = await findDuePosts();
    const processed = [];
    for (const post of due) {
      const updated = await publishPost(post);
      processed.push({ id: updated.id, status: updated.status });
    }
    return send(res, 200, { processed, count: processed.length, at: new Date().toISOString() });
  } catch (err) {
    console.error('cron handler error', err);
    return send(res, 500, { error: err.message || 'Internal error' });
  }
}

export async function rescheduleHandler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return send(res, 200, {});
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  try {
    const body = await readJsonBody(req);
    if (!body.id || !body.scheduled_at) return send(res, 400, { error: 'Missing id or scheduled_at' });
    const updated = await updatePost(body.id, { scheduled_at: body.scheduled_at, status: 'scheduled' });
    if (!updated) return send(res, 404, { error: 'Post not found' });
    return send(res, 200, { post: updated });
  } catch (err) {
    console.error('reschedule handler error', err);
    return send(res, 500, { error: err.message || 'Internal error' });
  }
}
