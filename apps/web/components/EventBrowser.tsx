'use client'

import { useTranslations } from 'next-intl'
import { Children, type MouseEvent, type ReactNode, useEffect, useState } from 'react'
import { type Filter, matches, NO_FILTER, type Sign } from '../lib/event-list'

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

type Facet = 'ind' | 'sign' | 'conf'
const PARAM: Record<Facet, keyof Filter> = { ind: 'indicator', sign: 'sign', conf: 'confidence' }
const QUERY: Record<keyof Filter, string> = {
  indicator: 'indicator',
  sign: 'sign',
  confidence: 'confidence',
}

function filterFromLocation(facets: EventBrowserProps['facets']): Filter {
  const q = new URLSearchParams(window.location.search)
  const f: Filter = { ...NO_FILTER }
  const ind = q.get(QUERY.indicator)
  if (ind !== null && facets.indicators.some((i) => i.id === ind)) f.indicator = ind
  const sign = q.get(QUERY.sign)
  if (sign === 'positive' || sign === 'negative') f.sign = sign
  const conf = q.get(QUERY.confidence)
  if (conf !== null && facets.confidences.some((c) => c.id === conf)) f.confidence = conf
  // A filter link followed without JavaScript (#f-ind-A2) becomes the same state.
  const m = /^#f-(ind|sign|conf)-(.+)$/.exec(window.location.hash)
  if (m !== null) {
    const key = PARAM[m[1] as Facet]
    const value = decodeURIComponent(m[2] as string)
    if (key === 'sign') f.sign = value === 'positive' || value === 'negative' ? value : null
    else f[key] = value
  }
  return f
}

/** The address with the filter in the query, other parameters (`date`) kept, no hash. */
function urlWith(filter: Filter): string {
  const q = new URLSearchParams(window.location.search)
  for (const k of Object.keys(QUERY) as (keyof Filter)[]) {
    const v = filter[k]
    if (v === null) q.delete(QUERY[k])
    else q.set(QUERY[k], v)
  }
  const s = q.toString()
  return `${window.location.pathname}${s === '' ? '' : `?${s}`}`
}

/** Opens the <details> around the element the address points at (a value of a run). */
function openTarget(): HTMLElement | null {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (id === '') return null
  const el = document.getElementById(id)
  if (el === null) return null
  let opened = false
  let d = el.closest('details')
  while (d !== null) {
    if (!d.open) {
      d.open = true
      opened = true
    }
    d = d.parentElement?.closest('details') ?? null
  }
  if (opened) el.scrollIntoView()
  return el
}

/**
 * The events list with its filters (docs/05 §6 Country: indicator, sign, confidence). The filters
 * are links: without JavaScript each points at an anchor `#f-{facet}-{value}` before the list and
 * the stylesheet hides the entries without that value while it is the target (one facet at a
 * time); with JavaScript the links set the filter in React state, the three facets combine, and
 * the address carries them as `?indicator=&sign=&confidence=`. The count line is in the HTML from
 * the start (.js-only), so hydration moves nothing.
 */
export function EventBrowser({ items, facets, sectionId, children }: EventBrowserProps) {
  const t = useTranslations('events')
  const [filter, setFilter] = useState<Filter>(NO_FILTER)
  const [ready, setReady] = useState(false)
  const cards = Children.toArray(children)

  useEffect(() => {
    const initial = filterFromLocation(facets)
    setFilter(initial)
    setReady(true)
    if (/^#f-/.test(window.location.hash)) window.history.replaceState(null, '', urlWith(initial))
    const onHash = () => {
      const el = openTarget()
      // A link to an entry hidden by the filter (from the Timeline): show everything.
      if (el?.closest('.ev-item[hidden]')) {
        setFilter(NO_FILTER)
        window.history.replaceState(null, '', `${urlWith(NO_FILTER)}${window.location.hash}`)
        window.requestAnimationFrame(() => el.scrollIntoView())
      }
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [facets])

  const shown = items.filter((it) => matches(it, filter)).length

  const set = (e: MouseEvent<HTMLAnchorElement>, key: keyof Filter, value: string | null) => {
    e.preventDefault()
    const next = { ...filter, [key]: value } as Filter
    setFilter(next)
    window.history.replaceState(null, '', urlWith(next))
  }

  const row = (facet: Facet, label: string, values: { id: string; label: string }[]): ReactNode => {
    const key = PARAM[facet]
    const current = filter[key]
    return (
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-ink-2">{label}</span>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          <li>
            <a
              href={`#${sectionId}`}
              className="ev-flink inline-flex min-h-6 items-center"
              aria-current={ready && current === null ? 'true' : undefined}
              onClick={(e) => set(e, key, null)}
            >
              {t('all')}
            </a>
          </li>
          {values.map((v) => (
            <li key={v.id}>
              <a
                href={`#f-${facet}-${v.id}`}
                className={`ev-flink ev-flink-${v.id} inline-flex min-h-6 items-center`}
                aria-current={ready && current === v.id ? 'true' : undefined}
                onClick={(e) => set(e, key, v.id)}
              >
                {v.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const anchors = [
    ...facets.indicators.map((i) => `f-ind-${i.id}`),
    ...facets.signs.map((s) => `f-sign-${s}`),
    ...facets.confidences.map((c) => `f-conf-${c.id}`),
  ]

  return (
    <div className="events flex flex-col">
      {anchors.map((id) => (
        <span key={id} id={id} className="ev-anchor" />
      ))}
      <nav aria-label={t('filters')} className="ev-filters flex flex-col gap-1 text-14">
        {row('ind', t('indicator'), facets.indicators)}
        {row(
          'sign',
          t('sign'),
          facets.signs.map((s) => ({ id: s, label: t(s) })),
        )}
        {row('conf', t('confidence'), facets.confidences)}
      </nav>
      <p aria-live="polite" className="js-only mt-4 text-14 text-ink-2">
        {t('shown', { shown, total: items.length })}
        {ready && shown < items.length ? (
          <>
            {' '}
            <a
              href={`#${sectionId}`}
              onClick={(e) => {
                e.preventDefault()
                setFilter(NO_FILTER)
                window.history.replaceState(null, '', urlWith(NO_FILTER))
              }}
            >
              {t('clear')}
            </a>
          </>
        ) : null}
      </p>
      <ol className="ev-list mt-4">
        {items.map((it, i) => (
          <li
            key={it.key}
            className={`ev-item ${[...it.indicators, ...it.signs, ...it.confidences].map((v) => `f-${v}`).join(' ')}`}
            hidden={!matches(it, filter) || undefined}
          >
            {cards[i]}
          </li>
        ))}
      </ol>
      {shown === 0 ? <p className="mt-4 text-16">{t('none')}</p> : null}
    </div>
  )
}
