/**
 * `pnpm publish:events --pr N [--by HANDLE] [--date YYYY-MM-DD] [--exclude id,id…] [--dry-run]`
 * — the review flip of docs/06 §4 step 10 and of the P-D review prompt (PROMPTS.md). After the
 * author has reviewed a data pull request, every event that the pull request adds or changes in
 * data/events/*.yaml and that stands at `status: reviewed` becomes `status: published`, with
 * `review.reviewed_by` and `review.reviewed_at` set (docs/03 §4: a published event names its
 * reviewer and review date; docs/03 §11: the author runs this command on the PR branch before
 * merge, CI flips nothing, and only `published` scores).
 *
 * An event is published only when (publishEventsInYaml):
 * - its status is `reviewed` (draft and published events are left as they are and not listed);
 * - its id is not excluded (`--exclude`: the events the author did not approve);
 * - the pull request adds it or changes it: an event already `reviewed` at the merge base and
 *   identical there (unchangedReviewedIds) was reviewed with an earlier pull request, where the
 *   author published or excluded it; it is not in this pull request's diff, so this review
 *   cannot approve it;
 * - `review.second_read` exists with verdict `agree` (docs/06 §1 rule 6; validator rule
 *   event.second-read);
 * - the review date is not before `review.drafted_at` (validator rule on review dates) nor
 *   before `review.second_read.at` (the author reviews after the second reading, docs/06 §4
 *   steps 8–10).
 * Every other `reviewed` event, and every event whose id is excluded, is listed in `skipped`
 * with the reason.
 *
 * The file is edited in place, not re-serialised: the `yaml` Document API locates the nodes
 * (their source ranges), and only the `status` scalar, the `reviewed_by` and `reviewed_at`
 * scalars (or two lines inserted after `second_read`, or `, reviewed_by: …` inside a flow map)
 * change; comments, quoting, flow maps, folding and line breaks elsewhere stay byte for byte.
 * `reviewed_at` is a plain date scalar (YYYY-MM-DD, unquoted), as every date in data/events
 * (read as a string under the YAML 1.2 core schema the loader uses). The result is parsed again
 * and compared with the original: the three fields of the published events must be the only
 * differences, otherwise the function throws and nothing is written.
 *
 * The command (runPublishEvents) reads the pull request with `gh pr view N --json
 * headRefName,headRefOid,baseRefName,baseRefOid,state` and refuses to write unless it is open
 * (the flip happens before merge; after it, the commit would land on a dead branch), the
 * checked-out branch is its head branch, the local HEAD is its head commit (so that what is
 * published is what the author reviewed) and its base commit is in the local repository (else:
 * `git fetch origin <base>`). The changed files come from git, not from `gh pr diff`, which
 * GitHub refuses (HTTP 406) beyond 300 files or 20,000 lines, the size of a wave pull request:
 * as HEAD is the pull request's head, `git merge-base <baseRefOid> HEAD` and
 * `git diff --name-status -z --no-renames <merge base> HEAD` list the files GitHub shows, with
 * whether each was added. The command keeps the data/events/*.yaml files present in the
 * working tree, refuses when they have uncommitted changes, reads each file the pull request
 * modifies as it was at the merge base (`git cat-file blob`), edits every file (unless
 * --dry-run), prints the published and skipped ids per file and reminds to run `pnpm validate`.
 *
 * Pure: gh, git, the file system and today's date are injected; cli/publish-events.ts supplies
 * them (today: localIsoDate, the author's local calendar date). Exit codes: 0 done (also when
 * nothing was published), 1 gh or git failed, a check refused or a file could not be edited,
 * 2 usage error.
 */
import { isDeepStrictEqual } from 'node:util'
import { parseEventId } from '@gai/schema'
import { isIsoDate } from '@gai/scoring'
import { isMap, isScalar, isSeq, type Node, type Pair, parseDocument, type YAMLMap } from 'yaml'
import { UsageError } from './score-cli.js'

