/**
 * The engine on the DEU fixture (fixtures/, P-02): one real event, A6 +10, standing from
 * 2025-08-08 to 2025-11-24 (exclusive), confirmed.
 */

import { join } from 'node:path'
import { loadDataset } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { citation } from './citation.js'
import { coverage } from './coverage.js'
import { indicatorLabels } from './labels.js'
import { bandFor } from './methodology.js'
import { createScorer } from './score.js'
import { lastChange } from './series.js'
import { eventCounts, summaryLine } from './summary.js'
import { methodology, REPO_ROOT } from './test-helpers.js'

const m = methodology()
const ds = loadDataset(join(REPO_ROOT, 'fixtures'))
const events = ds.events.map((e) => e.value)
const deu = ds.countries.find((c) => c.value.iso3 === 'DEU')?.value
const assessment = ds.assessments.find((a) => a.value.country === 'DEU')?.value

describe('DEU fixture', () => {
  it('loads without issues', () => {
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
    expect(deu).toBeDefined()
    expect(events.map((e) => e.id)).toEqual(['evt_2025_08_08_DEU_A6'])
  })

  const s = createScorer('DEU', events, m)

  it('A6 counts +10 from 2025-08-08 to 2025-11-23; category A never lifts passivity', () => {
    expect(s.at('2025-08-07')).toMatchObject({ exact: -15, display: -15, band: 'passive' })
    expect(s.at('2025-08-08')).toMatchObject({ exact: -5, display: -5, band: 'passive' })
    expect(s.at('2025-08-08').categories.A).toMatchObject({ raw: 10, clipped: 10 })
    expect(s.at('2025-08-08').passivity.applied).toBe(true)
    expect(s.at('2025-11-23').exact).toBe(-5)
    expect(s.at('2025-11-24').exact).toBe(-15)
  })

  it('coverage: A6 has-events, B2 not-applicable, the rest unchecked', () => {
    const c = coverage(
      { country: deu as NonNullable<typeof deu>, assessment, events, date: '2026-09-27' },
      m,
    )
    expect(c).toMatchObject({
      applicable: 30,
      hasEvents: 1,
      noneFound: 0,
      noData: 0,
      unchecked: 29,
      notApplicableIds: ['B2'],
    })
    expect(c.ratio).toBeCloseTo(1 / 30, 12)
  })

  it('summary line and citation on 2026-09-27', () => {
    const date = '2026-09-27'
    const score = s.at(date)
    const c = coverage({ country: deu as NonNullable<typeof deu>, assessment, events, date }, m)
    const input = {
      score: { display: score.display, bandName: bandFor(m, score.display).name },
      events: eventCounts(events, date),
      coverage: c.ratio,
      lastChange: lastChange(s, date),
      passivityPoints: m.passivity.points,
      labels: indicatorLabels(m),
    }
    expect(summaryLine(input, 'en')).toBe(
      'Score −15 (Passive). 1 event, 1 confirmed. Coverage 3%. Last change: 2025-11-24, export licence suspension, ended (A6, −10).',
    )
    expect(summaryLine(input, 'fr')).toBe(
      "Score −15 (Passivité). 1 événement, dont 1 confirmé. Couverture 3 %. Dernier changement : 2025-11-24, suspension de licences d'exportation, fin (A6, −10).",
    )
    expect(
      citation(
        {
          iso3: 'DEU',
          countryName: (deu as NonNullable<typeof deu>).name,
          date,
          methodologyVersion: m.version,
          score: { display: score.display, bandName: bandFor(m, score.display).name },
          siteUrl: 'https://example.org',
        },
        'plain',
        'en',
      ),
    ).toBe(
      `Gaza Accountability Index, Germany: −15 (Passive), methodology v${m.version}, as of 27 September 2026, https://example.org/en/country/DEU?date=2026-09-27`,
    )
  })
})
