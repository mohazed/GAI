/**
 * Asset URLs of the built stylesheet. The stylesheet is inlined into every page
 * (`experimental.inlineCss`, docs/10 B-102), where Next.js 16 writes bundled assets' url()s
 * without their /_next prefix; the fonts therefore live at public paths (scripts/fonts.ts). The
 * build refuses any root-relative url() whose file is not in the output, so a broken font path
 * fails the build instead of rendering the fallback for everyone.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'

export function missingAssetUrls(text: string, outDir: string): string[] {
  const missing = new Set<string>()
  for (const m of text.matchAll(/url\((["']?)(\/[^)"']+)\1\)/g)) {
    const target = (m[2] ?? '').split(/[?#]/)[0] ?? ''
    if (!existsSync(path.join(outDir, decodeURIComponent(target)))) missing.add(target)
  }
  return [...missing].sort()
}
