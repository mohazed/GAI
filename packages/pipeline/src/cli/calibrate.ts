/**
 * `pnpm calibrate [--date YYYY-MM-DD] [--countries USA,DEU,…] [--statuses reviewed] [--fts]
 * [--out FILE]` — the numbers of the calibration worksheet (P-15, docs/08 §3) as one JSON file:
 * every scored entity at the date, the ten calibration countries in detail, the sensitivity tables
 * of docs/02 §10, and the effect of each methodology proposal under review (see ../calibrate.ts).
 *
 * Local only: it is not part of build-data and no workflow runs it. Events of `--statuses`
 * (default `reviewed`, the status of the drafts awaiting the author's review) are scored as if
 * published, like `pnpm score --preview`; `draft` is left out by default because a draft is an
 * event the second reading did not accept. The output says so; it is never the published score.
 *
 * `--fts` also downloads the archived FTS flow pages that fts_funding.csv cites (their `id_`
 * Wayback URLs), checks each body's SHA-256 against its source record, rebuilds the monthly
 * windows with and without the flows dated before 2023-10-07, and compares D1 (P-04 choice B-60).
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  type Event,
  type Located,
  listMethodologyVersions,
  loadDataset,
  loadMethodology,
  type StructuredRow,
} from '@gai/schema'
import {
  bandFor,
  decayFactor,
  type MethodologyFilesInput,
  percentOfGni,
  roundHalfAwayFromZero,
  sensitivitySuite,
} from '@gai/scoring'
import {
  asPublished,
  both,
  type CountryEventsIn,
  cappedFiles,
  compare,
  compile,
  computedRuns,
  d1Runs,
  methodologyFiles,
  mostSevereFiles,
  noPreexistingB8,
  positiveOnly,
  preexistingB8,
  raiseConfidence,
  type Scored,
  scoreVariant,
  sensitivityRows,
  standingWhileHolding,
  type VariantSpec,
} from '../calibrate.js'
import {
  FTS_ATTRIBUTION_OVERRIDES,
  type FtsPage,
  ftsTables,
  parseFlowPage,
  parseLocations,
  parseOrganizations,
  verifyOverrides,
} from '../fetch/fts.js'
import { FTS_DONOR_UNIVERSE } from '../fetch/fts-run.js'
import { generateD1 } from '../generate/funding.js'
import { confirmedMilitaryOf, generateAll, generateContext, gniFor } from '../generate/index.js'
import { argv, fail, flag, option, REPO_ROOT } from './common.js'

const TEN = ['USA', 'DEU', 'GBR', 'FRA', 'ESP', 'IRL', 'ZAF', 'TUR', 'EGY', 'IND']

const date = option('--date') ?? new Date().toISOString().slice(0, 10)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('--date expects YYYY-MM-DD')
const ten = (option('--countries') ?? TEN.join(',')).toUpperCase().split(',').filter(Boolean)
const statuses = (option('--statuses') ?? 'reviewed').split(',').filter(Boolean)
const out = option('--out')
for (const a of argv) {
  if (a.startsWith('--') && !['--date', '--countries', '--statuses', '--out', '--fts'].includes(a))
    fail(`unknown option ${a}`)
}

const folder = listMethodologyVersions(REPO_ROOT).at(-1)
if (folder === undefined) fail('no methodology folder')
const lm = loadMethodology(REPO_ROOT, folder)
const ds = loadDataset(REPO_ROOT)
if (ds.issues.some((i) => i.level === 'error')) fail('the dataset has errors: run pnpm validate', 1)
let files: MethodologyFilesInput
try {
  files = methodologyFiles(lm)
} catch (err) {
  fail((err as Error).message, 1)
}
const m = compile(files)
const ctx = generateContext(
  lm,
  ds.countries.map((c) => c.value),
)
const generateWith = (structured: typeof ds.structured) =>
  generateAll(ctx, structured, {
    confirmedMilitary: confirmedMilitaryOf(structured['a2_confirmed_military.csv']),
  }).events
const generated = generateWith(ds.structured)
const gniRows = ds.structured['gni.csv']

const registry = ds.countries.map((c) => c.value)
const scored = registry.filter((c) => !c.excluded)
const hand = asPublished(
  ds.events.map((e) => e.value),
  statuses,
)
const previewed = ds.events
  .map((e) => e.value)
  .filter((e) => statuses.includes(e.status))
  .map((e) => e.id)
const handBy = new Map<string, Event[]>()
for (const e of hand) handBy.set(e.country, [...(handBy.get(e.country) ?? []), e])
const genBy = new Map<string, Event[]>()
for (const e of generated) genBy.set(e.country, [...(genBy.get(e.country) ?? []), e])
const countries: CountryEventsIn[] = scored.map((c) => ({
  iso3: c.iso3,
  events: [...(handBy.get(c.iso3) ?? []), ...(genBy.get(c.iso3) ?? [])],
}))

const r1 = (x: number) => roundHalfAwayFromZero(x, 1)
const r2 = (x: number) => roundHalfAwayFromZero(x, 2)
const r4 = (x: number | null) => (x === null ? null : roundHalfAwayFromZero(x, 4))

// ---------------------------------------------------------------------------------------------
// Baseline

const base = scoreVariant(countries, m, date, { id: 'baseline' })
const suite = sensitivitySuite(
  countries.map((c) => ({ iso3: c.iso3, events: c.events })),
  date,
  m,
)
// The calibration's own scores must equal the engine's sensitivity baseline.
for (const e of suite.baseline) {
  const s = base.scores.find((x) => x.iso3 === e.iso3)
  if (s === undefined || s.exact !== e.exact) fail(`baseline mismatch for ${e.iso3}`, 1)
}
const position = new Map(suite.baseline.map((e) => [e.iso3, e]))

const kindOf = new Map(ds.sources.map((s) => [s.value.id, s.value.kind]))
const sourceOf = new Map(ds.sources.map((s) => [s.value.id, s.value]))

function detail(iso3: string) {
  const s = base.full.get(iso3)
  if (s === undefined) fail(`${iso3} is not scored`, 1)
  const evs = [...(handBy.get(iso3) ?? []), ...(genBy.get(iso3) ?? [])]
  const byId = new Map(evs.map((e) => [e.id, e]))
  const assessment = ds.assessments.find((a) => a.value.country === iso3)?.value
  return {
    iso3,
    name: registry.find((c) => c.iso3 === iso3)?.name.en,
    exact: s.exact,
    display: s.display,
    band: s.band,
    position: position.get(iso3)?.position,
    rank: position.get(iso3)?.rank,
    raw: s.raw,
    passivity: { applied: s.passivity.applied, qualifying: s.passivity.qualifying },
    categories: Object.fromEntries(
      Object.values(s.categories).map((c) => [c.id, { raw: c.raw, clipped: c.clipped }]),
    ),
    indicators: s.indicators.map((i) => ({ id: i.id, raw: i.raw, value: i.value })),
    statuses: Object.fromEntries(
      Object.entries(assessment?.indicators ?? {}).map(([k, v]) => [
        k,
        (v as { status: string }).status,
      ]),
    ),
    events: s.events
      .filter((e) => e.reason !== 'not-published' && e.reason !== 'out-of-scope')
      .map((e) => {
        const ev = byId.get(e.id)
        const src = ev?.evidence[0]?.source ?? null
        const rec = src === null ? undefined : sourceOf.get(src)
        return {
          id: e.id,
          indicator: e.indicator,
          type: e.type,
          date: e.date,
          end: e.end,
          points: e.points,
          confidence: e.confidence,
          factor: r4(e.factor),
          value: r2(e.value),
          counted: r2(e.counted),
          reason: e.reason,
          by: e.by,
          qualifies: e.qualifies,
          generated: ev?.generated === true,
          summary: ev?.summary.en ?? null,
          source: src,
          source_kind: rec?.kind ?? null,
          source_title: rec?.title ?? null,
          source_url: rec?.url ?? null,
          sources: [...new Set(ev?.evidence.map((x) => x.source) ?? [])],
        }
      }),
  }
}

// ---------------------------------------------------------------------------------------------
// Proposals

const b21 = raiseConfidence(hand, kindOf, ['official-video', 'parliamentary'])
const b21Set = new Set(b21.raised)
const STACK = ['A3', 'A6', 'A7', 'B3', 'B7', 'D2']
const haveB8 = new Set(generated.filter((e) => e.indicator === 'B8').map((e) => e.country))
const pre = preexistingB8(
  scored.map((c) => ({ iso3: c.iso3, since: c.recognises_palestine.since })),
  haveB8,
  m.windowStart,
)
const preBy = new Map(pre.map((e) => [e.country, e]))
const withPre = (evs: readonly Event[]) => {
  const e = evs[0] === undefined ? undefined : preBy.get(evs[0].country)
  return e === undefined ? [...evs] : [...evs, e]
}

const ftsResult = flag('--fts') ? await ftsPrewar() : null
const d1PostWar = ftsResult?.d1 ?? null
const fts = ftsResult?.report ?? null
const postWarD1By = new Map<string, Event[]>()
for (const e of d1PostWar ?? [])
  postWarD1By.set(e.country, [...(postWarD1By.get(e.country) ?? []), e])
/** D1 rebuilt without the FTS flows dated before 2023-10-07 (with --fts only). */
const withPostWarD1 = (evs: readonly Event[]): Event[] => {
  if (d1PostWar === null) return [...evs]
  const iso3 = evs[0]?.country
  return [
    ...evs.filter((e) => e.indicator !== 'D1'),
    ...(iso3 === undefined ? [] : (postWarD1By.get(iso3) ?? [])),
  ]
}
/** A2 and C3 values of data year 2022, wholly before 2023-10-07, left out. */
const no2022Trade = (evs: readonly Event[]): Event[] =>
  evs.filter(
    (e) => !((e.indicator === 'A2' || e.indicator === 'C3') && /_comtrade-2022-/.test(e.id)),
  )
