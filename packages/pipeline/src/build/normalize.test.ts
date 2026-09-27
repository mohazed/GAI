import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ApiCorrection,
  ApiEvent,
  ApiReply,
  ApiScoredCountry,
  ApiSource,
  type Country,
  type Event,
  loadDataset,
  loadMethodology,
  type Source,
} from '@gai/schema'
import { createScorer, type EventEvaluation } from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import { scoringMethodology } from '../methodology.js'
import {
  isPublicStatus,
  previousComputedPoints,
  registryFields,
  toApiCorrection,
  toApiEvent,
  toApiReply,
  toApiSource,
} from './normalize.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const M = loadMethodology(REPO_ROOT)
const SCORING = scoringMethodology(M)
const FIXTURES = loadDataset(resolve(REPO_ROOT, 'fixtures'))
const FIXTURE_EVENT = FIXTURES.events[0]?.value as Event
const FIXTURE_REPLY = FIXTURES.replies[0]?.value
const FIXTURE_CORRECTION = FIXTURES.corrections[0]?.value
const DEU = FIXTURES.countries.find((c) => c.value.iso3 === 'DEU')?.value as Country

// Synthetic records: country XXA is an ISO 3166 user-assigned code, never a real state.
const SRC = 'src_20250101_test_synthetic-row'

function synthetic(
  over: Partial<Event> & Pick<Event, 'id' | 'indicator' | 'type' | 'date' | 'points'>,
): Event {
  return {
    revision: 1,
    country: 'XXA',
    confidence: 'confirmed',
    scope: ['gaza'],
    summary: { en: 'Synthetic test event.', fr: 'Événement de test synthétique.' },
    evidence: [
      { source: SRC, quote: 'synthetic row', quote_lang: 'en', locator: 'row 2 of test data' },
    ],
    status: 'published',
    review: { drafted_by: 'test', drafted_at: '2025-01-01' },
    ...over,
  }
}

/** The evaluation of `e` at `date` from the real engine and methodology. */
function evaluation(events: readonly Event[], e: Event, date: string): EventEvaluation {
  const ev = createScorer(e.country, events, SCORING)
    .at(date)
    .events.find((x) => x.id === e.id)
  if (ev === undefined) throw new Error(`no evaluation of ${e.id}`)
  return ev
}

function info(events: readonly Event[], e: Event, date: string) {
  return {
    methodology: M,
    evaluation: evaluation(events, e, date),
    previousPoints: null,
    corrections: [],
    replies: [],
  }
}

describe('toApiSource', () => {
  it('publishes a fixture source with every optional field present', () => {
    const s = FIXTURES.sources[0]?.value as Source
    const out = toApiSource(s)
    expect(ApiSource.parse(out)).toEqual(out)
    expect(out.id).toBe(s.id)
    expect(out.archive_status).toBe('archived')
    expect(out.archive_url_alt).toBeNull()
    expect(out.excerpt).toBeNull()
    expect(out.origin).toBeNull()
    expect(typeof out.notes).toBe('string')
    expect(Object.keys(out).sort()).toEqual(Object.keys(ApiSource.shape).sort())
  })

  it('keeps the optional fields a dataset-row source carries', () => {
    const s: Source = {
      id: 'src_20250102_test_synthetic-table',
      kind: 'dataset',
      title: 'Synthetic table',
      publisher: 'Test',
      publisher_type: 'dataset',
      url: 'data/structured/gni.csv',
      wayback_url: null,
      archive_status: 'failed',
      archive_url_alt: 'https://example.org/alt',
      sha256: null,
      bytes: null,
      content_type: null,
      retrieved_at: null,
      language: 'en',
      date: '2025-01-02',
      text_file: null,
      excerpt: 'XXA,2024,1000,src_20250101_test_synthetic-row',
      origin: SRC,
    }
    const out = toApiSource(s)
    expect(ApiSource.parse(out)).toEqual(out)
    expect(out).toMatchObject({
      archive_status: 'failed',
      archive_url_alt: 'https://example.org/alt',
      excerpt: 'XXA,2024,1000,src_20250101_test_synthetic-row',
      origin: SRC,
      notes: null,
      wayback_url: null,
      sha256: null,
    })
  })
})

