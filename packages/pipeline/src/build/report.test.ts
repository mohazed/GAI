/**
 * Tests of the monthly report on a small synthetic month (countries AAA, BBB, CCC; no row here
 * describes a real state or a real act), with the exact Markdown expected in the four variants:
 * English and French, with scores and in scorecard mode.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type ApiChangesMonthFile,
  type ApiCorrection,
  type ApiEvent,
  compileBannedWords,
  findBannedWords,
  loadMethodology,
} from '@gai/schema'
import { roundHalfAwayFromZero } from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import { type ChangesInput, feedEntries, monthFile } from './changes.js'
import { datesBetween } from './dates.js'
import { monthlyReport, type ReportVariant } from './report.js'
import type { DayScore } from './types.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const WINDOW = '2023-10-07'
const BUILD = '2026-09-27'

/** Minus sign, no-break space, narrow no-break space. */
const M = '\u2212'
const NB = '\u00a0'
const NN = '\u202f'

// ---------------------------------------------------------------------------------------------
// A small synthetic month

function days(steps: readonly (readonly [string, number])[]): DayScore[] {
  return datesBetween(WINDOW, BUILD).map((d) => {
    let exact = 0
    for (const [from, value] of steps) if (from <= d) exact = value
    return {
      exact,
      score: roundHalfAwayFromZero(exact, 1),
      display: roundHalfAwayFromZero(exact, 0),
      band: 'passive',
      passivity: false,
      coverage: 0.5,
      clipped: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    }
  })
}

const COUNTRIES = [
  // −13.6 (display −14) on 31 August, −3.6 (−4) from 10 September: +10.
  {
    iso3: 'AAA',
    steps: [
      [WINDOW, 0],
      ['2026-08-01', -13.6],
      ['2026-09-10', -3.6],
    ],
  },
  // 2.6 (display 3) → 0.6 (1) on 15 September: −2.
  {
    iso3: 'BBB',
    steps: [
      [WINDOW, 2.6],
      ['2026-09-15', 0.6],
    ],
  },
  { iso3: 'CCC', steps: [[WINDOW, 0.2]] },
] as const

type EventOver = Partial<ApiEvent> & Pick<ApiEvent, 'id' | 'type' | 'date' | 'points'>

function ev(over: EventOver): ApiEvent {
  const [, , , , country = 'AAA', indicator = 'B9'] = over.id.split('_')
  return {
    revision: 1,
    country,
    indicator,
    indicator_name: { en: `Indicator ${indicator}`, fr: `Indicateur ${indicator}` },
    category: indicator.charAt(0) as ApiEvent['category'],
    end: null,
    points_rationale: null,
    confidence: 'confirmed',
    scope: ['gaza'],
    summary: { en: `Country ${country} took synthetic action.`, fr: `Le pays ${country} a agi.` },
    actor: null,
    evidence: [
      {
        source: 'src_20260901_synthetic_test',
        quote: 'synthetic',
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: 'row 2',
      },
    ],
    status: 'published',
    supersedes: null,
    related: [],
    generated: over.type === 'computed',
    review: {
      drafted_by: 'test',
      drafted_at: '2026-09-01',
      second_read: null,
      reviewed_by: 'test',
      reviewed_at: '2026-09-01',
      notes: null,
    },
    scored: true,
    at_build: {
      reason: 'counted',
      factor: 1,
      weight: 1,
      value: over.points,
      counted: over.points,
      qualifies: false,
      by: null,
    },
    previous_points: null,
    corrections: [],
    replies: [],
    ...over,
  }
}

