import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { MethodologyPage } from '../../../components/MethodologyPage'
import { publicApi } from '../../../lib/api'
import { getT, isLang } from '../../../lib/i18n'
import { SITE_MODE } from '../../../lib/mode'
import { alternatesFor } from '../../../lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  const version = publicApi.methodologyIndex().current
  return {
    title: t('methodologyPage.metaTitle'),
    description: t('methodologyPage.description', { version }),
    alternates: alternatesFor(locale, 'methodology/'),
  }
}

/** The current methodology version (docs/05 §6 Methodology); older ones at /methodology/{v}/. */
export default async function Methodology({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const index = publicApi.methodologyIndex()
  return (
    <MethodologyPage
      lang={lang}
      api={publicApi}
      index={index}
      file={publicApi.methodology(index.current)}
      mode={SITE_MODE}
      gitSha={publicApi.manifest().git.sha}
    />
  )
}
