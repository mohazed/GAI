import type { CompareStyle } from '../lib/compare'

/*
 * The marks that tell compared countries apart (docs/05 §3 compare palette, §8: colour is never
 * the only carrier): each country has a colour, a line dash and a dot shape (lib/compare.ts).
 * Kept apart from the charts so that the Compare page's picker can show them without loading the
 * chart code.
 */

/** A short sample of the line's dash, for labels and legends. */
export function LineSwatch({ style }: { style: CompareStyle }) {
  return (
    <svg width="20" height="8" aria-hidden="true" className="inline-block shrink-0">
      <line
        x1={0}
        x2={20}
        y1={4}
        y2={4}
        className={style.stroke}
        strokeWidth={2}
        strokeDasharray={style.dash}
      />
    </svg>
  )
}

export function Shape({ shape, cls }: { shape: CompareStyle['shape']; cls: string }) {
  switch (shape) {
    case 'circle':
      return <circle r={5} className={cls} />
    case 'square':
      return <rect x={-4.5} y={-4.5} width={9} height={9} className={cls} />
    case 'triangle':
      return <path d="M0,-5.5 L5.5,4.5 L-5.5,4.5 Z" className={cls} />
    case 'diamond':
      return <path d="M0,-6 L6,0 L0,6 L-6,0 Z" className={cls} />
    case 'cross':
      return <path d="M-5,-2 H-2 V-5 H2 V-2 H5 V2 H2 V5 H-2 V2 H-5 Z" className={cls} />
  }
}

/** Line sample and dot shape together, beside a country's name (the picker's chips). */
export function CompareMark({ style }: { style: CompareStyle }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1" aria-hidden="true">
      <LineSwatch style={style} />
      <svg width="12" height="12" overflow="visible" aria-hidden="true" className="inline-block">
        <g transform="translate(6 6)">
          <Shape shape={style.shape} cls={style.fill} />
        </g>
      </svg>
    </span>
  )
}
