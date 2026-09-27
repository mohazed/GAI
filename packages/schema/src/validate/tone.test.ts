/**
 * Tests for the tone lint functions (validate/tone.ts): banned-word matching, the summary lint and
 * the actor-first heuristic. The real list is methodology/vX.Y.Z/banned-words.txt; the matching
 * edge cases use small custom lists built with the loader's own parser.
 */
import { describe, expect, it } from 'vitest'
import { parseBannedWords } from '../load/methodology.js'
import { repoMethodology } from '../testing/harness.js'
import {
  type ActorNames,
  checkActorFirst,
  compileBannedWords,
  findBannedWords,
  lintSummary,
  SUMMARY_MAX_LENGTH,
  type SummaryLang,
  type ToneViolation,
} from './tone.js'

const REAL_ENTRIES = repoMethodology().bannedWords?.entries ?? []
const REAL = compileBannedWords(REAL_ENTRIES)

/** A matcher over a custom list, one term per argument, parsed like banned-words.txt. */
const custom = (...terms: string[]) => compileBannedWords(parseBannedWords(terms.join('\n')))

const terms = (text: string, matcher = REAL) => findBannedWords(text, matcher).map((m) => m.term)
const matches = (text: string, matcher = REAL) => findBannedWords(text, matcher).map((m) => m.match)
const kinds = (vs: ToneViolation[]) => vs.map((v) => v.kind)

const GERMANY_EN: ActorNames = {
  countryName: 'Germany',
  actor: { label: 'Federal Chancellor', name: 'Friedrich Merz' },
}
const GERMANY_FR: ActorNames = {
  countryName: 'Allemagne',
  actor: { label: 'Chancelier fédéral', name: 'Friedrich Merz' },
}
const namesFor = (lang: SummaryLang) => (lang === 'en' ? GERMANY_EN : GERMANY_FR)

// The fixture event's summaries (fixtures/data/events/DEU.yaml).
const FIXTURE_EN =
  'The Federal Chancellor stated that the federal government would not approve, until further notice, exports of military equipment that could be used in the Gaza Strip.'
const FIXTURE_FR =
  "Le chancelier fédéral a déclaré que le gouvernement fédéral n'autoriserait pas, jusqu'à nouvel ordre, les exportations d'équipements militaires susceptibles d'être utilisés dans la bande de Gaza."

// ---------------------------------------------------------------------------------------------
// Banned words: the real list

describe('findBannedWords with methodology banned-words.txt', () => {
  it('loads a non-empty list', () => {
    expect(REAL_ENTRIES.length).toBeGreaterThan(100)
    expect(REAL.any).not.toBeNull()
  })

  it.each([
    'Ireland filed a declaration of intervention in the case South Africa v. Israel under the Genocide Convention.',
    'The Prime Minister stated that the government would execute the arrest warrants issued by the International Criminal Court.',
    "Le gouvernement a interdit l'importation de biens produits dans les colonies israéliennes.",
    'The government encouraged the parties to agree to a ceasefire and condemned the blockade.',
    'Le gouvernement a dénoncé le blocus et la famine dans la bande de Gaza.',
    FIXTURE_EN,
    FIXTURE_FR,
  ])('does not trip on a neutral sentence: %s', (text) => {
    expect(findBannedWords(text, REAL)).toEqual([])
  })

  it('catches the EN and FR examples', () => {
    expect(findBannedWords('The government took a historic step.', REAL)).toEqual([
      { term: 'historic', index: 22, match: 'historic' },
    ])
    expect(findBannedWords('Le gouvernement a pris une décision courageuse.', REAL)).toEqual([
      { term: 'courage*', index: 36, match: 'courageuse' },
    ])
  })

  it('does not match a term inside a longer word ("courage*" vs "encouraged")', () => {
    expect(terms('The minister encouraged talks.')).toEqual([])
    expect(terms('The minister was courageous.')).toEqual(['courage*'])
  })

  it('treats a hyphen as a word boundary ("anti-Zionist" is caught by "zionis*")', () => {
    expect(terms('The minister criticised an anti-Zionist campaign.')).toEqual(['zionis*'])
  })

  it('reports one match when the list spells a phrase with both apostrophes', () => {
    expect(findBannedWords('Il a parlé de crimes contre l’humanité.', REAL)).toHaveLength(1)
    expect(findBannedWords("Il a parlé de crimes contre l'humanité.", REAL)).toHaveLength(1)
  })

  it('reports every occurrence, sorted by position', () => {
    const found = findBannedWords('A very brutal and very tragic act.', REAL)
    expect(found.map((m) => [m.match, m.index])).toEqual([
      ['very', 2],
      ['brutal', 7],
      ['very', 18],
      ['tragic', 23],
    ])
  })
})

