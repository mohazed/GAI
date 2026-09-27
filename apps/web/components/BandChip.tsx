import type { Lang } from '../lib/i18n'
import type { BandSpec } from '../lib/methodology'

export interface BandChipProps {
  lang: Lang
  band: BandSpec
}

/**
 * Band chip (docs/05 §3): the band colour at 14 % as ground, a solid 8 px square of the band
 * colour, the name in ink. The colour never carries the meaning alone: the name is always there.
 */
export function BandChip({ lang, band }: BandChipProps) {
  return (
    <span
      className={`band-${band.id} band-tint inline-flex items-center gap-1.5 rounded-xs px-1.5 py-0.5 text-14 text-ink`}
    >
      <span aria-hidden="true" className="band-swatch inline-block size-2 shrink-0" />
      {band.name[lang]}
    </span>
  )
}
