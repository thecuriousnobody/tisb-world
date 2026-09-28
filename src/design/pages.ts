/**
 * Page registry: each route's kanji, label, reading, and right-edge text.
 * The veil transition, header nav, footer nav, and edge text all read this,
 * so a page is defined in exactly one place.
 */

export type PageKey =
  | 'home' | 'ventures' | 'podcast' | 'music' | 'art' | 'prints' | 'writing' | 'post' | 'about'

interface PageMeta {
  path: string
  /** Brush kanji for the section cell and the transition veil. */
  k: string
  label: string
  /** Romanised reading, shown in the veil label. */
  jp: string
  /** Fixed vertical text on the right edge. */
  edge: string
}

export const PAGES: Record<PageKey, PageMeta> = {
  home:     { path: '/',         k: '箱', label: 'HOME',     jp: 'HAKO',    edge: 'アイデア・サンドボックス　／　発想の箱庭' },
  ventures: { path: '/ventures', k: '創', label: 'VENTURES', jp: 'SŌ',      edge: 'ベンチャー　／　七つの事業' },
  podcast:  { path: '/podcast',  k: '話', label: 'PODCAST',  jp: 'HANASHI', edge: 'ポッドキャスト　／　対話' },
  music:    { path: '/music',    k: '音', label: 'MUSIC',    jp: 'OTO',     edge: 'ミュージック　／　音楽' },
  art:      { path: '/art',      k: '芸', label: 'ART',      jp: 'GEI',     edge: 'アート　／　芸術' },
  prints:   { path: '/prints',   k: '版', label: 'PRINTS',   jp: 'HAN',     edge: 'プリント　／　大判' },
  writing:  { path: '/blog',     k: '書', label: 'WRITING',  jp: 'SHO',     edge: 'ライティング　／　無名の好奇心' },
  post:     { path: '/blog/',    k: '書', label: 'ESSAY',    jp: 'SHO',     edge: 'エッセイ　／　随筆' },
  about:    { path: '/about',    k: '人', label: 'ABOUT',    jp: 'HITO',    edge: 'ビルダー　／　人' },
}

/** Public nav order. Admin is deliberately absent. */
export const NAV: PageKey[] = ['ventures', 'podcast', 'music', 'art', 'prints', 'writing', 'about']

export function pageForPath(pathname: string): PageKey | null {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/') return 'home'
  if (p.startsWith('/blog/')) return 'post'
  const hit = (Object.keys(PAGES) as PageKey[]).find((k) => k !== 'post' && PAGES[k].path === p)
  return hit ?? null
}

/** Nav item is active on its own page — and Writing stays lit while reading a post. */
export function isNavActive(key: PageKey, current: PageKey | null) {
  return key === current || (key === 'writing' && current === 'post')
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
