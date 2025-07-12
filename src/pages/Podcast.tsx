import React from 'react';
import { 
  Typography, 
  Box, 
  Card
} from '@mui/material';
import { useYouTubeVideos } from '../hooks/useContent';
import type { ContentItem } from '../services/contentService';
import SocialSection from '../components/SocialSection';

const VideoCard: React.FC<{ video: ContentItem }> = ({ video }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
        height: '280px', // Increased from 200px to 280px for more thumbnail coverage
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          '& .video-thumbnail': {
            filter: 'brightness(80%)',
            transform: 'scale(1.05)',
          },
        },
      }}
      onClick={() => window.open(video.link, '_blank')}
    >
      {/* Thumbnail Background - Back to working method */}
      <Box
        className="video-thumbnail"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${video.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(60%)',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Content Overlay - Enhanced for horizontal layout */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 3,
          background: 'linear-gradient(transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.85) 100%)',
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.3,
            mb: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.title}
        </Typography>

        {/* Description - More lines for better context */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: { xs: '0.75rem', md: '0.8rem' },
            lineHeight: 1.3,
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3, // Show 3 lines
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.description}
        </Typography>

        {/* Bottom row with date and play button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#FF4500',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {video.publishedAt.toLocaleDateString()}
          </Typography>
          
          {/* Play Button */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#FF4500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '1rem', marginLeft: '1px' }}>▶</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const Podcast: React.FC = () => {
  const { videos, loading, error } = useYouTubeVideos();

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
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, // 1 column on mobile, 2 on desktop
              gap: 4, // Increased gap for better spacing
            }}>
              {videos.map((video: ContentItem) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </Box>
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
