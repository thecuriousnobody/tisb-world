import React from 'react';
import { 
  Typography, 
  Box
} from '@mui/material';
import { useYouTubeVideos } from '../hooks/useContent';
import { useVideoLoadMore } from '../hooks/useVideoLoadMore';
import SocialSection from '../components/SocialSection';
import BrutalistVideoGrid from '../components/BrutalistVideoGrid';

const Podcast: React.FC = () => {
  const { videos, loading, error } = useYouTubeVideos();
  const { displayedVideos, loadMore, hasMore } = useVideoLoadMore(videos || []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      {/* YouTube Videos Feed */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        {/* Section Header */}
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
            PODCAST & VIDEOS
          </Typography>
        </Box>

        {/* Videos Grid */}
        <Box sx={{
          px: { xs: 2, md: 8 },
          mb: 8,
        }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                LOADING VIDEOS...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                FAILED TO LOAD VIDEOS
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {error}
              </Typography>
            </Box>
          )}

          {videos && videos.length > 0 && (
            <BrutalistVideoGrid
              videos={displayedVideos}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          )}

          {videos && videos.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                NO VIDEOS AVAILABLE
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* About the Podcast Section */}
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
            ABOUT THE PODCAST
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
            Conversations about technology, creativity, and the future of making things. 
            Each episode explores ideas at the intersection of innovation and human potential, 
            featuring insights on automation, digital creativity, and the evolving landscape of work and life.
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
            "The future belongs to those who can imagine it and build it."
          </Typography>
        </Box>
      </Box>

      {/* Social Media Section */}
      <SocialSection />
    </Box>
  );
};

export default Podcast;
