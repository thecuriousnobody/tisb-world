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
      route: null,
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
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'flex-start', lg: 'center' },
        gap: { xs: 4, lg: 8 },
        px: { xs: 3, md: 10 },
        pt: { xs: 8, md: 14 },
        pb: { xs: 6, md: 10 },
        minHeight: { xs: 'auto', md: '75vh' },
      }}>
        {/* Left: Text */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: { xs: '0.7rem', md: '0.8rem' },
              fontWeight: 600,
              letterSpacing: '0.35em',
              opacity: 0.4,
              mb: 1.5,
              display: 'block',
            }}
          >
            TISB.WORLD
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              mb: 3,
            }}
          >
            THE IDEA
            <br />
            SANDBOX
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.35rem' },
              fontWeight: 500,
              lineHeight: 1.5,
              maxWidth: '600px',
              mb: 4,
              opacity: 0.85,
            }}
          >
            Where a curious nobody burns down the obvious and builds something worth a damn.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/podcast')}
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              border: '2px solid #000',
              '&:hover': {
                backgroundColor: '#FF4500',
                borderColor: '#FF4500',
              },
            }}
          >
            START HERE &rarr;
          </Button>
        </Box>

        {/* Right: Hero visual — placeholder for a generated image */}
        {/* Drop your Leonardo/Midjourney image into public/images/hero.jpg */}
        <Box
          sx={{
            width: { xs: '100%', lg: '45%' },
            aspectRatio: { xs: '16/9', lg: '4/3' },
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #000',
            flexShrink: 0,
            background: `
              linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #FF4500 50%, #9c27b0 75%, #3178c6 100%)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Layered abstract text as visual texture until a real image is added */}
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06 }}>
            {['IDEAS', 'BUILD', 'BREAK', 'CREATE', 'QUESTION', 'SIGNAL'].map((word, i) => (
              <Typography
                key={word}
                sx={{
                  position: 'absolute',
                  fontSize: `${3 + i * 1.5}rem`,
                  fontWeight: 900,
                  color: '#fff',
                  top: `${10 + i * 14}%`,
                  left: `${-5 + (i % 3) * 20}%`,
                  transform: `rotate(${-15 + i * 7}deg)`,
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {word}
              </Typography>
            ))}
          </Box>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.12)',
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              lineHeight: 0.9,
              userSelect: 'none',
            }}
          >
            IDEA
            <br />
            SAND
            <br />
            BOX
          </Typography>
        </Box>
      </Box>

      {/* ═══════════ THE HOOK ═══════════ */}
      <Box sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 6, md: 8 },
        borderTop: '2px solid #000',
      }}>
        <Typography
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.4rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '900px',
            mb: 3,
          }}
        >
          You weren't supposed to find this.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.15rem' },
            lineHeight: 1.8,
            maxWidth: '750px',
            opacity: 0.8,
          }}
        >
          Not because it's hidden. Because everything else — the algorithms, the feeds, the dopamine traps — was designed to keep you from looking for something like this.
        </Typography>

        <Box sx={{ width: 50, height: 3, backgroundColor: '#FF4500', my: 4 }} />

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.15rem' },
            lineHeight: 1.8,
            maxWidth: '750px',
            opacity: 0.8,
          }}
        >
          This is what happens when someone spends 18 years inside a machine that builds machines, walks away from the script, moves to central Illinois, and starts asking the questions nobody in the room wants to hear.
        </Typography>
      </Box>

      {/* ═══════════ SECTIONS ═══════════ */}
      <Box sx={{ borderTop: '2px solid #000' }}>
        {sections.map((section) => (
          <Box
            key={section.label}
            onClick={() => {
              if (section.route) navigate(section.route)
            }}
            sx={{
              px: { xs: 3, md: 10 },
              py: { xs: 5, md: 6 },
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              cursor: section.route ? 'pointer' : 'default',
              transition: 'all 0.25s ease',
              '&:hover': section.route ? {
                backgroundColor: 'rgba(0,0,0,0.02)',
                pl: { xs: 4, md: 12 },
                '& .section-label': { color: section.accent },
                '& .section-bar': { width: 40 },
              } : {},
            }}
          >
            <Typography
              className="section-label"
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                fontWeight: 900,
                letterSpacing: '-0.02em',
                mb: 1.5,
                transition: 'color 0.25s ease',
              }}
            >
              {section.label}
            </Typography>

            <Box
              className="section-bar"
              sx={{
                width: 25,
                height: 3,
                backgroundColor: section.accent,
                mb: 2,
                transition: 'width 0.25s ease',
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.75,
                maxWidth: '700px',
                opacity: 0.75,
              }}
            >
              {section.text}
            </Typography>

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
                      fontSize: '0.8rem',
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
        py: { xs: 6, md: 10 },
        borderTop: '2px solid #000',
        backgroundColor: '#fafafa',
      }}>
        <Typography
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontStyle: 'italic',
            lineHeight: 1.8,
            maxWidth: '650px',
            opacity: 0.6,
            mb: 1,
          }}
        >
          This isn't content. Content is what you make when you're trying to be seen.
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontStyle: 'italic',
            lineHeight: 1.8,
            maxWidth: '650px',
            opacity: 0.6,
            mb: 5,
          }}
        >
          This is what you make when you're trying to see.
        </Typography>

        <Typography
          sx={{
            fontSize: '0.85rem',
            opacity: 0.4,
            mb: 1,
          }}
        >
          One conversation that'll tell you if this place is for you.
        </Typography>
      </Box>

      {/* ═══════════ SIGN-OFF + SOCIAL ═══════════ */}
      <Box sx={{
        px: { xs: 3, md: 10 },
        py: { xs: 5, md: 6 },
        borderTop: '2px solid #000',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 3,
      }}>
        <Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, mb: 0.5 }}>
            Love and Peace,
          </Typography>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, mb: 2 }}>
            The Curious Nobody
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box
              component="a"
              href="mailto:rajeev@theideasandbox.com"
              sx={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
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
                fontSize: '0.9rem',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              WhatsApp
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                p: 1.2,
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
