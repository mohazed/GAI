'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

/** A build older than this many days is stale (P-09): the site is rebuilt every night (P-12). */
export const STALE_AFTER_DAYS = 3

/** Whole days from the build date (UTC) to `now`. */
export function buildAge(buildDate: string, now: number): number {
  return Math.floor((now - Date.parse(`${buildDate}T00:00:00Z`)) / 86_400_000)
}

/**
 * "Stale build" notice of the Changes page (P-09): once JavaScript runs, a line saying the page
 * was built more than three days ago, because the list of changes then misses what happened since.
 * The build date is the API's (`manifest.json` `build_date`); `dateLabel` is the same date as the
 * page writes it (formatted on the server, so the formatting code stays out of the browser).
 * Without JavaScript the page's own "Built on" line gives the date.
 */
export function StaleNotice({ buildDate, dateLabel }: { buildDate: string; dateLabel: string }) {
  const t = useTranslations('changes')
  const [age, setAge] = useState<number | null>(null)
  useEffect(() => {
    const days = buildAge(buildDate, Date.now())
    if (days > STALE_AFTER_DAYS) setAge(days)
  }, [buildDate])
  if (age === null) return null
  return (
    <p role="status" className="border-y border-ink py-3 text-16">
      {t('stale', { date: dateLabel, days: age })}
    </p>
  )
}
