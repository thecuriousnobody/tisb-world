import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Fab,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Music', path: '/music' },
  { label: 'Art', path: '/art' },
  { label: 'Blog', path: '/blog' },
  { label: 'Code', path: '/code' },
  { label: 'AI', path: '/ai' },
  { label: 'Podcast', path: '/podcast' },
  { label: 'Admin', path: '/admin' },
]

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const toggleVoice = () => {
    setVoiceActive(!voiceActive)
    // TODO: Implement voice interface later
    console.log('Voice interface:', voiceActive ? 'disabled' : 'enabled')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 300, cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            TISB
          </Typography>
          
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navigationItems.map((item) => (
                <Typography
                  key={item.path}
                  variant="body1"
                  sx={{
                    cursor: 'pointer',
                    opacity: location.pathname === item.path ? 1 : 0.7,
                    '&:hover': { opacity: 1 },
                    fontWeight: location.pathname === item.path ? 400 : 300,
                  }}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  cursor: 'pointer',
                  opacity: location.pathname === item.path ? 1 : 0.7,
                  '&:hover': { opacity: 1 },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 400 : 300,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          pt: { xs: 10, md: 12 },
          pb: 4,
        }}
      >
        {children}
      </Container>

      {/* Voice Interface FAB */}
      <Fab
        color={voiceActive ? 'primary' : 'secondary'}
        aria-label="voice interface"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          opacity: 0.8,
          '&:hover': { opacity: 1 },
        }}
        onClick={toggleVoice}
      >
        {voiceActive ? <MicIcon /> : <MicOffIcon />}
      </Fab>
    </Box>
  )
}
