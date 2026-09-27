import type { Metadata } from 'next'
import type { Lang } from './i18n'

/**
 * Canonical and hreflang links of one page (docs/04 §3). Each page sets its own: the layout sets
 * none, because Next.js would pass a layout's `alternates` on to every page below it.
 * `path` is the page's path after the language, with a trailing slash ('' for home, 'ranking/').
 */
export function alternatesFor(lang: Lang, path: string): Metadata['alternates'] {
  return {
    canonical: `/${lang}/${path}`,
    languages: {
      en: `/en/${path}`,
      fr: `/fr/${path}`,
      'x-default': path === '' ? '/' : `/en/${path}`,
    },
  }
}
