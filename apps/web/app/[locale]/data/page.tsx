import { AUTHOR, datasetCitations } from '@gai/scoring'
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { DocMarkdown } from '../../../components/DocMarkdown'
import { publicApi } from '../../../lib/api'
import {
  type Cut,
  endpoints,
  exampleOf,
  STRUCTURED_DOCS,
  structuredTables,
} from '../../../lib/api-docs'
import { content, contentTitle } from '../../../lib/content'
import { siteDatasetJsonLd } from '../../../lib/country'
import { fileSize, formatInteger, longDate } from '../../../lib/format'
import { getT, isLang, type Lang, type T } from '../../../lib/i18n'
import { SITE_MODE } from '../../../lib/mode'
import { alternatesFor } from '../../../lib/seo'
import { REPO_URL, repoFileUrl } from '../../../lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: contentTitle(content('data', locale)),
    description: t('dataPage.description'),
    alternates: alternatesFor(locale, 'data/'),
  }
}

/** The bulk downloads (dumps/), the country table of the site's mode as the ranking page does. */
function downloads(files: { path: string; bytes: number }[]) {
  const countryTable =
    SITE_MODE === 'score' ? 'dumps/countries.csv' : 'dumps/countries.scorecard.csv'
  const order = (p: string) =>
    p === 'dumps/events.csv'
      ? 0
      : p === 'dumps/sources.csv'
        ? 1
        : p === 'dumps/assessments.csv'
          ? 2
          : p === countryTable
            ? 3
            : p.startsWith('dumps/gai-')
              ? 4
              : 5
  return files
    .filter(
      (f) =>
        f.path.startsWith('dumps/') &&
        (f.path === countryTable || !f.path.startsWith('dumps/countries')),
    )
    .sort((a, b) => order(a.path) - order(b.path) || (a.path < b.path ? -1 : 1))
}

function downloadHolds(path: string, t: T): string {
  if (path.startsWith('dumps/scores-daily-'))
    return t('dataPage.dl.scoresDaily', { year: path.slice(19, 23) })
  if (path.startsWith('dumps/gai-')) return t('dataPage.dl.gai')
  const keys: Record<
    string,
    'events' | 'sources' | 'assessments' | 'countries' | 'countriesScorecard'
  > = {
    'dumps/events.csv': 'events',
    'dumps/sources.csv': 'sources',
    'dumps/assessments.csv': 'assessments',
    'dumps/countries.csv': 'countries',
    'dumps/countries.scorecard.csv': 'countriesScorecard',
  }
  const key = keys[path]
  return key === undefined ? path : t(`dataPage.dl.${key}`)
}

/** One line on what an example left out (lib/api-docs.ts records every cut). */
function cutNote(cuts: Cut[], t: T): string | null {
  if (cuts.length === 0) return null
  const lists = cuts.filter((c) => c.what === 'items' && c.path !== '').length
  const lines = cuts.find((c) => c.what === 'items' && c.path === '')
  const strings = cuts.filter((c) => c.what === 'characters').length
  const keys = cuts.find((c) => c.what === 'keys')
  const parts = [
    ...(keys ? [t('dataPage.cut.keys', { shown: keys.shown, total: keys.total })] : []),
    ...(lines ? [t('dataPage.cut.lines', { shown: lines.shown, total: lines.total })] : []),
    ...(lists > 0 ? [t('dataPage.cut.lists', { count: lists })] : []),
    ...(strings > 0 ? [t('dataPage.cut.strings', { count: strings })] : []),
  ]
  return `${parts.join(' ')} ${t('dataPage.cut.rest')}`
}

function Api({ lang }: { lang: Lang }) {
  const t = getT(lang)
  return (
    <div className="flex flex-col gap-8">
      {SITE_MODE === 'scorecard' ? (
        <p className="max-w-prose text-16">{t('dataPage.scorecardNote')}</p>
      ) : null}
      {endpoints(publicApi, SITE_MODE).map((e) => {
        const ex = exampleOf(publicApi, e)
        const note = ex === null ? null : cutNote(ex.cuts, t)
        return (
          <section
            key={e.path}
            aria-label={e.path}
            className="flex flex-col gap-2 border-t border-rule pt-4"
          >
            <h3 className="font-mono text-m14 font-semibold break-all">{e.path}</h3>
            <p className="max-w-prose text-16">{e.holds[lang]}</p>
            {ex === null || e.example === null ? (
              <p className="text-14 text-ink-2">{t('dataPage.noExample')}</p>
            ) : (
              <details>
                <summary className="text-14">
                  {t('dataPage.example')}{' '}
                  <span className="font-mono text-m12 break-all">{e.example}</span>
                </summary>
                <div className="mt-2 flex flex-col gap-2">
                  <pre
                    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard (WCAG 2.1.1).
                    tabIndex={0}
                    className="max-h-[32rem] overflow-auto rounded-xs bg-paper-2 p-4 font-mono text-m12"
                  >
                    <code>{ex.text}</code>
                  </pre>
                  {note === null ? null : <p className="text-12 text-ink-2">{note}</p>}
                  <a href={`/api/v1/${e.example}`} className="text-14">
                    {t('dataPage.openFile', { file: e.example })}
                  </a>
                </div>
              </details>
            )}
          </section>
        )
      })}
    </div>
  )
}

/**
 * Data & API (docs/05 §6 Data): the build, the downloads, the structured tables, every endpoint
 * of the API README with an example from this build, how the site uses the data, how the
 * computed indicators are built, the citation of the dataset, the licences and the
 * reproducibility procedure; the JSON-LD Dataset of the whole index (docs/04 §3). The prose is
 * content/data.{lang}.md.
 */
