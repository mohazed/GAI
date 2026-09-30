/**
 * B1 (UNGA votes) and B2 (UNSC vetoes) events from unga_votes.csv and unsc_vetoes.csv (D-08).
 *
 * B1: one repeatable event per country and qualifying vote (votes.yaml), dated the day of the
 * vote, with the tier of indicators.yaml: Y yes +3, A abstain −2, N no −5, X absent −2 (a formal
 * "did not participate" is recorded as X). Rows of resolutions not in votes.yaml are tracked,
 * never scored (docs/03 §7). Evidence: the table row and the vote's press release with its quote.
 *
 * B2: one repeatable event per permanent member and vetoed draft whose row says `ceasefire: true`
 * (docs/02 §2 B2), −20 each; other vetoes are tracked, not scored.
 */
import {
  formatEventId,
  type Located,
  STRUCTURED_TABLES,
  type StructuredRow,
  slugify,
} from '@gai/schema'
import { byNumber } from './actor.js'
import {
  actorFor,
  baseEvent,
  type GenerateContext,
  type Generated,
  rowEvidence,
  signed,
} from './common.js'

const VOTE_TIER = { Y: 'yes', A: 'abstain', N: 'no', X: 'absent' } as const

/**
 * The verb of each recorded vote, French by number (singular, plural). "Opté pour l'abstention"
 * rather than "s'est abstenu": a pronominal verb agrees in gender, which the registry does not
 * record, while verbs conjugated with avoir agree in number only.
 */
const VOTE_TEXT = {
  Y: { en: 'voted yes on', fr: ['a voté pour', 'ont voté pour'] },
  N: { en: 'voted no on', fr: ['a voté contre', 'ont voté contre'] },
  A: { en: 'abstained on', fr: ["a opté pour l'abstention sur", "ont opté pour l'abstention sur"] },
  X: {
    en: 'did not vote on',
    fr: ["n'a pas pris part au vote sur", "n'ont pas pris part au vote sur"],
  },
} as const

/** `A/RES/ES-10/21` → `es-10-21`; `A/DEC/80/506` → `dec-80-506` (docs/03 §2 example). */
export function voteSlug(symbol: string): string {
  return slugify(symbol.replace(/^A\/RES\//, '').replace(/^A\//, ''))
}

function tierPoints(ctx: GenerateContext, id: string, key: string): number | undefined {
  const ind = ctx.indicators.find((i) => i.id === id)
  const p = ind?.points
  if (p?.kind === 'fixed') return p.value
  if (p?.kind === 'tiers' || (p?.kind === 'per_instance' && p.tiers)) {
    return p.tiers?.find((t) => t.key === key)?.value
  }
  return undefined
}

export function generateB1(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'unga_votes.csv'>>[],
): Generated {
  const votes = new Map(ctx.votes.votes.map((v) => [v.symbol, v]))
  const events = []
  const notes: string[] = []
  const columns = STRUCTURED_TABLES['unga_votes.csv'].columns
  for (const row of rows) {
    const r = row.value
    const vote = votes.get(r.resolution)
    if (vote === undefined || ctx.excluded.has(r.iso3)) continue
    if (r.date !== vote.date) {
      notes.push(
        `unga_votes.csv row ${row.line}: ${r.resolution} dated ${r.date}, votes.yaml says ${vote.date}; the votes.yaml date is used`,
      )
    }
    const tier = VOTE_TIER[r.vote]
    const points = tierPoints(ctx, 'B1', tier)
    if (points === undefined) throw new Error(`indicators.yaml has no B1 tier "${tier}"`)
    const kind =
      vote.kind === 'decision'
        ? { en: 'decision', fr: 'la décision' }
        : { en: 'resolution', fr: 'la résolution' }
    const verb = VOTE_TEXT[r.vote]
    const a = actorFor(ctx, r.iso3)
    const evidence = [
      ...rowEvidence(row as Located<Record<string, unknown>>, 'unga_votes.csv', columns),
      { source: vote.source, quote: vote.quote, quote_lang: 'en', locator: vote.locator },
    ]
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: vote.date,
            iso3: r.iso3,
            indicator: 'B1',
            slug: voteSlug(r.resolution),
          }),
          country: r.iso3,
          indicator: 'B1',
          type: 'repeatable',
          date: vote.date,
          points,
          points_rationale: `Recorded vote ${r.vote} (${tier}) on ${r.resolution}: ${signed(points)}.`,
          summary: {
            en: `${a.en} ${verb.en} General Assembly ${kind.en} ${r.resolution}.`,
            fr: `${a.fr} ${byNumber(a, verb.fr[0], verb.fr[1])} ${kind.fr} ${r.resolution} de l'Assemblée générale.`,
          },
          evidence,
        },
        'unga_votes.csv',
      ),
    )
  }
  return { events, notes }
}

export function generateB2(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'unsc_vetoes.csv'>>[],
): Generated {
  const points = tierPoints(ctx, 'B2', '')
  if (points === undefined) throw new Error('indicators.yaml gives B2 no fixed value')
  const columns = STRUCTURED_TABLES['unsc_vetoes.csv'].columns
  const events = []
  const notes: string[] = []
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.vetoed_by)) continue
    if (!r.ceasefire) {
      notes.push(
        `unsc_vetoes.csv row ${row.line}: ${r.draft} by ${r.vetoed_by} is tracked, not scored (ceasefire: false)`,
      )
      continue
    }
    const a = actorFor(ctx, r.vetoed_by)
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: r.date,
            iso3: r.vetoed_by,
            indicator: 'B2',
            slug: slugify(r.draft),
          }),
          country: r.vetoed_by,
          indicator: 'B2',
          type: 'repeatable',
          date: r.date,
          points,
          points_rationale: `Veto of ${r.draft}, a draft calling for a ceasefire, truce or pause: ${signed(points)}.`,
          summary: {
            en: `${a.en} vetoed Security Council draft resolution ${r.draft}.`,
            fr: `${a.fr} ${byNumber(a, 'a opposé son', 'ont opposé leur')} veto au projet de résolution ${r.draft} du Conseil de sécurité.`,
          },
          evidence: rowEvidence(
            row as Located<Record<string, unknown>>,
            'unsc_vetoes.csv',
            columns,
          ),
        },
        'unsc_vetoes.csv',
      ),
    )
  }
  return { events, notes }
}
