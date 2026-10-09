export type VentureStatus = 'shipped' | 'beta' | 'building'

export interface Venture {
  name: string
  tagline: string
  status: VentureStatus
  /** Empty string = no public destination yet; the row renders unlinked. */
  url: string
  /** Brush mark for the tile when there's no art, and as the overlay when there is. */
  kanji: string
  /** oklch(0.68 0.13 H). Hairline accent under the tile only — never a fill. */
  accentHue: number
  /** Tile art under public/ventures/. None = the kanji tile renders instead. */
  art?: string
  /** Dark art flips the kanji overlay to paper so it stays legible. */
  artIsDark?: boolean
  /** Scale-in to crop art edges (podcastbots has blurred side strips). */
  artZoom?: number
}

const STATUS_ORDER: Record<VentureStatus, number> = {
  shipped: 0,
  beta: 1,
  building: 2,
}

const ventures: Venture[] = [
  {
    name: 'Stack Day',
    tagline: 'Your day, stacked and conquered.',
    status: 'shipped',
    url: 'https://stackday.ai',
    kanji: '積',
    accentHue: 85,
    art: '/ventures/stackday-brand.webp',
  },
  {
    name: 'DeSilo',
    tagline: 'The AI appliance for entrepreneurs. Ideas in, ventures out.',
    status: 'beta',
    url: 'https://desilo-it.ai',
    kanji: '解',
    // 51 = the new brand orange (#EF781B) in oklch, so the hairline matches the mark.
    accentHue: 51,
    // New DeSilo mark (Oct 2026 redesign), centred on its own #020A12 ground for 16:9.
    art: '/ventures/desilo-brand.webp',
    artIsDark: true,
  },
  {
    name: 'swych-box',
    tagline: 'An AI concierge at the edge for every small business.',
    status: 'beta',
    url: 'https://www.swych-box.com/',
    kanji: '迎',
    accentHue: 235,
    art: '/ventures/swychbox-product.webp',
  },
  {
    name: 'podcastbots',
    tagline: 'Find people doing meaningful work. Have better conversations.',
    status: 'beta',
    url: 'https://podcastbots.ai',
    kanji: '縁',
    accentHue: 300,
    art: '/ventures/podcastbots-brand.webp',
    artIsDark: true,
    artZoom: 1.16,
  },
  {
    name: 'Autonomy Labs',
    tagline: 'Building autonomous systems that work for you.',
    status: 'building',
    url: 'https://autonomylabs.dev',
    kanji: '自',
    accentHue: 150,
    art: '/ventures/autonomylabs-doorpath.webp',
    artIsDark: true,
  },
  {
    name: 'Golden Hour',
    tagline: 'Voice-first AI emergency response for India. Every minute counts.',
    status: 'building',
    url: '',
    kanji: '救',
    accentHue: 55,
  },
  {
    name: 'Neuronify',
    tagline: "Your city's nervous system. Speak, and City Hall hears a costed brief.",
    status: 'building',
    url: 'https://neuronify.ai',
    kanji: '脈',
    accentHue: 250,
    art: '/ventures/neuronify-brand.webp',
    artIsDark: true,
  },
]

export const sortedVentures: Venture[] = [...ventures].sort(
  (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
)

export const featuredVentures: Venture[] = sortedVentures.slice(0, 3)

export const ventureCount = ventures.length

/** "STACKDAY.AI" — the domain shown under each tagline. */
export const ventureDomain = (v: Venture) =>
  v.url ? v.url.replace(/^https?:\/\//, '').replace(/\/$/, '').toUpperCase() : 'NO PUBLIC URL YET'
