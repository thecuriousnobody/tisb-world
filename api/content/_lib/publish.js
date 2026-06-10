import * as email from './platforms/email.js';
import * as linkedin from './platforms/linkedin.js';
import * as facebook from './platforms/facebook.js';
import * as instagram from './platforms/instagram.js';
import { updatePost } from './storage.js';

const adapters = { email, linkedin, facebook, instagram };

export function platformStatus() {
  return Object.values(adapters).map(a => ({
    id: a.id,
    label: a.label,
    configured: a.isConfigured(),
  }));
}

export async function publishPost(post) {
  const results = { ...(post.results || {}) };
  let anyFailed = false;
  let anyOk = false;

  for (const platformId of post.platforms || []) {
    const adapter = adapters[platformId];
    if (!adapter) {
      results[platformId] = { ok: false, error: `Unknown platform: ${platformId}`, at: new Date().toISOString() };
      anyFailed = true;
      continue;
    }
    if (results[platformId]?.ok) continue;

    try {
      const out = await adapter.publish({ body: post.body, image_url: post.image_url });
      results[platformId] = { ok: true, response: out, at: new Date().toISOString() };
      anyOk = true;
    } catch (err) {
      results[platformId] = { ok: false, error: err.message || String(err), at: new Date().toISOString() };
      anyFailed = true;
    }
  }

  const status = anyFailed
    ? (anyOk ? 'partial' : 'failed')
    : 'published';

  const updated = await updatePost(post.id, {
    results,
    status,
    published_at: status === 'published' ? new Date().toISOString() : (post.published_at || null),
  });
  return updated;
}
