/**
 * The share card of a country page (docs/05 §5 ShareCard): 1200 × 630, paper ground; the wordmark
 * small at the top; the country name and the score with its band chip on the left, the gauge with
 * its marker and the coverage line on the right; the summary line and the permalink with the
 * methodology version at the bottom. One template for every country; the scorecard variant (D-16)
 * writes "Scorecard · N events · coverage X %" instead of the number and draws the gauge without
 * colour or marker; an excluded entity (D-10) says it is not scored and why.
 *
 * Rendered by satori (flexbox subset, inline style objects: this is an image, not a page, so the
 * site's CSP does not apply) and rasterised by resvg in scripts/cards.ts. Pure.
 */
import type { ReactNode } from 'react'

/** Design tokens (docs/05 §3), as hex: satori has no CSS variables and no color-mix(). */
export const TOKENS = {
  paper: '#FFFFFF',
  paper2: '#F3F3F0',
  rule: '#D6D6D0',
  ink: '#15161A',
  ink2: '#4B4D53',
  ink3: '#6F7278',
  band: {
    sustaining: '#7A1F1A',
    enabling: '#C4613E',
    passive: '#B9B3A6',
    acting: '#4F8A88',
    confronting: '#16504F',
  } as Record<string, string>,
}

/** A band colour at 14 % over paper (the chip ground of docs/05 §3). */
export function tint(hex: string, share = 0.14): string {
  const n = Number.parseInt(hex.slice(1), 16)
  const mix = (c: number) => Math.round(c * share + 255 * (1 - share))
  const r = mix((n >> 16) & 255)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export interface CardSegment {
  band: string
  /** Position of the segment on the −100…+100 axis, as shares of the bar (0–1). */
  from: number
  to: number
}

export interface CardInput {
  wordmark: string
  name: string
  kind: 'score' | 'scorecard' | 'excluded'
  /** Score mode: the display integer, signed ("−14"), the band name and id. */
  score?: string
  band?: { id: string; name: string }
  /** Share of the bar where the marker sits (score mode). */
  marker?: number
  /** Scorecard mode: "Scorecard · 14 events · coverage 71 %". */
  scorecardLine?: string
  /** Excluded: "Not scored" and the reason. */
  notScored?: string
  reason?: string
  segments: CardSegment[]
  scale: string[]
  /** "Coverage 71 %" and "4 without data, 5 unchecked"; null for an excluded entity. */
  coverage: { label: string; missing: string; statuses: string[] } | null
  summary: string
  permalink: string
  methodology: string
}

const FILL: Record<string, string> = {
  'has-events': TOKENS.ink,
  'none-found': TOKENS.ink,
  'no-data': TOKENS.rule,
  unchecked: TOKENS.paper,
}

/**
 * A filled segment of a flex row, with an optional 1 px outline drawn as a frame of its own
 * colour: satori writes one-sided borders as zero-radius arcs, which resvg cannot rasterise.
 */
function Box({
  basis,
  gap,
  fill,
  outline,
}: {
  basis: number
  gap: number
  fill: string
  outline: string | null
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexBasis: `${basis}%`,
        flexShrink: 1,
        flexGrow: 0,
        marginLeft: gap,
        padding: outline === null ? 0 : 1,
        backgroundColor: outline ?? fill,
      }}
    >
      <div style={{ display: 'flex', flexGrow: 1, backgroundColor: fill }} />
    </div>
  )
}

/** A 1 px hairline in the rule colour. */
function Rule() {
  return <div style={{ display: 'flex', height: 1, width: '100%', backgroundColor: TOKENS.rule }} />
}

function nameSize(name: string): number {
  return name.length > 30 ? 48 : name.length > 20 ? 60 : 72
}

