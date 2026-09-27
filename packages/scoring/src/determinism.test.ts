/**
 * Determinism (D-25): the same input gives the same output, whatever the order of the events,
 * and the engine reads no clock, no randomness and no file.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { coverage } from './coverage.js'
import { createScorer, scoreCountry } from './score.js'
import { sensitivitySuite } from './sensitivity.js'
import { dailySeries, lastChange } from './series.js'
import { country, ev, methodology } from './test-helpers.js'

const m = methodology()
const SRC = dirname(fileURLToPath(import.meta.url))

function events() {
  return [
    ev('A1', '2024-03-11', -21.9, { id: 'e01', end: '2025-03-10' }),
    ev('A1', '2025-03-10', -12.3, { id: 'e02' }),
    ev('B1', '2023-10-27', 3, { id: 'e03' }),
    ev('B1', '2023-12-12', 3, { id: 'e04' }),
    ev('B1', '2024-05-10', -2, { id: 'e05', confidence: 'corroborated' }),
    ev('B9', '2024-02-01', 5, { id: 'e06', confidence: 'reported' }),
    ev('B12', '2023-11-01', 5, { id: 'e07' }),
    ev('B12', '2024-02-01', 8, { id: 'e08', confidence: 'corroborated' }),
    ev('B5', '2024-11-22', 8, { id: 'e09' }),
    ev('B6', '2025-04-03', -10, { id: 'e10' }),
    ev('C1', '2025-05-20', 4, { id: 'e11' }),
    ev('D2', '2024-01-27', -10, { id: 'e12', end: '2024-07-01' }),
    ev('D3', '2024-07-01', 5, { id: 'e13' }),
    ev('D1', '2025-01-01', 3, { id: 'e14', end: '2025-02-01' }),
    ev('E2', '2024-06-01', -5, { id: 'e15' }),
  ]
}

/** A fixed permutation (seeded Fisher–Yates) so the test itself stays deterministic. */
function shuffled<T>(list: readonly T[], seed: number): T[] {
  const out = [...list]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j] as T, out[i] as T]
  }
  return out
}

describe('determinism', () => {
  it('same input, same output', () => {
    const a = JSON.stringify(scoreCountry('TST', events(), '2025-06-01', m))
    const b = JSON.stringify(scoreCountry('TST', events(), '2025-06-01', m))
    expect(a).toBe(b)
  })

  it('the order of the events does not change a single bit of any output', () => {
    const ref = events()
    const outputs = (list: ReturnType<typeof events>) => {
      const s = createScorer('TST', list, m)
      return JSON.stringify({
        score: s.at('2025-06-01'),
        series: dailySeries(s, '2023-10-07', '2026-12-31'),
        last: lastChange(s, '2026-12-31'),
        coverage: coverage(
          { country: country(), assessment: null, events: list, date: '2025-06-01' },
          m,
        ),
      })
    }
    const expected = outputs(ref)
    for (const seed of [1, 7, 42, 2024, 99991]) expect(outputs(shuffled(ref, seed))).toBe(expected)
    expect(outputs([...ref].reverse())).toBe(expected)
  })

  it('the sensitivity suite is identical on two runs', () => {
    const countries = [
      { iso3: 'TST', events: events() },
      { iso3: 'ABC', events: [] },
    ]
    expect(JSON.stringify(sensitivitySuite(countries, '2025-06-01', m))).toBe(
      JSON.stringify(sensitivitySuite(shuffled(countries, 3), '2025-06-01', m)),
    )
  })

  it('the compiled methodology cannot be changed by a caller', () => {
    expect(Object.isFrozen(m)).toBe(true)
    expect(Object.isFrozen(m.indicators)).toBe(true)
    expect(Object.isFrozen(m.passivity)).toBe(true)
  })
})

describe('purity of the engine sources', () => {
  const sources = readdirSync(SRC)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'test-helpers.ts')
    .map((f) => ({ f, text: readFileSync(join(SRC, f), 'utf8') }))

  it('covers every engine module', () => {
    expect(sources.map((s) => s.f)).toContain('score.ts')
    expect(sources.length).toBeGreaterThanOrEqual(15)
  })

  it.each([
    ['Date.now', /\bDate\.now\b/],
    ['new Date', /\bnew\s+Date\b/],
    ['Date(', /\bDate\s*\(/],
    ['Math.random', /\bMath\.random\b/],
    ['performance.now', /\bperformance\.now\b/],
    ['process', /\bprocess\./],
    ['localeCompare (locale-dependent order)', /\blocaleCompare\b/],
    ['Intl (locale-dependent formatting)', /\bIntl\./],
    ['toLocaleString', /\btoLocale\w*String\b/],
  ])('no %s anywhere in the engine', (_, pattern) => {
    for (const { f, text } of sources) expect(pattern.test(text), f).toBe(false)
  })

  it('imports nothing but its own modules (dependency-free, no I/O)', () => {
    for (const { f, text } of sources) {
      const specifiers = [...text.matchAll(/\bfrom\s+'([^']+)'/g)].map((x) => x[1])
      for (const s of specifiers) expect(s, `${f} imports ${s}`).toMatch(/^\.\/[a-z-]+\.js$/)
      expect(/\bimport\s*\(/.test(text), `${f} uses a dynamic import`).toBe(false)
      expect(/\brequire\s*\(/.test(text), `${f} uses require`).toBe(false)
    }
  })

  it('declares no runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(join(SRC, '..', 'package.json'), 'utf8')) as Record<
      string,
      unknown
    >
    expect(pkg.dependencies).toBeUndefined()
  })
})
