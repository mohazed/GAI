import { pct, valuePercent } from '../lib/chart'
import { percent, signedInt } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import { mapGeometry } from '../lib/map'
import { bandSegments, type LangText, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { BandChip } from './BandChip'
import { HATCH } from './SvgDefs'
import { TooltipLayer } from './TooltipLayer'

export interface MapCountry {
  iso3: string
  name: LangText
  excluded: boolean
  /** Score mode: band and integer score; null for excluded entities. */
  band: string | null
  display: number | null
  /** Coverage ratio (scorecard mode fill); null for excluded entities. */
  coverage: number | null
  /** A1 and A2 are both no-data: hatched in scorecard mode (docs/05 §5 WorldMap). */
  noExportData: boolean
}

export interface WorldMapProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  countries: MapCountry[]
}

/** Coverage bins of the scorecard-mode fill: ink at four opacities (docs/05 §5 WorldMap). */
export const COVERAGE_BINS = [
  { min: 0, max: 0.25, opacity: 0.12 },
  { min: 0.25, max: 0.5, opacity: 0.3 },
  { min: 0.5, max: 0.75, opacity: 0.55 },
  { min: 0.75, max: 1.0001, opacity: 0.85 },
] as const

function coverageOpacity(ratio: number): number {
  return (COVERAGE_BINS.find((b) => ratio >= b.min && ratio < b.max) ?? COVERAGE_BINS[3]).opacity
}

/**
 * The world in Equal Earth, countries filled by band (score mode) or by coverage in ink tints
 * (scorecard mode, D-16); excluded entities and countries with no export data at all are hatched;
 * territories outside the index keep the neutral fill (docs/05 §5 WorldMap, D-20). Server-rendered
 * SVG: each country links to its page and names itself in a native tooltip without JavaScript.
 * The map is a picture of the ranking table, which carries the same data for screen readers and
 * keyboards; its links are therefore out of the tab order.
 */
export function WorldMap({ lang, mode, methodology, countries }: WorldMapProps) {
  const t = getT(lang)
  const geo = mapGeometry()
  const byIso = new Map(countries.map((c) => [c.iso3, c]))
  const scoreMode = mode === 'score'
  const groups = new Map<string, string[]>()
  for (const s of geo.shapes) groups.set(s.id, [...(groups.get(s.id) ?? []), s.d])

  const outside: string[] = []
  const inside: { c: MapCountry; paths: string[] }[] = []
  for (const [id, paths] of groups) {
    const c = byIso.get(id)
    if (c === undefined) outside.push(...paths)
    else inside.push({ c, paths })
  }
  inside.sort((a, b) => (a.c.iso3 < b.c.iso3 ? -1 : 1))

  const tipOf = (c: MapCountry): string => {
    if (c.excluded) return `${c.name[lang]} · ${t('map.excluded')}`
    if (scoreMode && c.display !== null && c.band !== null) {
      const band = methodology.bands.find((b) => b.id === c.band)
      return `${c.name[lang]} · ${signedInt(c.display, lang)} · ${band?.name[lang] ?? ''}`
    }
    return `${c.name[lang]} · ${t('map.coverage', { pct: percent(c.coverage ?? 0, lang) })}`
  }

  return (
    <figure className="flex flex-col gap-4">
      <p className="sr-only">{scoreMode ? t('map.srScore') : t('map.srScorecard')}</p>
      <TooltipLayer>
        <svg
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          width="100%"
          aria-hidden="true"
          className="block h-auto ltr"
        >
          <g className="fill-paper-2 stroke-paper" strokeWidth={0.5}>
            {outside.map((d, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static geometry, fixed order.
              <path key={i} d={d} className="non-scaling" />
            ))}
          </g>
          {inside.map(({ c, paths }) => {
            // docs/05 §5: no export data is hatched only where the score is hidden (scorecard mode).
            const hatched = c.excluded || (c.noExportData && !scoreMode)
            const cls = hatched
              ? 'stroke-paper'
              : scoreMode && c.band !== null
                ? `band-${c.band} fill-band stroke-paper`
                : 'fill-ink stroke-paper'
            const opacity = !hatched && !scoreMode ? coverageOpacity(c.coverage ?? 0) : undefined
            const tip = tipOf(c)
            return (
              <a
                key={c.iso3}
                href={`/${lang}/country/${c.iso3}/`}
                tabIndex={-1}
                data-tip={tip}
                className="map-country"
              >
                <title>{tip}</title>
                {paths.map((d, i) => (
                  <path
                    // biome-ignore lint/suspicious/noArrayIndexKey: static geometry, fixed order.
                    key={i}
                    d={d}
                    className={`non-scaling ${cls}`}
                    fill={hatched ? HATCH : undefined}
                    fillOpacity={opacity}
                    strokeWidth={0.5}
                  />
                ))}
              </a>
            )
          })}
        </svg>
      </TooltipLayer>
      <MapLegend lang={lang} mode={mode} methodology={methodology} />
    </figure>
  )
}

/** Band strip without a marker and the band names, or the coverage bins (docs/05 §5 WorldMap). */
export function MapLegend({
  lang,
  mode,
  methodology,
}: {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
}) {
  const t = getT(lang)
  const x = valuePercent([methodology.scoreClip.min, methodology.scoreClip.max])
  return (
    <figcaption className="flex flex-col gap-2 text-12 text-ink-2">
      {mode === 'score' ? (
        <>
          <svg width="100%" height="8" aria-hidden="true" className="block max-w-96 ltr">
            {bandSegments(methodology.bands, methodology.scoreClip).map((s) => (
              <rect
                key={s.band.id}
                x={pct(x(s.from))}
                width={pct(x(s.to) - x(s.from))}
                y={0}
                height={8}
                className={`band-${s.band.id} fill-band stroke-paper`}
                strokeWidth={1}
              />
            ))}
          </svg>
          <ul className="flex flex-wrap gap-2">
            {methodology.bands.map((b) => (
              <li key={b.id}>
                <BandChip lang={lang} band={b} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li>{t('map.coverageLegend')}</li>
          {COVERAGE_BINS.map((b) => (
            <li key={b.min} className="flex items-center gap-1">
              <svg width="16" height="10" aria-hidden="true">
                <rect width="16" height="10" className="fill-ink" fillOpacity={b.opacity} />
              </svg>
              {t('map.bin', {
                from: percent(b.min, lang),
                to: percent(Math.min(b.max, 1), lang),
              })}
            </li>
          ))}
        </ul>
      )}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <li className="flex items-center gap-1">
          <svg width="16" height="10" aria-hidden="true">
            <rect width="16" height="10" fill={HATCH} />
          </svg>
          {t('map.hatched')}
        </li>
        <li className="flex items-center gap-1">
          <svg width="16" height="10" aria-hidden="true">
            <rect width="16" height="10" className="fill-paper-2" />
          </svg>
          {t('map.outside')}
        </li>
      </ul>
    </figcaption>
  )
}