const raise = (evs: readonly Event[]): Event[] =>
  evs.map((e) => (b21Set.has(e.id) ? { ...e, confidence: 'confirmed' as const } : e))

const specs: (VariantSpec & { label: string })[] = [
  {
    id: 'b21',
    label: 'official-video and parliamentary sources count for confirmed (B-21)',
    events: (evs) => evs.map((e) => (b21Set.has(e.id) ? { ...e, confidence: 'confirmed' } : e)),
  },
  {
    id: 'b22',
    label: 'most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51)',
    methodology: compile(mostSevereFiles(files, STACK)),
  },
  {
    id: 'b23',
    label: `B1 capped at +${m.passivity.points} (B-23, one option)`,
    methodology: compile(cappedFiles(files, 'B1', { min: null, max: m.passivity.points })),
  },
  {
    id: 'b23-sym',
    label: `B1 capped at −${m.passivity.points} and +${m.passivity.points} (B-23, symmetric option)`,
    methodology: compile(
      cappedFiles(files, 'B1', { min: -m.passivity.points, max: m.passivity.points }),
    ),
  },
  { id: 'b46', label: 'only contributions of +2 or more qualify (B-46)', qualifies: positiveOnly },
  { id: 'b47', label: 'pre-existing B8 tier does not qualify (B-47)', qualifies: noPreexistingB8 },
  {
    id: 'b48-alt',
    label: 'alternative to B-48: a standing state qualifies while it holds',
    qualifies: standingWhileHolding,
  },
  {
    id: 'b46+b47',
    label: 'B-46 and B-47 together',
    qualifies: both(positiveOnly, noPreexistingB8),
  },
  {
    id: 'b8-pre',
    label: 'pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative)',
    events: withPre,
  },
  {
    id: 'b8-pre+b47',
    label: 'pre-existing B8 +3 rows, with B-47',
    events: withPre,
    qualifies: noPreexistingB8,
  },
  {
    id: 'trade-no-2022',
    label: 'A2 and C3 values of data year 2022 not in force in the window (P-04, B-63)',
    events: no2022Trade,
  },
  ...(fts === null
    ? []
    : [
        {
          id: 'd1-postwar',
          label: 'D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60)',
          events: withPostWarD1,
        },
      ]),
  {
    id: 'proposal',
    label:
      'the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows',
    methodology: compile(
      cappedFiles(mostSevereFiles(files, STACK), 'B1', {
        min: -m.passivity.points,
        max: m.passivity.points,
      }),
    ),
    events: (evs) => withPostWarD1(no2022Trade(raise(evs))),
    qualifies: both(positiveOnly, noPreexistingB8),
  },
]

