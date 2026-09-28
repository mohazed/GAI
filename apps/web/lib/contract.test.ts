/**
 * The site against a real API build (the fixtures, built once into a temporary folder): the
 * readers parse every file they read, display counts agree with the API, and every band of the
 * methodology has its colour class in the stylesheet.
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CorrectionsTable } from '../components/CorrectionsTable'
import { MonthReport, reportLinks } from '../components/MonthReport'
import { SensitivityTables } from '../components/SensitivityTables'
import { cardInput, loadFonts, renderCard } from '../scripts/cards'
import { countryFilterCss } from '../scripts/filter-css'
import { apiReader } from './api'
import { endpoints, exampleOf } from './api-docs'
import { computedInForce, listItems, timelineEvents } from './event-list'
import { siteMethodology } from './methodology'
import { rankRows } from './rank'
import { groupEvidence } from './structured-row'

const root = path.resolve(import.meta.dirname, '..', '..', '..')
let dir = ''

beforeAll(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'gai-web-'))
  const run = spawnSync(
    'pnpm',
    ['build:data', '--root', 'fixtures', '--date', '2026-09-27', '--out', path.join(dir, 'v1')],
    { cwd: root, encoding: 'utf8' },
  )
  if (run.status !== 0) throw new Error(run.stderr || run.stdout)
}, 120_000)

afterAll(() => {
  if (dir !== '') rmSync(dir, { recursive: true, force: true })
})

describe('site ↔ API contract (fixtures build)', () => {
  it('reads and parses the files the site uses', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const m = api.manifest()
    expect(api.countries().countries.length).toBeGreaterThan(0)
    expect(api.methodology(m.methodology.version).version).toBe(m.methodology.version)
    expect(api.changesLatest().build_date).toBe('2026-09-27')
  })

  it('publishes category counts that add up to the event total, in both files', () => {
    const api = apiReader(path.join(dir, 'v1'))
    for (const c of api.countries().countries) {
      if (c.excluded) continue
      const file = api.country(c.iso3)
      if (file.excluded) throw new Error('unexpected')
      const sum = Object.values(c.events.by_category).reduce((a, b) => a + b, 0)
      expect(sum, c.iso3).toBe(c.events.total)
      expect(file.events, c.iso3).toEqual(c.events)
    }
  })

  it('draws as many coverage segments as the API counts applicable indicators', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const m = siteMethodology(api.methodology(api.manifest().methodology.version))
    for (const c of api.countries().countries) {
      if (c.excluded) continue
      const drawn = m.indicators.filter(
        (i) =>
          i.scored &&
          c.coverage.statuses[i.id] !== undefined &&
          c.coverage.statuses[i.id] !== 'not-applicable',
      )
      expect(drawn.length, c.iso3).toBe(c.coverage.applicable)
    }
  })

  it('maps countries.json to ranking rows without changing a value', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const file = api.countries()
    const rows = rankRows(file)
    for (const c of file.countries) {
      const r = rows.find((x) => x.iso3 === c.iso3)
      if (c.excluded) {
        expect(r?.excluded).toBe(true)
        continue
      }
      expect(r?.score).toBe(c.score)
      expect(r?.display).toBe(c.score_display)
      expect(r?.clipped?.A).toBe(c.categories.A.clipped)
      expect(r?.passivityValue).toBe(c.passivity.value)
    }
  })

  it('has a colour class for every band, bound to its token', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const file = api.methodology(api.manifest().methodology.version)
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    for (const b of file.bands.bands) {
      expect(css, b.id).toMatch(
        new RegExp(`\\.band-${b.id} \\{\\s*--band: var\\(${b.colour_token}\\);`),
      )
      expect(css, b.colour_token).toMatch(new RegExp(`${b.colour_token}: #[0-9a-f]{6};`))
    }
    expect(siteMethodology(file).bands.map((b) => b.id)).toEqual(
      [...file.bands.bands].sort((a, b) => a.min - b.min).map((b) => b.id),
    )
  })

  it('has a no-JavaScript filter rule for every indicator, sign and confidence level', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const file = api.methodology(api.manifest().methodology.version)
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    const values = [
      ...file.indicators.indicators.map((i) => ['ind', i.id]),
      ['sign', 'positive'],
      ['sign', 'negative'],
      ...file.confidence.levels.map((l) => ['conf', l.id]),
    ]
    for (const [facet, v] of values) {
      expect(css, `${facet} ${v}`).toContain(
        `#f-${facet}-${v}:target ~ .ev-list > .ev-item:not(.f-${v})`,
      )
      expect(css, `${facet} ${v}`).toContain(`#f-${facet}-${v}:target ~ .ev-filters .ev-flink-${v}`)
    }
  })

  it('lists every public event once, and reads every generated row with its columns', () => {
    const api = apiReader(path.join(dir, 'v1'))
    for (const c of api.countries().countries) {
      const file = api.country(c.iso3)
      if (file.excluded) continue
      const listed = listItems(file.event_list).flatMap((i) =>
        i.kind === 'event' ? [i.event.id] : i.values.map((v) => v.id),
      )
      expect([...listed].sort()).toEqual(file.event_list.map((e) => e.id).sort())
      for (const e of file.event_list.filter((x) => x.generated)) {
        const g = groupEvidence(e.evidence)
        expect(g.rows.length, e.id).toBeGreaterThan(0)
        for (const q of g.quotes) expect(q.locator.startsWith('row '), e.id).toBe(false)
      }
      expect(timelineEvents(file.event_list).length).toBeLessThanOrEqual(file.event_list.length)
      for (const e of computedInForce(file.event_list)) expect(e.at_build.reason).toBe('counted')
    }
  })

  it('renders a 1200 × 630 share card for each kind of entry', async () => {
    const api = apiReader(path.join(dir, 'v1'))
    const manifest = api.manifest()
    const m = siteMethodology(api.methodology(manifest.methodology.version))
    const fonts = loadFonts()
    const deu = api.countries().countries.find((c) => c.iso3 === 'DEU')
    const isr = api.countries().countries.find((c) => c.iso3 === 'ISR')
    if (deu === undefined || isr === undefined) throw new Error('fixture countries missing')
    const score = cardInput({ entry: deu, lang: 'en', mode: 'score', methodology: m, manifest })
    const card = cardInput({ entry: deu, lang: 'fr', mode: 'scorecard', methodology: m, manifest })
    const excluded = cardInput({ entry: isr, lang: 'en', mode: 'score', methodology: m, manifest })
    expect(score.kind).toBe('score')
    expect(score.score).toMatch(/^([+\u2212]\d+|0)$/)
    expect(card.kind).toBe('scorecard')
    expect(card.score).toBeUndefined()
    expect(card.scorecardLine).toContain('Fiche')
    expect(excluded.kind).toBe('excluded')
    for (const input of [score, card, excluded]) {
      const png = await renderCard(input, fonts)
      expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
      expect(png.readUInt32BE(16)).toBe(1200)
      expect(png.readUInt32BE(20)).toBe(630)
    }
  })

  it('has a no-JavaScript country filter rule for every registry entry (Changes page)', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const iso3s = api.countries().countries.map((c) => c.iso3)
    const css = countryFilterCss(iso3s)
    for (const c of iso3s) {
      // The same selectors as the indicator, sign and confidence rules of app/globals.css.
      expect(css, c).toContain(`#f-cty-${c}:target ~ .ev-list > .ev-item:not(.f-${c})`)
      expect(css, c).toContain(`#f-cty-${c}:target ~ .ev-filters .ev-flink-${c}`)
    }
    expect(() => countryFilterCss(['deu'])).toThrow()
  })

  it('renders every monthly report in its four variants, each row linked to its entry', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const latest = api.changesLatest()
    let linked = 0
    for (const m of latest.months) {
      const month = api.changesMonth(m.month)
      const variants = [
        ['en', month.reports.en, false],
        ['fr', month.reports.fr, false],
        ['en', month.reports.scorecard_en, true],
        ['fr', month.reports.scorecard_fr, true],
      ] as const
      for (const [lang, file, scorecard] of variants) {
        const html = renderToStaticMarkup(
          createElement(MonthReport, { lang, month, markdown: api.text(file), scorecard }),
        )
        expect(html, file).toMatch(/^<div[^>]*><h1 /)
        const links = reportLinks(month, lang)
        const hrefs = [
          ...(scorecard ? [] : links.movers),
          ...links.weeks.flat().map((l) => l.href),
          ...links.ended.map((l) => l.href),
          ...links.corrections.map((l) => l.href),
        ].filter((h): h is string => h !== null)
        for (const h of hrefs) expect(html, `${file} ${h}`).toContain(`href="${h}"`)
        linked += hrefs.length
        // No score in scorecard mode (D-16): the movers table is left out.
        if (scorecard) expect(html).not.toContain('<table')
      }
    }
    // The fixtures have a mover, a new event and an end (months 2025-08 and 2025-11).
    expect(linked).toBeGreaterThan(0)
  })

  it('the Data page: every endpoint has an example from the build, cut as it says', () => {
    const api = apiReader(path.join(dir, 'v1'))
    for (const mode of ['score', 'scorecard'] as const) {
      for (const e of endpoints(api, mode)) {
        expect(e.example, e.path).not.toBeNull()
        const ex = exampleOf(api, e)
        expect(ex?.text.length, e.path).toBeGreaterThan(0)
        if (e.kind === 'json') expect(() => JSON.parse(ex?.text ?? ''), e.path).not.toThrow()
      }
    }
  })

  it('the corrections log: one row per correction, anchored by its id, linked to its event', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const file = api.corrections()
    expect(file.corrections.length).toBeGreaterThan(0)
    const names = Object.fromEntries(api.countries().countries.map((c) => [c.iso3, c.name]))
    for (const lang of ['en', 'fr'] as const) {
      const html = renderToStaticMarkup(
        createElement(CorrectionsTable, {
          lang,
          corrections: file.corrections,
          names,
          repoUrl: 'https://github.com/mohazed/GAI',
        }),
      )
      for (const c of file.corrections) {
        expect(html).toContain(`id="${c.id}"`)
        expect(html).toContain(`href="/${lang}/country/${c.country}/#${c.event}"`)
        if (c.commit !== null) expect(html).toContain(c.commit.slice(0, 7))
      }
    }
  })

  it('the sensitivity tables: a summary row per setting and a full ranking per table', () => {
    const api = apiReader(path.join(dir, 'v1'))
    const data = api.sensitivity()
    const names = Object.fromEntries(api.countries().countries.map((c) => [c.iso3, c.name]))
    const html = renderToStaticMarkup(createElement(SensitivityTables, { lang: 'en', data, names }))
    expect(html.match(/<details/g)?.length).toBe(data.tables.length)
    const settings = data.tables.reduce((n, t) => n + t.variants.length, 0)
    // Each setting is a row of its summary table and a column of its full ranking.
    expect(html.match(/<th scope="row"/g)?.length).toBe(
      settings + data.tables.length * data.baseline.length,
    )
  })
})
