import React, { useEffect, useState } from 'react';
import { toast } from '@hooks/useToast';

interface SmartBudgetAlertProps {
  budget: {
    id: string;
    nom: string;
    montant: number;
    depense: number;
    categorie: string;
    mois: string;
    dateLimite?: string;
  };
  showToast?: boolean;
}

/**
 * Composant d'alerte intelligente combinant alertes de montant et de deadline
 * Affiche les alertes de budget (80%+ et 100%+) ET les alertes de deadline
 */
export const SmartBudgetAlert: React.FC<SmartBudgetAlertProps> = ({ 
  budget, 
  showToast = false 
}) => {
  const [hasShownToast, setHasShownToast] = useState(false);

  // Calculer le pourcentage d'utilisation
  const pourcentageUtilise = budget.montant > 0 ? (budget.depense / budget.montant) * 100 : 0;
  const montantRestant = budget.montant - budget.depense;

  // Déterminer le niveau d'alerte de montant
  const getAlertLevel = () => {
    if (pourcentageUtilise >= 100) return 'limit';
    if (pourcentageUtilise >= 80) return 'warning';
    return 'normal';
  };

  const alertLevel = getAlertLevel();

  // Calculer le temps restant jusqu'à la deadline
  const getDeadlineInfo = () => {
    if (!budget.dateLimite) return null;

    const now = new Date();
    const deadline = new Date(budget.dateLimite);
    const timeDiff = deadline.getTime() - now.getTime();
    
    if (timeDiff <= 0) return { expired: true, text: 'Deadline dépassée' };

    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Convertir en format lisible
    if (daysDiff === 1) return { expired: false, text: '1 jour restant' };
    if (daysDiff < 7) return { expired: false, text: `${daysDiff} jours restants` };
    if (daysDiff < 30) return { expired: false, text: `${Math.floor(daysDiff / 7)} semaine${Math.floor(daysDiff / 7) > 1 ? 's' : ''} restante${Math.floor(daysDiff / 7) > 1 ? 's' : ''}` };
    if (daysDiff < 365) {
      const months = Math.floor(daysDiff / 30);
      const remainingDays = daysDiff % 30;
      if (remainingDays === 0) return { expired: false, text: `${months} mois restant${months > 1 ? 's' : ''}` };
      return { expired: false, text: `${months} mois ${remainingDays} jour${remainingDays > 1 ? 's' : ''} restant${months > 1 || remainingDays > 1 ? 's' : ''}` };
    }
    
    const years = Math.floor(daysDiff / 365);
    const remainingMonths = Math.floor((daysDiff % 365) / 30);
    if (remainingMonths === 0) return { expired: false, text: `${years} an${years > 1 ? 's' : ''} restant${years > 1 ? 's' : ''}` };
    return { expired: false, text: `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois restant${years > 1 || remainingMonths > 1 ? 's' : ''}` };
  };

  const deadlineInfo = getDeadlineInfo();

  // Déterminer si on doit afficher une alerte de deadline
  const shouldShowDeadlineAlert = deadlineInfo && !deadlineInfo.expired && (
    // Alerte si moins de 30 jours OU si progression < théorique
    (deadlineInfo.text.includes('jour') || deadlineInfo.text.includes('semaine')) ||
    (deadlineInfo.text.includes('mois') && deadlineInfo.text.includes('1 mois'))
  );

  // Gestion des toasts uniques par mois
  useEffect(() => {
    if (!showToast || hasShownToast) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const toastKey = `budget-${budget.id}-${currentMonth}`;
    
    // Vérifier si on a déjà affiché un toast ce mois
    const hasShownThisMonth = localStorage.getItem(toastKey);
    if (hasShownThisMonth) return;

    let toastMessage = '';

    // Toast pour alerte de montant
    if (alertLevel === 'limit') {
      toastMessage = `🚨 Budget ${budget.nom} : Limite atteinte (100%) !`;
    } else if (alertLevel === 'warning') {
      toastMessage = `⚠️ Budget ${budget.nom} : Alerte à ${pourcentageUtilise.toFixed(1)}% d'utilisation`;
    }

    // Toast pour alerte de deadline
    if (shouldShowDeadlineAlert && deadlineInfo) {
      if (toastMessage) toastMessage += ' • ';
      toastMessage += `📅 Deadline : ${deadlineInfo.text} (${budget.dateLimite})`;
    }

    if (toastMessage) {
      toast(toastMessage, 'warning');
      localStorage.setItem(toastKey, 'true');
      setHasShownToast(true);
    }
  }, [budget, alertLevel, deadlineInfo, shouldShowDeadlineAlert, showToast, hasShownToast]);

  // Si pas d'alerte du tout, ne rien afficher
  if (alertLevel === 'normal' && !shouldShowDeadlineAlert) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg border border-gray-600">
      {/* Informations du budget - Layout compact */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Nom du budget */}
          <span className="font-medium text-white text-sm">{budget.nom}</span>
          
          {/* Badges d'alerte compacts */}
          <div className="flex items-center gap-1">
            {alertLevel !== 'normal' && (
              <span className={`
                inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
                ${alertLevel === 'limit' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }
              `}>
                {alertLevel === 'limit' ? '🚨' : '⚠️'}
              </span>
            )}

            {shouldShowDeadlineAlert && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                📅
              </span>
            )}
          </div>
        </div>

        {/* Détails des alertes - Layout compact en ligne */}
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          {/* Alerte de montant */}
          {alertLevel !== 'normal' && (
            <span className={`${
              alertLevel === 'limit' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {pourcentageUtilise.toFixed(1)}% • {montantRestant.toFixed(2)}€
            </span>
          )}

          {/* Alerte de deadline */}
          {shouldShowDeadlineAlert && deadlineInfo && (
            <span className="text-blue-400">
              {deadlineInfo.text} • {montantRestant.toFixed(2)}€
            </span>
          )}
        </div>
      </div>

      {/* Barre de progression compacte */}
      <div className="ml-3 flex flex-col items-center">
        <div className="w-16 h-1.5 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              alertLevel === 'limit' ? 'bg-red-500' :
              alertLevel === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(pourcentageUtilise, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {pourcentageUtilise.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};
