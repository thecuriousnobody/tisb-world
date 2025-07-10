import { Typography, Box, Card, CardContent, Button } from '@mui/material'
import { PlayArrow, Code, Article, Mic, SmartToy, Palette } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/TISB Logo Transparent.png'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Music',
      description: 'Sonic explorations, experimental compositions, and audio landscapes',
      icon: <PlayArrow />,
      path: '/music',
    },
    {
      title: 'Art',
      description: 'Visual creations, digital art, and creative experiments',
      icon: <Palette />,
      path: '/art',
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
      title: 'AI',
      description: 'Building AI-powered tools and exploring artificial intelligence',
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
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto',
      px: { xs: 2, md: 4 },
      py: { xs: 4, md: 8 }
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          mb: { xs: 8, md: 12 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <img
            src={logoImage}
            alt="TISB Logo"
            style={{
              height: '140px',
              width: 'auto',
              marginBottom: '32px',
              transition: 'all 0.5s ease',
            }}
          />
        </Box>
        <Typography
          variant="h1"
          sx={{
            mb: 4,
            color: 'text.primary',
            fontWeight: 300,
          }}
        >
          TISB World
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 6,
            color: 'text.secondary',
            maxWidth: '700px',
            mx: 'auto',
            fontWeight: 300,
          }}
        >
          Music • Art • Technology • AI • Creativity
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 8,
            maxWidth: '500px',
            mx: 'auto',
            fontWeight: 300,
          }}
        >
          A creative space exploring the intersection of technology, art, and human expression
        </Typography>
      </Box>

      {/* Feature Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: 4,
        mb: 12
      }}>
        {features.map((feature) => (
          <Card
            key={feature.title}
            sx={{
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
            onClick={() => navigate(feature.path)}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <Box sx={{ 
                  mr: 2, 
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 400, color: 'white' }}>
                  {feature.title}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  flexGrow: 1,
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Call to Action */}
      <Card sx={{ textAlign: 'center' }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 300 }}>
            Ready to explore?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Dive into the world of creative technology, experimental music, visual art, and innovative thinking.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/music')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: '#1a1a1a',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Start Exploring
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
