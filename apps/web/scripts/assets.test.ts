import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { PRELOADED_FONTS } from '../lib/fonts'
import { missingAssetUrls } from './assets'
import { FONTS, publishedName } from './fonts'

const dir = mkdtempSync(path.join(tmpdir(), 'gai-assets-'))
mkdirSync(path.join(dir, 'fonts'), { recursive: true })
writeFileSync(path.join(dir, 'fonts', 'a.woff2'), '')
afterAll(() => rmSync(dir, { recursive: true, force: true }))

describe('asset URLs of the stylesheet (B-102)', () => {
  it('lists root-relative url() targets missing from the output', () => {
    const css = 'src:url(/static/media/a.woff2);src:url("/fonts/a.woff2?v=1");b:url(x.png)'
    expect(missingAssetUrls(css, dir)).toEqual(['/static/media/a.woff2'])
  })

  it('points every font of globals.css at a file scripts/fonts.ts publishes', () => {
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    const used = [...css.matchAll(/url\("?(\/fonts\/[^")]+)"?\)/g)].map((m) => m[1]).sort()
    const published = FONTS.map(([pkg, , name]) => `/fonts/${publishedName(pkg, name)}`).sort()
    expect(used).toEqual(published)
  })

  it('preloads only fonts the stylesheet uses (lib/fonts.ts)', () => {
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    for (const f of PRELOADED_FONTS) expect(css).toContain(`url("${f}")`)
  })
})
