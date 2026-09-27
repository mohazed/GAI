import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

const ROWS = [0, 1, 2, 3, 4]

function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

test.describe('component kit (/_kit)', () => {
  test('renders and hydrates under the CSP without errors', async ({ page }) => {
    const errors = collectErrors(page)
    const res = await page.goto('/_kit/')
    expect(res?.status()).toBe(200)
    expect(res?.headers()['content-security-policy']).toContain("style-src 'self'")
    // Client islands mount only after hydration: the ranking filters appear then.
    await expect(page.locator('[data-kit-row="0"] fieldset').first()).toBeVisible()
    expect(errors).toEqual([])
  })

  for (const row of ROWS) {
    test(`axe finds no WCAG 2.2 AA violation in row ${row}`, async ({ page }) => {
      await page.goto('/_kit/')
      await expect(page.locator(`[data-kit-row="${row}"] fieldset`).first()).toBeVisible()
      // Open every disclosure so that the tables behind the charts are checked too.
      await page.evaluate(() => {
        for (const d of document.querySelectorAll('details')) d.open = true
      })
      const result = await new AxeBuilder({ page })
        .include(`[data-kit-row="${row}"]`)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        // The kit repeats the masthead, footer and search of a page once per row by design; on a
        // real page each exists once. Heading order is the kit's own (h1, h2 per row, h3 per
        // specimen), not a page's.
        .disableRules(['landmark-unique', 'heading-order', 'page-has-heading-one', 'region'])
        .analyze()
      const summary = result.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`,
      )
      expect(summary).toEqual([])
      // The include selector matched real content: many rules passed on it.
      expect(result.passes.length).toBeGreaterThan(20)
    })
  }

  test('no horizontal page scroll at 375 px, and none at 1280 px', async ({ page }) => {
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/_kit/')
      await expect(page.locator('[data-kit-row="0"] fieldset').first()).toBeVisible()
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        return doc.scrollWidth - doc.clientWidth
      })
      expect(overflow, `page overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(0)
      // Stricter than the page itself: nothing may reach into the right-hand gutter (16 px on a
      // phone), so that slightly wider text metrics on another system cannot tip it over. Content
      // inside its own scroll container, visually hidden text and SVG marks drawn past their
      // chart's edge are left out.
      const intruders = await page.evaluate(() => {
        const limit = document.documentElement.clientWidth - 8
        const out: string[] = []
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          if (el.closest('.overflow-x-auto, .sr-only') || el.parentElement?.closest('svg')) continue
          // Leaves only (text, cells, controls, a chart's root <svg>): containers own the gutter.
          if (el.tagName.toLowerCase() !== 'svg' && el.children.length > 0) continue
          const r = el.getBoundingClientRect()
          if (r.width > 0 && r.right > limit) {
            out.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}" ends at ${Math.round(r.right)}`,
            )
          }
        }
        return out
      })
      expect(intruders, `elements in the gutter at ${width}px`).toEqual([])
    }
  })

  test('keyboard: the gauge tooltip opens on focus', async ({ page }) => {
    await page.goto('/_kit/')
    const gauge = page.locator('[data-kit-row="0"] .gauge').first()
    await gauge.focus()
    await expect(gauge.locator('.gauge-tip')).toBeVisible()
  })

  test('weights re-rank the table and go into the URL', async ({ page }) => {
    await page.goto('/_kit/')
    const row = page.locator('[data-kit-row="0"]')
    await expect(row.locator('fieldset').first()).toBeVisible()
    // The weights panel is collapsed by default (docs/05 §6).
    await row.locator('details.weights > summary').first().click()
    const slider = row.getByRole('slider', { name: /^A / }).first()
    await slider.fill('0')
    await expect(page).toHaveURL(/\?w=0\.0,1\.0,1\.0,1\.0$/)
    await row.getByRole('button', { name: 'Reset' }).first().click()
    await expect(page).not.toHaveURL(/\?w=/)
  })

  test('without JavaScript the kit still shows every table and chart', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/_kit/')
    const row = page.locator('[data-kit-row="0"]')
    await expect(row.locator('table').first()).toBeVisible()
    await expect(row.locator('.gauge svg').first()).toBeVisible()
    await expect(row.getByRole('link', { name: 'Germany' }).first()).toBeVisible()
    // Controls that need JavaScript are hidden without it.
    await expect(row.locator('fieldset').first()).toBeHidden()
    await expect(row.locator('details.weights').first()).toBeHidden()
    await context.close()
  })
})

/**
 * The country page of the fixture Germany (one real event, a synthetic correction and reply) in
 * both languages and modes, and the fixture Israel as an excluded entity (P-08).
 */
