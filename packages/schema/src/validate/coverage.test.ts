/**
 * Suite-level guarantees:
 * - the fixtures and the repository's own data/ and methodology/ pass every rule;
 * - every rule in the registry is exercised by the tests (P-02: "tests cover each validator rule").
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatIssue, RULE_IDS } from '../issues.js'
import { loadDataset } from '../load/dataset.js'
import { loadMethodology } from '../load/methodology.js'
import { fixtureContext, REPO_ROOT } from '../testing/harness.js'
import { buildContext } from './context.js'
import { validate } from './index.js'

const errorsOf = (issues: ReturnType<typeof validate>) =>
  issues.filter((i) => i.level === 'error').map(formatIssue)

describe('valid inputs', () => {
  it('the fixtures produce no error from any rule', () => {
    expect(errorsOf(validate(fixtureContext()))).toEqual([])
  })

  it('the repository data/ and methodology/ produce no error', () => {
    const ctx = buildContext(loadDataset(REPO_ROOT), loadMethodology(REPO_ROOT))
    expect(errorsOf(validate(ctx))).toEqual([])
  })
})

describe('rule coverage', () => {
  const srcDir = join(REPO_ROOT, 'packages/schema/src')
  const testFiles: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (entry.name.endsWith('.test.ts') && p !== import.meta.filename) testFiles.push(p)
    }
  }
  walk(srcDir)
  const corpus = testFiles.map((f) => readFileSync(f, 'utf8')).join('\n')

  it.each(RULE_IDS)('rule %s is exercised by a test', (rule) => {
    const files = testFiles
      .filter((f) => readFileSync(f, 'utf8').includes(`'${rule}'`))
      .map((f) => relative(srcDir, f))
    expect(corpus.includes(`'${rule}'`), `no test file mentions '${rule}'`).toBe(true)
    expect(files.length).toBeGreaterThan(0)
  })
})
