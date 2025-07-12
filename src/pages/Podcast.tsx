import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useYouTubeVideos } from '../hooks/useContent';
import type { ContentItem } from '../services/contentService';

const VideoCard: React.FC<{ video: ContentItem }> = ({ video }) => {
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match?.[1] || '';
  };

  const videoId = getYouTubeId(video.link);

  return (
    <Card 
      sx={{ 
        mb: 4, 
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Video Embed */}
      <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      
      {/* Video Info */}
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.4,
            mb: 2
          }}
        >
          {video.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {video.description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary">
            {format(video.publishedAt, 'MMM d, yyyy')}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            {video.author}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Podcast: React.FC = () => {
  const { videos, loading, error } = useYouTubeVideos();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Podcast & Videos
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          Conversations about technology, creativity, and the future of making things. 
          Exploring ideas at the intersection of innovation and human potential.
        </Typography>
      </Box>

      {/* Content Section */}
      <Box sx={{ mt: 6 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load videos. Please try again later.
          </Alert>
        )}

        {videos && videos.length > 0 && (
          <Box>
            {videos.map((video: ContentItem) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </Box>
        )}

        {videos && videos.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No videos available yet. Check back soon!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Podcast;
