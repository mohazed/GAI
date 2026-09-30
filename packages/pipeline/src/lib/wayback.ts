/**
 * Wayback Machine Save Page Now 2, authenticated (docs/06 §6): `POST https://web.archive.org/save`
 * with `Authorization: LOW {access}:{secret}`, then `GET /save/status/{job_id}` until the capture
 * succeeds or fails; then the snapshot bytes from `/web/{timestamp}id_/{url}` (the original bytes,
 * without the Wayback toolbar or link rewriting, so anyone re-downloading gets the same hash).
 *
 * The anonymous endpoint is never called: every save requires credentials, and the function
 * throws without them. Rate limits (HTTP 429), server errors, timeouts and failed captures are
 * retried twice after a 60 s pause (docs/06 §6); after that the result says why it failed.
 */
import {
  fetchBytes,
  MAX_DOWNLOAD_BYTES,
  type NetDeps,
  TimeoutError,
  TooLargeError,
} from './deps.js'

export const SPN_ENDPOINT = 'https://web.archive.org/save'
export const WAYBACK_WEB = 'https://web.archive.org/web'

export interface SpnCredentials {
  access: string
  secret: string
}

export interface SpnOptions {
  /** Reuse a capture made within this period (`1d` by default; null always captures anew). */
  ifNotArchivedWithin?: string | null
  /**
   * Capture with a plain HTTP GET instead of Save Page Now's browser (`force_get=1`), for API
   * responses and files (false).
   */
  forceGet?: boolean
  /** Retries after the first attempt (2). */
  retries?: number
  /** Pause before a retry, ms (60 000). */
  retryPauseMs?: number
  /** Status polling interval, ms (5 000). */
  pollIntervalMs?: number
  /** Give up polling one job after this long, ms (240 000). */
  pollTimeoutMs?: number
  /** Budget of one HTTP request, ms (120 000). */
  requestTimeoutMs?: number
  /** Largest snapshot body read, bytes (MAX_DOWNLOAD_BYTES, 512 MiB); a larger one is refused. */
  maxBytes?: number
  /**
   * A new capture is served only once Wayback has indexed it, which can take minutes after Save
   * Page Now reports success; the snapshot is polled at this interval (30 000 ms)…
   */
  availabilityPollMs?: number
  /** …for at most this long before the download counts as failed (300 000 ms). */
  availabilityTimeoutMs?: number
}

export interface Capture {
  /** 14-digit Wayback timestamp. */
  timestamp: string
  /** The URL Wayback captured (after redirects). */
  originalUrl: string
}

export type SaveResult =
  | { ok: true; capture: Capture; attempts: number }
  | { ok: false; reason: string; attempts: number }

export type SnapshotResult =
  | {
      ok: true
      /** `https://web.archive.org/web/{timestamp}id_/{url}`, the URL whose bytes were hashed. */
      waybackUrl: string
      timestamp: string
      originalUrl: string
      body: Uint8Array
      contentType: string | null
      /** `charset` parameter of the Content-Type header, lowercase, or null. */
      charset: string | null
      attempts: number
    }
  | { ok: false; reason: string; attempts: number }

const DEFAULTS = {
  ifNotArchivedWithin: '1d',
  forceGet: false,
  retries: 2,
  retryPauseMs: 60_000,
  pollIntervalMs: 5_000,
  pollTimeoutMs: 240_000,
  requestTimeoutMs: 120_000,
  maxBytes: MAX_DOWNLOAD_BYTES,
  availabilityPollMs: 30_000,
  availabilityTimeoutMs: 300_000,
} as const

function authHeader(creds: SpnCredentials): string {
  if (!creds.access || !creds.secret) {
    throw new Error(
      'Save Page Now needs IA_ACCESS_KEY and IA_SECRET_KEY (docs/06 §6); the anonymous endpoint is never used',
    )
  }
  return `LOW ${creds.access}:${creds.secret}`
}

/** `https://web.archive.org/web/{ts}id_/{url}`. */
export function snapshotUrl(timestamp: string, url: string): string {
  return `${WAYBACK_WEB}/${timestamp}id_/${url}`
}

