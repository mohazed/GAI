'use client'

import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'
import type { Sign } from '../lib/event-list'
import { FacetBrowser, type FacetDef } from './FacetBrowser'

export interface BrowserItem {
  key: string
  indicators: string[]
  signs: Sign[]
  confidences: string[]
}

export interface EventBrowserProps {
  /** One per child, in the same order. */
  items: BrowserItem[]
  facets: {
    indicators: { id: string; label: string }[]
    signs: Sign[]
    confidences: { id: string; label: string }[]
  }
  /** Anchor of the events section: the "All" links point at it. */
  sectionId: string
  /** The rendered entries (EventCard, ComputedRun), newest first. */
  children: ReactNode
}

/**
 * The events list of a country page with its filters (docs/05 §6 Country: indicator, sign,
 * confidence), as links that work without JavaScript through `#f-{facet}-{value}` anchors and
 * with it through client state and `?indicator=&sign=&confidence=` (FacetBrowser, shared with the
 * changes feed).
 */
export function EventBrowser({ items, facets, sectionId, children }: EventBrowserProps) {
  const t = useTranslations('events')
  const defs = useMemo<FacetDef[]>(
    () => [
      { key: 'ind', param: 'indicator', label: t('indicator'), values: facets.indicators },
      {
        key: 'sign',
        param: 'sign',
        label: t('sign'),
        values: facets.signs.map((s) => ({ id: s, label: t(s) })),
      },
      { key: 'conf', param: 'confidence', label: t('confidence'), values: facets.confidences },
    ],
    [facets, t],
  )
  const list = useMemo(
    () =>
      items.map((it) => ({
        key: it.key,
        values: { ind: it.indicators, sign: it.signs, conf: it.confidences },
      })),
    [items],
  )
  return (
    <FacetBrowser ns="events" facets={defs} items={list} sectionId={sectionId} list="ol">
      {children}
    </FacetBrowser>
  )
}
