# 05 — Design system and anti-slop rules

The site must read like a reference work produced by a data desk, not like a startup landing page. Everything below is binding for every build session. When a choice is not covered here, ask: "would a broadsheet's data editor print this?" If not, don't.

## 1. Register

- **White paper and ink.** A white ground, a cool near-black text colour, hairline rules, one blue for links. The band colours are the only other saturated colours on any page and they only ever mean bands. Not the cream-paper-and-terracotta "editorial" look that generated sites converge on: the ground is white, the accent is a working link colour, and the serif is reserved for numbers and titles.
- **Numbers are the imagery.** No illustrations, no photographs, no icons except a handful of functional glyphs (external link, copy, archive, chevron, close, search, language).
- **Restraint over emphasis.** One typographic size jump carries hierarchy; weight and colour are used sparingly. No element asks for attention that its information does not deserve.
- **Symmetry between positive and negative.** A +10 event and a −10 event are laid out identically. No green for good and red for bad anywhere.

## 2. Typography (self-hosted, `@fontsource-variable`)

| Role | Face | Sizes | Notes |
|---|---|---|---|
| Display: scores, page titles, country names | **Newsreader** (variable, optical size) | 96 / 64 / 40 / 28 px | `font-variant-numeric: tabular-nums`; weight 400–500 only; tight leading 1.05 |
| Text and UI | **Source Sans 3** (variable) | 18 (reading), 16 (UI), 14 (table), 12 (captions) | line-height 1.5 reading, 1.35 UI; weight 400 and 600 only |
| Codes, ids, hashes, axis labels, dates in tables | **Source Code Pro** | 13 / 12 / 11 px | never for prose |

Rules: sentence case everywhere, including buttons and navigation (navigation may use 13 px uppercase with 0.06 em tracking as the one exception). Minus sign is U+2212 (−), never a hyphen. Plus sign is shown on positive scores and points. Thin spaces as thousands separators in FR (12 345), commas in EN (12,345). Percentages: "71%" in EN, "71 %" with a narrow no-break space in FR, as the generated summary lines write them (docs/10 B-83). French: espace insécable before `:` and narrow no-break space before `; ? !`, guillemets « » with no-break spaces, decimal comma. Dates: "12 September 2026" / "12 septembre 2026"; ISO dates in tables and ids.

## 3. Colour tokens (light theme only in v1, D-22)

```
--paper:        #FFFFFF   page background
--paper-2:      #F3F3F0   table stripes, panels, code blocks (cool, faintly green-grey)
--rule:         #D6D6D0   hairlines, borders
--ink:          #15161A   text (cool near-black)
--ink-2:        #4B4D53   secondary text
--ink-3:        #6F7278   muted labels, disabled (4.9:1 on white)
--link:         #1D4F91   links and focus ring (2 px outline, 2 px offset)

/* band scale — diverging, warm, no traffic-light red/green */
--band-sustaining:  #7A1F1A
--band-enabling:    #C4613E
--band-passive:     #B9B3A6
--band-acting:      #4F8A88
--band-confronting: #16504F
/* tints for chip backgrounds: band colour at 14% over --paper; text always --ink */

--nodata:  repeating-linear-gradient(45deg, var(--rule) 0 2px, transparent 2px 6px)   /* hatched */
--excluded: var(--paper-2) with 1px dotted var(--rule) outline

/* compare palette (up to 5 lines), distinct from the band scale */
--cmp-1: #15161A  --cmp-2: #1D4F91  --cmp-3: #7B4B94  --cmp-4: #B07D0A  --cmp-5: #5C7A5A
```

Text is never set in a band colour. Band chips: tinted background, solid 8 px square of the band colour, ink label. Links: `--link`, underlined (1 px, offset 3 px), hover thickens to 2 px; visited same as unvisited. Exactly one filled button style (`--ink` background, paper text) and it appears at most once per view; all other buttons are outlined.

## 4. Layout

- Container 1120 px, gutters 16 px (mobile) / 32 px (≥ 768 px). 12-column grid on desktop; single column under 768 px.
- Vertical rhythm on an 8 px scale. Sections separated by a hairline and 48 px (mobile) / 64 px (desktop). No cards with shadows; group by whitespace and rules.
- Border radius: 2 px everywhere, including chips and inputs. No pills.
- Tables for tabular data, always; cards only for events (and even those are ruled blocks, not floating boxes).
- Sticky elements: table header on the ranking page; nothing else sticks.
- Motion: none on load. Transitions ≤ 150 ms on hover/focus only. `prefers-reduced-motion` removes them.

