/**
 * The no-JavaScript rules of the changes feed's country filter (P-09), written before every build
 * and `next dev` from the API's countries.json into app/[locale]/changes/country-filters.css,
 * which only the Changes page imports (the stylesheet is inlined into each page, docs/10 B-102,
 * so the other pages do not carry 195 countries' rules). Not tracked: the rules follow the
 * registry of the build. They are the country page's filter rules (app/globals.css) for the facet
 * `cty`: while the anchor `#f-cty-{ISO3}` is the target, the entries without the class `f-{ISO3}`
 * are hidden and the country's filter link is marked.
 *
 *   tsx scripts/filter-css.ts
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { publicApi } from '../lib/api'

export const FILTER_CSS = path.resolve(
  import.meta.dirname,
  '..',
  'app',
  '[locale]',
  'changes',
  'country-filters.css',
)

export function countryFilterCss(iso3s: readonly string[]): string {
  const codes = [...new Set(iso3s)].sort()
  for (const c of codes) if (!/^[A-Z]{3}$/.test(c)) throw new RangeError(`not an ISO3 code: ${c}`)
  const hide = codes.map((c) => `#f-cty-${c}:target ~ .ev-list > .ev-item:not(.f-${c})`)
  const mark = codes.map((c) => `#f-cty-${c}:target ~ .ev-filters .ev-flink-${c}`)
  const lines = [
    '/* Written by scripts/filter-css.ts from the API registry; not tracked. */',
    '@layer components {',
  ]
  if (codes.length > 0) {
    lines.push(`  ${hide.join(',\n  ')} {`, '    display: none;', '  }')
    lines.push(
      `  ${mark.join(',\n  ')} {`,
      '    color: var(--ink);',
      '    text-decoration-thickness: 2px;',
      '  }',
    )
  }
  lines.push('}', '')
  return lines.join('\n')
}

function main() {
  const iso3s = publicApi.countries().countries.map((c) => c.iso3)
  writeFileSync(FILTER_CSS, countryFilterCss(iso3s))
  console.log(`filter-css: ${iso3s.length} countries → ${path.relative(process.cwd(), FILTER_CSS)}`)
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main()
}
