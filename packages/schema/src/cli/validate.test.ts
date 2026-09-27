/**
 * `pnpm validate` (cli/validate.ts): exit codes, the count lines, option parsing and the file
 * prefix of printed issues. Against the repository, git is skipped (--no-git) so the result does
 * not depend on the state of the work tree; the history checks run in throwaway workspaces
 * (a pnpm-workspace.yaml, a copy of methodology/ and of the fixtures, and their own git
 * repository) under the OS temp directory. vitest runs with packages/schema as cwd;
 * findRepoRoot walks up. `--root` resolves against the invocation directory, given explicitly.
 */
import { execFileSync } from 'node:child_process'
import {
  appendFileSync,
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import { stringify } from 'yaml'
import { FIXTURES_ROOT, fixtureDataset, REPO_ROOT } from '../testing/harness.js'
import { main as renderMain } from './render-methodology.js'
import { findRepoRoot, main } from './validate.js'

let log: MockInstance<typeof console.log>
let tmp: string | undefined

beforeEach(() => {
  log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => {
  log.mockRestore()
  vi.unstubAllEnvs()
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

/** As if `pnpm validate` was typed at the repository root. */
const AT_ROOT = { invocationDir: REPO_ROOT }
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
    expect(main(['--root', 'fixtures', '--no-git'], AT_ROOT)).toBe(0)
    const lines = printed()
    expect(lines[0]).toBe('validate fixtures/data/ and methodology/')
    expect(lines[1]).toMatch(METHODOLOGY_RE)
    expect(lines.slice(2, 9)).toEqual([
      '  countries: 3 (1 scored, 2 excluded)',
      '  events: 1 (published 1)',
      '  sources: 2 (official 2)',
      '  assessments: 1 · corrections: 1 · replies: 1 · leads: 0',
      '  structured rows: unga_votes 0, unsc_vetoes 0, fts_funding 0, fts_plan_totals 0, sipri_deliveries 0, sipri_orders 0, comtrade_a2 0, comtrade_c3 0, gni 0, population 0',
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
    expect(main(['--', '--root', 'fixtures', '--no-git'], AT_ROOT)).toBe(0)
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

describe('--root', () => {
  const SCHEMA_DIR = join(REPO_ROOT, 'packages/schema')

  it('resolves against the directory the command was run from', () => {
    expect(main(['--root', '../../fixtures', '--no-git'], { invocationDir: SCHEMA_DIR })).toBe(0)
    expect(printed()[0]).toBe('validate fixtures/data/ and methodology/')
  })

  it('a directory without data/ is a usage error (thrown, exit 2), not a validation failure', () => {
    expect(() => main(['--root', 'fixtures', '--no-git'], { invocationDir: SCHEMA_DIR })).toThrow(
      /--root fixtures: .* has no data\/ directory/,
    )
    expect(() => main(['--root', '/nonexistent/dir', '--no-git'])).toThrow('has no data/ directory')
    expect(log).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------------------------
// Throwaway workspaces: pnpm-workspace.yaml + methodology/ + the fixtures' data/ and archive/.

const EVENTS_FILE = 'data/events/DEU.yaml'

function workspace(): string {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'gai-cli-ws-')))
  // No user or system git config applies; git never looks above the temp directory.
  for (const name of Object.keys(process.env)) {
    if (name.startsWith('GIT_')) vi.stubEnv(name, undefined)
  }
  vi.stubEnv('HOME', tmp)
  vi.stubEnv('XDG_CONFIG_HOME', tmp)
  vi.stubEnv('GIT_CONFIG_NOSYSTEM', '1')
  vi.stubEnv('GIT_CEILING_DIRECTORIES', tmp)
  const ws = join(tmp, 'ws')
  cpSync(join(REPO_ROOT, 'methodology'), join(ws, 'methodology'), { recursive: true })
  cpSync(join(FIXTURES_ROOT, 'data'), join(ws, 'data'), { recursive: true })
  cpSync(join(FIXTURES_ROOT, 'archive'), join(ws, 'archive'), { recursive: true })
  writeFileSync(join(ws, 'pnpm-workspace.yaml'), 'packages: []\n')
  return ws
}

function git(cwd: string, args: string[]): string {
  return execFileSync(
    'git',
    [
      '-c',
      'user.name=GAI test',
      '-c',
      'user.email=test@example.invalid',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim()
}

/** A workspace under git, on main, with one commit holding everything. */
function gitWorkspace(): { ws: string; head: string } {
  const ws = workspace()
  git(ws, ['init', '-q'])
  git(ws, ['symbolic-ref', 'HEAD', 'refs/heads/main'])
  git(ws, ['add', '-A'])
  git(ws, ['commit', '-q', '-m', 'Fixtures'])
  return { ws, head: git(ws, ['rev-parse', 'HEAD']) }
}

function editPoints(ws: string): void {
  const file = join(ws, EVENTS_FILE)
  const text = readFileSync(file, 'utf8')
  const next = text.replace('\n  points: 10\n', '\n  points: 8\n')
  expect(next).not.toBe(text)
  writeFileSync(file, next)
}

const linesWith = (rule: string) => printed().filter((l) => l.includes(`[${rule}]`))

describe('history checks (git)', { timeout: 30_000 }, () => {
  it('on main: compares with HEAD, says so, and reports an uncorrected edit (exit 1)', () => {
    const { ws, head } = gitWorkspace()
    editPoints(ws)
    expect(main([], { cwd: ws, env: {} })).toBe(1)
    expect(printed()).toContain(
      `  history: compared with commit ${head.slice(0, 10)} (HEAD: uncommitted changes only)`,
    )
    expect(linesWith('correction.required-on-edit')[0]).toMatch(
      /^error +data\/events\/DEU\.yaml:\d+ +evt_2025_08_08_DEU_A6 /,
    )
  })

  it('an explicit base that is not in the clone is an error, not a skipped check (exit 1)', () => {
    const { ws } = gitWorkspace()
    const zeros = '0'.repeat(40)
    expect(main([], { cwd: ws, env: { GAI_VALIDATE_BASE: zeros } })).toBe(1)
    expect(printed()).toContain(
      `  history: skipped (GAI_VALIDATE_BASE ${zeros} is not a commit in this clone (force-pushed away, or not fetched: use fetch-depth: 0))`,
    )
    expect(linesWith('correction.base-unavailable')).toHaveLength(1)
    expect(linesWith('correction.base-unavailable')[0]).toMatch(/^error /)
    log.mockClear()
    expect(main(['--base', 'no-such-ref'], { cwd: ws, env: {} })).toBe(1)
    expect(linesWith('correction.base-unavailable')[0]).toMatch(/^error .*--base no-such-ref/)
  })

  it('outside a git work tree: a warning locally, an error on GitHub Actions', () => {
    const ws = workspace()
    const local = main([], { cwd: ws, env: {} })
    expect(printed()).toContain('  history: skipped (not a git work tree)')
    expect(linesWith('correction.base-unavailable')[0]).toMatch(/^warning /)
    const errors = printed().filter((l) => l.startsWith('error')).length
    expect(local).toBe(errors > 0 ? 1 : 0)
    log.mockClear()
    expect(main([], { cwd: ws, env: { GITHUB_ACTIONS: 'true' } })).toBe(1)
    expect(linesWith('correction.base-unavailable')[0]).toMatch(/^error .*not a git work tree/)
    log.mockClear()
    // A pull request run without the base branch: an error naming the remedy.
    expect(main([], { cwd: ws, env: { GITHUB_BASE_REF: 'main' } })).toBe(1)
    expect(linesWith('correction.base-unavailable')[0]).toMatch(/^error /)
  })

  it('a --root written through a symbolic link still gets the history checks', () => {
    const { ws } = gitWorkspace()
    const alias = join(dirname(ws), 'alias')
    symlinkSync(ws, alias)
    editPoints(ws)
    expect(main(['--root', alias], { cwd: ws, env: {} })).toBe(1)
    expect(printed()[0]).toBe('validate data/ and methodology/')
    expect(printed().some((l) => l.startsWith('  history: compared with commit'))).toBe(true)
    expect(linesWith('correction.required-on-edit').length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------------------------
// Two methodology version folders

/** Adds methodology/v0.9.0, a copy of v1.0.0 declaring version 0.9.0. */
function addOlderFolder(ws: string): string {
  const current = readdirSync(join(ws, 'methodology'))
    .filter((n) => /^v\d/.test(n))
    .sort()
    .at(-1)
  const older = join(ws, 'methodology/v0.9.0')
  cpSync(join(ws, 'methodology', current as string), older, { recursive: true })
  for (const name of readdirSync(older).filter((n) => n.endsWith('.yaml'))) {
    const file = join(older, name)
    writeFileSync(file, readFileSync(file, 'utf8').replace(/^version: .*$/m, 'version: 0.9.0'))
  }
  return older
}

/** Makes the first generated block of a document differ from its rendering. */
function staleDoc(file: string): void {
  const text = readFileSync(file, 'utf8')
  const next = text.replace(/(<!-- BEGIN generated:\w+ -->\n)/, '$1hand edit\n')
  expect(next).not.toBe(text)
  writeFileSync(file, next)
}

describe('older methodology folders', () => {
  it('data issues are printed once; older folders get their YAML checks, not docs checks', () => {
    const ws = workspace()
    const older = addOlderFolder(ws)
    staleDoc(join(older, 'methodology.en.md'))
    // An older folder with a YAML inconsistency, a data schema error and a stray data file.
    writeFileSync(
      join(older, 'decay.yaml'),
      readFileSync(join(older, 'decay.yaml'), 'utf8').replace(/^version: .*$/m, 'version: 0.8.0'),
    )
    const event = structuredClone(fixtureDataset().events[0]?.value)
    appendFileSync(
      join(ws, EVENTS_FILE),
      stringify([{ ...event, id: 'evt_2025_08_09_DEU_A6', date: '2025-08-09', points: 'ten' }]),
    )
    writeFileSync(join(ws, 'data/notes.txt'), 'x\n')

    expect(main(['--no-git'], { cwd: ws, env: {} })).toBe(1)
    expect(linesWith('schema.event')).toHaveLength(1)
    expect(linesWith('load.unexpected-file')).toHaveLength(1)
    const version = linesWith('methodology.version')
    expect(version.some((l) => l.includes('methodology/v0.9.0/decay.yaml'))).toBe(true)
    expect(linesWith('methodology.docs-generated').some((l) => l.includes('v0.9.0'))).toBe(false)
  })

  it('methodology:render renders and checks the newest folder only', () => {
    const ws = workspace()
    const older = addOlderFolder(ws)
    const olderDoc = join(older, 'methodology.en.md')
    staleDoc(olderDoc)
    const frozen = readFileSync(olderDoc, 'utf8')
    const current = join(ws, 'methodology/v1.0.0/methodology.en.md')
    staleDoc(current)

    expect(renderMain(['--check'], { cwd: ws })).toBe(1)
    expect(printed()).toEqual(['stale: methodology/v1.0.0/methodology.en.md'])
    log.mockClear()
    expect(renderMain([], { cwd: ws })).toBe(0)
    expect(printed()).toEqual(['rendered: methodology/v1.0.0/methodology.en.md'])
    expect(readFileSync(current, 'utf8')).not.toContain('hand edit')
    expect(readFileSync(olderDoc, 'utf8')).toBe(frozen)
    log.mockClear()
    expect(renderMain(['--check'], { cwd: ws })).toBe(0)
  })

  it('methodology:render refuses unknown options (a mistyped --check never writes)', () => {
    const ws = workspace()
    const current = join(ws, 'methodology/v1.0.0/methodology.en.md')
    staleDoc(current)
    const before = readFileSync(current, 'utf8')
    expect(() => renderMain(['--chek'], { cwd: ws })).toThrow('unknown option --chek')
    expect(readFileSync(current, 'utf8')).toBe(before)
    expect(() => renderMain([], { cwd: dirname(dirname(ws)) })).toThrow('pnpm-workspace.yaml')
  })
})
