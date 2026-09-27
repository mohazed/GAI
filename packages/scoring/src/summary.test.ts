import { compileBannedWords, findBannedWords, loadMethodology } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { INDICATOR_LABELS } from './labels.js'
import type { LastChange } from './series.js'
import {
  eventCategoryCounts,
  eventCounts,
  type SummaryInput,
  summaryLine,
  summaryLines,
} from './summary.js'
import { ev, methodology, REPO_ROOT } from './test-helpers.js'

const m = methodology()
const enabling = { en: 'Enabling', fr: 'Facilitation' }
const counts = (total: number, confirmed: number) => ({
  total,
  confirmed,
  corroborated: 0,
  reported: 0,
  disputed: 0,
})
const vote: LastChange = {
  date: '2026-09-12',
  kind: 'event',
  event: 'evt_2026_09_12_DEU_B1_es-10-30',
  indicator: 'B1',
  change: 'start',
  points: 3,
  effect: 3,
  delta: 3,
  passivity: { before: false, after: false },
}
const base: SummaryInput = {
  score: { display: -38, bandName: enabling },
  events: counts(14, 9),
  coverage: 0.71,
  lastChange: vote,
  passivityPoints: 15,
}

describe('summary line (spec §5)', () => {
  it('reproduces the spec example in English, character for character', () => {
    expect(summaryLine(base, 'en')).toBe(
      'Score −38 (Enabling). 14 events, 9 confirmed. Coverage 71%. Last change: 2026-09-12, UNGA vote (B1, +3).',
    )
  })

  it('gives the same sentence in French with French typography', () => {
    expect(summaryLine(base, 'fr')).toBe(
      "Score −38 (Facilitation). 14 événements, dont 9 confirmés. Couverture 71 %. Dernier changement : 2026-09-12, vote à l'Assemblée générale (B1, +3).",
    )
    expect(summaryLines(base)).toEqual({ en: summaryLine(base, 'en'), fr: summaryLine(base, 'fr') })
  })

  it('uses U+2212 for negative values and a plus sign for positive ones', () => {
    const line = (display: number) =>
      summaryLine({ ...base, score: { display, bandName: enabling } }, 'en')
    expect(line(-38).split('. ')[0]).toBe('Score −38 (Enabling)')
    expect(line(-38).split('. ')[0]).not.toContain('-')
    expect(line(12)).toContain('Score +12 ')
    expect(line(0)).toContain('Score 0 ')
  })

  it('agrees in number (English: 1 event; French: 0 and 1 are singular)', () => {
    expect(summaryLine({ ...base, events: counts(1, 1) }, 'en')).toContain('1 event, 1 confirmed.')
    expect(summaryLine({ ...base, events: counts(0, 0) }, 'en')).toContain('0 events, 0 confirmed.')
    expect(summaryLine({ ...base, events: counts(1, 1) }, 'fr')).toContain(
      '1 événement, dont 1 confirmé.',
    )
    expect(summaryLine({ ...base, events: counts(0, 0) }, 'fr')).toContain(
      '0 événement, dont 0 confirmé.',
    )
    expect(summaryLine({ ...base, events: counts(2, 1) }, 'fr')).toContain(
      '2 événements, dont 1 confirmé.',
    )
  })

  it('separates thousands: 1,234 / 1 234', () => {
    expect(summaryLine({ ...base, events: counts(1234, 1000) }, 'en')).toContain(
      '1,234 events, 1,000 confirmed.',
    )
    expect(summaryLine({ ...base, events: counts(1234, 1000) }, 'fr')).toContain(
      '1 234 événements, dont 1 000 confirmés.',
    )
  })

  it('rounds coverage half away from zero to a whole percent', () => {
    expect(summaryLine({ ...base, coverage: 0.705 }, 'en')).toContain('Coverage 71%.')
    expect(summaryLine({ ...base, coverage: 0.7049 }, 'en')).toContain('Coverage 70%.')
    expect(summaryLine({ ...base, coverage: 1 / 30 }, 'en')).toContain('Coverage 3%.')
    expect(() => summaryLine({ ...base, coverage: 1.2 }, 'en')).toThrow(RangeError)
  })

  it('describes ends, expiries, passivity changes and the absence of change', () => {
    const lc = (over: Partial<LastChange>) =>
      summaryLine({ ...base, lastChange: { ...vote, ...over } }, 'en')
    const lcFr = (over: Partial<LastChange>) =>
      summaryLine({ ...base, lastChange: { ...vote, ...over } }, 'fr')
    expect(lc({ date: '2025-11-24', indicator: 'A6', change: 'end', points: -10 })).toContain(
      'Last change: 2025-11-24, export licence suspension, ended (A6, −10).',
    )
    expect(lcFr({ date: '2025-11-24', indicator: 'A6', change: 'end', points: -10 })).toContain(
      "Dernier changement : 2025-11-24, suspension de licences d'exportation, fin (A6, −10).",
    )
    expect(lc({ change: 'expire', points: 1.25 })).toContain(
      'UNGA vote, no longer counted (B1, +1.3).',
    )
    expect(lcFr({ change: 'expire', points: 1.25 })).toContain(
      "vote à l'Assemblée générale, sortie du score (B1, +1,3).",
    )
    const passivity = {
      kind: 'passivity' as const,
      event: null,
      indicator: null,
      change: null,
      points: null,
      date: '2026-01-01',
    }
    expect(lc({ ...passivity, passivity: { before: false, after: true } })).toContain(
      'Last change: 2026-01-01, passivity penalty applied (−15).',
    )
    expect(lcFr({ ...passivity, passivity: { before: true, after: false } })).toContain(
      'Dernier changement : 2026-01-01, pénalité de passivité levée (+15).',
    )
    expect(summaryLine({ ...base, lastChange: null }, 'en')).toContain('Last change: none.')
    expect(summaryLine({ ...base, lastChange: null }, 'fr')).toContain(
      'Dernier changement : aucun.',
    )
  })

  it('scorecard mode (D-16): no score, no passivity; the latest event instead of the last change', () => {
    const latest = { date: '2026-09-12', id: 'evt_x', indicator: 'B1', points: 3 }
    const passivityChange: LastChange = {
      ...vote,
      kind: 'passivity',
      event: null,
      indicator: null,
      change: null,
      points: null,
      passivity: { before: false, after: true },
    }
    const card = { ...base, score: null, lastChange: passivityChange, latestEvent: latest }
    expect(summaryLine(card, 'en')).toBe(
      '14 events, 9 confirmed. Coverage 71%. Latest event: 2026-09-12, UNGA vote (B1, +3).',
    )
    expect(summaryLine(card, 'fr')).toBe(
      "14 événements, dont 9 confirmés. Couverture 71\u202f%. Dernier événement\u00a0: 2026-09-12, vote à l'Assemblée générale (B1, +3).",
    )
    expect(summaryLine({ ...card, latestEvent: null }, 'en')).toContain('Latest event: none.')
    expect(() => summaryLine({ ...base, score: null }, 'en')).toThrow(/latestEvent/)
  })

  it('says when the passivity penalty moved on the same day as the event', () => {
    const lifted: LastChange = {
      ...vote,
      indicator: 'B9',
      points: 5,
      effect: 20,
      delta: 20,
      passivity: { before: true, after: false },
    }
    expect(summaryLine({ ...base, lastChange: lifted }, 'en')).toContain(
      'Last change: 2026-09-12, statement calling for a ceasefire or naming violations (B9, +5); passivity penalty lifted (+15).',
    )
    expect(summaryLine({ ...base, lastChange: lifted }, 'fr')).toContain(
      '(B9, +5)\u202f; pénalité de passivité levée (+15).',
    )
  })

  it('uses one template for every country: only the values change', () => {
    const skeleton = (s: string) =>
      s.replace(/[+−]?\d[\d,.]*/g, 'N').replace(/\([A-Za-zé]+\)/, '(BAND)')
    const a = summaryLine(base, 'en')
    const b = summaryLine(
      { ...base, score: { display: 55, bandName: { en: 'Confronting', fr: 'Confrontation' } } },
      'en',
    )
    expect(skeleton(a)).toBe(skeleton(b))
  })
})

