/**
 * After `next build` (docs/04 §3, docs/05 §9):
 * 1. writes the per-page CSP meta into every HTML file (scripts/csp.ts);
 * 2. refuses style attributes, a page without its policy, a url() to a missing file, and a
 *    missing _headers;
 * 3. production only: refuses the dev-only kit, Inter, and any colour outside the design tokens
 *    in the CSS (a default Tailwind palette would show up as oklch() colours);
 * 4. production only: measures the JavaScript of every page against the budget of docs/04 §3
 *    (scripts/js-budget.ts) and writes the table to out/../.js-weights.txt.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { missingAssetUrls } from './assets'
import { policyProblems, withPolicy } from './csp'
import { budgetProblems, formatWeights, frameworkChunks, measurePage } from './js-budget'

const kit = process.env.GAI_KIT === '1'
const out = path.resolve(import.meta.dirname, '..', kit ? 'out-kit' : 'out')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

/** Every colour the design system defines (docs/05 §3), and #0000 (transparent, in preflight). */
const TOKENS = new Set(
  [
    '#0000',
    '#fff',
    '#ffffff',
    '#f3f3f0',
    '#d6d6d0',
    '#15161a',
    '#4b4d53',
    '#6f7278',
    '#1d4f91',
    '#7a1f1a',
    '#c4613e',
    '#b9b3a6',
    '#4f8a88',
    '#16504f',
    '#7b4b94',
    '#b07d0a',
    '#5c7a5a',
  ].map((c) => c.toLowerCase()),
)

const errors: string[] = []
if (!existsSync(out)) throw new Error(`${out} does not exist; run next build first`)
const files = walk(out)
let pages = 0
// The RSC payload (.txt, and the inline scripts of each page) is never edited: its text rows are
// length-prefixed, and an edit breaks hydration.
for (const f of files.filter((x) => x.endsWith('.css'))) {
  for (const u of missingAssetUrls(readFileSync(f, 'utf8'), out))
    errors.push(`${path.relative(out, f)}: url(${u}) is missing`)
}
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const html = withPolicy(readFileSync(f, 'utf8'))
  for (const u of missingAssetUrls(html, out))
    errors.push(`${path.relative(out, f)}: url(${u}) is missing`)
  writeFileSync(f, html)
  pages += 1
  for (const p of policyProblems(html)) errors.push(`${path.relative(out, f)}: ${p}`)
}
if (!existsSync(path.join(out, '_headers'))) errors.push('_headers is missing')

if (!kit) {
  if (files.some((f) => /[\\/]_kit[\\/]/.test(f) || f.endsWith(`${path.sep}_kit.html`))) {
    errors.push('the dev-only /_kit route is in the production output')
  }
  for (const f of files.filter((x) => x.endsWith('.css'))) {
    const css = readFileSync(f, 'utf8')
    const rel = path.relative(out, f)
    if (/\bInter\b/.test(css)) errors.push(`${rel}: mentions the Inter font`)
    if (/oklch\(/i.test(css))
      errors.push(`${rel}: has oklch() colours (a default Tailwind palette?)`)
    for (const m of css.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
      const c = m[0].toLowerCase()
      if (!TOKENS.has(c)) errors.push(`${rel}: colour ${c} is not a design token`)
    }
  }
}

let weights = ''
if (!kit) {
  const manifest = JSON.parse(
    readFileSync(path.resolve(import.meta.dirname, '..', '.next', 'build-manifest.json'), 'utf8'),
  ) as { rootMainFiles: string[]; polyfillFiles: string[] }
  const framework = frameworkChunks(manifest)
  const cache = new Map<string, number>()
  const measured = files
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.relative(out, f))
    .sort()
    .map((page) => measurePage(out, page, framework, cache))
  errors.push(...budgetProblems(measured))
  // A client component that imports lib/i18n.ts ships both message files to every browser.
  for (const f of files.filter(
    (x) => x.endsWith('.js') && x.includes(`${path.sep}_next${path.sep}`),
  )) {
    if (readFileSync(f, 'utf8').includes('"readMethodology":'))
      errors.push(
        `${path.relative(out, f)}: contains a whole message file (a client import of lib/i18n?)`,
      )
  }
  weights = formatWeights(measured)
  writeFileSync(path.resolve(out, '..', '.js-weights.txt'), `${weights}\n`)
}

if (errors.length > 0) {
  console.error(
    `postbuild: ${errors.length} problem(s)\n${[...new Set(errors)].map((e) => `  ${e}`).join('\n')}`,
  )
  process.exit(1)
}
console.log(`postbuild: CSP written into ${pages} page(s) of ${path.relative(process.cwd(), out)}/`)
if (weights !== '') console.log(weights)
