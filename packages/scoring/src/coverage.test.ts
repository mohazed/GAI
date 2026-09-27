import { describe, expect, it } from 'vitest'
import { coverage, onSecurityCouncil } from './coverage.js'
import { country, ev, methodology } from './test-helpers.js'
import type { AssessmentStatus, ScoringAssessment } from './types.js'

const m = methodology()

/** An assessment with every scored indicator at `status`, then the overrides. */
function assessment(
  status: AssessmentStatus,
  over: Record<string, AssessmentStatus> = {},
): ScoringAssessment {
  const indicators: Record<string, { status: AssessmentStatus }> = {}
  for (const id of m.scoredIndicatorIds) indicators[id] = { status: over[id] ?? status }
  return { indicators }
}

describe('coverage (docs/02 §8)', () => {
  it('is computed over the 31 scored indicators; E is left out', () => {
    expect(m.scoredIndicatorIds).toHaveLength(31)
    expect(m.scoredIndicatorIds.some((id) => id.startsWith('E'))).toBe(false)
  })

  it('coverage = (has-events + none-found) / (31 − not-applicable)', () => {
    const a = assessment('none-found', {
      A1: 'no-data',
      A2: 'no-data',
      A4: 'no-data',
      C3: 'no-data',
      C5: 'unchecked',
      C6: 'unchecked',
      D5: 'unchecked',
    })
    const events = [ev('A6', '2025-08-08', 10), ev('B9', '2025-01-01', 5)]
    const c = coverage({ country: country(), assessment: a, events, date: '2026-09-26' }, m)
    expect(c).toMatchObject({
      applicable: 30,
      hasEvents: 2,
      noneFound: 21,
      noData: 4,
      unchecked: 3,
      notApplicable: 1,
      missing: ['A1', 'A2', 'A4', 'C3', 'C5', 'C6', 'D5'],
      noDataIds: ['A1', 'A2', 'A4', 'C3'],
      uncheckedIds: ['C5', 'C6', 'D5'],
      notApplicableIds: ['B2'],
      noExportData: true,
    })
    expect(c.ratio).toBeCloseTo(23 / 30, 12)
    expect(c.hasEvents + c.noneFound + c.noData + c.unchecked + c.notApplicable).toBe(31)
  })

  it('treats a missing assessment as all unchecked (B2 still not-applicable by rule)', () => {
    const c = coverage({ country: country(), assessment: null, events: [], date: '2026-09-26' }, m)
    expect(c).toMatchObject({
      applicable: 30,
      hasEvents: 0,
      unchecked: 30,
      ratio: 0,
      noExportData: false,
    })
  })

  it('sets has-events from published gaza events dated on or before the date', () => {
    const events = [
      ev('A6', '2025-08-08', 10),
      ev('C5', '2025-01-01', 5, { status: 'draft' }),
      ev('C6', '2025-01-01', 3, { scope: ['west-bank'] }),
      ev('D4', '2027-01-01', 5),
      ev('D5', '2025-01-01', 5, { country: 'FRA' }),
    ]
    const c = coverage(
      { country: country(), assessment: assessment('none-found'), events, date: '2026-09-26' },
      m,
    )
    expect(c.statuses).toMatchObject({
      A6: 'has-events',
      C5: 'none-found',
      C6: 'none-found',
      D4: 'none-found',
      D5: 'none-found',
    })
    expect(c.overrides).toEqual([
      { indicator: 'A6', from: 'none-found', to: 'has-events', reason: 'published-event' },
      { indicator: 'B2', from: 'none-found', to: 'not-applicable', reason: 'unsc-rule' },
    ])
  })

  it('turns a hand-set has-events without a published event into unchecked', () => {
    const c = coverage(
      {
        country: country(),
        assessment: assessment('none-found', { C1: 'has-events' }),
        events: [],
        date: '2026-09-26',
      },
      m,
    )
    expect(c.statuses.C1).toBe('unchecked')
    expect(c.overrides).toContainEqual({
      indicator: 'C1',
      from: 'has-events',
      to: 'unchecked',
      reason: 'no-published-event',
    })
  })

  describe('B2 not-applicable by Security Council membership periods', () => {
    const at = (
      unsc: Parameters<typeof country>[0],
      date: string,
      hand: AssessmentStatus = 'none-found',
    ) =>
      coverage(
        {
          country: country(unsc),
          assessment: assessment('none-found', { B2: hand }),
          events: [],
          date,
        },
        m,
      )

    it('not-applicable for a state never on the Council in the window', () => {
      expect(at([], '2026-09-26').statuses.B2).toBe('not-applicable')
    })

    it('not-applicable when the last term ended before 2023-10-07', () => {
      expect(
        at([{ from: '2019-01-01', to: '2020-12-31', permanent: false }], '2026-09-26').statuses.B2,
      ).toBe('not-applicable')
    })

    it('applicable for an elected member whose term overlaps the window, including a term ending on 2023-10-07', () => {
      expect(
        at([{ from: '2024-01-01', to: '2025-12-31', permanent: false }], '2026-09-26').statuses.B2,
      ).toBe('none-found')
      expect(
        at([{ from: '2022-01-01', to: '2023-10-07', permanent: false }], '2026-09-26').statuses.B2,
      ).toBe('none-found')
      expect(
        at([{ from: '2022-01-01', to: '2023-10-06', permanent: false }], '2026-09-26').statuses.B2,
      ).toBe('not-applicable')
    })

    it('applicable for a permanent member (to: null)', () => {
      expect(
        at([{ from: '1945-10-24', to: null, permanent: true }], '2026-09-26').statuses.B2,
      ).toBe('none-found')
    })

    it('depends on the date: a term that has not started yet does not count', () => {
      const term = [{ from: '2027-01-01', to: '2028-12-31', permanent: false }]
      expect(at(term, '2026-12-31').statuses.B2).toBe('not-applicable')
      expect(at(term, '2027-01-01').statuses.B2).toBe('none-found')
      expect(at(term, '2026-12-31').applicable).toBe(30)
      expect(at(term, '2027-01-01').applicable).toBe(31)
    })

    it('replaces a hand-set not-applicable with unchecked when the state was on the Council', () => {
      const c = at(
        [{ from: '2024-01-01', to: '2025-12-31', permanent: false }],
        '2026-09-26',
        'not-applicable',
      )
      expect(c.statuses.B2).toBe('unchecked')
      expect(c.overrides).toContainEqual({
        indicator: 'B2',
        from: 'not-applicable',
        to: 'unchecked',
        reason: 'unsc-rule',
      })
    })

    it('overrides a hand-set status of a non-member with not-applicable', () => {
      const c = at([], '2026-09-26', 'unchecked')
      expect(c.statuses.B2).toBe('not-applicable')
      expect(c.overrides).toContainEqual({
        indicator: 'B2',
        from: 'unchecked',
        to: 'not-applicable',
        reason: 'unsc-rule',
      })
    })

    it('onSecurityCouncil reads inclusive bounds', () => {
      const c = country([{ from: '2024-01-01', to: '2025-12-31', permanent: false }])
      expect(onSecurityCouncil(c, '2025-12-31', '2026-06-01')).toBe(true)
      expect(onSecurityCouncil(c, '2026-01-01', '2026-06-01')).toBe(false)
      expect(onSecurityCouncil(c, '2023-10-07', '2024-01-01')).toBe(true)
      expect(onSecurityCouncil(c, '2023-10-07', '2023-12-31')).toBe(false)
    })
  })

  it('keeps a hand-set not-applicable on an indicator without an automatic rule', () => {
    const c = coverage(
      {
        country: country(),
        assessment: assessment('none-found', { A3: 'not-applicable' }),
        events: [],
        date: '2026-09-26',
      },
      m,
    )
    expect(c.statuses.A3).toBe('not-applicable')
    expect(c.applicable).toBe(29)
  })

  it('flags "no export data" when A1 or A2 is no-data (§8)', () => {
    const c = (over: Record<string, AssessmentStatus>) =>
      coverage(
        {
          country: country(),
          assessment: assessment('none-found', over),
          events: [],
          date: '2026-09-26',
        },
        m,
      ).noExportData
    expect(c({ A1: 'no-data' })).toBe(true)
    expect(c({ A2: 'no-data' })).toBe(true)
    expect(c({ A4: 'no-data' })).toBe(false)
  })
})