// ---------------------------------------------------------------------------------------------
// Banned words: matching rules, on custom lists

describe('findBannedWords pre-check', () => {
  it('finds exactly what the terms find, on generated adversarial texts', () => {
    // A deterministic generator (linear congruential) of texts mixing words of real terms,
    // other letters, digits, spaces of every kind, apostrophe look-alikes, fullwidth forms and
    // invisible format characters, U+FEFF (both whitespace and invisible) and an astral one
    // (U+E0001) included. The pre-check must never hide or invent a match.
    let seed = 20260927
    const next = (n: number) => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed % n
    }
    const pieces = [
      'brutal',
      'shame',
      'ful',
      'war',
      'crime',
      'crimes',
      'honteu',
      'x',
      'courage',
      'en',
      'd',
      'guerre',
      'crime de guerre',
      'apartheid',
      'Gaza',
      '12',
      'é',
      'É',
      'ｂｒｕｔａｌ',
      'l',
    ]
    const glue = [
      ' ',
      '  ',
      '\u00A0',
      '\u202F',
      '-',
      "'",
      '’',
      'ʼ',
      '`',
      '\u00AD',
      '\u200B',
      '\u200D',
      '\u2060',
      '\uFEFF',
      '\u{E0001}',
      '',
      '',
      '',
      '.',
      ',',
    ]
    let checked = 0
    let withMatch = 0
    for (let i = 0; i < 4000; i++) {
      let text = ''
      const n = 1 + next(6)
      for (let k = 0; k < n; k++) {
        text += (pieces[next(pieces.length)] as string) + (glue[next(glue.length)] as string)
      }
      const fast = findBannedWords(text, REAL)
      const reference = findBannedWords(text, REAL, { prefilter: false })
      expect(fast, JSON.stringify(text)).toEqual(reference)
      checked++
      if (reference.length > 0) withMatch++
    }
    expect(checked).toBe(4000)
    // The generator reaches both outcomes often.
    expect(withMatch).toBeGreaterThan(500)
    expect(checked - withMatch).toBeGreaterThan(500)
  })

  it('treats U+FEFF as an invisible inside a word and as a space between the words of a phrase', () => {
    const m = custom('war crime*', 'brutal')
    expect(terms('bru\uFEFFtal', m)).toEqual(['brutal'])
    expect(terms('war\uFEFFcrimes', m)).toEqual(['war crime*'])
    expect(terms('war\u200B crimes', m)).toEqual(['war crime*'])
    expect(terms('warcrimes', m)).toEqual([])
    expect(terms('x\u200Bbrutal', m)).toEqual([])
  })
})