## 5. Components

Each component has one implementation in `apps/web/components/` (or `packages/ui/` if shared with the widget), exported with typed props, and a Storybook-free `/_kit` route (dev only) that renders every state.

**Masthead.** Wordmark "Gaza Accountability Index" in Newsreader 22 px, left. Navigation right: Ranking · Countries · Compare · Changes · Methodology · Data · About. Language switch `EN | FR` (current in weight 600). Version tag in mono 12 px, e.g. `v1.0.0 · built 2026-09-26`, linking to the methodology changelog. Height 64 px, hairline below.

**ScoreGauge.** Full-width bar, 12 px tall, five segments in band colours with 1 px paper separators, positioned −100…+100. A 2 px ink marker at the score with a small triangle above; the 0 position has a 1 px ink tick labelled "0 · passivity line" in mono 11 px. Scale labels −100, −50, 0, +50, +100 in mono. Tooltip on hover/focus: exact score to one decimal and the methodology version. Above the bar: the score in Newsreader 96 px (64 px on mobile) with sign, then the band chip. Phase-1 mode: bar drawn with no marker, no number; label "Score not yet published · scorecard mode" in ink-2.

**CoverageBar.** A row of N equal segments (N = applicable indicators, ≤ 31), 8 px tall, 2 px gaps: filled ink = has-events or none-found; hatched = no-data; empty with hairline = unchecked. Label left: "Coverage 71 %"; label right: "4 without data, 5 unchecked". Hover on a segment names the indicator. Sits directly beneath the gauge; the gauge is never rendered without it.

**CategoryRows.** Five rows (A Arms, B Diplomacy, C Trade, D Humanitarian, E Domestic). Each: label (Source Sans 14, 600) and cap range in mono (−45 … +30); a horizontal axis from cap− to cap+ with 0 marked; filled bar from 0 to the clipped subtotal in ink; if the raw subtotal exceeds the cap, a hairline outline continues to the raw value with a "capped" label. Row E rendered in ink-3 with "experimental · not scored". Values in mono at the row end.

**Timeline.** SVG, responsive width, 320 px tall. X from 2023-10-07 to build date; Y −100…+100 with the five band ranges as faint stripes (band colour at 6 %). The score as a step line, 1.5 px ink. Each event is a dot on the line at its date: 5 px radius, filled ink for negative points, paper fill with 1.5 px ink stroke for positive points (shape, not colour, carries the sign); generated events (votes, funding) drawn as 3 px dots. Hover: tooltip with date, indicator, points, and the summary. Click: scrolls to and highlights the event card. Below the chart, a `<details>` "Data behind this chart" with the table of score changes. Axis labels mono 11 px; quarter ticks; year labels only.

**EventCard.** Ruled block, hairline above. Grid: left column 112 px (desktop) with the date in mono 13 px and the indicator badge (`A6 · Arms & military`) as an outlined chip; main column: summary in Source Sans 18 px; beneath it the quote as a block with a 2 px ink-3 left rule, original language first, translation beneath in ink-2, locator in mono; then a row: points (`+10`, mono 14 px, 600), confidence chip, scope tags, and the evidence list: `Source · Archived copy · sha256 3f2a…e1` (hash truncated with the full hash in `title` and copy-on-click). `reported` and `disputed` cards carry a one-line notice ("Single report, no primary document yet · weight 0.4"). Retracted events render struck-through with a link to the correction; corrected ones show "revision 2, see correction". Identical layout regardless of sign.

**ConfidenceChip.** Outlined chip: `confirmed` solid hairline; `corroborated` solid; `reported` dotted; `disputed` dotted with a "!" glyph. Text label always present.

**RankTable.** Columns: `#`, Country (name; ISO3 in mono beneath on mobile), Score (mono, tabular, signed), Band (chip), Categories (five 40 × 8 px mini-bars on a shared ±cap axis), Coverage (%, plus a 31-segment micro bar), Last change (date). Sortable by score, coverage, last change, name. Filters as outlined toggle chips: region, band, coverage ≥ 50 %. Rows link to the country page. Sticky header. Phase-1 mode: alphabetical, no Score/Band columns, "Events" count instead. No flags (D-23; flags are political and decorative).

**WeightSliders.** Panel titled "Your weights". Four rows A–D, each an `<input type=range>` 0–2 step 0.1 with the default tick at 1 and the value in mono; explanation in one sentence: "Weights multiply each category's capped subtotal. Events do not change." Buttons: Reset (outlined), Copy link (outlined). Ranking re-sorts live; changed rows show the delta in mono beside the score. URL updates with `?w=`.

