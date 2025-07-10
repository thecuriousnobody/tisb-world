import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    background: {
      default: '#f8f8f8',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", "Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: '24px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          padding: '10px 28px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
        },
        outlined: {
          borderColor: '#e0e0e0',
          color: '#1a1a1a',
          '&:hover': {
            borderColor: '#1a1a1a',
            backgroundColor: 'rgba(26, 26, 26, 0.04)',
          },
        },
        contained: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 300,
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
});
