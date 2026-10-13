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

/**
 * Display order is curated by Rajeev (Oct 2026) — NOT sorted by status.
 * The first three are the Home page's "Now building" cards.
 */
const ventures: Venture[] = [
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
    // Physical box at the charger + QR-opened AI concierge + host revenue share
    // (per swych-box.com). Not "just a concierge" — keep the hardware in the line.
    tagline: 'Service while you charge — an on-site box and AI concierge that turn the EV charging wait into local orders and revenue for the station. Equipment lockers coming soon.',
    status: 'beta',
    url: 'https://www.swych-box.com/',
    kanji: '迎',
    accentHue: 235,
    art: '/ventures/swychbox-product.webp',
  },
  {
    name: 'Stack Day',
    tagline: 'Your day, stacked and conquered.',
    status: 'shipped',
    url: 'https://stackday.ai',
    kanji: '積',
    // 101 = the Stack Day yellow (#FFE500) in oklch, so the hairline matches the mark.
    accentHue: 101,
    // The official mark (stackday repo: public/stackday-favicon.svg) — tapering
    // yellow bars on black — re-rendered from the vector as a 16:9 tile.
    art: '/ventures/stackday-mark.webp',
    artIsDark: true,
  },
  {
    name: 'podcastbots',
    tagline: 'Find people doing meaningful work. Have better conversations.',
    status: 'beta',
    url: 'https://podcastbots.ai',
    kanji: '縁',
    accentHue: 300,
    // Just the headphones figure — no wordmark, no blurred side strips — cut
    // from the original art and feathered onto its own dark ground.
    art: '/ventures/podcastbots-mark.webp',
    artIsDark: true,
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
    name: 'Neuronify',
    tagline: "Your city's nervous system. Speak, and City Hall hears a costed brief.",
    status: 'building',
    url: 'https://neuronify.ai',
    kanji: '脈',
    accentHue: 250,
    art: '/ventures/neuronify-brand.webp',
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
]

export const sortedVentures: Venture[] = ventures

export const featuredVentures: Venture[] = sortedVentures.slice(0, 3)

export const ventureCount = ventures.length

/** "STACKDAY.AI" — the domain shown under each tagline. */
export const ventureDomain = (v: Venture) =>
  v.url ? v.url.replace(/^https?:\/\//, '').replace(/\/$/, '').toUpperCase() : 'NO PUBLIC URL YET'
