/**
 * The methodology renderer (docs/05 §6): block contents in EN and FR, number typography,
 * determinism, and the marker handling of renderDoc.
 */
import { describe, expect, it } from 'vitest'
import type { Methodology } from '../load/methodology.js'
import { repoMethodology } from '../testing/harness.js'
import {
  compressIds,
  type DocLang,
  findMarkers,
  formatDate,
  formatNumber,
  GENERATED_BLOCKS,
  generatedPairs,
  renderBlock,
  renderDoc,
} from './render.js'

const NBSP = '\u00a0'
const NNBSP = '\u202f'

const m = repoMethodology()

/** The table row of `id` (first cell) in a rendered block. */
function row(md: string, id: string): string {
  const line = md.split('\n').find((l) => l.startsWith(`| ${id} |`))
  if (!line) throw new Error(`no row ${id}`)
  return line
}

/** The cells of a table row, trimmed. */
function cells(line: string): string[] {
  return line
    .split(/(?<!\\)\|/)
    .slice(1, -1)
    .map((c) => c.trim())
}

const doc = (...blocks: string[]) =>
  [
    '# Title',
    '',
    ...blocks.flatMap((b) => [`<!-- BEGIN generated:${b} -->`, `<!-- END generated:${b} -->`, '']),
  ].join('\n')

