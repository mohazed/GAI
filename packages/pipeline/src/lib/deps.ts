/**
 * The side effects the network commands need, injected so that tests run without the network or
 * the clock: `fetch`, a sleep, the clock, and a log line writer.
 */

export interface NetDeps {
  fetch: typeof fetch
  sleep: (ms: number) => Promise<void>
  /** Current time; the only clock read of the network commands. */
  now: () => Date
  /** Progress lines, to stderr in the CLIs. */
  log: (line: string) => void
}

export const realDeps = (
  log: (line: string) => void = (l) => process.stderr.write(`${l}\n`),
): NetDeps => ({
  fetch: globalThis.fetch,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now: () => new Date(),
  log,
})

/** `2026-09-27T10:30:04Z`: UTC, second precision (source `retrieved_at`). */
export function isoSeconds(d: Date): string {
  return `${d.toISOString().slice(0, 19)}Z`
}

/** Thrown when a request exceeds its time budget. */
export class TimeoutError extends Error {}

/** Thrown when a response body is larger than the download limit. */
export class TooLargeError extends Error {}

/**
 * The largest response body any network command reads: 512 MiB (P-19). The largest document
 * archived so far is the UN Digital Library voting file (352 MB, docs/10 B-186); the limit keeps a
 * hostile or broken server from filling the memory of the archiver.
 */
export const MAX_DOWNLOAD_BYTES = 512 * 1024 * 1024

/** Reads a response body, refusing it as soon as it passes `maxBytes`. */
async function readLimited(res: Response, maxBytes: number, url: string): Promise<Uint8Array> {
  const declared = Number(res.headers.get('content-length') ?? '')
  if (Number.isFinite(declared) && declared > maxBytes) {
    await res.body?.cancel().catch(() => {})
    throw new TooLargeError(`response over ${maxBytes} bytes (Content-Length ${declared}): ${url}`)
  }
  if (res.body === null) return new Uint8Array(0)
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel().catch(() => {})
      throw new TooLargeError(`response over ${maxBytes} bytes: ${url}`)
    }
    chunks.push(value)
  }
  const out = new Uint8Array(total)
  let at = 0
  for (const c of chunks) {
    out.set(c, at)
    at += c.byteLength
  }
  return out
}

/**
 * `fetch` with a time budget and a size limit; the body is read inside the budget, and a body
 * larger than `maxBytes` is refused (TooLargeError).
 */
export async function fetchBytes(
  deps: NetDeps,
  url: string,
  init: RequestInit = {},
  timeoutMs = 120_000,
  maxBytes = MAX_DOWNLOAD_BYTES,
): Promise<{ status: number; headers: Headers; url: string; body: Uint8Array }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await deps.fetch(url, { ...init, signal: controller.signal })
    const body = await readLimited(res, maxBytes, url)
    return { status: res.status, headers: res.headers, url: res.url || url, body }
  } catch (err) {
    if (err instanceof TooLargeError) throw err
    if (controller.signal.aborted)
      throw new TimeoutError(`timed out after ${timeoutMs / 1000} s: ${url}`)
    throw err
  } finally {
    clearTimeout(timer)
  }
}
