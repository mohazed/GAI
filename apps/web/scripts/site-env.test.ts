import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadSiteMode } from './site-env'

// Next.js reads `.env.test` when NODE_ENV is `test`, as vitest sets it: the builds run without it.
// Next.js types NODE_ENV as read-only; the tests set it through a plain record.
const env = process.env as Record<string, string | undefined>
const saved = { gate: env.NEXT_PUBLIC_SHOW_SCORES, node: env.NODE_ENV }
beforeEach(() => {
  env.NODE_ENV = 'production'
  delete env.NEXT_PUBLIC_SHOW_SCORES
})
afterEach(() => {
  for (const [key, value] of [
    ['NEXT_PUBLIC_SHOW_SCORES', saved.gate],
    ['NODE_ENV', saved.node],
  ] as const) {
    if (value === undefined) delete env[key]
    else env[key] = value
  }
})

describe('loadSiteMode (scripts/site-env.ts)', () => {
  it('reads the gate from .env.production for a build and .env.development for dev', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'gai-env-'))
    try {
      writeFileSync(path.join(dir, '.env.production'), 'NEXT_PUBLIC_SHOW_SCORES=true\n')
      writeFileSync(path.join(dir, '.env.development'), 'NEXT_PUBLIC_SHOW_SCORES=false\n')
      expect(loadSiteMode(dir, false)).toBe('score')
      delete process.env.NEXT_PUBLIC_SHOW_SCORES
      expect(loadSiteMode(dir, true)).toBe('scorecard')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('reads the repository file in a build process: scorecard mode until the author flips it', () => {
    const child: Record<string, string | undefined> = { ...process.env, NODE_ENV: 'production' }
    delete child.NEXT_PUBLIC_SHOW_SCORES
    delete child.npm_lifecycle_event
    delete child.__NEXT_PROCESSED_ENV
    const out = execFileSync(
      process.execPath,
      [
        '--import',
        'tsx',
        '--input-type=module',
        '-e',
        "import { loadSiteMode } from './scripts/site-env.ts'; process.stdout.write(loadSiteMode() + ' ' + process.env.NEXT_PUBLIC_SHOW_SCORES)",
      ],
      {
        cwd: path.resolve(import.meta.dirname, '..'),
        env: child as NodeJS.ProcessEnv,
        encoding: 'utf8',
      },
    )
    expect(out).toBe('scorecard false')
  })
})
