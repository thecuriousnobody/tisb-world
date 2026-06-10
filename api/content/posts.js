import { postsHandler } from './_lib/handlers.js';

export default async function handler(req, res) {
  return postsHandler(req, res);
}
