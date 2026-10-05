import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Event, loadDataset, loadMethodology } from '@gai/schema'
import { createScorer } from '@gai/scoring'
import { afterAll, describe, expect, it } from 'vitest'
import { scoringMethodology } from './methodology.js'
import { parseScoreArgs, runScore } from './score-cli.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const run = (...argv: string[]) =>
  runScore(argv, { cwd: REPO_ROOT, invocationDir: REPO_ROOT, today: '2026-09-27' })

// A copy of the fixtures with more DEU events, to exercise every row of the report.
const TMP = mkdtempSync(join(tmpdir(), 'gai-score-'))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))

function dataset(name: string, extra: (base: Event) => Event[]): string {
  const root = join(TMP, name)
  cpSync(join(REPO_ROOT, 'fixtures'), root, { recursive: true })
  const base = loadDataset(join(REPO_ROOT, 'fixtures')).events[0]?.value as Event
  // JSON is YAML: the loader reads the list as written.
  writeFileSync(join(root, 'data/events/DEU.yaml'), JSON.stringify([base, ...extra(base)], null, 1))
  return root
}

const make = (
  base: Event,
  over: Partial<Event> & Pick<Event, 'id' | 'indicator' | 'type' | 'date' | 'points'>,
): Event => ({
  ...base,
  end: null,
  ...over,
})

const RICH = dataset('rich', (b) => [
  make(b, {
    id: 'evt_2025_01_01_DEU_A5',
    indicator: 'A5',
    type: 'repeatable',
    date: '2025-01-01',
    points: -5,
  }),
  make(b, {
    id: 'evt_2025_02_01_DEU_A5',
    indicator: 'A5',
    type: 'repeatable',
    date: '2025-02-01',
    points: -5,
  }),
  make(b, {
    id: 'evt_2025_03_01_DEU_A5',
    indicator: 'A5',
    type: 'repeatable',
    date: '2025-03-01',
    points: -5,
  }),
  make(b, {
    id: 'evt_2025_04_01_DEU_A5',
    indicator: 'A5',
    type: 'repeatable',
    date: '2025-04-01',
    points: -5,
  }),
  make(b, {
    id: 'evt_2025_09_01_DEU_A7',
    indicator: 'A7',
    type: 'standing',
    date: '2025-09-01',
    points: 25,
  }),
  make(b, {
    id: 'evt_2024_11_22_DEU_B5',
    indicator: 'B5',
    type: 'standing',
    date: '2024-11-22',
    points: 8,
  }),
  make(b, {
    id: 'evt_2025_04_03_DEU_B6',
    indicator: 'B6',
    type: 'standing',
    date: '2025-04-03',
    points: -10,
  }),
  make(b, {
    id: 'evt_2023_11_01_DEU_B1',
    indicator: 'B1',
    type: 'repeatable',
    date: '2023-11-01',
    points: -5,
  }),
  make(b, {
    id: 'evt_2025_02_01_DEU_B4',
    indicator: 'B4',
    type: 'repeatable',
    date: '2025-02-01',
    points: -15,
    confidence: 'disputed',
  }),
  make(b, {
    id: 'evt_2025_07_01_DEU_C5',
    indicator: 'C5',
    type: 'repeatable',
    date: '2025-07-01',
    points: 5,
    status: 'draft',
  }),
])

