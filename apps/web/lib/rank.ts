/**
 * Rows of the ranking table, taken from countries.json (docs/05 §5 RankTable). Scores, bands,
 * clipped subtotals (full precision) and the passivity value are copied from the API as they are;
 * the table recombines them only through @gai/scoring's `userScore` when a reader changes the
 * weights (docs/02 §9).
 */
import type { ApiCountriesFile } from '@gai/schema/api'
import type { CategoryKey, LangText } from './methodology'

export interface RankRow {
  iso3: string
  name: LangText
  region: string
  memberOf: string[]
  excluded: boolean
  excludedReason: LangText | null
  /** Scored countries only (null for excluded entities). */
  score: number | null
  display: number | null
  band: string | null
  clipped: Record<CategoryKey, number> | null
  passivityValue: number | null
  coverage: number | null
  /** Assessment status of each scored indicator, for the micro bar. */
  statuses: Record<string, string> | null
  lastChange: string | null
  events: number | null
}

export function rankRows(file: ApiCountriesFile): RankRow[] {
  return file.countries.map((c) => {
    if (c.excluded) {
      return {
        iso3: c.iso3,
        name: c.name,
        region: c.region,
        memberOf: [...c.member_of],
        excluded: true,
        excludedReason: c.excluded_reason,
        score: null,
        display: null,
        band: null,
        clipped: null,
        passivityValue: null,
        coverage: null,
        statuses: null,
        lastChange: null,
        events: null,
      }
    }
    return {
      iso3: c.iso3,
      name: c.name,
      region: c.region,
      memberOf: [...c.member_of],
      excluded: false,
      excludedReason: null,
      score: c.score,
      display: c.score_display,
      band: c.band,
      clipped: {
        A: c.categories.A.clipped,
        B: c.categories.B.clipped,
        C: c.categories.C.clipped,
        D: c.categories.D.clipped,
        E: c.categories.E.clipped,
      },
      passivityValue: c.passivity.value,
      coverage: c.coverage.ratio,
      statuses: { ...c.coverage.statuses },
      lastChange: c.last_change?.date ?? null,
      events: c.events.total,
    }
  })
}
