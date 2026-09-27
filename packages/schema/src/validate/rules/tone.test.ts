/**
 * Tests for the tone rules (validate/rules/tone.ts). Each case starts from the valid fixtures,
 * changes one text and checks the rule id, file, record id and path of the issue. The matching
 * itself is tested in detail in validate/tone.test.ts.
 */
import { describe, expect, it } from 'vitest'
import type { Issue, RuleId } from '../../issues.js'
import type { Dataset, Located } from '../../load/dataset.js'
import { type Methodology, parseBannedWords } from '../../load/methodology.js'
import type { Correction, Event, Reply } from '../../records.js'
import { fixtureContext, issuesOf, rulesIn, runRules } from '../../testing/harness.js'
import { rules } from './tone.js'

type Mutate = (ds: Dataset, m: Methodology) => void

const run = (mutate?: Mutate): Issue[] => runRules(rules, fixtureContext(mutate))
const of = (rule: RuleId, mutate?: Mutate): Issue[] => issuesOf(run(mutate), rule)

const EVENT_ID = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const CORRECTION_ID = 'cor_20260927_1'
const CORRECTIONS_FILE = 'data/corrections.yaml'
const REPLY_ID = 'rep_20260927_DEU_1'
const REPLY_FILE = `data/replies/DEU/${REPLY_ID}.yaml`

function first<T>(items: Located<T>[], label: string): Located<T> {
  const item = items[0]
  if (item === undefined) throw new Error(`fixture ${label} missing`)
  return item
}
const event = (ds: Dataset): Event => first(ds.events, 'event').value
const correction = (ds: Dataset): Correction => first(ds.corrections, 'correction').value
const reply = (ds: Dataset): Reply => first(ds.replies, 'reply').value

/** Sets one summary of the fixture event. */
const summary =
  (lang: 'en' | 'fr', text: string): Mutate =>
  (ds) => {
    event(ds).summary[lang] = text
  }

/** The single issue of `rule`, checked to sit on the fixture event's summary in `lang`. */
function expectOnSummary(issues: Issue[], rule: RuleId, lang: 'en' | 'fr'): Issue {
  const found = issuesOf(issues, rule)
  expect(found).toHaveLength(1)
  expect(found[0]).toMatchObject({
    rule,
    level: 'error',
    file: EVENTS_FILE,
    id: EVENT_ID,
    line: 3,
    path: `summary.${lang}`,
  })
  return found[0] as Issue
}

