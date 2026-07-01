// Vercel Blob client-upload token endpoint for Static Drop images.
// The browser uploads directly to Blob (bypasses the 4.5MB function body cap);
// this route only mints scoped tokens — after verifying the admin session.

import { handleUpload } from '@vercel/blob/client';
import { verifyAdmin } from '../dropzone/_lib/auth.js';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // lowest common platform limit, minus headroom

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ['image/jpeg', 'image/png'],
        maximumSizeInBytes: MAX_IMAGE_BYTES,
        addRandomSuffix: true,
        pathname: `static/${pathname.replace(/^static\//, '')}`,
        tokenPayload: JSON.stringify({ uploadedBy: admin.email }),
      }),
      // Fires server-side after the browser finishes uploading; nothing to do —
      // the approve route re-validates every image URL before queueing.
      onUploadCompleted: async () => {},
    });
    return res.status(200).json(jsonResponse);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
