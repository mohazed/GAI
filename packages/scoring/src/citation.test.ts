import { describe, expect, it } from 'vitest'
import {
  type CitationInput,
  citation,
  citations,
  comparePermalink,
  comparisonCitations,
  datasetCitations,
  datasetPermalink,
  permalink,
} from './citation.js'

const deu: CitationInput = {
  iso3: 'DEU',
  countryName: { en: 'Germany', fr: 'Allemagne' },
  date: '2026-09-26',
  methodologyVersion: '1.0.0',
  score: { display: -14, bandName: { en: 'Passive', fr: 'Passivité' } },
  siteUrl: 'https://example.org/',
}

describe('citations (docs/04 §3, docs/05 §5)', () => {
  it('plain, English: the docs/05 example with the locale in the permalink', () => {
    expect(citation(deu, 'plain', 'en')).toBe(
      'Gaza Accountability Index, Germany: −14 (Passive), methodology v1.0.0, as of 26 September 2026, https://example.org/en/country/DEU?date=2026-09-26',
    )
  })

  it('APA, English', () => {
    expect(citation(deu, 'apa', 'en')).toBe(
      'Zouad, M. (2026, September 26). Germany: −14 (Passive) (Methodology version 1.0.0) [Data set]. Gaza Accountability Index. https://example.org/en/country/DEU?date=2026-09-26',
    )
  })

  it('Chicago, English', () => {
    expect(citation(deu, 'chicago', 'en')).toBe(
      'Zouad, Mohamed. “Germany: −14 (Passive).” Gaza Accountability Index, methodology v1.0.0, September 26, 2026. https://example.org/en/country/DEU?date=2026-09-26.',
    )
  })

  it('French, all three', () => {
    expect(citations(deu, 'fr')).toEqual({
      plain:
        'Gaza Accountability Index, Allemagne : −14 (Passivité), méthodologie v1.0.0, au 26 septembre 2026, https://example.org/fr/country/DEU?date=2026-09-26',
      apa: 'Zouad, M. (2026, 26 septembre). Allemagne : −14 (Passivité) (méthodologie, version 1.0.0) [Jeu de données]. Gaza Accountability Index. https://example.org/fr/country/DEU?date=2026-09-26',
      chicago:
        'Zouad, Mohamed. « Allemagne : −14 (Passivité) ». Gaza Accountability Index, méthodologie v1.0.0, 26 septembre 2026. https://example.org/fr/country/DEU?date=2026-09-26.',
    })
  })

  it('writes the first of the month "1er" in French', () => {
    const first = { ...deu, date: '2026-09-01' }
    expect(citation(first, 'plain', 'fr')).toContain('au 1er septembre 2026')
    expect(citation(first, 'apa', 'fr')).toContain('(2026, 1er septembre)')
    expect(citation(first, 'chicago', 'en')).toContain('September 1, 2026')
  })

  it('signs positive scores and writes the methodology version as given', () => {
    const acting = {
      ...deu,
      methodologyVersion: '1.0.0-rc.1',
      score: { display: 12, bandName: { en: 'Acting', fr: 'Action' } },
    }
    expect(citation(acting, 'plain', 'en')).toContain(
      'Germany: +12 (Acting), methodology v1.0.0-rc.1,',
    )
  })

  it('names no score in scorecard mode (D-16)', () => {
    expect(citation({ ...deu, score: null }, 'plain', 'en')).toBe(
      'Gaza Accountability Index, Germany (scorecard), methodology v1.0.0, as of 26 September 2026, https://example.org/en/country/DEU?date=2026-09-26',
    )
    expect(citation({ ...deu, score: null }, 'plain', 'fr')).toContain(
      "Allemagne (fiche d'évaluation)",
    )
  })

  it('takes another author after a hand-over (D-01)', () => {
    const author = { family: 'Doe', given: 'Jane', initials: 'J.' }
    expect(citation({ ...deu, author }, 'apa', 'en')).toMatch(/^Doe, J\. \(2026, September 26\)\./)
    expect(citation({ ...deu, author }, 'chicago', 'en')).toMatch(/^Doe, Jane\. /)
  })

  it('builds the permalink and refuses malformed parts', () => {
    expect(permalink('https://gai.pages.dev', 'fr', 'FRA', '2025-01-01')).toBe(
      'https://gai.pages.dev/fr/country/FRA?date=2025-01-01',
    )
    expect(() => permalink('gai.pages.dev', 'en', 'DEU', '2025-01-01')).toThrow(RangeError)
    expect(() => permalink('https://gai.pages.dev', 'en', 'deu', '2025-01-01')).toThrow(RangeError)
    expect(() => permalink('https://gai.pages.dev', 'en', 'DEU', '2025-02-30')).toThrow(RangeError)
  })
})

