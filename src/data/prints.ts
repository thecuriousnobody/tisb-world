/**
 * Commercial art page (/prints) content.
 *
 * Deliberately a tiny hand-curated list, NOT the full Behance archive — this
 * page exists to answer one question for a designer landing from Pinterest:
 * "can I get this on my client's wall, and how?" Four installation shots answer
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
   * Series name. These are currently the installation SETTING, because the
   * mapping from each mockup back to its Behance series isn't recorded
   * anywhere — swap in the real series names when you have them.
   */
  title: string
  /** One-line character note: what the piece does in a room. */
  note: string
  /** public/ path. */
  image: string
}

/** Full-bleed installation shot at the top of the page. */
export const heroImage = '/installations/hero-rooftop-lounge.jpg'

/**
 * The single positioning sentence. Kept as a constant because it is the most
 * load-bearing copy on the page — it sets format, material, and market.
 */
export const positioning =
  'Available in large format on brushed aluminum for hospitality, commercial, and residential installation. Sizes and editions by inquiry.'

export const prints: Print[] = [
  {
    title: 'Rooftop Bar',
    note: 'Warm ground, high contrast — holds its own against a skyline and a full room.',
    image: '/installations/rooftop-bar.jpg',
  },
  {
    title: 'Residential',
    note: 'Copper and soot over a fireplace. Vertical format for double-height walls.',
    image: '/installations/residential-fireplace.jpg',
  },
  {
    title: 'Terrace',
    note: 'Square format, hard yellow. Built to carry an exterior wall at dusk.',
    image: '/installations/terrace-sunset.jpg',
  },
  {
    title: 'Penthouse',
    note: 'Cooler register — teal and black for interiors that need calm, not heat.',
    image: '/installations/penthouse-terrace.jpg',
  },
]

/** Inquiry form option lists — kept here so copy edits never touch the page. */
export const useCases = [
  'Hospitality (hotel, restaurant, bar)',
  'Commercial (office, lobby, retail)',
  'Residential',
  'Set / event / temporary install',
  'Not sure yet',
]

export const sizes = [
  'Under 36"',
  '36" – 60"',
  '60" – 96"',
  'Over 96" / architectural',
  'Not sure — advise me',
]
