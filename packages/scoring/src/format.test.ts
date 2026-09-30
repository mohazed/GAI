import { describe, expect, it } from 'vitest'
import { APOSTROPHE, frenchApostrophes } from './format.js'

describe('frenchApostrophes (docs/05 §2, P-18)', () => {
  it('sets U+2019 between two letters, accented and capital ones included', () => {
    expect(
      frenchApostrophes("L'Allemagne a voté pour la résolution de l'Assemblée générale."),
    ).toBe(`L${APOSTROPHE}Allemagne a voté pour la résolution de l${APOSTROPHE}Assemblée générale.`)
    expect(frenchApostrophes("aujourd'hui, l'État, qu'Israël, Côte d'Ivoire")).toBe(
      'aujourd’hui, l’État, qu’Israël, Côte d’Ivoire',
    )
    expect(frenchApostrophes("Iran (République islamique d')")).toBe(
      'Iran (République islamique d’)',
    )
  })

  it('leaves quotation marks, code and numbers alone, and is idempotent', () => {
    const code = `data-country='DEU' 'quoted' 5' x'1`
    expect(frenchApostrophes(code)).toBe(code)
    const once = frenchApostrophes("l'indice d'un pays")
    expect(frenchApostrophes(once)).toBe(once)
  })
})
