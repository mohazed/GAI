import { describe, expect, it } from 'vitest'
import { addDays, dateParts, dayNumber, daysBetween, isIsoDate, isoDate } from './time.js'

describe('calendar arithmetic without Date', () => {
  it('matches Date.UTC day numbers across leap years and centuries', () => {
    for (const iso of [
      '1970-01-01',
      '1969-12-31',
      '2000-02-29',
      '2023-10-07',
      '2024-02-29',
      '2024-03-01',
      '2025-12-31',
      '2100-03-01',
      '2400-02-29',
    ]) {
      const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
      expect(dayNumber(iso)).toBe(Date.UTC(y, m - 1, d) / 86_400_000)
    }
  })

  it('round-trips every day from 2023 to 2030', () => {
    const start = dayNumber('2023-01-01')
    for (let d = start; d < start + 8 * 366; d++) {
      const iso = isoDate(d)
      expect(dayNumber(iso)).toBe(d)
      expect(iso).toBe(new Date(d * 86_400_000).toISOString().slice(0, 10))
    }
  })

  it('rejects dates that do not exist or are not YYYY-MM-DD', () => {
    for (const bad of [
      '2023-02-29',
      '2023-13-01',
      '2023-00-10',
      '2023-04-31',
      '2023-1-01',
      '20231007',
      '',
    ]) {
      expect(isIsoDate(bad)).toBe(false)
      expect(() => dayNumber(bad)).toThrow(RangeError)
    }
    expect(() => isoDate(1.5)).toThrow(RangeError)
  })

  it('counts whole days between dates and adds days', () => {
    expect(daysBetween('2023-10-07', '2024-10-06')).toBe(365)
    expect(daysBetween('2024-10-06', '2023-10-07')).toBe(-365)
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2023-10-07', 731)).toBe('2025-10-07')
    expect(dateParts('2026-09-01')).toEqual({ year: 2026, month: 9, day: 1 })
  })
})
