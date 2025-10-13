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
  editor?: string
  notes?: string
  instructions?: string
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
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
  const [videos, setVideos] = useState<Video[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [instructionsDialog, setInstructionsDialog] = useState<{ open: boolean; videoId: string | null }>({ 
    open: false, 
    videoId: null 
  })
  const [instructionsText, setInstructionsText] = useState('')
  const [newComment, setNewComment] = useState('')
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

  const handleOpenInstructions = (videoId: string) => {
    const video = videos.find(v => v.id === videoId)
    if (video) {
      setInstructionsText(video.instructions || '')
      setInstructionsDialog({ open: true, videoId })
    }
  }

  const handleCloseInstructions = () => {
    setInstructionsDialog({ open: false, videoId: null })
    setInstructionsText('')
    setNewComment('')
  }

  const handleSaveInstructions = () => {
    if (instructionsDialog.videoId) {
      setVideos(videos.map(v => 
        v.id === instructionsDialog.videoId 
          ? { ...v, instructions: instructionsText, updatedAt: new Date().toISOString() }
          : v
      ))
    }
  }

  const handleAddComment = () => {
    if (instructionsDialog.videoId && newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: user?.name || user?.email || 'Unknown',
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      }
      
      setVideos(videos.map(v => 
        v.id === instructionsDialog.videoId 
          ? { 
              ...v, 
              comments: [...(v.comments || []), comment],
              updatedAt: new Date().toISOString() 
            }
          : v
      ))
      setNewComment('')
    }
  }

  const handleCopyInstructions = () => {
    const video = videos.find(v => v.id === instructionsDialog.videoId)
    if (video) {
      const textToCopy = `Instructions for "${video.title}":
${instructionsText}

Comments:
${(video.comments || []).map(c => `${c.author} (${new Date(c.timestamp).toLocaleString()}): ${c.text}`).join('\n')}
      `
      navigator.clipboard.writeText(textToCopy)
    }
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
              <TableCell>Editor</TableCell>
              <TableCell>Riverside Link</TableCell>
              <TableCell>Instructions</TableCell>
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
                  <Button
                    size="small"
                    variant={video.instructions || video.comments?.length ? "contained" : "outlined"}
                    onClick={() => handleOpenInstructions(video.id)}
                    sx={{
                      minWidth: 100,
                      backgroundColor: video.instructions || video.comments?.length ? '#fff' : 'transparent',
                      color: video.instructions || video.comments?.length ? '#000' : 'rgba(255, 255, 255, 0.7)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: video.instructions || video.comments?.length ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      }
                    }}
                  >
                    {video.instructions ? 'View' : 'Add'}
                  </Button>
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
              label="Editor Name"
              value={formData.editor}
              onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
              fullWidth
              placeholder="Assigned editor's name"
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

      {/* Instructions & Comments Dialog */}
      <Dialog 
        open={instructionsDialog.open} 
        onClose={handleCloseInstructions}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Typography variant="h6">
            Custom Instructions - {videos.find(v => v.id === instructionsDialog.videoId)?.title}
          </Typography>
          <Box>
            <IconButton onClick={handleCopyInstructions} sx={{ color: '#fff' }}>
              <CopyIcon />
            </IconButton>
            <IconButton onClick={handleCloseInstructions} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.7 }}>
            Video Editing Instructions
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            onBlur={handleSaveInstructions}
            placeholder="Add your creative vision here: How should this video feel? What's the pacing? Any specific cuts, transitions, or effects? Music suggestions? Key moments to highlight?"
            sx={{
              mb: 3,
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#fff' },
              },
            }}
          />

          <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.7 }}>
            Comments & Communication
          </Typography>
          
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {videos.find(v => v.id === instructionsDialog.videoId)?.comments?.map((comment) => (
              <Paper 
                key={comment.id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {comment.author}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {comment.text}
                </Typography>
              </Paper>
            ))}
            {(!videos.find(v => v.id === instructionsDialog.videoId)?.comments?.length) && (
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center' }}>
                No comments yet
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
              sx={{
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
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
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}