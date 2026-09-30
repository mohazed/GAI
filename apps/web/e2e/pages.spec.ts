import AxeBuilder from '@axe-core/playwright'
import { type Browser, expect, type Page, test } from '@playwright/test'

/** A French name as the site shows it: the typographic apostrophe (P-18, docs/05 §2). */
const shown = (name: string, lang: string) =>
  lang === 'fr' ? name.replace(/(\p{L})'(?=\p{L})/gu, '$1’') : name

/**
 * Smoke tests of Home and Ranking (P-07), in English and French, with JavaScript on and off, in
 * the mode of the project: `score` (kit build, scores shown) and `scorecard` (production build,
 * D-16). Values come from the API the build published, so the tests hold for any dataset.
 */

type Lang = 'en' | 'fr'
const LANGS: Lang[] = ['en', 'fr']

const TEXT = {
  en: {
    statement: 'Every government, one scale, every point sourced.',
    moved: 'Moved this week',
    changed: 'Changed this week',
    strip: 'Highest and lowest scores',
    list: 'Scorecards by country',
    search: 'Find a country',
    weights: 'Your weights',
    csv: 'Download CSV',
    coverage50: 'Coverage ≥ 50%',
    country: 'Country',
    empty: 'No country matches these filters.',
  },
  fr: {
    statement: 'Chaque gouvernement, une seule échelle, chaque point sourcé.',
    moved: 'Évolutions de la semaine',
    changed: 'Changements de la semaine',
    strip: 'Scores les plus hauts et les plus bas',
    list: 'Fiches par pays',
    search: 'Trouver un pays',
    weights: 'Vos pondérations',
    csv: 'Télécharger le CSV',
    coverage50: 'Couverture ≥ 50 %',
    country: 'Pays',
    empty: 'Aucun pays ne correspond à ces filtres.',
  },
} as const

interface Entry {
  iso3: string
  excluded: boolean
  name: Record<Lang, string>
  score?: number
  score_display?: number
  passivity?: { value: number }
  categories?: Record<'A' | 'B' | 'C' | 'D', { clipped: number }>
  coverage?: { ratio: number }
}

const scoreMode = () => test.info().project.name === 'score'

async function countries(page: Page): Promise<Entry[]> {
  const res = await page.request.get('/api/v1/countries.json')
  expect(res.status()).toBe(200)
  return ((await res.json()) as { countries: Entry[] }).countries
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

for (const lang of LANGS) {
  const t = TEXT[lang]

  test.describe(`home /${lang}/`, () => {
    test('renders every section and hydrates without errors', async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto(`/${lang}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.statement)
      await expect(page.getByRole('heading', { name: t.changed })).toBeVisible()
      await expect(page.getByLabel(t.search)).toBeVisible()
      if (scoreMode()) {
        await expect(page.getByRole('heading', { name: t.moved })).toBeVisible()
        await expect(page.getByRole('heading', { name: t.strip })).toBeVisible()
      } else {
        // Scorecard mode (D-16): nothing made of scores.
        await expect(page.getByRole('heading', { name: t.moved })).toHaveCount(0)
        await expect(page.getByRole('heading', { name: t.strip })).toHaveCount(0)
        await expect(page.getByRole('heading', { name: t.list })).toBeVisible()
        await expect(page.locator(`a[href="/${lang}/ranking/#countries"]`).last()).toBeVisible()
      }
      // The search box turns into a combobox once hydrated.
      await expect(page.getByRole('combobox', { name: t.search })).toBeVisible()
      expect(errors).toEqual([])
    })

    test('the map links every scored country and is replaced on phones', async ({ page }) => {
      const list = await countries(page)
      await page.goto(`/${lang}/`)
      const map = page.locator('figure svg').first()
      await expect(map).toBeVisible()
      for (const c of list) {
        await expect(page.locator(`figure a[href="/${lang}/country/${c.iso3}/"]`)).toHaveCount(1)
      }
      await page.setViewportSize({ width: 375, height: 800 })
      await expect(map).toBeHidden()
      if (scoreMode()) await expect(page.getByRole('heading', { name: t.strip })).toBeVisible()
    })

    test('the ranking strip lists the highest scores first', async ({ page }) => {
      test.skip(!scoreMode(), 'score mode only')
      const list = (await countries(page)).filter((c) => !c.excluded)
      await page.goto(`/${lang}/`)
      const top = [...list].sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0) || (a.iso3 < b.iso3 ? -1 : 1),
      )[0]
      if (top === undefined) return
      const strip = page.locator('section[aria-labelledby="strip-title"] tbody tr').first()
      await expect(strip.getByRole('link')).toHaveText(top.name[lang])
    })

    test('search finds a country by name and opens its page', async ({ page }) => {
      const first = (await countries(page))[0]
      if (first === undefined) return
      await page.goto(`/${lang}/`)
      const box = page.getByRole('combobox', { name: t.search })
      await box.fill(first.name[lang].slice(0, 4))
      await expect(page.getByRole('option', { name: new RegExp(first.name[lang]) })).toBeVisible()
      await box.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/${lang}/country/${first.iso3}/$`))
    })

    test('without JavaScript: complete HTML, the map as SVG links, search posts to the ranking', async ({
      browser,
    }) => {
      const { context, page } = await noJs(browser)
      await page.goto(`/${lang}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.statement)
      await expect(page.locator('figure svg a').first()).toBeAttached()
      await expect(page.getByRole('heading', { name: t.changed })).toBeVisible()
      await expect(page.locator('search form')).toHaveAttribute('action', `/${lang}/ranking/`)
      await expect(page.getByRole('combobox')).toHaveCount(0)
      await context.close()
    })
  })

  test.describe(`ranking /${lang}/ranking/`, () => {
    test('lists every scored country in order, with the excluded apart', async ({ page }) => {
      const errors = collectErrors(page)
      const list = await countries(page)
      const scored = list.filter((c) => !c.excluded)
      await page.goto(`/${lang}/ranking/`)
      const table = page.locator('#countries table')
      const rows = table.locator('tbody').first().locator('tr')
      await expect(rows).toHaveCount(scored.length)
      const names = await rows.locator('th a').allTextContents()
      if (scoreMode()) {
        const order = [...scored].sort(
          (a, b) => (b.score ?? 0) - (a.score ?? 0) || (a.iso3 < b.iso3 ? -1 : 1),
        )
        expect(names).toEqual(order.map((c) => shown(c.name[lang], lang)))
      } else {
        const collator = new Intl.Collator(lang)
        expect(names).toEqual(scored.map((c) => shown(c.name[lang], lang)).sort(collator.compare))
        // No score or band column before the flip (D-16).
        await expect(table.locator('thead th')).toHaveCount(3)
      }
      for (const c of list.filter((x) => x.excluded)) {
        await expect(table.locator(`a[href="/${lang}/country/${c.iso3}/"]`)).toHaveCount(1)
      }
      await expect(page.locator('fieldset')).toBeVisible()
      expect(errors).toEqual([])
    })

    test('the masthead "Countries" link lands on the table', async ({ page }) => {
      await page.goto(`/${lang}/`)
      const link = page.locator(`header a[href="/${lang}/ranking/#countries"]`)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/ranking/#countries$`))
      await expect(page.locator('#countries')).toBeInViewport()
    })

    test('the CSV link serves the published table', async ({ page }) => {
      await page.goto(`/${lang}/ranking/`)
      const link = page.getByRole('link', { name: t.csv })
      const href = await link.getAttribute('href')
      expect(href).toBe(
        scoreMode() ? '/api/v1/dumps/countries.csv' : '/api/v1/dumps/countries.scorecard.csv',
      )
      const res = await page.request.get(href ?? '')
      expect(res.status()).toBe(200)
      const header = (await res.text()).split('\n')[0] ?? ''
      expect(header.startsWith('iso3,name_en,name_fr,region,excluded,')).toBe(true)
      expect(header.includes(',score,')).toBe(scoreMode())
    })

    test('filters and sorting work once JavaScript runs', async ({ page }) => {
      await page.goto(`/${lang}/ranking/`)
      const count = page.locator('#countries > p[aria-live]')
      const before = await count.textContent()
      const cov = page.getByRole('button', { name: t.coverage50 })
      await cov.click()
      await expect(cov).toHaveAttribute('aria-pressed', 'true')
      const list = (await countries(page)).filter((c) => !c.excluded)
      const kept = list.filter((c) => (c.coverage?.ratio ?? 0) >= 0.5).length
      if (kept === 0) await expect(page.getByText(t.empty)).toBeVisible()
      await cov.click()
      await expect(count).toHaveText(before ?? '')
      const header = page.locator('th', {
        has: page.getByRole('button', { name: t.country, exact: true }),
      })
      await header.getByRole('button').click()
      await expect(header).toHaveAttribute('aria-sort', scoreMode() ? 'ascending' : 'descending')
    })

    test('weights re-rank from the URL and write it back (score mode)', async ({ page }) => {
      test.skip(!scoreMode(), 'score mode only (no weights in scorecard mode)')
      const c = (await countries(page)).find((x) => !x.excluded)
      if (c?.categories === undefined || c.passivity === undefined) return
      await page.goto(`/${lang}/ranking/?w=2,1,1,0.5`)
      const details = page.locator('details.weights')
      await expect(details).toHaveAttribute('open', '')
      // docs/02 §9, restated here to check the page: S = clip(Σ w·clip_k − passivity, −100, 100).
      const k = c.categories
      const raw =
        2 * k.A.clipped + k.B.clipped + k.C.clipped + 0.5 * k.D.clipped - c.passivity.value
      const s = Math.max(-100, Math.min(100, raw))
      const display = Math.sign(s) * Math.floor(Math.abs(s) + 0.5)
      const shown = display === 0 ? '0' : `${display > 0 ? '+' : '−'}${Math.abs(display)}`
      const row = page.locator('#countries tbody tr', {
        has: page.locator(`a[href="/${lang}/country/${c.iso3}/"]`),
      })
      await expect(row.locator('td').nth(1).locator('.num').first()).toHaveText(shown)
      await page.getByRole('slider', { name: /^A / }).fill('1')
      await expect(page).toHaveURL(/\?w=1\.0,1\.0,1\.0,0\.5$/)
    })

    test('without JavaScript: the whole table, sorted, and no controls', async ({ browser }) => {
      const { context, page } = await noJs(browser)
      const list = await countries(page)
      await page.goto(`/${lang}/ranking/`)
      await expect(page.locator('#countries tbody').first().locator('tr')).toHaveCount(
        list.filter((c) => !c.excluded).length,
      )
      // In the HTML (no shift on hydration) but hidden where scripting is off.
      await expect(page.locator('fieldset')).toBeHidden()
      await expect(page.locator('details.weights')).toBeHidden()
      for (const el of await page.getByText(t.weights).all()) await expect(el).toBeHidden()
      await expect(page.getByRole('link', { name: t.csv })).toBeVisible()
      await context.close()
    })
  })

  for (const path of ['', 'ranking/']) {
    test(`/${lang}/${path}: axe finds no WCAG 2.2 AA violation`, async ({ page }) => {
      await page.goto(`/${lang}/${path}`)
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
      expect(summary).toEqual([])
    })

    test(`/${lang}/${path}: nothing reaches into the gutter at 375 px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 })
      await page.goto(`/${lang}/${path}`)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
}
