import type { ApiFeedEntry } from '@gai/schema/api'
import { formatSigned } from '@gai/scoring'

export type Lang = 'en' | 'fr'

/**
 * A compact event line (docs/05 §5 ChangesFeed, §6 Home "Changed this week"): date, country,
 * indicator, summary, points. The same layout for both signs. `endedLabel` marks the end of a
 * standing state or of a computed value.
 */
export function CompactEvent({
  entry,
  lang,
  endedLabel,
  endedPoints,
}: {
  entry: ApiFeedEntry
  lang: Lang
  endedLabel: string
  /** Screen-reader text for the struck points of an ending: "no longer counted". */
  endedPoints: string
}) {
  const href = `/${lang}/country/${entry.country}/#${entry.id}`
  return (
    <article className="grid gap-x-6 gap-y-1 border-t border-rule py-3 md:grid-cols-[112px_1fr_auto]">
      <p className="font-mono text-m13">
        <time dateTime={entry.date}>{entry.date}</time>
      </p>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-14">
          <a href={`/${lang}/country/${entry.country}/`} className="font-semibold">
            {entry.country_name[lang]}
          </a>
          <span className="ms-2 font-mono text-m12 text-ink-2" title={entry.indicator_name[lang]}>
            {entry.indicator}
          </span>
          {entry.change === 'end' ? (
            <span className="ms-2 text-12 text-ink-2">{endedLabel}</span>
          ) : null}
        </p>
        <p className="text-16">
          <a href={href} className="text-ink no-underline hover:underline">
            {entry.summary[lang]}
          </a>
        </p>
      </div>
      <p className="num font-mono text-m14 font-semibold md:text-end">
        {entry.change === 'end' ? (
          <>
            <s className="text-ink-2">{formatSigned(entry.points, lang, 1)}</s>
            <span className="sr-only"> {endedPoints}</span>
          </>
        ) : (
          formatSigned(entry.points, lang, 1)
        )}
      </p>
    </article>
  )
}
