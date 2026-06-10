export const id = 'facebook';
export const label = 'Facebook';

export function isConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}

export async function publish({ body, image_url }) {
  if (!isConfigured()) {
    throw new Error('Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.');
  }
  if (process.env.FACEBOOK_WEBHOOK_URL) {
    return forwardWebhook(process.env.FACEBOOK_WEBHOOK_URL, { body, image_url });
  }

  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const endpoint = image_url
    ? `https://graph.facebook.com/v20.0/${pageId}/photos`
    : `https://graph.facebook.com/v20.0/${pageId}/feed`;

  const params = new URLSearchParams();
  if (image_url) {
    params.set('url', image_url);
    if (body) params.set('caption', body);
  } else {
    params.set('message', body || '');
  }
  params.set('access_token', token);

  const res = await fetch(endpoint, { method: 'POST', body: params });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Facebook API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return { id: data.id || data.post_id || null };
}

async function forwardWebhook(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: 'facebook', ...payload }),
  });
  if (!res.ok) throw new Error(`Facebook webhook ${res.status}`);
  return { webhook: true };
}
