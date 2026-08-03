/**
 * Art inquiry intake for /prints.
 *
 * Two sinks, on purpose:
 *   1. Notion  — the pipeline you actually work (Status: New → Quoted → Won/Lost)
 *   2. Email   — so a lead never sits unseen waiting for you to open Notion
 *
 * A lead is the whole point of the page, so we treat losing one as the failure
 * case: we attempt both sinks independently and only return 500 if BOTH fail.
 * One sink succeeding means the inquiry is captured somewhere recoverable.
 *
 * Notion database schema (create once, share with the integration):
 *   Name      title
 *   Email     email
 *   Use Case  rich_text
 *   Size      rich_text
 *   Notes     rich_text
 *   Status    select     ← options auto-create on first write; leave empty
 *   Source    rich_text
 *
 * Env: NOTION_API_KEY, NOTION_ART_INQUIRIES_DB_ID,
 *      SMTP_HOST/PORT/SECURE/USER/PASS, EMAIL_FROM, EMAIL_TO
 */

import nodemailer from 'nodemailer'

const NOTION_VERSION = '2022-06-28'
const FALLBACK_EMAIL_TO = 'rajeev@theideasandbox.com'

/** Field length caps — a real inquiry never exceeds these; a bot might. */
const LIMITS = { name: 120, email: 200, useCase: 120, size: 120, notes: 4000 }

/**
 * Crude per-IP throttle. Serverless instances are ephemeral so this is a speed
 * bump, not a guarantee — enough to stop a naive script hammering the form.
 */
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) hits.clear() // bound memory
  return recent.length > RATE_MAX
}

const clean = (value, max) => String(value ?? '').trim().slice(0, max)

/** Deliberately permissive — bounce obvious junk, let the human sort the rest. */
const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const richText = (content) => (content ? [{ text: { content } }] : [])

async function saveToNotion(inquiry) {
  const token = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_ART_INQUIRIES_DB_ID

  if (!token || !databaseId) {
    throw new Error('Notion not configured (NOTION_API_KEY / NOTION_ART_INQUIRIES_DB_ID)')
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: richText(inquiry.name) },
        Email: { email: inquiry.email || null },
        'Use Case': { rich_text: richText(inquiry.useCase) },
        Size: { rich_text: richText(inquiry.size) },
        Notes: { rich_text: richText(inquiry.notes) },
        Status: { select: { name: 'New' } },
        Source: { rich_text: richText(inquiry.source) },
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Notion ${response.status}: ${detail}`)
  }

  return response.json()
}

async function sendEmail(inquiry) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO } =
    process.env

  // Name the missing vars — "SMTP not configured" alone sent us hunting through
  // the Vercel dashboard once already.
  const missing = Object.entries({ SMTP_HOST, SMTP_USER, SMTP_PASS })
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length) {
    throw new Error(`SMTP not configured — missing/empty: ${missing.join(', ')}`)
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE) === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const lines = [
    `Name:     ${inquiry.name}`,
    `Email:    ${inquiry.email}`,
    `Use case: ${inquiry.useCase || '—'}`,
    `Size:     ${inquiry.size || '—'}`,
    '',
    'Notes:',
    inquiry.notes || '—',
    '',
    `Source: ${inquiry.source}`,
  ]

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to: EMAIL_TO || FALLBACK_EMAIL_TO,
    replyTo: inquiry.email || undefined,
    subject: `Art inquiry — ${inquiry.name}${inquiry.useCase ? ` (${inquiry.useCase})` : ''}`,
    text: lines.join('\n'),
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const body = req.body || {}

  // Honeypot: hidden field no human ever fills. Return 200 so bots see success
  // and do not retry with the field cleared.
  if (String(body.company || '').trim()) {
    console.warn('🕸️  Art inquiry honeypot tripped')
    return res.status(200).json({ success: true })
  }

  const inquiry = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email).toLowerCase(),
    useCase: clean(body.useCase, LIMITS.useCase),
    size: clean(body.size, LIMITS.size),
    notes: clean(body.notes, LIMITS.notes),
    source: clean(body.source, 120) || '/prints',
  }

  if (!inquiry.name) return res.status(400).json({ error: 'Name is required.' })
  if (!looksLikeEmail(inquiry.email)) {
    return res.status(400).json({ error: 'A valid email is required.' })
  }

  // Throttle only well-formed submissions. Counting rejected/honeypot requests
  // would let a real person lock themselves out by fumbling the form, and a
  // bot sending garbage already costs us nothing (we never reach the sinks).
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' })
  }

  const [notionResult, emailResult] = await Promise.allSettled([
    saveToNotion(inquiry),
    sendEmail(inquiry),
  ])

  if (notionResult.status === 'rejected') {
    console.error('❌ Art inquiry → Notion failed:', notionResult.reason?.message)
  }
  if (emailResult.status === 'rejected') {
    console.error('❌ Art inquiry → email failed:', emailResult.reason?.message)
  }

  if (notionResult.status === 'rejected' && emailResult.status === 'rejected') {
    // Last resort: make sure the lead exists in the logs even if both sinks die.
    console.error('🚨 Art inquiry LOST — both sinks failed. Payload:', JSON.stringify(inquiry))
    return res.status(500).json({ error: 'Could not send your inquiry. Please email directly.' })
  }

  console.log(`✅ Art inquiry captured from ${inquiry.email}`)
  return res.status(200).json({ success: true })
}
