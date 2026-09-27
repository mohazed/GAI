/**
 * The fetchers' transforms on small synthetic responses shaped like the real ones (field names as
 * observed on 2026-09-27); every expected total is summed by hand in the comments.
 */
import { describe, expect, it } from 'vitest'
import {
  canCall,
  comtradeRows,
  crossCheck,
  parseAvailability,
  parseReporters,
  parseTrade,
  previewUrl,
  stateFor,
  type TradeRecord,
  yearsFrom,
} from './comtrade.js'
import {
  addMonths,
  type FtsPage,
  ftsTables,
  governmentFlows,
  parseFlowPage,
  parseLocations,
  windowFor,
} from './fts.js'
import { FTS_DONOR_UNIVERSE } from './fts-run.js'
import { parseWorldBank } from './worldbank.js'

// ---------------------------------------------------------------------------------------------
// FTS

const gov = (id: string, name = 'Germany, Government of') => ({
  type: 'Organization',
  id,
  name,
  organizationTypes: ['Governments'],
})
const loc = (id: string, name: string) => ({ type: 'Location', id, name })
const plan = (id: string) => ({ type: 'Plan', id, name: `Plan ${id}` })

function flow(
  id: string,
  amount: number,
  date: string,
  source: object[],
  planId: string,
  extra: Record<string, unknown> = {},
) {
  return {
    id,
    amountUSD: amount,
    status: 'paid',
    boundary: 'incoming',
    date: `${date}T00:00:00Z`,
    sourceObjects: source,
    destinationObjects: [plan(planId)],
    ...extra,
  }
}

const LOCATIONS = parseLocations({
  data: [
    { id: 80, iso3: 'DEU', name: 'Germany' },
    { id: 167, iso3: 'NOR', name: 'Norway' },
    { id: 171, iso3: 'PSE', name: 'Occupied Palestinian Territory' },
  ],
})

function page(
  planId: string,
  flows: object[],
  sourceId = `src_20260927_fts_plan-${planId}-p1`,
): FtsPage {
  return parseFlowPage(
    { status: 'ok', data: { flows }, meta: { count: flows.length } },
    planId,
    1,
    sourceId,
  )
}