const EVENTS: ApiEvent[] = [
  // August: not in the September report.
  ev({ id: 'evt_2026_08_31_CCC_B9', type: 'repeatable', date: '2026-08-31', points: 2 }),
  // Week of 31 August: one changed computed value, two unchanged.
  ev({
    id: 'evt_2026_09_01_AAA_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    points: 3,
    previous_points: 3,
  }),
  ev({
    id: 'evt_2026_09_01_BBB_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    points: 1,
    previous_points: 3,
    summary: {
      en: 'Country BBB recorded synthetic value one.',
      fr: 'Le pays BBB a enregistré la valeur synthétique un.',
    },
  }),
  ev({
    id: 'evt_2026_09_01_CCC_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    points: 0,
    previous_points: 0,
  }),
  // Retracted: never listed; its retraction is.
  ev({
    id: 'evt_2026_09_05_CCC_B9',
    type: 'repeatable',
    date: '2026-09-05',
    points: 2,
    status: 'retracted',
  }),
  ev({
    id: 'evt_2026_09_10_AAA_A6',
    type: 'standing',
    date: '2026-09-10',
    points: 10,
    summary: {
      en: 'Country AAA suspended synthetic licences.',
      fr: 'Le pays AAA a suspendu des licences synthétiques.',
    },
  }),
  ev({
    id: 'evt_2026_09_15_BBB_A1_sipri-2026',
    type: 'computed',
    date: '2026-09-15',
    points: -12.6,
    previous_points: -11.3,
    summary: {
      en: 'Country BBB recorded a synthetic share of deliveries.',
      fr: 'Le pays BBB a enregistré une part synthétique des livraisons.',
    },
  }),
  // Week of 21 September: one unchanged computed value only, and an end.
  ev({
    id: 'evt_2026_09_22_AAA_C3_comtrade-2025',
    type: 'computed',
    date: '2026-09-22',
    points: -3,
    previous_points: -3,
  }),
  ev({
    id: 'evt_2023_05_01_CCC_B11',
    type: 'standing',
    date: '2023-05-01',
    end: '2026-09-22',
    points: 10,
    summary: {
      en: 'Country CCC listed synthetic entities.',
      fr: 'Le pays CCC a inscrit des entités synthétiques.',
    },
  }),
]

function cor(
  id: string,
  event: string,
  kind: ApiCorrection['kind'],
  reason: string,
): ApiCorrection {
  return {
    id,
    date: `${id.slice(4, 8)}-${id.slice(8, 10)}-${id.slice(10, 12)}`,
    event,
    country: event.slice(15, 18),
    kind,
    flagged_by: 'author',
    flagged_ref: null,
    before: {},
    after: {},
    reason,
    commit: null,
  }
}

function input(events: readonly ApiEvent[] = EVENTS): ChangesInput {
  return {
    date: BUILD,
    windowStart: WINDOW,
    methodology: '1.0.0',
    countries: COUNTRIES.map((c) => ({
      iso3: c.iso3,
      name: { en: `Country ${c.iso3}`, fr: `Pays ${c.iso3}` },
      days: days(c.steps),
    })),
    events,
    corrections: [
      cor('cor_20260920_1', 'evt_2026_09_05_CCC_B9', 'retraction', 'Synthetic retraction reason.'),
      cor('cor_20260915_1', 'evt_2026_09_10_AAA_A6', 'correction', 'Synthetic correction reason.'),
    ],
    replies: [],
  }
}

function month(m: string, events?: readonly ApiEvent[]): ApiChangesMonthFile {
  const inp = input(events)
  return monthFile(inp, m, feedEntries(inp))
}

const CTX = { indicatorNames: {} }
const EN: ReportVariant = { lang: 'en', scorecard: false }
const FR: ReportVariant = { lang: 'fr', scorecard: false }
const EN_CARD: ReportVariant = { lang: 'en', scorecard: true }
const FR_CARD: ReportVariant = { lang: 'fr', scorecard: true }
const VARIANTS = [EN, FR, EN_CARD, FR_CARD]

const september = month('2026-09')
const july = month('2026-07')
const october = month('2023-10')

// ---------------------------------------------------------------------------------------------
// Exact expected Markdown

const EN_MOVERS = `## Movers

| Country | From | To | Change |
|---|---:|---:|---:|
| Country AAA | ${M}14 | ${M}4 | +10 |
| Country BBB | +3 | +1 | ${M}2 |

`

const EN_BODY = `## New events

### Week of 31 August 2026

- 2026-09-01 · Country BBB · D1 · +1 · Country BBB recorded synthetic value one.

2 computed values recomputed without change (not listed).

### Week of 7 September 2026

- 2026-09-10 · Country AAA · A6 · +10 · Country AAA suspended synthetic licences.

### Week of 14 September 2026

- 2026-09-15 · Country BBB · A1 · ${M}12.6 · Country BBB recorded a synthetic share of deliveries.

### Week of 21 September 2026

1 computed value recomputed without change (not listed).

## Ended

- 2026-09-22 · Country CCC · B11 · +10 · Country CCC listed synthetic entities.

## Corrections

- 2026-09-15 · evt_2026_09_10_AAA_A6 · correction · Synthetic correction reason.
- 2026-09-20 · evt_2026_09_05_CCC_B9 · retraction · Synthetic retraction reason.

## Methodology

Scores for every date are computed with methodology 1.0.0; a new version recomputes the whole history (docs/02 §11).
`

