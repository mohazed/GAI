import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ApiAssessmentRow,
  ApiBuildNote,
  type Assessment,
  type AssessmentEntry,
  type Dataset,
  type Event,
  type Formula,
  loadMethodology,
  type Methodology,
  type QualifyingVote,
  STRUCTURED_TABLE_NAMES,
  type StructuredRow,
  type StructuredTableName,
} from '@gai/schema'
import { coverage, type ScoringCountry } from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import { generateAll, generateContext } from '../generate/index.js'
import { scoringMethodology } from '../methodology.js'
import {
  assessmentRows,
  b1MissingFromVotes,
  type DeriveInput,
  deriveGeneratedStatuses,
  disagreements,
  effectiveAssessment,
  GENERATED_INDICATORS,
} from './assessments.js'
import type { DerivedStatus } from './types.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const M = loadMethodology(REPO_ROOT)
const SCORING = scoringMethodology(M)

function thresholds(m: Methodology) {
  if (m.thresholds === null) throw new Error('thresholds.yaml did not load')
  return m.thresholds
}

// The real thresholds the rules read (methodology/v1.0.0/thresholds.yaml).
const A1_FORMULA = thresholds(M).value.formulas.a1
const A4_FORMULA = thresholds(M).value.formulas.a4
const FIRST_RELEASE = A1_FORMULA?.kind === 'sqrt_share' ? A1_FORMULA.no_data_before : ''

// ---------------------------------------------------------------------------------------------
// Synthetic rows. XXA, XXB (elected), XXP and XXQ (permanent) are ISO 3166 user-assigned codes,
// never real states; every value below is made up for the test.

const SRC = 'src_20260101_test_synthetic-table'
const RETRIEVED = '2026-01-01T00:00:00Z'

type Rows = { [K in StructuredTableName]?: StructuredRow<K>[] }

function tables(rows: Rows = {}): Dataset['structured'] {
  const out: Record<string, unknown[]> = {}
  for (const t of STRUCTURED_TABLE_NAMES) {
    out[t] = (rows[t] ?? []).map((value, i) => ({
      value,
      file: `data/structured/${t}`,
      line: i + 2,
    }))
  }
  return out as Dataset['structured']
}

const yearOf = (date: string) => Number(date.slice(0, 4))

const delivery = (
  release: string,
  iso3: string,
  tiv: number,
  total = 100,
): StructuredRow<'sipri_deliveries.csv'> => ({
  release_date: release,
  data_year: yearOf(release) - 1,
  supplier_iso3: iso3,
  tiv_to_israel: tiv,
  tiv_total_to_israel: total,
  source: SRC,
})

const order = (release: string, iso3: string, tiv: number): StructuredRow<'sipri_orders.csv'> => ({
  release_date: release,
  data_year: yearOf(release) - 1,
  buyer_iso3: iso3,
  tiv_new_orders_from_israel: tiv,
  source: SRC,
})

const a2 = (
  iso3: string,
  year: number,
  release: string,
  hs: string,
  usd: number,
  reporter: 'self' | 'mirror' = 'self',
): StructuredRow<'comtrade_a2.csv'> => ({
  iso3,
  window_start: `${year}-01-01`,
  window_end: `${year}-12-31`,
  release_date: release,
  hs,
  usd,
  reporter,
  retrieved_at: RETRIEVED,
  source: SRC,
})

const c3 = (
  iso3: string,
  year: number,
  release: string,
  total: number,
  base: number,
): StructuredRow<'comtrade_c3.csv'> => ({
  iso3,
  window_start: `${year}-01-01`,
  window_end: `${year}-12-31`,
  release_date: release,
  usd_total: total,
  usd_2022: base,
  reporter: 'self',
  retrieved_at: RETRIEVED,
  source: SRC,
})

const fts = (
  iso3: string,
  windowStart: string,
  windowEnd: string,
  usd: number,
): StructuredRow<'fts_funding.csv'> => ({
  iso3,
  window_start: windowStart,
  window_end: windowEnd,
  usd_paid_committed: usd,
  plan_ids: '1',
  retrieved_at: RETRIEVED,
  source: SRC,
})

const gni = (iso3: string, year: number, usd: number): StructuredRow<'gni.csv'> => ({
  iso3,
  year,
  gni_atlas_usd: usd,
  source: SRC,
})

const vote = (
  resolution: string,
  date: string,
  iso3: string,
  v: 'Y' | 'N' | 'A' | 'X',
): StructuredRow<'unga_votes.csv'> => ({ resolution, date, iso3, vote: v, source: SRC })

const veto = (
  date: string,
  draft: string,
  iso3: string,
  ceasefire: boolean,
): StructuredRow<'unsc_vetoes.csv'> => ({ date, draft, vetoed_by: iso3, ceasefire, source: SRC })

/** Derived statuses of `iso3` (default XXA) with the generated events of the tables. */
function derive(
  over: Partial<DeriveInput> & { structured: Dataset['structured'] },
): Record<string, DerivedStatus | null> {
  const methodology = over.methodology ?? M
  const iso3 = over.iso3 ?? 'XXA'
  const generated =
    over.generated ??
    generateAll(generateContext(methodology), over.structured).events.filter(
      (e) => e.country === iso3,
    )
  return deriveGeneratedStatuses({
    date: '2026-09-27',
    unscMember: false,
    permanentMember: false,
    ...over,
    iso3,
    methodology,
    generated,
  })
}

const d = (status: DerivedStatus['status'], reason: string): DerivedStatus => ({ status, reason })
const HAS = d('has-events', 'generated-event')

