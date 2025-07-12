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
  { label: 'Podcast', path: '/podcast' },
  { label: 'Blog', path: '/blog' },
  { label: 'Art', path: '/art' },
  { label: 'Music', path: '/music' },
  { label: 'AI', path: '/ai' },
  { label: 'Timeline', path: '/timeline' },
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
      {/* BOLD TOP NAVIGATION */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'primary.main',
          boxShadow: 'none',
          borderBottom: '3px solid #D2691E',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              cursor: 'pointer',
              '&:hover img': {
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 0 8px #D2691E)'
              }
            }}
            onClick={() => handleNavigate('/')}
          >
            <img
              src={logoImage}
              alt="TISB Logo"
              style={{
                height: '45px',
                width: 'auto',
                marginRight: '16px',
                transition: 'all 0.3s ease',
              }}
            />
            <Typography
              variant="h4"
              component="div"
              sx={{ 
                fontWeight: 900,
                fontSize: '2rem',
                letterSpacing: '-0.02em',
                color: 'white',
              }}
            >
              TISB
            </Typography>
          </Box>
          
          {!isMobile ? (
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5,
              flexWrap: 'nowrap',
              overflow: 'hidden',
              maxWidth: 'calc(100vw - 300px)', // Reserve space for logo
            }}>
              {navigationItems.map((item) => (
                <Box
                  key={item.path}
                  sx={{
                    cursor: 'pointer',
                    px: { xs: 1.5, md: 2.5 },
                    py: 1.5,
                    backgroundColor: location.pathname === item.path ? '#D2691E' : 'transparent',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', md: '0.9rem' },
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0, // Allow flex shrinking
                    '&:hover': {
                      backgroundColor: '#D2691E',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              sx={{
                backgroundColor: '#D2691E',
                '&:hover': {
                  backgroundColor: '#A0522D',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - BOLD DESIGN */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#1A0E0A',
            color: 'white',
            width: 300,
          },
        }}
      >
        <Box sx={{ pt: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: '3rem',
              textAlign: 'center',
              mb: 4,
              color: '#D2691E',
            }}
          >
            MENU
          </Typography>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  cursor: 'pointer',
                  py: 2,
                  px: 4,
                  backgroundColor: location.pathname === item.path ? '#D2691E' : 'transparent',
                  mb: 1,
                  mx: 2,
                  '&:hover': { 
                    backgroundColor: '#D2691E',
                    transform: 'translateX(8px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
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
