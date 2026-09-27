import { translator } from '../lib/i18n'
import { type ScoreGaugeProps, ScoreGaugeView } from './ScoreGaugeView'

export type { GaugeValue, ScoreGaugeProps } from './ScoreGaugeView'

/** ScoreGauge (docs/05 §5), rendered on the server: see ScoreGaugeView. */
export function ScoreGauge(props: ScoreGaugeProps) {
  return <ScoreGaugeView {...props} t={translator(props.lang)} />
}
