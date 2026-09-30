/**
 * Importers on small synthetic files in the shapes described in docs/06 §2 (test data, not real
 * records). The real exports are checked against these shapes when they are first imported (P-14).
 */
import { describe, expect, it } from 'vitest'
import { foldName, iso3ForName, NAMED_ISO3 } from '../names.js'
import { OBSERVER_ISO3, UN_MEMBER_ISO3, UNIVERSE_ISO3 } from '../universe.js'
import { importDeliveries, importOrders, looseCsv } from './sipri.js'
import {
  normaliseDate,
  normaliseVote,
  parseVotesCsv,
  parseVotesFile,
  parseVotesMarcXml,
  votesImport,
} from './unvotes.js'

const SRC = 'src_20260927_undl_ga-voting'

describe('universe and names', () => {
  it('lists 193 members and 2 observers, without duplicates', () => {
    expect(UN_MEMBER_ISO3).toHaveLength(193)
    expect(new Set(UN_MEMBER_ISO3).size).toBe(193)
    expect(OBSERVER_ISO3).toEqual(['VAT', 'PSE'])
    expect(UNIVERSE_ISO3.size).toBe(195)
  })

  it('names every universe entry, and nothing else', () => {
    expect([...NAMED_ISO3].sort()).toEqual([...UNIVERSE_ISO3].sort())
  })

  it('matches names without case, accents or punctuation', () => {
    expect(iso3ForName('TÜRKIYE')).toBe('TUR')
    expect(iso3ForName("Côte d'Ivoire")).toBe('CIV')
    expect(iso3ForName('Korea, South')).toBe('KOR')
    expect(iso3ForName('United Kingdom')).toBe('GBR')
    expect(iso3ForName('Atlantis')).toBeUndefined()
    expect(foldName('  Bosnia-Herzegovina ')).toBe('bosnia herzegovina')
  })
})

