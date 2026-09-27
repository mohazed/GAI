/**
 * Tests for the event rules (validate/rules/events.ts). Each rule: the valid fixtures yield no
 * issue of it, and one mutation of the fixtures makes it fire on the expected file and id.
 */
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { issue } from '../../issues.js'
import type { Dataset } from '../../load/dataset.js'
import type { Methodology } from '../../load/methodology.js'
import { addDays } from '../../primitives.js'
import type { Event, Source } from '../../records.js'
import { cloneEvent, fixtureContext, issuesOf, runRules } from '../../testing/harness.js'
import { rules } from './events.js'

const FILE = 'data/events/DEU.yaml'
const FIXTURE_ID = 'evt_2025_08_08_DEU_A6'
const SRC_GAZA = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const SRC_LIFT = 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'

/** Runs every event rule on the fixtures after `mutate`. */
function run(mutate?: (ds: Dataset, m: Methodology) => void) {
  return runRules(rules, fixtureContext(mutate))
}

/** The fixture event (evt_2025_08_08_DEU_A6), mutable inside `mutate`. */
function fixtureEvent(ds: Dataset): Event {
  const e = ds.events[0]
  if (!e) throw new Error('fixture event missing')
  return e.value
}

/** Adds a copy of the fixture event with `patch` applied, in data/events/DEU.yaml. */
function addEvent(ds: Dataset, patch: Partial<Event> & { id: string }): Event {
  const e: Event = { ...cloneEvent(ds), ...patch }
  ds.events.push({ value: e, file: FILE, line: 100 + ds.events.length })
  return e
}

/** A repeatable, hand-authored event of `indicator` with no end. */
function addRepeatable(
  ds: Dataset,
  indicator: string,
  date: string,
  points: number,
  patch: Partial<Event> = {},
): Event {
  const id = patch.id ?? `evt_${date.replaceAll('-', '_')}_DEU_${indicator}`
  return addEvent(ds, { indicator, type: 'repeatable', date, end: null, points, ...patch, id })
}

/** A B9 statement by Friedrich Merz from an official source (valid unless patched). */
function addStatement(ds: Dataset, patch: Partial<Event> & { id: string }): Event {
  return addEvent(ds, {
    indicator: 'B9',
    type: 'repeatable',
    date: '2025-08-08',
    end: null,
    points: 2,
    points_rationale: 'Formal call for a ceasefire (tier call).',
    actor: { en: 'Federal Chancellor', fr: 'Chancelier fédéral', name: 'Friedrich Merz' },
    ...patch,
  })
}

/**
 * Adds a copy of the first fixture source under a new id, as another document: its sha256 is
 * derived from the id unless `patch` sets one.
 */
function addSource(ds: Dataset, id: string, patch: Partial<Source> = {}): Source {
  const base = ds.sources[0]
  if (!base) throw new Error('fixture source missing')
  const sha256 = createHash('sha256').update(id).digest('hex')
  const s: Source = { ...structuredClone(base.value), sha256, ...patch, id }
  ds.sources.push({ value: s, file: `data/sources/2025/${id}.yaml`, line: 1 })
  return s
}

/** Evidence citing `sourceIds`, built from the fixture's first evidence entry. */
function evidenceFrom(e: Event, sourceIds: string[]): Event['evidence'] {
  const first = e.evidence[0]
  if (!first) throw new Error('fixture evidence missing')
  return sourceIds.map((source) => ({ ...first, source }))
}

function setSourceKinds(ds: Dataset, kind: Source['kind']): void {
  for (const s of ds.sources) s.value.kind = kind
}

describe('the fixtures', () => {
  it('produce no issue from any event rule', () => {
    expect(run()).toEqual([])
  })
})

describe('event.country-known', () => {
  it('accepts a registered, scored country', () => {
    expect(issuesOf(run(), 'event.country-known')).toEqual([])
  })

  it('rejects a country missing from countries.yaml', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).country = 'FRA'
      }),
      'event.country-known',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID, level: 'error' })
    expect(found[0]?.message).toContain('FRA')
  })

  it('rejects an excluded country (D-10)', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).country = 'ISR'
      }),
      'event.country-known',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('excluded')
  })

  it('does not report a country whose record failed its schema', () => {
    const found = run((ds) => {
      fixtureEvent(ds).country = 'FRA'
      ds.invalidIds.add('FRA')
    })
    expect(issuesOf(found, 'event.country-known')).toEqual([])
  })

  it('stays silent when countries.yaml could not be loaded', () => {
    const found = run((ds) => {
      ds.countries = []
      ds.issues.push(issue('load.yaml-syntax', { file: 'data/countries.yaml' }, 'bad YAML'))
    })
    expect(issuesOf(found, 'event.country-known')).toEqual([])
  })
})