describe('pnpm score on the DEU fixture', () => {
  it('prints the category table, the events with their contributions and the coverage', () => {
    const r = run('--country', 'DEU', '--root', 'fixtures', '--date', '2025-09-01')
    expect(r.code).toBe(0)
    expect(r.stderr).toBe('')
    const lines = r.stdout.split('\n')
    expect(lines[0]).toMatch(
      /^Germany \(DEU\) · 2025-09-01 · methodology 1\.0\.0\S* · fixtures\/data$/,
    )
    expect(lines[1]).toBe(
      'Score −5.0 → display −5 (Passive) · passivity applied (−15): no qualifying event dated in the last 365 days',
    )
    expect(r.stdout).toMatch(/A Arms & military\s+\+10\.0\s+\+10\.0\s+−45 … \+30\s+yes/)
    expect(r.stdout).toMatch(
      /E Domestic accountability\s+0\.0\s+0\.0\s+−10 … \+10\s+no \(experimental\)/,
    )
    expect(r.stdout).toContain('Events in force on 2025-09-01: 1 of 1 recorded')
    expect(r.stdout).toMatch(
      /2025-08-08\s+2025-11-24\s+evt_2025_08_08_DEU_A6\s+A6\s+standing\s+\+10\.0\s+confirmed\s+1\.0\s+1\s+\+10\.00\s+\+10\.00\s+counted/,
    )
    expect(r.stdout).toContain('Coverage 3% · 1 has-events + 0 none-found of 30 applicable')
    expect(r.stdout).toContain('  not-applicable  B2')
    expect(r.stdout).toContain(
      'Summary (en): Score −5 (Passive). 1 event, 1 confirmed. Coverage 3%. Last change: 2025-08-08, export licence suspension (A6, +10).',
    )
  })

  it('lists only the events in force by default, and every event with --list', () => {
    const r = run('--country', 'DEU', '--root', 'fixtures', '--date', '2026-09-27')
    expect(r.stdout).toContain(
      'Events in force on 2026-09-27: 0 of 1 recorded (--list shows every event)',
    )
    expect(r.stdout).not.toContain('evt_2025_08_08_DEU_A6  A6')
    expect(r.stdout).toContain(
      'Last change: 2025-11-24 · evt_2025_08_08_DEU_A6 (A6, end, −10) · score −10.0',
    )
    const all = run('--country', 'DEU', '--root', 'fixtures', '--date', '2026-09-27', '--list')
    expect(all.stdout).toContain('Events: all 1 recorded')
    expect(all.stdout).toMatch(/evt_2025_08_08_DEU_A6 .* ended 2025-11-24/)
  })

  it('--json prints the full result', () => {
    const r = run('--country', 'deu', '--root', 'fixtures', '--date', '2026-09-27', '--json')
    expect(r.code).toBe(0)
    const out = JSON.parse(r.stdout)
    expect(out).toMatchObject({
      iso3: 'DEU',
      date: '2026-09-27',
      preview: null,
      score: {
        exact: -15,
        score: -15,
        display: -15,
        band: 'passive',
        passivity: { applied: true },
      },
      coverage: { applicable: 30, hasEvents: 1, notApplicableIds: ['B2'] },
      last_change: {
        date: '2025-11-24',
        event: 'evt_2025_08_08_DEU_A6',
        change: 'end',
        delta: -10,
      },
      events: { total: 1, confirmed: 1 },
    })
    expect(out.score.events).toHaveLength(1)
    expect(out.summary.fr).toContain('Couverture 3 %')
  })

  it('uses today when --date is absent, and reads data/ by default', () => {
    const r = run('--country', 'DEU')
    expect(r.code).toBe(0)
    expect(r.stdout.split('\n')[0]).toMatch(/^Germany \(DEU\) · 2026-09-27 · .* · \.\/data$/)
  })

  it('is deterministic', () => {
    expect(run('--country', 'DEU', '--root', 'fixtures', '--json')).toEqual(
      run('--country', 'DEU', '--root', 'fixtures', '--json'),
    )
  })
})

