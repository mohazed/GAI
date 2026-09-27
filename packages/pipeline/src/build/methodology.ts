/**
 * The methodology files of the API (docs/04 §2 step 6, docs/02 §11): `methodology/{version}.json`
 * holds one version folder as parsed (docs/03 §1), and `methodology/index.json` lists every
 * version folder with its status, its API file and, for a superseded version whose last outputs
 * are frozen under `data/snapshots/{folder}/`, the API folder those outputs are served from
 * (`methodology/{folder}/`).
 *
 * The values are the parsed YAML documents as the loader returns them (@gai/schema
 * `loadMethodology`); nothing is recomputed or reformatted, so a reader gets the exact numbers the
 * build scored with. Pure: no clock, no file system (D-25).
 */
import {
  type ApiMethodologyFile,
  type ApiMethodologyIndex,
  type Methodology,
  WINDOW_START,
} from '@gai/schema'

export type MethodologyStatus = 'current' | 'superseded'

/** The files a published version must have loaded, by Methodology key. */
const REQUIRED_FILES = {
  indicatorsFile: 'indicators.yaml',
  categories: 'categories.yaml',
  bands: 'bands.yaml',
  confidence: 'confidence.yaml',
  decay: 'decay.yaml',
  passivity: 'passivity.yaml',
} as const

/** API path of a version's file, e.g. `methodology/1.0.0-rc.1.json` (the declared version). */
export function methodologyPath(m: Methodology): string {
  return `methodology/${m.version}.json`
}

/** The version folder's name without `methodology/`, e.g. `v1.0.0`. */
function folderName(m: Methodology): string {
  return m.folder.replace(/^methodology\//, '')
}

/**
 * `methodology/{version}.json`: every file of the version folder as parsed. Throws when one of the
 * files the score needs (indicators, categories, bands, confidence, decay, passivity) failed to
 * load; thresholds, votes and symmetry are null when absent. `banned_words` lists the entries of
 * banned-words.txt in file order (lowercased and NFC-normalised by the loader, comments and blank
 * lines dropped), and is empty when the file is absent (the validator reports that case).
 */
export function methodologyFile(m: Methodology, status: MethodologyStatus): ApiMethodologyFile {
  const { indicatorsFile, categories, bands, confidence, decay, passivity } = m
  if (
    indicatorsFile === null ||
    categories === null ||
    bands === null ||
    confidence === null ||
    decay === null ||
    passivity === null
  ) {
    const files = { indicatorsFile, categories, bands, confidence, decay, passivity }
    const missing = Object.entries(REQUIRED_FILES)
      .filter(([key]) => files[key as keyof typeof files] === null)
      .map(([, name]) => name)
    throw new Error(
      `methodology ${m.folder} cannot be published: ${missing.join(', ')} did not load`,
    )
  }
  return {
    version: m.version,
    folder: m.folder,
    status,
    window_start: WINDOW_START,
    indicators: indicatorsFile.value,
    categories: categories.value,
    bands: bands.value,
    confidence: confidence.value,
    decay: decay.value,
    passivity: passivity.value,
    thresholds: m.thresholds?.value ?? null,
    votes: m.votes?.value ?? null,
    symmetry: m.symmetry?.value ?? null,
    banned_words: (m.bannedWords?.entries ?? []).map((e) => e.term),
    docs: { en: m.docs.en?.text ?? null, fr: m.docs.fr?.text ?? null },
  }
}

export interface MethodologyIndexArgs {
  /** Build date. */
  date: string
  /** The newest version folder. */
  current: Methodology
  /** The older version folders, oldest first. */
  older: readonly Methodology[]
  /** methodology/CHANGELOG.md, verbatim, or null. */
  changelog: string | null
  /** Top-level folders present under data/snapshots/, e.g. `v1.0.0`. */
  frozen: ReadonlySet<string>
}

/**
 * `methodology/index.json`: the older versions (superseded, oldest first), then the current one.
 * `frozen` is `methodology/{folder}/` when `data/snapshots/{folder}/` exists, else null; the rule
 * is the same for every entry. Throws when two folders declare the same version (they would
 * write the same API file).
 */
export function methodologyIndex(args: MethodologyIndexArgs): ApiMethodologyIndex {
  const entries: [Methodology, MethodologyStatus][] = [
    ...args.older.map((m): [Methodology, MethodologyStatus] => [m, 'superseded']),
    [args.current, 'current'],
  ]
  const seen = new Map<string, string>()
  for (const [m] of entries) {
    const other = seen.get(m.version)
    if (other !== undefined) {
      throw new Error(`${other} and ${m.folder} both declare methodology version ${m.version}`)
    }
    seen.set(m.version, m.folder)
  }
  return {
    build_date: args.date,
    current: args.current.version,
    versions: entries.map(([m, status]) => {
      const name = folderName(m)
      return {
        version: m.version,
        folder: m.folder,
        status,
        file: methodologyPath(m),
        frozen: args.frozen.has(name) ? `methodology/${name}/` : null,
      }
    }),
    changelog: args.changelog,
  }
}
