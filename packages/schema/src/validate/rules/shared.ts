/**
 * Helpers shared by several rule modules.
 */
import { parseEventId } from '../../ids.js'
import type { Dataset } from '../../load/dataset.js'

/**
 * Files that exist but could not be read as records (YAML syntax, or not a list/mapping): their
 * records are absent from the dataset without being in `invalidIds`, so rules must not report
 * references to them as unknown (the load issue already covers the file).
 */
export function unreadableFiles(ds: Dataset): Set<string> {
  const out = new Set<string>()
  for (const i of ds.issues) {
    if (i.rule === 'load.yaml-syntax' || (i.rule.startsWith('schema.') && i.id === '-')) {
      out.add(i.file)
    }
  }
  return out
}

/**
 * True when `id` may name an event of data/events that exists but could not be loaded: its record
 * failed its schema (`invalidIds`), or its country file `data/events/{ISO3}.yaml` cannot be read.
 * References to such an event are not reported as unknown.
 */
export function eventNotLoaded(
  ds: Dataset,
  id: string,
  unreadable: Set<string> = unreadableFiles(ds),
): boolean {
  if (ds.invalidIds.has(id)) return true
  const parsed = parseEventId(id)
  return parsed !== null && unreadable.has(`data/events/${parsed.iso3}.yaml`)
}

/** True when the events of `iso3` may be incomplete: its events file cannot be read. */
export function eventsFileUnreadable(ds: Dataset, iso3: string): boolean {
  return unreadableFiles(ds).has(`data/events/${iso3}.yaml`)
}
