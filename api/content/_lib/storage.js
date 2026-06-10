import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const STORAGE_FILE = process.env.CONTENT_QUEUE_FILE
  || path.join(process.cwd(), 'api', 'content', '_data', 'queue.json');

async function ensureStore() {
  const dir = path.dirname(STORAGE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(STORAGE_FILE);
  } catch {
    await fs.writeFile(STORAGE_FILE, JSON.stringify({ posts: [] }, null, 2));
  }
}

async function readAll() {
  await ensureStore();
  const raw = await fs.readFile(STORAGE_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.posts) ? parsed : { posts: [] };
  } catch {
    return { posts: [] };
  }
}

async function writeAll(data) {
  await ensureStore();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
}

export async function listPosts() {
  const { posts } = await readAll();
  return posts.sort((a, b) => {
    const at = new Date(a.scheduled_at || a.created_at).getTime();
    const bt = new Date(b.scheduled_at || b.created_at).getTime();
    return at - bt;
  });
}

export async function getPost(id) {
  const { posts } = await readAll();
  return posts.find(p => p.id === id) || null;
}

export async function createPost(input) {
  const data = await readAll();
  const post = {
    id: `cp_${Date.now()}_${randomBytes(3).toString('hex')}`,
    body: input.body || '',
    image_url: input.image_url || null,
    platforms: Array.isArray(input.platforms) ? input.platforms : [],
    scheduled_at: input.scheduled_at || new Date().toISOString(),
    status: 'scheduled',
    results: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  data.posts.push(post);
  await writeAll(data);
  return post;
}

export async function updatePost(id, patch) {
  const data = await readAll();
  const idx = data.posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  data.posts[idx] = {
    ...data.posts[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await writeAll(data);
  return data.posts[idx];
}

export async function deletePost(id) {
  const data = await readAll();
  const before = data.posts.length;
  data.posts = data.posts.filter(p => p.id !== id);
  await writeAll(data);
  return data.posts.length < before;
}

export async function findDuePosts(now = new Date()) {
  const { posts } = await readAll();
  return posts.filter(p => {
    if (p.status !== 'scheduled') return false;
    return new Date(p.scheduled_at).getTime() <= now.getTime();
  });
}
