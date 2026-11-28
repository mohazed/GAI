/**
 * Row schemas of the structured tables (structured.ts, docs/03 §1 and §7): CSV strings coerced
 * to integers, numbers and booleans, plan ids, and the non-negative amounts. Rows are built as
 * the CSV loader hands them over: every value a string.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { z } from 'zod'
import {
  ComtradeA2Row,
  ComtradeC3Row,
  FtsFundingRow,
  FtsPlanTotalsRow,
  GniRow,
  PopulationRow,
  SipriDeliveriesRow,
  SipriOrdersRow,
  SourceIdList,
  STRUCTURED_ISO3_COLUMN,
  STRUCTURED_TABLE_NAMES,
  STRUCTURED_TABLES,
  splitSourceIds,
  UngaVoteRow,
  UnscVetoRow,
} from './structured.js'
import { FIXTURES_ROOT } from './testing/harness.js'

const SRC = 'src_20240311_sipri_at_2023'
const STAMP = '2026-09-26T22:58:53Z'

/** The distinct dotted paths of the problems, or [] when the row passes. */
function problems(schema: z.ZodType, value: unknown): string[] {
  const r = schema.safeParse(value)
  return r.success ? [] : [...new Set(r.error.issues.map((i) => i.path.join('.')))]
}

describe('the table registry', () => {
  it.each(STRUCTURED_TABLE_NAMES)('%s: columns match the row schema, in order', (t) => {
    const spec = STRUCTURED_TABLES[t]
    const shape = (spec.row as unknown as { shape: Record<string, unknown> }).shape
    expect(Object.keys(shape)).toEqual([...spec.columns])
    expect(spec.columns).toContain('source')
    expect(spec.columns).toContain(STRUCTURED_ISO3_COLUMN[t])
  })

  it.each(STRUCTURED_TABLE_NAMES)('%s: the fixture header is the documented header', (t) => {
    const text = readFileSync(join(FIXTURES_ROOT, 'data/structured', t), 'utf8')
    expect(text.split('\n')[0]).toBe(STRUCTURED_TABLES[t].columns.join(','))
  })

  it('names the twelve documented tables', () => {
    expect([...STRUCTURED_TABLE_NAMES].sort()).toEqual([
      'a2_confirmed_military.csv',
      'comtrade_a2.csv',
      'comtrade_c3.csv',
      'fts_funding.csv',
      'fts_plan_totals.csv',
      'gni.csv',
      'population.csv',
      'recognitions.csv',
      'sipri_deliveries.csv',
      'sipri_orders.csv',
      'unga_votes.csv',
      'unsc_vetoes.csv',
    ])
  })
})

describe('UngaVoteRow', () => {
  const row = {
    resolution: 'A/RES/ES-10/21',
    date: '2023-10-27',
    iso3: 'FRA',
    vote: 'Y',
    source: SRC,
  }

  it('accepts Y, N, A and X and GA resolution or decision symbols', () => {
    for (const vote of ['Y', 'N', 'A', 'X'])
      expect(problems(UngaVoteRow, { ...row, vote })).toEqual([])
    expect(problems(UngaVoteRow, { ...row, resolution: 'A/DEC/80/506' })).toEqual([])
  })

  it('rejects other votes, Security Council symbols and bad codes', () => {
    expect(problems(UngaVoteRow, { ...row, vote: 'y' })).toEqual(['vote'])
    expect(problems(UngaVoteRow, { ...row, vote: 'Q' })).toEqual(['vote'])
    expect(problems(UngaVoteRow, { ...row, resolution: 'S/RES/2712' })).toEqual(['resolution'])
    expect(problems(UngaVoteRow, { ...row, iso3: 'fra' })).toEqual(['iso3'])
    expect(problems(UngaVoteRow, { ...row, date: '27/10/2023' })).toEqual(['date'])
    expect(problems(UngaVoteRow, { ...row, source: 'undl' })).toEqual(['source'])
    expect(problems(UngaVoteRow, { ...row, extra: '1' })).toEqual([''])
  })
})

