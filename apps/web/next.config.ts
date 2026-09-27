import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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
  webpack(webpackConfig, { isServer }) {
    const split = webpackConfig.optimization?.splitChunks
    if (!isServer && split && typeof split.chunks === 'function') {
      const pick = split.chunks as (chunk: { canBeInitial(): boolean }) => boolean
      split.chunks = (chunk: { canBeInitial(): boolean }) => pick(chunk) && chunk.canBeInitial()
    }
    return webpackConfig
  },
}

export default withNextIntl(config)
