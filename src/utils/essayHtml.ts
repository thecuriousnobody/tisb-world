import DOMPurify from 'dompurify'

/**
 * Turns a Substack post's content:encoded HTML into something safe and clean
 * to render on tisb.world.
 *
 * Two passes:
 *  1. DOMPurify — the security boundary. Strips scripts, event handlers,
 *     javascript: URLs, forms, and SVG; then iframes are narrowed to known
 *     video/audio hosts. Nothing reaches the page without going through this.
 *  2. A DOM pass — presentation only: removes Substack's app chrome (image
 *     expand/restack buttons, subscribe widgets, video placeholders that need
 *     Substack's own JS), unwraps image links, points links to other essays at
 *     their on-site pages, and ids the h2s for CONTENTS.
 */

export interface EssayHeading {
  id: string
  text: string
}

export interface Essay {
  html: string
  headings: EssayHeading[]
}

/** Embeds allowed to survive as iframes. Anything else is dropped. */
const EMBED_HOSTS = [
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'youtube.com',
  'player.vimeo.com',
  'open.spotify.com',
]

/** Substack app chrome that renders as dead UI outside Substack. */
const CHROME = [
  '.subscription-widget-wrap',
  '.subscription-widget',
  '.subscribe-widget',
  '[data-component-name="SubscribeWidget"]',
  '[data-component-name="SubscribeWidgetToDOM"]',
  '.button-wrapper',
  '.captioned-button-wrap',
  '[data-component-name="ButtonCreateButton"]',
  '.share-dialog',
  '.post-ufi',
  '.image-link-expand',
  '.restack-image',
  '.view-image',
  '.icon-container',
  '.pencraft',
  '.digest-post-embed',
  '.embedded-publication-wrap',
].join(',')

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 64) || 'section'

export function prepareEssay(
  raw: string,
  opts: { postUrl: string; knownSlugs: Set<string>; substackOrigin: string },
): Essay {
  const clean = DOMPurify.sanitize(raw, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'svg', 'math', 'object', 'embed', 'noscript'],
    FORBID_ATTR: ['style', 'srcdoc'],
  })

  // An inert document: nothing parsed here loads or executes.
  const doc = document.implementation.createHTMLDocument('')
  const root = doc.createElement('div')
  root.innerHTML = clean

  // DOMPurify has already neutralised script and javascript: URLs; this
  // narrows iframes further to known video/audio embeds over https.
  root.querySelectorAll('iframe').forEach((f) => {
    try {
      const url = new URL(f.getAttribute('src') || '')
      if (url.protocol !== 'https:' || !EMBED_HOSTS.includes(url.hostname)) f.remove()
      else f.setAttribute('loading', 'lazy')
    } catch {
      f.remove()
    }
  })

  root.querySelectorAll(CHROME).forEach((n) => n.remove())

  // Substack's native video blocks are empty placeholders its own JS fills in.
  root.querySelectorAll('.native-video-embed, [data-component-name="VideoPlaceholder"]').forEach((n) => {
    const box = doc.createElement('p')
    box.className = 'essay-embed-link'
    const a = doc.createElement('a')
    a.href = opts.postUrl
    a.textContent = 'VIDEO — WATCH ON SUBSTACK ↗'
    box.appendChild(a)
    n.replaceWith(box)
  })

  // Image links open the raw CDN file — unwrap so images are just images.
  root.querySelectorAll('a.image-link, a.image2').forEach((a) => a.replaceWith(...Array.from(a.childNodes)))

  root.querySelectorAll('img').forEach((img) => {
    img.setAttribute('loading', 'lazy')
    img.setAttribute('decoding', 'async')
    img.removeAttribute('width')
    img.removeAttribute('height')
  })

  // A post body shouldn't compete with the page's own H1.
  root.querySelectorAll('h1').forEach((h) => {
    const h2 = doc.createElement('h2')
    h2.innerHTML = h.innerHTML
    h.replaceWith(h2)
  })

  // Pull quotes get their `[ QUOTE ]` tag as a real element (CSS pseudo
  // elements are spent on the crosshair corners).
  root.querySelectorAll('blockquote').forEach((q) => {
    const tag = doc.createElement('span')
    tag.className = 'essay-quote-tag'
    tag.textContent = '[ QUOTE ]'
    q.prepend(tag)
  })

  const originHost = new URL(opts.substackOrigin).hostname
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    if (href.startsWith('#')) return // footnotes, in-page anchors
    let url: URL
    try {
      url = new URL(href, opts.substackOrigin)
    } catch {
      a.removeAttribute('href')
      return
    }
    const slug = url.hostname === originHost ? url.pathname.match(/^\/p\/([^/?#]+)/)?.[1] : undefined
    if (slug && opts.knownSlugs.has(slug)) {
      // Another essay we host — keep the reader on tisb.world.
      a.setAttribute('href', `/blog/${slug}`)
      a.setAttribute('data-internal', '1')
      a.removeAttribute('target')
      a.removeAttribute('rel')
    } else {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    }
  })

  const used = new Set<string>()
  const headings: EssayHeading[] = []
  root.querySelectorAll('h2').forEach((h) => {
    const text = (h.textContent || '').replace(/\s+/g, ' ').trim()
    if (!text) {
      h.remove()
      return
    }
    let id = slugify(text)
    for (let n = 2; used.has(id); n++) id = `${slugify(text)}-${n}`
    used.add(id)
    h.id = id
    headings.push({ id, text })
  })

  // Drop paragraphs left empty by chrome removal.
  root.querySelectorAll('p').forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector('img, iframe, picture, a')) p.remove()
  })

  return { html: root.innerHTML, headings }
}
