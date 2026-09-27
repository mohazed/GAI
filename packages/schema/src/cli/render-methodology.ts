/**
 * `pnpm methodology:render` — rewrites the generated blocks of methodology.{en,fr}.md from the
 * YAML of the current (newest) methodology version folder. `--check` reports stale files without
 * writing.
 *
 * Older version folders are frozen (docs/02 §11, docs/08): their documents were rendered by the
 * renderer of their time and are never rewritten, so a later change to render.ts cannot force an
 * edit to a published version.
 *
 * Exit codes: 0 up to date (or rendered), 1 stale with --check or YAML errors, 2 usage error.
 */
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { listMethodologyVersions, loadMethodology } from '../load/methodology.js'
import { findRepoRoot } from '../load/repo.js'
import { renderDoc } from '../methodology/render.js'

interface Args {
  check: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = { check: false }
  for (const a of argv) {
    if (a === '--check') args.check = true
    else if (a === '--') continue
    else throw new Error(`unknown option ${a} (expected --check)`)
  }
  return args
}

export interface MainOptions {
  /** Where to look for the repository root (default: the process working directory). */
  cwd?: string
}

export function main(argv: string[], options: MainOptions = {}): number {
  const { check } = parseArgs(argv)
  const repoRoot = findRepoRoot(options.cwd ?? process.cwd())
  const folder = listMethodologyVersions(repoRoot).at(-1)
  if (folder === undefined) throw new Error('no methodology/vX.Y.Z folder found')
  const m = loadMethodology(repoRoot, folder)
  const errors = m.issues.filter((i) => i.level === 'error')
  if (errors.length > 0) {
    console.error(`${m.folder}: fix the YAML first (${errors.length} error(s); run pnpm validate)`)
    return 1
  }
  let stale = 0
  for (const lang of ['en', 'fr'] as const) {
    const doc = m.docs[lang]
    if (!doc) continue
    const next = renderDoc(doc.text, m, lang)
    if (next === doc.text) continue
    stale++
    if (check) console.log(`stale: ${doc.file}`)
    else {
      writeFileSync(join(repoRoot, doc.file), next)
      console.log(`rendered: ${doc.file}`)
    }
  }
  if (stale === 0) console.log(`${m.folder}: methodology docs are up to date`)
  return check && stale > 0 ? 1 : 0
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (err) {
    console.error((err as Error).message)
    process.exitCode = 2
  }
}