/** The reviewer recorded when --by is absent (PROMPTS.md, P-D review prompt). */
export const DEFAULT_REVIEWER = 'mzouad'

/** A reviewer handle: letters, digits, `.`, `_` and `-`, starting and ending with a letter or digit. */
const HANDLE = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/

/** The hand-written event files (docs/03 §1: one file per country). */
const EVENT_FILE = /^data\/events\/[^/]+\.yaml$/

/** The loader's parse options (packages/schema load/parse.ts): YAML 1.2, core schema. */
const YAML_OPTIONS = {
  version: '1.2',
  schema: 'core',
  uniqueKeys: true,
  prettyErrors: false,
} as const

// ---------------------------------------------------------------------------------------------
// The edit of one file

export interface PublishOptions {
  /** `review.reviewed_by`: the reviewer's handle. */
  by: string
  /** `review.reviewed_at`: the review date, YYYY-MM-DD. */
  date: string
  /** Ids of events the author did not approve: left as they are. */
  exclude: ReadonlySet<string>
  /**
   * Ids of reviewed events that the pull request neither adds nor changes (unchangedReviewedIds):
   * left as they are. Default: none.
   */
  unchanged?: ReadonlySet<string>
}

/** The reason given for an event of `PublishOptions.unchanged`. */
export const UNCHANGED_REASON =
  'reviewed before this pull request and not changed by it; not published here'

export interface SkippedEvent {
  id: string
  reason: string
}

export interface PublishResult {
  /** The edited file; the input itself when nothing was published. */
  text: string
  /** Ids of the events set to published, in file order. */
  published: string[]
  /** Reviewed events left unpublished and excluded events, in file order, with the reason. */
  skipped: SkippedEvent[]
}

/** A text replacement on the original, [start, end) → text; `seq` orders edits at one offset. */
interface Edit {
  start: number
  end: number
  text: string
  seq: number
}

type Plan = { edits: Omit<Edit, 'seq'>[] } | { reason: string }

type Range = [number, number, number]

function rangeOf(node: unknown): Range | undefined {
  return (node as { range?: Range | null } | null)?.range ?? undefined
}

function pairOf(map: YAMLMap, key: string): Pair | undefined {
  return map.items.find((p) => isScalar(p.key) && p.key.value === key) as Pair | undefined
}

/** True for an absent value, `~`, `null` or an empty value. */
function isNullish(node: unknown): boolean {
  return node === null || node === undefined || (isScalar(node) && node.value === null)
}

/** Offset of the start of the line after the one holding offset `pos` (or `pos` at a line start). */
function nextLineStart(text: string, pos: number): number {
  if (pos > 0 && text[pos - 1] === '\n') return pos
  const nl = text.indexOf('\n', pos)
  return nl === -1 ? text.length : nl + 1
}

/** Column of `pos` when only spaces precede it on its line, else null. */
function blockColumn(text: string, pos: number): number | null {
  const lineStart = text.lastIndexOf('\n', pos - 1) + 1
  return /^ *$/.test(text.slice(lineStart, pos)) ? pos - lineStart : null
}

/**
 * The edit that sets the value of an existing pair: the scalar's source is replaced; an empty
 * value (`key:`) receives the value where the parser placed the empty scalar, with a space after
 * the colon and before a comment.
 */
function setValue(text: string, pair: Pair, value: string): Omit<Edit, 'seq'> | null {
  const v = pair.value
  if (v !== null && v !== undefined && !isScalar(v)) return null
  const r = rangeOf(v)
  if (r !== undefined && r[1] > r[0]) return { start: r[0], end: r[1], text: value }
  let at = r?.[0]
  if (at === undefined) {
    const keyEnd = rangeOf(pair.key)?.[1]
    const colon = keyEnd === undefined ? -1 : text.indexOf(':', keyEnd)
    if (colon === -1) return null
    at = colon + 1
  }
  const before = text[at - 1] === ':' ? ' ' : ''
  const after = text[at] === '#' ? ' ' : ''
  return { start: at, end: at, text: `${before}${value}${after}` }
}