const QUARTERS = [
  '2023-12-31',
  '2024-03-31',
  '2024-06-30',
  '2024-09-30',
  '2024-12-31',
  '2025-03-31',
  '2025-06-30',
  '2025-09-30',
  '2025-12-31',
  '2026-03-31',
  '2026-06-30',
  date,
].filter((d, i, a) => d <= date && a.indexOf(d) === i)

const tenOf = (list: readonly Scored[]) =>
  ten.map((iso3) => {
    const s = list.find((x) => x.iso3 === iso3)
    return s === undefined
      ? { iso3 }
      : { iso3, exact: r2(s.exact), display: s.display, band: s.band, passivity: s.passivity }
  })

const baselineAt = new Map(QUARTERS.map((d) => [d, scoreVariant(countries, m, d, { id: 'b' })]))
const proposals = specs.map((spec) => {
  const v = scoreVariant(countries, m, date, spec)
  const c = compare(base.scores, v.scores)
  const history = QUARTERS.map((d) => {
    const b = baselineAt.get(d)
    const x = scoreVariant(countries, m, d, spec)
    const cc = compare(b?.scores ?? [], x.scores)
    return {
      date: d,
      changed_display: cc.changedDisplay,
      band_changes: cc.bandChanges.length,
      passivity_changes: cc.passivityChanges.length,
      ten: tenOf(x.scores).filter((t, i) => {
        const bt = tenOf(b?.scores ?? [])[i] as { display?: number }
        return (t as { display?: number }).display !== bt.display
      }),
    }
  })
  return {
    id: spec.id,
    label: spec.label,
    changed_display: c.changedDisplay,
    spearman: r4(c.spearman),
    band_changes: c.bandChanges,
    passivity_changes: c.passivityChanges,
    ten: tenOf(v.scores),
    history,
    sensitivity: sensitivityRows(countries, m, date, spec).map((r) => ({
      ...r,
      spearman: r4(r.spearman),
    })),
  }
})

