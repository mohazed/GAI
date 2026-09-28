/**
 * Loads a methodology version folder (`methodology/vX.Y.Z/`, docs/03 §1).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { type Issue, issue } from '../issues.js'
import {
  type BandsFile,
  type CategoriesFile,
  type ConfidenceFile,
  type DecayFile,
  type Indicator,
  type IndicatorsFile,
  METHODOLOGY_FILES,
  MethodologyDiffFile,
  type MethodologyFileName,
  type PassivityFile,
  ReviewersFile,
  type SymmetryFile,
  type ThresholdsFile,
  type VotesFile,
} from '../methodology/schemas.js'
import { type Located, zodIssues } from './dataset.js'
import { decodeUtf8, parseYaml } from './parse.js'

export interface BannedWord {
  /** Lowercased, NFC. A trailing `*` means "any word starting with". */
  term: string
  line: number
}

export interface MethodologyDoc {
  file: string
  text: string
}

export interface Methodology {
  /** `methodology/v1.0.0` */
  folder: string
  /** `1.0.0`, from the folder name. */
  folderVersion: string
  /** Version declared in indicators.yaml (e.g. `1.0.0-rc.1`), or the folder version. */
  version: string
  indicatorsFile: Located<IndicatorsFile> | null
  categories: Located<CategoriesFile> | null
  bands: Located<BandsFile> | null
  confidence: Located<ConfidenceFile> | null
  decay: Located<DecayFile> | null
  passivity: Located<PassivityFile> | null
  thresholds: Located<ThresholdsFile> | null
  votes: Located<VotesFile> | null
  symmetry: Located<SymmetryFile> | null
  /** `diff.json`, optional: the scores this version moved from the previous one (docs/02 §11). */
  diff: Located<MethodologyDiffFile> | null
  bannedWords: { file: string; entries: BannedWord[] } | null
  docs: { en: MethodologyDoc | null; fr: MethodologyDoc | null }
  /** Convenience: the indicators in file order ([] when indicators.yaml failed). */
  indicators: Indicator[]
  indicatorById: Map<string, Indicator>
  issues: Issue[]
}

const FOLDER_RE = /^v(\d+)\.(\d+)\.(\d+)$/

/** Version folders under `methodology/`, oldest first. */
export function listMethodologyVersions(repoRoot: string): string[] {
  const dir = join(repoRoot, 'methodology')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => FOLDER_RE.test(name) && statSync(join(dir, name)).isDirectory())
    .sort((a, b) => {
      const pa = FOLDER_RE.exec(a)?.slice(1).map(Number) ?? []
      const pb = FOLDER_RE.exec(b)?.slice(1).map(Number) ?? []
      for (let i = 0; i < 3; i++) {
        const d = (pa[i] ?? 0) - (pb[i] ?? 0)
        if (d !== 0) return d
      }
      return 0
    })
}

/** The newest version folder, e.g. `v1.0.0`, or null. */
export function currentMethodologyFolder(repoRoot: string): string | null {
  return listMethodologyVersions(repoRoot).at(-1) ?? null
}

export function parseBannedWords(text: string): BannedWord[] {
  const out: BannedWord[] = []
  text.split(/\r?\n/).forEach((raw, i) => {
    const term = raw.trim()
    if (term === '' || term.startsWith('#')) return
    out.push({ term: term.normalize('NFC').toLowerCase(), line: i + 1 })
  })
  return out
}

/**
 * Loads `methodology/{folderName}` (default: the newest). Paths in `Located.file` are relative to
 * the repository root.
 */
