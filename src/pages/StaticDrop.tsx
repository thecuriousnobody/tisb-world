import { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { upload } from '@vercel/blob/client'
import { getAdminCredential } from '../utils/adminCredential'

const URL_RE = /https?:\/\/[^\s)\]}"']+/g
const TCO_LENGTH = 23
const X_LIMIT = 280
const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

interface UploadedImage {
  url: string
  contentType: string
  size: number
}

interface ScheduledItem {
  id: string
  content: string
  scheduled_at: string
  approved_by?: string
  images?: UploadedImage[]
}

interface CampaignMetric {
  posted_at?: string
  x?: { impressions: number; likes: number; retweets: number; replies: number }
  facebook?: { reactions: number; comments: number; shares: number }
  linkedin?: { status: string }
  clicks?: { total: number; x?: number; linkedin?: number; facebook?: number }
}

function xLength(text: string): number {
  return text.replace(URL_RE, 'x'.repeat(TCO_LENGTH)).length
}

function newClientRef(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

const DRAFT_KEY = 'static-drop-draft'

export default function StaticDrop() {
  const [content, setContent] = useState('')
  const [linkedinText, setLinkedinText] = useState('')
  const [facebookText, setFacebookText] = useState('')
  const [platforms, setPlatforms] = useState({ x: true, linkedin: true, facebook: true })
  const [images, setImages] = useState<UploadedImage[]>([])
  const [scheduledFor, setScheduledFor] = useState('')
  const [clientRef, setClientRef] = useState(newClientRef)
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState<'approve' | 'postnow' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [scheduled, setScheduled] = useState<ScheduledItem[]>([])
  const [metrics, setMetrics] = useState<Record<string, CampaignMetric>>({})
  const [recentPosted, setRecentPosted] = useState<ScheduledItem[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const restoredRef = useRef(false)

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  async function apiFetch(path: string, init?: RequestInit) {
    const cred = getAdminCredential()
    if ('expired' in cred) {
      setSessionExpired(true)
      throw new Error('Session expired')
    }
    const res = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cred.token}`,
        ...(init?.headers || {}),
      },
    })
    const json = await res.json().catch(() => ({}))
    if (res.status === 401) {
      setSessionExpired(true)
      throw new Error(json.error || 'Session expired')
    }
    if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
    return json
  }

  const refreshStatus = () => {
    apiFetch('/api/static/status')
      .then((s) => {
        setScheduled(s.scheduled || [])
        setRecentPosted(s.recentCampaigns || [])
      })
      .catch(() => {})
    apiFetch('/api/static/metrics')
      .then((m) => setMetrics(m.metrics || {}))
      .catch(() => {})
  }

  // Restore draft once, then persist on every change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        setContent(d.content || '')
        setLinkedinText(d.linkedinText || '')
        setFacebookText(d.facebookText || '')
        setPlatforms(d.platforms || { x: true, linkedin: true, facebook: true })
        setImages(d.images || [])
        setScheduledFor(d.scheduledFor || '')
        if (d.clientRef) setClientRef(d.clientRef)
      }
    } catch {
      // corrupted draft — start fresh
    }
    restoredRef.current = true
    refreshStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!restoredRef.current) return
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ content, linkedinText, facebookText, platforms, images, scheduledFor, clientRef })
    )
  }, [content, linkedinText, facebookText, platforms, images, scheduledFor, clientRef])

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setContent('')
    setLinkedinText('')
    setFacebookText('')
    setPlatforms({ x: true, linkedin: true, facebook: true })
    setImages([])
    setScheduledFor('')
    setClientRef(newClientRef())
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    setError(null)
    const cred = getAdminCredential()
    if ('expired' in cred) {
      setSessionExpired(true)
      return
    }
    for (const file of Array.from(files)) {
      if (images.length >= MAX_IMAGES) break
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('JPEG or PNG only.')
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`${file.name} is over 4MB.`)
        continue
      }
      setUploading(true)
      try {
        const blob = await upload(`static/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/static/upload',
          headers: { Authorization: `Bearer ${cred.token}` },
        })
        setImages((prev) => [...prev, { url: blob.url, contentType: file.type, size: file.size }])
      } catch (e) {
        setError(`Upload failed: ${(e as Error).message}`)
      } finally {
        setUploading(false)
      }
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = async (postNow: boolean) => {
    setError(null)
    setNotice(null)
    if (!content.trim()) {
      setError('Write the post first.')
      return
    }
    if (!postNow && !scheduledFor) {
      setError('Pick a date and time (or use Post Now).')
      return
    }
    setBusy(postNow ? 'postnow' : 'approve')
    try {
      const result = await apiFetch('/api/static/approve', {
        method: 'POST',
        body: JSON.stringify({
          item: {
            content: content.trim(),
            ...(linkedinText.trim() ? { linkedin_text: linkedinText.trim() } : {}),
            ...(facebookText.trim() ? { facebook_text: facebookText.trim() } : {}),
            platforms,
            images,
            scheduled_at: postNow ? undefined : new Date(scheduledFor).toISOString(),
            client_ref: clientRef,
          },
          postNow,
        }),
      })
      setNotice(
        result.duplicate
          ? 'Already queued (this draft was approved before).'
          : postNow
            ? `Queued and posting now (${result.links} tracked link${result.links === 1 ? '' : 's'}).`
            : `Scheduled for ${new Date(result.scheduled_at).toLocaleString()} (${result.links} tracked link${result.links === 1 ? '' : 's'}).`
      )
      clearDraft()
      refreshStatus()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const cancelItem = async (id: string) => {
    try {
      await apiFetch('/api/static/cancel', { method: 'POST', body: JSON.stringify({ id }) })
      refreshStatus()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const xCount = xLength(content)
  const enabledPreviews = [
    platforms.x && { key: 'X', text: content },
    platforms.linkedin && { key: 'LinkedIn', text: linkedinText.trim() || content },
    platforms.facebook && { key: 'Facebook', text: facebookText.trim() || content },
  ].filter(Boolean) as { key: string; text: string }[]

  if (sessionExpired) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="warning">
          Your session expired. <a href="/admin/login">Sign out and back in</a> to continue.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Bebas Neue, sans-serif' }}>
        STATIC DROP
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drop marketing copy + images. It fans out to X, LinkedIn, and Facebook on schedule, with
        every link click-tracked.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice(null)}>{notice}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Post text (all platforms unless overridden)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            helperText={
              platforms.x
                ? `X length after link wrapping: ${xCount}/${X_LIMIT}${xCount > X_LIMIT ? ' — too long for X' : ''}`
                : undefined
            }
            error={platforms.x && xCount > X_LIMIT}
            sx={{ mb: 2 }}
          />

          <Accordion disableGutters elevation={0} sx={{ mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">Adjust per platform (optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  fullWidth multiline minRows={3}
                  label="LinkedIn override"
                  placeholder={content || 'Falls back to the main text'}
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                />
                <TextField
                  fullWidth multiline minRows={3}
                  label="Facebook override"
                  placeholder={content || 'Falls back to the main text'}
                  value={facebookText}
                  onChange={(e) => setFacebookText(e.target.value)}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {(['x', 'linkedin', 'facebook'] as const).map((p) => (
              <Chip
                key={p}
                label={p === 'x' ? 'X' : p === 'linkedin' ? 'LinkedIn' : 'Facebook'}
                color={platforms[p] ? 'primary' : 'default'}
                variant={platforms[p] ? 'filled' : 'outlined'}
                onClick={() => setPlatforms((prev) => ({ ...prev, [p]: !prev[p] }))}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={uploading ? <CircularProgress size={16} /> : <ImageIcon />}
              onClick={() => fileRef.current?.click()}
              disabled={uploading || images.length >= MAX_IMAGES}
            >
              {uploading ? 'Uploading…' : `Add image (${images.length}/${MAX_IMAGES})`}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            {images.map((img) => (
              <Box key={img.url} sx={{ position: 'relative' }}>
                <img src={img.url} alt="" style={{ height: 56, borderRadius: 4 }} />
                <IconButton
                  size="small"
                  onClick={() => setImages((prev) => prev.filter((i) => i.url !== img.url))}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'background.paper' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>

          <TextField
            type="datetime-local"
            label={`Post at (${timeZone})`}
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, minWidth: 260 }}
            helperText="Posts within ~45 minutes of this time"
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              disabled={busy !== null || uploading}
              onClick={() => submit(false)}
            >
              {busy === 'approve' ? <CircularProgress size={22} /> : 'APPROVE & SCHEDULE'}
            </Button>
            <Button variant="outlined" size="large" disabled={busy !== null || uploading} onClick={() => submit(true)}>
              {busy === 'postnow' ? <CircularProgress size={22} /> : 'Post now instead'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {enabledPreviews.length > 0 && content.trim() && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Preview</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Links become tisb.world/go/… tracking links on approve.
          </Typography>
          <Stack spacing={1}>
            {enabledPreviews.map((p) => (
              <Card key={p.key} variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Chip label={p.key} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{p.text}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {scheduled.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Scheduled</Typography>
          <Stack spacing={1}>
            {scheduled.map((s) => (
              <Card key={s.id} variant="outlined">
                <CardContent sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {s.images?.[0] && <img src={s.images[0].url} alt="" style={{ height: 40, borderRadius: 4 }} />}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>{s.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(s.scheduled_at).toLocaleString()} · {s.approved_by}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => cancelItem(s.id)} title="Cancel">
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {recentPosted.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Results</Typography>
          <Stack spacing={1}>
            {recentPosted.map((p) => {
              const m = metrics[p.id]
              return (
                <Card key={p.id} variant="outlined">
                  <CardContent sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {p.images?.[0] && <img src={p.images[0].url} alt="" style={{ height: 40, borderRadius: 4 }} />}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>{p.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {m
                          ? `Clicks ${m.clicks?.total ?? 0}` +
                            (m.x ? ` · X ${m.x.likes}♥ ${m.x.impressions} views` : '') +
                            (m.facebook ? ` · FB ${m.facebook.reactions}♥ ${m.facebook.shares} shares` : '')
                          : 'Metrics land after the weekly fetch'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </Box>
      )}
    </Container>
  )
}
