import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { Box } from '@mui/material'
import Seo from '../components/Seo'
import { prints, heroImage, positioning, useCases, sizes } from '../data/prints'
import { C, F, GUTTER, WIDE } from '../design/tokens'
import { Corners, Kanji, Mono, Seal, Well } from '../design/primitives'
import { pad2 } from '../design/pages'

/**
 * /prints — the commercial page Pinterest and Behance buyers land on.
 *
 * Layout renders this route without the site nav (see Layout.tsx): a designer
 * arriving from a pin has one question — "can I get this on my client's wall,
 * and how?" — and podcast/startup links don't help answer it. The form posts
 * to /api/art/inquiry, which writes a Notion row AND emails Rajeev.
 */

const WHATSAPP =
  'https://wa.me/13096797200?text=Hi%20Rajeev%20%E2%80%94%20I%27m%20interested%20in%20your%20large-format%20work.'
const EMAIL = 'rajeev@theideasandbox.com'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY = { name: '', email: '', useCase: '', size: '', notes: '', company: '' }

export default function Prints() {
  // `company` is a honeypot: hidden from humans, filled by bots, rejected server-side.
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update =
    (field: keyof typeof EMPTY) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
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
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <Box component="section">
      <Seo
        title="Large-Format Art for Commercial Installation"
        description="Original large-format work on brushed aluminum for hospitality, commercial, and residential installation. Sizes and editions by inquiry."
        path="/prints"
        image="https://www.tisb.world/installations/hero-terrace-copper.webp"
      />

      {/* ── Hero: the work, at scale, on a real wall ─────────────────── */}
      <Box sx={{ position: 'relative', height: 'min(78vh, 760px)', minHeight: 480, overflow: 'hidden', background: C.ink }}>
        <img
          src={heroImage}
          alt="Large-format print on brushed aluminum installed on a concrete wall"
          fetchPriority="high"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,14,.82), rgba(15,15,14,0) 55%)' }} />
        <Corners which={['tl', 'tr']} size={18} inset={28} color={C.paper} />
        <Box sx={{ position: 'absolute', right: { xs: 36, md: 56 }, top: { xs: 44, md: 52 }, color: C.paper }}>
          <Kanji char="版" size="clamp(96px, 20vw, 160px)" />
        </Box>
        <Box
          sx={{
            position: 'absolute', left: GUTTER, right: GUTTER, bottom: '48px',
            display: 'flex', flexDirection: 'column', gap: '20px', color: C.paper,
          }}
        >
          <Mono color={C.paper}>SYS / 005 — LARGE FORMAT / 版</Mono>
          <Box
            component="h1"
            // Michroma is wide: "ARCHITECTURAL" is ~12em across. The floor of
            // 22px keeps it on one line down to a 320px phone.
            sx={{ font: `400 clamp(22px, 4.4vw, 60px)/1.15 ${F.display}`, letterSpacing: '.02em', maxWidth: 900 }}
          >
            ART AT ARCHITECTURAL SCALE
          </Box>
          <Box component="p" sx={{ fontSize: { xs: 17, md: 19 }, lineHeight: 1.6, maxWidth: 620, fontWeight: 300 }}>
            {positioning}
          </Box>
          <Box
            component="a"
            href="#inquire"
            className="s-btn-verm"
            sx={{ alignSelf: 'flex-start', mt: '4px', p: '14px 20px', font: `400 10px ${F.mono}`, letterSpacing: '.16em' }}
          >
            REQUEST SIZES &amp; PRICING ↓
          </Box>
        </Box>
      </Box>

      {/* ── Plates ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '48px 32px', p: `80px ${GUTTER}`,
        }}
      >
        {prints.map((p, i) => (
          <Box key={p.title} data-reveal className="s-zoom" sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Well src={p.image} alt={`${p.title} — large-format print installed`} ratio="4/3" />
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
              <Mono>P.{pad2(i + 1)}</Mono>
              <Box component="span" sx={{ font: `400 16px ${F.display}`, textTransform: 'uppercase', letterSpacing: '.02em' }}>
                {p.title}
              </Box>
            </Box>
            <Box component="span" sx={{ fontSize: 15, lineHeight: 1.55, color: C.inkSoft, fontWeight: 300 }}>{p.note}</Box>
          </Box>
        ))}
      </Box>

      {/* ── Inquiry ──────────────────────────────────────────────────── */}
      <Box
        id="inquire"
        sx={{
          scrollMarginTop: '64px',
          display: 'grid', gridTemplateColumns: '1fr', gap: '48px',
          p: `80px ${GUTTER} 96px`, borderTop: `1px solid ${C.hairline}`,
          [WIDE]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Mono>[A] INQUIRY / 問合せ</Mono>
          <Box component="h2" sx={{ font: `400 clamp(24px, 3vw, 38px)/1.25 ${F.display}`, letterSpacing: '.02em' }}>
            TELL ME ABOUT THE WALL
          </Box>
          <Box component="p" sx={{ fontSize: 17, lineHeight: 1.7, fontWeight: 300, color: C.inkSoft, maxWidth: 440 }}>
            Where it's going, how big, and anything about the space. I'll come back with sizes, edition options, and a quote.
          </Box>
        </Box>

        {status === 'sent' ? (
          <Box
            role="status"
            sx={{ display: 'flex', gap: '24px', alignItems: 'center', p: '32px', border: `1px solid ${C.vermilion}`, alignSelf: 'start' }}
          >
            <Seal char="済" size={44} glyph={30} />
            <Box component="span" sx={{ fontSize: 19 }}>
              Got it — I'll be in touch shortly with sizes and a quote.
            </Box>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '28px 24px',
              alignContent: 'start',
            }}
          >
            {/* Honeypot: off-screen, never announced, never tabbable. */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={update('company')}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
            />

            <Field label="NAME" required>
              <input required autoComplete="name" value={form.name} onChange={update('name')} style={inputStyle} />
            </Field>
            <Field label="EMAIL" required>
              <input required type="email" autoComplete="email" value={form.email} onChange={update('email')} style={inputStyle} />
            </Field>
            <Field label="WHAT'S IT FOR?">
              {/* Starts blank on purpose: pre-selecting "Hospitality" would
                  quietly mislabel every lead who didn't touch the dropdown. */}
              <select value={form.useCase} onChange={update('useCase')} style={inputStyle}>
                <option value="">Select…</option>
                {useCases.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="SIZE">
              <select value={form.size} onChange={update('size')} style={inputStyle}>
                <option value="">Select…</option>
                {sizes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="NOTES" full>
              <textarea
                rows={4}
                value={form.notes}
                onChange={update('notes')}
                placeholder="The space, the piece you have in mind, timing — anything helps."
                style={{ ...inputStyle, lineHeight: 1.6, resize: 'vertical' }}
              />
            </Field>

            {status === 'error' && (
              <Box role="alert" sx={{ gridColumn: '1 / -1', borderLeft: `2px solid ${C.vermilion}`, pl: '16px' }}>
                <Mono color={C.vermilion} as="div">TRANSMISSION FAILED</Mono>
                <Box component="p" sx={{ fontSize: 15, color: C.inkSoft, mt: '6px' }}>
                  {errorMsg} You can also email <a href={`mailto:${EMAIL}`} style={{ borderBottom: `1px solid ${C.ink}` }}>{EMAIL}</a>.
                </Box>
              </Box>
            )}

            <Box sx={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
              <Box
                component="button"
                type="submit"
                disabled={status === 'sending'}
                className="s-btn-ink"
                sx={{
                  border: 0, p: '16px 28px', cursor: 'pointer', font: `400 10px ${F.mono}`, letterSpacing: '.16em',
                  '&:disabled': { background: C.muted, cursor: 'wait' },
                }}
              >
                {status === 'sending' ? 'SENDING…' : 'SEND INQUIRY →'}
              </Box>
              <Box component="span" sx={{ fontSize: 15, color: C.inkSoft }}>
                or reach me on{' '}
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ borderBottom: `1px solid ${C.ink}` }}>WhatsApp</a>
                {' · '}
                <a href={`mailto:${EMAIL}`} style={{ borderBottom: `1px solid ${C.ink}` }}>{EMAIL}</a>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const inputStyle = {
  border: 0,
  borderBottom: `1px solid ${C.ink}`,
  borderRadius: 0,
  // backgroundColor, not the `background` shorthand — the shorthand would
  // reset the select caret drawn with backgroundImage in <Field>.
  backgroundColor: 'transparent',
  padding: '10px 0',
  font: `400 17px ${F.body}`,
  color: C.ink,
  width: '100%',
  appearance: 'none' as const,
}

/**
 * Label + control. The prototype sets `outline: none` on fields; we keep the
 * hairline look but give keyboard users a visible vermilion underline instead
 * of removing focus indication outright.
 */
function Field({ label, children, required, full }: { label: string; children: ReactNode; required?: boolean; full?: boolean }) {
  return (
    <Box
      component="label"
      sx={{
        display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: full ? '1 / -1' : undefined,
        font: `400 10px ${F.mono}`, letterSpacing: '.16em', color: C.muted,
        '& input, & select, & textarea': { outline: 'none', transition: 'border-color .25s, box-shadow .25s' },
        '& input:focus-visible, & select:focus-visible, & textarea:focus-visible': {
          borderBottomColor: C.vermilion, boxShadow: `0 1px 0 ${C.vermilion}`,
        },
        '& select': {
          cursor: 'pointer',
          backgroundImage: `linear-gradient(45deg, transparent 50%, ${C.ink} 50%), linear-gradient(135deg, ${C.ink} 50%, transparent 50%)`,
          backgroundPosition: 'calc(100% - 10px) 55%, calc(100% - 5px) 55%',
          backgroundSize: '5px 5px',
          backgroundRepeat: 'no-repeat',
        },
      }}
    >
      <span>{label}{required && <span style={{ color: C.vermilion }}> *</span>}</span>
      {children}
    </Box>
  )
}
