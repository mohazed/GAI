import type { ApiChangesMonthFile } from '@gai/schema/api'
import type { ReactNode } from 'react'
import type { Lang } from '../lib/i18n'
import { type Block, parseMarkdown } from '../lib/markdown'

type Section = 'movers' | 'new' | 'ended' | 'corrections' | 'methodology'

/** The report's `##` sections in order (packages/pipeline/src/build/report.ts). */
function sections(scorecard: boolean): Section[] {
  const s: Section[] = ['new', 'ended', 'corrections', 'methodology']
  return scorecard ? s : ['movers', ...s]
}

interface Link {
  href: string | null
  /** The date the bullet must start with: a check that the bullet is the entry linked. */
  date: string
}

/**
 * The links of a report's rows, in the order the report writes them (report.ts): the movers
 * (rises, then falls), one list per week of new events (the starts whose points changed), the
 * ends, the corrections.
 */
export function reportLinks(month: ApiChangesMonthFile, lang: Lang) {
  const country = (iso3: string, id?: string) =>
    `/${lang}/country/${iso3}/${id === undefined ? '' : `#${id}`}`
  return {
    movers: [...month.movers.up, ...month.movers.down].map((m) => country(m.iso3)),
    weeks: month.weeks
      .filter((w) => w.entries.some((e) => e.change === 'start'))
      .map((w) =>
        w.entries
          .filter((e) => e.change === 'start' && e.points_changed)
          .map((e): Link => ({ href: country(e.country, e.id), date: e.date })),
      )
      .filter((list) => list.length > 0),
    ended: month.weeks.flatMap((w) =>
      w.entries
        .filter((e) => e.change === 'end')
        .map((e): Link => ({ href: country(e.country, e.id), date: e.date })),
    ),
    corrections: month.corrections.map(
      (c): Link => ({
        href: c.country === null ? null : country(c.country, c.event),
        date: c.date,
      }),
    ),
  }
}

function fail(month: string, what: string): never {
  throw new Error(
    `monthly report ${month}: ${what} (the report and changes/${month}.json disagree)`,
  )
}

/** `2025-08-08 · Germany · A6 · +10 · summary`, with the summary linked to the event. */
function EntryLine({ text, link, month }: { text: string; link: Link; month: string }) {
  const parts = text.split(' · ')
  if (parts[0] !== link.date || parts.length < 5) fail(month, `unexpected line "${text}"`)
  const [date, country, indicator, points, ...rest] = parts
  const summary = rest.join(' · ')
  return (
    <>
      <span className="font-mono text-m13">{date}</span> · {country} ·{' '}
      <span className="font-mono text-m13">{indicator}</span> ·{' '}
      <span className="num font-mono text-m13">{points}</span> ·{' '}
      {link.href === null ? summary : <a href={link.href}>{summary}</a>}
    </>
  )
}

/** `2026-01-02 · evt_… · correction · reason`, with the event id linked to its card. */
function CorrectionLine({ text, link, month }: { text: string; link: Link; month: string }) {
  const parts = text.split(' · ')
  if (parts[0] !== link.date || parts.length < 4) fail(month, `unexpected line "${text}"`)
  const [date, event, kind, ...rest] = parts
  return (
    <>
      <span className="font-mono text-m13">{date}</span> ·{' '}
      {link.href === null ? (
        <span className="font-mono text-m13 break-all">{event}</span>
      ) : (
        <a href={link.href} className="font-mono text-m13 break-all">
          {event}
        </a>
      )}{' '}
      · {kind} · {rest.join(' · ')}
    </>
  )
}

/**
 * A monthly report (docs/05 §6 Changes: movers, new events, corrections) rendered from its
 * Markdown (changes/{YYYY-MM}.md and its French and scorecard variants, D-16), with the site's
 * typography: the `#` title is the page's h1. Each listed entry links to its card on the country
 * page, each mover to the country page and each correction to the event; the links come from the
 * month's JSON in the order the report writes its rows, and a line that does not match its entry
 * fails the build.
 */
