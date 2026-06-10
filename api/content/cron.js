import { cronHandler } from './_lib/handlers.js';

export default async function handler(req, res) {
  return cronHandler(req, res);
}
