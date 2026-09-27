/**
 * Integration tests for load/git.ts: a throwaway repository in the system temp directory holds a
 * copy of the fixtures; the history rules then compare the working tree with its commits.
 *
 * Isolation: HOME and XDG_CONFIG_HOME point into the temp directory and the system config is off,
 * so no user or system git config (signing, hooks, templates) applies; GIT_* variables and the
 * base-ref variables are removed; GIT_CEILING_DIRECTORIES stops discovery above the temp root.
 * The repository's own git state is never touched.
 */
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FIXTURES_ROOT, issuesOf, repoMethodology, runRules } from '../testing/harness.js'
import { buildContext } from '../validate/context.js'
import { rules as historyRules } from '../validate/rules/history.js'
import { loadDataset } from './dataset.js'
import { baseRequired, loadBaseSnapshot, resolveBase, resolveBaseRef } from './git.js'

const EVENT_ID = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const CORRECTION_ID = 'cor_20260927_1'
const SOURCE_IDS = [
  'src_20250808_bundesregierung_ruestungsexporte-gaza',
  'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung',
]
const REPLY_ID = 'rep_20260927_DEU_1'
const LEAD_ID = 'lead_20260901_DEU_1'

const LEAD_YAML = `- id: ${LEAD_ID}
  country: DEU
  indicator: A3
  claim: Test lead.
  sources:
    - {url: https://example.org/test-lead, publisher: Example, kind: press}
  date: 2026-09-01
  status: open
`

/** Each test spawns a few dozen git processes; allow for a slow CI machine. */
const SLOW = { timeout: 30_000 }

let root: string
let repo: string

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

/** Copies fixtures/data and fixtures/archive under `dir`. */
function copyFixtures(dir: string): void {
  cpSync(join(FIXTURES_ROOT, 'data'), join(dir, 'data'), { recursive: true })
  cpSync(join(FIXTURES_ROOT, 'archive'), join(dir, 'archive'), { recursive: true })
}

/** A repository on branch main whose first commit holds the fixtures (plus a lead). */
function initRepo(dir: string): string {
  mkdirSync(dir, { recursive: true })
  git(dir, ['init', '-q'])
  // `git init -b` needs git 2.28; setting HEAD before the first commit works everywhere.
  git(dir, ['symbolic-ref', 'HEAD', 'refs/heads/main'])
  copyFixtures(dir)
  writeFileSync(join(dir, 'data/leads/DEU.yaml'), LEAD_YAML)
  git(dir, ['add', '-A'])
  git(dir, ['commit', '-q', '-m', 'Fixtures'])
  return git(dir, ['rev-parse', 'HEAD'])
}

function editPoints(dir: string, from: number, to: number): void {
  const file = join(dir, EVENTS_FILE)
  const text = readFileSync(file, 'utf8')
  const next = text.replace(`\n  points: ${from}\n`, `\n  points: ${to}\n`)
  expect(next).not.toBe(text)
  writeFileSync(file, next)
}

function historyIssues(dir: string, ref: string, prefix = '') {
  const base = loadBaseSnapshot(dir, ref, prefix)
  const ds = loadDataset(prefix === '' ? dir : join(dir, prefix))
  return runRules(historyRules, buildContext(ds, repoMethodology(), base))
}

beforeEach(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'gai-git-test-')))
  repo = join(root, 'repo')
  const home = join(root, 'home')
  mkdirSync(home)
  for (const name of Object.keys(process.env)) {
    if (name.startsWith('GIT_')) vi.stubEnv(name, undefined)
  }
  vi.stubEnv('GAI_VALIDATE_BASE', undefined)
  vi.stubEnv('GITHUB_BASE_REF', undefined)
  vi.stubEnv('HOME', home)
  vi.stubEnv('XDG_CONFIG_HOME', home)
  vi.stubEnv('GIT_CONFIG_NOSYSTEM', '1')
  vi.stubEnv('GIT_CEILING_DIRECTORIES', root)
})

