/**
 * Rule 8 of docs/02 §12, enforced by the build: "No `unchecked` indicator on any country when
 * `NEXT_PUBLIC_SHOW_SCORES=true`." The build-data step writes a note of kind `unchecked` for each
 * country with an unchecked indicator and does not fail, because scorecard mode allows them
 * (docs/02 §8). In score mode (D-16) they must be zero, for all 193 countries (docs/10 B-2098).
 *
 *   tsx scripts/rule8.ts [--api public/api/v1]
 *
 * `pnpm --filter @gai/web build` runs it first, so a score-mode build with an unchecked indicator
 * fails in seconds, before `next build`; `scripts/deploy-check.ts` applies the same test to the
 * output about to be deployed. In scorecard mode it prints a line and passes. The component kit
 * (`build:kit`, fixtures, score mode) does not run it: fixtures are not the dataset.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Mode } from '../lib/mode'
import { loadSiteMode } from './site-env'

/** What the check reads from build-notes.json. */
export interface UncheckedFacts {
  /** `counts.unchecked`: the number of notes of kind `unchecked` (one per country). */
  count: number
  /** The countries of those notes, in the file's order. */
  countries: string[]
}

/** Every reason rule 8 refuses the build; empty in scorecard mode or when nothing is unchecked. */
export function rule8Problems(mode: Mode, f: UncheckedFacts): string[] {
  if (mode !== 'score' || f.count === 0) return []
  const shown = f.countries.slice(0, 8).join(', ')
  const more = f.countries.length > 8 ? `, … (${f.countries.length} countries)` : ''
  return [
    `rule 8 (docs/02 §12): ${f.count} note(s) of kind unchecked in build-notes.json (${shown}${more}); no country may have an unchecked indicator when NEXT_PUBLIC_SHOW_SCORES=true. Fix the data, or keep scorecard mode`,
  ]
}

/** Reads `counts.unchecked` and the countries of the `unchecked` notes. */
export function uncheckedFacts(buildNotes: unknown): UncheckedFacts {
  const n = buildNotes as {
    counts?: { unchecked?: unknown }
    notes?: { kind?: unknown; country?: unknown }[]
  }
  if (typeof n.counts?.unchecked !== 'number') {
    throw new Error('build-notes.json has no numeric counts.unchecked')
  }
  const countries = (n.notes ?? [])
    .filter((x) => x.kind === 'unchecked' && typeof x.country === 'string')
    .map((x) => x.country as string)
  return { count: n.counts.unchecked, countries }
}

function main() {
  const args = process.argv.slice(2)
  const i = args.indexOf('--api')
  const web = path.resolve(import.meta.dirname, '..')
  const api = path.resolve(web, i === -1 ? 'public/api/v1' : (args[i + 1] ?? ''))
  const file = path.join(api, 'build-notes.json')
  if (!existsSync(file)) {
    console.error(`rule8: ${file} does not exist; run pnpm build:data first`)
    process.exit(2)
  }
  const mode = loadSiteMode(web, false)
  const facts = uncheckedFacts(JSON.parse(readFileSync(file, 'utf8')))
  const problems = rule8Problems(mode, facts)
  if (problems.length > 0) {
    for (const p of problems) console.error(p)
    process.exit(1)
  }
  console.log(
    `rule8: ${mode} mode, ${facts.count} unchecked note(s)${mode === 'score' ? '' : ' (allowed in scorecard mode)'}`,
  )
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main()
}
