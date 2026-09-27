/**
 * Reads the dataset as it stood at a git ref, for the checks that compare an edit with the
 * published history (docs/03 §11: corrections required on edit; CLAUDE.md: never delete data).
 */
import { execFileSync } from 'node:child_process'
import { posix } from 'node:path'
import { Correction, Event } from '../records.js'
import { parseYaml } from './parse.js'

export interface BaseRecord<T> {
  /** The raw YAML object, for field-by-field comparison. */
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

/**
 * The ref to compare against, in this order: the explicit ref; `GAI_VALIDATE_BASE`; on a pull
 * request (`GITHUB_BASE_REF`), the merge base with `origin/<base>`; on a branch other than main,
 * the merge base with `origin/main` or `main`; otherwise `HEAD` (uncommitted edits).
 * Returns null when the directory is not a git work tree or the ref cannot be resolved.
 */
export function resolveBaseRef(repoRoot: string, explicit?: string): string | null {
  if (tryGit(repoRoot, ['rev-parse', '--is-inside-work-tree']) !== 'true') return null
  const candidate = explicit ?? process.env.GAI_VALIDATE_BASE
  if (candidate) return tryGit(repoRoot, ['rev-parse', '--verify', `${candidate}^{commit}`])
  const prBase = process.env.GITHUB_BASE_REF
  if (prBase) {
    // Without the merge base (e.g. a shallow clone) the comparison would be HEAD with itself and
    // pass silently; return null so validate reports correction.base-unavailable instead.
    return tryGit(repoRoot, ['merge-base', 'HEAD', `origin/${prBase}`])
  }
  const branch = tryGit(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch && branch !== 'main' && branch !== 'HEAD') {
    for (const main of ['origin/main', 'main']) {
      const mb = tryGit(repoRoot, ['merge-base', 'HEAD', main])
      if (mb) return mb
    }
  }
  return tryGit(repoRoot, ['rev-parse', '--verify', 'HEAD^{commit}'])
}

/**
 * Loads the records needed by the history checks from `ref`. `prefix` is the dataset root
 * relative to the repository root ('' for the repository's own data, 'fixtures/' for fixtures).
 * Throws when the ref cannot be read.
 */
export function loadBaseSnapshot(repoRoot: string, ref: string, prefix = ''): BaseSnapshot {
  const commit = git(repoRoot, ['rev-parse', '--verify', `${ref}^{commit}`]).trim()
  const listed = git(repoRoot, ['ls-tree', '-r', '--name-only', commit, '--', `${prefix}data`])
    .split('\n')
    .filter(Boolean)
    .map((p) => p.slice(prefix.length))

  // `ls-tree` lists paths relative to the working directory; `./` makes `show` read them the
  // same way (a bare `<commit>:<path>` is relative to the top level, which differs when
  // `repoRoot` is a subdirectory of the work tree).
  const show = (file: string) => git(repoRoot, ['show', `${commit}:./${prefix}${file}`])

  const snap: BaseSnapshot = {
    ref,
    commit,
    events: new Map(),
    corrections: new Map(),
    sourceIds: new Set(),
    replyIds: new Set(),
    leadIds: new Set(),
  }

  const listOf = (file: string): { raw: Record<string, unknown>; id: string }[] => {
    const parsed = parseYaml(show(file), file)
    if (!parsed.ok || !Array.isArray(parsed.value)) return []
    return parsed.value
      .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
      .filter((r) => typeof r.id === 'string')
      .map((raw) => ({ raw, id: raw.id as string }))
  }

  for (const file of listed) {
    const parts = file.split('/')
    if (parts[1] === 'events' && parts.length === 3 && file.endsWith('.yaml')) {
      for (const { raw, id } of listOf(file)) {
        const parsed = Event.safeParse(raw)
        snap.events.set(id, { raw, value: parsed.success ? parsed.data : null, file })
      }
    } else if (file === 'data/corrections.yaml') {
      for (const { raw, id } of listOf(file)) {
        const parsed = Correction.safeParse(raw)
        snap.corrections.set(id, { raw, value: parsed.success ? parsed.data : null, file })
      }
    } else if (parts[1] === 'sources' && parts.length === 4 && file.endsWith('.yaml')) {
      snap.sourceIds.add(posix.basename(file, '.yaml'))
    } else if (parts[1] === 'replies' && parts.length === 4 && file.endsWith('.yaml')) {
      snap.replyIds.add(posix.basename(file, '.yaml'))
    } else if (parts[1] === 'leads' && parts.length === 3 && file.endsWith('.yaml')) {
      for (const { id } of listOf(file)) snap.leadIds.add(id)
    }
  }
  return snap
}
