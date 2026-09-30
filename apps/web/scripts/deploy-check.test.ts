import { describe, expect, it } from 'vitest'
import {
  type DeployExpectations,
  type DeployFacts,
  deployProblems,
  MAX_FILE_BYTES,
  MAX_FILES,
  widgetModeOf,
} from './deploy-check'

const SHA = 'a'.repeat(40)
const facts = (over: Partial<DeployFacts> = {}): DeployFacts => ({
  manifest: {
    build_date: '2026-09-28',
    site_url: 'https://gaza-accountability-index.pages.dev',
    git: { sha: SHA, dirty: false },
  },
  historyNotes: 0,
  api: { countries: ['DEU', 'FRA'], corrections: [], replies: [], events: ['evt_a'] },
  data: {
    countries: ['DEU', 'FRA', 'ISR'],
    corrections: ['cor_20261001_1'],
    replies: [],
    events: ['evt_a', 'evt_b'],
  },
  widgetMode: 'scorecard',
  files: [
    { path: 'index.html', bytes: 1000 },
    { path: 'api/v1/manifest.json', bytes: 2000 },
  ],
  ...over,
})
const expected: DeployExpectations = {
  date: '2026-09-28',
  siteUrl: 'https://gaza-accountability-index.pages.dev/',
  head: SHA,
  mode: 'scorecard',
  allowDirty: false,
}

describe('deployProblems (scripts/deploy-check.ts)', () => {
  it('lets a build of the run day, from a clean checkout of data/, go out', () => {
    expect(deployProblems(facts(), expected)).toEqual([])
  })

  it('refuses another date, address, commit or a dirty build', () => {
    const f = facts({
      manifest: {
        build_date: '2026-09-27',
        site_url: 'https://x.org',
        git: { sha: null, dirty: true },
      },
    })
    expect(deployProblems(f, expected)).toEqual([
      'manifest build_date is 2026-09-27, expected the run day 2026-09-28',
      'manifest site_url is https://x.org, expected https://gaza-accountability-index.pages.dev/',
      `manifest git.sha is null, expected the checked-out commit ${SHA}`,
      'manifest git.dirty is true: build from a clean checkout',
    ])
    expect(
      deployProblems(facts({ manifest: { ...facts().manifest, git: { sha: SHA, dirty: true } } }), {
        ...expected,
        allowDirty: true,
      }),
    ).toEqual([])
  })

  it('refuses a build without the full history (history notes)', () => {
    expect(deployProblems(facts({ historyNotes: 1 }), expected)).toEqual([
      'build-notes.json has 1 history note(s): fetch the full history (fetch-depth: 0)',
    ])
  })

  it('refuses an API built from the fixtures (records data/ does not hold)', () => {
    const f = facts({
      api: {
        countries: ['DEU', 'ZZZ'],
        corrections: ['cor_20260927_1'],
        replies: ['rep_x'],
        events: [],
      },
    })
    expect(deployProblems(f, expected)).toEqual([
      'the API publishes countries that data/ does not hold (fixtures?): ZZZ',
      'the API publishes corrections that data/ does not hold (fixtures?): cor_20260927_1',
      'the API publishes replies that data/ does not hold (fixtures?): rep_x',
    ])
  })

  it('refuses a local preview build (events data/ does not hold as published)', () => {
    const ids = ['evt_a', 'evt_c', 'evt_d', 'evt_e', 'evt_f', 'evt_g', 'evt_h']
    const f = facts({ api: { ...facts().api, events: ids } })
    expect(deployProblems(f, expected)).toEqual([
      'the API publishes 6 event(s) that data/ does not hold as published (a build:data --preview output?): evt_c, evt_d, evt_e, evt_f, evt_g, …',
    ])
  })

  it('refuses a widget in another mode than the site, the kit, and files over the limits', () => {
    const many = Array.from({ length: MAX_FILES }, (_, i) => ({ path: `f${i}`, bytes: 1 }))
    const f = facts({
      widgetMode: 'score',
      files: [
        ...many,
        { path: '_kit/index.html', bytes: 1 },
        { path: 'dumps/big.json', bytes: MAX_FILE_BYTES + 1 },
      ],
    })
    expect(deployProblems(f, expected)).toEqual([
      'embed/v1/gai.js carries mode score, the site is in scorecard mode',
      'the output holds the dev-only kit (_kit/index.html)',
      `dumps/big.json is ${MAX_FILE_BYTES + 1} bytes; Cloudflare Pages serves files up to 25 MiB`,
      `${MAX_FILES + 2} files; Cloudflare Pages takes at most ${MAX_FILES}`,
    ])
    expect(deployProblems(facts({ widgetMode: null }), expected)).toEqual([
      'embed/v1/gai.js carries mode null, the site is in scorecard mode',
    ])
  })
})

describe('widgetModeOf', () => {
  it('reads the mode of the config the build wrote (a JSON string inside the script)', () => {
    expect(
      widgetModeOf('var c=JSON.parse("{\\"mode\\":\\"scorecard\\",\\"start\\":\\"2023-10-07\\"}")'),
    ).toBe('scorecard')
    expect(widgetModeOf('{"mode":"score"}')).toBe('score')
    expect(widgetModeOf('t.mode===`score`')).toBeNull()
  })
})
