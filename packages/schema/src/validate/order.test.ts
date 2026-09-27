import { describe, expect, it } from 'vitest'
import { nextEventId } from '../ids.js'
import { compareEventIds, compareEventOrder } from './order.js'

describe('compareEventIds', () => {
  it('orders instance numbers by value, as nextEventId hands them out', () => {
    const parts = { date: '2025-08-08', iso3: 'DEU', indicator: 'A6' }
    const ids: string[] = []
    for (let i = 0; i < 12; i++) ids.push(nextEventId(ids, parts))
    expect(ids.slice(-3)).toEqual([
      'evt_2025_08_08_DEU_A6_10',
      'evt_2025_08_08_DEU_A6_11',
      'evt_2025_08_08_DEU_A6_12',
    ])
    const shuffled = [...ids].reverse()
    expect(shuffled.sort(compareEventIds)).toEqual(ids)
    expect(compareEventIds('evt_2025_08_08_DEU_A6_9', 'evt_2025_08_08_DEU_A6_10')).toBe(-1)
  })

  it('orders indicators of one date by number (B9 before B10)', () => {
    expect(compareEventIds('evt_2024_03_26_DEU_B9', 'evt_2024_03_26_DEU_B10')).toBe(-1)
    expect(compareEventIds('evt_2024_03_26_DEU_B10', 'evt_2024_03_26_DEU_B9')).toBe(1)
    expect(compareEventIds('evt_2024_03_26_DEU_A8', 'evt_2024_03_26_DEU_B1')).toBe(-1)
  })

  it('is a total order: equal ids compare 0, and the order is antisymmetric', () => {
    const ids = [
      'evt_2024_03_26_DEU_B9',
      'evt_2024_03_26_DEU_B9_2',
      'evt_2024_03_26_DEU_B10',
      'evt_2024_03_26_DEU_B10_2',
      'evt_2024_03_26_FRA_B9',
    ]
    for (const a of ids) {
      expect(compareEventIds(a, a)).toBe(0)
      for (const b of ids) {
        if (a !== b) expect(compareEventIds(a, b)).toBe(-compareEventIds(b, a))
      }
    }
    expect([...ids].reverse().sort(compareEventIds)).toEqual(ids)
  })
})

describe('compareEventOrder', () => {
  it('orders by date first, then by id', () => {
    const early = { date: '2024-01-01', id: 'evt_2024_01_01_DEU_B10' }
    const late = { date: '2024-01-02', id: 'evt_2024_01_02_DEU_A1' }
    expect(compareEventOrder(early, late)).toBe(-1)
    expect(compareEventOrder(late, early)).toBe(1)
    expect(compareEventOrder(early, { ...early })).toBe(0)
  })
})