const EN_LINE =
  'Gaza Accountability Index · methodology 1.0.0 · 1 September 2026 to 27 September 2026, month in progress'

const FR_MOVERS = `## Évolutions des scores

| Pays | Avant | Après | Variation |
|---|---:|---:|---:|
| Pays AAA | ${M}14 | ${M}4 | +10 |
| Pays BBB | +3 | +1 | ${M}2 |

`

const FR_BODY = `## Nouveaux événements

### Semaine du 31 août 2026

- 2026-09-01 · Pays BBB · D1 · +1 · Le pays BBB a enregistré la valeur synthétique un.

2 valeurs calculées recalculées sans changement (non listées).

### Semaine du 7 septembre 2026

- 2026-09-10 · Pays AAA · A6 · +10 · Le pays AAA a suspendu des licences synthétiques.

### Semaine du 14 septembre 2026

- 2026-09-15 · Pays BBB · A1 · ${M}12,6 · Le pays BBB a enregistré une part synthétique des livraisons.

### Semaine du 21 septembre 2026

1 valeur calculée recalculée sans changement (non listée).

## Fins

- 2026-09-22 · Pays CCC · B11 · +10 · Le pays CCC a inscrit des entités synthétiques.

## Corrections

- 2026-09-15 · evt_2026_09_10_AAA_A6 · correction · Synthetic correction reason.
- 2026-09-20 · evt_2026_09_05_CCC_B9 · retrait · Synthetic retraction reason.

## Méthodologie

Les scores de chaque date sont calculés avec la méthodologie 1.0.0${NN}; une nouvelle version recalcule toute la série (docs/02 §11).
`

const FR_LINE =
  'Gaza Accountability Index · méthodologie 1.0.0 · du 1er septembre 2026 au 27 septembre 2026, mois en cours'

describe('monthlyReport: the four variants of a month in progress', () => {
  it('English, with scores', () => {
    expect(monthlyReport(september, EN, CTX)).toBe(
      `# Changes, September 2026\n\n${EN_LINE}\n\n${EN_MOVERS}${EN_BODY}`,
    )
  })

  it('French, with scores', () => {
    expect(monthlyReport(september, FR, CTX)).toBe(
      `# Changements, septembre 2026\n\n${FR_LINE}\n\n${FR_MOVERS}${FR_BODY}`,
    )
  })

  it('English, scorecard mode: no movers, a first line saying so', () => {
    expect(monthlyReport(september, EN_CARD, CTX)).toBe(
      `# Changes, September 2026\n\nScorecard mode: scores are not displayed.\n\n${EN_LINE}\n\n${EN_BODY}`,
    )
  })

  it('French, scorecard mode', () => {
    expect(monthlyReport(september, FR_CARD, CTX)).toBe(
      `# Changements, septembre 2026\n\nMode fiche${NB}: les scores ne sont pas affichés.\n\n${FR_LINE}\n\n${FR_BODY}`,
    )
  })
})

