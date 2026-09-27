import AxeBuilder from '@axe-core/playwright'
import { type Browser, expect, type Page, test } from '@playwright/test'

/**
 * Smoke tests of the Changes page and the monthly reports (P-09), in English and French, with
 * JavaScript on and off, in both modes. Values come from the API the build published. The
 * filters' behaviour with entries to filter is tested on /_kit/changes/ (kit.spec.ts), because
 * the real data may have no entry in the latest weeks.
 */

type Lang = 'en' | 'fr'
const LANGS: Lang[] = ['en', 'fr']

const TEXT = {
  en: {
    title: /^Changes from /,
    months: 'Monthly reports',
    all: 'All changes and monthly reports',
    stale: 'This page was built on',
    report: /^Changes, /,
    markdown: 'Report as Markdown',
  },
  fr: {
    title: /^Changements du /,
    months: 'Rapports mensuels',
    all: 'Tous les changements et les rapports mensuels',
    stale: 'Cette page a été générée le',
    report: /^Changements, /,
    markdown: 'Rapport au format Markdown',
  },
} as const

interface MonthRef {
  month: string
  complete: boolean
  reports: Record<'en' | 'fr' | 'scorecard_en' | 'scorecard_fr', string>
}
interface Latest {
  build_date: string
  months: MonthRef[]
  weeks: { entries: { id: string; country: string; points_changed: boolean }[] }[]
}
interface MonthFile {
  weeks: {
    entries: { id: string; country: string; change: string; points_changed: boolean }[]
  }[]
}

const scoreMode = () => test.info().project.name === 'score'

async function latest(page: Page): Promise<Latest> {
  const res = await page.request.get('/api/v1/changes/latest.json')
  expect(res.status()).toBe(200)
  return (await res.json()) as Latest
}

/** The latest month with an entry listed in its report (a changed or new value), if any. */
async function monthWithEntry(page: Page, l: Latest) {
  for (const m of [...l.months].reverse()) {
    const file = (await (await page.request.get(`/api/v1/changes/${m.month}.json`)).json()) as
      | MonthFile
      | undefined
    const e = file?.weeks
      .flatMap((w) => w.entries)
      .find((x) => x.change === 'start' && x.points_changed)
    if (e !== undefined) return { month: m.month, entry: e }
  }
  return null
}

function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

async function noJs(browser: Browser) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  })
  return { context, page: await context.newPage() }
}

const DAY = 86_400_000

for (const lang of LANGS) {
  const t = TEXT[lang]

  test.describe(`changes /${lang}/changes/`, () => {
    test('the feed, the months with their reports, and no stale notice on a fresh build', async ({
      page,
    }) => {
      const errors = collectErrors(page)
      const l = await latest(page)
      await page.clock.setFixedTime(new Date(Date.parse(`${l.build_date}T12:00:00Z`) + DAY))
      await page.goto(`/${lang}/changes/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.title)
      await expect(page.getByRole('heading', { name: t.months })).toBeVisible()
      for (const m of l.months)
        await expect(page.locator(`a[href="/${lang}/changes/${m.month}/"]`)).toHaveCount(1)
      // Listed entries: computed values only when their points changed.
      const listed = l.weeks.flatMap((w) => w.entries).filter((e) => e.points_changed)
      await expect(page.locator('#feed article')).toHaveCount(listed.length)
      await expect(page.getByText(t.stale)).toHaveCount(0)
      expect(errors).toEqual([])
    })

    test('a build older than three days shows the stale notice', async ({ page }) => {
      const l = await latest(page)
      await page.clock.setFixedTime(new Date(Date.parse(`${l.build_date}T12:00:00Z`) + 5 * DAY))
      await page.goto(`/${lang}/changes/`)
      await expect(page.getByRole('status')).toContainText(t.stale)
    })

    test('a monthly report: its title, the months around it, the Markdown it renders', async ({
      page,
    }) => {
      const errors = collectErrors(page)
      const l = await latest(page)
      const m = l.months[l.months.length - 1] as MonthRef
      await page.goto(`/${lang}/changes/`)
      await page.locator(`a[href="/${lang}/changes/${m.month}/"]`).click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/changes/${m.month}/$`))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.report)
      await expect(page.getByRole('link', { name: t.all })).toBeVisible()
      const variant = scoreMode() ? lang : (`scorecard_${lang}` as const)
      const link = page.getByRole('link', { name: t.markdown })
      await expect(link).toHaveAttribute('href', `/api/v1/${m.reports[variant]}`)
      const md = await (await page.request.get(`/api/v1/${m.reports[variant]}`)).text()
      const h1 = /^# (.+)$/m.exec(md)?.[1] ?? ''
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1)
      // Scorecard mode (D-16): the report without scores has no movers table.
      if (!scoreMode()) await expect(page.locator('article table')).toHaveCount(0)
      expect(errors).toEqual([])
    })

    test('a listed entry of a report links to its row on the country page', async ({ page }) => {
      const found = await monthWithEntry(page, await latest(page))
      test.skip(found === null, 'no listed entry in this dataset')
      if (found === null) return
      await page.goto(`/${lang}/changes/${found.month}/`)
      const link = page.locator(
        `article a[href="/${lang}/country/${found.entry.country}/#${found.entry.id}"]`,
      )
      await expect(link).toHaveCount(1)
      await link.click()
      // A computed value lands in its run's table, which the country page opens (B-110).
      await expect(page.locator(`[id="${found.entry.id}"]`)).toBeVisible()
    })

    test('without JavaScript: the feed, the months and the reports are complete', async ({
      browser,
    }) => {
      const { context, page } = await noJs(browser)
      const l = await latest(page)
      await page.goto(`/${lang}/changes/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.title)
      await expect(page.getByRole('heading', { name: t.months })).toBeVisible()
      const m = l.months[0] as MonthRef
      await page.goto(`/${lang}/changes/${m.month}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.report)
      await context.close()
    })

    for (const which of ['changes', 'report'] as const) {
      test(`axe finds no WCAG 2.2 AA violation (${which})`, async ({ page }) => {
        const l = await latest(page)
        const path =
          which === 'changes'
            ? `/${lang}/changes/`
            : `/${lang}/changes/${(await monthWithEntry(page, l))?.month ?? l.months[0]?.month}/`
        await page.goto(path)
        await expect(page.locator('main')).toBeVisible()
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        const summary = result.violations.map(
          (v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`,
        )
        expect(summary).toEqual([])
      })

      test(`nothing reaches into the gutter at 375 px (${which})`, async ({ page }) => {
        const l = await latest(page)
        await page.setViewportSize({ width: 375, height: 800 })
        const found = await monthWithEntry(page, l)
        await page.goto(
          which === 'changes'
            ? `/${lang}/changes/`
            : `/${lang}/changes/${found?.month ?? l.months[0]?.month}/`,
        )
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
      })
    }
  })
}
