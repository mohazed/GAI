# Méthodologie

Version 1.0.0-rc.1 · projet · scores non encore affichés (mode fiche)

## Objet et point de vue

Le Gaza Accountability Index note, sur une échelle unique allant de −100 à +100, la conduite des États à l'égard de Gaza depuis le 7 octobre 2023. Chaque point provient d'un acte daté, étayé par des sources archivées ; le poids plein exige un document primaire. Le score décrit une conduite. Ce n'est pas un constat juridique.

L'indice n'est pas un tribunal. Le site n'applique jamais, en son nom propre, de qualification juridique à un gouvernement ou à un acte ; il montre la conduite et les documents, et une citation qui contient une qualification juridique est attribuée à son auteur. L'indice note l'action des gouvernements, jamais les populations. Il n'est pas exhaustif : lorsqu'un pays ne publie rien, le site montre une lacune, pas un zéro.

L'indice a été créé par Mohamed Zouad, qui le tient à jour et le signe. Il estime que la réponse de la plupart des gouvernements a été insuffisante. Le projet ne revendique pas la neutralité. Il affirme que la méthode est publiée, versionnée et reproductible, afin que ce point de vue ne puisse pas influer sur les chiffres. La déclaration complète figure sur la page [À propos](/fr/about).

## L'échelle

Les scores vont de −100 à +100 sur une échelle unique, avec les mêmes règles pour chaque pays noté. Zéro n'est pas une position neutre : il se situe dans la bande Passivité, et la bande Action commence à +1. Un pays qui n'a rien fait se situe sous zéro, du fait de la pénalité de passivité décrite dans la section « Le silence est négatif ».

### Bandes

L'échelle est divisée en cinq bandes. Chaque bande correspond à un intervalle du score entier affiché.

<!-- BEGIN generated:bands -->

| Bande | Score | Signification | Exemples de conduite |
|---|---|---|---|
| Soutien | de −100 à −51 | Rend matériellement possible la campagne militaire | Fournisseur d'armes majeur, protection politique active à l'ONU, sanctions contre la CPI |
| Facilitation | de −50 à −21 | Contribue sans jouer un rôle moteur | Composants dans la chaîne d'approvisionnement, commerce inchangé, abstention lors des votes sur le cessez-le-feu, financement de l'UNRWA supprimé |
| Passivité | de −20 à 0 | Silence ou simples gestes | Pas de commerce d'armes, mais aucune mesure non plus ; vote pour à l'ONU et ne fait rien d'autre |
| Action | de +1 à +40 | Mesures concrètes ayant un coût | Licences suspendues, aide rétablie et augmentée, déclarations formelles nommant des violations, reconnaissance de la Palestine |
| Confrontation | de +41 à +100 | Action soutenue sur plusieurs fronts | Embargo total sur les armes, participation à l'affaire devant la CIJ ou intervention dans celle-ci, sanctions contre des responsables, restrictions commerciales, coalitions menées |

<!-- END generated:bands -->

### Arrondi à l'affichage

Tous les calculs sont effectués sans arrondi intermédiaire. Le score est affiché arrondi à l'entier le plus proche, une valeur située exactement à mi-chemin étant arrondie en s'éloignant de zéro : −13,5 s'affiche −14 et +0,5 s'affiche +1. La bande se lit sur l'entier affiché, et non sur le score avant arrondi ; ainsi, un score de +0,4 s'affiche 0 et relève de la bande Passivité, tandis qu'un score de +0,5 s'affiche +1 et relève de la bande Action. Les données publiées contiennent les deux valeurs : `score` à une décimale et `score_display` en nombre entier.

### Catégories et plafonds

Les indicateurs sont regroupés en cinq catégories. Chaque catégorie a un plafond négatif et un plafond positif : les points négatifs sont plafonnés pour qu'un seul contrat d'armement ne puisse pas l'emporter sur tout le reste, et les points positifs pour que des déclarations ne puissent pas compenser des transferts de munitions. Le sous-total d'une catégorie est ramené dans les limites de ses plafonds avant l'addition des catégories.

<!-- BEGIN generated:categories -->

| Catégorie | Plafond | Notée |
|---|---|---|
| A. Armes et coopération militaire | −45 / +30 | Oui |
| B. Diplomatie et droit international | −40 / +45 | Oui |
| C. Commerce et économie | −20 / +20 | Oui |
| D. Humanitaire | −15 / +25 | Oui |
| E. Responsabilité interne | −10 / +10 | Non, expérimentale |

<!-- END generated:categories -->

### La catégorie E est expérimentale

La catégorie E (responsabilité interne) est enregistrée et affichée, présentée comme expérimentale, mais n'est pas notée dans la version 1.0. Son sous-total est calculé avec ses plafonds de −10 et de +10 et affiché sur la page pays ; il n'est jamais ajouté au score. Pour la noter, il faut une nouvelle version de la méthodologie.

### Pays notés et exclusions

L'indice note 193 entités : les États membres de l'ONU autres qu'Israël, et le Saint-Siège, État non membre observateur. Israël et la Palestine ne sont pas notés. L'échelle mesure la conduite des États tiers ; Israël est partie au conflit et la Palestine est la partie touchée, si bien qu'aucun des deux ne peut y être placé. Ni l'un ni l'autre n'a de page pays dans la version 1. Le statut d'État non membre observateur de la Palestine est mentionné sur la page [À propos](/fr/about).

Les pays sont identifiés par leur code ISO 3166-1 alpha-3 et désignés, en anglais et en français, par les noms courts de la base de données terminologique des Nations unies (UNTERM). Les régions suivent les régions et sous-régions M49 des Nations unies. Les pages pays indiquent l'appartenance au Conseil de sécurité des Nations unies (membres permanents et mandats de membre élu), à l'UE, à l'OTAN, à la Ligue arabe, à l'OCI, au G20, au G7 et aux BRICS.

### Champ : Gaza noté, Liban et Cisjordanie étiquetés

La version 1 note la conduite liée à Gaza. Chaque événement porte une ou plusieurs étiquettes de champ : `gaza`, `lebanon`, `west-bank`, `region` ou `related`. Un événement n'entre dans le score que si l'une de ses étiquettes est `gaza`. La conduite liée au Liban, à la Cisjordanie et à l'ensemble de la région est enregistrée et étiquetée dès le départ, et n'entre dans le score qu'à partir d'une version 2.0 de la méthodologie. Les actes qui relèvent d'une procédure distincte, comme l'intervention dans une autre affaire devant la Cour internationale de Justice, sont étiquetés `related` et ne sont pas notés.

L'indice note des États. Les entreprises n'y apparaissent que dans la mesure où elles sont nommées dans les documents publics qu'il cite.

### Mode fiche

Le score est calculé à chaque génération du site dès la première mise en ligne. Son affichage dépend d'un seul paramètre. Tant que l'auteur ne l'a pas activé, le site présente des fiches : événements, sources, couverture et sous-totaux par catégorie exprimés en nombres d'événements, sans score ni classement ; la page du classement liste les pays par ordre alphabétique avec leur nombre d'événements. La version 1.0.0-rc.1 est en mode fiche. Les faits sourcés sont publiés d'abord ; le chiffre agrégé suit, une fois ces faits soumis à la vérification publique.

## Règles

Trois règles définissent l'échelle. Deux autres règles encadrent les déclarations et la recherche.

### Des actes, pas des promesses

L'annonce d'un réexamen ne rapporte aucun point ; une licence suspendue en rapporte. Les points proviennent de décisions, de lois, de votes, de livraisons, de financements et d'actes formels attestés par des documents officiels. L'indicateur C1 note le réexamen formel d'un accord commercial ou d'association, et non l'annonce qu'un tel réexamen pourrait être ouvert. Une déclaration n'est notée que si elle est formelle, figure dans un compte rendu officiel et répond à la définition de l'indicateur B9 ou B10.

### Le silence est négatif

Un pays qui n'a aucun événement admissible dans les catégories B, C ou D au cours des 365 derniers jours reçoit la pénalité de passivité : 15 points sont retranchés de son score. Un pays qui n'a aucun événement obtient donc −15, et non 0. Les votes à l'Assemblée générale des Nations unies (B1) ne sont pas admissibles : quel que soit le sens des votes d'un pays, ceux-ci ne mettent pas fin à la pénalité. Au regard de l'ampleur des dommages à Gaza, la méthodologie traite l'inaction comme un choix. La pénalité est décrite plus bas, dans la section « Passivité ». Les tables de sensibilité, qui montrent son effet sur le classement, sont calculées à chaque génération du site et publiées une fois les scores affichés.

### Le poids matériel l'emporte sur le poids symbolique

Vendre des munitions coûte plus de points qu'une déclaration n'en rapporte. Les livraisons d'armes peuvent à elles seules atteindre −40 (A1), et un embargo complet sur les armes, dans les deux sens, rapporte +25 (A7) ; l'ensemble des déclarations formelles est plafonné à +10 (B9) et à −10 (B10). Les points, les plafonds et les poids sont publics et figurent dans la table des indicateurs.

