/**
 * `pnpm archive:retext` as a function (docs/10 B-2169): extracts again the text of a source whose
 * archive/text file was cut by the former 200 KB cap, from the bytes of record, and writes the
 * longer text. The source record and archive/index.csv are never written: the bytes must have the
 * recorded SHA-256 and byte count, and the text already in the file must be, byte for byte, the
 * start of the new text (`extendTruncatedText`), so quotes checked against it stay valid.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { sha256Hex } from './archive.js'
import { fetchBytes, type NetDeps } from './deps.js'
import { extendTruncatedText, extractText, limitLabel, textLimitFor } from './extract.js'
import { sourcePath, writeArchiveText } from './files.js'

export interface RetextRequest {
  root: string
  id: string
  deps: NetDeps
  /** Bytes already downloaded (from the recorded Wayback URL); otherwise they are fetched. */
  body?: Uint8Array
  /** Charset to decode HTML or text with, when `body` is given (the Content-Type parameter). */
  charset?: string | null
  /** Report what would change without writing. */
  dryRun?: boolean
  requestTimeoutMs?: number
}

export type RetextResult =
  | {
      ok: true
      id: string
      textFile: string
      method: string
      keptBefore: number
      keptAfter: number
      total: number
      truncated: boolean
      written: boolean
    }
  | { ok: false; id: string; reason: string }

interface RecordFields {
  wayback_url?: unknown
  sha256?: unknown
  bytes?: unknown
  content_type?: unknown
  text_file?: unknown
}

export async function retextSource(req: RetextRequest): Promise<RetextResult> {
  const { root, id, deps } = req
  const fail = (reason: string): RetextResult => ({ ok: false, id, reason })
  let record: RecordFields
  try {
    record = parse(readFileSync(join(root, sourcePath(id)), 'utf8')) as RecordFields
  } catch (err) {
    return fail(`no readable source record: ${(err as Error).message}`)
  }
  const { wayback_url: wayback, sha256, bytes } = record
  if (typeof wayback !== 'string' || typeof sha256 !== 'string' || typeof bytes !== 'number') {
    return fail('the source record has no wayback_url, sha256 and bytes (it is not archived)')
  }
  const textFile = `archive/text/${id}.txt`
  if (record.text_file !== undefined && record.text_file !== textFile) {
    return fail(`text_file is ${String(record.text_file)}, expected ${textFile}`)
  }
  let existing: string
  try {
    existing = readFileSync(join(root, textFile), 'utf8')
  } catch {
    return fail(`${textFile} is missing`)
  }

  let body = req.body
  let charset = req.charset ?? null
  if (body === undefined) {
    deps.log(`retext ${id}: downloading ${wayback}`)
    const res = await fetchBytes(deps, wayback, {}, req.requestTimeoutMs ?? 900_000)
    if (res.status !== 200) return fail(`${wayback} answered HTTP ${res.status}`)
    body = res.body
    const type = res.headers.get('content-type')
    charset = type ? (/charset\s*=\s*"?([^";\s]+)/i.exec(type)?.[1]?.toLowerCase() ?? null) : null
  }
  const got = sha256Hex(body)
  if (body.byteLength !== bytes || got !== sha256) {
    return fail(
      `the bytes are not those of record: ${body.byteLength} bytes, sha256 ${got} (recorded ${bytes} bytes, sha256 ${sha256})`,
    )
  }
  const contentType = typeof record.content_type === 'string' ? record.content_type : null
  const extracted = await extractText(body, contentType, charset)
  const limit = textLimitFor(extracted.method)
  const r = extendTruncatedText(existing, extracted.text, limit)
  if (!r.ok) return fail(`${r.reason} (method ${extracted.method}, limit ${limitLabel(limit)})`)
  if (!req.dryRun) writeArchiveText(root, id, r.text)
  return {
    ok: true,
    id,
    textFile,
    method: extracted.method,
    keptBefore: r.keptBefore,
    keptAfter: r.keptAfter,
    total: r.total,
    truncated: r.truncated,
    written: !req.dryRun,
  }
}
