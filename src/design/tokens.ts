/**
 * "Signal" design tokens — white paper, black ink, one vermilion accent.
 *
 * Every page reads from here instead of hard-coding hex values, so the system
 * stays one decision wide. Values are final from the design handoff; don't
 * "tune" them per page.
 */

export const C = {
  paper: '#FAFAF8',
  paperPure: '#FFFFFF',
  ink: '#0F0F0E',
  inkSoft: '#55544F',
  /** All mono labels and metadata. Passes 4.5:1 on paper. */
  muted: '#6E6D68',
  hairline: '#DAD9D4',
  hairlineSoft: '#E6E5E0',
  hover: '#F2F1ED',
  well: '#EDECE8',
  wellAlt: '#F4F3EF',
  /** THE accent. Seals, active nav, status dots, progress, selection, link hover. */
  vermilion: '#D63A22',
  vermilionOnDark: '#FF6B52',
  mutedOnDark: '#B5B4AE',
} as const

export const F = {
  display: "'Michroma', sans-serif",
  body: "'Zen Kaku Gothic New', sans-serif",
  mono: "'DM Mono', monospace",
  /**
   * Ma Shan Zheng lacks some Japanese forms (創 書 話 発 の); Yuji Boku fills
   * them per glyph. Keep the fallback — dropping it renders those as tofu.
   */
  brush: "'Ma Shan Zheng', 'Yuji Boku', serif",
} as const

/** Left/right page gutter, everywhere. */
export const GUTTER = 'clamp(20px, 4.4vw, 56px)'

export const EASE = 'cubic-bezier(.2,.7,.1,1)'

/** Striped placeholder for image wells (Behance CDN images can fail to load). */
export const STRIPES = `repeating-linear-gradient(135deg, ${C.well} 0 6px, ${C.wellAlt} 6px 12px)`

/** Each venture owns one hue, used only as a 2–3px hairline under its tile. */
export const accent = (hue: number) => `oklch(0.68 0.13 ${hue})`

/** Viewport at which multi-column section headers kick in. */
export const WIDE = '@media (min-width: 960px)'
