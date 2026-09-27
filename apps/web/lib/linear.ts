/**
 * The two chart helpers that client components use (the `?date=` snapshot of a country page),
 * kept apart from lib/chart.ts so that importing them does not bring d3-scale into a browser
 * bundle. lib/chart.ts re-exports them.
 */

/** A number as an SVG percentage with at most three decimals. */
export function pct(n: number): string {
  return `${Math.round(n * 1000) / 1000}%`
}

/** Linear map of a value onto [0, 100], clamped (horizontal value axes: gauge, category rows). */
export function valuePercent(domain: [number, number]) {
  const [d0, d1] = domain
  const span = d1 - d0
  return (v: number) => (span === 0 ? 0 : Math.max(0, Math.min(100, ((v - d0) / span) * 100)))
}
