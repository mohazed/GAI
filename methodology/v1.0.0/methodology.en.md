# Methodology

Version 1.0.0-rc.1 · draft · scores not yet displayed (scorecard mode)

## Purpose and standpoint

The Gaza Accountability Index scores the conduct of states regarding Gaza since 7 October 2023 on one scale, from −100 to +100. Every point comes from a dated action backed by archived sources; full weight requires a primary document. The score describes conduct. It is not a legal finding.

The index is not a court. The site never applies a legal characterisation to a government or an act in its own words; it shows the conduct and the documents, and a quote that contains a legal characterisation is attributed to its speaker. The index scores the action of governments, never populations. It is not complete: where a country publishes nothing, the site shows a gap, not a zero.

The index was started by Mohamed Zouad, who maintains it and signs it. His view is that the response of most governments has been inadequate. The project does not claim neutrality. It claims that the method is published, versioned and reproducible, so that this view cannot enter the numbers. The full statement is on the [About](/en/about) page.

## The scale

Scores run from −100 to +100 on one scale, with the same rules for every scored country. Zero is not a neutral position: it lies in the Passive band, and the Acting band starts at +1. A country that has done nothing sits below zero, because of the passivity penalty described under Silence is negative.

### Bands

Five bands divide the scale. Each band is a range of the displayed integer score.

<!-- BEGIN generated:bands -->

| Band | Score | Meaning | Illustrative conduct |
|---|---|---|---|
| Sustaining | −100 to −51 | Materially enabling the military campaign | Major arms supplier, active political shielding at the UN, sanctions on the ICC |
| Enabling | −50 to −21 | Contributing without leading | Components in the supply chain, trade as usual, abstains on ceasefire votes, defunded UNRWA |
| Passive | −20 to 0 | Silence or gestures only | No arms trade but no measures either; votes yes at the UN and does nothing else |
| Acting | +1 to +40 | Concrete measures with a cost | Suspended licences, restored and increased aid, formal statements naming violations, recognised Palestine |
| Confronting | +41 to +100 | Sustained action across several fronts | Full arms embargo, joined or intervened in the ICJ case, sanctions on officials, trade restrictions, led coalitions |

<!-- END generated:bands -->

### Display rounding

All arithmetic uses full precision. The score is displayed rounded half away from zero to an integer: −13.5 is displayed as −14 and +0.5 as +1. The band is read from the displayed integer, not from the unrounded score, so a score of +0.4 is displayed as 0 in the Passive band and a score of +0.5 as +1 in the Acting band. The published data carries both values: `score` to one decimal and `score_display` as an integer.

### Categories and caps

Indicators are grouped in five categories. Each category has a negative cap and a positive cap: negative points are capped so that one arms deal cannot outweigh everything else, and positive points are capped so that statements cannot offset munitions. A category's subtotal is clipped to its caps before the categories are added.

<!-- BEGIN generated:categories -->

| Category | Cap | Scored |
|---|---|---|
| A. Arms & military | −45 / +30 | Yes |
| B. Diplomacy & international law | −40 / +45 | Yes |
| C. Trade & economy | −20 / +20 | Yes |
| D. Humanitarian | −15 / +25 | Yes |
| E. Domestic accountability | −10 / +10 | No, experimental |

<!-- END generated:categories -->

### Category E is experimental

Category E (domestic accountability) is recorded and displayed, labelled experimental, and not scored in version 1.0. Its subtotal is computed with its cap of −10 to +10 and shown on the country page; it is never added to the score. Scoring it requires a new methodology version.

### Universe and exclusions

The index scores 193 entities: the UN member states other than Israel, and the Holy See, a non-member observer state. Israel and Palestine are not scored. The scale measures the conduct of third states; Israel is a party to the conflict and Palestine is the affected party, so neither can be placed on it. Neither has a country page in version 1. Palestine's status as a non-member observer state is noted on the [About](/en/about) page.

Countries are identified by their ISO 3166-1 alpha-3 code and named in English and French with the short names of the UN terminology database (UNTERM). Regions follow the UN M49 regions and sub-regions. Country pages list membership of the UN Security Council (permanent members and elected terms), the EU, NATO, the Arab League, the OIC, the G20, the G7 and BRICS.

### Scope: Gaza scored, Lebanon and the West Bank tagged

Version 1 scores conduct related to Gaza. Every event carries one or more scope tags: `gaza`, `lebanon`, `west-bank`, `region` or `related`. An event enters the score only when one of its tags is `gaza`. Conduct related to Lebanon, the West Bank and the wider region is recorded and tagged from the start, and enters the score only through a methodology version 2.0. Acts that belong to a separate proceeding, such as joining another case before the International Court of Justice, are tagged `related` and are not scored.

The index scores states. Companies appear only as they are named in the public documents it cites.

### Scorecard mode

The score is computed at every build from the first release. Its display is controlled by one switch. Until the author turns it on, the site shows scorecards: events, sources, coverage, and category subtotals as counts, with no score and no ranking; the ranking page lists countries in alphabetical order with their number of events. Version 1.0.0-rc.1 is in scorecard mode. Facts with sources are published first; the composite number follows once those facts have been open to public checking.

## Rules

Three rules define the scale. Two further rules govern statements and research.

### Conduct, not promises

Announcing a review scores nothing; a suspended licence scores. Points come from decisions, laws, votes, deliveries, funding and formal acts that are on the record. Indicator C1 scores a formal review of a trade or association agreement, not an announcement that one may be opened. A statement scores only when it is formal, is on the official record and meets the definition of indicator B9 or B10.

### Silence is negative

A country with no qualifying event in categories B, C or D in the past 365 days receives the passivity penalty: 15 points are subtracted from its score. A country with no event at all therefore scores −15, not 0. UN General Assembly votes (B1) do not qualify: whichever way a country votes, its votes do not end the penalty. The methodology treats inaction, at the scale of harm in Gaza, as a choice. The penalty is described under Passivity below. The sensitivity tables, which show its effect on the ranking, are computed at every build and published once scores are displayed.

### Material weight beats symbolic weight

