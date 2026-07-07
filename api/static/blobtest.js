// TEMPORARY probe: verifies server-side Blob put() authenticates via the
// OIDC creds Vercel injected (BLOB_STORE_ID + runtime VERCEL_OIDC_TOKEN),
// with no classic BLOB_READ_WRITE_TOKEN. Deleted once the upload path is fixed.
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const blob = await put(`static/_probe-${Date.now()}.txt`, 'ok', {
      access: 'public',
      addRandomSuffix: true,
    });
    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err && err.message || err) });
  }
}