/**
 * Lines (block map) or `, key: value` items (flow map) inserted after the value of `after`,
 * at the column of its key.
 */
function insertAfter(
  text: string,
  map: YAMLMap,
  after: Pair,
  entries: readonly (readonly [string, string])[],
  newline: string,
): Omit<Edit, 'seq'> | null {
  const valueEnd = rangeOf(after.value)?.[1]
  const keyStart = rangeOf(after.key)?.[0]
  if (valueEnd === undefined || keyStart === undefined) return null
  if (map.flow) {
    return {
      start: valueEnd,
      end: valueEnd,
      text: entries.map(([k, v]) => `, ${k}: ${v}`).join(''),
    }
  }
  const column = blockColumn(text, keyStart)
  if (column === null) return null
  const at = nextLineStart(text, valueEnd)
  const lead = at === text.length && !text.endsWith('\n') ? newline : ''
  const indent = ' '.repeat(column)
  return {
    start: at,
    end: at,
    text: lead + entries.map(([k, v]) => `${indent}${k}: ${v}${newline}`).join(''),
  }
}

/** The edits that publish one reviewed event, or why it stays as it is. */
function planEvent(text: string, event: YAMLMap, opts: PublishOptions, newline: string): Plan {
  const review = event.get('review', true)
  if (!isMap(review)) return { reason: 'review is not a mapping; run pnpm validate' }
  const readPair = pairOf(review, 'second_read')
  if (readPair === undefined || isNullish(readPair.value)) {
    return { reason: 'no second reading: review.second_read is missing (docs/06 §1 rule 6)' }
  }
  const read = readPair.value
  if (!isMap(read)) return { reason: 'review.second_read is not a mapping; run pnpm validate' }
  const verdict = read.get('verdict')
  if (verdict !== 'agree') {
    return {
      reason: `the second reading has verdict ${verdict === undefined ? '(none)' : String(verdict)}, not agree (docs/06 §1 rule 6)`,
    }
  }
  const drafted = review.get('drafted_at')
  if (typeof drafted === 'string' && opts.date < drafted) {
    return { reason: `the review date ${opts.date} is before review.drafted_at ${drafted}` }
  }
  const readAt = read.get('at')
  if (typeof readAt === 'string' && opts.date < readAt) {
    return { reason: `the review date ${opts.date} is before the second reading of ${readAt}` }
  }

  const edits: Omit<Edit, 'seq'>[] = []
  const statusPair = pairOf(event, 'status') as Pair
  const status = setValue(text, statusPair, 'published')
  if (status === null) return { reason: 'status is not a scalar; run pnpm validate' }
  edits.push(status)

  const byPair = pairOf(review, 'reviewed_by')
  const atPair = pairOf(review, 'reviewed_at')
  if (byPair !== undefined) {
    const e = setValue(text, byPair, opts.by)
    if (e === null) return { reason: 'review.reviewed_by is not a scalar; run pnpm validate' }
    edits.push(e)
  }
  if (atPair !== undefined) {
    const e = setValue(text, atPair, opts.date)
    if (e === null) return { reason: 'review.reviewed_at is not a scalar; run pnpm validate' }
    edits.push(e)
  }
  // Missing keys go where docs/03 §4 writes them: reviewed_by after second_read, reviewed_at
  // after reviewed_by.
  const missing: [string, string][] = []
  if (byPair === undefined) missing.push(['reviewed_by', opts.by])
  if (atPair === undefined) missing.push(['reviewed_at', opts.date])
  if (missing.length > 0) {
    const anchor = byPair !== undefined && atPair === undefined ? byPair : readPair
    const e = insertAfter(text, review, anchor, missing, newline)
    if (e === null)
      return { reason: 'the review mapping has an unexpected layout; edit it by hand' }
    edits.push(e)
  }
  return { edits }
}

