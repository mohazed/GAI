import { formatSigned } from '@gai/scoring'
import { getT, type Lang } from '../lib/i18n'
import type { LangText } from '../lib/methodology'

export interface DiffRow {
  iso3: string
  name: LangText
  /** Integer display scores under the two versions. */
  old: number
  new: number
  /** What moved it: indicator ids or threshold names, in words. */
  cause: LangText
}

/**
 * Scores under two methodology versions (docs/05 §5 DiffViewer, docs/02 §11): country, old
 * score, new score, cause. Only countries whose score changed are listed.
 */
export function DiffViewer({
  lang,
  from,
  to,
  rows,
}: {
  lang: Lang
  from: string | null
  to: string
  rows: DiffRow[]
}) {
  const t = getT(lang)
  if (from === null) return <p className="text-14 text-ink-2">{t('diff.none')}</p>
  if (rows.length === 0)
    return <p className="text-14 text-ink-2">{t('diff.unchanged', { from, to })}</p>
  return (
    <table className="w-full border-collapse text-14">
      <caption className="mb-2 text-start text-14 text-ink-2">
        {t('diff.caption', { from, to })}
      </caption>
      <thead>
        <tr className="border-b border-ink">
          <th scope="col" className="py-2 pe-4 text-start font-semibold">
            {t('diff.country')}
          </th>
          <th scope="col" className="py-2 pe-4 text-end font-semibold">
            {from}
          </th>
          <th scope="col" className="py-2 pe-4 text-end font-semibold">
            {to}
          </th>
          <th scope="col" className="py-2 text-start font-semibold">
            {t('diff.cause')}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.iso3} className="border-b border-rule">
            <th scope="row" className="py-2 pe-4 text-start font-normal">
              {r.name[lang]} <span className="font-mono text-m11 text-ink-2">{r.iso3}</span>
            </th>
            <td className="py-2 pe-4 text-end font-mono text-m13">
              <span className="num">{formatSigned(r.old, lang, 0)}</span>
            </td>
            <td className="py-2 pe-4 text-end font-mono text-m13">
              <span className="num">{formatSigned(r.new, lang, 0)}</span>
            </td>
            <td className="py-2">{r.cause[lang]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