describe('FTS', () => {
  const pages = [
    page('1186', [
      flow('1', 1_000_000, '2023-10-20', [gov('10'), loc('80', 'Germany')], '1186'),
      // a commitment counts; a pledge does not
      flow('2', 500_000.4, '2023-11-15', [gov('10'), loc('80', 'Germany')], '1186', {
        status: 'commitment',
      }),
      flow('3', 9_999_999, '2023-11-15', [gov('10'), loc('80', 'Germany')], '1186', {
        status: 'pledge',
      }),
      // internal flows and non-government donors do not count
      flow('4', 7_777_777, '2023-11-15', [gov('10'), loc('80', 'Germany')], '1186', {
        boundary: 'internal',
      }),
      flow(
        '5',
        8_888_888,
        '2023-11-15',
        [
          { type: 'Organization', id: '99', organizationTypes: ['Private Organizations'] },
          loc('80', 'Germany'),
        ],
        '1186',
      ),
      // a ministry recorded at location oPt is not attributed
      flow(
        '6',
        250_000,
        '2023-12-01',
        [gov('11', 'German Federal Foreign Office'), loc('171', 'Occupied Palestinian Territory')],
        '1186',
      ),
      // dated before the war
      flow(
        '7',
        100_000,
        '2023-02-28',
        [gov('12', 'Norway, Government of'), loc('167', 'Norway')],
        '1186',
      ),
    ]),
    page('1156', [
      flow('8', 2_000_000, '2024-03-10', [gov('10'), loc('80', 'Germany')], '1156'),
      // the same flow listed under both plans: once in the windows
      flow('1', 1_000_000, '2023-10-20', [gov('10'), loc('80', 'Germany')], '1156'),
    ]),
  ]

  it('keeps incoming paid and committed government flows, attributed by source location', () => {
    const { attributed, unattributed } = governmentFlows(pages, LOCATIONS, FTS_DONOR_UNIVERSE)
    expect(attributed.map((f) => f.flowId)).toEqual(['1', '2', '7', '8', '1'])
    expect(unattributed).toEqual([
      {
        flowId: '6',
        planId: '1186',
        organization: 'German Federal Foreign Office',
        location: 'Occupied Palestinian Territory',
        amount: 250_000,
      },
    ])
  })

  it('builds 12-month windows ending the month before, and plan totals', () => {
    const t = ftsTables({
      pages,
      locations: LOCATIONS,
      locationSourceId: 'src_20260927_fts_locations',
      universe: FTS_DONOR_UNIVERSE,
      plans: ['1186', '1156'],
      lastMonth: '2024-04',
      retrievedAt: '2026-09-27T10:00:00Z',
    })
    const deu = (end: string) => t.windows.find((w) => w.iso3 === 'DEU' && w.window_end === end)
    // October 2023's value: 2022-10-01 … 2023-09-30, nothing for DEU
    expect(deu('2023-09-30')?.usd_paid_committed).toBe(0)
    // December 2023's value: … 2023-11-30: 1 000 000 + 500 000.4 = 1 500 000
    expect(deu('2023-11-30')?.usd_paid_committed).toBe(1_500_000)
    // April 2024's value: 2023-04-01 … 2024-03-31: 1 500 000.4 + 2 000 000, flow 1 once
    expect(deu('2024-03-31')?.usd_paid_committed).toBe(3_500_000)
    // NOR's pre-war flow counts in the windows its date places it in
    expect(
      t.windows.find((w) => w.iso3 === 'NOR' && w.window_end === '2023-09-30')?.usd_paid_committed,
    ).toBe(100_000)
    // 7 months × 2 donors
    expect(t.windows).toHaveLength(14)
    expect(t.windows[0]).toMatchObject({
      plan_ids: '1186;1156',
      source:
        'src_20260927_fts_plan-1186-p1;src_20260927_fts_plan-1156-p1;src_20260927_fts_locations',
    })
    // Plan totals count flow 1 in each plan that lists it.
    expect(t.plans.map((p) => [p.iso3, p.plan_id, p.usd_paid_committed, p.flows])).toEqual([
      ['DEU', '1186', 1_500_000, 2],
      ['NOR', '1186', 100_000, 1],
      ['DEU', '1156', 3_000_000, 2],
    ])
    expect(t.sharedFlows).toEqual(['1'])
    expect(t.preWindowFlows.map((f) => f.flowId)).toEqual(['7'])
  })

  it('window arithmetic', () => {
    expect(windowFor('2024-10')).toEqual({ start: '2023-10-01', end: '2024-09-30' })
    expect(windowFor('2024-03')).toEqual({ start: '2023-03-01', end: '2024-02-29' })
    expect(addMonths('2023-12', 1)).toBe('2024-01')
    expect(addMonths('2024-01', -13)).toBe('2022-12')
  })

  it('refuses a page that is not a flow response', () => {
    expect(() => parseFlowPage({ status: 'error' }, '1186', 1, 'src_20260927_fts_x')).toThrow(
      /not an FTS flow response/,
    )
    expect(() =>
      parseFlowPage(
        { status: 'ok', data: { flows: [{ id: 1 }] }, meta: { count: 1 } },
        '1186',
        1,
        'src_20260927_fts_x',
      ),
    ).toThrow(/lacks id, amountUSD or date/)
  })
})

// ---------------------------------------------------------------------------------------------
// World Bank

describe('World Bank', () => {
  const response = [
    { page: 1, pages: 1, per_page: 500, total: 4 },
    [
      { indicator: { id: 'NY.GNP.ATLS.CD' }, countryiso3code: 'AFE', date: '2025', value: 1.2e12 },
      {
        indicator: { id: 'NY.GNP.ATLS.CD' },
        countryiso3code: 'DEU',
        date: '2025',
        value: 5026012352664.98,
      },
      {
        indicator: { id: 'NY.GNP.ATLS.CD' },
        countryiso3code: 'CUB',
        date: '2019',
        value: 100933901482.027,
      },
      { indicator: { id: 'NY.GNP.ATLS.CD' }, countryiso3code: 'ABW', date: '2025', value: 4e9 },
    ],
  ]

  it('keeps universe entries (not aggregates or territories), with their own latest year', () => {
    const r = parseWorldBank(response, 'NY.GNP.ATLS.CD', new Set(['DEU', 'CUB', 'VAT']))
    expect(r.values).toEqual([
      { iso3: 'DEU', year: 2025, value: 5026012352664.98 },
      { iso3: 'CUB', year: 2019, value: 100933901482.027 },
    ])
    expect(r.missing).toEqual(['VAT'])
  })

  it('refuses another indicator or several pages', () => {
    expect(() => parseWorldBank(response, 'SP.POP.TOTL', new Set(['DEU']))).toThrow(
      /row of indicator/,
    )
    expect(() => parseWorldBank([{ pages: 2 }, []], 'X', new Set())).toThrow(/2 pages/)
  })
})

