/**
 * GNI (Atlas method, current USD) and population from the World Bank API (docs/06 §2), the
 * denominators of D1 (docs/02 §5). One archived response per indicator, the most recent non-empty
 * value of every economy (`mrnev=1`), kept for the entries of the universe only; aggregates and
 * territories outside it are dropped. The latest year differs between countries.
 */
import { archiveDataset, type DatasetContext, jsonAccept, jsonOfDataset } from '../lib/dataset.js'
import { mergeRows, readTable, writeTable } from '../lib/files.js'
import { UNIVERSE_ISO3 } from '../universe.js'

export const WB_INDICATORS = {
  gni: { code: 'NY.GNP.ATLS.CD', label: 'GNI, Atlas method (current US$)', slug: 'gni-atlas' },
  population: { code: 'SP.POP.TOTL', label: 'Population, total', slug: 'population' },
} as const

export const wbUrl = (code: string): string =>
  `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&mrnev=1&per_page=500`

export interface WbValue {
  iso3: string
  year: number
  value: number
}

/** The values of one archived response for the universe entries; throws on another shape. */
export function parseWorldBank(
  json: unknown,
  code: string,
  universe: ReadonlySet<string>,
): { values: WbValue[]; missing: string[] } {
  if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
    throw new Error(`${code}: not a World Bank API v2 response`)
  }
  const meta = json[0] as { pages?: unknown }
  if (Number(meta?.pages) !== 1)
    throw new Error(`${code}: the response has ${String(meta?.pages)} pages, expected 1`)
  const values: WbValue[] = []
  for (const r of json[1] as {
    countryiso3code?: unknown
    date?: unknown
    value?: unknown
    indicator?: { id?: unknown }
  }[]) {
    if (r.indicator?.id !== code)
      throw new Error(`${code}: row of indicator ${String(r.indicator?.id)}`)
    const iso3 = typeof r.countryiso3code === 'string' ? r.countryiso3code : ''
    if (!universe.has(iso3) || typeof r.value !== 'number' || !Number.isFinite(r.value)) continue
    const year = Number(r.date)
    if (!Number.isInteger(year)) continue
    values.push({ iso3, year, value: r.value })
  }
  const found = new Set(values.map((v) => v.iso3))
  return { values, missing: [...universe].filter((c) => !found.has(c)).sort() }
}

export interface WbRunResult {
  ok: boolean
  report: string[]
}

export async function runFetchWorldBank(
  ctx: DatasetContext,
  universe: ReadonlySet<string> = UNIVERSE_ISO3,
): Promise<WbRunResult> {
  const report: string[] = []
  let ok = true
  for (const [table, spec] of [
    ['gni.csv', WB_INDICATORS.gni],
    ['population.csv', WB_INDICATORS.population],
  ] as const) {
    const url = wbUrl(spec.code)
    const d = await archiveDataset(ctx, {
      url,
      segments: ['worldbank', spec.slug],
      title: `World Bank API v2, ${spec.label} (${spec.code}), most recent value per economy`,
      publisher: 'World Bank',
      accept: jsonAccept((j) =>
        Array.isArray(j) && Array.isArray(j[1]) ? null : 'not a World Bank data response',
      ),
    })
    if (!d.ok) {
      ok = false
      report.push(`${table}: NOT written; ${url} could not be archived: ${d.reason}`)
      continue
    }
    const { values, missing } = parseWorldBank(jsonOfDataset(d), spec.code, universe)
    const rows = values.map((v) =>
      table === 'gni.csv'
        ? { iso3: v.iso3, year: v.year, gni_atlas_usd: Math.round(v.value), source: d.source.id }
        : { iso3: v.iso3, year: v.year, population: Math.round(v.value), source: d.source.id },
    )
    const merged = mergeRows(readTable(ctx.root, table), rows, ['iso3', 'year'])
    writeTable(ctx.root, table, merged, ['iso3', 'year'])
    const years = new Map<number, number>()
    for (const v of values) years.set(v.year, (years.get(v.year) ?? 0) + 1)
    report.push(
      `${table}: ${rows.length} countries from ${d.source.id}; latest year ${[...years]
        .sort((a, b) => b[0] - a[0])
        .map(([y, n]) => `${y} (${n})`)
        .join(', ')}`,
    )
    report.push(`  no value for ${missing.length}: ${missing.join(', ') || '—'}`)
    const old = values.filter((v) => v.year < 2023).sort((a, b) => a.year - b.year)
    if (old.length > 0)
      report.push(
        `  latest value older than 2023: ${old.map((v) => `${v.iso3} ${v.year}`).join(', ')}`,
      )
  }
  return { ok, report }
}
