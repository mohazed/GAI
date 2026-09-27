/**
 * Phase-1 gate (D-16, docs/04 §3). `score` shows the composite number, band colours and the
 * ranking order; `scorecard` shows events, sources, coverage and counts only. Every component
 * that can show a score takes a `mode`; pages pass `SITE_MODE`.
 */
export type Mode = 'score' | 'scorecard'

export const SITE_MODE: Mode =
  process.env.NEXT_PUBLIC_SHOW_SCORES === 'true' ? 'score' : 'scorecard'
