import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { PlayArrow, Code, Article, Mic, SmartToy } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const features = [
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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          mb: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            mb: 3,
            background: 'linear-gradient(45deg, #ffffff 30%, #888888 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to TISB
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            mb: 4,
            opacity: 0.8,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          A minimalistic space for music, technology, and creative exploration
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            opacity: 0.6,
            mb: 4,
          }}
        >
          Try voice commands by clicking the microphone icon
        </Typography>
      </Box>

      {/* Feature Grid */}
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, opacity: 0.8 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            px: 4,
            py: 1.5,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
          onClick={() => navigate('/ai')}
        >
          Explore AI Projects
        </Button>
      </Box>
    </Box>
  )
}