export default async function Data({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const manifest = publicApi.manifest()
  const index = publicApi.methodologyIndex()
  const methodology = publicApi.methodology(index.current)
  const sha = manifest.git.sha
  const cites = datasetCitations(
    { date: manifest.build_date, methodologyVersion: index.current, siteUrl: manifest.site_url },
    lang,
  )
  const dl = downloads(manifest.files)
  const site = manifest.site_url.replace(/\/$/, '')
  const reproduce = [
    `git clone ${REPO_URL}.git && cd GAI`,
    `git checkout ${sha ?? '<git.sha>'}`,
    'pnpm install --frozen-lockfile',
    `pnpm build:data --date ${manifest.build_date} --site-url ${manifest.site_url}`,
    `curl -s ${site}/api/v1/manifest.json | jq -r '.files[] | "\\(.sha256)  \\(.path)"' | (cd apps/web/public/api/v1 && shasum -a 256 -c --quiet -)`,
  ].join('\n')
  const jsonLd = siteDatasetJsonLd({
    lang,
    siteUrl: manifest.site_url,
    siteName: t('common.siteName'),
    description: t('dataPage.description'),
    author: `${AUTHOR.given} ${AUTHOR.family}`,
    version: index.current,
    buildDate: manifest.build_date,
    windowStart: methodology.window_start,
    citation: cites.plain,
    downloads: dl.map((f) => ({
      path: f.path,
      format: f.path.endsWith('.csv') ? 'text/csv' : 'application/json',
    })),
  })
  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD data block, `<` escaped (lib/country.ts).
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <DocMarkdown
        blocks={content('data', lang)}
        slots={{
          build: (
            <div className="flex max-w-prose flex-col gap-2 text-14 text-ink-2">
              <p>
                {t('dataPage.build', {
                  date: longDate(manifest.build_date, lang),
                  version: index.current,
                  files: formatInteger(manifest.total.files, lang),
                  size: fileSize(manifest.total.bytes, lang),
                })}{' '}
                {sha === null ? (
                  t('dataPage.noSha')
                ) : (
                  <a href={`${REPO_URL}/commit/${sha}`} className="font-mono text-m12">
                    {sha.slice(0, 7)}
                  </a>
                )}
                {' · '}
                <a href="/api/v1/manifest.json">manifest.json</a>
              </p>
              {manifest.git.dirty === true ? <p>{t('dataPage.dirty')}</p> : null}
            </div>
          ),
          downloads: (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-14">
                <caption className="mb-2 text-start text-14 text-ink-2">
                  {t(
                    SITE_MODE === 'score'
                      ? 'dataPage.downloadsCaption'
                      : 'dataPage.downloadsCaptionScorecard',
                  )}
                </caption>
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="py-2 pe-4 text-start font-semibold">
                      {t('dataPage.cols.file')}
                    </th>
                    <th scope="col" className="py-2 pe-4 text-start font-semibold">
                      {t('dataPage.cols.holds')}
                    </th>
                    <th scope="col" className="py-2 text-end font-semibold">
                      {t('dataPage.cols.size')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dl.map((f) => (
                    <tr key={f.path} className="border-b border-rule align-top">
                      <th scope="row" className="py-2 pe-4 text-start font-normal">
                        <a
                          href={`/api/v1/${f.path}`}
                          download
                          className="font-mono text-m13 break-all md:break-normal md:whitespace-nowrap"
                        >
                          {f.path}
                        </a>
                      </th>
                      <td className="py-2 pe-4">{downloadHolds(f.path, t)}</td>
                      <td className="py-2 text-end font-mono text-m13 whitespace-nowrap">
                        {fileSize(f.bytes, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
          structured: (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-14">
                <caption className="sr-only">{t('dataPage.structuredCaption')}</caption>
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="py-2 pe-4 text-start font-semibold">
                      {t('dataPage.cols.table')}
                    </th>
                    <th scope="col" className="py-2 pe-4 text-start font-semibold">
                      {t('dataPage.cols.holds')}
                    </th>
                    <th scope="col" className="py-2 text-start font-semibold">
                      {t('dataPage.cols.columns')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {structuredTables().map((s) => (
                    <tr key={s.name} className="border-b border-rule align-top">
                      <th scope="row" className="py-2 pe-4 text-start font-normal">
                        <a
                          href={repoFileUrl(`data/structured/${s.name}`, sha)}
                          className="font-mono text-m13"
                        >
                          {s.name}
                        </a>
                      </th>
                      <td className="py-2 pe-4">{STRUCTURED_DOCS[s.name][lang]}</td>
                      <td className="py-2 font-mono text-m12">{s.columns.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
          api: <Api lang={lang} />,
          computed: (
            <div className="flex flex-col gap-6">
              <DocMarkdown blocks={content('computed', lang)} idPrefix="data-" />
            </div>
          ),
          citation: (
            <dl className="flex max-w-prose flex-col gap-4 text-16">
              {(['plain', 'apa', 'chicago'] as const).map((style) => (
                <div key={style} className="flex flex-col gap-1">
                  <dt className="text-14 font-semibold">{t(`cite.${style}`)}</dt>
                  <dd className="[overflow-wrap:anywhere]">{cites[style]}</dd>
                </div>
              ))}
            </dl>
          ),
          reproduce: (
            <div className="flex flex-col gap-2">
              <pre
                // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard (WCAG 2.1.1).
                tabIndex={0}
                className="overflow-x-auto rounded-xs bg-paper-2 p-4 font-mono text-m12"
              >
                <code>{reproduce}</code>
              </pre>
              <p className="text-14 text-ink-2">{t('dataPage.linux')}</p>
            </div>
          ),
        }}
      />
    </article>
  )
}