describe('toApiEvent', () => {
  const events = [FIXTURE_EVENT]

  it('publishes the fixture event with its evaluation while it holds', () => {
    const out = toApiEvent(FIXTURE_EVENT, {
      ...info(events, FIXTURE_EVENT, '2025-09-01'),
      corrections: ['cor_20260927_1'],
      replies: ['rep_20260927_DEU_1'],
    })
    expect(ApiEvent.parse(out)).toEqual(out)
    expect(out.indicator_name).toEqual(M.indicatorById.get('A6')?.name)
    expect(out.category).toBe('A')
    expect(out.end).toBe('2025-11-24')
    expect(out.points_rationale).toBeNull()
    expect(out.actor).toEqual({
      en: 'Federal Chancellor',
      fr: 'Chancelier fédéral',
      name: 'Friedrich Merz',
    })
    expect(out.evidence[0]?.quote_en).toMatch(/^Under these circumstances/)
    expect(out.evidence[0]?.quote_fr).toBeNull()
    expect(out.supersedes).toBeNull()
    expect(out.related).toEqual([])
    expect(out.generated).toBe(false)
    expect(out.review.second_read).toEqual({
      by: 'claude-opus-5-5',
      at: '2026-09-27',
      verdict: 'agree',
      notes: null,
    })
    expect(out.review.reviewed_by).toBe('fixture')
    expect(out.scored).toBe(true)
    // Standing, confirmed (w = 1), 10 points, holding on 2025-09-01; A never qualifies (§6).
    expect(out.at_build).toEqual({
      reason: 'counted',
      factor: 1,
      weight: 1,
      value: 10,
      counted: 10,
      qualifies: false,
      by: null,
    })
    expect(out.previous_points).toBeNull()
    expect(out.corrections).toEqual(['cor_20260927_1'])
    expect(out.replies).toEqual(['rep_20260927_DEU_1'])
  })

  it('reads at_build at the build date: the state ended on 2025-11-24', () => {
    const out = toApiEvent(FIXTURE_EVENT, info(events, FIXTURE_EVENT, '2026-09-27'))
    expect(out.at_build).toEqual({
      reason: 'ended',
      factor: 0,
      weight: 1,
      value: 0,
      counted: 0,
      qualifies: false,
      by: null,
    })
  })

  it('writes null for every absent optional field and sorts the id lists', () => {
    const e = synthetic({
      id: 'evt_2025_03_01_XXA_B9',
      indicator: 'B9',
      type: 'repeatable',
      date: '2025-03-01',
      points: 2,
      review: {
        drafted_by: 'test',
        drafted_at: '2025-03-02',
        second_read: { by: 'test', at: '2025-03-02', verdict: 'agree', notes: 'Checked.' },
      },
    })
    const out = toApiEvent(e, {
      ...info([e], e, '2025-03-01'),
      corrections: ['cor_20250402_2', 'cor_20250401_1', 'cor_20250401_10'],
      replies: ['rep_20250402_XXA_1', 'rep_20250401_XXA_2'],
    })
    expect(ApiEvent.parse(out)).toEqual(out)
    expect(out).toMatchObject({
      end: null,
      points_rationale: null,
      actor: null,
      supersedes: null,
      related: [],
      generated: false,
      previous_points: null,
    })
    expect(out.evidence).toEqual([
      {
        source: SRC,
        quote: 'synthetic row',
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: 'row 2 of test data',
      },
    ])
    expect(out.review).toEqual({
      drafted_by: 'test',
      drafted_at: '2025-03-02',
      second_read: { by: 'test', at: '2025-03-02', verdict: 'agree', notes: 'Checked.' },
      reviewed_by: null,
      reviewed_at: null,
      notes: null,
    })
    expect(out.corrections).toEqual(['cor_20250401_1', 'cor_20250401_10', 'cor_20250402_2'])
    expect(out.replies).toEqual(['rep_20250401_XXA_2', 'rep_20250402_XXA_1'])
    // B9 qualifies against passivity: +2 at w = 1 on its own day is ≥ 2 (docs/02 §6).
    expect(out.at_build).toMatchObject({ reason: 'counted', value: 2, qualifies: true })
  })

  it('writes an actor without a name as name null, and keeps related and supersedes', () => {
    const e = synthetic({
      id: 'evt_2025_03_01_XXA_A7',
      indicator: 'A7',
      type: 'standing',
      date: '2025-03-01',
      points: 25,
      actor: { en: 'The government', fr: 'Le gouvernement' },
      supersedes: 'evt_2025_01_01_XXA_A6',
      related: ['evt_2025_03_01_XXB_A7'],
      points_rationale: 'Synthetic rationale.',
    })
    const out = toApiEvent(e, info([e], e, '2025-03-01'))
    expect(ApiEvent.parse(out)).toEqual(out)
    expect(out.actor).toEqual({ en: 'The government', fr: 'Le gouvernement', name: null })
    expect(out.supersedes).toBe('evt_2025_01_01_XXA_A6')
    expect(out.related).toEqual(['evt_2025_03_01_XXB_A7'])
    expect(out.points_rationale).toBe('Synthetic rationale.')
    expect(out.end).toBeNull()
  })

  it('is scored only when published, scoped to gaza and of a scored indicator', () => {
    const base = {
      id: 'evt_2025_03_01_XXA_A6',
      indicator: 'A6',
      type: 'standing' as const,
      date: '2025-03-01',
      points: 10,
    }
    const cases: [Event, boolean][] = [
      [synthetic(base), true],
      [synthetic({ ...base, status: 'retracted' }), false],
      [synthetic({ ...base, status: 'corrected' }), false],
      [synthetic({ ...base, scope: ['region', 'related'] }), false],
      [synthetic({ ...base, scope: ['region', 'gaza'] }), true],
      [
        synthetic({
          id: 'evt_2025_03_01_XXA_E1',
          indicator: 'E1',
          type: 'repeatable',
          date: '2025-03-01',
          points: 2,
        }),
        false,
      ],
    ]
    for (const [e, scored] of cases) {
      expect(toApiEvent(e, info([e], e, '2025-03-01')).scored).toBe(scored)
    }
  })

  it('keeps previous_points for computed events only', () => {
    const c = synthetic({
      id: 'evt_2025_03_11_XXA_A1_tiv-2024',
      indicator: 'A1',
      type: 'computed',
      date: '2025-03-11',
      end: null,
      points: -12,
      generated: true,
    })
    const out = toApiEvent(c, { ...info([c], c, '2025-03-11'), previousPoints: -8 })
    expect(ApiEvent.parse(out)).toEqual(out)
    expect(out.previous_points).toBe(-8)
    expect(out.generated).toBe(true)
    const r = synthetic({
      id: 'evt_2025_03_01_XXA_B9',
      indicator: 'B9',
      type: 'repeatable',
      date: '2025-03-01',
      points: 2,
    })
    expect(
      toApiEvent(r, { ...info([r], r, '2025-03-01'), previousPoints: 5 }).previous_points,
    ).toBe(null)
  })

  it('refuses an unknown indicator and an evaluation of another event', () => {
    const e = synthetic({
      id: 'evt_2025_03_01_XXA_A6',
      indicator: 'A6',
      type: 'standing',
      date: '2025-03-01',
      points: 10,
    })
    const i = info([e], e, '2025-03-01')
    expect(() => toApiEvent({ ...e, indicator: 'A9' }, i)).toThrow(/A9 is not in methodology/)
    expect(() => toApiEvent({ ...e, id: 'evt_2025_03_01_XXA_A6_2' }, i)).toThrow(/evaluation of/)
  })
})

