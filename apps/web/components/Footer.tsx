import { getT, type Lang } from '../lib/i18n'

export interface FooterProps {
  lang: Lang
  version: string
  /** Full git SHA of the build, or null outside a checkout. */
  gitSha: string | null
  buildDate: string
  repoUrl: string
}

/** Text links, licence line and build line (docs/05 §5 Footer). No social icons. */
export function Footer({ lang, version, gitSha, buildDate, repoUrl }: FooterProps) {
  const t = getT(lang)
  const columns: { href: string; label: string }[][] = [
    [
      { href: `/${lang}/about/`, label: t('footer.about') },
      { href: `/${lang}/methodology/`, label: t('footer.methodology') },
    ],
    [
      { href: `/${lang}/corrections/`, label: t('footer.corrections') },
      { href: `/${lang}/reply/`, label: t('footer.reply') },
    ],
    [
      { href: `/${lang}/data/`, label: t('footer.data') },
      { href: `/${lang}/embed/`, label: t('footer.embed') },
    ],
    [{ href: repoUrl, label: t('footer.github') }],
  ]
  const sha = gitSha === null ? t('footer.noSha') : gitSha.slice(0, 7)
  return (
    <footer className="mt-16 border-t border-rule">
      <div className="container-page py-8">
        <nav aria-label={t('footer.label')}>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
            {columns.map((col) => (
              <li key={col[0]?.href}>
                <ul className="flex flex-col gap-1">
                  {col.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-14">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-14 text-ink-2">{t('footer.licence')}</p>
        <p className="mt-1 font-mono text-m12 text-ink-2">
          {t('footer.build', { version, sha, date: buildDate })}
        </p>
      </div>
    </footer>
  )
}
