import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ApiMethodologyFile,
  ApiMethodologyIndex,
  apiSchemaFor,
  loadMethodology,
  type Methodology,
  WINDOW_START,
} from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { jsonText } from './json.js'
import { methodologyFile, methodologyIndex, methodologyPath } from './methodology.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const real = loadMethodology(REPO_ROOT, 'v1.0.0')

/** What a reader of the API gets: the canonical JSON text, parsed back. */
const roundTrip = (value: unknown): unknown => JSON.parse(jsonText(value))

/**
 * A synthetic version folder for the index tests: the real files under another folder name and
 * declared version (no such version exists; only the folder bookkeeping is under test).
 */
const synthetic = (name: string, version: string): Methodology => ({
  ...real,
  folder: `methodology/${name}`,
  folderVersion: name.slice(1),
  version,
})

describe('methodologyFile (methodology/{version}.json)', () => {
  it('loads the repository methodology without issues', () => {
    expect(real.issues).toEqual([])
    expect(real.indicators).toHaveLength(34)
  })

  const file = methodologyFile(real, 'current')

  it('parses with ApiMethodologyFile after a round trip through jsonText, unchanged', () => {
    const parsed = ApiMethodologyFile.parse(roundTrip(file))
    expect(parsed).toEqual(file)
    expect(apiSchemaFor(methodologyPath(real))).toBe(ApiMethodologyFile)
  })

  it('keeps every indicator, in file order, with its fields', () => {
    const parsed = ApiMethodologyFile.parse(roundTrip(file))
    expect(parsed.indicators.indicators.map((i) => i.id)).toEqual(real.indicators.map((i) => i.id))
    expect(parsed.indicators.indicators).toEqual(real.indicatorsFile?.value.indicators)
    expect(parsed.indicators.version).toBe(real.version)
  })

  it('carries the version, folder, status and window start', () => {
    expect(file).toMatchObject({
      version: real.version,
      folder: 'methodology/v1.0.0',
      status: 'current',
      window_start: WINDOW_START,
    })
    expect(file.window_start).toBe('2023-10-07')
    expect(methodologyFile(real, 'superseded').status).toBe('superseded')
  })

  it('copies every parsed file as loaded', () => {
    expect(file.categories).toEqual(real.categories?.value)
    expect(file.bands).toEqual(real.bands?.value)
    expect(file.confidence).toEqual(real.confidence?.value)
    expect(file.decay).toEqual(real.decay?.value)
    expect(file.passivity).toEqual(real.passivity?.value)
    expect(file.thresholds).toEqual(real.thresholds?.value)
    expect(file.votes).toEqual(real.votes?.value)
    expect(file.symmetry).toEqual(real.symmetry?.value)
  })

  it('lists the banned words in file order and the docs verbatim', () => {
    const lines = readFileSync(join(REPO_ROOT, 'methodology/v1.0.0/banned-words.txt'), 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '' && !l.startsWith('#'))
      .map((l) => l.normalize('NFC').toLowerCase())
    expect(file.banned_words).toEqual(lines)
    expect(file.banned_words.length).toBeGreaterThan(0)
    expect(file.docs.en).toBe(
      readFileSync(join(REPO_ROOT, 'methodology/v1.0.0/methodology.en.md'), 'utf8'),
    )
    expect(file.docs.fr).toBe(
      readFileSync(join(REPO_ROOT, 'methodology/v1.0.0/methodology.fr.md'), 'utf8'),
    )
  })

  it('writes null for the optional files and docs that are absent, and [] without banned words', () => {
    const bare: Methodology = {
      ...real,
      thresholds: null,
      votes: null,
      symmetry: null,
      bannedWords: null,
      docs: { en: null, fr: null },
      diff: null,
    }
    const f = methodologyFile(bare, 'superseded')
    expect(f).toMatchObject({
      thresholds: null,
      votes: null,
      symmetry: null,
      banned_words: [],
      docs: { en: null, fr: null },
      diff: null,
    })
    expect(ApiMethodologyFile.parse(roundTrip(f))).toEqual(f)
  })

  it('throws, naming the files, when a file the score needs did not load', () => {
    expect(() => methodologyFile({ ...real, decay: null }, 'current')).toThrow(
      'methodology methodology/v1.0.0 cannot be published: decay.yaml did not load',
    )
    expect(() =>
      methodologyFile({ ...real, indicatorsFile: null, passivity: null }, 'current'),
    ).toThrow('indicators.yaml, passivity.yaml did not load')
    for (const key of [
      'indicatorsFile',
      'categories',
      'bands',
      'confidence',
      'decay',
      'passivity',
    ] as const) {
      expect(() => methodologyFile({ ...real, [key]: null }, 'current')).toThrow(/did not load/)
    }
  })

  it('is deterministic: the same methodology gives the same bytes', () => {
    const again = loadMethodology(REPO_ROOT, 'v1.0.0')
    expect(jsonText(methodologyFile(again, 'current'))).toBe(jsonText(file))
  })
})

