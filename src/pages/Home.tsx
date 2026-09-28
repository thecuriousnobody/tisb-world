import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { useYouTubeVideos } from '../hooks/useContent'
import type { ContentItem } from '../services/contentService'
import { featuredVentures, ventureCount } from '../data/ventures'
import { C, F, GUTTER } from '../design/tokens'
import { Corners, Kanji, Mono, Seal, SubHead } from '../design/primitives'
import VentureTile from '../design/VentureTile'
import { SLink } from '../design/transition'
import { pad2 } from '../design/pages'

/** Pull the 11-char video id from a watch link, or from our `youtube-<id>` item id. */
function youtubeId(item: ContentItem): string {
  const m = item.link?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|\/shorts\/)([\w-]{11})/)
  if (m) return m[1]
  const fromId = item.id.replace(/^youtube-/, '')
  return /^[\w-]{11}$/.test(fromId) ? fromId : ''
}

/** 26.09.26 */
function fmtDate(d: Date | string) {
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ''
  return `${pad2(x.getDate())}.${pad2(x.getMonth() + 1)}.${String(x.getFullYear()).slice(2)}`
}

const STATS = [
  { label: 'VENTURES', value: pad2(ventureCount), to: '/ventures' },
  { label: 'CONVERSATIONS', value: '40+', to: '/podcast' },
  { label: 'YEARS IN THE MACHINE', value: '18', to: '/about' },
]

const bodyCol = {
  display: 'flex', flexDirection: 'column', gap: '22px',
  fontSize: 18, lineHeight: 1.75, fontWeight: 300,
} as const

