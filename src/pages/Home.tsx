import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { PlayArrow, Code, Article, Mic, SmartToy } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/tisb_logo_transparent.jpg'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Task Chat',
      description: 'AI-powered task assistant with cloud API integration',
      icon: <SmartToy />,
      path: '/task-chat',
    },
    {
      title: 'Music',
      description: 'Explore my musical journey, compositions, and audio experiences',
      icon: <PlayArrow />,
      path: '/music',
    },
    {
      title: 'Blog',
      description: 'Thoughts on technology, creativity, and the intersection of both',
      icon: <Article />,
      path: '/blog',
    },
    {
      title: 'Code',
      description: 'Open source projects, experiments, and technical explorations',
      icon: <Code />,
      path: '/code',
    },
    {
      title: 'AI Startup',
      description: 'Building the future with artificial intelligence',
      icon: <SmartToy />,
      path: '/ai',
    },
    {
      title: 'Podcast',
      description: 'Conversations about technology, creativity, and innovation',
      icon: <Mic />,
      path: '/podcast',
    },
  ]

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 10, md: 16 },
          mb: { xs: 8, md: 12 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <img
            src={logoImage}
            alt="TISB Logo"
            style={{
              height: '160px',
              width: 'auto',
              marginBottom: '48px',
              transition: 'all 0.5s ease',
              filter: 'brightness(1.05) contrast(1.1)',
              opacity: 0.95
            }}
          />
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '5rem', lg: '5.5rem' },
            mb: 4,
            background: 'linear-gradient(45deg, #ffffff 30%, #888888 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 200,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
          }}
        >
          TISB
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.75rem' },
            mb: 6,
            opacity: 0.8,
            maxWidth: '700px',
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.4,
          }}
        >
          Music • Technology • AI • Creativity
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            opacity: 0.6,
            mb: 6,
            maxWidth: '500px',
            mx: 'auto',
            fontWeight: 300,
          }}
        >
          A minimalistic space for creative exploration and technological innovation
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            opacity: 0.5,
            mb: 4,
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}
        >
          Try the new Task Chat for AI-powered productivity assistance
        </Typography>
      </Box>

      {/* Feature Grid */}
      <Box sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {features.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  },
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                  <Box sx={{ mb: 3, opacity: 0.8 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 400, 
                      mb: 2,
                      fontSize: '1.25rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7, 
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                      fontWeight: 300,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 }, mb: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            px: 6,
            py: 2,
            fontSize: '1rem',
            fontWeight: 300,
            letterSpacing: '0.02em',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: 'translateY(-2px)',
            },
          }}
          onClick={() => navigate('/task-chat')}
        >
          Try Task Assistant
        </Button>
      </Box>
    </Box>
  )
}
