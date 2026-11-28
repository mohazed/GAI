import { describe, expect, it } from 'vitest'
import { LONG_TIP_MIN_BAR, SHORT_TIP_MIN_BAR, tipOffset } from './ScoreGaugeView'

/**
 * The tooltip box of the gauge must stay on the screen at the narrowest bar it is shown on (the
 * long box above the 480 px container query, the short one below it): at most the 6 px by which
 * it is allowed to pass the end of the bar, inside the 16 px gutter. A 236 px box centred on a
 * marker at +59 ran 35 px past a 360 px screen before the short box was added (T-H-BROWSER).
 */
describe('tipOffset', () => {
  const LONG_BOX = 236 // "+59.3 · methodology v1.0.0-rc.1" at 7.2 px a character plus the padding
  const SHORT_BOX = 48 // "+59.3"

  for (const [name, width, minBar] of [
    ['long box', LONG_BOX, LONG_TIP_MIN_BAR],
    ['short box', SHORT_BOX, SHORT_TIP_MIN_BAR],
  ] as const) {
    it(`${name}: within 6 px of the bar at every marker position and from the narrowest bar up`, () => {
      for (const bar of [minBar, minBar + 100, 1000]) {
        for (let p = 0; p <= 100; p += 0.5) {
          const left = (p / 100) * bar + tipOffset(p, width, minBar)
          expect(left, `${name} p=${p} bar=${bar} left`).toBeGreaterThanOrEqual(-6)
          expect(left + width, `${name} p=${p} bar=${bar} right`).toBeLessThanOrEqual(bar + 6)
        }
      }
    })
  }

  it('centres the box on the marker when it fits', () => {
    expect(tipOffset(50, SHORT_BOX, SHORT_TIP_MIN_BAR)).toBe(-SHORT_BOX / 2)
  })
})
