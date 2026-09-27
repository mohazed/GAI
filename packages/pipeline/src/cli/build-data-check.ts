/**
 * `pnpm build:data:check [--date YYYY-MM-DD] [--root DIR] [--site-url URL]` — the determinism
 * test of docs/04 §2 step 7 (D-25): builds the API twice, in two separate processes of
 * `pnpm build:data` run one after the other into two fresh temporary directories, with the same
 * date (read once, here) and the same site URL, then compares the two trees: same file list and
 * identical bytes.
 *
 * Prints `identical: N files, B bytes` and exits 0, removing the temporary directories; otherwise
 * lists up to 20 differing or missing paths, keeps both directories (their paths are printed) and
 * exits 1. A build that fails exits with its code (1, or 2 for a usage error) after printing its
 * output. CI runs it on the real data and on the fixtures (.github/workflows/ci.yml).
 *
 * The builds run with the TypeScript loader the repository's scripts use (tsx), as
 * `node --import <tsx loader> cli/build-data.ts`. The only clock reads: today's UTC date for the
 * default --date, and the elapsed time of each build (printed only).
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { findRepoRoot } from '@gai/schema'
import { isIsoDate } from '@gai/scoring'
import { compareTrees } from '../build/io.js'
import { resolveSiteUrl } from '../build-cli.js'
import { loadEnv } from '../lib/env.js'

const USAGE = 'usage: pnpm build:data:check [--date YYYY-MM-DD] [--root DIR] [--site-url URL]'
/** Differences listed before "and n more". */
const LISTED = 20

function fail(message: string, code: number): never {
  process.stderr.write(`${message}\n`)
  process.exit(code)
}

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = findRepoRoot(here)
const underPnpmScript = process.env.npm_lifecycle_event === 'build:data:check'
const invocationDir = (underPnpmScript ? process.env.INIT_CWD : undefined) ?? process.cwd()

const opts: { date?: string; root?: string; siteUrl?: string } = {}
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  const value = (): string => {
    const v = argv[++i]
    if (v === undefined || v.startsWith('--')) fail(`${a} needs a value\n${USAGE}`, 2)
    return v
  }
  if (a === '--date') opts.date = value()
  else if (a === '--root') opts.root = value()
  else if (a === '--site-url') opts.siteUrl = value()
  else if (a !== '--') fail(`unknown option ${a}\n${USAGE}`, 2)
}

const date = opts.date ?? new Date().toISOString().slice(0, 10)
if (!isIsoDate(date)) fail(`--date expects a date YYYY-MM-DD, got ${date}`, 2)
let siteUrl: string
try {
  siteUrl = resolveSiteUrl(opts.siteUrl, {
    NEXT_PUBLIC_SITE_URL: loadEnv(repoRoot).NEXT_PUBLIC_SITE_URL,
  })
} catch (err) {
  fail((err as Error).message, 2)
}
const root = opts.root === undefined ? undefined : resolve(invocationDir, opts.root)

const tsxLoader = pathToFileURL(createRequire(import.meta.url).resolve('tsx')).href
const entry = join(here, 'build-data.ts')
const dirs = ['a', 'b'].map((label) =>
  realpathSync(mkdtempSync(join(tmpdir(), `gai-build-${label}-`))),
)
const removeDirs = () => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true })
}
const outs = dirs.map((d) => join(d, 'v1'))

for (const [i, out] of outs.entries()) {
  const label = i === 0 ? 'A' : 'B'
  const started = performance.now()
  const r = spawnSync(
    process.execPath,
    [
      '--import',
      tsxLoader,
      entry,
      '--date',
      date,
      '--out',
      out,
      '--site-url',
      siteUrl,
      ...(root === undefined ? [] : ['--root', root]),
      '--quiet',
    ],
    {
      cwd: invocationDir,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  if (r.error !== undefined || r.status !== 0) {
    process.stdout.write(r.stdout ?? '')
    process.stderr.write(r.stderr ?? '')
    removeDirs()
    const why = r.error?.message ?? (r.status === null ? `signal ${r.signal}` : `exit ${r.status}`)
    fail(`build ${label} failed (${why})`, r.status === 2 ? 2 : 1)
  }
  process.stdout.write(
    `build ${label}: ${date}${root === undefined ? '' : ` --root ${opts.root}`} in ${((performance.now() - started) / 1000).toFixed(1)} s\n`,
  )
}

const [outA = '', outB = ''] = outs
const c = compareTrees(outA, outB)
if (c.differences.length === 0) {
  removeDirs()
  process.stdout.write(`identical: ${c.files} files, ${c.bytes} bytes\n`)
} else {
  const lines = c.differences.slice(0, LISTED).map((d) => `  ${d.kind.padEnd(10)}  ${d.path}`)
  if (c.differences.length > LISTED) lines.push(`  … and ${c.differences.length - LISTED} more`)
  process.stderr.write(
    `the two builds differ in ${c.differences.length} path(s) (D-25):\n${lines.join('\n')}\nkept for inspection:\n  A ${outA}\n  B ${outB}\n`,
  )
  process.exitCode = 1
}
