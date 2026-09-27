import { MESSAGES } from '../lib/i18n'

/**
 * The 404 page (out/404.html, served by Cloudflare Pages for unknown paths). The URL may carry
 * either language, so the page says it in both.
 */
export default function NotFound() {
  const en = MESSAGES.en.notFound
  const fr = MESSAGES.fr.notFound
  return (
    <html lang="en">
      <head>
        <title>{`${en.title} · ${MESSAGES.en.common.siteName}`}</title>
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <main className="container-page flex flex-col gap-8 py-16">
          <p className="display text-d22">{MESSAGES.en.common.siteName}</p>
          <section className="flex flex-col gap-2">
            <h1 className="display text-d40">{en.title}</h1>
            <p className="text-18">
              {en.body} <a href="/en/ranking/">{MESSAGES.en.common.nav.ranking}</a>
            </p>
          </section>
          <section lang="fr" className="flex flex-col gap-2 border-t border-rule pt-8">
            <h2 className="display text-d28">{fr.title}</h2>
            <p className="text-18">
              {fr.body} <a href="/fr/ranking/">{MESSAGES.fr.common.nav.ranking}</a>
            </p>
          </section>
        </main>
      </body>
    </html>
  )
}