describe('pnpm score on a richer dataset: the printed numbers are the engine numbers', () => {
  const lm = loadMethodology(REPO_ROOT)
  const m = scoringMethodology(lm)
  const events = loadDataset(RICH).events.map((e) => e.value)
  const report = (date: string, ...more: string[]) =>
    runScore(['--country', 'DEU', '--root', RICH, '--date', date, ...more], {
      cwd: REPO_ROOT,
      today: date,
    })

  it('category rows, indicator caps and statuses match createScorer', () => {
    const date = '2025-10-01'
    const r = report(date, '--list')
    expect(r.code).toBe(0)
    const s = createScorer('DEU', events, m).at(date)
    const fmt = (x: number) => {
      const v = Math.round(x * 10) / 10
      return v === 0 ? '0.0' : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`
    }
    for (const c of m.categories) {
      const row = r.stdout.split('\n').find((l) => l.startsWith(`${c.id} `))
      expect(row, c.id).toContain(`${fmt(s.categories[c.id].raw)}  `)
      expect(row).toContain(fmt(s.categories[c.id].clipped))
    }
    expect(r.stdout).toMatch(/A5\s+−20\.0\s+−15 … —\s+−15\.0/)
    expect(r.stdout).toMatch(/evt_2025_08_08_DEU_A6 .* superseded, by evt_2025_09_01_DEU_A7/)
    expect(r.stdout).toMatch(/evt_2024_11_22_DEU_B5 .* earlier-position, by evt_2025_04_03_DEU_B6/)
    // 1.0.0-rc.2 (B-46): a negative act is counted but never qualifies against passivity.
    expect(r.stdout).toMatch(
      /evt_2025_02_01_DEU_B4 .*disputed\s+0\.4\s+1\.0000\s+−6\.00\s+−6\.00\s+counted\s*$/m,
    )
    expect(r.stdout).toContain('passivity not applied (qualifying: evt_2024_11_22_DEU_B5)')
    expect(r.stdout).toMatch(/evt_2025_07_01_DEU_C5 .*\s—\s+—\s+not-published/)
    expect(r.stdout).toContain(`Score ${fmt(s.exact)} → display`)
  })

  it('shows expiry against the methodology decay end', () => {
    const r = report('2026-09-27', '--list')
    expect(r.stdout).toMatch(/evt_2023_11_01_DEU_B1 .* expired \(Δ > 730\)/)
  })

  it('--preview scores draft and reviewed events as if published, and says so', () => {
    const plain = JSON.parse(report('2025-10-01', '--json').stdout)
    const preview = JSON.parse(report('2025-10-01', '--json', '--preview').stdout)
    expect(plain.preview).toBeNull()
    expect(preview.preview).toEqual({ events: ['evt_2025_07_01_DEU_C5'] })
    expect(preview.score.categories.C.raw).toBe(5)
    expect(plain.score.categories.C.raw).toBe(0)
    const text = report('2025-10-01', '--preview').stdout
    expect(text.split('\n')[1]).toBe(
      'PREVIEW: 1 unpublished event(s) scored as if published (evt_2025_07_01_DEU_C5); this is not the published score.',
    )
  })
})

describe('pnpm score with generated events', () => {
  const root = join(TMP, 'generated')
  cpSync(join(REPO_ROOT, 'fixtures'), root, { recursive: true })
  const src = 'src_20260927_fts_plan-1156-p1'
  writeFileSync(
    join(root, 'data/structured/fts_funding.csv'),
    `iso3,window_start,window_end,usd_paid_committed,plan_ids,retrieved_at,source\nDEU,2024-09-01,2025-08-31,600000000,1156,2026-09-27T10:00:00Z,${src}\n`,
  )
  writeFileSync(
    join(root, 'data/structured/gni.csv'),
    `iso3,year,gni_atlas_usd,source\nDEU,2025,5026012352665,src_20260927_worldbank_gni-atlas\n`,
  )

  it('scores the D1 event generated from fts_funding.csv and gni.csv', () => {
    const r = runScore(['--country', 'DEU', '--root', root, '--date', '2025-09-15', '--json'], {
      cwd: REPO_ROOT,
      today: '2025-09-15',
    })
    expect(r.code, r.stderr).toBe(0)
    const out = JSON.parse(r.stdout)
    // x = 6e8 × 100 / 5.026e12 = 0.0119 % ≥ 0.0100 % → +12, valid 2025-09-01 … 2025-10-01
    expect(out.score.categories.D.raw).toBe(12)
    const d1 = out.score.events.find((e: { id: string }) => e.id === 'evt_2025_09_01_DEU_D1_fts')
    expect(d1).toBeDefined()
    const later = runScore(['--country', 'DEU', '--root', root, '--date', '2025-10-01', '--json'], {
      cwd: REPO_ROOT,
      today: '2025-10-01',
    })
    expect(JSON.parse(later.stdout).score.categories.D.raw).toBe(0)
  })
})

describe('pnpm score coverage reads the structured tables as build-data does (B-489)', () => {
  const root = join(TMP, 'derived')
  cpSync(join(REPO_ROOT, 'fixtures'), root, { recursive: true })
  writeFileSync(
    join(root, 'data/structured/sipri_deliveries.csv'),
    'release_date,data_year,supplier_iso3,tiv_to_israel,tiv_total_to_israel,source\n2026-03-09,2025,USA,490,537,src_20261005_sipri_tiv-israel-2022-2025\n',
  )
  const statuses = (orders: string) => {
    writeFileSync(
      join(root, 'data/structured/sipri_orders.csv'),
      `release_date,data_year,buyer_iso3,tiv_new_orders_from_israel,source\n${orders}`,
    )
    const r = runScore(['--country', 'DEU', '--root', root, '--date', '2026-06-01', '--json'], {
      cwd: REPO_ROOT,
      today: '2026-06-01',
    })
    expect(r.code, r.stderr).toBe(0)
    return JSON.parse(r.stdout).coverage.statuses
  }

  it('a SIPRI release in force makes A1 and A4 none-found for a country with no row', () => {
    const s = statuses('2026-03-09,2025,USA,5,src_20261005_sipri_register-supplier-israel\n')
    expect([s.A1, s.A4]).toEqual(['none-found', 'none-found'])
  })

  it('a 0-TIV order of the data year makes A4 no-data (B-488)', () => {
    const s = statuses('2026-03-09,2025,DEU,0,src_20261005_sipri_register-supplier-israel\n')
    expect([s.A1, s.A4]).toEqual(['none-found', 'no-data'])
  })
})

describe('pnpm score errors', () => {
  it.each([
    [['--root', 'fixtures'], /--country is required/],
    [['--country', 'DE'], /alpha-3/],
    [['--country', 'DEU', '--date', '2026-02-30'], /YYYY-MM-DD/],
    [['--country', 'DEU', '--date', '2023-10-06'], /the index starts on 2023-10-07/],
    [['--country'], /needs a value/],
    [['--country', 'DEU', '--verbose'], /unknown option --verbose/],
    [['--country', 'XYZ', '--root', 'fixtures'], /XYZ is not in fixtures\/data\/countries\.yaml/],
    [['--country', 'ISR', '--root', 'fixtures'], /excluded from the index \(D-10\)/],
    [['--country', 'DEU', '--root', 'nowhere'], /has no data\/ directory/],
    [['--country', 'DEU', '--methodology', 'v9.9.9'], /--methodology: expected one of v1\.0\.0/],
  ])('%j exits 2', (argv, message) => {
    const r = run(...(argv as string[]))
    expect(r.code).toBe(2)
    expect(r.stdout).toBe('')
    expect(r.stderr).toMatch(message as RegExp)
  })

  it('exits 1 when the data cannot be loaded or scored', () => {
    const broken = dataset('broken-yaml', () => [])
    writeFileSync(join(broken, 'data/events/DEU.yaml'), '- id: [unclosed\n')
    const a = runScore(['--country', 'DEU', '--root', broken], {
      cwd: REPO_ROOT,
      today: '2026-09-27',
    })
    expect(a.code).toBe(1)
    expect(a.stderr).toMatch(/cannot be loaded; run pnpm validate/)
    const mismatch = dataset('type-mismatch', () => [])
    const file = join(mismatch, 'data/events/DEU.yaml')
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace('"type": "standing"', '"type": "repeatable"'),
    )
    const b = runScore(['--country', 'DEU', '--root', mismatch], {
      cwd: REPO_ROOT,
      today: '2026-09-27',
    })
    expect(b.code).toBe(1)
    expect(b.stderr).toMatch(/evt_2025_08_08_DEU_A6 is repeatable but A6 is standing/)
  })

  it('exits 1 with a message, not a stack trace, outside the repository', () => {
    const r = runScore(['--country', 'DEU'], { cwd: tmpdir(), today: '2026-09-27' })
    expect(r.code).toBe(1)
    expect(r.stderr).toMatch(/repository root/)
  })

  it('parses arguments', () => {
    expect(
      parseScoreArgs(['--country', 'fra', '--date', '2024-01-01', '--list', '--json']),
    ).toEqual({
      country: 'FRA',
      date: '2024-01-01',
      list: true,
      preview: false,
      json: true,
    })
  })
})

describe('the entry point', () => {
  const tsx = join(REPO_ROOT, 'node_modules/.bin/tsx')
  const entry = join(REPO_ROOT, 'packages/pipeline/src/cli/score.ts')

  it('works from any directory and resolves --root there, ignoring an inherited INIT_CWD', () => {
    const r = spawnSync(
      tsx,
      [entry, '--country', 'DEU', '--root', 'fixtures', '--date', '2025-09-01'],
      {
        cwd: REPO_ROOT,
        env: { ...process.env, INIT_CWD: tmpdir(), npm_lifecycle_event: '' },
        encoding: 'utf8',
        timeout: 60_000,
      },
    )
    expect(r.stderr).toBe('')
    expect(r.status).toBe(0)
    expect(r.stdout).toMatch(/^Germany \(DEU\) · 2025-09-01 .* fixtures\/data/)
  }, 60_000)
})
