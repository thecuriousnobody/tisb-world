import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, Alert, Button } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, developmentLogin, isDevelopment } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse.credential)
      navigate('/admin/video-tracker')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  const handleError = () => {
    setError('Google login failed')
  }

  const handleDevLogin = () => {
    try {
      developmentLogin()
      navigate('/admin')
    } catch (err: any) {
      setError('Development login failed')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Admin Login
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 4, opacity: 0.7 }}>
          Sign in with your authorized Google account to access the admin panel.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="filled_black"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </Box>

        {isDevelopment && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'warning.main' }}>
              🚀 Development Mode
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleDevLogin}
              sx={{ 
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'warning.light',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)'
                }
              }}
            >
              Skip OAuth - Dev Login
            </Button>
          </Box>
        )}

        <Typography variant="caption" sx={{ mt: 4, display: 'block', opacity: 0.5 }}>
          Only authorized email addresses can access the admin panel.
        </Typography>
      </Paper>
    </Box>
  )
}