import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import { getAdminCredential } from '../utils/adminCredential'

// The site theme is black-text-on-orange; cards are pure black, so inputs and
// outlined buttons inside a Card need explicit colors or they disappear.
// Same pattern as StaticDrop.tsx.
const ORANGE = '#FF4500'
const ORANGE_LIGHT = '#FF6A33'
const CARD_MUTED = 'rgba(255,255,255,0.72)'
const fieldSx = {
  '& .MuiInputBase-input': { color: '#FFFFFF' },
  '& .MuiInputBase-input::placeholder': { color: CARD_MUTED, opacity: 1 },
  '& .MuiInputLabel-root': { color: ORANGE_LIGHT },
  '& .MuiInputLabel-root.Mui-focused': { color: ORANGE },
  '& .MuiInputLabel-root.Mui-error': { color: ORANGE },
  '& .MuiFormHelperText-root': { color: CARD_MUTED },
  '& .MuiFormHelperText-root.Mui-error': { color: ORANGE },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ORANGE_LIGHT },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ORANGE },
}
const outlinedBtnSx = {
  color: ORANGE_LIGHT,
  borderColor: ORANGE_LIGHT,
  '&:hover': { borderColor: ORANGE, color: ORANGE, backgroundColor: 'rgba(255,69,0,0.08)' },
  '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.2)' },
}

const VENTURE_LABELS: Record<string, string> = {
  stackday: 'Stack Day',
  desilo: 'DeSilo',
  swychbox: 'swych-box',
  podcastbots: 'podcastbots',
  autonomylabs: 'Autonomy Labs',
  goldenhour: 'Golden Hour',
  neuronify: 'Neuronify',
}

interface Draft {
  venture: string
  x: { content: string; thread: string[] }
  linkedin_text: string
  facebook_text: string
}

interface StatusData {
  queueDepth: number
  nextUp: { startup: string; preview: string } | null
  lastPost: {
    startup: string
    posted_at: string
    x: string
    tweet_url: string | null
    linkedin: string
    facebook: string
  } | null
  runs: { status: string; conclusion: string | null; created_at: string; html_url: string }[]
  linkedinDaysLeft: number | null
}

