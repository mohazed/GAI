/**
 * `pnpm validate` — loads data/ and methodology/, runs every rule, prints counts and issues,
 * exits non-zero on any error (docs/02 §12, docs/03 §4–§6).
 *
 * Options:
 *   --root <dir>        dataset root holding data/ and archive/, relative to the directory the
 *                       command was run from (default: the repository root)
 *   --base <ref>        git ref for the history checks (default: see resolveBase)
 *   --no-git            skip the history checks
 *   --strict            warnings also fail
 *   --quiet             print errors only
 *
 * Exit codes: 0 valid, 1 validation errors (or warnings with --strict), 2 usage error.
 *
 * History checks (docs/03 §11): when a comparison is required — `--base`, a non-empty
 * `GAI_VALIDATE_BASE`, `GITHUB_BASE_REF`, or any run on GitHub Actions — a base that cannot be
 * read is an error (`correction.base-unavailable`), so CI never passes with the edit checks off.
 * Locally, without any of these, it stays a warning.
 */
import { existsSync, realpathSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { compareCodeUnits, formatIssue, type Issue, sortIssues } from '../issues.js'
import { type Dataset, loadDataset } from '../load/dataset.js'
import { type BaseSnapshot, baseRequired, loadBaseSnapshot, resolveBase } from '../load/git.js'
import {
  listMethodologyVersions,
  loadMethodology,
  loadReviewers,
  type Methodology,
} from '../load/methodology.js'
import { findRepoRoot } from '../load/repo.js'
import { STRUCTURED_TABLE_NAMES } from '../structured.js'
import { buildContext, validate } from '../validate/index.js'
import { rules as methodologyRules } from '../validate/rules/methodology.js'

export { findRepoRoot }

interface Args {
  root?: string
  base?: string
  git: boolean
  strict: boolean
  quiet: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = { git: true, strict: false, quiet: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const value = () => {
      const v = argv[++i]
      if (v === undefined) throw new Error(`${a} needs a value`)
      return v
    }
    if (a === '--root') args.root = value()
    else if (a === '--base') args.base = value()
    else if (a === '--no-git') args.git = false
    else if (a === '--strict') args.strict = true
    else if (a === '--quiet') args.quiet = true
    else if (a === '--') continue
    else throw new Error(`unknown option ${a}`)
  }
  return args
}

function countBy<T>(items: T[], key: (t: T) => string): string {
  const counts = new Map<string, number>()
  for (const t of items) counts.set(key(t), (counts.get(key(t)) ?? 0) + 1)
  return [...counts.entries()]
    .sort(([a], [b]) => compareCodeUnits(a, b))
    .map(([k, n]) => `${k} ${n}`)
    .join(', ')
}

function summary(ds: Dataset, m: Methodology): string[] {
  const scored = m.indicators.filter((i) => i.scored).length
  const lines = [
    `methodology ${m.folder} (version ${m.version}): ${m.indicators.length} indicators ` +
      `(${scored} scored, ${m.indicators.length - scored} unscored), ` +
      `${m.categories?.value.categories.length ?? 0} categories, ` +
      `${m.bands?.value.bands.length ?? 0} bands, ` +
      `${m.votes?.value.votes.length ?? 0} qualifying votes, ` +
      `${m.symmetry?.value.pairs.length ?? 0} symmetry pairs, ` +
      `${m.bannedWords?.entries.length ?? 0} banned words`,
    `countries: ${ds.countries.length} (${ds.countries.filter((c) => !c.value.excluded).length} scored, ` +
      `${ds.countries.filter((c) => c.value.excluded).length} excluded)`,
    `events: ${ds.events.length}${ds.events.length ? ` (${countBy(ds.events, (e) => e.value.status)})` : ''}`,
    `sources: ${ds.sources.length}${ds.sources.length ? ` (${countBy(ds.sources, (s) => s.value.kind)})` : ''}`,
    `assessments: ${ds.assessments.length} · corrections: ${ds.corrections.length} · ` +
      `replies: ${ds.replies.length} · leads: ${ds.leads.length}`,
    `structured rows: ${STRUCTURED_TABLE_NAMES.map((t) => `${t.replace('.csv', '')} ${ds.structured[t].length}`).join(', ')}`,
    `archive: ${ds.archiveIndex.length} index rows, ${ds.archiveTextIds.size} text files`,
  ]
  return lines
}

export interface MainOptions {
  /** Where to look for the repository root (default: the process working directory). */
  cwd?: string
  /**
   * The directory the command was typed in, against which `--root` resolves (default: pnpm's
   * `INIT_CWD`, which is that directory for `pnpm validate`, else the working directory).
   */
  invocationDir?: string
  /** Environment for the base-ref decisions (default: process.env). */
  env?: NodeJS.ProcessEnv
}

/** Real path when the path exists (so that `relative()` sees through /tmp → /private/tmp). */
const real = (p: string): string => (existsSync(p) ? realpathSync(p) : p)

export function main(argv: string[], options: MainOptions = {}): number {
  const args = parseArgs(argv)
  const cwd = options.cwd ?? process.cwd()
  const env = options.env ?? process.env
  const repoRoot = real(findRepoRoot(cwd))
  let datasetRoot = repoRoot
  if (args.root !== undefined) {
    datasetRoot = resolve(options.invocationDir ?? env.INIT_CWD ?? cwd, args.root)
    if (!existsSync(join(datasetRoot, 'data'))) {
      throw new Error(`--root ${args.root}: ${datasetRoot} has no data/ directory`)
    }
    datasetRoot = real(datasetRoot)
  }
  const rel = relative(repoRoot, datasetRoot).split('\\').join('/')
  const prefix = rel === '' ? '' : `${rel}/`

  const ds = loadDataset(datasetRoot)
  const folders = listMethodologyVersions(repoRoot)
  const current = loadMethodology(repoRoot, folders.at(-1))

  let base: BaseSnapshot | null = null
  let baseError: string | undefined
  let historyLine = 'history: skipped (--no-git)'
  const required = args.git && baseRequired(args.base, env)
  if (args.git) {
    const resolved = resolveBase(repoRoot, args.base, env)
    if (!resolved.ok) {
      baseError = resolved.reason
    } else if (prefix.startsWith('../')) {
      baseError = `the dataset root ${datasetRoot} is outside the repository ${repoRoot}`
    } else {
      try {
        base = loadBaseSnapshot(repoRoot, resolved.ref, prefix, ds)
        historyLine = `history: compared with commit ${resolved.ref.slice(0, 10)} (${resolved.source})`
      } catch (err) {
        baseError = (err as Error).message.split('\n')[0] ?? 'git error'
      }
    }
    if (baseError !== undefined) historyLine = `history: skipped (${baseError})`
  }

  const ctx = buildContext(ds, current, base, baseError)
  let issues: Issue[] = validate(ctx)
  if (required) {
    // A comparison was required: an unreadable base fails the run (docs/03 §11, "CI refuses").
    issues = issues.map((i) =>
      i.rule === 'correction.base-unavailable' ? { ...i, level: 'error' as const } : i,
    )
  }
  // Older version folders are frozen: their own load issues and YAML consistency only. The data
  // issues were reported above, and their docs were rendered by the renderer of their time.
  const older: Issue[] = []
  for (const folder of folders.slice(0, -1)) {
    const m = loadMethodology(repoRoot, folder)
    const olderCtx = { ...ctx, methodology: m, base: null }
    older.push(...m.issues, ...methodologyRules.flatMap((rule) => rule(olderCtx)))
  }
  if (older.length > 0) issues = sortIssues([...issues, ...older])
  // methodology/reviewers.yaml (docs/08 §2): optional; when present it must match its schema.
  const reviewerIssues = loadReviewers(repoRoot).issues
  if (reviewerIssues.length > 0) issues = sortIssues([...issues, ...reviewerIssues])

  const display = (i: Issue): Issue =>
    i.file.startsWith('methodology/') || prefix === '' ? i : { ...i, file: `${prefix}${i.file}` }
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')

  console.log(`validate ${prefix}data/ and methodology/`)
  for (const line of summary(ds, current)) console.log(`  ${line}`)
  console.log(`  ${historyLine}`)
  for (const i of errors) console.log(formatIssue(display(i)))
  if (!args.quiet) for (const i of warnings) console.log(formatIssue(display(i)))
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`)
  return errors.length > 0 || (args.strict && warnings.length > 0) ? 1 : 0
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (err) {
    console.error((err as Error).message)
    process.exitCode = 2
  }
}
