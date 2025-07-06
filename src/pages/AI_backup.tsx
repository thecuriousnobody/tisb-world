import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  Chip,
  Stack
} from '@mui/material';
import { 
  SmartToy, 
  PersonSearch, 
  Email, 
  AutoAwesome,
  Podcasts,
  Launch
} from '@mui/icons-material';

interface AIFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: string;
}

const aiFeatures: AIFeature[] = [
  {
    title: 'Guest Discovery',
    description: 'AI-powered guest identification and matching for your podcast niche',
    icon: <PersonSearch />,
    status: 'Live'
  },
  {
    title: 'Outreach Automation',
    description: 'Intelligent email sequences and follow-up management for guest booking',
    icon: <Email />,
    status: 'Live'
  },
  {
    title: 'Podcast Intelligence',
    description: 'AI analysis of podcast performance and guest engagement metrics',
    icon: <SmartToy />,
    status: 'Live'
  },
  {
    title: 'Content Optimization',
    description: 'AI-driven insights for improving podcast content and guest conversations',
    icon: <AutoAwesome />,
    status: 'Beta'
  }
];

const AI: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        AI
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Artificial Intelligence solutions for podcasters and content creators.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        {/* Main Product Showcase */}
        <Card sx={{ mb: 4, overflow: 'visible', bgcolor: 'primary.dark', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Podcasts sx={{ fontSize: 48, mr: 2, color: 'secondary.main' }} />
              <Box>
                <Typography variant="h3" component="h2" gutterBottom>
                  Podcast Bots AI
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  AI-Powered Podcast Guest Management Platform
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
              Transform your podcast workflow with intelligent guest discovery, automated outreach, 
              and AI-driven insights. Built for podcasters who want to scale their guest booking 
              process without losing the personal touch.
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Chip label="Guest Discovery" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              <Chip label="Outreach Automation" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              <Chip label="AI Analytics" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            </Stack>
            
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Launch />}
              href="https://www.podcastbots.ai/home"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                bgcolor: 'secondary.main', 
                color: 'black',
                '&:hover': { bgcolor: 'secondary.light' }
              }}
            >
              Visit Podcast Bots AI
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Typography variant="h4" component="h3" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Platform Features
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3 
        }}>
          {aiFeatures.map((feature, index) => (
            <Card key={index} sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h4">
                      {feature.title}
                    </Typography>
                    <Chip 
                      label={feature.status} 
                      size="small" 
                      color={feature.status === 'Live' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Technical Details */}
        <Card sx={{ mt: 6 }}>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              Behind the Technology
            </Typography>
            
            <Typography variant="body1" paragraph>
              Podcast Bots AI leverages advanced machine learning algorithms to understand podcast 
              niches, analyze guest compatibility, and optimize outreach strategies. The platform 
              combines natural language processing with behavioral analytics to deliver personalized 
              recommendations for every podcaster.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Built with scalability in mind, the system processes thousands of potential guest 
              profiles, social media presence, and content alignment factors to suggest the most 
              relevant connections for your show.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Core Technologies:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Machine Learning" size="small" />
                <Chip label="Natural Language Processing" size="small" />
                <Chip label="Behavioral Analytics" size="small" />
                <Chip label="Automated Outreach" size="small" />
                <Chip label="Content Analysis" size="small" />
                <Chip label="Social Media Intelligence" size="small" />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AI;

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 4, fontSize: { xs: '2rem', md: '3rem' } }}>
        AI Startup
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 6, opacity: 0.8, fontSize: '1.1rem' }}>
        Building the future with artificial intelligence. Focusing on voice interfaces, 
        creative AI tools, and intelligent automation.
      </Typography>

      <Grid container spacing={4}>
        {aiProjects.map((project, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, opacity: 0.8 }}>
                    {project.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 400 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {project.status}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>
                  {project.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.8 }}>
          Interested in collaborating?
        </Typography>
        <Button
          variant="outlined"
          size="large"
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AI;
