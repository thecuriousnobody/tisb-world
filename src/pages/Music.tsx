import React from 'react';
import { 
  Typography, 
  Box,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import SocialSection from '../components/SocialSection';
import { useSpotifyContent } from '../hooks/useContent';

const Music: React.FC = () => {
  const { music, loading, error } = useSpotifyContent();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      {/* Latest Releases Section */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ 
          width: '100%', 
          overflow: 'hidden',
          mb: 6,
          textAlign: 'center',
        }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '5rem' },
              fontWeight: 800,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            LATEST RELEASES
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, md: 8 }, mb: 8 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                LOADING MUSIC...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                FAILED TO LOAD MUSIC
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {error}
              </Typography>
            </Box>
          )}

          {music && music.length > 0 && (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)'
              },
              gap: 3 
            }}>
              {music.slice(0, 6).map((track) => (
                <Card key={track.id}
                    component="a"
                    href={track.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: '#000000',
                      color: 'white',
                      border: '2px solid #FF4500',
                      borderRadius: '0px',
                      boxShadow: '4px 4px 0px #FF4500',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translate(-4px, -4px)',
                        boxShadow: '8px 8px 0px #FF4500',
                        backgroundColor: '#1a1a1a',
                      },
                      '&:active': {
                        transform: 'translate(0, 0)',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {track.thumbnail && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={track.thumbnail}
                        alt={track.title}
                        sx={{
                          objectFit: 'cover',
                          borderBottom: '2px solid #FF4500',
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: '#FF4500',
                          fontSize: '1.1rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {track.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.9rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {track.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 2,
                          color: '#FF4500',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      >
                        {new Date(track.publishedAt).getFullYear()}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          )}

          {music && music.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                NO RELEASES AVAILABLE
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

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