describe('comparison citations (docs/05 §6 Compare)', () => {
  const fra = {
    iso3: 'FRA',
    countryName: { en: 'France', fr: 'France' },
    score: { display: 3, bandName: { en: 'Acting', fr: 'Action' } },
  }
  const input = {
    countries: [deu, fra],
    date: '2026-09-26',
    methodologyVersion: '1.0.0',
    siteUrl: 'https://example.org/',
  }

  it('cites every country with its score and band, and the undated compare link', () => {
    expect(comparisonCitations(input, 'en')).toEqual({
      plain:
        'Gaza Accountability Index, Comparison: Germany −14 (Passive), France +3 (Acting), methodology v1.0.0, as of 26 September 2026, https://example.org/en/compare?c=DEU,FRA',
      apa: 'Zouad, M. (2026, September 26). Comparison: Germany −14 (Passive), France +3 (Acting) (Methodology version 1.0.0) [Data set]. Gaza Accountability Index. https://example.org/en/compare?c=DEU,FRA',
      chicago:
        'Zouad, Mohamed. “Comparison: Germany −14 (Passive), France +3 (Acting).” Gaza Accountability Index, methodology v1.0.0, September 26, 2026. https://example.org/en/compare?c=DEU,FRA.',
    })
  })

  it('French, and scorecard mode without scores (D-16)', () => {
    expect(comparisonCitations(input, 'fr').plain).toBe(
      'Gaza Accountability Index, Comparaison\u00a0: Allemagne −14 (Passivité), France +3 (Action), méthodologie v1.0.0, au 26 septembre 2026, https://example.org/fr/compare?c=DEU,FRA',
    )
    const card = {
      ...input,
      countries: input.countries.map((c) => ({ ...c, score: null })),
    }
    expect(comparisonCitations(card, 'en').plain).toBe(
      'Gaza Accountability Index, Comparison: Germany, France (scorecards), methodology v1.0.0, as of 26 September 2026, https://example.org/en/compare?c=DEU,FRA',
    )
    expect(comparisonCitations(card, 'fr').plain).toContain(
      "Comparaison\u00a0: Allemagne, France (fiches d'évaluation)",
    )
  })

  it('refuses no country, six countries and a code that is not ISO3', () => {
    const url = 'https://example.org'
    expect(() => comparePermalink(url, 'en', [])).toThrow()
    expect(() => comparePermalink(url, 'en', ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'])).toThrow()
    expect(() => comparePermalink(url, 'en', ['deu'])).toThrow()
    expect(comparePermalink(url, 'fr', ['DEU'])).toBe('https://example.org/fr/compare?c=DEU')
  })
})

describe('datasetCitations (the Data page)', () => {
  const input = { date: '2026-09-26', methodologyVersion: '1.0.0', siteUrl: 'https://example.org/' }

  it('cites the dataset at its build date, linking the Data page', () => {
    expect(datasetCitations(input, 'en')).toEqual({
      plain:
        'Gaza Accountability Index, Dataset and API, methodology v1.0.0, as of 26 September 2026, https://example.org/en/data/',
      apa: 'Zouad, M. (2026, September 26). Dataset and API (Methodology version 1.0.0) [Data set]. Gaza Accountability Index. https://example.org/en/data/',
      chicago:
        'Zouad, Mohamed. “Dataset and API.” Gaza Accountability Index, methodology v1.0.0, September 26, 2026. https://example.org/en/data/.',
    })
    expect(datasetCitations(input, 'fr').plain).toBe(
      'Gaza Accountability Index, Données et API, méthodologie v1.0.0, au 26 septembre 2026, https://example.org/fr/data/',
    )
  })

  it('refuses a bad date or site URL', () => {
    expect(() => datasetCitations({ ...input, date: '2026-9-26' }, 'en')).toThrow()
    expect(() => datasetPermalink('example.org', 'en')).toThrow()
  })
})
