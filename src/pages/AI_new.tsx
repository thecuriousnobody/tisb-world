import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button
} from '@mui/material';

const AI: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        AI
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Automated solutions for podcast creators and content management.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h4" component="h3" gutterBottom>
              Podcast Bots AI
            </Typography>
            
            <Typography variant="body1" paragraph>
              My AI-powered platform for podcast creators. Explore the full service below or visit directly.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                size="large"
                href="https://www.podcastbots.ai/home"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
              >
                Open in New Tab
              </Button>
            </Box>
            
            {/* iframe embed */}
            <Box sx={{ 
              position: 'relative', 
              width: '100%',
              height: '600px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <iframe
                src="https://www.podcastbots.ai/home"
                title="Podcast Bots AI"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h4" component="h3" gutterBottom>
              DeSilo - Startup Intelligence
            </Typography>

            <Typography variant="body1" paragraph>
              Decentralized Startup Intelligence for Local Operators. AI-powered platform connecting
              Central Illinois entrepreneurs with resources, funding, and opportunities.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                href="https://www.potentiator.ai/about"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="https://www.potentiator.ai/intake"
                target="_blank"
                rel="noopener noreferrer"
              >
                DeSilo Admin Access
              </Button>
            </Box>

            {/* iframe embed */}
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '800px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <iframe
                src="https://www.potentiator.ai/about"
                title="DeSilo - Startup Intelligence"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              About These Platforms
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>Podcast Bots AI</strong> is my comprehensive solution for automating podcast production workflows.
              The platform handles guest discovery, outreach automation, and content optimization so
              creators can focus on what they do best - creating meaningful conversations.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>DeSilo (Potentiator AI)</strong> is my startup intelligence platform for Central Illinois.
              It breaks down the silos that keep entrepreneurs isolated, using AI to connect founders with
              local resources, funding opportunities, mentors, and programs they might otherwise miss.
            </Typography>

            <Typography variant="body1">
              Built with the philosophy that AI should enhance human creativity, not replace it.
              These systems handle operational complexity while preserving authentic human
              connections and growth.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AI;
