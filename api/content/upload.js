import formidable from 'formidable';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

export const config = { api: { bodyParser: false } };

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'content-uploads');
const PUBLIC_PREFIX = '/content-uploads';
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);

async function ensureDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    await ensureDir();
    const form = formidable({ maxFileSize: MAX_BYTES, multiples: false, uploadDir: UPLOAD_DIR, keepExtensions: true });

    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => err ? reject(err) : resolve({ fields, files }));
    });

    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'No image field in upload' }));
    }
    const mime = file.mimetype || '';
    if (!ALLOWED.has(mime)) {
      await fs.unlink(file.filepath).catch(() => {});
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: `Unsupported type: ${mime}. Use PNG, JPEG, GIF, or WebP.` }));
    }

    const ext = path.extname(file.originalFilename || file.newFilename || '') || extFromMime(mime);
    const finalName = `${Date.now()}_${randomBytes(4).toString('hex')}${ext}`;
    const finalPath = path.join(UPLOAD_DIR, finalName);
    await fs.rename(file.filepath, finalPath);

    const publicUrl = `${PUBLIC_PREFIX}/${finalName}`;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ url: publicUrl }));
  } catch (err) {
    console.error('upload error', err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message || 'Upload failed' }));
  }
}

function extFromMime(mime) {
  return { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp' }[mime] || '';
}
