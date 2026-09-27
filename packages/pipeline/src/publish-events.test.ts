import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildContext, Event, loadDataset, loadMethodology, validate } from '@gai/schema'
import { afterAll, describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import {
  type CommandResult,
  DEFAULT_REVIEWER,
  localIsoDate,
  type PublishEnv,
  parsePublishArgs,
  publishEventsInYaml,
  runPublishEvents,
  unchangedReviewedIds,
} from './publish-events.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const TMP = mkdtempSync(join(tmpdir(), 'gai-publish-'))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))

// The fixture event (published, reviewed_by: fixture) and the same file turned into a reviewed
// event awaiting the author: status reviewed, no reviewed_by, no reviewed_at.
const FIXTURE = readFileSync(join(REPO_ROOT, 'fixtures/data/events/DEU.yaml'), 'utf8')
const FIXTURE_REVIEW = '    reviewed_by: fixture\n    reviewed_at: 2026-09-27\n'
const REVIEWED = FIXTURE.replace('  status: published\n', '  status: reviewed\n').replace(
  FIXTURE_REVIEW,
  '',
)
const FIXTURE_ID = 'evt_2025_08_08_DEU_A6'

const opts = (over: { by?: string; date?: string; exclude?: string[] } = {}) => ({
  by: over.by ?? 'mzouad',
  date: over.date ?? '2026-09-28',
  exclude: new Set(over.exclude ?? []),
})

/** A temp copy of the fixture dataset with data/events/DEU.yaml replaced by `text`. */
function datasetWith(name: string, text: string): string {
  const root = join(TMP, name)
  cpSync(join(REPO_ROOT, 'fixtures'), root, { recursive: true })
  writeFileSync(join(root, 'data/events/DEU.yaml'), text)
  return root
}

// Synthetic events (not real conduct): the fields the Event schema requires, then the status
// and review lines each test writes out in full.
const head = (id: string, date: string) =>
  [
    `- id: ${id}`,
    '  revision: 1',
    '  country: DEU',
    '  indicator: A5',
    '  type: repeatable',
    `  date: ${date}`,
    '  points: -5',
    '  confidence: confirmed',
    '  scope: [gaza]',
    '  summary: {en: Synthetic test event., fr: Événement de test synthétique.}',
    '  evidence:',
    '    - {source: src_20250808_bundesregierung_ruestungsexporte-gaza, quote: Synthetic quote., quote_lang: en, locator: paragraph 1}',
    '',
  ].join('\n')

const A = 'evt_2025_01_02_DEU_A5'
const B = 'evt_2025_01_03_DEU_A5'
const C = 'evt_2025_01_04_DEU_A5'
const D = 'evt_2025_01_05_DEU_A5'
const E = 'evt_2025_01_06_DEU_A5'
const F = 'evt_2025_01_07_DEU_A5'
const G = 'evt_2025_01_08_DEU_A5'
const H = 'evt_2025_01_09_DEU_A5'
const I = 'evt_2025_01_10_DEU_A5'

const MULTI = `# Synthetic test file for publish:events; none of these events is real.

${head(A, '2025-01-02')}  status: reviewed   # both readings done
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}
    notes: "Synthetic."

# A draft: left alone.
${head(B, '2025-01-03')}  status: draft
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
${head(C, '2025-01-04')}  status: published
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}
    reviewed_by: someone
    reviewed_at: 2026-09-22
${head(D, '2025-01-05')}  status: reviewed
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
${head(E, '2025-01-06')}  status: reviewed
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: disagree, notes: quote not found}
${head(F, '2025-01-07')}  status: reviewed
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}
${head(G, '2025-01-08')}  status: 'reviewed'
  review: {drafted_by: claude-opus-5-5, drafted_at: 2026-09-20, second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}}
${head(H, '2025-01-09')}  status: reviewed
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read:
      by: claude-opus-5-5
      at: 2026-09-21
      verdict: agree
    reviewed_by: null
    reviewed_at:   # set by publish:events
    notes: >-
      Synthetic, folded
      over two lines.
${head(I, '2025-01-10')}  status: draft
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
`

// A file as a pull request finds it at its merge base (EARLIER) and as the pull request leaves it
// (LATER): A reviewed and unchanged, B a draft given its second reading and set to reviewed, C
// reviewed but edited (its locator), J added. Synthetic, like MULTI.
const J = 'evt_2025_01_11_DEU_A5'
const REVIEWED_LINES = `  status: reviewed
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}
`
const DRAFT_LINES = `  status: draft
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
`
/** REVIEWED_LINES once publish:events has run with reviewed_by mzouad on `date`. */
const PUBLISHED_LINES = (date: string) => `  status: published
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-09-20
    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}
    reviewed_by: mzouad
    reviewed_at: ${date}
`
const TOP = '# Synthetic test file for publish:events; none of these events is real.\n\n'
const EDITED_C = head(C, '2025-01-04').replace('locator: paragraph 1', 'locator: paragraph 2')
const EARLIER = `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(B, '2025-01-03')}${DRAFT_LINES}${head(C, '2025-01-04')}${REVIEWED_LINES}`
const LATER = `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(B, '2025-01-03')}${REVIEWED_LINES}${EDITED_C}${REVIEWED_LINES}${head(J, '2025-01-11')}${REVIEWED_LINES}`

/** Replaces `from` once, failing the test when it is not in `text` (so expectations stay honest). */
function swap(text: string, from: string, to: string): string {
  expect(text).toContain(from)
  return text.replace(from, to)
}

describe('publishEventsInYaml', () => {
  it('publishes the reviewed fixture event, every other byte of the file unchanged', () => {
    expect(FIXTURE).toContain(FIXTURE_REVIEW)
    expect(REVIEWED).toContain('  status: reviewed\n')
    expect(REVIEWED).not.toContain('reviewed_by')
    const r = publishEventsInYaml(REVIEWED, opts())
    expect(r.published).toEqual([FIXTURE_ID])
    expect(r.skipped).toEqual([])
    // The fixture as it was, with the new reviewer and date in place of the fixture's: the
    // header comments, the flow maps, the long unquoted summaries and the umlauts are intact.
    expect(r.text).toBe(
      FIXTURE.replace(FIXTURE_REVIEW, '    reviewed_by: mzouad\n    reviewed_at: 2026-09-28\n'),
    )
  })

  it('writes reviewed_at as a plain date scalar that the loader reads as a string', () => {
    const r = publishEventsInYaml(REVIEWED, opts())
    expect(r.text).toContain('\n    reviewed_at: 2026-09-28\n')
    expect(r.text).not.toMatch(/reviewed_at: ['"]/)
    const [event] = parse(r.text, { version: '1.2', schema: 'core' }) as { review: object }[]
    expect(event?.review).toMatchObject({ reviewed_by: 'mzouad', reviewed_at: '2026-09-28' })
  })

  it('overwrites a reviewer and a date already present, in place', () => {
    const text = swap(FIXTURE, '  status: published\n', '  status: reviewed\n')
    const r = publishEventsInYaml(text, opts({ by: 'author-2', date: '2026-10-01' }))
    expect(r.published).toEqual([FIXTURE_ID])
    expect(r.text).toBe(
      FIXTURE.replace(FIXTURE_REVIEW, '    reviewed_by: author-2\n    reviewed_at: 2026-10-01\n'),
    )
  })

  it('produces a file that loads with loadDataset, passes the Event schema and validates', () => {
    const r = publishEventsInYaml(REVIEWED, opts({ date: '2026-09-27' }))
    const root = datasetWith('round-trip', r.text)
    const ds = loadDataset(root)
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
    expect(ds.events).toHaveLength(1)
    const event = ds.events[0]?.value
    expect(Event.safeParse(event).success).toBe(true)
    expect(event?.status).toBe('published')
    expect(event?.review).toEqual({
      drafted_by: 'claude-opus-5-5',
      drafted_at: '2026-09-27',
      second_read: { by: 'claude-opus-5-5', at: '2026-09-27', verdict: 'agree' },
      reviewed_by: 'mzouad',
      reviewed_at: '2026-09-27',
      notes: expect.stringMatching(/^Test fixture\./),
    })
    const issues = validate(buildContext(ds, loadMethodology(REPO_ROOT)))
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })

  it('handles several events in one file: publishes, skips with reasons, leaves the rest', () => {
    const r = publishEventsInYaml(MULTI, opts({ exclude: [F, I] }))
    expect(r.published).toEqual([A, G, H])
    expect(r.skipped).toEqual([
      { id: D, reason: 'no second reading: review.second_read is missing (docs/06 §1 rule 6)' },
      {
        id: E,
        reason: 'the second reading has verdict disagree, not agree (docs/06 §1 rule 6)',
      },
      { id: F, reason: 'excluded' },
      { id: I, reason: 'excluded; status is draft, not reviewed' },
    ])
    let expected = swap(
      MULTI,
      '  status: reviewed   # both readings done\n',
      '  status: published   # both readings done\n',
    )
    expected = swap(
      expected,
      '    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}\n    notes: "Synthetic."\n',
      '    second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}\n    reviewed_by: mzouad\n    reviewed_at: 2026-09-28\n    notes: "Synthetic."\n',
    )
    expected = swap(
      expected,
      "  status: 'reviewed'\n  review: {drafted_by: claude-opus-5-5, drafted_at: 2026-09-20, second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}}\n",
      '  status: published\n  review: {drafted_by: claude-opus-5-5, drafted_at: 2026-09-20, second_read: {by: claude-opus-5-5, at: 2026-09-21, verdict: agree}, reviewed_by: mzouad, reviewed_at: 2026-09-28}\n',
    )
    expected = swap(
      expected,
      '      verdict: agree\n    reviewed_by: null\n    reviewed_at:   # set by publish:events\n',
      '      verdict: agree\n    reviewed_by: mzouad\n    reviewed_at:   2026-09-28 # set by publish:events\n',
    )
    const hStatus = `${head(H, '2025-01-09')}  status: reviewed\n`
    expected = swap(expected, hStatus, `${head(H, '2025-01-09')}  status: published\n`)
    expect(r.text).toBe(expected)

    // Every item still passes the Event schema, and the untouched ones are unchanged.
    const before = parse(MULTI, { version: '1.2', schema: 'core' }) as Record<string, unknown>[]
    const after = parse(r.text, { version: '1.2', schema: 'core' }) as Record<string, unknown>[]
    expect(after).toHaveLength(9)
    for (const item of after) expect(Event.safeParse(item).success).toBe(true)
    for (const k of [1, 2, 3, 4, 5, 8]) expect(after[k]).toEqual(before[k])
    expect(after.map((e) => e.status)).toEqual([
      'published',
      'draft',
      'published',
      'reviewed',
      'reviewed',
      'reviewed',
      'published',
      'published',
      'draft',
    ])
    const root = datasetWith('multi', r.text)
    const ds = loadDataset(root)
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
    expect(ds.events.map((e) => e.value.id)).toEqual([A, B, C, D, E, F, G, H, I])
  })

  it('leaves draft and published events untouched and unlisted', () => {
    const r = publishEventsInYaml(FIXTURE, opts())
    expect(r).toEqual({ text: FIXTURE, published: [], skipped: [] })
    const draft = swap(FIXTURE, '  status: published\n', '  status: draft\n')
    expect(publishEventsInYaml(draft, opts())).toEqual({ text: draft, published: [], skipped: [] })
  })

  it('is idempotent: a second run publishes nothing and returns the same bytes', () => {
    const once = publishEventsInYaml(MULTI, opts({ exclude: [F, I] })).text
    const twice = publishEventsInYaml(once, opts({ exclude: [F, I] }))
    expect(twice.text).toBe(once)
    expect(twice.published).toEqual([])
  })

  it('skips an excluded reviewed event', () => {
    const r = publishEventsInYaml(REVIEWED, opts({ exclude: [FIXTURE_ID] }))
    expect(r).toEqual({
      text: REVIEWED,
      published: [],
      skipped: [{ id: FIXTURE_ID, reason: 'excluded' }],
    })
  })

  it('skips a review dated before the drafting or the second reading', () => {
    // Drafted 2026-09-20, second reading 2026-09-21.
    const early = publishEventsInYaml(MULTI, opts({ date: '2026-09-19', exclude: [F, I] }))
    expect(early.published).toEqual([])
    expect(early.skipped).toContainEqual({
      id: A,
      reason: 'the review date 2026-09-19 is before review.drafted_at 2026-09-20',
    })
    const between = publishEventsInYaml(MULTI, opts({ date: '2026-09-20', exclude: [F, I] }))
    expect(between.published).toEqual([])
    expect(between.skipped).toContainEqual({
      id: H,
      reason: 'the review date 2026-09-20 is before the second reading of 2026-09-21',
    })
    const sameDay = publishEventsInYaml(MULTI, opts({ date: '2026-09-21', exclude: [F, I] }))
    expect(sameDay.published).toEqual([A, G, H])
  })

  it('skips a second reading that is null or has no verdict', () => {
    const nullRead = swap(
      REVIEWED,
      '    second_read: {by: claude-opus-5-5, at: 2026-09-27, verdict: agree}\n',
      '    second_read: null\n',
    )
    expect(publishEventsInYaml(nullRead, opts()).skipped).toEqual([
      {
        id: FIXTURE_ID,
        reason: 'no second reading: review.second_read is missing (docs/06 §1 rule 6)',
      },
    ])
    const noVerdict = swap(REVIEWED, ', verdict: agree}', '}')
    expect(publishEventsInYaml(noVerdict, opts()).skipped).toEqual([
      {
        id: FIXTURE_ID,
        reason: 'the second reading has verdict (none), not agree (docs/06 §1 rule 6)',
      },
    ])
  })

  it('keeps CRLF line endings and inserts CRLF lines', () => {
    const crlf = REVIEWED.replaceAll('\n', '\r\n')
    const r = publishEventsInYaml(crlf, opts())
    expect(r.published).toEqual([FIXTURE_ID])
    expect(r.text).toBe(
      FIXTURE.replace(
        FIXTURE_REVIEW,
        '    reviewed_by: mzouad\n    reviewed_at: 2026-09-28\n',
      ).replaceAll('\n', '\r\n'),
    )
  })

  it('inserts after a second reading on the last line of a file without a final newline', () => {
    const text = REVIEWED.replace(/\n {4}notes: .*\n$/, '')
    expect(text.endsWith('verdict: agree}')).toBe(true)
    const r = publishEventsInYaml(text, opts())
    const published = swap(text, '  status: reviewed\n', '  status: published\n')
    expect(r.text).toBe(`${published}\n    reviewed_by: mzouad\n    reviewed_at: 2026-09-28\n`)
  })

  it('returns an empty or comment-only file as it is', () => {
    for (const text of ['', '# nothing yet\n', '[]\n']) {
      expect(publishEventsInYaml(text, opts())).toEqual({ text, published: [], skipped: [] })
    }
  })

  it('throws on invalid YAML, a file that is not a list, a reviewed event without id', () => {
    expect(() => publishEventsInYaml('- id: [\n', opts())).toThrow(/^not valid YAML/)
    expect(() => publishEventsInYaml('id: x\n', opts())).toThrow(/expected a list of events/)
    expect(() => publishEventsInYaml('- status: reviewed\n', opts())).toThrow(/event 1 has no id/)
  })

  it('throws rather than change anything beyond the three fields (an alias of the status)', () => {
    const text = [
      `- id: ${A}`,
      '  status: &st reviewed',
      '  review: {drafted_by: x, drafted_at: 2026-09-20, second_read: {by: y, at: 2026-09-21, verdict: agree}}',
      `- id: ${B}`,
      '  status: *st',
      '  review: {drafted_by: x, drafted_at: 2026-09-20}',
      '',
    ].join('\n')
    expect(() => publishEventsInYaml(text, opts())).toThrow(
      'the edit would change more than status, reviewed_by and reviewed_at; nothing written',
    )
  })

  it('refuses a malformed reviewer handle or review date', () => {
    expect(() => publishEventsInYaml(REVIEWED, opts({ by: 'm zouad' }))).toThrow(RangeError)
    expect(() => publishEventsInYaml(REVIEWED, opts({ by: 'a: b' }))).toThrow(RangeError)
    expect(() => publishEventsInYaml(REVIEWED, opts({ date: '2026-02-30' }))).toThrow(RangeError)
    expect(() => publishEventsInYaml(REVIEWED, opts({ date: '27/09/2026' }))).toThrow(RangeError)
  })

  it('skips the events named in unchanged, and reports an excluded one as excluded', () => {
    const r = publishEventsInYaml(LATER, { ...opts(), unchanged: new Set([A]) })
    expect(r.published).toEqual([B, C, J])
    expect(r.skipped).toEqual([
      {
        id: A,
        reason: 'reviewed before this pull request and not changed by it; not published here',
      },
    ])
    expect(r.text).toBe(
      `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(B, '2025-01-03')}${PUBLISHED_LINES('2026-09-28')}${EDITED_C}${PUBLISHED_LINES('2026-09-28')}${head(J, '2025-01-11')}${PUBLISHED_LINES('2026-09-28')}`,
    )
    const both = publishEventsInYaml(LATER, { ...opts({ exclude: [A] }), unchanged: new Set([A]) })
    expect(both.skipped).toEqual([{ id: A, reason: 'excluded' }])
    expect(both.published).toEqual([B, C, J])
  })
})

describe('unchangedReviewedIds', () => {
  it('lists the events reviewed at the merge base and identical on the head, and only those', () => {
    expect(EDITED_C).not.toBe(head(C, '2025-01-04'))
    // A: reviewed at the base, identical. B: a draft at the base. C: edited. J: added.
    expect(unchangedReviewedIds(EARLIER, LATER)).toEqual(new Set([A]))
    expect(unchangedReviewedIds(EARLIER, EARLIER)).toEqual(new Set([A, C]))
    // The pull request adds the file: nothing was reviewed before it.
    expect(unchangedReviewedIds(null, LATER)).toEqual(new Set())
    // A published event is not a reviewed one.
    expect(unchangedReviewedIds(FIXTURE, FIXTURE)).toEqual(new Set())
    expect(unchangedReviewedIds('', LATER)).toEqual(new Set())
  })

  it('compares values, not bytes: comments, quoting and order do not make an event changed', () => {
    const restyled = `${TOP}${head(C, '2025-01-04')}${REVIEWED_LINES}# moved, and A's status quoted
${head(A, '2025-01-02')}${swap(REVIEWED_LINES, '  status: reviewed\n', "  status: 'reviewed'\n")}`
    expect(unchangedReviewedIds(EARLIER, restyled)).toEqual(new Set([A, C]))
  })

  it('throws on a base or head file that is not valid YAML or not a list', () => {
    expect(() => unchangedReviewedIds('- id: [\n', LATER)).toThrow(
      /^at the merge base: not valid YAML/,
    )
    expect(() => unchangedReviewedIds('id: x\n', LATER)).toThrow(
      'at the merge base: expected a list of events (docs/03 §4)',
    )
    expect(() => unchangedReviewedIds(EARLIER, '- id: [\n')).toThrow(/^not valid YAML/)
  })
})

describe('localIsoDate', () => {
  it('gives the local calendar date, not the UTC one', () => {
    // Built from local fields, so the expectations hold in every time zone. In Paris (UTC+2 in
    // October), 00:30 on 5 October is 22:30 UTC on 4 October, whose UTC date the command used to
    // take; 23:59 on 4 October in New York (UTC−4) is 03:59 UTC on 5 October.
    expect(localIsoDate(new Date(2026, 9, 5, 0, 30))).toBe('2026-10-05')
    expect(localIsoDate(new Date(2026, 9, 4, 23, 59))).toBe('2026-10-04')
    expect(localIsoDate(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01')
    expect(localIsoDate(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31')
  })
})

describe('parsePublishArgs', () => {
  it('reads the options with their defaults', () => {
    expect(parsePublishArgs(['--pr', '12'])).toEqual({
      pr: 12,
      by: DEFAULT_REVIEWER,
      exclude: [],
      dryRun: false,
    })
    expect(DEFAULT_REVIEWER).toBe('mzouad')
    expect(
      parsePublishArgs([
        '--',
        '--pr',
        '7',
        '--by',
        'author.2',
        '--date',
        '2026-09-01',
        '--exclude',
        `${B},${A}, ${B}`,
        '--exclude',
        C,
        '--dry-run',
      ]),
    ).toEqual({ pr: 7, by: 'author.2', date: '2026-09-01', exclude: [A, B, C], dryRun: true })
  })

  it('rejects malformed options', () => {
    const bad: [string[], RegExp][] = [
      [[], /--pr is required/],
      [['--pr'], /--pr needs a value/],
      [['--pr', '--dry-run'], /--pr needs a value/],
      [['--pr', 'x'], /--pr expects a pull request number/],
      [['--pr', '0'], /--pr expects a pull request number/],
      [['--pr', '1', '--by', 'a b'], /--by expects a handle/],
      [['--pr', '1', '--date', '2026-02-30'], /--date expects a date/],
      [['--pr', '1', '--exclude', 'src_20250101_a_b'], /--exclude expects event ids/],
      [['--pr', '1', '--exclude', 'evt_2025_01_01_DEU_B1_unga-es-10-21'], /--exclude expects/],
      [['--pr', '1', '--force'], /unknown option --force/],
    ]
    for (const [argv, message] of bad) expect(() => parsePublishArgs(argv)).toThrow(message)
  })
})

// ---------------------------------------------------------------------------------------------
// The command, with gh, git and the file system replaced by in-memory doubles

interface Fake {
  env: PublishEnv
  files: Map<string, string>
  writes: Map<string, string>
  gh: string[][]
  git: string[][]
}

// Commit ids of the doubles: the pull request's head, its base branch's tip, their merge base.
const OID = '0123456789abcdef0123456789abcdef01234567'
const BASE_OID = 'abcdefabcdefabcdefabcdefabcdefabcdefabcd'
const MB = '89abcdef0123456789abcdef0123456789abcdef'
/** What the header says of the pull request of the doubles. */
const AT = 'data/wave-1 into main, merge base 89abcdef0123'
const VIEW = ['pr', 'view', '12', '--json', 'headRefName,headRefOid,baseRefName,baseRefOid,state']
const ok = (stdout: string): CommandResult => ({ code: 0, stdout, stderr: '' })
const failed = (code: number, stderr: string): CommandResult => ({ code, stdout: '', stderr })

/**
 * gh, git and the working tree in memory. `files` is the working tree (the pull request's head),
 * `base` the files at the merge base, `diff` the paths the pull request changes; git reports
 * each as A (not in `base`), M (in both) or D (not in `files`).
 */
function fake(
  over: {
    files?: Record<string, string>
    base?: Record<string, string>
    diff?: string[]
    branch?: string
    head?: string
    state?: string
    localOid?: string
    dirty?: string
    view?: CommandResult
    baseKnown?: boolean
    mergeBase?: CommandResult
    diffResult?: CommandResult
    blob?: CommandResult
  } = {},
): Fake {
  const files = new Map(Object.entries(over.files ?? { 'data/events/DEU.yaml': REVIEWED }))
  const base = new Map(Object.entries(over.base ?? {}))
  const writes = new Map<string, string>()
  const gh: string[][] = []
  const git: string[][] = []
  const nameStatus = (over.diff ?? ['data/events/DEU.yaml'])
    .map((p) => `${files.has(p) ? (base.has(p) ? 'M' : 'A') : 'D'}\0${p}\0`)
    .join('')
  const env: PublishEnv = {
    today: '2026-09-27',
    gh: (args) => {
      gh.push([...args])
      if (args[1] === 'view') {
        const json = {
          headRefName: over.head ?? 'data/wave-1',
          headRefOid: OID,
          baseRefName: 'main',
          baseRefOid: BASE_OID,
          state: over.state ?? 'OPEN',
        }
        return over.view ?? ok(`${JSON.stringify(json)}\n`)
      }
      return failed(1, 'unexpected')
    },
    git: (args) => {
      git.push([...args])
      if (args[0] === 'rev-parse' && args[1] === '--abbrev-ref')
        return ok(`${over.branch ?? 'data/wave-1'}\n`)
      if (args[0] === 'rev-parse') return ok(`${over.localOid ?? OID}\n`)
      if (args[0] === 'cat-file' && args[1] === '-e') {
        return over.baseKnown === false ? failed(128, 'fatal: Not a valid object name') : ok('')
      }
      if (args[0] === 'merge-base') return over.mergeBase ?? ok(`${MB}\n`)
      if (args[0] === 'diff') return over.diffResult ?? ok(nameStatus)
      if (args[0] === 'status') return ok(over.dirty ?? '')
      if (args[0] === 'cat-file' && args[1] === 'blob') {
        const text = base.get(String(args[2]).slice(`${MB}:`.length))
        return over.blob ?? (text === undefined ? failed(128, 'fatal: path not found') : ok(text))
      }
      return failed(1, 'unexpected')
    },
    readFile: (path) => files.get(path) ?? null,
    writeFile: (path, text) => {
      writes.set(path, text)
    },
  }
  return { env, files, writes, gh, git }
}

/** The git calls up to the list of changed files. */
const GIT_TO_DIFF = [
  ['rev-parse', '--abbrev-ref', 'HEAD'],
  ['rev-parse', 'HEAD'],
  ['cat-file', '-e', `${BASE_OID}^{commit}`],
  ['merge-base', BASE_OID, 'HEAD'],
  ['diff', '--name-status', '-z', '--no-renames', MB, 'HEAD'],
]

const PUBLISHED_FIXTURE = (date: string, by = 'mzouad') =>
  FIXTURE.replace(FIXTURE_REVIEW, `    reviewed_by: ${by}\n    reviewed_at: ${date}\n`)

describe('runPublishEvents', () => {
  it('publishes the reviewed events of the changed data/events files and ignores other files', () => {
    const f = fake({
      files: {
        'data/events/DEU.yaml': REVIEWED,
        'data/events/FRA.yaml': FIXTURE,
        'fixtures/data/events/DEU.yaml': REVIEWED,
        'data/events/README.md': 'status: reviewed\n',
        'data/events/old/DEU.yaml': REVIEWED,
        'data/assessments/DEU.yaml': 'country: DEU\n',
        'data/sources/2025/src_20250808_bundesregierung_ruestungsexporte-gaza.yaml': 'id: x\n',
      },
      diff: [
        'data/sources/2025/src_20250808_bundesregierung_ruestungsexporte-gaza.yaml',
        'data/events/FRA.yaml',
        'fixtures/data/events/DEU.yaml',
        'data/events/README.md',
        'data/events/old/DEU.yaml',
        'data/assessments/DEU.yaml',
        'data/events/DEU.yaml',
      ],
    })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.stderr).toBe('')
    expect(r.code).toBe(0)
    expect(r.stdout).toBe(
      [
        `PR #12 (${AT}): 2 event files changed, 5 other changed files ignored`,
        'data/events/DEU.yaml',
        `  published ${FIXTURE_ID}`,
        'data/events/FRA.yaml',
        '  nothing to publish',
        'Published 1 event in 1 file (reviewed_by mzouad, reviewed_at 2026-09-27); skipped 0.',
        'Next: run pnpm validate, then commit the edited files.',
        '',
      ].join('\n'),
    )
    expect([...f.writes.keys()]).toEqual(['data/events/DEU.yaml'])
    expect(f.writes.get('data/events/DEU.yaml')).toBe(PUBLISHED_FIXTURE('2026-09-27'))
    // Both event files are added by the pull request: nothing to read at the merge base.
    expect(f.gh).toEqual([VIEW])
    expect(f.git).toEqual([
      ...GIT_TO_DIFF,
      ['status', '--porcelain', '--', 'data/events/DEU.yaml', 'data/events/FRA.yaml'],
    ])
  })

  it('uses --by and --date', () => {
    const f = fake()
    const r = runPublishEvents(['--pr', '3', '--by', 'author-2', '--date', '2026-09-27'], f.env)
    expect(r.code).toBe(0)
    expect(f.writes.get('data/events/DEU.yaml')).toBe(PUBLISHED_FIXTURE('2026-09-27', 'author-2'))
  })

  it('refuses when the current branch is not the head of the pull request', () => {
    const f = fake({ branch: 'main' })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(1)
    expect(r.stdout).toBe('')
    expect(r.stderr).toBe(
      'refusing: the current branch is main, but PR #12 comes from data/wave-1; check it out first (gh pr checkout 12)\n',
    )
    expect(f.writes.size).toBe(0)
    expect(f.gh).toEqual([VIEW])
  })

  it('refuses when HEAD is not the head commit of the pull request', () => {
    const f = fake({ localOid: 'fedcba9876543210fedcba9876543210fedcba98' })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(1)
    expect(r.stderr).toBe(
      'refusing: HEAD is at fedcba987654, but the head of PR #12 is 0123456789ab; pull or push data/wave-1 first, so that the events published are the ones reviewed\n',
    )
    expect(f.writes.size).toBe(0)
  })

  it('refuses a merged or closed pull request, before any git call', () => {
    const states: [string, string][] = [
      ['MERGED', 'merged'],
      ['CLOSED', 'closed'],
    ]
    for (const [state, word] of states) {
      const f = fake({ state })
      expect(runPublishEvents(['--pr', '12'], f.env)).toEqual({
        code: 1,
        stdout: '',
        stderr: `refusing: PR #12 is ${word}; publish:events flips the events on the PR branch before merge (docs/03 §11). Open a new pull request from data/wave-1 if it was merged without the flip.\n`,
      })
      expect(f.writes.size).toBe(0)
      expect(f.git).toEqual([])
    }
  })

  it('refuses when the event files have uncommitted changes', () => {
    const f = fake({ dirty: ' M data/events/DEU.yaml\n' })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(1)
    expect(r.stderr).toBe(
      'refusing: uncommitted changes in the event files (an earlier publish:events run?); commit or discard them first:\n   M data/events/DEU.yaml\n',
    )
    expect(f.writes.size).toBe(0)
  })

  it('writes nothing with --dry-run', () => {
    const f = fake()
    const r = runPublishEvents(['--pr', '12', '--dry-run'], f.env)
    expect(r.code).toBe(0)
    expect(f.writes.size).toBe(0)
    expect(r.stdout).toBe(
      [
        `PR #12 (${AT}): 1 event file changed`,
        'data/events/DEU.yaml',
        `  published ${FIXTURE_ID}`,
        'Dry run: would publish 1 event in 1 file (reviewed_by mzouad, reviewed_at 2026-09-27); skipped 0. No file written.',
        '',
      ].join('\n'),
    )
  })

  it('lists excluded and skipped events and writes only the files that changed', () => {
    const f = fake({
      files: { 'data/events/DEU.yaml': MULTI, 'data/events/FRA.yaml': REVIEWED },
      diff: ['data/events/DEU.yaml', 'data/events/FRA.yaml'],
    })
    const r = runPublishEvents(['--pr', '5', '--exclude', `${FIXTURE_ID},${F}`], f.env)
    expect(r.code).toBe(0)
    expect(r.stdout).toBe(
      [
        `PR #5 (${AT}): 2 event files changed`,
        'data/events/DEU.yaml',
        `  published ${A}`,
        `  published ${G}`,
        `  published ${H}`,
        `  skipped   ${D}: no second reading: review.second_read is missing (docs/06 §1 rule 6)`,
        `  skipped   ${E}: the second reading has verdict disagree, not agree (docs/06 §1 rule 6)`,
        `  skipped   ${F}: excluded`,
        'data/events/FRA.yaml',
        `  skipped   ${FIXTURE_ID}: excluded`,
        'Published 3 events in 1 file (reviewed_by mzouad, reviewed_at 2026-09-27); skipped 4.',
        'Next: run pnpm validate, then commit the edited files.',
        '',
      ].join('\n'),
    )
    expect([...f.writes.keys()]).toEqual(['data/events/DEU.yaml'])
  })

  it('publishes only the events the pull request adds or changes, not those reviewed before it', () => {
    const f = fake({
      files: { 'data/events/DEU.yaml': LATER },
      base: { 'data/events/DEU.yaml': EARLIER },
    })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.stderr).toBe('')
    expect(r.code).toBe(0)
    expect(r.stdout).toBe(
      [
        `PR #12 (${AT}): 1 event file changed`,
        'data/events/DEU.yaml',
        `  published ${B}`,
        `  published ${C}`,
        `  published ${J}`,
        `  skipped   ${A}: reviewed before this pull request and not changed by it; not published here`,
        'Published 3 events in 1 file (reviewed_by mzouad, reviewed_at 2026-09-27); skipped 1.',
        'Next: run pnpm validate, then commit the edited files.',
        '',
      ].join('\n'),
    )
    // A stays reviewed; B (second reading done here), C (edited here) and J (added) publish.
    expect(f.writes.get('data/events/DEU.yaml')).toBe(
      `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(B, '2025-01-03')}${PUBLISHED_LINES('2026-09-27')}${EDITED_C}${PUBLISHED_LINES('2026-09-27')}${head(J, '2025-01-11')}${PUBLISHED_LINES('2026-09-27')}`,
    )
    expect(f.git).toEqual([
      ...GIT_TO_DIFF,
      ['status', '--porcelain', '--', 'data/events/DEU.yaml'],
      ['cat-file', 'blob', `${MB}:data/events/DEU.yaml`],
    ])
  })

  it('does not publish, with a later pull request, an event excluded from an earlier one', () => {
    // PR #3 adds A and C; the author excludes A. Its file, once published and merged, is the
    // merge base of PR #9, which adds J to the same file and excludes nothing.
    const pr3 = `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(C, '2025-01-04')}${REVIEWED_LINES}`
    const first = fake({ files: { 'data/events/DEU.yaml': pr3 } })
    const r3 = runPublishEvents(['--pr', '3', '--exclude', A], first.env)
    expect(r3.code).toBe(0)
    expect(r3.stdout).toContain(`  published ${C}\n  skipped   ${A}: excluded\n`)
    const merged = first.writes.get('data/events/DEU.yaml') ?? ''
    expect(merged).toBe(
      `${TOP}${head(A, '2025-01-02')}${REVIEWED_LINES}${head(C, '2025-01-04')}${PUBLISHED_LINES('2026-09-27')}`,
    )

    const pr9 = `${merged}${head(J, '2025-01-11')}${REVIEWED_LINES}`
    const later = fake({
      files: { 'data/events/DEU.yaml': pr9 },
      base: { 'data/events/DEU.yaml': merged },
    })
    const r9 = runPublishEvents(['--pr', '9'], later.env)
    expect(r9.code).toBe(0)
    expect(r9.stdout).toContain(
      `  published ${J}\n  skipped   ${A}: reviewed before this pull request and not changed by it; not published here\n`,
    )
    expect(later.writes.get('data/events/DEU.yaml')).toBe(
      `${merged}${head(J, '2025-01-11')}${PUBLISHED_LINES('2026-09-27')}`,
    )
  })

  it('accepts an --exclude naming an event reviewed before the pull request', () => {
    const f = fake({
      files: { 'data/events/DEU.yaml': LATER },
      base: { 'data/events/DEU.yaml': EARLIER },
    })
    const r = runPublishEvents(['--pr', '12', '--exclude', `${A},${J}`], f.env)
    expect(r.code).toBe(0)
    expect(r.stdout).toContain(
      `  published ${B}\n  published ${C}\n  skipped   ${A}: excluded\n  skipped   ${J}: excluded\n`,
    )
  })

  it('refuses an excluded id that is not an event of the changed files, writing nothing', () => {
    const f = fake()
    const r = runPublishEvents(['--pr', '12', '--exclude', 'evt_2025_08_08_DEU_A7'], f.env)
    expect(r.code).toBe(2)
    expect(r.stderr).toBe(
      '--exclude names ids that are not events of the files PR #12 changes: evt_2025_08_08_DEU_A7\n',
    )
    expect(f.writes.size).toBe(0)
  })

  it('exits 2 on usage errors without calling gh or git', () => {
    for (const argv of [
      [],
      ['--pr'],
      ['--pr', 'x'],
      ['--pr', '12', '--date', '2026-13-01'],
      ['--pr', '12', '--by', 'a:b'],
      ['--pr', '12', '--exclude', 'nope'],
      ['--pr', '12', '--unknown'],
      ['--pr', '12', '--date', '2026-09-28'],
    ]) {
      const f = fake()
      const r = runPublishEvents(argv, f.env)
      expect(r.code, argv.join(' ')).toBe(2)
      expect(r.stdout).toBe('')
      expect(r.stderr).not.toBe('')
      expect(f.gh).toEqual([])
      expect(f.git).toEqual([])
    }
    expect(runPublishEvents(['--pr', '12', '--date', '2026-09-28'], fake().env).stderr).toBe(
      '--date 2026-09-28 is after today (2026-09-27); the review date is the day of the review\n',
    )
  })

  it('dates the review with the local day it is given, just after local midnight too', () => {
    // 00:30 on 5 October, local time: an event drafted and read a second time that day.
    const drafted = swap(
      swap(REVIEWED_LINES, 'drafted_at: 2026-09-20', 'drafted_at: 2026-10-05'),
      'at: 2026-09-21',
      'at: 2026-10-05',
    )
    const f = fake({
      files: { 'data/events/DEU.yaml': `${TOP}${head(J, '2025-01-11')}${drafted}` },
    })
    f.env.today = localIsoDate(new Date(2026, 9, 5, 0, 30))
    const r = runPublishEvents(['--pr', '12', '--date', '2026-10-05'], f.env)
    expect(r.stderr).toBe('')
    expect(r.stdout).toContain(`  published ${J}\n`)
    expect(f.writes.get('data/events/DEU.yaml')).toContain(
      '    reviewed_by: mzouad\n    reviewed_at: 2026-10-05\n',
    )
  })

  it('exits 1 when gh fails or answers unexpectedly', () => {
    const view = fake({ view: failed(1, 'no pull requests found\n') })
    expect(runPublishEvents(['--pr', '99'], view.env)).toEqual({
      code: 1,
      stdout: '',
      stderr: 'gh pr view 99 failed (exit 1): no pull requests found\n',
    })
    const expected = (got: string) =>
      `gh pr view 99: expected JSON with headRefName, headRefOid, baseRefName, baseRefOid and state, got ${got}\n`
    const garbled = fake({ view: ok('not json') })
    expect(runPublishEvents(['--pr', '99'], garbled.env).stderr).toBe(expected('not json'))
    // An older answer without the base and the state, and a base that is not a commit id.
    const partial = JSON.stringify({ headRefName: 'data/wave-1', headRefOid: OID })
    expect(runPublishEvents(['--pr', '99'], fake({ view: ok(partial) }).env).stderr).toBe(
      expected(partial),
    )
    const badBase = JSON.stringify({
      headRefName: 'data/wave-1',
      headRefOid: OID,
      baseRefName: 'main',
      baseRefOid: '--output=x',
      state: 'OPEN',
    })
    const bad = fake({ view: ok(badBase) })
    expect(runPublishEvents(['--pr', '99'], bad.env).stderr).toBe(expected(badBase))
    expect(bad.git).toEqual([])
  })

  it('lists the changed files with git from the merge base, however many (no gh pr diff)', () => {
    // A wave-sized pull request: GitHub refuses its diff (HTTP 406 beyond 300 files).
    const sources = Array.from(
      { length: 400 },
      (_, i) => `data/sources/2025/src_20250101_synthetic_${String(i).padStart(3, '0')}.yaml`,
    )
    const f = fake({
      files: {
        'data/events/DEU.yaml': REVIEWED,
        ...Object.fromEntries(sources.map((p) => [p, 'id: x\n'])),
      },
      diff: [...sources, 'data/events/DEU.yaml'],
    })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(0)
    expect(r.stdout).toMatch(
      /^PR #12 \(data\/wave-1 into main, merge base 89abcdef0123\): 1 event file changed, 400 other changed files ignored\n/,
    )
    expect(f.gh).toEqual([VIEW])
    expect(f.writes.get('data/events/DEU.yaml')).toBe(PUBLISHED_FIXTURE('2026-09-27'))
  })

  it('refuses when the base commit of the pull request is not in the local repository', () => {
    const f = fake({ baseKnown: false })
    expect(runPublishEvents(['--pr', '12'], f.env)).toEqual({
      code: 1,
      stdout: '',
      stderr:
        'refusing: the base of PR #12 (main at abcdefabcdef) is not in the local repository; run git fetch origin main first\n',
    })
    expect(f.git).toEqual(GIT_TO_DIFF.slice(0, 3))
    expect(f.writes.size).toBe(0)
  })

  it('exits 1, writing nothing, when git merge-base, git diff or git cat-file fails', () => {
    const noBase = fake({ mergeBase: failed(1, '') })
    expect(runPublishEvents(['--pr', '12'], noBase.env)).toEqual({
      code: 1,
      stdout: '',
      stderr: 'git merge-base abcdefabcdef HEAD failed (exit 1)\n',
    })
    const diff = fake({ diffResult: failed(128, 'fatal: bad object\n') })
    expect(runPublishEvents(['--pr', '12'], diff.env)).toEqual({
      code: 1,
      stdout: '',
      stderr: 'git diff --name-status 89abcdef0123 HEAD failed (exit 128): fatal: bad object\n',
    })
    const blob = fake({
      base: { 'data/events/DEU.yaml': REVIEWED },
      blob: failed(128, 'fatal: unable to read'),
    })
    expect(runPublishEvents(['--pr', '12'], blob.env)).toEqual({
      code: 1,
      stdout: '',
      stderr:
        'git cat-file blob 89abcdef0123:data/events/DEU.yaml failed (exit 128): fatal: unable to read\n',
    })
    const broken = fake({ base: { 'data/events/DEU.yaml': '- id: [\n' } })
    expect(runPublishEvents(['--pr', '12'], broken.env).stderr).toMatch(
      /^data\/events\/DEU\.yaml: at the merge base: not valid YAML/,
    )
    for (const f of [noBase, diff, blob, broken]) expect(f.writes.size).toBe(0)
  })

  it('reports event files deleted by the pull request and publishes the others', () => {
    const f = fake({ diff: ['data/events/DEU.yaml', 'data/events/XYZ.yaml'] })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(0)
    expect(r.stdout).toContain(
      'Not in the working tree (deleted by the pull request?), ignored: data/events/XYZ.yaml\n',
    )
    expect([...f.writes.keys()]).toEqual(['data/events/DEU.yaml'])
  })

  it('says so when the pull request changes no event file', () => {
    const f = fake({ diff: ['data/sources/2025/x.yaml', 'README.md'] })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r).toEqual({
      code: 0,
      stdout: `PR #12 (${AT}): 0 event files changed, 2 other changed files ignored\nNothing to publish.\n`,
      stderr: '',
    })
    expect(f.git).toEqual(GIT_TO_DIFF)
  })

  it('writes nothing when one of the files cannot be edited', () => {
    const f = fake({
      files: { 'data/events/DEU.yaml': REVIEWED, 'data/events/FRA.yaml': '- id: [\n' },
      diff: ['data/events/DEU.yaml', 'data/events/FRA.yaml'],
    })
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(1)
    expect(r.stderr).toMatch(/^data\/events\/FRA\.yaml: not valid YAML/)
    expect(f.writes.size).toBe(0)
  })

  it('exits 1 when a file cannot be read', () => {
    const f = fake()
    f.env.readFile = () => {
      throw new Error('not valid UTF-8')
    }
    expect(runPublishEvents(['--pr', '12'], f.env)).toEqual({
      code: 1,
      stdout: '',
      stderr: 'data/events/DEU.yaml: not valid UTF-8\n',
    })
  })

  it('edits a real copy of the fixture dataset that then loads, parses and validates', () => {
    const root = datasetWith('cli', REVIEWED)
    const f = fake()
    f.env.readFile = (path) => readFileSync(join(root, path), 'utf8')
    f.env.writeFile = (path, text) => writeFileSync(join(root, path), text)
    const r = runPublishEvents(['--pr', '12'], f.env)
    expect(r.code).toBe(0)
    const written = readFileSync(join(root, 'data/events/DEU.yaml'), 'utf8')
    expect(written).toBe(PUBLISHED_FIXTURE('2026-09-27'))
    const ds = loadDataset(root)
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
    expect(Event.safeParse(ds.events[0]?.value).success).toBe(true)
    expect(ds.events[0]?.value.status).toBe('published')
    const issues = validate(buildContext(ds, loadMethodology(REPO_ROOT)))
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })
})

describe('the entry point', () => {
  const tsx = join(REPO_ROOT, 'node_modules/.bin/tsx')
  const entry = join(REPO_ROOT, 'packages/pipeline/src/cli/publish-events.ts')

  it('exits 2 with the usage on a usage error, before calling gh', () => {
    const r = spawnSync(tsx, [entry], { cwd: tmpdir(), encoding: 'utf8', timeout: 60_000 })
    expect(r.status).toBe(2)
    expect(r.stdout).toBe('')
    expect(r.stderr).toBe(
      '--pr is required\nusage: pnpm publish:events --pr N [--by HANDLE] [--date YYYY-MM-DD] [--exclude id,id…] [--dry-run]\n',
    )
    const future = spawnSync(tsx, [entry, '--pr', '1', '--date', '2999-01-01'], {
      cwd: tmpdir(),
      encoding: 'utf8',
      timeout: 60_000,
    })
    expect(future.status).toBe(2)
    expect(future.stderr).toMatch(/^--date 2999-01-01 is after today/)
  })
})
