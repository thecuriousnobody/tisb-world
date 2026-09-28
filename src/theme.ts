import { createTheme } from '@mui/material/styles'
import { C, F } from './design/tokens'

/**
 * MUI theme for the "Signal" system.
 *
 * The public pages mostly style themselves with tokens from src/design; this
 * theme exists so anything still built from stock MUI components (admin tools,
 * the video tracker, older utility pages) lands in the same visual language.
 *
 * Deliberately NOT set on headings: responsive font-size media queries or
 * `overflow: hidden`. The previous theme had both, and they silently beat
 * page-level `sx` on phones — that's what once rendered the /prints hero at
 * 64px and clipped the tops off its capitals. Pages own their type scale.
 */
const display = { fontFamily: F.display, fontWeight: 400, letterSpacing: '.02em' }

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: C.ink, contrastText: C.paper },
    secondary: { main: C.vermilion, contrastText: C.paper },
    error: { main: C.vermilion },
    background: { default: C.paper, paper: C.paperPure },
    text: { primary: C.ink, secondary: C.inkSoft },
    divider: C.hairline,
  },
  shape: { borderRadius: 0 },
  shadows: Array(25).fill('none') as unknown as ReturnType<typeof createTheme>['shadows'],
  typography: {
    fontFamily: F.body,
    h1: { ...display, lineHeight: 1.05 },
    h2: { ...display, lineHeight: 1.1 },
    h3: { ...display, lineHeight: 1.15 },
    h4: { ...display, lineHeight: 1.2 },
    h5: { ...display, lineHeight: 1.3 },
    h6: { ...display, lineHeight: 1.35 },
    body1: { fontSize: '1.0625rem', lineHeight: 1.7, fontWeight: 300 },
    body2: { fontSize: '0.9375rem', lineHeight: 1.6, fontWeight: 300 },
    button: { fontFamily: F.mono, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' },
    caption: { fontFamily: F.mono, letterSpacing: '.12em' },
    overline: { fontFamily: F.mono, letterSpacing: '.16em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: C.paper } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none', border: `1px solid ${C.hairline}` } },
    },
    MuiCard: {
      // Legacy utility pages were written for black cards with white text.
      // Keeping cards as ink bands preserves their legibility, and ink bands
      // are part of the Signal vocabulary anyway (footer, CTA bands).
      styleOverrides: { root: { backgroundColor: C.ink, color: C.paper, borderRadius: 0, border: 0 } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 0, padding: '14px 20px' },
        contained: { backgroundColor: C.ink, color: C.paper, '&:hover': { backgroundColor: C.vermilion } },
        outlined: { borderColor: C.ink, color: C.ink, '&:hover': { borderColor: C.vermilion, color: C.vermilion, background: 'transparent' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 0, fontFamily: F.mono, fontSize: 10, letterSpacing: '.14em' } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 0 } },
    },
  },
})
