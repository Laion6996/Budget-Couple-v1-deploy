# Architecture du Projet Budget Couple

## 🏗️ Structure du Projet

```
budget-couple/
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── Header.tsx       # En-tête avec navigation
│   │   └── index.ts         # Exports des composants
│   ├── pages/               # Pages de l'application
│   │   ├── Accueil.tsx      # Page d'accueil
│   │   ├── Parametres.tsx   # Page des paramètres
│   │   ├── Repartition.tsx  # Page de répartition
│   │   ├── Perso.tsx        # Page budget personnel
│   │   ├── Objectifs.tsx    # Page des objectifs
│   │   ├── Historique.tsx   # Page historique
│   │   └── index.ts         # Exports des pages
│   ├── App.tsx              # Composant principal avec routage
│   ├── main.tsx             # Point d'entrée de l'application
│   ├── index.css            # Styles TailwindCSS
│   └── vite-env.d.ts        # Types Vite
├── public/                  # Fichiers publics
├── dist/                    # Build de production
├── tailwind.config.js       # Configuration TailwindCSS
├── postcss.config.js        # Configuration PostCSS
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── .eslintrc.js            # Configuration ESLint
└── .prettierrc             # Configuration Prettier
```

## 🎯 Architecture des Composants

### Composants de Base
- **Header** : Navigation principale avec liens vers toutes les pages
- **Layout** : Structure générale de l'application (à créer)

### Pages
Chaque page suit le même pattern :
- Titre principal avec classe `text-4xl font-bold text-white`
- Description avec classe `text-xl text-gray-300`
- Contenu principal dans un conteneur centré

## 🎨 Système de Design

### Thème Sombre
- **Fond principal** : `bg-gray-900`
- **Fond secondaire** : `bg-gray-800`
- **Texte principal** : `text-white`
- **Texte secondaire** : `text-gray-300`
- **Accents** : `text-blue-400`, `text-green-400`, `text-purple-400`

### Composants UI
- **Cartes** : `bg-gray-800 p-6 rounded-lg border border-gray-700`
- **Boutons** : `bg-blue-600 text-white px-4 py-2 rounded-lg`
- **Navigation active** : `bg-blue-600 text-white`
- **Navigation inactive** : `bg-gray-700 text-gray-200`

## 🚀 Routage

### Configuration React Router
- **BrowserRouter** : Routage côté client
- **Routes** : Définition des routes
- **Route** : Chaque page avec son chemin

### Structure des Routes
```
/ → Accueil
/parametres → Paramètres
/repartition → Répartition
/perso → Budget Personnel
/objectifs → Objectifs Financiers
/historique → Historique des Transactions
```

## 🔧 Configuration Technique

### TailwindCSS
- **Version** : 3.4.0
- **Scan** : `./index.html` et `./src/**/*.{ts,tsx}`
- **PostCSS** : Autoprefixer intégré

### TypeScript
- **Strict mode** : Activé
- **JSX** : `react-jsx`
- **Target** : ES2022
- **Module** : ESNext

### ESLint + Prettier
- **Règles React** : Recommandées
- **Règles TypeScript** : Recommandées
- **Formatage** : Automatique avec Prettier

## 📱 PWA

### Configuration
- **Service Worker** : Génération automatique
- **Mise à jour** : Auto-update
- **Cache** : Workbox avec patterns globaux

## 🚀 Scripts Disponibles

```bash
npm run dev        # Démarre le serveur de développement
npm run build      # Construit l'application pour la production
npm run preview    # Prévisualise la build de production
npm run lint       # Vérifie le code avec ESLint
npm run lint:fix   # Corrige automatiquement les erreurs ESLint
npm run format     # Formate le code avec Prettier
```

## 🔄 Workflow de Développement

1. **Développement** : `npm run dev` (port 5173 ou 5174)
2. **Linting** : `npm run lint` pour vérifier le code
3. **Formatage** : `npm run format` pour formater automatiquement
4. **Build** : `npm run build` pour tester la production
5. **Déploiement** : Dossier `dist/` contient la build finale

## 📝 Prochaines Étapes

- [ ] Créer le composant Layout
- [ ] Implémenter la gestion d'état avec Zustand
- [ ] Ajouter la validation des formulaires avec Zod
- [ ] Créer les graphiques avec Recharts
- [ ] Implémenter la logique métier du budget
- [ ] Ajouter des tests unitaires
- [ ] Optimiser les performances
- [ ] Ajouter des animations et transitions 