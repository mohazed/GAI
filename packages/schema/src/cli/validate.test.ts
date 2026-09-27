/**
 * `pnpm validate` (cli/validate.ts): exit codes, the count lines, option parsing and the file
 * prefix of printed issues. Git is skipped (--no-git) so the result does not depend on the
 * state of the work tree. vitest runs with packages/schema as cwd; findRepoRoot walks up.
 */
import { appendFileSync, cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import { stringify } from 'yaml'
import { FIXTURES_ROOT, fixtureDataset, REPO_ROOT } from '../testing/harness.js'
import { findRepoRoot, main } from './validate.js'

let log: MockInstance<typeof console.log>
let tmp: string | undefined

beforeEach(() => {
  log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => {
  log.mockRestore()
  if (tmp) rmSync(tmp, { recursive: true, force: true })
  tmp = undefined
})

/** Every line main printed. */
const printed = (): string[] => log.mock.calls.map((args) => args.map(String).join(' '))

/** A temporary copy of the fixtures, outside the repository. */
function fixtureCopy(): string {
  tmp = mkdtempSync(join(tmpdir(), 'gai-cli-'))
  cpSync(FIXTURES_ROOT, tmp, { recursive: true })
  return tmp
}

const SUMMARY_RE = /^\d+ error\(s\), \d+ warning\(s\)$/
const METHODOLOGY_RE =
  /^ {2}methodology methodology\/v1\.0\.0 \(version 1\.0\.0[^)]*\): 34 indicators \(31 scored, 3 unscored\), 5 categories, 5 bands, \d+ qualifying votes, \d+ symmetry pairs, \d+ banned words$/

describe('findRepoRoot', () => {
  it('walks up from the package directory to the repository root', () => {
    expect(findRepoRoot(process.cwd())).toBe(REPO_ROOT)
    expect(findRepoRoot(join(REPO_ROOT, 'packages/schema/src/cli'))).toBe(REPO_ROOT)
    expect(findRepoRoot(REPO_ROOT)).toBe(REPO_ROOT)
  })

  it('throws outside a pnpm workspace', () => {
    tmp = mkdtempSync(join(tmpdir(), 'gai-cli-'))
    expect(() => findRepoRoot(tmp as string)).toThrow('pnpm-workspace.yaml')
  })
})

describe('main', () => {
  it('the fixtures: exit 0 and the count lines', () => {
    expect(main(['--root', 'fixtures', '--no-git'])).toBe(0)
    const lines = printed()
    expect(lines[0]).toBe('validate fixtures/data/ and methodology/')
    expect(lines[1]).toMatch(METHODOLOGY_RE)
    expect(lines.slice(2, 9)).toEqual([
      '  countries: 3 (1 scored, 2 excluded)',
      '  events: 1 (published 1)',
      '  sources: 2 (official 2)',
      '  assessments: 1 · corrections: 1 · replies: 1 · leads: 0',
      '  structured rows: unga_votes 0, unsc_vetoes 0, fts_funding 0, sipri_deliveries 0, sipri_orders 0, comtrade_a2 0, comtrade_c3 0, gni 0, population 0',
      '  archive: 2 index rows, 2 text files',
      '  history: skipped (--no-git)',
    ])
    expect(lines.at(-1)).toMatch(/^0 error\(s\), \d+ warning\(s\)$/)
    // Issues about the dataset carry the fixtures/ prefix; methodology issues keep their path.
    for (const line of lines.slice(9, -1)) {
      expect(line).toMatch(/^(error|warning) +(fixtures\/|methodology\/)/)
    }
  })

  it('the repository data tree: exit 0', () => {
    expect(main(['--no-git'])).toBe(0)
    const lines = printed()
    expect(lines[0]).toBe('validate data/ and methodology/')
    expect(lines[1]).toMatch(METHODOLOGY_RE)
    expect(lines).toContain('  history: skipped (--no-git)')
    expect(lines.at(-1)).toMatch(/^0 error\(s\), \d+ warning\(s\)$/)
  })

  it('accepts a leading -- (pnpm validate -- …)', () => {
    expect(main(['--', '--root', 'fixtures', '--no-git'])).toBe(0)
  })

  it('an error: exit 1, the issue printed with its file, line, id and rule', () => {
    const root = fixtureCopy()
    const event = structuredClone(fixtureDataset().events[0]?.value)
    appendFileSync(
      join(root, 'data/events/DEU.yaml'),
      stringify([{ ...event, id: 'evt_2025_08_09_DEU_A6', date: '2025-08-09', points: 'ten' }]),
    )
    expect(main(['--root', root, '--no-git'])).toBe(1)
    const lines = printed()
    const error = lines.find((l) => l.includes('[schema.event]'))
    expect(error).toBeDefined()
    expect(error).toMatch(
      /^error +\S*data\/events\/DEU\.yaml:\d+ +evt_2025_08_09_DEU_A6 +\[schema\.event\]/,
    )
    expect(lines.at(-1)).toMatch(/^[1-9]\d* error\(s\), \d+ warning\(s\)$/)
  })

  it('--strict fails on warnings; --quiet hides them', () => {
    const root = fixtureCopy()
    writeFileSync(join(root, 'data/foo.txt'), 'x\n')
    expect(main(['--root', root, '--no-git'])).toBe(0)
    expect(
      printed().some((l) => l.startsWith('warning') && l.includes('[load.unexpected-file]')),
    ).toBe(true)
    log.mockClear()
    expect(main(['--root', root, '--no-git', '--strict'])).toBe(1)
    log.mockClear()
    expect(main(['--root', root, '--no-git', '--quiet'])).toBe(0)
    const quiet = printed()
    expect(quiet.some((l) => l.startsWith('warning'))).toBe(false)
    // The summary still counts them.
    expect(quiet.at(-1)).toMatch(SUMMARY_RE)
    expect(quiet.at(-1)).not.toMatch(/, 0 warning\(s\)$/)
  })

  it('throws on an unknown option or a missing value, before loading anything', () => {
    expect(() => main(['--bogus'])).toThrow('unknown option --bogus')
    expect(() => main(['--root'])).toThrow('--root needs a value')
    expect(() => main(['--no-git', '--base'])).toThrow('--base needs a value')
    expect(log).not.toHaveBeenCalled()
  })
})
