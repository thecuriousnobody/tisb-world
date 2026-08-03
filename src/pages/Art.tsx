import React from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BehanceFeed from '../components/BehanceFeed';
import SocialSection from '../components/SocialSection';
import Seo from '../components/Seo';

const Art: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, md: 4 },
    }}>
      <Seo
        title="Art"
        description="Brutalist digital art and design experiments by The Idea Sandbox — a growing gallery synced live from Behance."
        path="/art"
      />
      {/*
        Anyone browsing the archive is the highest-intent visitor on the site —
        they already like the work. This is the one place a commercial path
        genuinely belongs, so it sits above the feed rather than buried below it.
      */}
      <Box
        component={RouterLink}
        to="/prints"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: { xs: 3, md: 5 },
          p: { xs: 2.5, md: 3 },
          backgroundColor: '#000',
          border: '2px solid #FF4500',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
          '&:hover': { backgroundColor: '#1A0E0A' },
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#FF4500',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            For Designers &amp; Specifiers
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: { xs: '1.05rem', md: '1.25rem' }, fontWeight: 600 }}>
            Available in large format on brushed aluminum.
          </Typography>
        </Box>
        <Typography sx={{ color: '#FF4500', fontWeight: 700, whiteSpace: 'nowrap' }}>
          See installations &rarr;
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

      {/* Social Media Section */}
      <SocialSection />
    </Box>
  );
};

export default Art;
