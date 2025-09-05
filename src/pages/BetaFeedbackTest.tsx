import React from 'react';
import { Typography, Box } from '@mui/material';

const BetaFeedbackTest: React.FC = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      py: 4,
    }}>
      <Typography variant="h2" sx={{ color: '#333', mb: 4 }}>
        Beta Feedback Test Page
      </Typography>
      <Typography variant="body1" sx={{ color: '#666' }}>
        If you can see this, the routing is working!
      </Typography>
    </Box>
  );
};

export default BetaFeedbackTest;
