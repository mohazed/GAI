import type { ApiMethodologyFile, ApiMethodologyIndex } from '@gai/schema/api'
import type { ReactNode } from 'react'
import type { ApiReader } from '../lib/api'
import { content } from '../lib/content'
import { parseDoc } from '../lib/doc'
import { getT, type Lang } from '../lib/i18n'
import type { LangText } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { repoFileUrl } from '../lib/site'
import { DiffViewer } from './DiffViewer'
import { DocMarkdown, InlineText } from './DocMarkdown'
import { SensitivityTables } from './SensitivityTables'
import { VersionSelector } from './VersionSelector'

/**
 * The sections of the methodology document the page adds to, by heading id in each language
 * (lib/doc.ts slugs). A version whose document renames one fails the build (DocMarkdown).
 */
const SECTION: Record<'computed' | 'sensitivity' | 'versioning', LangText> = {
  computed: { en: 'computed-indicators', fr: 'indicateurs-calcules' },
  sensitivity: { en: 'sensitivity-tables', fr: 'tables-de-sensibilite' },
  versioning: {
    en: 'versioning-and-changelog',
    fr: 'versions-et-journal-des-modifications',
  },
}

/** The URL of a version's page: the current version at /methodology/, the others by version. */
export function methodologyHref(lang: Lang, version: string, current: string): string {
  return version === current ? `/${lang}/methodology/` : `/${lang}/methodology/${version}/`
}

/** Rows of the indicator tables get `indicator-{ID}` (other pages link to them). */
function indicatorRowId(generated: string | null, first: string): string | undefined {
  return generated === 'indicators' && /^[A-E]\d{1,2}$/.test(first)
    ? `indicator-${first}`
    : undefined
}

/**
 * The methodology page (docs/05 §6 Methodology) of one version, rendered from the API's
 * `methodology/{version}.json`: the version's own document (methodology.{lang}.md, verbatim:
 * purpose and standpoint, the scale, the rules, the indicator table and the qualifying votes, the
 * formula rendered by KaTeX at build with its plain-language paragraph, event types and decay,
 * confidence, computed indicators, passivity, coverage, the symmetry table, versioning, known
 * limitations), with what the site adds: the version selector and contents; under Computed
 * indicators, how the build computes them (content/computed.*.md); the sensitivity tables
 * (sensitivity.json) in score mode; under Versioning, the scores this version moved (DiffViewer,
 * from `diff`) and the changelog; and, last, how the code reads the rules
 * (content/readings.*.md).
 */
export function MethodologyPage({
  lang,
  api,
  index,
  file,
  mode,
  gitSha,
}: {
  lang: Lang
  api: ApiReader
  index: ApiMethodologyIndex
  file: ApiMethodologyFile
  mode: Mode
  gitSha: string | null
}) {
  const t = getT(lang)
  const doc = file.docs[lang]
  if (doc === null) throw new Error(`methodology ${file.version} has no ${lang} document`)
  const blocks = parseDoc(doc)
  const firstH2 = blocks.findIndex((b) => b.kind === 'heading' && b.level === 2)
  const head = blocks.slice(0, firstH2)
  const body = blocks.slice(firstH2)
  const readings = content('readings', lang)
  const current = index.current
  const position = index.versions.findIndex((v) => v.version === file.version)
  const previous = position > 0 ? (index.versions[position - 1]?.version ?? null) : null

  const names: Record<string, LangText> = Object.fromEntries(
    api.countries().countries.map((c) => [c.iso3, c.name]),
  )
  const sensitivity: ReactNode =
    mode === 'score' && file.status === 'current' ? (
      <SensitivityTables lang={lang} data={api.sensitivity()} names={names} />
    ) : null

  const diff = file.diff
  const versioning = (
    <div className="flex flex-col gap-6">
      <h3 id="diff" className="mt-4 scroll-mt-8 text-18 font-semibold">
        {t('methodologyPage.diffTitle')}
      </h3>
      {diff !== null ? (
        <DiffViewer
          lang={lang}
          from={diff.from}
          to={diff.to}
          rows={diff.countries.map((c) => ({
            iso3: c.iso3,
            name: c.name,
            old: c.old,
            new: c.new,
            cause: c.cause,
          }))}
        />
      ) : previous === null ? (
        <DiffViewer lang={lang} from={null} to={file.version} rows={[]} />
      ) : (
        <p className="text-14 text-ink-2">
          {t('methodologyPage.diffMissing', { version: file.version, previous })}
        </p>
      )}
      <h3 id="changelog" className="mt-4 scroll-mt-8 text-18 font-semibold">
        {t('methodologyPage.changelogTitle')}
      </h3>
      <p className="max-w-prose text-14 text-ink-2">{t('methodologyPage.changelogNote')}</p>
      {index.changelog === null ? null : (
        // CHANGELOG.md is written in English only: marked so on the French page (P-17).
        <div className="flex flex-col gap-4" lang={lang === 'en' ? undefined : 'en'}>
          <DocMarkdown
            blocks={parseDoc(index.changelog)}
            skipTitle
            shift={2}
            idPrefix="changelog-"
          />
        </div>
      )}
    </div>
  )

  const appendTo: Record<string, ReactNode> = {
    [SECTION.computed[lang]]: (
      <div className="flex flex-col gap-6">
        <DocMarkdown blocks={content('computed', lang)} shift={1} />
      </div>
    ),
    [SECTION.versioning[lang]]: versioning,
  }
  if (sensitivity !== null) appendTo[SECTION.sensitivity[lang]] = sensitivity

  const contents = [
    ...body.filter((b) => b.kind === 'heading' && b.level === 2),
    ...readings.filter((b) => b.kind === 'heading' && b.level <= 2),
  ].flatMap((b) => (b.kind === 'heading' ? [{ id: b.id, text: b.text }] : []))

  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <DocMarkdown blocks={head} />
      {file.status === 'superseded' ? (
        <p className="max-w-prose border-s-2 border-ink ps-4 text-16">
          {t('methodologyPage.superseded', { version: file.version, current })}{' '}
          <a href={methodologyHref(lang, current, current)}>{t('methodologyPage.readCurrent')}</a>
        </p>
      ) : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
        <VersionSelector
          current={file.version}
          versions={index.versions.map((v) => ({
            version: v.version,
            status: v.status,
            href: methodologyHref(lang, v.version, current),
          }))}
        />
        <div className="flex max-w-prose flex-col gap-1 text-14 text-ink-2">
          <p>{t('methodologyPage.files', { version: file.version, folder: file.folder })}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <a href={`/api/v1/methodology/${file.version}.json`}>
                {`methodology/${file.version}.json`}
              </a>
            </li>
            <li>
              <a href={repoFileUrl(file.folder, gitSha).replace('/blob/', '/tree/')}>
                {file.folder}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <nav aria-labelledby="contents-title" className="flex flex-col gap-2">
        <h2 id="contents-title" className="text-14 font-semibold">
          {t('methodologyPage.contents')}
        </h2>
        <ol className="columns-1 gap-8 text-16 md:columns-2">
          {contents.map((c) => (
            <li key={c.id} className="break-inside-avoid py-1">
              <a href={`#${c.id}`}>
                <InlineText text={c.text} />
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <DocMarkdown blocks={body} rowId={indicatorRowId} appendTo={appendTo} />
      <DocMarkdown blocks={readings} />
    </article>
  )
}
