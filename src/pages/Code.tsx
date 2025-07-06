import { Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material'
import { GitHub, Launch } from '@mui/icons-material'

export default function Code() {
  const projects = [
    {
      title: 'TISB World',
      description: 'Personal website with voice interface integration',
      tech: ['React', 'TypeScript', 'Material UI', 'Whisper API'],
      status: 'In Progress'
    },
    {
      title: 'AI Voice Assistant',
      description: 'Voice-controlled interface for web applications',
      tech: ['Python', 'Whisper', 'Speech Synthesis', 'WebRTC'],
      status: 'Planning'
    }
  ]

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 4, fontSize: { xs: '2rem', md: '3rem' } }}>
        Code
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, fontSize: '1.1rem' }}>
        Open source projects, experiments, and technical explorations.
      </Typography>

      <Grid container spacing={4}>
        {projects.map((project, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Chip 
                    label={project.status} 
                    size="small" 
                    color={project.status === 'In Progress' ? 'primary' : 'secondary'}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                  {project.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {project.tech.map((tech) => (
                    <Chip 
                      key={tech} 
                      label={tech} 
                      size="small" 
                      variant="outlined"
                      sx={{ opacity: 0.7 }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <GitHub sx={{ fontSize: 20, opacity: 0.5, cursor: 'pointer' }} />
                  <Launch sx={{ fontSize: 20, opacity: 0.5, cursor: 'pointer' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
