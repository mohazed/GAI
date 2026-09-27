/**
 * YAML and CSV parsing with line numbers (load/parse.ts): the lines every other issue points
 * at, the YAML 1.2 core schema (dates and yes/no stay strings), and the CSV header contract of
 * docs/03 §7.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FIXTURES_ROOT } from '../testing/harness.js'
import { decodeUtf8, firstInvalidUtf8, parseCsv, parseYaml } from './parse.js'

const FILE_Y = 'data/events/DEU.yaml'
const FILE_C = 'data/structured/unga_votes.csv'

describe('parseYaml', () => {
  it('gives the line of each item of a top-level list, after comments and blank lines', () => {
    const text = [
      '# header comment', // 1
      '', // 2
      '- id: a', // 3
      '  x: 1', // 4
      '', // 5
      '  # inner comment', // 6
      '- id: b', // 7
      '- plain', // 8
      '-', // 9
      '- {id: c}', // 10
    ].join('\n')
    const parsed = parseYaml(text, FILE_Y)
    expect(parsed.ok).toBe(true)
    expect(parsed.issues).toEqual([])
    expect(parsed.value).toEqual([{ id: 'a', x: 1 }, { id: 'b' }, 'plain', null, { id: 'c' }])
    expect(parsed.itemLines).toEqual([3, 7, 8, 9, 10])
    expect(parsed.keyLines.size).toBe(0)
  })

  it('gives the line of each key of a top-level mapping', () => {
    const text = ['# c', 'version: 1.0.0', '', 'plateau_days: 365', 'formula:', '  a: 1'].join('\n')
    const parsed = parseYaml(text, 'methodology/v1.0.0/decay.yaml')
    expect(parsed.ok).toBe(true)
    expect(parsed.itemLines).toEqual([])
    expect([...parsed.keyLines]).toEqual([
      ['version', 2],
      ['plateau_days', 4],
      ['formula', 5],
    ])
  })

  it('reports a syntax error as load.yaml-syntax with its line', () => {
    const text = ['- id: a', '  scope: [gaza', '- id: b', ''].join('\n')
    const parsed = parseYaml(text, FILE_Y)
    expect(parsed.ok).toBe(false)
    expect(parsed.value).toBeUndefined()
    expect(parsed.issues.length).toBeGreaterThan(0)
    const first = parsed.issues[0]
    expect(first).toMatchObject({ rule: 'load.yaml-syntax', file: FILE_Y, level: 'error' })
    expect(first?.line).toBeGreaterThanOrEqual(2)
  })

  it('reports tab indentation on its line', () => {
    const parsed = parseYaml('a:\n\tb: 1\n', FILE_Y)
    expect(parsed.issues).toMatchObject([{ rule: 'load.yaml-syntax', file: FILE_Y, line: 2 }])
  })

  it('reports one issue for a tab that breaks the rest of the file, naming the tab', () => {
    const text = readFileSync(join(FIXTURES_ROOT, 'data/events/DEU.yaml'), 'utf8')
    const broken = text.replace('\n  revision: 2', '\n\trevision: 2')
    expect(broken).not.toBe(text)
    const line = broken.split('\n').findIndex((l) => l.startsWith('\trevision')) + 1
    const parsed = parseYaml(broken, FILE_Y)
    expect(parsed.ok).toBe(false)
    expect(parsed.issues).toHaveLength(1)
    expect(parsed.issues[0]).toMatchObject({ rule: 'load.yaml-syntax', file: FILE_Y, line })
    expect(parsed.issues[0]?.message).toMatch(/^tabs are not allowed for indentation; .*further/)
  })

  it('keeps a tab inside a block scalar or a quoted string (valid YAML)', () => {
    const parsed = parseYaml('a: |\n  foo\n  \tbar\nb: "x\ty"\n', FILE_Y)
    expect(parsed.issues).toEqual([])
    expect(parsed.value).toEqual({ a: 'foo\n\tbar\n', b: 'x\ty' })
  })

  it('reports only the first of several syntax errors, with the count of the others', () => {
    const text = ['- id: a', '  scope: [gaza', '- id: b', '  x: {', ''].join('\n')
    const parsed = parseYaml(text, FILE_Y)
    expect(parsed.issues).toHaveLength(1)
    expect(parsed.issues[0]?.message).not.toMatch(/^tabs/)
    expect(parsed.issues[0]?.message).toMatch(/further syntax errors? in this file not listed/)
  })

  it('reports a duplicate key as load.yaml-syntax on the line of the second key', () => {
    const text = ['- id: a', '  points: 10', '  points: 5', ''].join('\n')
    const parsed = parseYaml(text, FILE_Y)
    expect(parsed.ok).toBe(false)
    expect(parsed.issues).toHaveLength(1)
    expect(parsed.issues[0]).toMatchObject({ rule: 'load.yaml-syntax', file: FILE_Y, line: 3 })
    expect(parsed.issues[0]?.message).toContain('unique')
  })

  it('reports several documents in one file', () => {
    const parsed = parseYaml('a: 1\n---\nb: 2\n', FILE_Y)
    expect(parsed.issues).toMatchObject([{ rule: 'load.yaml-syntax', line: 2 }])
  })

  it('reports an alias without its anchor (no line: raised while converting)', () => {
    const parsed = parseYaml('a: *x\n', FILE_Y)
    expect(parsed.ok).toBe(false)
    expect(parsed.issues).toMatchObject([{ rule: 'load.yaml-syntax', file: FILE_Y }])
  })

  it('YAML 1.2 core schema: dates and yes/no/on/off stay strings', () => {
    const text = [
      'date: 2025-08-08',
      'stamp: 2026-09-26T22:58:53Z',
      'y: yes',
      'n: no',
      'on_: on',
      'off_: off',
      'upper: NO',
      't: true',
      'f: false',
      'nul: ~',
      'int: 10',
      'neg: -15',
      'float: 0.25',
      'oct: 014',
      'quoted: "10"',
    ].join('\n')
    const parsed = parseYaml(text, FILE_Y)
    expect(parsed.value).toEqual({
      date: '2025-08-08',
      stamp: '2026-09-26T22:58:53Z',
      y: 'yes',
      n: 'no',
      on_: 'on',
      off_: 'off',
      upper: 'NO',
      t: true,
      f: false,
      nul: null,
      int: 10,
      neg: -15,
      float: 0.25,
      oct: 14,
      quoted: '10',
    })
  })

  it('an empty or comment-only file is null, not an error', () => {
    expect(parseYaml('', FILE_Y)).toMatchObject({ ok: true, value: null, issues: [] })
    expect(parseYaml('# only a comment\n', FILE_Y)).toMatchObject({ ok: true, value: null })
  })

  it('anchors and aliases resolve', () => {
    expect(parseYaml('a: &x [1, 2]\nb: *x\n', FILE_Y).value).toEqual({ a: [1, 2], b: [1, 2] })
  })
})

describe('parseCsv', () => {
  const COLUMNS = ['resolution', 'date', 'iso3', 'vote', 'source'] as const
  const HEADER = COLUMNS.join(',')
  const SRC = 'src_20240311_undl_votes'

  it('keys rows by header and gives each row its line', () => {
    const text = [
      HEADER,
      `A/RES/ES-10/21,2023-10-27,FRA,Y,${SRC}`,
      `A/RES/ES-10/21,2023-10-27,USA,N,${SRC}`,
      '',
    ].join('\n')
    const parsed = parseCsv(text, FILE_C, COLUMNS)
    expect(parsed.ok).toBe(true)
    expect(parsed.issues).toEqual([])
    expect(parsed.header).toEqual([...COLUMNS])
    expect(parsed.rows).toEqual([
      {
        record: {
          resolution: 'A/RES/ES-10/21',
          date: '2023-10-27',
          iso3: 'FRA',
          vote: 'Y',
          source: SRC,
        },
        line: 2,
      },
      {
        record: {
          resolution: 'A/RES/ES-10/21',
          date: '2023-10-27',
          iso3: 'USA',
          vote: 'N',
          source: SRC,
        },
        line: 3,
      },
    ])
  })

  it('a header-only file has no rows', () => {
    const parsed = parseCsv(`${HEADER}\n`, FILE_C, COLUMNS)
    expect(parsed).toMatchObject({ ok: true, rows: [], issues: [] })
  })

  it('reports a header that differs from the documented columns as load.csv-syntax, line 1', () => {
    for (const header of [
      'resolution,date,iso3,vote', // missing column
      'resolution,iso3,date,vote,source', // wrong order
      'resolution,date,iso3,vote,source,extra', // extra column
      'Resolution,date,iso3,vote,source', // case
    ]) {
      const parsed = parseCsv(`${header}\n`, FILE_C, COLUMNS)
      expect(parsed.ok, header).toBe(false)
      expect(parsed.rows).toEqual([])
      expect(parsed.issues).toMatchObject([{ rule: 'load.csv-syntax', file: FILE_C, line: 1 }])
      expect(parsed.issues[0]?.message).toContain(`expected "${HEADER}"`)
    }
  })

  it('without columns, any header is accepted', () => {
    expect(parseCsv('a,b\n1,2\n', FILE_C)).toMatchObject({
      ok: true,
      header: ['a', 'b'],
      rows: [{ record: { a: '1', b: '2' }, line: 2 }],
    })
  })

  it('reports an empty file as a missing header row', () => {
    expect(parseCsv('', FILE_C, COLUMNS).issues).toMatchObject([
      { rule: 'load.csv-syntax', file: FILE_C, line: 1, message: 'missing header row' },
    ])
  })

  it('reports a row with the wrong number of fields on its line', () => {
    const text = [HEADER, `A/RES/ES-10/21,2023-10-27,FRA,Y,${SRC}`, 'A/RES/ES-10/21,x', ''].join(
      '\n',
    )
    const parsed = parseCsv(text, FILE_C, COLUMNS)
    expect(parsed.ok).toBe(false)
    expect(parsed.issues).toMatchObject([{ rule: 'load.csv-syntax', file: FILE_C, line: 3 }])
  })

  it('reports an unclosed quote', () => {
    const parsed = parseCsv('a,b\n1,"2\n', FILE_C)
    expect(parsed.issues).toMatchObject([{ rule: 'load.csv-syntax', file: FILE_C }])
  })

  it('quoted fields may hold commas, quotes and line breaks; rows keep their start line', () => {
    const text = [
      'a,b', // 1
      '1,"x, y"', // 2
      '2,"line one', // 3
      'line two"', // 4
      '', // 5 (skipped)
      '3,"say ""no"""', // 6
      '4,z', // 7
    ].join('\n')
    const parsed = parseCsv(text, FILE_C)
    expect(parsed.ok).toBe(true)
    expect(parsed.rows).toEqual([
      { record: { a: '1', b: 'x, y' }, line: 2 },
      { record: { a: '2', b: 'line one\nline two' }, line: 3 },
      { record: { a: '3', b: 'say "no"' }, line: 6 },
      { record: { a: '4', b: 'z' }, line: 7 },
    ])
  })

  it('CRLF line endings, including a line break inside a quoted field', () => {
    const text = 'a,b\r\n1,"x\r\ny\r\nz"\r\n\r\n2,q\r\n3,r'
    const parsed = parseCsv(text, FILE_C)
    expect(parsed.rows).toEqual([
      { record: { a: '1', b: 'x\r\ny\r\nz' }, line: 2 },
      { record: { a: '2', b: 'q' }, line: 6 },
      { record: { a: '3', b: 'r' }, line: 7 },
    ])
  })

  it('strips a byte-order mark before the header', () => {
    const parsed = parseCsv(
      `\uFEFF${HEADER}\nA/RES/ES-10/21,2023-10-27,FRA,Y,${SRC}\n`,
      FILE_C,
      COLUMNS,
    )
    expect(parsed.ok).toBe(true)
    expect(parsed.header[0]).toBe('resolution')
    expect(parsed.rows).toMatchObject([{ record: { resolution: 'A/RES/ES-10/21' }, line: 2 }])
  })

  it('keeps field values verbatim (no trimming, no type conversion)', () => {
    const parsed = parseCsv('a,b\n 1 ,007\n', FILE_C)
    expect(parsed.rows[0]?.record).toEqual({ a: ' 1 ', b: '007' })
  })
})

describe('decodeUtf8', () => {
  const bytes = (...parts: (string | number[])[]) =>
    Buffer.concat(parts.map((p) => (typeof p === 'string' ? Buffer.from(p) : Buffer.from(p))))

  it('decodes valid UTF-8 without issue (accents, CJK, emoji-free 4-byte, BOM)', () => {
    const text = '\uFEFFsummary: fédéral « x » 中文 𝐀\n'
    const out = decodeUtf8(Buffer.from(text), FILE_Y)
    expect(out).toEqual({ text, issues: [] })
    expect(firstInvalidUtf8(Buffer.from(text))).toBeNull()
  })

  it("'load.encoding': a Latin-1 byte is reported at its line, the text is still returned", () => {
    // `f\xe9d\xe9ral` on line 3 (Latin-1 é).
    const raw = bytes('- id: a\n', '  summary:\n', '    fr: f', [0xe9], 'd', [0xe9], 'ral\n')
    const out = decodeUtf8(raw, FILE_Y)
    expect(out.issues).toMatchObject([
      { rule: 'load.encoding', level: 'error', file: FILE_Y, line: 3 },
    ])
    expect(out.issues[0]?.message).toContain('0xE9')
    expect(out.text).toContain('f\uFFFDd\uFFFDral')
  })

  it('finds overlong, surrogate, truncated and out-of-range sequences', () => {
    expect(firstInvalidUtf8(bytes('ab', [0xc0, 0xaf]))).toEqual({ offset: 2, line: 1 })
    expect(firstInvalidUtf8(bytes('a\n', [0xed, 0xa0, 0x80]))).toEqual({ offset: 2, line: 2 })
    expect(firstInvalidUtf8(bytes('a\nb\n', [0xe2, 0x82]))).toEqual({ offset: 4, line: 3 })
    expect(firstInvalidUtf8(bytes([0xf4, 0x90, 0x80, 0x80]))).toEqual({ offset: 0, line: 1 })
    expect(firstInvalidUtf8(bytes([0xe2, 0x82, 0xac], 'x'))).toBeNull()
  })
})
