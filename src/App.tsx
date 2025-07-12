import { ThemeProvider } from '@mui/material/styles'
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
import Timeline from './pages/Timeline'
import TaskChat from './pages/TaskChat'
import Admin from './pages/Admin'
import { theme } from './theme'

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
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/task-chat" element={<TaskChat />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
