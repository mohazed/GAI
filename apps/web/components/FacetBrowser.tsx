'use client'

import { useTranslations } from 'next-intl'
import { Children, type MouseEvent, type ReactNode, useEffect, useState } from 'react'

/** One filter facet: its anchor prefix (`ind` gives `#f-ind-A1`), query parameter and values. */
export interface FacetDef {
  key: string
  param: string
  label: string
  values: { id: string; label: string }[]
}

/**
 * One entry of the list, in the order of the children. `values` holds, per facet key, the values
 * the entry matches. A `header` (the changes feed's week headings) is shown while any entry of
 * its `group` is, or while no filter is set; its `values` are those of its group (the class names
 * the stylesheet reads when JavaScript is off).
 */
export interface FacetItem {
  key: string
  values: Record<string, string[]>
  group?: string
  header?: boolean
}

export type FacetFilter = Record<string, string | null>

export interface FacetBrowserProps {
  /** Message namespace with `filters`, `all`, `shown`, `clear` and `none`. */
  ns: 'events' | 'changes'
  facets: FacetDef[]
  /** One per child, in the same order. */
  items: FacetItem[]
  /** Anchor of the section: the "All" links point at it. */
  sectionId: string
  /** `ol` (country page events) or `div` (changes feed: headings and entries). */
  list: 'ol' | 'div'
  children: ReactNode
}

const empty = (facets: FacetDef[]): FacetFilter =>
  Object.fromEntries(facets.map((f) => [f.param, null]))

function isEmpty(filter: FacetFilter): boolean {
  return Object.values(filter).every((v) => v === null)
}

function matchesItem(item: FacetItem, facets: FacetDef[], filter: FacetFilter): boolean {
  return facets.every((f) => {
    const v = filter[f.param]
    return v === null || v === undefined || (item.values[f.key] ?? []).includes(v)
  })
}

/** Which items are shown: entries by their values, headers by their group. */
export function visibleItems(
  items: readonly FacetItem[],
  facets: FacetDef[],
  filter: FacetFilter,
): boolean[] {
  const entries = items.map((it) => !it.header && matchesItem(it, facets, filter))
  const groups = new Set(items.filter((it, i) => entries[i] && it.group).map((it) => it.group))
  const none = isEmpty(filter)
  return items.map((it, i) =>
    it.header ? none || (it.group !== undefined && groups.has(it.group)) : (entries[i] ?? false),
  )
}

function filterFromLocation(facets: FacetDef[]): FacetFilter {
  const q = new URLSearchParams(window.location.search)
  const f = empty(facets)
  for (const d of facets) {
    const v = q.get(d.param)
    if (v !== null && d.values.some((x) => x.id === v)) f[d.param] = v
  }
  // A filter link followed without JavaScript (#f-ind-A2) becomes the same state.
  const m = /^#f-([a-z]+)-(.+)$/.exec(window.location.hash)
  const d = m === null ? undefined : facets.find((x) => x.key === m[1])
  if (m !== null && d !== undefined) {
    const v = decodeURIComponent(m[2] as string)
    if (d.values.some((x) => x.id === v)) f[d.param] = v
  }
  return f
}

/** The address with the filter in the query, other parameters (`date`) kept, no hash. */
function urlWith(filter: FacetFilter): string {
  const q = new URLSearchParams(window.location.search)
  for (const [k, v] of Object.entries(filter)) {
    if (v === null) q.delete(k)
    else q.set(k, v)
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
 * A filtered list (the country page's events, the changes feed). The filters are links: without
 * JavaScript each points at an anchor `#f-{facet}-{value}` before the list and the stylesheet
 * hides the entries without the class `f-{value}` while that anchor is the target (one facet at a
 * time; app/globals.css and the Changes page's country rules); with JavaScript the links set the
 * filter in React state, the facets combine, and the address carries them as query parameters.
 * The count line is in the HTML from the start (.js-only), so hydration moves nothing.
 */
export function FacetBrowser({ ns, facets, items, sectionId, list, children }: FacetBrowserProps) {
  const t = useTranslations(ns)
  const [filter, setFilter] = useState<FacetFilter>(() => empty(facets))
  const [ready, setReady] = useState(false)
  const cards = Children.toArray(children)

  // Once, after hydration: the facets are fixed for the page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once; the facets do not change.
  useEffect(() => {
    const initial = filterFromLocation(facets)
    setFilter(initial)
    setReady(true)
    if (/^#f-/.test(window.location.hash)) window.history.replaceState(null, '', urlWith(initial))
    const onHash = () => {
      const el = openTarget()
      // A link to an entry hidden by the filter (from the Timeline): show everything.
      if (el?.closest('.ev-item[hidden]')) {
        const none = empty(facets)
        setFilter(none)
        window.history.replaceState(null, '', `${urlWith(none)}${window.location.hash}`)
        window.requestAnimationFrame(() => el.scrollIntoView())
      }
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const visible = visibleItems(items, facets, filter)
  const total = items.filter((it) => !it.header).length
  const shown = items.filter((it, i) => !it.header && visible[i]).length

  const set = (e: MouseEvent<HTMLAnchorElement>, param: string, value: string | null) => {
    e.preventDefault()
    const next = { ...filter, [param]: value }
    setFilter(next)
    window.history.replaceState(null, '', urlWith(next))
  }

  const anchors = facets.flatMap((f) => f.values.map((v) => `f-${f.key}-${v.id}`))
  const Item = list === 'ol' ? 'li' : 'div'
  const List = list

  return (
    <div className="events flex flex-col">
      {anchors.map((id) => (
        <span key={id} id={id} className="ev-anchor" />
      ))}
      <nav aria-label={t('filters')} className="ev-filters flex flex-col gap-1 text-14">
        {facets.map((f) => {
          const current = filter[f.param] ?? null
          return (
            <div key={f.key} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-ink-2">{f.label}</span>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                <li>
                  <a
                    href={`#${sectionId}`}
                    className="ev-flink inline-flex min-h-6 items-center"
                    aria-current={ready && current === null ? 'true' : undefined}
                    onClick={(e) => set(e, f.param, null)}
                  >
                    {t('all')}
                  </a>
                </li>
                {f.values.map((v) => (
                  <li key={v.id}>
                    <a
                      href={`#f-${f.key}-${v.id}`}
                      className={`ev-flink ev-flink-${v.id} inline-flex min-h-6 items-center`}
                      aria-current={ready && current === v.id ? 'true' : undefined}
                      onClick={(e) => set(e, f.param, v.id)}
                    >
                      {v.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>
      <p aria-live="polite" className="js-only mt-4 text-14 text-ink-2">
        {t('shown', { shown, total })}
        {ready && shown < total ? (
          <>
            {' '}
            <a
              href={`#${sectionId}`}
              onClick={(e) => {
                e.preventDefault()
                const none = empty(facets)
                setFilter(none)
                window.history.replaceState(null, '', urlWith(none))
              }}
            >
              {t('clear')}
            </a>
          </>
        ) : null}
      </p>
      <List className="ev-list mt-4">
        {items.map((it, i) => (
          <Item
            key={it.key}
            className={`ev-item ${[...new Set(Object.values(it.values).flat())]
              .map((v) => `f-${v}`)
              .join(' ')}`}
            hidden={!visible[i] || undefined}
          >
            {cards[i]}
          </Item>
        ))}
      </List>
      {shown === 0 && total > 0 ? <p className="mt-4 text-16">{t('none')}</p> : null}
    </div>
  )
}
