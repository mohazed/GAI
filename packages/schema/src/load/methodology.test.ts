/**
 * The methodology loader (load/methodology.ts, docs/03 §1): the repository's methodology/v1.0.0
 * loads cleanly; version folders sort numerically; a corrupted or missing file in a temporary
 * copy is reported with its path and line; banned-words.txt parsing. The repository's own
 * methodology/ is never written.
 */
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { METHODOLOGY_FILES, type MethodologyFileName } from '../methodology/schemas.js'
import { REPO_ROOT, rulesIn } from '../testing/harness.js'
import {
  currentMethodologyFolder,
  listMethodologyVersions,
  loadMethodology,
  loadReviewers,
  type Methodology,
  parseBannedWords,
} from './methodology.js'

const FOLDER = 'methodology/v1.0.0'

/** The Methodology property holding each YAML file. */
const PROPERTY: Record<MethodologyFileName, keyof Methodology> = {
  'indicators.yaml': 'indicatorsFile',
  'categories.yaml': 'categories',
  'bands.yaml': 'bands',
  'confidence.yaml': 'confidence',
  'decay.yaml': 'decay',
  'passivity.yaml': 'passivity',
  'thresholds.yaml': 'thresholds',
  'votes.yaml': 'votes',
  'symmetry.yaml': 'symmetry',
}

describe('the repository methodology', () => {
  const m = loadMethodology(REPO_ROOT)

  it('loads methodology/v1.0.0 with no issue', () => {
    expect(m.issues).toEqual([])
    expect(m.folder).toBe(FOLDER)
    expect(m.folderVersion).toBe('1.0.0')
    expect(m.version).toBe(m.indicatorsFile?.value.version)
    expect(m.version.startsWith('1.0.0')).toBe(true)
  })

  it('loads every YAML file with its repo-relative path', () => {
    for (const [fileName, prop] of Object.entries(PROPERTY)) {
      expect(m[prop], fileName).toMatchObject({ file: `${FOLDER}/${fileName}`, line: 1 })
    }
    expect(Object.keys(PROPERTY).sort()).toEqual(Object.keys(METHODOLOGY_FILES).sort())
  })

  it('has the 34 indicators, in file order, indexed by id', () => {
    const ids = m.indicators.map((i) => i.id)
    expect(ids).toHaveLength(34)
    expect(ids.slice(0, 3)).toEqual(['A1', 'A2', 'A3'])
    expect(ids.at(-1)).toBe('E3')
    expect(m.indicatorById.size).toBe(34)
    expect(m.indicatorById.get('A6')?.id).toBe('A6')
  })

  it('loads banned-words.txt and both methodology documents', () => {
    expect(m.bannedWords?.file).toBe(`${FOLDER}/banned-words.txt`)
    expect(m.bannedWords?.entries.length).toBeGreaterThan(0)
    expect(m.docs.en?.file).toBe(`${FOLDER}/methodology.en.md`)
    expect(m.docs.fr?.file).toBe(`${FOLDER}/methodology.fr.md`)
    expect(m.docs.en?.text.length).toBeGreaterThan(0)
  })

  it('loading the folder by name gives the same result', () => {
    expect(loadMethodology(REPO_ROOT, 'v1.0.0').indicators).toEqual(m.indicators)
  })
})

