/**
 * Publishes the embeddable widget (docs/04 §4): copies apps/widget/dist/gai.js (built by Vite;
 * rebuilt here when missing or older than its sources) to public/embed/v1/gai.js, with the
 * site's config written in place of its placeholder: the mode (D-16), the window start, the
 * score clip and the band segments of the methodology in force. The widget then makes one
 * request, the country file, and follows the mode of the site that serves it. Fails when the
 * script is above the budget of docs/04 §4 (15 KB gzipped). public/embed/ is not tracked.
 *
 *   tsx scripts/embed.ts
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { CONFIG_PLACEHOLDER, type WidgetConfig } from '@gai/widget'
import { publicApi } from '../lib/api'
import { bandSegments, siteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { loadSiteMode } from './site-env'

export const EMBED_BUDGET_BYTES = 15 * 1024

const web = path.resolve(import.meta.dirname, '..')
const widget = path.resolve(web, '..', 'widget')
const dist = path.join(widget, 'dist', 'gai.js')
const target = path.join(web, 'public', 'embed', 'v1', 'gai.js')

function newest(dir: string): number {
  return Math.max(
    ...readdirSync(dir).map((name) => {
      const full = path.join(dir, name)
      return statSync(full).isDirectory() ? newest(full) : statSync(full).mtimeMs
    }),
  )
}

/** The widget's config for a site in `mode` publishing methodology `m`. */
export function widgetConfig(mode: Mode, m: ReturnType<typeof siteMethodology>): WidgetConfig {
  return {
    mode,
    start: m.windowStart,
    clip: [m.scoreClip.min, m.scoreClip.max],
    bands: bandSegments(m.bands, m.scoreClip).map((s) => [s.band.id, s.from, s.to]),
  }
}

/** The built script with `config` in place of its placeholder, which must occur exactly once. */
export function configure(script: string, config: WidgetConfig): string {
  const literal = new RegExp(`(["'\`])${CONFIG_PLACEHOLDER}\\1`, 'g')
  const found = script.match(literal)?.length ?? 0
  if (found !== 1) throw new Error(`gai.js holds its config placeholder ${found} times, not once`)
  return script.replace(literal, () => JSON.stringify(JSON.stringify(config)))
}

function main() {
  const mode = loadSiteMode()
  const sources = path.join(widget, 'src')
  if (
    !existsSync(dist) ||
    statSync(dist).mtimeMs <
      Math.max(newest(sources), statSync(path.join(widget, 'vite.config.ts')).mtimeMs)
  ) {
    execFileSync('pnpm', ['--filter', '@gai/widget', 'build'], { stdio: 'inherit' })
  }
  const manifest = publicApi.manifest()
  const methodology = siteMethodology(publicApi.methodology(manifest.methodology.version))
  const script = configure(readFileSync(dist, 'utf8'), widgetConfig(mode, methodology))
  const gz = gzipSync(script).length
  if (gz > EMBED_BUDGET_BYTES) {
    console.error(`embed: gai.js is ${gz} bytes gzipped, above the budget of ${EMBED_BUDGET_BYTES}`)
    process.exit(1)
  }
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, script)
  console.log(
    `embed: gai.js ${mode} mode, ${Buffer.byteLength(script)} bytes, ${gz} gzipped (budget ${EMBED_BUDGET_BYTES}) → ${path.relative(process.cwd(), target)}`,
  )
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main()
}