describe('UN votes', () => {
  // The header of the UN Digital Library bulk file (record 4060887) as read on 2026-09-28: the
  // file of 31 March 2025 (corr. 1, archived) and the file of 6 February 2026, which adds
  // `vote_note` after `subjects`. Non-voting is `X` in `ms_vote`.
  it('reads the real bulk header and rows (2026 layout)', () => {
    const csv = [
      'undl_id,ms_code,ms_name,ms_vote,date,session,resolution,draft,committee_report,meeting,title,agenda_title,subjects,vote_note,total_yes,total_no,total_abstentions,total_non_voting,total_ms,undl_link',
      '4025240,AFG,AFGHANISTAN,Y,2023-10-27,ES-10,A/RES/ES-10/21,A/ES-10/L.25,,A/ES-10/PV.41,Protection of civilians and upholding legal and humanitarian obligations : resolution / adopted by the General Assembly,Illegal Israeli actions,TERRITORIES OCCUPIED BY ISRAEL--SETTLEMENT POLICY,,120.0,14.0,45.0,14.0,193.0,https://digitallibrary.un.org/record/4025240',
      '4025240,BEN,BENIN,X,2023-10-27,ES-10,A/RES/ES-10/21,A/ES-10/L.25,,A/ES-10/PV.41,Protection of civilians and upholding legal and humanitarian obligations : resolution / adopted by the General Assembly,Illegal Israeli actions,TERRITORIES OCCUPIED BY ISRAEL--SETTLEMENT POLICY,,120.0,14.0,45.0,14.0,193.0,https://digitallibrary.un.org/record/4025240',
    ].join('\n')
    expect(parseVotesCsv(csv, 'bulk.csv').votes).toEqual([
      { symbol: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'AFG', vote: 'Y' },
      { symbol: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'BEN', vote: 'X' },
    ])
  })

  it('reads a real MARCXML voting record: 967 $a is a number, $c the code, no $d for non-voting', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<collection xmlns="http://www.loc.gov/MARC21/slim">
<record>
  <controlfield tag="001">4025240</controlfield>
  <datafield tag="269" ind1=" " ind2=" ">
    <subfield code="a">2023-10-27</subfield>
  </datafield>
  <datafield tag="791" ind1=" " ind2=" ">
    <subfield code="a">A/RES/ES-10/21</subfield>
    <subfield code="b">A/</subfield>
    <subfield code="c">10emsp</subfield>
  </datafield>
  <datafield tag="967" ind1=" " ind2=" ">
    <subfield code="a">2</subfield>
    <subfield code="c">ALB</subfield>
    <subfield code="d">A</subfield>
    <subfield code="e">ALBANIA</subfield>
  </datafield>
  <datafield tag="967" ind1=" " ind2=" ">
    <subfield code="a">19</subfield>
    <subfield code="c">BEN</subfield>
    <subfield code="e">BENIN</subfield>
  </datafield>
</record>
</collection>`
    expect(parseVotesFile(xml, 'rec.xml').votes).toEqual([
      { symbol: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'ALB', vote: 'A' },
      { symbol: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'BEN', vote: 'X' },
    ])
  })

  const qualifying = [
    { symbol: 'A/RES/ES-10/21', date: '2023-10-27', counts: { yes: 2, no: 1, abstain: 1 } },
    { symbol: 'A/RES/ES-10/22', date: '2023-12-12', counts: { yes: 1, no: 0, abstain: 0 } },
  ]
  const members = ['DEU', 'FRA', 'USA', 'HUN', 'IRL']

  it('normalises votes and dates', () => {
    expect(
      ['Y', 'yes', 'N', 'No', 'A', 'abstain', '', 'X', 'Non-voting'].map(normaliseVote),
    ).toEqual(['Y', 'Y', 'N', 'N', 'A', 'A', 'X', 'X', 'X'])
    expect(() => normaliseVote('maybe')).toThrow(/unknown vote/)
    expect(normaliseDate('2023-10-27T00:00:00')).toBe('2023-10-27')
    expect(normaliseDate('20231027')).toBe('2023-10-27')
    expect(normaliseDate('')).toBeNull()
  })

  it('reads the bulk CSV by column name and keeps only qualifying votes', () => {
    const csv = [
      'undl_id,ms_code,ms_name,ms_vote,date,session,resolution',
      '1,DEU,GERMANY,A,2023-10-27,ES-10,A/RES/ES-10/21',
      '1,FRA,FRANCE,Y,2023-10-27,ES-10,A/RES/ES-10/21',
      '1,USA,UNITED STATES,N,2023-10-27,ES-10,A/RES/ES-10/21',
      '1,HUN,HUNGARY,,2023-10-27,ES-10,A/RES/ES-10/21',
      '1,ISR,ISRAEL,N,2023-10-27,ES-10,A/RES/ES-10/21',
      '2,DEU,GERMANY,Y,2023-06-01,77,A/RES/77/999',
    ].join('\n')
    const parsed = parseVotesCsv(csv, 'bulk.csv')
    const r = votesImport(parsed, qualifying, members, UNIVERSE_ISO3, SRC)
    expect(r.rows).toEqual([
      { resolution: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'DEU', vote: 'A', source: SRC },
      { resolution: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'FRA', vote: 'Y', source: SRC },
      { resolution: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'USA', vote: 'N', source: SRC },
      { resolution: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'HUN', vote: 'X', source: SRC },
      { resolution: 'A/RES/ES-10/21', date: '2023-10-27', iso3: 'ISR', vote: 'N', source: SRC },
    ])
    expect(r.absentSymbols).toEqual(['A/RES/ES-10/22'])
    expect([...r.missingMembers]).toEqual([['A/RES/ES-10/21', ['IRL']]])
    // file: 1 yes, 2 no (USA, ISR), 1 abstain, 1 X; votes.yaml says 2–1–1
    expect(r.countMismatches).toEqual(['A/RES/ES-10/21: file 1–2–1 (1 X), votes.yaml 2–1–1'])
  })

  it('refuses a CSV whose header it does not know, listing the header', () => {
    expect(() => parseVotesCsv('a,b,c\n1,2,3', 'x.csv')).toThrow(/header is "a,b,c"/)
  })

  it('reads a MARCXML voting record', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><collection xmlns="http://www.loc.gov/MARC21/slim"><record>
      <datafield tag="791" ind1=" " ind2=" "><subfield code="a">A/RES/ES-10/22</subfield></datafield>
      <datafield tag="269" ind1=" " ind2=" "><subfield code="a">2023-12-12</subfield></datafield>
      <datafield tag="967" ind1=" " ind2=" "><subfield code="a">031</subfield><subfield code="c">IRL</subfield><subfield code="d">Y</subfield><subfield code="e">IRELAND</subfield></datafield>
      <datafield tag="967" ind1=" " ind2=" "><subfield code="a">032</subfield><subfield code="d"></subfield><subfield code="e">C&#212;TE D'IVOIRE</subfield></datafield>
    </record></collection>`
    const parsed = parseVotesFile(xml, 'rec.xml')
    expect(parsed.votes).toEqual([
      { symbol: 'A/RES/ES-10/22', date: '2023-12-12', iso3: 'IRL', vote: 'Y' },
      { symbol: 'A/RES/ES-10/22', date: '2023-12-12', iso3: 'CIV', vote: 'X' },
    ])
    expect(() => parseVotesMarcXml('<collection><record></record></collection>', 'x.xml')).toThrow(
      /not a voting record/,
    )
  })

  it('reports dates that differ from votes.yaml and writes the votes.yaml date', () => {
    const parsed = parseVotesCsv(
      'resolution,ms_code,ms_vote,date\nA/RES/ES-10/22,IRL,Y,2023-12-13',
      'x.csv',
    )
    const r = votesImport(parsed, qualifying, ['IRL'], UNIVERSE_ISO3, SRC)
    expect(r.rows[0]?.date).toBe('2023-12-12')
    expect(r.dateMismatches).toEqual(['A/RES/ES-10/22: file 2023-12-13, votes.yaml 2023-12-12'])
  })
})

