'use client'

import type { ApiFeedWeek } from '@gai/schema/api'
import { formatLongDate } from '@gai/scoring'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useId, useMemo, useState } from 'react'
import { CompactEvent, type Lang } from './CompactEvent'

export interface ChangesFeedProps {
  /** Weeks of changes, newest first (`weeks` of changes/latest.json or a month file). */
  weeks: ApiFeedWeek[]
}

/**
 * The changes feed (docs/05 §5 ChangesFeed): entries grouped by ISO week, each a compact event;
 * filters by country, indicator and sign once JavaScript runs. Computed values whose points did
 * not change are counted, not listed (P-09).
 */
export function ChangesFeed({ weeks }: ChangesFeedProps) {
  const t = useTranslations('changes')
  const lang = useLocale() as Lang
  const id = useId()
  const [ready, setReady] = useState(false)
  const [country, setCountry] = useState('')
  const [indicator, setIndicator] = useState('')
  const [sign, setSign] = useState('')
  useEffect(() => setReady(true), [])

  const all = weeks.flatMap((w) => w.entries.filter((e) => e.points_changed))
  const countries = useMemo(() => {
    const m = new Map(all.map((e) => [e.country, e.country_name[lang]]))
    return [...m].sort((a, b) => a[1].localeCompare(b[1], lang))
  }, [all, lang])
  const indicators = useMemo(() => [...new Set(all.map((e) => e.indicator))].sort(), [all])

  const keep = (e: ApiFeedWeek['entries'][number]) =>
    e.points_changed &&
    (country === '' || e.country === country) &&
    (indicator === '' || e.indicator === indicator) &&
    (sign === '' || (sign === 'positive' ? e.points > 0 : e.points < 0))

  const shown = weeks.map((w) => ({ w, entries: w.entries.filter(keep) }))
  const total = shown.reduce((n, s) => n + s.entries.length, 0)

  return (
    <div className="flex flex-col gap-6">
      {ready && all.length > 0 ? (
        <fieldset className="flex flex-wrap items-end gap-4">
          <legend className="sr-only">{t('filters')}</legend>
          <label className="flex flex-col gap-1 text-14" htmlFor={`${id}-c`}>
            {t('country')}
            <select
              id={`${id}-c`}
              value={country}
              onChange={(e) => setCountry(e.currentTarget.value)}
              className="min-h-8 rounded-xs border border-ink bg-paper px-2"
            >
              <option value="">{t('all')}</option>
              {countries.map(([iso, name]) => (
                <option key={iso} value={iso}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-14" htmlFor={`${id}-i`}>
            {t('indicator')}
            <select
              id={`${id}-i`}
              value={indicator}
              onChange={(e) => setIndicator(e.currentTarget.value)}
              className="min-h-8 rounded-xs border border-ink bg-paper px-2"
            >
              <option value="">{t('all')}</option>
              {indicators.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-14" htmlFor={`${id}-s`}>
            {t('sign')}
            <select
              id={`${id}-s`}
              value={sign}
              onChange={(e) => setSign(e.currentTarget.value)}
              className="min-h-8 rounded-xs border border-ink bg-paper px-2"
            >
              <option value="">{t('all')}</option>
              <option value="positive">{t('positive')}</option>
              <option value="negative">{t('negative')}</option>
            </select>
          </label>
        </fieldset>
      ) : null}
      {total === 0 ? <p className="text-16 text-ink-2">{t('empty')}</p> : null}
      {shown
        .filter((s) => s.entries.length > 0 || s.w.unchanged_computed > 0)
        .map(({ w, entries }) => (
          <section key={w.week} aria-labelledby={`${id}-${w.week}`}>
            <h3 id={`${id}-${w.week}`} className="text-16 font-semibold">
              {t('week', { date: formatLongDate(w.from, lang) })}
              <span className="ms-2 font-mono text-m12 font-normal text-ink-2">{w.week}</span>
            </h3>
            {entries.map((e) => (
              <CompactEvent
                key={`${e.id}-${e.change}`}
                entry={e}
                lang={lang}
                endedLabel={t('ended')}
                endedPoints={t('endedPoints')}
              />
            ))}
            {w.unchanged_computed > 0 ? (
              <p className="border-t border-rule pt-2 text-12 text-ink-2">
                {t('unchangedComputed', { count: w.unchanged_computed })}
              </p>
            ) : null}
          </section>
        ))}
    </div>
  )
}