describe('valid fixtures', () => {
  it('produce no tone issue of any rule', () => {
    expect(run()).toEqual([])
    for (const rule of [
      'tone.banned-word',
      'tone.exclamation',
      'tone.length',
      'tone.actor-first',
      'tone.site-voice',
    ] as const) {
      expect(of(rule)).toEqual([])
    }
  })

  it('never throw on missing pieces (no methodology list, unknown country, no actor)', () => {
    const issues = run((ds, m) => {
      m.bannedWords = null
      const e = event(ds)
      e.country = 'FRA'
      delete e.actor
      ds.countries = []
    })
    expect(issues).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// tone.banned-word

describe('tone.banned-word', () => {
  it('passes neutral summaries that name courts, conventions and colonies', () => {
    const issues = run((ds) => {
      const e = event(ds)
      e.summary.en =
        'The Federal Chancellor stated that the government would execute the arrest warrants issued by the International Criminal Court.'
      e.summary.fr =
        "Le chancelier fédéral a déclaré que le gouvernement interdirait l'importation de biens produits dans les colonies israéliennes."
    })
    expect(issuesOf(issues, 'tone.banned-word')).toEqual([])
  })

  it('reports a banned word in the EN summary', () => {
    const issues = run(summary('en', 'The Federal Chancellor took a historic step.'))
    const i = expectOnSummary(issues, 'tone.banned-word', 'en')
    expect(i.message).toContain('"historic"')
    expect(i.message).toMatch(/^EN summary /)
  })

  it('reports a banned word in the FR summary', () => {
    const issues = run(summary('fr', 'Le chancelier fédéral a pris une décision courageuse.'))
    const i = expectOnSummary(issues, 'tone.banned-word', 'fr')
    expect(i.message).toContain('"courageuse", which matches the banned term "courage*"')
    expect(i.message).toMatch(/^FR summary /)
  })

  it('reports one issue per occurrence', () => {
    const issues = run(summary('en', 'Germany took a very, very bold step.'))
    expect(issuesOf(issues, 'tone.banned-word').map((i) => i.message)).toEqual([
      'EN summary contains the banned term "very"; state the fact in neutral words.',
      'EN summary contains the banned term "very"; state the fact in neutral words.',
      'EN summary contains the banned term "bold"; state the fact in neutral words.',
    ])
  })

  it('uses the methodology list (a custom list replaces it)', () => {
    const issues = run((ds, m) => {
      const entries = parseBannedWords('# custom\ngaza strip\nbande de gaza')
      m.bannedWords = { file: 'methodology/v9.9.9/banned-words.txt', entries }
      event(ds).summary.en = 'The Federal Chancellor took a historic step.'
    })
    // "historic" is not on the custom list; the fixture FR summary ends "dans la bande de Gaza".
    expect(issuesOf(issues, 'tone.banned-word').map((i) => [i.path, i.message])).toEqual([
      [
        'summary.fr',
        'FR summary contains "bande de Gaza", which matches the banned term "bande de gaza"; state the fact in neutral words.',
      ],
    ])
  })

  it('is skipped when banned-words.txt failed to load', () => {
    const issues = run((ds, m) => {
      m.bannedWords = null
      event(ds).summary.en = 'The Federal Chancellor took a historic step.'
    })
    expect(issuesOf(issues, 'tone.banned-word')).toEqual([])
  })

  it('lints retracted events too (their summaries stay on the site)', () => {
    const issues = run((ds) => {
      const e = event(ds)
      e.status = 'retracted'
      e.summary.en = 'The Federal Chancellor took a historic step.'
    })
    expectOnSummary(issues, 'tone.banned-word', 'en')
  })

  it('does not lint quotes (evidence is verbatim)', () => {
    const issues = run((ds) => {
      const ev = first(ds.events, 'event').value.evidence[0]
      if (ev) ev.quote_en = 'A historic, shameful and brutal decision!'
    })
    expect(issues).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// tone.exclamation

describe('tone.exclamation', () => {
  it('reports an exclamation mark in the EN summary', () => {
    const issues = run(summary('en', 'The Federal Chancellor suspended the exports!'))
    const i = expectOnSummary(issues, 'tone.exclamation', 'en')
    expect(i.message).toContain('"!" at character 45')
  })

  it('reports an exclamation mark in the FR summary, with French spacing', () => {
    const issues = run(summary('fr', 'Le chancelier fédéral a suspendu les exportations\u202f!'))
    expectOnSummary(issues, 'tone.exclamation', 'fr')
  })

  it('reports an inverted exclamation mark', () => {
    const issues = run(summary('fr', 'Le chancelier fédéral a suspendu ¡ les exportations.'))
    expectOnSummary(issues, 'tone.exclamation', 'fr')
  })

  it('reports several marks in one summary once', () => {
    const issues = run(summary('en', 'The Federal Chancellor suspended the exports! All of them!'))
    const i = expectOnSummary(issues, 'tone.exclamation', 'en')
    expect(i.message).toContain('2 exclamation marks')
  })
})

// ---------------------------------------------------------------------------------------------
// tone.length

describe('tone.length', () => {
  const EN_START = 'The Federal Chancellor suspended '
  const FR_START = 'Le chancelier fédéral a suspendu '
  const sized = (start: string, n: number) => start + 'x'.repeat(n - [...start].length)

  it('passes a summary of exactly 200 characters, EN and FR', () => {
    const issues = run((ds) => {
      event(ds).summary.en = sized(EN_START, 200)
      event(ds).summary.fr = sized(FR_START, 200)
    })
    expect(issuesOf(issues, 'tone.length')).toEqual([])
  })

  it('reports a 201-character EN summary', () => {
    const i = expectOnSummary(run(summary('en', sized(EN_START, 201))), 'tone.length', 'en')
    expect(i.message).toBe(
      'EN summary is 201 characters long; summaries are at most 200 characters.',
    )
  })

  it('reports a 201-character FR summary (accented letters count once)', () => {
    const issues = run(summary('fr', sized(FR_START, 201)))
    expectOnSummary(issues, 'tone.length', 'fr')
  })
})

// ---------------------------------------------------------------------------------------------
// tone.actor-first

describe('tone.actor-first', () => {
  it.each([
    ['en', 'Germany voted in favour of the resolution.'],
    ['en', 'The federal government suspended export licences.'],
    ['en', 'Friedrich Merz announced the suspension of export licences.'],
    ['en', 'Chancellor Friedrich Merz announced the suspension of export licences.'],
    ['fr', "L'Allemagne a voté en faveur de la résolution."],
    ['fr', 'L’Allemagne a voté en faveur de la résolution.'],
    ['fr', 'Le gouvernement fédéral a suspendu les licences d’exportation.'],
    ['fr', 'Friedrich Merz a annoncé la suspension des licences d’exportation.'],
  ] as const)('passes an actor-first summary (%s): %s', (lang, text) => {
    expect(of('tone.actor-first', summary(lang, text))).toEqual([])
  })

  it('takes the country name from the registry', () => {
    const issues = run((ds) => {
      const e = event(ds)
      delete e.actor
      e.summary.en = 'Germany voted in favour of the resolution.'
      e.summary.fr = 'L’Allemagne a voté en faveur de la résolution.'
    })
    expect(issuesOf(issues, 'tone.actor-first')).toEqual([])
  })

  it('reports a summary that starts with a date (EN)', () => {
    const issues = run(summary('en', 'On 8 August 2025, the government suspended export licences.'))
    const i = expectOnSummary(issues, 'tone.actor-first', 'en')
    expect(i.message).toContain('"On 8 August 2025, …" (a date)')
    expect(i.message).toContain('"Germany" or "Federal Chancellor" or "Friedrich Merz"')
  })

  it('reports a summary that starts with a date (FR)', () => {
    const issues = run(summary('fr', 'Le 8 août 2025, le gouvernement a suspendu les licences.'))
    const i = expectOnSummary(issues, 'tone.actor-first', 'fr')
    expect(i.message).toContain('"Allemagne" or "Chancelier fédéral" or "Friedrich Merz"')
  })

  it('reports a summary that starts in lowercase with a circumstance', () => {
    const issues = run(summary('en', 'after the vote, the government suspended export licences.'))
    const i = expectOnSummary(issues, 'tone.actor-first', 'en')
    expect(i.message).toContain('(no capital letter)')
  })

  it('reports a summary that starts with an introductory word', () => {
    const issues = run(summary('fr', 'Selon le ministère, les licences ont été suspendues.'))
    const i = expectOnSummary(issues, 'tone.actor-first', 'fr')
    expect(i.message).toContain('(an introductory word)')
  })

  it('reports a summary that starts with a quotation', () => {
    const issues = run(summary('en', '“We will not approve exports,” the Chancellor said.'))
    expectOnSummary(issues, 'tone.actor-first', 'en')
  })
})

// ---------------------------------------------------------------------------------------------
// tone.site-voice

describe('tone.site-voice', () => {
  it('passes the fixture correction reason and reply response', () => {
    expect(of('tone.site-voice')).toEqual([])
  })

  it('reports a banned word in a correction reason, as a warning', () => {
    const issues = of('tone.site-voice', (ds) => {
      correction(ds).reason = 'The end date was added. The earlier record was clearly wrong.'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      rule: 'tone.site-voice',
      level: 'warning',
      file: CORRECTIONS_FILE,
      id: CORRECTION_ID,
      line: 3,
      path: 'reason',
    })
    expect(issues[0]?.message).toBe(
      'Correction reason contains the banned term "clearly"; state the fact in neutral words.',
    )
  })

  it('reports a banned word in the EN and FR responses to a reply', () => {
    const issues = of('tone.site-voice', (ds) => {
      const r = reply(ds)
      r.response.en = 'Unfortunately, the event stands.'
      r.response.fr = 'Malheureusement, l’événement est maintenu.'
    })
    expect(issues.map((i) => [i.rule, i.level, i.file, i.id, i.path])).toEqual([
      ['tone.site-voice', 'warning', REPLY_FILE, REPLY_ID, 'response.en'],
      ['tone.site-voice', 'warning', REPLY_FILE, REPLY_ID, 'response.fr'],
    ])
  })

  it("does not lint the reply's own text (the sender's words)", () => {
    const issues = of('tone.site-voice', (ds) => {
      const r = reply(ds)
      r.text.original = 'This is an unacceptable and shameful listing!'
      r.text.en = r.text.original
    })
    expect(issues).toEqual([])
  })

  it('is skipped when banned-words.txt failed to load', () => {
    const issues = of('tone.site-voice', (ds, m) => {
      m.bannedWords = null
      correction(ds).reason = 'The earlier record was clearly wrong.'
    })
    expect(issues).toEqual([])
  })

  it('does not raise the summary rules on other texts', () => {
    const issues = run((ds) => {
      correction(ds).reason = `on 8 August! ${'x'.repeat(300)}`
    })
    expect(rulesIn(issues)).toEqual([])
  })
})