export default function DropZone() {
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [listening, setListening] = useState(false)
  const [image, setImage] = useState<{ dataUrl: string; media_type: string; data: string } | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState<'shape' | 'approve' | 'postnow' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [status, setStatus] = useState<StatusData | null>(null)
  const recognitionRef = useRef<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speechSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

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
    apiFetch('/api/dropzone/status')
      .then(setStatus)
      .catch(() => {})
  }

  useEffect(() => {
    refreshStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e: any) => {
      let interimText = ''
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t + ' '
        else interimText += t
      }
      if (finalText) setTranscript((prev) => (prev ? prev + ' ' : '') + finalText.trim())
      setInterim(interimText)
    }
    rec.onend = () => {
      setListening(false)
      setInterim('')
    }
    rec.onerror = (e: any) => {
      setListening(false)
      setInterim('')
      if (e.error !== 'aborted') setError(`Mic error: ${e.error}. Type or paste instead.`)
    }
    recognitionRef.current = rec
    rec.start()
    setListening(true)
    setError(null)
  }

  const onPickImage = (file: File | undefined) => {
    if (!file) return
    if (file.size > 2_500_000) {
      setError('Screenshot too large — keep it under 2.5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const [meta, data] = dataUrl.split(',')
      const media_type = meta.match(/data:(.*?);/)?.[1] || 'image/png'
      setImage({ dataUrl, media_type, data })
    }
    reader.readAsDataURL(file)
  }

  const shapeIt = async () => {
    setBusy('shape')
    setError(null)
    setNotice(null)
    try {
      const result = await apiFetch('/api/dropzone/shape', {
        method: 'POST',
        body: JSON.stringify({
          transcript,
          image: image ? { media_type: image.media_type, data: image.data } : undefined,
        }),
      })
      setDraft(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const approve = async (postNow: boolean) => {
    if (!draft) return
    setBusy(postNow ? 'postnow' : 'approve')
    setError(null)
    try {
      const result = await apiFetch('/api/dropzone/approve', {
        method: 'POST',
        body: JSON.stringify({
          item: {
            startup: draft.venture,
            content: draft.x.content,
            x_thread: draft.x.thread.filter((t) => t.trim()),
            linkedin_text: draft.linkedin_text,
            facebook_text: draft.facebook_text,
          },
          postNow,
        }),
      })
      setNotice(
        postNow
          ? `Queued + posting now (${result.queueDepth} in queue). Watch the status strip.`
          : `Queued — position ${result.queueDepth}. Next cron run takes it from here.`
      )
      setDraft(null)
      setTranscript('')
      setImage(null)
      refreshStatus()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const lastRun = status?.runs?.[0]

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h2" sx={{ mb: 0.5 }}>
        DROP ZONE
      </Typography>
      <Typography sx={{ mb: 3, opacity: 0.8 }}>
        Ramble it. Claude shapes it. One tap ships it to X, LinkedIn, and Facebook.
      </Typography>

      {sessionExpired && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Session expired. <a href="/admin/login">Sign back in</a>, then return here.
        </Alert>
      )}

      {status && (
        <Box sx={{ mb: 3, p: 2, border: '2px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
            <Chip label={`QUEUE: ${status.queueDepth}`} />
            {lastRun && (
              <Chip
                component="a"
                href={lastRun.html_url}
                target="_blank"
                clickable
                color={lastRun.conclusion === 'success' ? 'default' : 'error'}
                label={`LAST RUN: ${lastRun.conclusion || lastRun.status}`}
              />
            )}
            {status.lastPost && (
              <Chip
                label={`LAST POST — X: ${status.lastPost.x} / LI: ${status.lastPost.linkedin} / FB: ${status.lastPost.facebook}`}
              />
            )}
            {status.linkedinDaysLeft !== null && (
              <Chip
                color={status.linkedinDaysLeft < 10 ? 'error' : 'default'}
                label={`LINKEDIN TOKEN: ${status.linkedinDaysLeft}d left`}
              />
            )}
          </Stack>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            minRows={5}
            placeholder="Tap the mic and ramble about what you shipped — or paste/type it."
            value={interim ? `${transcript}${transcript ? ' ' : ''}${interim}` : transcript}
            onChange={(e) => setTranscript(e.target.value)}
            sx={fieldSx}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
            {speechSupported ? (
              <Button
                variant={listening ? 'contained' : 'outlined'}
                color={listening ? 'error' : 'primary'}
                startIcon={listening ? <StopIcon /> : <MicIcon />}
                onClick={toggleMic}
                sx={listening ? undefined : outlinedBtnSx}
              >
                {listening ? 'Stop' : 'Speak'}
              </Button>
            ) : (
              <Typography variant="caption">Mic not supported in this browser — type it.</Typography>
            )}
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => fileRef.current?.click()}
              sx={outlinedBtnSx}
            >
              Screenshot
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(e) => onPickImage(e.target.files?.[0])}
            />
            {image && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img src={image.dataUrl} alt="screenshot" style={{ height: 56, display: 'block' }} />
                <IconButton
                  size="small"
                  onClick={() => setImage(null)}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'background.paper' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              disabled={!transcript.trim() || busy !== null}
              onClick={shapeIt}
              startIcon={busy === 'shape' ? <CircularProgress size={16} /> : undefined}
            >
              {busy === 'shape' ? 'Shaping…' : 'Shape It'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {draft && (
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">DRAFTS</Typography>
            <Select
              size="small"
              value={draft.venture}
              onChange={(e) => setDraft({ ...draft, venture: e.target.value })}
            >
              {Object.entries(VENTURE_LABELS).map(([id, label]) => (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="overline">X — {draft.x.content.length}/280</Typography>
              <TextField
                fullWidth
                multiline
                value={draft.x.content}
                error={draft.x.content.length > 280}
                onChange={(e) => setDraft({ ...draft, x: { ...draft.x, content: e.target.value } })}
                sx={fieldSx}
              />
              {draft.x.thread.map((t, i) => (
                <TextField
                  key={i}
                  fullWidth
                  multiline
                  sx={{ mt: 1, ...fieldSx }}
                  label={`Thread ${i + 2} — ${t.length}/280`}
                  value={t}
                  error={t.length > 280}
                  onChange={(e) => {
                    const thread = [...draft.x.thread]
                    thread[i] = e.target.value
                    setDraft({ ...draft, x: { ...draft.x, thread } })
                  }}
                />
              ))}
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="overline">LinkedIn</Typography>
              <TextField
                fullWidth
                multiline
                value={draft.linkedin_text}
                onChange={(e) => setDraft({ ...draft, linkedin_text: e.target.value })}
                sx={fieldSx}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="overline">Facebook</Typography>
              <TextField
                fullWidth
                multiline
                value={draft.facebook_text}
                onChange={(e) => setDraft({ ...draft, facebook_text: e.target.value })}
                sx={fieldSx}
              />
            </CardContent>
          </Card>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              disabled={busy !== null || draft.x.content.length > 280}
              onClick={() => approve(false)}
            >
              {busy === 'approve' ? 'Queueing…' : 'Approve → Queue'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={busy !== null || draft.x.content.length > 280}
              onClick={() => approve(true)}
            >
              {busy === 'postnow' ? 'Firing…' : 'Post Now'}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button color="error" disabled={busy !== null} onClick={() => setDraft(null)}>
              Discard
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  )
}
