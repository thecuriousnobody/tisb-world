import type { ContentItem } from '../services/contentService'

/** Shared formatting for the Writing list and the essay page. */

export const SUBSTACK = 'https://thecuriousnobody.substack.com'

/** `E.020` — entries count down so the newest essay carries the highest number. */
export const entryNo = (i: number, total: number) => 'E.' + String(total - i).padStart(3, '0')

/** `26 SEP 2026` */
export const fmtDate = (d: Date) =>
  isNaN(d.getTime())
    ? '—'
    : `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${d.getFullYear()}`

export const fmtRead = (p: ContentItem) => `${String(p.readingMinutes ?? 5).padStart(2, '0')} MIN`