describe('GENERATED_INDICATORS', () => {
  it('lists the indicators the methodology generates from data/structured (D-08)', () => {
    expect([...GENERATED_INDICATORS]).toEqual(['A1', 'A2', 'A4', 'B1', 'B2', 'B8', 'C3', 'D1'])
    const fromTables = M.indicators
      .filter(
        (i) => i.authoring === 'generated' && i.generated_from?.startsWith('data/structured/'),
      )
      .map((i) => i.id)
    expect([...fromTables].sort()).toEqual([...GENERATED_INDICATORS])
  })

  it('returns one entry per generated indicator', () => {
    expect(Object.keys(derive({ structured: tables() })).sort()).toEqual([...GENERATED_INDICATORS])
  })
})

describe('A1 (SIPRI deliveries)', () => {
  it('reads no_data_before from the real thresholds', () => {
    expect(FIRST_RELEASE).toBe('2024-03-11')
  })

  it('is no-data before the first post-war release, with or without rows', () => {
    expect(derive({ date: '2024-03-10', structured: tables() }).A1).toEqual(
      d('no-data', 'before-first-release'),
    )
    const rows = tables({ 'sipri_deliveries.csv': [delivery('2024-03-11', 'XXA', 30)] })
    expect(derive({ date: '2024-03-10', structured: rows }).A1).toEqual(
      d('no-data', 'before-first-release'),
    )
  })

  it('is has-events from the day of the release that gives an event', () => {
    const rows = tables({ 'sipri_deliveries.csv': [delivery('2024-03-11', 'XXA', 30)] })
    // s = 30 / 100; −40 × √0.3 = −21.9 (formula a1).
    const events = generateAll(generateContext(M), rows).events
    expect(events.map((e) => [e.id, e.points])).toEqual([['evt_2024_03_11_XXA_A1_tiv-2023', -21.9]])
    expect(derive({ date: '2024-03-11', structured: rows }).A1).toEqual(HAS)
    expect(derive({ date: '2026-09-27', structured: rows }).A1).toEqual(HAS)
  })

  it('is null when sipri_deliveries.csv has no rows (not imported: the hand status stands)', () => {
    expect(derive({ date: '2024-03-11', structured: tables() }).A1).toBeNull()
    expect(derive({ structured: tables() }).A1).toBeNull()
    // An orders release says nothing about deliveries.
    const orders = tables({ 'sipri_orders.csv': [order('2025-03-10', 'XXB', 20)] })
    expect(derive({ structured: orders }).A1).toBeNull()
  })

  const NONE = d('none-found', 'release-without-deliveries')

  it('is none-found for every country without an event once a release is in force (s = 0)', () => {
    const rows = tables({ 'sipri_deliveries.csv': [delivery('2024-03-11', 'XXB', 30)] })
    // XXB: s = 30 / 100, an event; XXA is not listed by SIPRI: s = 0 / 100 = 0.
    expect(derive({ iso3: 'XXB', date: '2024-03-11', structured: rows }).A1).toEqual(HAS)
    expect(derive({ date: '2024-03-11', structured: rows }).A1).toEqual(NONE)
    expect(derive({ structured: rows }).A1).toEqual(NONE)
    // A row of XXA with zero TIV (the importer writes none, a hand edit could) gives the same.
    const zero = tables({ 'sipri_deliveries.csv': [delivery('2024-03-11', 'XXA', 0)] })
    expect(generateAll(generateContext(M), zero).events).toEqual([])
    expect(derive({ date: '2024-03-11', structured: zero }).A1).toEqual(NONE)
  })

  it('treats a supplier whose only rows at a release are earlier data years as unlisted', () => {
    // Release 2026-03-09 (data year 2025) exported over several years: XXA delivered in 2019
    // only, XXB in 2025; XXC is not listed.
    const historic = {
      ...delivery('2026-03-09', 'XXA', 12, 400),
      data_year: 2019,
    }
    const rows = tables({
      'sipri_deliveries.csv': [historic, delivery('2026-03-09', 'XXB', 500, 500)],
    })
    const events = generateAll(generateContext(M), rows).events
    expect(events.map((e) => e.id)).toEqual(['evt_2026_03_09_XXB_A1_tiv-2025'])
    expect(derive({ structured: rows }).A1).toEqual(NONE)
    expect(derive({ iso3: 'XXC', structured: rows }).A1).toEqual(NONE)
    expect(derive({ iso3: 'XXB', structured: rows }).A1).toEqual(HAS)
    // A release with earlier data years only is not in force: generateA1 reads none of its rows.
    const only = tables({ 'sipri_deliveries.csv': [historic] })
    expect(derive({ structured: only }).A1).toEqual(d('no-data', 'no-release'))
  })

  it('reads only rows of the data year (year of release − 1), not of the release year', () => {
    // Release 2025-03-10 carries data through 2024; a row dated 2025 is not the measure.
    const rows = tables({
      'sipri_deliveries.csv': [{ ...delivery('2025-03-10', 'XXB', 30), data_year: 2025 }],
    })
    expect(generateAll(generateContext(M), rows).events).toEqual([])
    expect(derive({ structured: rows }).A1).toEqual(d('no-data', 'no-release'))
    expect(derive({ iso3: 'XXB', structured: rows }).A1).toEqual(d('no-data', 'no-release'))
  })

  it('is no-data without a release in force in [no_data_before, date]', () => {
    const later = tables({ 'sipri_deliveries.csv': [delivery('2025-03-10', 'XXB', 30)] })
    expect(derive({ date: '2025-03-09', structured: later }).A1).toEqual(d('no-data', 'no-release'))
    expect(derive({ date: '2025-03-10', structured: later }).A1).toEqual(NONE)
    // A pre-war release (data year 2022) is not used by the generator and covers nothing.
    const prewar = tables({ 'sipri_deliveries.csv': [delivery('2023-03-13', 'XXA', 5)] })
    expect(generateAll(generateContext(M), prewar).events).toEqual([])
    expect(derive({ date: '2025-01-01', structured: prewar }).A1).toEqual(
      d('no-data', 'no-release'),
    )
  })

  it('is no-data when the country delivered but its share cannot be computed', () => {
    const rows = tables({
      'sipri_deliveries.csv': [
        delivery('2025-03-10', 'XXA', 30, 20), // TIV 30 above the total 20
        delivery('2025-03-10', 'XXB', 5, 0), // total 0
        delivery('2025-03-10', 'XXC', 0, 0), // no deliveries: s = 0
      ],
    })
    const g = generateAll(generateContext(M), rows)
    expect(g.events).toEqual([])
    expect(g.notes).toEqual([
      'sipri_deliveries.csv row 2: TIV 30 of a total 20; no event',
      'sipri_deliveries.csv row 3: TIV 5 of a total 0; no event',
    ])
    expect(derive({ structured: rows }).A1).toEqual(d('no-data', 'row-not-computable'))
    expect(derive({ iso3: 'XXB', structured: rows }).A1).toEqual(d('no-data', 'row-not-computable'))
    expect(derive({ iso3: 'XXC', structured: rows }).A1).toEqual(NONE)
    expect(derive({ iso3: 'XXD', structured: rows }).A1).toEqual(NONE)
  })
})

