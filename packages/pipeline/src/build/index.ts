/**
 * build-data (docs/04 §2): from data/, archive/ and methodology/ to the static API under
 * apps/web/public/api/v1/. Pure: every input is in `BuildInput` (the CLI reads the files, the git
 * state and the date), and the same input gives the same bytes (D-25).
 *
 * 1. Load: the dataset and the methodology as loaded by @gai/schema; any loading error fails.
 * 2. Validate: every rule of `pnpm validate` except the git history checks (docs/02 §12); errors
 *    fail, warnings go to build-notes.json.
 * 3. Generate: the events of the structured tables (B1, B2, A1, A4, A2, C3, D1; D-08), each checked
 *    against the Event schema, the tone lint and its sources before anything is emitted.
 * 4. Score: every scored country on every date from 2023-10-07 to the build date.
 * 5. Derive: coverage (with the statuses of the generated indicators read from the tables), last
 *    change, summary lines and citations (with and without the score, D-16), movers, the changes
 *    feed, the sensitivity tables.
 * 6. Emit: every file of docs/04 §2 step 6, each JSON file checked against its schema in
 *    @gai/schema (api.ts), then manifest.json with the SHA-256 of every other file.
 *
 * Outputs always carry the scores; the site decides what to show (D-16).
 */
import {
  type ApiCorrection,
  type ApiCountryEntry,
  type ApiEvent,
  type ApiExcludedCountry,
  type ApiReply,
  type ApiScoredCountry,
  type ApiScoredCountryFile,
  type Assessment,
  apiSchemaFor,
  BUILD_NOTE_KINDS,
  buildContext,
  type Country,
  compileBannedWords,
  type Event,
  Event as EventSchema,
  formatIssue,
  type LangText,
  lintSummary,
  type Methodology,
  validate,
} from '@gai/schema'
import {
  bandFor,
  type CountryScore,
  type Coverage,
  citations,
  eventCounts,
  isIsoDate,
  type LastChange,
  lastChange,
  latestEvent,
  onSecurityCouncil,
  permalink,
  type ScoringMethodology,
  type SeriesPoint,
  sensitivitySuite,
  summaryLines,
} from '@gai/scoring'
import { generateAll, generateContext } from '../generate/index.js'
import { scoringMethodology } from '../methodology.js'
import {
  assessmentRows,
  b1MissingFromVotes,
  deriveGeneratedStatuses,
  disagreements,
  effectiveAssessment,
} from './assessments.js'
import { type ChangesInput, feedEntries, latestFile, monthFile, reportPaths } from './changes.js'
import { runCountry } from './country.js'
import { datesBetween, monthsBetween } from './dates.js'
import { dumpFiles } from './dumps.js'
import { jsonText } from './json.js'
import { MANIFEST_PATH, manifest } from './manifest.js'
import { methodologyFile, methodologyIndex, methodologyPath } from './methodology.js'
import {
  isPublicStatus,
  previousComputedPoints,
  registryFields,
  toApiCorrection,
  toApiEvent,
  toApiReply,
  toApiSource,
} from './normalize.js'
import { monthlyReport } from './report.js'
import { sensitivityFile } from './sensitivity.js'
import type { BuildInput, BuildNote, BuildOutput, CountryRun, DerivedStatus } from './types.js'

export type { BuildInput, BuildNote, BuildOutput } from './types.js'

/** A problem in the data or the methodology that stops the build; the message says what. */
export class BuildError extends Error {}

/** Cloudflare Pages serves files up to 25 MiB; a file above this size is noted. */
export const LARGE_FILE_BYTES = 20 * 1024 * 1024

/** How many problems an error message lists before "and n more". */
const LISTED = 50

const LANGS = ['en', 'fr'] as const

function byCode(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function byDateThenId<T extends { date: string; id: string }>(a: T, b: T): number {
  return byCode(a.date, b.date) || byCode(a.id, b.id)
}

function listed(lines: readonly string[]): string {
  const shown = lines.slice(0, LISTED).map((l) => `  ${l}`)
  if (lines.length > LISTED) shown.push(`  … and ${lines.length - LISTED} more`)
  return shown.join('\n')
}

function groupBy<T>(items: readonly T[], key: (t: T) => string): Map<string, T[]> {
  const out = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const list = out.get(k)
    if (list) list.push(item)
    else out.set(k, [item])
  }
  return out
}

