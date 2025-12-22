import { useState, useEffect } from 'react'
import { 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Alert,
  IconButton,
  Fab
} from '@mui/material'
import { 
  Add, 
  Edit, 
  Delete, 
  Save, 
  Cancel,
  Palette,
  Link as LinkIcon,
  Image as ImageIcon,
  AutoAwesome
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface ArtworkProject {
  id: string
  title: string
  description: string
  link: string
  thumbnail: string
  publishedAt: string
  platform: string
  author: string
  tags: string[]
}

interface Portfolio {
  platform: string
  items: ArtworkProject[]
  lastUpdated: string
  scrapedAt: string
  updateMethod?: string
  note?: string
}

export default function ArtworkAdmin() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ArtworkProject | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    thumbnail: '',
    tags: ''
  })

  // Load portfolio data
  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      
      // First try to load from localStorage (for admin edits)
      const localData = localStorage.getItem('tisb-artwork-portfolio')
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          setPortfolio(parsed)
          console.log('✅ Loaded portfolio from localStorage')
          return
        } catch (e) {
          console.log('Invalid localStorage data, falling back to default')
        }
      }
      
      // Fallback to default JSON file
      const response = await fetch('/data/behance-portfolio.json')
      
      if (!response.ok) {
        throw new Error('Failed to load portfolio')
      }
      
      const data = await response.json()
      setPortfolio(data)
      console.log('✅ Loaded portfolio from default JSON')
      
    } catch (err: any) {
      setError(`Failed to load portfolio: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const savePortfolio = async (newPortfolio: Portfolio) => {
    try {
      setSaving(true)
      
      // Try to save via API endpoint (if available)
      try {
        const response = await fetch('/api/artwork/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPortfolio)
        })
        
        if (response.ok) {
          setPortfolio(newPortfolio)
          setSuccess('Portfolio updated successfully via API!')
          setTimeout(() => setSuccess(''), 3000)
          return
        }
      } catch (apiError) {
        console.log('API save failed, using local storage fallback:', apiError)
      }
      
      // Fallback: Save to localStorage and update local state
      // This persists across browser sessions for the user
      localStorage.setItem('tisb-artwork-portfolio', JSON.stringify(newPortfolio))
      setPortfolio(newPortfolio)
      setSuccess('Portfolio updated successfully (saved locally)!')
      
      // Also try to trigger a file download as backup
      if (window.confirm('Portfolio saved locally. Download backup JSON file?')) {
        downloadPortfolioBackup(newPortfolio)
      }
      
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err: any) {
      setError(`Failed to save portfolio: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const downloadPortfolioBackup = (portfolio: Portfolio) => {
    const dataStr = JSON.stringify(portfolio, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `behance-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleAddProject = () => {
    setIsEditing(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      link: '',
      thumbnail: '',
      tags: 'digital art, creative'
    })
    setDialogOpen(true)
  }

  const handleEditProject = (project: ArtworkProject) => {
    setIsEditing(true)
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      link: project.link,
      thumbnail: project.thumbnail,
      tags: project.tags.join(', ')
    })
    setDialogOpen(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    if (!portfolio) return

    const updatedPortfolio = {
      ...portfolio,
      items: portfolio.items.filter(item => item.id !== projectId),
      lastUpdated: new Date().toISOString(),
      updateMethod: 'admin_panel'
    }

    await savePortfolio(updatedPortfolio)
  }

  const handleSaveProject = async () => {
    if (!portfolio) return

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    if (isEditing && editingProject) {
      // Update existing project
      const updatedProject = {
        ...editingProject,
        title: formData.title,
        description: formData.description,
        link: formData.link,
        thumbnail: formData.thumbnail,
        tags
      }

      const updatedPortfolio = {
        ...portfolio,
        items: portfolio.items.map(item => 
          item.id === editingProject.id ? updatedProject : item
        ),
        lastUpdated: new Date().toISOString(),
        updateMethod: 'admin_panel'
      }

      await savePortfolio(updatedPortfolio)
    } else {
      // Add new project
      const newProject: ArtworkProject = {
        id: createProjectId(formData.title),
        title: formData.title,
        description: formData.description,
        link: formData.link,
        thumbnail: formData.thumbnail,
        publishedAt: new Date().toISOString(),
        platform: 'behance',
        author: 'The Idea Sandbox',
        tags
      }

      const updatedPortfolio = {
        ...portfolio,
        items: [newProject, ...portfolio.items], // Add to beginning
        lastUpdated: new Date().toISOString(),
        updateMethod: 'admin_panel'
      }

      await savePortfolio(updatedPortfolio)
    }

    setDialogOpen(false)
  }

  const createProjectId = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30) + '-' + new Date().getFullYear()
  }

  // Auto-fill from Behance URL using backend API
  const fetchBehanceData = async (url: string) => {
    try {
      setSaving(true)
      setError('')
      
      const response = await fetch('/api/artwork/fetch-behance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch project data')
      }
      
      const project = data.project
      
      return {
        title: project.title,
        description: project.description,
        thumbnail: project.thumbnail,
        tags: project.tags.join(', ')
      }
      
    } catch (error: any) {
      // Fallback to URL parsing if API fails
      console.log('API fetch failed, using URL fallback:', error.message)
      
      const match = url.match(/behance\.net\/gallery\/(\d+)\/([^\/\?]+)/)
      if (match) {
        const [, , urlSlug] = match
        const title = urlSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        
        return {
          title,
          description: 'Creative project by The Idea Sandbox • View on Behance',
          thumbnail: '', // No thumbnail if API fails
          tags: 'digital art'
        }
      }
      
      throw new Error(`Failed to fetch project data: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUrlAutoFill = async () => {
    if (!formData.link) {
      setError('Please enter a Behance URL first')
      return
    }
    
    try {
      const data = await fetchBehanceData(formData.link)
      setFormData(prev => ({
        ...prev,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        tags: data.tags || 'digital art'
      }))
      setSuccess('✨ Auto-filled from Behance URL!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
          Authentication Required
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Please log in to manage artwork
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/login')}>
          Login
        </Button>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ color: 'text.secondary' }}>
          Loading Portfolio...
        </Typography>
      </Box>
    )
  }

  if (!portfolio) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}>
          Failed to Load Portfolio
        </Typography>
        <Button variant="contained" onClick={loadPortfolio}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>
            Artwork Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {portfolio.items.length} projects • Last updated: {new Date(portfolio.lastUpdated).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProject}
          size="large"
          sx={{ 
            backgroundColor: '#ff4500',
            '&:hover': { backgroundColor: '#e03d00' }
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {portfolio.items.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <Card sx={{ 
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {project.thumbnail && (
                <CardMedia
                  component="img"
                  image={project.thumbnail}
                  alt={project.title}
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    filter: 'brightness(0.8)'
                  }}
                />
              )}
              
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {project.title}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary', 
                  mb: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {project.description}
                </Typography>
                
                {/* Tags */}
                <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255, 69, 0, 0.2)',
                        color: '#ff4500',
                        fontSize: '0.7rem'
                      }}
                    />
                  ))}
                </Box>
                
                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => window.open(project.link, '_blank')}
                      sx={{ color: 'text.secondary' }}
                    >
                      <LinkIcon />
                    </IconButton>
                  </Box>
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditProject(project)}
                      sx={{ color: 'info.main' }}
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteProject(project.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#2a2a2a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette sx={{ color: '#ff4500' }} />
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          backgroundColor: '#1a1a1a',
          pt: 3,
          '& .MuiTextField-root': {
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff4500',
              },
            },
            '& .MuiFormHelperText-root': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }
        }}>
          {!isEditing && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: '#90caf9',
                '& .MuiAlert-icon': { color: '#90caf9' }
              }}
            >
              <strong>Quick Add:</strong> Paste your Behance project URL and click "Auto-fill" to automatically extract the title, description, thumbnail, and tags!
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Project Title"
              value={formData.title}
              onChange={handleFormChange('title')}
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Behance URL"
                value={formData.link}
                onChange={handleFormChange('link')}
                variant="outlined"
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Full URL to your Behance project page"
              />
              
              <Button
                variant="outlined"
                onClick={handleUrlAutoFill}
                disabled={saving || !formData.link}
                startIcon={<AutoAwesome />}
                sx={{ 
                  mt: 0.5,
                  minWidth: 140,
                  height: 56,
                  borderColor: '#ff4500',
                  color: '#ff4500',
                  '&:hover': { 
                    borderColor: '#e03d00',
                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                  }
                }}
              >
                {saving ? 'Loading...' : 'Auto-fill'}
              </Button>
            </Box>
            
            <TextField
              fullWidth
              label="Thumbnail Image URL"
              value={formData.thumbnail}
              onChange={handleFormChange('thumbnail')}
              variant="outlined"
              InputProps={{
                startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="Direct link to project thumbnail image"
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={handleFormChange('description')}
              variant="outlined"
              helperText="Brief description of your artwork"
            />
            
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={handleFormChange('tags')}
              variant="outlined"
              helperText="Comma-separated tags (e.g., digital art, abstract, consciousness)"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          backgroundColor: '#2a2a2a',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2 
        }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSaveProject}
            variant="contained"
            disabled={saving || !formData.title || !formData.link}
            startIcon={<Save />}
            sx={{ 
              backgroundColor: '#ff4500',
              '&:hover': { backgroundColor: '#e03d00' }
            }}
          >
            {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}