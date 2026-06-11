export type VentureStatus = 'shipped' | 'beta' | 'building'

export interface Venture {
  name: string
  tagline: string
  status: VentureStatus
  /** Empty string = no public destination yet; card renders unlinked */
  url: string
  /** Hairline accent only — never used as a fill */
  accentColor: string
  /** Optional card image (path under public/), pulled from the venture's own site */
  image?: string
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
    accentColor: '#FFD700',
    image: '/ventures/stackday.jpg',
  },
  {
    name: 'DeSilo',
    tagline: 'The AI appliance for entrepreneurs. Ideas in, ventures out.',
    status: 'beta',
    url: 'https://desilo-it.ai',
    accentColor: '#FF3333',
    image: '/ventures/desilo.jpg',
  },
  {
    name: 'swych-box',
    tagline: 'An AI concierge at the edge for every small business.',
    status: 'beta',
    url: 'https://app.swych-box.com',
    accentColor: '#00BFFF',
    image: '/ventures/swychbox.jpg',
  },
  {
    name: 'podcastbots',
    tagline: 'Find people doing meaningful work. Have better conversations.',
    status: 'beta',
    url: 'https://podcastbots.ai',
    accentColor: '#9370DB',
    image: '/ventures/podcastbots.jpg',
  },
  {
    name: 'Autonomy Labs',
    tagline: 'Building autonomous systems that work for you.',
    status: 'building',
    url: 'https://autonomylabs.dev',
    accentColor: '#32CD32',
    image: '/ventures/autonomylabs.jpg',
  },
  {
    name: 'Golden Hour',
    tagline: 'Voice-first AI emergency response for India. Every minute counts.',
    status: 'building',
    url: '',
    accentColor: '#FF9933',
  },
  {
    name: 'Neuronify',
    tagline: "Your city's nervous system. Speak, and City Hall hears a costed brief.",
    status: 'building',
    url: 'https://neuronify.ai',
    accentColor: '#40E0D0',
    image: '/ventures/neuronify.png',
  },
]

export const sortedVentures: Venture[] = [...ventures].sort(
  (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
)

export const featuredVentures: Venture[] = sortedVentures.slice(0, 3)

export const ventureCount = ventures.length