describe('event.indicator-known', () => {
  it('accepts an indicator of the methodology', () => {
    expect(issuesOf(run(), 'event.indicator-known')).toEqual([])
  })

  it('rejects an indicator the methodology does not define', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).indicator = 'A9'
      }),
      'event.indicator-known',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('A9')
  })

  it('stays silent when indicators.yaml failed to load, and so do indicator-based rules', () => {
    const found = run((ds, m) => {
      fixtureEvent(ds).indicator = 'A9'
      fixtureEvent(ds).points = -3
      m.indicatorsFile = null
      m.indicators = []
    })
    expect(issuesOf(found, 'event.indicator-known')).toEqual([])
    expect(issuesOf(found, 'event.points-sign')).toEqual([])
  })
})

describe('event.type-matches-indicator', () => {
  it('accepts the type indicators.yaml gives', () => {
    expect(issuesOf(run(), 'event.type-matches-indicator')).toEqual([])
  })

  it('rejects a repeatable A6 event (A6 is standing)', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).type = 'repeatable'
      }),
      'event.type-matches-indicator',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('expected standing')
  })

  it('skips events whose indicator is unknown', () => {
    const found = run((ds) => {
      fixtureEvent(ds).indicator = 'A9'
    })
    expect(issuesOf(found, 'event.type-matches-indicator')).toEqual([])
  })
})

describe('event.not-generated', () => {
  it('accepts a hand-authored event', () => {
    expect(issuesOf(run(), 'event.not-generated')).toEqual([])
  })

  it('rejects a hand-written B1 vote (B1 is generated from unga_votes.csv)', () => {
    const found = issuesOf(
      run((ds) => {
        addRepeatable(ds, 'B1', '2023-10-27', 3, { points_rationale: 'Voted yes.' })
      }),
      'event.not-generated',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2023_10_27_DEU_B1' })
    expect(found[0]?.message).toContain('indicator B1 is generated')
  })

  it('rejects the computed type', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).type = 'computed'
      }),
      'event.not-generated',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('the type is computed')
  })

  it('rejects a generated id with a slug', () => {
    const id = 'evt_2025_08_08_DEU_A6_es-10-21'
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).id = id
      }),
      'event.not-generated',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id })
    expect(found[0]?.message).toContain('slug es-10-21')
  })

  it('rejects generated: true', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).generated = true
      }),
      'event.not-generated',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('generated is true')
  })

  it('reports every reason in one issue', () => {
    const id = 'evt_2025_01_01_DEU_A1_sipri-2024'
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, {
          id,
          indicator: 'A1',
          type: 'computed',
          date: '2025-01-01',
          end: null,
          points: -20,
          points_rationale: 'Share 0.25.',
          generated: true,
        })
      }),
      'event.not-generated',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id })
    for (const reason of ['A1 is generated', 'computed', 'slug sipri-2024', 'generated is true']) {
      expect(found[0]?.message).toContain(reason)
    }
  })
})

describe('event.points-sign', () => {
  it('accepts positive points on a positive indicator and non-zero points on B1 (mixed)', () => {
    expect(issuesOf(run(), 'event.points-sign')).toEqual([])
    const mixed = run((ds) => {
      addRepeatable(ds, 'B1', '2023-10-27', -2, { points_rationale: 'Abstained.' })
    })
    expect(issuesOf(mixed, 'event.points-sign')).toEqual([])
  })

  it('rejects negative points on a positive indicator', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).points = -10
      }),
      'event.points-sign',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('above 0')
  })

  it('rejects positive points on a negative indicator', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, {
          id: 'evt_2024_03_01_DEU_A3',
          indicator: 'A3',
          date: '2024-03-01',
          points: 15,
        })
      }),
      'event.points-sign',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2024_03_01_DEU_A3' })
    expect(found[0]?.message).toContain('below 0')
  })

  it('rejects zero points, including on the mixed indicator B1', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).points = 0
        addRepeatable(ds, 'B1', '2023-10-27', 0, { points_rationale: 'None.' })
      }),
      'event.points-sign',
    )
    expect(found.map((i) => i.id).sort()).toEqual(['evt_2023_10_27_DEU_B1', FIXTURE_ID])
    expect(found.find((i) => i.id === 'evt_2023_10_27_DEU_B1')?.message).toContain('other than 0')
  })
})