afterEach(() => {
  vi.unstubAllEnvs()
  rmSync(root, { recursive: true, force: true })
})

describe('resolveBaseRef', SLOW, () => {
  it('returns null outside a git work tree', () => {
    const plain = join(root, 'plain')
    mkdirSync(plain)
    expect(resolveBaseRef(plain)).toBeNull()
  })

  it('returns null in a repository without a commit', () => {
    mkdirSync(repo)
    git(repo, ['init', '-q'])
    expect(resolveBaseRef(repo)).toBeNull()
  })

  it("returns HEAD's commit on main", () => {
    const head = initRepo(repo)
    expect(resolveBaseRef(repo)).toBe(head)
  })

  it('returns the merge base with main on another branch', () => {
    const head = initRepo(repo)
    git(repo, ['checkout', '-q', '-b', 'data/deu'])
    editPoints(repo, 10, 8)
    git(repo, ['commit', '-q', '-a', '-m', 'Edit points'])
    expect(git(repo, ['rev-parse', 'HEAD'])).not.toBe(head)
    expect(resolveBaseRef(repo)).toBe(head)
  })

  it('returns null on a pull request whose base branch has no merge base (shallow clone)', () => {
    initRepo(repo)
    vi.stubEnv('GITHUB_BASE_REF', 'main')
    // No origin/main in this repository: the comparison would be HEAD with itself.
    expect(resolveBaseRef(repo)).toBeNull()
  })

  it('resolves an explicit ref or GAI_VALIDATE_BASE, and returns null for an unknown ref', () => {
    const first = initRepo(repo)
    editPoints(repo, 10, 8)
    git(repo, ['commit', '-q', '-a', '-m', 'Edit points'])
    expect(resolveBaseRef(repo, 'HEAD~1')).toBe(first)
    vi.stubEnv('GAI_VALIDATE_BASE', 'HEAD~1')
    expect(resolveBaseRef(repo)).toBe(first)
    expect(resolveBaseRef(repo, 'no-such-ref')).toBeNull()
  })
})

