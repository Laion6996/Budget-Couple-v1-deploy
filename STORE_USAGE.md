# Guide d'utilisation du Store Zustand

## 🏪 Vue d'ensemble

Le store `useAppStore` est le cœur de la gestion d'état de l'application Budget Couple. Il utilise Zustand avec persistance automatique en localStorage pour conserver toutes les données entre les sessions.

## 📊 Structure des Données

### Données de Base
- **moisActuel** : Mois en cours (format: "YYYY-MM")
- **salaireHoel** : Salaire mensuel de Hoel
- **salaireZelie** : Salaire mensuel de Zelie
- **epargneCommune** : Montant de l'épargne commune

### Collections
- **charges[]** : Liste des charges mensuelles
- **budgetsHoel[]** : Budgets personnels de Hoel
- **budgetsZelie[]** : Budgets personnels de Zelie
- **objectifs[]** : Objectifs d'épargne
- **historique[]** : Historique des transactions

## 🚀 Utilisation dans les Composants

### Import du Store
```typescript
import { useAppStore } from '../stores';

const MonComposant = () => {
  // Récupération des données
  const { salaireHoel, salaireZelie, charges } = useAppStore();
  
  // Récupération des actions
  const { setSalaires, ajouterCharge } = useAppStore();
  
  // ... reste du composant
};
```

### Récupération Sélective des Données
```typescript
// Récupérer seulement les données nécessaires
const salaireHoel = useAppStore((state) => state.salaireHoel);
const charges = useAppStore((state) => state.charges);

// Récupérer plusieurs valeurs
const { salaireHoel, salaireZelie } = useAppStore((state) => ({
  salaireHoel: state.salaireHoel,
  salaireZelie: state.salaireZelie,
}));
```

## 🛠️ Actions Disponibles

### Gestion des Salaires
```typescript
const { setSalaires } = useAppStore();

// Modifier les deux salaires
setSalaires(3500, 1800);
```

### Gestion des Charges
```typescript
const { ajouterCharge, modifierCharge, supprimerCharge } = useAppStore();

// Ajouter une nouvelle charge
ajouterCharge({
  nom: 'Nouvelle charge',
  montant: 150,
  dateEcheance: '2024-02-15',
  categorie: 'energie',
  payee: false,
});

// Modifier une charge existante
modifierCharge('charge-id', { payee: true, datePaiement: '2024-02-10' });

// Supprimer une charge
supprimerCharge('charge-id');
```

### Gestion des Budgets
```typescript
const { ajouterBudget, modifierBudget, supprimerBudget } = useAppStore();

// Ajouter un budget pour Hoel
ajouterBudget({
  nom: 'Budget Transport',
  montant: 200,
  depense: 0,
  categorie: 'transport',
  mois: '2024-02',
}, 'hoel');

// Modifier un budget
modifierBudget('budget-id', { depense: 150 });

// Supprimer un budget
supprimerBudget('budget-id');
```

### Gestion des Objectifs
```typescript
const { ajouterObjectif, modifierObjectif, supprimerObjectif } = useAppStore();

// Ajouter un nouvel objectif
ajouterObjectif({
  nom: 'Vacances été',
  montantCible: 3000,
  montantActuel: 0,
  dateLimite: '2024-06-30',
  priorite: 'haute',
  description: 'Séjour en famille',
});

// Modifier un objectif
modifierObjectif('objectif-id', { montantActuel: 1200 });

// Supprimer un objectif
supprimerObjectif('objectif-id');
```

### Gestion des Transactions
```typescript
const { ajouterTransaction } = useAppStore();

// Ajouter une nouvelle transaction
ajouterTransaction({
  type: 'depense',
  montant: 150,
  categorie: 'transport',
  description: 'Essence voiture',
  date: '2024-02-12',
  personne: 'hoel',
  budgetId: 'budget-transport-id',
});
```

### Gestion de l'Épargne
```typescript
const { setEpargneCommune } = useAppStore();

// Modifier l'épargne commune
setEpargneCommune(3000);
```

### Réinitialisation
```typescript
const { reinitialiserDonnees } = useAppStore();

// Remettre toutes les données à zéro
reinitialiserDonnees();
```

## 💾 Persistance Automatique

Le store utilise automatiquement le localStorage avec la clé `budget-couple:v1`. Toutes les modifications sont automatiquement sauvegardées et restaurées au rechargement de la page.

### Vérification de la Persistance
1. Modifiez des données via les actions du store
2. Rechargez la page (F5)
3. Les données doivent être conservées
4. Vérifiez dans les DevTools > Application > Local Storage

## 🔍 Débogage

### Affichage de l'État Complet
```typescript
// Dans un composant ou la console
const state = useAppStore.getState();
console.log('État complet du store:', state);
```

### Souscription aux Changements
```typescript
// Écouter tous les changements
useAppStore.subscribe((state) => {
  console.log('Store mis à jour:', state);
});

// Écouter un champ spécifique
useAppStore.subscribe((state) => {
  console.log('Salaires mis à jour:', state.salaireHoel, state.salaireZelie);
});
```

## 📱 Page de Test

Une page de test est disponible à `/test-store` pour vérifier le fonctionnement du store et tester la persistance.

## ⚠️ Bonnes Pratiques

1. **Récupération sélective** : Ne récupérez que les données nécessaires
2. **Actions dans les handlers** : Utilisez les actions dans les gestionnaires d'événements
3. **Types stricts** : Utilisez toujours les types TypeScript fournis
4. **Persistance** : La persistance est automatique, pas besoin de sauvegarder manuellement

## 🚀 Exemples Complets

### Composant avec Calculs
```typescript
const ResumeFinancier = () => {
  const { salaireHoel, salaireZelie, charges, epargneCommune } = useAppStore();
  
  const totalSalaires = salaireHoel + salaireZelie;
  const totalCharges = charges.reduce((sum, c) => sum + c.montant, 0);
  const solde = totalSalaires - totalCharges;
  
  return (
    <div>
      <h3>Résumé Financier</h3>
      <p>Total Salaires: {totalSalaires}€</p>
      <p>Total Charges: {totalCharges}€</p>
      <p>Solde: {solde}€</p>
      <p>Épargne: {epargneCommune}€</p>
    </div>
  );
};
```

### Composant avec Actions
```typescript
const GestionnaireSalaires = () => {
  const { salaireHoel, salaireZelie, setSalaires } = useAppStore();
  
  const handleAugmentation = () => {
    setSalaires(salaireHoel + 100, salaireZelie + 50);
  };
  
  return (
    <div>
      <p>Hoel: {salaireHoel}€</p>
      <p>Zelie: {salaireZelie}€</p>
      <button onClick={handleAugmentation}>
        Augmenter les salaires
      </button>
    </div>
  );
};
``` 