describe('previousComputedPoints', () => {
  const c = (
    id: string,
    country: string,
    indicator: string,
    date: string,
    end: string | null,
    points: number,
  ) => synthetic({ id, country, indicator, type: 'computed', date, points, end })

  it('gives each computed event the points of the value in force the day before', () => {
    const events = [
      c('evt_2025_03_11_XXA_A1_tiv-2024', 'XXA', 'A1', '2025-03-11', '2026-03-09', -12),
      c('evt_2024_03_11_XXA_A1_tiv-2023', 'XXA', 'A1', '2024-03-11', '2025-03-11', -8),
      c('evt_2026_03_09_XXA_A1_tiv-2025', 'XXA', 'A1', '2026-03-09', null, -12),
      c('evt_2025_03_11_XXB_A1_tiv-2024', 'XXB', 'A1', '2025-03-11', null, -4),
      c('evt_2025_02_01_XXA_D1_fts', 'XXA', 'D1', '2025-02-01', '2025-03-01', 3),
      c('evt_2025_03_01_XXA_D1_fts', 'XXA', 'D1', '2025-03-01', '2025-04-01', 6),
      // A month without funding (no row), then a new value: no value was in force on 2025-04-30.
      c('evt_2025_05_01_XXA_D1_fts', 'XXA', 'D1', '2025-05-01', '2025-06-01', 6),
      // Same date: by id; the self report's window does not follow the mirror's.
      c('evt_2025_03_01_XXA_C3_comtrade-2024-mirror', 'XXA', 'C3', '2025-03-01', '2025-03-01', -3),
      c('evt_2025_03_01_XXA_C3_comtrade-2024-self', 'XXA', 'C3', '2025-03-01', null, -2),
      synthetic({
        id: 'evt_2025_03_01_XXA_B9',
        indicator: 'B9',
        type: 'repeatable',
        date: '2025-03-01',
        points: 2,
      }),
    ]
    const before = events.map((e) => e.id)
    const out = previousComputedPoints(events)
    expect(Object.fromEntries(out)).toEqual({
      'evt_2024_03_11_XXA_A1_tiv-2023': null,
      'evt_2025_03_11_XXA_A1_tiv-2024': -8,
      'evt_2026_03_09_XXA_A1_tiv-2025': -12,
      'evt_2025_03_11_XXB_A1_tiv-2024': null,
      evt_2025_02_01_XXA_D1_fts: null,
      evt_2025_03_01_XXA_D1_fts: 3,
      evt_2025_05_01_XXA_D1_fts: null,
      'evt_2025_03_01_XXA_C3_comtrade-2024-mirror': null,
      'evt_2025_03_01_XXA_C3_comtrade-2024-self': -3,
      evt_2025_03_01_XXA_B9: null,
    })
    // The input is not reordered.
    expect(events.map((e) => e.id)).toEqual(before)
  })

  it('returns an empty map for no events', () => {
    expect(previousComputedPoints([]).size).toBe(0)
  })
})

