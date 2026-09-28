import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { C, EASE, F, GUTTER } from '../design/tokens'
import { NAV, PAGES, isNavActive, pad2, pageForPath } from '../design/pages'
import type { PageKey } from '../design/pages'
import { Kanji, Mono, Seal, useScrollProgress } from '../design/primitives'
import { SLink, TransitionContext } from '../design/transition'

/*
 * Timing for the "ink veil" (from the handoff): content fades out while a
 * paper veil inks in the destination kanji; the route swaps at 480ms, then
 * 520ms later the veil lifts. Navigation is locked for the whole sequence.
 */
const SWAP_MS = 480
const HOLD_MS = 520
const LIFT_MS = 450
const REDUCED_MS = 150

const REDUCED = '(prefers-reduced-motion: reduce)'

const EMAIL = 'rajeev@theideasandbox.com'
const WHATSAPP = 'https://wa.me/message/TCGJL6U2OGFZC1'
const SOCIAL = [
  ['X', 'https://x.com/theideasandbox'],
  ['LINKEDIN', 'https://www.linkedin.com/in/industrious1/'],
  ['FACEBOOK', 'https://www.facebook.com/profile.php?id=100093144579226'],
  ['YOUTUBE', 'https://www.youtube.com/@theideasandbox'],
] as const

/** Header nav needs ~900px on one line; below that it becomes a menu. */
const NAV_BP = 900

function useChicagoClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false,
    })
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 20_000)
    return () => clearInterval(id)
  }, [])
  return t
}

