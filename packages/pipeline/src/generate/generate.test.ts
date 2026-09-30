/**
 * Generators with hand-computed expectations (P-04 acceptance). The rows are test data built for
 * the arithmetic, not real records; every expected number is worked out in the comment beside it.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compileBannedWords,
  EventIdLike,
  Event as EventSchema,
  type Located,
  lintSummary,
  loadMethodology,
  type QualifyingVote,
  type StructuredRow,
  type StructuredTableName,
} from '@gai/schema'
import { describe, expect, it } from 'vitest'
import {
  generateA1,
  generateA2,
  generateA4,
  generateAll,
  generateB1,
  generateB2,
  generateC3,
  generateContext,
  generateD1,
  gniFor,
  money,
  percent,
  usdExact,
  voteSlug,
} from './index.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const METHODOLOGY = loadMethodology(REPO_ROOT)
const MATCHER = compileBannedWords(METHODOLOGY.bannedWords?.entries ?? [])

const DS = 'src_20260927_test-dataset_rows'
const PRESS = 'src_20240101_un-press_test-vote'

const VOTE: QualifyingVote = {
  symbol: 'A/RES/TEST/1',
  kind: 'resolution',
  date: '2024-01-01',
  title: { en: 'Test vote', fr: 'Vote de test' },
  subject: 'gaza',
  counts: { yes: 1, no: 1, abstain: 1 },
  source: PRESS,
  quote: 'adopted by a recorded vote of 1 in favour to 1 against',
  locator: 'paragraph 1',
  rationale: { en: 'Test.', fr: 'Test.' },
}

function ctx(votes: QualifyingVote[] = [VOTE]) {
  const c = generateContext(METHODOLOGY)
  return { ...c, votes: { ...c.votes, votes } }
}

/** Rows at file lines 2, 3, … as the loader numbers them. */
function rows<T extends StructuredTableName>(
  _table: T,
  values: Omit<StructuredRow<T>, 'source'>[],
): Located<StructuredRow<T>>[] {
  return values.map((v, i) => ({
    value: { ...v, source: DS } as StructuredRow<T>,
    file: `data/structured/${_table}`,
    line: i + 2,
  }))
}

const byId = <E extends { id: string }>(events: E[]) => new Map(events.map((e) => [e.id, e]))

// ---------------------------------------------------------------------------------------------

describe('B1 UNGA votes', () => {
  const unga = rows('unga_votes.csv', [
    { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'DEU', vote: 'Y' },
    { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'FRA', vote: 'A' },
    { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'USA', vote: 'N' },
    { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'HUN', vote: 'X' },
    { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'ISR', vote: 'N' },
    { resolution: 'A/RES/TEST/2', date: '2024-02-01', iso3: 'DEU', vote: 'N' },
  ])

  it('scores yes +3, abstain −2, no −5, absent −2, per qualifying vote only', () => {
    const { events } = generateB1(ctx(), unga)
    const got = Object.fromEntries(events.map((e) => [e.country, e.points]))
    expect(got).toEqual({ DEU: 3, FRA: -2, USA: -5, HUN: -2 })
    // ISR is excluded (D-10); A/RES/TEST/2 is not in votes.yaml.
    expect(events).toHaveLength(4)
  })

  it('is a repeatable event dated the vote, with the row and the press release as evidence', () => {
    const e = byId(generateB1(ctx(), unga).events).get('evt_2024_01_01_DEU_B1_test-1')
    expect(e).toMatchObject({
      type: 'repeatable',
      date: '2024-01-01',
      confidence: 'confirmed',
      status: 'published',
      generated: true,
      scope: ['gaza'],
    })
    expect(e?.end).toBeUndefined()
    expect(e?.evidence).toEqual([
      {
        source: DS,
        quote: `A/RES/TEST/1,2024-01-01,DEU,Y,${DS}`,
        quote_lang: 'en',
        locator: 'row 2 of data/structured/unga_votes.csv',
      },
      { source: PRESS, quote: VOTE.quote, quote_lang: 'en', locator: 'paragraph 1' },
    ])
    expect(e?.summary.en).toBe('The country voted yes on General Assembly resolution A/RES/TEST/1.')
  })

  it('uses the votes.yaml date and says so when a row disagrees', () => {
    const r = rows('unga_votes.csv', [
      { resolution: 'A/RES/TEST/1', date: '2024-01-02', iso3: 'DEU', vote: 'Y' },
    ])
    const out = generateB1(ctx(), r)
    expect(out.events[0]?.date).toBe('2024-01-01')
    expect(out.notes[0]).toContain('votes.yaml says 2024-01-01')
  })

  it('slugs follow docs/03 §2', () => {
    expect(voteSlug('A/RES/ES-10/21')).toBe('es-10-21')
    expect(voteSlug('A/DEC/80/506')).toBe('dec-80-506')
  })
})

