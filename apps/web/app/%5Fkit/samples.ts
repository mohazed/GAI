/**
 * Kit-only samples (dev route /_kit, never built for production). The fixtures hold one real
 * event for one country; every other state the components must draw is made here by changing a
 * copy of a fixture record, and says so: synthetic countries use ISO 3166 user-assigned codes
 * (XAA…XAE) and names starting "Kit sample", and synthetic texts start "Kit sample". Nothing in
 * this file is data about a real state.
 */
import type { ApiCategory, ApiCoverage, ApiEvent, ApiSeriesPoint, ApiSource } from '@gai/schema/api'
import { frenchPunctuation } from '../../lib/format'
import type { CategoryKey, SiteMethodology } from '../../lib/methodology'
import type { RankRow } from '../../lib/rank'

const KIT = { en: 'Kit sample', fr: 'Exemple du kit' }

export function kitName(letter: string) {
  return { en: `${KIT.en} ${letter}`, fr: `${KIT.fr} ${letter}` }
}

/** A copy of a fixture event turned into another state. */
export function variantEvent(
  base: ApiEvent,
  patch: Partial<ApiEvent>,
  note: { en: string; fr: string },
): ApiEvent {
  return {
    ...base,
    ...patch,
    summary: { en: `${KIT.en}: ${note.en}`, fr: frenchPunctuation(`${KIT.fr} : ${note.fr}`) },
  }
}

/**
 * A source for the synthetic events, so that no invented quote or table row appears under the
 * link, Wayback copy or hash of a real document.
 */
export const KIT_SOURCE: ApiSource = {
  id: 'src_20260927_kit_sample',
  kind: 'press',
  title: 'Kit sample source',
  publisher: 'Kit sample source',
  publisher_type: 'press',
  url: 'https://example.org/kit-sample',
  wayback_url: null,
  archive_status: null,
  archive_url_alt: null,
  sha256: null,
  bytes: null,
  content_type: null,
  retrieved_at: null,
  language: 'en',
  date: '2026-09-27',
  text_file: null,
  excerpt: null,
  origin: null,
  notes: 'Synthetic, dev-only kit sample.',
}

export function kitEvents(base: ApiEvent): ApiEvent[] {
  const evidence = [
    {
      ...(base.evidence[0] as ApiEvent['evidence'][number]),
      source: KIT_SOURCE.id,
      quote: 'Kit sample quote, standing in for the words of a single press report.',
      quote_lang: 'en',
      quote_en: null,
      quote_fr: "Citation d'exemple du kit, à la place des mots d'un article de presse.",
      locator: 'paragraph 3',
    },
  ]
  return [
    variantEvent(
      base,
      {
        id: 'evt_2025_09_01_XAA_B9',
        country: 'XAA',
        indicator: 'B9',
        category: 'B',
        type: 'repeatable',
        date: '2025-09-01',
        end: null,
        points: 2,
        confidence: 'reported',
        revision: 1,
        corrections: [],
        replies: [],
        evidence,
        at_build: {
          ...base.at_build,
          reason: 'counted',
          weight: 0.4,
          factor: 1,
          value: 0.8,
          counted: 0.8,
        },
      },
      {
        en: 'a statement calling for a ceasefire, known from one press report.',
        fr: 'une déclaration appelant à un cessez-le-feu, connue par un seul article de presse.',
      },
    ),
    variantEvent(
      base,
      {
        id: 'evt_2025_03_14_XAB_B10',
        country: 'XAB',
        indicator: 'B10',
        category: 'B',
        type: 'repeatable',
        date: '2025-03-14',
        end: null,
        points: -3,
        confidence: 'disputed',
        revision: 1,
        corrections: [],
        replies: ['rep_20260927_DEU_1'],
        evidence,
        at_build: {
          ...base.at_build,
          reason: 'counted',
          weight: 0.4,
          factor: 1,
          value: -1.2,
          counted: -1.2,
        },
      },
      {
        en: 'a statement of support that an official denial contests.',
        fr: 'une déclaration de soutien contestée par un démenti officiel.',
      },
    ),
    variantEvent(
      base,
      {
        id: 'evt_2024_05_02_XAC_C1',
        country: 'XAC',
        indicator: 'C1',
        category: 'C',
        type: 'standing',
        date: '2024-05-02',
        end: null,
        points: 4,
        status: 'retracted',
        evidence,
        revision: 2,
        corrections: ['cor_20260927_1'],
        replies: [],
        at_build: {
          ...base.at_build,
          reason: 'not-published',
          weight: 1,
          factor: 0,
          value: 0,
          counted: 0,
        },
      },
      {
        en: 'a trade review later retracted.',
        fr: 'un réexamen commercial retiré par la suite.',
      },
    ),
    variantEvent(
      base,
      {
        id: 'evt_2024_11_30_XAD_D1_fts-2024',
        country: 'XAD',
        indicator: 'D1',
        category: 'D',
        type: 'computed',
        date: '2024-11-30',
        end: null,
        points: 3,
        generated: true,
        actor: null,
        revision: 1,
        corrections: [],
        replies: [],
        evidence: [
          {
            ...(base.evidence[0] as ApiEvent['evidence'][number]),
            source: KIT_SOURCE.id,
            quote: 'XAD,2024,1234567,USD',
            quote_lang: 'en',
            quote_en: null,
            quote_fr: null,
            locator: 'row 2 of data/structured/fts_funding.csv',
          },
        ],
        at_build: {
          ...base.at_build,
          reason: 'counted',
          weight: 1,
          factor: 1,
          value: 3,
          counted: 3,
        },
      },
      {
        en: 'humanitarian funding generated from a structured table.',
        fr: "financement humanitaire généré à partir d'une table structurée.",
      },
    ),
  ]
}

