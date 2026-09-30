/**
 * `pnpm score --country XXX [--date YYYY-MM-DD] [--list] [--json]` — a thin command over the
 * loaders (@gai/schema) and the engine (@gai/scoring): the score of one country at one date with
 * its category table, its events and their contributions, and its coverage.
 *
 * Options:
 *   --country <ISO3>    the country to score (required)
 *   --date <date>       YYYY-MM-DD, on or after 2023-10-07 (default: today, UTC)
 *   --list              list every event of the country, whatever its status, scope or date, with
 *                       why it does or does not count (docs/06 §4: load the generated events
 *                       before searching); without it, only the events in force at the date
 *   --preview           also score draft and reviewed events as if published, for the data
 *                       session's critical reading before review (docs/06 §4 step 7); the output
 *                       says so and is never the published score
 *   --json              print JSON instead of tables
 *   --root <dir>        dataset root holding data/ and archive/, relative to the directory the
 *                       command was run from (default: the repository root); e.g. --root fixtures
 *   --methodology <v>   methodology folder, e.g. v1.0.0 (default: the newest)
 *
 * Exit codes: 0 done, 1 the data or methodology cannot be loaded or scored, 2 usage error.
 *
 * The events are those of data/events plus the events generated from data/structured (votes,
 * vetoes, SIPRI, Comtrade, FTS; D-08), as build-data will publish them.
 */
import { existsSync, realpathSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import {
  type Country,
  type Dataset,
  type Event,
  findRepoRoot,
  formatIssue,
  listMethodologyVersions,
  loadDataset,
  loadMethodology,
} from '@gai/schema'
import {
  bandFor,
  type CountryScore,
  type Coverage,
  coverage,
  createScorer,
  type EventEvaluation,
  eventCounts,
  formatSigned,
  isIsoDate,
  type LastChange,
  lastChange,
  roundHalfAwayFromZero,
  type ScoringMethodology,
  summaryLines,
} from '@gai/scoring'
import { generateAll, generateContext } from './generate/index.js'
import { scoringMethodology } from './methodology.js'

export interface ScoreArgs {
  country: string
  date?: string
  list: boolean
  preview: boolean
  json: boolean
  root?: string
  methodology?: string
}

export class UsageError extends Error {}

export const USAGE =
  'usage: pnpm score --country XXX [--date YYYY-MM-DD] [--list] [--preview] [--json] [--root DIR] [--methodology vX.Y.Z]'

/** Statuses --preview scores as if published. */
export const PREVIEW_STATUSES: readonly string[] = ['draft', 'reviewed']

export function parseScoreArgs(argv: readonly string[]): ScoreArgs {
  let country: string | undefined
  const args: Omit<ScoreArgs, 'country'> = { list: false, preview: false, json: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const value = () => {
      const v = argv[++i]
      if (v === undefined || v.startsWith('--'))
        throw new UsageError(`${a} needs a value\n${USAGE}`)
      return v
    }
    if (a === '--country') country = value().toUpperCase()
    else if (a === '--date') args.date = value()
    else if (a === '--list') args.list = true
    else if (a === '--preview') args.preview = true
    else if (a === '--json') args.json = true
    else if (a === '--root') args.root = value()
    else if (a === '--methodology') args.methodology = value()
    else if (a === '--') continue
    else throw new UsageError(`unknown option ${a}\n${USAGE}`)
  }
  if (country === undefined) throw new UsageError(`--country is required\n${USAGE}`)
  if (!/^[A-Z]{3}$/.test(country)) {
    throw new UsageError(`--country expects an ISO 3166-1 alpha-3 code, got ${country}`)
  }
  if (args.date !== undefined && !isIsoDate(args.date)) {
    throw new UsageError(`--date expects a date YYYY-MM-DD, got ${args.date}`)
  }
  return { ...args, country }
}

export interface ScoreRunOptions {
  /** A directory inside the repository, used to find its root (default: the working directory). */
  cwd?: string
  /** The directory the command was typed in, against which --root resolves (default: cwd). */
  invocationDir?: string
  /** The date used when --date is absent (the entry point passes today's UTC date). */
  today: string
}

export interface ScoreRunResult {
  code: number
  stdout: string
  stderr: string
}

const real = (p: string): string => (existsSync(p) ? realpathSync(p) : p)

// ---------------------------------------------------------------------------------------------
// Text formatting

/** A value to `decimals` places with its sign (U+2212), or a dash for null. */
function num(x: number | null, decimals = 1): string {
  if (x === null) return '—'
  const r = roundHalfAwayFromZero(x, decimals)
  if (r === 0) return decimals === 0 ? '0' : (0).toFixed(decimals)
  return `${r > 0 ? '+' : '\u2212'}${Math.abs(r).toFixed(decimals)}`
}

/** Columns padded to the widest cell; numbers right-aligned. */
function table(
  header: readonly string[],
  rows: readonly (readonly string[])[],
  right: readonly number[] = [],
): string[] {
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)))
  const line = (cells: readonly string[]) =>
    cells
      .map((c, i) => (right.includes(i) ? c.padStart(widths[i] ?? 0) : c.padEnd(widths[i] ?? 0)))
      .join('  ')
      .trimEnd()
  return [line(header), line(widths.map((w) => '─'.repeat(w))), ...rows.map(line)]
}

