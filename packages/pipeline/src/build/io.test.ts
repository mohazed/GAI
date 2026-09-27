/**
 * Tests of the build's file system and git side (./io.ts). Git tests run in throwaway
 * repositories under the system temp directory, isolated as in @gai/schema's load/git.test.ts:
 * HOME and XDG_CONFIG_HOME point into the temp directory, the system config is off, GIT_*
 * variables are removed and GIT_CEILING_DIRECTORIES stops discovery above the temp root. The
 * repository's own git state is only read (loadBuildInput on the fixtures).
 */
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { listMethodologyVersions } from '@gai/schema'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  compareTrees,
  loadBuildInput,
  readCorrectionCommits,
  readGitInfo,
  readSnapshots,
  UnsafeOutputError,
  writeOutput,
} from './io.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const FIXTURES = join(REPO_ROOT, 'fixtures')

let tmp: string

beforeEach(() => {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'gai-io-test-')))
})

afterEach(() => {
  vi.unstubAllEnvs()
  rmSync(tmp, { recursive: true, force: true })
})

/** Every file under `dir` (POSIX paths, sorted) with its text. */
function tree(dir: string): Record<string, string> {
  const out: Record<string, string> = {}
  const walk = (rel: string) => {
    for (const e of readdirSync(join(dir, rel), { withFileTypes: true })) {
      const p = rel === '' ? e.name : `${rel}/${e.name}`
      if (e.isDirectory()) walk(p)
      else out[p] = readFileSync(join(dir, p), 'utf8')
    }
  }
  walk('')
  return out
}

const files = (entries: Record<string, string | Uint8Array>) => new Map(Object.entries(entries))

// ---------------------------------------------------------------------------------------------

