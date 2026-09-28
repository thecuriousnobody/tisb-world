import { createContext, useContext } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

/**
 * Page transitions ("ink veil"). Layout owns the choreography and provides
 * `go(to)`; everything that links internally uses <SLink> so it runs through
 * the veil instead of a hard route swap.
 */
export const TransitionContext = createContext<{ go: (to: string) => void }>({
  go: () => {},
})

export const useGo = () => useContext(TransitionContext).go

type SLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

/**
 * Internal link. Renders a real <a href> — so crawlers, middle-click, and
 * cmd-click-to-new-tab all behave — but a plain left click goes through the
 * transition instead of a full page load.
 */
export function SLink({ to, children, onClick, ...rest }: SLinkProps) {
  const go = useGo()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go(to)
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
