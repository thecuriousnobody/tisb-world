import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Stack,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  ErrorOutline as ErrorIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material'

type PlatformId = 'email' | 'linkedin' | 'facebook' | 'instagram'

interface PlatformInfo {
  id: PlatformId
  label: string
  configured: boolean
}

interface PostResult {
  ok: boolean
  error?: string
  response?: unknown
  at: string
}

interface Post {
  id: string
  body: string
  image_url: string | null
  platforms: PlatformId[]
  scheduled_at: string
  status: 'scheduled' | 'published' | 'partial' | 'failed'
  results: Record<string, PostResult>
  created_at: string
  updated_at: string
  published_at?: string | null
}

const ALL_PLATFORMS: { id: PlatformId; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
]

function toLocalDateTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function defaultScheduledLocal() {
  const d = new Date(Date.now() + 30 * 60 * 1000)
  return toLocalDateTime(d.toISOString())
}

export default function ContentEngine() {
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selected, setSelected] = useState<Set<PlatformId>>(new Set())
  const [scheduledLocal, setScheduledLocal] = useState(defaultScheduledLocal())
  const [posts, setPosts] = useState<Post[]>([])
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch('/api/content/posts')
      if (!res.ok) throw new Error(`Load failed: ${res.status}`)
      const data = await res.json()
      setPosts(data.posts || [])
      setPlatforms(data.platforms || [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  function togglePlatform(id: PlatformId) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/content/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImageUrl(data.url)
      setNotice('Image uploaded.')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setUploading(false)
    }
  }

  async function handleSchedule() {
    if (!body.trim() && !imageUrl.trim()) {
      setError('Add text or an image first.')
      return
    }
    if (selected.size === 0) {
      setError('Pick at least one platform.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const scheduled_at = new Date(scheduledLocal).toISOString()
      const res = await fetch('/api/content/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body,
          image_url: imageUrl || null,
          platforms: Array.from(selected),
          scheduled_at,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Schedule failed')
      setBody('')
      setImageUrl('')
      setSelected(new Set())
      setScheduledLocal(defaultScheduledLocal())
      setNotice('Scheduled.')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePublishNow(id: string) {
    setError(null)
    try {
      const res = await fetch('/api/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setNotice('Published.')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function handleDelete(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/content/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function handleReschedule(id: string, newLocal: string) {
    setError(null)
    try {
      const res = await fetch('/api/content/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, scheduled_at: new Date(newLocal).toISOString() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Reschedule failed: ${res.status}`)
      }
      setNotice('Rescheduled.')
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const grouped = useMemo(() => {
    const g: Record<string, Post[]> = { scheduled: [], partial: [], published: [], failed: [] }
    for (const p of posts) {
      (g[p.status] ||= []).push(p)
    }
    return g
  }, [posts])

  const unconfigured = platforms.filter(p => !p.configured).map(p => p.label)

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          Content Engine
        </Typography>
        <Button startIcon={<RefreshIcon />} onClick={refresh} disabled={loading}>
          Refresh
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice(null)}>{notice}</Alert>}
      {unconfigured.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not configured yet: <strong>{unconfigured.join(', ')}</strong>. Posts to these platforms will fail until env vars are set.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Compose</Typography>
        <TextField
          label="What do you want to post?"
          fullWidth
          multiline
          minRows={3}
          maxRows={12}
          value={body}
          onChange={e => setBody(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
          <TextField
            label="Image URL (optional)"
            fullWidth
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://… or use upload →"
            InputProps={{ startAdornment: <ImageIcon sx={{ mr: 1, opacity: 0.6 }} fontSize="small" /> }}
          />
          <Button
            variant="outlined"
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Upload
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }}
          />
        </Stack>
        {imageUrl && (
          <Box sx={{ mb: 2, p: 1, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
            <img src={imageUrl} alt="" style={{ maxHeight: 120, maxWidth: 240, display: 'block', borderRadius: 4 }} />
          </Box>
        )}

        <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>Send to</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
          {ALL_PLATFORMS.map(p => {
            const cfg = platforms.find(c => c.id === p.id)
            const isOn = selected.has(p.id)
            return (
              <Tooltip key={p.id} title={cfg && !cfg.configured ? 'Not configured — posting will fail' : ''}>
                <Chip
                  label={p.label}
                  onClick={() => togglePlatform(p.id)}
                  color={isOn ? 'primary' : 'default'}
                  variant={isOn ? 'filled' : 'outlined'}
                  sx={{ opacity: cfg && !cfg.configured ? 0.6 : 1 }}
                />
              </Tooltip>
            )
          })}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label="Schedule for"
            type="datetime-local"
            value={scheduledLocal}
            onChange={e => setScheduledLocal(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 240 }}
          />
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={handleSchedule}
            disabled={submitting}
            sx={{ minWidth: 160 }}
          >
            {submitting ? 'Scheduling…' : 'Schedule post'}
          </Button>
        </Stack>
      </Paper>

      <Section title="Scheduled" posts={grouped.scheduled} onPublish={handlePublishNow} onDelete={handleDelete} onReschedule={handleReschedule} loading={loading} emptyHint="Nothing scheduled yet." />
      <Section title="Partial" posts={grouped.partial} onPublish={handlePublishNow} onDelete={handleDelete} onReschedule={handleReschedule} />
      <Section title="Failed" posts={grouped.failed} onPublish={handlePublishNow} onDelete={handleDelete} onReschedule={handleReschedule} />
      <Section title="Published" posts={grouped.published} onDelete={handleDelete} />
    </Box>
  )
}

interface SectionProps {
  title: string
  posts: Post[]
  loading?: boolean
  emptyHint?: string
  onPublish?: (id: string) => void
  onDelete?: (id: string) => void
  onReschedule?: (id: string, newLocal: string) => void
}

function Section({ title, posts, loading, emptyHint, onPublish, onDelete, onReschedule }: SectionProps) {
  if (!loading && posts.length === 0 && !emptyHint) return null
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
        {title} <Typography component="span" variant="body2" sx={{ opacity: 0.5 }}>· {posts.length}</Typography>
      </Typography>
      {loading && posts.length === 0 && <CircularProgress size={20} />}
      {!loading && posts.length === 0 && emptyHint && <Typography variant="body2" sx={{ opacity: 0.5 }}>{emptyHint}</Typography>}
      <Grid container spacing={2}>
        {posts.map(p => (
          <Grid key={p.id} size={{ xs: 12, md: 6 }}>
            <PostCard post={p} onPublish={onPublish} onDelete={onDelete} onReschedule={onReschedule} />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mt: 3, opacity: 0.2 }} />
    </Box>
  )
}

function PostCard({ post, onPublish, onDelete, onReschedule }: { post: Post; onPublish?: (id: string) => void; onDelete?: (id: string) => void; onReschedule?: (id: string, newLocal: string) => void }) {
  const [editingTime, setEditingTime] = useState(false)
  const [newLocal, setNewLocal] = useState(toLocalDateTime(post.scheduled_at))
  const when = new Date(post.scheduled_at)

  return (
    <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            {when.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {post.platforms.map(pl => {
              const r = post.results?.[pl]
              const icon = r?.ok ? <CheckIcon fontSize="inherit" /> : r ? <ErrorIcon fontSize="inherit" /> : null
              return (
                <Tooltip key={pl} title={r?.error || (r?.ok ? 'published' : 'pending')}>
                  <Chip
                    size="small"
                    label={pl}
                    icon={icon || undefined}
                    color={r?.ok ? 'success' : r ? 'error' : 'default'}
                    variant={r ? 'filled' : 'outlined'}
                  />
                </Tooltip>
              )
            })}
          </Stack>
        </Stack>
        {post.body && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: post.image_url ? 1 : 0 }}>
            {post.body}
          </Typography>
        )}
        {post.image_url && (
          <Box sx={{ mt: 1 }}>
            <img src={post.image_url} alt="" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 4 }} />
          </Box>
        )}
        {editingTime && onReschedule && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <TextField
              size="small"
              type="datetime-local"
              value={newLocal}
              onChange={e => setNewLocal(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button size="small" onClick={() => { onReschedule(post.id, newLocal); setEditingTime(false) }}>Save</Button>
            <Button size="small" onClick={() => setEditingTime(false)}>Cancel</Button>
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {onReschedule && !editingTime && (
          <Tooltip title="Reschedule">
            <IconButton size="small" onClick={() => setEditingTime(true)}>
              <ScheduleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onPublish && (
          <Tooltip title="Publish now">
            <IconButton size="small" onClick={() => onPublish(post.id)}>
              <PlayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(post.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  )
}