describe('B2 UNSC vetoes', () => {
  it('scores −20 per ceasefire veto and tracks the others', () => {
    const r = rows('unsc_vetoes.csv', [
      { date: '2023-10-18', draft: 'S/2023/773', vetoed_by: 'USA', ceasefire: true },
      { date: '2023-10-25', draft: 'S/2023/792', vetoed_by: 'RUS', ceasefire: true },
      { date: '2024-04-18', draft: 'S/2024/312', vetoed_by: 'USA', ceasefire: false },
    ])
    const out = generateB2(ctx(), r)
    expect(out.events.map((e) => [e.id, e.points, e.type])).toEqual([
      ['evt_2023_10_18_USA_B2_s-2023-773', -20, 'repeatable'],
      ['evt_2023_10_25_RUS_B2_s-2023-792', -20, 'repeatable'],
    ])
    expect(out.notes).toEqual([
      'unsc_vetoes.csv row 4: S/2024/312 by USA is tracked, not scored (ceasefire: false)',
    ])
  })
})

describe('A1 SIPRI deliveries', () => {
  const r = rows('sipri_deliveries.csv', [
    // Release of March 2025, data year 2024; total 450 TIV to Israel.
    {
      release_date: '2025-03-10',
      data_year: 2024,
      supplier_iso3: 'USA',
      tiv_to_israel: 300,
      tiv_total_to_israel: 450,
    },
    {
      release_date: '2025-03-10',
      data_year: 2024,
      supplier_iso3: 'DEU',
      tiv_to_israel: 135,
      tiv_total_to_israel: 450,
    },
    {
      release_date: '2025-03-10',
      data_year: 2024,
      supplier_iso3: 'ITA',
      tiv_to_israel: 4.5,
      tiv_total_to_israel: 450,
    },
    // An older year in the same release: not the release's data year, ignored.
    {
      release_date: '2025-03-10',
      data_year: 2023,
      supplier_iso3: 'USA',
      tiv_to_israel: 999,
      tiv_total_to_israel: 999,
    },
    // Release of March 2026, data year 2025.
    {
      release_date: '2026-03-09',
      data_year: 2025,
      supplier_iso3: 'USA',
      tiv_to_israel: 200,
      tiv_total_to_israel: 200,
    },
    // First post-war release (no_data_before = 2024-03-11): allowed.
    {
      release_date: '2024-03-11',
      data_year: 2023,
      supplier_iso3: 'USA',
      tiv_to_israel: 50,
      tiv_total_to_israel: 100,
    },
    // A pre-war release: A1 is no-data then.
    {
      release_date: '2023-03-13',
      data_year: 2022,
      supplier_iso3: 'USA',
      tiv_to_israel: 50,
      tiv_total_to_israel: 100,
    },
  ])

  it('points = −40 × √s, one decimal, valid release to release', () => {
    const out = generateA1(ctx(), r)
    const got = out.events.map((e) => [e.id, e.points, e.date, e.end])
    expect(got).toEqual([
      // s = 300/450 = 0.6667, √s = 0.8165, × −40 = −32.66 → −32.7
      ['evt_2025_03_10_USA_A1_tiv-2024', -32.7, '2025-03-10', '2026-03-09'],
      // s = 0.3, √s = 0.5477 → −21.9
      ['evt_2025_03_10_DEU_A1_tiv-2024', -21.9, '2025-03-10', '2026-03-09'],
      // s = 0.01, √s = 0.1 → −4.0 (docs/02 §5: a 1% supplier gets −4)
      ['evt_2025_03_10_ITA_A1_tiv-2024', -4, '2025-03-10', '2026-03-09'],
      // s = 1 → −40, the latest release: open-ended
      ['evt_2026_03_09_USA_A1_tiv-2025', -40, '2026-03-09', null],
      // s = 0.5, √s = 0.7071 → −28.3, until the 2025 release
      ['evt_2024_03_11_USA_A1_tiv-2023', -28.3, '2024-03-11', '2025-03-10'],
    ])
    expect(out.notes).toEqual([
      'sipri_deliveries.csv row 8: release 2023-03-13 is before 2024-03-11; A1 is no-data then',
    ])
  })

  it('writes the share in the summary', () => {
    const e = byId(generateA1(ctx(), r).events).get('evt_2025_03_10_DEU_A1_tiv-2024')
    expect(e?.summary.en).toBe(
      "The country delivered 30.0% of Israel's imports of major arms in 2024, per SIPRI TIV.",
    )
    expect(e?.summary.fr).toBe(
      "Le pays a livré 30,0 % des importations d'armes majeures d'Israël en 2024, selon les TIV du SIPRI.",
    )
  })
})