describe('findBannedWords matching rules', () => {
  it('matches whole words only (letters and digits on either side block a match)', () => {
    const m = custom('bold')
    expect(terms('The boldface heading.', m)).toEqual([])
    expect(terms('An embolden move.', m)).toEqual([])
    expect(terms('Code bold2 and 2bold.', m)).toEqual([])
    expect(terms('A bold move.', m)).toEqual(['bold'])
    expect(terms('(bold), "bold"; bold-faced.', m)).toEqual(['bold', 'bold', 'bold'])
  })

  it('is case-insensitive, accents included', () => {
    const m = custom('héroïque*')
    expect(matches('Un acte HÉROÏQUE.', m)).toEqual(['HÉROÏQUE'])
    expect(matches('Bold', custom('BOLD'))).toEqual(['Bold'])
  })

  it('compares after NFC normalisation (decomposed text matches a composed term)', () => {
    const decomposed = 'Un acte he\u0301roi\u0308que.'
    const found = findBannedWords(decomposed, custom('héroïque*'))
    expect(found).toEqual([{ term: 'héroïque*', index: 8, match: 'héroïque' }])
  })

  it('treats a trailing * as "any word starting with"', () => {
    const m = custom('honteu*')
    expect(matches('honteux, honteuse, honteuses, honteusement', m)).toEqual([
      'honteux',
      'honteuse',
      'honteuses',
      'honteusement',
    ])
    expect(matches('honte', m)).toEqual([])
    expect(matches('déshonteux', m)).toEqual([])
  })

  it('without *, matches the exact word only', () => {
    expect(matches('crime, crimes, criminal', custom('crime'))).toEqual(['crime'])
  })

  it('applies * to the last word of a phrase', () => {
    const m = custom('war crime*')
    expect(matches('a war crime; war crimes; WAR CRIMES', m)).toEqual([
      'war crime',
      'war crimes',
      'WAR CRIMES',
    ])
    expect(matches('war-time crimes; war criminals', m)).toEqual([])
  })

  it('matches any run of whitespace between the words of a phrase', () => {
    const m = custom('sans précédent')
    expect(matches('sans précédent', m)).toHaveLength(1)
    expect(matches('sans  précédent', m)).toHaveLength(1)
    expect(matches('sans\u00a0précédent', m)).toHaveLength(1)
    expect(matches('sans\u202fprécédent', m)).toHaveLength(1)
    expect(matches('sans\n  précédent', m)).toHaveLength(1)
    expect(matches('sans-précédent', m)).toEqual([])
    expect(matches('sansprécédent', m)).toEqual([])
  })

  it("treats ' and ’ as the same character, in terms and in text", () => {
    const straight = custom("crime contre l'humanité")
    const curly = custom('crime contre l’humanité')
    for (const m of [straight, curly]) {
      expect(matches("un crime contre l'humanité", m)).toEqual(["crime contre l'humanité"])
      expect(matches('un crime contre l’humanité', m)).toEqual(['crime contre l’humanité'])
    }
    expect(custom("crime contre l'humanité", 'crime contre l’humanité').terms).toHaveLength(1)
  })

  it('escapes regular-expression metacharacters in terms', () => {
    const m = custom('a.b', 'c++', '(x)', 'so-called')
    expect(matches('axb aab', m)).toEqual([])
    expect(matches('a.b c++ (x) so-called', m)).toEqual(['a.b', 'c++', '(x)', 'so-called'])
  })

  it('reports the first-listed term when two terms match the same span', () => {
    const found = findBannedWords('a bold move', custom('bold', 'bol*'))
    expect(found).toEqual([{ term: 'bold', index: 2, match: 'bold' }])
  })

  it('ignores invisible format characters inside and around a term (soft hyphen, zero-width)', () => {
    const m = custom('brutal*', 'war crime*')
    for (const text of [
      'the bru\u00ADtal operation',
      'the bru\u200Btal operation',
      'the b\u200Dr\u2060u\uFEFFtal operation',
      '\u200Bbrutal\u200B',
    ]) {
      expect(terms(text, m), JSON.stringify(text)).toEqual(['brutal*'])
    }
    expect(terms('war\u00AD crimes', m)).toEqual(['war crime*'])
    // Offsets and matched text refer to the text as written.
    const found = findBannedWords('A bru\u00ADtal act.', m)
    expect(found).toEqual([{ term: 'brutal*', index: 2, match: 'bru\u00ADtal' }])
    // An invisible character does not join two words into one.
    expect(terms('brutal\u00ADity', custom('brutal'))).toEqual([])
    expect(terms('x\u200Dbrutal', custom('brutal'))).toEqual([])
  })

  it('matches fullwidth letters and apostrophe look-alikes', () => {
    expect(terms('the ｂｒｕｔａｌ operation', custom('brutal*'))).toEqual(['brutal*'])
    const m = custom("crime contre l'humanité")
    for (const apostrophe of ['\u02BC', '\u2018', '\u0060', '\u00B4', '\uFF07']) {
      const text = `un crime contre l${apostrophe}humanité`
      expect(matches(text, m), apostrophe).toEqual([`crime contre l${apostrophe}humanité`])
    }
  })

  it('catches the red-team spellings with the real list', () => {
    for (const text of [
      'The Federal Chancellor described the bru\u00ADtal operation.',
      'The Federal Chancellor described the bru\u200Btal operation.',
      'The Federal Chancellor described the ｂｒｕｔａｌ operation.',
    ]) {
      expect(terms(text).length, JSON.stringify(text)).toBeGreaterThan(0)
    }
    for (const apostrophe of ['\u02BC', '\u2018']) {
      expect(terms(`Il a parlé de crime contre l${apostrophe}humanité.`).length).toBeGreaterThan(0)
    }
  })

  it('never throws and matches nothing on an empty list or empty terms', () => {
    expect(findBannedWords('anything at all', compileBannedWords([]))).toEqual([])
    const blank = compileBannedWords([
      { term: '*', line: 1 },
      { term: '   ', line: 2 },
    ])
    expect(blank.terms).toEqual([])
    expect(findBannedWords('anything', blank)).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// lintSummary

describe('lintSummary', () => {
  it('accepts the fixture summaries', () => {
    expect(lintSummary(FIXTURE_EN, 'en', { matcher: REAL, ...GERMANY_EN })).toEqual([])
    expect(lintSummary(FIXTURE_FR, 'fr', { matcher: REAL, ...GERMANY_FR })).toEqual([])
  })

  it.each([
    ['en', 'Germany took a historic decision.', 'historic'],
    ['fr', 'L’Allemagne a pris une décision courageuse.', 'courage*'],
  ] as const)('reports a banned word (%s)', (lang, text, term) => {
    const vs = lintSummary(text, lang, { matcher: REAL, ...namesFor(lang) })
    expect(vs).toMatchObject([{ kind: 'banned-word', term }])
    expect(vs[0]?.message).toContain(`"${term}"`)
  })

  it('reports one violation per banned-word occurrence', () => {
    const vs = lintSummary('Germany took a very, very bold step.', 'en', {
      matcher: custom('very', 'bold'),
      ...GERMANY_EN,
    })
    expect(vs.map((v) => (v.kind === 'banned-word' ? v.match : v.kind))).toEqual([
      'very',
      'very',
      'bold',
    ])
  })

  it('skips the banned-word check when there is no list', () => {
    const vs = lintSummary('Germany took a historic step.', 'en', { matcher: null, ...GERMANY_EN })
    expect(vs).toEqual([])
  })

  it.each([
    ['en', 'Germany voted against the resolution!'],
    ['fr', 'L’Allemagne a voté contre la résolution\u202f!'],
    ['fr', 'L’Allemagne a voté contre la résolution ¡.'],
    ['en', 'Germany voted against the resolution\uff01'],
  ] as const)('reports an exclamation mark (%s): %s', (lang, text) => {
    const vs = lintSummary(text, lang, { matcher: REAL, ...namesFor(lang) })
    expect(kinds(vs)).toEqual(['exclamation'])
  })

  it.each(['❗', '❕', '❢', '﹗', 'ǃ', '！', '‼'])('reports the exclamation form %s', (mark) => {
    const vs = lintSummary(`The Federal Chancellor suspended exports${mark}`, 'en', {
      matcher: null,
      ...GERMANY_EN,
    })
    expect(kinds(vs)).toEqual(['exclamation'])
  })

  it('reports several exclamation marks as one violation with their count', () => {
    const vs = lintSummary('Germany voted no! Twice!', 'en', { matcher: null, ...GERMANY_EN })
    expect(vs).toMatchObject([{ kind: 'exclamation', count: 2, index: 16 }])
    expect(vs[0]?.message).toContain('2 exclamation marks')
  })

  it.each(['en', 'fr'] as const)('accepts exactly %s 200 characters and rejects 201', (lang) => {
    const start = lang === 'en' ? 'Germany voted ' : 'L’Allemagne a voté '
    const at = (n: number) => start + 'x'.repeat(n - [...start].length)
    const opts = { matcher: REAL, ...namesFor(lang) }
    expect([...at(SUMMARY_MAX_LENGTH)]).toHaveLength(200)
    expect(lintSummary(at(200), lang, opts)).toEqual([])
    expect(lintSummary(at(201), lang, opts)).toMatchObject([
      { kind: 'length', length: 201, max: 200 },
    ])
  })

  it('counts code points after NFC, not UTF-16 units', () => {
    const astral = `Germany voted ${'x'.repeat(185)}\u{1D400}` // 200 code points, 201 units
    expect(astral.length).toBe(201)
    expect(lintSummary(astral, 'en', { matcher: null, ...GERMANY_EN })).toEqual([])
    const decomposed = `Germany voted ${'x'.repeat(185)}e\u0301` // 201 units, 200 after NFC
    expect(lintSummary(decomposed, 'en', { matcher: null, ...GERMANY_EN })).toEqual([])
  })

  it('reports every kind of violation in one summary', () => {
    const text = `On 8 August 2025, Germany took a historic step!${' x'.repeat(80)}`
    const vs = lintSummary(text, 'en', { matcher: REAL, ...GERMANY_EN })
    expect(kinds(vs)).toEqual(['banned-word', 'exclamation', 'length', 'actor-first'])
  })

  it('names the expected actor in the actor-first message', () => {
    const vs = lintSummary('On 8 August 2025, the government acted.', 'en', {
      matcher: null,
      ...GERMANY_EN,
    })
    expect(vs).toMatchObject([{ kind: 'actor-first', reason: 'date' }])
    expect(vs[0]?.message).toContain('"On 8 August 2025, …"')
    expect(vs[0]?.message).toContain('"Germany"')
  })
})

// ---------------------------------------------------------------------------------------------
// Actor-first heuristic

describe('checkActorFirst', () => {
  it.each([
    ['en', 'Germany voted in favour of the resolution.'],
    ['en', "Germany's foreign minister signed the joint statement."],
    ['en', 'The federal government suspended export licences.'],
    ['en', 'The Federal Chancellor stated that exports were suspended.'],
    ['en', 'Federal Chancellor Friedrich Merz announced the suspension.'],
    ['en', 'Friedrich Merz announced the suspension.'],
    ['en', 'the federal government suspended export licences.'],
    ['fr', "L'Allemagne a voté en faveur de la résolution."],
    ['fr', 'L’Allemagne a voté en faveur de la résolution.'],
    ['fr', 'Allemagne : le gouvernement a suspendu les licences.'],
    ['fr', 'Le chancelier fédéral a déclaré que les exportations étaient suspendues.'],
    ['fr', 'Friedrich Merz a annoncé la suspension.'],
  ] as const)('passes when the summary starts with a known actor (%s): %s', (lang, text) => {
    const names: ActorNames =
      lang === 'en'
        ? { countryName: 'Germany', actor: { label: 'federal government', name: 'Friedrich Merz' } }
        : GERMANY_FR
    expect(checkActorFirst(text, lang, names)).toBeNull()
  })

  it.each([
    ['en', 'Chancellor Friedrich Merz announced the suspension.'],
    ['en', 'A federal court ordered the suspension of the licences.'],
    ['en', 'Italy voted in favour.'],
    ['en', 'India abstained.'],
    ['en', 'Under-Secretary-General Tom Fletcher briefed the Council.'],
    ['en', 'Oman voted in favour.'],
    ['en', 'Jan Lipavský announced the suspension.'],
    ['en', 'Mid-level officials of the ministry announced the suspension.'],
    ['fr', 'Jan Lipavský a annoncé la suspension.'],
    ['fr', 'Le Premier ministre a annoncé la reconnaissance.'],
    ['fr', 'Les États-Unis ont opposé leur veto.'],
    ['fr', 'Aucun ministre ne s’est exprimé.'],
  ] as const)('passes an opening it cannot rule out (%s): %s', (lang, text) => {
    expect(checkActorFirst(text, lang)).toBeNull()
  })

  it.each([
    ['en', 'On 8 August 2025, the government suspended export licences.', 'date'],
    ['en', 'In 2024, the government suspended export licences.', 'date'],
    ['en', 'August 2025: the government suspended export licences.', 'date'],
    ['en', 'On Monday the government suspended export licences.', 'date'],
    ['en', 'Monday, the government suspended export licences.', 'date'],
    ['fr', 'Le 8 août 2025, le gouvernement a suspendu les licences.', 'date'],
    ['fr', 'Le 1er septembre, le gouvernement a suspendu les licences.', 'date'],
    ['fr', 'Le lundi 8 août, le gouvernement a suspendu les licences.', 'date'],
    ['fr', 'Août 2025 : le gouvernement a suspendu les licences.', 'date'],
    ['fr', 'En 2024, le gouvernement a suspendu les licences.', 'date'],
    ['en', 'after the vote, the government suspended export licences.', 'not-capital'],
    ['fr', 'après le vote, le gouvernement a suspendu les licences.', 'not-capital'],
    ['en', '(Germany) voted.', 'not-capital'],
    ['en', '2025: the government suspended export licences.', 'number'],
    ['en', '"We will not approve exports," the Chancellor said.', 'quotation'],
    ['en', '“We will not approve exports,” the Chancellor said.', 'quotation'],
    ['fr', '« Nous n’autoriserons pas d’exportations », a déclaré le chancelier.', 'quotation'],
    ['en', 'Following the vote, the government suspended export licences.', 'opener'],
    ['en', 'Despite the ruling, the government approved the exports.', 'opener'],
    ['en', 'It suspended export licences.', 'opener'],
    ['en', 'According to the ministry, exports were suspended.', 'opener'],
    ['fr', 'Selon le ministère, les exportations ont été suspendues.', 'opener'],
    ['fr', 'D’après le ministère, les exportations ont été suspendues.', 'opener'],
    ['fr', "Aujourd'hui, le gouvernement a suspendu les licences.", 'opener'],
    ['fr', 'Aujourd’hui, le gouvernement a suspendu les licences.', 'opener'],
    ['fr', 'Lorsqu’il a pris ses fonctions, le chancelier a suspendu les licences.', 'opener'],
    ['fr', 'Au Conseil de sécurité, l’Allemagne a voté pour.', 'opener'],
    ['fr', 'À la suite du vote, le gouvernement a suspendu les licences.', 'opener'],
    ['fr', 'Il a suspendu les licences.', 'opener'],
    ['en', 'Aug. 8, 2025: The Federal Chancellor suspended exports.', 'date'],
    ['en', 'Sept 8, 2025, the Federal Chancellor suspended exports.', 'date'],
    ['en', 'Mid-August 2025, the Federal Chancellor suspended exports.', 'date'],
    ['en', 'Late August, the Federal Chancellor suspended exports.', 'date'],
    ['en', 'Late on Friday the Federal Chancellor suspended exports.', 'opener'],
    ['en', 'Early in 2025, the Federal Chancellor suspended exports.', 'opener'],
    ['en', 'Two days later, the Federal Chancellor suspended exports.', 'date'],
    ['en', 'A week after the vote, the Federal Chancellor suspended exports.', 'date'],
    ['fr', 'Fin août 2025, le chancelier fédéral a suspendu les exportations.', 'date'],
    ['fr', 'Mi-août, le chancelier fédéral a suspendu les exportations.', 'date'],
    ['fr', 'Début 2025, le chancelier fédéral a suspendu les exportations.', 'date'],
    ['fr', 'Janv. 2025 : le chancelier fédéral a suspendu les exportations.', 'date'],
    ['fr', 'Deux jours plus tard, le chancelier fédéral a suspendu les exportations.', 'date'],
  ] as const)('fails (%s) %s → %s', (lang, text, reason) => {
    expect(checkActorFirst(text, lang, namesFor(lang))).toMatchObject({ reason })
  })

  it('compares the opener list per language', () => {
    // "En" opens a French sentence; "Le" is an article in French but not an EN opener.
    expect(checkActorFirst('En réponse, le gouvernement a suspendu les licences.', 'fr')).toEqual({
      reason: 'opener',
      start: 'En réponse, le gouvernement …',
    })
    expect(checkActorFirst('Lebanon voted in favour.', 'en')).toBeNull()
  })

  it('matches names as whole words', () => {
    // "Inde" is the actor; "Indépendamment" only starts with the same letters, and is judged by
    // the fallback (an uppercase word not on the opener list passes).
    expect(
      checkActorFirst('Inde : le gouvernement a voté pour.', 'fr', { countryName: 'Inde' }),
    ).toBeNull()
    expect(checkActorFirst('after India voted, …', 'en', { countryName: 'India' })).toMatchObject({
      reason: 'not-capital',
    })
    expect(checkActorFirst('indiana voted.', 'en', { countryName: 'India' })).toMatchObject({
      reason: 'not-capital',
    })
  })

  it('does not accept a name that is itself a date or an opener as the actor', () => {
    const names: ActorNames = { actor: { label: 'federal government', name: 'On 8 August 2025' } }
    expect(
      checkActorFirst('On 8 August 2025, the federal government suspended exports.', 'en', names),
    ).toMatchObject({ reason: 'date' })
    const opener: ActorNames = { actor: { label: 'According to the ministry' } }
    expect(
      checkActorFirst('According to the ministry, exports were suspended.', 'en', opener),
    ).toMatchObject({ reason: 'opener' })
    // A name that starts with a month word but holds no digit is still a name.
    expect(
      checkActorFirst('May Mansour announced the suspension.', 'en', {
        actor: { label: 'Minister', name: 'May Mansour' },
      }),
    ).toBeNull()
    // A lowercase label is still a name.
    expect(
      checkActorFirst('the federal government suspended exports.', 'en', {
        actor: { label: 'the federal government' },
      }),
    ).toBeNull()
  })

  it('ignores empty names', () => {
    expect(
      checkActorFirst('after the vote, …', 'en', { countryName: '', actor: { label: ' ' } }),
    ).toMatchObject({ reason: 'not-capital' })
  })
})
