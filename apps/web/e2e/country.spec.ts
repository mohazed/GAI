import AxeBuilder from '@axe-core/playwright'
import { type Browser, expect, type Page, test } from '@playwright/test'

/**
 * A French name as the site shows it: the typographic apostrophe between letters and before a
 * closing parenthesis, "d')" (P-18, docs/05 §2; @gai/scoring frenchApostrophes).
 */
const shown = (name: string, lang: string) =>
  lang === 'fr' ? name.replace(/(\p{L}\p{M}*)'(?=\p{L}|\))/gu, '$1’') : name

/**
 * Smoke tests of the country page (P-08), in English and French, with JavaScript on and off, in
 * the mode of the project: `score` (kit build) and `scorecard` (production build, D-16). Values
 * come from the API the build published, so the tests hold for any dataset: the scored country
 * tested is the one with the most public events, the excluded one the first excluded entity.
 */

type Lang = 'en' | 'fr'
const LANGS: Lang[] = ['en', 'fr']

const TEXT = {
  en: { events: 'Events', checked: 'What was checked', excluded: 'Why', all: 'All' },
  fr: {
    events: 'Événements',
    checked: 'Ce qui a été vérifié',
    excluded: 'raison de l’exclusion',
    all: 'Tous',
  },
} as const

interface Ev {
  id: string
  type: string
  indicator: string
  previous_points: number | null
  points: number
}
interface CountryFile {
  iso3: string
  excluded: boolean
  name: Record<Lang, string>
  summary?: Record<Lang, string>
  summary_scorecard?: Record<Lang, string>
  event_list?: Ev[]
  build_date: string
}

const scoreMode = () => test.info().project.name === 'score'

async function entries(page: Page) {
  const res = await page.request.get('/api/v1/countries.json')
  expect(res.status()).toBe(200)
  return ((await res.json()) as { countries: { iso3: string; excluded: boolean }[] }).countries
}

async function countryFile(page: Page, iso3: string): Promise<CountryFile> {
  const res = await page.request.get(`/api/v1/countries/${iso3}.json`)
  expect(res.status()).toBe(200)
  return (await res.json()) as CountryFile
}

/** The scored country with the most public events, and the first excluded entity. */
async function subjects(page: Page) {
  const list = await entries(page)
  let best: CountryFile | null = null
  for (const c of list.filter((x) => !x.excluded)) {
    const f = await countryFile(page, c.iso3)
    if (best === null || (f.event_list?.length ?? 0) > (best.event_list?.length ?? 0)) best = f
  }
  const ex = list.find((x) => x.excluded)
  if (best === null || ex === undefined) throw new Error('need a scored and an excluded entry')
  return { scored: best, excluded: await countryFile(page, ex.iso3) }
}

function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

async function noJs(browser: Browser, width = 1280) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width, height: 900 },
  })
  return { context, page: await context.newPage() }
}

/** Heading levels in document order: one h1, and no level skipped on the way down. */
async function headingLevels(page: Page): Promise<number[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) =>
      Number(h.tagName.slice(1)),
    ),
  )
}