describe('A4 SIPRI orders', () => {
  it('tiers ≥ 500 → −15, ≥ 100 → −10, ≥ 10 → −5, > 0 → −2; 2023 orders are not scored', () => {
    const r = rows('sipri_orders.csv', [
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'IND',
        tiv_new_orders_from_israel: 600,
      },
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'AZE',
        tiv_new_orders_from_israel: 100,
      },
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'VNM',
        tiv_new_orders_from_israel: 10,
      },
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'PHL',
        tiv_new_orders_from_israel: 0.5,
      },
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'CHL',
        tiv_new_orders_from_israel: 0,
      },
      {
        release_date: '2024-03-11',
        data_year: 2023,
        buyer_iso3: 'IND',
        tiv_new_orders_from_israel: 300,
      },
    ])
    const out = generateA4(ctx(), r)
    expect(out.events.map((e) => [e.country, e.points, e.end])).toEqual([
      ['IND', -15, null],
      ['AZE', -10, null],
      ['VNM', -5, null],
      ['PHL', -2, null],
    ])
    expect(out.notes).toEqual([
      'sipri_orders.csv row 7: IND orders of 2023 not scored (the year starts before 2023-10-07)',
    ])
  })
})

describe('A2 Comtrade military exports', () => {
  const base = { retrieved_at: '2026-09-27T10:00:00Z' }
  const r = rows('comtrade_a2.csv', [
    // 2023: DEU reports HS 93 itself; 8526 is conditional and not counted by default.
    {
      iso3: 'DEU',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-02-21',
      hs: '93',
      usd: 250_084,
      reporter: 'self',
      ...base,
    },
    {
      iso3: 'DEU',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-02-21',
      hs: '8526',
      usd: 4_098_827,
      reporter: 'self',
      ...base,
    },
    {
      iso3: 'DEU',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-03-15',
      hs: '93',
      usd: 9_999_999,
      reporter: 'mirror',
      ...base,
    },
    // 2024: only a conditional code self-reported, so the mirror is used.
    {
      iso3: 'DEU',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      release_date: '2025-03-18',
      hs: '8802',
      usd: 2_206_285,
      reporter: 'self',
      ...base,
    },
    {
      iso3: 'DEU',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      release_date: '2025-03-01',
      hs: '93',
      usd: 12_000_000,
      reporter: 'mirror',
      ...base,
    },
    // FRA: the 2024 data were released before the 2023 data, so the 2023 window never applies.
    {
      iso3: 'FRA',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-06-01',
      hs: '93',
      usd: 150_000_000,
      reporter: 'self',
      ...base,
    },
    {
      iso3: 'FRA',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      release_date: '2024-05-01',
      hs: '93',
      usd: 50_000,
      reporter: 'self',
      ...base,
    },
  ])

  it('prefers the own report, falls back to the mirror, and tiers V', () => {
    const out = generateA2(ctx(), r)
    expect(out.events.map((e) => [e.id, e.points, e.date, e.end])).toEqual([
      // V = 250 084 (HS 93 only) ≥ 100 k → −3; until the 2024 window's release
      ['evt_2024_02_21_DEU_A2_comtrade-2023-self', -3, '2024-02-21', '2025-03-01'],
      // V = 12 000 000 (mirror) ≥ 10 M → −15
      ['evt_2025_03_01_DEU_A2_comtrade-2024-mirror', -15, '2025-03-01', null],
      // V = 50 000 < 100 k → 0, still written: export data exists
      ['evt_2024_05_01_FRA_A2_comtrade-2024-self', 0, '2024-05-01', null],
    ])
  })

  it('counts HS 8526/8802 only where confirmed military', () => {
    const out = generateA2(ctx(), r, new Map([['DEU', new Set(['8526'])]]))
    // V = 250 084 + 4 098 827 = 4 348 911 ≥ 1 M → −8
    expect(byId(out.events).get('evt_2024_02_21_DEU_A2_comtrade-2023-self')?.points).toBe(-8)
    // 2024: the self 8802 row is not confirmed, so the mirror still applies.
    expect(byId(out.events).get('evt_2025_03_01_DEU_A2_comtrade-2024-mirror')?.points).toBe(-15)
  })

  it('cites every row summed', () => {
    const out = generateA2(ctx(), r, new Map([['DEU', new Set(['8526'])]]))
    const e = byId(out.events).get('evt_2024_02_21_DEU_A2_comtrade-2023-self')
    expect(e?.evidence.map((x) => x.locator)).toEqual([
      'row 2 of data/structured/comtrade_a2.csv',
      'row 3 of data/structured/comtrade_a2.csv',
    ])
    expect(e?.summary.en).toBe(
      'The country exported USD 4.3 million of goods under HS 8526, 93 to Israel in 2023, per its report to UN Comtrade.',
    )
  })
})

