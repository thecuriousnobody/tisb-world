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
import Thoughts from './pages/Thoughts'
import Timeline from './pages/Timeline'
import TaskChat from './pages/TaskChat'
import Admin from './pages/Admin'
import BetaFeedback from './pages/BetaFeedback'
import AdminFeedback from './pages/AdminFeedback'
import AdminLogin from './pages/AdminLogin'
import VideoTracker from './pages/VideoTracker'
import ArtworkAdmin from './pages/ArtworkAdmin'
import { theme } from './theme'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Beta Feedback - No Layout */}
            <Route path="/beta-feedback" element={<BetaFeedback />} />
            
            {/* Admin Feedback - No Layout */}
            <Route path="/admin-feedback" element={<AdminFeedback />} />
            
            {/* Admin Login - No Layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes - No Layout */}
            <Route path="/admin/video-tracker" element={
              <ProtectedRoute>
                <Layout>
                  <VideoTracker />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/artwork" element={
              <ProtectedRoute>
                <Layout>
                  <ArtworkAdmin />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Main Site with Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/music" element={<Music />} />
                  <Route path="/art" element={<Art />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/code" element={<Code />} />
                  <Route path="/ai" element={<AI />} />
                  <Route path="/podcast" element={<Podcast />} />
                  <Route path="/thoughts" element={<Thoughts />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/task-chat" element={<TaskChat />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
