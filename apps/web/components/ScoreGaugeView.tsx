import { plain, signed, signedInt } from '../lib/format'
import type { Lang } from '../lib/i18n'
import { pct, valuePercent } from '../lib/linear'
import { bandById, bandSegments, type LangText, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { Translate } from '../lib/translate'
import { BandChip } from './BandChip'

export interface GaugeValue {
  /** S rounded to one decimal (`score`). */
  score: number
  /** S rounded to an integer (`score_display`); the band is read from it. */
  display: number
  band: string
}

export interface ScoreGaugeProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  /** null for an excluded entity (D-10). */
  value: GaugeValue | null
  /** Reason shown for an excluded entity. */
  excludedReason?: LangText | null
}

const SCALE = [-100, -50, 0, 50, 100]
/** Source Code Pro advances 0.6 em; the tooltip box is sized from the character count. */
const MONO_12_ADVANCE = 7.2

export interface ScoreGaugeViewProps extends ScoreGaugeProps {
  t: Translate
}

/**
 * Score, band chip and the −100…+100 bar in the five band colours (docs/05 §5 ScoreGauge). The
 * bar is SVG without a viewBox, positioned in percentages, so it needs no JavaScript. Scorecard
 * mode (D-16) draws the bar without marker or number. The CoverageBar always follows it. The
 * view takes its translator, so that the server (ScoreGauge) and the browser (the `?date=`
 * snapshot of a country page) draw it alike.
 */
export function ScoreGaugeView({
  lang,
  mode,
  methodology,
  value,
  excludedReason,
  t,
}: ScoreGaugeViewProps) {
  if (value === null) {
    return (
      <div className="border-y border-rule py-4">
        <p className="text-18 text-ink-2">
          {t('gauge.excluded', { reason: excludedReason?.[lang] ?? '' })}
        </p>
      </div>
    )
  }
  const clip = methodology.scoreClip
  const x = valuePercent([clip.min, clip.max])
  const segments = bandSegments(methodology.bands, clip)
  const showScore = mode === 'score'
  const band = bandById(methodology, value.band)
  const p = x(value.score)
  const tip = t('gauge.tooltip', { score: signed(value.score, lang), version: methodology.version })
  const tipWidth = Math.ceil(tip.length * MONO_12_ADVANCE) + 12
  // Keep the tooltip inside the bar near both ends.
  const tipX = p < 20 ? -6 : p > 80 ? -tipWidth + 6 : -tipWidth / 2
  const label = showScore
    ? t('gauge.label', { score: signedInt(value.display, lang), band: band.name[lang] })
    : t('gauge.scorecardLabel')
  return (
    <figure className="flex flex-col gap-4">
      {showScore ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-hidden="true">
          <p className="num display text-d64 md:text-d96">{signedInt(value.display, lang)}</p>
          <BandChip lang={lang} band={band} />
        </div>
      ) : (
        <p className="text-16 text-ink-2">{t('gauge.scorecard')}</p>
      )}
      <div
        className="gauge"
        role="img"
        aria-label={label}
        tabIndex={showScore ? 0 : undefined}
        dir="ltr"
      >
        <svg width="100%" height="64" aria-hidden="true" overflow="visible" className="block">
          {segments.map((s) => (
            <rect
              key={s.band.id}
              // Scorecard mode (D-16, docs/04 §3): no band colour, only the scale.
              className={showScore ? `band-${s.band.id} fill-band` : 'fill-paper-2 stroke-rule'}
              strokeWidth={showScore ? undefined : 1}
              x={pct(x(s.from))}
              width={pct(x(s.to) - x(s.from))}
              y={24}
              height={12}
            />
          ))}
          {segments.slice(1).map((s) => (
            <line
              key={s.band.id}
              x1={pct(x(s.from))}
              x2={pct(x(s.from))}
              y1={24}
              y2={36}
              className={showScore ? 'stroke-paper' : 'stroke-rule'}
              strokeWidth={1}
            />
          ))}
          <line x1="50%" x2="50%" y1={36} y2={43} className="stroke-ink" strokeWidth={1} />
          {SCALE.map((v) => (
            <text
              key={v}
              x={pct(x(v))}
              y={56}
              textAnchor={v === clip.min ? 'start' : v === clip.max ? 'end' : 'middle'}
              className="fill-ink-2 font-mono"
              fontSize={11}
            >
              {v === 0 ? t('gauge.zero') : v > 0 ? `+${plain(v, lang)}` : plain(v, lang)}
            </text>
          ))}
          {showScore ? (
            <svg x={pct(p)} y={0} overflow="visible" aria-hidden="true">
              <path d="M-5,14 L5,14 L0,21 Z" className="fill-ink" />
              <rect x={-1} y={21} width={2} height={20} className="fill-ink" />
              <g className="gauge-tip">
                <rect
                  x={tipX}
                  y={-8}
                  width={tipWidth}
                  height={20}
                  className="fill-paper stroke-ink"
                  strokeWidth={1}
                  rx={2}
                />
                <text x={tipX + 6} y={6} className="fill-ink font-mono" fontSize={12}>
                  {tip}
                </text>
              </g>
            </svg>
          ) : null}
        </svg>
      </div>
    </figure>
  )
}
