// Types pour le store de budget

export interface Charge {
  id: string;
  nom: string;
  montant: number;
  dateEcheance: string;
  categorie: 'logement' | 'energie' | 'alimentation' | 'transport' | 'assurance' | 'internet' | 'telephonie' | 'divertissement' | 'autre';
  payee: boolean;
  datePaiement?: string;
}

export interface Budget {
  id: string;
  nom: string;
  montant: number;
  depense: number;
  categorie: 'transport' | 'loisirs' | 'alimentation' | 'autre';
  mois: string;
  dateLimite?: string;
}

export interface Objectif {
  id: string;
  nom: string;
  montantCible: number;
  montantActuel: number;
  dateLimite: string;
  priorite: 'basse' | 'moyenne' | 'haute';
  description: string;
  dejaEpargne?: number;
  historique?: { date: string; montant: number }[];
}

export interface Transaction {
  id: string;
  type: 'depense' | 'revenu' | 'snapshot';
  montant: number;
  categorie: string;
  description: string;
  date: string;
  personne: 'hoel' | 'zelie' | 'commune';
  snapshot?: {
    mois: string;
    revenus: number;
    charges: number;
    versementHoel: number;
    versementZelie: number;
    resteHoel: number;
    resteZelie: number;
  };
}

export interface AppState {
  // Données de base
  moisActuel: string;
  salaireHoel: number;
  salaireZelie: number;
  
  // Données financières
  charges: Charge[];
  budgetsHoel: Budget[];
  budgetsZelie: Budget[];
  objectifs: Objectif[];
  historique: Transaction[];
  epargneCommune: number;
  
  // Actions
  setMoisActuel: (mois: string) => void;
  setSalaires: (hoel: number, zelie: number) => void;
  ajouterCharge: (charge: Omit<Charge, 'id'>) => void;
  modifierCharge: (id: string, charge: Partial<Charge>) => void;
  supprimerCharge: (id: string) => void;
  ajouterBudget: (budget: Omit<Budget, 'id'>, personne: 'hoel' | 'zelie') => void;
  modifierBudget: (id: string, budget: Partial<Budget>) => void;
  supprimerBudget: (id: string) => void;
  ajouterObjectif: (objectif: Omit<Objectif, 'id'>) => void;
  modifierObjectif: (id: string, objectif: Partial<Objectif>) => void;
  supprimerObjectif: (id: string) => void;
  ajouterTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setEpargneCommune: (montant: number) => void;
  reinitialiserDonnees: () => void;
} 