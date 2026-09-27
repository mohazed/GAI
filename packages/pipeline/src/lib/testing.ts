/**
 * Test doubles for the network commands: a scripted `fetch` and a fake clock whose `sleep`
 * advances time instantly. Test-only; imported by *.test.ts files.
 */
import type { NetDeps } from './deps.js'

export interface Scripted {
  /** Matches the request; the first unused matching step answers it. */
  match: (url: string, init?: RequestInit) => boolean
  status?: number
  body?: string | Uint8Array | object
  headers?: Record<string, string>
  /** Final URL after redirects. */
  url?: string
  /** Throw this instead of answering (a network error). */
  error?: Error
  /** Answer every matching request, not only the first. */
  repeat?: boolean
}

export interface FakeNet {
  deps: NetDeps
  calls: { url: string; init?: RequestInit | undefined }[]
  logs: string[]
  slept: number[]
  /** Milliseconds elapsed on the fake clock. */
  elapsed: () => number
}

export function fakeNet(script: Scripted[], start = '2026-09-27T10:00:00Z'): FakeNet {
  let now = Date.parse(start)
  const t0 = now
  const used = new Set<number>()
  const calls: FakeNet['calls'] = []
  const logs: string[] = []
  const slept: number[] = []
  const fetchImpl = async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input)
    calls.push({ url, init })
    const i = script.findIndex((s, k) => (s.repeat || !used.has(k)) && s.match(url, init))
    if (i === -1) throw new Error(`fakeNet: no scripted answer for ${init?.method ?? 'GET'} ${url}`)
    const step = script[i] as Scripted
    if (!step.repeat) used.add(i)
    if (step.error) throw step.error
    const body =
      step.body instanceof Uint8Array
        ? step.body
        : typeof step.body === 'string'
          ? new TextEncoder().encode(step.body)
          : new TextEncoder().encode(JSON.stringify(step.body ?? {}))
    const res = new Response(body, { status: step.status ?? 200, headers: step.headers ?? {} })
    Object.defineProperty(res, 'url', { value: step.url ?? url })
    return res
  }
  return {
    deps: {
      fetch: fetchImpl as typeof fetch,
      sleep: async (ms) => {
        slept.push(ms)
        now += ms
      },
      now: () => new Date(now),
      log: (l) => logs.push(l),
    },
    calls,
    logs,
    slept,
    elapsed: () => now - t0,
  }
}

export const isSave = (url: string, init?: RequestInit) =>
  url === 'https://web.archive.org/save' && init?.method === 'POST'
export const isStatus = (url: string) => url.startsWith('https://web.archive.org/save/status/')
export const isSnapshot = (url: string) => url.startsWith('https://web.archive.org/web/')