function applyEdits(text: string, edits: readonly Edit[]): string {
  // From the end, so that earlier offsets stay valid; at one offset, the later edit first.
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.seq - a.seq)
  let out = text
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end)
  return out
}

function firstError(errors: readonly { message: string }[]): string {
  return (errors[0]?.message ?? 'unknown error').split('\n')[0] ?? ''
}

/**
 * Sets `status: published`, `review.reviewed_by` and `review.reviewed_at` on every `reviewed`
 * event of one data/events file whose second reading agrees and whose id is not excluded; see
 * the module comment. Throws when the text is not valid YAML, is not a list, when `by` or `date`
 * is malformed, or when the edit would change anything else.
 */
export function publishEventsInYaml(text: string, opts: PublishOptions): PublishResult {
  if (!HANDLE.test(opts.by)) {
    throw new RangeError(
      `reviewed_by expects a handle (letters, digits, . _ -), got ${JSON.stringify(opts.by)}`,
    )
  }
  if (!isIsoDate(opts.date)) {
    throw new RangeError(`reviewed_at expects a date YYYY-MM-DD, got ${JSON.stringify(opts.date)}`)
  }
  const doc = parseDocument(text, YAML_OPTIONS)
  if (doc.errors.length > 0) throw new Error(`not valid YAML: ${firstError(doc.errors)}`)
  const contents = doc.contents as Node | null
  if (isNullish(contents)) return { text, published: [], skipped: [] }
  if (!isSeq(contents)) throw new Error('expected a list of events (docs/03 §4)')

  const newline = text.includes('\r\n') ? '\r\n' : '\n'
  const edits: Edit[] = []
  const published: string[] = []
  const publishedAt: number[] = []
  const skipped: SkippedEvent[] = []
  contents.items.forEach((item, index) => {
    if (!isMap(item)) return
    const id = item.get('id')
    const status = item.get('status')
    if (typeof id !== 'string') {
      if (status === 'reviewed') throw new Error(`event ${index + 1} has no id; run pnpm validate`)
      return
    }
    if (opts.exclude.has(id)) {
      const reason =
        status === 'reviewed' ? 'excluded' : `excluded; status is ${String(status)}, not reviewed`
      skipped.push({ id, reason })
      return
    }
    if (status !== 'reviewed') return
    if (opts.unchanged?.has(id)) {
      skipped.push({ id, reason: UNCHANGED_REASON })
      return
    }
    const plan = planEvent(text, item, opts, newline)
    if ('reason' in plan) {
      skipped.push({ id, reason: plan.reason })
      return
    }
    for (const e of plan.edits) edits.push({ ...e, seq: edits.length })
    published.push(id)
    publishedAt.push(index)
  })
  if (edits.length === 0) return { text, published, skipped }

  const out = applyEdits(text, edits)
  const after = parseDocument(out, YAML_OPTIONS)
  if (after.errors.length > 0) {
    throw new Error(`the edit produced invalid YAML (${firstError(after.errors)}); nothing written`)
  }
  const expected = doc.toJS({ maxAliasCount: 100 }) as Record<string, Record<string, unknown>>[]
  for (const i of publishedAt) {
    const event = expected[i] as Record<string, unknown> & { review: Record<string, unknown> }
    event.status = 'published'
    event.review.reviewed_by = opts.by
    event.review.reviewed_at = opts.date
  }
  if (!isDeepStrictEqual(after.toJS({ maxAliasCount: 100 }), expected)) {
    throw new Error(
      'the edit would change more than status, reviewed_by and reviewed_at; nothing written',
    )
  }
  return { text: out, published, skipped }
}

