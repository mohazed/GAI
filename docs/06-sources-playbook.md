# 06 — Sources playbook and research protocol

How a Claude Code data session finds, archives and files evidence. This is the operating manual for every data prompt. Items marked **[verify]** must be confirmed against the live site in the session that first uses them (URLs change; the protocol does not).

## 1. Ground rules

1. **Primary first.** An event is filed only when a primary document exists: official release, gazette, court filing, official transcript or video, dataset row. Press and NGO reports are leads (`data/leads/`) until the primary is found, or evidence at `corroborated` (two independent investigations naming the document) or `reported` (one).
2. **Archive before filing.** Every URL goes through `pnpm archive <url>` which saves it to the Wayback Machine, downloads the snapshot, hashes it, extracts text and prints a source skeleton. No source record without `wayback_url` and `sha256`.
3. **Quote verbatim.** The supporting passage is copied character-for-character from the extracted text (`archive/text/`), in the original language, with a locator. CI checks it exists. Translations are added beside it, never instead of it.
4. **Date the action, not the article.** Event date = date of the decision, vote, statement or delivery. Source date = the document's date.
5. **Symmetric effort.** For each country, the session spends the same protocol on positive and negative indicators, records `none-found` with the queries used, and never stops at the first finding.
6. **Two readings.** After drafting, the session re-reads every archived text against every event (a separate pass, with the file list reversed) and records `review.second_read.verdict`. Disagreements are downgraded or dropped, never averaged.
7. **Up to date.** Every session states the current date, searches with date filters covering the last 12 months first, and records `assessments.last_full_check`.
8. **No fabrication under any pressure.** If a page cannot be fetched, say so in the assessment note and try the Wayback copy, a mirror, or the built-in browser. Never reconstruct a quote from memory.

## 2. Structured sources (generated indicators)

| Indicator | Source | Access | Fetcher | Cadence |
|---|---|---|---|---|
| B1 UNGA votes | **Bulk:** UN Digital Library record 4060887, "General Assembly recorded votes" CSV (one row per member-state vote, 1946 → A/RES/80/246 of 30 Dec 2025, updated yearly; non-commercial use with attribution — our table is an independent compilation of the public record, cross-checked against the UN press release of each vote at `press.un.org`). **Per resolution after the bulk cut-off:** the record's Voting Data page (`digitallibrary.un.org/search?cc=Voting+Data&ln=en`, search the symbol; MARCXML export at `/record/{id}/export/xm`). The site is behind a bot challenge: **download in a browser**, save under `data/structured/raw/`, then run the importer. | no key | `pnpm import:unvotes <csv>` filters to the qualifying list and writes `unga_votes.csv` plus a dataset source (the press release for each vote is archived as the per-vote `official` source) | per session, and after each new vote |
| B2 UNSC vetoes | UN veto guide `research.un.org/en/docs/sc/quick/veto` → UNDL veto search and the DPPA dataset `psdata.un.org/dataset/DPPA-SCVETOES`; meeting records for each draft | no key | hand table `unsc_vetoes.csv` (seed list in §8) | per veto |
| D1 funding | OCHA FTS API **v1** flows (`https://api.hpc.tools/v1/public/fts/flow?planid={id}&groupby=location`; v2 has plans but no flow endpoint). oPt plan ids: 2023 Flash Appeal **1186**, 2024 **1156**, 2025 **1273**, 2026 **1510**. Aggregate by source *location* (governments fund through several organisation entries); `groupby` values are case-sensitive. Raw flows paginate via `meta.nextLink`. | no key | `pnpm fetch:fts` | monthly |
| GNI, population | World Bank API `https://api.worldbank.org/v2/country/all/indicator/NY.GNP.ATLS.CD?format=json&mrv=1&per_page=500` and `SP.POP.TOTL` (latest GNI year 2024, population 2025) | no key | `pnpm fetch:worldbank` | annual |
| A1, A4 SIPRI | `armstransfers.sipri.org` → Data → TIV tables → recipient Israel by supplier (deliveries) and supplier Israel by recipient (orders) → Export to CSV. No login observed. Release of 9 March 2026 covers 1950–2025; releases fall each March. | none | `pnpm import:sipri <file>` | March each year |
| A2, C3 trade | UN Comtrade `https://comtradeapi.un.org/data/v1/get/C/A/HS?reporterCode=…&partnerCode=376&period=…&cmdCode=…&flowCode=X` (free key: 500 calls/day, 100 000 records/call, HS-6 included; keyless `/public/v1/preview/` for spot checks, ~500 rows). Mirror: reporter 376, partner = country, flow M. | free key | `pnpm fetch:comtrade` | annual, quarterly where reported |

