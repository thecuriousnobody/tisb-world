import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import Seo from '../components/Seo'
import { sortedVentures, ventureCount, ventureDomain } from '../data/ventures'
import type { Venture } from '../data/ventures'
import { C, F, GUTTER } from '../design/tokens'
import { Mono, SectionHeader } from '../design/primitives'
import VentureTile from '../design/VentureTile'
import { pad2 } from '../design/pages'

/** The five-column table from the prototype needs ~760px; below that rows stack. */
const TABLE = '@media (min-width: 760px)'
const COLS = '64px 140px minmax(0, 1fr) minmax(0, 1.4fr) 110px'

function Status({ status }: { status: Venture['status'] }) {
  return (
    <Mono color={C.ink} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box
        component="span"
        sx={{
          width: 6, height: 6, flex: 'none', border: `1px solid ${C.vermilion}`,
          background: status === 'shipped' ? C.vermilion : 'transparent',
        }}
      />
      {status}
    </Mono>
  )
}

function Row({ v, i }: { v: Venture; i: number }) {
  const linked = Boolean(v.url)
  const cells: ReactNode = (
    <>
      <Mono size={11} spacing="0" sx={{ gridArea: 'no' }}>V.{pad2(i + 1)}</Mono>
      <Box sx={{ gridArea: 'fig' }}>
        <VentureTile v={v} ratio="16/10" kanjiSize={62} seal={5} />
      </Box>
      <Box
        component="span"
        sx={{
          gridArea: 'name', font: `400 clamp(15px, 1.5vw, 19px) ${F.display}`, textTransform: 'uppercase',
          letterSpacing: '.02em', minWidth: 0, overflowWrap: 'anywhere',
        }}
      >
        {v.name}
      </Box>
      <Box component="span" sx={{ gridArea: 'fn', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        <Box component="span" sx={{ fontSize: 16, lineHeight: 1.5, fontWeight: 300, color: C.ink }}>{v.tagline}</Box>
        <Mono spacing=".12em">{ventureDomain(v)}</Mono>
      </Box>
      <Box sx={{ gridArea: 'st' }}><Status status={v.status} /></Box>
    </>
  )

  const sx = {
    display: 'grid', alignItems: 'center', py: '20px', borderBottom: `1px solid ${C.hairline}`,
    // Phones: tile left, text right, status under the name.
    gridTemplateColumns: '112px minmax(0, 1fr)',
    gridTemplateAreas: '"fig no" "fig name" "fig st" "fn fn"',
    gap: '8px 18px',
    [TABLE]: {
      gridTemplateColumns: COLS, gridTemplateAreas: '"no fig name fn st"', gap: '24px',
    },
  } as const

  return linked ? (
    <Box
      component="a"
      data-reveal
      href={v.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${v.name} — ${v.tagline} (opens ${ventureDomain(v).toLowerCase()})`}
      className="s-row"
      sx={{ ...sx, '&:hover': { color: C.ink } }}
    >
      {cells}
    </Box>
  ) : (
    // Golden Hour has no public URL yet: same row, no link, no hover indent.
    <Box data-reveal sx={sx}>{cells}</Box>
  )
}

export default function Ventures() {
  return (
    <Box component="section">
      <Seo
        title="Ventures"
        description="Seven AI startups, one builder: Stack Day, DeSilo, swych-box, podcastbots, Autonomy Labs, Golden Hour, and Neuronify. Each one removes a barrier between you and what you want to build."
        path="/ventures"
      />
      <SectionHeader
        label="SYS / 001 — VENTURES / 事業"
        title="VENTURES"
        lead={`${ventureCount} companies. One builder. Every one of them removes a barrier between you and what you want to build.`}
        leadMax={560}
        kanji="創"
        caption="創 / SŌ — TO CREATE"
      />

      <Box sx={{ p: `0 ${GUTTER} 96px` }}>
        <Box
          aria-hidden="true"
          sx={{
            display: 'none', py: '16px', borderBottom: `1px solid ${C.ink}`,
            [TABLE]: { display: 'grid', gridTemplateColumns: COLS, gap: '24px' },
          }}
        >
          {['NO.', 'FIG.', 'NAME', 'FUNCTION', 'STATUS'].map((h) => <Mono key={h}>{h}</Mono>)}
        </Box>
        <Box sx={{ borderTop: `1px solid ${C.ink}`, [TABLE]: { borderTop: 0 } }}>
          {sortedVentures.map((v, i) => <Row key={v.name} v={v} i={i} />)}
        </Box>
      </Box>
    </Box>
  )
}
