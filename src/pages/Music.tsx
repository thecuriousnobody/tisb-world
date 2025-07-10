import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { PlayArrow, Album, AudioFile } from '@mui/icons-material';

const Music: React.FC = () => {
  const projects = [
    {
      title: 'Ambient Explorations',
      description: 'Collection of atmospheric and meditative soundscapes designed for focus and reflection.',
      type: 'Album',
      status: 'In Progress',
      tracks: ['Morning Mist', 'Digital Drift', 'Solitude'],
    },
    {
      title: 'Generative Compositions',
      description: 'AI-assisted musical compositions exploring the intersection of technology and creativity.',
      type: 'Experimental',
      status: 'Released',
      tracks: ['Neural Networks', 'Data Streams', 'Algorithmic Beauty'],
    },
    {
      title: 'Podcast Intros & Outros',
      description: 'Custom musical pieces created for podcast episodes and content creators.',
      type: 'Commercial',
      status: 'Available',
      tracks: ['Tech Talk Theme', 'Creative Conversations', 'Innovation Intro'],
    },
  ];

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto', 
      px: { xs: 2, md: 4 },
      py: { xs: 4, md: 8 }
    }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            mb: 3,
            color: 'text.primary',
          }}
        >
          Music
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '600px',
            mx: 'auto',
            fontWeight: 300,
          }}
        >
          Sonic explorations merging traditional composition with AI-generated elements
        </Typography>
      </Box>
      
      {/* Projects Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: 4,
        mb: 8
      }}>
        {projects.map((project, index) => (
          <Card 
            key={index}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Album sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.7)', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 400, flex: 1, color: 'white' }}>
                  {project.title}
                </Typography>
                <Chip 
                  label={project.status} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  flexGrow: 1,
                }}
              >
                {project.description}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                  Featured Tracks:
                </Typography>
                {project.tracks.map((track, trackIndex) => (
                  <Box key={trackIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <AudioFile sx={{ fontSize: 16, mr: 1.5, color: 'rgba(255, 255, 255, 0.5)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {track}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  alignSelf: 'flex-start',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Listen
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Musical Philosophy Section */}
      <Card sx={{ mb: 8 }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 300 }}>
            Musical Philosophy
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
              fontSize: '1.1rem',
            }}
          >
            My approach to music combines traditional composition techniques with AI-assisted generation, 
            creating pieces that explore the boundary between human creativity and algorithmic beauty. 
            Each composition is designed to evoke specific emotional states while maintaining the 
            unpredictable elements that make music truly alive.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic',
              fontSize: '1rem',
            }}
          >
            "Where technology meets melody, new forms of expression emerge."
          </Typography>
        </CardContent>
      </Card>

      {/* Spotify Artist Profile Section */}
      <Card sx={{ mb: 8 }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3,
              color: 'white',
              fontWeight: 300,
            }}
          >
            Artist Profile
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              color: 'rgba(255, 255, 255, 0.9)',
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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

      {/* About the Music Section */}
      <Card>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 300 }}>
            About the Music
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
            My musical work explores the intersection of technology and human expression, 
            creating sonic landscapes that bridge the digital and organic worlds. Each composition 
            is an experiment in sound design, rhythm, and atmospheric textures.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
            From ambient drones to complex polyrhythms, the music reflects the same creative 
            philosophy found in my visual art and writing - a curiosity about the spaces between 
            known and unknown, the liminal territories where new forms emerge.
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Listen with headphones for the full experience. Many tracks contain spatial audio elements 
            and subtle details that reveal themselves over time.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Music;