/** The country code a generator note starts with (`DEU: …`), if any. */
function countryOfNote(message: string): string | null {
  return /^([A-Z]{3}):/.exec(message)?.[1] ?? null
}

// ---------------------------------------------------------------------------------------------
// Step 3: checks on the generated events

/**
 * Every generated event must pass the Event schema, the tone lint of hand-written summaries
 * (docs/02 §12.6) and cite sources that exist, and no generated id may equal a hand-written one.
 */
export function checkGeneratedEvents(events: readonly Event[], input: BuildInput): void {
  const { dataset: ds, methodology: m } = input
  if (m.bannedWords === null) {
    throw new BuildError(`${m.folder}/banned-words.txt is missing: the tone lint cannot run`)
  }
  const matcher = compileBannedWords(m.bannedWords.entries)
  const names = new Map(ds.countries.map((c) => [c.value.iso3, c.value.name]))
  const sources = new Set(ds.sources.map((s) => s.value.id))
  const handIds = new Set(ds.events.map((e) => e.value.id))
  const problems: string[] = []
  for (const e of events) {
    const parsed = EventSchema.safeParse(e)
    if (!parsed.success) {
      const why = parsed.error.issues.map((i) => `${i.path.join('.') || '(event)'}: ${i.message}`)
      problems.push(`${e.id}: ${why.join('; ')}`)
    }
    if (handIds.has(e.id)) problems.push(`${e.id}: a hand-written event has the same id`)
    for (const lang of LANGS) {
      const violations = lintSummary(e.summary[lang], lang, {
        matcher,
        countryName: names.get(e.country)?.[lang],
        actor: { label: e.actor?.[lang], name: e.actor?.name },
      })
      for (const v of violations)
        problems.push(`${e.id}: ${lang.toUpperCase()} summary ${v.message}`)
    }
    for (const ev of e.evidence) {
      if (!sources.has(ev.source))
        problems.push(`${e.id}: cites ${ev.source}, which has no source record`)
    }
  }
  if (problems.length > 0) {
    throw new BuildError(
      `${problems.length} problem(s) in the generated events (Event schema, tone lint, sources; docs/02 §12):\n${listed(problems)}`,
    )
  }
}

// ---------------------------------------------------------------------------------------------
// Step 5: API shapes of the engine's results

function apiCoverage(c: Coverage): ApiScoredCountry['coverage'] {
  return {
    ratio: c.ratio,
    applicable: c.applicable,
    has_events: c.hasEvents,
    none_found: c.noneFound,
    no_data: c.noData,
    unchecked: c.unchecked,
    not_applicable: c.notApplicable,
    missing: [...c.missing],
    no_data_ids: [...c.noDataIds],
    unchecked_ids: [...c.uncheckedIds],
    not_applicable_ids: [...c.notApplicableIds],
    no_export_data: c.noExportData,
    statuses: { ...c.statuses },
  }
}

function apiLastChange(lc: LastChange | null): ApiScoredCountry['last_change'] {
  if (lc === null) return null
  return {
    date: lc.date,
    kind: lc.kind,
    event: lc.event,
    indicator: lc.indicator,
    change: lc.change,
    points: lc.points,
    effect: lc.effect,
    delta: lc.delta,
    passivity: { before: lc.passivity.before, after: lc.passivity.after },
  }
}

function apiCategories(s: CountryScore): ApiScoredCountry['categories'] {
  const out = {} as ApiScoredCountry['categories']
  for (const id of ['A', 'B', 'C', 'D', 'E'] as const) {
    const c = s.categories[id]
    out[id] = {
      raw: c.raw,
      clipped: c.clipped,
      cap: { min: c.cap.min, max: c.cap.max },
      capped: c.capped,
      scored: c.scored,
      weight: c.weight,
    }
  }
  return out
}

function apiSeriesPoint(p: SeriesPoint): ApiScoredCountryFile['series'][number] {
  const categories = {} as ApiScoredCountryFile['series'][number]['categories']
  for (const id of ['A', 'B', 'C', 'D', 'E'] as const) {
    categories[id] = { raw: p.categories[id].raw, clipped: p.categories[id].clipped }
  }
  return {
    date: p.date,
    score: p.score,
    score_display: p.display,
    band: p.band,
    passivity_applied: p.passivity,
    categories,
    transitions: p.transitions.map((t) => ({ id: t.id, indicator: t.indicator, kind: t.kind })),
  }
}

