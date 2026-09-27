/**
 * The scoring pass of one scored country (docs/04 §2 step 4): its score on every date from the
 * window start (2023-10-07) to the build date, the series of change points, and the score and
 * coverage at the build date.
 *
 * The score of each day comes from one `CountryScorer` (@gai/scoring), so the daily table
 * (scores/{date}.json, dumps/scores-daily.csv), the series and the build-date snapshot are read
 * from the same evaluations. Coverage describes the research status of the dataset (docs/02 §8,
 * D-09) and is computed at the build date only: the assessments record what was checked, not
 * when, so a coverage "as of" an earlier date could not be computed honestly.
 */
import type { Country, Event } from '@gai/schema'
import {
  type CategoryId,
  compressSeries,
  coverage,
  createScorer,
  dayNumber,
  type ScoringAssessment,
  type ScoringMethodology,
  type SeriesPoint,
  seriesPoint,
} from '@gai/scoring'
import type { CountryRun, DayScore } from './types.js'

const CATEGORIES: readonly CategoryId[] = ['A', 'B', 'C', 'D', 'E']

export interface CountryRunInput {
  country: Country
  /** Every event of the country: hand-authored (all statuses) and generated. */
  events: readonly Event[]
  scoring: ScoringMethodology
  /** The effective assessment at the build date (hand statuses with the derived ones laid over). */
  assessment: ScoringAssessment | null
  /** Build date. */
  date: string
}

/** Scores the country on every day of the window; throws what the engine throws. */
export function runCountry(input: CountryRunInput): CountryRun {
  const { country, scoring, date } = input
  const events = [...input.events]
  const scorer = createScorer(country.iso3, events, scoring)
  const first = dayNumber(scoring.windowStart)
  const last = dayNumber(date)
  if (last < first) throw new RangeError(`build date ${date} is before ${scoring.windowStart}`)
  const days: DayScore[] = []
  const points: SeriesPoint[] = []
  let final = scorer.atDay(first)
  for (let day = first; day <= last; day++) {
    const s = scorer.atDay(day)
    const clipped = {} as Record<CategoryId, number>
    for (const id of CATEGORIES) clipped[id] = s.categories[id].clipped
    days.push({
      exact: s.exact,
      score: s.score,
      display: s.display,
      band: s.band,
      passivity: s.passivity.applied,
      clipped,
    })
    points.push(seriesPoint(s, scorer.transitionsOn(day)))
    if (day === last) final = s
  }
  return {
    country,
    events,
    scorer,
    days,
    series: compressSeries(points),
    final,
    coverage: coverage({ country, assessment: input.assessment, events, date }, scoring),
  }
}
