import { useCallback } from 'react';

export type NavigateFunction = (page: 'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut') => void;

export const useCategoryNavigation = (navigateTo?: NavigateFunction) => {
  const navigateToCategory = useCallback((categoryName: string) => {
    console.log('🔗 [useCategoryNavigation] Navigation demandée pour:', categoryName);
    
    if (!navigateTo) {
      console.log('🔗 [useCategoryNavigation] Pas de fonction de navigation fournie');
      return;
    }

    // Mapping des catégories vers les pages appropriées
    const categoryPageMap: Record<string, 'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut'> = {
      // Charges réelles du Dashboard
      'Internet': 'parametres',
      'Gaz': 'parametres', 
      'Électricité': 'parametres',
      'Crédit Voiture': 'parametres',
      'Ordures': 'parametres',
      'Assurance Maison': 'parametres',
      
      // Catégories génériques du DonutAnalysis
      'Épargne': 'objectifs',           // Page objectifs pour gérer l'épargne
      'Charges fixes': 'parametres',    // Page paramètres pour modifier les charges
      'Dépenses variables': 'historique', // Page historique pour voir les dépenses
      'Loisirs': 'perso',              // Page perso pour les budgets personnels
      'Transport': 'parametres',        // Charges de transport
      'Alimentation': 'historique',     // Suivi des dépenses alimentaires
    };

    const targetPage = categoryPageMap[categoryName];
    
    if (targetPage) {
      console.log('🔗 [useCategoryNavigation] Navigation vers la page:', targetPage);
      navigateTo(targetPage);
    } else {
      console.log('🔗 [useCategoryNavigation] Aucune page définie pour:', categoryName);
      // Fallback vers la page d'accueil
      navigateTo('accueil');
    }
  }, [navigateTo]);

  return { navigateToCategory };
};
