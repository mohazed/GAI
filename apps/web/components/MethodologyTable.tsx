import type { ApiMethodologyFile } from '@gai/schema/api'
import { formatSigned } from '@gai/scoring'
import { plain } from '../lib/format'
import { getT, type Lang, type T } from '../lib/i18n'

type Indicator = ApiMethodologyFile['indicators']['indicators'][number]

/** The points rule of an indicator in words, from indicators.yaml (docs/02 §4). */
export function pointsText(ind: Indicator, lang: Lang, t: T): string {
  const p = ind.points
  const s = (v: number) => formatSigned(v, lang, 1)
  const cap =
    ind.indicator_cap === null
      ? ''
      : t('methodology.cap', {
          cap: [ind.indicator_cap.min, ind.indicator_cap.max]
            .filter((v): v is number => v !== null)
            .map(s)
            .join(' … '),
        })
  switch (p.kind) {
    case 'fixed':
      return s(p.value) + cap
    case 'per_instance':
      return (
        (p.value !== undefined
          ? t('methodology.each', { value: s(p.value) })
          : (p.tiers ?? []).map((tier) => `${tier.label[lang]} ${s(tier.value)}`).join(' · ')) + cap
      )
    case 'tiers':
      return p.tiers.map((tier) => `${tier.label[lang]} ${s(tier.value)}`).join(' · ') + cap
    case 'formula':
      return t('methodology.formula', {
        ref: p.ref,
        min: s(p.range.min),
        max: s(p.range.max),
      })
  }
}

/**
 * The indicator table rendered from a methodology version (docs/05 §5 MethodologyTable): one
 * group per category with its caps, one row per indicator with type, points and cadence.
 */
export function MethodologyTable({ lang, file }: { lang: Lang; file: ApiMethodologyFile }) {
  const t = getT(lang)
  return (
    <table className="w-full border-collapse text-14">
      <caption className="mb-2 text-start text-14 text-ink-2">
        {t('methodology.caption', { version: file.version })}
      </caption>
      <thead>
        <tr className="border-b border-ink">
          <th scope="col" className="py-2 pe-4 text-start font-semibold">
            {t('methodology.cols.id')}
          </th>
          <th scope="col" className="py-2 pe-4 text-start font-semibold">
            {t('methodology.cols.indicator')}
          </th>
          <th scope="col" className="hidden py-2 pe-4 text-start font-semibold md:table-cell">
            {t('methodology.cols.type')}
          </th>
          <th scope="col" className="py-2 pe-4 text-start font-semibold">
            {t('methodology.cols.points')}
          </th>
          <th scope="col" className="hidden py-2 text-start font-semibold md:table-cell">
            {t('methodology.cols.cadence')}
          </th>
        </tr>
      </thead>
      {file.categories.categories.map((cat) => (
        <tbody key={cat.id}>
          <tr>
            <th scope="colgroup" colSpan={5} className="border-b border-rule pt-6 pb-2 text-start">
              <span className="font-semibold">
                {cat.id} · {cat.name[lang]}
              </span>
              <span className="num ms-3 font-mono text-m12 text-ink-2">
                {`${plain(cat.cap.min, lang, 0)} … +${plain(cat.cap.max, lang, 0)}`}
              </span>
              {!cat.scored ? (
                <span className="ms-3 text-12 text-ink-3">{t('categories.experimental')}</span>
              ) : null}
            </th>
          </tr>
          {file.indicators.indicators
            .filter((i) => i.category === cat.id)
            .map((i) => (
              <tr key={i.id} id={`indicator-${i.id}`} className="border-b border-rule align-top">
                <th scope="row" className="py-2 pe-4 text-start font-mono text-m13 font-normal">
                  {i.id}
                </th>
                <td className="py-2 pe-4">
                  {i.name[lang]}
                  {!i.scored ? (
                    <span className="block text-12 text-ink-3">{t('methodology.notScored')}</span>
                  ) : null}
                </td>
                <td className="hidden py-2 pe-4 md:table-cell">
                  {t(`methodology.types.${i.type}`)}
                </td>
                <td className="py-2 pe-4 text-14">{pointsText(i, lang, t)}</td>
                <td className="hidden py-2 md:table-cell">
                  {file.indicators.cadences[i.cadence]?.[lang] ?? i.cadence}
                </td>
              </tr>
            ))}
        </tbody>
      ))}
    </table>
  )
}
