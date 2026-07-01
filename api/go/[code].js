// Public click-tracking redirect: /go/<code> → 302 to the registered destination.
// The only unauthenticated route in the static-drop family — it does exactly
// three things: KV GET, conditional INCR, redirect. No other verbs, no body.

import { kv } from '@vercel/kv';

// Platform preview crawlers fetch every link at post time; counting them would
// give every post phantom clicks before a human ever sees it.
const BOT_UA =
  /(facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|googlebot|bingbot|pinterest|vkshare|petalbot|applebot)/i;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const code = String(req.query.code || '');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');

  // Unknown/malformed code: fail open for humans, land them on the homepage.
  if (!/^[A-Za-z0-9]{4,16}$/.test(code)) {
    return res.redirect(302, 'https://www.tisb.world');
  }

  let entry = null;
  try {
    entry = await kv.get(`go:${code}`);
  } catch {
    // KV briefly down: never strand a human on an error page over a counter.
  }
  if (!entry || !entry.dest) {
    return res.redirect(302, 'https://www.tisb.world');
  }

  const ua = req.headers['user-agent'] || '';
  if (!BOT_UA.test(ua)) {
    const day = new Date().toISOString().slice(0, 10);
    try {
      await Promise.all([kv.incr(`clicks:${code}`), kv.incr(`clicks:${code}:${day}`)]);
    } catch {
      // Counting is best-effort; the redirect must still happen.
    }
  }

  return res.redirect(302, entry.dest);
}