describe('resolveBase: which commit, and where it came from', SLOW, () => {
  it('on main without a remote: HEAD, labelled as uncommitted changes only', () => {
    const head = initRepo(repo)
    expect(resolveBase(repo)).toEqual({
      ok: true,
      ref: head,
      source: 'HEAD: uncommitted changes only',
      head: true,
    })
  })

  it('names the reason when there is no work tree or no commit', () => {
    const plain = join(root, 'plain')
    mkdirSync(plain)
    expect(resolveBase(plain)).toEqual({ ok: false, reason: 'not a git work tree' })
    mkdirSync(repo)
    git(repo, ['init', '-q'])
    expect(resolveBase(repo)).toEqual({ ok: false, reason: 'no commit yet' })
  })

  it('an empty GAI_VALIDATE_BASE (the CI expression on PRs and branches) falls through', () => {
    const head = initRepo(repo)
    git(repo, ['checkout', '-q', '-b', 'data/deu'])
    editPoints(repo, 10, 8)
    git(repo, ['commit', '-q', '-a', '-m', 'Edit points'])
    expect(resolveBase(repo, undefined, { GAI_VALIDATE_BASE: '' })).toMatchObject({
      ok: true,
      ref: head,
      source: 'merge base of HEAD and main',
      head: false,
    })
  })

  it('an explicit or GAI_VALIDATE_BASE ref that is not in the clone: the reason names it', () => {
    initRepo(repo)
    const zeros = '0'.repeat(40)
    const env = resolveBase(repo, undefined, { GAI_VALIDATE_BASE: zeros })
    expect(env).toMatchObject({ ok: false })
    expect(!env.ok && env.reason).toContain(`GAI_VALIDATE_BASE ${zeros} is not a commit`)
    const flag = resolveBase(repo, 'no-such-ref', {})
    expect(!flag.ok && flag.reason).toContain('--base no-such-ref is not a commit')
    expect(resolveBase(repo, 'HEAD', {})).toMatchObject({ ok: true, source: '--base HEAD' })
  })

  it('a branch with no merge base with main (unrelated history) is not compared with itself', () => {
    initRepo(repo)
    git(repo, ['checkout', '-q', '--orphan', 'data/t'])
    git(repo, ['commit', '-q', '-m', 'Unrelated'])
    const r = resolveBase(repo, undefined, {})
    expect(r.ok).toBe(false)
    expect(!r.ok && r.reason).toContain('branch data/t has no merge base with origin/main or main')
    git(repo, ['checkout', '-q', '--detach'])
    const detached = resolveBase(repo, undefined, {})
    expect(!detached.ok && detached.reason).toContain('a detached HEAD has no merge base')
  })

  describe('in a clone (origin/main exists)', () => {
    let work: string
    let first: string

    beforeEach(() => {
      first = initRepo(repo)
      work = join(root, 'work')
      execFileSync('git', ['clone', '-q', repo, work], { stdio: 'ignore' })
    })

    it('prefers origin/main to a local main that is ahead of it', () => {
      editPoints(work, 10, 8)
      git(work, ['commit', '-q', '-a', '-m', 'Local, unpushed'])
      const local = git(work, ['rev-parse', 'HEAD'])
      // On main itself, the unpushed commit is checked too.
      expect(resolveBase(work, undefined, {})).toMatchObject({
        ok: true,
        ref: first,
        source: 'merge base of HEAD and origin/main',
        head: false,
      })
      git(work, ['checkout', '-q', '-b', 'data/deu'])
      expect(resolveBase(work, undefined, {})).toMatchObject({ ok: true, ref: first })
      expect(local).not.toBe(first)
    })

    it('a pull request: the merge base of the detached merge commit and origin/<base>', () => {
      git(work, ['checkout', '-q', '-b', 'data/deu'])
      editPoints(work, 10, 8)
      git(work, ['commit', '-q', '-a', '-m', 'Edit points'])
      // What actions/checkout does for pull_request: a detached merge commit.
      git(work, ['checkout', '-q', '--detach', 'origin/main'])
      git(work, ['merge', '-q', '--no-ff', '-m', 'Merge', 'data/deu'])
      expect(git(work, ['rev-parse', '--abbrev-ref', 'HEAD'])).toBe('HEAD')
      expect(resolveBase(work, undefined, { GITHUB_BASE_REF: 'main' })).toEqual({
        ok: true,
        ref: first,
        source: 'merge base of HEAD and origin/main',
        head: false,
      })
      const historyIssuesOf = runRules(
        historyRules,
        buildContext(loadDataset(work), repoMethodology(), loadBaseSnapshot(work, first)),
      )
      expect(issuesOf(historyIssuesOf, 'correction.required-on-edit').length).toBeGreaterThan(0)
    })

    it('a single-branch clone of a data branch (no main at all) is not resolved', () => {
      git(repo, ['checkout', '-q', '-b', 'data/t'])
      editPoints(repo, 10, 8)
      git(repo, ['commit', '-q', '-a', '-m', 'Edit points'])
      const single = join(root, 'single')
      execFileSync(
        'git',
        ['clone', '-q', '--single-branch', '--branch', 'data/t', `file://${repo}`, single],
        { stdio: 'ignore' },
      )
      const r = resolveBase(single, undefined, {})
      expect(r.ok).toBe(false)
      expect(!r.ok && r.reason).toContain('branch data/t has no merge base')
      const pr = resolveBase(single, undefined, { GITHUB_BASE_REF: 'main' })
      expect(!pr.ok && pr.reason).toContain('no merge base between HEAD and origin/main')
    })
  })
})