for (const lang of LANGS) {
  const t = TEXT[lang]

  test.describe(`country /${lang}/country/{ISO3}/`, () => {
    test('renders every section, in order, and hydrates without errors', async ({ page }) => {
      const errors = collectErrors(page)
      const { scored } = await subjects(page)
      await page.goto(`/${lang}/country/${scored.iso3}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        shown(scored.name[lang], lang),
      )
      // The gauge is never without the coverage bar (docs/05 §5).
      await expect(page.locator('.gauge')).toHaveCount(1)
      await expect(page.locator('.coverage-bar')).toHaveCount(1)
      const summary = scoreMode() ? scored.summary?.[lang] : scored.summary_scorecard?.[lang]
      await expect(page.getByText(summary ?? '', { exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: t.events, exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: t.checked })).toBeVisible()
      const levels = await headingLevels(page)
      expect(levels.filter((l) => l === 1)).toHaveLength(1)
      for (let i = 1; i < levels.length; i++)
        expect(levels[i] as number).toBeLessThanOrEqual((levels[i - 1] as number) + 1)
      // Every public event is on the page (in a card or in the table of its run).
      for (const e of scored.event_list ?? [])
        await expect(page.locator(`[id="${e.id}"]`)).toHaveCount(1)
      expect(errors).toEqual([])
    })

    test('canonical, hreflang, share card and JSON-LD', async ({ page }) => {
      const { scored } = await subjects(page)
      await page.goto(`/${lang}/country/${scored.iso3}/`)
      const path = `/${lang}/country/${scored.iso3}/`
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`${path}$`),
      )
      for (const l of LANGS) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
          'href',
          new RegExp(`/${l}/country/${scored.iso3}/$`),
        )
      }
      const card = lang === 'en' ? `/cards/${scored.iso3}.png` : `/cards/fr/${scored.iso3}.png`
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        new RegExp(`${card.replace(/\//g, '\\/')}$`),
      )
      const png = await page.request.get(card)
      expect(png.status()).toBe(200)
      expect(png.headers()['content-type']).toBe('image/png')
      const body = await png.body()
      expect(body.readUInt32BE(16)).toBe(1200)
      expect(body.readUInt32BE(20)).toBe(630)
      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}',
      ) as { '@type': string; url: string; license: string; distribution: unknown[] }
      expect(ld['@type']).toBe('Dataset')
      expect(ld.url.endsWith(path)).toBe(true)
      expect(ld.license).toContain('creativecommons.org/licenses/by/4.0')
      expect(ld.distribution.length).toBeGreaterThan(0)
      const json = page.locator(`a[href="/api/v1/countries/${scored.iso3}.json"]`)
      await expect(json).toHaveAttribute('download', '')
    })

    test('filters combine in client state and in the address', async ({ page }) => {
      const { scored } = await subjects(page)
      await page.goto(`/${lang}/country/${scored.iso3}/`)
      const items = page.locator('.ev-item')
      const total = await items.count()
      test.skip(total < 2, 'needs two entries')
      const nav = page.locator('nav.ev-filters')
      const first = nav.locator('a[href^="#f-ind-"]').first()
      const id = ((await first.getAttribute('href')) ?? '').replace('#f-ind-', '')
      await first.click()
      await expect(page).toHaveURL(new RegExp(`\\?indicator=${id}$`))
      await expect(first).toHaveAttribute('aria-current', 'true')
      const visible = page.locator('.ev-item:not([hidden])')
      expect(await visible.count()).toBeLessThan(total)
      for (const cls of await visible.evaluateAll((els) => els.map((e) => e.className)))
        expect(cls).toContain(`f-${id}`)
      await nav.getByRole('link', { name: t.all, exact: true }).first().click()
      await expect(visible).toHaveCount(total)
      await expect(page).toHaveURL(new RegExp(`/country/${scored.iso3}/$`))
      // The address restores the filter.
      await page.goto(`/${lang}/country/${scored.iso3}/?indicator=${id}`)
      await expect(first).toHaveAttribute('aria-current', 'true')
      expect(await visible.count()).toBeLessThan(total)
    })

    test('a link to a computed value opens its run', async ({ page }) => {
      const { scored } = await subjects(page)
      const runValue = (scored.event_list ?? []).find(
        (e, _, all) =>
          e.type === 'computed' &&
          all.filter((x) => x.type === 'computed' && x.indicator === e.indicator).length > 1,
      )
      test.skip(runValue === undefined, 'no run of computed values in this dataset')
      await page.goto(`/${lang}/country/${scored.iso3}/#${runValue?.id}`)
      await expect(page.locator(`[id="${runValue?.id}"]`)).toBeVisible()
    })

    test('?date= shows the snapshot banner, or says the page is the scorecard', async ({
      page,
    }) => {
      const { scored } = await subjects(page)
      const index = (await (await page.request.get('/api/v1/scores/index.json')).json()) as {
        dates: string[]
      }
      const date = index.dates[0] as string
      // The dated permalink form, without the trailing slash: the redirect keeps the query.
      await page.goto(`/${lang}/country/${scored.iso3}?date=${date}`)
      await expect(page).toHaveURL(new RegExp(`/country/${scored.iso3}/\\?date=${date}$`))
      const banner = page.locator('main [role="status"]').first()
      await expect(banner).toBeVisible()
      if (scoreMode()) {
        const day = (await (await page.request.get(`/api/v1/scores/${date}.json`)).json()) as {
          countries: { iso3: string; score_display: number }[]
        }
        const d = day.countries.find((c) => c.iso3 === scored.iso3)?.score_display ?? 0
        const shown = d === 0 ? '0' : `${d > 0 ? '+' : '−'}${Math.abs(d)}`
        await expect(banner).toContainText(shown)
        await expect(page.locator('.gauge')).toHaveCount(1)
        await expect(page.locator('.coverage-bar')).toHaveCount(1)
      } else {
        await expect(page.locator('.gauge')).toHaveCount(1)
      }
      await page.goto(`/${lang}/country/${scored.iso3}/?date=1999-01-01`)
      await expect(page.locator('main [role="status"]').first()).toContainText('1999-01-01')
    })

    test('without JavaScript: complete page, and the filter links work', async ({ browser }) => {
      const { context, page } = await noJs(browser)
      const { scored } = await subjects(page)
      await page.goto(`/${lang}/country/${scored.iso3}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        shown(scored.name[lang], lang),
      )
      await expect(page.locator('.gauge')).toHaveCount(1)
      const items = page.locator('.ev-item')
      const total = await items.count()
      // The live count needs JavaScript: in the HTML, hidden.
      await expect(page.locator('#events p[aria-live]')).toBeHidden()
      if (total >= 2) {
        const link = page.locator('nav.ev-filters a[href^="#f-ind-"]').first()
        const id = ((await link.getAttribute('href')) ?? '').replace('#f-ind-', '')
        await link.click()
        const shown = await items.evaluateAll((els) =>
          els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.className),
        )
        expect(shown.length).toBeGreaterThan(0)
        expect(shown.length).toBeLessThan(total)
        for (const cls of shown) expect(cls).toContain(`f-${id}`)
      }
      await context.close()
    })

    test('excluded entity: an explanatory page, not a scorecard', async ({ page }) => {
      const errors = collectErrors(page)
      const { excluded } = await subjects(page)
      await page.goto(`/${lang}/country/${excluded.iso3}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        shown(excluded.name[lang], lang),
      )
      await expect(page.getByRole('heading', { level: 2 })).toContainText(t.excluded)
      await expect(page.locator('.gauge')).toHaveCount(0)
      await expect(page.locator('#events')).toHaveCount(0)
      const card = lang === 'en' ? `/cards/${excluded.iso3}.png` : `/cards/fr/${excluded.iso3}.png`
      expect((await page.request.get(card)).status()).toBe(200)
      expect(errors).toEqual([])
    })

    test('axe finds no WCAG 2.2 AA violation (scored and excluded)', async ({ page }) => {
      const { scored, excluded } = await subjects(page)
      for (const iso3 of [scored.iso3, excluded.iso3]) {
        await page.goto(`/${lang}/country/${iso3}/`)
        await expect(page.locator('main')).toBeVisible()
        await page.evaluate(() => {
          for (const d of document.querySelectorAll('details')) d.open = true
        })
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        const summary = result.violations.map(
          (v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`,
        )
        expect(summary, iso3).toEqual([])
      }
    })

    test('nothing reaches into the gutter at 375 px', async ({ page }) => {
      const { scored } = await subjects(page)
      await page.setViewportSize({ width: 375, height: 800 })
      await page.goto(`/${lang}/country/${scored.iso3}/`)
      await page.evaluate(() => {
        for (const d of document.querySelectorAll('details')) d.open = true
      })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  })
}
