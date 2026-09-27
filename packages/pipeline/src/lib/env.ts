/**
 * Reads the repository's `.env` (git-ignored, docs/04 §6) without a dependency. Values already in
 * the process environment win. Secrets are returned, never printed.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Parses KEY=VALUE lines; `#` comments, blank lines and `export ` prefixes are allowed. */
export function parseEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#')) continue
    const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!m?.[1]) continue
    let value = m[2] ?? ''
    const quoted = /^(['"])(.*)\1$/.exec(value)
    if (quoted) value = quoted[2] ?? ''
    else value = value.replace(/\s+#.*$/, '')
    out[m[1]] = value
  }
  return out
}

/** The environment with `.env` from `root` underneath it. */
export function loadEnv(
  root: string,
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const file = join(root, '.env')
  const fromFile = existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {}
  const out: Record<string, string> = { ...fromFile }
  for (const [k, v] of Object.entries(env)) if (v !== undefined && v !== '') out[k] = v
  return out
}
