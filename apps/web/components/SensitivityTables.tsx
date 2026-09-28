import type { ApiSensitivityFile, ApiSensitivityVariant } from '@gai/schema/api'
import { longDate, plain, signedInt } from '../lib/format'
import { getT, type Lang, type T } from '../lib/i18n'
import type { LangText } from '../lib/methodology'

type Table = ApiSensitivityFile['tables'][number]

/** The setting a variant changes, in words ("Penalty 5", "Weight of A at 0.5"). */
export function variantLabel(v: ApiSensitivityVariant, lang: Lang, t: T): string {
  const p = v.params
  if (p.passivity_points !== null)
    return t('sensitivity.variant.passivity', { points: plain(p.passivity_points, lang, 0) })
  if (p.weights !== null) {
    const [category, value] = Object.entries(p.weights).find(([, w]) => w !== null) ?? ['?', null]
    return t('sensitivity.variant.weight', {
      category,
      value: value === null ? '?' : plain(value, lang, 1),
    })
  }
  if (p.confidence_weights !== null)
    return t('sensitivity.variant.reported', {
      value: plain(p.confidence_weights.reported, lang, 1),
    })
  if (p.exclude_indicators !== null)
    return t('sensitivity.variant.excluded', { indicators: p.exclude_indicators.join(', ') })
  if (p.decay !== null) return t('sensitivity.variant.decay')
  return v.id
}

/**
 * The sensitivity tables of docs/02 §10 (sensitivity.json), rendered as tables on the methodology
 * page in score mode: for each table, one row per setting with its Spearman rank correlation and
 * the number of display scores it changes; then, collapsed, the full ranking with the display
 * score and rank of every country by default and under each setting. Scorecard mode shows none of
 * this, because each table is a ranking (D-16; the methodology says so).
 */
export function SensitivityTables({
  lang,
  data,
  names,
  idPrefix = 'sens-',
}: {
  lang: Lang
  data: ApiSensitivityFile
  names: Record<string, LangText>
  /** Prefix of the table headings' ids (the kit shows the tables more than once). */
  idPrefix?: string
}) {
  const t = getT(lang)
  const rank = (r: number) => plain(r, lang, r % 1 === 0 ? 0 : 1)
  const rho = (s: number | null) => (s === null ? t('sensitivity.none') : plain(s, lang, 3))
  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-prose text-16 text-ink-2">
        {t('sensitivity.intro', { date: longDate(data.build_date, lang), n: data.n })}
      </p>
      {data.tables.map((table: Table) => {
        const title = t(`sensitivity.tables.${table.id}`)
        const byVariant = table.variants.map(
          (v) => new Map(v.ranking.map((r) => [r.iso3, r] as const)),
        )
        return (
          <section
            key={table.id}
            aria-labelledby={`${idPrefix}${table.id}`}
            className="flex flex-col gap-4"
          >
            <h3 id={`${idPrefix}${table.id}`} className="text-18 font-semibold">
              {title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-14">
                <caption className="mb-2 text-start text-14 text-ink-2">
                  {t('sensitivity.summaryCaption', { table: title, n: data.n })}
                </caption>
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="py-2 pe-4 text-start font-semibold">
                      {t('sensitivity.cols.variant')}
                    </th>
                    <th scope="col" className="py-2 pe-4 text-end font-semibold">
                      {t('sensitivity.cols.spearman')}
                    </th>
                    <th scope="col" className="py-2 text-end font-semibold">
                      {t('sensitivity.cols.changed')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.variants.map((v) => (
                    <tr key={v.id} className="border-b border-rule">
                      <th scope="row" className="py-2 pe-4 text-start font-normal">
                        {variantLabel(v, lang, t)}
                      </th>
                      <td className="py-2 pe-4 text-end font-mono text-m13">{rho(v.spearman)}</td>
                      <td className="py-2 text-end font-mono text-m13">{v.changed_display}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details className="group">
              <summary className="text-14">{t('sensitivity.full')}</summary>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-14">
                  <caption className="mb-2 text-start text-14 text-ink-2">
                    {t('sensitivity.fullCaption', { table: title })}
                  </caption>
                  <thead>
                    <tr className="border-b border-ink">
                      <th scope="col" className="py-2 pe-4 text-start font-semibold">
                        {t('sensitivity.cols.country')}
                      </th>
                      <th scope="col" className="py-2 pe-4 text-end font-semibold">
                        {t('sensitivity.cols.default')}
                      </th>
                      {table.variants.map((v) => (
                        <th key={v.id} scope="col" className="py-2 pe-4 text-end font-semibold">
                          {variantLabel(v, lang, t)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.baseline.map((b) => (
                      <tr key={b.iso3} className="border-b border-rule">
                        <th scope="row" className="py-1 pe-4 text-start font-normal">
                          {names[b.iso3]?.[lang] ?? b.iso3}{' '}
                          <span className="font-mono text-m11 text-ink-2">{b.iso3}</span>
                        </th>
                        <td className="py-1 pe-4 text-end font-mono text-m13">
                          <span className="num">{signedInt(b.score_display, lang)}</span> (
                          {rank(b.rank)})
                        </td>
                        {byVariant.map((m, k) => {
                          const r = m.get(b.iso3)
                          return (
                            <td
                              // biome-ignore lint/suspicious/noArrayIndexKey: variant order.
                              key={k}
                              className="py-1 pe-4 text-end font-mono text-m13"
                            >
                              {r === undefined ? (
                                '—'
                              ) : (
                                <>
                                  <span className="num">{signedInt(r.score_display, lang)}</span> (
                                  {rank(r.rank)})
                                </>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>
        )
      })}
    </div>
  )
}