describe('C3 Comtrade trade as usual', () => {
  const base = { retrieved_at: '2026-09-27T10:00:00Z' }
  const r = rows('comtrade_c3.csv', [
    // r = 1: T = 9.08 B ≥ 1 B → −5
    {
      iso3: 'DEU',
      window_start: '2022-01-01',
      window_end: '2022-12-31',
      release_date: '2023-02-20',
      usd_total: 9_075_063_418,
      usd_2022: 9_075_063_418,
      reporter: 'self',
      ...base,
    },
    // r = 8.78 / 9.08 = 0.967 ≥ 0.9 → −5
    {
      iso3: 'DEU',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-02-21',
      usd_total: 8_779_017_278,
      usd_2022: 9_075_063_418,
      reporter: 'self',
      ...base,
    },
    {
      iso3: 'DEU',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-03-01',
      usd_total: 1,
      usd_2022: 1,
      reporter: 'mirror',
      ...base,
    },
    // r = 3 / 7 = 0.43 < 0.9 → 0 (a drop is not rewarded, and not penalised)
    {
      iso3: 'TUR',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      release_date: '2025-04-01',
      usd_total: 3_000_000_000,
      usd_2022: 7_000_000_000,
      reporter: 'self',
      ...base,
    },
    // mirror only: r = 1.25, T = 50 M ≥ 10 M → −2
    {
      iso3: 'EGY',
      window_start: '2023-01-01',
      window_end: '2023-12-31',
      release_date: '2024-03-01',
      usd_total: 50_000_000,
      usd_2022: 40_000_000,
      reporter: 'mirror',
      ...base,
    },
  ])

  it('gates the tiers on r ≥ 0.9', () => {
    const out = generateC3(ctx(), r)
    expect(out.events.map((e) => [e.id, e.points, e.end])).toEqual([
      ['evt_2023_02_20_DEU_C3_comtrade-2022-self', -5, '2024-02-21'],
      ['evt_2024_02_21_DEU_C3_comtrade-2023-self', -5, null],
      ['evt_2025_04_01_TUR_C3_comtrade-2024-self', 0, null],
      ['evt_2024_03_01_EGY_C3_comtrade-2023-mirror', -2, null],
    ])
    const deu = byId(out.events).get('evt_2024_02_21_DEU_C3_comtrade-2023-self')
    expect(deu?.summary.en).toBe(
      'The country traded goods worth USD 8.8 billion with Israel in 2023, 97% of its 2022 level, per its report to UN Comtrade.',
    )
  })
})

