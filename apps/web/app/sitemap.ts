import type { MetadataRoute } from 'next'
import { publicApi } from '../lib/api'
import { LOCALES } from '../lib/i18n'
import { sitePaths } from '../lib/sitemap'

export const dynamic = 'force-static'

/**
 * sitemap.xml: every page in both languages with its hreflang alternates, dated by the build
 * (the whole site is rebuilt every night). Absolute URLs on the manifest's `site_url`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = publicApi.manifest()
  const base = manifest.site_url.replace(/\/+$/, '')
  return sitePaths(publicApi).flatMap((p) =>
    LOCALES.map((lang) => ({
      url: `${base}/${lang}/${p}`,
      lastModified: manifest.build_date,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${base}/${l}/${p}`])),
      },
    })),
  )
}
