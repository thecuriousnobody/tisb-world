import { useState } from 'react'
import type { FormEvent } from 'react'
import { Box, Typography, TextField, MenuItem, Button, Alert, CircularProgress } from '@mui/material'
import Seo from '../components/Seo'
import { prints, heroImage, positioning, useCases, sizes } from '../data/prints'

/**
 * /prints — the commercial landing page for Pinterest traffic.
 *
 * Rendered OUTSIDE the main Layout by design. A designer arriving from a pin
 * has exactly one question ("can I get this on my client's wall, and how?").
 * Site nav to the podcast/ventures/AI work is a strength in another context and
 * a distraction here, so this page carries only its own quiet link home.
 */

const ACCENT = '#FF4500'
const CANVAS = '#0A0A0A'

const WHATSAPP = 'https://wa.me/13096797200?text=Hi%20Rajeev%20%E2%80%94%20I%27m%20interested%20in%20your%20large-format%20work.'
const EMAIL = 'rajeev@theideasandbox.com'

/** Shared dark-field styling for the inquiry form. */
const fieldSx = {
  '& .MuiInputBase-root': {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.25)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT, borderWidth: '2px' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: ACCENT },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
}

const selectMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#000',
      color: '#fff',
      borderRadius: 0,
      border: '1px solid rgba(255,255,255,0.2)',
      '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255,69,0,0.2)' },
    },
  },
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Prints() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    useCase: '',
    size: '',
    notes: '',
    company: '', // honeypot — hidden from humans
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/art/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: '/prints' }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      setStatus('sent')
      setForm({ name: '', email: '', useCase: '', size: '', notes: '', company: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const scrollToForm = () =>
    document.getElementById('inquire')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Box sx={{ backgroundColor: CANVAS, minHeight: '100vh', color: '#fff' }}>
      <Seo
        title="Large-Format Art for Commercial Installation"
        description="Original large-format work on brushed aluminum for hospitality, commercial, and residential installation. Sizes and editions by inquiry."
        path="/prints"
        image="https://www.tisb.world/installations/hero-rooftop-lounge.jpg"
      />

      {/* ── Hero: the work, at scale, on a real wall ─────────────────── */}
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <Box
          component="img"
          src={heroImage}
          alt="Large-format print on brushed aluminum installed on a concrete wall"
          sx={{
            width: '100%',
            height: { xs: '58vh', md: '82vh' },
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.55) 35%, rgba(10,10,10,0.1) 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 8 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              mb: 2,
              maxWidth: '15ch',
            }}
          >
            ART AT ARCHITECTURAL SCALE
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.35rem' },
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '62ch',
              lineHeight: 1.6,
            }}
          >
            {positioning}
          </Typography>
          <Button
            onClick={scrollToForm}
            sx={{
              mt: { xs: 3, md: 4 },
              backgroundColor: ACCENT,
              color: '#000',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: 0,
              '&:hover': { backgroundColor: '#fff' },
            }}
          >
            Request sizes &amp; pricing
          </Button>
        </Box>
      </Box>

      {/* ── Selected work ─────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 3, md: 8 }, py: { xs: 6, md: 10 } }}>
        <Typography
          sx={{
            fontSize: '0.8rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: ACCENT,
            mb: 4,
            fontWeight: 700,
          }}
        >
          Selected Work
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {prints.map((print) => (
            <Box key={print.title}>
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  aspectRatio: '4 / 3',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Box
                  component="img"
                  src={print.image}
                  alt={print.title}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s ease',
                    '&:hover': { transform: 'scale(1.04)' },
                  }}
                />
              </Box>
              <Typography
                sx={{ mt: 2, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}
              >
                {print.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', mt: 0.5 }}>
                {print.note}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Inquiry ───────────────────────────────────────────────────── */}
      <Box
        id="inquire"
        sx={{
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 10 },
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <Box sx={{ maxWidth: '760px' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.25rem' },
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            TELL ME ABOUT THE WALL
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontSize: '1.05rem' }}>
            Where it's going, how big, and anything about the space. I'll come back
            with sizes, edition options, and a quote.
          </Typography>

          {status === 'sent' ? (
            <Alert
              severity="success"
              sx={{
                backgroundColor: 'rgba(255,69,0,0.12)',
                color: '#fff',
                borderRadius: 0,
                border: `1px solid ${ACCENT}`,
                '& .MuiAlert-icon': { color: ACCENT },
              }}
            >
              Got it — I'll be in touch shortly with sizes and a quote.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
              {/* Honeypot: off-screen, never announced, never tabbable. */}
              <Box
                component="input"
                type="text"
                name="company"
                value={form.company}
                onChange={update('company')}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                sx={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                }}
              >
                <TextField
                  required
                  label="Name"
                  value={form.name}
                  onChange={update('name')}
                  sx={fieldSx}
                  fullWidth
                />
                <TextField
                  required
                  type="email"
                  label="Email"
                  value={form.email}
                  onChange={update('email')}
                  sx={fieldSx}
                  fullWidth
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                }}
              >
                <TextField
                  select
                  label="What's it for?"
                  value={form.useCase}
                  onChange={update('useCase')}
                  sx={fieldSx}
                  SelectProps={{ MenuProps: selectMenuProps }}
                  fullWidth
                >
                  {useCases.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Size"
                  value={form.size}
                  onChange={update('size')}
                  sx={fieldSx}
                  SelectProps={{ MenuProps: selectMenuProps }}
                  fullWidth
                >
                  {sizes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                label="Notes"
                placeholder="The space, the piece you have in mind, timing — anything helps."
                value={form.notes}
                onChange={update('notes')}
                multiline
                rows={5}
                sx={fieldSx}
                fullWidth
              />

              {status === 'error' && (
                <Alert
                  severity="error"
                  sx={{ borderRadius: 0, backgroundColor: 'rgba(255,0,0,0.1)', color: '#fff' }}
                >
                  {errorMsg} You can also email{' '}
                  <Box component="a" href={`mailto:${EMAIL}`} sx={{ color: ACCENT }}>
                    {EMAIL}
                  </Box>
                  .
                </Alert>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  sx={{
                    backgroundColor: ACCENT,
                    color: '#000',
                    fontWeight: 700,
                    px: 5,
                    py: 1.75,
                    borderRadius: 0,
                    '&:hover': { backgroundColor: '#fff' },
                    '&.Mui-disabled': { backgroundColor: 'rgba(255,255,255,0.2)', color: '#666' },
                  }}
                >
                  {status === 'sending' ? (
                    <>
                      <CircularProgress size={18} sx={{ mr: 1.5, color: '#666' }} />
                      Sending…
                    </>
                  ) : (
                    'Send inquiry'
                  )}
                </Button>

                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                  or reach me on{' '}
                  <Box
                    component="a"
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}
                  >
                    WhatsApp
                  </Box>{' '}
                  ·{' '}
                  <Box
                    component="a"
                    href={`mailto:${EMAIL}`}
                    sx={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {EMAIL}
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Quiet way home. Not nav — an exit for the curious. ────────── */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: 4,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box
          component="a"
          href="/"
          sx={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            '&:hover': { color: ACCENT },
          }}
        >
          The Curious Nobody — The Idea Sandbox
        </Box>
        <Box
          component="a"
          href="/art"
          sx={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            '&:hover': { color: ACCENT },
          }}
        >
          See the full archive →
        </Box>
      </Box>
    </Box>
  )
}
