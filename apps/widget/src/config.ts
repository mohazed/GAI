/**
 * What the widget knows about the site that serves it, written into the built script when the
 * site is built (apps/web/scripts/embed.ts), so that the widget makes one request only (the
 * country file, docs/04 §4) and follows the mode of that site (D-16).
 */
export type Mode = 'score' | 'scorecard'
export type Lang = 'en' | 'fr'
export type View = 'gauge' | 'timeline'

export interface WidgetConfig {
  /** The site's mode: `scorecard` until scores are published (D-16). */
  mode: Mode
  /** First day of the window (methodology `window_start`). */
  start: string
  /** Score clip of the methodology, `[min, max]`. */
  clip: [number, number]
  /**
   * Band segments on the continuous axis, lowest first: `[id, from, to]` (apps/web
   * lib/methodology.ts `bandSegments`: the boundary between −50 and −51 sits at −50.5).
   */
  bands: [string, number, number][]
}

/** The placeholder the site replaces with the JSON of its WidgetConfig (apps/web/scripts/embed.ts). */
export const CONFIG_PLACEHOLDER = '__GAI_EMBED_CONFIG__'

/**
 * The config written into the script, or null in a script that no site build has configured
 * (the widget then shows its link only). Parsed at run time, so that a minifier cannot fold the
 * placeholder into a constant.
 */
export function readConfig(text: string): WidgetConfig | null {
  try {
    const c = JSON.parse(text) as WidgetConfig
    return c.mode === 'score' || c.mode === 'scorecard' ? c : null
  } catch {
    return null
  }
}