Selling munitions costs more points than a statement earns. Arms deliveries alone can reach −40 (A1), and a full two-way arms embargo earns +25 (A7); all formal statements together are capped at +10 (B9) and −10 (B10). The points, the caps and the weights are public and listed in the indicator table.

### Statements are scored, with caps

Formal statements are scored: +2 or +5 for a statement that calls for a ceasefire or names violations (B9), −5 for a statement that declares unconditional support or denies documented violations (B10), with indicator caps of +10 and −10. Without them, states with no arms trade and modest aid budgets would have few ways to score above zero; the caps keep words below deeds. A statement counts only with the exact quote, the speaker, the date and the official transcript or the official video with a timestamp. A paraphrase in the press is not enough. Statements by spokespersons are not scored, and posts on social media are not scored unless an official transcript exists.

### Same protocol for every country

Every country is researched with the same protocol, which spends the same effort on positive and negative indicators and records what was checked when nothing is found. Event summaries follow one template, `{Actor} {past-tense verb} {object}{, qualifier}.`, with no adjectives; a check at every build rejects summaries that contain a word from the published list `banned-words.txt` or an exclamation mark, that exceed 200 characters, or that do not start with the actor. Positive and negative events use the same layout. The summary line of every country card is generated from the same template.

## Indicator table

The index uses 34 indicators in five categories. The 31 indicators of categories A to D are scored; the 3 indicators of category E are recorded and shown, and not scored in version 1.0. Each row gives the points, the event type, the indicator-level cap and stacking rule, the primary sources and the cadence; the evidence rules are listed under each category's table. Names and point values follow the indicator table of the project specification, with the definitions below.

<!-- BEGIN generated:indicators -->

### A. Arms & military (cap −45 / +30)

| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |
|---|---|---|---|---|---|---|
| A1 | Major conventional arms delivered to Israel, scaled by share of Israel's imports | −40 to 0 (formula a1) | computed | — | [SIPRI Arms Transfers Database](https://www.sipri.org/databases/armstransfers) | Annual (March) |
| A2 | Ammunition, components, dual-use military goods exported (HS 93, 8710, 8802, 8526) | −25 to 0 (formula a2) | computed | — | Israeli Tax Authority customs data; UN Comtrade; National licence registers; NGO investigations | Quarterly |
| A3 | Participation in the F-35 supply chain | −15 | standing | — | UN Special Rapporteur reports; Lockheed supplier disclosures | On change |
| A4 | Arms purchased from Israel (new contracts since Oct 2023) | −15 to 0 (formula a4) | computed | — | SIPRI; National procurement notices | Annual |
| A5 | Military cooperation: joint exercises, intelligence sharing, basing, weapons transit via ports or airspace | −5 per instance | repeatable | cap −15 | Defence ministry releases; Investigative journalism | On event |
| A6 | Export licences suspended (partial) | +10 | standing | superseded by A7 | Government decision; Official gazette | On event |
| A7 | Full two-way arms embargo in force | +25 | standing | supersedes A6 | Law or decree | On event |
| A8 | Transit denied to arms shipments (ports, airspace, flagged vessels) | +5 per instance | repeatable | cap +10 | Port authority; Government statement | On event |

**Evidence rules**

- **A1** — Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Each row of `data/structured/sipri_deliveries.csv` cites a dataset source that archives the SIPRI release.
- **A2** — Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Values come from the country's own reporting to UN Comtrade; if absent or confidential, from Israel's mirror import data by origin; if both are absent, A2 is no-data, never zero. Headings 8526 and 8802 enter only with a licence register, a parliamentary answer or a published investigation citing the customs code. Each row of `data/structured/comtrade_a2.csv` cites a dataset source that archives the origin.
- **A3** — A document establishing that the country's companies are Tier-1 or Tier-2 suppliers of parts or maintenance for the F-35 programme: official programme documents, national ministry statements, or the UN Special Rapporteur's reports. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **A4** — Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Each row of `data/structured/sipri_orders.csv` cites a dataset source that archives the SIPRI release.
- **A5** — One confirmed instance per event: a named exercise, a documented transit (port call, overflight authorisation), a public basing agreement, or an official confirmation of intelligence sharing related to the Gaza campaign. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **A6** — The government decision or official gazette entry suspending or refusing a class of licences to Israel, or the court order with the same effect. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **A7** — The law or decree, covering both exports to and imports from Israel. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **A8** — A port authority decision or a government statement denying the transit. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.

### B. Diplomacy & international law (cap −40 / +45)

| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |
|---|---|---|---|---|---|---|
| B1 | UN General Assembly votes on Gaza ceasefire, UNRWA, Palestine status | Yes +3 / Abstain −2 / No −5 / Absent −2 | repeatable | — | [UN Digital Library voting records](https://digitallibrary.un.org) | Per vote |
| B2 | UN Security Council veto of a ceasefire resolution (members only) | −20 | repeatable | — | UNSC records | Per vote |
| B3 | ICJ genocide case: declaration of intervention filed | +15 | standing | — | ICJ press releases | On event |
| B4 | Formal position rejecting or opposing ICJ provisional measures | −15 | repeatable | — | Government statement | On event |
| B5 | ICC: public commitment to execute arrest warrants | +8 | standing | latest position of B5 and B6 holds | Government statement | On event |
| B6 | ICC: stated refusal to execute warrants, or hosting a wanted official | −10 | standing | latest position of B5 and B6 holds | Government statement; Visit records | On event |
| B7 | Sanctions on ICC judges or prosecutors | −20 | standing | — | Official sanctions list | On event |
| B8 | Recognition of the State of Palestine after Oct 2023 | Recognised after 2023-10-07 +8 / Pre-existing recognition +3 | standing | only the largest holding tier counts | Foreign ministry | On event |
| B9 | Head of government or foreign minister formally names violations, calls for ceasefire or an end to the blockade | Formal call for ceasefire or end of blockade +2 / Names specific violations or uses a legal characterisation +5, per instance | repeatable | cap +10 | Official transcript | On event |
| B10 | Head of government declares unconditional support or denies documented violations | −5 per instance | repeatable | cap −10 | Official transcript | On event |
| B11 | Sanctions on Israeli ministers or settler entities | Sanctions on Israeli ministers +10 / Sanctions on settler entities +5 | standing | one event per tier, tiers add | Official sanctions list | On event |
| B12 | Ambassador recalled / relations downgraded / severed | Ambassador recalled +5 / Relations downgraded +8 / Relations severed +10 | standing | only the largest holding tier counts | Foreign ministry | On event |

**Evidence rules**

- **B1** — Generated from `data/structured/unga_votes.csv`, filtered by `votes.yaml`; never hand-authored. Each vote row cites a dataset source that archives the UN voting record, and each qualifying vote in `votes.yaml` cites the archived UN press release as its official source.
- **B2** — Generated from `data/structured/unsc_vetoes.csv` (rows with `ceasefire: true`); never hand-authored. Each row cites a dataset source that archives the Security Council record of the vote, such as the UN veto list or the meeting record.
- **B3** — The declaration of intervention as registered by the ICJ, and its text: the direction of its argument decides B3 versus B4. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B4** — The official statement or formal act, or the text of the declaration of intervention arguing against the applicant's construction; a press remark without a formal act does not qualify. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B5** — An official statement by the head of government, foreign or justice minister on executing the 21 November 2024 warrants; an overflight authorisation without a stated position on the warrants is a lead. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B6** — An official statement by the head of government, foreign or justice minister on the warrants, the official record of a visit by a person under warrant hosted without arrest, or the official record of the withdrawal from the Rome Statute; an overflight authorisation without a stated position on the warrants is a lead. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B7** — The official sanctions list. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B8** — Generated from `recognises_palestine.since` in `data/countries.yaml`; never hand-authored. The recognition date recorded there comes from the foreign ministry's announcement.
- **B9** — The exact quote, the speaker, the date and the official transcript or official video with timestamp; paraphrases in press are not enough. The event carries `actor.name` and cites a source of kind official or official-video; the quote appears verbatim in `archive/text/{source}.txt` after normalisation (whitespace, Unicode NFC, invisible characters), including for a video, whose transcript is stored there. Same speaker, same day: one event. The speaker is the head of government or the foreign minister; statements by spokespersons do not score.
- **B10** — The exact quote, the speaker, the date and the official transcript or official video with timestamp; paraphrases in press are not enough. The event carries `actor.name` and cites a source of kind official or official-video; the quote appears verbatim in `archive/text/{source}.txt` after normalisation (whitespace, Unicode NFC, invisible characters), including for a video, whose transcript is stored there. Same speaker, same day: one event. The speaker is the head of government; statements by spokespersons do not score.
- **B11** — The official sanctions list. An EU-level listing counts only for a member state that voted for it. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **B12** — The foreign ministry's announcement. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.

### C. Trade & economy (cap −20 / +20)

| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |
|---|---|---|---|---|---|---|
| C1 | Trade or association agreement suspended or formally reviewed | Formal review +4 / Suspension +10 | standing | only the largest holding tier counts | Government or EU decision | On event |
| C2 | New trade, investment or cooperation agreement signed with Israel since Oct 2023 | −10 | standing | — | Treaty registers; Ministry releases | On event |
| C3 | Bilateral trade with Israel continued at or above pre-war level | −8 to 0 (formula c3) | computed | — | UN Comtrade; IMF DOTS | Annual |
| C4 | Ban on settlement goods (labelling alone +2) | Labelling alone +2 / Ban on settlement goods +5 | standing | only the largest holding tier counts | Customs regulation | On event |
| C5 | Sovereign fund or public pension divestment from named companies | +5 | repeatable | — | Fund ethics council decisions | On event |
| C6 | Public procurement exclusion of implicated companies | +3 | repeatable | — | Procurement rules | On event |

**Evidence rules**

- **C1** — The government or EU decision; for an EU-level decision, the official minutes or ministerial statements recording the state's support in the Council. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **C2** — The signed agreement, from a treaty register or a ministry release. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **C3** — Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Values come from the country's own reporting, else from Israel's mirror data. Each row of `data/structured/comtrade_c3.csv` cites a dataset source that archives the origin.
- **C4** — The customs regulation. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **C5** — The decision of the fund or central bank, one event per decision batch. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **C6** — The procurement rule providing the exclusion. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.

### D. Humanitarian (cap −15 / +25)

| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |
|---|---|---|---|---|---|---|
| D1 | Humanitarian funding to the Gaza response, scaled per capita of GNI | 0 to +12 (formula d1) | computed | — | [OCHA Financial Tracking Service API](https://fts.unocha.org) | Monthly |
| D2 | UNRWA funding suspended | −10 | standing | — | UNRWA donor tables | On event |
| D3 | UNRWA funding restored / increased above 2022 level | Funding restored +5 / Funding increased above the 2022 level +8 | standing | only the largest holding tier counts | UNRWA donor tables | On event |
| D4 | Medical evacuations hosted, field hospitals deployed | +5 | repeatable | — | WHO; Health ministry | On event |
| D5 | Visa or refugee pathway opened for Gazans | +5 | repeatable | — | Immigration regulations | On event |

**Evidence rules**

- **D1** — Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Rows of `data/structured/fts_funding.csv` (FTS, donor organisation type Government) and `data/structured/gni.csv` (World Bank Atlas) cite dataset sources that archive the API responses.
- **D2** — The government announcement of the suspension, or UNRWA donor tables; the event ends on the announced resumption. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **D3** — UNRWA donor tables; the increased tier requires the annual contribution to exceed the 2022 contribution in nominal USD in those tables. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **D4** — A WHO or health ministry document on the programme, one event per programme. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **D5** — The immigration regulation, one event per legal instrument. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.

### E. Domestic accountability (cap −10 / +10) · experimental · not scored

| ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence |
|---|---|---|---|---|---|---|
| E1 | Domestic investigation or prosecution of nationals or companies for conduct in Gaza | +5 | repeatable | — | Prosecutor announcements; Court filings | On event |
| E2 | Bans on Palestine solidarity protests or symbols | −5 | repeatable | — | Interior ministry decrees; Court rulings | On event |
| E3 | Universal-jurisdiction complaints accepted for investigation | +5 | repeatable | — | Court records | On event |

**Evidence rules**

- **E1** — A prosecutor announcement or court filing. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **E2** — The interior ministry decree or court ruling. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.
- **E3** — The court record accepting the complaint for investigation. Evidence is a primary document (official record, government release, court filing, dataset row). Without one, an event can score only at confidence corroborated or reported, at reduced weight.

<!-- END generated:indicators -->

### Indicator-level caps and stacking rules

Some indicators have their own cap, or a rule on how their events combine. These rules apply to the indicator's summed contributions before the category cap.

| Indicator | Rule |
|---|---|
| A5 military cooperation | −5 per confirmed instance; the sum is capped at −15 |
| A6 and A7 arms export measures | A7 (full two-way embargo, +25) supersedes A6 (partial suspension, +10) for the same country; the two do not add |
| A8 transit denied | +5 per instance; the sum is capped at +10 |
| B1 UN General Assembly votes | no indicator cap; the category cap applies |
| B5 and B6 ICC arrest warrants | the latest formal position of the country holds; B5 and B6 do not add |
| B8 recognition of Palestine | one standing state: +8 for a recognition after 7 October 2023, otherwise +3 for a recognition that predates it, held from 7 October 2023 |
| B9 formal statements | +2 or +5 per statement; the sum is capped at +10 |
| B10 unconditional support or denial | −5 per statement; the sum is capped at −10 |
| B11 sanctions | sanctions on ministers (+10) and on settler entities (+5) are separate standing states; both can hold |
| B12 diplomatic relations | one standing state: the most severe current measure counts (ambassador recalled +5, relations downgraded +8, relations severed +10); the measures do not add |
| C1 trade or association agreement | review (+4) and suspension (+10) do not add; suspension supersedes review |
| C4 settlement goods | labelling (+2) and ban (+5) do not add; the ban supersedes labelling |
| D3 UNRWA funding | restored (+5) and increased (+8) do not add; increased supersedes restored |

### Definitions per indicator

- **A1 and A4** use SIPRI trend-indicator values (TIV) from the annual release of the SIPRI Arms Transfers Database. A4 counts only contracts signed on or after 7 October 2023: new orders, not deliveries of orders placed before the war. Both are computed (see Computed indicators).
- **A2** counts HS chapter 93 (arms and ammunition) and HS heading 8710 (tanks and armoured vehicles) in full. HS headings 8526 (radar and remote-control apparatus) and 8802 (aircraft) count only when a licence register, a parliamentary answer or a published investigation citing the customs code confirms that the flow is military, because both headings are mostly civil goods.
- **A3** is a standing state for countries whose companies are documented Tier-1 or Tier-2 suppliers of parts or maintenance for the F-35 programme in official programme documents, national ministry statements or reports of the UN Special Rapporteur. It carries −15 while it holds. A judicial or governmental halt of F-35 part exports to Israel ends the standing state and is, separately, an A6 event.
- **A5** counts confirmed instances only: a named exercise, a documented transit (port call, overflight authorisation), a public basing agreement, or an official confirmation of intelligence sharing related to the military campaign in Gaza. Routine NATO or bilateral arrangements that predate the war are not instances unless they are activated for the campaign.
- **A6** is any government decision that suspends or refuses a class of export licences to Israel, or a court order with the same effect. It holds until the suspension is lifted.
- **A7** is a law or decree that covers both arms exports to Israel and arms imports from Israel.
- **B1** counts plenary UN General Assembly votes; see Qualifying UN General Assembly votes below.
- **B2** counts any veto, by any permanent member, of a draft Security Council resolution whose operative paragraphs call for a ceasefire or a humanitarian truce or pause, at −20 per veto. Vetoes of drafts on other subjects, such as Palestine's UN membership (18 April 2024), and vetoes of amendments are recorded and not scored. B2 is not applicable to states that were not on the Security Council at any point since 7 October 2023.
- **B3** counts an intervention filed under Article 62 or 63 of the Statute of the International Court of Justice (ICJ) in case 192 (South Africa v. Israel, under the Genocide Convention), from the date the Court registers it, only when the declaration's stated construction of the Convention supports the applicant's reading or the Court's provisional-measures orders (obligations to prevent, scope of intent, binding character of the orders). It is a standing state; a withdrawal ends it on the withdrawal date. A declaration that argues for a narrower reading against the applicant is a B4 event, not a B3 event. Joining a separate case is tagged `related` and not scored.
- **B4** requires an official statement rejecting the ICJ's provisional-measures orders or their binding character, a formal act to that effect, or a declaration of intervention filed against the applicant's construction (see B3). Criticism of the merits of the case in a press remark, without a formal act, is not a B4 event.
- **B5 and B6** concern the arrest warrants issued by the International Criminal Court on 21 November 2024. B5 is an official statement by the head of government or the foreign or justice minister committing to execute them. B6 is a stated refusal to execute them, hosting a person under warrant on an official visit without arrest, or a withdrawal from the Rome Statute since 7 October 2023. Authorising an overflight is a lead, not an event, unless it comes with a stated position on the warrants. B5 and B6 are standing states that replace each other in time: the latest formal position holds.
- **B7** is a standing state while sanctions on ICC judges or prosecutors are in force.
- **B8** is a standing state for recognition of the State of Palestine: +8 for a recognition after 7 October 2023, +3 for a recognition that predates it.
- **B9** requires a formal statement by the head of government or the foreign minister, with the exact quote, the speaker, the date and the official transcript or official video with a timestamp: +2 for a formal call for a ceasefire or for an end to the blockade; +5 when the statement names specific violations (for example starvation as a method of warfare, attacks on hospitals, forced displacement) or uses a legal characterisation. Statements by the same speaker on the same day are one event.
- **B10** requires a statement by the head of government declaring unconditional support or denying documented violations, with the same evidence as B9, at −5 per statement. Statements by the same speaker on the same day are one event.
- **B11** counts sanctions listings by the country itself or, for EU member states, EU-level listings the state voted for. A state that blocked an EU listing has no B11 event; the block is recorded as a note and not scored.
- **B12** is a standing state; the most severe current measure counts.
- **C1** counts a suspension or a formal review of a trade or association agreement with Israel. For EU member states, an EU-level review or suspension of the Association Agreement counts for every member state that supported it in the Council, as recorded in official minutes or ministerial statements; states that opposed it have no C1 event.
- **C2** is a standing state for a new trade, investment or cooperation agreement signed with Israel on or after 7 October 2023.
- **C3** uses total goods trade with Israel (exports plus imports) over the trailing 12 months, compared with calendar year 2022 (see Computed indicators).
- **C4** is a standing state for a ban on settlement goods (+5) or a labelling requirement alone (+2).
- **C5** counts decisions by a sovereign fund, a public pension fund or a central bank to exclude companies over their conduct in Gaza or the occupied territories, one event per decision batch.
- **C6** counts public procurement rules or decisions with legal effect that exclude implicated companies.
- **D1** is computed from OCHA Financial Tracking Service data (see Computed indicators).
- **D2** is a standing state from the announcement of a suspension of UNRWA funding to the announced resumption.
- **D3** applies from the date funding resumes; "increased" means the annual contribution exceeds the 2022 contribution in nominal US dollars, per the UNRWA donor tables.
- **D4** counts one event per programme (a field hospital deployment, a medical evacuation programme), not per patient.
- **D5** counts one event per legal instrument that opens a visa or refugee pathway for people from Gaza.
- **E1 to E3** are recorded with the points listed in the table and excluded from the score in version 1.0.

### Qualifying UN General Assembly votes

B1 counts plenary resolutions and decisions of the UN General Assembly adopted by recorded vote on or after 7 October 2023 whose subject is Gaza (ceasefire, truce, humanitarian access), UNRWA, or the status and rights of Palestine. A decision adopted by recorded vote counts as a resolution does; the endorsement of the New York Declaration on 12 September 2025 was adopted as decision A/DEC/80/506. Committee votes, procedural votes and votes on amendments are excluded. Each vote scores yes +3, abstention −2, no −5 and absent −2; a formal "did not participate" counts as absent. Each qualifying vote is listed with its symbol, date, subject and a one-line reason for inclusion, and adding a vote to the list is a new minor version. The list below is filled from `votes.yaml` and is empty until the votes are verified against the UN records.

<!-- BEGIN generated:votes -->

No qualifying votes are listed yet; the list is filled once each vote is verified.

<!-- END generated:votes -->

## Formula

The score is a sum of capped category subtotals, recomputed for every date from the event table, with a published formula and no manual overrides.

$$
\begin{aligned}
\mathrm{sub}_k(c,t) &= \sum_{e \in E_k(c)} p_e \cdot w_e \cdot d_e(t) \qquad \text{(after indicator-level caps)} \\
\mathrm{clip}_k(c,t) &= \mathrm{clip}\big(\mathrm{sub}_k(c,t),\ \mathrm{cap}_k^{-},\ \mathrm{cap}_k^{+}\big) \qquad k \in \{A, B, C, D\} \\
\mathrm{raw}(c,t) &= \sum_{k \in \{A, B, C, D\}} \mathrm{clip}_k(c,t) - \mathrm{passivity}(c,t) \\
S(c,t) &= \mathrm{clip}\big(\mathrm{raw}(c,t),\ -100,\ +100\big)
\end{aligned}
$$

Here c is the country and t the date. E_k(c) is the set of published events of country c in category k with the scope tag `gaza`. For each event e, p_e is its points, w_e its confidence weight and d_e(t) its time factor: the decay d for a repeatable event, and 1 or 0 for a standing state or a computed quantity depending on whether it holds at t. clip(x, a, b) bounds x between a and b. cap_k⁻ and cap_k⁺ are the category caps. passivity(c,t) is 15 when the passivity penalty applies and 0 otherwise.

In plain language: each event contributes its points multiplied by its confidence weight and by its time factor. The contributions are added per indicator, and the indicator-level caps and stacking rules are applied. The indicator totals are added per category, and each category total is clipped to its caps. The clipped totals of categories A to D are added, and the passivity penalty is subtracted when it applies. The result is clipped to the range −100 to +100. Category E is computed the same way with its cap of −10 to +10 and shown on the country page; it is never summed into the score.

### Worked example

This example is illustrative. The country is hypothetical and the numbers are not data. All events are at confidence confirmed (weight 1.0). Figures are shown to one decimal; the computation uses full precision.

| Category | Contributions | Subtotal after cap |
|---|---|---|
| A | A1 −22.0 (s = 0.3025, −40 × √0.3025), A3 −15, A6 +10 | −27 (within −45) |
| B | B1 +3, +3 and −2 × 0.8007 (decay, 462 days after the vote) = −1.6; B10 −5; B5 +8 | +7.4 |
| C | C3 −5 | −5 |
| D | D1 +6; D2 ended, 0; D3 +5 | +11 |
| E | none | not summed |

The country has qualifying events in the past 365 days, so no passivity penalty applies. raw = −27 + 7.4 − 5 + 11 = −13.6. S = −13.6, displayed as −14, in the Passive band.

### User-adjustable weights

Readers can set a weight w_k between 0 and 2 for each of the categories A to D; the default is 1. Weights multiply each category's capped subtotal. Events do not change.

$$
S_{\text{user}}(c,t) = \mathrm{clip}\Big(\sum_{k \in \{A, B, C, D\}} w_k \cdot \mathrm{clip}_k(c,t) - \mathrm{passivity}(c,t),\ -100,\ +100\Big), \qquad w_k \in [0, 2]
$$

The result is computed in the reader's browser from the capped subtotals and the passivity flag published for every country. The link to a weighted view encodes the weights as `?w=A,B,C,D`, with one decimal per value.

## Event types and decay

Each indicator has one event type, and each event takes the type of its indicator.

- **Standing state.** Contributes its points multiplied by its confidence weight on every date from its start date up to, but not including, its end date. An event with no end date still holds. Standing: A3, A6, A7, B3, B5, B6, B7, B8, B11, B12, C1, C2, C4, D2, D3.
- **Repeatable event.** Contributes its points multiplied by its confidence weight and by the decay d(Δ), where Δ is the number of whole days between the event date and the date t. Repeatable: A5, A8, B1, B2, B4, B9, B10, C5, C6, D4, D5, E1, E2, E3.
- **Computed quantity.** Behaves as a standing state that starts on the release date of the source data and ends on the next release date. Its points are the output of the formula. Computed: A1, A2, A4, C3, D1.

The decay d is 1 for the first 365 days after the event, falls linearly to 0.25 at 730 days, and is 0 after 730 days and before the event date. A 2023 vote therefore weighs less than a 2026 vote. An event past 730 days stays on the country page and in the data; it no longer contributes to the score.

<!-- BEGIN generated:decay -->

| Δ (days) | d(Δ) |
|---|---|
| 0 to 365 | 1 |
| 366 to 730 | 1 − 0.75 × (Δ − 365) / 365, from 1 to 0.25 |
| over 730, or before the event | 0 |

<!-- END generated:decay -->

Only events with the status `published` contribute. A retracted event contributes 0 on every date, including past dates: the history is recomputed, and the corrections log records what changed. The site is rebuilt every night, so decay and the passivity window move forward even when no event has changed.

## Confidence

Each event has one confidence level. Its weight multiplies the event's points.

<!-- BEGIN generated:confidence -->

| Level | Weight | Rule |
|---|---|---|
| Confirmed | 1.0 | At least one source of kind official, court, or dataset. |
| Corroborated | 0.7 | Two independent ngo or press sources that name the underlying document. |
| Reported | 0.4 | One credible ngo or press source; flagged on the country page. |
| Disputed | 0.4 | An official denial is on record (a reply or an official source) and counter-evidence exists; both sides linked. |

<!-- END generated:confidence -->

- **Confirmed** requires at least one source of kind official, court or dataset. The validator rejects a confirmed event without one. A press article can never be the only support of a confirmed event.
- **Corroborated** requires two independent NGO or press sources, from distinct publishers, that name the underlying document.
- **Reported** rests on one credible NGO or press source. The event card carries a one-line notice.
- **Disputed** applies when an official denial is on record, in a reply or an official source, and counter-evidence exists. Both are linked from the event card, which carries a one-line notice. An event contested through the right of reply is disputed until it is resolved.

### Evidence and sources

- Evidence is a primary document: an official release, a gazette, a court filing, an official transcript or video, or a dataset row. Without one, an event can score only at confidence corroborated or reported, at reduced weight. NGO and press reports not used in this way are leads until a primary document is found.
- Every source that supports a published event has an archived copy: a Wayback Machine snapshot, the SHA-256 hash of the archived bytes, the retrieval timestamp and the byte count; a dataset row relies on the archived copy of its dataset. The repository stores these and an extracted plain-text copy, not the documents. A source whose capture failed is kept, marked as such, and cannot support a published event until it is archived. If a snapshot disappears, the hash and the extract remain, and the source is marked "archive unavailable", not removed.
- Every piece of evidence has the supporting passage, quoted verbatim from the extracted text in the original language, with a locator (page, paragraph, row or video timestamp). A translation is shown beside the original, never instead of it.
- For a statement, the source is the transcript or the official video, not an article about it.
- The event date is the date of the act (decision, vote, statement, delivery), not the date of the article that reports it.

Leads never score; a country page can note that a matter is under investigation. Every draft event is read a second time, independently, against the archived text, and the verdict of that second reading is recorded before review. Events move from draft to reviewed to published; only published events score.

## Computed indicators

Five indicators are computed from datasets and never typed in by hand: A1, A2, A4, C3 and D1. Each is recomputed when its source publishes a new release and holds until the next release. The formula output and the raw rows can be downloaded from the [Data](/en/data) page. The votes of B1, the vetoes of B2 and the recognition states of B8 are also generated, from the UN voting records, a table of Security Council vetoes and the recognition dates in the country list.

### A1 — major arms delivered to Israel

For each SIPRI release, published in March of year Y+1 with data through year Y, s = TIV(country → Israel, year Y) ÷ TIV(all suppliers → Israel, year Y). Points = −40 × √s, rounded to one decimal. The value holds from the release's publication date to the next release's publication date. Before the first release after 7 October 2023 (March 2024), A1 is no-data for every country. The square root keeps secondary suppliers visible: on a linear scale a supplier with a 1 % share would score −0.4; with the root it scores −4, while the largest supplier stays near the bottom of the range.

### A4 — arms purchased from Israel

From the same SIPRI release: a new order placed with Israel in year Y with a TIV above 0 scores by tier of TIV. Only contracts signed on or after 7 October 2023 count.

### A2 — military exports in customs data

V is the value of exports to Israel over the trailing 12 months under HS chapter 93 and heading 8710, plus headings 8526 and 8802 when the flow is confirmed as military (see Definitions per indicator). The source is the country's own reporting to UN Comtrade; if that is absent or confidential, Israel's mirror import data by country of origin; if both are absent, A2 is no-data. Points by tier of V. The value is recomputed at each annual or quarterly Comtrade release and holds until the next.

### C3 — trade as usual

T is the total of goods exports and imports with Israel over the trailing 12 months, from the country's own reporting, or else from mirror data. r = T ÷ T(2022). If r is at least 0.9, points by tier of T; if r is below 0.9, 0. A drop in trade is not rewarded here; only a decision is, through C1. A rise is not penalised beyond the tier.

### D1 — humanitarian funding

F is the total of paid and committed contributions from the country's government (donor organisation type "Government") to the OCHA-tracked flash appeals for the occupied Palestinian territory (oPt) and to the oPt pooled fund over the trailing 12 months, as recorded by the OCHA Financial Tracking Service (FTS). x = F ÷ GNI, where GNI is the country's total gross national income, not GNI per capita, from the World Bank (Atlas method, current US dollars, latest available year). Points by tier of x. Zero is a real zero, because FTS is the reference for government humanitarian funding; some bilateral and in-kind aid is not reported to FTS, and D4 and D5 capture part of it (see Known limitations). The value is recomputed monthly and holds for one month.

### Thresholds and tiers

The scale factor of A1 and the tiers of A2, A4, C3 and D1:

<!-- BEGIN generated:thresholds -->

#### A1 (formula a1) — Major conventional arms delivered to Israel, scaled by share of Israel's imports

| Condition | Points |
|---|---|
| 0 ≤ s ≤ 1 | −40 × √s, rounded to one decimal |
| Before 11 March 2024 | No data |

#### A2 (formula a2) — Ammunition, components, dual-use military goods exported (HS 93, 8710, 8802, 8526)

| Condition | Points |
|---|---|
| V ≥ 100,000,000 USD | −25 |
| V ≥ 10,000,000 USD | −15 |
| V ≥ 1,000,000 USD | −8 |
| V ≥ 100,000 USD | −3 |
| V < 100,000 USD | 0 |

#### A4 (formula a4) — Arms purchased from Israel (new contracts since Oct 2023)

| Condition | Points |
|---|---|
| TIV ≥ 500 | −15 |
| TIV ≥ 100 | −10 |
| TIV ≥ 10 | −5 |
| TIV > 0 | −2 |
| TIV = 0 | 0 |

#### C3 (formula c3) — Bilateral trade with Israel continued at or above pre-war level

| Condition | Points |
|---|---|
| r < 0.9 (r = T ÷ T(2022)) | 0 |
| r ≥ 0.9 and T ≥ 10,000,000,000 USD | −8 |
| r ≥ 0.9 and T ≥ 1,000,000,000 USD | −5 |
| r ≥ 0.9 and T ≥ 100,000,000 USD | −3 |
| r ≥ 0.9 and T ≥ 10,000,000 USD | −2 |
| r ≥ 0.9 and T < 10,000,000 USD | 0 |

#### D1 (formula d1) — Humanitarian funding to the Gaza response, scaled per capita of GNI

| Condition | Points |
|---|---|
| x ≥ 0.0100 % | +12 |
| x ≥ 0.0050 % | +9 |
| x ≥ 0.0020 % | +6 |
| x ≥ 0.0005 % | +3 |
| x > 0 | +1 |
| x = 0 | 0 |

<!-- END generated:thresholds -->

## Passivity

A country receives a passivity penalty of 15 points at date t when it has no qualifying event in the trailing 365 days. A qualifying event is a published event on an indicator in B2 to B12, C1 to C6 or D1 to D5, dated in the 365 days up to and including t, whose current weighted contribution is at least 2 in absolute value.

- B1 votes do not qualify: UN General Assembly votes, whichever way they are cast, do not end the passivity penalty.
- D1 funding below the +3 tier does not qualify, because its contribution is below 2.
- Category A never qualifies. Selling or refusing arms is not the kind of engagement the penalty measures, and events on A6 to A8 almost always come with events in categories B or C.
- Category E does not qualify, because it is not scored.

The penalty is how the rule "silence is negative" is applied. Only the passivity penalty applies to a country with no data at all. The ranking with the penalty at 5, 15 and 25 points is the first sensitivity table; like the others, it is computed at every build and published once scores are displayed.

<!-- BEGIN generated:passivity -->

| Parameter | Value |
|---|---|
| Penalty | 15 points |
| Window | 365 days, up to and including t |
| Qualifying indicators | B2–B12, C1–C6, D1–D5 |
| Minimum absolute contribution | 2 |
| Event statuses | `published` |
| Excluded: B1 | B1 votes do not qualify: spec §2 describes a country that votes yes at the UN and does nothing else as Passive. |
| Excluded: A1–A8 | Category A never qualifies: selling or refusing arms is not the kind of engagement the penalty measures, and A6–A8 events almost always come with B or C events anyway. |
| Excluded: E1–E3 | Category E is experimental and unscored in v1.0. |
| Sensitivity values | 5, 15 and 25 points |

<!-- END generated:passivity -->

## Coverage

Coverage is computed over the 31 scored indicators. Each country has one assessment status per indicator; a status of none-found or no-data carries the date checked and a note or the search queries used:

- `has-events`: at least one published event (set by the build).
- `none-found`: checked, nothing found.
- `no-data`: the data needed to assess the indicator is not published.
- `not-applicable`: the indicator cannot apply. This is automatic only for B2, for states that were not on the Security Council at any point since 7 October 2023; no other indicator is automatically not applicable.
- `unchecked`: not yet researched.

$$
\text{applicable} = 31 - n_{\text{not-applicable}}, \qquad \text{coverage} = \frac{n_{\text{has-events}} + n_{\text{none-found}}}{\text{applicable}}
$$

The coverage bar sits next to every score. Filled segments are indicators with events or with nothing found; hatched segments are indicators with no data; empty segments are unchecked indicators. The country page lists, for every indicator, what was checked and when.

### No data is not zero

When a country has no data on A1 or A2, its card shows "no export data", never a zero. A country that publishes nothing is not scored as if it had exported nothing: only the passivity penalty applies to a country with no data at all. This keeps a lack of published data from being read as an absence of conduct.

An unchecked indicator is a build warning. A country with unchecked indicators can be published only in scorecard mode, and scores are not displayed while any published country has an unchecked indicator.

## Sensitivity tables

Five sensitivity tables show how the ranking changes when one parameter changes. Each gives the full ranking under the alternative setting and the Spearman rank correlation with the default ranking. The tables are computed at every build and published once scores are displayed.

1. Passivity penalty at 5, 15 and 25 points.
2. Each category weight (A, B, C, D) at 0.5 and at 1.5, with the others at 1.
3. Weight of reported events at 0.2 and at 0.6.
4. Statements excluded: B9 and B10 contribute 0.
5. Decay off: d = 1 for every repeatable event.

In scorecard mode the tables are not displayed, because each of them contains a ranking.

## Symmetry table

For each negative indicator, the symmetry table names its positive counterpart, or states why none exists. A check at every build fails if the table is missing or incomplete. Positive and negative events use the same layout on every page.

<!-- BEGIN generated:symmetry -->

| Negative | Positive counterpart | Note |
|---|---|---|
| A1 deliveries | A7 embargo | — |
| A2 components | A6 partial suspension | — |
| A3 F-35 | A6 (halt of F-35 parts) | — |
| A4 purchases from Israel | A7 (two-way embargo) | — |
| A5 cooperation | A8 transit denied | — |
| B1 no/abstain | B1 yes | same indicator |
| B2 veto | B3 intervention | both are legal-institutional acts |
| B4 rejects ICJ | B3 | — |
| B6 refuses ICC | B5 executes ICC | — |
| B7 sanctions ICC | B5 | — |
| B10 denial | B9 naming | — |
| C2 new agreement | C1 suspension | — |
| C3 trade as usual | C1, C4 | — |
| D2 UNRWA cut | D3 UNRWA restored | — |
| E2 protest bans | E1 investigations | experimental |

<!-- END generated:symmetry -->

## Versioning and changelog

Methodology versions follow semantic versioning.

- Major: changes to the scale, the categories or the universe of scored countries. Extending the scored scope to Lebanon or the West Bank is version 2.0.
- Minor: changes to indicators, points or thresholds, and changes to the list of qualifying votes. Adding a resolution to that list is a minor version, because it changes scores.
- Patch: changes of wording.

Each version is a complete, self-contained folder `methodology/vX.Y.Z/` in the public repository. Every score carries the version that produced it. A new version recomputes the whole history. When a version is superseded, its last outputs are frozen and stay available at `/api/v1/methodology/vX.Y.Z/…`. Every change ships with an entry in the changelog, `methodology/CHANGELOG.md`, and a file `diff.json` that lists every country whose displayed score moved by 1 or more, with the cause.

A change is proposed as a pull request with a written rationale. The build posts the diff on the pull request. The proposal is announced on the [Changes](/en/changes) page and stays open for public comment for 14 days in a linked discussion; it is merged only after that period. A major version also needs a sign-off from at least one named reviewer.

Version 1.0.0-rc.1 is a release candidate. Before scores are displayed, the points and thresholds are tested by hand-scoring ten countries, and named external reviewers review the indicator table and thresholds; any adjustment is recorded in the changelog.

### Reproducibility and consistency checks

Every score can be rebuilt from a copy of the public repository: for a given date, the build regenerates every output byte for byte from `data/` and `methodology/`, and the published `manifest.json` records the git commit and a hash of every file. The following checks run at every build and block publication when they fail:

1. Two events on the same indicator for the same country, in overlapping windows, with different points, are an error unless the indicator is scaled, that is, its points can differ between events; each event on a scaled indicator records the reason for its points. The scaled indicators are A1, A2, A4, A5, B1, B8, B9, B11, B12, C1, C3, C4, D1 and D3.
2. Every confirmed event has a source of kind official, court or dataset.
3. Every source has an archived copy, a SHA-256 hash and a retrieval timestamp, except a dataset row, which relies on the archived copy of its dataset, and a failed capture, which is flagged and cannot support a published event; every piece of evidence has a quote.
4. Every B9 and B10 quote appears verbatim in the extracted text of its archived source, after whitespace normalisation; the quotes of other events must appear too, unless the source is a dataset row.
5. The symmetry table is present and complete.
6. Event summaries contain no word from `banned-words.txt` and no exclamation mark, are at most 200 characters long, and start with the actor.
7. A fresh build produces byte-identical outputs.
8. No country has an unchecked indicator when scores are displayed.

A change to the date, points, confidence or evidence of a published event is also rejected unless it comes with an entry in the corrections log.

### Corrections and right of reply

Every correction and retraction is listed on the [Corrections](/en/corrections) page: what was wrong, who flagged it, what changed and when. Nothing is deleted: a retracted event stays in the record, marked retracted, and no longer scores. Anyone can report an error through the public issue form.

Any government or embassy can reply to a specific event. The reply is published verbatim on the country page within 10 days of receipt, in the original language with a translation, with the project's answer beneath it. The contested event moves to confidence disputed (weight 0.4) until it is resolved by a correction, a retraction, or a documented rejection with reasons. How to submit a reply is explained on the [Reply](/en/reply) page.

### Deviations from the specification

The implementation differs from the project specification on these points:

1. Historical snapshots are static files, `/api/v1/scores/{YYYY-MM-DD}.json`, with an index file that lists the available dates, instead of a query `GET /v1/scores?date=`.
2. There is no automated extraction pipeline. Events are researched and drafted in sessions of Claude Code, an AI assistant, run by the author with the published sources protocol; the two-reader check of the specification is kept as a mandatory second reading of every draft.
3. The dataset is a set of files in a public git repository, and the review interface is the pull request on GitHub.
4. The Compare page shows category values as a dot plot instead of a radar chart. The map is drawn as SVG from Natural Earth data instead of map tiles.
5. Category E is recorded and not scored. Israel and Palestine are not scored.
6. Indicator A2 counts HS headings 8526 and 8802 only when the military nature of the flow is confirmed (see Definitions per indicator).

## Known limitations

- **Arms export data.** Most states report HS chapter 93 to UN Comtrade as confidential. Israel's mirror import data helps but is also partial. When neither source is available, A2 shows no-data, never zero. States that publish export data are therefore assessed on more data than states that do not; the coverage bar shows the difference for every country.
- **SIPRI TIV is not money.** It measures the military capability transferred, not the value of a contract, and the annual release is published in March for the previous calendar year.
- **Humanitarian funding.** FTS undercounts bilateral and in-kind aid, including aid from Arab states and Türkiye. D4 and D5 capture part of it; the coverage bar and the country note state the gap.
- **Statements.** Only formal, transcribed statements count. Many governments speak through spokespersons, whose statements are not scored, or on social media, where statements are not scored unless an official transcript exists.
- **Research coverage.** Countries are researched in waves, and coverage differs between countries while the research is in progress. The coverage bar and the list of what was checked show the state of research for every country.
- **Point values.** The points, caps and thresholds are choices. They are published, versioned and open to comment; the sensitivity tables, computed at every build and published once scores are displayed, show their effect on the ranking, and readers can set their own category weights.
- **Category E.** Domestic accountability is recorded and not scored in version 1.0.
- **Qualifying votes.** B1 scores only the votes listed in `votes.yaml`; the list is empty until each vote has been verified against the UN records.
