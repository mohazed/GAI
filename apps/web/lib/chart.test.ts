import { describe, expect, it } from 'vitest'
import { datePercent, pct, quarterTicks, stepPath, valueAt, valuePx } from './chart'

describe('chart geometry', () => {
  it('maps dates onto percentages', () => {
    const x = datePercent('2023-10-07', '2026-09-27')
    expect(x('2023-10-07')).toBe(0)
    expect(x('2026-09-27')).toBe(100)
    expect(x('2020-01-01')).toBe(0)
    expect(pct(12.34567)).toBe('12.346%')
  })
  it('lists quarter ticks after the start', () => {
    expect(quarterTicks('2023-10-07', '2024-07-01')).toEqual([
      '2024-01-01',
      '2024-04-01',
      '2024-07-01',
    ])
  })
  it('draws a step line extended to the end date', () => {
    const y = valuePx([-100, 100], 0, 200)
    const d = stepPath(
      [
        { date: '2023-10-07', value: -15 },
        { date: '2025-08-08', value: -5 },
      ],
      '2023-10-07',
      '2026-09-27',
      y,
    )
    expect(d.startsWith('M0,115')).toBe(true)
    expect(d.endsWith('L1000,105')).toBe(true)
  })
  it('reads the value in force', () => {
    const pts = [
      { date: '2023-10-07', v: 1 },
      { date: '2025-01-01', v: 2 },
    ]
    expect(valueAt(pts, '2024-06-01')?.v).toBe(1)
    expect(valueAt(pts, '2025-01-01')?.v).toBe(2)
    expect(valueAt(pts, '2023-01-01')).toBeNull()
  })
})