// B-23: a hypothetical state that votes yes on every qualifying vote and does nothing else.
const votes = lm.votes?.value.votes ?? []
const imported = new Set(ds.structured['unga_votes.csv'].map((r) => r.value.resolution))
const yesOnly = (symbols: readonly { symbol: string; date: string }[]): Event[] =>
  symbols.map(
    (v) =>
      ({
        id: `calibration_B1_${v.symbol}`,
        country: 'ZZZ',
        indicator: 'B1',
        type: 'repeatable',
        date: v.date,
        points: 3,
        confidence: 'confirmed',
        scope: ['gaza'],
        status: 'published',
      }) as unknown as Event,
  )
const monthEnds: string[] = []
for (let y = 2023, mo = 10; y < 2028; ) {
  const next = new Date(Date.UTC(y, mo, 1))
  next.setUTCDate(0)
  monthEnds.push(next.toISOString().slice(0, 10))
  mo++
  if (mo > 12) {
    mo = 1
    y++
  }
}
const profile = (evs: Event[], mm = m) =>
  monthEnds.map((d) => {
    const s = scoreVariant([{ iso3: 'ZZZ', events: evs }], mm, d, { id: 'y' }).scores[0] as Scored
    return { date: d, exact: r2(s.exact), display: s.display, band: s.band }
  })