describe('baseRequired', () => {
  it('is true for --base, a non-empty GAI_VALIDATE_BASE, GITHUB_BASE_REF or GitHub Actions', () => {
    expect(baseRequired('HEAD~1', {})).toBe(true)
    expect(baseRequired(undefined, { GAI_VALIDATE_BASE: 'abc' })).toBe(true)
    expect(baseRequired(undefined, { GITHUB_BASE_REF: 'main' })).toBe(true)
    expect(baseRequired(undefined, { GITHUB_ACTIONS: 'true' })).toBe(true)
  })

  it('is false for a plain local run, including an empty GAI_VALIDATE_BASE', () => {
    expect(baseRequired(undefined, {})).toBe(false)
    expect(baseRequired(undefined, { GAI_VALIDATE_BASE: '', GITHUB_BASE_REF: '' })).toBe(false)
  })
})

describe('loadBaseSnapshot', SLOW, () => {
  it('reads events, corrections and source, reply and lead ids with their files', () => {
    const head = initRepo(repo)
    const snap = loadBaseSnapshot(repo, 'HEAD')
    expect(snap).toMatchObject({ ref: 'HEAD', commit: head })

    expect([...snap.events.keys()]).toEqual([EVENT_ID])
    const event = snap.events.get(EVENT_ID)
    expect(event?.file).toBe(EVENTS_FILE)
    expect(event?.raw).toMatchObject({ id: EVENT_ID, points: 10, status: 'published' })
    expect(event?.value?.revision).toBe(2)

    expect([...snap.corrections.keys()]).toEqual([CORRECTION_ID])
    expect(snap.corrections.get(CORRECTION_ID)?.file).toBe('data/corrections.yaml')
    expect(snap.corrections.get(CORRECTION_ID)?.value?.kind).toBe('correction')

    expect([...snap.sourceIds].sort()).toEqual(SOURCE_IDS)
    expect([...snap.replyIds]).toEqual([REPLY_ID])
    expect([...snap.leadIds]).toEqual([LEAD_ID])
  })

  it('reads the committed version, not the working tree', () => {
    initRepo(repo)
    editPoints(repo, 10, 8)
    expect(loadBaseSnapshot(repo, 'HEAD').events.get(EVENT_ID)?.raw.points).toBe(10)
  })

  it('keeps a record that fails the current schema as raw, with a null value', () => {
    initRepo(repo)
    editPoints(repo, 10, 8)
    const file = join(repo, EVENTS_FILE)
    writeFileSync(file, readFileSync(file, 'utf8').replace('  revision: 2\n', '  revision: 0\n'))
    git(repo, ['commit', '-q', '-a', '-m', 'Invalid revision'])
    const rec = loadBaseSnapshot(repo, 'HEAD').events.get(EVENT_ID)
    expect(rec?.value).toBeNull()
    expect(rec?.raw).toMatchObject({ revision: 0, points: 8 })
  })

  it('reads a dataset under a prefix, and from a subdirectory of the work tree', () => {
    mkdirSync(repo)
    git(repo, ['init', '-q'])
    git(repo, ['symbolic-ref', 'HEAD', 'refs/heads/main'])
    copyFixtures(join(repo, 'fixtures'))
    git(repo, ['add', '-A'])
    git(repo, ['commit', '-q', '-m', 'Fixtures under a prefix'])

    const prefixed = loadBaseSnapshot(repo, 'HEAD', 'fixtures/')
    expect(prefixed.events.get(EVENT_ID)?.file).toBe(EVENTS_FILE)
    expect([...prefixed.sourceIds].sort()).toEqual(SOURCE_IDS)

    const nested = loadBaseSnapshot(join(repo, 'fixtures'), 'HEAD')
    expect(nested.events.get(EVENT_ID)?.file).toBe(EVENTS_FILE)
    expect([...nested.corrections.keys()]).toEqual([CORRECTION_ID])
  })

  it('throws when the ref cannot be read', () => {
    initRepo(repo)
    expect(() => loadBaseSnapshot(repo, 'no-such-ref')).toThrow()
  })

  it('with the working-tree dataset: reuses unchanged files, reads changed ones from git', () => {
    initRepo(repo)
    editPoints(repo, 10, 8)
    const current = loadDataset(repo)
    const full = loadBaseSnapshot(repo, 'HEAD')
    const fast = loadBaseSnapshot(repo, 'HEAD', '', current)

    // The edited events file is read from the base: points 10, not the working tree's 8.
    expect(fast.events.get(EVENT_ID)?.raw.points).toBe(10)
    expect(fast.events.get(EVENT_ID)?.value).toEqual(full.events.get(EVENT_ID)?.value)
    // The unchanged corrections log is the working-tree record itself (not re-parsed).
    expect(fast.corrections.get(CORRECTION_ID)?.value).toBe(current.corrections[0]?.value)
    expect(fast.corrections.get(CORRECTION_ID)?.value).toEqual(
      full.corrections.get(CORRECTION_ID)?.value,
    )
    // Same ids and files everywhere.
    const shape = (s: typeof full) => ({
      events: [...s.events].map(([id, r]) => [id, r.file, r.raw.status]),
      corrections: [...s.corrections].map(([id, r]) => [id, r.file]),
      sources: [...s.sourceIds].sort(),
      replies: [...s.replyIds].sort(),
      leads: [...s.leadIds].sort(),
    })
    expect(shape(fast)).toEqual(shape(full))
    // And the history rules agree.
    const run = (base: typeof full) =>
      runRules(historyRules, buildContext(current, repoMethodology(), base))
    expect(run(fast)).toEqual(run(full))
    expect(issuesOf(run(fast), 'correction.required-on-edit').length).toBeGreaterThan(0)
  })

  it('with the working-tree dataset: a file deleted since the base is read from git', () => {
    initRepo(repo)
    rmSync(join(repo, 'data/leads/DEU.yaml'))
    const current = loadDataset(repo)
    const fast = loadBaseSnapshot(repo, 'HEAD', '', current)
    expect([...fast.leadIds]).toEqual([LEAD_ID])
    expect(
      issuesOf(
        runRules(historyRules, buildContext(current, repoMethodology(), fast)),
        'correction.never-delete',
      ),
    ).toMatchObject([{ id: LEAD_ID }])
  })
})

