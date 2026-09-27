/**
 * Build-time access to the API files that `pnpm build:data` writes (docs/04 §2–§3). Server only:
 * pages read the JSON at build and never fetch at runtime (except Compare, P-09). Each file is
 * parsed with its zod schema from @gai/schema/api, so a stale or foreign API folder fails the
 * build instead of rendering wrong numbers.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  ApiChangesLatestFile,
  ApiChangesMonthFile,
  ApiCountriesFile,
  ApiCountryFile,
  ApiManifestFile,
  ApiMethodologyFile,
  ApiMethodologyIndex,
  ApiRepliesFile,
} from '@gai/schema/api'
import type { z } from 'zod'

/** The API the site publishes: apps/web/public/api/v1, copied to out/api/v1 by next build. */
export const PUBLIC_API_DIR = path.join(process.cwd(), 'public', 'api', 'v1')
/** The fixtures API the kit reads (`pnpm --filter @gai/web kit:data`), never deployed. */
export const KIT_API_DIR = path.join(process.cwd(), '.kit', 'api', 'v1')

export class MissingApiError extends Error {}

export function apiReader(dir: string) {
  const cache = new Map<string, unknown>()
  function read<S extends z.ZodType>(file: string, schema: S): z.infer<S> {
    const hit = cache.get(file)
    if (hit !== undefined) return hit as z.infer<S>
    const full = path.join(dir, file)
    if (!existsSync(full)) {
      throw new MissingApiError(
        `${path.relative(process.cwd(), full)} is missing. Run \`pnpm build:data\` at the repository root first (the kit needs \`pnpm --filter @gai/web kit:data\`).`,
      )
    }
    const parsed = schema.safeParse(JSON.parse(readFileSync(full, 'utf8')))
    if (!parsed.success) {
      throw new Error(`${file} does not match its API schema: ${parsed.error.message}`)
    }
    cache.set(file, parsed.data)
    return parsed.data
  }
  return {
    dir,
    exists: () => existsSync(path.join(dir, 'manifest.json')),
    manifest: () => read('manifest.json', ApiManifestFile),
    countries: () => read('countries.json', ApiCountriesFile),
    country: (iso3: string) => read(`countries/${iso3}.json`, ApiCountryFile),
    methodologyIndex: () => read('methodology/index.json', ApiMethodologyIndex),
    methodology: (version: string) => read(`methodology/${version}.json`, ApiMethodologyFile),
    changesLatest: () => read('changes/latest.json', ApiChangesLatestFile),
    changesMonth: (month: string) => read(`changes/${month}.json`, ApiChangesMonthFile),
    replies: () => read('replies.json', ApiRepliesFile),
  }
}
export type ApiReader = ReturnType<typeof apiReader>

export const publicApi = apiReader(PUBLIC_API_DIR)
