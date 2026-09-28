/**
 * End-to-end tests of buildData (docs/04 §2): the fixtures (one hand-written DEU event, hand-computed
 * expectations below), a copy of the real data/ tree with the fixture event added (generated events
 * from the structured tables), determinism (D-25), the schemas of every file, and the errors that
 * stop a build.
 *
 * Fixture DEU (fixtures/README.md): A6 +10 standing from 2025-08-08 to 2025-11-24 (end exclusive),
 * confirmed; no qualifying event for the passivity rule (category A never qualifies, docs/02 §6),
 * so the penalty −15 applies on every date: S = −15, then −5 from 2025-08-08, then −15 again from
 * 2025-11-24. Coverage at the build date: A6 has-events, B2 not-applicable (never on the Security
 * Council), the 29 others unchecked → 1 / 30. The fixture tables are empty (not imported), so the
 * derivation leaves A1, A2, A4, C3 and D1 to the hand assessment, which has them unchecked.
 */
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type ApiChangesMonthFile,
  type ApiCorrection,
  type ApiCountriesFile,
  type ApiCountryEventsFile,
  type ApiCountrySeriesFile,
  type ApiDumpFile,
  type ApiManifestFile,
  type ApiRepliesFile,
  type ApiScoredCountryFile,
  type ApiScoresDayFile,
  type ApiScoresIndex,
  apiSchemaFor,
  type Country,
  type Dataset,
  type Event,
  loadDataset,
  loadMethodology,
  type Source,
} from '@gai/schema'
import { dayNumber } from '@gai/scoring'
import { afterAll, describe, expect, it } from 'vitest'
import { generateAll, generateContext } from '../generate/index.js'
import {
  BuildError,
  buildData,
  checkGeneratedEvents,
  checkSizes,
  LARGE_FILE_BYTES,
  MAX_FILE_BYTES,
} from './index.js'
import { jsonText } from './json.js'
import { sha256 } from './manifest.js'
import type { BuildInput, BuildOutput } from './types.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const FIXTURES = join(REPO_ROOT, 'fixtures')
const DATE = '2026-09-27'
const SITE = 'https://gaza-accountability-index.pages.dev'
const METHODOLOGY = loadMethodology(REPO_ROOT)
const CHANGELOG = readFileSync(join(REPO_ROOT, 'methodology/CHANGELOG.md'), 'utf8')

const TMP = mkdtempSync(join(tmpdir(), 'gai-build-'))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))

function input(dataset: Dataset, over: Partial<BuildInput> = {}): BuildInput {
  return {
    dataset,
    methodology: METHODOLOGY,
    older: [],
    changelog: CHANGELOG,
    reviewers: [],
    snapshots: [],
    date: DATE,
    siteUrl: SITE,
    git: { sha: null, dirty: null },
    correctionCommits: new Map(),
    historyNote: null,
    ...over,
  }
}

const text = (out: BuildOutput, path: string): string => {
  const content = out.files.get(path)
  if (typeof content !== 'string') throw new Error(`${path} is not a text output`)
  return content
}
const read = <T>(out: BuildOutput, path: string): T => JSON.parse(text(out, path)) as T

/** Days from 2023-10-07 to 2026-09-27 inclusive: 366 + 365 + 355 + 1. */
const DAYS = 1087

const FIXTURE_BUILD = buildData(input(loadDataset(FIXTURES)))

