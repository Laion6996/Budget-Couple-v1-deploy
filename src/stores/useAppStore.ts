import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Charge, Budget, Objectif, Transaction } from '../types/budget';

// Données de départ (seed data)
const seedData = {
  moisActuel: new Date().toISOString().slice(0, 7), // Format: "YYYY-MM"
  salaireHoel: 3100,
  salaireZelie: 1500,
  charges: [
    {
      id: '1',
      nom: 'Loyer',
      montant: 900,
      dateEcheance: '2024-01-05',
      categorie: 'logement' as const,
      payee: true,
      datePaiement: '2024-01-03',
    },
    {
      id: '2',
      nom: 'Électricité',
      montant: 120,
      dateEcheance: '2024-01-15',
      categorie: 'energie' as const,
      payee: false,
    },
    {
      id: '3',
      nom: 'Eau',
      montant: 18,
      dateEcheance: '2024-01-20',
      categorie: 'energie' as const,
      payee: false,
    },
    {
      id: '4',
      nom: 'Internet',
      montant: 35,
      dateEcheance: '2024-01-10',
      categorie: 'internet' as const,
      payee: true,
      datePaiement: '2024-01-08',
    },
    {
      id: '5',
      nom: 'Crédit Voiture',
      montant: 600,
      dateEcheance: '2024-01-25',
      categorie: 'transport' as const,
      payee: false,
    },
    {
      id: '6',
      nom: 'Ordures',
      montant: 18,
      dateEcheance: '2024-01-30',
      categorie: 'autre' as const,
      payee: false,
    },
    {
      id: '7',
      nom: 'Assurance Maison',
      montant: 17,
      dateEcheance: '2024-01-15',
      categorie: 'assurance' as const,
      payee: false,
    },
  ],
  budgetsHoel: [
    {
      id: '1',
      nom: 'Budget Transport',
      montant: 200,
      depense: 150,
      categorie: 'transport' as const,
      mois: '2024-01',
    },
    {
      id: '2',
      nom: 'Budget Loisirs',
      montant: 300,
      depense: 120,
      categorie: 'loisirs' as const,
      mois: '2024-01',
    },
  ],
  budgetsZelie: [
    {
      id: '3',
      nom: 'Budget Shopping',
      montant: 150,
      depense: 80,
      categorie: 'loisirs' as const,
      mois: '2024-01',
    },
    {
      id: '4',
      nom: 'Budget Restaurants',
      montant: 200,
      depense: 95,
      categorie: 'alimentation' as const,
      mois: '2024-01',
    },
  ],
  objectifs: [
    {
      id: '1',
      nom: 'Vacances été',
      montantCible: 3000,
      montantActuel: 1200,
      dateLimite: '2024-06-30',
      priorite: 'haute' as const,
      description: 'Séjour en famille à la mer',
    },
    {
      id: '2',
      nom: 'Voiture neuve',
      montantCible: 15000,
      montantActuel: 3500,
      dateLimite: '2025-12-31',
      priorite: 'moyenne' as const,
      description: 'Remplacement de la voiture actuelle',
    },
  ],
  historique: [
    {
      id: '1',
      type: 'depense' as const,
      montant: 800,
      categorie: 'logement',
      description: 'Paiement loyer janvier',
      date: '2024-01-03',
      personne: 'commune' as const,
    },
    {
      id: '2',
      type: 'depense' as const,
      montant: 35,
      categorie: 'autre',
      description: 'Facture internet',
      date: '2024-01-08',
      personne: 'commune' as const,
    },
    {
      id: '3',
      type: 'depense' as const,
      montant: 150,
      categorie: 'transport',
      description: 'Essence voiture',
      date: '2024-01-12',
      personne: 'hoel' as const,
      budgetId: '1',
    },
  ],
  epargneCommune: 2500,
};

