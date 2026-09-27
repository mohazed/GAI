/**
 * Serialisation of the build outputs (docs/04 §2, D-25): canonical JSON (object keys sorted by
 * UTF-16 code unit at every level, compact, one final LF) and CSV (header row, LF line endings,
 * final LF). The same value always gives the same bytes; anything JSON cannot hold exactly is an
 * error rather than a silent change.
 */
import { csvLine } from '../lib/files.js'

function compareKeys(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * A copy of `value` with every object's keys in code-unit order. Throws on what JSON would drop
 * or change: `undefined` (inside arrays, or as a whole value), non-finite numbers, functions,
 * symbols, bigints, and objects other than plain objects and arrays. `undefined` properties of an
 * object are dropped, as JSON.stringify drops them; `-0` becomes 0.
 */
export function canonicalize(value: unknown, path = '$'): unknown {
  if (value === null) return null
  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value
    case 'number':
      if (!Number.isFinite(value)) throw new TypeError(`${path}: ${value} is not a finite number`)
      return value === 0 ? 0 : value
    case 'object':
      break
    default:
      throw new TypeError(`${path}: ${typeof value} cannot be written as JSON`)
  }
  if (Array.isArray(value)) {
    return value.map((v, i) => {
      if (v === undefined) throw new TypeError(`${path}[${i}]: undefined in an array`)
      return canonicalize(v, `${path}[${i}]`)
    })
  }
  const proto = Object.getPrototypeOf(value)
  if (proto !== Object.prototype && proto !== null) {
    throw new TypeError(`${path}: only plain objects and arrays can be written as JSON`)
  }
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(value as object).sort(compareKeys)) {
    const v = (value as Record<string, unknown>)[key]
    if (v === undefined) continue
    out[key] = canonicalize(v, `${path}.${key}`)
  }
  return out
}

/** Canonical JSON text of `value`, compact, with a final LF. */
export function jsonText(value: unknown): string {
  return `${JSON.stringify(canonicalize(value))}\n`
}

/**
 * A CSV document: the header, then one line per row (values in column order), LF line endings,
 * final LF. Fields are quoted when they hold a comma, a quote or a line break; null and undefined
 * are empty fields. Numbers are written as JavaScript writes them (full precision).
 */
export function csvDocument(
  columns: readonly string[],
  rows: readonly (readonly unknown[])[],
): string {
  for (const [i, r] of rows.entries()) {
    if (r.length !== columns.length) {
      throw new RangeError(`CSV row ${i + 1} has ${r.length} values for ${columns.length} columns`)
    }
    for (const v of r) {
      if (typeof v === 'number' && !Number.isFinite(v)) {
        throw new TypeError(`CSV row ${i + 1}: ${v} is not a finite number`)
      }
    }
  }
  return `${[csvLine(columns), ...rows.map((r) => csvLine(r.map((v) => (v === 0 ? 0 : v))))].join('\n')}\n`
}