Each fetcher archives the raw response (or the downloaded file) as a `dataset` source and writes the CSV rows with that source id. The generators then produce the events.

### Qualifying UNGA resolutions (`methodology/v1.0.0/votes.yaml`)

The session that builds the votes table enumerates every plenary resolution adopted by recorded vote since 2023-10-07 whose subject is Gaza, UNRWA, or the status/rights of Palestine, and records symbol, date, title, counts, and a one-line inclusion rationale. Seed list, verified 2026-09-26 against UN sources (confirm symbols marked † from the Digital Library record before use):

| Symbol | Date | Subject | Y–N–A |
|---|---|---|---|
| A/RES/ES-10/21 | 2023-10-27 | Protection of civilians, humanitarian truce | 121–14–44 |
| A/RES/ES-10/22 | 2023-12-12 | Immediate humanitarian ceasefire | 153–10–23 |
| A/RES/ES-10/23 | 2024-05-10 | Palestine's rights and membership | 143–9–25 |
| A/RES/ES-10/24 | 2024-09-18 | Ending Israel's unlawful presence (ICJ advisory opinion) | 124–14–43 |
| A/RES/ES-10/25 | 2024-12-11 | Support for UNRWA's mandate | 159–9–11 |
| A/RES/ES-10/26 | 2024-12-11 | Demand for a ceasefire | 158–9–13 |
| A/RES/ES-10/27 | 2025-06-12 | Ceasefire, end of blockade | 149–12–19 |
| A/DEC/80/506 | 2025-09-12 | Endorsement of the New York Declaration | 142–10–12 |
| A/RES/80/… † | 2025-12-05 | UNRWA mandate renewal to 30 June 2029 (from Fourth Committee draft A/C.4/80/L.17, plenary vote) | 151–10–14 |
| A/RES/80/… † | 2025-12-12 | Welcoming the ICJ advisory opinion of 22 October 2025 (draft A/80/L.26) | 139–12–19 |
| A/RES/81/… † | 2026-09-17 | Palestine's participation in the 81st session (draft A/81/L.2) | 152–3–4 |

Inclusion of ES-10/24 (occupation as a whole, not Gaza only) and of the 2026 participation vote is decided in `votes.yaml` with a written rationale; the default is to include both under "status and rights of Palestine". The recurring December Palestine items from the Fourth Committee that pre-date the war (e.g. "Peaceful settlement of the question of Palestine") are excluded. Committee stages are excluded.

## 3. Event sources by indicator (hand-authored)

