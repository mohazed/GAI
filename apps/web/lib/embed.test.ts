/**
 * The widget (apps/widget) and the site agree: its strings are the site's messages, its config
 * is the methodology's, the snippet of /embed is the one it reads, and the build writes the
 * config into the script once.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  CONFIG_PLACEHOLDER,
  readConfig,
  readOptions,
  STRINGS,
  type WidgetConfig,
} from '@gai/widget'
import { describe, expect, it } from 'vitest'
import { configure, widgetConfig } from '../scripts/embed'
import { embedSnippet } from './embed'
import { getT, LOCALES } from './i18n'
import type { SiteMethodology } from './methodology'

const methodology = {
  version: '1.0.0',
  windowStart: '2023-10-07',
  scoreClip: { min: -100, max: 100 },
  bands: [
    { id: 'low', name: { en: 'Low', fr: 'Bas' }, min: -100, max: -1 },
    { id: 'mid', name: { en: 'Mid', fr: 'Moyen' }, min: 0, max: 0 },
    { id: 'high', name: { en: 'High', fr: 'Haut' }, min: 1, max: 100 },
  ],
  categories: [],
  indicators: [],
  confidence: [],
  passivityPoints: 0,
} as SiteMethodology

describe('widget strings', () => {
  for (const lang of LOCALES) {
    it(`${lang}: are the site's messages`, () => {
      const t = getT(lang)
      const s = STRINGS[lang]
      expect(s.link('Germany')).toBe(`${t('common.siteName')}${lang === 'fr' ? ' :' : ':'} Germany`)
      expect(s.site).toBe(t('common.siteName'))
      expect(s.scorecard).toBe(t('gauge.scorecard'))
      expect(s.scorecardLabel).toBe(t('gauge.scorecardLabel'))
      expect(s.gaugeLabel('−12', 'X')).toBe(t('gauge.label', { score: '−12', band: 'X' }))
      expect(s.tooltip('−12.4', '1.0.0')).toBe(
        t('gauge.tooltip', { score: '−12.4', version: '1.0.0' }),
      )
      expect(s.zero).toBe(t('gauge.zero'))
      expect(s.excluded('R.')).toBe(t('gauge.excluded', { reason: 'R.' }))
      expect(s.coverage('71%')).toBe(t('coverage.label', { pct: '71%' }))
      for (const [noData, unchecked] of [
        [0, 0],
        [1, 1],
        [2, 27],
      ] as const) {
        expect(s.missing(noData, unchecked)).toBe(t('coverage.missing', { noData, unchecked }))
        expect(s.coverageAria('71%', 3, 30, noData, unchecked)).toBe(
          t('coverage.aria', { pct: '71%', covered: '3', applicable: '30', noData, unchecked }),
        )
      }
      for (const st of ['has-events', 'none-found', 'no-data', 'unchecked'] as const)
        expect(s.status[st]).toBe(t(`coverage.status.${st}`))
      for (const n of [0, 1, 2, 12]) {
        expect(s.timelineAria('C', 'a', 'b', n, '−1')).toBe(
          t('chart.timelineAria', { country: 'C', from: 'a', to: 'b', changes: n, score: '−1' }),
        )
        expect(s.stripAria('C', 'a', 'b', n, 1 - Math.min(n, 1))).toBe(
          t('chart.stripAria', {
            country: 'C',
            from: 'a',
            to: 'b',
            count: n,
            changes: 1 - Math.min(n, 1),
          }),
        )
      }
      expect(s.built('1 May 2026', '1.0.0')).toBe(
        t('changesPage.built', { date: '1 May 2026', version: '1.0.0' }),
      )
    })
  }
})

describe('widget config (scripts/embed.ts)', () => {
  it('carries the mode, the window and the band segments of the methodology', () => {
    const c: WidgetConfig = widgetConfig('scorecard', methodology)
    expect(c).toEqual({
      mode: 'scorecard',
      start: '2023-10-07',
      clip: [-100, 100],
      bands: [
        ['low', -100, -0.5],
        ['mid', -0.5, 0.5],
        ['high', 0.5, 100],
      ],
    })
  })

  it('is written in place of the placeholder, once, as a string the widget parses', () => {
    const config = widgetConfig('score', methodology)
    for (const q of ['"', "'", '`']) {
      const script = `(function(){var e=${q}${CONFIG_PLACEHOLDER}${q};run(e)})();`
      const out = configure(script, config)
      const literal = /var e=("(?:[^"\\]|\\.)*");/.exec(out)?.[1] ?? ''
      expect(readConfig(JSON.parse(literal) as string)).toEqual(config)
    }
    expect(() => configure('var e=1', config)).toThrow(/0 times/)
    expect(() => configure(`"${CONFIG_PLACEHOLDER}";"${CONFIG_PLACEHOLDER}"`, config)).toThrow(
      /2 times/,
    )
  })

  const dist = path.resolve(import.meta.dirname, '..', '..', 'widget', 'dist', 'gai.js')
  it.skipIf(!existsSync(dist))('fits the built script (apps/widget/dist/gai.js)', () => {
    const out = configure(readFileSync(dist, 'utf8'), widgetConfig('scorecard', methodology))
    expect(out).not.toContain(CONFIG_PLACEHOLDER)
    expect(out).toContain('"{\\"mode\\":\\"scorecard\\"')
  })
})

describe('the /embed snippet', () => {
  it('carries the attributes the widget reads', () => {
    const html = embedSnippet('https://gai.example/', { iso3: 'DEU', view: 'timeline', lang: 'fr' })
    expect(html).toBe(
      '<script src="https://gai.example/embed/v1/gai.js" data-country="DEU" data-view="timeline" data-lang="fr"></script>',
    )
    const data = Object.fromEntries(
      [...html.matchAll(/data-(\w+)="([^"]*)"/g)].map((m) => [m[1] as string, m[2]]),
    )
    const src = /src="([^"]+)"/.exec(html)?.[1] ?? ''
    expect(readOptions(data, src, 'https://news.example/')).toEqual({
      iso3: 'DEU',
      view: 'timeline',
      lang: 'fr',
      origin: 'https://gai.example',
    })
  })
})
