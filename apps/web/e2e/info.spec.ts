import AxeBuilder from '@axe-core/playwright'
import { type Browser, expect, type Page, test } from '@playwright/test'

/**
 * Smoke tests of the reference pages (P-10): Methodology (and a version by its number),
 * Corrections, About, Data & API, Embed and Reply, in English and French, with JavaScript on and
 * off, in both modes; and sitemap.xml, robots.txt and llms.txt. Values come from the API the
 * build published, so the tests hold for any dataset.
 */

type Lang = 'en' | 'fr'
const LANGS: Lang[] = ['en', 'fr']

const PAGES = ['methodology', 'corrections', 'about', 'data', 'embed', 'reply'] as const
type PageId = (typeof PAGES)[number]

const H1: Record<Lang, Record<PageId, string>> = {
  en: {
    methodology: 'Methodology',
    corrections: 'Corrections',
    about: 'About the index',
    data: 'Data and API',
    embed: 'Embed a country',
    reply: 'Right of reply',
  },
  fr: {
    methodology: 'Méthodologie',
    corrections: 'Corrections',
    about: 'À propos de l’indice',
    data: 'Données et API',
    embed: 'Intégrer un pays',
    reply: 'Droit de réponse',
  },
}

const TEXT = {
  en: {
    contents: 'Contents',
    changelog: 'Changelog',
    none: 'Reviewers: none yet.',
    empty: 'No correction has been published yet.',
    translation: 'Translation',
    fullRanking: 'Full ranking under each setting',
  },
  fr: {
    contents: 'Sommaire',
    changelog: 'Journal des modifications',
    none: 'Relecteurs : aucun pour l’instant.',
    empty: 'Aucune correction n’a encore été publiée.',
    translation: 'Traduction',
    fullRanking: 'Classement complet pour chaque réglage',
  },
} as const

const STANDPOINT =
  'The About page states openly that the project was started by someone who believes the response of most governments has been inadequate.'

const scoreMode = () => test.info().project.name === 'score'