describe('event counts (§14 events)', () => {
  it('counts published gaza events dated on or before the date, by confidence', () => {
    const events = [
      ev('B1', '2026-09-12', 3),
      ev('B9', '2026-01-01', 5, { confidence: 'reported' }),
      ev('C5', '2026-01-01', 5, { confidence: 'corroborated' }),
      ev('C5', '2026-01-02', 5, { status: 'retracted' }),
      ev('C6', '2026-01-02', 3, { scope: ['lebanon'] }),
      ev('D4', '2026-10-01', 5),
      ev('E1', '2026-01-01', 5, { confidence: 'disputed' }),
    ]
    expect(eventCounts(events, '2026-09-26')).toEqual({
      total: 4,
      confirmed: 1,
      corroborated: 1,
      reported: 1,
      disputed: 1,
    })
  })

  it('counts the same events by category; the five counts add up to the total', () => {
    const events = [
      ev('B1', '2026-09-12', 3),
      ev('B9', '2026-01-01', 5, { confidence: 'reported' }),
      ev('C5', '2026-01-01', 5),
      ev('C5', '2026-01-02', 5, { status: 'retracted' }),
      ev('C6', '2026-01-02', 3, { scope: ['lebanon'] }),
      ev('D1', '2026-01-01', 4, { type: 'computed' }),
      ev('D4', '2026-10-01', 5),
      ev('E1', '2026-01-01', 5),
    ]
    const categoryOf = (id: string) => id.slice(0, 1) as 'A' | 'B' | 'C' | 'D' | 'E'
    const byCat = eventCategoryCounts(events, '2026-09-26', categoryOf)
    expect(byCat).toEqual({ A: 0, B: 2, C: 1, D: 0, E: 1 })
    const sum = Object.values(byCat).reduce((a, b) => a + b, 0)
    expect(sum).toBe(eventCounts(events, '2026-09-26').total)
    expect(() => eventCategoryCounts(events, '2026-09-26', () => 'F' as 'A')).toThrow(RangeError)
  })
})

describe('tone (docs/05 §7, banned-words.txt)', () => {
  const lm = loadMethodology(REPO_ROOT)
  const matcher = compileBannedWords(lm.bannedWords?.entries ?? [])

  it('the banned-word list is loaded', () => {
    expect(lm.bannedWords?.entries.length).toBeGreaterThan(80)
  })

  it('every indicator has a short label in both languages, free of banned words', () => {
    expect(Object.keys(INDICATOR_LABELS).sort()).toEqual(m.indicators.map((i) => i.id).sort())
    for (const [id, label] of Object.entries(INDICATOR_LABELS)) {
      expect(findBannedWords(label.en, matcher), `${id} en`).toEqual([])
      expect(findBannedWords(label.fr, matcher), `${id} fr`).toEqual([])
      expect(label.en).not.toMatch(/!/)
    }
  })

  it('generated lines contain no banned word', () => {
    for (const id of Object.keys(INDICATOR_LABELS)) {
      for (const change of ['start', 'end', 'expire'] as const) {
        const input = { ...base, lastChange: { ...vote, indicator: id, change } }
        for (const lang of ['en', 'fr'] as const) {
          expect(findBannedWords(summaryLine(input, lang), matcher)).toEqual([])
        }
      }
    }
  })
})