describe('A2 (Comtrade military exports)', () => {
  it('is none-found when the only rows are HS 8526/8802 not confirmed as military', () => {
    const rows = tables({
      'comtrade_a2.csv': [
        a2('XXA', 2024, '2025-06-30', '8526', 5_000_000),
        a2('XXA', 2024, '2025-06-30', '8802', 70_000_000, 'mirror'),
      ],
    })
    expect(generateAll(generateContext(M), rows).events).toEqual([])
    expect(derive({ date: '2025-07-01', structured: rows }).A2).toEqual(
      d('none-found', 'row-without-counted-exports'),
    )
  })

  it('is has-events when a counted code gives an event, even at 0 points', () => {
    const rows = tables({ 'comtrade_a2.csv': [a2('XXA', 2024, '2025-06-30', '93', 50_000)] })
    // V = USD 50,000 < 100,000: tier 0, and the event is still written (data exists).
    expect(generateAll(generateContext(M), rows).events.map((e) => e.points)).toEqual([0])
    expect(derive({ date: '2025-06-30', structured: rows }).A2).toEqual(HAS)
  })

  it('is null when comtrade_a2.csv has no rows (not fetched: the hand status stands)', () => {
    expect(derive({ structured: tables() }).A2).toBeNull()
  })

  it('is no-data without a row of the country released on or before the date', () => {
    const other = tables({ 'comtrade_a2.csv': [a2('XXB', 2024, '2025-06-30', '8526', 1)] })
    expect(derive({ structured: other }).A2).toEqual(d('no-data', 'no-row'))
    const later = tables({ 'comtrade_a2.csv': [a2('XXA', 2024, '2025-06-30', '8526', 1)] })
    expect(derive({ date: '2025-06-29', structured: later }).A2).toEqual(d('no-data', 'no-row'))
  })
})

describe('C3 (Comtrade total trade)', () => {
  it('is has-events when the row gives an event', () => {
    const rows = tables({
      'comtrade_c3.csv': [c3('XXA', 2024, '2025-05-01', 2_000_000_000, 2_000_000_000)],
    })
    // r = 1 ≥ 0.9, T ≥ USD 1 billion: −5 (formula c3).
    expect(generateAll(generateContext(M), rows).events.map((e) => e.points)).toEqual([-5])
    expect(derive({ date: '2025-05-01', structured: rows }).C3).toEqual(HAS)
  })

  it('is none-found when a row of the country gives no event', () => {
    const rows = tables({ 'comtrade_c3.csv': [c3('XXA', 2024, '2025-05-01', 10, 10)] })
    expect(derive({ date: '2025-05-01', structured: rows, generated: [] }).C3).toEqual(
      d('none-found', 'row-without-event'),
    )
  })

  it('is null when comtrade_c3.csv has no rows (not fetched: the hand status stands)', () => {
    expect(derive({ structured: tables() }).C3).toBeNull()
  })

  it('is no-data without a row of the country released on or before the date', () => {
    const rows = tables({ 'comtrade_c3.csv': [c3('XXA', 2024, '2025-05-01', 10, 10)] })
    expect(derive({ date: '2025-04-30', structured: rows }).C3).toEqual(d('no-data', 'no-row'))
    expect(derive({ iso3: 'XXB', structured: rows }).C3).toEqual(d('no-data', 'no-row'))
  })
})

