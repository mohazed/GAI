# Monthly run 2026-11: new events for the 45 full-protocol countries (P-23)

Written by the unattended finish run on `data/phase1` (docs/10 B-854), in place of a pull request description (T-P23). This file records the part "new events since each country's session" (HANDOFF Task C, last bullet). The other parts of the monthly run are in docs/10 B-850 to B-853 (Comtrade, Wayback, General Debate files, Kazakhstan) and B-855 onward if later sessions add them.

Window: 27 September 2026 (the day before the sessions of the 45 countries, whose last full checks are dated 28 to 30 September 2026) to 4 November 2026. All events below are `reviewed`, not published, and tagged `west-bank`, so they are recorded and not scored in version 1.

## Method and its limit

The run had no web search (the allowance of calls was used up, as for T-P21-26 and T-P21-46 to T-P21-49), so no news search per indicator group was possible. The run read the governments' own sites where a script can reach them. Every candidate was opened at its primary page, archived with Save Page Now, and its Wayback replay was fetched again and compared with the index row (bytes and SHA-256). A country with no route below was not searched; its absence from the table is not a finding that nothing happened.

## Events filed

| Event | Country | Indicator | Date | Points | Scope | Confidence | Source |
|---|---|---|---|---|---|---|---|
| evt_2026_10_19_GBR_B9 | GBR | B9 | 2026-10-19 | +5 | west-bank | confirmed | `src_20261019_gov-uk_fs-statement-e1-tender-deadline` (Foreign Secretary's statement on the E1 tender deadline) |
| evt_2026_10_16_EGY_B9 | EGY | B9 | 2026-10-16 | +5 | west-bank | confirmed | `src_20261016_dirco_joint-statement-colombia-embassy` |
| evt_2026_10_16_TUR_B9 | TUR | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_QAT_B9 | QAT | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_JOR_B9 | JOR | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_MYS_B9 | MYS | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_IDN_B9 | IDN | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_SAU_B9 | SAU | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_DZA_B9 | DZA | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_ZAF_B9 | ZAF | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |

The joint statement of 16 October 2026 (twenty foreign ministers reject Colombia's inauguration of its embassy in Jerusalem) is filed for every signatory among the 45 countries, as the joint statement of 21 August 2025 was (docs/10 B-444). The ten signatories outside the 45 (Libya, Yemen, Djibouti, Somalia, Kuwait, Oman, Syria, Sudan, Lebanon, Pakistan; the State of Palestine is not in the universe) are light-protocol countries and are not filed in this run.

Both sources are archived; the replays were re-fetched with `curl --compressed`: 71,626 bytes, SHA-256 `36c5c8a4…3ae0` (GBR) and 164,609 bytes, SHA-256 `47253df3…fc8d` (DIRCO).

## What was read, by country

| Country | Route | Period read | Result |
|---|---|---|---|
| GBR | GOV.UK search API (queries gaza, palestinian, settlers, occupied palestinian, FCDO filter) and content API | 27 Sep to 4 Nov | One event (above). Read and not filed: the Foreign Secretary's statement of 8 Oct on the Jerusalem mission (a statement on a consular building and a legal view of East Jerusalem, no call or named violation); the joint statement of Australia, Canada, France and the United Kingdom of 13 Oct on the postponement of Palestinian elections and the joint press release on the R4 meeting in Istanbul of 24 Oct (neither mentions Gaza); the Security Council statements of 28 Sep and 15 Oct (delivered by the Permanent Representative, not a B9 speaker). The Prime Minister's statement of 6 Oct on the anniversary of 7 October does not cite Gaza's conduct and names no violation. |
| ZAF | DIRCO "Media Statements" list (first page, 28 Sep to 30 Oct) | 28 Sep to 30 Oct | The joint statement above. No other item on Gaza. |
| CHE | News Service Bund RSS (117 releases) | 28 Sep to 4 Nov | Titles read; titles and summaries searched by script for Gaza, Israel, Palestin*, Hamas, UNRWA, Middle East, Near East: no hit. Two releases of 3 Nov on international humanitarian law and the ICRC were not opened. |
| RUS | en.kremlin.ru search (Gaza) | 1 Oct | The President's meeting with the Valdai Discussion Club (1 Oct): his answer on Gaza restates the Russian position on a Palestinian state; no call for a ceasefire or an end to the blockade and no named violation, so no B9. The Ministry's pages were not read. |
| USA | state.gov RSS (10 items of 2 to 4 Nov) | 2 to 4 Nov | No item on Gaza or Israel. The site's REST list returns only the latest items, so 27 Sep to 1 Nov was not read. |
| CZE | mzv.gov.cz press-release page | latest | A statement "Three Years Since the Hamas Terrorist Attack" is listed; not opened (no named speaker is expected, and it is not about conduct in Gaza). |
| EU members and CAN (EU-Canada summit, 30 Oct) | Council RSS (20 latest items) | 30 Oct | The joint statement of the summit is listed; consilium.europa.eu answers 403 to scripts and to Save Page Now, so it was not read. Whether it names Gaza is unknown. |

Not reached (no route that a script can read, or a route that answered 403, 404, a bot check or an empty list in this run): AUS (the Prime Minister's list shows only CHOGM items; the Foreign Minister's site did not answer), CAN (Canada.ca news API empty), IRL (page built by script), NOR, SWE, DNK, BEL, AUT, ITA, GRC, NLD, DEU, FRA, ESP, POL, SVN, HUN, IND, JPN, KOR, BRA, MEX, COL, CHL, ARG, BOL, CHN, MAR, NGA, ARE, AZE, plus the Ministries of the signatories of the joint statement. Their last full checks are those of 28 to 30 September 2026.

## Seen and not filed

- **Colombia's embassy in Jerusalem.** The joint statement shows that Colombia, whose government restored relations with Israel on 11 August 2026 (`evt_2024_05_02_COL_B12`), inaugurated an embassy in Jerusalem by 16 October 2026. The methodology defines no indicator for an embassy move (docs/10 B-599), so nothing is filed for Colombia; the Colombian side was not read (the Ministry answers 403). A decision for the author or the next methodology version: whether such a move needs an indicator.
- **UK mission in Jerusalem (8 Oct):** see the GBR row.
- **Attacks on French, Belgian and Polish officials in the West Bank** (named in the Foreign Secretary's statement of 19 October): the governments' reactions were not searched.

## Not done

- The news search for the 45 countries (no search tool). A session with a search tool should run, for each country, the Phase 1 queries per indicator group for 27 September to the run date, starting with the countries not reached above.
- The 16 October joint statement for the ten light-protocol signatories.
- `pnpm calibrate` was not re-run (west-bank events do not move any score).
