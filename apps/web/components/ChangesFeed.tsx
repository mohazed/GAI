import type { ApiFeedEntry, ApiFeedWeek } from '@gai/schema/api'
import type { ReactNode } from 'react'
import { longDate } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'
import { CompactEvent } from './CompactEvent'
import { FacetBrowser, type FacetDef, type FacetItem } from './FacetBrowser'

export interface ChangesFeedProps {
  lang: Lang
  /** Weeks of changes, newest first (`weeks` of changes/latest.json or a month file). */
  weeks: readonly ApiFeedWeek[]
  /** For the order of the indicators in the filters. */
  methodology: SiteMethodology
  /** Anchor of the feed's section: the "All" filter links point at it. */
  sectionId: string
  /**
   * The filters (default true). Their anchors have fixed ids (`#f-ind-A1`), so a page shows one
   * filtered feed at most: the kit's rows, which repeat every component, show it without them.
   */
  filters?: boolean
}

type Sign = 'positive' | 'negative'

function signOf(points: number): Sign[] {
  return points > 0 ? ['positive'] : points < 0 ? ['negative'] : []
}

function entryValues(e: ApiFeedEntry): Record<string, string[]> {
  return { cty: [e.country], ind: [e.indicator], sign: signOf(e.points) }
}

/** Filter anchors of the country facet: `#f-cty-{ISO3}` (the Changes page's stylesheet). */
export const COUNTRY_FACET = 'cty'

/**
 * The changes feed (docs/05 §5 ChangesFeed): entries grouped by ISO week ("Week of 21 September
 * 2026"), each a compact event (date, country, indicator, summary, points), newest week first.
 * A computed value is listed only when its points differ from the value in force the day before;
 * the others are counted in one line per week, not listed (P-09). Filters by country, indicator
 * and sign work as the country page's event filters do (FacetBrowser): links to `#f-{facet}-
 * {value}` anchors without JavaScript, combined in client state and `?country=&indicator=&sign=`
 * with it. A week is shown while one of its entries is.
 */
export function ChangesFeed({
  lang,
  weeks,
  methodology,
  sectionId,
  filters = true,
}: ChangesFeedProps) {
  const t = getT(lang)
  const groups = weeks
    .map((w) => ({ w, entries: w.entries.filter((e) => e.points_changed) }))
    .filter((g) => g.entries.length > 0 || g.w.unchanged_computed > 0)
  const all = groups.flatMap((g) => g.entries)
  if (groups.length === 0) return <p className="text-16 text-ink-2">{t('changes.empty')}</p>

  const collator = new Intl.Collator(lang)
  const countries = [...new Map(all.map((e) => [e.country, e.country_name[lang]]))].sort((a, b) =>
    collator.compare(a[1], b[1]),
  )
  const present = new Set(all.map((e) => e.indicator))
  const signs = new Set(all.flatMap((e) => signOf(e.points)))
  const facets: FacetDef[] = [
    {
      key: COUNTRY_FACET,
      param: 'country',
      label: t('changes.country'),
      values: countries.map(([id, label]) => ({ id, label })),
    },
    {
      key: 'ind',
      param: 'indicator',
      label: t('changes.indicator'),
      values: methodology.indicators
        .filter((i) => present.has(i.id))
        .map((i) => ({ id: i.id, label: i.id })),
    },
    {
      key: 'sign',
      param: 'sign',
      label: t('changes.sign'),
      values: (['positive', 'negative'] as const)
        .filter((s) => signs.has(s))
        .map((s) => ({ id: s, label: t(`changes.${s}`) })),
    },
  ]

  const items: FacetItem[] = []
  const nodes: ReactNode[] = []
  for (const { w, entries } of groups) {
    // The week's heading and its count line carry the values of its entries, so that the
    // stylesheet hides them with the entries when JavaScript is off.
    const union: Record<string, string[]> = { cty: [], ind: [], sign: [] }
    for (const e of entries)
      for (const [k, v] of Object.entries(entryValues(e))) union[k] = [...(union[k] ?? []), ...v]
    const headingId = `${sectionId}-${w.week}`
    items.push({ key: `h-${w.week}`, values: union, group: w.week, header: true })
    nodes.push(
      <h3 key={`h-${w.week}`} id={headingId} className="mt-6 text-16 font-semibold">
        {t('changes.week', { date: longDate(w.from, lang) })}
        <span className="ms-2 font-mono text-m12 font-normal text-ink-2">{w.week}</span>
      </h3>,
    )
    for (const e of entries) {
      items.push({ key: `${e.id}-${e.change}`, values: entryValues(e), group: w.week })
      nodes.push(
        <CompactEvent
          key={`${e.id}-${e.change}`}
          entry={e}
          lang={lang}
          endedLabel={t('changes.ended')}
          endedPoints={t('changes.endedPoints')}
        />,
      )
    }
    if (w.unchanged_computed > 0) {
      items.push({ key: `u-${w.week}`, values: union, group: w.week, header: true })
      nodes.push(
        <p key={`u-${w.week}`} className="border-t border-rule pt-2 text-12 text-ink-2">
          {t('changes.unchangedComputed', { count: w.unchanged_computed })}
        </p>,
      )
    }
  }

  // Only recomputations without change: nothing to filter.
  if (all.length === 0 || !filters) return <div className="flex flex-col">{nodes}</div>
  return (
    <FacetBrowser ns="changes" facets={facets} items={items} sectionId={sectionId} list="div">
      {nodes}
    </FacetBrowser>
  )
}
