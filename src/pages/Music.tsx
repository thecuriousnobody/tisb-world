import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent
} from '@mui/material';

const Music: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Music
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Musical compositions, experiments, and sonic explorations.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              Artist Profile
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Explore my musical journey on Spotify - from experimental compositions to ambient soundscapes.
            </Typography>
            
            <Box sx={{ 
              position: 'relative', 
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 2
            }}>
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/artist/2fEAGWgz0y6MdIpvIywp1R?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Artist Profile"
              />
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h5" component="h3" gutterBottom>
              About the Music
            </Typography>
            
            <Typography variant="body1" paragraph>
              My musical work explores the intersection of technology and human expression, 
              creating sonic landscapes that bridge the digital and organic worlds. Each composition 
              is an experiment in sound design, rhythm, and atmospheric textures.
            </Typography>
            
            <Typography variant="body1" paragraph>
              From ambient drones to complex polyrhythms, the music reflects the same creative 
              philosophy found in my visual art and writing - a curiosity about the spaces between 
              known and unknown, the liminal territories where new forms emerge.
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Listen with headphones for the full experience. Many tracks contain spatial audio elements 
              and subtle details that reveal themselves over time.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Music;
