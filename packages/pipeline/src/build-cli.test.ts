/**
 * Tests of `pnpm build:data` (./build-cli.ts): argument parsing, usage errors, the site URL, the
 * run with its steps replaced (load, build, write), and one run that loads the fixtures and writes
 * a synthetic build for real. The end-to-end build is tested in ./build/index.test.ts.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { BuildError } from './build/index.js'
import type { LoadOptions } from './build/io.js'
import type { BuildInput, BuildNote, BuildOutput } from './build/types.js'
import {
  BUILD_USAGE,
  type BuildDeps,
  BuildUsageError,
  buildSummary,
  DEFAULT_OUT,
  DEFAULT_SITE_URL,
  parseBuildArgs,
  resolveSiteUrl,
  runBuildData,
} from './build-cli.js'

const REPO_ROOT = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../..'))
const FIXTURES = join(REPO_ROOT, 'fixtures')
const TODAY = '2026-09-27'

let tmp: string
beforeEach(() => {
  tmp = realpathSync(mkdtempSync(join(tmpdir(), 'gai-build-cli-')))
})
afterEach(() => rmSync(tmp, { recursive: true, force: true }))

// ---------------------------------------------------------------------------------------------
// Synthetic build

const NOTES: BuildNote[] = [
  { kind: 'unchecked', country: 'DEU', indicator: 'A3', message: 'Synthetic note one.' },
  { kind: 'history', country: null, indicator: null, message: 'Synthetic note two.' },
  { kind: 'unchecked', country: 'DEU', indicator: 'A5', message: 'Synthetic note three.' },
]

/** Six files, 24 bytes: 8 + 3 (é is two bytes) + 3 + 3 + 3 + 4. */
function syntheticOutput(): BuildOutput {
  return {
    files: new Map<string, string | Uint8Array>([
      ['countries.json', '{"a":1}\n'],
      ['countries/DEU.json', 'é\n'],
      ['countries/DEU/events.json', '[]\n'],
      ['scores/2026-09-27.json', '{}\n'],
      ['manifest.json', '{}\n'],
      ['dumps/x.bin', Uint8Array.from([1, 2, 3, 4])],
    ]),
    notes: NOTES,
  }
}

interface Calls {
  load: (LoadOptions & { date: string; siteUrl: string })[]
  build: BuildInput[]
  write: { outDir: string; files: Map<string, string | Uint8Array> }[]
}

/** Steps that record their calls; nothing is read or written. */
function fakeDeps(over: Partial<BuildDeps> = {}): { deps: Partial<BuildDeps>; calls: Calls } {
  const calls: Calls = { load: [], build: [], write: [] }
  const deps: Partial<BuildDeps> = {
    load: (opts) => {
      calls.load.push(opts)
      return { methodology: { version: '9.9.9' }, date: opts.date } as unknown as BuildInput
    },
    build: (input) => {
      calls.build.push(input)
      return syntheticOutput()
    },
    write: (outDir, files) => {
      calls.write.push({ outDir, files })
    },
    ...over,
  }
  return { deps, calls }
}

const run = (argv: string[], deps: Partial<BuildDeps>, env: Record<string, string> = {}) =>
  runBuildData(argv, { cwd: REPO_ROOT, invocationDir: REPO_ROOT, today: TODAY, env, deps })

// ---------------------------------------------------------------------------------------------

describe('parseBuildArgs', () => {
  it('has no required option', () => {
    expect(parseBuildArgs([])).toEqual({ quiet: false })
  })

  it('reads every option, and skips the -- pnpm may pass', () => {
    expect(
      parseBuildArgs([
        '--',
        '--date',
        '2025-01-31',
        '--out',
        'out/v1',
        '--root',
        'fixtures',
        '--site-url',
        'https://example.org',
        '--quiet',
      ]),
    ).toEqual({
      date: '2025-01-31',
      out: 'out/v1',
      root: 'fixtures',
      siteUrl: 'https://example.org',
      quiet: true,
    })
  })

  it('rejects unknown options, missing values and malformed dates', () => {
    expect(() => parseBuildArgs(['--country', 'DEU'])).toThrow(BuildUsageError)
    expect(() => parseBuildArgs(['--country', 'DEU'])).toThrow(
      `unknown option --country\n${BUILD_USAGE}`,
    )
    expect(() => parseBuildArgs(['--date'])).toThrow(`--date needs a value\n${BUILD_USAGE}`)
    expect(() => parseBuildArgs(['--out', '--quiet'])).toThrow('--out needs a value')
    expect(() => parseBuildArgs(['--date', '2026-9-27'])).toThrow(
      '--date expects a date YYYY-MM-DD, got 2026-9-27',
    )
    expect(() => parseBuildArgs(['--date', '2026-02-30'])).toThrow('--date expects a date')
  })
})