describe('writeOutput', () => {
  it('writes a new tree, creating the output directory and its parents', () => {
    const out = join(tmp, 'public/api/v1')
    writeOutput(
      out,
      files({
        'manifest.json': '{}\n',
        'countries/DEU.json': '{"name":"Deutschland – Allemagne"}\n',
        'dumps/raw.bin': Uint8Array.from([0, 255, 10, 13]),
      }),
    )
    expect(tree(out)).toEqual({
      'countries/DEU.json': '{"name":"Deutschland – Allemagne"}\n',
      'dumps/raw.bin': Buffer.from([0, 255, 10, 13]).toString('utf8'),
      'manifest.json': '{}\n',
    })
    expect([...readFileSync(join(out, 'dumps/raw.bin'))]).toEqual([0, 255, 10, 13])
    // Text is UTF-8: the en dash is three bytes.
    expect(readFileSync(join(out, 'countries/DEU.json')).length).toBe(37)
    expect(readdirSync(join(tmp, 'public/api')).sort()).toEqual(['v1'])
  })

  it('replaces a previous build (manifest.json present): no file of the old tree survives', () => {
    const out = join(tmp, 'v1')
    writeOutput(out, files({ 'manifest.json': 'old\n', 'scores/2026-09-26.json': 'x\n' }))
    writeOutput(out, files({ 'manifest.json': 'new\n', 'scores/2026-09-27.json': 'y\n' }))
    expect(tree(out)).toEqual({ 'manifest.json': 'new\n', 'scores/2026-09-27.json': 'y\n' })
    expect(readdirSync(tmp).sort()).toEqual(['v1'])
  })

  it('accepts an existing empty directory', () => {
    const out = join(tmp, 'v1')
    mkdirSync(out)
    writeOutput(out, files({ 'manifest.json': '{}\n' }))
    expect(tree(out)).toEqual({ 'manifest.json': '{}\n' })
  })

  it('refuses a non-empty directory without manifest.json and leaves it untouched', () => {
    const out = join(tmp, 'v1')
    mkdirSync(join(out, 'notes'), { recursive: true })
    writeFileSync(join(out, 'notes/keep.md'), 'mine\n')
    expect(() => writeOutput(out, files({ 'manifest.json': '{}\n' }))).toThrow(UnsafeOutputError)
    expect(() => writeOutput(out, files({ 'manifest.json': '{}\n' }))).toThrow(
      /is not empty and has no manifest\.json/,
    )
    expect(tree(out)).toEqual({ 'notes/keep.md': 'mine\n' })
    expect(existsSync(`${out}.building`)).toBe(false)
  })

  it('refuses a directory whose manifest.json is a directory, not a file', () => {
    const out = join(tmp, 'v1')
    mkdirSync(join(out, 'manifest.json'), { recursive: true })
    expect(() => writeOutput(out, files({ 'manifest.json': '{}\n' }))).toThrow(UnsafeOutputError)
  })

  it('removes a stale .building directory left by an interrupted build', () => {
    const out = join(tmp, 'v1')
    mkdirSync(join(`${out}.building`, 'countries'), { recursive: true })
    writeFileSync(join(`${out}.building`, 'countries/OLD.json'), 'stale\n')
    writeFileSync(join(`${out}.building`, 'manifest.json'), 'stale\n')
    mkdirSync(`${out}.previous`)
    writeFileSync(join(`${out}.previous`, 'manifest.json'), 'stale\n')
    writeOutput(out, files({ 'manifest.json': '{}\n', 'a.json': '1\n' }))
    expect(tree(out)).toEqual({ 'a.json': '1\n', 'manifest.json': '{}\n' })
    expect(readdirSync(tmp).sort()).toEqual(['v1'])
  })

  it('refuses a symbolic link or a file as the output directory', () => {
    const target = join(tmp, 'elsewhere')
    mkdirSync(target)
    writeFileSync(join(target, 'manifest.json'), '{}\n')
    const link = join(tmp, 'v1')
    symlinkSync(target, link)
    expect(() => writeOutput(link, files({ 'manifest.json': '{}\n' }))).toThrow(
      /is a symbolic link/,
    )
    expect(tree(target)).toEqual({ 'manifest.json': '{}\n' })
    const file = join(tmp, 'file')
    writeFileSync(file, 'x')
    expect(() => writeOutput(file, files({ 'manifest.json': '{}\n' }))).toThrow(
      /is not a directory/,
    )
  })

  it('refuses paths that are not plain relative POSIX paths, before writing anything', () => {
    const out = join(tmp, 'v1')
    for (const bad of ['../escape.json', '/abs.json', 'a//b.json', './a.json', 'a\\b.json', '']) {
      expect(() => writeOutput(out, files({ 'manifest.json': '{}\n', [bad]: 'x' }))).toThrow(
        /is not a plain relative path/,
      )
    }
    expect(existsSync(out)).toBe(false)
    expect(existsSync(`${out}.building`)).toBe(false)
    expect(existsSync(join(tmp, 'escape.json'))).toBe(false)
  })

  it('refuses a build without manifest.json (the next build could not replace it)', () => {
    const out = join(tmp, 'v1')
    expect(() => writeOutput(out, files({ 'countries.json': '{}\n' }))).toThrow(
      /has no manifest\.json/,
    )
    expect(existsSync(out)).toBe(false)
  })

  it('keeps the previous build when writing the new one fails', () => {
    const out = join(tmp, 'v1')
    writeOutput(out, files({ 'manifest.json': 'old\n' }))
    // `a` is both a file and a directory: the second write fails.
    expect(() =>
      writeOutput(out, files({ 'manifest.json': 'new\n', a: '1', 'a/b': '2' })),
    ).toThrow()
    expect(tree(out)).toEqual({ 'manifest.json': 'old\n' })
    expect(readdirSync(tmp).sort()).toEqual(['v1'])
  })
})

// ---------------------------------------------------------------------------------------------

