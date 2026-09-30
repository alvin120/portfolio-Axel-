# Démo — Formulaire de réservation de table

Code retiré du site public le 30 septembre 2026, en même temps que la page
restaurant, mais conservé ici pour être remontré ou réimplanté chez un client.

**Ce dossier n'est pas déployé** : il est exclu du script de déploiement et de
la workflow GitHub. Rien ici n'est accessible depuis axeltagrou.fr.

## Ce que fait la démo

Un formulaire de réservation en ligne : nom, téléphone, date, heure et nombre
de couverts. À l'envoi, la demande part par e-mail au restaurateur, qui rappelle
le client pour confirmer.

Elle a surtout valeur d'exemple de **validation sérieuse** : chaque champ est
vérifié côté serveur contre un format strict ou une liste blanche, parce que
tout ce qui est validé dans le navigateur peut être contourné depuis la console.

## Les trois morceaux

| Fichier | Rôle |
|---|---|
| `formulaire.html` | Le balisage de la section, avec son champ piège anti-robot |
| `gestionnaire.js` | L'envoi en arrière-plan et la validation côté navigateur |
| `validation.php` | La validation serveur — c'est la partie qui compte |

## Remonter la démo sur un site

1. **Balisage** — coller `formulaire.html` dans la page voulue. Les libellés
   portent des attributs `data-i18n-*` : les retirer si le site n'est pas
   traduit, sinon ajouter les clés correspondantes.

2. **Navigateur** — reprendre `gestionnaire.js` dans le script de la page. Il
   dépend de trois fonctions définies plus haut dans `contact.js` :
   `isValidPhone`, `showAlert` et `send`. Les reprendre aussi.

3. **Serveur** — replacer la branche `validation.php` dans le `send-mail.php`
   du site, juste après la branche « contact », et s'assurer que le formulaire
   envoie bien `type=reservation`. La branche suppose la présence des fonctions
   `post_field()` et `reply()` du fichier d'origine.

4. **Styles** — les classes `.reservation-section`, `.reservation-form` et
   `.form-row` viennent de `contact.css`.

## Points de validation à ne pas perdre

C'est là que se trouve la valeur de la démo :

- **Téléphone** — `^[0-9+\s().\-]{6,20}$` : chiffres et séparateurs usuels
  seulement, ce qui bloque l'injection de texte arbitraire dans l'e-mail.
- **Date** — `DateTime::createFromFormat('!Y-m-d', ...)` puis comparaison du
  résultat reformaté avec la saisie. Ce double contrôle rejette le 30 février,
  qu'une simple expression régulière laisserait passer.
- **Date passée** — refusée, ainsi que toute date à plus d'un an, ce qui évite
  les réservations absurdes et le remplissage automatisé.
- **Heure** — `^([01][0-9]|2[0-3]):[0-5][0-9]$`, donc pas de 25:99.
- **Couverts** — liste blanche identique aux options du `<select>`. Jamais de
  confiance dans la valeur reçue, même issue d'une liste déroulante.
- **Pas de `Reply-To`** — ce formulaire ne collecte pas d'adresse e-mail, donc
  aucune donnée non validée n'atteint les en-têtes du message.

## Compatibilité

Le PHP est volontairement compatible **5.4** : pas d'opérateur `??`, pas de
fonctions fléchées, `array()` plutôt que `[]`. C'est la version servie par
l'hébergement OVH d'axeltagrou.fr. Sur un hébergement moderne, le code
fonctionne tel quel.
