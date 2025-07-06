import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Music from './pages/Music'
import Art from './pages/Art'
import Blog from './pages/Blog'
import Code from './pages/Code'
import AI from './pages/AI'
import Podcast from './pages/Podcast'
import Admin from './pages/Admin'

// Create a minimalistic theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#888888',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 300,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontWeight: 300,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 300,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/music" element={<Music />} />
            <Route path="/art" element={<Art />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/code" element={<Code />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
