export const id = 'linkedin';
export const label = 'LinkedIn';

export function isConfigured() {
  return Boolean(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_ID);
}

export async function publish({ body, image_url }) {
  if (!isConfigured()) {
    throw new Error('LinkedIn not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID.');
  }

  if (process.env.LINKEDIN_WEBHOOK_URL) {
    return forwardWebhook(process.env.LINKEDIN_WEBHOOK_URL, { body, image_url });
  }

  const author = `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`;
  const payload = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: body || '' },
        shareMediaCategory: image_url ? 'IMAGE' : 'NONE',
        ...(image_url ? { media: [{ status: 'READY', originalUrl: image_url }] } : {}),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json().catch(() => ({}));
  return { id: data.id || null };
}

async function forwardWebhook(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: 'linkedin', ...payload }),
  });
  if (!res.ok) throw new Error(`LinkedIn webhook ${res.status}`);
  return { webhook: true };
}
