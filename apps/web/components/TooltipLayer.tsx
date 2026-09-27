'use client'

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

interface Tip {
  text: string
  x: number
  y: number
}

/**
 * Tooltips for chart marks (docs/05 §5, §10): any descendant with `data-tip` shows its text on
 * pointer hover and on keyboard focus; Escape hides it. The marks keep their own accessible names
 * (aria-label or <title>), so the tooltip is visual only. Without JavaScript the <title> of each
 * mark still gives the browser's native tooltip.
 */
export function TooltipLayer({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const el = root.current
    if (el === null) return
    const show = (e: Event) => {
      const target = (e.target as Element | null)?.closest?.('[data-tip]')
      if (!target || !el.contains(target)) return
      const r = target.getBoundingClientRect()
      const rr = el.getBoundingClientRect()
      setTip({
        text: target.getAttribute('data-tip') ?? '',
        x: r.left + r.width / 2 - rr.left,
        y: r.top - rr.top,
      })
    }
    const hide = (e: Event) => {
      const to = (e as FocusEvent | PointerEvent).relatedTarget as Element | null
      if (to?.closest?.('[data-tip]')) return
      setTip(null)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTip(null)
    }
    el.addEventListener('pointerover', show)
    el.addEventListener('focusin', show)
    el.addEventListener('pointerout', hide)
    el.addEventListener('focusout', hide)
    el.addEventListener('keydown', key)
    return () => {
      el.removeEventListener('pointerover', show)
      el.removeEventListener('focusin', show)
      el.removeEventListener('pointerout', hide)
      el.removeEventListener('focusout', hide)
      el.removeEventListener('keydown', key)
    }
  }, [])

  // Keep the box inside the chart: shift it back when it would cross either edge.
  useLayoutEffect(() => {
    if (tip === null || box.current === null || root.current === null) {
      setLeft(null)
      return
    }
    const w = box.current.offsetWidth
    const max = root.current.clientWidth
    setLeft(Math.max(0, Math.min(tip.x - w / 2, max - w)))
  }, [tip])

  return (
    <div ref={root} className="relative">
      {children}
      {tip !== null ? (
        <div
          ref={box}
          aria-hidden="true"
          className="pointer-events-none absolute z-10 max-w-72 rounded-xs border border-ink bg-paper px-2 py-1 text-12 whitespace-pre-line text-ink"
          // Set through the CSSOM on a node React creates in the browser (never server-rendered),
          // which the style-src 'self' policy allows.
          style={{
            left: left ?? tip.x,
            top: tip.y,
            transform: 'translateY(calc(-100% - 8px))',
            visibility: left === null ? 'hidden' : 'visible',
          }}
        >
          {tip.text}
        </div>
      ) : null}
    </div>
  )
}
