/**
 * Prepares the WorldMap geometry (docs/04 §3, D-20): Natural Earth 1:50m admin-0 countries
 * (public domain), pinned to release v5.1.2 and checked against its SHA-256, simplified with
 * mapshaper to a TopoJSON of at most 300 KB, keyed by ISO_A3_EH (ADM0_A3 where Natural Earth has
 * no ISO code), with ISR and PSE flagged `excluded` (D-10). Antarctica is left out.
 *
 *   pnpm --filter @gai/web map
 *
 * Writes map/world-50m.topo.json. Run it only to change the geometry; the output is committed.
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson'
const SOURCE_SHA256 = '3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb'
const MAPSHAPER = 'mapshaper@0.7.68'
const MAX_BYTES = 300 * 1024

const root = path.resolve(import.meta.dirname, '..')
const cache = path.join(root, '.cache')
const input = path.join(cache, 'ne_50m_admin_0_countries.geojson')
const output = path.join(root, 'map', 'world-50m.topo.json')

async function main() {
  mkdirSync(cache, { recursive: true })
  if (!existsSync(input)) {
    const res = await fetch(SOURCE)
    if (!res.ok) throw new Error(`${SOURCE}: HTTP ${res.status}`)
    writeFileSync(input, Buffer.from(await res.arrayBuffer()))
  }
  const sha = createHash('sha256').update(readFileSync(input)).digest('hex')
  if (sha !== SOURCE_SHA256) {
    throw new Error(`${input}: SHA-256 ${sha}, expected ${SOURCE_SHA256}; delete it and retry`)
  }
  const args = [
    '-y',
    MAPSHAPER,
    input,
    '-filter',
    'ADM0_A3 !== "ATA"',
    '-each',
    'id = ISO_A3_EH !== "-99" ? ISO_A3_EH : ADM0_A3, name = NAME_EN, excluded = (id === "ISR" || id === "PSE")',
    '-filter-fields',
    'id,name,excluded',
    '-simplify',
    '15%',
    'keep-shapes',
    '-o',
    'format=topojson',
    'quantization=20000',
    'id-field=id',
    output,
  ]
  const run = spawnSync('npx', args, { stdio: 'inherit' })
  if (run.status !== 0) throw new Error(`mapshaper exited with ${run.status}`)
  const bytes = statSync(output).size
  if (bytes > MAX_BYTES) throw new Error(`${output} is ${bytes} bytes, above ${MAX_BYTES}`)
  const out = createHash('sha256').update(readFileSync(output)).digest('hex')
  console.log(`map/world-50m.topo.json: ${bytes} bytes, sha256 ${out}`)
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
