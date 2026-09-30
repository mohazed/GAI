# Glossaire français

The French terms of the Gaza Accountability Index, one per concept, for every French text of the site, the methodology, the generated text and the event summaries (P-18, 2026-09-30). A session that writes French uses these terms; a new term is added here before it is used. The register is the one of docs/05 §7: sober, factual, no calque of the English ("l'adresse garde le choix" → "l'adresse de la page conserve la sélection").

## 1. Typography (docs/05 §2)

- **Espaces.** No-break space (U+00A0) before `:` and inside guillemets « »; narrow no-break space (U+202F) before `; ? ! %` and as the thousands separator (12 345). Decimal comma (0,4). The minus sign U+2212 (−15).
- **Apostrophe.** The site and the widget display the typographic apostrophe (’, U+2019) in French, everywhere at once (P-18). The files are written with the straight apostrophe (`'`): `messages/fr.json`, `content/*.fr.md`, `methodology.fr.md`, the event summaries, the registry names (as UNTERM writes them) and the code templates. The site converts at display: `frenchTypography` (@gai/scoring) on the French messages and content, and `frenchDisplay` (apps/web/lib/format.ts) on the `fr` member of every `{ en, fr }` text the site reads from the API; the widget does the same with the country file. Verbatim quotes are never converted: they are not `{ en, fr }` objects. The API, the dumps and `dumps/registry.csv` keep the straight apostrophe, as the data is written.
- **Capitals.** Sentence case. Lower case for "président", "ministre", "gouvernement" before a name or a country ("le président de la République", "le ministre des Affaires étrangères": capital on the domain of the ministry, not on "ministre"). "l'État" (the state as an institution), "les États membres". Months and days in lower case.
- **Dates.** "12 septembre 2026", "1er octobre 2026"; ISO dates in tables and identifiers.
- **Quoted English.** An English phrase inside a French summary stays in the original, between guillemets, only when it is the object of the act (a slogan banned, a title); otherwise the summary is written in French.

## 2. Country names

- **In running text and generated summaries:** the UNTERM short name with its article, `name.fr_def` of the registry, first letter capitalised at the start of a sentence: "L'Allemagne", "La France", "Les États-Unis d'Amérique", "Cuba", "Les Bahamas". Verbs agree with a plural name ("Les Comores ont voté"). Generated templates use only verbs conjugated with *avoir* ("a opté pour l'abstention" rather than "s'est abstenu"), so that gender, which the registry does not record, never matters.
- **Five names with a descriptor** (Bolivie, Iran, Micronésie, Pays-Bas, Venezuela): the UNTERM French formal name ("l'État plurinational de Bolivie", "la République islamique d'Iran", "les États fédérés de Micronésie", "le Royaume des Pays-Bas", "la République bolivarienne du Venezuela"), never a short name with an article chosen by the project. English does the same with `name.en_def` ("the Islamic Republic of Iran").
- **In titles, tables, lists and after a colon:** the short name without article, `name.fr` ("Allemagne", "Pays-Bas (Royaume des)").
- **Never "de {nom}" with a bare name** ("la jauge de Allemagne"): write the name after a colon or in parentheses ("La jauge (Allemagne) :"), or the article form.
- "La Palestine" in general statements; "l'État de Palestine" for the State; "État non membre observateur" (A/RES/67/19). "Le Saint-Siège". "La Türkiye" (UNTERM). "Le Territoire palestinien occupé (TPO)".

## 3. The index

