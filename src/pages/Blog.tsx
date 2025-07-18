import { Typography, Box } from '@mui/material'
import SubstackFeed from '../components/SubstackFeed'
import SocialSection from '../components/SocialSection'

export default function Blog() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      {/* Substack Feed */}
      <SubstackFeed />

      {/* About Section */}
      <Box sx={{ 
        mt: 12,
        px: { xs: 2, md: 8 },
        borderTop: '2px solid #000000',
        pt: 8,
      }}>
        <Box
          sx={{
            backgroundColor: '#000000',
            color: 'white',
            borderRadius: '0px',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            border: '2px solid #FF4500',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
              overflow: 'hidden',
            }}
          >
            ABOUT THE BLOG
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            "The Curious Nobody" is my exploration of the spaces between technology and humanity, 
            creativity and logic, the known and the mysterious. Each post is an attempt to make 
            sense of our rapidly changing world through the lens of curiosity and wonder.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.9rem', md: '1rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 6,
              lineHeight: 1.7,
              opacity: 0.7,
              fontStyle: 'italic',
            }}
          >
            Questions, thoughts, or just want to continue the conversation? Reach out at{' '}
            <Box 
              component="a" 
              href="mailto:rajeev@theideasandbox.com"
              sx={{ 
                color: '#FFFFFF',
                textDecoration: 'underline',
                fontWeight: 600,
                '&:hover': { 
                  color: '#FF4500',
                  textDecoration: 'underline' 
                }
              }}
            >
              rajeev@theideasandbox.com
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Social Media Section */}
      <SocialSection />
    </Box>
  )
}
