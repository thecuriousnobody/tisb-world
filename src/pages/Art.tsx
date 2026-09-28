import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { useBehanceProjects } from '../hooks/useContent'
import cadence from '../assets/cadence-01.webp'
import { C, F, GUTTER, WIDE } from '../design/tokens'
import { Kanji, Mono, Well } from '../design/primitives'
import { SLink } from '../design/transition'
import { pad2 } from '../design/pages'

/*
 * Cadence 01 spans two rows beside the Behance plates. 10 plates first, then
 * 6 per "load more": 4 sit beside Cadence in a 3-column grid and the rest fill
 * whole rows of 3 (and of 2 at medium widths), so the grid never ends ragged.
 */
const FIRST = 10
const MORE = 6

/** Width at which the auto-fit grid has ≥2 columns, so a 2-row span makes sense. */
const TWO_COL = '@media (min-width: 760px)'

function PrintsBanner() {
  return (
    <SLink to="/prints" className="s-on-dark" style={{ display: 'block', background: C.ink, color: C.paper }}>
      <Box
        sx={{
          display: 'flex', flexWrap: 'wrap', gap: '16px 32px', justifyContent: 'space-between',
          alignItems: 'center', p: `24px ${GUTTER}`,
        }}
      >
        <Mono color={C.vermilionOnDark}>FOR DESIGNERS &amp; SPECIFIERS</Mono>
        <Box component="span" sx={{ fontSize: 18, color: C.paper }}>
          Available in large format on brushed aluminum.
        </Box>
        <Mono color={C.paper}>SEE INSTALLATIONS →</Mono>
      </Box>
    </SLink>
  )
}

export default function Art() {
  const { projects, loading } = useBehanceProjects()
  const [count, setCount] = useState(FIRST)

  const plates = useMemo(
    () => [...(projects ?? [])].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)),
    [projects],
  )
  const shown = plates.slice(0, count)
  const hasMore = plates.length > count

  return (
    <section>
      <Seo
        title="Art"
        description="Original digital art and paintings by Rajeev Kumar — visual explorations at the intersection of technology, consciousness, and creativity. Large-format prints available."
        path="/art"
      />

      {/* ── Header: oversized 芸 beside the title ─────────────────────── */}
      <Box
        sx={{
          display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'end',
          p: `48px ${GUTTER} 80px`, borderBottom: `1px solid ${C.hairline}`,
          [WIDE]: { gridTemplateColumns: '1fr 1fr' },
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', pb: { xs: '28px', md: 0 } }}>
          <Kanji char="芸" size="clamp(220px, 36vw, 500px)" style={{ lineHeight: 0.92 }} />
          <Mono sx={{ position: 'absolute', left: 0, bottom: 0 }}>FIG.04 — 芸 / GEI — ART, CRAFT</Mono>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', pb: '24px' }}>
          <Mono as="div">SYS / 004 — ARCHIVE / 芸術</Mono>
          <Box component="h1" sx={{ font: `400 clamp(56px, 7vw, 96px)/1 ${F.display}`, letterSpacing: '.02em' }}>ART</Box>
          <Box component="p" sx={{ fontSize: 19, lineHeight: 1.7, maxWidth: 560, fontWeight: 300 }}>
            Visual explorations at the intersection of technology, consciousness, and creativity. Each piece
            investigates the digital sublime, seeking to capture moments of transcendence within algorithmic
            processes and computational aesthetics.
          </Box>
        </Box>
      </Box>

      <PrintsBanner />

      {/* ── Plates ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '32px', p: `72px ${GUTTER} 48px`,
        }}
      >
        <Box
          data-reveal
          sx={{ display: 'flex', flexDirection: 'column', gap: '12px', [TWO_COL]: { gridRow: 'span 2' } }}
        >
          <Box
            component="img"
            src={cadence}
            alt="Cadence 01 — original painting by Rajeev Kumar"
            decoding="async"
            sx={{
              width: '100%', flex: 1, display: 'block', objectFit: 'cover',
              minHeight: { xs: 420, sm: 560 }, maxHeight: 820,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <Mono>P.00 — CADENCE 01</Mono>
            <Mono>ORIGINAL PAINTING — R. KUMAR</Mono>
          </Box>
        </Box>

        {shown.map((b, i) => (
          <Box
            key={b.id}
            component="a"
            data-reveal
            href={b.link}
            target="_blank"
            rel="noopener noreferrer"
            className="s-zoom"
            sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <Well
              src={b.thumbnail}
              alt={b.title}
              ratio="5/4"
              fallback={`BEHANCE — ${b.title.toUpperCase()}`}
              imgStyle={{ transition: 'transform 1s cubic-bezier(.2,.7,.1,1)' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <Mono>P.{pad2(i + 1)}</Mono>
              <Mono color={C.ink} sx={{ textAlign: 'right' }}>{b.title}</Mono>
            </Box>
          </Box>
        ))}

        {loading && plates.length === 0 && (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
            <Mono>LOADING THE ARCHIVE …</Mono>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: `24px ${GUTTER} 96px`, display: 'flex', flexWrap: 'wrap', gap: '12px',
          justifyContent: 'flex-end', alignItems: 'center',
        }}
      >
        {hasMore && (
          <Box
            component="button"
            type="button"
            onClick={() => setCount((c) => c + MORE)}
            sx={{
              background: 'transparent', border: `1px solid ${C.hairline}`, cursor: 'pointer',
              p: '14px 20px', font: `400 10px ${F.mono}`, letterSpacing: '.16em', color: C.ink,
              transition: 'border-color .3s, color .3s',
              '&:hover': { borderColor: C.ink, color: C.vermilion },
            }}
          >
            LOAD MORE — {plates.length - count} LEFT
          </Box>
        )}
        <Box
          component="a"
          href="https://www.behance.net/theideasandbox"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ font: `400 10px ${F.mono}`, letterSpacing: '.16em', p: '14px 20px', border: `1px solid ${C.ink}` }}
        >
          FULL ARCHIVE ON BEHANCE →
        </Box>
      </Box>
    </section>
  )
}
