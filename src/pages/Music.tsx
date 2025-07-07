import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent
} from '@mui/material';

const Music: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          mb: 3,
          fontWeight: 300,
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          letterSpacing: '-0.02em',
        }}
      >
        Music
      </Typography>
      <Typography 
        variant="h5" 
        color="text.secondary" 
        sx={{ 
          mb: 6,
          fontWeight: 300,
          opacity: 0.8,
          maxWidth: '600px',
          mx: 'auto',
          lineHeight: 1.4,
        }}
      >
        Musical compositions, experiments, and sonic explorations
      </Typography>
      
      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Card 
          sx={{ 
            mb: 4, 
            overflow: 'visible',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography 
              variant="h4" 
              component="h3" 
              sx={{ 
                mb: 3,
                fontWeight: 400,
                fontSize: '1.75rem',
              }}
            >
              Artist Profile
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                fontWeight: 300,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                opacity: 0.9,
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Explore my musical journey on Spotify - from experimental compositions to ambient soundscapes
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
    </Box>
  );
};

export default Music;
