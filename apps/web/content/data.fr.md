# Données et API

Tout ce que le site montre est publié sous forme de fichiers statiques : JSON, CSV et Markdown, produits à chaque génération du site à partir du dépôt public. Les données sont publiées sous la licence Creative Commons Attribution 4.0 (CC BY 4.0). Il n'y a ni clé, ni compte, ni limite de requêtes autre que celle de l'hébergeur, et rien n'est calculé à la demande.

<!-- slot:build -->

## Téléchargements

<!-- slot:downloads -->

## Tableaux structurés

Les événements générés et calculés (B1, B2, B8, A1, A2, A4, C3 et D1) sont produits par la génération à partir des tableaux de `data/structured/` du dépôt, jamais saisis à la main. Chaque ligne cite, dans la colonne `source`, les sources de type jeu de données qui archivent la réponse dont elle est tirée : un identifiant de source, ou plusieurs séparés par `;` lorsqu'une ligne a été construite à partir de plusieurs réponses archivées (par exemple les pages d'un plan du FTS et la liste des lieux du FTS). Les liens ci-dessous ouvrent chaque tableau au commit de cette génération.

<!-- slot:structured -->

## API

Les fichiers sont servis sous `/api/v1/` avec l'en-tête `Access-Control-Allow-Origin: *`, si bien qu'une page d'un autre site peut les lire. Les fichiers JSON sont en UTF-8 avec des clés triées ; une valeur absente vaut `null` (la clé est toujours présente) ; les dates sont au format `YYYY-MM-DD` en UTC ; le texte destiné aux lecteurs est un objet avec `en` et `fr`. Dans le texte, un nombre négatif porte le signe moins (−15) ; dans le JSON et le CSV, les nombres portent le trait d'union ASCII (-15). Les fichiers CSV ont une ligne d'en-tête et des fins de ligne LF. La référence complète, champ par champ, est le [README de l'API](https://github.com/mohazed/GAI/blob/main/apps/web/public/api/README.md), en anglais ; les schémas sont les schémas zod de `packages/schema/src/api.ts`. Les exemples ci-dessous sont tirés des fichiers de cette génération.

<!-- slot:api -->

## Comment le site utilise les données

- **Pages des pays.** Chaque événement rédigé à la main a sa fiche. Les valeurs calculées d'un indicateur, comme D1 recalculé chaque mois, sont présentées par séries : une entrée par série de valeurs consécutives, avec les dates auxquelles les points ont changé. Chaque valeur est à un clic, dans le tableau de la série, avec sa ligne de tableau et les réponses archivées qu'elle cite.
- **Liens datés.** Une page de pays avec `?date=YYYY-MM-DD` lit `scores/{YYYY-MM-DD}.json` dans le navigateur et redessine le score, la bande et les sous-totaux par catégorie de cette date ; la couverture et les événements affichés restent ceux de la date de génération.
- **Données structurées pour les moteurs de recherche.** Chaque page de pays porte un enregistrement JSON-LD de type Dataset (schema.org) avec ses fichiers JSON comme distributions ; cette page porte l'enregistrement de l'ensemble du jeu de données.
- **Cartes de partage.** `/cards/{ISO3}.png` en anglais et `/cards/fr/{ISO3}.png` en français, 1200 × 630 pixels, régénérées à chaque génération.
- **Rapports mensuels.** Les rapports `changes/{YYYY-MM}.md` et `.fr.md`, et leurs variantes `.scorecard` sans scores, sont affichés à l'adresse `/changes/{YYYY-MM}/` dans le mode du site, chaque ligne étant liée à son événement.
- **Comparer.** La page Comparer lit `countries/{ISO3}.json` dans le navigateur pour chaque pays choisi, jusqu'à cinq pays notés indiqués dans `?c=`. Avec des pondérations choisies par le lecteur (`?w=`, une fois les scores affichés), elle recalcule chaque point de changement de la série à partir des sous-totaux plafonnés par catégorie, que la série publie à une décimale. La citation d'une comparaison renvoie à `/compare?c=…` et indique la date de génération.
- **Date de génération.** La page Changements affiche un avis dans le navigateur lorsque la date de génération remonte à plus de trois jours.

<!-- slot:computed -->

## Citer le jeu de données

<!-- slot:citation -->

## Reproduire une génération

Chaque fichier peut être régénéré, octet pour octet, à partir d'une copie du dépôt pour la même date de génération. `manifest.json` indique le commit git lu par la génération, la date de génération, l'adresse du site utilisée dans les liens et les citations, et la taille et l'empreinte SHA-256 de chaque autre fichier. La procédure demande Node 22 ou ultérieur, pnpm et `jq` :

<!-- slot:reproduce -->

La dernière commande n'affiche rien et se termine avec le code 0 lorsque chaque fichier correspond. Une génération dont `git.dirty` vaut `true` a lu des modifications non validées de ses entrées et ne peut pas être reproduite à partir d'un clone ; `git.dirty: null` signifie que git n'a pas pu le dire. `pnpm build:data:check --date YYYY-MM-DD` lance deux générations dans des processus distincts et compare chaque octet ; l'intégration continue du dépôt l'exécute à chaque modification.
