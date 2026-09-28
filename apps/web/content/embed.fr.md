# Intégrer un pays

Une rédaction ou une organisation peut afficher un pays de l'index sur ses propres pages : une jauge avec le score, la bande et la couverture, ou la chronologie du score depuis le 7 octobre 2023. L'intégration est un script, pas un cadre. Il lit le fichier du pays dans l'API publique, dessine dans son propre espace isolé, renvoie vers la page du pays, et montre la fiche sans score aussi longtemps que le site le fait.

## Le code à insérer

Placez le script là où l'intégration doit apparaître ; il la dessine à cet endroit. Une page peut en contenir plusieurs.

<!-- slot:snippet -->

## Options

| Attribut | Valeurs | Par défaut |
|---|---|---|
| `data-country` | Le code ISO 3166-1 alpha-3 d'un pays noté, par exemple `DEU` | obligatoire |
| `data-view` | `gauge` (score, bande et couverture) ou `timeline` (le score depuis le 7 octobre 2023) | `gauge` |
| `data-lang` | `en` ou `fr` | `en` |
| `data-origin` | L'adresse du site où lire les données, pour un miroir de l'index | ce site |

## Ce que fait l'intégration

- Elle lit un seul fichier, `/api/v1/countries/{ISO3}.json`, à l'origine du site. Elle ne dépose aucun cookie, et ce fichier est la seule requête qu'elle fait.
- Elle suit le mode du site : tant que les scores ne sont pas publiés, elle montre la fiche (événements, couverture) sans nombre.
- Si le fichier ne peut pas être lu, elle affiche à la place un lien vers la page du pays.
- Les données sont publiées sous CC BY 4.0 : le lien vers la page du pays, que l'intégration montre toujours, vaut attribution.
- Elle tient en un seul script de moins de 15 Ko compressé, sans dépendance, et ne charge aucune police : elle utilise les polices du site quand la page les a, et sinon les polices serif, sans serif et à chasse fixe du système.
- Elle fonctionne dans les versions actuelles de Chrome, Edge, Firefox et Safari (16.4 ou ultérieure). Une page dotée d'une Content-Security-Policy doit autoriser ce site dans `script-src` et `connect-src`.

## Exemples en fonctionnement

<!-- slot:examples -->