describe('resolveSiteUrl', () => {
  it('takes --site-url, else NEXT_PUBLIC_SITE_URL, else the default', () => {
    expect(resolveSiteUrl(undefined, {})).toBe(DEFAULT_SITE_URL)
    expect(DEFAULT_SITE_URL).toBe('https://gaza-accountability-index.pages.dev')
    expect(resolveSiteUrl(undefined, { NEXT_PUBLIC_SITE_URL: '' })).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl(undefined, { NEXT_PUBLIC_SITE_URL: 'https://env.example.org' })).toBe(
      'https://env.example.org',
    )
    expect(
      resolveSiteUrl('http://localhost:3000', { NEXT_PUBLIC_SITE_URL: 'https://env.example.org' }),
    ).toBe('http://localhost:3000')
  })

  it('removes trailing slashes and keeps a path', () => {
    expect(resolveSiteUrl('https://example.org/', {})).toBe('https://example.org')
    expect(resolveSiteUrl('https://example.org/gai//', {})).toBe('https://example.org/gai')
  })

  it('rejects anything but an http(s) URL without query or fragment', () => {
    for (const bad of [
      'example.org',
      'ftp://example.org',
      'https://example.org/?a=1',
      'https://example.org/#top',
      'https://example.org/a b',
    ]) {
      expect(() => resolveSiteUrl(bad, {})).toThrow(BuildUsageError)
    }
    expect(() => resolveSiteUrl(undefined, { NEXT_PUBLIC_SITE_URL: 'nope' })).toThrow(
      'NEXT_PUBLIC_SITE_URL nope: expected an http(s) URL',
    )
  })
})

describe('buildSummary', () => {
  it('prints files, bytes, files per top-level folder and notes per kind', () => {
    expect(
      buildSummary({
        date: TODAY,
        methodology: '1.0.0',
        source: 'fixtures/data',
        out: 'apps/web/public/api/v1',
        output: syntheticOutput(),
      }),
    ).toBe(
      [
        'build-data 2026-09-27 · methodology 1.0.0 · fixtures/data → apps/web/public/api/v1',
        '6 files, 24 bytes',
        '  (top level)  2',
        '  countries/   2',
        '  dumps/       1',
        '  scores/      1',
        // BUILD_NOTE_KINDS order: unchecked before history.
        'notes: 3 (unchecked 2, history 1); see build-notes.json',
        '',
      ].join('\n'),
    )
  })

  it('says when there is no note', () => {
    const output = { ...syntheticOutput(), notes: [] }
    expect(
      buildSummary({ date: TODAY, methodology: '1.0.0', source: 'data', out: 'x', output }),
    ).toMatch(/\nnotes: none\n$/)
  })
})

describe('runBuildData: usage errors (exit 2), nothing loaded or written', () => {
  const usage = (argv: string[], message: string | RegExp, env: Record<string, string> = {}) => {
    const { deps, calls } = fakeDeps()
    const r = run(argv, deps, env)
    expect(r.code).toBe(2)
    expect(r.stdout).toBe('')
    if (typeof message === 'string') expect(r.stderr).toBe(`${message}\n`)
    else expect(r.stderr).toMatch(message)
    expect(calls).toEqual({ load: [], build: [], write: [] })
  }

  it('unknown options and malformed values', () => {
    usage(['--bogus'], `unknown option --bogus\n${BUILD_USAGE}`)
    usage(['--date', 'yesterday'], '--date expects a date YYYY-MM-DD, got yesterday')
  })

  it('a date before the window start or after today', () => {
    usage(
      ['--date', '2023-10-06'],
      '--date 2023-10-06: the index starts on 2023-10-07 (docs/02 §1)',
    )
    usage(['--date', '2026-09-28'], '--date 2026-09-28 is after today (2026-09-27, UTC)')
  })

  it('a dataset root without data/', () => {
    usage(['--root', tmp], `--root ${tmp}: ${tmp} has no data/ directory`)
  })

  it('a malformed site URL, from the option or the environment', () => {
    usage(['--site-url', 'ftp://example.org'], /^--site-url ftp:\/\/example\.org: expected/)
    usage([], /^NEXT_PUBLIC_SITE_URL x: expected an http\(s\) URL/, { NEXT_PUBLIC_SITE_URL: 'x' })
  })

  it('an output directory that overlaps an input', () => {
    usage(
      ['--out', 'data/api'],
      new RegExp(`^--out ${REPO_ROOT}/data/api: overlaps the build input`),
    )
    usage(['--out', '.'], /^--out .*: overlaps the build input .*\/data\n$/)
    usage(
      ['--root', 'fixtures', '--out', 'fixtures/archive/x'],
      /overlaps the build input .*fixtures\/archive/,
    )
    usage(['--out', 'methodology'], /overlaps the build input .*methodology/)
  })
})

