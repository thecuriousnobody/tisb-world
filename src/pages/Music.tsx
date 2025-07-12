import React from 'react';
import { 
  Typography, 
  Box
} from '@mui/material';
import SocialSection from '../components/SocialSection';

const Music: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      {/* Main Spotify Playlist Section */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        {/* Spotify Playlist Embed */}
        <Box sx={{
          px: { xs: 2, md: 8 },
          mb: 8,
        }}>
          <Box sx={{ 
            position: 'relative', 
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
            border: '3px solid #FF4500',
            backgroundColor: '#000000',
            p: 2,
          }}>
            {/* Playlist Title */}
            <Typography
              variant="h4"
              sx={{
                color: '#FF4500',
                fontWeight: 700,
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              MY ORIGINAL TRACKS
            </Typography>
            
            {/* Spotify Iframe */}
            <Box sx={{
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/0ytxEDNvWdplOBDg3SQyDd?utm_source=generator"
                width="100%"
                height="500"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Original Music Playlist"
              />
            </Box>
            
            {/* Call to Action */}
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                textAlign: 'center',
                mt: 3,
                fontSize: { xs: '0.9rem', md: '1rem' },
                opacity: 0.8,
              }}
            >
              ▶ Click any track above to listen • Each song is a unique exploration
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* About the Music Section */}
      <Box sx={{ 
        mt: 12,
        px: { xs: 2, md: 8 },
        borderTop: '2px solid #000000',
        pt: 8,
      }}>
        <Box
          sx={{
            backgroundColor: '#000000',
            color: 'white',
            borderRadius: '0px',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            border: '2px solid #FF4500',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
              overflow: 'hidden',
            }}
          >
            ABOUT THE MUSIC
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 6,
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            My musical work explores the intersection of technology and human expression, 
            creating sonic landscapes that bridge the digital and organic worlds. Each track 
            is an experiment in sound design, rhythm, and atmospheric textures - from ambient 
            drones to complex polyrhythms.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '1rem',
              fontStyle: 'italic',
              opacity: 0.7,
              color: '#FF4500',
            }}
          >
            "Where technology meets melody, new forms of expression emerge."
          </Typography>
        </Box>
      </Box>

      {/* Social Media Section */}
      <SocialSection />
    </Box>
  );
};

export default Music;