| English | Français | Note |
|---|---|---|
| the index | l'indice | never "l'index" (a list of words); the name "Gaza Accountability Index" is not translated |
| score | score | |
| band | bande | "dans la bande Passivité" |
| Sustaining / Enabling / Passive / Acting / Confronting | Soutien / Facilitation / Passivité / Action / Confrontation | band names, capitalised as names |
| category | catégorie | A Armes et coopération militaire, B Diplomatie et droit international, C Commerce et économie, D Humanitaire, E Responsabilité interne |
| indicator | indicateur | never for a flag or a mark (the passivity flag is "la mention de la pénalité de passivité") |
| cap; capped | plafond; plafonné | "dans les limites des plafonds" |
| points; weight | points; poids | poids de confiance |
| reader weights | pondérations | "Vos pondérations" |
| decay | décroissance | |
| passivity penalty; passivity line | pénalité de passivité; seuil de passivité | |
| qualifying event | événement admissible | |
| coverage | couverture | "couverture de la recherche" |
| assessment; checked | évaluation; vérifié | statuses: événements publiés, vérifié, rien trouvé, aucune donnée publiée, pas encore vérifié, non applicable |
| event | événement | |
| standing state | état durable | |
| repeatable event | événement répétable | |
| computed quantity (the event type) | quantité calculée | the methodology's type name |
| computed value (one value of it); computed indicator | valeur calculée; indicateur calculé | |
| run of computed values | série de valeurs calculées | |
| confidence; confirmed / corroborated / reported / disputed | confiance (niveau de confiance); confirmé / corroboré / signalé / contesté | |
| primary document | document primaire | |
| evidence; source; archived copy | preuve; source; copie archivée | |
| lead | piste | |
| summary; summary line | résumé; ligne de synthèse | |
| event card; share card | fiche d'événement; carte de partage | not "vignette" |
| scorecard; scorecard mode | fiche d'évaluation; mode fiche d'évaluation, "mode fiche" where space is short (the gauge, the cards) | |
| methodology; version; release candidate | méthodologie; version; version candidate | "méthodologie v1.0.0" in running text |
| changelog | journal des modifications | |
| correction; retraction; corrections log | correction; retrait; journal des corrections | |
| right of reply | droit de réponse | outcome: "suite donnée" |
| movers | évolutions | "Évolutions des scores", "Évolutions de la semaine" |
| change (of a score) | variation | "écart" only for a difference between two settings |
| changes (the page); monthly report | changements; rapport mensuel | |
| ended (report section) | situations terminées | |
| sensitivity table; symmetry table; indicator table | table de sensibilité; table de symétrie; table des indicateurs | the methodology's named tables; "tableau" for any other table of data |
| structured tables | tableaux structurés | |
| banned words; tone lint | mots proscrits; contrôle du ton | |
| second reading; review | seconde lecture; revue | |
| build; build date | génération; date de génération | never "compilation" |
| dataset; dumps; permalink | jeu de données; téléchargements; lien daté | |
| repository; pull request; issue | dépôt; demande de fusion (pull request); ticket | |

## 4. Sources and law

| English | Français |
|---|---|
| UN General Assembly; recorded vote | Assemblée générale des Nations unies; vote enregistré |
| Security Council; draft resolution; veto | Conseil de sécurité; projet de résolution; veto (des vetos) |
| ICJ; declaration of intervention; provisional measures | CIJ (Cour internationale de Justice); déclaration d'intervention; mesures conservatoires |
| ICC; arrest warrants; Rome Statute | CPI (Cour pénale internationale); mandats d'arrêt; Statut de Rome |
| settler entities | entités de colons |
| SIPRI release; TIV | édition du SIPRI; TIV (valeurs indicatives de tendance) |
| Comtrade data release; mirror data; HS heading | publication des données; données miroir; position SH |
| OCHA FTS; flash appeal; oPt | le FTS (Service de suivi financier d'OCHA); appel éclair; TPO (Territoire palestinien occupé) |
| GNI | RNB (revenu national brut) |
| medical evacuation | évacuation sanitaire |
| sovereign fund; public pension fund | fonds souverain; fonds public de retraite |

## 5. UN M49 regions (the country page shows the region and the sub-region)

The French names of the UN M49 standard, from the French table of https://unstats.un.org/unsd/methodology/m49/overview/ (read 2026-09-30; page SHA-256 b9048114f6e7f2abda83bf03d4263c9d7cd1bd7230e3d0461025ee7839a7a1fb). The sub-regions are in `apps/web/messages/*.json` (`subregions`); the intermediate regions are listed for P-20 (scorecard peers).

| Code | English | Français |
|---|---|---|
| 002 | Africa | Afrique |
| 019 | Americas | Amériques |
| 142 | Asia | Asie |
| 150 | Europe | Europe |
| 009 | Oceania | Océanie |
| 015 | Northern Africa | Afrique septentrionale |
| 202 | Sub-Saharan Africa | Afrique subsaharienne |
| 419 | Latin America and the Caribbean | Amérique latine et Caraïbes |
| 021 | Northern America | Amérique septentrionale |
| 143 | Central Asia | Asie centrale |
| 030 | Eastern Asia | Asie orientale |
| 035 | South-eastern Asia | Asie du Sud-Est |
| 034 | Southern Asia | Asie méridionale |
| 145 | Western Asia | Asie occidentale |
| 151 | Eastern Europe | Europe orientale |
| 154 | Northern Europe | Europe septentrionale |
| 039 | Southern Europe | Europe méridionale |
| 155 | Western Europe | Europe occidentale |
| 053 | Australia and New Zealand | Australie et Nouvelle-Zélande |
| 054 | Melanesia | Mélanésie |
| 057 | Micronesia | Micronésie |
| 061 | Polynesia | Polynésie |
| 014 | Eastern Africa (intermediate) | Afrique orientale |
| 017 | Middle Africa (intermediate) | Afrique centrale |
| 018 | Southern Africa (intermediate) | Afrique australe |
| 011 | Western Africa (intermediate) | Afrique occidentale |
| 029 | Caribbean (intermediate) | Caraïbes |
| 013 | Central America (intermediate) | Amérique centrale |
| 005 | South America (intermediate) | Amérique du Sud |