/**
 * Store principal de l'application avec persistance localStorage
 * Gère toutes les données financières et les actions associées
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Données initiales
      ...seedData,

      // Actions pour modifier l'état
      setMoisActuel: (mois: string) => set({ moisActuel: mois }),

      setSalaires: (hoel: number, zelie: number) =>
        set({ salaireHoel: hoel, salaireZelie: zelie }),

      ajouterCharge: (charge: Omit<Charge, 'id'>): string => {
        console.log('🚀 [useAppStore] Début de ajouterCharge avec:', charge);
        
        // Validation des données
        if (!charge.nom || charge.nom.trim() === '') {
          console.error('❌ [useAppStore] Validation échouée: nom manquant');
          throw new Error('Le nom de la charge est requis');
        }
        
        const montant = Number(charge.montant);
        if (isNaN(montant) || montant <= 0) {
          console.error('❌ [useAppStore] Validation échouée: montant invalide', montant);
          throw new Error('Le montant doit être un nombre positif');
        }

        console.log('✅ [useAppStore] Validation réussie - nom:', charge.nom, 'montant:', montant);

        // Génération d'un ID unique
        const id = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `charge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log('🔧 [useAppStore] ID généré:', id);

        set((state) => {
          const newCharges = [...state.charges, { ...charge, id, montant }];
          console.log('🔧 [useAppStore] État mis à jour - ancien nombre de charges:', state.charges.length, 'nouveau:', newCharges.length);
          console.log('🔧 [useAppStore] Nouvelles charges:', newCharges);
          return {
            charges: newCharges,
          };
        });

        console.log('✅ [useAppStore] Charge ajoutée avec succès, ID retourné:', id);
        return id;
      },

      modifierCharge: (id: string, charge: Partial<Charge>) => {
        // Validation des données
        if (charge.nom !== undefined && charge.nom.trim() === '') {
          throw new Error('Le nom de la charge ne peut pas être vide');
        }
        
        if (charge.montant !== undefined) {
          const montant = Number(charge.montant);
          if (isNaN(montant) || montant <= 0) {
            throw new Error('Le montant doit être un nombre positif');
          }
        }

        console.log('✏️ Charge modifiée:', { id, updates: charge });

        set((state) => ({
          charges: state.charges.map((c) =>
            c.id === id ? { ...c, ...charge } : c
          ),
        }));
      },

      supprimerCharge: (id: string) => {
        console.log('🗑️ Charge supprimée:', { id });
        
        set((state) => ({
          charges: state.charges.filter((c) => c.id !== id),
        }));
      },

      ajouterBudget: (budget: Omit<Budget, 'id'>, personne: 'hoel' | 'zelie') =>
        set((state) => {
          const nouveauBudget = { ...budget, id: Date.now().toString() };
          if (personne === 'hoel') {
            return {
              budgetsHoel: [...state.budgetsHoel, nouveauBudget],
            };
          } else {
            return {
              budgetsZelie: [...state.budgetsZelie, nouveauBudget],
            };
          }
        }),

      modifierBudget: (id: string, budget: Partial<Budget>) =>
        set((state) => ({
          budgetsHoel: state.budgetsHoel.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
          budgetsZelie: state.budgetsZelie.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        })),

      supprimerBudget: (id: string) =>
        set((state) => ({
          budgetsHoel: state.budgetsHoel.filter((b) => b.id !== id),
          budgetsZelie: state.budgetsZelie.filter((b) => b.id !== id),
        })),

      ajouterObjectif: (objectif: Omit<Objectif, 'id'>) =>
        set((state) => ({
          objectifs: [
            ...state.objectifs,
            { 
              ...objectif, 
              id: Date.now().toString(),
              dejaEpargne: 0,
              historique: []
            },
          ],
        })),

      modifierObjectif: (id: string, objectif: Partial<Objectif>) =>
        set((state) => ({
          objectifs: state.objectifs.map((o) =>
            o.id === id ? { ...o, ...objectif } : o
          ),
        })),

      supprimerObjectif: (id: string) =>
        set((state) => ({
          objectifs: state.objectifs.filter((o) => o.id !== id),
        })),

      ajouterTransaction: (transaction: Omit<Transaction, 'id'>) =>
        set((state) => ({
          historique: [
            ...state.historique,
            { ...transaction, id: Date.now().toString() },
          ],
        })),

      setEpargneCommune: (montant: number) => set({ epargneCommune: montant }),

      reinitialiserDonnees: () => set(seedData),
    }),
    {
      name: 'budget-couple:v1', // Clé de persistance localStorage
      version: 1, // Version du store pour la migration future
    }
  )
); 