describe('toApiReply', () => {
  it('publishes the fixture reply with notes null', () => {
    if (FIXTURE_REPLY === undefined) throw new Error('fixture reply missing')
    const out = toApiReply(FIXTURE_REPLY)
    expect(ApiReply.parse(out)).toEqual(out)
    expect(out.notes).toBeNull()
    expect(out.contests).toEqual(['evt_2025_08_08_DEU_A6'])
    expect(out.outcome).toBe('none')
  })

  it('keeps notes when present', () => {
    if (FIXTURE_REPLY === undefined) throw new Error('fixture reply missing')
    expect(toApiReply({ ...FIXTURE_REPLY, notes: 'Synthetic note.' }).notes).toBe('Synthetic note.')
  })
})

describe('toApiCorrection', () => {
  it('publishes the fixture correction with its country and commit', () => {
    if (FIXTURE_CORRECTION === undefined) throw new Error('fixture correction missing')
    const sha = 'a'.repeat(40)
    const out = toApiCorrection(FIXTURE_CORRECTION, 'DEU', sha)
    expect(ApiCorrection.parse(out)).toEqual(out)
    expect(out).toMatchObject({
      id: 'cor_20260927_1',
      event: 'evt_2025_08_08_DEU_A6',
      country: 'DEU',
      kind: 'correction',
      flagged_by: 'author',
      flagged_ref: 'test fixture',
      commit: sha,
    })
    expect(out.before).toEqual({
      end: null,
      evidence: ['src_20250808_bundesregierung_ruestungsexporte-gaza'],
    })
    expect(out.after).toEqual(FIXTURE_CORRECTION.after)
  })

  it('writes flagged_ref, country and commit as null when absent', () => {
    if (FIXTURE_CORRECTION === undefined) throw new Error('fixture correction missing')
    const { flagged_ref: _, ...rest } = FIXTURE_CORRECTION
    const out = toApiCorrection(rest, null, null)
    expect(ApiCorrection.parse(out)).toEqual(out)
    expect(out.flagged_ref).toBeNull()
    expect(out.country).toBeNull()
    expect(out.commit).toBeNull()
  })
})

