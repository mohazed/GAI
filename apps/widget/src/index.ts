/**
 * @gai/widget: the embeddable script (docs/04 §4). `src/main.ts` is the script's entry, built by
 * Vite into dist/gai.js; the site copies it to /embed/v1/gai.js with its config
 * (apps/web/scripts/embed.ts). This module exports what the site and the tests use.
 */
export {
  CONFIG_PLACEHOLDER,
  type Lang,
  type Mode,
  readConfig,
  type View,
  type WidgetConfig,
} from './config.js'
export {
  type CountryFile,
  countryUrl,
  dataUrl,
  linkHtml,
  linkText,
  type Options,
  readOptions,
  renderWidget,
} from './render.js'
export { STRINGS } from './strings.js'
export { CSS } from './styles.js'
