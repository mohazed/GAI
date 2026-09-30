import { describe, expect, it } from 'vitest'
import { CONFIG_PLACEHOLDER, readConfig, type WidgetConfig } from './config.js'
import {
  type CountryFile,
  countryUrl,
  dataUrl,
  linkHtml,
  linkText,
  readOptions,
  renderWidget,
} from './render.js'
import { CSS } from './styles.js'

const SCRIPT = 'https://gai.example/embed/v1/gai.js'
const PAGE = 'https://news.example/story/'

const config = (mode: WidgetConfig['mode']): WidgetConfig => ({
  mode,
  start: '2023-10-07',
  clip: [-100, 100],
  bands: [
    ['sustaining', -100, -50.5],
    ['enabling', -50.5, -15.5],
    ['passive', -15.5, 15.5],
    ['acting', 15.5, 50.5],
    ['confronting', 50.5, 100],
  ],
})

const event = (
  date: string,
  points: number,
  extra: Partial<NonNullable<CountryFile['event_list']>[number]> = {},
) => ({
  date,
  indicator: 'B9',
  points,
  summary: { en: `Summary <b>${date}</b>`, fr: `Résumé ${date}` },
  generated: false,
  scored: true,
  type: 'repeatable',
  ...extra,
})

const file: CountryFile = {
  iso3: 'DEU',
  name: { en: 'Germany', fr: 'Allemagne' },
  excluded: false,
  build_date: '2026-09-28',
  methodology: '1.0.0',
  score: -12.4,
  score_display: -12,
  band: 'passive',
  band_name: { en: 'Passive', fr: 'Passivité' },
  summary: { en: 'Score −12 (Passive). 3 events.', fr: 'Score −12 (Passivité). 3 événements.' },
  summary_scorecard: { en: '3 events, 1 confirmed.', fr: '3 événements, dont 1 confirmé.' },
  coverage: {
    ratio: 0.705,
    applicable: 30,
    has_events: 3,
    none_found: 18,
    no_data: 2,
    unchecked: 7,
    statuses: {
      A1: 'has-events',
      A10: 'none-found',
      A2: 'no-data',
      B2: 'not-applicable',
      B1: 'unchecked',
    },
  },
  series: [
    { date: '2023-10-07', score: 0 },
    { date: '2024-01-15', score: -10 },
    { date: '2025-06-01', score: -12.4 },
  ],
  event_list: [
    event('2024-01-15', -10),
    event('2025-06-01', 2, { generated: true, type: 'computed' }),
    event('2025-07-01', -4, { scored: false }),
  ],
}

describe('readOptions', () => {
  it('reads the data attributes, with their defaults', () => {
    expect(readOptions({ country: 'deu' }, SCRIPT, PAGE)).toEqual({
      iso3: 'DEU',
      view: 'gauge',
      lang: 'en',
      origin: 'https://gai.example',
    })
    expect(
      readOptions({ country: 'FRA', view: 'timeline', lang: 'fr' }, SCRIPT, PAGE),
    ).toMatchObject({
      view: 'timeline',
      lang: 'fr',
    })
    expect(readOptions({ country: 'FRA', view: 'map', lang: 'de' }, SCRIPT, PAGE)).toMatchObject({
      view: 'gauge',
      lang: 'en',
    })
  })
  it('refuses what is not an ISO3 code', () => {
    for (const country of [undefined, '', 'DE', 'DEUT', 'D1U', '../x']) {
      expect(readOptions({ country }, SCRIPT, PAGE).iso3).toBeNull()
    }
  })
  it('takes the origin of data-origin when it is an http(s) address, else the script origin', () => {
    expect(
      readOptions({ country: 'DEU', origin: 'https://mirror.example/path/' }, SCRIPT, PAGE).origin,
    ).toBe('https://mirror.example')
    for (const origin of ['javascript:alert(1)', 'not a url', 'data:text/plain,x']) {
      expect(readOptions({ country: 'DEU', origin }, SCRIPT, PAGE).origin).toBe(
        'https://gai.example',
      )
    }
    // A relative src resolves against the page.
    expect(readOptions({ country: 'DEU' }, '/embed/v1/gai.js', PAGE).origin).toBe(
      'https://news.example',
    )
  })
  it('links to the country page and reads the country file', () => {
    const o = readOptions({ country: 'DEU', lang: 'fr' }, SCRIPT, PAGE)
    expect(countryUrl(o)).toBe('https://gai.example/fr/country/DEU/')
    expect(dataUrl(o)).toBe('https://gai.example/api/v1/countries/DEU.json')
    expect(countryUrl(readOptions({}, SCRIPT, PAGE))).toBe('https://gai.example/en/')
    expect(linkHtml(readOptions({ country: 'x' }, SCRIPT, PAGE))).toBe(
      '<a href="https://gai.example/en/">Gaza Accountability Index</a>',
    )
    expect(linkHtml(o)).toBe(
      '<a href="https://gai.example/fr/country/DEU/">Gaza Accountability Index : DEU</a>',
    )
  })
})

