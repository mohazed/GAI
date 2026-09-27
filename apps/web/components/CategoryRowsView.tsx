import type { ApiCategory } from '@gai/schema/api'
import { formatInteger, plain, signed } from '../lib/format'
import type { Lang } from '../lib/i18n'
import { pct, valuePercent } from '../lib/linear'
import type { CategoryKey, SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { Translate } from '../lib/translate'

export interface CategoryRowsProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  /** The country's category subtotals (`categories` of the API). */
  categories: Record<CategoryKey, ApiCategory>
  /** Published events by category (scorecard mode, D-16). */
  counts: Record<CategoryKey, number>
}

export interface CategoryRowsViewProps extends CategoryRowsProps {
  t: Translate
}

function capRange(min: number, max: number, lang: Lang): string {
  return `${plain(min, lang, 0)} … +${plain(max, lang, 0)}`
}

/**
 * Five rows, A to E (docs/05 §5 CategoryRows): each an axis from the category's lower cap to its
 * upper cap with 0 marked, a bar from 0 to the clipped subtotal, and, when the raw subtotal is
 * beyond the cap, a hairline outline on to the raw value marked "capped". E is drawn in ink-3 as
 * experimental and not scored (D-12). Scorecard mode shows event counts instead of subtotals.
 * Shared by the server (CategoryRows) and the `?date=` snapshot in the browser.
 */
export function CategoryRowsView({
  lang,
  mode,
  methodology,
  categories,
  counts,
  t,
}: CategoryRowsViewProps) {
  const scoreMode = mode === 'score'
  return (
    <table className="w-full border-collapse text-14">
      <caption className="sr-only">
        {scoreMode ? t('categories.caption') : t('categories.captionScorecard')}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">{t('categories.category')}</th>
          {scoreMode ? <th scope="col">{t('categories.chart')}</th> : null}
          <th scope="col">{scoreMode ? t('categories.subtotal') : t('categories.events')}</th>
        </tr>
      </thead>
      <tbody>
        {methodology.categories.map((spec) => {
          const c = categories[spec.id]
          const muted = !spec.scored
          const ink = muted ? 'text-ink-3' : 'text-ink'
          return (
            <tr key={spec.id} className="border-t border-rule first:border-t-0">
              <th
                scope="row"
                className={`w-28 py-2 pe-3 text-start align-top font-normal md:w-44 md:pe-4 md:whitespace-nowrap ${ink}`}
              >
                <span className="font-semibold">
                  <span className="font-mono text-m13">{spec.id}</span> {spec.short[lang]}
                </span>
                {scoreMode ? (
                  <span className="num block font-mono text-m11 text-ink-2">
                    {capRange(spec.cap.min, spec.cap.max, lang)}
                  </span>
                ) : null}
                {muted ? (
                  <span className="block text-12 whitespace-normal text-ink-3">
                    {t('categories.experimental')}
                  </span>
                ) : null}
              </th>
              {scoreMode ? (
                <td className="w-full py-2 align-middle">
                  <CategoryAxis category={c} muted={muted} />
                </td>
              ) : null}
              <td
                className={`w-20 py-2 ps-3 text-end align-top md:w-auto md:ps-4 md:whitespace-nowrap ${scoreMode ? 'font-mono text-m13' : 'text-14'} ${ink}`}
              >
                {scoreMode ? (
                  <>
                    <span className="num font-semibold whitespace-nowrap">
                      {signed(c.clipped, lang)}
                    </span>
                    {c.capped ? (
                      <span className="block text-m11 text-ink-2">
                        {t('categories.capped')}{' '}
                        <span className="num whitespace-nowrap">{signed(c.raw, lang)}</span>
                      </span>
                    ) : null}
                  </>
                ) : (
                  t('categories.count', {
                    count: counts[spec.id],
                    n: formatInteger(counts[spec.id], lang),
                  })
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function CategoryAxis({ category, muted }: { category: ApiCategory; muted: boolean }) {
  const lo = Math.min(category.cap.min, category.raw)
  const hi = Math.max(category.cap.max, category.raw)
  const x = valuePercent([lo, hi])
  const x0 = x(0)
  const xc = x(category.clipped)
  const xr = x(category.raw)
  const fill = muted ? 'fill-ink-3' : 'fill-ink'
  const stroke = muted ? 'stroke-ink-3' : 'stroke-ink'
  return (
    <svg width="100%" height="24" aria-hidden="true" className="block min-w-16 ltr">
      <line
        x1={pct(x(category.cap.min))}
        x2={pct(x(category.cap.max))}
        y1={12}
        y2={12}
        className="stroke-rule"
        strokeWidth={1}
      />
      <line
        x1={pct(x(category.cap.min))}
        x2={pct(x(category.cap.min))}
        y1={8}
        y2={16}
        className="stroke-rule"
        strokeWidth={1}
      />
      <line
        x1={pct(x(category.cap.max))}
        x2={pct(x(category.cap.max))}
        y1={8}
        y2={16}
        className="stroke-rule"
        strokeWidth={1}
      />
      <rect
        x={pct(Math.min(x0, xc))}
        width={pct(Math.abs(xc - x0))}
        y={7}
        height={10}
        className={fill}
      />
      {category.capped ? (
        <rect
          x={pct(Math.min(xc, xr))}
          width={pct(Math.abs(xr - xc))}
          y={7.5}
          height={9}
          className={`fill-transparent ${stroke}`}
          strokeWidth={1}
        />
      ) : null}
      <line x1={pct(x0)} x2={pct(x0)} y1={3} y2={21} className={stroke} strokeWidth={1} />
    </svg>
  )
}
