import { describe, expect, it } from 'vitest'
import { type CitationInput, citation, citations, permalink } from './citation.js'

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
