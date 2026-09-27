import type { ReactNode } from 'react'
import { SvgDefs } from '../../components/SvgDefs'

/** Root layout of the dev-only kit (its own <html>; see app/layout.tsx). */
export default function KitLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SvgDefs />
        {children}
      </body>
    </html>
  )
}