function eventStatus(e: EventEvaluation, m: ScoringMethodology): string {
  switch (e.reason) {
    case 'counted':
      return 'counted'
    case 'ended':
      return `ended ${e.end ?? ''}`.trim()
    case 'not-yet':
      return 'not yet in force'
    case 'expired':
      return `expired (Δ > ${m.decay.endDays})`
    case 'superseded':
    case 'earlier-position':
    case 'less-severe':
    case 'same-tier':
      return `${e.reason}, by ${e.by ?? '?'}`
    default:
      return e.reason
  }
}

/** In force at the date: eligible and within its time window (counted or set aside by a rule). */
function inForce(e: EventEvaluation): boolean {
  return (
    e.reason !== 'not-published' &&
    e.reason !== 'out-of-scope' &&
    e.reason !== 'not-yet' &&
    e.reason !== 'ended' &&
    e.reason !== 'expired'
  )
}

// ---------------------------------------------------------------------------------------------
// Scoring

interface CountryReport {
  country: Country
  score: CountryScore
  coverage: Coverage
  lastChange: LastChange | null
  summary: { en: string; fr: string }
  events: ReturnType<typeof eventCounts>
  /** Ids of the unpublished events scored as published (--preview). */
  previewed: string[]
}

function report(
  ds: Dataset,
  m: ScoringMethodology,
  generated: readonly Event[],
  country: Country,
  date: string,
  preview: boolean,
): CountryReport {
  const previewed: string[] = []
  const events: Event[] = [
    ...ds.events,
    ...generated.map((value) => ({ value, file: 'data/structured' })),
  ]
    .filter((e) => e.value.country === country.iso3)
    .map((e) => {
      if (!preview || !PREVIEW_STATUSES.includes(e.value.status)) return e.value
      previewed.push(e.value.id)
      return { ...e.value, status: 'published' as const }
    })
  const scorer = createScorer(country.iso3, events, m)
  const score = scorer.at(date)
  const assessment = ds.assessments.find((a) => a.value.country === country.iso3)?.value ?? null
  const cov = coverage({ country, assessment, events, date }, m)
  const lc = lastChange(scorer, date)
  const counts = eventCounts(events, date, country.iso3)
  const summary = summaryLines({
    score: { display: score.display, bandName: bandFor(m, score.display).name },
    events: counts,
    coverage: cov.ratio,
    lastChange: lc,
    passivityPoints: m.passivity.points,
  })
  return {
    country,
    score,
    coverage: cov,
    lastChange: lc,
    summary,
    events: counts,
    previewed: previewed.sort(),
  }
}

