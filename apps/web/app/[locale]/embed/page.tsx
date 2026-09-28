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
 * Embed (docs/05 §6, docs/04 §4): how to show a country on another site with the widget script
 * (apps/widget, /embed/v1/gai.js), the snippet for a real country of the index, the options, what
 * the script does, and the two snippets running on this page (`examples`). The prose is
 * content/embed.{lang}.md.
 *
 * Each live example is the snippet itself, same-origin (the page's CSP allows scripts from 'self'
 * only), set as the HTML of its box: the script inserts its `<div>` beside itself, and React does
 * not hydrate the children of an element whose HTML it was given, so hydration neither moves nor
 * removes the widget.
 */
export default async function Embed({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const manifest = publicApi.manifest()
  const first = publicApi.countries().countries.find((c): c is ApiScoredCountry => !c.excluded)
  const iso3 = first?.iso3 ?? 'DEU'
  const code = (view?: 'timeline', base = manifest.site_url) =>
    embedSnippet(base, {
      iso3,
      ...(view === undefined ? {} : { view }),
      ...(lang === 'fr' ? { lang: 'fr' as const } : {}),
    })
  const country = first?.name[lang] ?? iso3
  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <DocMarkdown
        blocks={content('embed', lang)}
        slots={{
          snippet: (
            <div className="flex flex-col gap-4">
              <p className="text-14 text-ink-2">{t('embedPage.snippetGauge', { country })}</p>
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
          examples: (
            <div className="flex flex-col gap-6">
              <p className="js-only max-w-prose text-16">{t('embedPage.examples', { country })}</p>
              <noscript>
                <p className="max-w-prose text-16">
                  {t('embedPage.noscript')} <a href={`/${lang}/country/${iso3}/`}>{country}</a>
                </p>
              </noscript>
              {(['gauge', 'timeline'] as const).map((view) => (
                <section
                  key={view}
                  aria-labelledby={`embed-${view}`}
                  className="js-only flex flex-col gap-2"
                >
                  <h3 id={`embed-${view}`} className="text-14 text-ink-2">
                    {t(`embedPage.${view}`)}
                  </h3>
                  <div
                    className="embed-example"
                    // The snippet of lib/embed.ts with a same-origin src: an ISO3 code of the API,
                    // the view and the language; no text from the data.
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: the widget adds its box beside the script, which React must not hydrate.
                    dangerouslySetInnerHTML={{
                      __html: code(view === 'gauge' ? undefined : 'timeline', ''),
                    }}
                  />
                </section>
              ))}
            </div>
          ),
        }}
      />
    </article>
  )
}
