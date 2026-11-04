/**
 * The registry of data/countries.yaml against the universe of docs/02 §1 (P-13 acceptance): 193
 * scored entities plus ISR and PSE, the same codes as UNIVERSE_ISO3 (which the fetchers use to
 * keep the rows of global datasets), and every entry with its French name with article
 * (`name.en_def` and `name.fr_def`, used by generated text, P-18).
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

describe('the M49 intermediate region of the registry (P-20, docs/10 B-861)', () => {
  // The UN Statistics Division's table divides two sub-regions further; every other entry has
  // none. Counts read from the table on 2026-11-04 (SHA-256 b9048114… in the registry's header).
  const BY_SUBREGION: Record<string, Record<string, number>> = {
    'Sub-Saharan Africa': {
      'Eastern Africa': 18,
      'Middle Africa': 9,
      'Southern Africa': 5,
      'Western Africa': 16,
    },
    'Latin America and the Caribbean': { Caribbean: 13, 'Central America': 8, 'South America': 12 },
  }

  it('gives every Sub-Saharan African and Latin American or Caribbean entry one of the seven', () => {
    for (const c of registry) {
      const allowed = BY_SUBREGION[c.subregion]
      if (allowed === undefined) {
        expect(c.intermediate_region, c.iso3).toBeNull()
      } else {
        expect(Object.keys(allowed), c.iso3).toContain(c.intermediate_region)
      }
    }
  })

  it('has the counts of the M49 table', () => {
    for (const [subregion, counts] of Object.entries(BY_SUBREGION)) {
      for (const [name, n] of Object.entries(counts)) {
        const found = registry.filter((c) => c.intermediate_region === name)
        expect(found.length, name).toBe(n)
        expect(
          found.every((c) => c.subregion === subregion),
          name,
        ).toBe(true)
      }
    }
    expect(registry.filter((c) => c.intermediate_region === null)).toHaveLength(114)
  })

  it('places the countries the peers list is read for', () => {
    const of = (iso3: string) => registry.find((c) => c.iso3 === iso3)?.intermediate_region
    expect(of('KEN')).toBe('Eastern Africa')
    expect(of('AGO')).toBe('Middle Africa')
    expect(of('ZAF')).toBe('Southern Africa')
    expect(of('GHA')).toBe('Western Africa')
    expect(of('BRA')).toBe('South America')
    expect(of('MEX')).toBe('Central America')
    expect(of('JAM')).toBe('Caribbean')
    expect(of('EGY')).toBeNull()
    expect(of('USA')).toBeNull()
  })
})

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

  it('gives every entry its English name with article (name.en_def)', () => {
    const missing = registry.filter((c) => c.name.en_def === undefined).map((c) => c.iso3)
    expect(missing).toEqual([])
    const byIso = new Map(registry.map((c) => [c.iso3, c.name.en_def]))
    expect(byIso.get('DEU')).toBe('Germany')
    expect(byIso.get('USA')).toBe('the United States of America')
    expect(byIso.get('BHS')).toBe('The Bahamas')
    expect(byIso.get('NLD')).toBe('the Kingdom of the Netherlands')
  })

  it('has unique ISO2 codes and M49 numbers', () => {
    expect(new Set(registry.map((c) => c.iso2)).size).toBe(195)
    expect(new Set(registry.map((c) => c.m49)).size).toBe(195)
  })
})
