'use client'

import { usePathname } from 'next/navigation'
import { switchLocalePath } from '../lib/i18n'

export interface NavItem {
  href: string
  label: string
}

/** Navigation links with aria-current for the page being read. */
export function MastheadNav({
  items,
  label,
  path,
}: {
  items: NavItem[]
  label: string
  path?: string
}) {
  const current = usePathname() ?? ''
  const here = withSlash(path ?? current)
  return (
    <nav aria-label={label} className="md:ms-auto">
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className="nav-caps inline-flex min-h-6 items-center text-ink no-underline hover:underline"
              aria-current={!it.href.includes('#') && here.startsWith(it.href) ? 'page' : undefined}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** `EN | FR`: the current language in weight 600, the other a link to the same page. */
export function LanguageSwitch({
  lang,
  label,
  path,
}: {
  lang: 'en' | 'fr'
  label: string
  path?: string
}) {
  const current = usePathname() ?? `/${lang}/`
  const other = lang === 'en' ? 'fr' : 'en'
  return (
    <p className="nav-caps text-ink-2">
      <span className="sr-only">{label} </span>
      <span className="font-semibold text-ink">{lang.toUpperCase()}</span>
      <span aria-hidden="true"> | </span>
      <a
        href={switchLocalePath(withSlash(path ?? current), other)}
        hrefLang={other}
        lang={other}
        className="inline-flex min-h-6 items-center text-ink no-underline hover:underline"
      >
        {other.toUpperCase()}
      </a>
    </p>
  )
}

function withSlash(p: string): string {
  return p.endsWith('/') ? p : `${p}/`
}