async function json<T>(page: Page, path: string): Promise<T> {
  const res = await page.request.get(`/api/v1/${path}`)
  expect(res.status()).toBe(200)
  return (await res.json()) as T
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

async function axe(page: Page) {
  // Every disclosure open, so that what it holds is checked too.
  await page.evaluate(() => {
    for (const d of document.querySelectorAll('details')) d.open = true
  })
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
  return result.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`,
  )
}

for (const lang of LANGS) {
  const t = TEXT[lang]

  test.describe(`reference pages /${lang}/`, () => {
    for (const id of PAGES) {
      test(`${id}: title, canonical and hreflang, no console error`, async ({ page }) => {
        const errors = collectErrors(page)
        await page.goto(`/${lang}/${id}/`)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(H1[lang][id])
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          new RegExp(`/${lang}/${id}/$`),
        )
        await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
          'href',
          new RegExp(`/fr/${id}/$`),
        )
        await expect(page.locator('html')).toHaveAttribute('lang', lang)
        expect(errors).toEqual([])
      })

      test(`${id}: axe finds no WCAG 2.2 AA violation`, async ({ page }) => {
        await page.goto(`/${lang}/${id}/`)
        await expect(page.locator('main')).toBeVisible()
        expect(await axe(page)).toEqual([])
      })

      test(`${id}: nothing reaches into the gutter at 375 px`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 })
        await page.goto(`/${lang}/${id}/`)
        await page.evaluate(() => {
          for (const d of document.querySelectorAll('details')) d.open = true
        })
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
      })

      test(`${id}: complete without JavaScript`, async ({ browser }) => {
        const { context, page } = await noJs(browser)
        await page.goto(`/${lang}/${id}/`)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(H1[lang][id])
        expect(await page.locator('main h2').count()).toBeGreaterThan(0)
        await context.close()
      })
    }

    test('methodology: the document, the formula as MathML, versions, changelog, anchors', async ({
      page,
    }) => {
      const index = await json<{ current: string; versions: { version: string }[] }>(
        page,
        'methodology/index.json',
      )
      await page.goto(`/${lang}/methodology/`)
      await expect(page.getByRole('heading', { name: t.contents })).toBeVisible()
      // The formula of the score and of the reader weights, and the coverage ratio (KaTeX, build).
      expect(await page.locator('.doc-math math').count()).toBeGreaterThanOrEqual(3)
      await expect(page.locator('.doc-math annotation').first()).toContainText('\\mathrm{clip}')
      // Every indicator row of the table is an anchor other pages can link to.
      for (const id of ['A1', 'B9', 'D5', 'E3'])
        await expect(page.locator(`#indicator-${id}`)).toHaveCount(1)
      await expect(page.locator('#changelog')).toHaveText(t.changelog)
      await expect(page.locator('#diff')).toBeVisible()
      const select = page.getByRole('combobox')
      await expect(select).toHaveValue(index.current)
      // Every contents link leads to a heading of the page.
      for (const href of await page
        .locator('nav[aria-labelledby="contents-title"] a')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
        await expect(page.locator(href)).toHaveCount(1)
      }
      // The sensitivity tables are rankings: shown in score mode only (D-16).
      await expect(page.locator('#sens-passivity')).toHaveCount(scoreMode() ? 1 : 0)
      if (scoreMode()) await expect(page.getByText(t.fullRanking).first()).toBeVisible()
    })

    test('methodology: a version by its number, canonical on /methodology/', async ({ page }) => {
      const index = await json<{ current: string }>(page, 'methodology/index.json')
      await page.goto(`/${lang}/methodology/${index.current}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(H1[lang].methodology)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`/${lang}/methodology/$`),
      )
    })

    test('corrections: the log or its empty state, matching corrections.json', async ({ page }) => {
      const file = await json<{ corrections: { id: string }[] }>(page, 'corrections.json')
      await page.goto(`/${lang}/corrections/`)
      if (file.corrections.length === 0) {
        await expect(page.getByText(t.empty)).toBeVisible()
      } else {
        for (const c of file.corrections) await expect(page.locator(`tr#${c.id}`)).toHaveCount(1)
      }
      await expect(page.locator('a[href$="report-an-error.yml"]').first()).toBeVisible()
    })

    test('about: the standpoint verbatim and signed, reviewers, contact', async ({ page }) => {
      const index = await json<{ reviewers: { name: string }[] }>(page, 'methodology/index.json')
      await page.goto(`/${lang}/about/`)
      const quote = page.locator('blockquote[lang="en"]')
      await expect(quote).toContainText(STANDPOINT)
      await expect(page.locator('figcaption')).toHaveText('— Mohamed Zouad')
      if (lang === 'fr') await expect(page.getByText(t.translation, { exact: true })).toBeVisible()
      if (index.reviewers.length === 0) await expect(page.getByText(t.none)).toBeVisible()
      for (const form of ['right-of-reply', 'report-an-error', 'submit-a-lead'])
        await expect(page.locator(`a[href$="template=${form}.yml"]`).first()).toBeVisible()
    })

    test('data: every endpoint, downloads of the mode, JSON-LD, reproduce command', async ({
      page,
    }) => {
      const manifest = await json<{
        build_date: string
        git: { sha: string | null }
        files: { path: string }[]
      }>(page, 'manifest.json')
      await page.goto(`/${lang}/data/`)
      for (const path of [
        'countries.json',
        'countries/{ISO3}.json',
        'scores/{YYYY-MM-DD}.json',
        'methodology/{version}.json',
        'changes/latest.json',
        'sensitivity.json',
        'build-notes.json',
        'manifest.json',
        'dumps/scores-daily-{YYYY}.csv',
        'dumps/gai-{YYYY-MM-DD}.json',
      ])
        await expect(page.getByRole('heading', { level: 3, name: path, exact: true })).toHaveCount(
          1,
        )
      // The country table of the site's mode, as on the ranking page (D-16).
      const [shown, hidden] = scoreMode()
        ? ['countries.csv', 'countries.scorecard.csv']
        : ['countries.scorecard.csv', 'countries.csv']
      await expect(page.locator(`a[download][href="/api/v1/dumps/${shown}"]`)).toHaveCount(1)
      await expect(page.locator(`a[download][href="/api/v1/dumps/${hidden}"]`)).toHaveCount(0)
      const dl = await page.request.get('/api/v1/dumps/events.csv')
      expect(dl.status()).toBe(200)
      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}',
      ) as { '@type': string; distribution: { contentUrl: string }[]; dateModified: string }
      expect(ld['@type']).toBe('Dataset')
      expect(ld.dateModified).toBe(manifest.build_date)
      expect(ld.distribution.length).toBeGreaterThan(3)
      const code = await page.locator('pre code').last().textContent()
      expect(code).toContain(`--date ${manifest.build_date}`)
      if (manifest.git.sha !== null) expect(code).toContain(`git checkout ${manifest.git.sha}`)
    })

    test('embed and reply: the snippet and the forms', async ({ page }) => {
      await page.goto(`/${lang}/embed/`)
      await expect(page.locator('pre code').first()).toContainText('data-country="')
      await expect(page.locator('pre code').first()).toContainText('/embed/v1/gai.js')
      await page.goto(`/${lang}/reply/`)
      await expect(page.locator('a[href$="template=right-of-reply.yml"]').first()).toBeVisible()
      await expect(page.locator('main')).toContainText('10')
    })
  })
}

test.describe('sitemap, robots, llms.txt', () => {
  test('sitemap.xml lists every page of both languages', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const xml = await res.text()
    const countries = (await (await request.get('/api/v1/countries.json')).json()) as {
      countries: { iso3: string }[]
    }
    for (const lang of LANGS) {
      for (const p of ['', 'ranking/', 'methodology/', 'data/', 'about/', 'reply/'])
        expect(xml).toContain(`/${lang}/${p}</loc>`)
      for (const c of countries.countries)
        expect(xml).toContain(`/${lang}/country/${c.iso3}/</loc>`)
    }
  })

  test('robots.txt points to the sitemap; llms.txt describes the site', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m)
    const llms = await request.get('/llms.txt')
    expect(llms.status()).toBe(200)
    const text = await llms.text()
    expect(text.startsWith('# Gaza Accountability Index\n')).toBe(true)
    expect(text).toContain('/en/methodology/')
  })
})
