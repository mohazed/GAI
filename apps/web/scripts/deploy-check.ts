/**
 * The last gate before `wrangler pages deploy` (docs/04 §5, P-12): checks that the exported site
 * in `out/` is the one the deploy workflow meant to publish, and fails with every problem listed.
 *
 *   tsx scripts/deploy-check.ts --date YYYY-MM-DD --site-url URL [--out out] [--allow-dirty]
 *
 * - the API was built for the run day and the site's address (manifest `build_date`, `site_url`),
 *   from the checked-out commit (`git.sha` equal to HEAD, `dirty` false unless --allow-dirty);
 * - no `history` build note: each corrections-log entry is linked to its mainline commit, which a
 *   shallow clone cannot do (P-05, docs/10 B-76; the workflows also run the prompt's jq test);
 * - the API comes from data/, never from fixtures/ (docs/10 B-34): every country, correction and
 *   reply the API publishes is in data/;
 * - no local preview (`build:data --preview`, P-17): every hand-authored event the API publishes is
 *   published (or corrected, superseded, retracted) in data/;
 * - the widget carries the site's mode (D-16), read as the build read it (scripts/site-env.ts);
 * - no dev-only kit in the output;
 * - Cloudflare Pages' limits: no file above 25 MiB, at most 20 000 files (docs/09).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { findRepoRoot, loadDataset, PUBLIC_STATUSES } from '@gai/schema'
import type { Mode } from '../lib/mode'
import { loadSiteMode } from './site-env'

export const MAX_FILE_BYTES = 25 * 1024 * 1024
export const MAX_FILES = 20_000

export interface DeployFacts {
  manifest: {
    build_date: string
    site_url: string
    git: { sha: string | null; dirty: boolean | null }
  }
  historyNotes: number
  /** Ids the API publishes; `events` are the hand-authored ones of the country files. */
  api: { countries: string[]; corrections: string[]; replies: string[]; events: string[] }
  /** Ids of data/; `events` are the ones whose status is public there. */
  data: { countries: string[]; corrections: string[]; replies: string[]; events: string[] }
  /** The mode written into /embed/v1/gai.js, null when none is found. */
  widgetMode: Mode | null
  /** Every file of the output, relative POSIX path and size. */
  files: { path: string; bytes: number }[]
}

export interface DeployExpectations {
  date: string
  siteUrl: string
  head: string
  mode: Mode
  allowDirty: boolean
}

/** Every reason not to deploy; empty when the output may go out. */
export function deployProblems(f: DeployFacts, e: DeployExpectations): string[] {
  const problems: string[] = []
  const m = f.manifest
  if (m.build_date !== e.date) {
    problems.push(`manifest build_date is ${m.build_date}, expected the run day ${e.date}`)
  }
  if (m.site_url !== e.siteUrl.replace(/\/+$/, '')) {
    problems.push(`manifest site_url is ${m.site_url}, expected ${e.siteUrl}`)
  }
  if (m.git.sha !== e.head) {
    problems.push(`manifest git.sha is ${m.git.sha}, expected the checked-out commit ${e.head}`)
  }
  if (m.git.dirty !== false && !e.allowDirty) {
    problems.push(`manifest git.dirty is ${m.git.dirty}: build from a clean checkout`)
  }
  if (f.historyNotes > 0) {
    problems.push(
      `build-notes.json has ${f.historyNotes} history note(s): fetch the full history (fetch-depth: 0)`,
    )
  }
  for (const kind of ['countries', 'corrections', 'replies'] as const) {
    const known = new Set(f.data[kind])
    const foreign = f.api[kind].filter((id) => !known.has(id))
    if (foreign.length > 0) {
      problems.push(
        `the API publishes ${kind} that data/ does not hold (fixtures?): ${foreign.join(', ')}`,
      )
    }
  }
  const publicEvents = new Set(f.data.events)
  const unpublished = f.api.events.filter((id) => !publicEvents.has(id))
  if (unpublished.length > 0) {
    problems.push(
      `the API publishes ${unpublished.length} event(s) that data/ does not hold as published (a build:data --preview output?): ${unpublished.slice(0, 5).join(', ')}${unpublished.length > 5 ? ', …' : ''}`,
    )
  }
  if (f.widgetMode !== e.mode) {
    problems.push(`embed/v1/gai.js carries mode ${f.widgetMode}, the site is in ${e.mode} mode`)
  }
  const kit = f.files.filter((x) => x.path === '_kit' || x.path.startsWith('_kit/'))
  if (kit.length > 0) problems.push(`the output holds the dev-only kit (${kit[0]?.path})`)
  for (const x of f.files) {
    if (x.bytes > MAX_FILE_BYTES) {
      problems.push(`${x.path} is ${x.bytes} bytes; Cloudflare Pages serves files up to 25 MiB`)
    }
  }
  if (f.files.length > MAX_FILES) {
    problems.push(`${f.files.length} files; Cloudflare Pages takes at most ${MAX_FILES}`)
  }
  return problems
}