test.describe('country page kit (/_kit/country/)', () => {
  for (const view of ['en-score', 'fr-score', 'en-scorecard', 'fr-scorecard', 'en-excluded']) {
    test(`${view}: structure and axe`, async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto(`/_kit/country/${view}/`)
      const main = page.locator(`[data-kit-country="${view}"]`)
      await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1)
      const levels = await main.evaluate((m) =>
        [...m.querySelectorAll('h1, h2, h3, h4')].map((h) => Number(h.tagName.slice(1))),
      )
      for (let i = 1; i < levels.length; i++)
        expect(levels[i] as number).toBeLessThanOrEqual((levels[i - 1] as number) + 1)
      if (view !== 'en-excluded') {
        // The real fixture event: its quote in German, the translation, the revision note, the
        // reply that contests it; gauge and coverage together.
        await expect(
          main.locator('[id="evt_2025_08_08_DEU_A6"] blockquote[lang="de"]'),
        ).toHaveCount(2)
        await expect(
          main.locator('[id="evt_2025_08_08_DEU_A6"] a[href*="/corrections/#"]'),
        ).toHaveCount(1)
        await expect(main.locator('[id="rep_20260927_DEU_1"]')).toHaveCount(1)
        await expect(main.locator('.gauge')).toHaveCount(1)
        await expect(main.locator('.coverage-bar')).toHaveCount(1)
      } else {
        await expect(main.locator('.gauge')).toHaveCount(0)
      }
      await page.evaluate(() => {
        for (const d of document.querySelectorAll('details')) d.open = true
      })
      const result = await new AxeBuilder({ page })
        .include(`[data-kit-country="${view}"]`)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        // The kit page has no masthead or footer landmarks of its own.
        .disableRules(['region'])
        .analyze()
      expect(
        result.violations.map((v) => `${v.id}: ${v.help} ${v.nodes[0]?.target.join(' ')}`),
      ).toEqual([])
      expect(errors).toEqual([])
    })
  }
})

test.describe('changes kit (/_kit/changes/)', () => {
  test('filters: links set client state and the address; the week stays with its entries', async ({
    page,
  }) => {
    const errors = collectErrors(page)
    await page.goto('/_kit/changes/')
    const feed = page.locator('[data-kit-changes="feed"]')
    const nav = feed.getByRole('navigation', { name: 'Filters' })
    await expect(nav).toBeVisible()
    await expect(feed.locator('article')).toHaveCount(2)
    await nav.getByRole('link', { name: 'A6', exact: true }).click()
    await expect(page).toHaveURL(/\?indicator=A6$/)
    await expect(feed.getByText('2 of 2 shown.')).toBeVisible()
    await nav.locator('a[href="#f-cty-DEU"]').click()
    await expect(page).toHaveURL(/\?indicator=A6&country=DEU$/)
    await expect(nav.locator('a[href="#f-cty-DEU"]')).toHaveAttribute('aria-current', 'true')
    await expect(feed.locator('h3')).toHaveCount(2)
    // The address restores the filter.
    await page.goto('/_kit/changes/?sign=negative')
    await expect(feed.getByText('No change matches these filters.')).toBeHidden()
    expect(errors).toEqual([])
  })

  test('filters without JavaScript: the country rule of the Changes stylesheet applies', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/_kit/changes/')
    const link = page.locator('[data-kit-changes="feed"] a[href="#f-cty-DEU"]')
    await link.click()
    await expect(page).toHaveURL(/#f-cty-DEU$/)
    // The link of the current filter is marked (scripts/filter-css.ts), the entries stay.
    await expect(link).toHaveCSS('text-decoration-thickness', '2px')
    await expect(page.locator('[data-kit-changes="feed"] article')).toHaveCount(2)
    for (const a of await page.locator('[data-kit-changes="feed"] article').all())
      await expect(a).toBeVisible()
    await context.close()
  })

  test('monthly reports: the movers table, a new event and an end, each linked', async ({
    page,
  }) => {
    await page.goto('/_kit/changes/')
    const en = page.locator('[data-kit-changes="report-en"]')
    await expect(en.locator('table a[href="/en/country/DEU/"]')).toHaveCount(1)
    await expect(en.locator('a[href="/en/country/DEU/#evt_2025_08_08_DEU_A6"]')).toHaveCount(1)
    const fr = page.locator('[data-kit-changes="report-fr"]')
    // Scorecard variant (D-16): no movers table; the end of the state is listed and linked.
    await expect(fr.locator('table')).toHaveCount(0)
    await expect(fr.locator('a[href="/fr/country/DEU/#evt_2025_08_08_DEU_A6"]')).toHaveCount(1)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      // The kit shows two reports (two h1) under specimen labels, not a page's heading order.
      .disableRules(['heading-order', 'page-has-heading-one', 'landmark-one-main', 'region'])
      .analyze()
    expect(
      result.violations.map((v) => `${v.id}: ${v.help} ${v.nodes[0]?.target.join(' ')}`),
    ).toEqual([])
  })
})