/** The items of a data/events file as plain values; throws on invalid YAML or a non-list. */
function eventValues(text: string): unknown[] {
  const doc = parseDocument(text, YAML_OPTIONS)
  if (doc.errors.length > 0) throw new Error(`not valid YAML: ${firstError(doc.errors)}`)
  const value = doc.toJS({ maxAliasCount: 100 }) as unknown
  if (value === null || value === undefined) return []
  if (!Array.isArray(value)) throw new Error('expected a list of events (docs/03 §4)')
  return value
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * The ids of the events of `head` (a data/events file on the pull request's head) that stand at
 * `status: reviewed` in `base` (the same file at the merge base; null when the pull request adds
 * the file) and are deep-equal there, every field included: the pull request neither adds nor
 * changes them, so its review does not cover them (publishEventsInYaml skips them). An event
 * that was a draft at the base, or that the pull request edits in any field, is not in the set.
 * Throws when either text is not valid YAML or not a list (the base's message says so).
 */
export function unchangedReviewedIds(base: string | null, head: string): Set<string> {
  const before = new Map<string, Record<string, unknown>>()
  if (base !== null) {
    let values: unknown[]
    try {
      values = eventValues(base)
    } catch (err) {
      throw new Error(`at the merge base: ${(err as Error).message}`)
    }
    for (const v of values) {
      if (!isRecord(v) || typeof v.id !== 'string' || v.status !== 'reviewed') continue
      if (!before.has(v.id)) before.set(v.id, v)
    }
  }
  const unchanged = new Set<string>()
  if (before.size === 0) return unchanged
  for (const v of eventValues(head)) {
    if (!isRecord(v) || typeof v.id !== 'string') continue
    if (isDeepStrictEqual(before.get(v.id), v)) unchanged.add(v.id)
  }
  return unchanged
}

/**
 * A date as YYYY-MM-DD in the local time zone of the process: the author's calendar date, the
 * one data sessions write in `review.drafted_at` and `review.second_read.at` (the review dates
 * must share one calendar; with UTC, a review just after local midnight would carry the
 * previous day and skip the events drafted that day).
 */
export function localIsoDate(d: Date): string {
  const pad = (n: number, width: number) => String(n).padStart(width, '0')
  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}`
}

// ---------------------------------------------------------------------------------------------
// The command

export interface PublishArgs {
  /** The pull request number. */
  pr: number
  /** `review.reviewed_by` (default DEFAULT_REVIEWER). */
  by: string
  /** `review.reviewed_at` (default: today, the author's local calendar date). */
  date?: string
  /** Ids not to publish, sorted and unique. */
  exclude: string[]
  /** Print what would be published; write nothing. */
  dryRun: boolean
}

export const PUBLISH_USAGE =
  'usage: pnpm publish:events --pr N [--by HANDLE] [--date YYYY-MM-DD] [--exclude id,id…] [--dry-run]'

export function parsePublishArgs(argv: readonly string[]): PublishArgs {
  let pr: number | undefined
  let by = DEFAULT_REVIEWER
  let date: string | undefined
  let dryRun = false
  const exclude = new Set<string>()
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const value = () => {
      const v = argv[++i]
      if (v === undefined || v.startsWith('--'))
        throw new UsageError(`${a} needs a value\n${PUBLISH_USAGE}`)
      return v
    }
    if (a === '--pr') {
      const v = value()
      if (!/^[1-9]\d*$/.test(v)) {
        throw new UsageError(`--pr expects a pull request number, got ${v}\n${PUBLISH_USAGE}`)
      }
      pr = Number(v)
    } else if (a === '--by') {
      by = value()
      if (!HANDLE.test(by)) {
        throw new UsageError(`--by expects a handle (letters, digits, . _ -), got ${by}`)
      }
    } else if (a === '--date') {
      date = value()
      if (!isIsoDate(date)) throw new UsageError(`--date expects a date YYYY-MM-DD, got ${date}`)
    } else if (a === '--exclude') {
      for (const id of value().split(/[\s,]+/)) {
        if (id === '') continue
        const parsed = parseEventId(id)
        if (parsed === null || parsed.generated) {
          throw new UsageError(
            `--exclude expects event ids evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}[_{n}], got ${id}`,
          )
        }
        exclude.add(id)
      }
    } else if (a === '--dry-run') dryRun = true
    else if (a === '--') continue
    else throw new UsageError(`unknown option ${a}\n${PUBLISH_USAGE}`)
  }
  if (pr === undefined) throw new UsageError(`--pr is required\n${PUBLISH_USAGE}`)
  const args: PublishArgs = {
    pr,
    by,
    exclude: [...exclude].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)),
    dryRun,
  }
  if (date !== undefined) args.date = date
  return args
}

export interface CommandResult {
  code: number
  stdout: string
  stderr: string
}

/** Runs `gh` or `git` with the arguments, in the repository root. */
export type CommandRunner = (args: readonly string[]) => CommandResult

export interface PublishEnv {
  /**
   * Today's local calendar date (localIsoDate), YYYY-MM-DD: the author's day of review, in the
   * same calendar as `review.drafted_at` and `review.second_read.at`. The default review date and
   * the latest one allowed.
   */
  today: string
  gh: CommandRunner
  git: CommandRunner
  /**
   * A repository-relative file as UTF-8 text, or null when it is absent or not a regular file.
   * May throw (e.g. not valid UTF-8).
   */
  readFile: (path: string) => string | null
  /** Writes a repository-relative file. */
  writeFile: (path: string, text: string) => void
}

export interface PublishRunResult {
  code: number
  stdout: string
  stderr: string
}

const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`

const fail = (code: number, message: string): PublishRunResult => ({
  code,
  stdout: '',
  stderr: `${message}\n`,
})

const cmdFailure = (what: string, r: CommandResult): string =>
  `${what} failed (exit ${r.code})${r.stderr.trim() === '' ? '' : `: ${r.stderr.trim()}`}`

/** Runs the command; never exits the process and never throws. */
export function runPublishEvents(argv: readonly string[], env: PublishEnv): PublishRunResult {
  let args: PublishArgs
  try {
    args = parsePublishArgs(argv)
  } catch (err) {
    return fail(2, (err as Error).message)
  }
  try {
    return run(args, env)
  } catch (err) {
    return fail(1, (err as Error).message)
  }
}

/** A git object id (SHA-1 or SHA-256), as gh and git print it. */
const OID = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/

interface PullRequest {
  /** OPEN, CLOSED or MERGED. */
  state: string
  head: { name: string; oid: string }
  base: { name: string; oid: string }
}

/** The fields runPublishEvents asks `gh pr view` for. */
const PR_FIELDS = 'headRefName,headRefOid,baseRefName,baseRefOid,state'

function parsePullRequest(stdout: string): PullRequest | null {
  let json: Record<string, unknown>
  try {
    const parsed = JSON.parse(stdout) as unknown
    if (!isRecord(parsed)) return null
    json = parsed
  } catch {
    return null
  }
  const { headRefName, headRefOid, baseRefName, baseRefOid, state } = json
  if (
    typeof headRefName !== 'string' ||
    typeof headRefOid !== 'string' ||
    typeof baseRefName !== 'string' ||
    typeof baseRefOid !== 'string' ||
    typeof state !== 'string' ||
    !OID.test(baseRefOid)
  ) {
    return null
  }
  return {
    state,
    head: { name: headRefName, oid: headRefOid },
    base: { name: baseRefName, oid: baseRefOid },
  }
}

/**
 * The output of `git diff --name-status -z`: path → status letter (A added, D deleted,
 * M modified, T type changed; with a rename or copy, which --no-renames rules out, the new path).
 */
function parseNameStatus(stdout: string): Map<string, string> {
  const tokens = stdout.split('\0')
  const out = new Map<string, string>()
  for (let i = 0; i < tokens.length; i++) {
    const status = tokens[i] ?? ''
    if (status === '') continue
    const two = status.startsWith('R') || status.startsWith('C')
    const path = tokens[two ? i + 2 : i + 1]
    i += two ? 2 : 1
    if (path !== undefined && path !== '') out.set(path, status.charAt(0))
  }
  return out
}

function run(args: PublishArgs, env: PublishEnv): PublishRunResult {
  const date = args.date ?? env.today
  if (date > env.today) {
    return fail(
      2,
      `--date ${date} is after today (${env.today}); the review date is the day of the review`,
    )
  }
  const pr = String(args.pr)

  // The pull request: open, and checked out at its head.
  const view = env.gh(['pr', 'view', pr, '--json', PR_FIELDS])
  if (view.code !== 0) return fail(1, cmdFailure(`gh pr view ${pr}`, view))
  const pull = parsePullRequest(view.stdout)
  if (pull === null) {
    return fail(
      1,
      `gh pr view ${pr}: expected JSON with headRefName, headRefOid, baseRefName, baseRefOid and state, got ${view.stdout.trim()}`,
    )
  }
  const { head, base } = pull
  if (pull.state !== 'OPEN') {
    return fail(
      1,
      `refusing: PR #${pr} is ${pull.state.toLowerCase()}; publish:events flips the events on the PR branch before merge (docs/03 §11). Open a new pull request from ${head.name} if it was merged without the flip.`,
    )
  }
  const branch = env.git(['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch.code !== 0) return fail(1, cmdFailure('git rev-parse --abbrev-ref HEAD', branch))
  const current = branch.stdout.trim()
  if (current !== head.name) {
    return fail(
      1,
      `refusing: the current branch is ${current}, but PR #${pr} comes from ${head.name}; check it out first (gh pr checkout ${pr})`,
    )
  }
  const commit = env.git(['rev-parse', 'HEAD'])
  if (commit.code !== 0) return fail(1, cmdFailure('git rev-parse HEAD', commit))
  const local = commit.stdout.trim()
  if (local !== head.oid) {
    return fail(
      1,
      `refusing: HEAD is at ${local.slice(0, 12)}, but the head of PR #${pr} is ${head.oid.slice(0, 12)}; pull or push ${head.name} first, so that the events published are the ones reviewed`,
    )
  }

  // The files the pull request changes, from its merge base (what GitHub's diff shows).
  const known = env.git(['cat-file', '-e', `${base.oid}^{commit}`])
  if (known.code !== 0) {
    return fail(
      1,
      `refusing: the base of PR #${pr} (${base.name} at ${base.oid.slice(0, 12)}) is not in the local repository; run git fetch origin ${base.name} first`,
    )
  }
  const mb = env.git(['merge-base', base.oid, 'HEAD'])
  if (mb.code !== 0) return fail(1, cmdFailure(`git merge-base ${base.oid.slice(0, 12)} HEAD`, mb))
  const mergeBase = mb.stdout.trim()
  if (!OID.test(mergeBase)) {
    return fail(1, `git merge-base: expected a commit id, got ${mergeBase}`)
  }
  const short = mergeBase.slice(0, 12)
  const diff = env.git(['diff', '--name-status', '-z', '--no-renames', mergeBase, 'HEAD'])
  if (diff.code !== 0) return fail(1, cmdFailure(`git diff --name-status ${short} HEAD`, diff))
  const changes = parseNameStatus(diff.stdout)
  const changed = [...changes.keys()].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))
  const eventFiles = changed.filter((f) => EVENT_FILE.test(f))
  const ignored = changed.length - eventFiles.length
  const texts = new Map<string, string>()
  const absent: string[] = []
  for (const file of eventFiles) {
    let text: string | null
    try {
      text = env.readFile(file)
    } catch (err) {
      return fail(1, `${file}: ${(err as Error).message}`)
    }
    if (text === null) absent.push(file)
    else texts.set(file, text)
  }
  const files = [...texts.keys()]
  const header = `PR #${pr} (${head.name} into ${base.name}, merge base ${short}): ${plural(files.length, 'event file')} changed${
    ignored > 0 ? `, ${plural(ignored, 'other changed file')} ignored` : ''
  }`
  const absentLine =
    absent.length > 0
      ? [`Not in the working tree (deleted by the pull request?), ignored: ${absent.join(', ')}`]
      : []
  if (files.length === 0) {
    if (args.exclude.length > 0) {
      return fail(
        2,
        `--exclude names ids that are not events of the files PR #${pr} changes: ${args.exclude.join(', ')}`,
      )
    }
    return {
      code: 0,
      stdout: `${[header, ...absentLine, 'Nothing to publish.'].join('\n')}\n`,
      stderr: '',
    }
  }

  const status = env.git(['status', '--porcelain', '--', ...files])
  if (status.code !== 0) return fail(1, cmdFailure('git status --porcelain', status))
  const dirty = status.stdout
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l !== '')
  if (dirty.length > 0) {
    return fail(
      1,
      `refusing: uncommitted changes in the event files (an earlier publish:events run?); commit or discard them first:\n${dirty.map((l) => `  ${l}`).join('\n')}`,
    )
  }

  // Each file as it was at the merge base (none when the pull request adds it).
  const bases = new Map<string, string | null>()
  for (const file of files) {
    if (changes.get(file) === 'A') {
      bases.set(file, null)
      continue
    }
    const blob = env.git(['cat-file', 'blob', `${mergeBase}:${file}`])
    if (blob.code !== 0) return fail(1, cmdFailure(`git cat-file blob ${short}:${file}`, blob))
    bases.set(file, blob.stdout)
  }

  // Edit everything in memory first: nothing is written when one file fails.
  const exclude = new Set(args.exclude)
  const results = new Map<string, PublishResult>()
  for (const [file, text] of texts) {
    try {
      const unchanged = unchangedReviewedIds(bases.get(file) ?? null, text)
      results.set(file, publishEventsInYaml(text, { by: args.by, date, exclude, unchanged }))
    } catch (err) {
      return fail(1, `${file}: ${(err as Error).message}`)
    }
  }
  const seen = new Set([...results.values()].flatMap((r) => r.skipped.map((s) => s.id)))
  const unknown = args.exclude.filter((id) => !seen.has(id))
  if (unknown.length > 0) {
    return fail(
      2,
      `--exclude names ids that are not events of the files PR #${pr} changes: ${unknown.join(', ')}`,
    )
  }

  const out: string[] = [header]
  let publishedCount = 0
  let skippedCount = 0
  let filesEdited = 0
  for (const [file, r] of results) {
    out.push(file)
    if (r.published.length === 0 && r.skipped.length === 0) out.push('  nothing to publish')
    for (const id of r.published) out.push(`  published ${id}`)
    for (const s of r.skipped) out.push(`  skipped   ${s.id}: ${s.reason}`)
    publishedCount += r.published.length
    skippedCount += r.skipped.length
    if (r.published.length > 0) {
      filesEdited++
      if (!args.dryRun) env.writeFile(file, r.text)
    }
  }
  out.push(...absentLine)
  const what = `${plural(publishedCount, 'event')} in ${plural(filesEdited, 'file')} (reviewed_by ${args.by}, reviewed_at ${date}); skipped ${skippedCount}`
  if (args.dryRun) {
    out.push(`Dry run: would publish ${what}. No file written.`)
  } else {
    out.push(`Published ${what}.`)
    if (publishedCount > 0) out.push('Next: run pnpm validate, then commit the edited files.')
  }
  return { code: 0, stdout: `${out.join('\n')}\n`, stderr: '' }
}
