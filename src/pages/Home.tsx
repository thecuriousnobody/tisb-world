import { useState, useEffect } from 'react'
import { Typography, Box, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

// Dynamic content hook
function useSubstackPosts() {
  const [posts, setPosts] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/substack/posts')
      .then((r) => r.ok ? r.text() : '')
      .then((xml) => {
        if (!xml) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        const items = Array.from(doc.querySelectorAll('item')).slice(0, 4).map((item) => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          description: (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').slice(0, 120),
        }))
        setPosts(items)
      })
      .catch(() => {})
  }, [])
  return posts
}

// Static data
const startups = [
  {
    name: 'PodcastBots.ai',
    tag: 'STARTUP',
    description: 'AI-powered guest discovery for podcasters. Find the perfect guest for your next conversation — not through algorithms optimizing for engagement, but through genuine relevance.',
    url: 'https://podcastbots.ai',
  },
  {
    name: 'deSilo',
    tag: 'STARTUP',
    description: 'A support platform for startup founders in Central Illinois. Because building something from nothing is hard enough without doing it alone.',
    url: 'https://potentiator.ai',
  },
  {
    name: 'Swych Box',
    tag: 'STARTUP \u00b7 CTO',
    description: "Reimagining the EV charging experience. What if the time you spend charging wasn't dead time — but discovery time?",
    url: '',
  },
]

const timeline = [
  {
    year: '2023 \u2014 Present',
    role: 'Founder & Creative Technologist',
    org: 'The Idea Sandbox LLC \u00b7 Distillery Labs',
    detail: 'Makerspace Tech Lead. AI Collective Peoria chapter lead. Building three startups. Hosting a podcast. Making music. Writing. Building in public.',
    current: true,
  },
  {
    year: '2005 \u2014 2023',
    role: 'Systems & Embedded Engineer \u2192 Automation Specialist',
    org: 'Caterpillar Inc. \u00b7 Peoria, IL & Chennai, India',
    detail: 'Nearly two decades building autonomous systems, digital twins, hardware-in-loop testing, and embedded controls for the world\u2019s largest mining and construction machines. Two patents. Led international teams.',
  },
  {
    year: '2003 \u2014 2005',
    role: 'MS Electrical Engineering (Controls)',
    org: 'Wright State University \u00b7 Dayton, OH',
    detail: 'NSF-sponsored research. Thesis on machine predictive health monitoring using state observers and gradient descent.',
  },
  {
    year: '1997 \u2014 2001',
    role: 'BS Electrical & Electronics Engineering',
    org: 'Bangalore University \u00b7 Bangalore, India',
    detail: 'Where it all started. Factory floors, power tools, carbon brushes — hands-on engineering before anyone called it \u201cmaker culture.\u201d',
  },
]

const podcastTopics = [
  'AI & Society', 'Architecture', 'Psychology', 'Indian Culture',
  'Startups', 'Philosophy', 'Systems Thinking', 'Meritocracy', 'Creativity',
]

