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
              Potentiator AI
            </Typography>

            <Typography variant="body1" paragraph>
              AI-powered tools for unlocking human potential. Explore the platform below or visit directly.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                href="https://www.potentiator.ai"
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
                src="https://www.potentiator.ai"
                title="Potentiator AI"
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
              <strong>Potentiator AI</strong> is designed to help individuals and teams unlock their full potential
              through AI-powered insights and tools.
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
