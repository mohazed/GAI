/**
 * The file system and git side of build-data (docs/04 §2 steps 1 and 6): everything the pure
 * build (`buildData` in ./index.ts) needs is read here into a `BuildInput`, and its output is
 * written here. No other module of the build touches the disk, the clock or git (D-25).
 *
 * - Inputs: the dataset (`loadDataset`), every methodology version folder (the newest is current,
 *   the others are served as superseded, docs/02 §11), methodology/CHANGELOG.md, the frozen
 *   snapshots of data/snapshots/, the git HEAD and whether the inputs have uncommitted changes
 *   (git-ignored files under the dataset and methodology count: the build reads them), and the
 *   mainline commit that brought each corrections-log entry (docs/03 §8: the previous version of
 *   the event is at that commit's first parent, under the merge-commit strategy of PROMPTS.md).
 * - Output: a safe replace of the output directory. Only a previous build is ever removed: a
 *   directory whose manifest.json carries build-data's `generator` (manifest.ts), or a leftover
 *   `{out}.building` / `{out}.previous` that is empty or holds such a manifest; anything else is
 *   refused and left in place. The new tree is written beside the old one in `{out}.building`,
 *   manifest.json first, and swapped in only once complete, so a failed build leaves the previous
 *   one in place.
 * - `compareTrees` is the byte comparison of `pnpm build:data:check` (docs/04 §2 step 7).
 */
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, isAbsolute, join, posix, relative, resolve, sep } from 'node:path'
import { listMethodologyVersions, loadDataset, loadMethodology, loadReviewers } from '@gai/schema'
import { GENERATOR } from './manifest.js'
import type { BuildInput, GitInfo, SnapshotFile } from './types.js'

export interface LoadOptions {
  /** The repository root (methodology/, packages/, the git work tree). */
  repoRoot: string
  /** The dataset root holding data/ and archive/: the repository root, or e.g. fixtures/. */
  datasetRoot: string
}

const real = (p: string): string => (existsSync(p) ? realpathSync(p) : p)

/** A commit id the API accepts (api.ts `GitSha`: 40 hex digits). */
const SHA_RE = /^[0-9a-f]{40}$/

/**
 * Code files whose uncommitted changes make a build `dirty` (api.ts `ApiGitInfo`). Git-ignored
 * files here do not count: node_modules, dist, .turbo and *.tsbuildinfo live here and do not
 * change the output.
 */
export const CODE_INPUT_PATHS: readonly string[] = [
  'packages/schema',
  'packages/scoring',
  'packages/pipeline',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
]

/**
 * Output of a git command, trimmed (unless `trim` is false: NUL-separated output, whose first
 * path may begin with a space); null when git is missing or the command fails.
 */
