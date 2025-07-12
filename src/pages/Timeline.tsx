import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useContent } from '../hooks/useContent';
import { ContentCard } from '../components/ContentCard';

const Timeline: React.FC = () => {
  const { content, loading, error } = useContent();

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'substack':
        return '#FF6719';
      case 'youtube':
        return '#FF0000';
      default:
        return '#1976d2';
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'substack':
        return 'Blog Post';
      case 'youtube':
        return 'Video';
      default:
        return 'Content';
    }
  };

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
          Content Timeline
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
          All my latest thoughts, experiments, and discoveries in one place.
          A chronological journey through ideas and explorations.
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
            Failed to load content. Please try again later.
          </Alert>
        )}

        {content && content.length > 0 && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 4,
            }}
          >
            {content.map((item) => (
              <Box key={item.id} sx={{ position: 'relative' }}>
                {/* Platform Badge */}
                <Chip
                  label={getPlatformLabel(item.platform)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2,
                    backgroundColor: getPlatformColor(item.platform),
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
                <ContentCard item={item} />
              </Box>
            ))}
          </Box>
        )}

        {content && content.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No content available yet. Check back soon!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Timeline;
