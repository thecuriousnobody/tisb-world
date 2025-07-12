import { Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      
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
        
        {/* Subtitle */}
        <Box sx={{ 
          width: '100%', 
          overflow: 'hidden',
          mb: 6,
        }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 600,
              color: 'text.secondary',
              maxWidth: '800px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            Digital creator exploring the intersection of technology, art, and human experience
          </Typography>
        </Box>

        {/* Bold Action */}
        <Button
          variant="contained"
          size="large"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            px: 6,
            py: 2,
            mb: 8,
          }}
          onClick={() => navigate('/blog')}
        >
          READ MY THOUGHTS
        </Button>

      </Box>

      {/* FOOTER STATEMENT */}
      <Box sx={{
        px: { xs: 2, md: 8 },
        py: { xs: 6, md: 12 },
        borderTop: '2px solid #000000',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
            fontWeight: 700,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          Creating at the intersection of<br />
          <Box component="span" sx={{ color: 'secondary.main' }}>TECHNOLOGY</Box> and{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>HUMAN EXPERIENCE</Box>
        </Typography>
      </Box>

    </Box>
  )
}