describe('history rules against a real base ref', SLOW, () => {
  it('report nothing when the working tree equals the base', () => {
    initRepo(repo)
    const ref = resolveBaseRef(repo)
    expect(ref).not.toBeNull()
    expect(historyIssues(repo, ref ?? 'HEAD')).toEqual([])
  })

  it('report an uncommitted points edit without a correction entry', () => {
    initRepo(repo)
    editPoints(repo, 10, 8)
    const ref = resolveBaseRef(repo)
    expect(ref).not.toBeNull()
    const found = issuesOf(historyIssues(repo, ref ?? 'HEAD'), 'correction.required-on-edit')
    expect(found.length).toBeGreaterThan(0)
    expect(found[0]).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
  })

  it('report a deleted source file', () => {
    initRepo(repo)
    const [sourceId] = SOURCE_IDS
    const file = `data/sources/2025/${sourceId}.yaml`
    rmSync(join(repo, file))
    const found = issuesOf(historyIssues(repo, 'HEAD'), 'correction.never-delete')
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file, id: sourceId })
  })

  it('compare a prefixed dataset (fixtures/) with the same prefix on the base', () => {
    mkdirSync(repo)
    git(repo, ['init', '-q'])
    git(repo, ['symbolic-ref', 'HEAD', 'refs/heads/main'])
    copyFixtures(join(repo, 'fixtures'))
    git(repo, ['add', '-A'])
    git(repo, ['commit', '-q', '-m', 'Fixtures under a prefix'])
    editPoints(join(repo, 'fixtures'), 10, 8)
    const found = issuesOf(historyIssues(repo, 'HEAD', 'fixtures/'), 'correction.required-on-edit')
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
  })
})
