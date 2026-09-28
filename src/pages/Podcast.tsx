import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { useYouTubeVideos } from '../hooks/useContent'
import type { ContentItem } from '../services/contentService'
import { C, F, GUTTER } from '../design/tokens'
import { Mono, QuoteBand, SectionHeader, Well } from '../design/primitives'
import { pad2 } from '../design/pages'

/** Episodes shown per page of the grid (multiple of 2, 3 and 4 columns). */
const PAGE = 12

interface Episode {
  key: string
  idx: string
  title: string
  date: string
  link: string
  thumb: string
}

const videoId = (link: string) =>
  link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|\/shorts\/)([^&\n?#/]+)/)?.[1]

/** DD.MM.YY — the prototype's metadata date format. */
const fmtDate = (d: Date) =>
  Number.isNaN(d.getTime())
    ? '—'
    : `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`

function toEpisodes(items: ContentItem[]): Episode[] {
  const sorted = [...items].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  return sorted.map((v, i) => {
    const id = videoId(v.link)
    return {
      key: v.id,
      // Counts down: the newest episode carries the highest number.
      idx: pad2(sorted.length - i),
      title: v.title,
      date: fmtDate(new Date(v.publishedAt)),
      link: v.link,
      // hqdefault always exists; maxresdefault is missing for many clips.
      thumb: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : v.thumbnail ?? '',
    }
  })
}

function PlaySquare() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute', left: 24, bottom: 24, width: 56, height: 56,
        background: C.vermilion, display: 'grid', placeItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 0, height: 0, ml: '4px',
          borderLeft: `16px solid ${C.paper}`,
          borderTop: '10px solid transparent', borderBottom: '10px solid transparent',
        }}
      />
    </Box>
  )
}

function Featured({ e }: { e: Episode }) {
  return (
    <Box
      component="a"
      href={e.link}
      target="_blank"
      rel="noopener noreferrer"
      className="s-zoom"
      sx={{
        display: 'grid', borderBottom: `1px solid ${C.hairline}`, gridTemplateColumns: '1fr',
        '@media (min-width: 900px)': { gridTemplateColumns: '1fr 1fr' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: C.ink }}>
        <img
          src={e.thumb}
          alt={e.title}
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <PlaySquare />
      </Box>
      <Box
        sx={{
          p: 'clamp(28px, 4vw, 56px)', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', gap: '32px',
          '@media (min-width: 900px)': { borderLeft: `1px solid ${C.hairline}` },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <Mono>LATEST — E.{e.idx}</Mono>
          <Mono>{e.date}</Mono>
        </Box>
        <Box
          component="span"
          sx={{ font: `400 clamp(20px, 2.2vw, 28px)/1.35 ${F.display}`, textWrap: 'balance', overflowWrap: 'anywhere' }}
        >
          {e.title}
        </Box>
        <Mono color={C.ink}>WATCH ON YOUTUBE →</Mono>
      </Box>
    </Box>
  )
}

function EpisodeCard({ e }: { e: Episode }) {
  return (
    <Box
      component="a"
      data-reveal
      href={e.link}
      target="_blank"
      rel="noopener noreferrer"
      className="s-gray"
      sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <Well src={e.thumb} alt={e.title} ratio="16/9" />
      <Mono>E.{e.idx} — {e.date}</Mono>
      <Box component="span" sx={{ fontSize: 17, lineHeight: 1.45, fontWeight: 500, textWrap: 'pretty' }}>
        {e.title}
      </Box>
    </Box>
  )
}

export default function Podcast() {
  const { videos, loading, error } = useYouTubeVideos()
  const episodes = useMemo(() => toEpisodes(videos ?? []), [videos])
  const [latest, ...rest] = episodes
  const [count, setCount] = useState(PAGE)
  const shown = rest.slice(0, count)
  const hasMore = rest.length > count
  const loadMore = () => setCount((c) => c + PAGE)

  return (
    <section>
      <Seo
        title="Podcast"
        description="The Idea Sandbox podcast — conversations with scientists, artists, and builders about technology, creativity, and the future of making things."
        path="/podcast"
      />
      <SectionHeader
        label="SYS / 002 — THE IDEA SANDBOX — CONVERSATIONS / 対話"
        title="PODCAST"
        lead="Conversations about technology, creativity, and the future of making things. Each episode explores ideas at the intersection of innovation and human potential, featuring insights on automation, digital creativity, and the evolving landscape of work and life."
        kanji="話"
        caption="話 / HANASHI — CONVERSATION"
      />

      {loading && episodes.length === 0 && (
        <Box sx={{ p: `64px ${GUTTER} 96px` }}>
          <Mono as="div">LOADING CONVERSATIONS …</Mono>
        </Box>
      )}

      {!loading && episodes.length === 0 && (
        <Box sx={{ p: `64px ${GUTTER} 96px`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Mono as="div" color={C.vermilion}>
            {error ? '[ ERROR ] EPISODES DIDN’T LOAD' : '[ EMPTY ] NO EPISODES YET'}
          </Mono>
          <Mono as="div" color={C.ink}>
            <a href="https://www.youtube.com/@theideasandbox" target="_blank" rel="noopener noreferrer">
              WATCH ON YOUTUBE →
            </a>
          </Mono>
        </Box>
      )}

      {latest && <Featured e={latest} />}

      {shown.length > 0 && (
        <Box
          sx={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '48px 32px', p: `64px ${GUTTER} ${hasMore ? '48px' : '96px'}`,
          }}
        >
          {shown.map((e) => <EpisodeCard key={e.key} e={e} />)}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ p: `0 ${GUTTER} 96px`, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="button"
            type="button"
            onClick={loadMore}
            className="s-btn-line"
            sx={{
              background: 'transparent', cursor: 'pointer', p: '14px 20px', color: C.ink,
              font: `400 10px ${F.mono}`, letterSpacing: '.16em',
              '&:hover': { color: C.vermilion },
            }}
          >
            LOAD MORE EPISODES
          </Box>
        </Box>
      )}

      <QuoteBand>"The future belongs to those who can imagine it and build it."</QuoteBand>
    </section>
  )
}