/** Every assessment status, for the coverage bar. */
export function mixedCoverage(m: SiteMethodology): ApiCoverage {
  const ids = m.indicators.filter((i) => i.scored).map((i) => i.id)
  const statuses: ApiCoverage['statuses'] = {}
  ids.forEach((id, i) => {
    statuses[id] =
      id === 'B2'
        ? 'not-applicable'
        : i < 10
          ? 'has-events'
          : i < 17
            ? 'none-found'
            : i < 22
              ? 'no-data'
              : 'unchecked'
  })
  const of = (s: string) => ids.filter((id) => statuses[id] === s)
  const applicable = ids.length - of('not-applicable').length
  return {
    ratio: (of('has-events').length + of('none-found').length) / applicable,
    applicable,
    has_events: of('has-events').length,
    none_found: of('none-found').length,
    no_data: of('no-data').length,
    unchecked: of('unchecked').length,
    not_applicable: of('not-applicable').length,
    missing: [...of('no-data'), ...of('unchecked')],
    no_data_ids: of('no-data'),
    unchecked_ids: of('unchecked'),
    not_applicable_ids: of('not-applicable'),
    no_export_data: statuses.A1 === 'no-data' || statuses.A2 === 'no-data',
    statuses,
  }
}

/** Subtotals with two categories beyond their caps. */
export function cappedCategories(m: SiteMethodology): Record<CategoryKey, ApiCategory> {
  const raw: Record<CategoryKey, number> = { A: -52, B: 12.5, C: -4, D: 31, E: 3 }
  const out = {} as Record<CategoryKey, ApiCategory>
  for (const c of m.categories) {
    const r = raw[c.id]
    const clipped = Math.max(c.cap.min, Math.min(c.cap.max, r))
    out[c.id] = { raw: r, clipped, cap: c.cap, capped: clipped !== r, scored: c.scored, weight: 1 }
  }
  return out
}

function point(date: string, score: number, band: string): ApiSeriesPoint {
  const z = { raw: 0, clipped: 0 }
  return {
    date,
    score,
    score_display: Math.round(score),
    band,
    passivity_applied: false,
    categories: { A: z, B: z, C: z, D: z, E: z },
    transitions: [],
  }
}

export const KIT_SERIES: { iso3: string; letter: string; points: ApiSeriesPoint[] }[] = [
  {
    iso3: 'XAA',
    letter: 'A',
    points: [
      point('2023-10-07', -15, 'passive'),
      point('2024-02-12', 4, 'acting'),
      point('2024-09-18', 22, 'acting'),
      point('2025-06-01', 46, 'confronting'),
    ],
  },
  {
    iso3: 'XAB',
    letter: 'B',
    points: [
      point('2023-10-07', -15, 'passive'),
      point('2023-12-12', -38, 'enabling'),
      point('2024-10-01', -61, 'sustaining'),
      point('2025-11-20', -44, 'enabling'),
    ],
  },
]

/** Ranking rows for synthetic countries spread over the five bands. */
export function kitRankRows(m: SiteMethodology): RankRow[] {
  const specs: [string, number, string, number][] = [
    ['XAA', 46, 'confronting', 0.81],
    ['XAB', -44, 'enabling', 0.55],
    ['XAC', 12, 'acting', 0.4],
    ['XAD', -63, 'sustaining', 0.9],
    ['XAE', -15, 'passive', 0.12],
  ]
  const cov = mixedCoverage(m)
  return specs.map(([iso3, score, band, coverage], i) => ({
    iso3,
    name: kitName(String.fromCharCode(65 + i)),
    region: i % 2 === 0 ? 'Africa' : 'Asia',
    memberOf: i === 3 ? ['g20'] : [],
    excluded: false,
    excludedReason: null,
    score,
    display: score,
    band,
    clipped: splitScore(score),
    passivityValue: 0,
    coverage,
    statuses: { ...cov.statuses },
    lastChange: `2026-0${(i % 9) + 1}-15`,
    events: 3 + i * 4,
  }))
}

/** Four subtotals summing to `score` within the caps. */
function splitScore(score: number): Record<CategoryKey, number> {
  const a = Math.max(-45, Math.min(30, score * 0.5))
  const b = Math.max(-40, Math.min(45, score * 0.3))
  const c = Math.max(-20, Math.min(20, score * 0.1))
  return { A: a, B: b, C: c, D: score - a - b - c, E: 0 }
}
