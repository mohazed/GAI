'use client'

import type { ApiDayScore } from '@gai/schema/api'
import { useTranslations } from 'next-intl'
import { type ReactNode, useEffect, useState } from 'react'
import { longDate } from '../lib/format'
import type { Lang } from '../lib/i18n'
import type { CategoryKey, SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { Translate } from '../lib/translate'
import type { SnapshotSections } from './SnapshotView'

/** Raw category subtotals (one decimal) at a change point of the series, for the "capped" mark. */
export interface RawPoint {
  date: string
  raw: Record<CategoryKey, number>
}

export interface DateSnapshotProps {
  lang: Lang
  mode: Mode
  iso3: string
  methodology: SiteMethodology
  buildDate: string
  /** The API folder the page reads (`/api/v1`). */
  apiBase: string
  /** Change points of the series, raw subtotals only. */
  raw: RawPoint[]
  /** Published events by category at the build date (scorecard counts; unused in score mode). */
  counts: Record<CategoryKey, number>
  /** Headings of the two sections the snapshot redraws. */
  headings: { score: string; categories: string }
  /** The CoverageBar of the build date, with its line saying so (it is not recomputed). */
  coveragePast: ReactNode
  /** The build-date sections, shown when the address has no `?date=`. */
  children: ReactNode
}

type State =
  | { kind: 'none' }
  | { kind: 'notice'; text: string }
  | { kind: 'snapshot'; date: string; day: ApiDayScore; View: typeof SnapshotSections }

const ISO = /^\d{4}-\d{2}-\d{2}$/

/**
 * The `?date=` snapshot of a country page (docs/05 §5 CiteThis permalinks, D-05 deviation 1):
 * after hydration, a valid date reads `scores/{date}.json` and redraws the gauge and the category
 * rows for that date under an "as of" banner; coverage, events and the timeline stay those of the
 * build date, and the page says so (coverage is published for the build date only, B-70). In
 * scorecard mode (D-16) no score is shown: the banner says the page is the build-date scorecard.
 */
export function DateSnapshot({
  lang,
  mode,
  iso3,
  methodology,
  buildDate,
  apiBase,
  raw,
  counts,
  headings,
  coveragePast,
  children,
}: DateSnapshotProps) {
  const intl = useTranslations()
  const t: Translate = (key, values) => intl(key as never, values as never)
  const [state, setState] = useState<State>({ kind: 'none' })

  // Read once, after hydration: the address and the props do not change on this page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once; t and the props are fixed.
  useEffect(() => {
    const date = new URLSearchParams(window.location.search).get('date')
    if (date === null) return
    const from = methodology.windowStart
    const range = { from: longDate(from, lang), to: longDate(buildDate, lang) }
    if (!ISO.test(date) || Number.isNaN(Date.parse(date)) || date < from || date > buildDate) {
      // The address is anyone's text: at most ten characters of it are shown back (P-19).
      const shown = date.length > 10 ? `${date.slice(0, 10)}…` : date
      setState({ kind: 'notice', text: t('snapshot.invalid', { date: shown, ...range }) })
      return
    }
    if (mode === 'scorecard') {
      setState({
        kind: 'notice',
        text: t('snapshot.scorecard', {
          date: longDate(date, lang),
          build: longDate(buildDate, lang),
        }),
      })
      return
    }
    let live = true
    // The views that redraw the gauge and the categories load only for a dated link: they stay
    // out of the page's first JavaScript (docs/04 §3 budget).
    Promise.all([
      fetch(`${apiBase}/scores/${date}.json`).then((r) =>
        r.ok ? (r.json() as Promise<{ countries: ApiDayScore[] }>) : null,
      ),
      import('./SnapshotView'),
    ])
      .then(([file, mod]) => {
        if (!live) return
        const day = file?.countries.find((c) => c.iso3 === iso3)
        setState(
          day === undefined
            ? {
                kind: 'notice',
                text: t('snapshot.missing', { date: longDate(date, lang), ...range }),
              }
            : { kind: 'snapshot', date, day, View: mod.SnapshotSections },
        )
      })
      .catch(() => {
        if (live)
          setState({
            kind: 'notice',
            text: t('snapshot.missing', { date: longDate(date, lang), ...range }),
          })
      })
    return () => {
      live = false
    }
  }, [])

  if (state.kind === 'none') return <>{children}</>
  if (state.kind === 'notice') {
    return (
      <>
        <p role="status" className="border-y border-rule py-3 text-16">
          {state.text}
        </p>
        {children}
      </>
    )
  }

  const { View, day, date } = state
  return (
    <View
      lang={lang}
      mode={mode}
      methodology={methodology}
      buildDate={buildDate}
      raw={raw}
      counts={counts}
      headings={headings}
      coveragePast={coveragePast}
      day={day}
      date={date}
      t={t}
    />
  )
}