describe('runBuildData: a run', () => {
  it('loads with the resolved options, builds, writes to the default --out and prints a summary', () => {
    const { deps, calls } = fakeDeps()
    const r = run([], deps, { NEXT_PUBLIC_SITE_URL: 'https://env.example.org/' })
    expect(r).toEqual({
      code: 0,
      stdout: [
        'build-data 2026-09-27 · methodology 9.9.9 · data → apps/web/public/api/v1',
        '6 files, 24 bytes',
        '  (top level)  2',
        '  countries/   2',
        '  dumps/       1',
        '  scores/      1',
        'notes: 3 (unchecked 2, history 1); see build-notes.json',
        '',
      ].join('\n'),
      stderr: '',
    })
    expect(calls.load).toEqual([
      {
        repoRoot: REPO_ROOT,
        datasetRoot: REPO_ROOT,
        date: TODAY,
        siteUrl: 'https://env.example.org',
      },
    ])
    expect(calls.build).toHaveLength(1)
    expect(calls.build[0]?.date).toBe(TODAY)
    expect(calls.write).toHaveLength(1)
    expect(calls.write[0]?.outDir).toBe(join(REPO_ROOT, DEFAULT_OUT))
    expect([...(calls.write[0]?.files.keys() ?? [])]).toContain('manifest.json')
  })

  it('resolves --root and --out against the invocation directory; --quiet prints nothing', () => {
    const { deps, calls } = fakeDeps()
    const r = runBuildData(
      ['--root', '../fixtures', '--out', 'out/v1', '--date', '2024-02-29', '--quiet'],
      {
        cwd: REPO_ROOT,
        invocationDir: join(REPO_ROOT, 'packages'),
        today: TODAY,
        env: {},
        deps,
      },
    )
    expect(r).toEqual({ code: 0, stdout: '', stderr: '' })
    expect(calls.load).toEqual([
      { repoRoot: REPO_ROOT, datasetRoot: FIXTURES, date: '2024-02-29', siteUrl: DEFAULT_SITE_URL },
    ])
    expect(calls.write[0]?.outDir).toBe(join(REPO_ROOT, 'packages/out/v1'))
  })

  it('accepts the window start and today as build dates', () => {
    for (const date of ['2023-10-07', TODAY]) {
      const { deps, calls } = fakeDeps()
      expect(run(['--date', date, '--quiet'], deps).code).toBe(0)
      expect(calls.load[0]?.date).toBe(date)
    }
  })

  it('exits 1 with the message on a BuildError, and writes nothing', () => {
    const { deps, calls } = fakeDeps({
      build: () => {
        throw new BuildError('synthetic data problem')
      },
    })
    const r = run([], deps)
    expect(r).toEqual({ code: 1, stdout: '', stderr: 'build-data: synthetic data problem\n' })
    expect(calls.write).toEqual([])
  })

  it('exits 1 with the stack on an unexpected error', () => {
    const { deps } = fakeDeps({
      load: () => {
        throw new TypeError('synthetic bug')
      },
    })
    const r = run([], deps)
    expect(r.code).toBe(1)
    expect(r.stderr).toMatch(/^build-data failed: TypeError: synthetic bug\n {4}at /)
  })

  it('exits 2 when the output directory is not a previous build (real write)', () => {
    const out = join(tmp, 'v1')
    mkdirSync(out)
    writeFileSync(join(out, 'keep.txt'), 'mine\n')
    const { deps } = fakeDeps()
    delete deps.write
    const r = run(['--out', out], deps)
    expect(r.code).toBe(2)
    expect(r.stderr).toMatch(/is not empty and has no manifest\.json/)
    expect(readdirSync(out)).toEqual(['keep.txt'])
  })

  it('loads the fixtures and writes the build for real', () => {
    const out = join(tmp, 'api/v1')
    const { deps, calls } = fakeDeps()
    delete deps.load
    delete deps.write
    const r = run(['--root', 'fixtures', '--out', out, '--site-url', 'https://example.org'], deps)
    expect(r.stderr).toBe('')
    expect(r.code).toBe(0)
    const input = calls.build[0] as BuildInput
    expect(input.dataset.root).toBe(FIXTURES)
    expect(input.dataset.events.map((e) => e.value.id)).toEqual(['evt_2025_08_08_DEU_A6'])
    expect(input.date).toBe(TODAY)
    expect(input.siteUrl).toBe('https://example.org')
    expect(r.stdout.split('\n')[0]).toBe(
      `build-data 2026-09-27 · methodology ${input.methodology.version} · fixtures/data → ${out}`,
    )
    expect(readFileSync(join(out, 'countries/DEU.json'), 'utf8')).toBe('é\n')
    expect([...readFileSync(join(out, 'dumps/x.bin'))]).toEqual([1, 2, 3, 4])
    expect(existsSync(`${out}.building`)).toBe(false)
    // A second run replaces the first.
    expect(run(['--root', 'fixtures', '--out', out, '--quiet'], deps).code).toBe(0)
    expect(readdirSync(join(tmp, 'api'))).toEqual(['v1'])
  })
})