describe('registryFields', () => {
  const RegistrySchema = ApiScoredCountry.pick({
    iso3: true,
    iso2: true,
    m49: true,
    name: true,
    region: true,
    subregion: true,
    un_member: true,
    observer: true,
    memberships: true,
    member_of: true,
    recognises_palestine_since: true,
  })

  it('publishes the fixture country without notes or gov_sources', () => {
    const out = registryFields(DEU, '2026-09-27')
    expect(RegistrySchema.parse(out)).toEqual(out)
    expect(out.member_of).toEqual(['eu', 'nato', 'g20', 'g7'])
    expect(out.memberships.unsc).toEqual([])
    expect(out.recognises_palestine_since).toBeNull()
    expect(out).not.toHaveProperty('notes')
    expect(out).not.toHaveProperty('gov_sources')
    expect(out).not.toHaveProperty('excluded')
  })

  // Synthetic registry entry with dated memberships and a Security Council term.
  const XXA: Country = {
    ...DEU,
    iso3: 'XXA',
    iso2: 'XA',
    m49: 999,
    name: { en: 'Test country', fr: 'Pays de test' },
    memberships: {
      unsc: [{ from: '2024-01-01', to: '2025-12-31', permanent: false }],
      eu: { since: '2024-05-01' },
      nato: false,
      arab_league: { since: null, note: 'Synthetic: never joined.' },
      oic: true,
      g20: false,
      g7: false,
      brics: { since: '2024-01-01', until: '2025-06-30', note: 'Synthetic period.' },
    },
    recognises_palestine: { since: '2024-05-28' },
  }

  it('normalises dated memberships to {since, until, note}', () => {
    const out = registryFields(XXA, '2025-01-01')
    expect(RegistrySchema.parse(out)).toEqual(out)
    expect(out.memberships).toEqual({
      unsc: [{ from: '2024-01-01', to: '2025-12-31', permanent: false }],
      eu: { since: '2024-05-01', until: null, note: null },
      nato: false,
      arab_league: { since: null, until: null, note: 'Synthetic: never joined.' },
      oic: true,
      g20: false,
      g7: false,
      brics: { since: '2024-01-01', until: '2025-06-30', note: 'Synthetic period.' },
    })
    expect(out.recognises_palestine_since).toBe('2024-05-28')
  })

  it('resolves member_of at the date, bounds inclusive, in MEMBERSHIP_KEYS order', () => {
    const at = (date: string) => registryFields(XXA, date).member_of
    expect(at('2023-12-31')).toEqual(['oic'])
    expect(at('2024-01-01')).toEqual(['unsc', 'oic', 'brics'])
    expect(at('2024-04-30')).toEqual(['unsc', 'oic', 'brics'])
    expect(at('2024-05-01')).toEqual(['unsc', 'eu', 'oic', 'brics'])
    expect(at('2025-06-30')).toEqual(['unsc', 'eu', 'oic', 'brics'])
    expect(at('2025-07-01')).toEqual(['unsc', 'eu', 'oic'])
    expect(at('2025-12-31')).toEqual(['unsc', 'eu', 'oic'])
    expect(at('2026-01-01')).toEqual(['eu', 'oic'])
  })

  it('treats a term without an end as ongoing (permanent members)', () => {
    const p: Country = {
      ...XXA,
      memberships: {
        ...XXA.memberships,
        unsc: [{ from: '1945-10-24', to: null, permanent: true }],
      },
    }
    expect(registryFields(p, '2026-09-27').member_of[0]).toBe('unsc')
    expect(registryFields(p, '2026-09-27').memberships.unsc).toEqual([
      { from: '1945-10-24', to: null, permanent: true },
    ])
  })
})

describe('isPublicStatus', () => {
  it('is true for published, corrected, superseded and retracted only', () => {
    for (const s of ['published', 'corrected', 'superseded', 'retracted']) {
      expect(isPublicStatus(s)).toBe(true)
    }
    for (const s of ['draft', 'reviewed', '']) expect(isPublicStatus(s)).toBe(false)
  })
})
