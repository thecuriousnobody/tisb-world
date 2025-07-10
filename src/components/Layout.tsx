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
} from '@mui/material'
import {
  Menu as MenuIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImage from '../assets/TISB Logo Transparent.png'
import { VoiceAssistant } from './VoiceAssistant'

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
  { label: 'Task Chat', path: '/task-chat' },
  { label: 'Admin', path: '/admin' },
]

export default function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
        <Toolbar>
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              cursor: 'pointer',
              '&:hover img': {
                transform: 'scale(1.05)',
                filter: 'brightness(1.2) contrast(1.2)'
              }
            }}
            onClick={() => handleNavigate('/')}
          >
            <img
              src={logoImage}
              alt="TISB Logo"
              style={{
                height: '40px',
                width: 'auto',
                marginRight: '12px',
                transition: 'all 0.3s ease',
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 400,
                fontSize: '1.25rem',
                letterSpacing: '0.02em',
              }}
            >
              TISB
            </Typography>
          </Box>
          
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
                    fontWeight: location.pathname === item.path ? 500 : 300,
                    fontSize: '0.95rem',
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
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
          pt: { xs: 12, md: 14 },
          pb: 6,
          px: { xs: 3, md: 4 },
        }}
      >
        {children}
      </Container>

      {/* Voice Assistant */}
      <VoiceAssistant />
    </Box>
  )
}