export default function Home() {
  const navigate = useNavigate()
  const substackPosts = useSubstackPosts()

  const SectionLabel = ({ children }: { children: string }) => (
    <Typography
      variant="overline"
      sx={{ display: 'block', mb: 5, color: 'primary.main', fontSize: '0.6875rem', letterSpacing: '0.25em' }}
    >
      {children}
    </Typography>
  )

  const NavLink = ({ children, href, onClick }: { children: string; href?: string; onClick?: () => void }) => (
    <Box
      component={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      sx={{
        background: 'none',
        border: 'none',
        color: 'text.primary',
        textDecoration: 'none',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        py: 1.2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: 'inherit',
        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
      }}
    >
      {children}
    </Box>
  )

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>

      {/* ═══════════ HERO ═══════════ */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, md: 5 },
        py: { xs: 5, md: 8 },
        position: 'relative',
        // Subtle glow
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: '-200px',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(245,197,66,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}>
        <Typography variant="overline" sx={{ mb: 4, color: 'primary.main' }}>
          The Curious Nobody
        </Typography>

        <Typography variant="h1" sx={{ mb: 4 }}>
          18 years in corporate engineering taught me one thing: the best ideas die in{' '}
          <Box component="em" sx={{ fontStyle: 'italic', color: 'primary.main' }}>committees.</Box>
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mb: 6 }}>
          The Idea Sandbox is my answer — a podcast, a makerspace, three startups, and an open
          invitation to anyone who'd rather build than wait for permission.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          <NavLink onClick={() => document.getElementById('building')?.scrollIntoView({ behavior: 'smooth' })}>What I'm Building</NavLink>
          <NavLink onClick={() => navigate('/podcast')}>Podcast</NavLink>
          <NavLink onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}>The Journey</NavLink>
          <NavLink onClick={() => navigate('/blog')}>Writing</NavLink>
          <NavLink onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}>Connect</NavLink>
        </Box>
      </Box>

      {/* ═══════════ BUILDING ═══════════ */}
      <Box component="section" id="building" sx={{ px: { xs: 3, md: 5 }, py: 10 }}>
        <SectionLabel>Currently Building</SectionLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {startups.map((s) => (
            <Box
              key={s.name}
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                p: 4,
                transition: 'border-color 0.3s',
                cursor: s.url ? 'pointer' : 'default',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => s.url && window.open(s.url, '_blank')}
            >
              <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>
                {s.tag}
              </Typography>
              <Typography variant="h2" sx={{ mb: 1.5 }}>
                {s.name}
              </Typography>
              <Typography variant="body2">
                {s.description}
              </Typography>
              {s.url && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    mt: 2,
                    color: 'text.primary',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 0.3,
                    transition: 'all 0.3s',
                  }}
                >
                  Explore &rarr;
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ═══════════ PODCAST ═══════════ */}
      <Box component="section" sx={{ px: { xs: 3, md: 5 }, py: 10, borderTop: '1px solid', borderColor: 'divider' }}>
        <SectionLabel>Listen</SectionLabel>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              The Idea Sandbox Podcast
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Conversations with people who see the world differently. Researchers, artists,
              builders, misfits. 40+ episodes and counting. No corporate polish — just honest,
              curious dialogue about what matters.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {[
                { label: 'YouTube', href: 'https://www.youtube.com/@theideasandbox' },
                { label: 'Spotify', href: 'https://open.spotify.com/show/6rxdCtsfZ2eJ70QqXNTXju' },
                { label: 'Substack', href: 'https://thecuriousnobody.substack.com/' },
              ].map((link) => (
                <Box
                  key={link.label}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    p: '8px 16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignContent: 'flex-start' }}>
            {podcastTopics.map((topic) => (
              <Chip key={topic} label={topic} variant="outlined" size="small" />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ═══════════ TIMELINE ═══════════ */}
      <Box component="section" id="journey" sx={{ px: { xs: 3, md: 5 }, py: 10, borderTop: '1px solid', borderColor: 'divider' }}>
        <SectionLabel>The Journey</SectionLabel>
        <Box sx={{ position: 'relative', pl: 5 }}>
          {/* Vertical line */}
          <Box sx={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: '1px', backgroundColor: 'divider',
          }} />

          {timeline.map((item, i) => (
            <Box key={i} sx={{ position: 'relative', mb: 5 }}>
              {/* Dot */}
              <Box sx={{
                position: 'absolute', left: -44, top: 6,
                width: 7, height: 7, borderRadius: '50%',
                backgroundColor: 'primary.main',
                boxShadow: item.current ? '0 0 12px rgba(245,197,66,0.5)' : 'none',
              }} />
              <Typography variant="overline" sx={{ display: 'block', mb: 0.5 }}>
                {item.year}
              </Typography>
              <Typography variant="h3" sx={{ mb: 0.5 }}>
                {item.role}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {item.org}
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 500, fontSize: '0.75rem' }}>
                {item.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ═══════════ WRITING (dynamic from Substack) ═══════════ */}
      <Box component="section" sx={{ px: { xs: 3, md: 5 }, py: 10, borderTop: '1px solid', borderColor: 'divider' }}>
        <SectionLabel>Thinking Out Loud</SectionLabel>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}>
          {(substackPosts.length > 0
            ? substackPosts
            : [
                { title: 'The Reference Signal Problem: Why Societies Get Stuck in Mediocrity Loops', description: 'Systems thinking applied to culture', link: '' },
                { title: 'Star Trek and the Lost Art of American Optimism', description: 'What happened to imagining better futures?', link: '' },
                { title: 'Marriage as a Recent Invention and Evolving Experiment', description: 'Questioning what we take for granted', link: '' },
                { title: 'The Ganesha Chronicles: How a Cat Rewrote My Understanding of Friendship', description: 'Sometimes the teacher has four legs', link: '' },
              ]
          ).map((post, i) => (
            <Box
              key={i}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 3.5,
                cursor: post.link ? 'pointer' : 'default',
                transition: 'border-color 0.3s',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => post.link && window.open(post.link, '_blank')}
            >
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                {post.title}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {post.description}...
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          component="span"
          onClick={() => navigate('/blog')}
          sx={{
            display: 'inline-block',
            mt: 3,
            color: 'text.primary',
            fontSize: '0.6875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 0.3,
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          All Writing &rarr;
        </Box>
      </Box>

      {/* ═══════════ CONNECT ═══════════ */}
      <Box
        component="section"
        id="connect"
        sx={{
          px: { xs: 3, md: 5 }, py: 10, pb: 15,
          borderTop: '1px solid', borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <SectionLabel>Pull Up a Chair</SectionLabel>
        <Typography variant="h1" sx={{ mb: 2, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
          Let's build something.
        </Typography>
        <Typography variant="body2" sx={{ mb: 4.5, maxWidth: 500, mx: 'auto' }}>
          Whether you want to start a podcast, launch a startup, charge your EV, or just have
          a conversation that goes somewhere unexpected — I'm here.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 6 }}>
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/industrious1/' },
            { label: 'YouTube', href: 'https://www.youtube.com/@theideasandbox' },
            { label: 'Substack', href: 'https://thecuriousnobody.substack.com/' },
            { label: 'Behance', href: 'https://www.behance.net/theideasandbox' },
            { label: 'Email', href: 'mailto:rajeev@theideasandbox.com' },
          ].map((link) => (
            <Box
              key={link.label}
              component="a"
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                p: '12px 24px',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(245,197,66,0.05)',
                },
              }}
            >
              {link.label}
            </Box>
          ))}
        </Box>
        <Typography
          sx={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.125rem',
            color: 'text.secondary',
          }}
        >
          Love and peace.
        </Typography>
      </Box>

    </Box>
  )
}