export function loadMethodology(repoRoot: string, folderName?: string): Methodology {
  const name = folderName ?? currentMethodologyFolder(repoRoot) ?? 'v0.0.0'
  const folder = `methodology/${name}`
  const issues: Issue[] = []
  const m: Methodology = {
    folder,
    folderVersion: name.replace(/^v/, ''),
    version: name.replace(/^v/, ''),
    indicatorsFile: null,
    categories: null,
    bands: null,
    confidence: null,
    decay: null,
    passivity: null,
    thresholds: null,
    votes: null,
    symmetry: null,
    diff: null,
    bannedWords: null,
    docs: { en: null, fr: null },
    indicators: [],
    indicatorById: new Map(),
    issues,
  }
  if (!existsSync(join(repoRoot, folder))) {
    issues.push(issue('load.missing-file', { file: folder }, `${folder} does not exist`))
    return m
  }

  /** Strict UTF-8 read; invalid bytes are reported as load.encoding. */
  const readText = (file: string): string => {
    const decoded = decodeUtf8(readFileSync(join(repoRoot, file)), file)
    issues.push(...decoded.issues)
    return decoded.text
  }

  const load = <K extends MethodologyFileName>(fileName: K) => {
    const file = `${folder}/${fileName}`
    if (!existsSync(join(repoRoot, file))) {
      issues.push(issue('load.missing-file', { file }, `${file} is missing`))
      return null
    }
    const parsed = parseYaml(readText(file), file)
    issues.push(...parsed.issues)
    if (!parsed.ok) return null
    const result = METHODOLOGY_FILES[fileName].safeParse(parsed.value)
    if (!result.success) {
      const zis = result.error.issues
      zodIssues('schema.methodology', result.error, { file, id: fileName }).forEach((i, k) => {
        // The line of the top-level key the problem sits under; for an unknown top-level key
        // (a typo such as `plateau_day:`), the line of that key.
        const zi = zis[k]
        const unknown = zi?.code === 'unrecognized_keys' ? zi.keys[0] : undefined
        const first = i.path?.split('.')[0] ?? unknown
        const line = first ? parsed.keyLines.get(first) : undefined
        issues.push(line === undefined ? i : { ...i, line })
      })
      return null
    }
    return { value: result.data, file, line: 1 }
  }

  m.indicatorsFile = load('indicators.yaml') as Located<IndicatorsFile> | null
  m.categories = load('categories.yaml') as Located<CategoriesFile> | null
  m.bands = load('bands.yaml') as Located<BandsFile> | null
  m.confidence = load('confidence.yaml') as Located<ConfidenceFile> | null
  m.decay = load('decay.yaml') as Located<DecayFile> | null
  m.passivity = load('passivity.yaml') as Located<PassivityFile> | null
  m.thresholds = load('thresholds.yaml') as Located<ThresholdsFile> | null
  m.votes = load('votes.yaml') as Located<VotesFile> | null
  m.symmetry = load('symmetry.yaml') as Located<SymmetryFile> | null

  // diff.json is optional (the first version has none); when present it must match its schema.
  const diffFile = `${folder}/diff.json`
  if (existsSync(join(repoRoot, diffFile))) {
    const parsed = parseYaml(readText(diffFile), diffFile)
    issues.push(...parsed.issues)
    if (parsed.ok) {
      const result = MethodologyDiffFile.safeParse(parsed.value)
      if (result.success) m.diff = { value: result.data, file: diffFile, line: 1 }
      else
        issues.push(
          ...zodIssues('schema.methodology', result.error, { file: diffFile, id: 'diff.json' }),
        )
    }
  }

  const bannedFile = `${folder}/banned-words.txt`
  if (existsSync(join(repoRoot, bannedFile))) {
    m.bannedWords = {
      file: bannedFile,
      entries: parseBannedWords(readText(bannedFile)),
    }
  } else {
    issues.push(issue('load.missing-file', { file: bannedFile }, `${bannedFile} is missing`))
  }

  for (const lang of ['en', 'fr'] as const) {
    const file = `${folder}/methodology.${lang}.md`
    if (existsSync(join(repoRoot, file))) {
      m.docs[lang] = { file, text: readText(file) }
    } else {
      issues.push(issue('load.missing-file', { file }, `${file} is missing`))
    }
  }

  if (m.indicatorsFile) {
    m.version = m.indicatorsFile.value.version
    m.indicators = m.indicatorsFile.value.indicators
    for (const ind of m.indicators) m.indicatorById.set(ind.id, ind)
  }
  if (m.diff !== null && m.diff.value.to !== m.version) {
    issues.push(
      issue(
        'schema.methodology',
        { file: m.diff.file, id: 'diff.json', path: 'to' },
        `diff.json is for version ${m.diff.value.to}, the folder declares ${m.version}`,
      ),
    )
  }
  return m
}

/** `methodology/reviewers.yaml`, outside the version folders (docs/08 §2). */
export const REVIEWERS_FILE = 'methodology/reviewers.yaml'

/**
 * Loads the external reviewers of the methodology. A missing file means none yet (an empty list,
 * no issue); a file that does not parse or match its schema gives `value: null` and issues.
 */
export function loadReviewers(repoRoot: string): {
  value: ReviewersFile | null
  issues: Issue[]
} {
  const full = join(repoRoot, REVIEWERS_FILE)
  if (!existsSync(full)) return { value: { reviewers: [] }, issues: [] }
  const decoded = decodeUtf8(readFileSync(full), REVIEWERS_FILE)
  const issues: Issue[] = [...decoded.issues]
  const parsed = parseYaml(decoded.text, REVIEWERS_FILE)
  issues.push(...parsed.issues)
  if (!parsed.ok) return { value: null, issues }
  const result = ReviewersFile.safeParse(parsed.value)
  if (!result.success) {
    issues.push(
      ...zodIssues('schema.methodology', result.error, { file: REVIEWERS_FILE, id: 'reviewers' }),
    )
    return { value: null, issues }
  }
  return { value: result.data, issues }
}
