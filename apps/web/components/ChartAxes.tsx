/**
 * The axes and the score grid of the Timeline and the CompareChart (docs/05 §5, §8), apart from
 * both so that the Compare page's client chart can use them: nothing here imports the message
 * files (lib/i18n.ts).
 */
import { datePercent, pct, quarterTicks, valuePx } from '../lib/chart'
import { plain } from '../lib/format'
import type { Lang } from '../lib/i18n'
import { bandSegments, type SiteMethodology } from '../lib/methodology'

export const CHART_HEIGHT = 320
export const TOP = 12
export const BOTTOM = 292
const Y_TICKS = [-100, -50, 0, 50, 100]

/** Date axis along the bottom: a tick per quarter, a label per year (docs/05 §5 Timeline). */
export function DateAxis({ from, to, y }: { from: string; to: string; y: number }) {
  const x = datePercent(from, to)
  const ticks = quarterTicks(from, to)
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG <g> is not focusable; the axis labels are hidden from screen readers, the figure caption says the range.
    <g aria-hidden="true">
      <line x1="0%" x2="100%" y1={y} y2={y} className="stroke-rule" strokeWidth={1} />
      {ticks.map((d) => (
        <line
          key={d}
          x1={pct(x(d))}
          x2={pct(x(d))}
          y1={y}
          y2={y + (d.endsWith('-01-01') ? 6 : 3)}
          className="stroke-ink-3"
          strokeWidth={1}
        />
      ))}
      {ticks
        .filter((d) => d.endsWith('-01-01'))
        .map((d) => (
          <text
            key={d}
            x={pct(x(d))}
            y={y + 18}
            textAnchor="middle"
            fontSize={11}
            className="fill-ink-2 font-mono"
          >
            {d.slice(0, 4)}
          </text>
        ))}
    </g>
  )
}

/** Score axis labels (−100…+100), in their own column left of the plot. */
export function ScoreAxis({ lang }: { lang: Lang }) {
  const y = valuePx([-100, 100], TOP, BOTTOM)
  return (
    <svg width="40" height={CHART_HEIGHT} aria-hidden="true" className="block">
      {Y_TICKS.map((v) => (
        <text
          key={v}
          x={34}
          y={y(v) + 4}
          textAnchor="end"
          fontSize={11}
          className="fill-ink-2 font-mono"
        >
          {v > 0 ? `+${v}` : plain(v, lang, 0)}
        </text>
      ))}
    </svg>
  )
}

/** Faint band stripes and the score grid, shared by Timeline and CompareChart. */
export function ScoreGrid({ methodology }: { methodology: SiteMethodology }) {
  const y = valuePx([methodology.scoreClip.min, methodology.scoreClip.max], TOP, BOTTOM)
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG <g> is not focusable; stripes and grid are decoration.
    <g aria-hidden="true">
      {bandSegments(methodology.bands, methodology.scoreClip).map((s) => (
        <rect
          key={s.band.id}
          x="0%"
          width="100%"
          y={y(s.to)}
          height={y(s.from) - y(s.to)}
          className={`band-${s.band.id} fill-band`}
          fillOpacity={0.06}
        />
      ))}
      {Y_TICKS.map((v) => (
        <line
          key={v}
          x1="0%"
          x2="100%"
          y1={y(v)}
          y2={y(v)}
          className={v === 0 ? 'stroke-ink-3' : 'stroke-rule'}
          strokeWidth={1}
        />
      ))}
    </g>
  )
}