/** The mode in the config the build wrote into the widget (scripts/embed.ts). */
export function widgetModeOf(script: string): Mode | null {
  const found = /mode\\?"\s*:\s*\\?"(score|scorecard)\\?"/.exec(script)
  return (found?.[1] as Mode | undefined) ?? null
}

function walk(root: string, dir = ''): { path: string; bytes: number }[] {
  const out: { path: string; bytes: number }[] = []
  for (const name of readdirSync(path.join(root, dir)).sort()) {
    const rel = dir === '' ? name : `${dir}/${name}`
    const st = statSync(path.join(root, rel))
    if (st.isDirectory()) out.push(...walk(root, rel))
    else out.push({ path: rel, bytes: st.size })
  }
  return out
}

const json = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'))

function readFacts(outDir: string, repoRoot: string): DeployFacts {
  const api = path.join(outDir, 'api', 'v1')
  const manifest = json(path.join(api, 'manifest.json')) as DeployFacts['manifest']
  const notes = json(path.join(api, 'build-notes.json')) as { counts: { history: number } }
  const countries = json(path.join(api, 'countries.json')) as { countries: { iso3: string }[] }
  const corrections = json(path.join(api, 'corrections.json')) as { corrections: { id: string }[] }
  const replies = json(path.join(api, 'replies.json')) as { replies: { id: string }[] }
  const ds = loadDataset(repoRoot)
  const events: string[] = []
  for (const { iso3 } of countries.countries) {
    const file = path.join(api, 'countries', `${iso3}.json`)
    if (!existsSync(file)) continue
    const c = json(file) as { event_list?: { id: string; generated: boolean }[] }
    for (const ev of c.event_list ?? []) if (!ev.generated) events.push(ev.id)
  }
  const publicStatuses: readonly string[] = PUBLIC_STATUSES
  const widget = path.join(outDir, 'embed', 'v1', 'gai.js')
  return {
    manifest,
    historyNotes: notes.counts.history,
    api: {
      countries: countries.countries.map((c) => c.iso3),
      corrections: corrections.corrections.map((c) => c.id),
      replies: replies.replies.map((r) => r.id),
      events,
    },
    data: {
      countries: ds.countries.map((c) => c.value.iso3),
      corrections: ds.corrections.map((c) => c.value.id),
      replies: ds.replies.map((r) => r.value.id),
      events: ds.events
        .filter((e) => publicStatuses.includes(e.value.status))
        .map((e) => e.value.id),
    },
    widgetMode: existsSync(widget) ? widgetModeOf(readFileSync(widget, 'utf8')) : null,
    files: walk(outDir),
  }
}

function main() {
  const args = process.argv.slice(2)
  const opt = (name: string) => {
    const i = args.indexOf(name)
    return i === -1 ? undefined : args[i + 1]
  }
  const date = opt('--date')
  const siteUrl = opt('--site-url') ?? process.env.NEXT_PUBLIC_SITE_URL
  if (date === undefined || siteUrl === undefined || siteUrl === '') {
    console.error(
      'usage: tsx scripts/deploy-check.ts --date YYYY-MM-DD --site-url URL [--out out] [--allow-dirty]',
    )
    process.exit(2)
  }
  const web = path.resolve(import.meta.dirname, '..')
  const outDir = path.resolve(web, opt('--out') ?? 'out')
  const repoRoot = findRepoRoot(web)
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim()
  const facts = readFacts(outDir, repoRoot)
  const problems = deployProblems(facts, {
    date,
    siteUrl,
    head,
    mode: loadSiteMode(web, false),
    allowDirty: args.includes('--allow-dirty'),
  })
  if (problems.length > 0) {
    console.error(`deploy-check: ${problems.length} problem(s); not deploying:`)
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(1)
  }
  const bytes = facts.files.reduce((n, x) => n + x.bytes, 0)
  const largest = [...facts.files].sort((a, b) => b.bytes - a.bytes)[0]
  console.log(
    `deploy-check: ${facts.files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MiB (largest ${largest?.path}, ${largest?.bytes} bytes); ${facts.manifest.build_date}, ${facts.manifest.site_url}, ${facts.widgetMode} mode, ${head.slice(0, 7)}`,
  )
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main()
}
