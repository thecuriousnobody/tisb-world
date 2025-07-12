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
          THE SPARK OF IDEAS
        </Typography>
      </Box>

      {/* The Story */}
      <Box sx={{ 
        px: { xs: 2, md: 8 },
        maxWidth: '1200px',
        mx: 'auto',
      }}>
        
        {/* Historical Context */}
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
            THEN: THE ENLIGHTENMENT
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
            The 18th century Enlightenment was humanity's great intellectual awakening. In the salons of Paris, 
            the coffeehouses of London, and the academies across Europe, brilliant minds gathered to challenge 
            dogma, question authority, and imagine new possibilities for human knowledge and society.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            Voltaire championed reason over superstition. Diderot compiled all human knowledge into his 
            Encyclopédie. Rousseau reimagined the social contract. These weren't just academic exercises—they 
            were revolutionary acts that reshaped civilization itself.
          </Typography>
        </Box>

        {/* Modern Context */}
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
            NOW: THE DIGITAL RENAISSANCE
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Today, we stand at another pivotal moment. Artificial intelligence, automation, and digital creativity 
            are not just tools—they're catalysts for a new kind of human expression. The curious minds of our era 
            aren't gathering in salons; they're building in digital spaces, creating at the intersection of human 
            intuition and machine capability.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.7,
            }}
          >
            This is my contribution to that ongoing conversation. Through art, writing, music, and code, I explore 
            what it means to be human in an age of artificial minds. Every podcast episode, blog post, and creative 
            project is part of a larger experiment in understanding our evolving relationship with technology.
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
            JOIN THE CONVERSATION
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
            Ideas are meant to be shared, challenged, and evolved. Whether you're fascinated by AI's creative 
            potential, interested in automation's philosophical implications, or simply curious about the future 
            we're building together—this is your invitation to explore alongside me.
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
              READ MY THOUGHTS
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
              LISTEN & DISCUSS
            </Button>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
