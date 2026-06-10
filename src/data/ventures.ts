export type VentureStatus = 'shipped' | 'beta' | 'building'

export interface Venture {
  name: string
  tagline: string
  status: VentureStatus
  /** Empty string = no public destination yet; card renders unlinked */
  url: string
  /** Hairline accent only — never used as a fill */
  accentColor: string
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
    url: '',
    accentColor: '#FFD700',
  },
  {
    name: 'DeSilo',
    tagline: 'The AI appliance for entrepreneurs. Ideas in, ventures out.',
    status: 'beta',
    url: 'https://potentiator.ai',
    accentColor: '#FF3333',
  },
  {
    name: 'swych-box',
    tagline: 'An AI concierge at the edge for every small business.',
    status: 'beta',
    url: '',
    accentColor: '#00BFFF',
  },
  {
    name: 'podcastbots',
    tagline: 'Find people doing meaningful work. Have better conversations.',
    status: 'beta',
    url: '',
    accentColor: '#9370DB',
  },
  {
    name: 'Autonomy Labs',
    tagline: 'Building autonomous systems that work for you.',
    status: 'building',
    url: '',
    accentColor: '#32CD32',
  },
]

export const sortedVentures: Venture[] = [...ventures].sort(
  (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
)

export const featuredVentures: Venture[] = sortedVentures.slice(0, 3)

export const ventureCount = ventures.length
