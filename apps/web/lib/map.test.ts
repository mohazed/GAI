import { readFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { geoEqualEarth, geoPath } from 'd3-geo'
import type { FeatureCollection } from 'geojson'
import { feature } from 'topojson-client'
import { describe, expect, it } from 'vitest'
import { CompactPath, DOT_RADIUS, dotPath, mapGeometry } from './map'

describe('map geometry', () => {
  it('writes integer relative paths without zero-length segments', () => {
    const c = new CompactPath()
    // A ring with a single segment left after rounding is dropped.
    c.moveTo(10.4, 20.6)
    c.lineTo(10.2, 20.9)
    c.lineTo(15.5, 25.1)
    c.closePath()
    expect(c.result()).toBe('')
  })
  it('starts every ring at its absolute position and drops collapsed rings', () => {
    const c = new CompactPath()
    c.moveTo(0, 0)
    c.lineTo(10, 0)
    c.lineTo(10, 10)
    c.closePath()
    c.moveTo(50.2, 50.2) // collapses to a point
    c.lineTo(50.4, 49.8)
    c.closePath()
    c.moveTo(100, 100)
    c.lineTo(110, 100)
    c.lineTo(110, 110)
    c.closePath()
    expect(c.result()).toBe('M0 0l10 0l0 10zM100 100l10 0l0 10z')
  })
  it('draws every vertex where d3-geo puts it (no drift across rings)', () => {
    const topo = JSON.parse(
      readFileSync(path.join(process.cwd(), 'map', 'world-50m.topo.json'), 'utf8'),
    )
    const fc = feature(
      topo,
      topo.objects[Object.keys(topo.objects)[0] as string],
    ) as unknown as FeatureCollection
    const projection = geoEqualEarth().fitWidth(1000, fc)
    for (const id of ['CAN', 'RUS', 'IDN', 'CHL', 'USA', 'NOR', 'GRC']) {
      const f = fc.features.find((x) => String(x.id) === id)
      if (f === undefined) throw new Error(id)
      const absolute = new Set<string>()
      const record = {
        beginPath() {},
        moveTo: (x: number, y: number) => absolute.add(`${Math.round(x)} ${Math.round(y)}`),
        lineTo: (x: number, y: number) => absolute.add(`${Math.round(x)} ${Math.round(y)}`),
        closePath() {},
        arc() {},
      }
      geoPath(projection, record)(f)
      const d = mapGeometry()
        .shapes.filter((s) => s.id === id)
        .map((s) => s.d)
        .join('')
      let x = 0
      let y = 0
      for (const m of d.matchAll(/([Ml])(-?\d+) (-?\d+)/g)) {
        const [dx, dy] = [Number(m[2]), Number(m[3])]
        if (m[1] === 'M') [x, y] = [dx, dy]
        else [x, y] = [x + dx, y + dy]
        expect(absolute.has(`${x} ${y}`), `${id} vertex ${x} ${y}`).toBe(true)
      }
    }
  })
  it('keys shapes by ISO3, flags ISR and PSE, leaves Antarctica out', () => {
    const g = mapGeometry()
    const ids = new Set(g.shapes.map((s) => s.id))
    expect(ids.has('DEU')).toBe(true)
    expect(ids.has('FRA')).toBe(true)
    expect(ids.has('ATA')).toBe(false)
    expect(
      g.shapes
        .filter((s) => s.excluded)
        .map((s) => s.id)
        .sort(),
    ).toEqual(['ISR', 'PSE'])
    expect(g.width).toBe(1000)
    expect(g.height).toBeGreaterThan(400)
  })
  it('stays small enough to inline', () => {
    const all = mapGeometry()
      .shapes.map((s) => s.d)
      .join('')
    expect(gzipSync(all).length).toBeLessThan(40_000)
  })
  it('draws a dot for every state whose outline collapses (P-13: every scored country has a mark)', () => {
    expect(dotPath(10.4, 20.6)).toBe(`M7,21a3,3 0 1,0 6,0a3,3 0 1,0 -6,0Z`)
    expect(DOT_RADIUS).toBe(3)
    const g = mapGeometry()
    const dots = new Set(g.shapes.filter((s) => s.dot).map((s) => s.id))
    for (const id of ['AND', 'VAT', 'TUV', 'NRU', 'MDV', 'LIE', 'MCO'])
      expect(dots.has(id), id).toBe(true)
    const registry = readFileSync(
      path.join(process.cwd(), '..', '..', 'data', 'countries.yaml'),
      'utf8',
    )
    const codes = [...registry.matchAll(/^- iso3: ([A-Z]{3})$/gm)].map((m) => m[1])
    const shapes = new Set(g.shapes.map((s) => s.id))
    expect(codes.filter((c) => !shapes.has(c as string))).toEqual([])
  })
})
