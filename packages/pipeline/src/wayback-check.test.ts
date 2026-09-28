import type { ArchiveIndexRow } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { checkWayback, type Fetched, hasProblems, waybackReport } from './wayback-check.js'

const H = (c: string) => c.repeat(64)
const row = (id: string, wayback: string | null, sha: string | null): ArchiveIndexRow => ({
  src_id: id,
  url: `https://example.org/${id}`,
  wayback_url: wayback,
  sha256: sha,
  bytes: sha === null ? null : 10,
  retrieved_at: sha === null ? null : '2026-09-27T10:00:00Z',
  content_type: 'text/html',
})
const W = (id: string) => `https://web.archive.org/web/20260927100000id_/https://example.org/${id}`

describe('checkWayback (P-12 quarterly check)', () => {
  it('lists non-200 answers and hash mismatches, retries rate limits, skips unarchived rows', async () => {
    const answers: Record<string, Fetched[]> = {
      [W('src_a')]: [{ status: 200, sha256: H('a'), detail: null }],
      [W('src_b')]: [{ status: 200, sha256: H('c'), detail: null }],
      [W('src_c')]: [
        { status: 429, sha256: null, detail: null },
        { status: 200, sha256: H('d'), detail: null },
      ],
      [W('src_d')]: [{ status: 302, sha256: null, detail: '→ https://web.archive.org/x' }],
      [W('src_e')]: [
        { status: 503, sha256: null, detail: null },
        { status: 0, sha256: null, detail: 'timeout' },
      ],
      [W('src_f')]: [{ status: 200, sha256: H('f'), detail: null }],
    }
    const requested: string[] = []
    const slept: number[] = []
    const r = await checkWayback(
      [
        row('src_a', W('src_a'), H('a')),
        row('src_b', W('src_b'), H('b')),
        row('src_c', W('src_c'), H('d')),
        row('src_d', W('src_d'), H('d')),
        row('src_e', W('src_e'), H('e')),
        row('src_f', W('src_f'), null),
        row('src_g', null, null),
      ],
      {
        fetch: async (url) => {
          requested.push(url)
          const queue = answers[url] ?? []
          return (queue.length > 1 ? queue.shift() : queue[0]) as Fetched
        },
        sleep: async (ms) => {
          slept.push(ms)
        },
        pauseMs: 5,
        backoffMs: [7],
      },
    )
    expect(r.checked).toBe(6)
    expect(r.notArchived).toEqual(['src_g'])
    expect(r.unhashed).toEqual(['src_f'])
    expect(r.failures).toEqual([
      {
        srcId: 'src_d',
        waybackUrl: W('src_d'),
        status: 302,
        detail: '→ https://web.archive.org/x',
      },
      { srcId: 'src_e', waybackUrl: W('src_e'), status: 0, detail: 'timeout' },
    ])
    expect(r.mismatches).toEqual([
      { srcId: 'src_b', waybackUrl: W('src_b'), recorded: H('b'), computed: H('c') },
    ])
    expect(requested.filter((u) => u === W('src_c'))).toHaveLength(2)
    expect(slept).toEqual([5, 5, 7, 5, 5, 7, 5])
    expect(hasProblems(r)).toBe(true)

    const text = waybackReport(r, '2027-01-01')
    expect(text).toContain('6 recorded `id_` URL(s)')
    expect(text).toContain('2 did not answer HTTP 200, 1 served bytes whose SHA-256 differs')
    expect(text).toContain(`| \`src_b\` | \`${H('b')}\` | \`${H('c')}\` |`)
    expect(text).toContain('| `src_e` | no response | timeout |')
    expect(text).toContain('Rows without a wayback_url (not checked): 1.')
  })

  it('reports no problem when every copy answers 200 with its recorded hash', async () => {
    const r = await checkWayback([row('src_a', W('src_a'), H('a'))], {
      fetch: async () => ({ status: 200, sha256: H('a'), detail: null }),
      sleep: async () => {},
    })
    expect(hasProblems(r)).toBe(false)
    expect(waybackReport(r, '2027-01-01')).not.toContain('##')
  })
})
