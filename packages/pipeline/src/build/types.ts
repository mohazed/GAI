/**
 * Types shared by the modules of build-data (docs/04 §2): what the build reads, what one
 * country's scoring pass produces, and what the build returns. The build itself (`buildData` in
 * ./index.ts) is pure: every input, including the git state and the build date, is passed in, so
 * the same input gives the same bytes (D-25).
 */
import type {
  ApiBuildNote,
  ApiEvent,
  ApiSource,
  AssessmentStatus,
  Country,
  Dataset,
  Event,
  Methodology,
  Reviewer,
} from '@gai/schema'
import type {
  CategoryId,
  CountryScore,
  CountryScorer,
  Coverage,
  ScoringMethodology,
  SeriesPoint,
} from '@gai/scoring'

export interface GitInfo {
  /** HEAD, or null outside a git checkout. */
  sha: string | null
  /** Uncommitted changes under the build's inputs; null when unknown. */
  dirty: boolean | null
}

/** A file of data/snapshots/, path relative to data/snapshots/ (POSIX), e.g. `v1.0.0/countries.json`. */
export interface SnapshotFile {
  path: string
  bytes: Uint8Array
}

export interface BuildInput {
  dataset: Dataset
  /** The current methodology (the newest version folder). */
  methodology: Methodology
  /** Older version folders, oldest first (superseded, served frozen, docs/02 §11). */
  older: Methodology[]
  /** methodology/CHANGELOG.md, or null. */
  changelog: string | null
  /** methodology/reviewers.yaml `reviewers` ([] when the file is absent, docs/08 §2). */
  reviewers: Reviewer[]
  snapshots: SnapshotFile[]
  /** Build date `YYYY-MM-DD` (UTC), on or after the window start. */
  date: string
  /** Site origin for permalinks and citations, e.g. https://gaza-accountability-index.pages.dev */
  siteUrl: string
  git: GitInfo
  /** Correction id → commit that added it to the corrections log (null: not committed). */
  correctionCommits: ReadonlyMap<string, string | null>
  /** Why correction commits are unknown (shallow clone, no git), for the build notes. */
  historyNote: string | null
}

export type BuildNote = ApiBuildNote

export interface BuildOutput {
  /** Path relative to api/v1/ (POSIX) → content; JSON, CSV and Markdown are text. */
  files: Map<string, string | Uint8Array>
  notes: BuildNote[]
}

/** One day of one country's score, full precision where the API publishes it. */
export interface DayScore {
  /** S in full precision. */
  exact: number
  /** S to one decimal. */
  score: number
  display: number
  band: string
  passivity: boolean
  /** Clipped category subtotals, full precision. */
  clipped: Record<CategoryId, number>
}

/** The status the build derives from a structured table for a generated indicator. */
export interface DerivedStatus {
  status: AssessmentStatus
  /** Short machine-readable reason, e.g. `generated-event`, `no-row`, `no-gni`. */
  reason: string
}

/** The scoring pass of one scored country (./country.ts). */
export interface CountryRun {
  country: Country
  /**
   * The country's public events: hand-authored ones whose status is published, corrected,
   * superseded or retracted, and the generated ones. Drafts and reviewed events never enter.
   */
  events: Event[]
  scorer: CountryScorer
  /** One entry per day from the window start to the build date. */
  days: DayScore[]
  /** Change points (compressSeries). */
  series: SeriesPoint[]
  /** Score at the build date. */
  final: CountryScore
  /** Coverage at the build date, from the effective assessment. */
  coverage: Coverage
}

/** Context the API mappers need (./normalize.ts). */
export interface ApiContext {
  methodology: Methodology
  scoring: ScoringMethodology
  date: string
}

export type { ApiEvent, ApiSource }
