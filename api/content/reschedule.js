import { rescheduleHandler } from './_lib/handlers.js';

export default async function handler(req, res) {
  return rescheduleHandler(req, res);
}
