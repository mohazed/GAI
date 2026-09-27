/**
 * Compare palette (docs/05 §3 --cmp-1…5): up to five countries, each with a colour, a line dash
 * and a dot shape, so that colour is never the only carrier of identity (docs/05 §8).
 */
export const MAX_COMPARE = 5

// Class names are written out in full so that Tailwind generates them.
export const COMPARE_STYLES = [
  { cls: 'cmp-1', stroke: 'stroke-cmp-1', fill: 'fill-cmp-1', dash: undefined, shape: 'circle' },
  { cls: 'cmp-2', stroke: 'stroke-cmp-2', fill: 'fill-cmp-2', dash: '6 3', shape: 'square' },
  { cls: 'cmp-3', stroke: 'stroke-cmp-3', fill: 'fill-cmp-3', dash: '2 2', shape: 'triangle' },
  { cls: 'cmp-4', stroke: 'stroke-cmp-4', fill: 'fill-cmp-4', dash: '8 3 2 3', shape: 'diamond' },
  { cls: 'cmp-5', stroke: 'stroke-cmp-5', fill: 'fill-cmp-5', dash: '1 3', shape: 'cross' },
] as const

export type CompareStyle = (typeof COMPARE_STYLES)[number]

export function compareStyle(i: number): CompareStyle {
  const s = COMPARE_STYLES[i]
  if (s === undefined) throw new RangeError(`at most ${MAX_COMPARE} countries are compared`)
  return s
}

/** Pushes label positions apart so no two are closer than `gap`, keeping their order. */
export function spreadLabels(
  ys: readonly number[],
  gap: number,
  min: number,
  max: number,
): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y || a.i - b.i)
  const placed: number[] = []
  for (const [k, o] of order.entries()) {
    const prev = placed[k - 1]
    placed.push(Math.max(o.y, prev === undefined ? min : prev + gap))
  }
  // If the last label overflows, shift the stack back up.
  const over = (placed[placed.length - 1] ?? max) - max
  if (over > 0)
    for (let k = 0; k < placed.length; k++) placed[k] = Math.max(min, (placed[k] as number) - over)
  const out = new Array<number>(ys.length)
  order.forEach((o, k) => {
    out[o.i] = placed[k] as number
  })
  return out
}

/**
 * The countries of a `?c=` value (docs/04 §3: `?c=DEU,FRA`): ISO3 codes separated by commas, in
 * the order given, upper-cased, each once. Codes of scored countries are kept, up to five; the
 * others are returned apart (unknown codes, excluded entities, a sixth country) so that the page
 * can say why they are not shown.
 */
export function parseCompare(
  value: string | null,
  scored: ReadonlySet<string>,
): { kept: string[]; dropped: string[] } {
  const kept: string[] = []
  const dropped: string[] = []
  if (value === null) return { kept, dropped }
  for (const raw of value.split(',')) {
    const code = raw.trim().toUpperCase()
    if (code === '' || kept.includes(code) || dropped.includes(code)) continue
    if (scored.has(code) && kept.length < MAX_COMPARE) kept.push(code)
    else dropped.push(code)
  }
  return { kept, dropped }
}

/**
 * The query of a comparison: `?c=DEU,FRA`, then `&w=A,B,C,D` when the weights are not the
 * defaults (written by the caller with @gai/scoring's `formatWeights`), with plain commas as
 * documented (URLSearchParams would write them as %2C). Empty when nothing is chosen.
 */
export function compareQuery(iso3s: readonly string[], weights: string | null): string {
  const parts = [
    iso3s.length > 0 ? `c=${iso3s.join(',')}` : '',
    weights === null ? '' : `w=${weights}`,
  ]
  const q = parts.filter((p) => p !== '').join('&')
  return q === '' ? '' : `?${q}`
}