function tryGit(cwd: string, args: readonly string[], trim = true): string | null {
  try {
    const out = execFileSync('git', ['--no-optional-locks', ...args], {
      cwd,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    return trim ? out.trim() : out
  } catch {
    return null
  }
}

/** `path` (absolute, or relative to `root`) relative to `root` in POSIX form; null when outside. */
function insideRoot(root: string, path: string): string | null {
  const rel = relative(resolve(root), resolve(root, path))
  if (rel === '') return '.'
  if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) return null
  return rel.split(sep).join('/')
}

/** The name the loader and readSnapshots skip: ignored by git, it never makes a build dirty. */
const SKIPPED_EVERYWHERE = '.DS_Store'

/**
 * HEAD of the repository at `repoRoot`, and whether the inputs hold uncommitted changes:
 * modified, staged, deleted or untracked files (`git status`) under `inputPaths` and `dataPaths`,
 * and, under `dataPaths` only, git-ignored files too (`git ls-files --others --ignored
 * --exclude-standard`; `.DS_Store` excepted). `dataPaths` are the inputs the build reads file by
 * file (the dataset and methodology), where an ignored file (a `*.log`, say) still changes the
 * output, so that a clean clone at the same commit would not rebuild the same bytes (D-25). Paths
 * are relative to `repoRoot`, or absolute.
 *
 * `{sha: null, dirty: null}` outside a git work tree, without a commit, or without git;
 * `dirty: null` when an input lies outside the repository or a git command fails. A SHA-256
 * repository's ids do not fit the API (40 hex digits): the sha is then null too.
 */
export function readGitInfo(
  repoRoot: string,
  inputPaths: readonly string[],
  dataPaths: readonly string[] = [],
): GitInfo {
  const sha = tryGit(repoRoot, ['rev-parse', '--verify', '--quiet', 'HEAD^{commit}'])
  if (sha === null || !SHA_RE.test(sha)) return { sha: null, dirty: null }
  const inRepo = (list: readonly string[]): string[] | null => {
    const out: string[] = []
    for (const p of list) {
      const rel = insideRoot(repoRoot, p)
      if (rel === null) return null
      out.push(rel)
    }
    return out
  }
  const code = inRepo(inputPaths)
  const data = inRepo(dataPaths)
  if (code === null || data === null) return { sha, dirty: null }
  if (code.length + data.length === 0) return { sha, dirty: false }
  const status = tryGit(repoRoot, [
    'status',
    '--porcelain',
    '--untracked-files=all',
    '--',
    ...code,
    ...data,
  ])
  if (status === null) return { sha, dirty: null }
  if (status !== '' || data.length === 0) return { sha, dirty: status !== '' }
  // `--ignored=matching` would need git 2.16; this form lists every ignored file one by one,
  // files inside an ignored directory included.
  const ignored = tryGit(
    repoRoot,
    ['ls-files', '-z', '--others', '--ignored', '--exclude-standard', '--', ...data],
    false,
  )
  if (ignored === null) return { sha, dirty: null }
  const counted = ignored
    .split('\0')
    .filter((p) => p !== '' && posix.basename(p) !== SKIPPED_EVERYWHERE)
  return { sha, dirty: counted.length > 0 }
}

/** `id: cor_…` as written in data/corrections.yaml (block or flow mapping). */
const CORRECTION_ID_RE = /(?:^|[\s{,-])id:\s*["']?(cor_\d{8}_[1-9]\d*)\b/
/** Line prefix `git log --format` gives each commit (U+0001 never starts a diff line). */
const COMMIT_MARK = '\u0001'

/**
 * The mainline commit that brought each corrections-log entry onto the built branch: one
 * `git log --first-parent -m` pass over the file's history along the first-parent chain of HEAD
 * (direct commits and the merge commits of pull requests), oldest first, reading the added lines
 * of each commit's diff against its first parent; the first commit whose added lines declare
 * `id: cor_…` is the one that brought the entry. Ids present in the working-tree file but in no
 * commit map to null (not committed yet).
 *
 * Why the mainline commit (docs/03 §8, api.ts `ApiCorrection.commit`): the validation rule
 * `correction.required-on-edit` makes a pull request bring an event's edit together with its log
 * entry, and pull requests are merged with a merge commit (PROMPTS.md), so the previous version of
 * the event is at the first parent of that merge commit, whatever the order of the commits on the
 * branch (the branch commit that appended the entry may come after the one that edited the event).
 * The guarantee rests on that strategy: after a rebase-merge, or a direct push of several commits
 * that puts the edit and the entry in separate commits, the first parent may already hold the
 * corrected event.
 *
 * `correctionsFile` is relative to `repoRoot` (e.g. `data/corrections.yaml`, or
 * `fixtures/data/corrections.yaml`). Without git, outside a work tree, for a file outside the
 * repository, or in a shallow clone (history cut, so the first commit seen may not be the one that
 * added the entry), the map is empty and `note` says why, for the build notes.
 */
export function readCorrectionCommits(
  repoRoot: string,
  correctionsFile: string,
): { commits: Map<string, string | null>; note: string | null } {
  const commits = new Map<string, string | null>()
  const unknown = (why: string) => ({
    commits,
    note: `Correction commits are unknown: ${why}.`,
  })
  const file = insideRoot(repoRoot, correctionsFile)
  // No path in the note: it is published in build-notes.json.
  if (file === null) return unknown('the corrections log is outside the repository')
  if (tryGit(repoRoot, ['rev-parse', '--is-inside-work-tree']) !== 'true') {
    return unknown('the build did not run in a git work tree')
  }
  const shallow = tryGit(repoRoot, ['rev-parse', '--is-shallow-repository'])
  if (shallow === null) return unknown('git cannot tell whether the clone is shallow')
  if (shallow === 'true') {
    return unknown('the clone is shallow; fetch the full history (fetch-depth: 0)')
  }
  const log = tryGit(repoRoot, [
    '-c',
    'core.quotePath=false',
    'log',
    '--first-parent',
    '-m',
    '--topo-order',
    '--reverse',
    '--no-color',
    '--no-ext-diff',
    '--no-textconv',
    '--no-renames',
    `--format=${COMMIT_MARK}%H`,
    '-p',
    '--unified=0',
    '--',
    file,
  ])
  if (log === null) {
    // No commit yet (HEAD unborn) is the only expected failure: nothing is committed.
    if (tryGit(repoRoot, ['rev-parse', '--verify', '--quiet', 'HEAD^{commit}']) !== null) {
      return unknown('git log failed')
    }
  }
  let commit: string | null = null
  let inHunk = false
  for (const line of (log ?? '').split('\n')) {
    if (line.startsWith(COMMIT_MARK)) {
      const sha = line.slice(1).trim()
      commit = SHA_RE.test(sha) ? sha : null
      inHunk = false
    } else if (line.startsWith('diff ')) {
      inHunk = false
    } else if (line.startsWith('@@')) {
      inHunk = true
    } else if (inHunk && commit !== null && line.startsWith('+')) {
      const id = CORRECTION_ID_RE.exec(line.slice(1))?.[1]
      if (id !== undefined && !commits.has(id)) commits.set(id, commit)
    }
  }
  const current = join(repoRoot, file)
  if (existsSync(current) && lstatSync(current).isFile()) {
    for (const line of readFileSync(current, 'utf8').split(/\r?\n/)) {
      const id = CORRECTION_ID_RE.exec(line)?.[1]
      if (id !== undefined && !commits.has(id)) commits.set(id, null)
    }
  }
  return { commits, note: null }
}

/** Files of data/snapshots/ that are not snapshot content. */
const SNAPSHOT_SKIP_ANYWHERE = new Set(['.gitkeep', '.DS_Store'])
const SNAPSHOT_SKIP_TOP = new Set(['README.md'])

const compareCodeUnits = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

/**
 * Every regular file under `{datasetRoot}/data/snapshots/` (frozen outputs of superseded
 * methodology versions, docs/02 §11), by path in code-unit order, paths relative to
 * data/snapshots/ in POSIX form. Skipped: `.gitkeep` and `.DS_Store` anywhere, `README.md` at the
 * top level, and symbolic links (never followed; the loader reports them as errors).
 */
export function readSnapshots(datasetRoot: string): SnapshotFile[] {
  const base = join(datasetRoot, 'data', 'snapshots')
  const out: SnapshotFile[] = []
  let top: ReturnType<typeof lstatSync>
  try {
    top = lstatSync(base)
  } catch {
    return out
  }
  if (!top.isDirectory()) return out
  const walk = (rel: string) => {
    for (const entry of readdirSync(join(base, rel), { withFileTypes: true })) {
      const path = rel === '' ? entry.name : posix.join(rel, entry.name)
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) walk(path)
      else if (entry.isFile()) {
        if (SNAPSHOT_SKIP_ANYWHERE.has(entry.name)) continue
        if (rel === '' && SNAPSHOT_SKIP_TOP.has(entry.name)) continue
        out.push({ path, bytes: Uint8Array.from(readFileSync(join(base, path))) })
      }
    }
  }
  walk('')
  return out.sort((a, b) => compareCodeUnits(a.path, b.path))
}

/**
 * Everything `buildData` reads, from disk and git: the dataset at `datasetRoot`, the newest
 * methodology folder as current and the older ones (oldest first) as superseded, the methodology
 * changelog, the snapshots, the git state of the inputs (dataset, methodology, the build's code;
 * git-ignored files count under the dataset and methodology) and the corrections' commits. Load
 * issues are left in `dataset.issues` and `methodology.issues` for the caller. Throws when there is
 * no methodology version folder.
 */
export function loadBuildInput(opts: LoadOptions & { date: string; siteUrl: string }): BuildInput {
  const repoRoot = real(opts.repoRoot)
  const datasetRoot = real(opts.datasetRoot)
  const folders = listMethodologyVersions(repoRoot)
  const current = folders.at(-1)
  if (current === undefined) {
    throw new Error(`no methodology version folder (methodology/vX.Y.Z) under ${repoRoot}`)
  }
  const dataset = loadDataset(datasetRoot)
  const methodology = loadMethodology(repoRoot, current)
  const older = folders.slice(0, -1).map((f) => loadMethodology(repoRoot, f))
  const changelogFile = join(repoRoot, 'methodology', 'CHANGELOG.md')
  const changelog = existsSync(changelogFile) ? readFileSync(changelogFile, 'utf8') : null
  const reviewers = loadReviewers(repoRoot)
  if (reviewers.value === null) {
    throw new Error(
      `methodology/reviewers.yaml does not match its schema (run pnpm validate): ${reviewers.issues.map((i) => i.message).join('; ')}`,
    )
  }

  const prefix = insideRoot(repoRoot, datasetRoot)
  const datasetPath = (p: string) =>
    prefix === null ? join(datasetRoot, p) : prefix === '.' ? p : `${prefix}/${p}`
  const git = readGitInfo(repoRoot, CODE_INPUT_PATHS, [
    datasetPath('data'),
    datasetPath('archive'),
    'methodology',
  ])
  const history = readCorrectionCommits(repoRoot, datasetPath('data/corrections.yaml'))
  return {
    dataset,
    methodology,
    older,
    changelog,
    reviewers: reviewers.value.reviewers,
    snapshots: readSnapshots(datasetRoot),
    date: opts.date,
    siteUrl: opts.siteUrl,
    git,
    correctionCommits: history.commits,
    historyNote: history.note,
  }
}

/** The output directory is not one build-data may replace. */
export class UnsafeOutputError extends Error {
  override name = 'UnsafeOutputError'
}

/** The file every build writes; its `generator` marks a directory as a previous build. */
export const MANIFEST_FILE = 'manifest.json'

/**
 * What `dir`'s manifest.json says about the directory: `absent` when there is no regular file of
 * that name (a symbolic link is not followed), `build` when it parses as a JSON object whose
 * `generator` is build-data's (manifest.ts `GENERATOR`), `foreign` otherwise (a web app manifest,
 * a truncated or unreadable file). Only `generator` is read, not the whole `ApiManifestFile`, so
 * that a build of a later API version still replaces an older one.
 */
function manifestKind(dir: string): 'absent' | 'foreign' | 'build' {
  const file = join(dir, MANIFEST_FILE)
  try {
    if (!lstatSync(file).isFile()) return 'absent'
  } catch {
    return 'absent'
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'))
    const isObject = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    return isObject && (parsed as { generator?: unknown }).generator === GENERATOR
      ? 'build'
      : 'foreign'
  } catch {
    return 'foreign'
  }
}

/**
 * Whether `path`, a `{out}.building` or `{out}.previous` sibling, exists; throws
 * `UnsafeOutputError` when it does and is not a leftover of a build: only an empty directory, or
 * one holding build-data's manifest.json, is (the staging loop writes manifest.json first, so an
 * interrupted build's staging directory is one or the other). A symbolic link, a file or any other
 * directory is not the build's to remove.
 */
function leftoverExists(path: string): boolean {
  let stat: ReturnType<typeof lstatSync>
  try {
    stat = lstatSync(path)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw err
  }
  const leftover =
    !stat.isSymbolicLink() &&
    stat.isDirectory() &&
    (readdirSync(path).length === 0 || manifestKind(path) === 'build')
  if (!leftover) {
    throw new UnsafeOutputError(
      `${path} is not a leftover build; remove it or choose another --out`,
    )
  }
  return true
}

/** Throws unless `path` is a plain relative POSIX path (no `..`, `.`, empty segment or `\`). */
function checkOutputPath(path: string): void {
  const bad =
    path === '' ||
    path.startsWith('/') ||
    path.includes('\\') ||
    path.includes('\0') ||
    /^[A-Za-z]:/.test(path) ||
    path.split('/').some((s) => s === '' || s === '.' || s === '..')
  if (bad)
    throw new UnsafeOutputError(`output path ${JSON.stringify(path)} is not a plain relative path`)
}

/**
 * Writes the build into `outDir`, replacing a previous build:
 * 1. refuses (throws `UnsafeOutputError`), before touching the disk, when a file path is not plain
 *    relative POSIX, when the files hold no manifest.json (the next build could not replace them),
 *    when `outDir` is a symbolic link or not a directory, when it is a non-empty directory whose
 *    manifest.json is missing or is not build-data's (no `generator` "@gai/pipeline build-data":
 *    not a previous build, never removed), or when `{outDir}.building` or `{outDir}.previous`
 *    exists and is not a leftover of a build (an empty directory, or one holding build-data's
 *    manifest.json);
 * 2. writes every file into `{outDir}.building` (a leftover one is removed first), manifest.json
 *    first so that the staging directory of an interrupted build is always recognised as a
 *    leftover, then the others by path, creating parent directories; text as UTF-8, bytes as given;
 *    files are created exclusively, so nothing is written through a symbolic link; on failure the
 *    partial tree is removed and the previous build stays in place;
 * 3. moves the previous build aside to `{outDir}.previous` (a leftover one is removed first), moves
 *    the new one into place, then removes the previous one (restored if the move fails).
 */
export function writeOutput(outDir: string, files: Map<string, string | Uint8Array>): void {
  const out = resolve(outDir)
  const paths = [...files.keys()].sort(compareCodeUnits)
  for (const p of paths) checkOutputPath(p)
  if (!files.has(MANIFEST_FILE)) {
    throw new UnsafeOutputError(
      `the build has no ${MANIFEST_FILE}; without it the next build could not replace ${out}`,
    )
  }
  let existing: ReturnType<typeof lstatSync> | undefined
  try {
    existing = lstatSync(out)
  } catch {
    existing = undefined
  }
  if (existing !== undefined) {
    if (existing.isSymbolicLink()) {
      throw new UnsafeOutputError(`${out} is a symbolic link; refusing to replace it`)
    }
    if (!existing.isDirectory()) {
      throw new UnsafeOutputError(`${out} exists and is not a directory; refusing to replace it`)
    }
    if (readdirSync(out).length > 0) {
      const kind = manifestKind(out)
      if (kind === 'absent') {
        throw new UnsafeOutputError(
          `${out} is not empty and has no ${MANIFEST_FILE}: it is not a previous build, so it is not replaced; choose another --out or empty it`,
        )
      }
      if (kind === 'foreign') {
        throw new UnsafeOutputError(
          `${join(out, MANIFEST_FILE)} is not a build-data manifest (no generator ${JSON.stringify(GENERATOR)}): ${out} is not a previous build, so it is not replaced; choose another --out or empty it`,
        )
      }
    }
  }
  const building = `${out}.building`
  const previous = `${out}.previous`
  const staleBuilding = leftoverExists(building)
  const stalePrevious = leftoverExists(previous)

  mkdirSync(dirname(out), { recursive: true })
  if (staleBuilding) rmSync(building, { recursive: true, force: true })
  mkdirSync(building)
  try {
    for (const p of [MANIFEST_FILE, ...paths.filter((q) => q !== MANIFEST_FILE)]) {
      const target = join(building, ...p.split('/'))
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, files.get(p) as string | Uint8Array, { flag: 'wx' })
    }
  } catch (err) {
    rmSync(building, { recursive: true, force: true })
    throw err
  }

  if (stalePrevious) rmSync(previous, { recursive: true, force: true })
  if (existing !== undefined) renameSync(out, previous)
  try {
    renameSync(building, out)
  } catch (err) {
    if (existing !== undefined) renameSync(previous, out)
    throw err
  }
  rmSync(previous, { recursive: true, force: true })
}

export interface TreeDifference {
  /** POSIX path relative to the compared directories. */
  path: string
  kind: 'only-in-a' | 'only-in-b' | 'content' | 'not-a-file'
}

export interface TreeComparison {
  /** Regular files in `a`. */
  files: number
  /** Total bytes of the regular files in `a`. */
  bytes: number
  /** Every difference, by path in code-unit order; empty when the trees are identical. */
  differences: TreeDifference[]
}

/** Regular files (and, separately, anything else that is not a directory) under `dir`. */
function listTree(dir: string): { files: string[]; other: string[] } {
  const files: string[] = []
  const other: string[] = []
  const walk = (rel: string) => {
    for (const entry of readdirSync(join(dir, rel), { withFileTypes: true })) {
      const path = rel === '' ? entry.name : posix.join(rel, entry.name)
      if (entry.isSymbolicLink()) other.push(path)
      else if (entry.isDirectory()) walk(path)
      else if (entry.isFile()) files.push(path)
      else other.push(path)
    }
  }
  walk('')
  return { files: files.sort(compareCodeUnits), other: other.sort(compareCodeUnits) }
}

/**
 * Compares two output trees file by file, byte by byte (the determinism check, D-25). Symbolic
 * links and special files are never followed and are reported as `not-a-file`.
 */
export function compareTrees(a: string, b: string): TreeComparison {
  const ta = listTree(a)
  const tb = listTree(b)
  const inB = new Set(tb.files)
  const inA = new Set(ta.files)
  const differences: TreeDifference[] = []
  let bytes = 0
  for (const path of ta.files) {
    const ba = readFileSync(join(a, path))
    bytes += ba.length
    if (!inB.has(path)) differences.push({ path, kind: 'only-in-a' })
    else if (!ba.equals(readFileSync(join(b, path)))) differences.push({ path, kind: 'content' })
  }
  for (const path of tb.files) if (!inA.has(path)) differences.push({ path, kind: 'only-in-b' })
  for (const path of new Set([...ta.other, ...tb.other])) {
    differences.push({ path, kind: 'not-a-file' })
  }
  differences.sort((x, y) => compareCodeUnits(x.path, y.path) || compareCodeUnits(x.kind, y.kind))
  return { files: ta.files.length, bytes, differences }
}
