/**
 * The quarterly check of the archived copies (P-12, docs/04 §5): every `wayback_url` of
 * archive/index.csv, the recorded `id_` URL, must still answer HTTP 200, and the SHA-256 of the
 * body it serves, decoded from its transfer compression (`curl --compressed`, the hash rule of the
 * archiver: docs/10 B-29, B-57), must equal the recorded `sha256`. A redirect is a failure: the
 * archiver records the final snapshot URL, so a recorded URL that now redirects no longer names the
 * bytes that were hashed.
 *
 * The request itself is injected (`Fetcher`), so the checks, retries and report are tested
 * without the network; the CLI (`pnpm check:wayback`) passes curl.
 */
import type { ArchiveIndexRow } from '@gai/schema'

export interface Fetched {
  /** HTTP status; 0 when no response came (DNS, TLS, timeout). */
  status: number
  /** SHA-256 of the decoded body, hex; null unless the status is 200. */
  sha256: string | null
  /** Location of a redirect, or the transport error. */
  detail: string | null
}

export type Fetcher = (url: string) => Promise<Fetched>

export interface CheckTarget {
  srcId: string
  waybackUrl: string
  sha256: string | null
}

export interface CheckResult {
  checked: number
  /** Rows without a wayback_url (dataset records that were never archived, docs/03 §5). */
  notArchived: string[]
  failures: { srcId: string; waybackUrl: string; status: number; detail: string | null }[]
  mismatches: { srcId: string; waybackUrl: string; recorded: string; computed: string }[]
  /** Rows answered 200 without a recorded hash to compare. */
  unhashed: string[]
}

/** Statuses worth another try: rate limit, server errors, no response. */
const RETRY = (s: number) => s === 0 || s === 429 || s >= 500

export function checkTargets(rows: readonly ArchiveIndexRow[]): {
  targets: CheckTarget[]
  notArchived: string[]
} {
  const targets: CheckTarget[] = []
  const notArchived: string[] = []
  for (const r of rows) {
    if (r.wayback_url === null) notArchived.push(r.src_id)
    else targets.push({ srcId: r.src_id, waybackUrl: r.wayback_url, sha256: r.sha256 })
  }
  return { targets, notArchived }
}

export interface CheckOptions {
  fetch: Fetcher
  sleep: (ms: number) => Promise<void>
  /** Pause between two requests (Wayback rate limits). */
  pauseMs?: number
  /** Waits before each retry; its length is the number of retries. */
  backoffMs?: readonly number[]
  log?: (line: string) => void
}

export async function checkWayback(
  rows: readonly ArchiveIndexRow[],
  o: CheckOptions,
): Promise<CheckResult> {
  const { targets, notArchived } = checkTargets(rows)
  const pause = o.pauseMs ?? 1500
  const backoff = o.backoffMs ?? [10_000, 30_000, 60_000]
  const result: CheckResult = {
    checked: 0,
    notArchived,
    failures: [],
    mismatches: [],
    unhashed: [],
  }
  for (const [i, t] of targets.entries()) {
    if (i > 0) await o.sleep(pause)
    let r = await o.fetch(t.waybackUrl)
    for (const wait of backoff) {
      if (!RETRY(r.status)) break
      o.log?.(`  ${t.srcId}: HTTP ${r.status}; retrying in ${wait / 1000} s`)
      await o.sleep(wait)
      r = await o.fetch(t.waybackUrl)
    }
    result.checked += 1
    if (r.status !== 200) {
      result.failures.push({ ...pick(t), status: r.status, detail: r.detail })
    } else if (t.sha256 === null) {
      result.unhashed.push(t.srcId)
    } else if (r.sha256 !== t.sha256) {
      result.mismatches.push({ ...pick(t), recorded: t.sha256, computed: r.sha256 ?? '(none)' })
    }
    o.log?.(`${i + 1}/${targets.length} ${t.srcId}: HTTP ${r.status}`)
  }
  return result
}

const pick = (t: CheckTarget) => ({ srcId: t.srcId, waybackUrl: t.waybackUrl })

export const hasProblems = (r: CheckResult): boolean =>
  r.failures.length > 0 || r.mismatches.length > 0

const cell = (s: string) => s.replace(/\|/g, '\\|')

/** The issue body: counts, then one table per kind of problem. */
export function waybackReport(r: CheckResult, date: string): string {
  const lines = [
    `Quarterly check of the archived copies, ${date}: ${r.checked} recorded \`id_\` URL(s) of \`archive/index.csv\` requested; ${r.failures.length} did not answer HTTP 200, ${r.mismatches.length} served bytes whose SHA-256 differs from the record.`,
    '',
    'A failure or a mismatch does not change a score by itself. For each row: re-run `pnpm archive <url>` if the original is still online, or record the problem with the source (docs/06, docs/08); never edit a recorded hash to match.',
  ]
  if (r.failures.length > 0) {
    lines.push(
      '',
      '## Not HTTP 200',
      '',
      '| Source | Status | Detail | Wayback URL |',
      '|---|---|---|---|',
    )
    for (const f of r.failures) {
      lines.push(
        `| \`${f.srcId}\` | ${f.status === 0 ? 'no response' : f.status} | ${cell(f.detail ?? '')} | ${cell(f.waybackUrl)} |`,
      )
    }
  }
  if (r.mismatches.length > 0) {
    lines.push(
      '',
      '## SHA-256 mismatch',
      '',
      '| Source | Recorded | Computed | Wayback URL |',
      '|---|---|---|---|',
    )
    for (const m of r.mismatches) {
      lines.push(
        `| \`${m.srcId}\` | \`${m.recorded}\` | \`${m.computed}\` | ${cell(m.waybackUrl)} |`,
      )
    }
  }
  if (r.unhashed.length > 0) {
    lines.push(
      '',
      `Answered 200 without a recorded hash: ${r.unhashed.map((s) => `\`${s}\``).join(', ')}.`,
    )
  }
  if (r.notArchived.length > 0) {
    lines.push('', `Rows without a wayback_url (not checked): ${r.notArchived.length}.`)
  }
  return `${lines.join('\n')}\n`
}
