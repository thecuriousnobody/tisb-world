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
        
        {/* The Complete Story - Single Powerful Blurb */}
        <Box sx={{ 
          width: '100%', 
          mb: 6,
        }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: '900px',
              color: 'text.primary',
              mb: 4,
            }}
          >
            Creator, writer, and automation specialist exploring the intersection of technology and human experience. 
            I showcase my art, share my thoughts through writing and podcasting, and help people streamline their 
            digital lives. Welcome to my sandbox of ideas, where creativity meets innovation.
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

    </Box>
  )
}
