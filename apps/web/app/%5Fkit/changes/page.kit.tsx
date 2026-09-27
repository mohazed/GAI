import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ChangesFeed } from '../../../components/ChangesFeed'
import { MonthReport } from '../../../components/MonthReport'
import { apiReader, KIT_API_DIR } from '../../../lib/api'
import { clientMessages } from '../../../lib/i18n'
import { siteMethodology } from '../../../lib/methodology'
import '../../[locale]/changes/country-filters.css'

export const metadata: Metadata = {
  title: 'Changes kit · Gaza Accountability Index',
  robots: { index: false, follow: false },
}

const kit = apiReader(KIT_API_DIR)

/**
 * The changes feed of the fixture months 2025-08 and 2025-11 with its filters (one filtered feed
 * per page: the anchors have fixed ids), and the fixture's monthly reports, which have what the
 * real data does not yet: a movers table, a new event and an end (English with scores, French
 * scorecard). Dev only (docs/05 §5 kit); the kit build's browser tests use it.
 */
export default function KitChanges() {
  setRequestLocale('en')
  if (!kit.exists()) {
    return (
      <main className="container-page py-16">
        <p className="text-18">
          The kit reads the fixtures API. Run <code>pnpm --filter @gai/web kit:data</code> first.
        </p>
      </main>
    )
  }
  const m = siteMethodology(kit.methodology(kit.manifest().methodology.version))
  const aug = kit.changesMonth('2025-08')
  const nov = kit.changesMonth('2025-11')
  const weeks = [...nov.weeks, ...aug.weeks].sort((a, b) => (a.week < b.week ? 1 : -1))
  return (
    <div lang="en">
      <NextIntlClientProvider locale="en" messages={clientMessages('en')}>
        <main id="content" className="container-page flex flex-col gap-12 py-12">
          <section id="kit-feed" data-kit-changes="feed" className="flex flex-col gap-4">
            <h2 className="font-mono text-m12 text-ink-2">
              ChangesFeed · filters · fixture months 2025-08 and 2025-11
            </h2>
            <ChangesFeed lang="en" weeks={weeks} methodology={m} sectionId="kit-feed" />
          </section>
          <section data-kit-changes="report-en" className="flex flex-col gap-4">
            <h2 className="font-mono text-m12 text-ink-2">MonthReport · en · score · 2025-08</h2>
            <MonthReport
              lang="en"
              month={aug}
              markdown={kit.text(aug.reports.en)}
              scorecard={false}
            />
          </section>
          <section data-kit-changes="report-fr" lang="fr" className="flex flex-col gap-4">
            <h2 className="font-mono text-m12 text-ink-2" lang="en">
              MonthReport · fr · scorecard · 2025-11
            </h2>
            <MonthReport
              lang="fr"
              month={nov}
              markdown={kit.text(nov.reports.scorecard_fr)}
              scorecard
            />
          </section>
        </main>
      </NextIntlClientProvider>
    </div>
  )
}
