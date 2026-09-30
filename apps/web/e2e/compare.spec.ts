import AxeBuilder from '@axe-core/playwright'
import { type Browser, expect, type Page, test } from '@playwright/test'

/**
 * A French name as the site shows it: the typographic apostrophe between letters and before a
 * closing parenthesis, "d')" (P-18, docs/05 §2; @gai/scoring frenchApostrophes).
 */
const shown = (name: string, lang: string) =>
  lang === 'fr' ? name.replace(/(\p{L}\p{M}*)'(?=\p{L}|\))/gu, '$1’') : name

/**
 * Smoke tests of the Compare page (P-09), in English and French, with JavaScript on and off, in
 * the mode of the project: `score` (kit build) and `scorecard` (production build, D-16). The
 * countries compared come from the API the build published, so the tests hold for any dataset.
 */

type Lang = 'en' | 'fr'
const LANGS: Lang[] = ['en', 'fr']

const TEXT = {
  en: {
    title: 'Up to five countries side by side',
    add: 'Add a country',
    events: 'Events by month',
    month: 'Month',
    noEvents: 'No events for these countries.',
    noJs: 'The comparison needs JavaScript',
    cite: 'Cite',
    remove: (c: string) => `Remove ${c}`,
    dropped: 'Not compared:',
    empty: 'No country chosen.',
    published: 'Show the published scores',
    weights: 'Your weights',
  },
  fr: {
    title: 'Jusqu’à cinq pays côte à côte',
    add: 'Ajouter un pays',
    events: 'Événements par mois',
    month: 'Mois',
    noEvents: 'Aucun événement pour ces pays.',
    noJs: 'La comparaison nécessite JavaScript',
    cite: 'Citer',
    remove: (c: string) => `Retirer de la comparaison : ${c}`,
    dropped: 'Non comparés',
    empty: 'Aucun pays choisi.',
    published: 'Afficher les scores publiés',
    weights: 'Vos pondérations',
  },
} as const

interface Entry {
  iso3: string
  excluded: boolean
  name: Record<Lang, string>
}

const scoreMode = () => test.info().project.name === 'score'

async function entries(page: Page): Promise<Entry[]> {
  const res = await page.request.get('/api/v1/countries.json')
  expect(res.status()).toBe(200)
  return ((await res.json()) as { countries: Entry[] }).countries
}

async function scoredAndExcluded(page: Page) {
  const list = await entries(page)
  const scored = list.find((c) => !c.excluded)
  const excluded = list.find((c) => c.excluded)
  if (scored === undefined || excluded === undefined) throw new Error('need both kinds of entry')
  return { scored, excluded, all: list }
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

for (const lang of LANGS) {
  const t = TEXT[lang]

  test.describe(`compare /${lang}/compare/`, () => {
    test('a country picked in the search is fetched, compared and written into ?c=', async ({
      page,
    }) => {
      const errors = collectErrors(page)
      const { scored } = await scoredAndExcluded(page)
      await page.goto(`/${lang}/compare/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.title)
      await expect(page.getByText(t.empty)).toBeVisible()
      const box = page.getByRole('combobox', { name: t.add })
      await box.fill(shown(scored.name[lang], lang).slice(0, 4))
      await expect(
        page.getByRole('option', { name: new RegExp(shown(scored.name[lang], lang)) }),
      ).toBeVisible()
      await box.press('Enter')
      await expect(page).toHaveURL(new RegExp(`/${lang}/compare/\\?c=${scored.iso3}$`))
      await expect(page.getByRole('heading', { name: t.events })).toBeVisible()
      await expect(
        page.getByRole('button', { name: t.remove(shown(scored.name[lang], lang)) }),
      ).toBeVisible()
      if (scoreMode()) {
        const chart = page.locator('figure svg[role="img"]').first()
        await expect(chart).toHaveAttribute(
          'aria-label',
          new RegExp(shown(scored.name[lang], lang)),
        )
      }
      // The table of events has one column per country; a country without any event that can
      // score (most of the registry before the research sessions, P-13) gets the empty line.
      const table = page.locator('table', { hasText: t.month })
      await expect(table.or(page.getByText(t.noEvents, { exact: true }))).toBeVisible()
      if ((await table.count()) > 0)
        await expect(table).toContainText(shown(scored.name[lang], lang))
      expect(errors).toEqual([])
    })

    test('reads ?c= as the peers link writes it; drops excluded and unknown codes', async ({
      page,
    }) => {
      const { scored, excluded } = await scoredAndExcluded(page)
      await page.goto(`/${lang}/compare/?c=${scored.iso3},${excluded.iso3},XXX`)
      await expect(
        page.getByRole('button', { name: t.remove(shown(scored.name[lang], lang)) }),
      ).toBeVisible()
      await expect(page.getByText(t.dropped)).toContainText(`${excluded.iso3}, XXX`)
      await expect(page).toHaveURL(new RegExp(`\\?c=${scored.iso3}$`))
      await page.getByRole('button', { name: t.remove(shown(scored.name[lang], lang)) }).click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/compare/$`))
      await expect(page.getByText(t.empty)).toBeVisible()
    })

    test('the citation names the comparison and links it', async ({ page }) => {
      const { scored } = await scoredAndExcluded(page)
      await page.goto(`/${lang}/compare/?c=${scored.iso3}`)
      await page.getByText(t.cite, { exact: true }).click()
      await expect(page.locator('[role="tabpanel"]')).toContainText(
        `/${lang}/compare?c=${scored.iso3}`,
      )
      await expect(page.locator('[role="tabpanel"]')).toContainText(shown(scored.name[lang], lang))
    })

    test('?w= weights the lines and can be reset (score mode)', async ({ page }) => {
      test.skip(!scoreMode(), 'score mode only (no weights in scorecard mode)')
      const { scored } = await scoredAndExcluded(page)
      await page.goto(`/${lang}/compare/?c=${scored.iso3}&w=2,1,1,0.5`)
      await expect(page.locator('details.weights')).toHaveAttribute('open', '')
      await page.getByRole('button', { name: t.published }).click()
      await expect(page).toHaveURL(new RegExp(`\\?c=${scored.iso3}$`))
      await expect(page.getByRole('button', { name: t.published })).toHaveCount(0)
    })

    test('scorecard mode drops ?w= and shows no score', async ({ page }) => {
      test.skip(scoreMode(), 'scorecard mode only')
      const { scored } = await scoredAndExcluded(page)
      await page.goto(`/${lang}/compare/?c=${scored.iso3}&w=2,1,1,0.5`)
      await expect(page.getByRole('heading', { name: t.events })).toBeVisible()
      await expect(page).toHaveURL(new RegExp(`\\?c=${scored.iso3}$`))
      await expect(page.locator('figure svg[role="img"]')).toHaveCount(0)
      await expect(page.getByText(t.weights)).toHaveCount(0)
    })

    test('without JavaScript: an explanation and every country page', async ({ browser }) => {
      const { context, page } = await noJs(browser)
      const list = await entries(page)
      await page.goto(`/${lang}/compare/?c=${list.find((c) => !c.excluded)?.iso3 ?? ''}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.title)
      await expect(page.getByRole('heading', { name: t.noJs })).toBeVisible()
      for (const c of list.filter((x) => !x.excluded))
        await expect(page.locator(`main a[href="/${lang}/country/${c.iso3}/"]`)).toBeVisible()
      // The picker needs JavaScript: in the HTML (no shift on hydration), hidden without it.
      await expect(page.getByText(t.add, { exact: true })).toBeHidden()
      await context.close()
    })

    for (const withCountry of [false, true]) {
      test(`axe finds no WCAG 2.2 AA violation${withCountry ? ' (one country)' : ''}`, async ({
        page,
      }) => {
        const { scored } = await scoredAndExcluded(page)
        await page.goto(`/${lang}/compare/${withCountry ? `?c=${scored.iso3}` : ''}`)
        if (withCountry) await expect(page.getByRole('heading', { name: t.events })).toBeVisible()
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
    }

    test('nothing reaches into the gutter at 375 px', async ({ page }) => {
      const { scored } = await scoredAndExcluded(page)
      await page.setViewportSize({ width: 375, height: 800 })
      await page.goto(`/${lang}/compare/?c=${scored.iso3}`)
      await expect(page.getByRole('heading', { name: t.events })).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  })
}

test('the country page peers link opens the comparison of those countries', async ({ page }) => {
  const { scored } = await scoredAndExcluded(page)
  await page.goto(`/en/country/${scored.iso3}/`)
  const link = page.locator('a[href^="/en/compare/?c="]')
  test.skip((await link.count()) === 0, 'no peer in this dataset')
  const href = (await link.first().getAttribute('href')) ?? ''
  await link.first().click()
  await expect(page).toHaveURL(new RegExp(`${href.replace('?', '\\?')}$`))
  await expect(page.getByRole('heading', { name: TEXT.en.events })).toBeVisible()
})
