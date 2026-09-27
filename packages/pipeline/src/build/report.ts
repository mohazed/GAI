/**
 * The monthly report (PROMPTS.md P-05: "Markdown per month: movers, new events, corrections,
 * methodology notes"; docs/05 §6 Changes: a "Monthly report" link per month), written from one
 * `changes/{YYYY-MM}.json` file in four variants: English and French, with the display scores and
 * in scorecard mode (D-16: no score shown). The site renders it at /changes/{YYYY-MM} (P-09).
 *
 * Layout, in order (EN / FR):
 * 1. `# Changes, September 2026` / `# Changements, septembre 2026`.
 * 2. Scorecard variant only: "Scorecard mode: scores are not displayed." /
 *    "Mode fiche d'évaluation : les scores ne sont pas affichés."
 * 3. `Gaza Accountability Index · methodology {v} · {from} to {to}` / `… · méthodologie {v} · du
 *    {from} au {to}`, plus `, month in progress` / `, mois en cours` for the build month.
 * 4. `## Movers` / `## Évolutions des scores` (not in the scorecard variant): a table of the
 *    display scores (Country | From | To | Change), rises then falls, or "No display score
 *    changed." / "Aucun score affiché n'a changé."
 * 5. `## New events` / `## Nouveaux événements`: one `### Week of {Monday}` / `### Semaine du
 *    {lundi}` per ISO week holding a start, one bullet per start whose points changed
 *    (`- {date} · {country} · {indicator} · {points} · {summary}`), then a count of the computed
 *    values recomputed without change, which are not listed (PROMPTS.md P-09).
 * 6. `## Ended` / `## Fins`: the standing states that ended, same bullets, by date.
 * 7. `## Corrections`: `- {date} · {event} · correction|retraction · {reason}` (FR `retrait`).
 * 8. `## Methodology` / `## Méthodologie`: every date is scored with the version shown, and a new
 *    version recomputes all of them (docs/02 §11).
 * An empty section says "None." / "Aucun." (FR agrees in gender: "Aucune." for ends and
 * corrections).
 *
 * Text rules (CLAUDE.md "Site voice", docs/05 §2 and §7): statements of fact, sentence case, no
 * adjectives, no exclamation marks; numbers and dates through @gai/scoring (`formatSigned` with
 * the minus sign U+2212, `formatInteger`, `formatLongDate`); French with a decimal comma, U+202F
 * before `;` and as thousands separator, U+00A0 before `:`. Country names, summaries and
 * correction reasons are data: written on one line, with the characters that Markdown would read
 * as markup escaped. LF line endings, no trailing spaces, one final LF. Pure: no clock, no I/O.
 */
import type { ApiChangesMonthFile, ApiFeedEntry, LangText } from '@gai/schema'
import { formatInteger, formatLongDate, formatSigned, monthName, NBSP, NNBSP } from '@gai/scoring'

export type ReportVariant = { lang: 'en' | 'fr'; scorecard: boolean }

type Lang = ReportVariant['lang']

const TEXT = {
  en: {
    title: (month: string) => `Changes, ${month}`,
    scorecard: 'Scorecard mode: scores are not displayed.',
    line: (v: string, from: string, to: string) =>
      `Gaza Accountability Index · methodology ${v} · ${from} to ${to}`,
    inProgress: ', month in progress',
    movers: 'Movers',
    moversHeader: ['Country', 'From', 'To', 'Change'],
    noMovers: 'No display score changed.',
    newEvents: 'New events',
    week: (monday: string) => `Week of ${monday}`,
    unchanged: (n: number, count: string) =>
      n === 1
        ? `${count} computed value recomputed without change (not listed).`
        : `${count} computed values recomputed without change (not listed).`,
    ended: 'Ended',
    corrections: 'Corrections',
    kinds: { correction: 'correction', retraction: 'retraction' },
    methodology: 'Methodology',
    methodologyNote: (v: string) =>
      `Scores for every date are computed with methodology ${v}; a new methodology version recomputes every date.`,
    noEvents: 'None.',
    noEnds: 'None.',
    noCorrections: 'None.',
  },
  fr: {
    title: (month: string) => `Changements, ${month}`,
    scorecard: `Mode fiche d'évaluation${NBSP}: les scores ne sont pas affichés.`,
    line: (v: string, from: string, to: string) =>
      `Gaza Accountability Index · méthodologie ${v} · du ${from} au ${to}`,
    inProgress: ', mois en cours',
    movers: 'Évolutions des scores',
    moversHeader: ['Pays', 'Avant', 'Après', 'Variation'],
    noMovers: "Aucun score affiché n'a changé.",
    newEvents: 'Nouveaux événements',
    week: (monday: string) => `Semaine du ${monday}`,
    unchanged: (n: number, count: string) =>
      n === 1
        ? `${count} valeur calculée recalculée sans changement (non listée).`
        : `${count} valeurs calculées recalculées sans changement (non listées).`,
    ended: 'Fins',
    corrections: 'Corrections',
    kinds: { correction: 'correction', retraction: 'retrait' },
    methodology: 'Méthodologie',
    methodologyNote: (v: string) =>
      `Les scores de chaque date sont calculés avec la méthodologie ${v}${NNBSP}; une nouvelle version de la méthodologie recalcule toutes les dates.`,
    noEvents: 'Aucun.',
    noEnds: 'Aucune.',
    noCorrections: 'Aucune.',
  },
} as const