describe('monthlyReport: other months', () => {
  it('an empty complete month says so in every section', () => {
    expect(monthlyReport(july, EN, CTX)).toBe(`# Changes, July 2026

Gaza Accountability Index · methodology 1.0.0 · 1 July 2026 to 31 July 2026

## Movers

No display score changed.

## New events

None.

## Ended

None.

## Corrections

None.

## Methodology

Scores for every date are computed with methodology 1.0.0; a new version recomputes the whole history (docs/02 §11).
`)
    expect(monthlyReport(july, FR_CARD, CTX)).toBe(`# Changements, juillet 2026

Mode fiche${NB}: les scores ne sont pas affichés.

Gaza Accountability Index · méthodologie 1.0.0 · du 1er juillet 2026 au 31 juillet 2026

## Nouveaux événements

Aucun.

## Fins

Aucune.

## Corrections

Aucune.

## Méthodologie

Les scores de chaque date sont calculés avec la méthodologie 1.0.0${NN}; une nouvelle version recalcule toute la série (docs/02 §11).
`)
    expect(monthlyReport(july, FR, CTX)).toContain(
      `## Évolutions des scores\n\nAucun score affiché n'a changé.\n\n`,
    )
  })

  it('October 2023 starts on the window start', () => {
    const lines = (v: ReportVariant) => monthlyReport(october, v, CTX).split('\n').slice(0, 3)
    expect(lines(EN)).toEqual([
      '# Changes, October 2023',
      '',
      'Gaza Accountability Index · methodology 1.0.0 · 7 October 2023 to 31 October 2023',
    ])
    expect(lines(FR)).toEqual([
      '# Changements, octobre 2023',
      '',
      'Gaza Accountability Index · méthodologie 1.0.0 · du 7 octobre 2023 au 31 octobre 2023',
    ])
  })

  it('counts over a thousand recomputations with the separators of each language', () => {
    const many = Array.from({ length: 1000 }, (_, i) =>
      ev({
        id: `evt_2026_09_02_AAA_D1_r-${i}`,
        type: 'computed',
        date: '2026-09-02',
        points: 3,
        previous_points: 3,
      }),
    )
    const m = month('2026-09', many)
    expect(m.weeks[0]?.unchanged_computed).toBe(1000)
    expect(monthlyReport(m, EN, CTX)).toContain(
      '### Week of 31 August 2026\n\n1,000 computed values recomputed without change (not listed).\n\n## Ended',
    )
    expect(monthlyReport(m, FR, CTX)).toContain(
      `### Semaine du 31 août 2026\n\n1${NN}000 valeurs calculées recalculées sans changement (non listées).\n\n## Fins`,
    )
  })

  it('writes data text on one line with Markdown markup escaped', () => {
    const e = ev({
      id: 'evt_2026_09_03_AAA_B9',
      type: 'repeatable',
      date: '2026-09-03',
      points: 2,
      summary: {
        en: 'Country AAA set *synthetic* limits_x | <b> [1]\n  second  line',
        fr: `Le pays AAA a fixé des limites${NB}: 5${NN}%.`,
      },
    })
    const m = month('2026-09', [e])
    expect(monthlyReport(m, EN, CTX)).toContain(
      '- 2026-09-03 · Country AAA · B9 · +2 · Country AAA set \\*synthetic\\* limits\\_x \\| \\<b\\> \\[1\\] second line\n',
    )
    // U+00A0 and U+202F are French typography, not whitespace to collapse.
    expect(monthlyReport(m, FR, CTX)).toContain(
      `- 2026-09-03 · Pays AAA · B9 · +2 · Le pays AAA a fixé des limites${NB}: 5${NN}%.\n`,
    )
  })
})

describe('monthlyReport: text rules', () => {
  const methodology = loadMethodology(REPO_ROOT)
  const entries = methodology.bannedWords?.entries ?? []
  const matcher = compileBannedWords(entries)
  const reports = [september, july, october].flatMap((m) =>
    VARIANTS.map((v) => ({
      name: `${m.month} ${v.lang}${v.scorecard ? ' scorecard' : ''}`,
      text: monthlyReport(m, v, CTX),
    })),
  )

  it('contains no banned word in any variant', () => {
    expect(entries.length).toBeGreaterThan(100)
    // The matcher has teeth: it catches the word the French methodology line avoids.
    expect(findBannedWords("recalcule tout l'historique", matcher)).toHaveLength(1)
    for (const r of reports)
      expect([r.name, findBannedWords(r.text, matcher)]).toEqual([r.name, []])
  })

  it('LF line endings, no trailing spaces, one final LF, no exclamation mark', () => {
    for (const r of reports) {
      expect(r.text.includes('\r'), r.name).toBe(false)
      expect(/[ \t]$/m.test(r.text), r.name).toBe(false)
      expect(r.text.endsWith('\n') && !r.text.endsWith('\n\n'), r.name).toBe(true)
      expect(r.text.includes('!'), r.name).toBe(false)
    }
  })

  it('writes negative numbers with the minus sign U+2212', () => {
    for (const r of reports) expect(/(?:· |\| )-\d/.test(r.text), r.name).toBe(false)
    expect(monthlyReport(september, EN, CTX)).toContain(`· ${M}12.6 ·`)
    expect(monthlyReport(september, FR, CTX)).toContain(`· ${M}12,6 ·`)
  })

  it('is deterministic', () => {
    for (const v of VARIANTS) {
      expect(monthlyReport(month('2026-09'), v, CTX)).toBe(monthlyReport(september, v, CTX))
    }
  })
})
