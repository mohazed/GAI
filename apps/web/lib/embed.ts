/**
 * The embed snippet documented on /embed (docs/04 §4): one `<script>` element carrying the
 * options as data attributes, placed where the embed should appear; the widget (apps/widget,
 * P-11) renders into a `<div>` it creates beside it. The widget reads exactly these attributes;
 * keep the two in step.
 */
export const EMBED_SCRIPT_PATH = '/embed/v1/gai.js'

export interface EmbedOptions {
  iso3: string
  view?: 'gauge' | 'timeline'
  lang?: 'en' | 'fr'
}

export function embedSnippet(siteUrl: string, o: EmbedOptions): string {
  const base = siteUrl.replace(/\/+$/, '')
  const attrs = [
    `src="${base}${EMBED_SCRIPT_PATH}"`,
    `data-country="${o.iso3}"`,
    ...(o.view === undefined ? [] : [`data-view="${o.view}"`]),
    ...(o.lang === undefined ? [] : [`data-lang="${o.lang}"`]),
  ]
  return `<script ${attrs.join(' ')}></script>`
}
