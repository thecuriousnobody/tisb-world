import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import Seo from '../components/Seo'
import { useSubstackPosts } from '../hooks/useContent'
import type { ContentItem } from '../services/contentService'
import { C, F, GUTTER } from '../design/tokens'
import { Kanji, Mono, Seal, useScrollProgress } from '../design/primitives'
import { SLink, useGo } from '../design/transition'
import { SUBSTACK, entryNo, fmtDate, fmtRead } from '../utils/writing'
import { prepareEssay } from '../utils/essayHtml'

/** Three columns (meta | essay | contents) from here up; one column below. */
const DESK = '@media (min-width: 1024px)'
/** Sticky header (64px) plus breathing room, for anchor jumps and scrollspy. */
const ANCHOR_OFFSET = 96

export default function Post() {
  const { slug = '' } = useParams()
  const { posts, loading } = useSubstackPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  const post = index >= 0 ? posts[index] : undefined

  if (!post) {
    return loading ? <Pending /> : <NotFound slug={slug} />
  }
  return <Essay post={post} index={index} posts={posts} />
}

function Essay({ post, index, posts }: { post: ContentItem; index: number; posts: ContentItem[] }) {
  const go = useGo()
  const progress = useScrollProgress()
  const no = entryNo(index, posts.length)
  const date = fmtDate(post.publishedAt)
  const read = fmtRead(post)

  const essay = useMemo(
    () =>
      prepareEssay(post.contentHtml || '', {
        postUrl: post.link,
        substackOrigin: SUBSTACK,
        knownSlugs: new Set(posts.map((p) => p.slug).filter((s): s is string => !!s)),
      }),
    [post, posts],
  )

  const active = useActiveHeading(essay.headings.map((h) => h.id))
  const showContents = essay.headings.length >= 2

  // Links in the body that point at other hosted essays go through the veil.
  const onBodyClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element).closest('a[data-internal]')
    if (!a) return
    e.preventDefault()
    go(a.getAttribute('href') || '/blog')
  }

  const jumpTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const newer = posts[index - 1]
  const older = posts[index + 1]
  const description = (post.subtitle || post.description || '').replace(/\s+/g, ' ').slice(0, 180)

  return (
    <Box
      component="section"
      sx={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)',
        [DESK]: { gridTemplateColumns: 'minmax(0, 240px) minmax(0, 1fr) minmax(0, 240px)' },
      }}
    >
      <Seo
        title={post.title}
        description={description}
        path={`/blog/${post.slug}`}
        canonical={post.link}
        image={post.thumbnail || undefined}
      />

      {/* ── Left: mark + meta ─────────────────────────────────────────── */}
      <Box
        component="aside"
        sx={{ display: 'none', [DESK]: { display: 'block' }, p: `64px 32px 64px ${GUTTER}`, borderRight: `1px solid ${C.hairline}` }}
      >
        <Box sx={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Kanji char="書" size={150} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Mono>ENTRY — {no.slice(2)}</Mono>
            <Mono>{date}</Mono>
            <Mono>READ — {read}</Mono>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Mono color={C.ink}><a href={post.link} target="_blank" rel="noopener noreferrer">READ ON SUBSTACK ↗</a></Mono>
            <Mono color={C.ink}><SLink to="/blog">← ALL WRITING</SLink></Mono>
          </Box>
        </Box>
      </Box>

      {/* ── Centre: the essay ─────────────────────────────────────────── */}
      <Box
        component="article"
        sx={{
          minWidth: 0, display: 'flex', flexDirection: 'column', gap: '28px',
          p: `40px ${GUTTER} 96px`,
          [DESK]: { p: '64px clamp(24px, 5vw, 72px) 120px', maxWidth: 760 },
        }}
      >
        {/* Phone/tablet meta row — replaces the collapsed asides. */}
        <Box
          sx={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px 24px',
            pb: '20px', borderBottom: `1px solid ${C.hairline}`, [DESK]: { display: 'none' },
          }}
        >
          <Mono color={C.ink}><SLink to="/blog">← ALL WRITING</SLink></Mono>
          <Mono>{no} — {date} — {read}</Mono>
        </Box>

        <Mono as="div">THE CURIOUS NOBODY / 無名の好奇心</Mono>
        <Box
          component="h1"
          sx={{
            font: `400 clamp(24px, 3vw, 40px)/1.3 ${F.display}`, letterSpacing: '.02em',
            textTransform: 'uppercase', textWrap: 'balance', overflowWrap: 'anywhere',
          }}
        >
          {post.title}
        </Box>
        {post.subtitle && (
          <Box component="p" sx={{ fontSize: { xs: 19, md: 21 }, lineHeight: 1.6, fontWeight: 300, color: C.inkSoft }}>
            {post.subtitle}
          </Box>
        )}

        <Box
          onClick={onBodyClick}
          sx={bodySx}
          // Sanitized by DOMPurify in prepareEssay() — see utils/essayHtml.ts.
          dangerouslySetInnerHTML={{ __html: essay.html }}
        />

        {/* Author strip */}
        <Box
          data-reveal
          sx={{
            display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center',
            mt: '48px', py: '28px', borderTop: `1px solid ${C.ink}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Seal char="想" size={40} glyph={28} />
            <Box component="span" sx={{ fontSize: 17 }}>Rajeev Kumar — get the next essay in your inbox.</Box>
          </Box>
          <Box
            component="a"
            href={SUBSTACK}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn-ink"
            sx={{ font: `400 10px ${F.mono}`, letterSpacing: '.16em', p: '14px 20px' }}
          >
            SUBSCRIBE ON SUBSTACK →
          </Box>
        </Box>

        {/* Newer / older — keeps a reader reading instead of bouncing to the list. */}
        {(newer || older) && (
          <Box
            component="nav"
            aria-label="More essays"
            sx={{
              display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              borderTop: `1px solid ${C.hairline}`, borderLeft: `1px solid ${C.hairline}`,
            }}
          >
            <Neighbour post={newer} dir="← NEWER" />
            <Neighbour post={older} dir="OLDER →" alignEnd />
          </Box>
        )}
      </Box>

      {/* ── Right: contents + progress ─────────────────────────────────── */}
      <Box
        component="aside"
        sx={{ display: 'none', [DESK]: { display: 'block' }, p: `64px ${GUTTER} 64px 32px`, borderLeft: `1px solid ${C.hairline}` }}
      >
        <Box
          sx={{
            position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: '18px',
            maxHeight: 'calc(100vh - 160px)', overflowY: 'auto',
          }}
        >
          {showContents && (
            <>
              <Mono>CONTENTS</Mono>
              {essay.headings.map((h, i) => (
                <Box
                  key={h.id}
                  component="a"
                  href={`#${h.id}`}
                  onClick={jumpTo(h.id)}
                  sx={{
                    font: `400 10px/1.6 ${F.mono}`, letterSpacing: '.16em', textTransform: 'uppercase',
                    color: active === h.id ? C.vermilion : C.ink,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} — {h.text}
                </Box>
              ))}
            </>
          )}
          <Mono sx={{ pt: showContents ? '24px' : 0 }}>
            PROGRESS — {String(Math.round(progress * 100)).padStart(3, '0')}%
          </Mono>
        </Box>
      </Box>
    </Box>
  )
}

