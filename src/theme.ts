import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f5c542',
      light: '#f7d36e',
      dark: '#c49a2f',
    },
    secondary: {
      main: '#FF4500',
      light: '#FF6A33',
      dark: '#CC3700',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141210',
    },
    text: {
      primary: '#e8e4de',
      secondary: '#6b6560',
    },
    divider: '#2a2724',
  },
  typography: {
    fontFamily: '"Space Mono", "Inter", -apple-system, BlinkMacSystemFont, monospace',
    h1: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      fontSize: 'clamp(2.25rem, 6vw, 4rem)',
      lineHeight: 1.15,
    },
    h2: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      fontSize: 'clamp(1.4rem, 3vw, 1.5rem)',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.1rem',
      lineHeight: 1.3,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      color: '#6b6560',
    },
    overline: {
      fontSize: '0.6875rem',
      letterSpacing: '0.25em',
      fontWeight: 600,
      color: '#f5c542',
    },
    button: {
      textTransform: 'uppercase' as const,
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.15em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': [
          "url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap')",
        ],
        '::selection': {
          background: '#f5c542',
          color: '#0a0a0a',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141210',
          color: '#e8e4de',
          borderRadius: 0,
          border: '1px solid #2a2724',
          boxShadow: 'none',
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: '#f5c542',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
        },
        outlined: {
          borderColor: '#2a2724',
          color: '#e8e4de',
          '&:hover': {
            borderColor: '#f5c542',
            color: '#f5c542',
            backgroundColor: 'rgba(245,197,66,0.05)',
          },
        },
        contained: {
          backgroundColor: '#f5c542',
          color: '#0a0a0a',
          '&:hover': {
            backgroundColor: '#f7d36e',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          height: 28,
        },
        outlined: {
          borderColor: '#2a2724',
          color: '#6b6560',
          '&:hover': {
            borderColor: '#f5c542',
            color: '#f5c542',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#f5c542',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#6b6560',
          '&.Mui-selected': {
            color: '#f5c542',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#e8e4de',
          '&:hover': {
            color: '#f5c542',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});
