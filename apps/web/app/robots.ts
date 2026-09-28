import type { MetadataRoute } from 'next'
import { publicApi } from '../lib/api'

export const dynamic = 'force-static'

/** robots.txt: everything may be read, including the API; the sitemap on the site's origin. */
export default function robots(): MetadataRoute.Robots {
  const base = publicApi.manifest().site_url.replace(/\/+$/, '')
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  }
}