describe('readSnapshots', () => {
  it('returns every regular file under data/snapshots, sorted, except the placeholders', () => {
    const base = join(tmp, 'data/snapshots')
    mkdirSync(join(base, 'v1.0.0/countries'), { recursive: true })
    mkdirSync(join(base, 'v0.9.0'), { recursive: true })
    writeFileSync(join(base, '.gitkeep'), '')
    writeFileSync(join(base, 'README.md'), '# Snapshots\n')
    writeFileSync(join(base, '.DS_Store'), 'x')
    writeFileSync(join(base, 'v1.0.0/countries.json'), '{"a":1}\n')
    writeFileSync(join(base, 'v1.0.0/countries/DEU.json'), '{}\n')
    writeFileSync(join(base, 'v1.0.0/README.md'), 'kept: not at the top level\n')
    writeFileSync(join(base, 'v1.0.0/.gitkeep'), '')
    writeFileSync(join(base, 'v0.9.0/Z.bin'), Uint8Array.from([1, 2, 3]))
    symlinkSync(join(base, 'v1.0.0/countries.json'), join(base, 'v1.0.0/link.json'))
    const snaps = readSnapshots(tmp)
    expect(snaps.map((s) => s.path)).toEqual([
      'v0.9.0/Z.bin',
      'v1.0.0/README.md',
      'v1.0.0/countries.json',
      'v1.0.0/countries/DEU.json',
    ])
    expect([...(snaps[0]?.bytes ?? [])]).toEqual([1, 2, 3])
    expect(Buffer.from(snaps[2]?.bytes ?? []).toString('utf8')).toBe('{"a":1}\n')
    expect(snaps[0]?.bytes).toBeInstanceOf(Uint8Array)
  })

  it('returns [] without data/snapshots, and for the fixtures (only .gitkeep)', () => {
    expect(readSnapshots(tmp)).toEqual([])
    expect(readSnapshots(FIXTURES)).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------

describe('compareTrees', () => {
  const make = (dir: string, entries: Record<string, string>) => {
    for (const [p, text] of Object.entries(entries)) {
      mkdirSync(dirname(join(dir, p)), { recursive: true })
      writeFileSync(join(dir, p), text)
    }
  }

  it('counts files and bytes of identical trees', () => {
    const a = join(tmp, 'a')
    const b = join(tmp, 'b')
    make(a, { 'manifest.json': '{}\n', 'countries/DEU.json': 'é\n' })
    make(b, { 'manifest.json': '{}\n', 'countries/DEU.json': 'é\n' })
    // 3 bytes + 3 bytes (é is two bytes in UTF-8).
    expect(compareTrees(a, b)).toEqual({ files: 2, bytes: 6, differences: [] })
  })

  it('lists content differences and files present on one side only, by path', () => {
    const a = join(tmp, 'a')
    const b = join(tmp, 'b')
    make(a, { 'z.json': '1\n', 'm/x.json': 'same\n', 'only-a.csv': 'a\n', 'c.json': 'A\n' })
    make(b, { 'z.json': '2\n', 'm/x.json': 'same\n', 'b-only.md': 'b\n', 'c.json': 'A\n' })
    symlinkSync(join(b, 'z.json'), join(b, 'link.json'))
    expect(compareTrees(a, b)).toEqual({
      files: 4,
      bytes: 2 + 5 + 2 + 2,
      differences: [
        { path: 'b-only.md', kind: 'only-in-b' },
        { path: 'link.json', kind: 'not-a-file' },
        { path: 'only-a.csv', kind: 'only-in-a' },
        { path: 'z.json', kind: 'content' },
      ],
    })
  })
})

// ---------------------------------------------------------------------------------------------
// Git

/** Runs git with a fixed identity and no signing, in `cwd`. */
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

function isolateGit(root: string): void {
  const home = join(root, 'home')
  mkdirSync(home, { recursive: true })
  for (const name of Object.keys(process.env)) {
    if (name.startsWith('GIT_')) vi.stubEnv(name, undefined)
  }
  vi.stubEnv('HOME', home)
  vi.stubEnv('XDG_CONFIG_HOME', home)
  vi.stubEnv('GIT_CONFIG_NOSYSTEM', '1')
  vi.stubEnv('GIT_CEILING_DIRECTORIES', root)
}

function initRepo(dir: string): void {
  mkdirSync(dir, { recursive: true })
  git(dir, ['init', '-q'])
  git(dir, ['symbolic-ref', 'HEAD', 'refs/heads/main'])
}

function commitAll(dir: string, message: string): string {
  git(dir, ['add', '-A'])
  git(dir, ['commit', '-q', '-m', message])
  return git(dir, ['rev-parse', 'HEAD'])
}

const entry = (id: string, reason: string) =>
  `- id: ${id}
  date: 2026-01-01
  event: evt_2025_08_08_DEU_A6
  kind: correction
  flagged_by: author
  before: {points: 10}
  after: {points: 5}
  reason: ${reason}
`

const HEADER = '# Synthetic corrections log for a test.\n'

/** Each test spawns up to a few dozen git processes; allow for a slow CI machine. */
const SLOW = { timeout: 30_000 }

describe('readCorrectionCommits', SLOW, () => {
  let repo: string
  beforeEach(() => {
    isolateGit(tmp)
    repo = join(tmp, 'repo')
  })

  it('maps each id to the first commit whose added lines declare it; uncommitted ids to null', () => {
    initRepo(repo)
    const file = join(repo, 'data/corrections.yaml')
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, HEADER + entry('cor_20260101_1', 'First.'))
    const c1 = commitAll(repo, 'First correction')
    // The second commit adds an entry, edits the first one's reason and mentions its id in a
    // comment: none of this moves the first entry's commit.
    writeFileSync(
      file,
      `${HEADER}# Follows cor_20260101_1.\n${entry('cor_20260101_1', 'First, reworded.')}${entry('cor_20260102_1', 'Second.')}`,
    )
    const c2 = commitAll(repo, 'Second correction')
    // An entry added on a branch and merged: the branch commit added it.
    git(repo, ['checkout', '-q', '-b', 'feature'])
    writeFileSync(file, `${readFileSync(file, 'utf8')}${entry('cor_20260103_1', 'Third.')}`)
    const c3 = commitAll(repo, 'Third correction, on a branch')
    git(repo, ['checkout', '-q', 'main'])
    writeFileSync(join(repo, 'other.txt'), 'unrelated\n')
    commitAll(repo, 'Unrelated change on main')
    git(repo, ['merge', '-q', '--no-ff', '-m', 'Merge feature', 'feature'])
    // Not committed yet; a flow-mapping entry too.
    writeFileSync(
      file,
      `${readFileSync(file, 'utf8')}${entry('cor_20260104_1', 'Fourth.')}- {id: cor_20260105_1, date: 2026-01-05}\n`,
    )

    const { commits, note } = readCorrectionCommits(repo, 'data/corrections.yaml')
    expect(note).toBeNull()
    expect(Object.fromEntries(commits)).toEqual({
      cor_20260101_1: c1,
      cor_20260102_1: c2,
      cor_20260103_1: c3,
      cor_20260104_1: null,
      cor_20260105_1: null,
    })
    expect(c1).toMatch(/^[0-9a-f]{40}$/)
    expect(new Set([c1, c2, c3]).size).toBe(3)
  })

  it('reads a corrections file below a dataset prefix (e.g. fixtures/)', () => {
    initRepo(repo)
    const file = join(repo, 'fixtures/data/corrections.yaml')
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, HEADER + entry('cor_20260927_1', 'Fixture.'))
    const c1 = commitAll(repo, 'Fixture correction')
    // A correction of the other data root does not count for this one.
    mkdirSync(join(repo, 'data'))
    writeFileSync(join(repo, 'data/corrections.yaml'), HEADER + entry('cor_20260928_1', 'Real.'))
    commitAll(repo, 'Real correction')
    const { commits, note } = readCorrectionCommits(repo, 'fixtures/data/corrections.yaml')
    expect(note).toBeNull()
    expect(Object.fromEntries(commits)).toEqual({ cor_20260927_1: c1 })
  })

  it('gives null for every id in a repository without a commit', () => {
    initRepo(repo)
    mkdirSync(join(repo, 'data'))
    writeFileSync(join(repo, 'data/corrections.yaml'), HEADER + entry('cor_20260101_1', 'First.'))
    const { commits, note } = readCorrectionCommits(repo, 'data/corrections.yaml')
    expect(note).toBeNull()
    expect(Object.fromEntries(commits)).toEqual({ cor_20260101_1: null })
  })

  it('returns no commits and a note in a shallow clone', () => {
    initRepo(repo)
    mkdirSync(join(repo, 'data'))
    writeFileSync(join(repo, 'data/corrections.yaml'), HEADER + entry('cor_20260101_1', 'First.'))
    commitAll(repo, 'First')
    writeFileSync(join(repo, 'other.txt'), 'x\n')
    commitAll(repo, 'Second')
    const shallow = join(tmp, 'shallow')
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${repo}`, shallow], {
      stdio: 'ignore',
    })
    const { commits, note } = readCorrectionCommits(shallow, 'data/corrections.yaml')
    expect(commits.size).toBe(0)
    expect(note).toBe(
      'Correction commits are unknown: the clone is shallow; fetch the full history (fetch-depth: 0).',
    )
  })

  it('returns no commits and a note outside a git work tree, or for a file outside it', () => {
    const plain = join(tmp, 'plain')
    mkdirSync(join(plain, 'data'), { recursive: true })
    writeFileSync(join(plain, 'data/corrections.yaml'), HEADER + entry('cor_20260101_1', 'First.'))
    const outside = readCorrectionCommits(plain, 'data/corrections.yaml')
    expect(outside.commits.size).toBe(0)
    expect(outside.note).toBe(
      'Correction commits are unknown: the build did not run in a git work tree.',
    )
    initRepo(repo)
    const away = readCorrectionCommits(repo, join(plain, 'data/corrections.yaml'))
    expect(away.commits.size).toBe(0)
    expect(away.note).toBe(
      'Correction commits are unknown: the corrections log is outside the repository.',
    )
  })
})

describe('readGitInfo', SLOW, () => {
  let repo: string
  beforeEach(() => {
    isolateGit(tmp)
    repo = join(tmp, 'repo')
  })

  it('is {sha: null, dirty: null} outside a git work tree and before the first commit', () => {
    mkdirSync(join(tmp, 'plain'))
    expect(readGitInfo(join(tmp, 'plain'), ['data'])).toEqual({ sha: null, dirty: null })
    initRepo(repo)
    expect(readGitInfo(repo, ['data'])).toEqual({ sha: null, dirty: null })
  })

  it('reports HEAD, and dirty only for changes under the input paths', () => {
    initRepo(repo)
    mkdirSync(join(repo, 'data/events'), { recursive: true })
    mkdirSync(join(repo, 'methodology'))
    mkdirSync(join(repo, 'apps'))
    writeFileSync(join(repo, 'data/events/DEU.yaml'), '[]\n')
    writeFileSync(join(repo, 'methodology/CHANGELOG.md'), '# Changelog\n')
    writeFileSync(join(repo, 'apps/page.tsx'), 'x\n')
    const head = commitAll(repo, 'Inputs')
    const inputs = ['data', 'methodology', 'archive']
    expect(readGitInfo(repo, inputs)).toEqual({ sha: head, dirty: false })
    // A change outside the inputs.
    writeFileSync(join(repo, 'apps/page.tsx'), 'y\n')
    expect(readGitInfo(repo, inputs)).toEqual({ sha: head, dirty: false })
    // An untracked file under an input.
    writeFileSync(join(repo, 'data/events/FRA.yaml'), '[]\n')
    expect(readGitInfo(repo, inputs)).toEqual({ sha: head, dirty: true })
    rmSync(join(repo, 'data/events/FRA.yaml'))
    expect(readGitInfo(repo, inputs)).toEqual({ sha: head, dirty: false })
    // A modified tracked file under an input, given as an absolute path.
    writeFileSync(join(repo, 'methodology/CHANGELOG.md'), '# Changelog\n\nEdited.\n')
    expect(readGitInfo(repo, [join(repo, 'methodology')])).toEqual({ sha: head, dirty: true })
    expect(readGitInfo(repo, ['data'])).toEqual({ sha: head, dirty: false })
  })

  it('does not know whether inputs outside the repository changed', () => {
    initRepo(repo)
    writeFileSync(join(repo, 'a.txt'), 'a\n')
    const head = commitAll(repo, 'A')
    expect(readGitInfo(repo, ['a.txt', join(tmp, 'elsewhere/data')])).toEqual({
      sha: head,
      dirty: null,
    })
  })
})

// ---------------------------------------------------------------------------------------------

describe('loadBuildInput', () => {
  it('reads the fixtures with the current methodology and the repository git state', () => {
    const input = loadBuildInput({
      repoRoot: REPO_ROOT,
      datasetRoot: FIXTURES,
      date: '2026-09-27',
      siteUrl: 'https://example.org',
    })
    const folders = listMethodologyVersions(REPO_ROOT)
    expect(input.methodology.folder).toBe(`methodology/${folders.at(-1)}`)
    expect(input.older.map((m) => m.folder)).toEqual(
      folders.slice(0, -1).map((f) => `methodology/${f}`),
    )
    expect(input.dataset.root).toBe(realpathSync(FIXTURES))
    expect(input.dataset.events.map((e) => e.value.id)).toEqual(['evt_2025_08_08_DEU_A6'])
    expect(input.changelog).toBe(readFileSync(join(REPO_ROOT, 'methodology/CHANGELOG.md'), 'utf8'))
    expect(input.snapshots).toEqual([])
    expect(input.date).toBe('2026-09-27')
    expect(input.siteUrl).toBe('https://example.org')
    expect(input.git.sha === null || /^[0-9a-f]{40}$/.test(input.git.sha)).toBe(true)
    if (input.historyNote === null) {
      // The fixture's correction is committed in this repository.
      expect(input.correctionCommits.get('cor_20260927_1')).toMatch(/^[0-9a-f]{40}$/)
    } else {
      expect(input.correctionCommits.size).toBe(0)
    }
  })

  it('reads a dataset outside the repository, with unknown history and dirtiness', () => {
    const root = join(tmp, 'dataset')
    cpSync(FIXTURES, root, { recursive: true })
    const input = loadBuildInput({
      repoRoot: REPO_ROOT,
      datasetRoot: root,
      date: '2026-09-27',
      siteUrl: 'https://example.org',
    })
    expect(input.dataset.events).toHaveLength(1)
    expect(input.git.dirty).toBeNull()
    expect(input.correctionCommits.size).toBe(0)
    expect(input.historyNote).toBe(
      'Correction commits are unknown: the corrections log is outside the repository.',
    )
  })
})