export function MonthReport({
  lang,
  month,
  markdown,
  scorecard,
}: {
  lang: Lang
  month: ApiChangesMonthFile
  markdown: string
  scorecard: boolean
}) {
  const blocks = parseMarkdown(markdown)
  const order = sections(scorecard)
  const links = reportLinks(month, lang)
  const weeks = [...links.weeks]
  let h2 = -1
  let beforeFirstSection = true
  const out: ReactNode[] = []

  // Keys: a report is static text, rendered once at build; its blocks never reorder.
  const keyed = blocks.map((b, n) => ({ b, i: `b${n}` }))
  keyed.forEach(({ b, i }: { b: Block; i: string }) => {
    const section = order[h2]
    switch (b.kind) {
      case 'heading':
        if (b.level === 1) {
          out.push(
            <h1 key={i} className="display text-d40 md:text-d64">
              {b.text}
            </h1>,
          )
        } else if (b.level === 2) {
          h2++
          beforeFirstSection = false
          if (order[h2] === undefined) fail(month.month, `unexpected section "${b.text}"`)
          out.push(
            <h2 key={i} className="mt-8 border-t border-rule pt-8 text-18 font-semibold">
              {b.text}
            </h2>,
          )
        } else {
          out.push(
            <h3 key={i} className="mt-2 text-16 font-semibold">
              {b.text}
            </h3>,
          )
        }
        return
      case 'paragraph':
        out.push(
          <p key={i} className={beforeFirstSection ? 'text-14 text-ink-2' : 'max-w-prose text-16'}>
            {b.text}
          </p>,
        )
        return
      case 'list': {
        const list =
          section === 'new'
            ? weeks.shift()
            : section === 'ended'
              ? links.ended
              : section === 'corrections'
                ? links.corrections
                : undefined
        if (list === undefined || list.length !== b.items.length)
          fail(month.month, `list of ${b.items.length} lines in section ${section ?? 'none'}`)
        out.push(
          <ul key={i} className="flex flex-col">
            {b.items.map((item, k) => {
              const link = list[k] as Link
              return (
                <li key={`${i}-${item}`} className="border-t border-rule py-2 text-16">
                  {section === 'corrections' ? (
                    <CorrectionLine text={item} link={link} month={month.month} />
                  ) : (
                    <EntryLine text={item} link={link} month={month.month} />
                  )}
                </li>
              )
            })}
          </ul>,
        )
        return
      }
      case 'table': {
        if (section !== 'movers' || b.rows.length !== links.movers.length)
          fail(month.month, `table of ${b.rows.length} rows in section ${section ?? 'none'}`)
        out.push(
          <div key={i} className="overflow-x-auto">
            <table className="w-full border-collapse text-14">
              <thead>
                <tr className="border-b border-ink">
                  {b.header.map((h, k) => (
                    <th
                      key={h}
                      scope="col"
                      className={`py-2 pe-4 font-semibold ${b.align[k] === 'end' ? 'text-end' : 'text-start'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, r) => (
                  <tr key={links.movers[r]} className="border-b border-rule">
                    {row.map((cell, k) =>
                      k === 0 ? (
                        <th key={cell} scope="row" className="py-2 pe-4 text-start font-normal">
                          <a href={links.movers[r]}>{cell}</a>
                        </th>
                      ) : (
                        <td
                          // biome-ignore lint/suspicious/noArrayIndexKey: cells of a fixed-width row.
                          key={k}
                          className={`num py-2 pe-4 font-mono text-m13 ${b.align[k] === 'end' ? 'text-end' : 'text-start'}`}
                        >
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        return
      }
    }
  })
  if (weeks.length > 0) fail(month.month, `${weeks.length} week lists not written`)
  return <div className="flex flex-col gap-4">{out}</div>
}