/**
 * Scroll reveal: [data-reveal] elements rise in once when 8% visible.
 * A MutationObserver arms elements that mount later — rows from the Substack
 * or YouTube feeds arrive after first paint and would otherwise never animate.
 */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia(REDUCED).matches) return

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const t = e.target as HTMLElement
          t.style.opacity = '1'
          t.style.transform = 'none'
          io.unobserve(t)
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    const arm = (t: HTMLElement) => {
      if (t.dataset.rv) return
      t.dataset.rv = '1'
      t.style.opacity = '0'
      t.style.transform = 'translateY(22px)'
      // Carries the row-hover transitions too, since an inline transition
      // replaces the class one.
      t.style.transition = `opacity 1s ${EASE}, transform 1.2s ${EASE}, background .3s, padding .4s ${EASE}`
      io.observe(t)
    }
    const scan = (n: ParentNode) => n.querySelectorAll<HTMLElement>('[data-reveal]').forEach(arm)

    scan(el)
    const mo = new MutationObserver((muts) =>
      muts.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return
          if (n.matches('[data-reveal]')) arm(n)
          scan(n)
        }),
      ),
    )
    mo.observe(el, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [root])
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const page = pageForPath(location.pathname)

  const [out, setOut] = useState(false)
  const [veil, setVeil] = useState<{ on: boolean; op: number; to: PageKey | null }>({ on: false, op: 0, to: null })
  const [reducedFade, setReducedFade] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  const mainRef = useRef<HTMLElement>(null)
  useReveal(mainRef)

  const clock = useChicagoClock()
  const progress = useScrollProgress(page === 'post')

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const go = useCallback((to: string) => {
    const target = to.split(/[?#]/)[0] || '/'
    setMenuOpen(false)
    if (busy.current) return
    if (target === pathRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    busy.current = true
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

    if (window.matchMedia(REDUCED).matches) {
      setReducedFade(true)
      setOut(true)
      later(() => {
        window.scrollTo(0, 0)
        navigate(to)
        setOut(false)
        later(() => { busy.current = false; setReducedFade(false) }, REDUCED_MS)
      }, REDUCED_MS)
      return
    }

    setOut(true)
    setVeil({ on: true, op: 0, to: pageForPath(target) })
    // Two frames so the veil mounts at opacity 0 before fading in.
    requestAnimationFrame(() => requestAnimationFrame(() => setVeil((v) => ({ ...v, op: 1 }))))
    later(() => {
      window.scrollTo(0, 0)
      navigate(to)
      later(() => {
        setVeil((v) => ({ ...v, op: 0 }))
        setOut(false)
        later(() => { busy.current = false; setVeil({ on: false, op: 0, to: null }) }, LIFT_MS)
      }, HOLD_MS)
    }, SWAP_MS)
  }, [navigate])

  const dest = veil.to ? PAGES[veil.to] : null

  return (
    <TransitionContext.Provider value={{ go }}>
      <Box sx={{ minHeight: '100vh', background: C.paper, color: C.ink, fontFamily: F.body, position: 'relative' }}>
        {page && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'fixed', right: 16, top: 120, zIndex: 5, pointerEvents: 'none',
              writingMode: 'vertical-rl', whiteSpace: 'nowrap', fontSize: 12, letterSpacing: '.6em', color: C.muted,
              display: 'none', '@media (min-width: 900px)': { display: 'block' },
            }}
          >
            {PAGES[page].edge}
          </Box>
        )}

        <Header
          page={page}
          clock={clock}
          menuOpen={menuOpen}
          onMenu={() => setMenuOpen((o) => !o)}
          progress={page === 'post' ? progress : null}
        />

        {menuOpen && <MobileMenu page={page} clock={clock} />}

        <Box
          component="main"
          ref={mainRef}
          sx={{
            opacity: out ? 0 : 1,
            transform: out && !reducedFade ? 'translateY(14px)' : 'none',
            filter: out && !reducedFade ? 'blur(6px)' : 'none',
            transition: reducedFade
              ? `opacity ${REDUCED_MS}ms ease`
              : `opacity .45s ease, transform .7s ${EASE}, filter .45s ease`,
          }}
        >
          {/* Keyed by path: each page remounts, so its kanji inks in again. */}
          <div key={location.pathname}>{children}</div>
        </Box>

        <Footer />

        {veil.on && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'fixed', inset: 0, zIndex: 50, background: C.paper, opacity: veil.op,
              transition: 'opacity .42s ease', display: 'grid', placeItems: 'center', pointerEvents: 'all',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
              <Kanji char={dest?.k ?? '箱'} size="clamp(150px, 40vw, 220px)" delay={0.05} duration={0.9} />
              <Mono spacing=".2em">→ {dest ? `${dest.label} / ${dest.k} ${dest.jp}` : 'TISB'}</Mono>
              <Box sx={{ width: 160, height: '1px', background: C.hairline }}>
                <Box
                  sx={{
                    height: '1px', background: C.vermilion, transformOrigin: 'left',
                    animation: 'barGrow .8s cubic-bezier(.4,0,.2,1) both',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </TransitionContext.Provider>
  )
}

/* ── Header ───────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <SLink to="/" aria-label="TISB — home" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Seal char="箱" size={24} glyph={18} />
      <Box component="span" sx={{ font: `400 13px ${F.display}`, letterSpacing: '.3em' }}>TISB</Box>
    </SLink>
  )
}

function Status({ clock }: { clock: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Box className="s-pulse" sx={{ width: 6, height: 6, borderRadius: '50%', background: C.vermilion }} />
      <Mono sx={{ whiteSpace: 'nowrap' }}>IL — {clock} CT</Mono>
    </Box>
  )
}

function Header({
  page, clock, menuOpen, onMenu, progress,
}: {
  page: PageKey | null; clock: string
  menuOpen: boolean; onMenu: () => void; progress: number | null
}) {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(250,250,248,.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <Box
        sx={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px 32px', px: GUTTER, minHeight: 64,
        }}
      >
        <Logo />

        <Box
          component="nav"
          aria-label="Primary"
          sx={{
            display: 'none', flexWrap: 'wrap', gap: '6px 24px',
            font: `400 10px ${F.mono}`, letterSpacing: '.16em',
            [`@media (min-width: ${NAV_BP}px)`]: { display: 'flex' },
          }}
        >
          {NAV.map((k, i) => (
            <Box
              key={k}
              component={SLink}
              to={PAGES[k].path}
              aria-current={isNavActive(k, page) ? 'page' : undefined}
              sx={{ py: '6px', color: isNavActive(k, page) ? C.vermilion : C.ink }}
            >
              [{pad2(i + 1)}] {PAGES[k].label}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Box sx={{ display: 'none', '@media (min-width: 1120px)': { display: 'flex' } }}>
            <Status clock={clock} />
          </Box>
          <Box
            component="button"
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            sx={{
              border: `1px solid ${C.ink}`, background: menuOpen ? C.ink : 'transparent',
              color: menuOpen ? C.paper : C.ink, cursor: 'pointer', p: '9px 14px',
              font: `400 10px ${F.mono}`, letterSpacing: '.16em',
              [`@media (min-width: ${NAV_BP}px)`]: { display: 'none' },
            }}
          >
            {menuOpen ? 'CLOSE ×' : 'MENU'}
          </Box>
        </Box>
      </Box>

      {progress !== null && (
        <Box sx={{ height: '2px', background: C.hairlineSoft }}>
          <Box sx={{ height: '2px', background: C.vermilion, width: `${(progress * 100).toFixed(1)}%` }} />
        </Box>
      )}
    </Box>
  )
}

/**
 * Below 900px the seven-item nav would wrap the sticky header onto three
 * rows and eat a third of a phone screen. It becomes a full-height sheet
 * instead — same labels and indices, set large enough to tap.
 */
function MobileMenu({ page, clock }: { page: PageKey | null; clock: string }) {
  return (
    <Box
      sx={{
        position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 19,
        background: C.paper, overflowY: 'auto', px: GUTTER, pt: '8px', pb: '32px',
        display: 'flex', flexDirection: 'column',
        [`@media (min-width: ${NAV_BP}px)`]: { display: 'none' },
      }}
    >
      <Box component="nav" aria-label="Primary" sx={{ display: 'flex', flexDirection: 'column' }}>
        {NAV.map((k, i) => {
          const active = isNavActive(k, page)
          return (
            <Box
              key={k}
              component={SLink}
              to={PAGES[k].path}
              aria-current={active ? 'page' : undefined}
              sx={{
                display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center',
                py: '18px', borderBottom: `1px solid ${C.hairline}`, color: active ? C.vermilion : C.ink,
              }}
            >
              <Mono color={active ? C.vermilion : C.muted} size={11}>{pad2(i + 1)}</Mono>
              <Box component="span" sx={{ font: `400 20px ${F.display}`, letterSpacing: '.02em' }}>{PAGES[k].label}</Box>
              <Box component="span" sx={{ font: `30px/1 ${F.brush}` }}>{PAGES[k].k}</Box>
            </Box>
          )
        })}
      </Box>
      <Box sx={{ mt: 'auto', pt: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Status clock={clock} />
        <Mono color={C.ink}><a href={`mailto:${EMAIL}`}>{EMAIL}</a></Mono>
      </Box>
    </Box>
  )
}

/* ── Footer ───────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <Box component="footer" className="s-on-dark" sx={{ background: C.ink, color: C.paper, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '40px 64px', p: `72px ${GUTTER} 40px` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 auto', minWidth: 0 }}>
          <Mono color={C.mutedOnDark}>[ TRANSMIT ] QUESTIONS OR IDEAS TO EXPLORE?</Mono>
          <Box
            component="a"
            href={`mailto:${EMAIL}`}
            sx={{ font: `400 clamp(14px, 1.4vw, 18px) ${F.display}`, overflowWrap: 'anywhere', color: C.paper }}
          >
            {EMAIL.toUpperCase()}
          </Box>
          <Mono color={C.paper}>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">OR WHATSAPP →</a>
          </Mono>
        </Box>

        <Box
          component="nav"
          aria-label="Footer"
          sx={{
            display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px 40px', alignContent: 'start',
            font: `400 10px ${F.mono}`, letterSpacing: '.16em', flex: '0 0 auto',
          }}
        >
          {NAV.map((k, i) => (
            <Box key={k} component={SLink} to={PAGES[k].path} sx={{ color: C.paper }}>
              {pad2(i + 1)} {PAGES[k].label}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', font: `400 10px ${F.mono}`, letterSpacing: '.16em', flex: '0 0 auto' }}>
          {SOCIAL.map(([label, href]) => (
            <Box key={label} component="a" href={href} target="_blank" rel="noopener noreferrer" sx={{ color: C.paper }}>
              {label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: '8px 24px', p: `0 ${GUTTER} 24px`,
        }}
      >
        <Box
          component="span"
          lang="ja"
          sx={{ font: `clamp(52px, 14vw, 200px)/1 ${F.brush}`, color: C.paper, whiteSpace: 'nowrap' }}
        >
          発想の箱庭
        </Box>
        <Mono color={C.mutedOnDark} sx={{ pb: { xs: 0, md: '24px' }, whiteSpace: 'nowrap' }}>
          TISB © {new Date().getFullYear()}
        </Mono>
      </Box>
    </Box>
  )
}
