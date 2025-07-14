import { Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/TISB Logo Transparent.png'

export default function Thoughts() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 4, md: 8 },
    }}>
      
      {/* Hero Section with Logo */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: { xs: 2, md: 8 },
        mb: 8,
      }}>
        <img
          src={logoImage}
          alt="TISB Logo"
          style={{
            height: '120px',
            width: 'auto',
            marginBottom: '32px',
            filter: 'drop-shadow(0 4px 8px rgba(255, 69, 0, 0.3))',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '3.5rem' },
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            mb: 4,
          }}
        >
          THE SANDBOX OF IDEAS
        </Typography>
      </Box>

      {/* The Story */}
      <Box sx={{ 
        px: { xs: 2, md: 8 },
        maxWidth: '1200px',
        mx: 'auto',
      }}>
        
        {/* The Origin Story */}
        <Box sx={{
          backgroundColor: '#000000',
          color: 'white',
          p: { xs: 4, md: 8 },
          mb: 8,
          border: '3px solid #FF4500',
        }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
              color: '#FF4500',
            }}
          >
            WHERE IDEAS BEGIN
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              mb: 4,
              opacity: 0.9,
            }}
          >
            Growing up in 1980s and 90s Bangalore, I watched a city transform from sleepy garden town to India's 
            Silicon Valley. But it was moving to America that crystallized something profound for me—the gap between 
            having ideas and implementing them systematically.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            America wasn't just prosperous because of resources or luck. It had developed systematic approaches 
            to turning ideas into reality—processes, structures, and mindsets that could be studied, understood, 
            and adapted. That insight became my sandbox.
          </Typography>
        </Box>

        {/* The Philosophy */}
        <Box sx={{
          backgroundColor: '#D2691E',
          color: 'white',
          p: { xs: 4, md: 8 },
          mb: 8,
          border: '3px solid #000000',
        }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
              color: 'white',
            }}
          >
            THE LABORATORY OF POSSIBILITY
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            This space—TISB—is my laboratory for exploring ideas across disciplines. Art, automation, music, 
            writing, AI, philosophy. Not because I'm seeking attention, but because cross-pollination between 
            different domains often yields the most interesting insights.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            When you understand both creative expression and systematic thinking, you start seeing patterns. 
            How automation principles apply to art. How design thinking improves code. How storytelling enhances 
            technical communication.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
            }}
          >
            Every project here—whether it's a podcast exploring AI ethics, generative art experiments, or building 
            efficient systems—flows from this fundamental curiosity about how ideas move from imagination to impact.
          </Typography>
        </Box>

        {/* The Invitation */}
        <Box sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          borderTop: '3px solid #000000',
          borderBottom: '3px solid #000000',
          mb: 8,
        }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              mb: 4,
            }}
          >
            EXPLORE THE SANDBOX
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
            }}
          >
            Ideas are most powerful when they're shared, tested, and evolved through dialogue. Whether you're 
            curious about AI's creative potential, interested in systematic approaches to innovation, or simply 
            enjoy exploring connections between seemingly unrelated fields—welcome to the sandbox.
          </Typography>
          
          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3, 
            maxWidth: '600px', 
            mx: 'auto',
            justifyContent: 'center',
          }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                py: 2,
                px: 4,
                flex: 1,
              }}
              onClick={() => navigate('/blog')}
            >
              READ THE EXPERIMENTS
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                py: 2,
                px: 4,
                flex: 1,
                borderColor: '#FF4500',
                color: '#FF4500',
                '&:hover': {
                  borderColor: '#FF4500',
                  backgroundColor: 'rgba(255, 69, 0, 0.1)',
                },
              }}
              onClick={() => navigate('/podcast')}
            >
              JOIN THE CONVERSATION
            </Button>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