describe('SIPRI', () => {
  const deliveries = [
    'TIV of arms imports to Israel, 2022-2025',
    'Generated: 2026-03-09',
    '',
    ',2022,2023,2024,2025,Total',
    'United States,500,700.5,800,600,2600.5',
    'Germany,100,150,200,,450',
    'Italy,,,4.5,5,9.5',
    'Unknown supplier(s),,10,,,10',
    'Total,600,860.5,1004.5,605,3070',
  ].join('\n')

  it('reads the TIV table: one row per supplier and year with deliveries, the Total row as total', () => {
    const r = importDeliveries(deliveries, 'tiv.csv', '2026-03-09', SRC)
    expect(r.years).toEqual([2022, 2023, 2024, 2025])
    expect(r.summedTotals).toBe(false)
    expect(
      r.rows.map((x) => [x.supplier_iso3, x.data_year, x.tiv_to_israel, x.tiv_total_to_israel]),
    ).toEqual([
      ['USA', 2022, 500, 600],
      ['USA', 2023, 700.5, 860.5],
      ['USA', 2024, 800, 1004.5],
      ['USA', 2025, 600, 605],
      ['DEU', 2022, 100, 600],
      ['DEU', 2023, 150, 860.5],
      ['DEU', 2024, 200, 1004.5],
      ['ITA', 2024, 4.5, 1004.5],
      ['ITA', 2025, 5, 605],
    ])
    expect(r.unknownSupplierTiv.get(2023)).toBe(10)
    expect(r.rows.every((x) => x.release_date === '2026-03-09' && x.source === SRC)).toBe(true)
  })

  it('sums the columns when there is no Total row, and names unknown suppliers', () => {
    const r = importDeliveries(
      ',2024,2025\nGermany,1,2\nAtlantis,3,4',
      'tiv.csv',
      '2026-03-09',
      SRC,
    )
    expect(r.summedTotals).toBe(true)
    // 2024 total = 1 + 3 (the unknown name still counts in the total)
    expect(r.rows[0]).toMatchObject({
      supplier_iso3: 'DEU',
      data_year: 2024,
      tiv_total_to_israel: 4,
    })
    expect(r.unknownNames).toEqual(['Atlantis'])
  })

  it('sums the trade register orders placed with Israel per recipient and year', () => {
    const register = [
      'Trade register',
      'Recipient,Supplier,Year of order,,Number ordered,,Weapon designation,Weapon description,Number delivered,,Year(s) of delivery,status,Comments,SIPRI TIV per unit,SIPRI TIV for total order,SIPRI TIV of delivered weapons',
      'India,Israel,2024,,10,,X-1,UAV,0,,,,,5,50,0',
      'India,Israel,2024,,1,,X-2,SAM,0,,,,,100,100,0',
      'India,Israel,2023,,2,,X-3,radar,2,,2024,,,10,20,20',
      'Azerbaijan,Israel,(2025),,4,,X-4,UAV,0,,,,,2.5,10,0',
      'India,France,2024,,36,,Rafale,FGA,0,,,,,50,1800,0',
    ].join('\n')
    const r = importOrders(register, 'register.csv', '2026-03-09', SRC)
    expect(r.rows.map((x) => [x.buyer_iso3, x.data_year, x.tiv_new_orders_from_israel])).toEqual([
      ['IND', 2024, 150],
      ['IND', 2023, 20],
      ['AZE', 2025, 10],
    ])
    expect(r.uncertainYears).toEqual(['Azerbaijan (2025)'])
  })

  // Excerpts of the exports of the SIPRI interface read on 2026-09-28 (armstransfers.sipri.org,
  // "Import/Export values", recipient Israel by supplier, 2022–2025; "Transfer register",
  // supplier Israel): title lines, header and rows as the site writes them, fewer rows.
  const REAL_TIV = [
    'Volume of transfers of major arms',
    'Figures are in millions of SIPRI trend-indicator values (TIVs).',
    "A '0' indicates that the volume of deliveries is between 0 and 0.5 million SIPRI TIV. An empty field indicates that no deliveries have been identified.",
    'Figures may not add up to stated totals due to the conventions of rounding.',
    'For the method used for the SIPRI TIV see <https://www.sipri.org/databases/armstransfers/sources-and-methods>.',
    '',
    'Source: SIPRI Arms Transfers Database (c) SIPRI.',
    'Data generated: 28 Sep 2026 9:10:08 AM',
    '',
    'Supplier,2022,2023,2024,2025,2022-2025,Percentage,Sum total years,Percentage of total',
    'United States,430,459,186,490,1565,63%,1565,63%',
    'Germany,398,399,35,36,867,35%,867,35%',
    'Italy,6,6,16,11,38,1.5%,38,1.5%',
    'Total exports to Israel,833,863,237,537,2470,100%,2470,',
    '',
  ].join('\n')

  it('reads the real TIV export: "Total exports to Israel" is the total row', () => {
    const r = importDeliveries(REAL_TIV, 'tiv.csv', '2026-03-09', SRC)
    expect(r.years).toEqual([2022, 2023, 2024, 2025])
    expect(r.unknownNames).toEqual([])
    expect(r.summedTotals).toBe(false)
    expect(
      r.rows
        .filter((x) => x.data_year === 2025)
        .map((x) => [x.supplier_iso3, x.tiv_to_israel, x.tiv_total_to_israel]),
    ).toEqual([
      ['USA', 490, 537],
      ['DEU', 36, 537],
      ['ITA', 11, 537],
    ])
  })

  it('reads the real trade register: the "?" of an uncertain order year sits in its own column', () => {
    const register = [
      "Transfers of major conventional arms from Israel   to All countries . Deals with deliveries made for the year range 'Not specified' to 'Not specified' ",
      "A '?' in a column indicates uncertain data. The 'Deliveries in the Year Range' and the 'Year(s) of deliveries' refer only to deliveries in the selected year(s).",
      'SIPRI trend-indicator values (TIVs) are in millions.',
      '',
      'Source: SIPRI Arms Transfers Database (c) SIPRI.',
      'Data generated: 28 Sep 2026 9:10:31 AM',
      'Recipient,Supplier,Year of order, ,Number ordered, ,Weapon designation,Weapon description,Deliveries in the Year Range, ,Year(s) of delivery,status,Comments,SIPRI TIV per unit,SIPRI TIV for total order,SIPRI TIV of delivered weapons',
      'African Union**,Israel,2017,,3,,Aerostar,reconnaissance drone,3,?,2018,New,For use by AU peacekeeping forces in Somalia; financed by USA,0.1,0.3,0.3',
      'Angola,Israel,2004,?,8,?,Bell-212,helicopter,8,?,2004; 2005,Second hand,Second-hand,1.48,11.84,11.84',
      'Angola,Israel,2015,,4,,Super Dvora,patrol boat,4,?,2016,New,Super Dvora Mk-3 version,5.25,21,21',
    ].join('\n')
    const r = importOrders(register, 'register.csv', '2026-03-09', SRC)
    expect(r.rows.map((x) => [x.buyer_iso3, x.data_year, x.tiv_new_orders_from_israel])).toEqual([
      ['AGO', 2004, 11.84],
      ['AGO', 2015, 21],
    ])
    expect(r.nonState).toEqual(['African Union**'])
    expect(r.unknownNames).toEqual([])
    expect(r.uncertainYears).toEqual(['Angola 2004?'])
  })

  it('reads quoted and semicolon-separated CSV', () => {
    expect(looseCsv('a;"b;c";"say ""x"""\n1;2;3')).toEqual([
      ['a', 'b;c', 'say "x"'],
      ['1', '2', '3'],
    ])
  })
})
