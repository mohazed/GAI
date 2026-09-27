'use client'

import type { ApiCategory, ApiDayScore } from '@gai/schema/api'
import type { ReactNode } from 'react'
import { longDate, signedInt } from '../lib/format'
import type { Lang } from '../lib/i18n'
import { bandById, type CategoryKey, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { Translate } from '../lib/translate'
import { CategoryRowsView } from './CategoryRowsView'
import type { RawPoint } from './DateSnapshot'
import { ScoreGaugeView } from './ScoreGaugeView'

function rawAt(points: readonly RawPoint[], date: string): RawPoint | null {
  let found: RawPoint | null = null
  for (const p of points) {
    if (p.date <= date) found = p
    else break
  }
  return found
}

export interface SnapshotSectionsProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  buildDate: string
  raw: RawPoint[]
  counts: Record<CategoryKey, number>
  headings: { score: string; categories: string }
  coveragePast: ReactNode
  day: ApiDayScore
  date: string
  t: Translate
}

/**
 * The gauge and the category rows of a country on an earlier date, under the "as of" banner
 * (DateSnapshot). Loaded only when the address carries `?date=`.
 */
export function SnapshotSections({
  lang,
  mode,
  methodology,
  buildDate,
  raw,
  counts,
  headings,
  coveragePast,
  day,
  date,
  t,
}: SnapshotSectionsProps) {
  const band = bandById(methodology, day.band)
  const at = rawAt(raw, date)
  const categories = Object.fromEntries(
    methodology.categories.map((c) => {
      const clipped = day.clipped[c.id]
      const r = at?.raw[c.id] ?? clipped
      // The series carries one-decimal subtotals: beyond the cap by more than rounding is capped.
      const capped = r > c.cap.max + 0.05 || r < c.cap.min - 0.05
      const cat: ApiCategory = {
        raw: capped ? r : clipped,
        clipped,
        cap: c.cap,
        capped,
        scored: c.scored,
        weight: 1,
      }
      return [c.id, cat]
    }),
  ) as Record<CategoryKey, ApiCategory>
  return (
    <>
      <section
        aria-labelledby="score-title"
        className="flex flex-col gap-4 border-t border-rule py-8"
      >
        <h2 id="score-title" className="sr-only">
          {headings.score}
        </h2>
        <div role="status" className="flex flex-col gap-1 border-y border-rule py-3 text-16">
          <p>
            {t('snapshot.banner', {
              date: longDate(date, lang),
              score: signedInt(day.score_display, lang),
              band: band.name[lang],
            })}{' '}
            {day.passivity_applied ? t('snapshot.passivity') : null}
          </p>
          <p className="text-14 text-ink-2">
            {t('snapshot.rest', { build: longDate(buildDate, lang) })}{' '}
            <a href={window.location.pathname}>{t('snapshot.current')}</a>
          </p>
        </div>
        <ScoreGaugeView
          lang={lang}
          mode={mode}
          methodology={methodology}
          value={{ score: day.score, display: day.score_display, band: day.band }}
          t={t}
        />
        {coveragePast}
      </section>
      <section
        aria-labelledby="categories-title"
        className="flex flex-col gap-4 border-t border-rule py-8"
      >
        <h2 id="categories-title" className="text-16 font-semibold">
          {headings.categories}
        </h2>
        <CategoryRowsView
          lang={lang}
          mode={mode}
          methodology={methodology}
          categories={categories}
          counts={counts}
          t={t}
        />
      </section>
    </>
  )
}