function countryText(
  r: CountryReport,
  m: ScoringMethodology,
  source: string,
  list: boolean,
): string[] {
  const s = r.score
  const band = bandFor(m, s.display)
  const out: string[] = []
  out.push(
    `${r.country.name.en} (${r.country.iso3}) · ${s.date} · methodology ${m.version} · ${source}`,
  )
  if (r.previewed.length > 0) {
    out.push(
      `PREVIEW: ${r.previewed.length} unpublished event(s) scored as if published (${r.previewed.join(', ')}); this is not the published score.`,
    )
  }
  out.push(
    `Score ${num(s.exact)} → display ${num(s.display, 0)} (${band.name.en}) · passivity ${
      s.passivity.applied
        ? `applied (${num(-s.passivity.points, 0)}): no qualifying event dated in the last ${m.passivity.windowDays} days`
        : `not applied (qualifying: ${s.passivity.qualifying.join(', ')})`
    }`,
  )
  out.push('')
  out.push(
    ...table(
      ['Category', 'Raw', 'Clipped', 'Cap', 'Summed'],
      m.categories.map((c) => {
        const cr = s.categories[c.id]
        return [
          `${c.id} ${c.name.en}`,
          num(cr.raw),
          num(cr.clipped),
          `${num(c.cap.min, 0)} … ${num(c.cap.max, 0)}`,
          c.scored ? 'yes' : 'no (experimental)',
        ]
      }),
      [1, 2],
    ),
  )
  out.push(
    `Passivity ${num(-s.passivity.value)} · raw ${num(s.raw)} · S = clip(raw, ${num(m.scoreClip.min, 0)}, ${num(m.scoreClip.max, 0)}) = ${num(s.exact)}`,
  )
  if (s.indicators.length > 0) {
    out.push('')
    out.push(
      ...table(
        ['Indicator', 'Sum', 'Cap', 'Value'],
        s.indicators.map((i) => [
          i.id,
          num(i.raw),
          i.cap === null ? '—' : `${num(i.cap.min, 0)} … ${num(i.cap.max, 0)}`,
          num(i.value),
        ]),
        [1, 3],
      ),
    )
  }
  out.push('')
  const shown = list ? s.events : s.events.filter(inForce)
  const hidden = s.events.length - shown.length
  out.push(
    list
      ? `Events: all ${s.events.length} recorded`
      : `Events in force on ${s.date}: ${shown.length} of ${s.events.length} recorded${hidden > 0 ? ' (--list shows every event)' : ''}`,
  )
  if (shown.length > 0) {
    const eligible = (e: EventEvaluation) =>
      e.reason !== 'not-published' && e.reason !== 'out-of-scope'
    out.push(
      ...table(
        [
          'Date',
          'End',
          'Id',
          'Ind',
          'Type',
          'Points',
          'Confidence',
          'w',
          'd',
          'p·w·d',
          'Counted',
          'Status',
        ],
        shown.map((e) => [
          e.date,
          e.end ?? '',
          e.id,
          e.indicator,
          e.type,
          num(e.points),
          e.confidence,
          e.weight.toFixed(1),
          e.type === 'repeatable' ? e.factor.toFixed(4) : String(e.factor),
          eligible(e) ? num(e.value, 2) : '—',
          eligible(e) ? num(e.counted, 2) : '—',
          `${eventStatus(e, m)}${e.qualifies ? ' · qualifies' : ''}`,
        ]),
        [5, 7, 8, 9, 10],
      ),
    )
  }
  const c = r.coverage
  out.push('')
  out.push(
    `Coverage ${String(roundHalfAwayFromZero(c.ratio * 100, 0))}% · ${c.hasEvents} has-events + ${c.noneFound} none-found of ${c.applicable} applicable · ${c.noData} no-data · ${c.unchecked} unchecked · ${c.notApplicable} not-applicable${c.noExportData ? ' · no export data (A1/A2)' : ''}`,
  )
  const byStatus = (status: string) =>
    m.scoredIndicatorIds.filter((id) => c.statuses[id] === status)
  for (const status of ['has-events', 'none-found', 'no-data', 'unchecked', 'not-applicable']) {
    const ids = byStatus(status)
    if (ids.length > 0) out.push(`  ${status.padEnd(15)} ${ids.join(' ')}`)
  }
  for (const o of c.overrides)
    out.push(`  override: ${o.indicator} ${o.from} → ${o.to} (${o.reason})`)
  out.push('')
  const lc = r.lastChange
  out.push(
    lc === null
      ? 'Last change: none'
      : `Last change: ${lc.date} · ${lc.kind === 'event' ? `${lc.event} (${lc.indicator}, ${lc.change}, ${formatSigned(lc.points ?? 0, 'en')})` : `passivity ${lc.passivity.after ? 'applied' : 'lifted'}`} · score ${num(lc.delta)}`,
  )
  out.push(`Summary (en): ${r.summary.en}`)
  out.push(`Summary (fr): ${r.summary.fr}`)
  return out
}

