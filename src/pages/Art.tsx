import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent
} from '@mui/material';
import BehanceFeed from '../components/BehanceFeed';

const Art: React.FC = () => {
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
          Art
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
          Visual explorations at the intersection of technology, consciousness, and creativity
        </Typography>
      </Box>
      
      {/* Behance Feed */}
      <BehanceFeed />

      {/* About the Art */}
      <Card sx={{ mt: 8 }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 300 }}>
            About the Art
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            Visual explorations at the intersection of technology, consciousness, and creativity. 
            Each piece investigates the digital sublime, seeking to capture moments of 
            transcendence within algorithmic processes and computational aesthetics.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Art;
