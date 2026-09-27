/**
 * Identifier patterns and helpers (ids.ts, docs/03 §2): every documented pattern with its
 * examples, parse/format round trips, the ids the patterns must reject, slugify and nextEventId.
 */
import { describe, expect, it } from 'vitest'
import {
  compactToIso,
  formatCorrectionId,
  formatEventId,
  formatLeadId,
  formatReplyId,
  formatSourceId,
  ID_PATTERNS,
  type IdKind,
  isoToCompact,
  isValidId,
  isValidSlug,
  nextEventId,
  parseCorrectionId,
  parseEventId,
  parseLeadId,
  parseReplyId,
  parseSourceId,
  slugify,
} from './ids.js'

const SLUG_41 = 'a'.repeat(41)
const SLUG_40 = 'a'.repeat(40)

describe('documented examples (docs/03 §2)', () => {
  it('event evt_2025_08_08_DEU_A6', () => {
    expect(parseEventId('evt_2025_08_08_DEU_A6')).toEqual({
      date: '2025-08-08',
      iso3: 'DEU',
      indicator: 'A6',
      n: 1,
      generated: false,
    })
    expect(ID_PATTERNS.event.test('evt_2025_08_08_DEU_A6')).toBe(true)
  })

  it('event with an instance suffix evt_2024_03_26_USA_B10_2', () => {
    expect(parseEventId('evt_2024_03_26_USA_B10_2')).toEqual({
      date: '2024-03-26',
      iso3: 'USA',
      indicator: 'B10',
      n: 2,
      generated: false,
    })
  })

  it('generated event evt_2023_10_27_FRA_B1_es-10-21', () => {
    expect(parseEventId('evt_2023_10_27_FRA_B1_es-10-21')).toEqual({
      date: '2023-10-27',
      iso3: 'FRA',
      indicator: 'B1',
      n: 1,
      slug: 'es-10-21',
      generated: true,
    })
    expect(ID_PATTERNS.generatedEvent.test('evt_2023_10_27_FRA_B1_es-10-21')).toBe(true)
    expect(ID_PATTERNS.event.test('evt_2023_10_27_FRA_B1_es-10-21')).toBe(false)
  })

  it('source src_20250808_bundesregierung_ruestungsexporte', () => {
    expect(parseSourceId('src_20250808_bundesregierung_ruestungsexporte')).toEqual({
      date: '2025-08-08',
      segments: ['bundesregierung', 'ruestungsexporte'],
    })
  })

  it('dataset source src_20240311_sipri_at_2023', () => {
    expect(parseSourceId('src_20240311_sipri_at_2023')).toEqual({
      date: '2024-03-11',
      segments: ['sipri', 'at', '2023'],
    })
  })

  it('the fixture source ids, whose topic slug has hyphens', () => {
    expect(parseSourceId('src_20250808_bundesregierung_ruestungsexporte-gaza')?.segments).toEqual([
      'bundesregierung',
      'ruestungsexporte-gaza',
    ])
    expect(
      isValidId('source', 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'),
    ).toBe(true)
  })

  it('reply rep_20261102_DEU_1', () => {
    expect(parseReplyId('rep_20261102_DEU_1')).toEqual({ date: '2026-11-02', iso3: 'DEU', n: 1 })
  })

  it('correction cor_20261015_1', () => {
    expect(parseCorrectionId('cor_20261015_1')).toEqual({ date: '2026-10-15', n: 1 })
  })

  it('lead lead_20261015_DEU_1', () => {
    expect(parseLeadId('lead_20261015_DEU_1')).toEqual({ date: '2026-10-15', iso3: 'DEU', n: 1 })
  })

  it('multi-digit instance numbers', () => {
    expect(parseEventId('evt_2024_03_26_USA_B10_12')?.n).toBe(12)
    expect(parseReplyId('rep_20261102_DEU_10')?.n).toBe(10)
    expect(parseCorrectionId('cor_20261015_23')?.n).toBe(23)
    expect(parseLeadId('lead_20261015_DEU_100')?.n).toBe(100)
  })

  it('every indicator id of the methodology is accepted (A1–A8, B1–B12, C1–C6, D1–D5, E1–E3)', () => {
    const ids = [
      ...Array.from({ length: 8 }, (_, i) => `A${i + 1}`),
      ...Array.from({ length: 12 }, (_, i) => `B${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `C${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `D${i + 1}`),
      ...Array.from({ length: 3 }, (_, i) => `E${i + 1}`),
    ]
    for (const ind of ids) {
      expect(parseEventId(`evt_2025_01_02_DEU_${ind}`)?.indicator, ind).toBe(ind)
    }
  })
})

describe('round trips', () => {
  it.each([
    'evt_2025_08_08_DEU_A6',
    'evt_2024_03_26_USA_B10_2',
    'evt_2024_03_26_USA_B10_17',
    'evt_2023_10_27_FRA_B1_es-10-21',
    'evt_2025_01_01_DEU_A1_sipri-2024',
  ])('formatEventId(parseEventId(%s))', (id) => {
    const parsed = parseEventId(id)
    expect(parsed).not.toBeNull()
    if (!parsed) return
    const parts = parsed.generated
      ? { date: parsed.date, iso3: parsed.iso3, indicator: parsed.indicator, slug: parsed.slug }
      : { date: parsed.date, iso3: parsed.iso3, indicator: parsed.indicator, n: parsed.n }
    expect(formatEventId(parts as Parameters<typeof formatEventId>[0])).toBe(id)
  })

  it.each([
    'src_20250808_bundesregierung_ruestungsexporte',
    'src_20240311_sipri_at_2023',
    'src_20250808_bundesregierung_ruestungsexporte-gaza',
  ])('formatSourceId(parseSourceId(%s))', (id) => {
    const parsed = parseSourceId(id)
    expect(parsed).not.toBeNull()
    if (parsed) expect(formatSourceId(parsed)).toBe(id)
  })

  it('reply, correction and lead ids', () => {
    const rep = parseReplyId('rep_20261102_DEU_1')
    const cor = parseCorrectionId('cor_20261015_1')
    const lead = parseLeadId('lead_20261015_DEU_3')
    expect(rep && formatReplyId(rep)).toBe('rep_20261102_DEU_1')
    expect(cor && formatCorrectionId(cor)).toBe('cor_20261015_1')
    expect(lead && formatLeadId(lead)).toBe('lead_20261015_DEU_3')
  })

  it('compact and ISO dates', () => {
    expect(compactToIso('20250808')).toBe('2025-08-08')
    expect(isoToCompact('2025-08-08')).toBe('20250808')
    expect(isoToCompact(compactToIso('20240229'))).toBe('20240229')
  })

  it('formatEventId writes n = 1 (or no n) as the bare id', () => {
    const parts = { date: '2025-08-08', iso3: 'DEU', indicator: 'A6' }
    expect(formatEventId(parts)).toBe('evt_2025_08_08_DEU_A6')
    expect(formatEventId({ ...parts, n: 1 })).toBe('evt_2025_08_08_DEU_A6')
    expect(formatEventId({ ...parts, n: 3 })).toBe('evt_2025_08_08_DEU_A6_3')
  })

  it('formatEventId refuses an invalid instance or slug', () => {
    const parts = { date: '2025-08-08', iso3: 'DEU', indicator: 'A6' }
    expect(() => formatEventId({ ...parts, n: 0 })).toThrow('invalid instance 0')
    expect(() => formatEventId({ ...parts, n: 2.5 })).toThrow('invalid instance 2.5')
    expect(() => formatEventId({ ...parts, slug: 'ES-10-21' })).toThrow('invalid slug')
    expect(() => formatEventId({ ...parts, slug: SLUG_41 })).toThrow('invalid slug')
  })

  it('formatSourceId refuses a single segment or an invalid slug', () => {
    expect(() => formatSourceId({ date: '2025-08-08', segments: ['bundesregierung'] })).toThrow(
      'at least two slug segments',
    )
    expect(() => formatSourceId({ date: '2025-08-08', segments: ['Bund', 'x'] })).toThrow(
      'invalid slug "Bund"',
    )
  })
})

describe('rejected ids', () => {
  it('impossible dates in every kind', () => {
    expect(parseEventId('evt_2025_02_30_DEU_A6')).toBeNull()
    expect(parseEventId('evt_2025_02_30_DEU_B1_es-10-21')).toBeNull()
    expect(parseEventId('evt_2025_13_01_DEU_A6')).toBeNull()
    expect(parseEventId('evt_2023_02_29_DEU_A6')).toBeNull()
    expect(parseEventId('evt_2024_02_29_DEU_A6')).not.toBeNull()
    expect(parseSourceId('src_20250231_bundesregierung_ruestungsexporte')).toBeNull()
    expect(parseReplyId('rep_20250231_DEU_1')).toBeNull()
    expect(parseCorrectionId('cor_20250231_1')).toBeNull()
    expect(parseLeadId('lead_20250231_DEU_1')).toBeNull()
    expect(parseSourceId('src_20250800_bundesregierung_ruestungsexporte')).toBeNull()
  })

  it('event instance suffixes _1 and _0 (the first event keeps the bare id)', () => {
    for (const id of ['evt_2025_08_08_DEU_A6_1', 'evt_2025_08_08_DEU_A6_0']) {
      expect(parseEventId(id), id).toBeNull()
      expect(isValidId('event', id), id).toBe(false)
      expect(isValidId('generatedEvent', id), id).toBe(false)
    }
    expect(parseEventId('evt_2025_08_08_DEU_A6_02')).toBeNull()
  })

  it('zero or leading-zero numbers in reply, correction and lead ids', () => {
    expect(parseReplyId('rep_20261102_DEU_0')).toBeNull()
    expect(parseCorrectionId('cor_20261015_0')).toBeNull()
    expect(parseCorrectionId('cor_20261015_01')).toBeNull()
    expect(parseLeadId('lead_20261015_DEU_0')).toBeNull()
  })

  it('lowercase or wrong-length ISO3', () => {
    expect(parseEventId('evt_2025_08_08_deu_A6')).toBeNull()
    expect(parseEventId('evt_2025_08_08_DE_A6')).toBeNull()
    expect(parseReplyId('rep_20261102_deu_1')).toBeNull()
    expect(parseLeadId('lead_20261015_Deu_1')).toBeNull()
  })

  it('indicator ids outside A–E × 1–12 (F1, A0, B13)', () => {
    for (const ind of ['F1', 'A0', 'B13', 'a6', 'A06']) {
      expect(parseEventId(`evt_2025_08_08_DEU_${ind}`), ind).toBeNull()
      expect(parseEventId(`evt_2025_08_08_DEU_${ind}_es-10-21`), ind).toBeNull()
    }
  })

  it('generated slugs over 40 characters, uppercase or with underscores', () => {
    expect(parseEventId(`evt_2023_10_27_FRA_B1_${SLUG_40}`)?.slug).toBe(SLUG_40)
    expect(parseEventId(`evt_2023_10_27_FRA_B1_${SLUG_41}`)).toBeNull()
    expect(parseEventId('evt_2023_10_27_FRA_B1_ES-10-21')).toBeNull()
    expect(parseEventId('evt_2023_10_27_FRA_B1_es_10_21')).toBeNull()
    expect(parseEventId('evt_2023_10_27_FRA_B1_es--10')).toBeNull()
    expect(parseEventId('evt_2023_10_27_FRA_B1_-es')).toBeNull()
  })

  it('source slugs over 40 characters or uppercase, and a single segment', () => {
    expect(parseSourceId(`src_20250808_${SLUG_40}_x`)).not.toBeNull()
    expect(parseSourceId(`src_20250808_${SLUG_41}_x`)).toBeNull()
    expect(parseSourceId(`src_20250808_bundesregierung_${SLUG_41}`)).toBeNull()
    expect(parseSourceId('src_20250808_Bundesregierung_ruestungsexporte')).toBeNull()
    expect(parseSourceId('src_20250808_bundesregierung')).toBeNull()
    expect(parseSourceId('src_20250808_bundesregierung_')).toBeNull()
    expect(parseSourceId('src_2025080_bundesregierung_x')).toBeNull()
  })

  it('wrong prefixes and trailing text', () => {
    expect(parseEventId('ev_2025_08_08_DEU_A6')).toBeNull()
    expect(parseEventId('evt_20250808_DEU_A6')).toBeNull()
    expect(parseEventId(' evt_2025_08_08_DEU_A6')).toBeNull()
    expect(parseSourceId('source_20250808_a_b')).toBeNull()
    expect(parseReplyId('rep_20261102_DEU_1_x')).toBeNull()
    expect(parseCorrectionId('cor_2026-10-15_1')).toBeNull()
  })
})

describe('isValidId per kind', () => {
  const valid: Record<IdKind, string> = {
    event: 'evt_2024_03_26_USA_B10_2',
    generatedEvent: 'evt_2023_10_27_FRA_B1_es-10-21',
    source: 'src_20240311_sipri_at_2023',
    reply: 'rep_20261102_DEU_1',
    correction: 'cor_20261015_1',
    lead: 'lead_20261015_DEU_1',
  }
  const kinds = Object.keys(valid) as IdKind[]

  it.each(kinds)('%s accepts its example and rejects every other kind', (kind) => {
    for (const other of kinds) {
      expect(isValidId(kind, valid[other]), `${kind} vs ${valid[other]}`).toBe(kind === other)
    }
  })

  it('a hand id is not a generated id and the reverse', () => {
    expect(isValidId('event', 'evt_2025_08_08_DEU_A6')).toBe(true)
    expect(isValidId('generatedEvent', 'evt_2025_08_08_DEU_A6')).toBe(false)
    expect(isValidId('event', 'evt_2025_01_01_DEU_A1_sipri-2024')).toBe(false)
  })

  it('pattern matches with impossible dates are invalid', () => {
    expect(ID_PATTERNS.reply.test('rep_20250231_DEU_1')).toBe(true)
    expect(isValidId('reply', 'rep_20250231_DEU_1')).toBe(false)
    expect(isValidId('event', 'evt_2025_02_30_DEU_A6')).toBe(false)
  })
})

describe('slugs', () => {
  it('isValidSlug', () => {
    expect(isValidSlug('ruestungsexporte-gaza')).toBe(true)
    expect(isValidSlug('2023')).toBe(true)
    expect(isValidSlug(SLUG_40)).toBe(true)
    expect(isValidSlug(SLUG_41)).toBe(false)
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug('Gaza')).toBe(false)
    expect(isValidSlug('a_b')).toBe(false)
    expect(isValidSlug('a--b')).toBe(false)
    expect(isValidSlug('-a')).toBe(false)
    expect(isValidSlug('a-')).toBe(false)
  })

  it('slugify strips diacritics', () => {
    expect(slugify('Rüstungsexporte')).toBe('rustungsexporte')
    expect(slugify('Ministère des Affaires étrangères')).toBe('ministere-des-affaires-etrangeres')
    expect(slugify('Łódź, Dışişleri Bakanlığı')).toBe('lodz-disisleri-bakanligi')
  })

  it('slugify transliterates ß, æ, œ, ø, đ, þ', () => {
    expect(slugify('Straße')).toBe('strasse')
    expect(slugify('STRAẞE')).toBe('strasse')
    expect(slugify('Æble Œuvre Ørsted')).toBe('aeble-oeuvre-orsted')
    expect(slugify('Đakovo Þingvellir')).toBe('dakovo-thingvellir')
  })

  it('slugify collapses spaces and punctuation to single hyphens', () => {
    expect(slugify('  A/RES/ES-10/21  ')).toBe('a-res-es-10-21')
    expect(slugify('S/2023/773')).toBe('s-2023-773')
    expect(slugify("Foreign & Commonwealth — Office's note!")).toBe(
      'foreign-commonwealth-office-s-note',
    )
    expect(slugify('under_score')).toBe('under-score')
    expect(slugify('—!?')).toBe('')
  })

  it('slugify trims to 40 characters without a trailing hyphen', () => {
    const text = 'Bundesministerium für wirtschaftliche Zusammenarbeit und Entwicklung'
    const slug = slugify(text)
    // A hard cut at 40 characters, not at a word boundary.
    expect(slug).toBe('bundesministerium-fur-wirtschaftliche-zu')
    expect(slug.length).toBeLessThanOrEqual(40)
    expect(isValidSlug(slug)).toBe(true)
    // The 40th character is a hyphen: it is dropped.
    const edge = `${'a'.repeat(39)} bcd`
    expect(slugify(edge)).toBe('a'.repeat(39))
    expect(slugify('abc def', 4)).toBe('abc')
    expect(slugify('a'.repeat(50))).toBe(SLUG_40)
  })

  it('slugify output is always a valid slug or empty', () => {
    for (const text of [
      'Élysée',
      'x'.repeat(80),
      'Ministry of Foreign Affairs of Türkiye',
      '١٢٣ abc',
    ]) {
      const s = slugify(text)
      expect(s === '' || isValidSlug(s), text).toBe(true)
    }
  })
})

describe('nextEventId', () => {
  const parts = { date: '2025-08-08', iso3: 'DEU', indicator: 'A6' }

  it('the bare id when the day has no event yet', () => {
    expect(nextEventId([], parts)).toBe('evt_2025_08_08_DEU_A6')
    expect(nextEventId(['evt_2025_08_08_DEU_A7', 'evt_2025_08_09_DEU_A6'], parts)).toBe(
      'evt_2025_08_08_DEU_A6',
    )
  })

  it('_2, then _3, after the bare id', () => {
    expect(nextEventId(['evt_2025_08_08_DEU_A6'], parts)).toBe('evt_2025_08_08_DEU_A6_2')
    expect(nextEventId(['evt_2025_08_08_DEU_A6', 'evt_2025_08_08_DEU_A6_2'], parts)).toBe(
      'evt_2025_08_08_DEU_A6_3',
    )
  })

  it('the first gap', () => {
    expect(nextEventId(['evt_2025_08_08_DEU_A6', 'evt_2025_08_08_DEU_A6_3'], parts)).toBe(
      'evt_2025_08_08_DEU_A6_2',
    )
  })

  it('accepts any iterable, and the result parses back to the same parts', () => {
    const taken = new Set(['evt_2025_08_08_DEU_A6'])
    const id = nextEventId(taken.values(), parts)
    expect(parseEventId(id)).toMatchObject({ ...parts, n: 2, generated: false })
  })
})
