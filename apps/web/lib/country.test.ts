import type { ApiCountriesFile, ApiScoredCountry } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { peersOf } from './country'

/** Only the fields peersOf reads; the rest of a scored entry is irrelevant here. */
function entry(
  iso3: string,
  region: string,
  subregion: string,
  intermediate_region: string | null,
  score = 0,
  band = 'passive',
): ApiScoredCountry {
  return {
    iso3,
    excluded: false,
    name: { en: iso3, fr: iso3 },
    region,
    subregion,
    intermediate_region,
    score,
    band,
  } as unknown as ApiScoredCountry
}

const file = (countries: ApiScoredCountry[]) => ({ countries }) as unknown as ApiCountriesFile
const iso3s = (xs: { iso3: string }[]) => xs.map((x) => x.iso3)

describe('peersOf in scorecard mode (P-20: M49 intermediate region first)', () => {
  const SSA = 'Sub-Saharan Africa'
  const countries = file([
    entry('AGO', 'Africa', SSA, 'Middle Africa'),
    entry('BDI', 'Africa', SSA, 'Eastern Africa'),
    entry('BEN', 'Africa', SSA, 'Western Africa'),
    entry('BFA', 'Africa', SSA, 'Western Africa'),
    entry('KEN', 'Africa', SSA, 'Eastern Africa'),
    entry('UGA', 'Africa', SSA, 'Eastern Africa'),
    entry('ETH', 'Africa', SSA, 'Eastern Africa'),
    entry('EGY', 'Africa', 'Northern Africa', null),
    entry('DEU', 'Europe', 'Western Europe', null),
  ])

  it('takes the same intermediate region first, then the same sub-region, by ISO3', () => {
    const kenya = countries.countries[4] as ApiScoredCountry
    expect(iso3s(peersOf(countries, kenya, 'scorecard').region)).toEqual([
      'BDI',
      'ETH',
      'UGA',
      // The sub-region fills the rest: Angola, Benin, Burkina Faso by ISO3, never Egypt (another
      // sub-region) or Germany (another region).
      'AGO',
    ])
  })

  it('falls back to the sub-region for an entry with no intermediate region', () => {
    const egypt = countries.countries[7] as ApiScoredCountry
    expect(iso3s(peersOf(countries, egypt, 'scorecard').region)).toEqual([
      'AGO',
      'BDI',
      'BEN',
      'BFA',
    ])
  })

  it('does not match two entries that both lack an intermediate region', () => {
    const list = file([
      entry('AAA', 'Europe', 'Western Europe', null),
      entry('BBB', 'Europe', 'Southern Europe', null),
      entry('CCC', 'Europe', 'Western Europe', null),
    ])
    expect(iso3s(peersOf(list, list.countries[0] as ApiScoredCountry, 'scorecard').region)).toEqual(
      ['CCC', 'BBB'],
    )
  })

  it('leaves score mode on the nearest scores', () => {
    const list = file([
      entry('AAA', 'Europe', 'Western Europe', null, 10, 'acting'),
      entry('BBB', 'Europe', 'Western Europe', null, 40, 'acting'),
      entry('CCC', 'Europe', 'Southern Europe', null, 12, 'acting'),
    ])
    const out = peersOf(list, list.countries[0] as ApiScoredCountry, 'score')
    expect(iso3s(out.region)).toEqual(['CCC', 'BBB'])
    expect(iso3s(out.band)).toEqual(['CCC', 'BBB'])
  })
})
