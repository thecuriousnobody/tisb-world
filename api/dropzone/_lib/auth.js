// Server-side admin verification: Google ID token (Bearer) → tokeninfo →
// audience + verified email + allow-list. Fail closed on every branch.

const FALLBACK_ADMINS = [
  'rajeev@theideasandbox.com',
  'theideasandboxpodcast@gmail.com',
  'apexrisesolutions7@gmail.com',
  'shay999.in@gmail.com',
];

export async function verifyAdmin(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) {
    res.status(401).json({ error: 'No session token. Sign out and back in at /admin/login.' });
    return null;
  }

  let info;
  try {
    const r = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`
    );
    if (!r.ok) {
      res.status(401).json({ error: 'Session expired. Sign out and back in at /admin/login.' });
      return null;
    }
    info = await r.json();
  } catch {
    res.status(401).json({ error: 'Could not verify session. Try again.' });
    return null;
  }

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  if (!clientId || info.aud !== clientId) {
    res.status(403).json({ error: 'Token was not issued for this app.' });
    return null;
  }
  if (String(info.email_verified) !== 'true') {
    res.status(403).json({ error: 'Email not verified.' });
    return null;
  }

  const admins = (process.env.ADMIN_EMAILS || FALLBACK_ADMINS.join(','))
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = (info.email || '').toLowerCase();
  if (!admins.includes(email)) {
    res.status(403).json({ error: 'Not an admin account.' });
    return null;
  }

  return { email };
}
