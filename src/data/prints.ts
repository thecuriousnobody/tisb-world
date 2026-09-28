/**
 * Commercial art page (/prints) content.
 *
 * Deliberately a tiny hand-curated list, NOT the full Behance archive — this
 * page exists to answer one question for a designer landing from Pinterest:
 * "can I get this on my client's wall, and how?" Four visualizations answer
 * it; a 125-item grid of flat artwork does not.
 *
 * The four below are chosen for RANGE OF SETTING, not just for the art — a
 * hospitality buyer and a residential buyer each need to see their own space
 * represented before they'll inquire.
 *
 * NOTE: assets live in public/installations/, NOT public/prints/ — a static
 * folder named `prints` shadows the /prints SPA route and 301-redirects it.
 *
 * Unused mockups are still in public/installations/ under their original
 * filenames if you want to swap any of these out.
 */

export interface Print {
  /**
   * Series name. These are currently the visualized SETTING, because the
   * mapping from each mockup back to its Behance series isn't recorded
   * anywhere — swap in the real series names when you have them.
   */
  title: string
  /** One-line character note: what the piece does in a room. */
  note: string
  /** public/ path. */
  image: string
}

/**
 * Full-bleed visualization at the top of the page.
 *
 * NOT photographs of completed work: every image on /prints is an AI-rendered
 * visualization (made with Nano Banana Pro) of how a piece would read at
 * scale. Copy must never claim these are real installations — see
 * `disclosure` below.
 *
 * Chosen for BRANDING LEGIBILITY as much as composition: these mockups are
 * AI-rendered, and in several of them the "THE CURIOUS NOBODY" plate comes out
 * mangled ("THE OURIOUS NOBODI"). At hero scale that reads as sloppy to the
 * exact buyer we want. Only use shots where the plate renders cleanly.
 */
export const heroImage = '/installations/hero-terrace-copper.webp'

/**
 * The single positioning sentence. Kept as a constant because it is the most
 * load-bearing copy on the page — it sets format, material, and market.
 */
export const positioning =
  'Original work, produced to order in large format on brushed or anodized aluminum for hospitality, commercial, and residential spaces. Sizes, finishes, and editions by inquiry.'

/** Shown above the plates so no buyer mistakes a render for a past install. */
export const disclosure =
  'These are visualizations — renderings of how each piece reads at architectural scale, not photographs of finished installations. Every piece is produced to order.'

export const prints: Print[] = [
  {
    title: 'Rooftop Lounge',
    note: 'Hard yellow and red against a skyline. Built for a room that stays busy.',
    image: '/installations/rooftop-lounge.webp',
  },
  {
    title: 'Rooftop Bar',
    note: 'Warm ground, high contrast — holds its own at golden hour.',
    image: '/installations/rooftop-bar.webp',
  },
  {
    title: 'Interior',
    note: 'Vertical format, quiet ground. For residential walls and long sightlines.',
    image: '/installations/interior-minimal.webp',
  },
  {
    title: 'Penthouse',
    note: 'Cooler register — teal and black for interiors that need calm, not heat.',
    image: '/installations/penthouse-terrace.webp',
  },
]

/** Inquiry form option lists — kept here so copy edits never touch the page. */
export const useCases = [
  'Hospitality (hotel, restaurant, bar)',
  'Commercial (office, lobby, retail)',
  'Residential',
  'Set / event / temporary install',
  'Print studio / fabrication partner',
  'Not sure yet',
]

export const sizes = [
  'Under 36"',
  '36" – 60"',
  '60" – 96"',
  'Over 96" / architectural',
  'Not sure — advise me',
]