| Ind. | Where the primary lives | Search pattern | Leads / trackers to mine (never sole evidence) |
|---|---|---|---|
| A3 F-35 | Government answers to parliamentary questions; Lockheed Martin / JPO supplier lists; ministry industrial-participation pages; UN Special Rapporteur reports (A/HRC/59/23 and successors) | `"F-35" site:{parliament domain} Israel`; `"F-35" supplier {country} ministry` | Investigate Europe, Campaign Against Arms Trade, The Rights Forum |
| A5 cooperation | Defence ministry press rooms; port authority notices; parliamentary answers on overflights/transit | `{ministry} Israel exercise 2024..2026`; `port {city} Israel arms shipment parliamentary question` | Progressive International's shipping trackers, Declassified UK, Disclose |
| A6/A7 | Government decisions, decrees, official gazettes, court rulings (e.g. The Hague appeals court on F-35 parts), export-control authority notices | `arms export licence Israel suspended site:{gov}`; `embargo armas Israel decreto` | CAAT, Amnesty arms-trade briefings |
| A8 transit denied | Port authority or ministry statement; customs; court order | `port denied vessel Israel arms {country}` | dockworker union statements as leads |
| B3 | ICJ case 192 page: "Declarations of intervention" list, press releases | `icj-cij.org case 192` | — |
| B4 | Official statements after 26 Jan 2024, 28 Mar 2024, 24 May 2024 orders | `{mfa} ICJ provisional measures statement` | — |
| B5/B6 | Official statements after 21 Nov 2024 warrants; official visit records of persons under warrant | `{mfa} ICC arrest warrant Netanyahu statement`; `{head of gov} visit Netanyahu 2025` | ICC's own list of state communications; press summaries as leads |
| B7 | Official sanctions lists (US OFAC, executive orders), government responses | `sanctions ICC prosecutor executive order` | — |
| B8 | Foreign ministry announcement of recognition; UN letter | `{mfa} recognises State of Palestine` | — |
| B9/B10 | Official transcripts: head of government or foreign minister speeches, UNGA General Debate statements (`gadebate.un.org` archive), parliament records, official YouTube channels (transcribe, timestamp) | `site:{gov} Gaza ceasefire statement`; `gadebate.un.org {country} 2024` | — |
| B11 | Sanctions lists (EU, UK, CA, AU, NZ, NO, JP…); government releases | `sanctions settlers {country} list` | — |
| B12 | Foreign ministry announcement | `recalls ambassador Israel {country}` | — |
| C1 | Government or EU Council decisions; parliamentary motions with binding effect | `association agreement Israel suspend review {country}` | — |
| C2 | Treaty registers, ministry releases | `agreement signed Israel {country} 2024..2026 site:{gov}` | — |
| C4 | Customs regulations, gazettes | `settlement goods ban labelling {country} regulation` | — |
| C5 | Sovereign fund / pension fund ethics council decisions (Norway's Council on Ethics, ABP, PFZW, AP funds, KLP, Storebrand…) | `{fund} exclusion Israel Gaza decision` | AFSC Investigate, Don't Buy Into Occupation |
| C6 | Procurement rules, municipal/national exclusion decisions with legal effect | `procurement exclusion Israel {country} decree` | — |
| D2/D3 | UNRWA donor tables (`unrwa.org/how-you-can-help/government-partners/funding-trends` **[verify]**), government announcements Jan–Apr 2024 and later | `UNRWA funding suspend {country} statement`; `resume funding UNRWA` | UNRWA situation reports |
| D4 | WHO EMRO medevac updates; health ministry releases; official announcements of field hospitals | `medical evacuation Gaza {country} ministry` | — |
| D5 | Immigration regulations, gazettes | `Gaza visa humanitarian {country} regulation` | — |
| E1–E3 | Prosecutor announcements, court dockets, interior ministry decrees, court rulings on protest bans | `universal jurisdiction complaint Gaza {country} court`; `Palestine protest ban {country} decree` | ECCHR, Amnesty country reports |

## 4. Per-country protocol (full, Phase 1)

1. Read `data/countries.yaml` entry; open each `gov_sources` URL (or its Wayback copy) and note the press-release archive path and search facility.
2. Load the generated events for the country (`pnpm score --country XXX --list`) so votes and funding are known before searching.
3. For each indicator in order A→E, run the search patterns in §3 with the country's names in EN, FR and the local language; check the last 12 months first, then 2023-10 onward.
4. For each candidate: find the primary; `pnpm archive <url>`; write the source YAML; write the event YAML with the quote and locator; set `status: draft`.
5. For each indicator with no event: write the assessment entry (`none-found` with queries, or `no-data` with the reason).
6. Leads without a primary go to `data/leads/XXX.yaml`.
7. Run `pnpm validate` until clean; run `pnpm score --country XXX` and read the result critically: does any single event dominate unexpectedly, is any cap hit, does the band match the evidence?
8. Second reading (rule 6): re-open every archived text; confirm each quote and each indicator match; set `second_read.verdict`.
9. Set `status: reviewed`; commit on branch `data/wave-N`; write the PR description as a table of events with points and confidence, plus the assessment summary.
10. The author reviews the diff, requests changes or merges; the merge commit sets `status: published` (a script `pnpm publish:events --pr N` does the flip with `reviewed_by`).

Time budget: 60–120 minutes of session time per major country; the session should stop and hand back if it exceeds three hours without finishing (split the country across two prompts).

## 5. Light protocol (Phase 3)

Steps 1, 2, 5, 7, 9 of §4, plus for indicators B3–B12, C1, D2–D5: one search each in EN and one in the local language, checking the foreign ministry's news archive for "Gaza" and "Palestine" pages. Twenty to forty minutes per country. Assessments are the main output.

## 6. Archiving details

- `pnpm archive <url>`: POST/GET to Wayback Save Page Now; wait for the snapshot; fetch it; SHA-256 the bytes; extract text (HTML: main content via Readability, then plain text; PDF: pdfjs text layer; video: not archived, transcript authored and stored as text with the official video URL and timestamp); write `archive/text/{id}.txt` (truncate at 200 KB with a marker); append to `archive/index.csv`.
- Save Page Now is used **authenticated** (SPN2: `POST https://web.archive.org/save` with `url=…`, header `Authorization: LOW {IA_ACCESS_KEY}:{IA_SECRET_KEY}`, `Accept: application/json`, then poll `GET /save/status/{job_id}`; use `if_not_archived_within=1d` to reuse a same-day capture). Anonymous saves return 429 almost immediately, so the keys are required (see `09-accounts-and-costs.md`). Limits: 5 concurrent captures, 100 000 per day, 10 captures of the same URL per day, about 40 s per capture.
- If a capture fails (blocked host, timeout), retry twice with a 60 s pause; then try archive.today by hand in a browser (`archive.ph`, no API, CAPTCHA-gated) and record `archive_url_alt`; finally record `wayback_url: null` with `archive_status: failed` — such a source cannot support a `confirmed` event until archived. Sites known to reject non-browser clients: fts.unocha.org (use the API), icc-cpi.int, unrwa.org, digitallibrary.un.org (bot challenge) — for these, archive the page through Wayback (Wayback's own crawler usually succeeds) and fetch the text from the snapshot.
- Dataset responses (FTS JSON, Comtrade JSON, World Bank JSON) are archived as files under the same procedure; the CSV rows cite the dataset source id.

## 7. Known data gaps to state on the methodology page

- Arms export data: most states report HS 93 to Comtrade as confidential; Israel's mirror imports help but are also partial. `no-data` is shown, never zero.
- Humanitarian funding: FTS undercounts bilateral and in-kind Arab and Turkish aid; D4/D5 capture part of it; the coverage bar and the country note explain.
- Statements: only formal, transcribed statements count; many governments speak through spokespersons (not scored) or social media (not scored unless an official transcript exists).
- SIPRI TIV is not money; it measures military capability transferred, and the annual release lags by three months.

## 8. Verified seed facts (2026-09-26) for the first data sessions

Each item is a lead to be confirmed from the primary document and archived; none is filed on this list alone.

**UNSC vetoes on Gaza drafts** (UN veto list): 2023-10-18 S/2023/773 (Brazil draft, humanitarian pauses) vetoed by USA; 2023-10-25 S/2023/792 (US draft, pauses) vetoed by China and Russia; 2023-12-08 S/2023/970 (UAE, ceasefire) USA; 2024-02-20 S/2024/173 (Algeria, ceasefire) USA; 2024-03-22 S/2024/239 (US draft, "imperative" of a ceasefire) China and Russia; 2024-11-20 S/2024/835 (E10, ceasefire) USA; 2025-06-04 S/2025/353 (E10, ceasefire and aid) USA; 2025-09-18 S/2025/583 (E10, ceasefire) USA. Tracked, unscored: 2023-12-22 amendment veto (USA); 2024-04-18 S/2024/312 Palestine membership (USA). No Gaza-related veto in 2026 to date.

**ICJ case 192 interventions** (icj-cij.org/case/192/intervention): Colombia 2024-04-05 (withdrawn 2026-09-18), Libya 2024-05-10, Mexico 2024-05-24, Palestine 2024-06-03, Spain 2024-06-28, Türkiye 2024-08-07, Chile 2024-09-12, Maldives 2024-10-01, Bolivia 2024-10-08, Ireland 2025-01-06, Cuba 2025-01-10, Belize 2025-01-30, Brazil 2025-09-17, Comoros 2025-10-29, Belgium 2025-12-23, Paraguay 2026-03-03, Netherlands 2026-03-11, Iceland 2026-03-11, Namibia 2026-03-12, United States 2026-03-12, Hungary 2026-03-12, Fiji 2026-03-12. Nicaragua's Article 62 application (2024-01-23) was withdrawn 2025-04-03. **Read each declaration**: the direction of the argument decides B3 versus B4 (the US and Hungarian declarations are expected to argue against the applicant's construction).

**ICC**: warrants for Netanyahu and Gallant issued 2024-11-21; upheld by the Appeals Chamber 2025-12-15. Public positions to verify per country from official transcripts: execution stated (Canada, Switzerland, Finland, Iceland, New Zealand, Spain, UK, Belgium, Denmark, Ireland, Netherlands, Germany's November 2024 statement) versus immunity or refusal (Hungary, which hosted Netanyahu in April 2025 and left the Rome Statute effective 2026-06-02; France's immunity position of November 2024; Italy; Poland's January 2025 assurance; Germany under Merz, February 2025; Argentina; Czechia). Overflights (Canada, France, Italy, Greece, 2025–2026) are leads. **US sanctions on ICC officials** (EO 14203 of 2025-02-06): Karim Khan 2025-02-13; four judges 2025-06-05; Francesca Albanese 2025-07-09; two judges and two deputy prosecutors 2025-08-20; three Palestinian NGOs September 2025; two judges 2025-12-18; the ICC President and a senior trial lawyer 2026-08-18. B7 is one standing state for the USA from 2025-02-13.

**UNRWA**: January 2024 suspensions (to verify individually from ministry releases): USA, Germany, Sweden, Japan, France, Switzerland, Canada, UK, Netherlands, Italy, Australia, Austria, Finland, New Zealand, Iceland, Romania, Estonia, Latvia, Lithuania (and a partial EU pause). All but the USA resumed by mid-2024; Sweden ended funding from 2025; the Netherlands announced a phase-down; the USA has not resumed (statutory ban to March 2025, then the executive order of 2025-02-04). UNRWA donor tables: unrwa.org → Government partners → Funding trends → Donor charts (PDF), and the 2025 pledges summary table.

**Recognitions of Palestine since 2023-10-07** (B8, +8): Barbados 2024-04-19; Jamaica 2024-04-22; Trinidad and Tobago 2024-05-02; Bahamas 2024-05-07; Ireland, Norway, Spain 2024-05-28; Slovenia 2024-06-04; Armenia 2024-06-21; Mexico 2025 (date to confirm from the SRE communiqué); Canada, Australia, United Kingdom, Portugal 2025-09-21; France, Monaco, Luxembourg, Malta, Andorra 2025-09-22; San Marino 2025-09-23. Belgium announced recognition on 2025-09-22 with conditions and had not formalised it as of September 2026 (lead, not event). New Zealand and Liechtenstein: intent only. 157 of 193 UN members recognise Palestine; all pre-existing recognitions are B8 standing states at +3.

**Map data**: Natural Earth 1:50m admin-0, public domain, GeoJSON at the `nvkelso/natural-earth-vector` repository; use `ADM0_A3` / `ISO_A3_EH` (plain `ISO_A3` is `-99` for France, Norway, Kosovo…). Palestine is its own feature (`ISO_A3 = PSE`, `ADM0_A3 = PSX`).
