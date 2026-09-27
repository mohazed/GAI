/**
 * The country card summary line, generated from one template for every country (spec §5):
 *
 *   Score −38 (Enabling). 14 events, 9 confirmed. Coverage 71%. Last change: 2026-09-12, UNGA vote (B1, +3).
 *   Score −38 (Facilitation). 14 événements, dont 9 confirmés. Couverture 71 %. Dernier changement : 2026-09-12, vote à l'Assemblée générale (B1, +3).
 *
 * Events counted: published events scoped to gaza, dated on or before the date, of every
 * indicator including E, except computed values (A1, A2, A4, C3, D1): those are one dataset
 * reading per release or month, not acts, and would outnumber the acts. The points in
 * "(B1, +3)" are the net change of that indicator's value that day; when the passivity penalty
 * was applied or lifted the same day, the line says so.
 *
 * Scorecard mode (D-16): no score, no band and nothing derived from them (no passivity); the last
 * sentence names the latest published event instead of the last change of the hidden score.
 */
import { formatInteger, formatSigned, NBSP, NNBSP } from './format.js'
import { indicatorLabel } from './labels.js'
import { roundHalfAwayFromZero } from './numeric.js'
import type { LastChange } from './series.js'
import { dayNumber } from './time.js'
import {
  CATEGORY_IDS,
  type CategoryId,
  CONFIDENCE_LEVELS,
  type Confidence,
  type Lang,
  type LangText,
  SCORED_SCOPE,
  SCORING_STATUS,
  type ScoringEvent,
} from './types.js'

export type EventCounts = { readonly total: number } & Readonly<Record<Confidence, number>>

/** The events the summary counts at `date` (see the module comment). */
function counted(
  events: readonly ScoringEvent[],
  date: string,
  country: string | undefined,
): ScoringEvent[] {
  const day = dayNumber(date)
  return events.filter(
    (e) =>
      (country === undefined || e.country === country) &&
      e.status === SCORING_STATUS &&
      e.scope.includes(SCORED_SCOPE) &&
      e.type !== 'computed' &&
      dayNumber(e.date) <= day,
  )
}

/**
 * The counted events at `date`, by confidence (§14 `events`). With `country`, other countries'
 * events are ignored; without it, every event passed is counted.
 */
export function eventCounts(
  events: readonly ScoringEvent[],
  date: string,
  country?: string,
): EventCounts {
  const counts: Record<Confidence, number> = {
    confirmed: 0,
    corroborated: 0,
    reported: 0,
    disputed: 0,
  }
  let total = 0
  for (const e of counted(events, date, country)) {
    if (!CONFIDENCE_LEVELS.includes(e.confidence)) {
      throw new RangeError(`unknown confidence ${e.confidence}`)
    }
    counts[e.confidence]++
    total++
  }
  return { total, ...counts }
}

/**
 * The counted events at `date` by category (the same events as `eventCounts`, so the five counts
 * add up to its `total`); `categoryOf` maps an indicator id to its category (indicators.yaml).
 * Scorecard mode shows these counts in place of the category subtotals (D-16).
 */
export function eventCategoryCounts(
  events: readonly ScoringEvent[],
  date: string,
  categoryOf: (indicator: string) => CategoryId,
  country?: string,
): Record<CategoryId, number> {
  const counts: Record<CategoryId, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }
  for (const e of counted(events, date, country)) {
    const k = categoryOf(e.indicator)
    if (!CATEGORY_IDS.includes(k)) throw new RangeError(`unknown category ${k} of ${e.indicator}`)
    counts[k]++
  }
  return counts
}

export interface LatestEvent {
  readonly date: string
  readonly id: string
  readonly indicator: string
  /** Points as recorded on the event. */
  readonly points: number
}

/** The latest counted event at `date` (ties: the greater id), or null. */
export function latestEvent(
  events: readonly ScoringEvent[],
  date: string,
  country?: string,
): LatestEvent | null {
  let best: ScoringEvent | null = null
  for (const e of counted(events, date, country)) {
    if (best === null || e.date > best.date || (e.date === best.date && e.id > best.id)) best = e
  }
  return best === null
    ? null
    : { date: best.date, id: best.id, indicator: best.indicator, points: best.points }
}