const allVotes = votes.map((v) => ({ symbol: v.symbol, date: v.date }))
const importedVotes = allVotes.filter((v) => imported.has(v.symbol))
const capM = compile(cappedFiles(files, 'B1', { min: null, max: m.passivity.points }))
const summarise = (p: ReturnType<typeof profile>) => {
  const max = p.reduce((a, b) => (b.exact > a.exact ? b : a))
  const acting = p.filter((x) => x.band === 'acting')
  return {
    max,
    months_in_acting: acting.length,
    first_acting: acting[0]?.date ?? null,
    last_acting: acting.at(-1)?.date ?? null,
    at_date: p.find((x) => x.date >= date) ?? null,
  }
}
const b1Only = base.scores
  .filter((s) =>
    (countries.find((c) => c.iso3 === s.iso3)?.events ?? []).every(
      (e) => e.indicator === 'B1' || e.points === 0,
    ),
  )
  .map((s) => s.band)
const yesOnlyReport = {
  all_votes: summarise(profile(yesOnly(allVotes))),
  imported_votes: summarise(profile(yesOnly(importedVotes))),
  all_votes_capped: summarise(profile(yesOnly(allVotes), capM)),
  countries_with_only_b1_or_zero_events: {
    n: b1Only.length,
    bands: Object.fromEntries(
      [...new Set(b1Only)].sort().map((b) => [b, b1Only.filter((x) => x === b).length]),
    ),
  },
  missing_votes: allVotes
    .filter((v) => !imported.has(v.symbol))
    .map((v) => {
      const delta = Math.round((Date.parse(date) - Date.parse(v.date)) / 86_400_000)
      const d = decayFactor(delta, m.decay)
      return { ...v, delta, d: r4(d), yes: r2(3 * d), no: r2(-5 * d), abstain_absent: r2(-2 * d) }
    }),
}

// ---------------------------------------------------------------------------------------------
// P-04 choices

const lastMonth = date.slice(0, 7)
const d1 = d1Runs(generated, '2023-10', lastMonth)
const donors = d1.filter((r) => r.months > 0)
const d1Report = {
  donors: donors.length,
  with_changes: donors.filter((r) => r.changes > 0).length,
  changes_total: donors.reduce((s, r) => s + r.changes, 0),
  quarterly_changes_total: donors.reduce((s, r) => s + r.quarterlyChanges, 0),
  changes_median: [...donors.map((r) => r.changes)].sort((a, b) => a - b)[
    Math.floor(donors.length / 2)
  ],
  most_changes: [...donors]
    .sort((a, b) => b.changes - a.changes || (a.iso3 < b.iso3 ? -1 : 1))
    .slice(0, 10)
    .map((r) => ({ iso3: r.iso3, changes: r.changes })),
  ten: ten.map(
    (iso3) =>
      d1.find((r) => r.iso3 === iso3) ?? { iso3, months: 0, changes: 0, quarterlyChanges: 0 },
  ),
}

const gniBy = new Map<string, typeof gniRows>()
for (const g of gniRows) gniBy.set(g.value.iso3, [...(gniBy.get(g.value.iso3) ?? []), g])
const latestYear = Math.max(...gniRows.map((g) => g.value.year))
const tiers = (lm.thresholds?.value.formulas.d1 as { tiers?: { value: number }[] } | undefined)
  ?.tiers
const bounds = (tiers ?? []).map((t) => t.value).filter((b) => b > 0)
const oldGni = [...gniBy.entries()]
  .map(([iso3, rows]) => {
    const g = gniFor(rows, Number(date.slice(0, 4)))
    return { iso3, year: g?.value.year ?? null, gni: g?.value.gni_atlas_usd ?? null }
  })
  .filter((g) => g.year !== null && g.year < latestYear - 1)
  .map((g) => {
    const fts = ds.structured['fts_funding.csv']
      .filter((r) => r.value.iso3 === g.iso3)
      .map((r) => r.value)
    const funded = fts.filter((r) => r.usd_paid_committed > 0)
    const x = funded.map((r) => percentOfGni(r.usd_paid_committed, g.gni ?? 1))
    return {
      ...g,
      funded_windows: funded.length,
      x_max: x.length > 0 ? Math.max(...x) : null,
      // The GNI change that would move the largest x across the nearest tier boundary.
      nearest_boundary:
        x.length > 0
          ? bounds
              .map((b) => ({ boundary: b, gni_factor: r4(Math.max(...x) / b) }))
              .sort(
                (a, b) =>
                  Math.abs(Math.log(a.gni_factor ?? 1)) - Math.abs(Math.log(b.gni_factor ?? 1)),
              )[0]
          : null,
      d1_events: generated.filter((e) => e.country === g.iso3 && e.indicator === 'D1').length,
    }
  })

