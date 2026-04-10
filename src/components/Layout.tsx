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
  Close as CloseIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* NAV */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ py: 0.5, minHeight: '56px !important' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer',
              gap: 1.5,
            }}
            onClick={() => handleNavigate('/')}
          >
            <Typography
              sx={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              The Idea Sandbox
            </Typography>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 0 }}>
              {navigationItems.filter(i => i.path !== '/').map((item) => (
                <Box
                  key={item.path}
                  sx={{
                    cursor: 'pointer',
                    px: 2,
                    py: 1,
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          ) : (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'text.primary' }}
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
            backgroundColor: 'background.default',
            color: 'text.primary',
            width: 280,
            border: 'none',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ pt: 2, px: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ pt: 2 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 3,
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                transition: 'all 0.2s',
                '&:hover': { color: 'primary.main', pl: 4 },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          pt: { xs: 8, md: 8 },
          pb: 6,
          px: { xs: 0, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
