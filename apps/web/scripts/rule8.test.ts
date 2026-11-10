import { describe, expect, it } from 'vitest'
import { rule8Problems, uncheckedFacts } from './rule8'

describe('rule8Problems (docs/02 §12 rule 8)', () => {
  it('passes in score mode when no country has an unchecked indicator', () => {
    expect(rule8Problems('score', { count: 0, countries: [] })).toEqual([])
  })

  it('fails in score mode when any country has one, naming the countries', () => {
    const problems = rule8Problems('score', { count: 1, countries: ['BHR'] })
    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('1 note(s) of kind unchecked')
    expect(problems[0]).toContain('(BHR)')
  })

  it('shortens a long list and gives the number of countries', () => {
    const countries = Array.from({ length: 154 }, (_, i) => `C${String(i).padStart(2, '0')}`)
    const [problem] = rule8Problems('score', { count: 154, countries })
    expect(problem).toContain('C00, C01, C02, C03, C04, C05, C06, C07, … (154 countries)')
    expect(problem).not.toContain('C08')
  })

  it('never applies in scorecard mode (docs/02 §8)', () => {
    expect(rule8Problems('scorecard', { count: 456, countries: ['BHR'] })).toEqual([])
  })
})

describe('uncheckedFacts', () => {
  it('reads counts.unchecked and the countries of the unchecked notes only', () => {
    expect(
      uncheckedFacts({
        counts: { unchecked: 2, history: 0 },
        notes: [
          { kind: 'unchecked', country: 'BHR', message: 'x' },
          { kind: 'disagreement', country: 'FRA', message: 'y' },
          { kind: 'unchecked', country: 'SAU', message: 'z' },
        ],
      }),
    ).toEqual({ count: 2, countries: ['BHR', 'SAU'] })
  })

  it('refuses a file without a numeric count (a gate must not pass on a missing number)', () => {
    expect(() => uncheckedFacts({ counts: {} })).toThrow('counts.unchecked')
    expect(() => uncheckedFacts({})).toThrow('counts.unchecked')
  })
})
