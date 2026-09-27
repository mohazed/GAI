/**
 * `pnpm methodology:render` — rewrites the generated blocks of methodology.{en,fr}.md from the
 * YAML of every methodology version folder. `--check` reports stale files without writing.
 */
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { listMethodologyVersions, loadMethodology } from '../load/methodology.js'
import { renderDoc } from '../methodology/render.js'
import { findRepoRoot } from './validate.js'

export function main(argv: string[]): number {
  const check = argv.includes('--check')
  const repoRoot = findRepoRoot(process.cwd())
  let stale = 0
  for (const folder of listMethodologyVersions(repoRoot)) {
    const m = loadMethodology(repoRoot, folder)
    const errors = m.issues.filter((i) => i.level === 'error')
    if (errors.length > 0) {
      console.error(
        `${m.folder}: fix the YAML first (${errors.length} error(s); run pnpm validate)`,
      )
      return 1
    }
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
  }
  if (stale === 0) console.log('methodology docs are up to date')
  return check && stale > 0 ? 1 : 0
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  process.exitCode = main(process.argv.slice(2))
}