describe('temporary methodology roots', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'gai-methodology-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  const copyV1 = () => cpSync(join(REPO_ROOT, FOLDER), join(root, FOLDER), { recursive: true })
  const path = (rel: string) => join(root, FOLDER, rel)
  const edit = (rel: string, change: (text: string) => string) =>
    writeFileSync(path(rel), change(readFileSync(path(rel), 'utf8')))
  const lineOf = (rel: string, needle: string) =>
    readFileSync(path(rel), 'utf8')
      .split('\n')
      .findIndex((l) => l.startsWith(needle)) + 1

  describe('listMethodologyVersions', () => {
    it('sorts version folders numerically, oldest first, and ignores other names', () => {
      for (const name of [
        'v1.10.0',
        'v1.2.0',
        'v1.0.0',
        'v0.9.12',
        'v1.0',
        'draft',
        'v2.0.0-rc.1',
      ]) {
        mkdirSync(join(root, 'methodology', name), { recursive: true })
      }
      writeFileSync(join(root, 'methodology', 'CHANGELOG.md'), '# changelog\n')
      expect(listMethodologyVersions(root)).toEqual(['v0.9.12', 'v1.0.0', 'v1.2.0', 'v1.10.0'])
      expect(currentMethodologyFolder(root)).toBe('v1.10.0')
    })

    it('no methodology/ folder: no versions', () => {
      expect(listMethodologyVersions(root)).toEqual([])
      expect(currentMethodologyFolder(root)).toBeNull()
    })

    it('the repository lists v1.0.0', () => {
      expect(listMethodologyVersions(REPO_ROOT)).toContain('v1.0.0')
    })
  })

  it('a copy of v1.0.0 loads with no issue', () => {
    copyV1()
    const m = loadMethodology(root)
    expect(m.issues).toEqual([])
    expect(m.indicators).toHaveLength(34)
  })

  describe('diff.json (optional, docs/02 §11)', () => {
    const diff = (to: string) => ({
      from: '0.9.0',
      to,
      date: '2026-09-27',
      countries: [
        {
          iso3: 'DEU',
          name: { en: 'Germany', fr: 'Allemagne' },
          old: -14,
          new: -12,
          cause: { en: 'Test: B1 list', fr: 'Test : liste B1' },
        },
      ],
    })

    it('absent: no diff, no issue', () => {
      copyV1()
      rmSync(path('diff.json'), { force: true })
      const m = loadMethodology(root)
      expect(m.diff).toBeNull()
      expect(m.issues).toEqual([])
    })

    it('present and valid: loaded', () => {
      copyV1()
      const m0 = loadMethodology(root)
      writeFileSync(path('diff.json'), JSON.stringify(diff(m0.version)))
      const m = loadMethodology(root)
      expect(m.issues).toEqual([])
      expect(m.diff?.value.countries[0]?.new).toBe(-12)
    })

    it('for another version, or not matching its schema: reported', () => {
      copyV1()
      writeFileSync(path('diff.json'), JSON.stringify(diff('9.9.9')))
      expect(rulesIn(loadMethodology(root).issues)).toEqual(['schema.methodology'])
      writeFileSync(path('diff.json'), JSON.stringify({ from: '0.9.0' }))
      const issues = loadMethodology(root).issues
      expect(issues.length).toBeGreaterThan(0)
      expect(issues.every((i) => i.file === `${FOLDER}/diff.json`)).toBe(true)
    })
  })

  describe('loadReviewers (methodology/reviewers.yaml, docs/08 §2)', () => {
    const file = () => join(root, 'methodology', 'reviewers.yaml')

    it('the repository file loads with no issue', () => {
      const r = loadReviewers(REPO_ROOT)
      expect(r.issues).toEqual([])
      expect(Array.isArray(r.value?.reviewers)).toBe(true)
    })

    it('absent: none yet, no issue', () => {
      expect(loadReviewers(root)).toEqual({ value: { reviewers: [] }, issues: [] })
    })

    it('a valid entry loads; a missing disclosure is reported', () => {
      mkdirSync(join(root, 'methodology'), { recursive: true })
      const entry = [
        'reviewers:',
        '  - name: Test Reviewer',
        '    expertise: { en: International law, fr: Droit international }',
        '    disclosure: { en: Test entry, fr: Entrée de test }',
        '    signed_off:',
        '      - { version: 1.0.0, date: 2026-11-01, url: "https://example.org/c/1" }',
        '    caveat: null',
        '',
      ].join('\n')
      writeFileSync(file(), entry)
      expect(loadReviewers(root).value?.reviewers[0]?.name).toBe('Test Reviewer')
      writeFileSync(file(), entry.replace(/ {4}disclosure.*\n/, ''))
      const r = loadReviewers(root)
      expect(r.value).toBeNull()
      expect(rulesIn(r.issues)).toEqual(['schema.methodology'])
    })
  })

  it('without a folder name, the newest folder is loaded', () => {
    copyV1()
    mkdirSync(join(root, 'methodology', 'v1.1.0'))
    const m = loadMethodology(root)
    expect(m.folder).toBe('methodology/v1.1.0')
    expect(rulesIn(m.issues)).toEqual(['load.missing-file'])
  })

  it("'schema.methodology': a wrong value is reported with the file, the file name and a line", () => {
    copyV1()
    edit('decay.yaml', (t) => t.replace('plateau_days: 365', 'plateau_days: many'))
    const m = loadMethodology(root)
    expect(m.issues).toMatchObject([
      {
        rule: 'schema.methodology',
        level: 'error',
        file: `${FOLDER}/decay.yaml`,
        id: 'decay.yaml',
        path: 'plateau_days',
        line: lineOf('decay.yaml', 'plateau_days:'),
      },
    ])
    expect(m.decay).toBeNull()
    // The other files still load.
    expect(m.bands).not.toBeNull()
    expect(m.indicators).toHaveLength(34)
  })

  it("'schema.methodology': an unknown top-level key is reported on its own line", () => {
    copyV1()
    edit('decay.yaml', (t) => t.replace('end_days: 730', 'end_days: 730\nplateau_day: 365'))
    const m = loadMethodology(root)
    expect(m.issues).toMatchObject([
      {
        rule: 'schema.methodology',
        file: `${FOLDER}/decay.yaml`,
        line: lineOf('decay.yaml', 'plateau_day:'),
      },
    ])
    expect(m.issues[0]?.message).toContain('plateau_day')
  })

  it("'schema.methodology': a nested error points at its top-level key", () => {
    copyV1()
    edit('indicators.yaml', (t) => t.replace('cadence: annual-march', 'cadence: yearly'))
    const m = loadMethodology(root)
    expect(rulesIn(m.issues)).toEqual(['schema.methodology'])
    expect(m.issues[0]).toMatchObject({
      file: `${FOLDER}/indicators.yaml`,
      line: lineOf('indicators.yaml', 'indicators:'),
    })
    expect(m.issues[0]?.path).toMatch(/^indicators\.0\./)
    // Without indicators.yaml the version falls back to the folder name.
    expect(m.indicatorsFile).toBeNull()
    expect(m.indicators).toEqual([])
    expect(m.indicatorById.size).toBe(0)
    expect(m.version).toBe('1.0.0')
  })

  it("'load.yaml-syntax': a syntax error in a methodology file", () => {
    copyV1()
    edit('bands.yaml', (t) => `${t}\nbroken: [\n`)
    const m = loadMethodology(root)
    expect(rulesIn(m.issues)).toEqual(['load.yaml-syntax'])
    expect(m.issues[0]?.file).toBe(`${FOLDER}/bands.yaml`)
    expect(m.issues[0]?.line).toBeGreaterThan(1)
    expect(m.bands).toBeNull()
  })

  it("'load.encoding': a Latin-1 byte in banned-words.txt or a YAML file is reported", () => {
    copyV1()
    writeFileSync(
      path('banned-words.txt'),
      Buffer.from([0x63, 0x6f, 0x6d, 0x70, 0x6c, 0x69, 0x63, 0x69, 0x74, 0xe9, 0x0a]),
    )
    edit('bands.yaml', (t) => `# caf\u00e9\n${t}`)
    const m = loadMethodology(root)
    expect(m.issues).toMatchObject([
      { rule: 'load.encoding', level: 'error', file: `${FOLDER}/banned-words.txt`, line: 1 },
    ])
    expect(m.bands).not.toBeNull()
  })

  it.each([
    'votes.yaml',
    'symmetry.yaml',
    'banned-words.txt',
    'methodology.en.md',
    'methodology.fr.md',
  ])("'load.missing-file': %s removed", (name) => {
    copyV1()
    rmSync(path(name))
    const m = loadMethodology(root)
    expect(m.issues).toMatchObject([
      { rule: 'load.missing-file', level: 'error', file: `${FOLDER}/${name}` },
    ])
  })

  it('a removed file leaves its slot empty', () => {
    copyV1()
    rmSync(path('votes.yaml'))
    rmSync(path('banned-words.txt'))
    rmSync(path('methodology.fr.md'))
    const m = loadMethodology(root)
    expect(m.votes).toBeNull()
    expect(m.bannedWords).toBeNull()
    expect(m.docs.fr).toBeNull()
    expect(m.docs.en).not.toBeNull()
  })

  it("'load.missing-file': the version folder does not exist", () => {
    const m = loadMethodology(root)
    expect(m.issues).toMatchObject([{ rule: 'load.missing-file', file: 'methodology/v0.0.0' }])
    expect(loadMethodology(REPO_ROOT, 'v9.9.9').issues).toMatchObject([
      { rule: 'load.missing-file', file: 'methodology/v9.9.9' },
    ])
  })
})

describe('parseBannedWords', () => {
  it('skips comments and blank lines, trims, lowercases and keeps line numbers', () => {
    const text = [
      '# banned words', // 1
      '', // 2
      'Complicit', // 3
      '   war crime*  ', // 4
      '  # indented comment', // 5
      '\t', // 6
      'HONTEU*', // 7
    ].join('\n')
    expect(parseBannedWords(text)).toEqual([
      { term: 'complicit', line: 3 },
      { term: 'war crime*', line: 4 },
      { term: 'honteu*', line: 7 },
    ])
  })

  it('handles CRLF and normalises to NFC', () => {
    const decomposed = 'Écoeurant' // É as E + combining acute
    const entries = parseBannedWords(`# c\r\n${decomposed}\r\n\r\nx\r\n`)
    expect(entries).toEqual([
      { term: 'écoeurant', line: 2 },
      { term: 'x', line: 4 },
    ])
  })

  it('an empty file has no entries', () => {
    expect(parseBannedWords('')).toEqual([])
    expect(parseBannedWords('# only comments\n\n')).toEqual([])
  })
})
