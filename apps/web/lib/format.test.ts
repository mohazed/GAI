import { describe, expect, it } from 'vitest'
import {
  frenchMessages,
  frenchPunctuation,
  longDate,
  monthLabel,
  percent,
  plain,
  shortHash,
  signed,
  signedInt,
} from './format'

describe('numbers', () => {
  it('uses the minus sign and the plus sign', () => {
    expect(signedInt(-15, 'en')).toBe('−15')
    expect(signedInt(10, 'en')).toBe('+10')
    expect(signedInt(0, 'en')).toBe('0')
    expect(signed(-1.55, 'fr')).toBe('−1,6')
    expect(plain(3.5, 'en')).toBe('3.5')
    expect(plain(-3.5, 'fr')).toBe('−3,5')
  })
  it('writes percents as the summary line does', () => {
    expect(percent(0.0333, 'en')).toBe('3%')
    expect(percent(0.705, 'fr')).toBe('71 %')
  })
})

describe('dates', () => {
  it('writes long dates and months', () => {
    expect(longDate('2026-09-12', 'en')).toBe('12 September 2026')
    expect(longDate('2026-09-01', 'fr')).toBe('1er septembre 2026')
    expect(monthLabel('2026-09', 'fr')).toBe('septembre 2026')
    expect(monthLabel('2023-10', 'en')).toBe('October 2023')
  })
})

describe('french punctuation', () => {
  it('places no-break spaces', () => {
    expect(frenchPunctuation('Couverture : 3 %')).toBe('Couverture : 3 %')
    expect(frenchPunctuation('Vraiment ?')).toBe('Vraiment ?')
    expect(frenchPunctuation('« texte »')).toBe('« texte »')
    expect(frenchPunctuation(frenchPunctuation('a : b ; c !'))).toBe(
      frenchPunctuation('a : b ; c !'),
    )
  })
  it('walks a messages tree', () => {
    expect(frenchMessages({ a: { b: 'x : y' }, c: ['z ?'] })).toEqual({
      a: { b: 'x : y' },
      c: ['z ?'],
    })
  })
  it('keeps ICU placeholders intact', () => {
    const s = '{count, plural, one {# événement} other {# événements}} : voir'
    expect(frenchPunctuation(s)).toBe(
      '{count, plural, one {# événement} other {# événements}} : voir',
    )
  })
})

describe('hashes', () => {
  it('shortens a sha256', () => {
    expect(shortHash(`3f2a${'0'.repeat(58)}e1`)).toBe('3f2a…e1')
  })
})
