/**
 * The widget's text, in English and French. Each string is the site's own (apps/web/messages,
 * the keys named beside it; a test keeps them equal), with French typography already applied:
 * no-break space before `:`, narrow no-break space before `;` and `%`.
 */
import type { Lang } from './config.js'

const NBSP = ' '
const NNBSP = ' '

type N = number | string

/** `zero`, `one` or `other` by ICU's English and French rules (French `one` covers 0 and 1). */
function plural(lang: Lang, n: number, zero: string, one: string, other: string): string {
  if (n === 0) return zero
  if (n === 1 || (lang === 'fr' && n < 2)) return one.replace('#', String(n))
  return other.replace('#', String(n))
}

export interface Strings {
  /** common.siteName */
  site: string
  /** siteName, with the country: the link back to its page. */
  link: (name: string) => string
  /** gauge.scorecard */
  scorecard: string
  /** gauge.scorecardLabel */
  scorecardLabel: string
  /** gauge.label */
  gaugeLabel: (score: string, band: string) => string
  /** gauge.tooltip */
  tooltip: (score: string, version: string) => string
  /** gauge.zero */
  zero: string
  /** gauge.excluded */
  excluded: (reason: string) => string
  /** coverage.label */
  coverage: (pct: string) => string
  /** coverage.missing */
  missing: (noData: N, unchecked: number) => string
  /** coverage.aria */
  coverageAria: (pct: string, covered: N, applicable: N, noData: N, unchecked: N) => string
  /** coverage.status.* */
  status: Record<string, string>
  /** chart.timelineAria */
  timelineAria: (
    country: string,
    from: string,
    to: string,
    changes: number,
    score: string,
  ) => string
  /** chart.stripAria */
  stripAria: (country: string, from: string, to: string, count: number, changes: number) => string
  /** changesPage.built */
  built: (date: string, version: string) => string
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    site: 'Gaza Accountability Index',
    link: (name) => `Gaza Accountability Index: ${name}`,
    scorecard: 'Score not yet published · scorecard mode',
    scorecardLabel: 'Scale from −100 to +100. The score is not yet published.',
    gaugeLabel: (score, band) => `Score ${score}, ${band} band, on a scale from −100 to +100.`,
    tooltip: (score, version) => `${score} · methodology v${version}`,
    zero: '0 · passivity line',
    excluded: (reason) => `Not scored. ${reason}`,
    coverage: (pct) => `Coverage ${pct}`,
    missing: (noData, unchecked) => `${noData} without data, ${unchecked} unchecked`,
    coverageAria: (pct, covered, applicable, noData, unchecked) =>
      `Coverage ${pct}: ${covered} of ${applicable} applicable indicators checked; ${noData} without data, ${unchecked} unchecked.`,
    status: {
      'has-events': 'has events',
      'none-found': 'checked, nothing found',
      'no-data': 'no data published',
      unchecked: 'not checked yet',
    },
    timelineAria: (country, from, to, changes, score) =>
      `${country}, score from ${from} to ${to}: ${plural('en', changes, 'no change', '# change', '# changes')}; ${score} at the end.`,
    stripAria: (country, from, to, count, changes) =>
      `${country}, from ${from} to ${to}: ${plural('en', count, 'no event', '# event', '# events')} and ${plural('en', changes, 'no change', '# change', '# changes')} of computed values.`,
    built: (date, version) => `Built on ${date} from the published data, methodology v${version}.`,
  },
  fr: {
    site: 'Gaza Accountability Index',
    link: (name) => `Gaza Accountability Index${NBSP}: ${name}`,
    scorecard: 'Score pas encore publié · mode fiche',
    scorecardLabel: "Échelle de −100 à +100. Le score n'est pas encore publié.",
    gaugeLabel: (score, band) => `Score ${score}, bande ${band}, sur une échelle de −100 à +100.`,
    tooltip: (score, version) => `${score} · méthodologie v${version}`,
    zero: '0 · seuil de passivité',
    excluded: (reason) => `Non noté. ${reason}`,
    coverage: (pct) => `Couverture ${pct}`,
    missing: (noData, unchecked) =>
      `${noData} sans données, ${plural('fr', unchecked, '0 non vérifié', '# non vérifié', '# non vérifiés')}`,
    coverageAria: (pct, covered, applicable, noData, unchecked) =>
      `Couverture ${pct}${NBSP}: ${covered} indicateurs applicables vérifiés sur ${applicable}${NNBSP}; ${noData} sans données, ${unchecked} non vérifiés.`,
    status: {
      'has-events': 'événements publiés',
      'none-found': 'vérifié, rien trouvé',
      'no-data': 'aucune donnée publiée',
      unchecked: 'pas encore vérifié',
    },
    timelineAria: (country, from, to, changes, score) =>
      `${country}, score du ${from} au ${to}${NBSP}: ${plural('fr', changes, 'aucun changement', '# changement', '# changements')}${NNBSP}; ${score} à la fin.`,
    stripAria: (country, from, to, count, changes) =>
      `${country}, du ${from} au ${to}${NBSP}: ${plural('fr', count, 'aucun événement', '# événement', '# événements')} et ${plural('fr', changes, 'aucun changement', '# changement', '# changements')} de valeurs calculées.`,
    built: (date, version) =>
      `Généré le ${date} à partir des données publiées, méthodologie v${version}.`,
  },
}