describe('buildData on the fixtures', () => {
  const out = FIXTURE_BUILD

  it('emits every file of docs/04 §2 step 6 and nothing else', () => {
    const months: string[] = []
    for (let i = 0; i < 36; i++) {
      const n = 2023 * 12 + 9 + i
      months.push(`${Math.floor(n / 12)}-${String((n % 12) + 1).padStart(2, '0')}`)
    }
    expect([months[0], months[35]]).toEqual(['2023-10', '2026-09'])
    expect(months).toHaveLength(36)
    const expected = new Set<string>([
      'countries.json',
      'countries/DEU.json',
      'countries/ISR.json',
      'countries/PSE.json',
      'countries/DEU/events.json',
      'countries/DEU/series.json',
      'scores/index.json',
      'methodology/index.json',
      `methodology/${METHODOLOGY.version}.json`,
      'changes/latest.json',
      'corrections.json',
      'replies.json',
      'sensitivity.json',
      'dumps/events.csv',
      'dumps/sources.csv',
      'dumps/assessments.csv',
      'dumps/countries.csv',
      'dumps/countries.scorecard.csv',
      'dumps/scores-daily-2023.csv',
      'dumps/scores-daily-2024.csv',
      'dumps/scores-daily-2025.csv',
      'dumps/scores-daily-2026.csv',
      `dumps/gai-${DATE}.json`,
      'build-notes.json',
      'manifest.json',
    ])
    for (const m of months) {
      for (const suffix of ['.json', '.md', '.fr.md', '.scorecard.md', '.scorecard.fr.md']) {
        expected.add(`changes/${m}${suffix}`)
      }
    }
    const index = read<ApiScoresIndex>(out, 'scores/index.json')
    for (const d of index.dates) expected.add(`scores/${d}.json`)
    expect(index.count).toBe(DAYS)
    expect(index.dates[0]).toBe('2023-10-07')
    expect(index.dates.at(-1)).toBe(DATE)
    expect([...out.files.keys()].sort()).toEqual([...expected].sort())
  })

  it('validates every JSON file against its API schema and writes canonical JSON', () => {
    for (const [path, content] of out.files) {
      expect(typeof content).toBe('string')
      const body = content as string
      expect(body.endsWith('\n')).toBe(true)
      expect(body.includes('\r')).toBe(false)
      if (!path.endsWith('.json')) continue
      const schema = apiSchemaFor(path)
      expect(schema, path).not.toBeNull()
      const value = JSON.parse(body)
      expect(schema?.safeParse(value).success, path).toBe(true)
      expect(body, path).toBe(jsonText(value))
    }
  })

  it('scores DEU as computed by hand', () => {
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    expect(deu.excluded).toBe(false)
    expect(deu.score).toBe(-15)
    expect(deu.score_display).toBe(-15)
    expect(deu.band).toBe('passive')
    expect(deu.passivity_applied).toBe(true)
    expect(deu.passivity).toEqual({
      applied: true,
      points: 15,
      value: 15,
      window_days: 365,
      qualifying: [],
    })
    expect(deu.categories.A).toMatchObject({ raw: 0, clipped: 0, capped: false, scored: true })
    expect(deu.categories.E.scored).toBe(false)
    expect(deu.coverage.ratio).toBeCloseTo(1 / 30, 12)
    expect(deu.coverage.applicable).toBe(30)
    expect(deu.coverage.has_events).toBe(1)
    expect(deu.coverage.not_applicable_ids).toEqual(['B2'])
    // The fixture tables are empty (not imported): A1, A2, A4, C3 and D1 are left to the hand
    // assessment, as is B1, and the hand assessment has them unchecked; nothing is no-data.
    expect(deu.coverage.no_data_ids).toEqual([])
    expect(deu.coverage.no_export_data).toBe(false)
    expect(deu.coverage.unchecked).toBe(29)
    for (const id of ['A1', 'A2', 'A4', 'B1', 'C3', 'D1']) {
      expect(
        deu.assessment.indicators.find((r) => r.indicator === id),
        id,
      ).toMatchObject({
        status: 'unchecked',
        hand_status: 'unchecked',
        derived: null,
        override: null,
      })
    }
    expect(deu.events).toEqual({
      total: 1,
      confirmed: 1,
      corroborated: 0,
      reported: 0,
      disputed: 0,
      // The one counted event is the A6 suspension (the computed A2, C3 and D1 values are not acts).
      by_category: { A: 1, B: 0, C: 0, D: 0, E: 0 },
    })
    expect(deu.last_change).toMatchObject({
      date: '2025-11-24',
      kind: 'event',
      event: 'evt_2025_08_08_DEU_A6',
      indicator: 'A6',
      change: 'end',
      points: -10,
      delta: -10,
    })
    expect(deu.summary.en).toBe(
      'Score −15 (Passive). 1 event, 1 confirmed. Coverage 3%. Last change: 2025-11-24, export licence suspension, ended (A6, −10).',
    )
    expect(deu.summary_scorecard.en).toBe(
      '1 event, 1 confirmed. Coverage 3%. Latest event: 2025-08-08, export licence suspension (A6, +10).',
    )
    expect(deu.citations.score.en.plain).toBe(
      `Gaza Accountability Index, Germany: −15 (Passive), methodology v${METHODOLOGY.version}, as of 27 September 2026, ${SITE}/en/country/DEU?date=${DATE}`,
    )
    expect(deu.citations.scorecard.en.plain).toContain('Germany (scorecard)')
    expect(deu.permalink.fr).toBe(`${SITE}/fr/country/DEU?date=${DATE}`)
    expect(deu.member_of).toEqual(['eu', 'nato', 'g20', 'g7'])
  })

  it('publishes the event with its evaluation, sources, correction and reply', () => {
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    expect(deu.event_list.map((e) => e.id)).toEqual(['evt_2025_08_08_DEU_A6'])
    const [e] = deu.event_list
    expect(e?.generated).toBe(false)
    expect(e?.scored).toBe(true)
    expect(e?.end).toBe('2025-11-24')
    expect(e?.at_build).toEqual({
      reason: 'ended',
      factor: 0,
      weight: 1,
      value: 0,
      counted: 0,
      qualifies: false,
      by: null,
    })
    expect(e?.corrections).toEqual(['cor_20260927_1'])
    expect(e?.replies).toEqual(['rep_20260927_DEU_1'])
    expect(Object.keys(deu.sources).sort()).toEqual([
      'src_20250808_bundesregierung_ruestungsexporte-gaza',
      'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung',
    ])
    expect(deu.corrections.map((c) => c.id)).toEqual(['cor_20260927_1'])
    expect(deu.corrections[0]?.country).toBe('DEU')
    expect(deu.corrections[0]?.commit).toBeNull()
    expect(deu.replies.map((r) => r.id)).toEqual(['rep_20260927_DEU_1'])
    const events = read<ApiCountryEventsFile>(out, 'countries/DEU/events.json')
    expect(events.events).toEqual(deu.event_list)
    expect(events.sources).toEqual(deu.sources)
    expect(text(out, 'dumps/events.csv')).toContain('evt_2025_08_08_DEU_A6')
  })

  it('publishes the series as change points and every daily score', () => {
    const series = read<ApiCountrySeriesFile>(out, 'countries/DEU/series.json')
    expect(series.points.map((p) => [p.date, p.score, p.band, p.passivity_applied])).toEqual([
      ['2023-10-07', -15, 'passive', true],
      ['2025-08-08', -5, 'passive', true],
      ['2025-11-24', -15, 'passive', true],
    ])
    expect(series.points[1]?.transitions).toEqual([
      { id: 'evt_2025_08_08_DEU_A6', indicator: 'A6', kind: 'start' },
    ])
    const day = read<ApiScoresDayFile>(out, 'scores/2025-09-01.json')
    expect(day).toEqual({
      date: '2025-09-01',
      methodology: METHODOLOGY.version,
      countries: [
        {
          iso3: 'DEU',
          score: -5,
          score_display: -5,
          band: 'passive',
          passivity_applied: true,
          clipped: { A: 10, B: 0, C: 0, D: 0, E: 0 },
        },
      ],
    })
    // One file per year, a header and one row per day of DEU: 2023-10-07 to 2023-12-31 is 86 days,
    // 2026-01-01 to 2026-09-27 is 270; 86 + 366 + 365 + 270 = 1087 = DAYS.
    const perYear: [string, number][] = [
      ['2023', 86],
      ['2024', 366],
      ['2025', 365],
      ['2026', 270],
    ]
    expect(perYear.reduce((sum, [, n]) => sum + n, 0)).toBe(DAYS)
    for (const [year, n] of perYear) {
      const csv = text(out, `dumps/scores-daily-${year}.csv`).trimEnd().split('\n')
      expect(csv, year).toHaveLength(n + 1)
    }
  })

  it('lists the registry with the excluded entities (D-10)', () => {
    const all = read<ApiCountriesFile>(out, 'countries.json')
    expect(all.counts).toEqual({ total: 3, scored: 1, excluded: 2 })
    expect(all.countries.map((c) => [c.iso3, c.excluded])).toEqual([
      ['DEU', false],
      ['ISR', true],
      ['PSE', true],
    ])
    const isr = read<{ excluded: boolean; excluded_reason: { en: string } }>(
      out,
      'countries/ISR.json',
    )
    expect(isr.excluded).toBe(true)
    expect(isr.excluded_reason.en.length).toBeGreaterThan(0)
  })

  it('feeds the changes of August and November 2025', () => {
    const aug = read<ApiChangesMonthFile>(out, 'changes/2025-08.json')
    const entries = aug.weeks.flatMap((w) => w.entries)
    expect(entries.map((x) => [x.id, x.change, x.date])).toEqual([
      ['evt_2025_08_08_DEU_A6', 'start', '2025-08-08'],
    ])
    expect(aug.complete).toBe(true)
    expect(aug.movers.up.map((m) => [m.iso3, m.display_from, m.display_to])).toEqual([
      ['DEU', -15, -5],
    ])
    const nov = read<ApiChangesMonthFile>(out, 'changes/2025-11.json')
    expect(nov.weeks.flatMap((w) => w.entries).map((x) => [x.change, x.date])).toEqual([
      ['end', '2025-11-24'],
    ])
    const sep = read<ApiChangesMonthFile>(out, 'changes/2026-09.json')
    expect(sep.complete).toBe(false)
    expect(sep.to).toBe(DATE)
    expect(text(out, 'changes/2025-08.md')).toContain('Germany')
    expect(text(out, 'changes/2025-08.scorecard.md')).not.toMatch(/## Movers/)
  })

  it('writes a manifest with the hash of every other file', () => {
    const man = read<ApiManifestFile>(out, 'manifest.json')
    expect(man.build_date).toBe(DATE)
    expect(man.methodology).toEqual({ version: METHODOLOGY.version, folder: METHODOLOGY.folder })
    expect(man.git).toEqual({ sha: null, dirty: null })
    expect(man.site_url).toBe(SITE)
    expect(man.files.map((f) => f.path)).toEqual(
      [...out.files.keys()].filter((p) => p !== 'manifest.json').sort(),
    )
    for (const f of man.files) {
      const content = out.files.get(f.path) as string
      expect(f.sha256).toBe(sha256(content))
      expect(f.bytes).toBe(Buffer.byteLength(content, 'utf8'))
    }
    expect(man.total.files).toBe(out.files.size - 1)
  })

  it('reports the unchecked indicators and validation warnings in build-notes.json', () => {
    const notes = read<{
      counts: Record<string, number>
      notes: { kind: string; country: string | null }[]
    }>(out, 'build-notes.json')
    expect(notes.counts.unchecked).toBe(1)
    expect(notes.notes.find((n) => n.kind === 'unchecked')?.country).toBe('DEU')
    expect(notes.counts['validation-warning']).toBeGreaterThan(0)
    expect(notes.notes).toEqual(out.notes)
  })

  it('notes each empty table whose indicator the hand-written assessments decide', () => {
    const derivedNotes = (o: BuildOutput) =>
      o.notes
        .filter((n) => n.kind === 'assessment-derived')
        .map((n) => [n.country, n.indicator, n.message])
    expect(derivedNotes(out)).toEqual([
      [null, 'A1', 'sipri_deliveries.csv has no rows; the hand-written assessments decide A1'],
      [null, 'A2', 'comtrade_a2.csv has no rows; the hand-written assessments decide A2'],
      [null, 'A4', 'sipri_orders.csv has no rows; the hand-written assessments decide A4'],
      [null, 'C3', 'comtrade_c3.csv has no rows; the hand-written assessments decide C3'],
      [null, 'D1', 'fts_funding.csv has no rows; the hand-written assessments decide D1'],
    ])
    // Before the first post-war SIPRI release (2024-03-11), A1 is no-data whatever the table
    // holds (docs/02 §5): the hand assessment does not decide it, so no A1 note.
    const early = buildData(input(loadDataset(FIXTURES), { date: '2024-03-10' }))
    expect(derivedNotes(early).map(([, indicator]) => indicator)).toEqual(['A2', 'A4', 'C3', 'D1'])
    const deu = read<ApiScoredCountryFile>(early, 'countries/DEU.json')
    expect(deu.assessment.indicators.find((r) => r.indicator === 'A1')).toMatchObject({
      status: 'no-data',
      derived: { status: 'no-data', reason: 'before-first-release' },
    })
  })

  it('is deterministic: a second build gives the same bytes (D-25)', () => {
    const again = buildData(input(loadDataset(FIXTURES)))
    expect([...again.files.keys()]).toEqual([...out.files.keys()])
    for (const [path, content] of out.files) expect(again.files.get(path), path).toEqual(content)
  })

  it('leaves out records dated after the build date', () => {
    const before = buildData(input(loadDataset(FIXTURES), { date: '2026-09-26' }))
    expect(read<ApiRepliesFile>(before, 'replies.json').replies).toEqual([])
    expect(read<{ corrections: ApiCorrection[] }>(before, 'corrections.json').corrections).toEqual(
      [],
    )
    expect(read<ApiScoresIndex>(before, 'scores/index.json').count).toBe(DAYS - 1)
  })

  it('records the correction commit and the git state it is given', () => {
    const sha = 'a'.repeat(40)
    const withGit = buildData(
      input(loadDataset(FIXTURES), {
        git: { sha, dirty: false },
        correctionCommits: new Map([['cor_20260927_1', sha]]),
        historyNote: 'test note',
      }),
    )
    expect(
      read<{ corrections: ApiCorrection[] }>(withGit, 'corrections.json').corrections[0]?.commit,
    ).toBe(sha)
    expect(read<ApiManifestFile>(withGit, 'manifest.json').git).toEqual({ sha, dirty: false })
    expect(withGit.notes.some((n) => n.kind === 'history' && n.message === 'test note')).toBe(true)
  })
})

describe('buildData on the real structured tables', () => {
  // A copy of data/ and archive/ with the fixture event, its sources, assessment, correction and
  // reply added, and the registry reduced to the fixture's (DEU, ISR, PSE) so that the test does
  // not grow with the registry.
  const root = join(TMP, 'real')
  cpSync(join(REPO_ROOT, 'data'), join(root, 'data'), { recursive: true })
  cpSync(join(REPO_ROOT, 'archive'), join(root, 'archive'), { recursive: true })
  const f = (p: string) => join(FIXTURES, p)
  cpSync(f('data/countries.yaml'), join(root, 'data/countries.yaml'))
  cpSync(f('data/events/DEU.yaml'), join(root, 'data/events/DEU.yaml'))
  cpSync(f('data/assessments/DEU.yaml'), join(root, 'data/assessments/DEU.yaml'))
  cpSync(f('data/corrections.yaml'), join(root, 'data/corrections.yaml'))
  cpSync(f('data/replies'), join(root, 'data/replies'), { recursive: true })
  cpSync(f('data/sources/2025'), join(root, 'data/sources/2025'), { recursive: true })
  cpSync(f('archive/text'), join(root, 'archive/text'), { recursive: true })
  const fixtureIndex = readFileSync(f('archive/index.csv'), 'utf8').split('\n').slice(1).join('\n')
  appendFileSync(join(root, 'archive/index.csv'), fixtureIndex)
  const ds = loadDataset(root)
  const generated = generateAll(generateContext(METHODOLOGY), ds.structured).events
  const deuGenerated = generated.filter((e) => e.country === 'DEU')
  const out = buildData(input(ds))

  it('loads without errors', () => {
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
  })

  it('publishes the generated events of DEU in the country file, events.json and the dumps', () => {
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    const byId = new Map(deu.event_list.map((e) => [e.id, e]))
    const csv = text(out, 'dumps/events.csv')
    const dump = read<ApiDumpFile>(out, `dumps/gai-${DATE}.json`)
    const dumpIds = new Set(dump.events.map((e) => e.id))
    const eventsFile = read<ApiCountryEventsFile>(out, 'countries/DEU/events.json')
    const eventsIds = new Set(eventsFile.events.map((e) => e.id))
    for (const g of deuGenerated) {
      const e = byId.get(g.id)
      expect(e, g.id).toBeDefined()
      expect(e?.generated).toBe(true)
      expect(e?.points).toBe(g.points)
      expect(e?.review.drafted_by).toBe('@gai/pipeline generate')
      for (const ev of e?.evidence ?? []) expect(deu.sources[ev.source], ev.source).toBeDefined()
      expect(csv).toContain(g.id)
      expect(dumpIds.has(g.id)).toBe(true)
      expect(eventsIds.has(g.id)).toBe(true)
    }
    expect(deu.event_list).toHaveLength(deuGenerated.length + 1)
  })

  it('gives computed events the points of the value in force the day before', () => {
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    const d1 = deu.event_list
      .filter((e) => e.indicator === 'D1')
      .sort((a, b) => dayNumber(a.date) - dayNumber(b.date) || (a.id < b.id ? -1 : 1))
    // The previous D1 event when it ends on this event's date (`end` is exclusive); after a gap
    // (a month without funding) or for the first one, null.
    d1.forEach((e, i) => {
      const prev = d1[i - 1]
      expect(e.previous_points, e.id).toBe(
        prev !== undefined && prev.end === e.date ? prev.points : null,
      )
    })
  })

  it('derives the coverage of the generated indicators from the tables', () => {
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    const rows = new Map(deu.assessment.indicators.map((r) => [r.indicator, r]))
    for (const id of ['A1', 'A2', 'A4', 'B1', 'B2', 'C3', 'D1']) {
      const row = rows.get(id)
      expect(row?.status).toBe(deu.coverage.statuses[id])
      const hasGenerated = deuGenerated.some(
        (e) => e.indicator === id && dayNumber(e.date) <= dayNumber(DATE),
      )
      if (hasGenerated) expect(row?.status, id).toBe('has-events')
    }
    // Germany was not on the Security Council in the window: B2 is not applicable (docs/02 §8).
    expect(rows.get('B2')?.status).toBe('not-applicable')
  })

  it('notes the generated events of countries outside the registry', () => {
    const outside = new Set(generated.map((e) => e.country).filter((c) => !['DEU'].includes(c)))
    const noted = new Set(
      out.notes.filter((n) => n.kind === 'unregistered-country').map((n) => n.country),
    )
    for (const iso3 of outside) expect(noted.has(iso3), iso3).toBe(true)
  })

  it('passes the determinism check on the same input', () => {
    const again = buildData(input(loadDataset(root)))
    for (const [path, content] of out.files) expect(again.files.get(path), path).toEqual(content)
  })
})

// ---------------------------------------------------------------------------------------------
// Synthetic Security Council data, in memory only: Germany held no seat in the window
// (fixtures/README.md), and FRA stands for a permanent member. The elected term, the FRA registry
// entry (placeholders except its permanent term), the veto source and the veto rows are made up
// for the test, not facts; S/2099/… are not real document symbols.

const VETO_SOURCE = 'src_20260101_test_synthetic-vetoes'
const VETO_URL = 'https://example.org/synthetic-vetoes.csv'
const VETO_WAYBACK = `https://web.archive.org/web/20260101000000id_/${VETO_URL}`

/**
 * The fixtures with a synthetic elected term for DEU (ended before the build date: a seat on some
 * day of the window, not on the build date) and a synthetic permanent member FRA; with one veto row
 * of FRA when `ceasefire` is a boolean, none when null.
 */
function withCouncil(ceasefire: boolean | null): Dataset {
  const ds = loadDataset(FIXTURES)
  const deu = ds.countries.find((c) => c.value.iso3 === 'DEU')
  const hand = ds.assessments.find((a) => a.value.country === 'DEU')
  const firstSource = ds.sources[0]
  if (deu === undefined || hand === undefined || firstSource === undefined) {
    throw new Error('fixture DEU or its sources missing')
  }
  deu.value.memberships.unsc = [{ from: '2024-01-01', to: '2025-12-31', permanent: false }]
  // assessment.not-applicable refuses a hand B2 not-applicable for a state on the Council.
  hand.value.indicators.B2 = { status: 'unchecked' }
  const fra: Country = {
    ...structuredClone(deu.value),
    iso3: 'FRA',
    iso2: 'FR',
    m49: 250,
    name: { en: 'Synthetic permanent member', fr: 'Membre permanent synthétique' },
    memberships: {
      unsc: [{ from: '1945-10-24', to: null, permanent: true }],
      eu: false,
      nato: false,
      arab_league: false,
      oic: false,
      g20: false,
      g7: false,
      brics: false,
    },
    recognises_palestine: { since: null },
    gov_sources: [],
    notes: 'Synthetic registry entry of a build test: placeholders except the permanent term.',
  }
  ds.countries.push({ value: fra, file: 'data/countries.yaml', line: 1000 })
  if (ceasefire === null) return ds
  // The archived copy as the source record and archive/index.csv both give it (a made-up hash).
  const archived = {
    url: VETO_URL,
    wayback_url: VETO_WAYBACK,
    sha256: '0'.repeat(64),
    bytes: 1,
    retrieved_at: '2026-01-01T00:00:00Z',
    content_type: 'text/csv',
  }
  const source: Source = {
    ...structuredClone(firstSource.value),
    ...archived,
    id: VETO_SOURCE,
    kind: 'dataset',
    title: 'Synthetic veto table of a build test',
    publisher: 'Test',
    publisher_type: 'dataset',
    language: 'en',
    date: '2026-01-01',
    text_file: `archive/text/${VETO_SOURCE}.txt`,
    notes: 'Synthetic source of a build test.',
  }
  ds.sources.push({ value: source, file: `data/sources/2026/${VETO_SOURCE}.yaml`, line: 1 })
  ds.archiveIndex.push({
    value: { src_id: VETO_SOURCE, ...archived },
    file: 'archive/index.csv',
    line: 1000,
  })
  ds.archiveTextIds.add(VETO_SOURCE)
  ds.structured['unsc_vetoes.csv'].push({
    value: {
      date: '2025-02-20',
      draft: 'S/2099/1',
      vetoed_by: 'FRA',
      ceasefire,
      source: VETO_SOURCE,
    },
    file: 'data/structured/unsc_vetoes.csv',
    line: 2,
  })
  return ds
}

describe('buildData with Security Council terms (synthetic)', () => {
  const row = (f: ApiScoredCountryFile, id: string) =>
    f.assessment.indicators.find((r) => r.indicator === id)
  const baseline = read<ApiScoredCountryFile>(FIXTURE_BUILD, 'countries/DEU.json')

  it('makes B2 applicable and none-found for a state elected for part of the window', () => {
    const ds = withCouncil(null)
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
    const out = buildData(input(ds))
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    expect(row(deu, 'B2')).toMatchObject({
      status: 'none-found',
      hand_status: 'unchecked',
      derived: { status: 'none-found', reason: 'no-veto-power' },
      override: { from: 'unchecked', to: 'none-found', reason: 'derived:no-veto-power' },
    })
    expect(deu.coverage.statuses.B2).toBe('none-found')
    expect(deu.coverage.not_applicable_ids).toEqual([])
    // 31 scored indicators, none not-applicable: one more than the fixture build's 30.
    expect(deu.coverage.applicable).toBe(baseline.coverage.applicable + 1)
    expect(deu.coverage.applicable).toBe(31)
    expect(deu.coverage.none_found).toBe(1)
    // A permanent member while unsc_vetoes.csv is empty: the tables say nothing, and FRA has no
    // hand assessment, so B2 is unchecked.
    const fra = read<ApiScoredCountryFile>(out, 'countries/FRA.json')
    expect(row(fra, 'B2')).toMatchObject({ status: 'unchecked', derived: null, override: null })
  })

  it('reads the veto table for a permanent member', () => {
    const tracked = buildData(input(withCouncil(false)))
    const fra = read<ApiScoredCountryFile>(tracked, 'countries/FRA.json')
    expect(fra.event_list).toEqual([])
    expect(row(fra, 'B2')).toMatchObject({
      status: 'none-found',
      hand_status: 'unchecked',
      derived: { status: 'none-found', reason: 'no-ceasefire-veto' },
      override: { from: 'unchecked', to: 'none-found', reason: 'derived:no-ceasefire-veto' },
    })
    // The elected member keeps no-veto-power whatever the veto table holds.
    const deu = read<ApiScoredCountryFile>(tracked, 'countries/DEU.json')
    expect(row(deu, 'B2')?.derived).toEqual({ status: 'none-found', reason: 'no-veto-power' })

    const scored = buildData(input(withCouncil(true)))
    const fraScored = read<ApiScoredCountryFile>(scored, 'countries/FRA.json')
    // A veto of a ceasefire draft: one B2 event, −20 (docs/02 §2 B2).
    expect(fraScored.event_list.map((e) => [e.id, e.generated, e.points])).toEqual([
      ['evt_2025_02_20_FRA_B2_s-2099-1', true, -20],
    ])
    expect(row(fraScored, 'B2')).toMatchObject({
      status: 'has-events',
      derived: { status: 'has-events', reason: 'generated-event' },
    })
  })
})

describe('unpublished events', () => {
  it('leave no trace in the outputs besides a build note', () => {
    // A synthetic draft A3 event of DEU (reusing the fixture evidence) in a copy of the fixtures.
    const root = join(TMP, 'draft')
    cpSync(FIXTURES, root, { recursive: true })
    const base = loadDataset(FIXTURES).events[0]?.value as Event
    const draft: Event = {
      ...base,
      id: 'evt_2025_09_01_DEU_A3',
      revision: 1,
      indicator: 'A3',
      date: '2025-09-01',
      end: null,
      points: -15,
      status: 'draft',
      review: { drafted_by: 'claude-opus-5-5', drafted_at: '2026-09-27' },
    }
    // JSON is YAML: the loader reads the list as written.
    writeFileSync(join(root, 'data/events/DEU.yaml'), JSON.stringify([base, draft], null, 1))
    const out = buildData(input(loadDataset(root)))
    const deu = read<ApiScoredCountryFile>(out, 'countries/DEU.json')
    expect(deu.event_list.map((e) => e.id)).toEqual(['evt_2025_08_08_DEU_A6'])
    expect(deu.indicators.map((i) => i.id)).toEqual(['A6'])
    expect(deu.score).toBe(-15)
    for (const [path, content] of out.files) {
      if (path === 'build-notes.json') continue
      expect(String(content).includes('evt_2025_09_01_DEU_A3'), path).toBe(false)
    }
    expect(
      out.notes.filter((n) => n.kind === 'unpublished-event').map((n) => [n.country, n.message]),
    ).toEqual([['DEU', 'evt_2025_09_01_DEU_A3 is draft: not published']])
  })
})

describe('errors that stop the build', () => {
  it('refuses a build date before the window and a site URL that is not http(s)', () => {
    const ds = loadDataset(FIXTURES)
    expect(() => buildData(input(ds, { date: '2023-10-06' }))).toThrow(BuildError)
    expect(() => buildData(input(ds, { siteUrl: 'ftp://example.org' }))).toThrow(BuildError)
  })

  it('refuses data that pnpm validate rejects', () => {
    const root = join(TMP, 'invalid')
    cpSync(FIXTURES, root, { recursive: true })
    const file = join(root, 'data/events/DEU.yaml')
    writeFileSync(file, readFileSync(file, 'utf8').replace('points: 10', 'points: -10'))
    expect(() => buildData(input(loadDataset(root)))).toThrow(/pnpm validate reports/)
  })

  it('refuses generated events that fail the schema, the tone lint or their sources', () => {
    const ds = loadDataset(FIXTURES)
    const base = ds.events[0]?.value as Event
    const bad: Event = {
      ...base,
      id: 'evt_2025_08_08_DEU_B1_test',
      indicator: 'B1',
      type: 'repeatable',
      generated: true,
      summary: {
        en: 'The country voted in a shameful way!',
        fr: 'Le pays a voté.',
      },
      evidence: [
        { ...(base.evidence[0] as Event['evidence'][number]), source: 'src_20990101_nowhere_none' },
      ],
    }
    expect(() => checkGeneratedEvents([bad], input(ds))).toThrow(
      /shameful|exclamation[\s\S]*src_20990101_nowhere_none|src_20990101_nowhere_none/,
    )
    let message = ''
    try {
      checkGeneratedEvents([bad], input(ds))
    } catch (err) {
      message = (err as Error).message
    }
    expect(message).toContain('banned')
    expect(message).toContain('exclamation')
    expect(message).toContain('src_20990101_nowhere_none')
    expect(() => checkGeneratedEvents([{ ...base, generated: true }], input(ds))).toThrow(/same id/)
  })
})

describe('file sizes (Cloudflare Pages serves files up to 25 MiB)', () => {
  it('notes a file above 20 MiB and refuses one above 25 MiB', () => {
    expect(LARGE_FILE_BYTES).toBe(20 * 1024 * 1024)
    expect(MAX_FILE_BYTES).toBe(25 * 1024 * 1024)
    const small = 'x'.repeat(LARGE_FILE_BYTES)
    const large = new Uint8Array(LARGE_FILE_BYTES + 1)
    expect(
      checkSizes(
        new Map<string, string | Uint8Array>([
          ['a.json', small],
          ['b.csv', large],
        ]),
      ),
    ).toEqual([
      {
        kind: 'large-file',
        country: null,
        indicator: null,
        message: `b.csv is ${LARGE_FILE_BYTES + 1} bytes; Cloudflare Pages serves files up to 25 MiB (docs/04 §5)`,
      },
    ])
    const tooLarge = new Uint8Array(MAX_FILE_BYTES + 1)
    expect(() => checkSizes(new Map([['dumps/x.json', tooLarge]]))).toThrow(
      `1 file(s) exceed the 25 MiB that Cloudflare Pages serves (docs/04 §5); split them:\n  dumps/x.json: ${MAX_FILE_BYTES + 1} bytes`,
    )
  })
})