const trade = ten.map((iso3) => ({
  iso3,
  A2: computedRuns(generated, iso3, 'A2'),
  C3: computedRuns(generated, iso3, 'C3'),
}))

async function ftsPrewar() {
  const cited = ds.structured['fts_funding.csv'][0]?.value.source.split(';') ?? []
  const fetchVerified = async (id: string) => {
    const s = sourceOf.get(id)
    if (s === undefined || s.wayback_url === null || s.sha256 === null)
      throw new Error(`${id}: no archived copy`)
    const res = await fetch(s.wayback_url)
    const body = new Uint8Array(await res.arrayBuffer())
    const sha = createHash('sha256').update(body).digest('hex')
    if (res.status !== 200 || sha !== s.sha256)
      throw new Error(`${id}: HTTP ${res.status}, sha256 ${sha} ≠ ${s.sha256}`)
    process.stderr.write(`  ${id}: ${body.length} bytes, sha256 checked\n`)
    return JSON.parse(new TextDecoder().decode(body)) as unknown
  }
  const pages: FtsPage[] = []
  let locations: Map<string, string> | null = null
  for (const id of cited) {
    const mm = /_fts_plan-(\d+)-p(\d+)$/.exec(id)
    if (mm) pages.push(parseFlowPage(await fetchVerified(id), mm[1] ?? '', Number(mm[2]), id))
    else if (id.endsWith('_fts_locations')) locations = parseLocations(await fetchVerified(id))
  }
  const orgId = ds.structured['fts_funding.csv']
    .flatMap((r) => r.value.source.split(';'))
    .find((s) => s.endsWith('_fts_organizations'))
  if (locations === null || orgId === undefined) throw new Error('location or organisation list')
  const orgs = parseOrganizations(await fetchVerified(orgId))
  const overrides = verifyOverrides(FTS_ATTRIBUTION_OVERRIDES, orgs, locations).applied
  const months = ds.structured['fts_funding.csv'].map((r) => r.value.window_end.slice(0, 7))
  const last = months.sort().at(-1) ?? lastMonth
  const [y, mo] = last.split('-').map(Number) as [number, number]
  const lastValueMonth = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, '0')}`
  const input = {
    locations,
    locationSourceId: '',
    universe: FTS_DONOR_UNIVERSE,
    plans: ['1186', '1156', '1273', '1510'],
    lastMonth: lastValueMonth,
    retrievedAt: '',
    overrides,
    organizationSourceId: orgId,
  }
  const withAll = ftsTables({ ...input, pages })
  const cut = pages.map((p) => ({ ...p, flows: p.flows.filter((f) => f.date >= m.windowStart) }))
  const without = ftsTables({ ...input, pages: cut })
  // The rebuilt windows must equal the committed table.
  const committed = new Map(
    ds.structured['fts_funding.csv'].map((r) => [
      `${r.value.iso3} ${r.value.window_end}`,
      r.value.usd_paid_committed,
    ]),
  )
  const mismatches = withAll.windows.filter(
    (w) => committed.get(`${w.iso3} ${w.window_end}`) !== w.usd_paid_committed,
  ).length
  const rows = (ws: typeof without.windows) =>
    ds.structured['fts_funding.csv'].map((r) => {
      const w = ws.find((x) => x.iso3 === r.value.iso3 && x.window_end === r.value.window_end)
      return {
        ...r,
        value: { ...r.value, usd_paid_committed: w?.usd_paid_committed ?? 0 },
      } as Located<StructuredRow<'fts_funding.csv'>>
    })
  const d1Without = generateD1(ctx, rows(without.windows), gniRows).events
  const key = (e: Event) => `${e.country} ${e.date}`
  const withMap = new Map(generated.filter((e) => e.indicator === 'D1').map((e) => [key(e), e]))
  const withoutMap = new Map(d1Without.map((e) => [key(e), e]))
  const diffs: { iso3: string; month: string; with: number; without: number }[] = []
  for (const k of new Set([...withMap.keys(), ...withoutMap.keys()])) {
    const a = withMap.get(k)?.points ?? 0
    const b = withoutMap.get(k)?.points ?? 0
    if (a !== b) {
      const [iso3, d] = k.split(' ') as [string, string]
      diffs.push({ iso3, month: d.slice(0, 7), with: a, without: b })
    }
  }
  diffs.sort((a, b) => (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : a.month < b.month ? -1 : 1))
  return {
    d1: d1Without,
    report: {
      pages: pages.length,
      rebuilt_window_mismatches: mismatches,
      prewar_flows: withAll.preWindowFlows.length,
      prewar_usd: Math.round(withAll.preWindowFlows.reduce((s, f) => s + f.amount, 0)),
      prewar_by_donor: Object.fromEntries(
        [...new Set(withAll.preWindowFlows.map((f) => f.iso3))]
          .sort()
          .map((iso3) => [
            iso3,
            Math.round(
              withAll.preWindowFlows
                .filter((f) => f.iso3 === iso3)
                .reduce((s, f) => s + f.amount, 0),
            ),
          ]),
      ),
      d1_month_differences: diffs,
      countries_with_differences: [...new Set(diffs.map((d) => d.iso3))],
      last_month_with_difference:
        diffs
          .map((d) => d.month)
          .sort()
          .at(-1) ?? null,
    },
  }
}

const report = {
  date,
  methodology: m.version,
  preview: { statuses, events: previewed.length },
  n: base.scores.length,
  ranking_ten: ten
    .map((iso3) => position.get(iso3))
    .filter((e) => e !== undefined)
    .sort((a, b) => a.position - b.position)
    .map((e) => ({
      iso3: e.iso3,
      score: e.score,
      display: e.display,
      band: e.band,
      position: e.position,
    })),
  bands_all: Object.fromEntries(
    m.bands.map((b) => [b.id, base.scores.filter((s) => s.band === b.id).length]),
  ),
  passivity_all: base.scores.filter((s) => s.passivity).length,
  ten: ten.map(detail),
  baseline_history: QUARTERS.map((d) => ({
    date: d,
    ten: tenOf(baselineAt.get(d)?.scores ?? []),
    bands: Object.fromEntries(
      m.bands.map((b) => [
        b.id,
        (baselineAt.get(d)?.scores ?? []).filter((s) => s.band === b.id).length,
      ]),
    ),
  })),
  sensitivity: suite.tables.flatMap((t) =>
    t.variants.map((v) => ({
      id: v.id,
      spearman: r4(v.spearman),
      changed_display: v.changedDisplay,
      ten: ten.map((iso3) => {
        const e = v.ranking.find((x) => x.iso3 === iso3)
        return { iso3, display: e?.display, band: e?.band, position: e?.position }
      }),
    })),
  ),
  b21_raised: b21.raised,
  proposals,
  yes_only: yesOnlyReport,
  preexisting_b8: pre
    .map((e) => e.country)
    .filter((iso3) => ten.includes(iso3))
    .map((iso3) => ({
      iso3,
      since: scored.find((c) => c.iso3 === iso3)?.recognises_palestine.since,
    })),
  preexisting_b8_count: pre.length,
  d1: d1Report,
  gni_old: oldGni,
  trade,
  fts_prewar: fts,
  bands: m.bands.map((b) => ({
    id: b.id,
    min: b.min,
    max: b.max,
    name: bandFor(m, b.min).name.en,
  })),
}

const text = `${JSON.stringify(report, (_k, v) => (typeof v === 'number' && !Number.isInteger(v) ? (Number.isFinite(v) ? r4(v) : String(v)) : v), 2)}\n`
if (out === undefined) process.stdout.write(text)
else {
  writeFileSync(resolve(process.env.INIT_CWD ?? process.cwd(), out), text)
  process.stderr.write(`calibrate: wrote ${out} (${r1(text.length / 1024)} KB)\n`)
}