export default function Home() {
  const { videos } = useYouTubeVideos()
  const latest = videos.slice(0, 3)

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Seo
        title="TISB — The Idea Sandbox"
        description="Rajeev Kumar builds seven AI startups from Central Illinois — alongside original music, large-format art, and a podcast of forty-plus conversations. Where ideas become ventures."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          borderBottom: `1px solid ${C.hairline}`,
        }}
      >
        <Box
          sx={{
            p: `clamp(48px, 7vw, 88px) ${GUTTER}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '56px',
            borderRight: `1px solid ${C.hairline}`,
          }}
        >
          <Mono as="div">SYS / 000 — INDEX</Mono>
          <Box component="h1" sx={{ font: `400 clamp(38px, 4.6vw, 62px)/1.12 ${F.display}`, letterSpacing: '.02em' }}>
            THE IDEA<br />SANDBOX
          </Box>
          <Box component="p" sx={{ fontSize: 19, lineHeight: 1.7, maxWidth: 520, fontWeight: 300 }}>
            Music, art, technology and AI. Seven ventures, forty-plus conversations, and a stubbornly
            optimistic nobody building from the middle of the country.
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderTop: `1px solid ${C.hairline}` }}>
            {STATS.map((s, i) => (
              <Box
                key={s.label}
                component={SLink}
                to={s.to}
                sx={{
                  p: i === 0 ? '18px 0' : '18px 0 18px 20px',
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  borderLeft: i === 0 ? 0 : `1px solid ${C.hairline}`, minWidth: 0,
                }}
              >
                {/* At 390px each stat cell is ~117px; "CONVERSATIONS" at .16em
                    tracking is ~119px and hits the divider. Tighter on phones. */}
                <Mono sx={{ letterSpacing: { xs: '.08em', sm: '.16em' } }}>{s.label}</Mono>
                <Box component="span" sx={{ font: `400 clamp(22px, 6vw, 28px) ${F.display}` }}>{s.value}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* The viewport: crosshairs, 箱, figure caption, 庭 seal. */}
        <Box
          sx={{
            position: 'relative', minHeight: { xs: 420, sm: 520, md: 640 },
            display: 'grid', placeItems: 'center', overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: C.hairlineSoft }} />
          <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: C.hairlineSoft }} />
          <Corners which={['tl', 'tr', 'bl', 'br']} size={18} inset={28} />
          <Box sx={{ position: 'relative', lineHeight: 1 }}>
            <Kanji char="箱" size="clamp(220px, 30vw, 420px)" delay={0.2} />
          </Box>
          <Mono sx={{ position: 'absolute', left: { xs: 40, md: 56 }, bottom: { xs: 40, md: 52 } }}>
            FIG.01 — 箱 / HAKO — BOX
          </Mono>
          <Box sx={{ position: 'absolute', right: { xs: 40, md: 56 }, top: { xs: 40, md: 52 } }}>
            <Seal char="庭" size={40} glyph={28} />
          </Box>
        </Box>
      </Box>

      {/* ── [A] Origin ───────────────────────────────────────────────── */}
      <Box
        data-reveal
        sx={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '48px', p: `96px ${GUTTER}`, borderBottom: `1px solid ${C.hairline}`,
        }}
      >
        <Mono>[A] ORIGIN / 起源</Mono>
        <Box sx={bodyCol}>
          <p>
            I spent eighteen years as an engineer inside one of the world's biggest machines, quietly
            collecting a suspicion: that the most interesting ideas don't live in institutions — they
            live in people, waiting for someone curious enough to ask.
          </p>
          <p>So I left. Now I build things — AI products, podcasts, art, community — and I write about what I find.</p>
        </Box>
        <Box sx={bodyCol}>
          <p>
            The Idea Sandbox is where it all lands: forty-plus conversations with scientists, artists,
            and beautiful misfits; essays on technology, culture, and the games we choose to play; and a
            running experiment in what one stubbornly optimistic nobody can build when the tools finally
            catch up to the imagination.
          </p>
          <Box component="p" sx={{ mt: '12px', font: `400 17px/1.6 ${F.display}`, letterSpacing: '.02em' }}>
            DIG IN. GET YOUR HANDS DIRTY.<br />
            <Box component="span" sx={{ color: C.muted }}>THAT'S WHAT A SANDBOX IS FOR.</Box>
          </Box>
        </Box>
      </Box>

      {/* ── [B] Now building ─────────────────────────────────────────── */}
      <Box
        data-reveal
        sx={{
          p: `72px ${GUTTER} 88px`, display: 'flex', flexDirection: 'column', gap: '28px',
          borderBottom: `1px solid ${C.hairline}`,
        }}
      >
        <SubHead label="[B] NOW BUILDING / 構築中" action={<SLink to="/ventures">VIEW ALL {pad2(ventureCount)} →</SLink>} />
        <Box
          sx={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            borderTop: `1px solid ${C.hairline}`, borderLeft: `1px solid ${C.hairline}`,
          }}
        >
          {featuredVentures.map((v, i) => (
            <Box
              key={v.name}
              component={SLink}
              to="/ventures"
              className="s-card s-zoom"
              sx={{
                p: '28px', display: 'flex', flexDirection: 'column', gap: '28px', justifyContent: 'flex-start',
                borderRight: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}`, minHeight: 220,
                '&:hover': { color: C.ink },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Mono>V.{pad2(i + 1)}</Mono>
                <Mono sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box component="span" sx={{ width: 6, height: 6, background: C.vermilion }} />
                  {v.status}
                </Mono>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Box sx={{ mb: '12px' }}>
                  <VentureTile v={v} ratio="16/9" kanjiSize={84} overlay seal={6} />
                </Box>
                <Box component="span" sx={{ font: `400 20px ${F.display}`, letterSpacing: '.02em', textTransform: 'uppercase' }}>
                  {v.name}
                </Box>
                <Box component="span" sx={{ fontSize: 15, lineHeight: 1.55, color: C.inkSoft, fontWeight: 300 }}>
                  {v.tagline}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── [C] Latest conversations ─────────────────────────────────── */}
      <Box data-reveal sx={{ p: `72px ${GUTTER} 96px`, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <SubHead label="[C] LATEST CONVERSATIONS / 対話" action={<SLink to="/podcast">ALL EPISODES →</SLink>} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '32px' }}>
          {latest.length === 0
            ? [0, 1, 2].map((i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Box sx={{ aspectRatio: '16/9', background: C.well }} />
                  <Mono>E.— — LOADING</Mono>
                </Box>
              ))
            : latest.map((e, i) => {
                const id = youtubeId(e)
                return (
                  <Box
                    key={e.id}
                    component="a"
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s-gray"
                    sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: C.well }}>
                      <img
                        src={id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : e.thumbnail}
                        alt={e.title}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </Box>
                    <Mono>E.{pad2(videos.length - i)} — {fmtDate(e.publishedAt)}</Mono>
                    <Box component="span" sx={{ fontSize: 17, lineHeight: 1.45, fontWeight: 500, textWrap: 'pretty' }}>
                      {e.title}
                    </Box>
                  </Box>
                )
              })}
        </Box>
      </Box>
    </Box>
  )
}
