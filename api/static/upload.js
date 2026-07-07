// Server-side image upload to Vercel Blob for Static Drop.
//
// The browser sends the image as base64 JSON; this route verifies the admin,
// then does put() itself — which authenticates via the OIDC creds Vercel
// injects at runtime (BLOB_STORE_ID + VERCEL_OIDC_TOKEN), so no classic
// BLOB_READ_WRITE_TOKEN is required. Reusing JSON body parsing (same as every
// other route here) keeps this dead simple.
//
// Vercel caps the request body at 4.5MB and base64 inflates ~1.37x, so the
// raw image is capped at 3MB — far above any marketing graphic (they run well
// under 1MB). If bigger files are ever needed, switch to a raw-binary stream.

import { put } from '@vercel/blob';
import { verifyAdmin } from '../dropzone/_lib/auth.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { filename, contentType, data } = req.body || {};
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'No image data.' });
  }
  if (!ALLOWED.includes(contentType)) {
    return res.status(400).json({ error: 'JPEG or PNG only.' });
  }

  let buffer;
  try {
    buffer = Buffer.from(data, 'base64');
  } catch {
    return res.status(400).json({ error: 'Corrupt image data.' });
  }
  if (buffer.length === 0) return res.status(400).json({ error: 'Empty image.' });
  if (buffer.length > MAX_IMAGE_BYTES) {
    return res.status(413).json({ error: 'Image over 3MB — shrink it and retry.' });
  }

  // Keep a safe pathname; addRandomSuffix guarantees uniqueness anyway.
  const safeName = String(filename || 'image')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image';

  try {
    const blob = await put(`static/${safeName}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });
    return res.status(200).json({ url: blob.url, contentType, size: buffer.length });
  } catch (err) {
    return res.status(502).json({ error: `Upload failed: ${String(err && err.message || err)}` });
  }
}
