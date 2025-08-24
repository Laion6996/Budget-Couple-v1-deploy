import React from 'react';
import { useToast } from './Toast';

interface DeadlineAlertProps {
  objectif: {
    id: string;
    label: string;
    montantCible: number;
    dejaEpargne: number;
    dateLimite?: string;
  };
  showToast?: boolean;
}

/**
 * Composant d'alerte pour les deadlines des objectifs
 * Calcule la progression théorique et affiche des alertes douces
 */
export const DeadlineAlert: React.FC<DeadlineAlertProps> = ({ objectif, showToast = true }) => {
  const { showToast: showToastMessage } = useToast();
  
  // Si pas de deadline, ne rien afficher
  if (!objectif.dateLimite) return null;
  
  const now = new Date();
  const deadline = new Date(objectif.dateLimite);
  const joursRestants = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculer la progression actuelle
  const progressionActuelle = (objectif.dejaEpargne / objectif.montantCible) * 100;
  
  // Calculer la progression théorique (répartition linéaire jusqu'à la deadline)
  const joursDepuisDebut = Math.max(1, Math.ceil((deadline.getTime() - new Date(deadline.getFullYear(), deadline.getMonth(), 1).getTime()) / (1000 * 60 * 60 * 24)));
  const progressionTheorique = Math.min(100, (joursRestants / joursDepuisDebut) * 100);
  
  // Déterminer si une alerte est nécessaire
  const needsAlert = joursRestants <= 7 && progressionActuelle < progressionTheorique;
  
  // Générer une clé unique pour le toast (objectif + jour)
  const toastKey = `deadline-${objectif.id}-${Math.floor(now.getTime() / (1000 * 60 * 60 * 24))}`;
  
  // Afficher le toast d'alerte (une seule fois par jour)
  React.useEffect(() => {
    if (!showToast || !needsAlert) return;
    
    // Vérifier si le toast a déjà été affiché aujourd'hui
    const hasShownToast = localStorage.getItem(toastKey);
    if (hasShownToast) return;
    
    // Calculer le montant à épargner par jour pour atteindre l'objectif
    const montantRestant = objectif.montantCible - objectif.dejaEpargne;
    const montantParJour = Math.ceil(montantRestant / Math.max(1, joursRestants));
    
    const message = `📅 Objectif ${objectif.label} : ${joursRestants} jour(s) restant(s). 
    Progression : ${progressionActuelle.toFixed(1)}% (théorique : ${progressionTheorique.toFixed(1)}%).
    Épargnez ${montantParJour}€/jour pour atteindre votre objectif !`;
    
    showToastMessage(message, 'info', 8000);
    localStorage.setItem(toastKey, 'true');
    
    // Nettoyer les anciens toasts (plus de 7 jours)
    const sevenDaysAgo = Math.floor((now.getTime() - 7 * 24 * 60 * 60 * 1000) / (1000 * 60 * 60 * 24));
    if (parseInt(toastKey.split('-')[2]) < sevenDaysAgo) {
      localStorage.removeItem(toastKey);
    }
  }, [objectif, joursRestants, progressionActuelle, progressionTheorique, needsAlert, showToast, showToastMessage, toastKey]);
  
  // Si pas d'alerte, afficher juste l'info de deadline
  if (!needsAlert) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>📅</span>
        <span>{joursRestants > 0 ? `${joursRestants} jour(s) restant(s)` : 'Deadline atteinte'}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      {/* Badge d'alerte douce */}
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        📅 Deadline
      </span>
      
      {/* Jours restants */}
      <span className="text-xs font-medium text-blue-600">
        {joursRestants} jour(s)
      </span>
      
      {/* Progression vs théorique */}
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-500">Actuel:</span>
        <span className="text-xs font-medium text-blue-600">
          {progressionActuelle.toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500">/</span>
        <span className="text-xs text-gray-500">Théorique:</span>
        <span className="text-xs font-medium text-gray-600">
          {progressionTheorique.toFixed(1)}%
        </span>
      </div>
      
      {/* Barre de progression comparée */}
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${progressionActuelle}%` }}
          />
          <div 
            className="bg-gray-400 border-l border-white"
            style={{ width: `${Math.max(0, progressionTheorique - progressionActuelle)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