**WorldMap.** SVG, Equal Earth, countries filled by band (hatched for no coverage under 30 %? No: hatched only for excluded and for `no-data` on both A1 and A2 when score is hidden). Strokes paper 0.5 px. Hover: name and score in a tooltip; click: country page. Legend: the ScoreGauge strip without a marker, with band names. No zoom or pan controls; on mobile the map is replaced by the ranking strip. Phase-1 mode: fill by coverage in ink tints.

**CompareChart.** Up to five step lines in the compare palette, direct-labelled at the right end (country name), no legend. Same axes as Timeline. Beneath: **CategoryDots**: five rows (A–E), one axis per row from cap− to cap+, a dot per country in its compare colour, labelled on hover. Then **EventDiff**: a two-to-five column table of events by month. As built (P-09, docs/10 B-127, B-129): each country also has a line dash and a dot shape, shown in its chip in the picker; EventDiff lists computed values only when their points changed.

**CiteThis.** Outlined button "Cite" opening a popover with three tabs (APA, Chicago, Plain) and a Copy button. Output includes country, score, band, methodology version, date, and the dated permalink. Example, Plain: `Gaza Accountability Index, Germany: −14 (Passive), methodology v1.0.0, as of 26 September 2026, https://…/country/DEU?date=2026-09-26`.

**ShareCard (PNG, build-time).** 1200 × 630, paper background. Top: wordmark small. Left: country name (Newsreader 72), score (Newsreader 168) with band chip; right: gauge (marker) and coverage line; bottom: summary line in Source Sans 28 and the permalink + methodology version in mono. Same template for all; Phase-1 variant shows "Scorecard · N events · coverage X %" instead of the number. As built (P-08, docs/10 B-114): one card per language (`/cards/{ISO3}.png`, `/cards/fr/{ISO3}.png`); the Phase-1 line adds "· N computed values" when computed values are in force, since the event count covers acts only (B-74); an excluded entity's card says "Not scored" with the reason, without gauge.

**ChangesFeed.** Grouped by ISO week ("Week of 21 September 2026"); each entry a compact EventCard (date, country, indicator, summary, points). Filters: country, indicator, sign. As built (P-09, docs/10 B-131): the filters are the country page's filter links (they work without JavaScript); a computed value is listed only when its points changed, the others counted in one line per week.

**MethodologyTable / VersionSelector / DiffViewer.** The indicator table rendered from YAML; a `<select>` of versions; the diff as a table: country, old score, new score, cause (indicator/threshold).

**RightOfReplyBlock.** On the country page, beneath the events: published replies verbatim in the original language with translation, the project's response, and the outcome chip. When none: a single line with the instructions link.

**Footer.** Four columns of text links: About · Methodology · Corrections · Right of reply · Data & API · Embed · GitHub. Licence line: "Data CC BY 4.0 · Code MIT". Build line in mono: version, git SHA (short), build date. No social icons.

## 6. Pages

**Home.** Masthead. A one-line statement (Newsreader 40): "Every government, one scale, every point sourced." Sub-line (18 px): what the index is, one sentence, then "Read the methodology" link. Then the WorldMap with its legend. Then a two-column band: left "Moved this week" (five up, five down, with deltas); right "Changed this week" (last eight events, compact). Then the search box ("Find a country") and a ranking strip (top and bottom five). Nothing else. No feature grid, no stats counters, no testimonial, no newsletter.

**Ranking.** Title, one-sentence explanation with the methodology version, the RankTable, the WeightSliders in a collapsible panel above the table (collapsed by default), and a "Download CSV" link.

**Country.** Title: country name (Newsreader 64), with region and memberships as plain text beneath. ScoreGauge + CoverageBar. Summary line (generated). CategoryRows. Timeline. "Events" heading with count, filters (indicator, sign, confidence), then EventCards newest first. Assessment block: "What was checked" — a 31-row compact table of indicator, status, date checked, note (collapsed by default). Replies block. Cite / Share / Download JSON row (outlined buttons). Related: "Compare with peers" links (same region, same band).

**Compare.** Country picker (search + up to five chips), CompareChart, CategoryDots, EventDiff, Cite. State in the URL. As built (P-09, docs/10 B-125, B-126, B-128): `?c=DEU,FRA` and, in score mode, `?w=` with the weights panel; without JavaScript, a sentence and the list of country pages.