const TIMESTAMP_IN_URL = /^https?:\/\/web\.archive\.org\/web\/(\d{14})(?:[a-z]{2}_)?\/(.+)$/

/** Timestamp and archived URL of a Wayback snapshot URL, or null. */
export function parseSnapshotUrl(url: string): { timestamp: string; originalUrl: string } | null {
  const m = TIMESTAMP_IN_URL.exec(url)
  return m?.[1] && m[2] ? { timestamp: m[1], originalUrl: m[2] } : null
}

/** A failed attempt with `final` is not retried. */
type Attempt<T> = { ok: true; value: T } | { ok: false; reason: string; final?: boolean }

/** Runs `attempt` up to 1 + retries times, pausing between failures. */
async function withRetries<T>(
  deps: NetDeps,
  what: string,
  retries: number,
  pauseMs: number,
  attempt: () => Promise<Attempt<T>>,
): Promise<
  { ok: true; value: T; attempts: number } | { ok: false; reason: string; attempts: number }
> {
  let last = ''
  for (let i = 0; i <= retries; i++) {
    if (i > 0) {
      deps.log(`  ${what}: ${last}; retry ${i} of ${retries} in ${Math.round(pauseMs / 1000)} s`)
      await deps.sleep(pauseMs)
    }
    let r: Attempt<T>
    try {
      r = await attempt()
    } catch (err) {
      r =
        err instanceof TooLargeError
          ? // A document over the download limit stays over it: no retry.
            { ok: false, final: true, reason: err.message }
          : {
              ok: false,
              reason:
                err instanceof TimeoutError
                  ? err.message
                  : `network error: ${(err as Error).message}`,
            }
    }
    if (r.ok) return { ok: true, value: r.value, attempts: i + 1 }
    last = r.reason
    if (r.final) return { ok: false, reason: last, attempts: i + 1 }
  }
  return { ok: false, reason: last, attempts: retries + 1 }
}

