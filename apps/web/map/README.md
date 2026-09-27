# map/

`world-50m.topo.json` is the geometry of the WorldMap (docs/04 §3, D-20), made by
`pnpm --filter @gai/web map` (`scripts/prepare-map.ts`):

| | |
|---|---|
| Source | Natural Earth 1:50m Cultural Vectors, Admin 0 – Countries, release v5.1.2, `geojson/ne_50m_admin_0_countries.geojson` from https://github.com/nvkelso/natural-earth-vector |
| Source SHA-256 | `3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb` (3,083,490 bytes) |
| Licence | Public domain (https://www.naturalearthdata.com/about/terms-of-use/) |
| Tool | mapshaper 0.7.68: Antarctica removed; `id` = `ISO_A3_EH`, or `ADM0_A3` where Natural Earth gives `-99` (Kosovo, Somaliland, N. Cyprus, Siachen Glacier); `name` = `NAME_EN`; `excluded` = true for ISR and PSE (D-10); simplified to 15 % of vertices keeping every shape; TopoJSON quantised at 20,000 |
| Output | 146,544 bytes |

Borders are Natural Earth's de facto boundaries. Territories that are not in `data/countries.yaml`
(disputed territories, dependencies) are drawn with the neutral fill and never coloured
(docs/04 §3). Two features share the key `AUS` (Indian Ocean Territories and the Ashmore and
Cartier Islands); the map draws every feature of a key under one link.
