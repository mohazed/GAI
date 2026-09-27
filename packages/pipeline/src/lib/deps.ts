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

/** `fetch` with a time budget; the body is read inside the budget. */
export async function fetchBytes(
  deps: NetDeps,
  url: string,
  init: RequestInit = {},
  timeoutMs = 120_000,
): Promise<{ status: number; headers: Headers; url: string; body: Uint8Array }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await deps.fetch(url, { ...init, signal: controller.signal })
    const body = new Uint8Array(await res.arrayBuffer())
    return { status: res.status, headers: res.headers, url: res.url || url, body }
  } catch (err) {
    if (controller.signal.aborted)
      throw new TimeoutError(`timed out after ${timeoutMs / 1000} s: ${url}`)
    throw err
  } finally {
    clearTimeout(timer)
  }
}
