import type { ApiCoverage } from '@gai/schema/api'
import { formatInteger, longDate, percent } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'

export interface CoverageBarProps {
  lang: Lang
  methodology: SiteMethodology
  /** null for an excluded entity: nothing was assessed. */
  coverage: ApiCoverage | null
  /** The build date: coverage is the research status on that date (docs/02 §8). */
  buildDate: string
  /** The date of the gauge beside it; when earlier than the build date the bar says so. */
  gaugeDate?: string
}

const SEGMENT: Record<string, string> = {
  'has-events': 'bg-ink',
  'none-found': 'bg-ink',
  'no-data': 'hatch border border-rule',
  unchecked: 'border border-rule',
}

/**
 * One segment per applicable indicator (docs/05 §5 CoverageBar): ink for has-events or
 * none-found, hatched for no-data, an empty hairline box for unchecked. Not-applicable indicators
 * are not drawn. Hovering a segment names the indicator; the figures are also written out.
 */
export function CoverageBar({
  lang,
  methodology,
  coverage,
  buildDate,
  gaugeDate,
}: CoverageBarProps) {
  const t = getT(lang)
  if (coverage === null) {
    return <p className="text-14 text-ink-2">{t('coverage.excluded')}</p>
  }
  const applicable = methodology.indicators.filter(
    (i) =>
      i.scored &&
      coverage.statuses[i.id] !== undefined &&
      coverage.statuses[i.id] !== 'not-applicable',
  )
  const covered = coverage.has_events + coverage.none_found
  const share = percent(coverage.ratio, lang)
  const counts = t('coverage.missing', {
    noData: coverage.no_data,
    unchecked: coverage.unchecked,
  })
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-14">
        <p className="font-semibold">{t('coverage.label', { pct: share })}</p>
        <p className="text-ink-2">{counts}</p>
      </div>
      <div
        role="img"
        aria-label={t('coverage.aria', {
          pct: share,
          covered: formatInteger(covered, lang),
          applicable: formatInteger(coverage.applicable, lang),
          noData: coverage.no_data,
          unchecked: coverage.unchecked,
        })}
        dir="ltr"
      >
        <ul className="coverage-bar flex h-2 gap-0.5">
          {applicable.map((ind) => {
            const status = coverage.statuses[ind.id] ?? 'unchecked'
            return (
              <li
                key={ind.id}
                title={`${ind.id} · ${ind.name[lang]} · ${t(`coverage.status.${status}`)}`}
                className={`flex-1 ${SEGMENT[status]}`}
              />
            )
          })}
        </ul>
      </div>
      {gaugeDate !== undefined && gaugeDate < buildDate ? (
        <p className="text-12 text-ink-2">
          {t('coverage.pastDate', { date: longDate(buildDate, lang) })}
        </p>
      ) : null}
    </div>
  )
}