describe('D1 FTS funding', () => {
  const base = { plan_ids: '1186;1156;1273;1510', retrieved_at: '2026-09-27T10:00:00Z' }
  const gni = rows('gni.csv', [
    { iso3: 'DEU', year: 2025, gni_atlas_usd: 5_026_012_352_665 },
    { iso3: 'NOR', year: 2023, gni_atlas_usd: 500_000_000_000 },
    { iso3: 'NOR', year: 2025, gni_atlas_usd: 600_000_000_000 },
  ])
  const funding = rows('fts_funding.csv', [
    // x = 6e8 × 100 / 5.026e12 = 0.01194 % ≥ 0.0100 % → +12
    {
      iso3: 'DEU',
      window_start: '2024-09-01',
      window_end: '2025-08-31',
      usd_paid_committed: 600_000_000,
      ...base,
    },
    // x = 1.5e8 × 100 / 5.026e12 = 0.00298 % ≥ 0.0020 % → +6
    {
      iso3: 'DEU',
      window_start: '2024-08-01',
      window_end: '2025-07-31',
      usd_paid_committed: 150_000_000,
      ...base,
    },
    // x = 1e6 × 100 / 5.026e12 = 0.0000199 % > 0 → +1
    {
      iso3: 'DEU',
      window_start: '2024-07-01',
      window_end: '2025-06-30',
      usd_paid_committed: 1_000_000,
      ...base,
    },
    // zero: no event
    {
      iso3: 'DEU',
      window_start: '2024-06-01',
      window_end: '2025-05-31',
      usd_paid_committed: 0,
      ...base,
    },
    // window ending 2024: GNI 2023 (the latest year not after 2024) = 5e11; x = 2.5e7 × 100 / 5e11
    // = 0.005 % ≥ 0.0050 % → +9 (with GNI 2025 it would be 0.00417 % → +6)
    {
      iso3: 'NOR',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      usd_paid_committed: 25_000_000,
      ...base,
    },
    // no GNI: no-data
    {
      iso3: 'CUB',
      window_start: '2024-01-01',
      window_end: '2024-12-31',
      usd_paid_committed: 1_000,
      ...base,
    },
  ])

  it('tiers x = F / GNI and makes each window valid for the next month', () => {
    const out = generateD1(ctx(), funding, gni)
    expect(out.events.map((e) => [e.id, e.points, e.date, e.end])).toEqual([
      ['evt_2025_09_01_DEU_D1_fts', 12, '2025-09-01', '2025-10-01'],
      ['evt_2025_08_01_DEU_D1_fts', 6, '2025-08-01', '2025-09-01'],
      ['evt_2025_07_01_DEU_D1_fts', 1, '2025-07-01', '2025-08-01'],
      ['evt_2025_01_01_NOR_D1_fts', 9, '2025-01-01', '2025-02-01'],
    ])
    expect(out.notes).toEqual(['CUB: FTS funding but no GNI in gni.csv; D1 is no-data'])
  })

  it('cites the funding row and the GNI row', () => {
    const e = generateD1(ctx(), funding, gni).events[0]
    expect(e?.evidence.map((x) => x.locator)).toEqual([
      'row 2 of data/structured/fts_funding.csv',
      'row 2 of data/structured/gni.csv',
    ])
    expect(e?.summary.en).toBe(
      'The government paid or committed USD 600.0 million to the oPt flash appeals in the 12 months to 31 August 2025, per FTS.',
    )
  })

  it('GNI: the latest year not after the window, else the most recent', () => {
    const n = gni.filter((g) => g.value.iso3 === 'NOR')
    expect(gniFor(n, 2024)?.value.year).toBe(2023)
    expect(gniFor(n, 2026)?.value.year).toBe(2025)
    expect(gniFor(n, 2020)?.value.year).toBe(2025)
    expect(gniFor([], 2024)).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------------------------

describe('every generated event', () => {
  const structured = {
    'unga_votes.csv': rows('unga_votes.csv', [
      { resolution: 'A/RES/TEST/1', date: '2024-01-01', iso3: 'DEU', vote: 'A' },
    ]),
    'unsc_vetoes.csv': rows('unsc_vetoes.csv', [
      { date: '2023-10-18', draft: 'S/2023/773', vetoed_by: 'USA', ceasefire: true },
    ]),
    'fts_funding.csv': rows('fts_funding.csv', [
      {
        iso3: 'DEU',
        window_start: '2024-09-01',
        window_end: '2025-08-31',
        usd_paid_committed: 12_345_678,
        plan_ids: '1156',
        retrieved_at: '2026-09-27T10:00:00Z',
      },
    ]),
    'fts_plan_totals.csv': [],
    'sipri_deliveries.csv': rows('sipri_deliveries.csv', [
      {
        release_date: '2025-03-10',
        data_year: 2024,
        supplier_iso3: 'DEU',
        tiv_to_israel: 1,
        tiv_total_to_israel: 3,
      },
    ]),
    'sipri_orders.csv': rows('sipri_orders.csv', [
      {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'IND',
        tiv_new_orders_from_israel: 12.5,
      },
    ]),
    'comtrade_a2.csv': rows('comtrade_a2.csv', [
      {
        iso3: 'DEU',
        window_start: '2024-01-01',
        window_end: '2024-12-31',
        release_date: '2025-03-18',
        hs: '93',
        usd: 568_621,
        reporter: 'self',
        retrieved_at: '2026-09-27T10:00:00Z',
      },
    ]),
    'comtrade_c3.csv': rows('comtrade_c3.csv', [
      {
        iso3: 'DEU',
        window_start: '2024-01-01',
        window_end: '2024-12-31',
        release_date: '2025-03-18',
        usd_total: 8_593_519_473,
        usd_2022: 9_075_063_418,
        reporter: 'self',
        retrieved_at: '2026-09-27T10:00:00Z',
      },
    ]),
    'gni.csv': rows('gni.csv', [{ iso3: 'DEU', year: 2025, gni_atlas_usd: 5_026_012_352_665 }]),
    'population.csv': [],
  }
  const { events } = generateAll(ctx(), structured)

  it('covers the seven generated indicators, in a stable order', () => {
    expect(events.map((e) => e.indicator)).toEqual(['B1', 'A1', 'A2', 'C3', 'D1', 'A4', 'B2'])
    expect(events.map((e) => e.country)).toEqual(['DEU', 'DEU', 'DEU', 'DEU', 'DEU', 'IND', 'USA'])
  })

  it('is a valid event record with a generated id and generated: true', () => {
    for (const e of events) {
      const parsed = EventSchema.safeParse(e)
      expect(parsed.success, `${e.id}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true)
      expect(EventIdLike.safeParse(e.id).success).toBe(true)
      expect(e.generated).toBe(true)
      expect(e.evidence.every((x) => x.locator.startsWith('row '))).toBe(e.indicator !== 'B1')
    }
  })

  it('has points inside the indicator range and the indicator type', () => {
    for (const e of events) {
      const ind = METHODOLOGY.indicatorsFile?.value.indicators.find((i) => i.id === e.indicator)
      expect(e.type, e.id).toBe(ind?.type)
      if (ind?.points.kind === 'formula') {
        expect(e.points).toBeGreaterThanOrEqual(ind.points.range.min)
        expect(e.points).toBeLessThanOrEqual(ind.points.range.max)
      }
    }
  })

  it('has summaries that pass the tone lint in EN and FR', () => {
    for (const e of events) {
      for (const lang of ['en', 'fr'] as const) {
        expect(lintSummary(e.summary[lang], lang, { matcher: MATCHER }), `${e.id} ${lang}`).toEqual(
          [],
        )
      }
    }
  })

  it('is deterministic', () => {
    expect(generateAll(ctx(), structured)).toEqual(generateAll(ctx(), structured))
  })

  it('refuses two events with one id', () => {
    const twice = {
      ...structured,
      'unsc_vetoes.csv': [...structured['unsc_vetoes.csv'], ...structured['unsc_vetoes.csv']],
    }
    expect(() => generateAll(ctx(), twice)).toThrow(/share the id/)
  })
})

describe('summary number formats', () => {
  it('money and percent in EN and FR', () => {
    expect(money(12_345_678, 'en')).toBe('USD 12.3 million')
    expect(money(12_345_678, 'fr')).toBe('12,3 millions USD')
    expect(money(1_500_000, 'fr')).toBe('1,5 million USD')
    expect(money(8_779_017_278, 'en')).toBe('USD 8.8 billion')
    expect(money(250_084, 'en')).toBe('USD 250,084')
    expect(money(250_084, 'fr')).toBe('250 084 USD')
    expect(percent(0.3, 'en')).toBe('30.0%')
    expect(percent(0.9674, 'fr', 0)).toBe('97 %')
  })

  it('exact amounts in the rationale, grouped by commas (P-17)', () => {
    expect(usdExact(105_066_282)).toBe('USD 105,066,282')
    expect(usdExact(5_026_012_352_665)).toBe('USD 5,026,012,352,665')
    expect(usdExact(409)).toBe('USD 409')
    expect(usdExact(1234.5)).toBe('USD 1,234.5')
  })
})