function Gauge({ input }: { input: CardInput }) {
  const colour = input.kind === 'score'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', position: 'relative', height: 40, width: '100%' }}>
        <div
          style={{ display: 'flex', position: 'absolute', top: 16, left: 0, right: 0, height: 16 }}
        >
          {input.segments.map((s, i) => (
            <Box
              key={s.band}
              basis={(s.to - s.from) * 100}
              gap={i === 0 ? 0 : 2}
              fill={colour ? (TOKENS.band[s.band] ?? TOKENS.rule) : TOKENS.paper2}
              outline={colour ? null : TOKENS.rule}
            />
          ))}
        </div>
        {colour && input.marker !== undefined ? (
          <div
            style={{
              position: 'absolute',
              left: `${input.marker * 100}%`,
              top: 0,
              width: 4,
              height: 40,
              marginLeft: -2,
              backgroundColor: TOKENS.ink,
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'Source Code Pro',
          fontSize: 16,
          color: TOKENS.ink2,
          marginTop: 8,
        }}
      >
        {input.scale.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  )
}

function Coverage({ coverage }: { coverage: NonNullable<CardInput['coverage']> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: 32 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'Source Sans 3',
          fontSize: 22,
          color: TOKENS.ink,
        }}
      >
        <span style={{ fontWeight: 600 }}>{coverage.label}</span>
        <span style={{ color: TOKENS.ink2 }}>{coverage.missing}</span>
      </div>
      <div style={{ display: 'flex', marginTop: 10, height: 12, width: '100%' }}>
        {coverage.statuses.map((s, i) => (
          <Box
            // biome-ignore lint/suspicious/noArrayIndexKey: segments follow the methodology order.
            key={i}
            basis={100 / coverage.statuses.length}
            gap={i === 0 ? 0 : 3}
            fill={FILL[s] ?? TOKENS.paper}
            outline={s === 'has-events' || s === 'none-found' ? null : TOKENS.rule}
          />
        ))}
      </div>
    </div>
  )
}

export function Card({ input }: { input: CardInput }): ReactNode {
  const band = input.band
  const bandColour = band === undefined ? TOKENS.rule : (TOKENS.band[band.id] ?? TOKENS.rule)
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: TOKENS.paper,
        color: TOKENS.ink,
        padding: '48px 56px',
        fontFamily: 'Source Sans 3',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Newsreader',
          fontSize: 28,
          paddingBottom: 16,
        }}
      >
        {input.wordmark}
      </div>
      <Rule />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 520, paddingRight: 40 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Newsreader',
              fontSize: nameSize(input.name),
              lineHeight: 1.05,
            }}
          >
            {input.name}
          </div>
          {input.kind === 'score' && band !== undefined ? (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Newsreader',
                  fontSize: 168,
                  lineHeight: 1,
                }}
              >
                {input.score}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 28,
                  padding: '6px 12px',
                  borderRadius: 2,
                  backgroundColor: tint(bandColour),
                  fontSize: 28,
                }}
              >
                <div
                  style={{ width: 16, height: 16, backgroundColor: bandColour, marginRight: 10 }}
                />
                {band.name}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 30,
                color: input.kind === 'excluded' ? TOKENS.ink : TOKENS.ink2,
                fontWeight: input.kind === 'excluded' ? 600 : 400,
              }}
            >
              {input.kind === 'excluded' ? input.notScored : input.scorecardLine}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: 568,
          }}
        >
          {input.kind === 'excluded' ? (
            <div style={{ display: 'flex', fontSize: 26, color: TOKENS.ink2, lineHeight: 1.35 }}>
              {input.reason}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Gauge input={input} />
              {input.coverage !== null ? <Coverage coverage={input.coverage} /> : null}
            </div>
          )}
        </div>
      </div>
      <Rule />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {input.kind === 'excluded' ? null : (
          <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.3, marginTop: 16 }}>
            {input.summary}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Source Code Pro',
            fontSize: 16,
            color: TOKENS.ink2,
            marginTop: 14,
          }}
        >
          <span>{input.permalink}</span>
          <span>{input.methodology}</span>
        </div>
      </div>
    </div>
  )
}
