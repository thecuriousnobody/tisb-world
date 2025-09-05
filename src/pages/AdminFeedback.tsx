import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Button, TextField, Alert } from '@mui/material';

interface FeedbackResponse {
  id: string;
  timestamp: string;
  responses: string[];
}

const AdminFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const questions = [
    "How useful would an AI-powered tool be for finding podcast guests in your niche?",
    "What would you expect to pay monthly for this service?",
    "What was your biggest challenge or frustration with PodcastBots?", 
    "What one feature would make this 10x better?",
    "Would you recommend this to a fellow podcaster?"
  ];

  const authenticate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin-feedback', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setAuthenticated(true);
    } catch (err) {
      setError('Invalid password or failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              PodcastBots Admin
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={authenticate}
              disabled={loading || !password}
              sx={{ backgroundColor: '#4caf50' }}
            >
              {loading ? 'Loading...' : 'Access Feedback'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 100%)',
      py: 4,
      px: 2,
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#333' }}>
          Beta Feedback Dashboard
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
          Total Responses: {feedback.length}
        </Typography>

        {feedback.map((item, index) => (
          <Card key={item.id} sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                Response #{index + 1}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                Submitted: {new Date(item.timestamp).toLocaleString()}
              </Typography>
              
              {item.responses.map((response, qIndex) => (
                <Box key={qIndex} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                    Q{qIndex + 1}: {questions[qIndex]}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      pl: 2, 
                      borderLeft: '3px solid #4caf50',
                      fontStyle: 'italic',
                      color: '#555'
                    }}
                  >
                    {response || 'No response provided'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}

        {feedback.length === 0 && (
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666' }}>
                No feedback responses yet
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: '#888' }}>
                Check back later for user feedback submissions.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AdminFeedback;
