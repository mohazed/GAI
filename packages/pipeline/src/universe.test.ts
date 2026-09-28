/**
 * The registry of data/countries.yaml against the universe of docs/02 §1 (P-13 acceptance): 193
 * scored entities plus ISR and PSE, the same codes as UNIVERSE_ISO3 (which the fetchers use to
 * keep the rows of global datasets), and every entry with its French name with article
 * (`name.fr_def`, used by generated French text, P-18).
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Country, EXCLUDED_ISO3 } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { OBSERVER_ISO3, UN_MEMBER_ISO3, UNIVERSE_ISO3 } from './universe.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const registry = (parse(readFileSync(join(ROOT, 'data/countries.yaml'), 'utf8')) as unknown[]).map(
  (c) => Country.parse(c),
)
const sorted = (codes: Iterable<string>) => [...codes].sort()

describe('data/countries.yaml and the universe', () => {
  it('lists 195 entries: 193 scored entities, and ISR and PSE excluded', () => {
    expect(registry).toHaveLength(195)
    expect(registry.filter((c) => !c.excluded)).toHaveLength(193)
    expect(sorted(registry.filter((c) => c.excluded).map((c) => c.iso3))).toEqual(
      sorted(EXCLUDED_ISO3),
    )
  })

  it('has exactly the codes of universe.ts, once each', () => {
    const codes = registry.map((c) => c.iso3)
    expect(new Set(codes).size).toBe(codes.length)
    expect(sorted(codes)).toEqual(sorted(UNIVERSE_ISO3))
  })

  it('marks the 193 UN member states as members and the Holy See and Palestine as observers', () => {
    expect(sorted(registry.filter((c) => c.un_member).map((c) => c.iso3))).toEqual(
      sorted(UN_MEMBER_ISO3),
    )
    expect(sorted(registry.filter((c) => c.observer).map((c) => c.iso3))).toEqual(
      sorted(OBSERVER_ISO3),
    )
  })

  it('gives every entry its French name with article (name.fr_def)', () => {
    const missing = registry.filter((c) => c.name.fr_def === undefined).map((c) => c.iso3)
    expect(missing).toEqual([])
    const byIso = new Map(registry.map((c) => [c.iso3, c.name.fr_def]))
    expect(byIso.get('DEU')).toBe("l'Allemagne")
    expect(byIso.get('FRA')).toBe('la France')
    expect(byIso.get('USA')).toBe("les États-Unis d'Amérique")
    expect(byIso.get('CUB')).toBe('Cuba')
  })

  it('has unique ISO2 codes and M49 numbers', () => {
    expect(new Set(registry.map((c) => c.iso2)).size).toBe(195)
    expect(new Set(registry.map((c) => c.m49)).size).toBe(195)
  })
})
