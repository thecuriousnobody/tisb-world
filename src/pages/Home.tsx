import { Typography, Box, Button, IconButton } from '@mui/material'
import { Facebook, X, LinkedIn } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const sections = [
    {
      label: 'POD.',
      text: "Conversations that don't respect the boundary between philosophy, technology, grief, economics, caste, spiritual abuse, and whatever else you were told was off-limits. No sponsors. No safe takes. Just two people thinking out loud until something breaks open.",
      route: '/podcast',
      accent: '#FF4500',
    },
    {
      label: 'LAB.',
      text: "The Distillery — a physical space in Peoria where people show up, plug in, and build things that didn't exist yesterday. Vibe coding. Community R&D. The opposite of a coworking space with a ping pong table and nothing to say.",
      route: '/ai',
      accent: '#9c27b0',
    },
    {
      label: 'AI.',
      text: "What happens when the tools that used to require a department now fit in a conversation. We're building with it, writing about it, and arguing about who should own it — because the answer to that question will shape everything else.",
      route: '/ai',
      accent: '#3178c6',
    },
    {
      label: 'WORDS.',
      text: 'Essays that start somewhere personal and end somewhere universal. Or the reverse. Written in first person because third person is where honesty goes to die.',
      route: '/blog',
      accent: '#D2691E',
    },
    {
      label: 'SOUND. IMAGE. SIGNAL.',
      text: 'Music, generative art, voice — the stuff that happens when you stop separating "creative" from "technical" and just let the wires touch.',
      route: null, // multiple destinations
      accent: '#e91e63',
    },
  ]

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* ═══════════ HERO ═══════════ */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: { xs: 3, md: 10 },
        pt: { xs: 10, md: 18 },
        pb: { xs: 6, md: 10 },
        minHeight: { xs: '70vh', md: '85vh' },
      }}>
        {/* Subtitle */}
        <Typography
          variant="overline"
          sx={{
            fontSize: { xs: '0.75rem', md: '0.9rem' },
            fontWeight: 600,
            letterSpacing: '0.3em',
            opacity: 0.5,
            mb: 2,
          }}
        >
          THE IDEA SANDBOX
        </Typography>

        {/* Massive Title */}
        <Box sx={{ mb: { xs: 4, md: 5 }, width: '100%', overflow: 'hidden' }}>
          {['TISB', '.WORLD'].map((word) => (
            <Typography
              key={word}
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', sm: '6rem', md: '9rem', lg: '11rem', xl: '13rem' },
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.05em',
              }}
            >
              {word}
            </Typography>
          ))}
        </Box>

        {/* Tagline */}
        <Typography
          sx={{
            fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.6rem' },
            fontWeight: 600,
            lineHeight: 1.4,
            maxWidth: '750px',
            mb: 2,
          }}
        >
          Where a curious nobody burns down the obvious and builds something worth a damn.
        </Typography>
      </Box>

      {/* ═══════════ THE HOOK ═══════════ */}
      <Box sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 10 },
        borderTop: '2px solid #000',
      }}>
        <Typography
          sx={{
            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.8rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '900px',
            mb: 4,
          }}
        >
          You weren't supposed to find this.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.8,
            maxWidth: '800px',
            opacity: 0.85,
            fontWeight: 400,
          }}
        >
          Not because it's hidden. Because everything else — the algorithms, the feeds, the dopamine traps — was designed to keep you from looking for something like this.
        </Typography>

        <Box sx={{ width: 60, height: 3, backgroundColor: '#FF4500', mt: 5 }} />

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.8,
            maxWidth: '800px',
            mt: 4,
            opacity: 0.85,
            fontWeight: 400,
          }}
        >
          This is what happens when someone spends 18 years inside a machine that builds machines, walks away from the script, moves to central Illinois, and starts asking the questions nobody in the room wants to hear.
        </Typography>
      </Box>

      {/* ═══════════ SECTIONS ═══════════ */}
      <Box sx={{ borderTop: '2px solid #000' }}>
        {sections.map((section, i) => (
          <Box
            key={section.label}
            onClick={() => {
              if (section.route) navigate(section.route)
            }}
            sx={{
              px: { xs: 3, md: 10 },
              py: { xs: 5, md: 7 },
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              cursor: section.route ? 'pointer' : 'default',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': section.route ? {
                backgroundColor: 'rgba(0,0,0,0.02)',
                pl: { xs: 4, md: 12 },
                '& .section-label': {
                  color: section.accent,
                },
                '& .section-bar': {
                  width: 40,
                },
              } : {},
            }}
          >
            {/* Label */}
            <Typography
              className="section-label"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 900,
                letterSpacing: '-0.02em',
                mb: 2,
                transition: 'color 0.25s ease',
              }}
            >
              {section.label}
            </Typography>

            {/* Accent bar */}
            <Box
              className="section-bar"
              sx={{
                width: 25,
                height: 3,
                backgroundColor: section.accent,
                mb: 2.5,
                transition: 'width 0.25s ease',
              }}
            />

            {/* Description */}
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.75,
                maxWidth: '750px',
                opacity: 0.8,
                fontWeight: 400,
              }}
            >
              {section.text}
            </Typography>

            {/* Sub-links for Sound.Image.Signal */}
            {!section.route && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                {[
                  { label: 'Music', route: '/music' },
                  { label: 'Art', route: '/art' },
                  { label: 'Podcast', route: '/podcast' },
                ].map((sub) => (
                  <Box
                    key={sub.label}
                    component="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      navigate(sub.route)
                    }}
                    sx={{
                      background: 'none',
                      border: '1.5px solid #000',
                      borderRadius: 0,
                      px: 2.5,
                      py: 1,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: section.accent,
                        borderColor: section.accent,
                        color: '#fff',
                      },
                    }}
                  >
                    {sub.label.toUpperCase()}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* ═══════════ THE CLOSE ═══════════ */}
      <Box sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 8, md: 12 },
        borderTop: '2px solid #000',
        backgroundColor: '#fafafa',
      }}>
        <Typography
          sx={{
            fontSize: { xs: '1.15rem', md: '1.4rem' },
            fontStyle: 'italic',
            lineHeight: 1.8,
            maxWidth: '700px',
            opacity: 0.7,
            mb: 1,
          }}
        >
          This isn't content. Content is what you make when you're trying to be seen.
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.15rem', md: '1.4rem' },
            fontStyle: 'italic',
            lineHeight: 1.8,
            maxWidth: '700px',
            opacity: 0.7,
            mb: 6,
          }}
        >
          This is what you make when you're trying to see.
        </Typography>

        {/* CTA */}
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/podcast')}
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontWeight: 700,
            px: { xs: 4, md: 6 },
            py: 2,
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 0,
            border: '2px solid #000',
            letterSpacing: '0.02em',
            '&:hover': {
              backgroundColor: '#FF4500',
              borderColor: '#FF4500',
            },
          }}
        >
          START HERE &rarr;
        </Button>
        <Typography
          sx={{
            mt: 2,
            fontSize: '0.85rem',
            opacity: 0.45,
            fontWeight: 500,
          }}
        >
          One conversation that'll tell you if this place is for you.
        </Typography>
      </Box>

      {/* ═══════════ SIGN-OFF + SOCIAL ═══════════ */}
      <Box sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 8 },
        borderTop: '2px solid #000',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 4,
      }}>
        {/* Sign off */}
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Love and Peace,
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              fontWeight: 800,
            }}
          >
            The Curious Nobody
          </Typography>

          {/* Contact */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box
              component="a"
              href="mailto:rajeev@theideasandbox.com"
              sx={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                '&:hover': { color: '#FF4500' },
              }}
            >
              rajeev@theideasandbox.com
            </Box>
            <Typography sx={{ opacity: 0.3 }}>|</Typography>
            <Box
              component="a"
              href="https://wa.me/message/TCGJL6U2OGFZC1"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#25D366',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              WhatsApp
            </Box>
          </Box>
        </Box>

        {/* Social icons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[
            { icon: <Facebook />, href: 'https://www.facebook.com/profile.php?id=100093144579226' },
            { icon: <X />, href: 'https://x.com/theideasandbox' },
            { icon: <LinkedIn />, href: 'https://www.linkedin.com/in/industrious1/' },
          ].map((social, i) => (
            <IconButton
              key={i}
              component="a"
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                border: '2px solid #000',
                borderRadius: 0,
                p: 1.5,
                '&:hover': {
                  backgroundColor: '#FF4500',
                  borderColor: '#FF4500',
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Box>

    </Box>
  )
}