export interface SummaryInput {
  /** null in scorecard mode (D-16): no number and no band. */
  readonly score: { readonly display: number; readonly bandName: LangText } | null
  readonly events: EventCounts
  /** Coverage ratio (§8), full precision. */
  readonly coverage: number
  readonly lastChange: LastChange | null
  /** The penalty size, for a passivity change. */
  readonly passivityPoints: number
  /** Scorecard mode only: the latest event (latestEvent()); required when `score` is null. */
  readonly latestEvent?: LatestEvent | null
}

const TEXT = {
  en: {
    score: (n: string, band: string) => `Score ${n} (${band}).`,
    events: (total: number, t: string, _confirmed: number, c: string) =>
      `${t} ${total === 1 ? 'event' : 'events'}, ${c} confirmed.`,
    coverage: (pct: string) => `Coverage ${pct}%.`,
    last: 'Last change:',
    latest: 'Latest event:',
    none: 'none',
    ended: 'ended',
    expired: 'no longer counted',
    applied: 'passivity penalty applied',
    lifted: 'passivity penalty lifted',
    semicolon: ';',
  },
  fr: {
    score: (n: string, band: string) => `Score ${n} (${band}).`,
    events: (total: number, t: string, confirmed: number, c: string) =>
      `${t} ${total <= 1 ? 'événement' : 'événements'}, dont ${c} ${confirmed <= 1 ? 'confirmé' : 'confirmés'}.`,
    coverage: (pct: string) => `Couverture ${pct}${NNBSP}%.`,
    last: `Dernier changement${NBSP}:`,
    latest: `Dernier événement${NBSP}:`,
    none: 'aucun',
    ended: 'fin',
    expired: 'sortie du score',
    applied: 'pénalité de passivité appliquée',
    lifted: 'pénalité de passivité levée',
    semicolon: `${NNBSP};`,
  },
} as const

function passivityText(applied: boolean, passivityPoints: number, lang: Lang): string {
  const t = TEXT[lang]
  const points = formatSigned(applied ? -passivityPoints : passivityPoints, lang)
  return `${applied ? t.applied : t.lifted} (${points})`
}

function lastChangeText(lc: LastChange | null, passivityPoints: number, lang: Lang): string {
  const t = TEXT[lang]
  if (lc === null) return `${t.last} ${t.none}.`
  if (lc.kind === 'passivity') {
    return `${t.last} ${lc.date}, ${passivityText(lc.passivity.after, passivityPoints, lang)}.`
  }
  const indicator = lc.indicator as string
  let label = indicatorLabel(indicator)[lang]
  if (lc.change === 'end') label = `${label}, ${t.ended}`
  if (lc.change === 'expire') label = `${label}, ${t.expired}`
  const toggled =
    lc.passivity.before === lc.passivity.after
      ? ''
      : `${t.semicolon} ${passivityText(lc.passivity.after, passivityPoints, lang)}`
  return `${t.last} ${lc.date}, ${label} (${indicator}, ${formatSigned(lc.points ?? 0, lang)})${toggled}.`
}

function latestEventText(le: LatestEvent | null, lang: Lang): string {
  const t = TEXT[lang]
  if (le === null) return `${t.latest} ${t.none}.`
  const label = indicatorLabel(le.indicator)[lang]
  return `${t.latest} ${le.date}, ${label} (${le.indicator}, ${formatSigned(le.points, lang)}).`
}

/** The summary line in one language. */
export function summaryLine(input: SummaryInput, lang: Lang): string {
  const t = TEXT[lang]
  const parts: string[] = []
  if (input.score !== null) {
    parts.push(t.score(formatSigned(input.score.display, lang, 0), input.score.bandName[lang]))
  }
  const { total, confirmed } = input.events
  parts.push(t.events(total, formatInteger(total, lang), confirmed, formatInteger(confirmed, lang)))
  if (!(input.coverage >= 0 && input.coverage <= 1)) {
    throw new RangeError(`coverage must lie in [0, 1], got ${input.coverage}`)
  }
  parts.push(t.coverage(String(roundHalfAwayFromZero(input.coverage * 100, 0))))
  if (input.score !== null) {
    parts.push(lastChangeText(input.lastChange, input.passivityPoints, lang))
  } else {
    if (input.latestEvent === undefined) {
      throw new Error('scorecard mode (score: null) needs latestEvent')
    }
    parts.push(latestEventText(input.latestEvent, lang))
  }
  return parts.join(' ')
}

/** The summary line in both languages. */
export function summaryLines(input: SummaryInput): LangText {
  return { en: summaryLine(input, 'en'), fr: summaryLine(input, 'fr') }
}
