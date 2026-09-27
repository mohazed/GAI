import type { ApiMover, ApiMovers } from '@gai/schema/api'
import { signedInt } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'

export interface MoversProps {
  lang: Lang
  /** `changes/latest.json` `movers.d7` (docs/05 §6 Home "Moved this week"). */
  movers: ApiMovers
  /** How many rises and falls to list (docs/05: five each). */
  max?: number
  /** Heading level of the "Up" and "Down" lists. */
  level?: 3 | 4
}

/**
 * The largest rises and falls of the integer display score over a window (movers of
 * changes/latest.json, largest first), each as a small table: country, change, score from and to.
 * Rises and falls use one layout; only the sign of the change differs. Score mode only (D-16).
 */
export function Movers({ lang, movers, max = 5, level = 3 }: MoversProps) {
  const t = getT(lang)
  const up = movers.up.slice(0, max)
  const down = movers.down.slice(0, max)
  if (up.length === 0 && down.length === 0) {
    return <p className="text-16 text-ink-2">{t('home.moversNone')}</p>
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <MoverTable lang={lang} rows={up} title={t('home.up')} level={level} />
      <MoverTable lang={lang} rows={down} title={t('home.down')} level={level} />
    </div>
  )
}

function MoverTable({
  lang,
  rows,
  title,
  level,
}: {
  lang: Lang
  rows: ApiMover[]
  title: string
  level: 3 | 4
}) {
  const t = getT(lang)
  const H = level === 3 ? 'h3' : 'h4'
  return (
    <div className="flex flex-col gap-2">
      <H className="text-14 font-semibold">{title}</H>
      {rows.length === 0 ? (
        <p className="text-14 text-ink-2">{t('home.moversNoneDir')}</p>
      ) : (
        <table className="w-full border-separate border-spacing-0 text-14">
          <thead className="sr-only">
            <tr>
              <th scope="col">{t('home.moverCols.country')}</th>
              <th scope="col">{t('home.moverCols.change')}</th>
              <th scope="col">{t('home.moverCols.score')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.iso3}>
                <th scope="row" className="border-t border-rule py-1.5 pe-3 text-start font-normal">
                  <a href={`/${lang}/country/${m.iso3}/`}>{m.name[lang]}</a>
                </th>
                <td className="border-t border-rule py-1.5 pe-3 text-end font-mono text-m13 font-semibold">
                  <span className="num">{signedInt(m.display_delta, lang)}</span>
                </td>
                <td className="border-t border-rule py-1.5 text-end font-mono text-m12 whitespace-nowrap text-ink-2">
                  <span className="sr-only">
                    {t('home.moverFromTo', {
                      from: signedInt(m.display_from, lang),
                      to: signedInt(m.display_to, lang),
                    })}
                  </span>
                  <span aria-hidden="true">
                    <span className="num">{signedInt(m.display_from, lang)}</span>
                    {' → '}
                    <span className="num">{signedInt(m.display_to, lang)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
