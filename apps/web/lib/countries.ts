/**
 * What the home and ranking pages take from countries.json and changes/latest.json, besides the
 * ranking rows (lib/rank.ts). Values are copied from the API; nothing here restates a scoring rule.
 */
import type {
  ApiChangesLatestFile,
  ApiCountriesFile,
  ApiFeedEntry,
  ApiScoredCountry,
} from '@gai/schema/api'
import type { SearchCountry } from '../components/SearchBox'
import type { MapCountry } from '../components/WorldMap'

/**
 * The WorldMap's countries: band and integer score (score mode), coverage ratio (scorecard mode),
 * and `noExportData` when A1 and A2 are both no-data (hatched when the score is hidden, B-81).
 */
export function mapCountries(file: ApiCountriesFile): MapCountry[] {
  return file.countries.map((c) =>
    c.excluded
      ? {
          iso3: c.iso3,
          name: c.name,
          excluded: true,
          band: null,
          display: null,
          coverage: null,
          noExportData: false,
        }
      : {
          iso3: c.iso3,
          name: c.name,
          excluded: false,
          band: c.band,
          display: c.score_display,
          coverage: c.coverage.ratio,
          noExportData:
            c.coverage.statuses.A1 === 'no-data' && c.coverage.statuses.A2 === 'no-data',
        },
  )
}

/** Every registry entry, excluded ones included (each has a page). */
export function searchCountries(file: ApiCountriesFile): SearchCountry[] {
  return file.countries.map((c) => ({ iso3: c.iso3, name: c.name }))
}

/**
 * Scored countries in ranking order: score in full precision, highest first, equal scores by
 * ISO3, as the ranking table positions them and as dumps/countries.csv lists them.
 */
export function rankingOrder(file: ApiCountriesFile): ApiScoredCountry[] {
  return file.countries
    .filter((c): c is ApiScoredCountry => !c.excluded)
    .sort((a, b) => b.score - a.score || (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0))
}

export interface StripRow {
  position: number
  iso3: string
  name: { en: string; fr: string }
  /** Integer display score and band, as published. */
  display: number
  band: string
}

export interface Strip {
  top: StripRow[]
  bottom: StripRow[]
  /** Positions lie between the two groups. */
  gap: boolean
}

/**
 * The first and the last `n` of countries already in ranking order; with 2n countries or fewer
 * every one is listed once, in `top`.
 */
export function stripFrom(ordered: readonly Omit<StripRow, 'position'>[], n = 5): Strip {
  const rows = ordered.map((r, i) => ({ ...r, position: i + 1 }))
  if (rows.length <= 2 * n) return { top: rows, bottom: [], gap: false }
  return { top: rows.slice(0, n), bottom: rows.slice(-n), gap: true }
}

/** The home page's ranking strip (docs/05 §6): the five highest and five lowest positions. */
export function rankingStrip(file: ApiCountriesFile, n = 5): Strip {
  return stripFrom(
    rankingOrder(file).map((c) => ({
      iso3: c.iso3,
      name: c.name,
      display: c.score_display,
      band: c.band,
    })),
    n,
  )
}

/**
 * "Changed this week" (docs/05 §6 Home): the entries of `recent` dated after the start of the
 * seven-day window of `movers.d7` and on or before the build date, newest first, the first `max`
 * of them; `total` counts every such entry in `weeks` (which hold the window in full; `recent`
 * stops at 20). Both leave out computed values whose points did not change.
 */
export function changedThisWeek(
  latest: ApiChangesLatestFile,
  max = 8,
): { entries: ApiFeedEntry[]; total: number } {
  const { from, to } = latest.movers.d7
  const inWindow = (e: ApiFeedEntry) => e.date > from && e.date <= to && e.points_changed
  const total = latest.weeks.flatMap((w) => w.entries).filter(inWindow).length
  return { entries: latest.recent.filter(inWindow).slice(0, max), total }
}
