/**
 * Shared SVG definitions, rendered once per page by the layout: the no-data hatch (docs/05 §3
 * `--nodata`: rule-coloured 2 px lines every 6 px at 45°). Charts fill with `url(#gai-hatch)`.
 */
export const HATCH = 'url(#gai-hatch)'

export function SvgDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <pattern
          id="gai-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" className="fill-paper" />
          <rect width="2" height="6" className="fill-rule" />
        </pattern>
      </defs>
    </svg>
  )
}
