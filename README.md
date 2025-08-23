# Budget Couple

Application de gestion de budget pour couples construite avec React, TypeScript et Vite.

## 🚀 Technologies utilisées

- **React 19** - Framework UI moderne
- **TypeScript** - Typage statique pour la robustesse du code
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état légère et performante
- **Zod** - Validation de schémas TypeScript
- **Recharts** - Bibliothèque de graphiques React
- **Lucide React** - Icônes modernes et cohérentes
- **Vite PWA Plugin** - Support PWA natif

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build
npm run preview
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run lint:fix` - Corrige automatiquement les erreurs ESLint
- `npm run format` - Formate le code avec Prettier

## 🏗️ Structure du projet

```
budget-couple/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.tsx      # En-tête avec navigation
│   │   └── index.ts        # Exports des composants
│   ├── pages/              # Pages de l'application
│   │   ├── Accueil.tsx     # Page d'accueil avec données du store
│   │   ├── Parametres.tsx  # Page des paramètres
│   │   ├── Repartition.tsx # Page de répartition
│   │   ├── Perso.tsx       # Page budget personnel
│   │   ├── Objectifs.tsx   # Page des objectifs
│   │   ├── Historique.tsx  # Page historique
│   │   ├── TestStore.tsx   # Page de test du store
│   │   └── index.ts        # Exports des pages
│   ├── stores/             # Gestion d'état Zustand
│   │   ├── useAppStore.ts  # Store principal avec persistance
│   │   └── index.ts        # Exports des stores
│   ├── types/              # Types TypeScript
│   │   └── budget.ts       # Types pour le budget
│   ├── App.tsx             # Composant principal avec routage
│   ├── main.tsx            # Point d'entrée
│   ├── index.css           # Styles TailwindCSS
│   └── vite-env.d.ts       # Types Vite
├── public/                  # Fichiers publics
├── dist/                    # Build de production
├── tailwind.config.js       # Configuration TailwindCSS
├── postcss.config.js        # Configuration PostCSS
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── .eslintrc.js            # Configuration ESLint
└── .prettierrc             # Configuration Prettier
```

## 🎨 Configuration TailwindCSS

TailwindCSS est configuré pour scanner automatiquement :
- `./index.html`
- `./src/**/*.{ts,tsx}`

## 📱 Support PWA

L'application est configurée comme une PWA avec :
- Service Worker automatique
- Mise à jour automatique
- Support hors ligne

## 🔧 Configuration ESLint/Prettier

- **ESLint** : Règles pour React, TypeScript et hooks
- **Prettier** : Formatage automatique du code
- Intégration complète avec Vite

## 🏪 Store Zustand

L'application utilise Zustand pour la gestion d'état avec :

### Données gérées
- **Salaires** : Hoel (3100€) et Zelie (1500€)
- **Charges** : Loyer, électricité, eau, internet, courses
- **Budgets personnels** : Séparés par personne
- **Objectifs** : Épargne avec priorité et date limite
- **Historique** : Toutes les transactions
- **Épargne commune** : Montant partagé

### Persistance
- **localStorage** automatique avec la clé `budget-couple:v1`
- **Données conservées** au rechargement de la page
- **Seed data** inclus pour démarrer avec des données réalistes

### Page de test
- **Route** : `/test-store`
- **Fonctionnalités** : Test des actions et vérification de la persistance

## 🚀 Démarrage rapide

1. Clonez le repository
2. Installez les dépendances : `npm install`
3. Démarrez le serveur : `npm run dev`
4. Ouvrez [http://localhost:5173](http://localhost:5173)
5. Testez le store via la page `/test-store`

## 📝 Prochaines étapes

- [x] Créer la structure des composants
- [x] Implémenter la gestion d'état avec Zustand
- [ ] Ajouter la validation des formulaires avec Zod
- [ ] Créer les graphiques avec Recharts
- [ ] Implémenter la logique métier du budget
- [ ] Ajouter des tests unitaires
- [ ] Optimiser les performances
- [ ] Ajouter des animations et transitions

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture technique détaillée
- [STORE_USAGE.md](./STORE_USAGE.md) - Guide d'utilisation du store Zustand
