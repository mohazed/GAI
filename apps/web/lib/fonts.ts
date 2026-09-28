/**
 * The font files every page preloads (docs/04 §3, docs/10 B-174). All faces are
 * `font-display: optional`; Chrome holds the first paint up to about 100 ms for a preloaded
 * optional font, so the text is laid out once, in its face or in its metric-matched fallback,
 * never in both. Without the preload a face that arrived inside the block period re-laid out
 * text that had been laid out in the fallback (the navigation of a country page moved, 0.022 in
 * one Lighthouse run). Only the Latin text face: the display face (132 KB) would delay the
 * rest of the page on a slow connection. `scripts/assets.test.ts` keeps the path equal to the
 * stylesheet's.
 */
export const PRELOADED_FONTS = ['/fonts/source-sans-3-latin-wght-5.3.0.woff2'] as const
