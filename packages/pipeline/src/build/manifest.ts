/**
 * manifest.json (docs/04 §2 step 6, D-25): the git commit and methodology the build read, the
 * build date, the site origin, and the size and SHA-256 of every other emitted file, so that anyone
 * can rebuild from a clone at that commit and compare the hashes.
 */
import { createHash } from 'node:crypto'
import type { ApiManifestFile, Methodology } from '@gai/schema'
import type { GitInfo } from './types.js'

export const GENERATOR = '@gai/pipeline build-data'
export const MANIFEST_PATH = 'manifest.json'

export function bytesOf(content: string | Uint8Array): Uint8Array {
  return typeof content === 'string' ? Buffer.from(content, 'utf8') : content
}

export function sha256(content: string | Uint8Array): string {
  return createHash('sha256').update(bytesOf(content)).digest('hex')
}

function comparePaths(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function manifest(args: {
  files: ReadonlyMap<string, string | Uint8Array>
  date: string
  methodology: Methodology
  git: GitInfo
  siteUrl: string
}): ApiManifestFile {
  const files = [...args.files.entries()]
    .filter(([path]) => path !== MANIFEST_PATH)
    .sort(([a], [b]) => comparePaths(a, b))
    .map(([path, content]) => ({
      path,
      bytes: bytesOf(content).byteLength,
      sha256: sha256(content),
    }))
  return {
    build_date: args.date,
    methodology: { version: args.methodology.version, folder: args.methodology.folder },
    git: { sha: args.git.sha, dirty: args.git.dirty },
    site_url: args.siteUrl,
    generator: GENERATOR,
    files,
    total: { files: files.length, bytes: files.reduce((s, f) => s + f.bytes, 0) },
  }
}