function Neighbour({ post, dir, alignEnd }: { post?: ContentItem; dir: string; alignEnd?: boolean }) {
  const cell: SxProps<Theme> = {
    display: 'flex', flexDirection: 'column', gap: '10px', p: '24px',
    borderRight: `1px solid ${C.hairline}`, borderBottom: `1px solid ${C.hairline}`,
    textAlign: { xs: 'left', sm: alignEnd ? 'right' : 'left' },
  }
  if (!post?.slug) return <Box sx={cell} aria-hidden="true" />
  return (
    <Box component={SLink} to={`/blog/${post.slug}`} className="s-card" sx={cell}>
      <Mono>{dir}</Mono>
      <Box component="span" sx={{ fontSize: 17, lineHeight: 1.45, fontWeight: 500 }}>{post.title}</Box>
    </Box>
  )
}

/** Scrollspy: the last h2 whose top has passed under the sticky header. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const key = ids.join('|')
  useEffect(() => {
    if (!ids.length) return
    let raf = 0
    const update = () => {
      raf = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= ANCHOR_OFFSET + 24) current = id
      }
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

function Pending() {
  return (
    <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', p: GUTTER }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <Kanji char="書" size={120} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Box className="s-pulse" sx={{ width: 6, height: 6, background: C.vermilion }} />
          <Mono>LOADING ESSAY…</Mono>
        </Box>
      </Box>
    </Box>
  )
}

function NotFound({ slug }: { slug: string }) {
  return (
    <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', p: GUTTER }}>
      <Seo title="Essay not found" description="This essay isn't hosted here. Browse the rest of The Curious Nobody." path={`/blog/${slug}`} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
        <Kanji char="書" size={120} />
        <Mono color={C.vermilion}>[ 404 ] NO ESSAY AT THIS ADDRESS</Mono>
        <Box component="p" sx={{ fontSize: 17, fontWeight: 300, color: C.inkSoft, maxWidth: 440 }}>
          It may be older than the feed this site mirrors. The full archive lives on Substack.
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Box component={SLink} to="/blog" className="s-btn-ink" sx={{ font: `400 10px ${F.mono}`, letterSpacing: '.16em', p: '14px 20px' }}>
            ← ALL WRITING
          </Box>
          <Box
            component="a"
            href={`${SUBSTACK}/p/${encodeURIComponent(slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn-line"
            sx={{ font: `400 10px ${F.mono}`, letterSpacing: '.16em', p: '14px 20px' }}
          >
            TRY IT ON SUBSTACK ↗
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/* ── Essay body typography ──────────────────────────────────────────────── */

