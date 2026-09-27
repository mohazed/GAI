import { describe, expect, it } from 'vitest'
import { fakeNet, isSave, isSnapshot, isStatus } from './testing.js'
import { downloadSnapshot, parseSnapshotUrl, snapshotUrl, spnSave } from './wayback.js'

const CREDS = { access: 'AK', secret: 'SK' }
const URL1 = 'https://example.org/page'
const TS = '20260927101500'

const saved = { match: isSave, body: { url: URL1, job_id: 'spn2-abc' } }
const success = {
  match: isStatus,
  body: { status: 'success', timestamp: TS, original_url: URL1 },
}

describe('spnSave', () => {
  it('POSTs authenticated with if_not_archived_within=1d and polls the job', async () => {
    const net = fakeNet([saved, { match: isStatus, body: { status: 'pending' } }, success])
    const r = await spnSave(URL1, CREDS, net.deps)
    expect(r).toEqual({ ok: true, capture: { timestamp: TS, originalUrl: URL1 }, attempts: 1 })
    const post = net.calls[0]
    expect(post?.url).toBe('https://web.archive.org/save')
    const headers = post?.init?.headers as Record<string, string>
    expect(headers.Authorization).toBe('LOW AK:SK')
    expect(headers.Accept).toBe('application/json')
    expect(String(post?.init?.body)).toBe(
      'url=https%3A%2F%2Fexample.org%2Fpage&if_not_archived_within=1d',
    )
    expect(net.calls.filter((c) => isStatus(c.url))).toHaveLength(2)
  })

  it('never calls the anonymous endpoint: no keys, no request', async () => {
    const net = fakeNet([])
    await expect(spnSave(URL1, { access: '', secret: '' }, net.deps)).rejects.toThrow(
      /IA_ACCESS_KEY/,
    )
    expect(net.calls).toEqual([])
  })

  it('retries a 429 twice after 60 s pauses, then succeeds', async () => {
    const net = fakeNet([
      { match: isSave, status: 429, body: 'slow down' },
      { match: isSave, status: 429, body: 'slow down' },
      saved,
      success,
    ])
    const r = await spnSave(URL1, CREDS, net.deps, { pollIntervalMs: 1 })
    expect(r).toMatchObject({ ok: true, attempts: 3 })
    expect(net.slept.filter((ms) => ms === 60_000)).toHaveLength(2)
  })

  it('fails after three attempts, saying why', async () => {
    const net = fakeNet([{ match: isSave, status: 429, body: 'x', repeat: true }])
    const r = await spnSave(URL1, CREDS, net.deps)
    expect(r).toEqual({ ok: false, reason: 'Save Page Now rate limit (HTTP 429)', attempts: 3 })
    expect(net.calls).toHaveLength(3)
  })

  it('treats a network error and a failed job as retryable', async () => {
    const net = fakeNet([
      { match: isSave, error: new Error('ECONNRESET') },
      saved,
      { match: isStatus, body: { status: 'error', status_ext: 'error:proxy-error', message: 'x' } },
      saved,
      success,
    ])
    const r = await spnSave(URL1, CREDS, net.deps, { pollIntervalMs: 1 })
    expect(r).toMatchObject({ ok: true, attempts: 3 })
    expect(net.logs.join('\n')).toContain('network error: ECONNRESET')
    expect(net.logs.join('\n')).toContain('error:proxy-error')
  })

  it('does not retry the per-URL daily capture limit', async () => {
    const net = fakeNet([
      {
        match: isSave,
        body: { status: 'error', status_ext: 'error:too-many-daily-captures', message: 'limit' },
        repeat: true,
      },
    ])
    const r = await spnSave(URL1, CREDS, net.deps)
    expect(r).toMatchObject({
      ok: false,
      attempts: 1,
      reason: expect.stringContaining('too-many-daily-captures'),
    })
  })

  it('gives up polling a job after the budget', async () => {
    const net = fakeNet([saved, { match: isStatus, body: { status: 'pending' }, repeat: true }])
    const r = await spnSave(URL1, CREDS, net.deps, { retries: 0, pollTimeoutMs: 20_000 })
    expect(r).toMatchObject({ ok: false, reason: expect.stringContaining('still pending') })
  })

  it('asks for a plain GET with forceGet', async () => {
    const net = fakeNet([saved, success])
    await spnSave(URL1, CREDS, net.deps, { forceGet: true })
    expect(String(net.calls[0]?.init?.body)).toContain('&force_get=1')
  })

  it('omits if_not_archived_within when asked for a fresh capture', async () => {
    const net = fakeNet([saved, success])
    await spnSave(URL1, CREDS, net.deps, { ifNotArchivedWithin: null })
    expect(String(net.calls[0]?.init?.body)).toBe('url=https%3A%2F%2Fexample.org%2Fpage')
  })
})

describe('downloadSnapshot', () => {
  const capture = { timestamp: TS, originalUrl: URL1 }

  it('fetches the id_ snapshot and records the served timestamp', async () => {
    const served = '20260925095534'
    const net = fakeNet([
      {
        match: isSnapshot,
        body: '<html></html>',
        headers: { 'content-type': 'text/html; charset=UTF-8' },
        url: snapshotUrl(served, URL1),
      },
    ])
    const r = await downloadSnapshot(capture, net.deps)
    expect(net.calls[0]?.url).toBe(`https://web.archive.org/web/${TS}id_/${URL1}`)
    expect(r).toMatchObject({
      ok: true,
      timestamp: served,
      waybackUrl: `https://web.archive.org/web/${served}id_/${URL1}`,
      contentType: 'text/html',
      charset: 'utf-8',
    })
  })

  it('waits for a capture that is not indexed yet', async () => {
    const net = fakeNet([
      { match: isSnapshot, status: 404, body: '' },
      { match: isSnapshot, status: 404, body: '' },
      { match: isSnapshot, body: '{}' },
    ])
    const r = await downloadSnapshot(capture, net.deps)
    expect(r.ok).toBe(true)
    expect(net.slept).toEqual([30_000, 30_000])
  })

  it('stops waiting after the budget without retrying the wait', async () => {
    const net = fakeNet([{ match: isSnapshot, status: 404, body: '', repeat: true }])
    const r = await downloadSnapshot(capture, net.deps, { availabilityTimeoutMs: 90_000 })
    expect(r).toMatchObject({
      ok: false,
      attempts: 1,
      reason: expect.stringContaining('still not served'),
    })
  })

  it('parses snapshot URLs', () => {
    expect(parseSnapshotUrl(`https://web.archive.org/web/${TS}id_/${URL1}`)).toEqual({
      timestamp: TS,
      originalUrl: URL1,
    })
    expect(parseSnapshotUrl('https://example.org/')).toBeNull()
  })
})
