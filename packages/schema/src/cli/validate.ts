/**
 * `pnpm validate` — loads data/ and methodology/, runs every rule, prints counts and issues,
 * exits non-zero on any error (docs/02 §12, docs/03 §4–§6).
 *
 * Options:
 *   --root <dir>        dataset root holding data/ and archive/ (default: the repository root)
 *   --base <ref>        git ref for the history checks (default: see resolveBaseRef)
 *   --no-git            skip the history checks
 *   --strict            warnings also fail
 *   --quiet             print errors only
 */
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { formatIssue, type Issue } from '../issues.js'
import { type Dataset, loadDataset } from '../load/dataset.js'
import { type BaseSnapshot, loadBaseSnapshot, resolveBaseRef } from '../load/git.js'
import { listMethodologyVersions, loadMethodology, type Methodology } from '../load/methodology.js'
import { STRUCTURED_TABLE_NAMES } from '../structured.js'
import { buildContext, METHODOLOGY_ONLY_RULES, validate } from '../validate/index.js'

export function findRepoRoot(start: string): string {
  let dir = resolve(start)
  for (;;) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = dirname(dir)
    if (parent === dir) throw new Error('repository root (pnpm-workspace.yaml) not found')
    dir = parent
  }
}

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
    .sort(([a], [b]) => a.localeCompare(b))
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

export function main(argv: string[]): number {
  const args = parseArgs(argv)
  const repoRoot = findRepoRoot(process.cwd())
  const datasetRoot = resolve(repoRoot, args.root ?? '.')
  const rel = relative(repoRoot, datasetRoot).split('\\').join('/')
  const prefix = rel === '' ? '' : `${rel}/`

  const ds = loadDataset(datasetRoot)
  const folders = listMethodologyVersions(repoRoot)
  const current = loadMethodology(repoRoot, folders.at(-1))

  let base: BaseSnapshot | null = null
  let baseError: string | undefined
  let historyLine = 'history: skipped (--no-git)'
  if (args.git) {
    const ref = resolveBaseRef(repoRoot, args.base)
    if (ref === null) {
      baseError =
        `cannot resolve the base ref ${args.base ?? process.env.GAI_VALIDATE_BASE ?? ''}`.trim()
      if (!args.base && !process.env.GAI_VALIDATE_BASE)
        baseError = 'not a git work tree, or no commit yet'
      historyLine = `history: skipped (${baseError})`
    } else {
      try {
        base = loadBaseSnapshot(repoRoot, ref, prefix)
        historyLine = `history: compared with ${args.base ?? 'base'} ${ref.slice(0, 10)}`
      } catch (err) {
        baseError = (err as Error).message.split('\n')[0] ?? 'git error'
        historyLine = `history: skipped (${baseError})`
      }
    }
  }

  const issues: Issue[] = validate(buildContext(ds, current, base, baseError))
  // Older version folders are frozen; check their own consistency.
  for (const folder of folders.slice(0, -1)) {
    const older = loadMethodology(repoRoot, folder)
    issues.push(...validate(buildContext(loadDataset(datasetRoot), older), METHODOLOGY_ONLY_RULES))
  }

  const display = (i: Issue): Issue =>
    i.file.startsWith('methodology/') || prefix === '' ? i : { ...i, file: `${prefix}${i.file}` }
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')

  console.log(`validate ${prefix === '' ? 'data/' : `${prefix}data/`} and methodology/`)
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