describe('formatNumber', () => {
  it('uses U+2212, an explicit plus on request, and per-language separators', () => {
    expect(formatNumber(-15, 'en')).toBe('−15')
    expect(formatNumber(10, 'en', { plus: true })).toBe('+10')
    expect(formatNumber(0, 'en', { plus: true })).toBe('0')
    expect(formatNumber(-0.00001, 'en', { decimals: 2 })).toBe('0.00')
    expect(formatNumber(100000000, 'en')).toBe('100,000,000')
    expect(formatNumber(100000000, 'fr')).toBe(`100${NNBSP}000${NNBSP}000`)
    expect(formatNumber(0.7, 'fr')).toBe('0,7')
    expect(formatNumber(1, 'en', { minDecimals: 1 })).toBe('1.0')
    expect(formatNumber(1, 'fr', { minDecimals: 1 })).toBe('1,0')
    expect(formatNumber(0.01, 'fr', { decimals: 4 })).toBe('0,0100')
    expect(formatNumber(1e-7, 'en')).toBe('0.0000001')
  })

  it('formats dates and collapses indicator runs', () => {
    expect(formatDate('2024-03-11', 'en')).toBe('11 March 2024')
    expect(formatDate('2024-03-11', 'fr')).toBe('11 mars 2024')
    expect(formatDate('2023-10-01', 'fr')).toBe('1er octobre 2023')
    expect(formatDate('not-a-date', 'en')).toBe('not-a-date')
    expect(compressIds(['B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'D1', 'D3', 'D4', 'D5'])).toBe(
      'B2–B5, C1, C2, D1, D3–D5',
    )
  })
})

describe('renderBlock: indicators', () => {
  const en = renderBlock(m, 'indicators', 'en')
  const fr = renderBlock(m, 'indicators', 'fr')

  it('has one section per category, in categories.yaml order, with its cap', () => {
    const headings = en.split('\n').filter((l) => l.startsWith('### '))
    expect(headings).toEqual([
      '### A. Arms & military (cap −45 / +30)',
      '### B. Diplomacy & international law (cap −40 / +45)',
      '### C. Trade & economy (cap −20 / +20)',
      '### D. Humanitarian (cap −15 / +25)',
      '### E. Domestic accountability (cap −10 / +10) · experimental · not scored',
    ])
    expect(fr).toContain('### A. Armes et coopération militaire (plafond −45 / +30)')
    expect(fr).toContain(
      '### E. Responsabilité interne (plafond −10 / +10) · expérimentale · non notée',
    )
  })

  it('lists all 34 indicators with the seven columns', () => {
    const rows = en.split('\n').filter((l) => /^\| [A-E]\d+ \|/.test(l))
    expect(rows).toHaveLength(34)
    for (const r of rows) expect(cells(r)).toHaveLength(7)
    expect(en).toContain(
      '| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |',
    )
    expect(fr).toContain(
      "| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Fréquence |",
    )
  })

  it('renders fixed points with an explicit sign (A6 +10, A3 −15)', () => {
    expect(cells(row(en, 'A6'))[2]).toBe('+10')
    expect(cells(row(en, 'A3'))[2]).toBe('−15')
    expect(cells(row(en, 'A6'))[3]).toBe('standing')
    expect(cells(row(fr, 'A6'))[3]).toBe('état durable')
  })

  it('renders per-instance points and the indicator cap (A5 −15, B9 +10)', () => {
    expect(cells(row(en, 'A5'))[2]).toBe('−5 per instance')
    expect(cells(row(en, 'A5'))[4]).toBe('cap −15')
    expect(cells(row(fr, 'A5'))[2]).toBe('−5 par cas')
    expect(cells(row(fr, 'A5'))[4]).toBe('plafond −15')
    expect(cells(row(en, 'B9'))[2]).toBe(
      'Formal call for ceasefire or end of blockade +2 / Names specific violations or uses a legal characterisation +5, per instance',
    )
    expect(cells(row(en, 'B9'))[4]).toBe('cap +10')
    expect(cells(row(en, 'B10'))[4]).toBe('cap −10')
  })

  it('renders tiers with their labels (B1 mixed sign, B12)', () => {
    expect(cells(row(en, 'B1'))[2]).toBe('Yes +3 / Abstain −2 / No −5 / Absent −2')
    expect(cells(row(fr, 'B1'))[2]).toBe('Pour +3 / Abstention −2 / Contre −5 / Absent −2')
    expect(cells(row(en, 'B12'))[2]).toBe(
      'Ambassador recalled +5 / Relations downgraded +8 / Relations severed +10',
    )
    expect(cells(row(en, 'B12'))[4]).toBe('only the largest holding tier counts')
    expect(cells(row(en, 'B11'))[4]).toBe('one event per tier, tiers add')
  })

  it('renders formula ranges (A1, D1) and the computed type', () => {
    expect(cells(row(en, 'A1'))[2]).toBe('−40 to 0 (formula a1)')
    expect(cells(row(fr, 'A1'))[2]).toBe('de −40 à 0 (formule a1)')
    expect(cells(row(en, 'D1'))[2]).toBe('0 to +12 (formula d1)')
    expect(cells(row(en, 'A1'))[3]).toBe('computed')
    expect(cells(row(fr, 'A1'))[3]).toBe('quantité calculée')
  })

  it('states stacking and supersede relations (A6 ← A7, B5/B6)', () => {
    expect(cells(row(en, 'A6'))[4]).toBe('superseded by A7')
    expect(cells(row(en, 'A7'))[4]).toBe('supersedes A6')
    expect(cells(row(fr, 'A6'))[4]).toBe('remplacé par A7')
    expect(cells(row(en, 'B5'))[4]).toBe('latest position of B5 and B6 holds')
    expect(cells(row(fr, 'B6'))[4]).toBe('la dernière position entre B5 et B6 prévaut')
    expect(cells(row(en, 'B1'))[4]).toBe('—')
  })

  it('links primary sources with a URL, joins them, and names the cadence', () => {
    expect(cells(row(en, 'A1'))[5]).toBe(
      '[SIPRI Arms Transfers Database](https://www.sipri.org/databases/armstransfers)',
    )
    expect(cells(row(en, 'A2'))[5]).toBe(
      'Israeli Tax Authority customs data; UN Comtrade; National licence registers; NGO investigations',
    )
    expect(cells(row(fr, 'A2'))[5]).toContain(`israélienne${NNBSP}; UN Comtrade`)
    expect(cells(row(en, 'A1'))[6]).toBe('Annual (March)')
    expect(cells(row(fr, 'B1'))[6]).toBe('À chaque vote')
  })

  it('escapes pipes and flattens line breaks in cells', () => {
    const copy = structuredClone(m)
    const a3 = copy.indicators.find((i) => i.id === 'A3')
    if (!a3) throw new Error('A3 missing')
    a3.name.en = 'F-35 | parts\nand maintenance'
    expect(row(renderBlock(copy, 'indicators', 'en'), 'A3')).toContain(
      '| F-35 \\| parts and maintenance |',
    )
  })
})

describe('renderBlock: other tables', () => {
  it('categories: cap and scored per category', () => {
    const en = renderBlock(m, 'categories', 'en')
    expect(en).toContain('| A. Arms & military | −45 / +30 | Yes |')
    expect(en).toContain('| E. Domestic accountability | −10 / +10 | No, experimental |')
    expect(renderBlock(m, 'categories', 'fr')).toContain(
      '| E. Responsabilité interne | −10 / +10 | Non, expérimentale |',
    )
  })

  it('bands: score ranges with signs', () => {
    const en = renderBlock(m, 'bands', 'en')
    expect(en).toContain('| Sustaining | −100 to −51 |')
    expect(en).toContain('| Passive | −20 to 0 |')
    expect(en).toContain('| Confronting | +41 to +100 |')
    expect(renderBlock(m, 'bands', 'fr')).toContain('| Soutien | de −100 à −51 |')
  })

  it('confidence: weights with a decimal point (EN) or comma (FR)', () => {
    expect(renderBlock(m, 'confidence', 'en')).toContain('| Confirmed | 1.0 |')
    expect(renderBlock(m, 'confidence', 'en')).toContain('| Corroborated | 0.7 |')
    expect(renderBlock(m, 'confidence', 'fr')).toContain('| Confirmé | 1,0 |')
    expect(renderBlock(m, 'confidence', 'fr')).toContain('| Corroboré | 0,7 |')
  })

  it('decay: built from the decay.yaml numbers', () => {
    const en = renderBlock(m, 'decay', 'en')
    expect(en).toContain('| 0 to 365 | 1 |')
    expect(en).toContain('| 366 to 730 | 1 − 0.75 × (Δ − 365) / 365, from 1 to 0.25 |')
    expect(en).toContain('| over 730, or before the event | 0 |')
    expect(renderBlock(m, 'decay', 'fr')).toContain(
      '| de 366 à 730 | 1 − 0,75 × (Δ − 365) / 365, de 1 à 0,25 |',
    )
    const copy = structuredClone(m)
    if (!copy.decay) throw new Error('decay missing')
    copy.decay.value.end_weight = 0.4
    copy.decay.value.end_days = 900
    expect(renderBlock(copy, 'decay', 'en')).toContain(
      '| 366 to 900 | 1 − 0.6 × (Δ − 365) / 535, from 1 to 0.4 |',
    )
  })

  it('thresholds: one table per formula, D1 in percent with four decimals', () => {
    const en = renderBlock(m, 'thresholds', 'en')
    const fr = renderBlock(m, 'thresholds', 'fr')
    expect(en.split('\n').filter((l) => l.startsWith('#### '))).toHaveLength(5)
    expect(en).toContain(
      "#### A1 (formula a1) — Major conventional arms delivered to Israel, scaled by share of Israel's imports",
    )
    expect(en).toContain('| 0 ≤ s ≤ 1 | −40 × √s, rounded to one decimal |')
    expect(en).toContain('| Before 11 March 2024 | No data |')
    expect(en).toContain(`| x ≥ 0.0100${NBSP}% | +12 |`)
    expect(en).toContain(`| x ≥ 0.0005${NBSP}% | +3 |`)
    expect(en).toContain('| x > 0 | +1 |')
    expect(en).toContain('| x = 0 | 0 |')
    expect(fr).toContain(`| x ≥ 0,0100${NNBSP}% | +12 |`)
    expect(fr).toContain('| Avant le 11 mars 2024 | Pas de données |')
  })

  it('thresholds: integer USD with separators, TIV as integers, the C3 ratio gate', () => {
    const en = renderBlock(m, 'thresholds', 'en')
    const fr = renderBlock(m, 'thresholds', 'fr')
    expect(en).toContain(`| V ≥ 100,000,000${NBSP}USD | −25 |`)
    expect(en).toContain(`| V < 100,000${NBSP}USD | 0 |`)
    expect(fr).toContain(`| V ≥ 100${NNBSP}000${NNBSP}000${NBSP}USD | −25 |`)
    expect(en).toContain('| TIV ≥ 500 | −15 |')
    expect(en).toContain('| TIV > 0 | −2 |')
    expect(en).toContain('| r < 0.9 (r = T ÷ T(2022)) | 0 |')
    expect(en).toContain(`| r ≥ 0.9 and T ≥ 10,000,000,000${NBSP}USD | −8 |`)
    expect(fr).toContain(`| r ≥ 0,9 et T < 10${NNBSP}000${NNBSP}000${NBSP}USD | 0 |`)
  })

  it('thresholds: an unordered tier list falls back to "Otherwise"', () => {
    const copy = structuredClone(m)
    const a2 = copy.thresholds?.value.formulas.a2
    if (a2?.kind !== 'tiers') throw new Error('a2 missing')
    a2.tiers.reverse()
    expect(renderBlock(copy, 'thresholds', 'en')).toContain('| Otherwise | 0 |')
  })

  it('passivity: the constants, with qualifying ranges collapsed', () => {
    const en = renderBlock(m, 'passivity', 'en')
    expect(en).toContain('| Penalty | 15 points |')
    expect(en).toContain('| Window | 365 days, up to and including t |')
    expect(en).toContain('| Qualifying indicators | B2–B12, C1–C6, D1–D5 |')
    expect(en).toContain('| Minimum absolute contribution | 2 |')
    expect(en).toContain('| Excluded: A1–A8 |')
    expect(en).toContain('| Sensitivity values | 5, 15 and 25 points |')
    const fr = renderBlock(m, 'passivity', 'fr')
    expect(fr).toContain(`| Exclus${NBSP}: B1 |`)
    expect(fr).toContain('| Valeurs de sensibilité | 5, 15 et 25 points |')
  })

  it('symmetry: one row per pair, then negatives without counterpart', () => {
    const en = renderBlock(m, 'symmetry', 'en')
    const pairs = m.symmetry?.value.pairs.length ?? 0
    expect(en.split('\n')).toHaveLength(2 + pairs)
    expect(en).toContain('| B1 no/abstain | B1 yes | same indicator |')
    expect(en).toContain('| A1 deliveries | A7 embargo | — |')
    const copy = structuredClone(m)
    copy.symmetry?.value.no_counterpart.push({
      indicator: 'C2',
      reason: { en: 'Test reason.', fr: 'Raison de test.' },
    })
    expect(renderBlock(copy, 'symmetry', 'fr')).toContain('| C2 | Aucun | Raison de test. |')
  })

  it('votes: one sentence while the list is empty, a table once filled', () => {
    expect(renderBlock(m, 'votes', 'en')).toBe(
      'No qualifying votes are listed yet; the list is filled once each vote is verified.',
    )
    expect(renderBlock(m, 'votes', 'fr')).toBe(
      `Aucun vote retenu ne figure encore dans la liste${NNBSP}; elle est remplie une fois chaque vote vérifié.`,
    )
    const copy = structuredClone(m)
    copy.votes?.value.votes.push({
      symbol: 'A/RES/ES-10/99',
      kind: 'resolution',
      date: '2024-01-01',
      title: { en: 'Test title', fr: 'Titre de test' },
      subject: 'unrwa',
      counts: { yes: 1500, no: 10, abstain: 3 },
      source: 'src_20240101_un-press_test',
      quote: 'Test quote',
      locator: 'paragraph 1',
      rationale: { en: 'Test rationale.', fr: 'Justification de test.' },
    })
    expect(renderBlock(copy, 'votes', 'en')).toBe(
      [
        '| Symbol | Date | Subject | Yes–no–abstain | Rationale |',
        '|---|---|---|---|---|',
        '| A/RES/ES-10/99 | 1 January 2024 | UNRWA | 1,500–10–3 | Test rationale. |',
      ].join('\n'),
    )
    expect(renderBlock(copy, 'votes', 'fr')).toContain(
      `| A/RES/ES-10/99 | 1er janvier 2024 | UNRWA | 1${NNBSP}500–10–3 | Justification de test. |`,
    )
  })
})

describe('renderBlock: typography and robustness', () => {
  const all = (lang: DocLang) => GENERATED_BLOCKS.map((b) => renderBlock(m, b, lang)).join('\n')

  it('never writes an ASCII hyphen as a minus sign', () => {
    for (const lang of ['en', 'fr'] as const) expect(all(lang)).not.toMatch(/(^|[\s(|/])-\d/m)
  })

  it('puts no ordinary space before : ; ? ! in French', () => {
    expect(all('fr')).not.toMatch(/ [:;?!]/)
    // Section references copied from the YAML (docs/02 §12.4) keep their point.
    expect(all('fr')).not.toMatch(/(?<![v§])\b\d+\.\d/)
  })

  it('is deterministic', () => {
    for (const b of GENERATED_BLOCKS) {
      expect(renderBlock(repoMethodology(), b, 'fr')).toBe(renderBlock(m, b, 'fr'))
    }
  })

  it('returns an empty string when the YAML it needs did not load', () => {
    const broken: Methodology = {
      ...structuredClone(m),
      indicatorsFile: null,
      indicators: [],
      categories: null,
      bands: null,
      confidence: null,
      decay: null,
      passivity: null,
      thresholds: null,
      votes: null,
      symmetry: null,
    }
    for (const b of GENERATED_BLOCKS) expect(renderBlock(broken, b, 'en')).toBe('')
  })
})

describe('renderDoc', () => {
  it('fills every known block with a blank line after BEGIN and before END', () => {
    const out = renderDoc(doc('bands', 'votes'), m, 'en')
    expect(out).toBe(
      [
        '# Title',
        '',
        '<!-- BEGIN generated:bands -->',
        '',
        renderBlock(m, 'bands', 'en'),
        '',
        '<!-- END generated:bands -->',
        '',
        '<!-- BEGIN generated:votes -->',
        '',
        renderBlock(m, 'votes', 'en'),
        '',
        '<!-- END generated:votes -->',
        '',
      ].join('\n'),
    )
  })

  it('is idempotent, on a synthetic text and on the repository documents', () => {
    const once = renderDoc(doc(...GENERATED_BLOCKS), m, 'fr')
    expect(renderDoc(once, m, 'fr')).toBe(once)
    for (const lang of ['en', 'fr'] as const) {
      const text = m.docs[lang]?.text ?? ''
      const rendered = renderDoc(text, m, lang)
      expect(renderDoc(rendered, m, lang)).toBe(rendered)
    }
  })

  it('replaces stale content between the markers and keeps the text around them', () => {
    const text =
      'before\n<!-- BEGIN generated:votes -->\nold table\n<!-- END generated:votes -->\nafter'
    expect(renderDoc(text, m, 'en')).toBe(
      `before\n<!-- BEGIN generated:votes -->\n\n${renderBlock(m, 'votes', 'en')}\n\n<!-- END generated:votes -->\nafter`,
    )
  })

  it('leaves unknown names, unbalanced markers and END-before-BEGIN untouched', () => {
    const unknown = '<!-- BEGIN generated:foo -->\nx\n<!-- END generated:foo -->'
    expect(renderDoc(unknown, m, 'en')).toBe(unknown)
    const unbalanced = '<!-- BEGIN generated:bands -->\nx\n'
    expect(renderDoc(unbalanced, m, 'en')).toBe(unbalanced)
    const reversed = '<!-- END generated:bands -->\nx\n<!-- BEGIN generated:bands -->'
    expect(renderDoc(reversed, m, 'en')).toBe(reversed)
    const nested =
      '<!-- BEGIN generated:bands -->\n<!-- BEGIN generated:votes -->\n<!-- END generated:votes -->\n<!-- END generated:bands -->'
    const out = renderDoc(nested, m, 'en')
    expect(out).toContain(renderBlock(m, 'votes', 'en'))
    expect(out).not.toContain(renderBlock(m, 'bands', 'en'))
  })

  it('writes LF line endings', () => {
    const crlf = doc('categories').replace(/\n/g, '\r\n')
    const out = renderDoc(crlf, m, 'en')
    expect(out).not.toContain('\r')
    expect(out).toBe(renderDoc(doc('categories'), m, 'en'))
  })

  it('finds markers with their 1-based lines and pairs only well-formed ones', () => {
    const markers = findMarkers(
      'a\n<!-- BEGIN generated:bands -->\n  <!--END generated:bands-->  \n<!-- END generated:votes -->',
    )
    expect(markers).toEqual([
      { kind: 'BEGIN', name: 'bands', line: 2 },
      { kind: 'END', name: 'bands', line: 3 },
      { kind: 'END', name: 'votes', line: 4 },
    ])
    expect(generatedPairs(markers)).toEqual([{ name: 'bands', begin: 2, end: 3 }])
  })
})
