import { publishHandler } from './_lib/handlers.js';

export default async function handler(req, res) {
  return publishHandler(req, res);
}