**Changes.** ChangesFeed with month navigation; a "Monthly report" link per month (generated Markdown page: movers, new events, corrections). As built (P-09, docs/10 B-130, B-132): the feed of the latest weeks, then a table of months, each linking its report rendered at /changes/{YYYY-MM}/ (rows linked to their events, previous and next months); a line with the build date, and a stale-build notice when the build is more than three days old.

**Methodology.** Version selector. Sections: Purpose and standpoint (short), The scale, Rules (conduct not promises; silence is negative; material beats symbolic), Indicator table, Formula (rendered from LaTeX via KaTeX at build, with a plain-language paragraph), Event types and decay, Confidence, Computed indicators, Passivity, Coverage, Sensitivity tables (rendered), Symmetry table, Versioning and changelog, Known limitations. FR version is a full translation.

**Corrections.** The log as a table, newest first, with links to events and to the flagging issue.

**About.** Standpoint statement (verbatim from spec §1, signed), who maintains it (D-01), reviewers (names, one-line disclosures; "Reviewers: none yet" until there are), independence and funding, contact, hand-over note.

**Data.** Downloads (CSV/JSON), API documentation (every endpoint with an example response), licence, citation for the dataset, reproducibility instructions (clone, `pnpm build:data`, compare `manifest.json`).

**Embed.** Widget docs with live examples and the snippet.

**Reply.** How to submit a right of reply (GitHub issue form + email), what happens, the 10-day rule.

## 7. Copy rules

- Headlines state facts. "Germany: −14, Passive" not "Discover Germany's score".
- Summaries: `{Actor} {past-tense verb} {object}{, qualifier}.` No adjectives, no adverbs, no "notably", no "shockingly". Banned words are linted.
- Never "we believe", "our platform", "empower", "journey", "dive", "unlock", "seamless", "robust", "leverage", "cutting-edge", "game-changing", "explore".
- Explain a term once, at first use, in the same sentence. Band names are used as nouns ("in the Passive band").
- Error and empty states are one sentence and say what to do: "No events published for this country yet. The assessment table below lists what was checked."
- Legal safety: never "complicit", "guilty", "war crime" in the site's own voice; quotes may contain them, attributed.

## 8. Charts

SVG only, drawn with d3 scales in React (no chart library; since P-09 the two linear scales are written out with d3-scale's arithmetic and d3-shape draws the step lines, docs/10 B-127). Strokes 1.5 px; hairline grid; direct labels instead of legends wherever possible; axis text in mono; no 3-D, no donuts, no radars, no area fills with gradients, no animated draw-in. Every chart has a text alternative. Colour is never the only carrier of meaning.

## 9. Anti-slop checklist (CI-reviewed by a design-critique pass before launch)

1. No gradients, glassmorphism, blur, glow, or drop shadows.
2. No hero illustration, stock photo, abstract blob, or 3-D render.
3. No three-column icon-and-benefit grid; no "How it works" in three steps with icons.
4. No emoji, no icon per heading, no decorative sparklines.
5. No purple/indigo, no default Tailwind palette, no Inter.
6. No rounded-2xl cards, no card-in-card, no pill buttons.
7. No animated counters, confetti, skeleton shimmer, or scroll-triggered reveals.
8. No testimonials, logos of "partners", "Trusted by", newsletter modal, cookie banner (no cookies), chat bubble.
9. No generic headline ("Accountability, simplified"); every heading states a fact.
10. No dark-mode toggle in v1; no theme picker.
11. No placeholder data ever visible; Phase-1 mode is an explicit state with its own copy.
12. Tables for data; the ranking is a table, not a grid of cards.
13. Green ≠ good, red ≠ bad: the band scale is the only colour scale and it is oxblood/teal.
16. No cream ground, no terracotta accent, no "broadsheet" pastiche: white ground, cool ink, blue links, serif only for numbers and titles.
14. One filled button per view at most.
15. The page must be usable, complete and legible with JavaScript disabled.

## 10. Accessibility

WCAG 2.2 AA. Contrast ≥ 4.5:1 for text (ink-3 on white is 4.9:1; never use ink-3 below 12 px). Keyboard: every interactive element reachable, focus ring visible (`--focus`), tooltips also open on focus. Charts have `role="img"` with `aria-label` and a table alternative. Language attributes on quotes (`lang="de"`). Targets ≥ 24 × 24 px. Tested with axe in CI and manually with VoiceOver on the country page.
