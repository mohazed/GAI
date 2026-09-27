import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getT, isLang } from '../../lib/i18n'
import { SITE_MODE } from '../../lib/mode'
import { alternatesFor } from '../../lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return isLang(locale)
    ? {
        title: { absolute: getT(locale)('common.siteName') },
        alternates: alternatesFor(locale, ''),
      }
    : {}
}

/**
 * Home (docs/05 §6). P-06 sets up the statement and its sub-line; the map, movers, changes,
 * search and ranking strip come with P-07.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLang(locale)) return null
  setRequestLocale(locale)
  const t = getT(locale)
  return (
    <div className="flex max-w-prose flex-col gap-4 py-16">
      <h1 className="display text-d40">{t('home.statement')}</h1>
      <p className="text-18">
        {t('home.sub')} <a href={`/${locale}/methodology/`}>{t('home.readMethodology')}</a>
      </p>
      {SITE_MODE === 'scorecard' ? (
        <p className="text-16 text-ink-2">{t('home.scorecard')}</p>
      ) : null}
    </div>
  )
}