describe('UnscVetoRow', () => {
  const row = {
    date: '2023-10-18',
    draft: 'S/2023/773',
    vetoed_by: 'USA',
    ceasefire: 'true',
    source: SRC,
  }

  it('coerces ceasefire "true"/"false" to booleans', () => {
    expect(UnscVetoRow.parse(row).ceasefire).toBe(true)
    expect(UnscVetoRow.parse({ ...row, ceasefire: 'false' }).ceasefire).toBe(false)
  })

  it('rejects other spellings of booleans', () => {
    for (const ceasefire of ['TRUE', 'True', 'yes', '1', '']) {
      expect(problems(UnscVetoRow, { ...row, ceasefire }), ceasefire).toEqual(['ceasefire'])
    }
  })

  it('draft symbols are S/{YYYY}/{n}', () => {
    expect(problems(UnscVetoRow, { ...row, draft: 'S/RES/2712' })).toEqual(['draft'])
    expect(problems(UnscVetoRow, { ...row, draft: 'S/23/773' })).toEqual(['draft'])
  })
})

describe('FtsFundingRow', () => {
  const row = {
    iso3: 'DEU',
    window_start: '2023-10-07',
    window_end: '2024-10-06',
    usd_paid_committed: '1000000',
    plan_ids: '1156;1273',
    retrieved_at: STAMP,
    source: SRC,
  }

  it('coerces amounts to integers', () => {
    expect(FtsFundingRow.parse(row).usd_paid_committed).toBe(1_000_000)
    expect(FtsFundingRow.parse({ ...row, usd_paid_committed: '0' }).usd_paid_committed).toBe(0)
  })

  it('rejects negative, fractional, empty and unsafe amounts', () => {
    for (const usd of ['-5', '1.5', '', '1e6', '1,000', '9007199254740993']) {
      expect(problems(FtsFundingRow, { ...row, usd_paid_committed: usd }), usd).toEqual([
        'usd_paid_committed',
      ])
    }
  })

  it('plan ids are integers joined by ";"', () => {
    expect(problems(FtsFundingRow, { ...row, plan_ids: '1156' })).toEqual([])
    for (const plan_ids of ['1156,1273', '1156;', '', 'abc', '1156; 1273']) {
      expect(problems(FtsFundingRow, { ...row, plan_ids }), plan_ids).toEqual(['plan_ids'])
    }
  })

  it('retrieved_at is a UTC timestamp', () => {
    expect(problems(FtsFundingRow, { ...row, retrieved_at: '2026-09-26' })).toEqual([
      'retrieved_at',
    ])
  })
})

describe('SipriDeliveriesRow and SipriOrdersRow', () => {
  const deliveries = {
    release_date: '2024-03-11',
    data_year: '2023',
    supplier_iso3: 'DEU',
    tiv_to_israel: '12.5',
    tiv_total_to_israel: '532',
    source: SRC,
  }
  const orders = {
    release_date: '2024-03-11',
    data_year: '2023',
    buyer_iso3: 'IND',
    tiv_new_orders_from_israel: '0',
    source: SRC,
  }

  it('coerces the year to an integer and TIV values to numbers', () => {
    expect(SipriDeliveriesRow.parse(deliveries)).toMatchObject({
      data_year: 2023,
      tiv_to_israel: 12.5,
      tiv_total_to_israel: 532,
    })
    expect(SipriOrdersRow.parse(orders)).toMatchObject({
      data_year: 2023,
      tiv_new_orders_from_israel: 0,
    })
  })

  it('rejects negative or malformed TIV values', () => {
    for (const tiv of ['-3', '-0.5', '1e3', '.5', '5.', 'n/a', '']) {
      expect(problems(SipriDeliveriesRow, { ...deliveries, tiv_to_israel: tiv }), tiv).toEqual([
        'tiv_to_israel',
      ])
      expect(problems(SipriOrdersRow, { ...orders, tiv_new_orders_from_israel: tiv }), tiv).toEqual(
        ['tiv_new_orders_from_israel'],
      )
    }
  })

  it('rejects a fractional or missing year', () => {
    expect(problems(SipriDeliveriesRow, { ...deliveries, data_year: '2023.5' })).toEqual([
      'data_year',
    ])
    expect(problems(SipriOrdersRow, { ...orders, data_year: '' })).toEqual(['data_year'])
  })
})