function reportJson(r: CountryReport) {
  return {
    iso3: r.country.iso3,
    name: r.country.name,
    date: r.score.date,
    methodology: r.score.methodology,
    preview: r.previewed.length > 0 ? { events: r.previewed } : null,
    score: r.score,
    coverage: r.coverage,
    last_change: r.lastChange,
    events: r.events,
    summary: r.summary,
  }
}

const fail = (code: number, message: string): ScoreRunResult => ({
  code,
  stdout: '',
  stderr: `${message}\n`,
})

/** Runs the command; never exits the process and never throws. */
export function runScore(argv: readonly string[], options: ScoreRunOptions): ScoreRunResult {
  let args: ScoreArgs
  try {
    args = parseScoreArgs(argv)
  } catch (err) {
    return fail(2, (err as Error).message)
  }
  try {
    return run(args, options)
  } catch (err) {
    return fail(1, (err as Error).message)
  }
}

function run(args: ScoreArgs, options: ScoreRunOptions): ScoreRunResult {
  const cwd = options.cwd ?? process.cwd()
  const repoRoot = real(findRepoRoot(cwd))
  let datasetRoot = repoRoot
  if (args.root !== undefined) {
    datasetRoot = resolve(options.invocationDir ?? cwd, args.root)
    if (!existsSync(join(datasetRoot, 'data'))) {
      return fail(2, `--root ${args.root}: ${datasetRoot} has no data/ directory`)
    }
    datasetRoot = real(datasetRoot)
  }
  const source = `${relative(repoRoot, datasetRoot).split('\\').join('/') || '.'}/data`

  const folders = listMethodologyVersions(repoRoot)
  const folder = args.methodology ?? folders.at(-1)
  if (folder === undefined || !folders.includes(folder)) {
    return fail(
      2,
      `--methodology: expected one of ${folders.join(', ') || '(none)'}, got ${folder ?? '(none)'}`,
    )
  }
  const lm = loadMethodology(repoRoot, folder)
  const m = scoringMethodology(lm)
  const date = args.date ?? options.today
  if (date < m.windowStart) {
    return fail(2, `--date ${date}: the index starts on ${m.windowStart} (docs/02 §1)`)
  }
  const ds = loadDataset(datasetRoot)
  const loadErrors = ds.issues.filter((i) => i.level === 'error')
  if (loadErrors.length > 0) {
    return fail(
      1,
      `${source} cannot be loaded; run pnpm validate:\n${loadErrors.map(formatIssue).join('\n')}`,
    )
  }
  const country = ds.countries.find((c) => c.value.iso3 === args.country)?.value
  if (country === undefined) return fail(2, `${args.country} is not in ${source}/countries.yaml`)
  if (country.excluded) {
    return fail(
      2,
      `${args.country} is excluded from the index (D-10): ${country.excluded_reason?.en ?? ''}`,
    )
  }
  let generated: Event[]
  try {
    generated = generateAll(
      generateContext(
        lm,
        ds.countries.map((c) => c.value),
      ),
      ds.structured,
    ).events
  } catch (err) {
    return fail(1, `the generated events cannot be built: ${(err as Error).message}`)
  }
  const r = report(ds, m, generated, country, date, args.preview)
  const stdout = args.json
    ? `${JSON.stringify(reportJson(r), null, 2)}\n`
    : `${countryText(r, m, source, args.list).join('\n')}\n`
  return { code: 0, stdout, stderr: '' }
}
