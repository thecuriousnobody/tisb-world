import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Refresh,
  Comment as CommentIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

interface Video {
  id: string
  title: string
  riversideLink: string
  status: 'not_started' | 'in_progress' | 'done'
  sentiment?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
}

interface Music {
  id: string
  title: string
  googleDriveLink: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  not_started: 'default',
  in_progress: 'warning',
  done: 'success',
} as const

const statusIcons = {
  not_started: <RadioButtonUnchecked fontSize="small" />,
  in_progress: <Refresh fontSize="small" />,
  done: <CheckCircle fontSize="small" />,
}

export default function VideoTracker() {
  const { user, logout } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [videos, setVideos] = useState<Video[]>([])
  const [music, setMusic] = useState<Music[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openMusicDialog, setOpenMusicDialog] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    riversideLink: '',
    status: 'not_started' as Video['status'],
    sentiment: '',
    notes: '',
  })
  const [musicFormData, setMusicFormData] = useState({
    title: '',
    googleDriveLink: '',
    notes: '',
  })

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/notion/videos')
      if (!response.ok) throw new Error('Failed to fetch videos')
      const data = await response.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  useEffect(() => {
    fetchVideos()
    
    const storedMusic = localStorage.getItem('music-library-data')
    if (storedMusic) {
      setMusic(JSON.parse(storedMusic))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('music-library-data', JSON.stringify(music))
  }, [music])

  const handleOpenDialog = (video?: Video) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        title: video.title,
        riversideLink: video.riversideLink,
        status: video.status,
        sentiment: video.sentiment || '',
        notes: video.notes || '',
      })
    } else {
      setEditingVideo(null)
      setFormData({
        title: '',
        riversideLink: '',
        status: 'not_started',
        sentiment: '',
        notes: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingVideo(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingVideo) {
        const response = await fetch('/api/notion/videos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingVideo.id, ...formData })
        })
        if (!response.ok) throw new Error('Failed to update video')
      } else {
        const response = await fetch('/api/notion/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!response.ok) throw new Error('Failed to create video')
      }
      
      await fetchVideos()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving video:', error)
      alert('Failed to save video. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch('/api/notion/videos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        })
        if (!response.ok) throw new Error('Failed to delete video')
        await fetchVideos()
      } catch (error) {
        console.error('Error deleting video:', error)
        alert('Failed to delete video. Please try again.')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: Video['status']) => {
    try {
      const response = await fetch('/api/notion/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      await fetchVideos()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const getStats = () => {
    const stats = {
      total: videos.length,
      not_started: videos.filter(v => v.status === 'not_started').length,
      in_progress: videos.filter(v => v.status === 'in_progress').length,
      done: videos.filter(v => v.status === 'done').length,
    }
    return stats
  }

  // Music handlers
  const handleOpenMusicDialog = (musicTrack?: Music) => {
    if (musicTrack) {
      setEditingMusic(musicTrack)
      setMusicFormData({
        title: musicTrack.title,
        googleDriveLink: musicTrack.googleDriveLink,
        notes: musicTrack.notes || '',
      })
    } else {
      setEditingMusic(null)
      setMusicFormData({
        title: '',
        googleDriveLink: '',
        notes: '',
      })
    }
    setOpenMusicDialog(true)
  }

  const handleCloseMusicDialog = () => {
    setOpenMusicDialog(false)
    setEditingMusic(null)
  }

  const handleMusicSubmit = () => {
    const now = new Date().toISOString()
    
    if (editingMusic) {
      // Update existing music
      setMusic(music.map(m => 
        m.id === editingMusic.id 
          ? { ...m, ...musicFormData, updatedAt: now }
          : m
      ))
    } else {
      // Add new music
      const newMusic: Music = {
        id: Date.now().toString(),
        ...musicFormData,
        createdAt: now,
        updatedAt: now,
      }
      setMusic([...music, newMusic])
    }
    
    handleCloseMusicDialog()
  }

  const handleDeleteMusic = (id: string) => {
    if (confirm('Are you sure you want to delete this music track?')) {
      setMusic(music.filter(m => m.id !== id))
    }
  }

  const stats = getStats()

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Video Production Tracker
        </Typography>
        {tabValue === 0 ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            Add Video
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenMusicDialog()}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            Add Music
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': { backgroundColor: '#fff' },
          '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .Mui-selected': { color: '#fff' },
        }}
      >
        <Tab label="Videos" />
        <Tab label="Music Library" />
      </Tabs>

      {/* Tab Content */}
      {tabValue === 0 && (
        <>
          {/* Statistics */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <Typography variant="h4">{stats.total}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Videos</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="h4" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{stats.not_started}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Not Started</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107'
          }}>
            <Typography variant="h4" sx={{ color: '#ffc107' }}>{stats.in_progress}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>In Progress</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid #4caf50'
          }}>
            <Typography variant="h4" sx={{ color: '#4caf50' }}>{stats.done}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Completed</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Video Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Riverside Link</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {video.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Select
                    value={video.status}
                    onChange={(e) => handleStatusChange(video.id, e.target.value as Video['status'])}
                    size="small"
                    sx={{ 
                      minWidth: 140,
                      backgroundColor: 
                        video.status === 'not_started' ? 'transparent' :
                        video.status === 'in_progress' ? 'rgba(255, 193, 7, 0.2)' :
                        video.status === 'done' ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
                      color:
                        video.status === 'not_started' ? 'rgba(255, 255, 255, 0.7)' :
                        video.status === 'in_progress' ? '#ffc107' :
                        video.status === 'done' ? '#4caf50' : 'inherit',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 
                          video.status === 'not_started' ? 'rgba(255, 255, 255, 0.2)' :
                          video.status === 'in_progress' ? '#ffc107' :
                          video.status === 'done' ? '#4caf50' : 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 
                          video.status === 'not_started' ? 'rgba(255, 255, 255, 0.4)' :
                          video.status === 'in_progress' ? '#ffca28' :
                          video.status === 'done' ? '#66bb6a' : 'rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 
                          video.status === 'not_started' ? 'rgba(255, 255, 255, 0.6)' :
                          video.status === 'in_progress' ? '#ffd54f' :
                          video.status === 'done' ? '#81c784' : 'rgba(255, 255, 255, 0.6)',
                      },
                      '& .MuiSelect-icon': {
                        color: 
                          video.status === 'not_started' ? 'rgba(255, 255, 255, 0.5)' :
                          video.status === 'in_progress' ? '#ffc107' :
                          video.status === 'done' ? '#4caf50' : 'rgba(255, 255, 255, 0.5)',
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#000',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          '& .MuiMenuItem-root': {
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="not_started">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.not_started} Not Started
                      </Box>
                    </MenuItem>
                    <MenuItem value="in_progress">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.in_progress} In Progress
                      </Box>
                    </MenuItem>
                    <MenuItem value="done">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {statusIcons.done} Done
                      </Box>
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    href={video.riversideLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {video.sentiment || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {video.notes || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(video.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(video)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(video.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {videos.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              No videos added yet. Click "Add Video" to get started.
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Video Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <TextField
              label="Riverside Link"
              value={formData.riversideLink}
              onChange={(e) => setFormData({ ...formData, riversideLink: e.target.value })}
              fullWidth
              required
              placeholder="https://riverside.fm/..."
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <FormControl 
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Video['status'] })}
                label="Status"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#000',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '& .MuiMenuItem-root': {
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Sentiment"
              value={formData.sentiment}
              onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Describe the mood/tone: inspiring, educational, controversial, funny, etc."
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Any additional notes..."
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.riversideLink}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              '&:disabled': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'rgba(255, 255, 255, 0.3)' 
              }
            }}
          >
            {editingVideo ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}

      {/* Music Library Tab */}
      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Song Title</TableCell>
                <TableCell>Google Drive Link</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {track.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      href={track.googleDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main' }}
                    >
                      <LinkIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {track.notes || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(track.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenMusicDialog(track)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteMusic(track.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {music.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                No music tracks added yet. Click "Add Music" to get started.
              </Typography>
            </Box>
          )}
        </TableContainer>
      )}

      {/* Music Add/Edit Dialog */}
      <Dialog 
        open={openMusicDialog} 
        onClose={handleCloseMusicDialog}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>{editingMusic ? 'Edit Music Track' : 'Add New Music Track'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Song Title"
              value={musicFormData.title}
              onChange={(e) => setMusicFormData({ ...musicFormData, title: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <TextField
              label="Google Drive Link"
              value={musicFormData.googleDriveLink}
              onChange={(e) => setMusicFormData({ ...musicFormData, googleDriveLink: e.target.value })}
              fullWidth
              required
              placeholder="https://drive.google.com/..."
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <TextField
              label="Notes"
              value={musicFormData.notes}
              onChange={(e) => setMusicFormData({ ...musicFormData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Suggest which video clips might work well with this track..."
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 2 }}>
          <Button 
            onClick={handleCloseMusicDialog}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMusicSubmit}
            variant="contained"
            disabled={!musicFormData.title || !musicFormData.googleDriveLink}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              '&:disabled': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'rgba(255, 255, 255, 0.3)' 
              }
            }}
          >
            {editingMusic ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}