/**
 * Data text on one line, with Markdown markup characters escaped: backslash, backtick, `*`, `_`,
 * brackets, angle brackets and `|` (a table cell separator). Only ASCII whitespace is collapsed:
 * U+00A0 and U+202F are part of French typography and stay.
 */
function inline(text: string): string {
  return text
    .replace(/[\t\n\v\f\r ]+/g, ' ')
    .trim()
    .replace(/[\\`*_[\]<>|]/g, (ch) => `\\${ch}`)
}

function bullet(e: ApiFeedEntry, lang: Lang): string {
  const points = formatSigned(e.points, lang)
  return `- ${e.date} · ${inline(e.country_name[lang])} · ${e.indicator} · ${points} · ${inline(e.summary[lang])}`
}

function moversSection(month: ApiChangesMonthFile, lang: Lang): string[] {
  const t = TEXT[lang]
  const rows = [...month.movers.up, ...month.movers.down]
  if (rows.length === 0) return [`## ${t.movers}`, t.noMovers]
  const table = [
    `| ${t.moversHeader.join(' | ')} |`,
    '|---|---:|---:|---:|',
    ...rows.map((m) => {
      const cells = [
        inline(m.name[lang]),
        formatSigned(m.display_from, lang, 0),
        formatSigned(m.display_to, lang, 0),
        formatSigned(m.display_delta, lang, 0),
      ]
      return `| ${cells.join(' | ')} |`
    }),
  ]
  return [`## ${t.movers}`, table.join('\n')]
}

function newEventsSection(month: ApiChangesMonthFile, lang: Lang): string[] {
  const t = TEXT[lang]
  const blocks: string[] = [`## ${t.newEvents}`]
  for (const week of month.weeks) {
    const starts = week.entries.filter((e) => e.change === 'start')
    if (starts.length === 0) continue
    blocks.push(`### ${t.week(formatLongDate(week.from, lang))}`)
    const listed = starts.filter((e) => e.points_changed)
    if (listed.length > 0) blocks.push(listed.map((e) => bullet(e, lang)).join('\n'))
    const unchanged = week.unchanged_computed
    if (unchanged > 0) blocks.push(t.unchanged(unchanged, formatInteger(unchanged, lang)))
  }
  if (blocks.length === 1) blocks.push(t.noEvents)
  return blocks
}

function endedSection(month: ApiChangesMonthFile, lang: Lang): string[] {
  const t = TEXT[lang]
  const ends = month.weeks.flatMap((w) => w.entries.filter((e) => e.change === 'end'))
  return [
    `## ${t.ended}`,
    ends.length === 0 ? t.noEnds : ends.map((e) => bullet(e, lang)).join('\n'),
  ]
}

function correctionsSection(month: ApiChangesMonthFile, lang: Lang): string[] {
  const t = TEXT[lang]
  const lines = month.corrections.map(
    (c) => `- ${c.date} · ${c.event} · ${t.kinds[c.kind]} · ${inline(c.reason)}`,
  )
  return [`## ${t.corrections}`, lines.length === 0 ? t.noCorrections : lines.join('\n')]
}

/**
 * The monthly report Markdown for one month file (docs/05 §6 Changes: movers, new events,
 * corrections; plus methodology notes), in the variant's language, without the movers in the
 * scorecard variant (D-16). `ctx.indicatorNames` is accepted for the orchestrator's call
 * signature; the entries carry their own indicator names and the bullets show the indicator id.
 */
export function monthlyReport(
  month: ApiChangesMonthFile,
  variant: ReportVariant,
  _ctx: { indicatorNames: Record<string, LangText> },
): string {
  const { lang, scorecard } = variant
  const t = TEXT[lang]
  const monthNumber = Number(month.month.slice(5, 7))
  const year = month.month.slice(0, 4)
  const line =
    t.line(month.methodology, formatLongDate(month.from, lang), formatLongDate(month.to, lang)) +
    (month.complete ? '' : t.inProgress)

  const blocks: string[] = [`# ${t.title(`${monthName(monthNumber, lang)} ${year}`)}`]
  if (scorecard) blocks.push(t.scorecard)
  blocks.push(line)
  if (!scorecard) blocks.push(...moversSection(month, lang))
  blocks.push(...newEventsSection(month, lang))
  blocks.push(...endedSection(month, lang))
  blocks.push(...correctionsSection(month, lang))
  blocks.push(`## ${t.methodology}`, t.methodologyNote(month.methodology))
  return `${blocks.join('\n\n')}\n`
}