function jsonOf(body: Uint8Array): Record<string, unknown> | null {
  try {
    const v = JSON.parse(new TextDecoder().decode(body))
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const str = (v: unknown): string | undefined => (typeof v === 'string' && v !== '' ? v : undefined)

/** One save: POST, then poll the job. */
async function saveOnce(
  url: string,
  auth: string,
  deps: NetDeps,
  o: Required<SpnOptions>,
): Promise<Attempt<Capture>> {
  const form = new URLSearchParams({ url })
  if (o.ifNotArchivedWithin !== null) form.set('if_not_archived_within', o.ifNotArchivedWithin)
  if (o.forceGet) form.set('force_get', '1')
  const post = await fetchBytes(
    deps,
    SPN_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    },
    o.requestTimeoutMs,
  )
  if (post.status === 429) return { ok: false, reason: 'Save Page Now rate limit (HTTP 429)' }
  if (post.status >= 500) return { ok: false, reason: `Save Page Now HTTP ${post.status}` }
  const posted = jsonOf(post.body)
  if (post.status !== 200 || posted === null) {
    return {
      ok: false,
      reason: `Save Page Now HTTP ${post.status}${posted ? `: ${str(posted.message) ?? ''}` : ''}`,
    }
  }
  const job = str(posted.job_id)
  if (job === undefined) {
    const ext = str(posted.status_ext) ?? str(posted.status) ?? 'no job id'
    // The per-URL daily limit does not lift within the retries.
    const final = ext === 'error:too-many-daily-captures'
    return {
      ok: false,
      final,
      reason: `Save Page Now refused the capture (${ext}): ${str(posted.message) ?? ''}`.trim(),
    }
  }
  const started = deps.now().getTime()
  for (;;) {
    await deps.sleep(o.pollIntervalMs)
    const res = await fetchBytes(
      deps,
      `${SPN_ENDPOINT}/status/${encodeURIComponent(job)}`,
      { headers: { Accept: 'application/json', Authorization: auth } },
      o.requestTimeoutMs,
    )
    const status = jsonOf(res.body)
    if (res.status === 429 || res.status >= 500 || status === null) {
      // Transient on the status endpoint; keep polling within the budget.
    } else if (status.status === 'success') {
      const timestamp = str(status.timestamp)
      if (!timestamp || !/^\d{14}$/.test(timestamp)) {
        return { ok: false, reason: 'Save Page Now reported success without a timestamp' }
      }
      return { ok: true, value: { timestamp, originalUrl: str(status.original_url) ?? url } }
    } else if (status.status === 'error') {
      const ext = str(status.status_ext) ?? 'error'
      return { ok: false, reason: `capture failed (${ext}): ${str(status.message) ?? ''}`.trim() }
    }
    if (deps.now().getTime() - started > o.pollTimeoutMs) {
      return {
        ok: false,
        reason: `capture still pending after ${Math.round(o.pollTimeoutMs / 1000)} s (job ${job})`,
      }
    }
  }
}

/** Saves `url` with SPN2 and returns the capture, retrying as docs/06 §6 says. */
export async function spnSave(
  url: string,
  creds: SpnCredentials,
  deps: NetDeps,
  options: SpnOptions = {},
): Promise<SaveResult> {
  const auth = authHeader(creds)
  const o = { ...DEFAULTS, ...options } as Required<SpnOptions>
  const r = await withRetries(deps, `save ${url}`, o.retries, o.retryPauseMs, () =>
    saveOnce(url, auth, deps, o),
  )
  return r.ok ? { ok: true, capture: r.value, attempts: r.attempts } : r
}

/**
 * Downloads the snapshot's original bytes (id_ mode). HTTP content decoding (gzip, br) is undone
 * by fetch, so the hash is that of the document itself. Wayback may redirect to the nearest
 * timestamp; the returned URL and timestamp are the final ones.
 */
export async function downloadSnapshot(
  capture: Capture,
  deps: NetDeps,
  options: SpnOptions = {},
): Promise<SnapshotResult> {
  const o = { ...DEFAULTS, ...options } as Required<SpnOptions>
  const url = snapshotUrl(capture.timestamp, capture.originalUrl)
  const r = await withRetries(
    deps,
    `download ${capture.originalUrl}`,
    o.retries,
    o.retryPauseMs,
    async () => {
      const started = deps.now().getTime()
      for (;;) {
        const res = await fetchBytes(deps, url, {}, o.requestTimeoutMs, o.maxBytes)
        if (res.status === 200) return { ok: true as const, value: res }
        if (res.status === 429)
          return { ok: false as const, reason: 'Wayback rate limit (HTTP 429)' }
        if (res.status !== 404) return { ok: false as const, reason: `snapshot HTTP ${res.status}` }
        // 404: the capture is not indexed yet.
        if (deps.now().getTime() - started >= o.availabilityTimeoutMs) {
          return {
            ok: false as const,
            final: true,
            reason: `snapshot ${capture.timestamp} still not served after ${Math.round(o.availabilityTimeoutMs / 1000)} s (HTTP 404)`,
          }
        }
        deps.log(`  ${capture.originalUrl}: capture ${capture.timestamp} not served yet; waiting`)
        await deps.sleep(o.availabilityPollMs)
      }
    },
  )
  if (!r.ok) return r
  const parsed = parseSnapshotUrl(r.value.url)
  const timestamp = parsed?.timestamp ?? capture.timestamp
  const originalUrl = parsed?.originalUrl ?? capture.originalUrl
  const type = r.value.headers.get('content-type')
  return {
    ok: true,
    waybackUrl: snapshotUrl(timestamp, originalUrl),
    timestamp,
    originalUrl,
    body: r.value.body,
    contentType: type ? (type.split(';')[0]?.trim().toLowerCase() ?? null) : null,
    charset: type ? (/charset\s*=\s*"?([^";\s]+)/i.exec(type)?.[1]?.toLowerCase() ?? null) : null,
    attempts: r.attempts,
  }
}
