import { useEffect } from 'react'

/**
 * Per-route SEO for the SPA. index.html ships a full set of <head> tags as the
 * static default (what non-JS crawlers and the homepage get); this updates them
 * in place on navigation so each route has a unique title/description/canonical.
 * We mutate the existing tags rather than rendering new ones so the DOM never
 * ends up with duplicate <meta> tags. Googlebot renders JS and reads the result.
 */

const SITE = 'https://www.tisb.world'
const DEFAULT_IMAGE = `${SITE}/social-banner.png`
const BRAND = 'TISB — The Idea Sandbox'

interface SeoProps {
  /** Page title without the brand suffix (the homepage passes the brand itself). */
  title: string
  description: string
  /** Route path, e.g. "/ventures". Used for canonical + og:url. */
  path: string
  image?: string
}

function set(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function Seo({ title, description, path, image = DEFAULT_IMAGE }: SeoProps) {
  useEffect(() => {
    const url = `${SITE}${path === '/' ? '/' : path}`
    const fullTitle = path === '/' ? title : `${title} | ${BRAND}`

    document.title = fullTitle
    set('meta[name="description"]', 'content', description)
    set('link[rel="canonical"]', 'href', url)

    set('meta[property="og:title"]', 'content', fullTitle)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:image"]', 'content', image)

    set('meta[property="twitter:title"]', 'content', fullTitle)
    set('meta[property="twitter:description"]', 'content', description)
    set('meta[property="twitter:url"]', 'content', url)
    set('meta[property="twitter:image"]', 'content', image)
  }, [title, description, path, image])

  return null
}
