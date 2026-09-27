/**
 * Reads the dataset as it stood at a git ref, for the checks that compare an edit with the
 * published history (docs/03 §11: corrections required on edit; CLAUDE.md: never delete data).
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join, posix } from 'node:path'
import { Correction, Event } from '../records.js'
import type { Dataset } from './dataset.js'
import { parseYaml } from './parse.js'

export interface BaseRecord<T> {
  /**
   * The raw YAML object, for field-by-field comparison. For a file byte-identical in the working
   * tree (reused from the loaded dataset, see `loadBaseSnapshot`), the parsed record.
   */
  raw: Record<string, unknown>
  /** The parsed record when it passes today's schema. */
  value: T | null
  file: string
}

export interface BaseSnapshot {
  /** The ref as given and the commit it resolved to. */
  ref: string
  commit: string
  events: Map<string, BaseRecord<Event>>
  corrections: Map<string, BaseRecord<Correction>>
  sourceIds: Set<string>
  replyIds: Set<string>
  leadIds: Set<string>
}

function git(repoRoot: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function tryGit(repoRoot: string, args: string[]): string | null {
  try {
    return git(repoRoot, args).trim()
  } catch {
    return null
  }
}

/** The base commit and where it came from, or why none could be found. */
export type BaseResolution =
  | {
      ok: true
      /** Full commit id. */
      ref: string
      /** Human-readable origin, e.g. `merge base of HEAD and origin/main`. */
      source: string
      /** True when the base is HEAD itself: only uncommitted changes are compared. */
      head: boolean
    }
  | { ok: false; reason: string }

/** Is a comparison required rather than a local convenience (docs/03 §11: "CI refuses")? */
export function baseRequired(explicit?: string, env: NodeJS.ProcessEnv = process.env): boolean {
  return (
    explicit !== undefined ||
    !!env.GAI_VALIDATE_BASE ||
    !!env.GITHUB_BASE_REF ||
    env.GITHUB_ACTIONS === 'true'
  )
}

/**
 * The commit to compare against, in this order:
 * 1. the explicit ref (`--base`), then a non-empty `GAI_VALIDATE_BASE`;
 * 2. on a pull request (`GITHUB_BASE_REF`), the merge base of HEAD and `origin/<base>`;
 * 3. otherwise the merge base of HEAD and `origin/main`, else `main` (on main itself this is HEAD
 *    unless local commits are not on origin/main yet);
 * 4. on branch main with neither, HEAD (uncommitted changes only).
 * A branch other than main, or a detached HEAD, with no merge base is not resolved: comparing
 * HEAD with itself would pass silently while the branch's own commits go unchecked.
 */
export function resolveBase(
  repoRoot: string,
  explicit?: string,
  env: NodeJS.ProcessEnv = process.env,
): BaseResolution {
  if (tryGit(repoRoot, ['rev-parse', '--is-inside-work-tree']) !== 'true') {
    return { ok: false, reason: 'not a git work tree' }
  }
  const head = tryGit(repoRoot, ['rev-parse', '--verify', 'HEAD^{commit}'])
  if (head === null) return { ok: false, reason: 'no commit yet' }
  const found = (ref: string, source: string): BaseResolution =>
    ref === head
      ? { ok: true, ref, source: 'HEAD: uncommitted changes only', head: true }
      : { ok: true, ref, source, head: false }

  const fromEnv = env.GAI_VALIDATE_BASE
  const candidate = explicit ?? (fromEnv ? fromEnv : undefined)
  if (candidate !== undefined) {
    const label = explicit !== undefined ? `--base ${explicit}` : `GAI_VALIDATE_BASE ${fromEnv}`
    const ref = tryGit(repoRoot, ['rev-parse', '--verify', `${candidate}^{commit}`])
    if (ref === null) {
      return {
        ok: false,
        reason: `${label} is not a commit in this clone (force-pushed away, or not fetched: use fetch-depth: 0)`,
      }
    }
    return { ok: true, ref, source: label, head: ref === head }
  }

  const prBase = env.GITHUB_BASE_REF
  if (prBase) {
    const mb = tryGit(repoRoot, ['merge-base', 'HEAD', `origin/${prBase}`])
    if (mb === null) {
      return {
        ok: false,
        reason: `no merge base between HEAD and origin/${prBase} (GITHUB_BASE_REF); fetch the base branch or use fetch-depth: 0`,
      }
    }
    return found(mb, `merge base of HEAD and origin/${prBase}`)
  }

  for (const main of ['origin/main', 'main']) {
    const mb = tryGit(repoRoot, ['merge-base', 'HEAD', main])
    if (mb !== null) return found(mb, `merge base of HEAD and ${main}`)
  }
  const branch = tryGit(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch === 'main') return found(head, 'HEAD')
  const where = branch === null || branch === 'HEAD' ? 'a detached HEAD' : `branch ${branch}`
  return {
    ok: false,
    reason: `${where} has no merge base with origin/main or main; fetch main (or pass --base <ref>)`,
  }
}

/** `resolveBase` reduced to the commit id, or null when no base could be found. */
export function resolveBaseRef(repoRoot: string, explicit?: string): string | null {
  const r = resolveBase(repoRoot, explicit)
  return r.ok ? r.ref : null
}

interface TreeEntry {
  /** Path relative to the dataset root, e.g. `data/events/DEU.yaml`. */
  file: string
  blob: string
}

/** Blob id of `bytes` as git computes it (SHA-1 or, for a SHA-256 repository, SHA-256). */
function blobId(bytes: Buffer, algorithm: 'sha1' | 'sha256'): string {
  return createHash(algorithm).update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
}

/** Contents of the given blobs, read by one `git cat-file --batch` process. */
function readBlobs(repoRoot: string, blobs: string[]): Map<string, string> {
  const out = new Map<string, string>()
  if (blobs.length === 0) return out
  const buf = execFileSync('git', ['cat-file', '--batch'], {
    cwd: repoRoot,
    input: `${blobs.join('\n')}\n`,
    maxBuffer: 1024 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  let pos = 0
  for (const blob of blobs) {
    const eol = buf.indexOf(0x0a, pos)
    const header = buf.subarray(pos, eol).toString('utf8').split(' ')
    if (header[1] !== 'blob' || header[2] === undefined) {
      throw new Error(`git cat-file: cannot read blob ${blob} (${header.join(' ')})`)
    }
    const size = Number(header[2])
    out.set(blob, buf.subarray(eol + 1, eol + 1 + size).toString('utf8'))
    pos = eol + 1 + size + 1
  }
  return out
}

/**
 * Loads the records needed by the history checks from `ref`. `prefix` is the dataset root
 * relative to the repository root ('' for the repository's own data, 'fixtures/' for fixtures).
 * Throws when the ref cannot be read.
 *
 * When `current` (the dataset loaded from the working tree at the same root) is given, a file
 * whose working-tree bytes are identical to its blob on the base is not read and parsed again:
 * its records are taken from `current`. The history rules find no difference in such a file
 * either way; this keeps the comparison near the cost of the working-tree load. The blobs that
 * are needed are read by one `git cat-file --batch` process.
 */
export function loadBaseSnapshot(
  repoRoot: string,
  ref: string,
  prefix = '',
  current?: Dataset,
): BaseSnapshot {
  const commit = git(repoRoot, ['rev-parse', '--verify', `${ref}^{commit}`]).trim()
  // `ls-tree` lists paths relative to the working directory (so a prefix, or a `repoRoot` below
  // the top level, reads the same tree the loader reads).
  const listed: TreeEntry[] = []
  for (const line of git(repoRoot, ['ls-tree', '-r', '-z', commit, '--', `${prefix}data`]).split(
    '\0',
  )) {
    if (line === '') continue
    const tab = line.indexOf('\t')
    const [, type, blob] = line.slice(0, tab).split(' ')
    if (type !== 'blob' || blob === undefined) continue
    listed.push({ file: line.slice(tab + 1).slice(prefix.length), blob })
  }

  const snap: BaseSnapshot = {
    ref,
    commit,
    events: new Map(),
    corrections: new Map(),
    sourceIds: new Set(),
    replyIds: new Set(),
    leadIds: new Set(),
  }

  type Kind = 'events' | 'corrections' | 'leads'
  const kindOf = (file: string): Kind | null => {
    const parts = file.split('/')
    if (file === 'data/corrections.yaml') return 'corrections'
    if (parts[0] !== 'data' || parts.length !== 3 || !file.endsWith('.yaml')) return null
    return parts[1] === 'events' ? 'events' : parts[1] === 'leads' ? 'leads' : null
  }

  // Files whose content is needed, and those among them unchanged in the working tree.
  const needed = listed.filter((e) => kindOf(e.file) !== null)
  const unchanged = new Set<string>()
  if (current !== undefined) {
    // Regular files the loader read (a symbolic link is never reused: the loader skipped it).
    const loaded = new Set(current.files)
    for (const e of needed) {
      if (!loaded.has(e.file)) continue
      let bytes: Buffer
      try {
        bytes = readFileSync(join(current.root, e.file))
      } catch {
        continue // deleted or unreadable in the working tree: read the base blob
      }
      if (blobId(bytes, e.blob.length === 64 ? 'sha256' : 'sha1') === e.blob) {
        unchanged.add(e.file)
      }
    }
  }
  const texts = readBlobs(repoRoot, [
    ...new Set(needed.filter((e) => !unchanged.has(e.file)).map((e) => e.blob)),
  ])

  const listOf = (e: TreeEntry): { raw: Record<string, unknown>; id: string }[] => {
    const parsed = parseYaml(texts.get(e.blob) ?? '', e.file)
    if (!parsed.ok || !Array.isArray(parsed.value)) return []
    return parsed.value
      .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
      .filter((r) => typeof r.id === 'string')
      .map((raw) => ({ raw, id: raw.id as string }))
  }
  /** Records of an unchanged file, as loaded from the working tree. */
  const reused = <T extends { id: string }>(records: { value: T; file: string }[], file: string) =>
    records
      .filter((r) => r.file === file)
      .map((r) => ({
        raw: r.value as unknown as Record<string, unknown>,
        id: r.value.id,
        value: r.value,
      }))

  for (const e of listed) {
    const { file } = e
    const parts = file.split('/')
    const kind = kindOf(file)
    if (kind === 'events') {
      if (current !== undefined && unchanged.has(file)) {
        for (const { raw, id, value } of reused(current.events, file)) {
          snap.events.set(id, { raw, value, file })
        }
      } else {
        for (const { raw, id } of listOf(e)) {
          const parsed = Event.safeParse(raw)
          snap.events.set(id, { raw, value: parsed.success ? parsed.data : null, file })
        }
      }
    } else if (kind === 'corrections') {
      if (current !== undefined && unchanged.has(file)) {
        for (const { raw, id, value } of reused(current.corrections, file)) {
          snap.corrections.set(id, { raw, value, file })
        }
      } else {
        for (const { raw, id } of listOf(e)) {
          const parsed = Correction.safeParse(raw)
          snap.corrections.set(id, { raw, value: parsed.success ? parsed.data : null, file })
        }
      }
    } else if (kind === 'leads') {
      const ids =
        current !== undefined && unchanged.has(file)
          ? reused(current.leads, file).map((r) => r.id)
          : listOf(e).map((r) => r.id)
      for (const id of ids) snap.leadIds.add(id)
    } else if (parts[1] === 'sources' && parts.length === 4 && file.endsWith('.yaml')) {
      snap.sourceIds.add(posix.basename(file, '.yaml'))
    } else if (parts[1] === 'replies' && parts.length === 4 && file.endsWith('.yaml')) {
      snap.replyIds.add(posix.basename(file, '.yaml'))
    }
  }
  return snap
}
