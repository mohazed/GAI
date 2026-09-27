import type { Strip, StripRow } from '../lib/countries'
import { signedInt } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'
import { BandChip } from './BandChip'

export interface RankingStripProps {
  lang: Lang
  methodology: SiteMethodology
  /** `rankingStrip()` of lib/countries.ts: the first and last positions. */
  strip: Strip
  /** Number of scored countries. */
  total: number
}

/**
 * The home page's ranking strip (docs/05 §6): the five highest and five lowest positions as one
 * table (position, country, score, band), with a row marking the positions between them. Score
 * mode only (D-16); on phones it stands in for the map (docs/05 §5 WorldMap).
 */
export function RankingStrip({ lang, methodology, strip, total }: RankingStripProps) {
  const t = getT(lang)
  const band = (id: string) => methodology.bands.find((b) => b.id === id)
  const row = (c: StripRow) => {
    const b = band(c.band)
    return (
      <tr key={c.iso3}>
        <td className="w-8 border-t border-rule py-1.5 pe-3 font-mono text-m13 text-ink-2">
          {c.position}
        </td>
        <th scope="row" className="border-t border-rule py-1.5 pe-3 text-start font-normal">
          <a href={`/${lang}/country/${c.iso3}/`}>{c.name[lang]}</a>
        </th>
        <td className="border-t border-rule py-1.5 pe-3 text-end font-mono text-m13 font-semibold">
          <span className="num">{signedInt(c.display, lang)}</span>
        </td>
        <td className="border-t border-rule py-1.5">
          {b ? <BandChip lang={lang} band={b} /> : null}
        </td>
      </tr>
    )
  }
  if (total === 0) return <p className="text-16 text-ink-2">{t('rank.none')}</p>
  return (
    <table className="w-full max-w-xl border-separate border-spacing-0 text-14">
      <caption className="sr-only">{t('home.stripCaption', { total })}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">{t('rank.cols.position')}</th>
          <th scope="col">{t('rank.cols.country')}</th>
          <th scope="col">{t('rank.cols.score')}</th>
          <th scope="col">{t('rank.cols.band')}</th>
        </tr>
      </thead>
      <tbody>
        {strip.top.map(row)}
        {strip.gap ? (
          <tr>
            <td colSpan={4} className="border-t border-rule py-1.5 text-12 text-ink-2">
              {t('home.stripGap', { count: total - strip.top.length - strip.bottom.length })}
            </td>
          </tr>
        ) : null}
        {strip.bottom.map(row)}
      </tbody>
    </table>
  )
}
