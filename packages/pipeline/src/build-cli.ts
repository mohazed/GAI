/**
 * `pnpm build:data [--date YYYY-MM-DD] [--out DIR] [--root DIR] [--site-url URL] [--preview] [--quiet]` —
 * builds the static API (docs/04 §2 steps 1–6) into apps/web/public/api/v1/: reads the inputs
 * (./build/io.ts), runs the pure build (`buildData`, ./build/index.ts) and replaces the output
 * directory with the result.
 *
 * Options:
 *   --date <date>      build date YYYY-MM-DD, from 2023-10-07 to today (default: GAI_BUILD_DATE
 *                      when set, else today, UTC). The date is an input, never the clock inside
 *                      the build, so the same date and inputs give the same bytes (D-25).
 *                      GAI_BUILD_DATE lets `pnpm build`, which runs build:data without options,
 *                      build for the date the deploy workflows chose (P-12)
 *   --out <dir>        output directory, relative to the directory the command was run from
 *                      (default: apps/web/public/api/v1 under the repository root). A non-empty
 *                      directory is replaced only when it holds a previous build (manifest.json)
 *   --root <dir>       dataset root holding data/ and archive/, relative to the directory the
 *                      command was run from (default: the repository root); e.g. --root fixtures
 *   --site-url <url>   site origin for permalinks and citations (default: NEXT_PUBLIC_SITE_URL,
 *                      else https://gaza-accountability-index.pages.dev)
 *   --preview          LOCAL USE ONLY: build with the `reviewed` events as if published, to look at
 *                      the pages before the author's review (P-17). Never used by the deploy
 *                      workflows; `deploy:check` refuses an output whose API lists an event that
 *                      data/ does not hold as published. Drafts stay out
 *   --quiet            print nothing on success
 *
 * Exit codes: 0 built, 1 the data or methodology cannot be built (the message says why), 2 usage
 * error (including an output directory that is not a previous build).
 */
import { existsSync, realpathSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { BUILD_NOTE_KINDS, findRepoRoot } from '@gai/schema'
import { isIsoDate, WINDOW_START } from '@gai/scoring'
import { BuildError, buildData } from './build/index.js'
import { loadBuildInput, UnsafeOutputError, writeOutput } from './build/io.js'
import type { BuildInput, BuildOutput } from './build/types.js'

export interface BuildArgs {
  date?: string
  out?: string
  root?: string
  siteUrl?: string
  preview: boolean
  quiet: boolean
}

export class BuildUsageError extends Error {
  override name = 'BuildUsageError'
}

export const BUILD_USAGE =
  'usage: pnpm build:data [--date YYYY-MM-DD] [--out DIR] [--root DIR] [--site-url URL] [--preview] [--quiet]'

/** Output directory under the repository root when --out is absent. */
export const DEFAULT_OUT = 'apps/web/public/api/v1'

/** Site origin when neither --site-url nor NEXT_PUBLIC_SITE_URL is set. */
export const DEFAULT_SITE_URL = 'https://gaza-accountability-index.pages.dev'

export function parseBuildArgs(argv: readonly string[]): BuildArgs {
  const args: BuildArgs = { preview: false, quiet: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const value = () => {
      const v = argv[++i]
      if (v === undefined || v.startsWith('--')) {
        throw new BuildUsageError(`${a} needs a value\n${BUILD_USAGE}`)
      }
      return v
    }
    if (a === '--date') args.date = value()
    else if (a === '--out') args.out = value()
    else if (a === '--root') args.root = value()
    else if (a === '--site-url') args.siteUrl = value()
    else if (a === '--quiet') args.quiet = true
    else if (a === '--preview') args.preview = true
    else if (a === '--') continue
    else throw new BuildUsageError(`unknown option ${a}\n${BUILD_USAGE}`)
  }
  if (args.date !== undefined && !isIsoDate(args.date)) {
    throw new BuildUsageError(`--date expects a date YYYY-MM-DD, got ${args.date}`)
  }
  return args
}

/**
 * The site origin: `--site-url`, else NEXT_PUBLIC_SITE_URL, else the default; an http(s) URL
 * without query or fragment, trailing slashes removed. Throws `BuildUsageError` otherwise.
 */
export function resolveSiteUrl(
  flag: string | undefined,
  env: Readonly<Record<string, string | undefined>>,
): string {
  const fromEnv = env.NEXT_PUBLIC_SITE_URL
  const raw = flag ?? (fromEnv !== undefined && fromEnv !== '' ? fromEnv : DEFAULT_SITE_URL)
  const origin = flag !== undefined ? '--site-url' : fromEnv ? 'NEXT_PUBLIC_SITE_URL' : 'default'
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new BuildUsageError(`${origin} ${raw}: expected an http(s) URL`)
  }
  if (
    (url.protocol !== 'https:' && url.protocol !== 'http:') ||
    /\s/.test(raw) ||
    url.search !== '' ||
    url.hash !== '' ||
    raw.includes('?') ||
    raw.includes('#')
  ) {
    throw new BuildUsageError(`${origin} ${raw}: expected an http(s) URL without query or fragment`)
  }
  return raw.replace(/\/+$/, '')
}

