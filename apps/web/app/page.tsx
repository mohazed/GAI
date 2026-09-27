// biome-ignore-all lint/security/noDangerouslySetInnerHtml: two constants: the redirect script (hashed in the CSP) and the <noscript> refresh, kept out of React so that its <meta> is not hoisted out of <noscript>.
import type { Metadata } from 'next'
import { MESSAGES } from '../lib/i18n'
import { REDIRECT_SCRIPT } from '../lib/site'

export const metadata: Metadata = {
  title: MESSAGES.en.redirect.title,
  robots: { index: false, follow: true },
}

/**
 * `/`: sends readers to /en/ or /fr/ by their browser's languages (docs/04 §3). Without
 * JavaScript the <noscript> refresh goes to /en/, and both links stay on the page.
 */
export default function LanguageRedirect() {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
        <noscript
          dangerouslySetInnerHTML={{ __html: '<meta http-equiv="refresh" content="0; url=/en/">' }}
        />
      </head>
      <body>
        <main className="container-page py-16">
          <p className="display text-d40">{MESSAGES.en.common.siteName}</p>
          <p className="mt-6 text-18">
            <a href="/en/" hrefLang="en">
              English
            </a>
            <span aria-hidden="true" className="px-3 text-ink-3">
              ·
            </span>
            <a href="/fr/" hrefLang="fr" lang="fr">
              Français
            </a>
          </p>
        </main>
      </body>
    </html>
  )
}