function apiIndicators(s: CountryScore): ApiScoredCountryFile['indicators'] {
  return s.indicators.map((r) => ({
    id: r.id,
    category: r.category,
    raw: r.raw,
    value: r.value,
    cap: r.cap === null ? null : { min: r.cap.min, max: r.cap.max },
    capped: r.capped,
    counted: [...r.counted],
  }))
}

// ---------------------------------------------------------------------------------------------
// The build

export function buildData(input: BuildInput): BuildOutput {
  const { dataset: ds, methodology: m, date, siteUrl } = input
  const notes: BuildNote[] = []
  const note = (
    kind: BuildNote['kind'],
    message: string,
    country: string | null = null,
    indicator: string | null = null,
  ) => {
    notes.push({ kind, country, indicator, message })
  }

  // 1. Load.
  const loadErrors = [ds, m, ...input.older]
    .flatMap((x) => x.issues)
    .filter((i) => i.level === 'error')
  if (loadErrors.length > 0) {
    throw new BuildError(
      `the dataset or the methodology cannot be loaded; run pnpm validate:\n${listed(loadErrors.map(formatIssue))}`,
    )
  }
  let sm: ScoringMethodology
  try {
    sm = scoringMethodology(m)
  } catch (err) {
    throw new BuildError((err as Error).message)
  }
  if (!isIsoDate(date) || date < sm.windowStart) {
    throw new BuildError(`build date ${date}: expected a date on or after ${sm.windowStart}`)
  }
  try {
    permalink(siteUrl, 'en', 'DEU', date)
  } catch {
    throw new BuildError(`site URL ${siteUrl}: expected an http(s) origin`)
  }
  const windowStart = sm.windowStart

  // 2. Validate (no git history: the CLI's pnpm validate step runs those checks).
  const issues = validate(buildContext(ds, m))
  const errors = issues.filter((i) => i.level === 'error')
  if (errors.length > 0) {
    throw new BuildError(
      `pnpm validate reports ${errors.length} error(s):\n${listed(errors.map(formatIssue))}`,
    )
  }
  for (const i of issues) if (i.level === 'warning') note('validation-warning', formatIssue(i))

  // 3. Generate.
  let generated: Event[]
  try {
    const g = generateAll(generateContext(m), ds.structured)
    generated = g.events
    for (const n of g.notes) note('generator', n, countryOfNote(n))
  } catch (err) {
    throw new BuildError(`the generated events cannot be built: ${(err as Error).message}`)
  }
  checkGeneratedEvents(generated, input)

  const countries: Country[] = ds.countries
    .map((c) => c.value)
    .sort((a, b) => byCode(a.iso3, b.iso3))
  const scored = countries.filter((c) => !c.excluded)
  const scoredIso = new Set(scored.map((c) => c.iso3))
  const registered = new Set(countries.map((c) => c.iso3))
  const handEvents = ds.events.map((e) => e.value)
  const generatedBy = groupBy(generated, (e) => e.country)
  const handBy = groupBy(handEvents, (e) => e.country)
  for (const [iso3, list] of [...generatedBy.entries(), ...handBy.entries()].sort(([a], [b]) =>
    byCode(a, b),
  )) {
    if (scoredIso.has(iso3)) continue
    const kind = list[0]?.generated === true ? 'generated' : 'hand-written'
    const indicators = [...new Set(list.map((e) => e.indicator))].sort(byCode)
    const why = registered.has(iso3)
      ? 'is excluded from the index (D-10)'
      : 'is not in data/countries.yaml'
    note(
      'unregistered-country',
      `${list.length} ${kind} event(s) of ${iso3} (${indicators.join(', ')}) are not published: ${iso3} ${why}`,
      iso3,
    )
  }
  for (const e of [...handEvents].sort(byDateThenId)) {
    if (scoredIso.has(e.country) && !isPublicStatus(e.status)) {
      note('unpublished-event', `${e.id} is ${e.status}: not published`, e.country, e.indicator)
    }
  }

  // 4. Score every scored country on every date; derive the generated indicators' statuses.
  const handAssessment = new Map<string, Assessment>(
    ds.assessments.map((a) => [a.value.country, a.value]),
  )
  const runs: CountryRun[] = []
  const derivedBy = new Map<string, Record<string, DerivedStatus | null>>()
  for (const c of scored) {
    const gen = generatedBy.get(c.iso3) ?? []
    const events = [...(handBy.get(c.iso3) ?? []), ...gen]
    const hand = handAssessment.get(c.iso3) ?? null
    const deriveInput = {
      iso3: c.iso3,
      date,
      structured: ds.structured,
      generated: gen,
      methodology: m,
      unscMember: onSecurityCouncil(c, windowStart, date),
      permanentMember: c.memberships.unsc.some((t) => t.permanent),
    }
    const derived: Record<string, DerivedStatus | null> = deriveGeneratedStatuses(deriveInput)
    derivedBy.set(c.iso3, derived)
    notes.push(...disagreements(c.iso3, hand, derived))
    const missingVotes = b1MissingFromVotes(deriveInput)
    if (missingVotes.length > 0) {
      note(
        'assessment-derived',
        `unga_votes.csv has no row for ${c.iso3} on ${missingVotes.join(', ')}; the hand-written assessment decides B1`,
        c.iso3,
        'B1',
      )
    }
    let run: CountryRun
    try {
      run = runCountry({
        country: c,
        events,
        scoring: sm,
        assessment: effectiveAssessment(hand, derived),
        date,
      })
    } catch (err) {
      throw new BuildError(`${c.iso3} cannot be scored: ${(err as Error).message}`)
    }
    if (run.coverage.unchecked > 0) {
      note(
        'unchecked',
        `${run.coverage.unchecked} of ${run.coverage.applicable} applicable indicators are unchecked (${run.coverage.uncheckedIds.join(', ')}); allowed in scorecard mode only (docs/02 §8)`,
        c.iso3,
      )
    }
    runs.push(run)
  }
  if (ds.structured['fts_funding.csv'].length === 0) {
    note(
      'assessment-derived',
      'fts_funding.csv has no rows; the hand-written assessments decide D1',
      null,
      'D1',
    )
  }

  // 5. Derive: logs, events, sources.
  const eventCountry = new Map<string, string>()
  for (const e of [...handEvents, ...generated]) eventCountry.set(e.id, e.country)
  const correctionRecords = ds.corrections
    .map((c) => c.value)
    .filter((c) => c.date <= date)
    .sort(byDateThenId)
  const corrections: ApiCorrection[] = correctionRecords.map((c) =>
    toApiCorrection(
      c,
      eventCountry.get(c.event) ?? null,
      input.correctionCommits.get(c.id) ?? null,
    ),
  )
  const correctionsByEvent = new Map<string, string[]>()
  for (const c of corrections) {
    const list = correctionsByEvent.get(c.event) ?? []
    list.push(c.id)
    correctionsByEvent.set(c.event, list)
  }
  const replies: ApiReply[] = ds.replies
    .map((r) => r.value)
    .filter((r) => r.published_at <= date)
    .sort((a, b) => byCode(a.published_at, b.published_at) || byCode(a.id, b.id))
    .map(toApiReply)
  const repliesByEvent = new Map<string, string[]>()
  for (const r of replies) {
    for (const id of r.contests) {
      const list = repliesByEvent.get(id) ?? []
      if (!list.includes(r.id)) list.push(r.id)
      repliesByEvent.set(id, list)
    }
  }
  const sourceById = new Map(ds.sources.map((s) => [s.value.id, s.value]))
  const openLeads = ds.leads
    .map((l) => l.value)
    .filter((l) => l.status === 'open')
    .sort((a, b) => byCode(a.id, b.id))
  const indicatorOrder = new Map(m.indicators.map((ind, i) => [ind.id, i]))
  const byIndicatorOrder = (a: string, b: string) =>
    (indicatorOrder.get(a) ?? 99) - (indicatorOrder.get(b) ?? 99) || byCode(a, b)

  const json = new Map<string, unknown>()
  const text = new Map<string, string | Uint8Array>()
  const put = (path: string, value: unknown) => {
    if (json.has(path) || text.has(path)) throw new BuildError(`two outputs share the path ${path}`)
    json.set(path, value)
  }
  const putText = (path: string, content: string | Uint8Array) => {
    if (json.has(path) || text.has(path)) throw new BuildError(`two outputs share the path ${path}`)
    text.set(path, content)
  }

  const entries: ApiCountryEntry[] = []
  const allEvents: ApiEvent[] = []
  const assessments: {
    country: string
    protocol_version: number | null
    last_full_check: string | null
    indicators: ApiScoredCountryFile['assessment']['indicators']
  }[] = []

  for (const run of runs) {
    const c = run.country
    const iso3 = c.iso3
    const final = run.final
    const publicEvents = run.events.filter((e) => isPublicStatus(e.status)).sort(byDateThenId)
    const previous = previousComputedPoints(publicEvents)
    const evaluation = new Map(final.events.map((ev) => [ev.id, ev]))
    const apiEvents: ApiEvent[] = publicEvents.map((e) => {
      const ev = evaluation.get(e.id)
      if (ev === undefined) throw new BuildError(`${e.id} was not evaluated by the engine`)
      return toApiEvent(e, {
        methodology: m,
        evaluation: ev,
        previousPoints: previous.get(e.id) ?? null,
        corrections: correctionsByEvent.get(e.id) ?? [],
        replies: repliesByEvent.get(e.id) ?? [],
      })
    })
    allEvents.push(...apiEvents)
    const sourceIds = [...new Set(apiEvents.flatMap((e) => e.evidence.map((ev) => ev.source)))]
    const sources: ApiScoredCountryFile['sources'] = {}
    for (const id of sourceIds.sort(byCode)) {
      const s = sourceById.get(id)
      if (s === undefined)
        throw new BuildError(`${iso3}: an event cites ${id}, which has no record`)
      sources[id] = toApiSource(s)
    }

    const band = bandFor(sm, final.display)
    const counts = eventCounts(run.events, date, iso3)
    const lc = lastChange(run.scorer, date)
    const le = latestEvent(run.events, date, iso3)
    const common = {
      events: counts,
      coverage: run.coverage.ratio,
      lastChange: lc,
      passivityPoints: sm.passivity.points,
    }
    const summary = summaryLines({
      ...common,
      score: { display: final.display, bandName: band.name },
    })
    const summaryScorecard = summaryLines({ ...common, score: null, latestEvent: le })
    const entry: ApiScoredCountry = {
      ...registryFields(c, date),
      excluded: false,
      methodology: m.version,
      date,
      score: final.score,
      score_display: final.display,
      band: final.band,
      band_name: { en: band.name.en, fr: band.name.fr },
      passivity_applied: final.passivity.applied,
      passivity: {
        applied: final.passivity.applied,
        points: final.passivity.points,
        value: final.passivity.value,
        window_days: sm.passivity.windowDays,
        qualifying: [...final.passivity.qualifying],
      },
      categories: apiCategories(final),
      coverage: apiCoverage(run.coverage),
      events: { ...counts },
      last_change: apiLastChange(lc),
      latest_event: le === null ? null : { ...le },
      summary: { en: summary.en, fr: summary.fr },
      summary_scorecard: { en: summaryScorecard.en, fr: summaryScorecard.fr },
    }
    entries.push(entry)

    const hand = handAssessment.get(iso3) ?? null
    const rows = assessmentRows({
      methodology: m,
      scoring: sm,
      hand,
      derived: derivedBy.get(iso3) ?? {},
      coverage: run.coverage,
      events: run.events,
      date,
    })
    const assessment = {
      protocol_version: hand?.protocol_version ?? null,
      last_full_check: hand?.last_full_check ?? null,
      indicators: rows,
    }
    assessments.push({ country: iso3, ...assessment })

    const cite = (score: { display: number; bandName: LangText } | null, lang: 'en' | 'fr') =>
      citations(
        {
          iso3,
          countryName: c.name,
          date,
          methodologyVersion: m.version,
          score,
          siteUrl,
        },
        lang,
      )
    const withScore = { display: final.display, bandName: band.name }
    const leads = openLeads.filter((l) => l.country === iso3)
    const series = run.series.map(apiSeriesPoint)
    const file: ApiScoredCountryFile = {
      ...entry,
      build_date: date,
      indicators: apiIndicators(final),
      assessment,
      event_list: apiEvents,
      sources,
      replies: replies.filter((r) => r.country === iso3),
      corrections: corrections.filter((x) => x.country === iso3),
      leads: {
        open: leads.length,
        indicators: [...new Set(leads.map((l) => l.indicator))].sort(byIndicatorOrder),
      },
      series,
      citations: {
        score: { en: cite(withScore, 'en'), fr: cite(withScore, 'fr') },
        scorecard: { en: cite(null, 'en'), fr: cite(null, 'fr') },
      },
      permalink: {
        en: permalink(siteUrl, 'en', iso3, date),
        fr: permalink(siteUrl, 'fr', iso3, date),
      },
    }
    put(`countries/${iso3}.json`, file)
    put(`countries/${iso3}/events.json`, {
      build_date: date,
      methodology: m.version,
      iso3,
      events: apiEvents,
      sources,
    })
    put(`countries/${iso3}/series.json`, {
      build_date: date,
      methodology: m.version,
      iso3,
      from: windowStart,
      to: date,
      points: series,
    })
  }

  for (const c of countries.filter((x) => x.excluded)) {
    if (c.excluded_reason === undefined) {
      throw new BuildError(`${c.iso3} is excluded but has no excluded_reason (D-10)`)
    }
    const entry: ApiExcludedCountry = {
      ...registryFields(c, date),
      excluded: true,
      excluded_reason: { en: c.excluded_reason.en, fr: c.excluded_reason.fr },
    }
    entries.push(entry)
    put(`countries/${c.iso3}.json`, { ...entry, build_date: date, methodology: m.version })
  }
  entries.sort((a, b) => byCode(a.iso3, b.iso3))
  put('countries.json', {
    build_date: date,
    methodology: m.version,
    counts: { total: entries.length, scored: runs.length, excluded: entries.length - runs.length },
    countries: entries,
  })

  // Scores by date.
  const dates = datesBetween(windowStart, date)
  dates.forEach((d, i) => {
    put(`scores/${d}.json`, {
      date: d,
      methodology: m.version,
      countries: runs.map((r) => {
        const x = r.days[i]
        if (x === undefined) throw new BuildError(`${r.country.iso3} has no score on ${d}`)
        return {
          iso3: r.country.iso3,
          score: x.score,
          score_display: x.display,
          band: x.band,
          passivity_applied: x.passivity,
          clipped: { ...x.clipped },
        }
      }),
    })
  })
  put('scores/index.json', {
    build_date: date,
    methodology: m.version,
    from: windowStart,
    to: date,
    count: dates.length,
    dates,
  })

  // Methodology, current and superseded, and the frozen outputs of superseded versions.
  const frozen = new Set(input.snapshots.map((s) => s.path.split('/')[0] ?? ''))
  put(methodologyPath(m), methodologyFile(m, 'current'))
  for (const o of input.older) put(methodologyPath(o), methodologyFile(o, 'superseded'))
  put(
    'methodology/index.json',
    methodologyIndex({ date, current: m, older: input.older, changelog: input.changelog, frozen }),
  )
  for (const s of input.snapshots) putText(`methodology/${s.path}`, s.bytes)

  // Changes feed, monthly files and reports.
  allEvents.sort((a, b) => byCode(a.country, b.country) || byDateThenId(a, b))
  const changesInput: ChangesInput = {
    date,
    windowStart,
    methodology: m.version,
    countries: runs.map((r) => ({ iso3: r.country.iso3, name: r.country.name, days: r.days })),
    events: allEvents,
    corrections,
    replies,
  }
  const feed = feedEntries(changesInput)
  const indicatorNames = Object.fromEntries(m.indicators.map((ind) => [ind.id, ind.name]))
  const months = monthsBetween(windowStart, date).map((month) => {
    const mf = monthFile(changesInput, month, feed)
    put(`changes/${month}.json`, mf)
    const paths = reportPaths(month)
    const ctx = { indicatorNames }
    putText(paths.en, monthlyReport(mf, { lang: 'en', scorecard: false }, ctx))
    putText(paths.fr, monthlyReport(mf, { lang: 'fr', scorecard: false }, ctx))
    putText(paths.scorecard_en, monthlyReport(mf, { lang: 'en', scorecard: true }, ctx))
    putText(paths.scorecard_fr, monthlyReport(mf, { lang: 'fr', scorecard: true }, ctx))
    return mf
  })
  put('changes/latest.json', latestFile(changesInput, feed, months))

  // Logs and sensitivity.
  put('corrections.json', { build_date: date, corrections })
  put('replies.json', { build_date: date, replies })
  put(
    'sensitivity.json',
    sensitivityFile(
      sensitivitySuite(
        runs.map((r) => ({ iso3: r.country.iso3, events: r.events })),
        date,
        sm,
      ),
      date,
    ),
  )

  // Dumps.
  const dumps = dumpFiles({
    date,
    methodology: m.version,
    git: input.git,
    countries: entries,
    events: allEvents,
    sources: ds.sources
      .map((s) => s.value)
      .sort((a, b) => byCode(a.id, b.id))
      .map(toApiSource),
    assessments,
    corrections,
    replies,
    leads: openLeads.map((l) => ({ id: l.id, country: l.country, indicator: l.indicator })),
    days: runs.map((r) => ({ iso3: r.country.iso3, days: r.days })),
    windowStart,
  })
  for (const [path, content] of [...dumps.entries()].sort(([a], [b]) => byCode(a, b))) {
    if (path.endsWith('.json')) put(path, JSON.parse(content))
    else putText(path, content)
  }

  // 6. Emit: serialise, check sizes, notes, schemas, manifest.
  if (input.historyNote !== null) note('history', input.historyNote)
  const files = new Map<string, string | Uint8Array>()
  for (const [path, value] of json) files.set(path, jsonText(value))
  for (const [path, content] of text) files.set(path, content)
  for (const [path, content] of [...files.entries()].sort(([a], [b]) => byCode(a, b))) {
    const bytes =
      typeof content === 'string' ? Buffer.byteLength(content, 'utf8') : content.byteLength
    if (bytes > LARGE_FILE_BYTES) {
      note(
        'large-file',
        `${path} is ${bytes} bytes; Cloudflare Pages serves files up to 25 MiB (docs/04 §5)`,
      )
    }
  }
  const kindOrder = new Map<string, number>(BUILD_NOTE_KINDS.map((k, i) => [k, i]))
  const sortedNotes = [...notes].sort(
    (a, b) =>
      (kindOrder.get(a.kind) ?? 0) - (kindOrder.get(b.kind) ?? 0) ||
      byCode(a.country ?? '', b.country ?? '') ||
      byIndicatorOrder(a.indicator ?? '', b.indicator ?? '') ||
      byCode(a.message, b.message),
  )
  const counts = Object.fromEntries(BUILD_NOTE_KINDS.map((k) => [k, 0])) as Record<
    (typeof BUILD_NOTE_KINDS)[number],
    number
  >
  for (const n of sortedNotes) counts[n.kind]++
  files.set(
    'build-notes.json',
    jsonText({ build_date: date, methodology: m.version, counts, notes: sortedNotes }),
  )

  const failures: string[] = []
  for (const [path, content] of [...files.entries()].sort(([a], [b]) => byCode(a, b))) {
    if (typeof content === 'string' && content.includes('\r')) {
      failures.push(`${path}: contains a carriage return (outputs use LF line endings)`)
    }
    if (!path.endsWith('.json') || typeof content !== 'string') continue
    const schema = apiSchemaFor(path)
    if (schema === null) {
      if (!path.startsWith('methodology/') || json.has(path)) {
        failures.push(`${path}: no schema in @gai/schema api.ts`)
      }
      continue
    }
    const parsed = schema.safeParse(JSON.parse(content))
    if (!parsed.success) {
      for (const i of parsed.error.issues.slice(0, 5)) {
        failures.push(`${path}: ${i.path.join('.') || '(file)'}: ${i.message}`)
      }
    }
  }
  if (failures.length > 0) {
    throw new BuildError(
      `${failures.length} output problem(s) against the API schemas (@gai/schema api.ts):\n${listed(failures)}`,
    )
  }

  const man = manifest({ files, date, methodology: m, git: input.git, siteUrl })
  files.set(MANIFEST_PATH, jsonText(man))
  const manifestCheck = apiSchemaFor(MANIFEST_PATH)?.safeParse(man)
  if (manifestCheck !== undefined && !manifestCheck.success) {
    throw new BuildError(`manifest.json: ${manifestCheck.error.issues[0]?.message ?? 'invalid'}`)
  }
  return { files, notes: sortedNotes }
}

/** For callers that need the list of countries a build scores (tests, CLIs). */
export function scoredCountries(countries: readonly Country[]): string[] {
  return countries
    .filter((c) => !c.excluded)
    .map((c) => c.iso3)
    .sort(byCode)
}

export type { ApiEvent, Methodology }