/** The steps a run performs; tests replace them. */
export interface BuildDeps {
  load: typeof loadBuildInput
  build: (input: BuildInput) => BuildOutput
  write: typeof writeOutput
}

export interface BuildRunOptions {
  /** A directory inside the repository, used to find its root (default: the working directory). */
  cwd?: string
  /** The directory the command was typed in, against which --out and --root resolve (default: cwd). */
  invocationDir?: string
  /** Today's UTC date: the default --date and its upper bound (the entry point reads the clock). */
  today: string
  /**
   * Environment: NEXT_PUBLIC_SITE_URL (the entry point passes process.env over .env) and
   * GAI_BUILD_DATE (the default --date; process.env only).
   */
  env?: Readonly<Record<string, string | undefined>>
  deps?: Partial<BuildDeps>
}

export interface BuildRunResult {
  code: number
  stdout: string
  stderr: string
}

const real = (p: string): string => (existsSync(p) ? realpathSync(p) : p)

/** Is `path` equal to `dir` or inside it? */
function within(dir: string, path: string): boolean {
  const rel = relative(dir, path)
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))
}

/** `path` with its nearest existing ancestor resolved through symbolic links. */
function realish(path: string): string {
  const rest: string[] = []
  let dir = path
  while (!existsSync(dir)) {
    const parent = dirname(dir)
    if (parent === dir) return path
    rest.unshift(basename(dir))
    dir = parent
  }
  return join(real(dir), ...rest)
}

/** `path` relative to `base` (POSIX) when inside it, else absolute. */
function shown(base: string, path: string): string {
  if (!within(base, path)) return path
  const rel = relative(base, path)
  return rel === '' ? '.' : rel.split(sep).join('/')
}

const fail = (code: number, message: string): BuildRunResult => ({
  code,
  stdout: '',
  stderr: `${message}\n`,
})

