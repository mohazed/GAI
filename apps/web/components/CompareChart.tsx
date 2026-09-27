import { translator } from '../lib/i18n'
import {
  type CategoryDotsProps,
  CategoryDotsView,
  type CompareChartProps,
  CompareChartView,
  type EventDiffProps,
  EventDiffView,
} from './CompareViews'

export { LineSwatch } from './CompareMark'
export type { CompareSeries, DiffCountry, DotsCountry } from './CompareViews'

type Server<P> = Omit<P, 't'>

/** CompareChart (docs/05 §5), rendered on the server: see CompareChartView. */
export function CompareChart(props: Server<CompareChartProps>) {
  return <CompareChartView {...props} t={translator(props.lang)} />
}

/** CategoryDots (docs/05 §5), rendered on the server: see CategoryDotsView. */
export function CategoryDots(props: Server<CategoryDotsProps>) {
  return <CategoryDotsView {...props} t={translator(props.lang)} />
}

/** EventDiff (docs/05 §5), rendered on the server: see EventDiffView. */
export function EventDiff(props: Server<EventDiffProps>) {
  return <EventDiffView {...props} t={translator(props.lang)} />
}
