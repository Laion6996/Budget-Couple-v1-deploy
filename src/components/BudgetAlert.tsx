import React from 'react';
import { useToast } from './Toast';

interface BudgetAlertProps {
  budget: {
    id: string;
    nom: string;
    montant: number;
    depense: number;
    categorie: string;
    mois: string;
  };
  showToast?: boolean;
}

/**
 * Composant d'alerte pour les budgets avec seuils à 80% et 100%
 * Affiche des badges d'alerte et des toasts uniques par mois
 */
export const BudgetAlert: React.FC<BudgetAlertProps> = ({ budget, showToast = true }) => {
  const { showToast: showToastMessage } = useToast();
  
  // Calculer le pourcentage d'utilisation
  const pourcentageUtilise = budget.montant > 0 ? (budget.depense / budget.montant) * 100 : 0;
  
  // Déterminer le niveau d'alerte
  const getAlertLevel = () => {
    if (pourcentageUtilise >= 100) return 'limit';
    if (pourcentageUtilise >= 80) return 'warning';
    return 'normal';
  };
  
  const alertLevel = getAlertLevel();
  
  // Générer une clé unique pour le toast (mois + catégorie + niveau)
  const toastKey = `${budget.mois}-${budget.categorie}-${alertLevel}`;
  
  // Afficher le toast d'alerte (une seule fois par mois)
  React.useEffect(() => {
    if (!showToast || alertLevel === 'normal') return;
    
    // Vérifier si le toast a déjà été affiché ce mois
    const hasShownToast = localStorage.getItem(toastKey);
    if (hasShownToast) return;
    
    // Afficher le toast et marquer comme affiché
    const message = alertLevel === 'limit' 
      ? `🚨 Budget ${budget.nom} : Limite atteinte (${pourcentageUtilise.toFixed(1)}%)`
      : `⚠️ Budget ${budget.nom} : Alerte à ${pourcentageUtilise.toFixed(1)}%`;
    
    const type = alertLevel === 'limit' ? 'warning' : 'info';
    
    showToastMessage(message, type, 5000);
    localStorage.setItem(toastKey, 'true');
    
    // Nettoyer les anciens toasts au changement de mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const budgetMonth = new Date(budget.mois).getMonth();
    const budgetYear = new Date(budget.mois).getFullYear();
    
    if (currentMonth !== budgetMonth || currentYear !== budgetYear) {
      localStorage.removeItem(toastKey);
    }
  }, [budget, alertLevel, showToast, showToastMessage, toastKey]);
  
  return (
    <div className="flex items-center space-x-2">
      {/* Badge d'alerte (seulement si nécessaire) */}
      {alertLevel !== 'normal' && (
        <span className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${alertLevel === 'limit' 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }
        `}>
          {alertLevel === 'limit' ? '🚨 Limite' : '⚠️ Alerte'}
        </span>
      )}
      
      {/* Pourcentage d'utilisation */}
      <span className={`
        text-xs font-medium
        ${alertLevel === 'limit' ? 'text-red-600' : alertLevel === 'warning' ? 'text-yellow-600' : 'text-gray-400'}
      `}>
        {pourcentageUtilise.toFixed(1)}%
      </span>
      
      {/* Barre de progression pour TOUS les budgets */}
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            alertLevel === 'limit' ? 'bg-red-500' : 
            alertLevel === 'warning' ? 'bg-yellow-500' : 
            'bg-green-500'
          }`}
          style={{ width: `${Math.min(pourcentageUtilise, 100)}%` }}
        />
      </div>
    </div>
  );
};