describe('methodologyPath', () => {
  it('names the file after the declared version', () => {
    expect(methodologyPath(real)).toBe(`methodology/${real.version}.json`)
    expect(methodologyPath(synthetic('v0.9.0', '0.9.0-rc.2'))).toBe('methodology/0.9.0-rc.2.json')
  })
})

describe('methodologyIndex (methodology/index.json)', () => {
  const CHANGELOG = '# Methodology changelog\n\nSynthetic text for the test.\n'

  it('with only the current version and no snapshot folder', () => {
    const index = methodologyIndex({
      date: '2026-09-27',
      current: real,
      older: [],
      changelog: CHANGELOG,
      frozen: new Set(),
      reviewers: [],
    })
    expect(index).toEqual({
      build_date: '2026-09-27',
      current: real.version,
      versions: [
        {
          version: real.version,
          folder: 'methodology/v1.0.0',
          status: 'current',
          file: methodologyPath(real),
          frozen: null,
        },
      ],
      changelog: CHANGELOG,
      reviewers: [],
    })
    expect(ApiMethodologyIndex.parse(roundTrip(index))).toEqual(index)
    expect(apiSchemaFor('methodology/index.json')).toBe(ApiMethodologyIndex)
  })

  it('lists older versions first (superseded, oldest first) and points to frozen snapshots', () => {
    const v080 = synthetic('v0.8.0', '0.8.0')
    const v090 = synthetic('v0.9.0', '0.9.0')
    const index = methodologyIndex({
      date: '2026-09-27',
      current: real,
      older: [v080, v090],
      changelog: null,
      // data/snapshots/v0.9.0/ exists; v0.8.0 was never frozen; an unrelated folder is ignored.
      frozen: new Set(['v0.9.0', 'v0.1.0']),
      reviewers: [],
    })
    expect(index.versions).toEqual([
      {
        version: '0.8.0',
        folder: 'methodology/v0.8.0',
        status: 'superseded',
        file: 'methodology/0.8.0.json',
        frozen: null,
      },
      {
        version: '0.9.0',
        folder: 'methodology/v0.9.0',
        status: 'superseded',
        file: 'methodology/0.9.0.json',
        frozen: 'methodology/v0.9.0/',
      },
      {
        version: real.version,
        folder: 'methodology/v1.0.0',
        status: 'current',
        file: methodologyPath(real),
        frozen: null,
      },
    ])
    expect(index.current).toBe(real.version)
    expect(index.changelog).toBeNull()
    expect(ApiMethodologyIndex.parse(roundTrip(index))).toEqual(index)
    // The frozen folder is served verbatim and never validated against today's schemas.
    expect(apiSchemaFor('methodology/v0.9.0/countries.json')).toBeNull()
    // Each version file is validated.
    for (const v of index.versions) expect(apiSchemaFor(v.file)).toBe(ApiMethodologyFile)
  })

  it('applies the same snapshot rule to the current version', () => {
    const index = methodologyIndex({
      date: '2026-09-27',
      current: real,
      older: [],
      changelog: null,
      frozen: new Set(['v1.0.0']),
      reviewers: [],
    })
    expect(index.versions[0]?.frozen).toBe('methodology/v1.0.0/')
  })

  it('throws when two folders declare the same version', () => {
    expect(() =>
      methodologyIndex({
        date: '2026-09-27',
        current: real,
        older: [synthetic('v0.9.0', real.version)],
        changelog: null,
        frozen: new Set(),
        reviewers: [],
      }),
    ).toThrow(`methodology/v0.9.0 and methodology/v1.0.0 both declare methodology version`)
  })
})
