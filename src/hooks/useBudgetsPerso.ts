import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores';

interface BudgetPerso {
  id: string;
  nom: string;
  montant: number;
  depense: number;
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
    }));
    setBudgets(budgetsPerso);
  }, [storeBudgets]);

  // Fonction pour ajouter un nouveau budget
  const ajouterBudgetPerso = useCallback(() => {
    const nouveauBudget: BudgetPerso = {
      id: `temp-${Date.now()}`,
      nom: '',
      montant: 0,
      depense: 0,
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
        categorie: 'autre',
        mois: new Date().toISOString().slice(0, 7),
      }, personne);
      
      // Remplacer l'ID temporaire par l'ID réel
      const nouveauBudget = storeBudgets[storeBudgets.length - 1];
      if (nouveauBudget) {
        setBudgets(prev => 
          prev.map(b => 
            b.id === budget.id ? { ...b, id: nouveauBudget.id } : b
          )
        );
      }
    } else {
      // Modifier le budget existant
      modifierBudget(budget.id, {
        nom: budget.nom,
        montant: budget.montant,
        depense: budget.depense,
      });
    }

    setEditingId(null);
    return true;
  }, [ajouterBudget, modifierBudget, storeBudgets, personne]);

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