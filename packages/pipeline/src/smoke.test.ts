/**
 * Smoke fixture of `pnpm archive https://www.icj-cij.org/case/192` (P-04 acceptance): the source
 * record, its archive/index.csv row and its extracted text, as committed from the real run.
 * Checks they agree with each other; the hash itself was checked against Wayback when committed
 * (`curl --compressed <wayback_url> | shasum -a 256`).
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ArchiveIndexRow, parseCsv, Source } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const ID = 'src_20260927_icj-cij_case-192'

describe('archived smoke fixture: ICJ case 192', () => {
  const source = Source.parse(
    parse(readFileSync(join(ROOT, 'data/sources/2026', `${ID}.yaml`), 'utf8')),
  )
  const index = parseCsv(readFileSync(join(ROOT, 'archive/index.csv'), 'utf8'), 'archive/index.csv')
  const rows = index.rows.map((r) => ArchiveIndexRow.parse(r.record)).filter((r) => r.src_id === ID)

  it('record and index row agree', () => {
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      url: source.url,
      wayback_url: source.wayback_url,
      sha256: source.sha256,
      bytes: source.bytes,
      retrieved_at: source.retrieved_at,
    })
    expect(source.wayback_url).toMatch(
      /^https:\/\/web\.archive\.org\/web\/\d{14}id_\/https:\/\/www\.icj-cij\.org\/case\/192$/,
    )
  })

  it('the extracted text names the case', () => {
    const text = readFileSync(join(ROOT, `archive/text/${ID}.txt`), 'utf8')
    expect(text).toContain('(South Africa v. Israel)')
    expect(Buffer.byteLength(text)).toBeLessThanOrEqual(200 * 1024)
  })
})