describe('event.points-range', () => {
  it('accepts the fixed value, a B12 tier, an A5 per-instance value, a B9 tier', () => {
    expect(issuesOf(run(), 'event.points-range')).toEqual([])
    const found = run((ds) => {
      addEvent(ds, {
        id: 'evt_2024_05_01_DEU_B12',
        indicator: 'B12',
        date: '2024-05-01',
        end: null,
        points: 8,
        points_rationale: 'Diplomatic relations downgraded (tier downgrade).',
      })
      addRepeatable(ds, 'A5', '2024-02-01', -5, { points_rationale: 'One transit authorised.' })
      addStatement(ds, { id: 'evt_2025_08_08_DEU_B9', points: 5 })
    })
    expect(issuesOf(found, 'event.points-range')).toEqual([])
  })

  it('rejects points other than the fixed value', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).points = 12
      }),
      'event.points-range',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('the fixed value 10')
  })

  it('rejects a value that is not a B12 tier and lists the tiers', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, {
          id: 'evt_2024_05_01_DEU_B12',
          indicator: 'B12',
          date: '2024-05-01',
          end: null,
          points: 7,
          points_rationale: 'Ambassador recalled.',
        })
      }),
      'event.points-range',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2024_05_01_DEU_B12' })
    expect(found[0]?.message).toContain('5 (recall), 8 (downgrade) or 10 (severed)')
  })

  it('rejects an A5 value other than the per-instance value', () => {
    const found = issuesOf(
      run((ds) => {
        addRepeatable(ds, 'A5', '2024-02-01', -10, { points_rationale: 'Two transits.' })
      }),
      'event.points-range',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2024_02_01_DEU_A5' })
    expect(found[0]?.message).toContain('per-instance value -5')
  })

  it('checks formula ranges (A1 −40…0)', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, {
          id: 'evt_2025_01_01_DEU_A1',
          indicator: 'A1',
          type: 'computed',
          date: '2025-01-01',
          end: null,
          points: -41,
          points_rationale: 'Share 0.42.',
        })
        addEvent(ds, {
          id: 'evt_2025_01_01_DEU_A1_2',
          indicator: 'A1',
          type: 'computed',
          date: '2025-01-01',
          end: null,
          points: -20,
          points_rationale: 'Share 0.25.',
        })
      }),
      'event.points-range',
    )
    expect(found.map((i) => i.id)).toEqual(['evt_2025_01_01_DEU_A1'])
    expect(found[0]?.message).toContain('from -40 to 0')
  })

  it('is not checked when the sign is already wrong', () => {
    const found = run((ds) => {
      fixtureEvent(ds).points = -10
    })
    expect(issuesOf(found, 'event.points-sign')).toHaveLength(1)
    expect(issuesOf(found, 'event.points-range')).toEqual([])
  })
})

describe('event.points-rationale', () => {
  it('is not required on an unscaled indicator, and accepted on a scaled one', () => {
    expect(issuesOf(run(), 'event.points-rationale')).toEqual([])
    const found = run((ds) => {
      addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
    })
    expect(issuesOf(found, 'event.points-rationale')).toEqual([])
  })

  it('rejects a scaled event without a rationale, or with a blank one', () => {
    const found = issuesOf(
      run((ds) => {
        const e = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
        delete e.points_rationale
        addStatement(ds, {
          id: 'evt_2025_08_09_DEU_B9',
          date: '2025-08-09',
          points_rationale: '  ',
        })
      }),
      'event.points-rationale',
    )
    expect(found.map((i) => i.id)).toEqual(['evt_2025_08_08_DEU_B9', 'evt_2025_08_09_DEU_B9'])
    expect(found[0]).toMatchObject({ file: FILE })
    expect(found[0]?.message).toContain('B9 is scaled')
  })
})

describe('event.end', () => {
  it('accepts end after date, end equal to date, and no end on a repeatable event', () => {
    expect(issuesOf(run(), 'event.end')).toEqual([])
    const found = run((ds) => {
      fixtureEvent(ds).end = '2025-08-08'
      addRepeatable(ds, 'A8', '2024-01-10', 5)
    })
    expect(issuesOf(found, 'event.end')).toEqual([])
  })

  it('rejects an end on a repeatable event', () => {
    const found = issuesOf(
      run((ds) => {
        addRepeatable(ds, 'A8', '2024-01-10', 5, { end: '2024-02-01' })
      }),
      'event.end',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2024_01_10_DEU_A8' })
    expect(found[0]?.message).toContain('repeatable')
  })

  it('rejects an end before the date', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).end = '2025-08-07'
      }),
      'event.end',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('2025-08-07')
  })
})

