# Recherche de Films

Application React permettant de rechercher des films via l'API OMDb (Open Movie Database).

## Fonctionnalités

-   Recherche de films par titre
-   Affichage des résultats sous forme de cartes
-   Pagination automatique (récupère tous les résultats)
-   Affichage des détails : affiche, titre, année, synopsis
-   Bouton "Lire la suite" pour les synopsis longs
-   Interface responsive et moderne

## Technologies

-   **React 18** - Bibliothèque UI
-   **Vite** - Outil de build rapide
-   **API OMDb** - Base de données de films

## Installation

1. **Cloner le projet**

    ```bash
    git clone <url-du-repo>
    cd films
    ```

2. **Installer les dépendances**

    ```bash
    npm install
    ```

3. **Lancer le serveur de développement**

    ```bash
    npm run dev
    ```

4. **Ouvrir dans le navigateur**
    ```
    http://localhost:5173
    ```

## Configuration

### Clé API OMDb

L'application utilise l'API OMDb. Pour obtenir votre propre clé API :

1. Rendez-vous sur [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Inscrivez-vous pour obtenir une clé gratuite
3. Modifiez la constante `API_KEY` dans `src/App.jsx` :

```javascript
const API_KEY = 'votre_cle_api';
```

## Structure du projet

```
films/
├── public/
│   └── no-poster.svg      # Image par défaut si pas d'affiche
├── src/
│   ├── components/
│   │   └── MovieCard.jsx  # Composant carte de film
│   ├── App.jsx            # Composant principal
│   ├── App.css            # Styles de l'application
│   ├── index.css          # Styles globaux
│   └── main.jsx           # Point d'entrée React
├── index.html
├── package.json
└── vite.config.js
```

## Utilisation

1. Saisissez un titre de film dans le champ de recherche
2. Cliquez sur "Rechercher" ou appuyez sur Entrée
3. Parcourez les résultats affichés
4. Cliquez sur "Lire la suite" pour voir le synopsis complet

## Scripts disponibles

| Commande          | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Lance le serveur de développement        |
| `npm run build`   | Compile l'application pour la production |
| `npm run preview` | Prévisualise la version de production    |
| `npm run lint`    | Vérifie le code avec ESLint              |

## Licence

Ce projet est libre d'utilisation à des fins éducatives.
