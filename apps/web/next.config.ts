import { createRequire } from 'node:module'
import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/**
 * next-intl's format-only formatter (docs/04 §3): messages are compiled to icu-minify's form on the
 * server (lib/i18n.ts) and the ICU parser (intl-messageformat) leaves every page's JavaScript: the
 * shared next-intl chunk went from 12.1 to 4.7 kB gzipped, each page about 5.2 kB lighter with
 * next 16.4.5 (docs/10 B-2113).
 * The same alias is what next-intl's experimental `messages.precompile` sets; the plugin option is
 * not used because it compiles the JSON files at import, before lib/i18n.ts applies French spacing.
 */
const FORMAT_ONLY = createRequire(path.join(process.cwd(), 'package.json')).resolve(
  'use-intl/format-message/format-only',
)

/**
 * The component kit (/_kit) is a dev-only route (docs/05 §5). Its files end in `.kit.tsx` and are
 * pages only in `next dev` and in a kit build (`GAI_KIT=1`, written to out-kit/ so that it never
 * mixes with the deployable out/). A production build does not see them at all.
 */
const kit = process.env.GAI_KIT === '1' || process.env.NODE_ENV === 'development'

const config: NextConfig = {
  output: 'export',
  // /en/ranking/ → out/en/ranking/index.html, which Cloudflare Pages serves without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  // `next dev` would otherwise write AGENTS.md and CLAUDE.md into apps/web; the repository's own
  // CLAUDE.md governs every session.
  agentRules: false,
  reactStrictMode: true,
  pageExtensions: kit ? ['tsx', 'ts', 'kit.tsx'] : ['tsx', 'ts'],
  ...(process.env.GAI_KIT === '1' ? { distDir: 'out-kit' } : {}),
  // The workspace packages are TypeScript sources written for NodeNext resolution
  // (`import './x.js'` for x.ts). webpack maps the extension; Turbopack cannot, so the site builds
  // with `--webpack`.
  transpilePackages: ['@gai/schema', '@gai/scoring'],
  experimental: {
    extensionAlias: { '.js': ['.ts', '.tsx', '.js'] },
    inlineCss: true,
  },
  // Views loaded with import() (the Compare page's results, the country page's dated snapshot)
  // share components and helpers with other pages. Left to Next.js's default, webpack moved such
  // shared modules into a chunk of their own once they passed its 20 kB threshold, which every
  // page importing them then loaded as one more request, without module concatenation: the
  // Compare results cost the country and ranking pages about 1.3 kB and 0.8 kB on the wire
  // (docs/10 B-127). Only chunks loaded at page start are considered for splitting; a module
  // shared with an on-demand chunk is copied into that chunk instead.
  // A production client build whose splitChunks no longer has a `chunks` function (a Next.js
  // upgrade) fails here instead of silently losing the setting (P-19).
  webpack(webpackConfig, { isServer, dev }) {
    webpackConfig.resolve ??= {}
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias as Record<string, string>),
      'use-intl/format-message$': FORMAT_ONLY,
    }
    const split = webpackConfig.optimization?.splitChunks
    if (!isServer && split && typeof split.chunks === 'function') {
      const pick = split.chunks as (chunk: { canBeInitial(): boolean }) => boolean
      split.chunks = (chunk: { canBeInitial(): boolean }) => pick(chunk) && chunk.canBeInitial()
    } else if (!isServer && !dev) {
      throw new Error(
        'next.config.ts: the client splitChunks.chunks is not a function any more; review the initial-chunks setting (docs/10 B-127)',
      )
    }
    return webpackConfig
  },
}

export default withNextIntl(config)
