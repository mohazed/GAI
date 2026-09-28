import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { MethodologyPage } from '../../../../components/MethodologyPage'
import { publicApi } from '../../../../lib/api'
import { getT, isLang, LOCALES } from '../../../../lib/i18n'
import { SITE_MODE } from '../../../../lib/mode'
import { alternatesFor } from '../../../../lib/seo'

export const dynamicParams = false

/** Every version of methodology/index.json, current included (its canonical is /methodology/). */
export function generateStaticParams() {
  const versions = publicApi.methodologyIndex().versions.map((v) => v.version)
  return LOCALES.flatMap((locale) => versions.map((version) => ({ locale, version })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; version: string }>
}): Promise<Metadata> {
  const { locale, version } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  const current = publicApi.methodologyIndex().current
  return {
    title: t('methodologyPage.metaTitleVersion', { version }),
    description: t('methodologyPage.description', { version }),
    alternates: alternatesFor(
      locale,
      version === current ? 'methodology/' : `methodology/${version}/`,
    ),
  }
}

/** One methodology version by its number (docs/05 §6: the version selector's links). */
export default async function MethodologyVersion({
  params,
}: {
  params: Promise<{ locale: string; version: string }>
}) {
  const { locale: lang, version } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const index = publicApi.methodologyIndex()
  if (!index.versions.some((v) => v.version === version)) notFound()
  return (
    <MethodologyPage
      lang={lang}
      api={publicApi}
      index={index}
      file={publicApi.methodology(version)}
      mode={SITE_MODE}
      gitSha={publicApi.manifest().git.sha}
    />
  )
}