describe('event.confirmed-source-kind', () => {
  it('accepts official sources, and a court source beside a press source', () => {
    expect(issuesOf(run(), 'event.confirmed-source-kind')).toEqual([])
    const found = run((ds) => {
      addSource(ds, 'src_20250808_reuters_germany-exports', { kind: 'press' })
      addSource(ds, 'src_20250808_icj_order', { kind: 'court' })
      const e = fixtureEvent(ds)
      e.evidence = evidenceFrom(e, [
        'src_20250808_reuters_germany-exports',
        'src_20250808_icj_order',
      ])
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toEqual([])
  })

  it('rejects a confirmed event without an official, court or dataset source', () => {
    const found = issuesOf(
      run((ds) => {
        setSourceKinds(ds, 'press')
      }),
      'event.confirmed-source-kind',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('official, court or dataset (found press)')
  })

  it('falls back to official, court and dataset when confidence.yaml is missing', () => {
    const found = run((ds, m) => {
      setSourceKinds(ds, 'ngo')
      m.confidence = null
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toHaveLength(1)
  })

  it('reads the required kinds from confidence.yaml', () => {
    const found = run((ds, m) => {
      setSourceKinds(ds, 'press')
      const level = m.confidence?.value.levels.find((l) => l.id === 'confirmed')
      if (level) level.requires.any_source_kind = ['press']
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toEqual([])
  })

  it('skips an event citing a source that failed its schema', () => {
    const found = run((ds) => {
      setSourceKinds(ds, 'press')
      const e = fixtureEvent(ds)
      e.evidence = evidenceFrom(e, [SRC_GAZA, 'src_20250808_broken_source'])
      ds.invalidIds.add('src_20250808_broken_source')
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toEqual([])
  })

  it('rejects a confirmed event whose only official source is a failed capture, at any status', () => {
    for (const status of ['draft', 'reviewed', 'published'] as const) {
      const found = issuesOf(
        run((ds) => {
          addSource(ds, 'src_20250808_bundesregierung_failed-capture', {
            archive_status: 'failed',
            wayback_url: null,
            sha256: null,
            bytes: null,
            content_type: null,
          })
          const e = fixtureEvent(ds)
          e.status = status
          e.evidence = evidenceFrom(e, ['src_20250808_bundesregierung_failed-capture'])
        }),
        'event.confirmed-source-kind',
      )
      expect(found, status).toHaveLength(1)
      expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
      expect(found[0]?.message).toContain('failed capture')
    }
  })

  it('accepts a failed capture beside an archived official source', () => {
    const found = run((ds) => {
      addSource(ds, 'src_20250808_bundesregierung_failed-capture', {
        archive_status: 'failed',
        wayback_url: null,
        sha256: null,
      })
      const e = fixtureEvent(ds)
      e.evidence = evidenceFrom(e, ['src_20250808_bundesregierung_failed-capture', SRC_GAZA])
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toEqual([])
  })

  it('rejects a source of kind official whose publisher_type is press or ngo', () => {
    for (const publisher_type of ['press', 'ngo']) {
      const found = issuesOf(
        run((ds) => {
          for (const src of ds.sources) {
            src.value.publisher = 'Der Spiegel'
            src.value.publisher_type = publisher_type
          }
        }),
        'event.confirmed-source-kind',
      )
      expect(found, publisher_type).toHaveLength(1)
      expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
      expect(found[0]?.message).toContain(`publisher_type is ${publisher_type}`)
    }
  })

  it('accepts a dataset source whatever its publisher_type', () => {
    const found = run((ds) => {
      for (const src of ds.sources) {
        src.value.kind = 'dataset'
        src.value.publisher_type = 'ngo'
      }
    })
    expect(issuesOf(found, 'event.confirmed-source-kind')).toEqual([])
  })
})

describe('event.corroborated-publishers', () => {
  it('accepts two press sources from distinct publishers', () => {
    expect(issuesOf(run(), 'event.corroborated-publishers')).toEqual([])
    const found = run((ds) => {
      addSource(ds, 'src_20250808_reuters_germany-exports', { kind: 'press', publisher: 'Reuters' })
      addSource(ds, 'src_20250808_spiegel_ruestungsexporte', {
        kind: 'press',
        publisher: 'Der Spiegel',
      })
      const e = fixtureEvent(ds)
      e.confidence = 'corroborated'
      e.evidence = evidenceFrom(e, [
        'src_20250808_reuters_germany-exports',
        'src_20250808_spiegel_ruestungsexporte',
      ])
    })
    expect(issuesOf(found, 'event.corroborated-publishers')).toEqual([])
  })

  it('rejects a corroborated event with no ngo or press publisher', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).confidence = 'corroborated'
      }),
      'event.corroborated-publishers',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain(
      '0 distinct publisher(s) among sources of kind ngo or press',
    )
  })

  it('compares publishers case-insensitively and trimmed', () => {
    const found = issuesOf(
      run((ds) => {
        addSource(ds, 'src_20250808_reuters_germany-exports', {
          kind: 'press',
          publisher: 'Reuters',
        })
        addSource(ds, 'src_20250809_reuters_germany-exports', {
          kind: 'press',
          publisher: ' reuters ',
        })
        const e = fixtureEvent(ds)
        e.confidence = 'corroborated'
        e.evidence = evidenceFrom(e, [
          'src_20250808_reuters_germany-exports',
          'src_20250809_reuters_germany-exports',
        ])
      }),
      'event.corroborated-publishers',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('1 distinct publisher(s)')
    expect(found[0]?.message).toContain('expected at least 2')
  })

  it('folds whitespace runs, U+00A0, fullwidth forms and trailing punctuation in publishers', () => {
    for (const other of ['Der  Spiegel', 'Der\u00A0Spiegel', 'Der Spiegel.', 'ＤＥＲ Spiegel']) {
      const found = issuesOf(
        run((ds) => {
          addSource(ds, 'src_20250808_spiegel_one', { kind: 'press', publisher: 'Der Spiegel' })
          addSource(ds, 'src_20250808_spiegel_two', { kind: 'press', publisher: other })
          const e = fixtureEvent(ds)
          e.confidence = 'corroborated'
          e.evidence = evidenceFrom(e, ['src_20250808_spiegel_one', 'src_20250808_spiegel_two'])
        }),
        'event.corroborated-publishers',
      )
      expect(found, other).toHaveLength(1)
      expect(found[0]?.message).toContain('1 distinct publisher(s)')
    }
  })

  it('counts one document once, whatever the publishers its records name', () => {
    const twice = (patch: Partial<Source>) =>
      issuesOf(
        run((ds) => {
          addSource(ds, 'src_20250808_reuters_germany-exports', {
            kind: 'press',
            publisher: 'Reuters',
            ...patch,
          })
          addSource(ds, 'src_20250808_spiegel_ruestungsexporte', {
            kind: 'press',
            publisher: 'Der Spiegel',
            ...patch,
          })
          const e = fixtureEvent(ds)
          e.confidence = 'corroborated'
          e.evidence = evidenceFrom(e, [
            'src_20250808_reuters_germany-exports',
            'src_20250808_spiegel_ruestungsexporte',
          ])
        }),
        'event.corroborated-publishers',
      )
    const sameHash = twice({ sha256: 'c'.repeat(64) })
    expect(sameHash).toHaveLength(1)
    expect(sameHash[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(sameHash[0]?.message).toContain('same document')
    // Without a hash, the url identifies the document (scheme and www. ignored).
    const sameUrl = issuesOf(
      run((ds) => {
        addSource(ds, 'src_20250808_reuters_germany-exports', {
          kind: 'press',
          publisher: 'Reuters',
          sha256: null,
          url: 'https://www.example.org/article',
        })
        addSource(ds, 'src_20250808_spiegel_ruestungsexporte', {
          kind: 'press',
          publisher: 'Der Spiegel',
          sha256: null,
          url: 'http://example.org/article/',
        })
        const e = fixtureEvent(ds)
        e.confidence = 'corroborated'
        e.evidence = evidenceFrom(e, [
          'src_20250808_reuters_germany-exports',
          'src_20250808_spiegel_ruestungsexporte',
        ])
      }),
      'event.corroborated-publishers',
    )
    expect(sameUrl).toHaveLength(1)
  })

  it('counts every kind, with a minimum of 2, when confidence.yaml is missing', () => {
    const same = run((ds, m) => {
      m.confidence = null
      fixtureEvent(ds).confidence = 'corroborated'
    })
    expect(issuesOf(same, 'event.corroborated-publishers')).toHaveLength(1)
    const distinct = run((ds, m) => {
      m.confidence = null
      addSource(ds, 'src_20250808_auswaertiges-amt_gaza', { publisher: 'Auswärtiges Amt' })
      const e = fixtureEvent(ds)
      e.confidence = 'corroborated'
      e.evidence = evidenceFrom(e, [SRC_GAZA, 'src_20250808_auswaertiges-amt_gaza'])
    })
    expect(issuesOf(distinct, 'event.corroborated-publishers')).toEqual([])
  })
})

describe('event.disputed-both-sides', () => {
  it('accepts a disputed event contested by a reply', () => {
    expect(issuesOf(run(), 'event.disputed-both-sides')).toEqual([])
    const found = run((ds) => {
      const e = fixtureEvent(ds)
      e.confidence = 'disputed'
      e.evidence = evidenceFrom(e, [SRC_GAZA])
    })
    expect(issuesOf(found, 'event.disputed-both-sides')).toEqual([])
  })

  it('accepts, without a reply, two sources of which one is official', () => {
    const found = run((ds) => {
      ds.replies = []
      addSource(ds, 'src_20250808_reuters_germany-exports', { kind: 'press', publisher: 'Reuters' })
      const e = fixtureEvent(ds)
      e.confidence = 'disputed'
      e.evidence = evidenceFrom(e, [SRC_GAZA, 'src_20250808_reuters_germany-exports'])
    })
    expect(issuesOf(found, 'event.disputed-both-sides')).toEqual([])
  })

  it('rejects, without a reply, a single source', () => {
    const found = issuesOf(
      run((ds) => {
        ds.replies = []
        const e = fixtureEvent(ds)
        e.confidence = 'disputed'
        e.evidence = evidenceFrom(e, [SRC_GAZA])
      }),
      'event.disputed-both-sides',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('cites 1 source(s)')
  })

  it('rejects, without a reply, two official sources of the same publisher', () => {
    const found = issuesOf(
      run((ds) => {
        ds.replies = []
        fixtureEvent(ds).confidence = 'disputed'
      }),
      'event.disputed-both-sides',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('all from the publisher of the denial')
  })

  it('accepts, without a reply, an official denial and an official source of another publisher', () => {
    const found = run((ds) => {
      ds.replies = []
      addSource(ds, 'src_20250808_un_gaza-statement', { publisher: 'United Nations' })
      const e = fixtureEvent(ds)
      e.confidence = 'disputed'
      e.evidence = evidenceFrom(e, [SRC_GAZA, 'src_20250808_un_gaza-statement'])
    })
    expect(issuesOf(found, 'event.disputed-both-sides')).toEqual([])
  })

  it('rejects, without a reply, two sources none of which is official', () => {
    const found = issuesOf(
      run((ds) => {
        ds.replies = []
        setSourceKinds(ds, 'press')
        fixtureEvent(ds).confidence = 'disputed'
      }),
      'event.disputed-both-sides',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('none of kind official or official-video')
  })
})

describe('event.statement-requirements', () => {
  it('accepts a B9 statement with a speaker and an official or official-video source', () => {
    expect(issuesOf(run(), 'event.statement-requirements')).toEqual([])
    const found = run((ds) => {
      addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
      addSource(ds, 'src_20250810_bundesregierung_video', { kind: 'official-video' })
      const video = addStatement(ds, {
        id: 'evt_2025_08_10_DEU_B10',
        indicator: 'B10',
        date: '2025-08-10',
        points: -5,
      })
      video.evidence = evidenceFrom(video, ['src_20250810_bundesregierung_video'])
    })
    expect(issuesOf(found, 'event.statement-requirements')).toEqual([])
  })

  it('rejects a B9 statement without actor.name, or with a blank one', () => {
    const found = issuesOf(
      run((ds) => {
        const e = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
        e.actor = { en: 'Federal Chancellor', fr: 'Chancelier fédéral' }
        const blank = addStatement(ds, { id: 'evt_2025_08_09_DEU_B9', date: '2025-08-09' })
        blank.actor = { en: 'Federal Chancellor', fr: 'Chancelier fédéral', name: '  ' }
      }),
      'event.statement-requirements',
    )
    expect(found.map((i) => i.id)).toEqual(['evt_2025_08_08_DEU_B9', 'evt_2025_08_09_DEU_B9'])
    expect(found[0]).toMatchObject({ file: FILE })
    expect(found[0]?.message).toContain('actor.name')
  })

  it('rejects a B10 statement whose only source is press', () => {
    const found = issuesOf(
      run((ds) => {
        addSource(ds, 'src_20250808_reuters_germany-exports', { kind: 'press' })
        const e = addStatement(ds, { id: 'evt_2025_08_08_DEU_B10', indicator: 'B10', points: -5 })
        e.evidence = evidenceFrom(e, ['src_20250808_reuters_germany-exports'])
      }),
      'event.statement-requirements',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2025_08_08_DEU_B10' })
    expect(found[0]?.message).toContain('official or official-video (found press)')
  })

  it('reports a missing speaker and a wrong source kind separately', () => {
    const found = issuesOf(
      run((ds) => {
        setSourceKinds(ds, 'press')
        const e = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
        e.actor = { en: 'Federal Chancellor', fr: 'Chancelier fédéral' }
      }),
      'event.statement-requirements',
    )
    expect(found).toHaveLength(2)
    expect(new Set(found.map((i) => i.id))).toEqual(new Set(['evt_2025_08_08_DEU_B9']))
  })
})

describe('event.statement-duplicate', () => {
  it('accepts statements by different speakers, or on different days, or retracted', () => {
    expect(issuesOf(run(), 'event.statement-duplicate')).toEqual([])
    const found = run((ds) => {
      addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
      const other = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9_2' })
      other.actor = { en: 'Foreign Minister', fr: 'Ministre des affaires étrangères', name: 'X Y' }
      addStatement(ds, { id: 'evt_2025_08_09_DEU_B9', date: '2025-08-09' })
      addStatement(ds, { id: 'evt_2025_08_08_DEU_B9_3', status: 'retracted' })
    })
    expect(issuesOf(found, 'event.statement-duplicate')).toEqual([])
  })

  it('rejects a second statement by the same speaker on the same day', () => {
    const found = issuesOf(
      run((ds) => {
        addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
        const dup = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9_2', points: 5 })
        dup.actor = { en: 'Federal Chancellor', fr: 'Chancelier fédéral', name: ' friedrich MERZ ' }
      }),
      'event.statement-duplicate',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2025_08_08_DEU_B9_2' })
    expect(found[0]?.message).toContain('evt_2025_08_08_DEU_B9 already records')
  })

  it('folds whitespace runs, U+00A0 and trailing punctuation in the speaker name', () => {
    for (const name of ['Friedrich  Merz', 'Friedrich\u00A0Merz', 'Friedrich Merz.']) {
      const found = issuesOf(
        run((ds) => {
          addStatement(ds, { id: 'evt_2025_08_08_DEU_B9' })
          const dup = addStatement(ds, { id: 'evt_2025_08_08_DEU_B9_2' })
          dup.actor = { en: 'Federal Chancellor', fr: 'Chancelier fédéral', name }
        }),
        'event.statement-duplicate',
      )
      expect(found, name).toHaveLength(1)
      expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2025_08_08_DEU_B9_2' })
    }
  })

  it('orders instances numerically and names the first', () => {
    const found = issuesOf(
      run((ds) => {
        addStatement(ds, { id: 'evt_2025_08_08_DEU_B10_10', indicator: 'B10', points: -5 })
        addStatement(ds, { id: 'evt_2025_08_08_DEU_B10_2', indicator: 'B10', points: -5 })
      }),
      'event.statement-duplicate',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2025_08_08_DEU_B10_10' })
    expect(found[0]?.message).toContain('evt_2025_08_08_DEU_B10_2')
  })
})

describe('event.published-reviewed', () => {
  it('accepts a reviewed published event, and a draft without review', () => {
    expect(issuesOf(run(), 'event.published-reviewed')).toEqual([])
    const found = run((ds) => {
      const e = fixtureEvent(ds)
      e.status = 'draft'
      e.review.reviewed_by = null
      e.review.reviewed_at = null
    })
    expect(issuesOf(found, 'event.published-reviewed')).toEqual([])
  })

  it('rejects a published event with a blank reviewer', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).review.reviewed_by = ' '
      }),
      'event.published-reviewed',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('review.reviewed_by is missing')
  })

  it('rejects a published event without reviewer and review date, in one issue', () => {
    const found = issuesOf(
      run((ds) => {
        const review = fixtureEvent(ds).review
        delete review.reviewed_by
        review.reviewed_at = null
      }),
      'event.published-reviewed',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('review.reviewed_by and review.reviewed_at are missing')
  })
})

describe('event.second-read', () => {
  it('accepts an agreeing second reading, and a draft without one', () => {
    expect(issuesOf(run(), 'event.second-read')).toEqual([])
    const found = run((ds) => {
      const e = fixtureEvent(ds)
      e.status = 'draft'
      e.review.second_read = null
    })
    expect(issuesOf(found, 'event.second-read')).toEqual([])
  })

  it('rejects a published event without a second reading', () => {
    const found = issuesOf(
      run((ds) => {
        delete fixtureEvent(ds).review.second_read
      }),
      'event.second-read',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('second_read is missing')
  })

  it('rejects a reviewed event whose second reading disagrees', () => {
    const found = issuesOf(
      run((ds) => {
        const e = fixtureEvent(ds)
        e.status = 'reviewed'
        e.review.second_read = { by: 'claude-opus-5-5', at: '2026-09-27', verdict: 'disagree' }
      }),
      'event.second-read',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('verdict disagree')
  })
})

describe('event.references', () => {
  it('accepts existing references of the same country, and invalid-record ids', () => {
    expect(issuesOf(run(), 'event.references')).toEqual([])
    const found = run((ds) => {
      addEvent(ds, {
        id: 'evt_2025_12_01_DEU_A6',
        date: '2025-12-01',
        end: null,
        supersedes: FIXTURE_ID,
        related: [FIXTURE_ID, 'evt_2025_01_01_FRA_A6'],
      })
      ds.invalidIds.add('evt_2025_01_01_FRA_A6')
    })
    expect(issuesOf(found, 'event.references')).toEqual([])
  })

  it('rejects supersedes naming a missing event, or the event itself', () => {
    const missing = issuesOf(
      run((ds) => {
        fixtureEvent(ds).supersedes = 'evt_2024_01_01_DEU_A6'
      }),
      'event.references',
    )
    expect(missing).toHaveLength(1)
    expect(missing[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(missing[0]?.message).toContain('evt_2024_01_01_DEU_A6')
    const self = issuesOf(
      run((ds) => {
        fixtureEvent(ds).supersedes = FIXTURE_ID
      }),
      'event.references',
    )
    expect(self).toHaveLength(1)
    expect(self[0]?.message).toContain('the event itself')
  })

  it('rejects supersedes naming an event of another country', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, { id: 'evt_2025_01_01_FRA_A6', country: 'FRA', date: '2025-01-01' })
        fixtureEvent(ds).supersedes = 'evt_2025_01_01_FRA_A6'
      }),
      'event.references',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('an event of FRA')
  })

  it('reads the country from the id when the superseded record failed its schema', () => {
    const found = issuesOf(
      run((ds) => {
        ds.invalidIds.add('evt_2025_01_01_FRA_A6')
        fixtureEvent(ds).supersedes = 'evt_2025_01_01_FRA_A6'
      }),
      'event.references',
    )
    expect(found).toHaveLength(1)
    expect(found[0]?.message).toContain('an event of FRA')
  })

  it('rejects supersedes naming a later event, and accepts one of the same day', () => {
    const later = issuesOf(
      run((ds) => {
        addEvent(ds, {
          id: 'evt_2026_01_05_DEU_A7',
          indicator: 'A7',
          date: '2026-01-05',
          end: null,
          points: 25,
        })
        fixtureEvent(ds).supersedes = 'evt_2026_01_05_DEU_A7'
      }),
      'event.references',
    )
    expect(later).toHaveLength(1)
    expect(later[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(later[0]?.message).toContain('after this event')
    const sameDay = run((ds) => {
      addEvent(ds, { id: 'evt_2025_08_08_DEU_A7', indicator: 'A7', end: null, points: 25 })
      fixtureEvent(ds).supersedes = 'evt_2025_08_08_DEU_A7'
    })
    expect(issuesOf(sameDay, 'event.references')).toEqual([])
  })

  it('reads the date from the id when the superseded record failed its schema', () => {
    const found = issuesOf(
      run((ds) => {
        ds.invalidIds.add('evt_2026_01_05_DEU_A7')
        fixtureEvent(ds).supersedes = 'evt_2026_01_05_DEU_A7'
      }),
      'event.references',
    )
    expect(found).toHaveLength(1)
    expect(found[0]?.message).toContain('dated 2026-01-05')
  })

  it('does not report references into an events file that cannot be parsed', () => {
    const found = run((ds) => {
      ds.issues.push(issue('load.yaml-syntax', { file: 'data/events/FRA.yaml' }, 'bad YAML'))
      fixtureEvent(ds).related = ['evt_2024_01_01_FRA_A6']
    })
    expect(issuesOf(found, 'event.references')).toEqual([])
  })

  it('rejects related ids that are missing or the event itself', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).related = ['evt_2024_01_01_FRA_A6', FIXTURE_ID]
      }),
      'event.references',
    )
    expect(found).toHaveLength(2)
    for (const i of found) expect(i).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found.map((i) => i.message).join(' ')).toContain('evt_2024_01_01_FRA_A6')
  })
})

describe('event.same-points', () => {
  it('accepts a standing event starting on the exclusive end of the other', () => {
    expect(issuesOf(run(), 'event.same-points')).toEqual([])
    const found = run((ds) => {
      addEvent(ds, { id: 'evt_2025_11_24_DEU_A6', date: '2025-11-24', end: null, points: 12 })
    })
    expect(issuesOf(found, 'event.same-points')).toEqual([])
  })

  it('rejects overlapping standing events with different points, on the later one', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, { id: 'evt_2025_11_23_DEU_A6', date: '2025-11-23', end: null, points: 12 })
      }),
      'event.same-points',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: 'evt_2025_11_23_DEU_A6' })
    expect(found[0]?.message).toContain(FIXTURE_ID)
  })

  it('reports the later event by date, whichever was added last', () => {
    const found = issuesOf(
      run((ds) => {
        addEvent(ds, { id: 'evt_2025_01_01_DEU_A6', date: '2025-01-01', end: null, points: 12 })
      }),
      'event.same-points',
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: FILE, id: FIXTURE_ID })
    expect(found[0]?.message).toContain('evt_2025_01_01_DEU_A6')
  })

  it('treats a null end as open', () => {
    const found = issuesOf(
      run((ds) => {
        fixtureEvent(ds).end = null
        addEvent(ds, { id: 'evt_2030_01_01_DEU_A6', date: '2030-01-01', end: null, points: 12 })
      }),
      'event.same-points',
    )
    expect(found.map((i) => i.id)).toEqual(['evt_2030_01_01_DEU_A6'])
  })

  it('accepts overlapping events with equal points, empty windows, withdrawn events', () => {
    const found = run((ds) => {
      addEvent(ds, { id: 'evt_2025_09_01_DEU_A6', date: '2025-09-01', end: null })
      addEvent(ds, {
        id: 'evt_2025_09_02_DEU_A6',
        date: '2025-09-02',
        end: '2025-09-02',
        points: 7,
      })
      addEvent(ds, {
        id: 'evt_2025_09_03_DEU_A6',
        date: '2025-09-03',
        status: 'retracted',
        points: 7,
      })
      addEvent(ds, {
        id: 'evt_2025_09_04_DEU_A6',
        date: '2025-09-04',
        status: 'superseded',
        points: 7,
      })
    })
    expect(issuesOf(found, 'event.same-points')).toEqual([])
  })

  it('uses the 730-day repeatable window, inclusive', () => {
    const start = '2024-01-01'
    const inside = run((ds) => {
      addRepeatable(ds, 'A8', start, 5)
      addRepeatable(ds, 'A8', addDays(start, 730), 6)
    })
    const later = issuesOf(inside, 'event.same-points')
    expect(later).toHaveLength(1)
    expect(later[0]).toMatchObject({ file: FILE, id: 'evt_2025_12_31_DEU_A8' })
    expect(later[0]?.message).toContain('evt_2024_01_01_DEU_A8')
    const outside = run((ds) => {
      addRepeatable(ds, 'A8', start, 5)
      addRepeatable(ds, 'A8', addDays(start, 731), 6)
    })
    expect(issuesOf(outside, 'event.same-points')).toEqual([])
  })

  it('reads the window length from decay.yaml', () => {
    const found = run((ds, m) => {
      if (m.decay) m.decay.value.end_days = 30
      addRepeatable(ds, 'A8', '2024-01-01', 5)
      addRepeatable(ds, 'A8', '2024-02-15', 6)
    })
    expect(issuesOf(found, 'event.same-points')).toEqual([])
  })

  it('exempts scaled indicators (B12 tiers)', () => {
    const found = run((ds) => {
      const b12 = { indicator: 'B12', end: null, points_rationale: 'Tier.' }
      addEvent(ds, { ...b12, id: 'evt_2024_05_01_DEU_B12', date: '2024-05-01', points: 5 })
      addEvent(ds, { ...b12, id: 'evt_2024_06_01_DEU_B12', date: '2024-06-01', points: 8 })
    })
    expect(issuesOf(found, 'event.same-points')).toEqual([])
  })

  it('compares events of one country only', () => {
    const found = run((ds) => {
      addEvent(ds, {
        id: 'evt_2025_09_01_FRA_A6',
        country: 'FRA',
        date: '2025-09-01',
        end: null,
        points: 12,
      })
    })
    expect(issuesOf(found, 'event.same-points')).toEqual([])
  })
})

it('uses the second fixture source in the fixtures', () => {
  // Guards the helpers above: the fixture event cites both fixture sources.
  const ctx = fixtureContext()
  expect(ctx.dataset.events[0]?.value.evidence.map((e) => e.source)).toEqual([SRC_GAZA, SRC_LIFT])
})
