import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { ventureCount } from '../data/ventures'
import { C, F, GUTTER } from '../design/tokens'
import { Mono, SectionHeader } from '../design/primitives'
import { pad2 } from '../design/pages'

const CHAPTERS = [
  {
    title: 'THE IMMIGRANT BET',
    body: 'I came to this country with the same bet every immigrant founder makes: that agency beats circumstance. Nobody hands you a network, a playbook, or permission. You build all three.',
  },
  {
    title: 'THE CATERPILLAR YEARS',
    body: 'Eighteen years of engineering inside Caterpillar taught me how giant systems actually move — the discipline of shipping when a thousand things can go wrong. I took that operating rigor and pointed it at something smaller, faster, and mine.',
  },
  {
    title: 'BUILDING FROM CENTRAL ILLINOIS',
    body: `No Sand Hill Road. No accelerator cohort. Just ${ventureCount} companies being built from the middle of the country, using the same AI tools I'm building for everyone else. I'm my own first user — every product gets dogfooded here before it gets shipped.`,
  },
  {
    title: 'THE THESIS',
    body: 'Every human has agency. AI just removes the barriers. The tools I build — for founders, for small businesses, for creators — all exist to close the gap between having an idea and acting on it.',
  },
]

const btn = { font: `400 10px ${F.mono}`, letterSpacing: '.16em', p: '14px 20px', whiteSpace: 'nowrap' } as const

export default function About() {
  return (
    <Box component="section">
      <Seo
        title="The Builder"
        description="Immigrant founder, eighteen years of engineering at Caterpillar, now building seven companies from Central Illinois. The thesis: every human has agency — AI just removes the barriers."
        path="/about"
      />
      <SectionHeader
        label="SYS / 007 — THE BUILDER / 人"
        title="THE BUILDER"
        titleSize="clamp(40px, 5.2vw, 68px)"
        titleLine={1.05}
        lead={`Immigrant founder. Systems thinker. ${ventureCount} companies deep.`}
        leadSize={21}
        kanji="人"
        caption="人 / HITO — PERSON"
      />

      <Box sx={{ p: `0 ${GUTTER} 96px` }}>
        {CHAPTERS.map((c, i) => (
          <Box
            key={c.title}
            data-reveal
            sx={{
              display: 'grid', gridTemplateColumns: '1fr', gap: '24px 48px', py: '48px',
              borderBottom: `1px solid ${C.hairline}`,
              // Title | body spanning two — explicit, so phones don't grow a phantom column.
              '@media (min-width: 880px)': { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' },
            }}
          >
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
              <Mono size={11} spacing="0" color={C.vermilion}>{pad2(i + 1)}</Mono>
              <Box component="h2" sx={{ font: `400 18px/1.4 ${F.display}` }}>{c.title}</Box>
            </Box>
            <Box component="p" sx={{ fontSize: 18, lineHeight: 1.75, fontWeight: 300, maxWidth: 720 }}>{c.body}</Box>
          </Box>
        ))}
      </Box>

      <Box
        data-reveal
        className="s-on-dark"
        sx={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px',
          p: `72px ${GUTTER}`, background: C.ink, color: C.paper,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Mono color={C.mutedOnDark}>FOLLOW THE BUILD</Mono>
          <Box component="p" sx={{ fontSize: 20, lineHeight: 1.6, fontWeight: 300 }}>
            The messy middle of building {ventureCount} startups at once, shared as it happens.
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Box component="a" href="https://www.linkedin.com/in/industrious1/" target="_blank" rel="noopener noreferrer"
            sx={{ ...btn, border: `1px solid ${C.paper}`, color: C.paper }}>LINKEDIN</Box>
          <Box component="a" href="https://x.com/theideasandbox" target="_blank" rel="noopener noreferrer"
            sx={{ ...btn, border: `1px solid ${C.paper}`, color: C.paper }}>FOLLOW ON X</Box>
          <Box component="a" href="https://www.facebook.com/profile.php?id=100093144579226" target="_blank" rel="noopener noreferrer"
            sx={{ ...btn, border: `1px solid ${C.paper}`, color: C.paper }}>FACEBOOK</Box>
          <Box component="a" href="mailto:rajeev@theideasandbox.com" className="s-btn-verm" sx={btn}>EMAIL ME</Box>
        </Box>
      </Box>
    </Box>
  )
}
