import { getT, type Lang } from '../lib/i18n'
import { LanguageSwitch, MastheadNav } from './MastheadNav'

export interface MastheadProps {
  lang: Lang
  version: string
  buildDate: string
  /** Path of the page for the language switch; read from the URL when omitted. */
  path?: string
}

const NAV = ['ranking', 'countries', 'compare', 'changes', 'methodology', 'data', 'about'] as const
const HREF: Record<(typeof NAV)[number], string> = {
  ranking: 'ranking/',
  // The country list is the ranking table (alphabetical in scorecard mode, docs/05 §5).
  countries: 'ranking/#countries',
  compare: 'compare/',
  changes: 'changes/',
  methodology: 'methodology/',
  data: 'data/',
  about: 'about/',
}

/** Wordmark, navigation, language switch and version tag (docs/05 §5 Masthead). */
export function Masthead({ lang, version, buildDate, path }: MastheadProps) {
  const t = getT(lang)
  const items = NAV.map((k) => ({ href: `/${lang}/${HREF[k]}`, label: t(`common.nav.${k}`) }))
  return (
    <header className="border-b border-rule">
      <div className="container-page flex flex-wrap items-center gap-x-8 gap-y-2 py-4 md:min-h-16 md:py-2">
        <a href={`/${lang}/`} className="display text-d22 text-ink no-underline hover:underline">
          {t('common.siteName')}
        </a>
        <MastheadNav items={items} label={t('common.navLabel')} {...(path ? { path } : {})} />
        <div className="flex items-center gap-4">
          <LanguageSwitch
            lang={lang}
            label={t('common.languageLabel')}
            {...(path ? { path } : {})}
          />
          <a
            href={`/${lang}/methodology/#changelog`}
            className="font-mono text-m12 text-ink-2 no-underline hover:underline"
            title={t('common.versionTitle')}
          >
            {t('common.versionTag', { version, date: buildDate })}
          </a>
        </div>
      </div>
    </header>
  )
}