const corner = { content: '""', position: 'absolute', width: '14px', height: '14px' }

const bodySx: SxProps<Theme> = {
  fontSize: { xs: 17, md: 19 }, lineHeight: 1.85, fontWeight: 300, color: C.ink, minWidth: 0,
  overflowWrap: 'break-word',

  '& > * + *': { marginTop: '26px' },
  // No margin here: `& p` outranks `& > * + *` above, and setting margin: 0
  // on it silently erased every paragraph gap in the essay.
  '& p': { textWrap: 'pretty' },
  '& strong, & b': { fontWeight: 500 },
  '& [id]': { scrollMarginTop: `${ANCHOR_OFFSET}px` },

  '& h2': {
    font: `400 clamp(17px, 1.8vw, 21px)/1.45 ${F.display}`, letterSpacing: '.02em',
    textTransform: 'uppercase', marginTop: '64px',
  },
  '& h3': { font: `400 15px/1.5 ${F.display}`, letterSpacing: '.02em', textTransform: 'uppercase', marginTop: '44px' },
  '& h4, & h5, & h6': { fontWeight: 500, marginTop: '32px' },

  '& a': {
    color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${C.hairline}`,
    transition: 'color .25s, border-color .25s',
    '&:hover': { color: C.vermilion, borderColor: C.vermilion },
  },

  '& picture': { display: 'block' },
  '& img': { width: '100%', height: 'auto', display: 'block' },
  '& figure': { margin: '40px 0 0' },
  '& figcaption, & .image-caption': {
    marginTop: '12px', font: `400 12px/1.6 ${F.mono}`, letterSpacing: '.04em', color: C.muted,
  },

  // Substack uses rules as section breaks — rendered as a hairline with a seal.
  '& hr': {
    border: 0, height: '1px', background: C.hairline, position: 'relative', overflow: 'visible',
    margin: '56px 0',
    '&::after': {
      content: '""', position: 'absolute', left: '50%', top: '-3px', width: '6px', height: '6px',
      background: C.vermilion, transform: 'translateX(-50%)',
    },
  },

  '& ul, & ol': { paddingLeft: '1.3em', '& li + li': { marginTop: '10px' }, '& li::marker': { color: C.vermilion } },

  // Pull quote: hairline box, crosshair corners, vermilion tag.
  '& blockquote': {
    position: 'relative', margin: '40px 0 0', padding: { xs: '28px 24px', md: '36px' },
    border: `1px solid ${C.hairline}`, display: 'flex', flexDirection: 'column', gap: '16px',
    fontSize: 'clamp(19px, 2vw, 23px)', lineHeight: 1.5, fontWeight: 400,
    '& > * + *': { marginTop: 0 },
    '& p': { margin: 0 },
    '&::before': { ...corner, left: '-1px', top: '-1px', borderLeft: `1px solid ${C.ink}`, borderTop: `1px solid ${C.ink}` },
    '&::after': { ...corner, right: '-1px', bottom: '-1px', borderRight: `1px solid ${C.ink}`, borderBottom: `1px solid ${C.ink}` },
  },
  '& .essay-quote-tag': { font: `400 10px ${F.mono}`, letterSpacing: '.16em', color: C.vermilion },

  '& iframe': { width: '100%', aspectRatio: '16 / 9', height: 'auto', border: 0, display: 'block' },
  '& .essay-embed-link a': {
    display: 'inline-block', font: `400 10px ${F.mono}`, letterSpacing: '.16em', padding: '14px 20px',
    border: `1px solid ${C.ink}`,
  },

  '& pre, & code': { fontFamily: F.mono, fontSize: '.85em' },
  '& pre': { padding: '20px', background: C.hover, overflowX: 'auto' },
  '& table': { display: 'block', width: '100%', overflowX: 'auto', borderCollapse: 'collapse', fontSize: 16 },
  '& td, & th': { borderBottom: `1px solid ${C.hairline}`, padding: '10px 12px', textAlign: 'left' },
  '& .footnote, & .footnote-content': { fontSize: 15, color: C.inkSoft },
}
