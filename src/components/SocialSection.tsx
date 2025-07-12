import { Typography, Box, IconButton } from '@mui/material'
import { Facebook, X, LinkedIn, WhatsApp } from '@mui/icons-material'

export default function SocialSection() {
  return (
    <Box sx={{ 
      mt: 8,
      px: { xs: 2, md: 8 },
      pb: 8,
    }}>
      <Box
        sx={{
          backgroundColor: '#FF4500',
          color: 'black',
          borderRadius: '0px',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          border: '2px solid #000000',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 700,
            mb: 3,
            color: 'black',
          }}
        >
          CONNECT WITH ME
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3,
          flexWrap: 'wrap'
        }}>
          <IconButton
            component="a"
            href="https://www.facebook.com/profile.php?id=100093144579226"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid black',
              borderRadius: '0px',
              p: 2,
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.1)',
              }
            }}
          >
            <Facebook sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton
            component="a"
            href="https://x.com/theideasandbox"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid black',
              borderRadius: '0px',
              p: 2,
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.1)',
              }
            }}
          >
            <X sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/industrious1/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid black',
              borderRadius: '0px',
              p: 2,
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.1)',
              }
            }}
          >
            <LinkedIn sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton
            component="a"
            href="https://wa.me/13096797200?text=Hi! I found you through TISB World and would love to connect!"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              border: '2px solid black',
              borderRadius: '0px',
              p: 2,
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
                transform: 'scale(1.1)',
              }
            }}
          >
            <WhatsApp sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
