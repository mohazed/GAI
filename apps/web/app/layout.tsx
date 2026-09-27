import type { ReactNode } from 'react'
import './globals.css'

/**
 * Pass-through root layout. Every page renders its own <html>: the localised pages through
 * app/[locale]/layout.tsx (lang="en" or "fr"), the language redirect at `/`, the 404 page and
 * the dev-only kit. This is next-intl's layout for static export without middleware.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
