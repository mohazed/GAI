import { AUTHOR } from '@gai/scoring'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { CountryBody, ExcludedBody } from '../../../components/CountryPage'
import { apiReader, KIT_API_DIR } from '../../../lib/api'
import { cardPath, peersOf } from '../../../lib/country'
import { clientMessages, type Lang } from '../../../lib/i18n'
import { siteMethodology } from '../../../lib/methodology'
import type { Mode } from '../../../lib/mode'

export const kitCountryMetadata: Metadata = {
  title: 'Country page kit · Gaza Accountability Index',
  robots: { index: false, follow: false },
}

export const VIEWS: Record<string, { lang: Lang; mode: Mode | 'excluded' }> = {
  'en-score': { lang: 'en', mode: 'score' },
  'fr-score': { lang: 'fr', mode: 'score' },
  'en-scorecard': { lang: 'en', mode: 'scorecard' },
  'fr-scorecard': { lang: 'fr', mode: 'scorecard' },
  'en-excluded': { lang: 'en', mode: 'excluded' },
}

const kit = apiReader(KIT_API_DIR)

/**
 * The country page of the fixture Germany (fixtures/README.md: one real event, a synthetic
 * correction and a synthetic reply) in each language and mode, and the fixture Israel as an
 * excluded entity: the same components as /{lang}/country/{ISO3}/, fed from the fixtures API.
 * Dev only (docs/05 §5 kit), one static page per view under /_kit/country/{view}/ (a dynamic
 * segment in the kit folder was not exported); the kit build's browser tests check them.
 */
export function KitCountry({ view }: { view: string }) {
  const v = VIEWS[view]
  if (v === undefined) return null
  setRequestLocale(v.lang)
  if (!kit.exists()) {
    return (
      <main className="container-page py-16">
        <p className="text-18">
          The kit reads the fixtures API. Run <code>pnpm --filter @gai/web kit:data</code> first.
        </p>
      </main>
    )
  }
  const manifest = kit.manifest()
  const countries = kit.countries()
  const body =
    v.mode === 'excluded'
      ? (() => {
          const isr = kit.country('ISR')
          if (!isr.excluded) throw new Error('the ISR fixture is not excluded')
          return <ExcludedBody lang={v.lang} file={isr} apiBase="/api/v1" />
        })()
      : (() => {
          const deu = kit.country('DEU')
          if (deu.excluded) throw new Error('the DEU fixture is excluded')
          return (
            <CountryBody
              lang={v.lang}
              mode={v.mode}
              methodology={siteMethodology(kit.methodology(deu.methodology))}
              file={deu}
              peers={peersOf(countries, deu, v.mode)}
              gitSha={manifest.git.sha}
              apiBase="/api/v1"
              card={cardPath(v.lang, 'DEU')}
              siteUrl={manifest.site_url}
              author={`${AUTHOR.given} ${AUTHOR.family}`}
            />
          )
        })()
  return (
    <div lang={v.lang}>
      <NextIntlClientProvider locale={v.lang} messages={clientMessages(v.lang)}>
        <main id="content" className="container-page" data-kit-country={view}>
          {body}
        </main>
      </NextIntlClientProvider>
    </div>
  )
}
