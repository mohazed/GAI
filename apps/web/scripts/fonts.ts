/**
 * Copies the self-hosted fonts (D-19, docs/05 §2) from their pinned @fontsource packages to
 * public/fonts/, named with the package version so that a file never changes under its name and
 * can be cached as immutable (public/_headers). The stylesheet points at /fonts/… (app/globals.css):
 * with `experimental.inlineCss` (docs/10 B-102) Next.js 16 writes url()s of bundled assets without
 * their /_next prefix, while root-relative public paths pass through untouched. Run before every
 * build and `next dev`; public/fonts/ is not tracked.
 *
 *   tsx scripts/fonts.ts
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)

/** [package, file in its files/ folder, published name without the version]. */
export const FONTS = [
  [
    '@fontsource-variable/newsreader',
    'newsreader-latin-opsz-normal.woff2',
    'newsreader-latin-opsz',
  ],
  [
    '@fontsource-variable/newsreader',
    'newsreader-latin-ext-opsz-normal.woff2',
    'newsreader-latin-ext-opsz',
  ],
  [
    '@fontsource-variable/source-sans-3',
    'source-sans-3-latin-wght-normal.woff2',
    'source-sans-3-latin-wght',
  ],
  [
    '@fontsource-variable/source-sans-3',
    'source-sans-3-latin-ext-wght-normal.woff2',
    'source-sans-3-latin-ext-wght',
  ],
  [
    '@fontsource/source-code-pro',
    'source-code-pro-latin-400-normal.woff2',
    'source-code-pro-latin-400',
  ],
  [
    '@fontsource/source-code-pro',
    'source-code-pro-latin-600-normal.woff2',
    'source-code-pro-latin-600',
  ],
] as const

export function publishedName(pkg: string, name: string): string {
  const dir = path.dirname(require.resolve(`${pkg}/package.json`))
  const { version } = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) as {
    version: string
  }
  return `${name}-${version}.woff2`
}

if (process.argv[1] !== undefined && path.resolve(process.argv[1]) === import.meta.filename) {
  const out = path.resolve(import.meta.dirname, '..', 'public', 'fonts')
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  for (const [pkg, file, name] of FONTS) {
    const dir = path.dirname(require.resolve(`${pkg}/package.json`))
    copyFileSync(path.join(dir, 'files', file), path.join(out, publishedName(pkg, name)))
  }
  console.log(`fonts: ${FONTS.length} files in public/fonts/`)
}