/** The run's summary: files and bytes, files per top-level folder, notes per kind. */
export function buildSummary(args: {
  date: string
  methodology: string
  source: string
  out: string
  output: BuildOutput
}): string {
  const { output } = args
  let bytes = 0
  const folders = new Map<string, number>()
  for (const [path, content] of output.files) {
    bytes += typeof content === 'string' ? Buffer.byteLength(content, 'utf8') : content.byteLength
    const slash = path.indexOf('/')
    const folder = slash === -1 ? '(top level)' : `${path.slice(0, slash)}/`
    folders.set(folder, (folders.get(folder) ?? 0) + 1)
  }
  const rows = [...folders.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  const width = Math.max(...rows.map(([f]) => f.length))
  const countWidth = Math.max(...rows.map(([, n]) => String(n).length))
  const counts = BUILD_NOTE_KINDS.map(
    (kind) => [kind, output.notes.filter((n) => n.kind === kind).length] as const,
  ).filter(([, n]) => n > 0)
  const lines = [
    `build-data ${args.date} · methodology ${args.methodology} · ${args.source} → ${args.out}`,
    `${output.files.size} files, ${bytes} bytes`,
    ...rows.map(([f, n]) => `  ${f.padEnd(width)}  ${String(n).padStart(countWidth)}`),
    counts.length === 0
      ? 'notes: none'
      : `notes: ${output.notes.length} (${counts.map(([k, n]) => `${k} ${n}`).join(', ')}); see build-notes.json`,
  ]
  return `${lines.join('\n')}\n`
}

/** Runs the command; never exits the process and never throws. */
export function runBuildData(argv: readonly string[], options: BuildRunOptions): BuildRunResult {
  let args: BuildArgs
  try {
    args = parseBuildArgs(argv)
  } catch (err) {
    return fail(2, (err as Error).message)
  }
  try {
    return run(args, options)
  } catch (err) {
    if (err instanceof BuildUsageError || err instanceof UnsafeOutputError) {
      return fail(2, err.message)
    }
    if (err instanceof BuildError) return fail(1, `build-data: ${err.message}`)
    const e = err as Error
    return fail(1, `build-data failed: ${e.stack ?? e.message}`)
  }
}

function run(args: BuildArgs, options: BuildRunOptions): BuildRunResult {
  const deps: BuildDeps = {
    load: loadBuildInput,
    build: buildData,
    write: writeOutput,
    ...options.deps,
  }
  const cwd = options.cwd ?? process.cwd()
  const invocationDir = options.invocationDir ?? cwd
  const repoRoot = real(findRepoRoot(cwd))

  const fromEnv = options.env?.GAI_BUILD_DATE
  if (args.date === undefined && fromEnv !== undefined && fromEnv !== '' && !isIsoDate(fromEnv)) {
    return fail(2, `GAI_BUILD_DATE expects a date YYYY-MM-DD, got ${fromEnv}`)
  }
  const date = args.date ?? (fromEnv !== undefined && fromEnv !== '' ? fromEnv : options.today)
  if (!isIsoDate(date)) return fail(2, `today's date ${date} is not a date YYYY-MM-DD`)
  if (date < WINDOW_START) {
    return fail(2, `--date ${date}: the index starts on ${WINDOW_START} (docs/02 §1)`)
  }
  if (date > options.today) {
    return fail(2, `--date ${date} is after today (${options.today}, UTC)`)
  }

  let datasetRoot = repoRoot
  if (args.root !== undefined) {
    datasetRoot = resolve(invocationDir, args.root)
    if (!existsSync(join(datasetRoot, 'data'))) {
      return fail(2, `--root ${args.root}: ${datasetRoot} has no data/ directory`)
    }
    datasetRoot = real(datasetRoot)
  }
  const siteUrl = resolveSiteUrl(args.siteUrl, options.env ?? {})

  const out =
    args.out === undefined ? join(repoRoot, DEFAULT_OUT) : resolve(invocationDir, args.out)
  const outReal = realish(out)
  for (const input of [
    join(datasetRoot, 'data'),
    join(datasetRoot, 'archive'),
    join(repoRoot, 'methodology'),
  ]) {
    if (within(real(input), outReal) || within(outReal, real(input))) {
      return fail(2, `--out ${out}: overlaps the build input ${input}`)
    }
  }

  const loaded = deps.load({ repoRoot, datasetRoot, date, siteUrl })
  const input = args.preview ? previewInput(loaded) : loaded
  const output = deps.build(input)
  deps.write(out, output.files)

  const previewed = args.preview
    ? loaded.dataset.events.filter((e) => e.value.status === PREVIEW_STATUS).length
    : 0
  const warning = args.preview
    ? `PREVIEW: ${previewed} reviewed event(s) built as if published; local use only, never deploy this output\n`
    : ''
  if (args.quiet) return { code: 0, stdout: '', stderr: warning }
  return {
    code: 0,
    stderr: warning,
    stdout: buildSummary({
      date,
      methodology: input.methodology.version,
      source: datasetRoot === repoRoot ? 'data' : `${shown(repoRoot, datasetRoot)}/data`,
      out: shown(repoRoot, out),
      output,
    }),
  }
}

/** The status `--preview` builds as if published: reviewed, never draft (a draft was not read twice). */
export const PREVIEW_STATUS = 'reviewed'

/** The reviewer `--preview` writes in memory, so that the page says what the build is. */
export const PREVIEW_REVIEWER = 'PREVIEW, not reviewed by the author'

/**
 * The input with every reviewed event set to published (`--preview`, local use only), its review
 * marked `PREVIEW_REVIEWER` on the build date in memory; nothing under data/ is written.
 */
export function previewInput(input: BuildInput): BuildInput {
  return {
    ...input,
    dataset: {
      ...input.dataset,
      events: input.dataset.events.map((e) =>
        e.value.status === PREVIEW_STATUS
          ? {
              ...e,
              value: {
                ...e.value,
                status: 'published' as const,
                review: {
                  ...e.value.review,
                  reviewed_by: PREVIEW_REVIEWER,
                  reviewed_at: input.date,
                },
              },
            }
          : e,
      ),
    },
  }
}
