/**
 * The context every validation rule receives, with lookup indexes built once.
 */
import type { Issue } from '../issues.js'
import type { Dataset, Located } from '../load/dataset.js'
import type { BaseSnapshot } from '../load/git.js'
import type { Methodology } from '../load/methodology.js'
import type {
  ArchiveIndexRow,
  Assessment,
  Correction,
  Country,
  Event,
  Lead,
  Reply,
  Source,
} from '../records.js'

export interface DatasetIndex {
  /** First record per key; duplicates are reported by `id.unique`. */
  countryByIso3: Map<string, Located<Country>>
  eventById: Map<string, Located<Event>>
  eventsByCountry: Map<string, Located<Event>[]>
  sourceById: Map<string, Located<Source>>
  assessmentByCountry: Map<string, Located<Assessment>>
  correctionsByEvent: Map<string, Located<Correction>[]>
  repliesByEvent: Map<string, Located<Reply>[]>
  leadById: Map<string, Located<Lead>>
  archiveIndexById: Map<string, Located<ArchiveIndexRow>>
}

export interface ValidationContext {
  dataset: Dataset
  methodology: Methodology
  index: DatasetIndex
  /** The dataset at the git base ref; null when history checks cannot run. */
  base: BaseSnapshot | null
  /** Why `base` is null, when a comparison was requested and failed. */
  baseError?: string
}

export type Rule = (ctx: ValidationContext) => Issue[]

function firstBy<T>(items: Located<T>[], key: (v: T) => string): Map<string, Located<T>> {
  const map = new Map<string, Located<T>>()
  for (const item of items) {
    const k = key(item.value)
    if (!map.has(k)) map.set(k, item)
  }
  return map
}

function groupBy<T>(items: Located<T>[], keys: (v: T) => string[]): Map<string, Located<T>[]> {
  const map = new Map<string, Located<T>[]>()
  for (const item of items) {
    for (const k of keys(item.value)) {
      const list = map.get(k)
      if (list) list.push(item)
      else map.set(k, [item])
    }
  }
  return map
}

export function buildIndex(ds: Dataset): DatasetIndex {
  return {
    countryByIso3: firstBy(ds.countries, (c) => c.iso3),
    eventById: firstBy(ds.events, (e) => e.id),
    eventsByCountry: groupBy(ds.events, (e) => [e.country]),
    sourceById: firstBy(ds.sources, (s) => s.id),
    assessmentByCountry: firstBy(ds.assessments, (a) => a.country),
    correctionsByEvent: groupBy(ds.corrections, (c) => [c.event]),
    repliesByEvent: groupBy(ds.replies, (r) => r.contests),
    leadById: firstBy(ds.leads, (l) => l.id),
    archiveIndexById: firstBy(ds.archiveIndex, (r) => r.src_id),
  }
}

export function buildContext(
  dataset: Dataset,
  methodology: Methodology,
  base: BaseSnapshot | null = null,
  baseError?: string,
): ValidationContext {
  const ctx: ValidationContext = { dataset, methodology, index: buildIndex(dataset), base }
  if (baseError !== undefined) ctx.baseError = baseError
  return ctx
}
