/**
 * WorldMap geometry at build time (docs/04 §3, D-20): the TopoJSON of map/ projected with Equal
 * Earth into a 1000-unit-wide SVG. Server only; the browser receives path strings, not TopoJSON.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { geoEqualEarth, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'

export const MAP_WIDTH = 1000

export interface MapShape {
  /** ISO_A3_EH, or ADM0_A3 where Natural Earth has no ISO code. */
  id: string
  name: string
  excluded: boolean
  d: string
}

export interface MapGeometry {
  width: number
  height: number
  shapes: MapShape[]
}

interface Props {
  name: string
  excluded: boolean
}

let cached: MapGeometry | null = null

/**
 * A d3-geo path context that writes compact SVG path data: integer coordinates (one unit is
 * one pixel at the full 1000 px width), an absolute move at each ring's start and relative lines
 * within it, no zero-length segments, and no ring that collapsed at this resolution. Rounding is
 * done on absolute positions, so errors never accumulate.
 */
export class CompactPath {
  #rings: string[] = []
  #ring = ''
  #segments = 0
  #x = 0
  #y = 0
  beginPath(): void {}
  moveTo(x: number, y: number): void {
    this.#flush()
    this.#x = Math.round(x)
    this.#y = Math.round(y)
    // Every ring starts with an absolute move: after `z` SVG returns to the ring's start, so a
    // relative move would carry the previous ring's closing gap into the next one.
    this.#ring = `M${this.#x} ${this.#y}`
  }
  lineTo(x: number, y: number): void {
    const rx = Math.round(x)
    const ry = Math.round(y)
    if (rx === this.#x && ry === this.#y) return
    this.#ring += `l${rx - this.#x} ${ry - this.#y}`
    this.#segments += 1
    this.#x = rx
    this.#y = ry
  }
  closePath(): void {
    this.#ring += 'z'
  }
  arc(): void {
    throw new Error('CompactPath draws no arcs (points are not rendered)')
  }
  /** Keeps the ring unless it collapsed to a point or a line at this resolution. */
  #flush(): void {
    if (this.#ring !== '' && this.#segments >= 2) this.#rings.push(this.#ring)
    this.#ring = ''
    this.#segments = 0
  }
  result(): string {
    this.#flush()
    return this.#rings.join('')
  }
}

export function mapGeometry(): MapGeometry {
  if (cached !== null) return cached
  const file = path.join(process.cwd(), 'map', 'world-50m.topo.json')
  const topo = JSON.parse(readFileSync(file, 'utf8')) as Topology<{
    countries: GeometryCollection<Props>
  }>
  const key = Object.keys(topo.objects)[0] as 'countries'
  const fc = feature(topo, topo.objects[key]) as FeatureCollection<Geometry, Props>
  const projection = geoEqualEarth().fitWidth(MAP_WIDTH, fc)
  const bounds = geoPath(projection).bounds(fc)
  const height = Math.ceil(bounds[1][1] + bounds[0][1])
  const shapes = fc.features
    .map((f: Feature<Geometry, Props>) => {
      const ctx = new CompactPath()
      geoPath(projection, ctx)(f)
      return {
        id: String(f.id),
        name: f.properties.name,
        excluded: f.properties.excluded === true,
        d: ctx.result(),
      }
    })
    .filter((s) => s.d !== '')
  cached = { width: MAP_WIDTH, height, shapes }
  return cached
}