### Les déclarations sont notées, sous plafond

Les déclarations formelles sont notées : +2 ou +5 pour une déclaration qui appelle à un cessez-le-feu ou nomme des violations (B9), −5 pour une déclaration qui exprime un soutien inconditionnel ou nie des violations documentées (B10), avec des plafonds d'indicateur de +10 et de −10. Sans leur prise en compte, les États qui ne font pas commerce d'armes et disposent de budgets d'aide modestes auraient peu de moyens de dépasser zéro ; les plafonds maintiennent le poids des paroles en deçà de celui des actes. Une déclaration ne compte que si elle est accompagnée de la citation exacte, du nom de son auteur, de sa date et de la transcription officielle ou de la vidéo officielle horodatée. Une paraphrase dans la presse ne suffit pas. Les déclarations des porte-parole ne sont pas notées, et les publications sur les réseaux sociaux ne le sont pas non plus, sauf s'il en existe une transcription officielle.

### Le même protocole pour chaque pays

Chaque pays fait l'objet d'une recherche selon le même protocole, qui consacre le même effort aux indicateurs positifs et négatifs et consigne ce qui a été vérifié lorsque rien n'est trouvé. Les résumés d'événements suivent un modèle unique, `{Acteur} {verbe au passé} {objet}{, précision}.`, sans adjectif ; un contrôle exécuté à chaque génération du site rejette les résumés qui contiennent un mot de la liste publiée `banned-words.txt` ou un point d'exclamation, qui dépassent 200 caractères ou qui ne commencent pas par l'acteur. Les événements positifs et négatifs ont la même mise en page. La ligne de synthèse de chaque vignette pays est produite à partir du même modèle.

## Table des indicateurs

L'indice utilise 34 indicateurs répartis en cinq catégories. Les 31 indicateurs des catégories A à D sont notés ; les 3 indicateurs de la catégorie E sont enregistrés et affichés, mais ne sont pas notés dans la version 1.0. Chaque ligne indique les points, le type d'événement, le plafond et la règle de cumul propres à l'indicateur, les sources primaires et la cadence de mise à jour ; les règles de preuve sont énumérées sous la table de chaque catégorie. Les noms et les valeurs en points suivent la table des indicateurs du cahier des charges du projet, précisée par les définitions ci-dessous.

<!-- BEGIN generated:indicators -->

### A. Armes et coopération militaire (plafond −45 / +30)

| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Cadence |
|---|---|---|---|---|---|---|
| A1 | Armes conventionnelles majeures livrées à Israël, pondérées par la part dans les importations d'Israël | de −40 à 0 (formule a1) | quantité calculée | — | [Base de données du SIPRI sur les transferts d'armes](https://www.sipri.org/databases/armstransfers) | Annuelle (mars) |
| A2 | Munitions, composants, biens militaires à double usage exportés (SH 93, 8710, 8802, 8526) | de −25 à 0 (formule a2) | quantité calculée | — | Données douanières de l'Autorité fiscale israélienne ; UN Comtrade ; Registres nationaux de licences ; Enquêtes d'ONG | Trimestrielle |
| A3 | Participation à la chaîne d'approvisionnement du F-35 | −15 | état durable | — | Rapports du Rapporteur spécial des Nations unies ; Informations publiées par Lockheed sur ses fournisseurs | À chaque changement |
| A4 | Armes achetées à Israël (nouveaux contrats depuis octobre 2023) | de −15 à 0 (formule a4) | quantité calculée | — | SIPRI ; Avis nationaux de marchés publics | Annuelle |
| A5 | Coopération militaire : exercices conjoints, partage de renseignements, stationnement, transit d'armes par les ports ou l'espace aérien | −5 par instance | événement répétable | plafond −15 | Communiqués des ministères de la Défense ; Journalisme d'investigation | À chaque événement |
| A6 | Licences d'exportation suspendues (suspension partielle) | +10 | état durable | remplacé par A7 | Décision gouvernementale ; Journal officiel | À chaque événement |
| A7 | Embargo total sur les armes, dans les deux sens, en vigueur | +25 | état durable | remplace A6 | Loi ou décret | À chaque événement |
| A8 | Transit refusé aux cargaisons d'armes (ports, espace aérien, navires sous pavillon national) | +5 par instance | événement répétable | plafond +10 | Autorité portuaire ; Déclaration gouvernementale | À chaque événement |

**Règles de preuve**

- **A1** — Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Chaque ligne de `data/structured/sipri_deliveries.csv` cite une source de type dataset qui archive la publication du SIPRI.
- **A2** — Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Les valeurs proviennent des déclarations du pays lui-même à UN Comtrade ; à défaut, ou si elles sont confidentielles, des données miroir des importations d'Israël par origine ; si les deux manquent, A2 est « pas de données », jamais zéro. Les positions 8526 et 8802 n'entrent qu'avec un registre de licences, une réponse parlementaire ou une enquête publiée citant le code douanier. Chaque ligne de `data/structured/comtrade_a2.csv` cite une source de type dataset qui archive l'origine des données.
- **A3** — Un document établissant que des entreprises du pays sont des fournisseurs de rang 1 ou de rang 2 de pièces ou de maintenance pour le programme F-35 : documents officiels du programme, déclarations de ministères nationaux ou rapports du Rapporteur spécial des Nations unies. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **A4** — Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Chaque ligne de `data/structured/sipri_orders.csv` cite une source de type dataset qui archive la publication du SIPRI.
- **A5** — Une instance confirmée par événement : un exercice nommé, un transit documenté (escale, autorisation de survol), un accord de stationnement public, ou une confirmation officielle d'un partage de renseignements lié à la campagne de Gaza. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **A6** — La décision gouvernementale ou la publication au journal officiel suspendant ou refusant une catégorie de licences à destination d'Israël, ou la décision de justice ayant le même effet. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **A7** — La loi ou le décret, couvrant à la fois les exportations vers Israël et les importations en provenance d'Israël. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **A8** — Une décision de l'autorité portuaire ou une déclaration gouvernementale refusant le transit. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.

### B. Diplomatie et droit international (plafond −40 / +45)

| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Cadence |
|---|---|---|---|---|---|---|
| B1 | Votes à l'Assemblée générale des Nations unies sur le cessez-le-feu à Gaza, l'UNRWA, le statut de la Palestine | Pour +3 / Abstention −2 / Contre −5 / Absent −2 | événement répétable | — | [Relevés des votes de la Bibliothèque numérique des Nations unies](https://digitallibrary.un.org) | À chaque vote |
| B2 | Veto au Conseil de sécurité des Nations unies contre une résolution de cessez-le-feu (membres uniquement) | −20 | événement répétable | — | Documents du Conseil de sécurité des Nations unies | À chaque vote |
| B3 | Affaire de génocide devant la CIJ : déclaration d'intervention déposée | +15 | état durable | — | Communiqués de presse de la CIJ | À chaque événement |
| B4 | Position formelle rejetant les mesures conservatoires de la CIJ ou s'y opposant | −15 | événement répétable | — | Déclaration gouvernementale | À chaque événement |
| B5 | CPI : engagement public à exécuter les mandats d'arrêt | +8 | état durable | la dernière position entre B5 et B6 prévaut | Déclaration gouvernementale | À chaque événement |
| B6 | CPI : refus déclaré d'exécuter les mandats, ou accueil d'un responsable visé par un mandat | −10 | état durable | la dernière position entre B5 et B6 prévaut | Déclaration gouvernementale ; Relevés des visites | À chaque événement |
| B7 | Sanctions contre des juges ou des procureurs de la CPI | −20 | état durable | — | Liste officielle des sanctions | À chaque événement |
| B8 | Reconnaissance de l'État de Palestine après octobre 2023 | Reconnaissance après le 7 octobre 2023 +8 / Reconnaissance préexistante +3 | état durable | seul le palier en vigueur le plus élevé compte | Ministère des Affaires étrangères | À chaque événement |
| B9 | Le chef de gouvernement ou le ministre des Affaires étrangères nomme formellement des violations, appelle à un cessez-le-feu ou à la fin du blocus | Appel formel au cessez-le-feu ou à la fin du blocus +2 / Nomme des violations précises ou emploie une qualification juridique +5, par instance | événement répétable | plafond +10 | Transcription officielle | À chaque événement |
| B10 | Le chef de gouvernement déclare un soutien inconditionnel ou nie des violations documentées | −5 par instance | événement répétable | plafond −10 | Transcription officielle | À chaque événement |
| B11 | Sanctions contre des ministres israéliens ou des entités de colons | Sanctions contre des ministres israéliens +10 / Sanctions contre des entités de colons +5 | état durable | un événement par palier, les paliers s'additionnent | Liste officielle des sanctions | À chaque événement |
| B12 | Ambassadeur rappelé / niveau des relations abaissé / relations rompues | Ambassadeur rappelé +5 / Niveau des relations abaissé +8 / Relations rompues +10 | état durable | seul le palier en vigueur le plus élevé compte | Ministère des Affaires étrangères | À chaque événement |

**Règles de preuve**

- **B1** — Généré à partir de `data/structured/unga_votes.csv`, filtré par `votes.yaml` ; jamais rédigé à la main. Chaque ligne de vote cite une source de type dataset qui archive le relevé de vote des Nations unies, et chaque vote retenu dans `votes.yaml` cite comme source officielle le communiqué de presse archivé des Nations unies.
- **B2** — Généré à partir de `data/structured/unsc_vetoes.csv` (lignes avec `ceasefire: true`) ; jamais rédigé à la main. Chaque ligne cite une source de type dataset qui archive le relevé du vote au Conseil de sécurité, par exemple la liste des vetos des Nations unies ou le procès-verbal de la séance.
- **B3** — La déclaration d'intervention telle qu'enregistrée par la CIJ, et son texte : le sens de son argumentation décide entre B3 et B4. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B4** — La déclaration officielle ou l'acte formel, ou le texte de la déclaration d'intervention plaidant contre l'interprétation du demandeur ; une remarque à la presse sans acte formel ne suffit pas. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B5** — Une déclaration officielle du chef de gouvernement, du ministre des Affaires étrangères ou du ministre de la Justice sur l'exécution des mandats du 21 novembre 2024 ; une autorisation de survol sans position déclarée sur les mandats est une piste. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B6** — Une déclaration officielle du chef de gouvernement, du ministre des Affaires étrangères ou du ministre de la Justice sur les mandats, le relevé officiel d'une visite d'une personne visée par un mandat accueillie sans être arrêtée, ou l'acte officiel du retrait du Statut de Rome ; une autorisation de survol sans position déclarée sur les mandats est une piste. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B7** — La liste officielle des sanctions. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B8** — Généré à partir de `data/structured/recognitions.csv` ; jamais rédigé à la main. Chaque ligne donne la date d'effet de la reconnaissance et cite la déclaration officielle archivée du gouvernement qui reconnaît (ou le document de l'ONU qui l'enregistre).
- **B9** — La citation exacte, l'orateur, la date et la transcription officielle ou la vidéo officielle avec horodatage ; les paraphrases de presse ne suffisent pas. L'événement porte `actor.name` et cite une source de type official ou official-video ; la citation figure mot pour mot dans `archive/text/{source}.txt` après normalisation (espaces, forme Unicode NFC, caractères invisibles), y compris pour une vidéo, dont la transcription y est conservée. Même orateur, même jour : un seul événement. L'orateur est le chef de gouvernement ou le ministre des Affaires étrangères ; les déclarations de porte-parole ne sont pas notées.
- **B10** — La citation exacte, l'orateur, la date et la transcription officielle ou la vidéo officielle avec horodatage ; les paraphrases de presse ne suffisent pas. L'événement porte `actor.name` et cite une source de type official ou official-video ; la citation figure mot pour mot dans `archive/text/{source}.txt` après normalisation (espaces, forme Unicode NFC, caractères invisibles), y compris pour une vidéo, dont la transcription y est conservée. Même orateur, même jour : un seul événement. L'orateur est le chef de gouvernement ; les déclarations de porte-parole ne sont pas notées.
- **B11** — La liste officielle des sanctions. Une inscription au niveau de l'UE ne compte que pour un État membre qui a voté pour elle. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **B12** — L'annonce du ministère des Affaires étrangères. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.

### C. Commerce et économie (plafond −20 / +20)

| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Cadence |
|---|---|---|---|---|---|---|
| C1 | Accord commercial ou d'association suspendu ou formellement réexaminé | Réexamen formel +4 / Suspension +10 | état durable | seul le palier en vigueur le plus élevé compte | Décision gouvernementale ou de l'UE | À chaque événement |
| C2 | Nouvel accord commercial, d'investissement ou de coopération signé avec Israël depuis octobre 2023 | −10 | état durable | — | Registres des traités ; Communiqués ministériels | À chaque événement |
| C3 | Commerce bilatéral avec Israël maintenu au niveau d'avant-guerre ou au-dessus | de −8 à 0 (formule c3) | quantité calculée | — | UN Comtrade ; DOTS du FMI | Annuelle |
| C4 | Interdiction des produits des colonies (étiquetage seul +2) | Étiquetage seul +2 / Interdiction des produits des colonies +5 | état durable | seul le palier en vigueur le plus élevé compte | Réglementation douanière | À chaque événement |
| C5 | Désinvestissement d'un fonds souverain ou d'un fonds public de retraite de sociétés nommément désignées | +5 | événement répétable | — | Décisions des conseils d'éthique des fonds | À chaque événement |
| C6 | Exclusion des entreprises impliquées des marchés publics | +3 | événement répétable | — | Règles de passation des marchés publics | À chaque événement |

**Règles de preuve**

- **C1** — La décision gouvernementale ou de l'UE ; pour une décision au niveau de l'UE, les procès-verbaux officiels ou les déclarations ministérielles attestant le soutien de l'État au Conseil. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **C2** — L'accord signé, tiré d'un registre des traités ou d'un communiqué ministériel. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **C3** — Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Les valeurs proviennent des déclarations du pays lui-même, à défaut des données miroir d'Israël. Chaque ligne de `data/structured/comtrade_c3.csv` cite une source de type dataset qui archive l'origine des données.
- **C4** — La réglementation douanière. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **C5** — La décision du fonds ou de la banque centrale, un événement par série de décisions. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **C6** — La règle de passation des marchés publics prévoyant l'exclusion. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.

### D. Humanitaire (plafond −15 / +25)

| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Cadence |
|---|---|---|---|---|---|---|
| D1 | Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant | de 0 à +12 (formule d1) | quantité calculée | — | [API du Service de suivi financier (FTS) d'OCHA](https://fts.unocha.org) | Mensuelle |
| D2 | Financement de l'UNRWA suspendu | −10 | état durable | — | Tableaux des donateurs de l'UNRWA | À chaque événement |
| D3 | Financement de l'UNRWA rétabli / augmenté au-delà du niveau de 2022 | Financement rétabli +5 / Financement augmenté au-delà du niveau de 2022 +8 | état durable | seul le palier en vigueur le plus élevé compte | Tableaux des donateurs de l'UNRWA | À chaque événement |
| D4 | Évacuations sanitaires accueillies, hôpitaux de campagne déployés | +5 | événement répétable | — | OMS ; Ministère de la Santé | À chaque événement |
| D5 | Voie d'accès par visa ou au statut de réfugié ouverte aux Gazaouis | +5 | événement répétable | — | Réglementation de l'immigration | À chaque événement |

**Règles de preuve**

- **D1** — Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Les lignes de `data/structured/fts_funding.csv` (FTS, type d'organisation donatrice Government) et de `data/structured/gni.csv` (méthode Atlas de la Banque mondiale) citent des sources de type dataset qui archivent les réponses des API.
- **D2** — L'annonce gouvernementale de la suspension, ou les tableaux des donateurs de l'UNRWA ; l'événement prend fin à la reprise annoncée. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **D3** — Les tableaux des donateurs de l'UNRWA ; le palier « augmenté » exige que la contribution annuelle dépasse, dans ces tableaux, la contribution de 2022 en dollars US nominaux. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **D4** — Un document de l'OMS ou du ministère de la Santé sur le programme, un événement par programme. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **D5** — La réglementation de l'immigration, un événement par instrument juridique. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.

### E. Responsabilité interne (plafond −10 / +10) · expérimentale · non notée

| ID | Indicateur | Points | Type | Plafond de l'indicateur et cumul | Sources primaires | Cadence |
|---|---|---|---|---|---|---|
| E1 | Enquête ou poursuites nationales visant des ressortissants ou des entreprises pour des actes commis à Gaza | +5 | événement répétable | — | Annonces du parquet ; Actes de procédure judiciaire | À chaque événement |
| E2 | Interdictions de manifestations ou de symboles de solidarité avec la Palestine | −5 | événement répétable | — | Décrets du ministère de l'Intérieur ; Décisions de justice | À chaque événement |
| E3 | Plaintes fondées sur la compétence universelle acceptées pour enquête | +5 | événement répétable | — | Dossiers judiciaires | À chaque événement |

**Règles de preuve**

- **E1** — Une annonce du parquet ou un acte de procédure judiciaire. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **E2** — Le décret du ministère de l'Intérieur ou la décision de justice. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.
- **E3** — Le dossier judiciaire acceptant la plainte pour enquête. Une preuve est un document primaire (acte officiel, communiqué gouvernemental, pièce de procédure judiciaire, ligne de jeu de données). Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit.

<!-- END generated:indicators -->

### Plafonds par indicateur et règles de cumul

Certains indicateurs ont leur propre plafond, ou une règle qui fixe la manière dont leurs événements se combinent. Ces règles s'appliquent à la somme des contributions de l'indicateur, avant le plafond de la catégorie.

| Indicateur | Règle |
|---|---|
| A5 coopération militaire | −5 par cas confirmé ; la somme est plafonnée à −15 |
| A6 et A7 mesures sur les exportations d'armes | A7 (embargo complet dans les deux sens, +25) remplace A6 (suspension partielle, +10) pour un même pays ; les deux ne s'additionnent pas |
| A8 transit refusé | +5 par cas ; la somme est plafonnée à +10 |
| B1 votes à l'Assemblée générale des Nations unies | pas de plafond d'indicateur ; le plafond de la catégorie s'applique |
| B5 et B6 mandats d'arrêt de la CPI | la dernière position formelle du pays prévaut ; B5 et B6 ne s'additionnent pas |
| B8 reconnaissance de la Palestine | un seul état durable : +8 pour une reconnaissance postérieure au 7 octobre 2023, sinon +3 pour une reconnaissance antérieure, appliqué à partir du 7 octobre 2023 |
| B9 déclarations formelles | +2 ou +5 par déclaration ; la somme est plafonnée à +10 |
| B10 soutien inconditionnel ou négation de violations | −5 par déclaration ; la somme est plafonnée à −10 |
| B11 sanctions | les sanctions visant des ministres (+10) et celles visant des entités de colons (+5) sont des états durables distincts ; les deux peuvent s'appliquer en même temps |
| B12 relations diplomatiques | un seul état durable : seule compte la mesure en vigueur la plus sévère (rappel de l'ambassadeur +5, abaissement du niveau des relations +8, rupture des relations +10) ; les mesures ne s'additionnent pas |
| C1 accord commercial ou d'association | le réexamen (+4) et la suspension (+10) ne s'additionnent pas ; la suspension remplace le réexamen |
| C4 produits des colonies | l'étiquetage (+2) et l'interdiction (+5) ne s'additionnent pas ; l'interdiction remplace l'étiquetage |
| D3 financement de l'UNRWA | le rétablissement (+5) et l'augmentation (+8) ne s'additionnent pas ; l'augmentation remplace le rétablissement |

### Définitions par indicateur

- **A1 et A4** utilisent les valeurs indicatives de tendance (TIV) de l'édition annuelle de la base de données du SIPRI sur les transferts d'armes. A4 ne compte que les contrats signés le 7 octobre 2023 ou après : des commandes nouvelles, et non les livraisons de commandes passées avant la guerre. Les deux sont calculés (voir la section « Indicateurs calculés »).
- **A2** compte intégralement le chapitre 93 (armes et munitions) et la position 8710 (chars et véhicules blindés) du Système harmonisé (SH). Les positions 8526 (appareils de radar et de radiotélécommande) et 8802 (aéronefs) du SH ne comptent que si un registre des licences, une réponse parlementaire ou une enquête publiée citant le code douanier confirme que le flux est militaire, car ces deux positions couvrent surtout des biens civils.
- **A3** est un état durable pour les pays dont des entreprises sont identifiées comme fournisseurs de rang 1 ou de rang 2 de pièces ou de services de maintenance du programme F-35 dans des documents officiels du programme, des déclarations de ministères nationaux ou des rapports du Rapporteur spécial des Nations unies. Il vaut −15 tant qu'il est en vigueur. L'arrêt des exportations de pièces de F-35 vers Israël, par décision judiciaire ou gouvernementale, met fin à cet état durable et constitue, par ailleurs, un événement A6.
- **A5** ne compte que les cas confirmés : un exercice désigné par son nom, un transit documenté (escale, autorisation de survol), un accord public d'utilisation de bases, ou une confirmation officielle d'un partage de renseignement lié à la campagne militaire à Gaza. Les arrangements courants, bilatéraux ou dans le cadre de l'OTAN, antérieurs à la guerre ne constituent pas des cas, sauf s'ils sont activés pour la campagne.
- **A6** correspond à toute décision gouvernementale qui suspend ou refuse une catégorie de licences d'exportation vers Israël, ou à toute décision de justice ayant le même effet. Il reste en vigueur jusqu'à la levée de la suspension.
- **A7** correspond à une loi ou à un décret qui couvre à la fois les exportations d'armes vers Israël et les importations d'armes en provenance d'Israël.
- **B1** compte les votes en séance plénière de l'Assemblée générale des Nations unies ; voir plus bas la section « Votes retenus de l'Assemblée générale des Nations unies ».
- **B2** compte tout veto opposé par un membre permanent, quel qu'il soit, à un projet de résolution du Conseil de sécurité dont le dispositif appelle à un cessez-le-feu, à une trêve ou à une pause humanitaire, à raison de −20 par veto. Les vetos opposés à des projets portant sur d'autres sujets, comme l'admission de la Palestine à l'ONU (18 avril 2024), et les vetos opposés à des amendements sont enregistrés et ne sont pas notés. B2 ne s'applique pas aux États qui n'ont siégé au Conseil de sécurité à aucun moment depuis le 7 octobre 2023.
- **B3** compte une intervention déposée au titre de l'article 62 ou 63 du Statut de la Cour internationale de Justice (CIJ) dans l'affaire 192 (Afrique du Sud c. Israël, au titre de la Convention sur le génocide), à compter de la date à laquelle la Cour l'enregistre, et seulement lorsque l'interprétation de la Convention exposée dans la déclaration va dans le sens de la lecture de l'État demandeur ou des ordonnances en indication de mesures conservatoires de la Cour (obligation de prévenir, portée de l'intention, caractère contraignant des ordonnances). C'est un état durable ; un retrait y met fin à la date du retrait. Une déclaration qui plaide pour une lecture plus restrictive, contre l'État demandeur, est un événement B4, et non B3. L'intervention dans une autre affaire est étiquetée `related` et n'est pas notée.
- **B4** exige une déclaration officielle rejetant les ordonnances en indication de mesures conservatoires de la CIJ ou leur caractère contraignant, un acte formel en ce sens, ou une déclaration d'intervention déposée contre l'interprétation de l'État demandeur (voir B3). Une critique du fond de l'affaire exprimée devant la presse, sans acte formel, n'est pas un événement B4.
- **B5 et B6** portent sur les mandats d'arrêt délivrés par la Cour pénale internationale le 21 novembre 2024. B5 est une déclaration officielle par laquelle le chef de gouvernement ou le ministre des Affaires étrangères ou de la Justice s'engage à les exécuter. B6 est un refus déclaré de les exécuter, l'accueil en visite officielle d'une personne visée par un mandat sans l'arrêter, ou un retrait du Statut de Rome depuis le 7 octobre 2023. L'autorisation d'un survol est une piste, et non un événement, sauf si elle s'accompagne d'une position déclarée sur les mandats. B5 et B6 sont des états durables qui se remplacent l'un l'autre dans le temps : la dernière position formelle prévaut.
- **B7** est un état durable tant que des sanctions visant des juges ou des procureurs de la CPI sont en vigueur.
- **B8** est un état durable pour la reconnaissance de l'État de Palestine : +8 pour une reconnaissance postérieure au 7 octobre 2023, +3 pour une reconnaissance antérieure.
- **B9** exige une déclaration formelle du chef de gouvernement ou du ministre des Affaires étrangères, avec la citation exacte, l'auteur, la date et la transcription officielle ou la vidéo officielle horodatée : +2 pour un appel formel à un cessez-le-feu ou à la levée du blocus ; +5 lorsque la déclaration nomme des violations précises (par exemple l'utilisation de la famine comme méthode de guerre, les attaques contre des hôpitaux, le déplacement forcé) ou emploie une qualification juridique. Les déclarations d'un même auteur le même jour forment un seul événement.
- **B10** exige une déclaration du chef de gouvernement exprimant un soutien inconditionnel ou niant des violations documentées, avec les mêmes preuves que pour B9, à raison de −5 par déclaration. Les déclarations d'un même auteur le même jour forment un seul événement.
- **B11** compte les inscriptions sur des listes de sanctions décidées par le pays lui-même ou, pour les États membres de l'UE, les inscriptions au niveau de l'UE que l'État a approuvées par son vote. Un État qui a bloqué une inscription de l'UE n'a pas d'événement B11 ; le blocage est consigné en note et n'entre pas dans le score.
- **B12** est un état durable ; seule compte la mesure en vigueur la plus sévère.
- **C1** compte la suspension ou le réexamen formel d'un accord commercial ou d'association avec Israël. Pour les États membres de l'UE, un réexamen ou une suspension de l'accord d'association au niveau de l'UE compte pour chaque État membre qui l'a soutenu au Conseil, d'après les procès-verbaux officiels ou les déclarations ministérielles ; les États qui s'y sont opposés n'ont pas d'événement C1.
- **C2** est un état durable pour un nouvel accord commercial, d'investissement ou de coopération signé avec Israël le 7 octobre 2023 ou après.
- **C3** utilise le total des échanges de marchandises avec Israël (exportations plus importations) sur les 12 mois glissants, comparé à celui de l'année civile 2022 (voir la section « Indicateurs calculés »).
- **C4** est un état durable pour une interdiction des produits des colonies (+5) ou pour une simple obligation d'étiquetage (+2).
- **C5** compte les décisions par lesquelles un fonds souverain, un fonds de pension public ou une banque centrale exclut des entreprises en raison de leur conduite à Gaza ou dans les territoires occupés, à raison d'un événement par série de décisions.
- **C6** compte les règles ou décisions de marchés publics ayant un effet juridique qui excluent des entreprises impliquées.
- **D1** est calculé à partir des données du service de suivi financier d'OCHA, le FTS (voir la section « Indicateurs calculés »).
- **D2** est un état durable, de l'annonce d'une suspension du financement de l'UNRWA jusqu'à l'annonce de sa reprise.
- **D3** s'applique à partir de la date de reprise du financement ; « augmenté » signifie que la contribution annuelle dépasse celle de 2022 en dollars des États-Unis, en valeur nominale, d'après les tableaux des donateurs de l'UNRWA.
- **D4** compte un événement par programme (déploiement d'un hôpital de campagne, programme d'évacuation sanitaire), et non par patient.
- **D5** compte un événement par instrument juridique qui ouvre une voie d'accès par visa ou au statut de réfugié à des personnes venant de Gaza.
- **E1 à E3** sont enregistrés avec les points indiqués dans la table et exclus du score dans la version 1.0.

### Votes retenus de l'Assemblée générale des Nations unies

B1 compte les résolutions et décisions de l'Assemblée générale des Nations unies adoptées en séance plénière par vote enregistré le 7 octobre 2023 ou après, et dont l'objet est Gaza (cessez-le-feu, trêve, accès humanitaire), l'UNRWA, ou le statut et les droits de la Palestine. Une décision adoptée par vote enregistré compte au même titre qu'une résolution ; l'approbation de la Déclaration de New York, le 12 septembre 2025, a pris la forme de la décision A/DEC/80/506. Les votes en commission, les votes de procédure et les votes sur des amendements sont exclus. Chaque vote est noté comme suit : pour +3, abstention −2, contre −5, absent −2 ; une mention formelle « n'a pas participé » compte comme une absence. Chaque vote retenu figure dans la liste avec sa cote, sa date, son objet et une justification d'inclusion d'une ligne, et l'ajout d'un vote à la liste constitue une nouvelle version mineure. La liste ci-dessous est remplie à partir de `votes.yaml` et reste vide tant que les votes n'ont pas été vérifiés dans les relevés des Nations unies.

<!-- BEGIN generated:votes -->

| Cote | Date | Objet | Pour–contre–abstention | Justification |
|---|---|---|---|---|
| A/RES/ES-10/21 | 27 octobre 2023 | Gaza | 120–14–45 | Demande une trêve humanitaire immédiate, durable et soutenue à Gaza et l'accès humanitaire (objet : Gaza). |
| A/RES/ES-10/22 | 12 décembre 2023 | Gaza | 153–10–23 | Exige un cessez-le-feu humanitaire immédiat à Gaza (objet : Gaza). |
| A/RES/ES-10/23 | 10 mai 2024 | Statut de la Palestine | 143–9–25 | Considère que la Palestine remplit les conditions pour devenir Membre de l'ONU et étend ses droits à l'Assemblée (objet : statut et droits de la Palestine). |
| A/RES/ES-10/24 | 18 septembre 2024 | Statut de la Palestine | 124–14–43 | Exige la fin de la présence d'Israël dans le Territoire palestinien occupé, Gaza comprise, à la suite de l'avis consultatif de la CIJ (objet : statut et droits de la Palestine). |
| A/RES/ES-10/25 | 11 décembre 2024 | UNRWA | 159–9–11 | Appuie le mandat de l'UNRWA et ses opérations, Gaza comprise (objet : UNRWA). |
| A/RES/ES-10/26 | 11 décembre 2024 | Gaza | 158–9–13 | Exige un cessez-le-feu immédiat, inconditionnel et permanent à Gaza (objet : Gaza). |
| A/RES/79/232 | 19 décembre 2024 | UNRWA | 137–12–22 | Demande à la CIJ un avis sur les obligations d'Israël envers l'UNRWA, l'ONU et l'aide humanitaire dans le Territoire palestinien occupé ; un texte nouveau issu de la guerre (objet : UNRWA). |
| A/RES/ES-10/27 | 12 juin 2025 | Gaza | 149–12–19 | Exige un cessez-le-feu immédiat, inconditionnel et permanent et la fin du blocus de Gaza (objet : Gaza). |
| A/DEC/80/506 | 12 septembre 2025 | Statut de la Palestine | 142–10–12 | Approuve la Déclaration de New York sur le règlement pacifique de la question de Palestine et la solution des deux États ; une décision adoptée par vote enregistré (objet : statut et droits de la Palestine). |
| A/RES/80/1 | 19 septembre 2025 | Statut de la Palestine | 145–5–6 | Permet à l'État de Palestine de participer à la session par déclaration préenregistrée après le refus de visas (objet : statut et droits de la Palestine). |
| A/RES/80/78 | 5 décembre 2025 | UNRWA | 151–10–14 | Renouvelle le mandat de l'UNRWA jusqu'au 30 juin 2029, le premier renouvellement depuis la guerre (objet : UNRWA). |
| A/RES/80/116 | 12 décembre 2025 | UNRWA | 139–12–19 | Accueille l'avis consultatif de la CIJ du 22 octobre 2025 sur les obligations d'Israël envers l'UNRWA et l'aide humanitaire (objet : UNRWA). |

<!-- END generated:votes -->

## Formule

Le score est une somme de sous-totaux de catégorie plafonnés, recalculée pour chaque date à partir de la table des événements, selon une formule publiée et sans aucune correction manuelle.

$$
\begin{aligned}
\mathrm{sub}_k(c,t) &= \sum_{e \in E_k(c)} p_e \cdot w_e \cdot d_e(t) \qquad \text{(après les plafonds par indicateur)} \\
\mathrm{clip}_k(c,t) &= \mathrm{clip}\big(\mathrm{sub}_k(c,t),\ \mathrm{cap}_k^{-},\ \mathrm{cap}_k^{+}\big) \qquad k \in \{A, B, C, D\} \\
\mathrm{raw}(c,t) &= \sum_{k \in \{A, B, C, D\}} \mathrm{clip}_k(c,t) - \mathrm{passivity}(c,t) \\
S(c,t) &= \mathrm{clip}\big(\mathrm{raw}(c,t),\ -100,\ +100\big)
\end{aligned}
$$

Ici, c désigne le pays et t la date. E_k(c) est l'ensemble des événements publiés du pays c dans la catégorie k qui portent l'étiquette de champ `gaza`. Pour chaque événement e, p_e désigne ses points, w_e son poids de confiance et d_e(t) son facteur temporel : la décroissance d pour un événement répétable ; 1 ou 0 pour un état durable ou une quantité calculée, selon que l'événement est en vigueur ou non à la date t. La fonction clip(x, a, b) borne x entre a et b. Les termes cap_k⁻ et cap_k⁺ désignent les plafonds de la catégorie. Le terme passivity(c,t) vaut 15 lorsque la pénalité de passivité s'applique, et 0 sinon.

En clair : chaque événement apporte ses points, multipliés par son poids de confiance et par son facteur temporel. Les contributions sont additionnées par indicateur, puis les plafonds par indicateur et les règles de cumul sont appliqués. Les totaux des indicateurs sont additionnés par catégorie, et chaque total de catégorie est ramené dans les limites de ses plafonds. Les totaux ainsi bornés des catégories A à D sont additionnés, et la pénalité de passivité est soustraite lorsqu'elle s'applique. Le résultat est ramené dans l'intervalle allant de −100 à +100. La catégorie E est calculée de la même manière, avec ses plafonds de −10 et de +10, et affichée sur la page pays ; elle n'entre jamais dans le score.

### Exemple chiffré

Cet exemple est illustratif. Le pays est fictif et les chiffres ne sont pas des données. Tous les événements sont au niveau de confiance confirmé (poids 1,0). Les valeurs sont affichées à une décimale ; les calculs sont effectués sans arrondi intermédiaire.

| Catégorie | Contributions | Sous-total après plafond |
|---|---|---|
| A | A1 −22,0 (s = 0,3025 ; −40 × √0,3025), A3 −15, A6 +10 | −27 (dans la limite de −45) |
| B | B1 +3, +3 et −2 × 0,8007 (décroissance, 462 jours après le vote) = −1,6 ; B10 −5 ; B5 +8 | +7,4 |
| C | C3 −5 | −5 |
| D | D1 +6 ; D2 terminé, 0 ; D3 +5 | +11 |
| E | aucune | non additionné |

Le pays a des événements admissibles au cours des 365 derniers jours ; aucune pénalité de passivité ne s'applique donc. raw = −27 + 7,4 − 5 + 11 = −13,6. S = −13,6, affiché −14, dans la bande Passivité.

### Pondérations réglables par le lecteur

Le lecteur peut fixer, pour chacune des catégories A à D, une pondération w_k comprise entre 0 et 2 ; la valeur par défaut est 1. Les pondérations multiplient le sous-total plafonné de chaque catégorie. Les événements ne changent pas.

$$
S_{\text{lecteur}}(c,t) = \mathrm{clip}\Big(\sum_{k \in \{A, B, C, D\}} w_k \cdot \mathrm{clip}_k(c,t) - \mathrm{passivity}(c,t),\ -100,\ +100\Big), \qquad w_k \in [0, 2]
$$

Le résultat est calculé dans le navigateur du lecteur à partir des sous-totaux plafonnés publiés pour chaque pays et de la mention indiquant si la pénalité de passivité s'applique. Le lien vers une vue pondérée contient les pondérations sous la forme `?w=A,B,C,D`, avec une décimale par valeur.

## Types d'événements et décroissance

Chaque indicateur a un seul type d'événement, et chaque événement prend le type de son indicateur.

- **État durable.** Il apporte ses points, multipliés par son poids de confiance, à chaque date comprise entre sa date de début, incluse, et sa date de fin, exclue. Un événement sans date de fin est toujours en vigueur. États durables : A3, A6, A7, B3, B5, B6, B7, B8, B11, B12, C1, C2, C4, D2, D3.
- **Événement répétable.** Il apporte ses points, multipliés par son poids de confiance et par la décroissance d(Δ), où Δ est le nombre de jours entiers écoulés entre la date de l'événement et la date t. Événements répétables : A5, A8, B1, B2, B4, B9, B10, C5, C6, D4, D5, E1, E2, E3.
- **Quantité calculée.** Elle se comporte comme un état durable qui commence à la date de publication des données sources et prend fin à la date de publication suivante. Ses points sont le résultat de la formule. Quantités calculées : A1, A2, A4, C3, D1.

La décroissance d vaut 1 pendant les 365 premiers jours qui suivent l'événement, diminue linéairement jusqu'à 0,25 à 730 jours, et vaut 0 au-delà de 730 jours ainsi qu'avant la date de l'événement. Un vote de 2023 pèse donc moins qu'un vote de 2026. Un événement datant de plus de 730 jours reste sur la page pays et dans les données ; il ne contribue plus au score.

<!-- BEGIN generated:decay -->

| Δ (jours) | d(Δ) |
|---|---|
| de 0 à 365 | 1 |
| de 366 à 730 | 1 − 0,75 × (Δ − 365) / 365, de 1 à 0,25 |
| au-delà de 730 ou avant l'événement | 0 |

<!-- END generated:decay -->

Seuls les événements au statut `published` contribuent au score. Un événement retiré contribue pour 0 à toutes les dates, y compris aux dates passées : les scores passés sont recalculés, et le journal des corrections consigne ce qui a changé. Le site est régénéré chaque nuit, de sorte que la décroissance et la fenêtre de passivité avancent même lorsqu'aucun événement n'a changé.

## Confiance

Chaque événement a un seul niveau de confiance, dont le poids multiplie les points de l'événement.

<!-- BEGIN generated:confidence -->

| Niveau | Poids | Règle |
|---|---|---|
| Confirmé | 1,0 | Au moins une source de type official, court ou dataset. |
| Corroboré | 0,7 | Deux sources indépendantes de type ngo ou press qui citent le document sous-jacent. |
| Signalé | 0,4 | Une source crédible de type ngo ou press ; l'événement est accompagné d'un avertissement sur la page du pays. |
| Contesté | 0,4 | Un démenti officiel est enregistré (une réponse au titre du droit de réponse ou une source officielle) et des preuves contraires existent ; les deux versions sont présentées, avec leurs liens. |

<!-- END generated:confidence -->

- **Confirmé** exige au moins une source officielle, judiciaire ou issue d'un jeu de données. Le validateur rejette un événement confirmé qui n'en a pas. Un article de presse ne peut jamais être le seul appui d'un événement confirmé.
- **Corroboré** exige deux sources indépendantes, d'ONG ou de presse, émanant d'éditeurs distincts, qui nomment le document sous-jacent.
- **Signalé** repose sur une seule source crédible, d'ONG ou de presse. La vignette de l'événement porte une mention d'une ligne.
- **Contesté** s'applique lorsqu'un démenti officiel est consigné, dans une réponse ou dans une source officielle, et que des éléments contraires existent. Les deux sont accessibles par un lien depuis la vignette de l'événement, qui porte une mention d'une ligne. Un événement mis en cause par la voie du droit de réponse reste « contesté » jusqu'à sa résolution.

### Preuves et sources

- Une preuve est un document primaire : un communiqué officiel, un journal officiel, une pièce de procédure, une transcription ou une vidéo officielle, ou une ligne d'un jeu de données. Sans document primaire, un événement ne peut être noté qu'au niveau de confiance « corroboré » ou « signalé », avec un poids réduit. Les rapports d'ONG et les articles de presse qui ne sont pas utilisés de cette manière valent comme pistes jusqu'à ce qu'un document primaire soit trouvé.
- Chaque source qui étaye un événement publié a une copie archivée : un instantané de la Wayback Machine, l'empreinte SHA-256 des octets archivés, l'horodatage de la récupération et le nombre d'octets ; une ligne de jeu de données s'appuie sur la copie archivée de son jeu de données. Le dépôt conserve ces éléments et le texte extrait, en texte brut, mais pas les documents eux-mêmes. Une source dont la capture a échoué est conservée, signalée comme telle, et ne peut étayer aucun événement publié tant qu'elle n'est pas archivée. Si un instantané disparaît, l'empreinte et le texte extrait restent, et la source est marquée « archive indisponible », sans être supprimée.
- Chaque élément de preuve comporte le passage qui l'étaye, cité mot pour mot à partir du texte extrait, dans la langue d'origine, avec un repère (page, paragraphe, ligne ou horodatage de la vidéo). Une traduction est affichée à côté de l'original, jamais à sa place.
- Pour une déclaration, la source est la transcription ou la vidéo officielle, et non un article qui en rend compte.
- La date de l'événement est celle de l'acte (décision, vote, déclaration, livraison), et non celle de l'article qui le rapporte.

Les pistes ne rapportent jamais de points ; une page pays peut indiquer qu'une question est à l'étude. Chaque brouillon d'événement est relu une seconde fois, de façon indépendante, au regard du texte archivé, et le verdict de cette seconde lecture est consigné avant la revue. Les événements passent de l'état de brouillon à l'état revu, puis publié ; seuls les événements publiés sont notés.

## Indicateurs calculés

Cinq indicateurs sont calculés à partir de jeux de données et ne sont jamais saisis à la main : A1, A2, A4, C3 et D1. Chacun est recalculé lorsque sa source publie une nouvelle édition et reste en vigueur jusqu'à l'édition suivante. Le résultat de la formule et les lignes brutes peuvent être téléchargés depuis la page [Données](/fr/data). Les votes de B1, les vetos de B2 et les états de reconnaissance de B8 sont eux aussi générés, à partir des relevés de vote des Nations unies, d'une table des vetos au Conseil de sécurité et des dates de reconnaissance inscrites dans la liste des pays.

### A1 — armes majeures livrées à Israël

Pour chaque édition du SIPRI, publiée en mars de l'année Y+1 avec des données allant jusqu'à l'année Y : s = TIV(pays → Israël, année Y) ÷ TIV(tous les fournisseurs → Israël, année Y). Points = −40 × √s, arrondis à une décimale. La valeur s'applique de la date de publication de l'édition à celle de l'édition suivante. Avant la première édition postérieure au 7 octobre 2023 (mars 2024), A1 est sans données (no-data) pour tous les pays. La racine carrée maintient la visibilité des fournisseurs secondaires : sur une échelle linéaire, un fournisseur détenant une part de 1 % obtiendrait −0,4 ; avec la racine, il obtient −4, tandis que le premier fournisseur reste près du bas de l'intervalle.

### A4 — armes achetées à Israël

À partir de la même édition du SIPRI : une nouvelle commande passée à Israël l'année Y, avec une TIV supérieure à 0, est notée par palier de TIV. Seuls comptent les contrats signés le 7 octobre 2023 ou après.

### A2 — exportations militaires dans les données douanières

V est la valeur des exportations vers Israël sur les 12 mois glissants relevant du chapitre 93 et de la position 8710 du SH, ainsi que des positions 8526 et 8802 lorsque le caractère militaire du flux est confirmé (voir la section « Définitions par indicateur »). La source est la déclaration du pays lui-même à UN Comtrade ; si elle manque ou est confidentielle, les données miroirs des importations d'Israël par pays d'origine ; si les deux manquent, A2 est sans données (no-data). Les points sont attribués par palier de V. La valeur est recalculée à chaque édition annuelle ou trimestrielle de Comtrade et s'applique jusqu'à la suivante.

### C3 — maintien des échanges commerciaux

T est le total des exportations et des importations de marchandises avec Israël sur les 12 mois glissants, d'après les déclarations du pays lui-même, ou à défaut d'après les données miroirs. r = T ÷ T(2022). Si r est au moins égal à 0,9, les points sont attribués par palier de T ; si r est inférieur à 0,9, ils sont nuls. Une baisse des échanges n'est pas récompensée ici ; seule une décision l'est, par C1. Une hausse n'est pas pénalisée au-delà du palier.

### D1 — financement humanitaire

F est le total des contributions versées et engagées par le gouvernement du pays (type d'organisation donatrice « Government ») aux appels éclair suivis par OCHA pour le Territoire palestinien occupé (TPO) et au fonds de financement commun pour le TPO, sur les 12 mois glissants, tel qu'enregistré par le service de suivi financier d'OCHA (FTS). x = F ÷ RNB, le RNB étant le revenu national brut total du pays, et non le RNB par habitant, selon la Banque mondiale (méthode Atlas, dollars des États-Unis courants, dernière année disponible). Les points sont attribués par palier de x. Un zéro est un vrai zéro, car FTS est la référence pour le financement humanitaire des gouvernements ; une partie de l'aide bilatérale et en nature n'est pas déclarée à FTS, et D4 et D5 en rendent compte en partie (voir la section « Limites connues »). La valeur est recalculée chaque mois et s'applique pendant un mois.

### Seuils et paliers

Le facteur d'échelle de A1 et les paliers de A2, A4, C3 et D1 :

<!-- BEGIN generated:thresholds -->

#### A1 (formule a1) — Armes conventionnelles majeures livrées à Israël, pondérées par la part dans les importations d'Israël

| Condition | Points |
|---|---|
| 0 ≤ s ≤ 1 | −40 × √s, arrondi à une décimale |
| Avant le 11 mars 2024 | Pas de données |

#### A2 (formule a2) — Munitions, composants, biens militaires à double usage exportés (SH 93, 8710, 8802, 8526)

| Condition | Points |
|---|---|
| V ≥ 100 000 000 USD | −25 |
| V ≥ 10 000 000 USD | −15 |
| V ≥ 1 000 000 USD | −8 |
| V ≥ 100 000 USD | −3 |
| V < 100 000 USD | 0 |

#### A4 (formule a4) — Armes achetées à Israël (nouveaux contrats depuis octobre 2023)

| Condition | Points |
|---|---|
| TIV ≥ 500 | −15 |
| TIV ≥ 100 | −10 |
| TIV ≥ 10 | −5 |
| TIV > 0 | −2 |
| TIV = 0 | 0 |

#### C3 (formule c3) — Commerce bilatéral avec Israël maintenu au niveau d'avant-guerre ou au-dessus

| Condition | Points |
|---|---|
| r < 0,9 (r = T ÷ T(2022)) | 0 |
| r ≥ 0,9 et T ≥ 10 000 000 000 USD | −8 |
| r ≥ 0,9 et T ≥ 1 000 000 000 USD | −5 |
| r ≥ 0,9 et T ≥ 100 000 000 USD | −3 |
| r ≥ 0,9 et T ≥ 10 000 000 USD | −2 |
| r ≥ 0,9 et T < 10 000 000 USD | 0 |

#### D1 (formule d1) — Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant

| Condition | Points |
|---|---|
| x ≥ 0,0100 % | +12 |
| x ≥ 0,0050 % | +9 |
| x ≥ 0,0020 % | +6 |
| x ≥ 0,0005 % | +3 |
| x > 0 | +1 |
| x = 0 | 0 |

<!-- END generated:thresholds -->

## Passivité

Un pays reçoit une pénalité de passivité de 15 points à la date t lorsqu'il n'a aucun événement admissible au cours des 365 jours précédents. Un événement admissible est un événement publié relevant d'un indicateur de B2 à B12, de C1 à C6 ou de D1 à D5, daté dans les 365 jours qui précèdent t, t compris, et dont la contribution pondérée à cette date est au moins égale à 2 en valeur absolue.

- Les votes B1 ne sont pas admissibles : les votes à l'Assemblée générale des Nations unies, quel que soit leur sens, ne mettent pas fin à la pénalité de passivité.
- Un financement D1 inférieur au palier +3 n'est pas admissible, car sa contribution est inférieure à 2.
- La catégorie A n'est jamais admissible. Vendre ou refuser des armes ne relève pas du type d'engagement que mesure la pénalité, et les événements A6 à A8 s'accompagnent presque toujours d'événements des catégories B ou C.
- La catégorie E n'est pas admissible, car elle n'est pas notée.

La pénalité est la mise en œuvre de la règle « le silence est négatif ». À un pays sans aucune donnée, seule la pénalité de passivité s'applique. Le classement obtenu avec une pénalité de 5, de 15 et de 25 points constitue la première table de sensibilité ; comme les autres, cette table est calculée à chaque génération du site et publiée une fois les scores affichés.

<!-- BEGIN generated:passivity -->

| Paramètre | Valeur |
|---|---|
| Pénalité | 15 points |
| Fenêtre | 365 jours, jusqu'à t inclus |
| Indicateurs admissibles | B2–B12, C1–C6, D1–D5 |
| Contribution minimale en valeur absolue | 2 |
| Statuts des événements | `published` |
| Exclus : B1 | Les votes B1 ne comptent pas : le cahier des charges (§ 2) décrit comme passif un pays qui vote pour à l'ONU et ne fait rien d'autre. |
| Exclus : A1–A8 | La catégorie A ne compte jamais : vendre ou refuser des armes n'est pas le type d'engagement que mesure la pénalité, et les événements A6–A8 s'accompagnent presque toujours d'événements B ou C. |
| Exclus : E1–E3 | La catégorie E est expérimentale et non notée en v1.0. |
| Valeurs de sensibilité | 5, 15 et 25 points |

<!-- END generated:passivity -->

## Couverture

La couverture est calculée sur les 31 indicateurs notés. Chaque pays a un statut d'évaluation par indicateur ; un statut none-found ou no-data est accompagné de la date de vérification et d'une note ou des requêtes de recherche utilisées :

- `has-events` : au moins un événement publié (statut fixé lors de la génération du site).
- `none-found` : vérifié, rien trouvé.
- `no-data` : les données nécessaires pour évaluer l'indicateur ne sont pas publiées.
- `not-applicable` : l'indicateur ne peut pas s'appliquer. Ce statut n'est automatique que pour B2, pour les États qui n'ont siégé au Conseil de sécurité à aucun moment depuis le 7 octobre 2023 ; aucun autre indicateur n'est automatiquement non applicable.
- `unchecked` : pas encore étudié.

$$
\text{applicables} = 31 - n_{\text{not-applicable}}, \qquad \text{couverture} = \frac{n_{\text{has-events}} + n_{\text{none-found}}}{\text{applicables}}
$$

La barre de couverture figure à côté de chaque score. Les segments pleins correspondent aux indicateurs qui ont des événements ou pour lesquels rien n'a été trouvé ; les segments hachurés, aux indicateurs sans données ; les segments vides, aux indicateurs non vérifiés. La page pays indique, pour chaque indicateur, ce qui a été vérifié et à quelle date.

### L'absence de données ne vaut pas zéro

Lorsqu'un pays n'a pas de données pour A1 ou A2, sa vignette affiche « pas de données d'exportation », jamais un zéro. Un pays qui ne publie rien n'est pas noté comme s'il n'avait rien exporté : à un pays sans aucune donnée, seule la pénalité de passivité s'applique. Ainsi, l'absence de données publiées n'est pas lue comme une absence d'actes.

Un indicateur non vérifié déclenche un avertissement lors de la génération du site. Un pays qui a des indicateurs non vérifiés ne peut être publié qu'en mode fiche, et les scores ne sont pas affichés tant qu'un pays publié a un indicateur non vérifié.

## Tables de sensibilité

Cinq tables de sensibilité montrent comment le classement évolue lorsqu'un paramètre change. Chacune donne le classement complet obtenu avec le réglage alternatif et la corrélation de rang de Spearman avec le classement par défaut. Les tables sont calculées à chaque génération du site et publiées une fois les scores affichés.

1. Pénalité de passivité à 5, à 15 et à 25 points.
2. Pondération de chaque catégorie (A, B, C, D) à 0,5 et à 1,5, les autres restant à 1.
3. Poids des événements signalés à 0,2 et à 0,6.
4. Déclarations exclues : B9 et B10 contribuent pour 0.
5. Décroissance désactivée : d = 1 pour tout événement répétable.

En mode fiche, les tables ne sont pas affichées, car chacune contient un classement.

## Table de symétrie

Pour chaque indicateur négatif, la table de symétrie nomme son pendant positif, ou indique pourquoi il n'en existe pas. Un contrôle exécuté à chaque génération du site échoue si la table manque ou est incomplète. Les événements positifs et négatifs ont la même mise en page sur toutes les pages.

<!-- BEGIN generated:symmetry -->

| Négatif | Pendant positif | Remarque |
|---|---|---|
| A1 livraisons | A7 embargo | — |
| A2 composants | A6 suspension partielle | — |
| A3 F-35 | A6 (arrêt des pièces de F-35) | — |
| A4 achats à Israël | A7 (embargo dans les deux sens) | — |
| A5 coopération | A8 transit refusé | — |
| B1 contre/abstention | B1 pour | même indicateur |
| B2 veto | B3 intervention | les deux sont des actes juridico-institutionnels |
| B4 rejet de la CIJ | B3 | — |
| B6 refus envers la CPI | B5 exécution des mandats de la CPI | — |
| B7 sanctions contre la CPI | B5 | — |
| B10 déni | B9 dénonciation des violations | — |
| C2 nouvel accord | C1 suspension | — |
| C3 commerce inchangé | C1, C4 | — |
| D2 financement de l'UNRWA coupé | D3 financement de l'UNRWA rétabli | — |
| E2 interdictions de manifestations | E1 enquêtes | expérimental |

<!-- END generated:symmetry -->

## Versions et journal des modifications

Les versions de la méthodologie suivent la gestion sémantique de version.

- Majeure : modification de l'échelle, des catégories ou de l'ensemble des pays notés. L'extension du champ noté au Liban ou à la Cisjordanie correspond à la version 2.0.
- Mineure : modification des indicateurs, des points ou des seuils, et modification de la liste des votes retenus. L'ajout d'une résolution à cette liste est une version mineure, car il modifie des scores.
- Corrective : modification de formulation.

Chaque version est un dossier complet et autonome, `methodology/vX.Y.Z/`, dans le dépôt public. Chaque score porte la version qui l'a produit. Une nouvelle version recalcule l'ensemble des scores passés. Lorsqu'une version est remplacée, ses derniers résultats sont figés et restent disponibles à l'adresse `/api/v1/methodology/vX.Y.Z/…`. Chaque modification est accompagnée d'une entrée dans le journal des modifications, `methodology/CHANGELOG.md`, et d'un fichier `diff.json` qui liste chaque pays dont le score affiché a varié d'au moins 1, avec la cause.

Une modification est proposée sous la forme d'une demande de fusion (pull request) accompagnée d'une justification écrite. La génération du site publie ce fichier de différences dans la demande de fusion. La proposition est annoncée sur la page [Modifications](/fr/changes) et reste ouverte aux commentaires publics pendant 14 jours dans une discussion liée ; elle n'est fusionnée qu'après ce délai. Une version majeure requiert en outre l'approbation d'au moins un relecteur nommément désigné.

La version 1.0.0-rc.1 est une version candidate. Avant l'affichage des scores, les points et les seuils sont testés en notant dix pays à la main, et des relecteurs externes nommément désignés examinent la table des indicateurs et les seuils ; tout ajustement est consigné dans le journal des modifications.

### Reproductibilité et contrôles de cohérence

Chaque score peut être reconstruit à partir d'une copie du dépôt public : pour une date donnée, la génération reproduit chaque fichier de sortie octet pour octet à partir de `data/` et de `methodology/`, et le fichier `manifest.json` publié enregistre le commit git et une empreinte de chaque fichier. Les contrôles suivants sont exécutés à chaque génération du site et bloquent la publication en cas d'échec :

1. Deux événements du même indicateur pour le même pays, sur des périodes qui se chevauchent, avec des points différents, constituent une erreur, sauf si l'indicateur est modulé, c'est-à-dire si ses points peuvent varier d'un événement à l'autre ; chaque événement d'un indicateur modulé indique la raison de ses points. Les indicateurs modulés sont A1, A2, A4, A5, B1, B8, B9, B11, B12, C1, C3, C4, D1 et D3.
2. Chaque événement confirmé a une source officielle, judiciaire ou issue d'un jeu de données.
3. Chaque source a une copie archivée, une empreinte SHA-256 et un horodatage de récupération, sauf une ligne de jeu de données, qui s'appuie sur la copie archivée de son jeu de données, et une capture échouée, qui est signalée et ne peut étayer aucun événement publié ; chaque élément de preuve comporte une citation.
4. Chaque citation B9 et B10 figure mot pour mot dans le texte extrait de sa source archivée, après normalisation des espaces ; les citations des autres événements doivent y figurer aussi, sauf si la source est une ligne d'un jeu de données.
5. La table de symétrie est présente et complète.
6. Les résumés d'événements ne contiennent aucun mot de `banned-words.txt` ni aucun point d'exclamation, comptent au plus 200 caractères et commencent par l'acteur.
7. Une nouvelle génération produit des fichiers identiques octet pour octet.
8. Aucun pays n'a d'indicateur non vérifié lorsque les scores sont affichés.

Une modification de la date, des points, de la confiance ou des preuves d'un événement publié est également rejetée si elle n'est pas accompagnée d'une entrée dans le journal des corrections.

### Corrections et droit de réponse

Chaque correction et chaque retrait figurent sur la page [Corrections](/fr/corrections) : ce qui était erroné, qui l'a relevé, ce qui a changé et à quelle date. Rien n'est supprimé : un événement retiré reste dans le registre, marqué comme retiré, et ne compte plus dans le score. Toute personne peut signaler une erreur au moyen du formulaire public de signalement.

Tout gouvernement ou toute ambassade peut répondre à un événement précis. La réponse est publiée intégralement sur la page pays dans les 10 jours suivant sa réception, dans la langue d'origine accompagnée d'une traduction, avec, au-dessous, la réponse apportée par le projet. L'événement contesté passe au niveau de confiance contesté (poids 0,4) jusqu'à sa résolution par une correction, un retrait ou un rejet documenté et motivé. La page [Droit de réponse](/fr/reply) explique comment soumettre une réponse.

### Écarts par rapport au cahier des charges

La mise en œuvre s'écarte du cahier des charges du projet sur les points suivants :

1. Les instantanés des scores passés sont des fichiers statiques, `/api/v1/scores/{YYYY-MM-DD}.json`, accompagnés d'un fichier d'index qui liste les dates disponibles, au lieu d'une requête `GET /v1/scores?date=`.
2. Il n'y a pas de chaîne d'extraction automatisée. Les événements sont recherchés et rédigés au cours de sessions de Claude Code, un assistant d'intelligence artificielle, conduites par l'auteur selon le protocole des sources publié ; le contrôle par deux lecteurs prévu par le cahier des charges est conservé sous la forme d'une seconde lecture obligatoire de chaque brouillon.
3. Le jeu de données est un ensemble de fichiers dans un dépôt git public, et l'interface de revue est la demande de fusion (pull request) sur GitHub.
4. La page Comparer présente les valeurs par catégorie sous forme de diagramme en points au lieu d'un graphique en radar. La carte est dessinée en SVG à partir des données Natural Earth au lieu de tuiles cartographiques.
5. La catégorie E est enregistrée et n'est pas notée. Israël et la Palestine ne sont pas notés.
6. L'indicateur A2 ne compte les positions 8526 et 8802 du SH que si le caractère militaire du flux est confirmé (voir la section « Définitions par indicateur »).

## Limites connues

- **Données d'exportation d'armes.** La plupart des États déclarent à UN Comtrade les données du chapitre 93 du SH comme confidentielles. Les données miroirs des importations d'Israël comblent une partie du manque, mais elles sont elles aussi partielles. Lorsqu'aucune des deux sources n'est disponible, A2 est sans données (no-data), jamais à zéro. Les États qui publient des données d'exportation sont donc évalués sur davantage de données que ceux qui n'en publient pas ; la barre de couverture montre l'écart pour chaque pays.
- **La TIV du SIPRI n'est pas une valeur monétaire.** Elle mesure la capacité militaire transférée, et non la valeur d'un contrat, et l'édition annuelle paraît en mars pour l'année civile précédente.
- **Financement humanitaire.** FTS sous-estime l'aide bilatérale et en nature, y compris celle des États arabes et de la Türkiye. D4 et D5 en rendent compte en partie ; la barre de couverture et la note du pays signalent l'écart.
- **Déclarations.** Seules les déclarations formelles et transcrites comptent. De nombreux gouvernements s'expriment par la voix de porte-parole, dont les déclarations ne sont pas notées, ou sur les réseaux sociaux, où les déclarations ne sont pas notées sauf s'il en existe une transcription officielle.
- **Couverture de la recherche.** Les pays sont étudiés par vagues, et la couverture varie d'un pays à l'autre tant que la recherche est en cours. La barre de couverture et la liste de ce qui a été vérifié indiquent l'état de la recherche pour chaque pays.
- **Valeurs en points.** Les points, les plafonds et les seuils sont des choix. Ils sont publiés, versionnés et ouverts aux commentaires ; les tables de sensibilité, calculées à chaque génération du site et publiées une fois les scores affichés, montrent leur effet sur le classement, et les lecteurs peuvent fixer leurs propres pondérations de catégorie.
- **Catégorie E.** La responsabilité interne est enregistrée et n'est pas notée dans la version 1.0.
- **Votes retenus.** B1 ne note que les votes inscrits dans `votes.yaml` ; la liste reste vide tant que chaque vote n'a pas été vérifié dans les relevés des Nations unies.
