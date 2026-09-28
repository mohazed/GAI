import { createServer, type Server } from 'node:http'
import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

/**
 * The embeddable widget (P-11, docs/04 §4): /embed/v1/gai.js embedded in a blank page of another
 * origin, as a newsroom would; the site is served at localhost and the blank page at 127.0.0.1,
 * so the script, its request and its CORS headers are cross-origin. Both modes: the score build
 * (kit) and the scorecard build (production, D-16). Also the live examples of /embed.
 */

const scoreMode = () => test.info().project.name === 'score'

interface Entry {
  iso3: string
  excluded: boolean
  name: { en: string; fr: string }
  score_display?: number
  band_name?: { en: string; fr: string }
}

async function countries(page: Page): Promise<Entry[]> {
  const res = await page.request.get('/api/v1/countries.json')
  expect(res.status()).toBe(200)
  return ((await res.json()) as { countries: Entry[] }).countries
}

const signedInt = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0')

/**
 * A page of another origin: a server of its own on 127.0.0.1 (the site is at localhost), started
 * once per worker. It is a real server, not a routed response, so that Chrome sees both origins
 * in the loopback address space and allows the requests (Local Network Access).
 */
const pages = new Map<string, string>()
let blankOrigin = ''
let server: Server | null = null

test.beforeAll(async () => {
  server = createServer((req, res) => {
    const body = pages.get(req.url ?? '')
    res.writeHead(body === undefined ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(body ?? 'not found')
  })
  await new Promise<void>((resolve) => server?.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (address === null || typeof address === 'string') throw new Error('no port')
  blankOrigin = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  await new Promise((resolve) => server?.close(resolve))
})

async function blankPage(page: Page, body: string) {
  const path = `/blank/${pages.size}/`
  pages.set(
    path,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Blank page</title><style>a{color:rgb(255,0,0)}p{font:20px monospace}</style></head><body><main><h1>A story</h1>${body}</main></body></html>`,
  )
  await page.goto(`${blankOrigin}${path}`)
}

function tracker(page: Page, site: string) {
  const requests: string[] = []
  const errors: string[] = []
  page.on('request', (r) => {
    if (r.url().startsWith(site)) requests.push(new URL(r.url()).pathname)
  })
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  return { requests, errors }
}

test.describe('the widget in a blank page of another origin', () => {
  test('gauge and timeline, English and French, one request each, no cookie', async ({
    page,
    baseURL,
  }) => {
    const site = baseURL as string
    const first = (await countries(page)).find((c) => !c.excluded) as Entry
    const { requests, errors } = tracker(page, site)
    await blankPage(
      page,
      `<p>Before</p><script src="${site}/embed/v1/gai.js" data-country="${first.iso3.toLowerCase()}"></script><p>Between</p><script src="${site}/embed/v1/gai.js" data-country="${first.iso3}" data-view="timeline" data-lang="fr"></script><p>After</p>`,
    )
    // Each widget sits in the div its script created, right after it.
    const hosts = page.locator('script[src$="/embed/v1/gai.js"] + div')
    await expect(hosts).toHaveCount(2)
    const gauge = hosts.nth(0)
    const timeline = hosts.nth(1)
    await expect(gauge.getByText(first.name.en, { exact: true })).toBeVisible()
    await expect(timeline.getByText(first.name.fr, { exact: true })).toBeVisible()

    const link = gauge.getByRole('link', { name: `Gaza Accountability Index: ${first.name.en}` })
    await expect(link).toHaveAttribute('href', `${site}/en/country/${first.iso3}/`)
    await expect(
      timeline.getByRole('link', { name: `Gaza Accountability Index : ${first.name.fr}` }),
    ).toHaveAttribute('href', `${site}/fr/country/${first.iso3}/`)
    // The page's styles do not reach inside the shadow root.
    await expect(link).toHaveCSS('color', 'rgb(29, 79, 145)')
    await expect(gauge.locator('div[lang="en"]')).toBeVisible()
    await expect(timeline.locator('div[lang="fr"]')).toBeVisible()

    await expect(gauge.getByRole('img').first()).toBeVisible()
    await expect(gauge.getByText(/^Coverage \d+%$/)).toBeVisible()
    if (scoreMode()) {
      await expect(gauge.locator('.sc0')).toHaveText(signedInt(first.score_display as number))
      await expect(gauge.locator('.chip')).toHaveText(first.band_name?.en as string)
      await expect(timeline.locator('path.ln')).toHaveCount(1)
      await expect(timeline.getByRole('img')).toHaveAttribute(
        'aria-label',
        new RegExp(`^${first.name.fr}, score du 7 octobre 2023 au `),
      )
    } else {
      // Scorecard mode (D-16): no number, no band, no score line.
      await expect(gauge.getByText('Score not yet published · scorecard mode')).toBeVisible()
      await expect(timeline.getByText('Score pas encore publié · mode fiche')).toBeVisible()
      await expect(gauge.locator('.sc0, .chip, rect[class^="b-"]')).toHaveCount(0)
      await expect(timeline.locator('path, rect[class^="b-"]')).toHaveCount(0)
      await expect(timeline.getByRole('img')).toHaveAttribute(
        'aria-label',
        new RegExp(`^${first.name.fr}, du 7 octobre 2023 au `),
      )
    }

    // The script (fetched once or twice) and one country file per widget: nothing else.
    expect(new Set(requests)).toEqual(
      new Set(['/embed/v1/gai.js', `/api/v1/countries/${first.iso3}.json`]),
    )
    expect(requests.filter((r) => r.startsWith('/api/')).length).toBe(2)
    expect(await page.context().cookies()).toEqual([])
    expect(errors).toEqual([])

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(' ')}`)).toEqual([])
  })

  test('an excluded entity: the reason, no gauge', async ({ page, baseURL }) => {
    const site = baseURL as string
    const excluded = (await countries(page)).find((c) => c.excluded)
    test.skip(excluded === undefined, 'no excluded entity in this build')
    const e = excluded as Entry
    await blankPage(
      page,
      `<script src="${site}/embed/v1/gai.js" data-country="${e.iso3}"></script>`,
    )
    const host = page.locator('script + div')
    await expect(host.getByText(/^Not scored\. /)).toBeVisible()
    await expect(host.locator('svg')).toHaveCount(0)
  })

  test('degrades to the link when the file cannot be read', async ({ page, baseURL }) => {
    const site = baseURL as string
    const first = (await countries(page)).find((c) => !c.excluded) as Entry
    await page.route(`${site}/api/v1/countries/${first.iso3}.json`, (route) => route.abort())
    await blankPage(
      page,
      `<script src="${site}/embed/v1/gai.js" data-country="${first.iso3}"></script><script src="${site}/embed/v1/gai.js" data-country="QQQ" data-lang="fr"></script><script src="${site}/embed/v1/gai.js" data-country="not a code"></script>`,
    )
    const hosts = page.locator('script + div')
    await expect(hosts).toHaveCount(3)
    await expect(hosts.nth(0).getByRole('link')).toHaveText(
      `Gaza Accountability Index: ${first.iso3}`,
    )
    await expect(hosts.nth(0).getByRole('link')).toHaveAttribute(
      'href',
      `${site}/en/country/${first.iso3}/`,
    )
    await expect(hosts.nth(1).getByRole('link')).toHaveAttribute('href', `${site}/fr/country/QQQ/`)
    await expect(hosts.nth(2).getByRole('link')).toHaveAttribute('href', `${site}/en/`)
    await expect(hosts.nth(2).getByRole('link')).toHaveText('Gaza Accountability Index')
    // Nothing else is drawn, and nothing more arrives.
    await page.waitForLoadState('networkidle')
    await expect(hosts.locator('svg')).toHaveCount(0)
  })

  test('reads a mirror named by data-origin, and links to it', async ({ page, baseURL }) => {
    const site = baseURL as string
    const first = (await countries(page)).find((c) => !c.excluded) as Entry
    const body = await (await page.request.get(`/api/v1/countries/${first.iso3}.json`)).text()
    const mirror = 'http://mirror.test'
    await page.route(`${mirror}/api/v1/countries/${first.iso3}.json`, (route) =>
      route.fulfill({
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body,
      }),
    )
    await blankPage(
      page,
      `<script src="${site}/embed/v1/gai.js" data-country="${first.iso3}" data-origin="${mirror}/"></script>`,
    )
    const host = page.locator('script + div')
    await expect(host.getByText(first.name.en, { exact: true })).toBeVisible()
    await expect(host.getByRole('link')).toHaveAttribute(
      'href',
      `${mirror}/en/country/${first.iso3}/`,
    )
  })

  test('fits a 320 px column', async ({ page, baseURL }) => {
    const site = baseURL as string
    const first = (await countries(page)).find((c) => !c.excluded) as Entry
    await page.setViewportSize({ width: 320, height: 800 })
    await blankPage(
      page,
      `<script src="${site}/embed/v1/gai.js" data-country="${first.iso3}"></script><script src="${site}/embed/v1/gai.js" data-country="${first.iso3}" data-view="timeline"></script>`,
    )
    await expect(page.locator('script + div').nth(1).getByRole('img')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

for (const lang of ['en', 'fr'] as const) {
  test(`/${lang}/embed/ runs both snippets under the page's CSP`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(e.message))
    const first = (await countries(page)).find((c) => !c.excluded) as Entry
    await page.goto(`/${lang}/embed/`)
    const examples = page.locator('.embed-example')
    await expect(examples).toHaveCount(2)
    for (const i of [0, 1]) {
      await expect(
        examples.nth(i).locator('script + div').getByText(first.name[lang], { exact: true }),
      ).toBeVisible()
    }
    await expect(examples.nth(1).locator('script')).toHaveAttribute('data-view', 'timeline')
    if (lang === 'fr')
      await expect(examples.nth(0).locator('script')).toHaveAttribute('data-lang', 'fr')
    // The "not published yet" line of P-10 is gone.
    await expect(page.getByText(/not published yet|pas encore publié :/)).toHaveCount(0)
    // Hydration left the widgets in place.
    await page.waitForLoadState('networkidle')
    await expect(examples.locator('script + div')).toHaveCount(2)
    expect(errors).toEqual([])
  })
}