describe('ComtradeA2Row and ComtradeC3Row', () => {
  const a2 = {
    iso3: 'DEU',
    window_start: '2023-10-07',
    window_end: '2024-10-06',
    release_date: '2025-02-20',
    hs: '93',
    usd: '250000',
    reporter: 'self',
    retrieved_at: STAMP,
    source: SRC,
  }
  const c3 = {
    iso3: 'DEU',
    window_start: '2023-10-07',
    window_end: '2024-10-06',
    release_date: '2025-02-20',
    usd_total: '5000000',
    usd_2022: '4000000',
    reporter: 'mirror',
    retrieved_at: STAMP,
    source: SRC,
  }

  it('HS codes of 2, 4 or 6 digits', () => {
    for (const hs of ['93', '8710', '8526', '8802', '880211']) {
      expect(problems(ComtradeA2Row, { ...a2, hs }), hs).toEqual([])
    }
    for (const hs of ['9', '871', '12345', '1234567', '93a', '']) {
      expect(problems(ComtradeA2Row, { ...a2, hs }), hs).toEqual(['hs'])
    }
  })

  it('HS codes stay strings (leading zeros kept)', () => {
    expect(ComtradeA2Row.parse({ ...a2, hs: '0101' }).hs).toBe('0101')
  })

  it('coerces USD to integers and rejects negative amounts', () => {
    expect(ComtradeA2Row.parse(a2).usd).toBe(250_000)
    expect(ComtradeC3Row.parse(c3)).toMatchObject({ usd_total: 5_000_000, usd_2022: 4_000_000 })
    expect(problems(ComtradeA2Row, { ...a2, usd: '-1' })).toEqual(['usd'])
    expect(problems(ComtradeC3Row, { ...c3, usd_total: '-1', usd_2022: '0.5' })).toEqual([
      'usd_total',
      'usd_2022',
    ])
  })

  it('reporter is self or mirror', () => {
    expect(problems(ComtradeA2Row, { ...a2, reporter: 'partner' })).toEqual(['reporter'])
    expect(problems(ComtradeC3Row, { ...c3, reporter: 'Self' })).toEqual(['reporter'])
  })
})

describe('GniRow and PopulationRow', () => {
  it('coerce the year and the amount to integers', () => {
    expect(
      GniRow.parse({ iso3: 'DEU', year: '2023', gni_atlas_usd: '4500000000000', source: SRC }),
    ).toEqual({
      iso3: 'DEU',
      year: 2023,
      gni_atlas_usd: 4_500_000_000_000,
      source: SRC,
    })
    expect(
      PopulationRow.parse({ iso3: 'DEU', year: '2023', population: '83000000', source: SRC }),
    ).toMatchObject({ year: 2023, population: 83_000_000 })
  })

  it('reject negative or fractional amounts', () => {
    const gni = { iso3: 'DEU', year: '2023', gni_atlas_usd: '1', source: SRC }
    expect(problems(GniRow, { ...gni, gni_atlas_usd: '-1' })).toEqual(['gni_atlas_usd'])
    expect(problems(GniRow, { ...gni, gni_atlas_usd: '1.5' })).toEqual(['gni_atlas_usd'])
    const pop = { iso3: 'DEU', year: '2023', population: '1', source: SRC }
    expect(problems(PopulationRow, { ...pop, population: '-100' })).toEqual(['population'])
    expect(problems(PopulationRow, { ...pop, year: 'twenty' })).toEqual(['year'])
  })

  it('the integer message names the column', () => {
    const r = PopulationRow.safeParse({ iso3: 'DEU', year: 'x', population: '1', source: SRC })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0]?.message).toContain('year')
  })
})

describe('SourceIdList (the source column)', () => {
  it('holds one id, or several joined by ";"', () => {
    expect(problems(SourceIdList, SRC)).toEqual([])
    expect(problems(SourceIdList, `${SRC};src_20240311_sipri_at_2023-p2`)).toEqual([])
    expect(splitSourceIds(`${SRC};src_20240311_sipri_at_2023-p2`)).toEqual([
      SRC,
      'src_20240311_sipri_at_2023-p2',
    ])
  })

  it('rejects an empty member, a bad id and a repeated id', () => {
    for (const bad of ['', `${SRC};`, `${SRC}; ${SRC}`, 'not-a-source', `${SRC};${SRC}`]) {
      expect(SourceIdList.safeParse(bad).success, bad).toBe(false)
    }
  })
})

describe('FtsPlanTotalsRow', () => {
  const row = {
    iso3: 'DEU',
    plan_id: '1156',
    usd_paid_committed: '12000000',
    flows: '24',
    retrieved_at: STAMP,
    source: SRC,
  }
  it('coerces integers and keeps the plan id a string', () => {
    expect(FtsPlanTotalsRow.parse(row)).toMatchObject({ plan_id: '1156', flows: 24 })
    expect(problems(FtsPlanTotalsRow, { ...row, plan_id: 'x1' })).toEqual(['plan_id'])
    expect(problems(FtsPlanTotalsRow, { ...row, flows: '-1' })).toEqual(['flows'])
  })
})
