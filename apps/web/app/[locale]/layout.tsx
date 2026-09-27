import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { Footer } from '../../components/Footer'
import { Masthead } from '../../components/Masthead'
import { SvgDefs } from '../../components/SvgDefs'
import { publicApi } from '../../lib/api'
import { clientMessages, getT, isLang, LOCALES } from '../../lib/i18n'
import { REPO_URL } from '../../lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  const site = publicApi.manifest().site_url
  return {
    metadataBase: new URL(site),
    title: { default: t('common.siteName'), template: `%s · ${t('common.siteName')}` },
    description: t('home.sub'),
    formatDetection: { telephone: false, date: false, email: false, address: false },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLang(locale)) notFound()
  setRequestLocale(locale)
  const t = getT(locale)
  const manifest = publicApi.manifest()
  return (
    <html lang={locale}>
      <body>
        <a href="#content" className="skip-link">
          {t('common.skip')}
        </a>
        <SvgDefs />
        <NextIntlClientProvider locale={locale} messages={clientMessages(locale)}>
          <Masthead
            lang={locale}
            version={manifest.methodology.version}
            buildDate={manifest.build_date}
          />
          <main id="content" className="container-page">
            {children}
          </main>
          <Footer
            lang={locale}
            version={manifest.methodology.version}
            gitSha={manifest.git.sha}
            buildDate={manifest.build_date}
            repoUrl={REPO_URL}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
