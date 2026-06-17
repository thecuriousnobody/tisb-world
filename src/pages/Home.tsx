import { Typography, Box, Button, IconButton } from '@mui/material'
import { Facebook, X, LinkedIn } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import VentureCard from '../components/VentureCard'
import Seo from '../components/Seo'
import { featuredVentures, ventureCount } from '../data/ventures'
import cadenceImage from '../assets/cadence-01.jpg'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <Seo
        title="TISB — The Idea Sandbox"
        description="Rajeev Kumar builds seven AI startups from Central Illinois — alongside original music, brutalist art, and a podcast. Where ideas become ventures."
        path="/"
      />

      {/* HERO SECTION - MASSIVE BOLD TEXT */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: { xs: 2, md: 8 },
        py: { xs: 8, md: 16 },
      }}>
        
        {/* Main Title - THREE LINES */}
        <Box sx={{ 
          width: '100%', 
          overflow: 'hidden',
          mb: 2,
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem', xl: '7rem' },
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textAlign: 'left',
              width: '100%',
            }}
          >
            THE
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem', xl: '7rem' },
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textAlign: 'left',
              width: '100%',
            }}
          >
            IDEA
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem', xl: '7rem' },
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textAlign: 'left',
              width: '100%',
            }}
          >
            SANDBOX
          </Typography>
        </Box>
        
        {/* The Story + Cadence 01 */}
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 500,
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              I spent eighteen years as an engineer inside one of the world's
              biggest machines, quietly collecting a suspicion: that the most
              interesting ideas don't live in institutions — they live in
              people, waiting for someone curious enough to ask.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 500,
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              So I left. Now I build things — AI products, podcasts, art,
              community — and I write about what I find.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 500,
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              The Idea Sandbox is where it all lands: forty-plus conversations
              with scientists, artists, and beautiful misfits; essays on
              technology, culture, and the games we choose to play; and a
              running experiment in what one stubbornly optimistic nobody can
              build when the tools finally catch up to the imagination.
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              Dig in. Get your hands dirty.
              <Box component="span" sx={{ display: 'block', color: '#000000', opacity: 0.7 }}>
                That's what a sandbox is for.
              </Box>
            </Typography>
          </Box>

          <Box
            component="img"
            src={cadenceImage}
            alt="Cadence 01 — original painting by Rajeev Kumar"
            sx={{
              width: '100%',
              maxWidth: { xs: 420, md: '100%' },
              justifySelf: { xs: 'center', md: 'end' },
              height: { xs: 420, md: 560 },
              objectFit: 'cover',
              border: '4px solid #000000',
              boxShadow: '12px 12px 0px #000000',
              display: 'block',
            }}
          />
        </Box>

        {/* Featured Ventures */}
        <Box sx={{ width: '100%', mb: 6 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 3,
            }}
          >
            Now Building
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
              mb: 4,
            }}
          >
            {featuredVentures.map((venture) => (
              <VentureCard key={venture.name} venture={venture} />
            ))}
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              px: 6,
              py: 2,
            }}
            onClick={() => navigate('/ventures')}
          >
            ALL {ventureCount} VENTURES
          </Button>
        </Box>

        {/* Direct Contact Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mb: 2,
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
              opacity: 0.8,
              fontStyle: 'italic',
              mb: 2,
            }}
          >
            Questions or ideas to explore? Let's connect:
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}>
            <Box 
              component="a" 
              href="mailto:rajeev@theideasandbox.com"
              sx={{ 
                color: '#000000',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.1rem' },
                '&:hover': { 
                  color: '#25D366',
                  textDecoration: 'underline' 
                }
              }}
            >
              rajeev@theideasandbox.com
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ opacity: 0.6, mx: 1, display: { xs: 'none', sm: 'block' } }}>or</Typography>
              <Box
                component="a"
                href="https://wa.me/message/TCGJL6U2OGFZC1"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#25D366',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Social Media Section - Without WhatsApp */}
      <Box sx={{ 
        mt: 8,
        px: { xs: 2, md: 8 },
        pb: 8,
      }}>
        <Box
          sx={{
            backgroundColor: '#FF4500',
            color: 'black',
            borderRadius: '0px',
            p: { xs: 3, md: 4 },
            textAlign: 'center',
            border: '2px solid #000000',
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              mb: 3,
              color: 'black',
            }}
          >
            FOLLOW MY JOURNEY
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            flexWrap: 'wrap'
          }}>
            <IconButton
              component="a"
              href="https://www.facebook.com/profile.php?id=100093144579226"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                border: '2px solid black',
                borderRadius: '0px',
                p: 2,
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Facebook sx={{ fontSize: '2rem' }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://x.com/theideasandbox"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                border: '2px solid black',
                borderRadius: '0px',
                p: 2,
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <X sx={{ fontSize: '2rem' }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/industrious1/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                border: '2px solid black',
                borderRadius: '0px',
                p: 2,
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <LinkedIn sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
