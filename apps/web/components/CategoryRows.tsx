import { translator } from '../lib/i18n'
import { type CategoryRowsProps, CategoryRowsView } from './CategoryRowsView'

export type { CategoryRowsProps } from './CategoryRowsView'

/** CategoryRows (docs/05 §5), rendered on the server: see CategoryRowsView. */
export function CategoryRows(props: CategoryRowsProps) {
  return <CategoryRowsView {...props} t={translator(props.lang)} />
}
