/**
 * `pnpm methodology:diff --from REF [--date YYYY-MM-DD] [--preview] [--write] [--json]`: the
 * scores a methodology change moves (docs/02 §11, docs/08 §1, B-141). Scores every scored entity
 * at the date twice, under the methodology and data at git ref REF (the previous version, read
 * from `git archive`) and under the working tree (this version), with the engine of @gai/scoring
 * and the generators of build-data, and prints every country whose display score moved by 1 or
 * more with the cause (methodology-diff.ts).
 *
 * Published events only by default, as the build scores them: this is what `--write` writes to
 * `methodology/{current folder}/diff.json`, which the build publishes. `--preview` scores the
 * events at status reviewed as if published, as `pnpm score --preview` and `pnpm calibrate` do;
 * its numbers are provisional, are never written to diff.json, and say so.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  currentMethodologyFolder,
  type Event,
  loadDataset,
  loadMethodology,
  MethodologyDiffFile,
} from '@gai/schema'
import { type CountryScore, createScorer, formatSigned } from '@gai/scoring'
import { confirmedMilitaryOf, generateAll, generateContext } from '../generate/index.js'
import { scoringMethodology } from '../methodology.js'
import { type DiffInput, diffRows, diffSummary } from '../methodology-diff.js'
import { argv, fail, flag, option, REPO_ROOT } from './common.js'

for (const a of argv) {
  if (a.startsWith('--') && !['--from', '--date', '--preview', '--write', '--json'].includes(a))
    fail(`unknown option ${a}`)
}
const ref = option('--from')
if (ref === undefined) fail('--from REF is required: the git ref of the previous version')
const date = option('--date') ?? new Date().toISOString().slice(0, 10)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('--date expects YYYY-MM-DD')
const preview = flag('--preview')
if (preview && flag('--write')) fail('--write takes published events only; drop --preview')
const statuses = preview ? ['reviewed'] : []

/** Every scored entity's score at `date` under the methodology and data of `root`. */
function scoreAll(root: string) {
  const lm = loadMethodology(root)
  const ds = loadDataset(root)
  const errors = [...lm.issues, ...ds.issues].filter(
    (i) => i.level === 'error' && i.rule.startsWith('load.'),
  )
  if (errors.length > 0) {
    fail(
      `${root}: ${errors.length} load error(s), first: ${errors[0]?.file} ${errors[0]?.message}`,
      1,
    )
  }
  const m = scoringMethodology(lm)
  const ctx = generateContext(
    lm,
    ds.countries.map((c) => c.value),
  )
  const generated = generateAll(ctx, ds.structured, {
    confirmedMilitary: confirmedMilitaryOf(ds.structured['a2_confirmed_military.csv']),
  }).events
  const hand = ds.events
    .map((e) => e.value)
    .map((e) => (statuses.includes(e.status) ? { ...e, status: 'published' as const } : e))
  const by = new Map<string, Event[]>()
  for (const e of [...hand, ...generated]) by.set(e.country, [...(by.get(e.country) ?? []), e])
  const scores = new Map<string, CountryScore>()
  const names = new Map<string, { en: string; fr: string }>()
  for (const c of ds.countries.map((x) => x.value).filter((x) => !x.excluded)) {
    scores.set(c.iso3, createScorer(c.iso3, by.get(c.iso3) ?? [], m).at(date))
    names.set(c.iso3, { en: c.name.en, fr: c.name.fr })
  }
  return { version: m.version, folder: lm.folder, scores, names }
}

const tmp = mkdtempSync(join(tmpdir(), 'gai-methodology-diff-'))
let before: ReturnType<typeof scoreAll>
try {
  const tar = execFileSync(
    'git',
    ['archive', '--format=tar', ref, 'methodology', 'data', 'archive/index.csv'],
    {
      cwd: REPO_ROOT,
      maxBuffer: 1024 * 1024 * 1024,
    },
  )
  execFileSync('tar', ['-x', '-C', tmp], { input: tar })
  before = scoreAll(tmp)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
const after = scoreAll(REPO_ROOT)
if (before.version === after.version) {
  fail(`${ref} and the working tree both declare methodology ${after.version}`)
}

const inputs: DiffInput[] = [...after.scores.keys()].flatMap((iso3) => {
  const b = before.scores.get(iso3)
  const a = after.scores.get(iso3)
  const name = after.names.get(iso3)
  return b && a && name ? [{ iso3, name, before: b, after: a }] : []
})
const file = MethodologyDiffFile.parse({
  from: before.version,
  to: after.version,
  date,
  countries: diffRows(inputs),
})
const summary = diffSummary(inputs)

if (flag('--write')) {
  const folder = currentMethodologyFolder(REPO_ROOT)
  const path = join(REPO_ROOT, 'methodology', folder ?? '', 'diff.json')
  writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`)
  process.stderr.write(`methodology:diff: wrote ${path}\n`)
}
const head = `${file.from} → ${file.to} on ${date}, ${preview ? 'PREVIEW: events at status reviewed scored as if published (provisional, never written to diff.json)' : 'published events'}; ${inputs.length} scored entities`
if (flag('--json')) {
  process.stdout.write(`${JSON.stringify({ preview, summary, ...file }, null, 2)}\n`)
} else {
  const lines = [
    head,
    `display scores moved by 1 or more: ${summary.changed}; passivity decisions changed: ${summary.passivity}`,
    `bands: ${Object.entries(summary.bands)
      .map(([k, v]) => `${k} ${v}`)
      .join('; ')}`,
    '',
    '| Country | ISO3 | Old | New | Cause |',
    '|---|---|---|---|---|',
    ...file.countries.map(
      (c) =>
        `| ${c.name.en} | ${c.iso3} | ${formatSigned(c.old, 'en', 0)} | ${formatSigned(c.new, 'en', 0)} | ${c.cause.en.replaceAll('|', '\\|')} |`,
    ),
  ]
  process.stdout.write(`${lines.join('\n')}\n`)
}