describe('a hostile country file (P-19: data-origin can point anywhere)', () => {
  const X = '<img src=x onerror=alert(1)>"\''
  // A tag, or an attribute value closed early: what escaping must prevent.
  const UNSAFE = /<img|<script|["']\s*onerror/i
  // Every text of the file carries markup (dates and the code stay valid, so that it renders).
  const texts = JSON.parse(
    JSON.stringify(file, (_k, v) =>
      typeof v === 'string' && !/^\d{4}-\d\d-\d\d$/.test(v) && v !== 'DEU' ? `${v}${X}` : v,
    ),
  ) as CountryFile
  // Markup where the file has numbers, dates and status keys.
  const numbers = structuredClone(texts) as unknown as Record<string, unknown>
  numbers.score = X
  numbers.score_display = X
  numbers.series = [{ date: X, score: X }]
  numbers.event_list = [{ ...event('2024-01-01', 2), points: X, indicator: X }]
  const cov = numbers.coverage as Record<string, unknown>
  cov.ratio = X
  cov.has_events = X
  cov.statuses = { [X]: 'has-events', A1: X, __proto__: 'k' }
  for (const mode of ['score', 'scorecard'] as const)
    for (const view of ['gauge', 'timeline'] as const)
      for (const lang of ['en', 'fr'] as const)
        it(`escapes every text in ${mode} mode, ${view}, ${lang}`, () => {
          const o = readOptions({ country: 'DEU', view, lang }, SCRIPT, PAGE)
          expect(renderWidget(texts, o, config(mode))).not.toMatch(UNSAFE)
          // Markup in a number field either renders as text or makes the render throw (the
          // caller then keeps the link); it never reaches the markup.
          let html = ''
          try {
            html = renderWidget(numbers as unknown as CountryFile, o, config(mode))
          } catch {
            html = ''
          }
          expect(html).not.toMatch(UNSAFE)
        })
  it('builds the fallback link text for DOM calls', () => {
    expect(linkText(readOptions({ country: 'DEU' }, SCRIPT, PAGE))).toBe(
      'Gaza Accountability Index: DEU',
    )
  })
})

describe('readConfig', () => {
  it('is null in a script no site has configured', () => {
    expect(readConfig(CONFIG_PLACEHOLDER)).toBeNull()
    expect(readConfig('{"mode":"other"}')).toBeNull()
    expect(readConfig(JSON.stringify(config('score')))).toEqual(config('score'))
  })
})

describe('renderWidget', () => {
  const opts = (view: 'gauge' | 'timeline', lang: 'en' | 'fr' = 'en') =>
    readOptions({ country: 'DEU', view, lang }, SCRIPT, PAGE)

  it('gauge, score mode: the score, the band, the marker and the coverage', () => {
    const html = renderWidget(file, opts('gauge'), config('score'))
    expect(html).toContain('<span class="sc0">−12</span>')
    expect(html).toContain('class="chip b-passive"')
    expect(html).toContain('<rect class="b-sustaining" x="0%" width="24.75%"')
    expect(html).toContain('aria-label="Score −12, Passive band, on a scale from −100 to +100."')
    expect(html).toContain('<title>−12.4 · methodology v1.0.0</title>')
    expect(html).toContain('<svg x="43.8%"')
    expect(html).toContain('Coverage 71%')
    expect(html).toContain('2 without data, 7 unchecked')
    expect(html).toContain('Score −12 (Passive). 3 events.')
    expect(html).toContain('href="https://gai.example/en/country/DEU/"')
    expect(html).toContain(
      'Built on 28 September 2026 from the published data, methodology v1.0.0.',
    )
    // Coverage segments in methodology order; not-applicable left out.
    expect([...html.matchAll(/title="(\w+) ·/g)].map((m) => m[1])).toEqual([
      'A1',
      'A2',
      'A10',
      'B1',
    ])
  })

  it('gauge, scorecard mode: no number, no band colour, no marker (D-16)', () => {
    const html = renderWidget(file, opts('gauge'), config('scorecard'))
    expect(html).toContain('Score not yet published · scorecard mode')
    expect(html).toContain('aria-label="Scale from −100 to +100. The score is not yet published."')
    expect(html).not.toMatch(/b-(sustaining|enabling|passive|acting|confronting)/)
    expect(html).not.toContain('−12')
    expect(html).not.toContain('Passive')
    expect(html).not.toContain('<title>')
    expect(html).toContain('3 events, 1 confirmed.')
  })

  it('timeline, score mode: the step line, stripes and a dot per scored event', () => {
    const html = renderWidget(file, opts('timeline'), config('score'))
    expect(html).toContain('class="b-passive st"')
    expect(html).toMatch(/<path class="ln" d="M0,92H\d/)
    expect(html.match(/<circle /g)?.length).toBe(2)
    // Negative: filled, 5 px; positive generated: open, 3 − 0.75 px.
    expect(html).toContain('class="ik"')
    expect(html).toContain('class="op"')
    expect(html).toContain('r="2.25"')
    expect(html).toContain('Summary &#60;b&#62;2024-01-15&#60;/b&#62;')
    expect(html).toContain(
      'aria-label="Germany, score from 7 October 2023 to 28 September 2026: 2 changes; −12.4 at the end."',
    )
    expect(html).toContain('>2024</text>')
  })

  it('timeline, scorecard mode: a date strip, no score axis (D-16)', () => {
    const html = renderWidget(file, opts('timeline', 'fr'), config('scorecard'))
    expect(html).not.toContain('<path')
    expect(html).not.toMatch(/b-(sustaining|enabling|passive|acting|confronting)/)
    expect(html).toContain('Score pas encore publié · mode fiche')
    expect(html).toContain(
      'aria-label="Allemagne, du 7 octobre 2023 au 28 septembre 2026 : 1 événement et 1 changement de valeurs calculées."',
    )
    expect(html).toContain('lang="fr"')
  })

  it('an excluded entity: the reason, no gauge', () => {
    const isr: CountryFile = {
      iso3: 'ISR',
      name: { en: 'Israel', fr: 'Israël' },
      excluded: true,
      excluded_reason: { en: 'Party to the conflict.', fr: 'Partie au conflit.' },
      build_date: '2026-09-28',
      methodology: '1.0.0',
    }
    const o = readOptions({ country: 'ISR' }, SCRIPT, PAGE)
    const html = renderWidget(isr, o, config('score'))
    expect(html).toContain('Not scored. Party to the conflict.')
    expect(html).not.toContain('<svg')
  })

  it('refuses a file that is not the country asked for', () => {
    expect(() =>
      renderWidget(file, readOptions({ country: 'FRA' }, SCRIPT, PAGE), config('score')),
    ).toThrow()
    expect(() =>
      renderWidget(
        { ...file, coverage: undefined } as unknown as CountryFile,
        opts('gauge'),
        config('score'),
      ),
    ).toThrow()
  })

  it('writes no style attribute (the site CSP refuses them)', () => {
    for (const mode of ['score', 'scorecard'] as const)
      for (const view of ['gauge', 'timeline'] as const)
        expect(renderWidget(file, opts(view), config(mode))).not.toMatch(/\sstyle=/)
  })
})

describe('CSS', () => {
  it('uses only the colours of the design tokens (docs/05 §3)', () => {
    const tokens = new Set(
      ['#fff', '#f3f3f0', '#d6d6d0', '#15161a', '#4b4d53', '#6f7278', '#1d4f91'].concat([
        '#7a1f1a',
        '#c4613e',
        '#b9b3a6',
        '#4f8a88',
        '#16504f',
      ]),
    )
    for (const m of CSS.matchAll(/#[0-9a-f]{3,8}\b/gi))
      expect(tokens.has(m[0].toLowerCase()), m[0]).toBe(true)
    expect(CSS).not.toMatch(/shadow|Inter\b|border-radius:(?!2px)/)
  })
})
