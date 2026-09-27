import { expect, test } from '@playwright/test'

test.describe('site shell', () => {
  test('/ sends a French browser to /fr/ and others to /en/', async ({ browser }) => {
    for (const [locale, target] of [
      ['fr-FR', '/fr/'],
      ['en-GB', '/en/'],
      ['de-DE', '/en/'],
    ] as const) {
      const context = await browser.newContext({ locale })
      const page = await context.newPage()
      await page.goto('/')
      await expect(page).toHaveURL(new RegExp(`${target}$`))
      await context.close()
    }
  })

  test('/ without JavaScript refreshes to /en/', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(/\/en\/$/)
    await context.close()
  })

  test('localised pages carry lang, the language switch and a per-page CSP', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    await page.goto('/fr/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute(
      'href',
      '/en/',
    )
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content')
    expect(csp).toMatch(/script-src 'self'( 'sha256-[A-Za-z0-9+/=]+')+;/)
    expect(errors).toEqual([])
  })

  test('an unknown path gets the 404 page', async ({ page }) => {
    const res = await page.goto('/en/no-such-page/')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  })

  test('the API is served with CORS', async ({ request }) => {
    const res = await request.get('/api/v1/manifest.json')
    expect(res.status()).toBe(200)
    expect(res.headers()['access-control-allow-origin']).toBe('*')
  })
})
