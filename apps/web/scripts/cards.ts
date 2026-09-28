/**
 * Share cards (docs/05 §5 ShareCard, D-05): one 1200 × 630 PNG per registry entry and language,
 * rendered at build time from the published countries.json with the template of
 * scripts/card-template.tsx (satori → SVG, resvg → PNG), written to public/cards/{ISO3}.png
 * (English) and public/cards/fr/{ISO3}.png (French), which next build copies into the output.
 * The mode is the site's (NEXT_PUBLIC_SHOW_SCORES, D-16, read from apps/web's env files as next
 * build reads them: scripts/site-env.ts): scorecard cards carry no score. About
 * 25 ms a card (resvg must not load the system fonts: satori has already turned text into paths).
 *
 * Fonts are the static WOFF files of the @fontsource packages (satori reads neither WOFF2 nor
 * variable fonts): Newsreader for the name and the score, Source Sans 3 for text, Source Code Pro
 * for the permalink and the scale.
 *
 *   pnpm --filter @gai/web cards
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import type { ApiCountryEntry, ApiManifestFile } from '@gai/schema/api'
import { formatSigned, permalink } from '@gai/scoring'
import { Resvg } from '@resvg/resvg-js'
import { createElement } from 'react'
import satori, { type Font } from 'satori'
import { apiReader, PUBLIC_API_DIR } from '../lib/api'
import { computedInForce } from '../lib/event-list'
import { percent } from '../lib/format'
import { getT, type Lang, LOCALES } from '../lib/i18n'
import { bandById, bandSegments, type SiteMethodology, siteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { Card, type CardInput } from './card-template'
import { loadSiteMode } from './site-env'

const require = createRequire(import.meta.url)

function fontFile(pkg: string, file: string): Buffer {
  return readFileSync(
    path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files', file),
  )
}

export function loadFonts(): Font[] {
  const font = (name: string, weight: 400 | 600, pkg: string, file: string): Font => ({
    name,
    weight,
    style: 'normal',
    data: fontFile(pkg, file),
  })
  return [
    font('Newsreader', 400, '@fontsource/newsreader', 'newsreader-latin-400-normal.woff'),
    font('Newsreader', 400, '@fontsource/newsreader', 'newsreader-latin-ext-400-normal.woff'),
    font('Source Sans 3', 400, '@fontsource/source-sans-3', 'source-sans-3-latin-400-normal.woff'),
    font(
      'Source Sans 3',
      400,
      '@fontsource/source-sans-3',
      'source-sans-3-latin-ext-400-normal.woff',
    ),
    font('Source Sans 3', 600, '@fontsource/source-sans-3', 'source-sans-3-latin-600-normal.woff'),
    font(
      'Source Sans 3',
      600,
      '@fontsource/source-sans-3',
      'source-sans-3-latin-ext-600-normal.woff',
    ),
    font(
      'Source Code Pro',
      400,
      '@fontsource/source-code-pro',
      'source-code-pro-latin-400-normal.woff',
    ),
  ]
}

/** The card of one registry entry in one language, from the published API. Pure. */
export function cardInput(args: {
  entry: ApiCountryEntry
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  manifest: Pick<ApiManifestFile, 'build_date' | 'site_url'>
  /** Computed values in force at the build date (the event count covers acts only, B-74). */
  computed?: number
}): CardInput {
  const { entry, lang, mode, methodology: m, manifest, computed = 0 } = args
  const t = getT(lang)
  const clip = m.scoreClip
  const span = clip.max - clip.min
  const share = (v: number) => Math.max(0, Math.min(1, (v - clip.min) / span))
  const link = permalink(manifest.site_url, lang, entry.iso3, manifest.build_date).replace(
    /^https?:\/\//,
    '',
  )
  const base = {
    wordmark: t('common.siteName'),
    name: entry.name[lang],
    segments: bandSegments(m.bands, clip).map((s) => ({
      band: s.band.id,
      from: share(s.from),
      to: share(s.to),
    })),
    scale: [-100, -50, 0, 50, 100].map((v) => (v === 0 ? '0' : formatSigned(v, lang, 0))),
    permalink: link,
    methodology: t('card.methodology', { version: m.version, date: manifest.build_date }),
  }
  if (entry.excluded) {
    return {
      ...base,
      kind: 'excluded',
      notScored: t('card.notScored'),
      reason: entry.excluded_reason[lang],
      coverage: null,
      summary: '',
    }
  }
  const coverage = {
    label: t('coverage.label', { pct: percent(entry.coverage.ratio, lang) }),
    missing: t('coverage.missing', {
      noData: entry.coverage.no_data,
      unchecked: entry.coverage.unchecked,
    }),
    statuses: m.indicators
      .filter((i) => i.scored)
      .map((i) => entry.coverage.statuses[i.id] ?? 'unchecked')
      .filter((s) => s !== 'not-applicable'),
  }
  if (mode === 'scorecard') {
    return {
      ...base,
      kind: 'scorecard',
      scorecardLine:
        computed > 0
          ? t('card.scorecardComputed', {
              count: entry.events.total,
              computed,
              pct: percent(entry.coverage.ratio, lang),
            })
          : t('card.scorecard', {
              count: entry.events.total,
              pct: percent(entry.coverage.ratio, lang),
            }),
      coverage,
      summary: entry.summary_scorecard[lang],
    }
  }
  const band = bandById(m, entry.band)
  return {
    ...base,
    kind: 'score',
    score: formatSigned(entry.score_display, lang, 0),
    band: { id: band.id, name: band.name[lang] },
    marker: share(entry.score),
    coverage,
    summary: entry.summary[lang],
  }
}

export async function renderCard(input: CardInput, fonts: Font[]): Promise<Buffer> {
  const svg = await satori(createElement(Card, { input }), { width: 1200, height: 630, fonts })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: false } })
    .render()
    .asPng()
}

/** public/cards/{ISO3}.png in English, public/cards/fr/{ISO3}.png in French. */
export function cardFile(dir: string, lang: Lang, iso3: string): string {
  return lang === 'en' ? path.join(dir, `${iso3}.png`) : path.join(dir, lang, `${iso3}.png`)
}

async function main() {
  const mode = loadSiteMode()
  const api = apiReader(PUBLIC_API_DIR)
  const manifest = api.manifest()
  const countries = api.countries()
  const methodology = siteMethodology(api.methodology(countries.methodology))
  const fonts = loadFonts()
  const dir = path.resolve(import.meta.dirname, '..', 'public', 'cards')
  rmSync(dir, { recursive: true, force: true })
  for (const lang of LOCALES)
    mkdirSync(path.dirname(cardFile(dir, lang, 'XXX')), { recursive: true })
  const started = Date.now()
  let n = 0
  for (const entry of countries.countries) {
    const file = api.country(entry.iso3)
    const computed = file.excluded ? 0 : computedInForce(file.event_list).length
    for (const lang of LOCALES) {
      const input = cardInput({ entry, lang, mode, methodology, manifest, computed })
      writeFileSync(cardFile(dir, lang, entry.iso3), await renderCard(input, fonts))
      n += 1
    }
  }
  console.log(
    `cards: ${n} share card(s), ${mode} mode, in ${Date.now() - started} ms → ${path.relative(process.cwd(), dir)}/`,
  )
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  await main()
}
