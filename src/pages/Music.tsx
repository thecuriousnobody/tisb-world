import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { C, F, GUTTER, WIDE } from '../design/tokens'
import { Corners, Mono, QuoteBand, SectionHeader } from '../design/primitives'

const PLAYLIST = '0ytxEDNvWdplOBDg3SQyDd'

export default function Music() {
  return (
    <section>
      <Seo
        title="Music"
        description="Original music from The Idea Sandbox — sonic landscapes where technology meets human expression, from ambient drones to complex polyrhythms."
        path="/music"
      />
      <SectionHeader
        label="SYS / 003 — ORIGINAL TRACKS / 音楽"
        title="MUSIC"
        lead="My musical work explores the intersection of technology and human expression, creating sonic landscapes that bridge the digital and organic worlds. Each track is an experiment in sound design, rhythm, and atmospheric textures - from ambient drones to complex polyrhythms."
        kanji="音"
        caption="音 / OTO — SOUND"
      />

      <Box
        sx={{
          display: 'grid', gridTemplateColumns: '1fr', gap: '48px', p: `72px ${GUTTER} 96px`,
          // 1 : 2 on wide screens — the prototype's auto-fit + span 2, made explicit.
          [WIDE]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Mono>[A] PLAYLIST / 再生</Mono>
          <Box component="span" sx={{ font: `400 22px/1.4 ${F.display}`, letterSpacing: '.02em' }}>MY ORIGINAL TRACKS</Box>
          <Box component="span" sx={{ fontSize: 15, lineHeight: 1.6, color: C.inkSoft, fontWeight: 300 }}>
            Click any track to listen. Each song is a unique exploration.
          </Box>
          <Mono color={C.ink} sx={{ pt: '12px' }}>
            <a href={`https://open.spotify.com/playlist/${PLAYLIST}`} target="_blank" rel="noopener noreferrer">
              OPEN IN SPOTIFY →
            </a>
          </Mono>
        </Box>

        <Box data-reveal sx={{ position: 'relative', p: { xs: '12px', sm: '20px' }, border: `1px solid ${C.hairline}` }}>
          <Corners inset={-1} />
          <iframe
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator&theme=0`}
            title="Original Music Playlist"
            width="100%"
            height="480"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ border: 0, display: 'block', borderRadius: 12 }}
          />
        </Box>
      </Box>

      <QuoteBand>"Where technology meets melody, new forms of expression emerge."</QuoteBand>
    </section>
  )
}
