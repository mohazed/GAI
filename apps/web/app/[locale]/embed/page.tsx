import type { ApiScoredCountry } from '@gai/schema/api'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { DocMarkdown } from '../../../components/DocMarkdown'
import { publicApi } from '../../../lib/api'
import { content, contentTitle } from '../../../lib/content'
import { embedSnippet } from '../../../lib/embed'
import { getT, isLang } from '../../../lib/i18n'
import { alternatesFor } from '../../../lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: contentTitle(content('embed', locale)),
    description: t('embedPage.description'),
    alternates: alternatesFor(locale, 'embed/'),
  }
}

/**
 * Embed (docs/05 §6): how to show a country on another site with the widget script (P-11), the
 * snippet for a real country of the index, the options, and what the script does. The widget is
 * built in P-11, which adds the live examples at the `examples` slot; until then the page says
 * the script is not published. The prose is content/embed.{lang}.md.
 */
export default async function Embed({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const manifest = publicApi.manifest()
  const first = publicApi.countries().countries.find((c): c is ApiScoredCountry => !c.excluded)
  const iso3 = first?.iso3 ?? 'DEU'
  const code = (view?: 'timeline') =>
    embedSnippet(manifest.site_url, {
      iso3,
      ...(view === undefined ? {} : { view }),
      ...(lang === 'fr' ? { lang: 'fr' as const } : {}),
    })
  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <DocMarkdown
        blocks={content('embed', lang)}
        slots={{
          status: (
            <p className="max-w-prose border-s-2 border-ink ps-4 text-16">
              {t('embedPage.status')}
            </p>
          ),
          snippet: (
            <div className="flex flex-col gap-4">
              <p className="text-14 text-ink-2">
                {t('embedPage.snippetGauge', { country: first?.name[lang] ?? iso3 })}
              </p>
              <pre
                // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard (WCAG 2.1.1).
                tabIndex={0}
                className="overflow-x-auto rounded-xs bg-paper-2 p-4 font-mono text-m12"
              >
                <code>{code()}</code>
              </pre>
              <p className="text-14 text-ink-2">{t('embedPage.snippetTimeline')}</p>
              <pre
                // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard (WCAG 2.1.1).
                tabIndex={0}
                className="overflow-x-auto rounded-xs bg-paper-2 p-4 font-mono text-m12"
              >
                <code>{code('timeline')}</code>
              </pre>
            </div>
          ),
          examples: null,
        }}
      />
    </article>
  )
}