// ---------------------------------------------------------------------------------------------
// Comtrade

const rec = (
  reporter: number,
  partner: number,
  year: number,
  flow: 'X' | 'M',
  cmd: string,
  value: number,
) => ({
  reporterCode: reporter,
  partnerCode: partner,
  refYear: year,
  period: String(year),
  flowCode: flow,
  cmdCode: cmd,
  primaryValue: value,
  customsCode: 'C00',
  motCode: 0,
  partner2Code: 0,
})

describe('Comtrade', () => {
  it('maps ISO3 to current reporter codes', () => {
    const codes = parseReporters({
      results: [
        {
          reporterCode: 280,
          reporterCodeIsoAlpha3: 'DEU',
          entryExpiredDate: '1990-12-31T00:00:00',
          isGroup: false,
        },
        { reporterCode: 276, reporterCodeIsoAlpha3: 'DEU', isGroup: false },
        { reporterCode: 842, reporterCodeIsoAlpha3: 'USA', isGroup: false },
        { reporterCode: 97, reporterCodeIsoAlpha3: 'EUR', isGroup: true },
      ],
    })
    expect([...codes]).toEqual([
      ['DEU', 276],
      ['USA', 842],
    ])
  })

  it('reads totals only and refuses error payloads', () => {
    const records = parseTrade({
      data: [
        rec(276, 376, 2023, 'X', '93', 250083.579),
        { ...rec(276, 376, 2023, 'X', '93', 1), customsCode: 'C01' },
        { ...rec(276, 376, 2023, 'X', '93', 1), motCode: 1000 },
      ],
    })
    expect(records).toEqual([
      { reporter: 276, partner: 376, year: 2023, flow: 'X', cmd: '93', value: 250083.579 },
    ])
    expect(() => parseTrade({ statusCode: 429, message: 'Rate limit is exceeded' })).toThrow(/429/)
    expect(() =>
      parseTrade({ data: [], error: 'Maximum number of periods for preview is 1' }),
    ).toThrow(/Maximum/)
  })

  it('reads first release dates', () => {
    const r = parseAvailability({
      data: [
        { reporterCode: 276, period: 2023, firstReleased: '2024-02-21T21:40:38.3' },
        { reporterCode: 376, period: 2023, firstReleased: '2024-03-15T10:00:00' },
      ],
    })
    expect(r.get('276:2023')).toBe('2024-02-21')
    expect(r.get('376:2023')).toBe('2024-03-15')
  })

  const y = (year: number, list: TradeRecord[], sourceId: string) => ({
    year,
    sourceId,
    records: list,
  })
  const t = (
    reporter: number,
    partner: number,
    year: number,
    flow: 'X' | 'M',
    cmd: string,
    value: number,
  ): TradeRecord => ({ reporter, partner, year, flow, cmd, value })

  it('writes A2 rows for the export records returned, and C3 rows with the 2022 baseline', () => {
    const rows = comtradeRows({
      iso3: 'DEU',
      code: 276,
      self: [
        y(
          2022,
          [
            t(276, 376, 2022, 'X', 'TOTAL', 6_367_801_237.143),
            t(276, 376, 2022, 'M', 'TOTAL', 2_707_262_180.841),
            t(276, 376, 2022, 'X', '93', 409_116.656),
          ],
          'src_20260927_comtrade_deu-self-2022',
        ),
        // 2023: HS 93 export, and an import record for 8710 (not an export: no A2 row)
        y(
          2023,
          [
            t(276, 376, 2023, 'X', 'TOTAL', 5_831_156_142.352),
            t(276, 376, 2023, 'M', 'TOTAL', 2_947_861_135.633),
            t(276, 376, 2023, 'X', '93', 250_083.579),
            t(276, 376, 2023, 'M', '8710', 5),
          ],
          'src_20260927_comtrade_deu-self-2023',
        ),
        // 2024: no data at all
        y(2024, [], 'src_20260927_comtrade_deu-self-2024'),
      ],
      mirror: [
        // Israel's imports from DEU under 93 in 2023 (flow M)
        y(2023, [t(376, 276, 2023, 'M', '93', 3_000_000)], 'src_20260927_comtrade_deu-mirror-2023'),
      ],
      releases: new Map([
        ['276:2022', '2023-02-20'],
        ['276:2023', '2024-02-21'],
        ['376:2023', '2024-03-15'],
      ]),
      commonSources: ['src_20260927_comtrade_reporters', 'src_20260927_comtrade_availability-deu'],
      retrievedAt: '2026-09-27T10:00:00Z',
    })
    expect(rows.a2.map((r) => [r.window_start, r.hs, r.usd, r.reporter, r.release_date])).toEqual([
      ['2022-01-01', '93', 409_117, 'self', '2023-02-20'],
      ['2023-01-01', '93', 250_084, 'self', '2024-02-21'],
      ['2023-01-01', '93', 3_000_000, 'mirror', '2024-03-15'],
    ])
    // C3 2023: 5 831 156 142.352 + 2 947 861 135.633 = 8 779 017 277.985 → 8 779 017 278
    //          baseline 6 367 801 237.143 + 2 707 262 180.841 = 9 075 063 417.984 → 9 075 063 418
    expect(rows.c3.map((r) => [r.window_start, r.usd_total, r.usd_2022, r.reporter])).toEqual([
      ['2022-01-01', 9_075_063_418, 9_075_063_418, 'self'],
      ['2023-01-01', 8_779_017_278, 9_075_063_418, 'self'],
    ])
    expect(rows.c3[1]?.source).toBe(
      'src_20260927_comtrade_deu-self-2023;src_20260927_comtrade_deu-self-2022;src_20260927_comtrade_reporters;src_20260927_comtrade_availability-deu',
    )
    expect(rows.gaps).toEqual([
      'self 2024: no data',
      'mirror 2023: total trade not reported in both flows',
    ])
  })

  it('cross-checks archived and keyed values', () => {
    const a = [t(276, 376, 2023, 'X', '93', 250_083.6), t(276, 376, 2023, 'M', 'TOTAL', 5)]
    const k = [t(276, 376, 2023, 'X', '93', 250_084), t(276, 376, 2024, 'X', '93', 7)]
    expect(crossCheck(a, k)).toEqual([
      '276→376 2023 M TOTAL: 5 in the archived preview, absent from the keyed API',
      '276→376 2024 X 93: 7 from the keyed API, absent from the archived preview',
    ])
  })

  it('counts keyed calls per UTC day and keeps the reporters done', () => {
    const s = stateFor(null, '2026-09-27')
    expect(s).toEqual({ day: '2026-09-27', calls: 0, done: {} })
    s.calls = 499
    s.done.DEU = '2026-09-27T10:00:00Z'
    expect(canCall(s, 1)).toBe(true)
    expect(canCall(s, 2)).toBe(false)
    expect(stateFor(s, '2026-09-27')).toBe(s)
    expect(stateFor(s, '2026-09-28')).toEqual({
      day: '2026-09-28',
      calls: 0,
      done: { DEU: '2026-09-27T10:00:00Z' },
    })
  })

  it('queries: one period per preview, 2022 to the latest year', () => {
    expect(yearsFrom(2025)).toEqual([2022, 2023, 2024, 2025])
    expect(previewUrl(276, 376, 2023)).toBe(
      'https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=276&partnerCode=376&period=2023&cmdCode=93,8710,8526,8802,TOTAL&flowCode=X,M&customsCode=C00&motCode=0&partner2Code=0',
    )
  })
})
