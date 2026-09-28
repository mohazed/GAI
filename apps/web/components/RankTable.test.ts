import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import { filterButton } from './RankTable'

describe('filterButton (the ranking filters, docs/10 B-174)', () => {
  it('spans two tracks for a label longer than ten characters, decided from the label only', () => {
    expect(filterButton('Europe')).toBe('btn')
    expect(filterButton('Arab League')).toBe('btn filter-wide')
    expect(filterButton('Conseil de sécurité')).toBe('btn filter-wide')
  })

  it('gives every filter label of both languages a class, and the grid its rules', () => {
    for (const m of [en, fr]) {
      const labels = [
        ...Object.values(m.rank.regions),
        ...Object.values(m.rank.memberships),
        m.rank.coverage50,
        m.rank.clear,
      ]
      for (const l of labels) expect(filterButton(l)).toMatch(/^btn( filter-wide)?$/)
    }
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    expect(css).toMatch(
      /\.filter-grid \{[^}]*grid-template-columns: repeat\(auto-fill, minmax\(6\.5rem, 1fr\)\)/,
    )
    expect(css).toMatch(/\.filter-grid > \.filter-wide \{[^}]*grid-column: span 2/)
  })

  it('never swaps a font in after the first paint (font-display: optional on every face)', () => {
    const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8')
    const displays = [...css.matchAll(/font-display: (\w+);/g)].map((m) => m[1])
    expect(displays.length).toBeGreaterThan(0)
    expect(new Set(displays)).toEqual(new Set(['optional']))
  })
})
