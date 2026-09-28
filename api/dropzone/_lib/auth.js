// Server-side admin verification: Google ID token (Bearer) → tokeninfo →
// audience + verified email + allow-list. Fail closed on every branch.

const FALLBACK_ADMINS = [
  'rajeev@theideasandbox.com',
  'theideasandboxpodcast@gmail.com',
  'apexrisesolutions7@gmail.com',
  'shay999.in@gmail.com',
];

async function verifyAllowed(req, res, allowList) {
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

  const email = (info.email || '').toLowerCase();
  if (!allowList.includes(email)) {
    res.status(403).json({ error: 'Not an admin account.' });
    return null;
  }

  return { email };
}


const parseList = (...lists) =>
  lists.join(',').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

/** Admin-only tools (drop zone, static drop, artwork). */
export function verifyAdmin(req, res) {
  return verifyAllowed(req, res, parseList(process.env.ADMIN_EMAILS || FALLBACK_ADMINS.join(',')));
}

/**
 * Tools editors use too (the Video Production Tracker). Allow-list is
 * ADMIN_EMAILS plus VITE_ADMIN_EMAILS — the list the client already uses to
 * let editors into /admin — so the server and the UI agree on who's in.
 */
export function verifyEditor(req, res) {
  return verifyAllowed(
    req,
    res,
    parseList(process.env.ADMIN_EMAILS || FALLBACK_ADMINS.join(','), process.env.VITE_ADMIN_EMAILS || ''),
  );
}
