import { Typography, Box, Grid, Card, CardContent, Button, Alert } from '@mui/material'
import { Security, Dashboard, Settings, Analytics } from '@mui/icons-material'

export default function Admin() {
  const adminSections = [
    {
      title: 'Content Management',
      description: 'Manage blog posts, music uploads, and project information',
      icon: <Dashboard />,
    },
    {
      title: 'AI Tools Configuration',
      description: 'Configure voice interface, Whisper API, and AI model settings',
      icon: <Settings />,
    },
    {
      title: 'Analytics & Insights',
      description: 'View website analytics and user interaction data',
      icon: <Analytics />,
    },
    {
      title: 'Security & Access',
      description: 'Manage authentication and admin access controls',
      icon: <Security />,
    }
  ]

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 4, fontSize: { xs: '2rem', md: '3rem' } }}>
        Admin Dashboard
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
        Admin functionality is in development. Authentication and backend integration coming soon.
      </Alert>

      <Grid container spacing={4}>
        {adminSections.map((section, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, opacity: 0.8 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6, mb: 3 }}>
                  {section.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2, opacity: 0.8 }}>
          Planned Features:
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, lineHeight: 1.8 }}>
          • Voice-controlled admin commands ("update blog post", "check analytics")<br />
          • Real-time database integration with Supabase<br />
          • Python backend for AI model management<br />
          • Secure authentication with role-based access<br />
          • Automated content processing with AI
        </Typography>
      </Box>
    </Box>
  )
}
