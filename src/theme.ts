import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A0E0A', // Rich dark brown/black
      light: '#3D2B1F',
      dark: '#000000',
    },
    secondary: {
      main: '#FF4500', // BRIGHT BOLD ORANGE
      light: '#FF6A33',
      dark: '#CC3700',
    },
    background: {
      default: '#FF4500', // BRIGHT ORANGE BACKGROUND
      paper: '#000000', // Pure black
    },
    text: {
      primary: '#000000', // Pure black text on orange
      secondary: '#333333', // Dark gray
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
    fontFamily: '"Yapari", "Yapari Extended", "Yapari Wide", "Yapari Expanded", "Black Ops One", "Bungee", "Archivo Black", "Russo One", "Fredoka One", "Righteous", "Racing Sans One", "Orbitron", "Bebas Neue", "Anton", "Oswald", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 900, // MAXIMUM BOLD
      fontSize: '8rem', // MASSIVE
      lineHeight: 0.9,
      letterSpacing: '-0.03em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      '@media (max-width:768px)': {
        fontSize: '4rem',
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: '5rem',
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      '@media (max-width:768px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.0,
      letterSpacing: '-0.015em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      '@media (max-width:768px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      '@media (max-width:768px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',
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
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '0px', // Sharp edges for boldness
          border: 'none',
          boxShadow: 'none',
          overflow: 'hidden', // Prevent content overflow
          display: 'flex',
          flexDirection: 'column',
          minHeight: '200px', // Ensure consistent card heights
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px', // No rounded corners
          padding: '16px 32px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: '0.5px',
        },
        outlined: {
          borderColor: '#1A0E0A',
          borderWidth: '2px',
          color: '#1A0E0A',
          '&:hover': {
            borderColor: '#D2691E',
            color: '#D2691E',
            backgroundColor: 'transparent',
            borderWidth: '2px',
          },
        },
        contained: {
          backgroundColor: '#1A0E0A',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#D2691E',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '0.75rem',
        },
        outlined: {
          borderColor: '#1A0E0A',
          color: '#1A0E0A',
          borderWidth: '1px',
          '&:hover': {
            backgroundColor: '#D2691E',
            color: '#ffffff',
            borderColor: '#D2691E',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 0, // No rounded corners anywhere
  },
});
