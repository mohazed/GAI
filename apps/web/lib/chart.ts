/**
 * Shared chart geometry (docs/05 §8). Charts are SVG without a viewBox: horizontal positions are
 * percentages of the plot width and vertical ones are pixels, so a chart fits any width without
 * JavaScript and without inline styles (the CSP allows no style attributes). Lines that need a
 * path (the step line) sit in a nested SVG stretched horizontally, drawn with
 * `vector-effect: non-scaling-stroke` so the stroke stays 1.5 px.
 */
import { dayNumber } from '@gai/scoring'
import { scaleLinear } from 'd3-scale'
import { curveStepAfter, line } from 'd3-shape'

/** Width of the nested path SVG's user space; its height equals the chart height in px. */
export const PATH_WIDTH = 1000

/** A number as an SVG percentage with at most three decimals. */
export function pct(n: number): string {
  return `${Math.round(n * 1000) / 1000}%`
}

/** Linear map of an ISO date onto [0, 100] between `from` and `to`. */
export function datePercent(from: string, to: string) {
  const s = scaleLinear()
    .domain([dayNumber(from), Math.max(dayNumber(to), dayNumber(from) + 1)])
    .range([0, 100])
    .clamp(true)
  return (iso: string) => s(dayNumber(iso))
}

/** Linear map of a value onto a pixel row, `domain[1]` at `top`. */
export function valuePx(domain: [number, number], top: number, bottom: number) {
  const s = scaleLinear().domain(domain).range([bottom, top])
  return (v: number) => Math.round(s(v) * 100) / 100
}

/** Linear map of a value onto [0, 100] (horizontal value axes: gauge, category rows). */
export function valuePercent(domain: [number, number]) {
  const s = scaleLinear().domain(domain).range([0, 100]).clamp(true)
  return (v: number) => s(v)
}

export interface StepPoint {
  date: string
  value: number
}

/**
 * The `d` of a step line through change points (value holds until the next point), extended to
 * `to`, in the nested SVG's user space (x in [0, PATH_WIDTH], y in pixels).
 */
export function stepPath(
  points: readonly StepPoint[],
  from: string,
  to: string,
  y: (v: number) => number,
): string {
  if (points.length === 0) return ''
  const x = datePercent(from, to)
  const last = points[points.length - 1] as StepPoint
  const all = [...points, { date: to, value: last.value }]
  const gen = line<StepPoint>()
    .x((p) => Math.round(x(p.date) * (PATH_WIDTH / 100) * 100) / 100)
    .y((p) => y(p.value))
    .curve(curveStepAfter)
  return gen(all) ?? ''
}

/** The value in force on `date`: the last point on or before it, or null before the first. */
export function valueAt<T extends { date: string }>(points: readonly T[], date: string): T | null {
  let found: T | null = null
  for (const p of points) {
    if (p.date <= date) found = p
    else break
  }
  return found
}

/** First days of the quarters strictly after `from` and on or before `to`. */
export function quarterTicks(from: string, to: string): string[] {
  const out: string[] = []
  let y = Number(from.slice(0, 4))
  let q = Math.floor((Number(from.slice(5, 7)) - 1) / 3)
  for (;;) {
    q += 1
    if (q === 4) {
      q = 0
      y += 1
    }
    const d = `${y}-${String(q * 3 + 1).padStart(2, '0')}-01`
    if (d > to) return out
    out.push(d)
  }
}
