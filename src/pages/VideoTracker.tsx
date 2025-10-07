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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Refresh,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

interface Video {
  id: string
  title: string
  riversideLink: string
  status: 'not_started' | 'in_progress' | 'done'
  editor?: string
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
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    riversideLink: '',
    status: 'not_started' as Video['status'],
    editor: '',
    notes: '',
  })

  // Load videos from localStorage (temporary storage until backend is ready)
  useEffect(() => {
    const storedVideos = localStorage.getItem('video-tracker-data')
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos))
    }
  }, [])

  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('video-tracker-data', JSON.stringify(videos))
  }, [videos])

  const handleOpenDialog = (video?: Video) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        title: video.title,
        riversideLink: video.riversideLink,
        status: video.status,
        editor: video.editor || '',
        notes: video.notes || '',
      })
    } else {
      setEditingVideo(null)
      setFormData({
        title: '',
        riversideLink: '',
        status: 'not_started',
        editor: '',
        notes: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingVideo(null)
  }

  const handleSubmit = () => {
    const now = new Date().toISOString()
    
    if (editingVideo) {
      // Update existing video
      setVideos(videos.map(v => 
        v.id === editingVideo.id 
          ? { ...v, ...formData, updatedAt: now }
          : v
      ))
    } else {
      // Add new video
      const newVideo: Video = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      }
      setVideos([...videos, newVideo])
    }
    
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: Video['status']) => {
    setVideos(videos.map(v => 
      v.id === id 
        ? { ...v, status: newStatus, updatedAt: new Date().toISOString() }
        : v
    ))
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

  const stats = getStats()

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Video Production Tracker
        </Typography>
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
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <Typography variant="h4">{stats.total}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Videos</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <Typography variant="h4" color="text.secondary">{stats.not_started}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>Not Started</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
            <Typography variant="h4" color="warning.main">{stats.in_progress}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>In Progress</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
            <Typography variant="h4" color="success.main">{stats.done}</Typography>
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
              <TableCell>Editor</TableCell>
              <TableCell>Riverside Link</TableCell>
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
                  {video.notes && (
                    <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
                      {video.notes}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={video.status}
                    onChange={(e) => handleStatusChange(video.id, e.target.value as Video['status'])}
                    size="small"
                    sx={{ minWidth: 140 }}
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
                <TableCell>{video.editor || '-'}</TableCell>
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Video Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Riverside Link"
              value={formData.riversideLink}
              onChange={(e) => setFormData({ ...formData, riversideLink: e.target.value })}
              fullWidth
              required
              placeholder="https://riverside.fm/..."
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Video['status'] })}
                label="Status"
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Editor Name"
              value={formData.editor}
              onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
              fullWidth
              placeholder="Assigned editor's name"
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Any additional notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.riversideLink}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            {editingVideo ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}