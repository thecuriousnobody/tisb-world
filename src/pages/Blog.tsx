import { useState } from 'react'
import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { useSubstackPosts } from '../hooks/useContent'
import { C, F, GUTTER } from '../design/tokens'
import { Mono, SectionHeader } from '../design/primitives'
import { SLink } from '../design/transition'
import { SUBSTACK, entryNo, fmtDate, fmtRead } from '../utils/writing'

const PAGE_SIZE = 10
/** Rows switch from the 4-column table to a stacked layout below this. */
const TABLE = '@media (min-width: 760px)'
const COLS = '90px minmax(0, 1fr) 150px 110px'

export default function Blog() {
  const { posts, loading, error } = useSubstackPosts()
  const [shown, setShown] = useState(PAGE_SIZE)
  const visible = posts.slice(0, shown)

  return (
    <Box component="section">
      <Seo
        title="Writing — The Curious Nobody"
        description="Essays on building, AI, agency, and the messy middle of creating companies from the middle of the country."
        path="/blog"
      />

      <SectionHeader
        label="SYS / 006 — THE CURIOUS NOBODY / 無名の好奇心"
        title="WRITING"
        lead={`"The Curious Nobody" is my exploration of the spaces between technology and humanity, creativity and logic, the known and the mysterious. Each post is an attempt to make sense of our rapidly changing world through the lens of curiosity and wonder.`}
        kanji="書"
        caption="書 / SHO — WRITING"
      />

      <Box sx={{ px: GUTTER, pb: '96px' }}>
        <Box
          aria-hidden="true"
          sx={{
            display: 'none', py: '16px', borderBottom: `1px solid ${C.ink}`,
            [TABLE]: { display: 'grid', gridTemplateColumns: COLS, gap: '24px' },
          }}
        >
          {['ENTRY', 'TITLE', 'DATE', 'READ'].map((h) => <Mono key={h}>{h}</Mono>)}
        </Box>

        {loading && posts.length === 0 && (
          <Box sx={{ py: '48px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${C.hairline}` }}>
            <Box className="s-pulse" sx={{ width: 6, height: 6, background: C.vermilion }} />
            <Mono>LOADING ENTRIES FROM SUBSTACK…</Mono>
          </Box>
        )}

        {!loading && posts.length === 0 && (
          <Box sx={{ py: '48px', display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: `1px solid ${C.hairline}` }}>
            <Mono color={C.vermilion}>{error ? '[ SIGNAL LOST ] THE FEED DID NOT ANSWER' : '[ EMPTY ] NO ENTRIES YET'}</Mono>
            <Mono color={C.ink}>
              <a href={SUBSTACK} target="_blank" rel="noopener noreferrer">READ ON SUBSTACK ↗</a>
            </Mono>
          </Box>
        )}

        {visible.map((p, i) => {
          const no = entryNo(i, posts.length)
          const date = fmtDate(p.publishedAt)
          const read = fmtRead(p)
          const inner = (
            <>
              <Mono size={11} spacing="0" sx={{ display: 'none', [TABLE]: { display: 'block' } }}>{no}</Mono>
              {/* Stacked (phone) meta line */}
              <Mono sx={{ [TABLE]: { display: 'none' } }}>{no} — {date} — {read}</Mono>
              <Box
                component="span"
                sx={{ fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.35, fontWeight: 500, textWrap: 'pretty', minWidth: 0 }}
              >
                {p.title}
              </Box>
              <Mono spacing=".14em" sx={{ display: 'none', [TABLE]: { display: 'block' } }}>{date}</Mono>
              <Mono spacing=".14em" sx={{ display: 'none', [TABLE]: { display: 'block' } }}>{read} →</Mono>
            </>
          )
          const rowSx = {
            display: 'grid', gridTemplateColumns: '1fr', gap: '10px', alignItems: 'baseline',
            py: '28px', borderBottom: `1px solid ${C.hairline}`,
            [TABLE]: { gridTemplateColumns: COLS, gap: '24px' },
          }
          // Every feed item should have a slug; if one doesn't, fall back to the original.
          return p.slug ? (
            <Box key={p.id} component={SLink} to={`/blog/${p.slug}`} className="s-row" data-reveal sx={rowSx}>
              {inner}
            </Box>
          ) : (
            <Box key={p.id} component="a" href={p.link} target="_blank" rel="noopener noreferrer" className="s-row" data-reveal sx={rowSx}>
              {inner}
            </Box>
          )
        })}

        {posts.length > 0 && (
          <Box sx={{ pt: '48px', display: 'flex', flexWrap: 'wrap', gap: '16px 24px', justifyContent: 'space-between', alignItems: 'center' }}>
            <Mono>{String(visible.length).padStart(2, '0')} OF {String(posts.length).padStart(2, '0')} ENTRIES</Mono>
            {shown < posts.length ? (
              <Box
                component="button"
                type="button"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="s-btn-line"
                sx={{ background: 'transparent', cursor: 'pointer', p: '14px 20px', font: `400 10px ${F.mono}`, letterSpacing: '.16em', color: C.ink, '&:hover': { color: C.vermilion } }}
              >
                LOAD MORE ↓
              </Box>
            ) : (
              // The RSS feed only carries the latest ~20 essays; the archive lives on Substack.
              <Box
                component="a"
                href={`${SUBSTACK}/archive`}
                target="_blank"
                rel="noopener noreferrer"
                className="s-btn-line"
                sx={{ p: '14px 20px', font: `400 10px ${F.mono}`, letterSpacing: '.16em', color: C.ink }}
              >
                OLDER ESSAYS ON SUBSTACK ↗
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
