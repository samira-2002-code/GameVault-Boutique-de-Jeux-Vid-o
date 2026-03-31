# GameVault — Boutique de Jeux Vidéo

Ce projet est une application web simple en vanilla JavaScript et Tailwind CSS (CDN) pour la vente de jeux dématérialisés.

## Fonctionnalités

- Affichage dynamique du catalogue de jeux sous forme de cartes (image, titre, prix, genre, bouton "Ajouter au panier").
- Barre de recherche pour filtrer les jeux par titre en temps réel.
- Boutons de filtre de catégorie : `Tous`, `Action`, `RPG`, `FPS`.
- Panier interactif avec ajout, augmentation/diminution de quantité, suppression.
- Calcul automatique du total du panier.
- Sauvegarde et restauration du panier via `localStorage` (clé : `gamevault-cart`).
- Bouton "Commander" qui vide le panier et affiche une alerte de succès.
- Design en mode sombre et responsive : mobile 1 colonne, desktop jusqu’à 4 colonnes.

## Structure des fichiers

- `index.html` : page principale, UI et liens vers Tailwind + script.
- `script.js` : logique JavaScript (catalogue, filtres, panier, localStorage).

## Exécution locale

1. Ouvrir `index.html` dans un navigateur.
2. Tester la recherche, le filtrage, l’ajout au panier, la modification des quantités.
3. Valider l’enregistrement du panier après rafraîchissement de la page.

## Notes de développement

- Le code reste simple et commenté pour les débutants.
- Données du catalogue définies dans un tableau JS (`const games = [...]`).
- Pas d’API externe, tout est côté client.



