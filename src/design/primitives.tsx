import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { C, F, GUTTER, WIDE } from './tokens'

/* ── Type ─────────────────────────────────────────────────────────────── */

/** DM Mono 10px / .16em uppercase — nav, labels, metadata, buttons. */
export function Mono({
  children, color = C.muted, size = 10, spacing = '.16em', sx, as = 'span',
}: { children: ReactNode; color?: string; size?: number; spacing?: string; sx?: SxProps<Theme>; as?: 'span' | 'div' }) {
  return (
    <Box component={as} sx={{ font: `400 ${size}px/1.5 ${F.mono}`, letterSpacing: spacing, textTransform: 'uppercase', color, ...sx }}>
      {children}
    </Box>
  )
}

/* ── Brush marks ──────────────────────────────────────────────────────── */

/**
 * A brush kanji that inks in on mount. Pages remount per route (Layout keys
 * them by pathname), so the ink replays on every visit — that's the intent.
 */
export function Kanji({
  char, size, delay = 0.4, duration = 2.2, color, style,
}: { char: string; size: string | number; delay?: number; duration?: number; color?: string; style?: CSSProperties }) {
  return (
    <span
      className="s-ink"
      aria-hidden="true"
      style={{
        fontSize: size, lineHeight: 1, color,
        animationDelay: `${delay}s`, animationDuration: `${duration}s`,
        ...style,
      }}
    >
      {char}
    </span>
  )
}

/** Vermilion square with a white brush kanji centred. */
export function Seal({ char, size = 24, glyph }: { char: string; size?: number; glyph?: number }) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        width: size, height: size, flex: 'none', background: C.vermilion, color: C.paper,
        display: 'grid', placeItems: 'center', font: `${glyph ?? Math.round(size * 0.72)}px/1 ${F.brush}`,
      }}
    >
      {char}
    </Box>
  )
}

/* ── Hairline furniture ───────────────────────────────────────────────── */

type Corner = 'tl' | 'tr' | 'bl' | 'br'

/** L-shaped crosshair corners. inset -1 sits them on a framed box's border. */
export function Corners({
  which = ['tl', 'br'], size = 14, inset = 20, color = C.ink,
}: { which?: Corner[]; size?: number; inset?: number; color?: string }) {
  const line = `1px solid ${color}`
  return (
    <>
      {which.map((c) => (
        <Box
          key={c}
          aria-hidden="true"
          sx={{
            position: 'absolute', width: size, height: size, pointerEvents: 'none',
            ...(c[0] === 't' ? { top: inset, borderTop: line } : { bottom: inset, borderBottom: line }),
            ...(c[1] === 'l' ? { left: inset, borderLeft: line } : { right: inset, borderRight: line }),
          }}
        />
      ))}
    </>
  )
}

/* ── Section header: label / H1 / lead + kanji cell ───────────────────── */

export function SectionHeader({
  label, title, lead, kanji, caption,
  titleSize = 'clamp(44px, 5.6vw, 72px)', titleLine = 1, leadSize = 19, leadMax = 600,
}: {
  label: string; title: string; lead: ReactNode; kanji: string; caption: string
  titleSize?: string; titleLine?: number; leadSize?: number; leadMax?: number
}) {
  return (
    <Box
      sx={{
        display: 'grid', gridTemplateColumns: '1fr', borderBottom: `1px solid ${C.hairline}`,
        // Desktop is 2fr/1fr — what the prototype's auto-fit + span 2 resolves to.
        // Written explicitly because `span 2` in an auto-fit grid spawns a
        // phantom column (and a horizontal scroll) on phones.
        [WIDE]: { gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' },
      }}
    >
      <Box sx={{ p: `clamp(40px, 5vw, 64px) ${GUTTER}`, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Mono as="div">{label}</Mono>
        <Box component="h1" sx={{ font: `400 ${titleSize}/${titleLine} ${F.display}`, letterSpacing: '.02em', overflowWrap: 'anywhere' }}>
          {title}
        </Box>
        <Box component="p" sx={{ fontSize: leadSize, lineHeight: 1.7, fontWeight: 300, maxWidth: leadMax }}>
          {lead}
        </Box>
      </Box>
      <KanjiCell char={kanji} caption={caption} />
    </Box>
  )
}

export function KanjiCell({ char, caption, size = 240, minHeight = 320 }: { char: string; caption: string; size?: number; minHeight?: number }) {
  return (
    <Box
      sx={{
        position: 'relative', display: 'grid', placeItems: 'center',
        minHeight: { xs: Math.round(minHeight * 0.8), md: minHeight },
        borderTop: `1px solid ${C.hairline}`,
        [WIDE]: { borderTop: 0, borderLeft: `1px solid ${C.hairline}` },
      }}
    >
      <Corners />
      <Kanji char={char} size={`clamp(${Math.round(size * 0.7)}px, 18vw, ${size}px)`} />
      <Mono sx={{ position: 'absolute', left: 24, bottom: 22 }}>{caption}</Mono>
    </Box>
  )
}

/** Closing `[ QUOTE ]` line used at the foot of Podcast and Music. */
export function QuoteBand({ children }: { children: ReactNode }) {
  return (
    <Box
      data-reveal
      sx={{
        p: `48px ${GUTTER} 96px`, borderTop: `1px solid ${C.hairline}`,
        display: 'flex', flexWrap: 'wrap', gap: '12px 24px', alignItems: 'baseline',
      }}
    >
      <Mono color={C.vermilion}>[ QUOTE ]</Mono>
      <Box component="span" sx={{ fontSize: { xs: 20, md: 24 }, lineHeight: 1.45 }}>{children}</Box>
    </Box>
  )
}

/** Sub-section heading row: `[B] NOW BUILDING / 構築中 ........ VIEW ALL →` */
export function SubHead({ label, action }: { label: string; action?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      <Mono>{label}</Mono>
      {action && <Mono color={C.ink}>{action}</Mono>}
    </Box>
  )
}

/* ── Images ───────────────────────────────────────────────────────────── */

/**
 * An image in a well that degrades gracefully: if the source fails (Behance's
 * CDN does, regularly) the <img> hides and the striped placeholder + label
 * underneath show through instead of a broken-image icon.
 */
export function Well({
  src, alt, ratio, fallback, imgStyle, sx, eager,
}: { src?: string; alt: string; ratio?: string; fallback?: string; imgStyle?: CSSProperties; sx?: SxProps<Theme>; eager?: boolean }) {
  const [failed, setFailed] = useState(!src)
  useEffect(() => setFailed(!src), [src])
  return (
    <Box
      sx={{
        position: 'relative', overflow: 'hidden', aspectRatio: ratio,
        background: fallback ? `repeating-linear-gradient(135deg, ${C.well} 0 6px, ${C.wellAlt} 6px 12px)` : C.well,
        ...sx,
      }}
    >
      {fallback && (
        <Mono sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', p: 2 }}>
          {fallback}
        </Mono>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }}
        />
      )}
    </Box>
  )
}

/* ── Scroll progress (post page) ──────────────────────────────────────── */

export function useScrollProgress(enabled = true) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = document.documentElement
        setP(Math.min(1, Math.max(0, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled])
  return p
}
