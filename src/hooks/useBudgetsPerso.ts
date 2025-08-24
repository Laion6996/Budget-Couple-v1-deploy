import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores';

interface BudgetPerso {
  id: string;
  nom: string;
  montant: number;
  depense: number;
  dateLimite?: string;
}

/**
 * Hook personnalisé pour gérer les budgets personnels avec autosave
 */
export const useBudgetsPerso = (personne: 'hoel' | 'zelie') => {
  const { budgetsHoel, budgetsZelie, ajouterBudget, modifierBudget, supprimerBudget } = useAppStore();
  
  // État local des budgets (pour l'édition)
  const [budgets, setBudgets] = useState<BudgetPerso[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sélectionner les bons budgets selon la personne
  const storeBudgets = personne === 'hoel' ? budgetsHoel : budgetsZelie;

  // Initialiser avec les budgets existants
  useEffect(() => {
    const budgetsPerso = storeBudgets.map(budget => ({
      id: budget.id,
      nom: budget.nom,
      montant: budget.montant,
      depense: budget.depense,
      dateLimite: budget.dateLimite,
    }));
    setBudgets(budgetsPerso);
    
    // Nettoyer les budgets temporaires au changement de store
    setEditingId(null);
  }, [storeBudgets]);

  // Fonction pour ajouter un nouveau budget
  const ajouterBudgetPerso = useCallback(() => {
    // Générer un ID unique avec timestamp + random pour éviter les doublons
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const uniqueId = `temp-${timestamp}-${random}`;
    
    const nouveauBudget: BudgetPerso = {
      id: uniqueId,
      nom: '',
      montant: 0,
      depense: 0,
      dateLimite: undefined,
    };
    
    setBudgets(prev => [...prev, nouveauBudget]);
    setEditingId(nouveauBudget.id);
  }, []);

  // Fonction pour supprimer un budget
  const supprimerBudgetPerso = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    
    // Si c'était un budget existant, le supprimer du store
    if (!id.startsWith('temp-')) {
      supprimerBudget(id);
    }
    
    if (editingId === id) {
      setEditingId(null);
    }
  }, [supprimerBudget, editingId]);

  // Fonction pour modifier un budget
  const modifierBudgetPerso = useCallback((id: string, updates: Partial<BudgetPerso>) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
  }, []);

  // Fonction pour commencer l'édition
  const commencerEdition = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  // Fonction pour sauvegarder un budget
  const sauvegarderBudget = useCallback((budget: BudgetPerso) => {
    if (budget.nom.trim() === '') {
      setErrors(prev => ({ ...prev, [budget.id]: 'Le nom est requis' }));
      return false;
    }
    
    if (budget.montant < 0) {
      setErrors(prev => ({ ...prev, [budget.id]: 'Le montant doit être positif' }));
      return false;
    }

    if (budget.depense < 0) {
      setErrors(prev => ({ ...prev, [budget.id]: 'La dépense doit être positive' }));
      return false;
    }

    // Effacer les erreurs
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[budget.id];
      return newErrors;
    });

    // Si c'est un nouveau budget, l'ajouter au store
    if (budget.id.startsWith('temp-')) {
      ajouterBudget({
        nom: budget.nom,
        montant: budget.montant,
        depense: budget.depense,
        dateLimite: budget.dateLimite,
        categorie: 'autre',
        mois: new Date().toISOString().slice(0, 7),
      }, personne);
      
      // Attendre un peu pour que le store se mette à jour, puis nettoyer
      setTimeout(() => {
        setBudgets(prev => prev.filter(b => !b.id.startsWith('temp-')));
      }, 100);
    } else {
      // Modifier le budget existant
      modifierBudget(budget.id, {
        nom: budget.nom,
        montant: budget.montant,
        depense: budget.depense,
        dateLimite: budget.dateLimite,
      });
    }

    setEditingId(null);
    return true;
  }, [ajouterBudget, modifierBudget, personne]);

  // Calculer les totaux
  const totalBudget = budgets.reduce((sum, b) => sum + b.montant, 0);
  const totalDepense = budgets.reduce((sum, b) => sum + b.depense, 0);
  const totalReste = totalBudget - totalDepense;

  return {
    budgets,
    editingId,
    errors,
    totalBudget,
    totalDepense,
    totalReste,
    ajouterBudgetPerso,
    supprimerBudgetPerso,
    modifierBudgetPerso,
    commencerEdition,
    sauvegarderBudget,
  };
}; 