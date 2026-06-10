export const id = 'instagram';
export const label = 'Instagram';

export function isConfigured() {
  return Boolean(process.env.INSTAGRAM_BUSINESS_ID && process.env.INSTAGRAM_ACCESS_TOKEN);
}

export async function publish({ body, image_url }) {
  if (!isConfigured()) {
    throw new Error('Instagram not configured. Set INSTAGRAM_BUSINESS_ID and INSTAGRAM_ACCESS_TOKEN.');
  }
  if (process.env.INSTAGRAM_WEBHOOK_URL) {
    return forwardWebhook(process.env.INSTAGRAM_WEBHOOK_URL, { body, image_url });
  }
  if (!image_url) {
    throw new Error('Instagram requires an image. Add an image URL or upload one.');
  }

  const igId = process.env.INSTAGRAM_BUSINESS_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  const containerParams = new URLSearchParams();
  containerParams.set('image_url', image_url);
  if (body) containerParams.set('caption', body);
  containerParams.set('access_token', token);

  const containerRes = await fetch(`https://graph.facebook.com/v20.0/${igId}/media`, {
    method: 'POST',
    body: containerParams,
  });
  if (!containerRes.ok) {
    const text = await containerRes.text();
    throw new Error(`Instagram container ${containerRes.status}: ${text.slice(0, 300)}`);
  }
  const { id: creationId } = await containerRes.json();
  if (!creationId) throw new Error('Instagram container missing id');

  const publishParams = new URLSearchParams();
  publishParams.set('creation_id', creationId);
  publishParams.set('access_token', token);
  const publishRes = await fetch(`https://graph.facebook.com/v20.0/${igId}/media_publish`, {
    method: 'POST',
    body: publishParams,
  });
  if (!publishRes.ok) {
    const text = await publishRes.text();
    throw new Error(`Instagram publish ${publishRes.status}: ${text.slice(0, 300)}`);
  }
  const data = await publishRes.json();
  return { id: data.id || null };
}

async function forwardWebhook(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: 'instagram', ...payload }),
  });
  if (!res.ok) throw new Error(`Instagram webhook ${res.status}`);
  return { webhook: true };
}