describe('A4 (SIPRI orders)', () => {
  it('reads orders_signed_from from the real thresholds', () => {
    expect(A4_FORMULA?.kind === 'tiers' && A4_FORMULA.parameters?.orders_signed_from).toBe(
      '2023-10-07',
    )
  })

  it('is null when sipri_orders.csv has no rows, even with a deliveries release in force', () => {
    expect(derive({ structured: tables() }).A4).toBeNull()
    // Orders not imported (`pnpm import:sipri` without --orders): no statement on A4.
    const deliveries = tables({ 'sipri_deliveries.csv': [delivery('2025-03-10', 'XXB', 30)] })
    expect(derive({ date: '2025-03-10', structured: deliveries }).A4).toBeNull()
    expect(derive({ structured: deliveries }).A4).toBeNull()
  })

  it('is no-data with only the 2024 orders release: data year 2023 starts before 2023-10-07', () => {
    const rows = tables({ 'sipri_orders.csv': [order('2024-03-11', 'XXA', 50)] })
    const g = generateAll(generateContext(M), rows)
    expect(g.events.filter((e) => e.indicator === 'A4')).toEqual([])
    expect(g.notes.some((n) => n.includes('XXA orders of 2023 not scored'))).toBe(true)
    expect(derive({ date: '2025-01-01', structured: rows }).A4).toEqual(d('no-data', 'no-release'))
    expect(derive({ iso3: 'XXB', structured: rows }).A4).toEqual(d('no-data', 'no-release'))
  })

  it('is none-found once the 2025 release (data year 2024) is in force without an order', () => {
    const rows = tables({ 'sipri_orders.csv': [order('2025-03-10', 'XXB', 20)] })
    expect(derive({ date: '2025-03-09', structured: rows }).A4).toEqual(d('no-data', 'no-release'))
    expect(derive({ date: '2025-03-10', structured: rows }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
    // XXB's own order (20 TIV ≥ 10: −5) makes its A4 has-events.
    expect(
      generateAll(generateContext(M), rows).events.map((e) => [e.country, e.indicator, e.points]),
    ).toEqual([['XXB', 'A4', -5]])
    expect(derive({ iso3: 'XXB', date: '2025-03-10', structured: rows }).A4).toEqual(HAS)
  })

  it('is no-data when the country orders 0 TIV in the latest covering release (B-488)', () => {
    // SIPRI writes 0 for the TIV of an order below 0.5 TIV or of unknown size: "TIV > 0" of
    // formula a4 cannot be decided, so neither an event nor none-found.
    const rows = tables({
      'sipri_orders.csv': [order('2026-03-09', 'XXB', 0), order('2026-03-09', 'XXA', 0)],
    })
    expect(
      generateAll(generateContext(M), rows).events.filter((e) => e.indicator === 'A4'),
    ).toEqual([])
    expect(derive({ iso3: 'XXB', date: '2026-03-09', structured: rows }).A4).toEqual(
      d('no-data', 'orders-without-tiv'),
    )
    // A country without a row is none-found, as before.
    expect(derive({ iso3: 'XXC', date: '2026-03-09', structured: rows }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
    // Only the data year of the latest covering release counts: a 0-TIV row of an earlier
    // release, or of an earlier year in the same release, does not.
    const later = tables({
      'sipri_orders.csv': [
        order('2025-03-10', 'XXB', 0),
        order('2026-03-09', 'XXA', 5),
        { ...order('2026-03-09', 'XXB', 0), data_year: 2024 },
      ],
    })
    expect(derive({ iso3: 'XXB', date: '2025-06-01', structured: later }).A4).toEqual(
      d('no-data', 'orders-without-tiv'),
    )
    expect(derive({ iso3: 'XXB', date: '2026-06-01', structured: later }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
  })

  it('reads the releases of sipri_orders.csv only', () => {
    // The 2025 release is imported for deliveries only; the orders table holds the 2024 one.
    const deliveriesOnly = tables({
      'sipri_deliveries.csv': [delivery('2025-03-10', 'XXB', 30)],
      'sipri_orders.csv': [order('2024-03-11', 'XXB', 50)],
    })
    expect(derive({ date: '2025-06-01', structured: deliveriesOnly }).A4).toEqual(
      d('no-data', 'no-release'),
    )
    // Both tables imported for the 2025 release.
    const both = tables({
      'sipri_deliveries.csv': [delivery('2025-03-10', 'XXB', 30)],
      'sipri_orders.csv': [order('2025-03-10', 'XXB', 20)],
    })
    expect(derive({ date: '2025-06-01', structured: both }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
    expect(derive({ date: '2025-06-01', structured: both }).A1).toEqual(
      d('none-found', 'release-without-deliveries'),
    )
  })

  function withA4(parameters: Record<string, unknown> | undefined): Methodology {
    const t = thresholds(M)
    const a4 = { ...(A4_FORMULA as Formula), parameters } as Formula
    return {
      ...M,
      thresholds: { ...t, value: { ...t.value, formulas: { ...t.value.formulas, a4 } } },
    }
  }

  it('follows orders_signed_from, and defaults to 2023-10-07 without it', () => {
    const rows = tables({
      'sipri_orders.csv': [order('2025-03-10', 'XXB', 1), order('2026-03-09', 'XXB', 1)],
    })
    const later = withA4({ orders_signed_from: '2025-01-01' })
    // 2025 release: data year 2024 starts 2024-01-01 < 2025-01-01, not covering.
    expect(derive({ date: '2025-12-31', structured: rows, methodology: later }).A4).toEqual(
      d('no-data', 'no-release'),
    )
    expect(derive({ date: '2026-03-09', structured: rows, methodology: later }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
    const none = withA4(undefined)
    expect(derive({ date: '2025-03-10', structured: rows, methodology: none }).A4).toEqual(
      d('none-found', 'release-without-orders'),
    )
  })

  it('ignores releases before no_data_before of formula a1', () => {
    // With orders counted from 2022, the 2023 release (data year 2022) would cover A4, but it
    // precedes the first post-war release.
    const rows = tables({ 'sipri_orders.csv': [order('2023-03-13', 'XXB', 1)] })
    const early = withA4({ orders_signed_from: '2022-01-01' })
    expect(derive({ date: '2024-01-01', structured: rows, methodology: early }).A4).toEqual(
      d('no-data', 'no-release'),
    )
  })
})

describe('D1 (FTS funding)', () => {
  it('is null when fts_funding.csv has no rows (the hand status stands)', () => {
    expect(derive({ structured: tables({ 'gni.csv': [gni('XXA', 2024, 10 ** 12)] }) }).D1).toBe(
      null,
    )
  })

  it('is no-data when funding above zero has no GNI to divide by', () => {
    const rows = tables({ 'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 1_000_000)] })
    const g = generateAll(generateContext(M), rows)
    expect(g.events).toEqual([])
    expect(g.notes).toContain('XXA: FTS funding but no GNI in gni.csv; D1 is no-data')
    expect(derive({ date: '2025-01-01', structured: rows }).D1).toEqual(d('no-data', 'no-gni'))
    const zeroGni = tables({
      'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 1_000_000)],
      'gni.csv': [gni('XXA', 2024, 0)],
    })
    expect(derive({ date: '2025-01-01', structured: zeroGni }).D1).toEqual(d('no-data', 'no-gni'))
  })

  it('reads GNI as the generator does (gniFor: latest year not after the window)', () => {
    // A usable 2023 GNI exists, but the generator divides by the 2024 row, which is zero.
    const rows = tables({
      'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 1_000_000)],
      'gni.csv': [gni('XXA', 2023, 10 ** 12), gni('XXA', 2024, 0)],
    })
    expect(generateAll(generateContext(M), rows).events).toEqual([])
    expect(derive({ date: '2025-01-01', structured: rows }).D1).toEqual(d('no-data', 'no-gni'))
  })

  it('ignores a funded window that has not ended before the date', () => {
    const rows = tables({ 'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 1_000_000)] })
    expect(derive({ date: '2024-12-31', structured: rows }).D1).toEqual(
      d('none-found', 'no-funding'),
    )
  })

  it('is none-found for zero rows only, or no row of the country (a real zero)', () => {
    const zero = tables({ 'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 0)] })
    expect(derive({ date: '2025-01-01', structured: zero }).D1).toEqual(
      d('none-found', 'no-funding'),
    )
    const other = tables({ 'fts_funding.csv': [fts('XXB', '2024-01-01', '2024-12-31', 5)] })
    expect(derive({ date: '2025-01-01', structured: other }).D1).toEqual(
      d('none-found', 'no-funding'),
    )
  })

  it('is has-events from the first day of the month the funded window applies to', () => {
    const rows = tables({
      'fts_funding.csv': [fts('XXA', '2024-01-01', '2024-12-31', 1_000_000)],
      'gni.csv': [gni('XXA', 2024, 10 ** 12)],
    })
    // x = 10⁶ / 10¹² = 0.0001 % of GNI: > 0, tier +1, valid 2025-01-01 to 2025-02-01.
    expect(
      generateAll(generateContext(M), rows).events.map((e) => [e.date, e.end, e.points]),
    ).toEqual([['2025-01-01', '2025-02-01', 1]])
    expect(derive({ date: '2024-12-31', structured: rows }).D1).toEqual(
      d('none-found', 'no-funding'),
    )
    expect(derive({ date: '2025-01-01', structured: rows }).D1).toEqual(HAS)
  })
})

describe('B2 (Security Council vetoes)', () => {
  const vetoes = tables({
    'unsc_vetoes.csv': [
      veto('2025-02-20', 'S/2099/1', 'XXP', false),
      veto('2025-03-20', 'S/2099/2', 'XXQ', true),
    ],
  })

  it('is null for a state not on the Council in the window (coverage: not-applicable)', () => {
    expect(derive({ structured: vetoes }).B2).toBeNull()
    expect(derive({ structured: tables() }).B2).toBeNull()
  })

  it('is none-found for an elected member, which has no veto', () => {
    expect(derive({ unscMember: true, structured: vetoes }).B2).toEqual(
      d('none-found', 'no-veto-power'),
    )
    expect(derive({ unscMember: true, structured: tables() }).B2).toEqual(
      d('none-found', 'no-veto-power'),
    )
  })

  it('is none-found for a permanent member without a ceasefire veto, once the table has rows', () => {
    const p = { unscMember: true, permanentMember: true }
    // XXP's veto of S/2099/1 is tracked, not scored (ceasefire: false).
    expect(derive({ ...p, iso3: 'XXP', structured: vetoes }).B2).toEqual(
      d('none-found', 'no-ceasefire-veto'),
    )
    expect(derive({ ...p, iso3: 'XXP', structured: tables() }).B2).toBeNull()
  })

  it('is has-events for a permanent member with a ceasefire veto on or before the date', () => {
    const p = { unscMember: true, permanentMember: true, iso3: 'XXQ' }
    expect(derive({ ...p, date: '2025-03-20', structured: vetoes }).B2).toEqual(HAS)
    expect(derive({ ...p, date: '2025-03-19', structured: vetoes }).B2).toEqual(
      d('none-found', 'no-ceasefire-veto'),
    )
  })
})

describe('B1 (General Assembly votes)', () => {
  // Synthetic qualifying votes, not real General Assembly records.
  const qualifying = (symbol: string, date: string): QualifyingVote => ({
    symbol,
    kind: symbol.startsWith('A/DEC/') ? 'decision' : 'resolution',
    date,
    title: { en: 'Synthetic test vote', fr: 'Vote de test synthétique' },
    subject: 'gaza',
    counts: { yes: 1, no: 0, abstain: 0 },
    source: 'src_20250612_test_synthetic-vote',
    quote: 'Synthetic quote for the test suite.',
    locator: 'paragraph 1',
    rationale: { en: 'Synthetic.', fr: 'Synthétique.' },
  })
  const votesFile = M.votes
  if (votesFile === null) throw new Error('votes.yaml did not load')
  const MV: Methodology = {
    ...M,
    votes: {
      ...votesFile,
      value: {
        ...votesFile.value,
        votes: [qualifying('A/DEC/TEST/2', '2026-01-15'), qualifying('A/RES/TEST/1', '2025-06-12')],
      },
    },
  }
  const rows = tables({
    'unga_votes.csv': [
      vote('A/RES/TEST/1', '2025-06-12', 'XXA', 'Y'),
      vote('A/RES/TEST/1', '2025-06-12', 'XXB', 'N'),
      vote('A/DEC/TEST/2', '2026-01-15', 'XXB', 'A'),
      vote('A/RES/TEST/99', '2025-09-01', 'XXB', 'Y'),
    ],
  })

  it('is has-events once the country has a generated vote event', () => {
    expect(derive({ methodology: MV, date: '2025-06-12', structured: rows }).B1).toEqual(HAS)
  })

  it('is null otherwise: the hand status decides', () => {
    expect(derive({ methodology: MV, date: '2025-06-11', structured: rows }).B1).toBeNull()
    expect(derive({ methodology: MV, iso3: 'XXC', structured: rows }).B1).toBeNull()
    expect(derive({ structured: tables() }).B1).toBeNull()
  })

  const input = (iso3: string, date: string): DeriveInput => ({
    iso3,
    date,
    structured: rows,
    generated: [],
    methodology: MV,
    unscMember: false,
    permanentMember: false,
  })

  it('lists the qualifying votes whose rows omit the country, by date', () => {
    // XXC has no row in either vote; the votes have rows (XXA, XXB).
    expect(b1MissingFromVotes(input('XXC', '2025-06-11'))).toEqual([])
    expect(b1MissingFromVotes(input('XXC', '2025-06-12'))).toEqual(['A/RES/TEST/1'])
    expect(b1MissingFromVotes(input('XXC', '2026-09-27'))).toEqual(['A/RES/TEST/1', 'A/DEC/TEST/2'])
    // XXA voted on A/RES/TEST/1; A/DEC/TEST/2 has rows (XXB) but none for XXA.
    expect(b1MissingFromVotes(input('XXA', '2026-09-27'))).toEqual(['A/DEC/TEST/2'])
    // XXB is in both; the rows of A/RES/TEST/99 (not qualifying) are ignored.
    expect(b1MissingFromVotes(input('XXB', '2026-09-27'))).toEqual([])
  })

  it('does not list a qualifying vote without any row', () => {
    const only = { ...input('XXC', '2026-09-27'), structured: tables() }
    expect(b1MissingFromVotes(only)).toEqual([])
  })

  it('lists nothing with the real votes.yaml, which is empty in 1.0.0-rc.1', () => {
    expect(b1MissingFromVotes({ ...input('XXC', '2026-09-27'), methodology: M })).toEqual([])
  })
})

describe('the has-events rule', () => {
  const g = generateAll(
    generateContext(M),
    tables({ 'comtrade_a2.csv': [a2('XXA', 2024, '2025-06-30', '93', 2_000_000)] }),
  ).events
  const base = {
    iso3: 'XXA',
    date: '2025-07-01',
    structured: tables(),
    methodology: M,
    unscMember: false,
    permanentMember: false,
  }

  it('reads published, gaza-scoped generated events of the country dated on or before the date', () => {
    expect(deriveGeneratedStatuses({ ...base, generated: g }).A2).toEqual(HAS)
    const [e] = g as [Event]
    const cases: Event[] = [
      { ...e, status: 'retracted' },
      { ...e, scope: ['region'] },
      { ...e, generated: false },
      { ...e, country: 'XXB' },
      { ...e, date: '2025-07-02' },
    ]
    // Without the rule, the table rule applies: comtrade_a2.csv is empty in `base`, so null.
    for (const c of cases) {
      expect(deriveGeneratedStatuses({ ...base, generated: [c] }).A2).toBeNull()
    }
  })
})

// ---------------------------------------------------------------------------------------------

const entry = (status: AssessmentEntry['status'], extra: Partial<AssessmentEntry> = {}) => ({
  status,
  ...extra,
})

function assessment(indicators: Record<string, AssessmentEntry>): Assessment {
  return { country: 'XXA', protocol_version: 1, last_full_check: null, indicators }
}

describe('effectiveAssessment', () => {
  it('lays the non-null derived statuses over the hand ones', () => {
    const hand = assessment({
      A1: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic.' }),
      A5: entry('none-found', { checked_at: '2025-01-01', queries: ['synthetic query'] }),
      B1: entry('has-events'),
      D1: entry('unchecked'),
    })
    const out = effectiveAssessment(hand, {
      A1: d('no-data', 'no-release'),
      B1: null,
      D1: d('none-found', 'no-funding'),
      C3: d('no-data', 'no-row'),
    })
    expect(out).toEqual({
      indicators: {
        A1: { status: 'no-data' },
        A5: { status: 'none-found' },
        B1: { status: 'has-events' },
        C3: { status: 'no-data' },
        D1: { status: 'none-found' },
      },
    })
  })

  it('works without a hand assessment', () => {
    expect(effectiveAssessment(null, { A2: d('no-data', 'no-row'), B2: null })).toEqual({
      indicators: { A2: { status: 'no-data' } },
    })
  })
})

describe('disagreements', () => {
  const derivedStatuses = {
    A1: d('no-data', 'no-release'),
    A2: d('none-found', 'row-without-counted-exports'),
    A4: d('no-data', 'no-release'),
    B1: null,
    B2: d('none-found', 'no-veto-power'),
    C3: HAS,
    D1: d('none-found', 'no-funding'),
  }

  it('reports hand statuses the tables contradict, except has-events from the tables', () => {
    const hand = assessment({
      A1: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic.' }), // reported
      A2: entry('unchecked'), // unchecked: not reported
      // A4 absent: not reported
      B1: entry('has-events'), // derived null: not reported
      B2: entry('not-applicable', { note: 'Synthetic.' }), // reported
      C3: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic.' }), // has-events wins
      D1: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic.' }), // agrees
    })
    const notes = disagreements('XXA', hand, derivedStatuses)
    expect(notes).toEqual([
      {
        kind: 'assessment-disagreement',
        country: 'XXA',
        indicator: 'A1',
        message:
          'data/assessments/XXA.yaml gives A1 none-found; the structured tables give no-data (no-release), which is used.',
      },
      {
        kind: 'assessment-disagreement',
        country: 'XXA',
        indicator: 'B2',
        message:
          'data/assessments/XXA.yaml gives B2 not-applicable; the structured tables give none-found (no-veto-power), which is used.',
      },
    ])
    for (const n of notes) expect(ApiBuildNote.parse(n)).toEqual(n)
  })

  it('reports a hand has-events the tables do not support', () => {
    const hand = assessment({ A2: entry('has-events') })
    expect(disagreements('XXA', hand, derivedStatuses).map((n) => n.indicator)).toEqual(['A2'])
  })

  it('reports nothing without a hand assessment', () => {
    expect(disagreements('XXA', null, derivedStatuses)).toEqual([])
  })
})

describe('assessmentRows', () => {
  const DATE = '2025-07-01'
  const country: ScoringCountry = {
    iso3: 'XXA',
    name: { en: 'Test country', fr: 'Pays de test' },
    excluded: false,
    memberships: { unsc: [] },
  }
  const structured = tables({
    'sipri_deliveries.csv': [delivery('2024-03-11', 'XXB', 9)],
    'sipri_orders.csv': [order('2024-03-11', 'XXB', 5)],
    'comtrade_a2.csv': [a2('XXA', 2024, '2025-06-30', '93', 2_000_000)],
    'comtrade_c3.csv': [c3('XXB', 2024, '2025-05-01', 10, 10)],
    'fts_funding.csv': [fts('XXA', '2024-06-01', '2025-05-31', 0)],
  })
  const generated = generateAll(generateContext(M), structured).events.filter(
    (e) => e.country === 'XXA',
  )
  const handAssessment = assessment({
    A1: entry('unchecked'),
    A2: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic note.' }),
    A5: entry('none-found', { checked_at: '2025-02-01', queries: ['synthetic query a', 'b'] }),
    A6: entry('has-events'),
    A7: entry('has-events'),
    B2: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic note.' }),
    B9: entry('none-found', { checked_at: '2025-01-01', note: 'Synthetic note.' }),
    C3: entry('unchecked'),
    E1: entry('unchecked'),
    E2: entry('has-events'),
  })
  const synthetic = (id: string, indicator: string, type: Event['type'], date: string) =>
    ({
      id,
      revision: 1,
      country: 'XXA',
      indicator,
      type,
      date,
      ...(type === 'repeatable' ? {} : { end: null }),
      points: indicator === 'A6' ? 10 : 2,
      confidence: 'confirmed',
      scope: ['gaza'],
      summary: { en: 'Synthetic test event.', fr: 'Événement de test synthétique.' },
      evidence: [
        { source: SRC, quote: 'synthetic', quote_lang: 'en', locator: 'row 2 of test data' },
      ],
      status: 'published',
      review: { drafted_by: 'test', drafted_at: '2025-01-01' },
    }) as Event
  const events: Event[] = [
    synthetic('evt_2025_03_01_XXA_A6', 'A6', 'standing', '2025-03-01'),
    synthetic('evt_2025_04_01_XXA_E1', 'E1', 'repeatable', '2025-04-01'),
    // A draft does not make B9 has-events.
    { ...synthetic('evt_2025_05_01_XXA_B9', 'B9', 'repeatable', '2025-05-01'), status: 'draft' },
    // After the build date: E3 stays as the hand says.
    synthetic('evt_2025_08_01_XXA_E3', 'E3', 'repeatable', '2025-08-01'),
    ...generated,
  ]

  function build(date: string, handA: Assessment | null) {
    const derivedStatuses = deriveGeneratedStatuses({
      iso3: 'XXA',
      date,
      structured,
      generated,
      methodology: M,
      unscMember: false,
      permanentMember: false,
    })
    const cov = coverage(
      { country, assessment: effectiveAssessment(handA, derivedStatuses), events, date },
      SCORING,
    )
    return assessmentRows({
      methodology: M,
      scoring: SCORING,
      hand: handA,
      derived: derivedStatuses,
      coverage: cov,
      events,
      date,
    })
  }

  const rows = build(DATE, handAssessment)
  const row = (id: string) => {
    const r = rows.find((x) => x.indicator === id)
    if (r === undefined) throw new Error(`no row ${id}`)
    return r
  }

  it('writes one valid row per indicator of the methodology, in its order', () => {
    expect(rows.map((r) => r.indicator)).toEqual(M.indicators.map((i) => i.id))
    expect(rows).toHaveLength(34)
    for (const r of rows) expect(ApiAssessmentRow.parse(r)).toEqual(r)
    for (const r of rows) {
      const ind = M.indicatorById.get(r.indicator)
      expect(r.name).toEqual(ind?.name)
      expect(r.category).toBe(ind?.category)
      expect(r.scored).toBe(ind?.scored)
    }
  })

  it('shows the derived status of the generated indicators and why it replaced the hand one', () => {
    // A1: the 2024 release is in force and XXA delivered nothing in 2023 (s = 0).
    expect(row('A1')).toMatchObject({
      status: 'none-found',
      hand_status: 'unchecked',
      derived: { status: 'none-found', reason: 'release-without-deliveries' },
      override: {
        from: 'unchecked',
        to: 'none-found',
        reason: 'derived:release-without-deliveries',
      },
    })
    // A2: the generated event (V = USD 2 million: −8) overrides the hand none-found.
    expect(row('A2')).toMatchObject({
      status: 'has-events',
      hand_status: 'none-found',
      derived: { status: 'has-events', reason: 'generated-event' },
      override: { from: 'none-found', to: 'has-events', reason: 'derived:generated-event' },
      checked_at: '2025-01-01',
      note: 'Synthetic note.',
      queries: [],
    })
    // A4: only the 2024 orders release (data year 2023) is in force.
    expect(row('A4')).toMatchObject({
      status: 'no-data',
      hand_status: 'unchecked',
      derived: { status: 'no-data', reason: 'no-release' },
      override: { from: 'unchecked', to: 'no-data', reason: 'derived:no-release' },
      checked_at: null,
      note: null,
    })
    // B1: the tables say nothing; the absent hand entry is unchecked.
    expect(row('B1')).toMatchObject({
      status: 'unchecked',
      hand_status: 'unchecked',
      derived: null,
      override: null,
    })
    // C3: the table has a row of XXB only.
    expect(row('C3')).toMatchObject({
      status: 'no-data',
      derived: { status: 'no-data', reason: 'no-row' },
      override: { from: 'unchecked', to: 'no-data', reason: 'derived:no-row' },
    })
    // D1: a zero row is a real zero.
    expect(row('D1')).toMatchObject({
      status: 'none-found',
      hand_status: 'unchecked',
      derived: { status: 'none-found', reason: 'no-funding' },
      override: { from: 'unchecked', to: 'none-found', reason: 'derived:no-funding' },
    })
  })

  it('carries the coverage overrides (docs/02 §8)', () => {
    // B2: not on the Council, derived null; coverage sets not-applicable over the hand none-found.
    expect(row('B2')).toMatchObject({
      status: 'not-applicable',
      hand_status: 'none-found',
      derived: null,
      override: { from: 'none-found', to: 'not-applicable', reason: 'unsc-rule' },
    })
    // A7: a hand has-events without a published event is unchecked.
    expect(row('A7')).toMatchObject({
      status: 'unchecked',
      hand_status: 'has-events',
      override: { from: 'has-events', to: 'unchecked', reason: 'no-published-event' },
    })
    // A6: the hand has-events is backed by a published event.
    expect(row('A6')).toMatchObject({
      status: 'has-events',
      hand_status: 'has-events',
      override: null,
    })
    // B9: only a draft event; the hand none-found stands.
    expect(row('B9')).toMatchObject({
      status: 'none-found',
      hand_status: 'none-found',
      override: null,
    })
    expect(row('A5')).toMatchObject({
      status: 'none-found',
      override: null,
      checked_at: '2025-02-01',
      note: null,
      queries: ['synthetic query a', 'b'],
    })
  })

  it('applies the published-event rule to the unscored E indicators', () => {
    expect(row('E1')).toMatchObject({
      scored: false,
      status: 'has-events',
      hand_status: 'unchecked',
      derived: null,
      override: { from: 'unchecked', to: 'has-events', reason: 'published-event' },
    })
    expect(row('E2')).toMatchObject({
      status: 'unchecked',
      hand_status: 'has-events',
      override: { from: 'has-events', to: 'unchecked', reason: 'no-published-event' },
    })
    expect(row('E3')).toMatchObject({
      status: 'unchecked',
      hand_status: 'unchecked',
      override: null,
    })
  })

  it('is unchecked everywhere the tables and events say nothing, without a hand file', () => {
    const bare = build(DATE, null)
    expect(bare.find((r) => r.indicator === 'B3')).toMatchObject({
      status: 'unchecked',
      hand_status: 'unchecked',
      override: null,
      checked_at: null,
      note: null,
      queries: [],
    })
    expect(bare.find((r) => r.indicator === 'A6')).toMatchObject({
      status: 'has-events',
      hand_status: 'unchecked',
      override: { from: 'unchecked', to: 'has-events', reason: 'published-event' },
    })
  })

  it('keeps the hand status of the indicators whose tables have no rows', () => {
    const derivedStatuses = deriveGeneratedStatuses({
      iso3: 'XXA',
      date: DATE,
      structured: tables(),
      generated: [],
      methodology: M,
      unscMember: false,
      permanentMember: false,
    })
    for (const id of ['A1', 'A2', 'A4', 'C3', 'D1'] as const) {
      expect(derivedStatuses[id], id).toBeNull()
    }
    const cov = coverage(
      {
        country,
        assessment: effectiveAssessment(handAssessment, derivedStatuses),
        events: [],
        date: DATE,
      },
      SCORING,
    )
    const out = assessmentRows({
      methodology: M,
      scoring: SCORING,
      hand: handAssessment,
      derived: derivedStatuses,
      coverage: cov,
      events: [],
      date: DATE,
    })
    expect(out.find((r) => r.indicator === 'A2')).toMatchObject({
      status: 'none-found',
      hand_status: 'none-found',
      derived: null,
      override: null,
      checked_at: '2025-01-01',
    })
    for (const id of ['A1', 'A4', 'C3', 'D1']) {
      expect(out.find((r) => r.indicator === id)).toMatchObject({
        status: 'unchecked',
        hand_status: 'unchecked',
        derived: null,
        override: null,
      })
    }
  })

  it('records the derived no-data of A1 before the first post-war release', () => {
    const early = build('2024-03-01', handAssessment)
    expect(early.find((r) => r.indicator === 'A1')).toMatchObject({
      status: 'no-data',
      hand_status: 'unchecked',
      derived: { status: 'no-data', reason: 'before-first-release' },
      override: { from: 'unchecked', to: 'no-data', reason: 'derived:before-first-release' },
    })
  })

  it('refuses a coverage without the status of a scored indicator', () => {
    const derivedStatuses = { A1: null }
    const cov = coverage({ country, assessment: null, events: [], date: DATE }, SCORING)
    const statuses = { ...cov.statuses }
    delete statuses.A3
    expect(() =>
      assessmentRows({
        methodology: M,
        scoring: SCORING,
        hand: null,
        derived: derivedStatuses,
        coverage: { ...cov, statuses },
        events: [],
        date: DATE,
      }),
    ).toThrow(/no status for scored indicator A3/)
  })
})
