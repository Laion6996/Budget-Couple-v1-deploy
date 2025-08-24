import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores';

interface Objectif {
  id: string;
  label: string;
  montantCible: number;
  dejaEpargne: number;
  dateLimite?: string;
  historique?: { date: string; montant: number }[];
}

/**
 * Hook personnalisé pour gérer les objectifs d'épargne
 */
export const useObjectifs = () => {
  const { objectifs, ajouterObjectif, modifierObjectif, supprimerObjectif } = useAppStore();
  
  // État local des objectifs
  const [objectifsLocaux, setObjectifsLocaux] = useState<Objectif[]>([]);

  // Initialiser avec les objectifs existants
  useEffect(() => {
    const objectifsFormates = objectifs.map(objectif => ({
      id: objectif.id,
      label: objectif.nom,
      montantCible: objectif.montantCible,
      dejaEpargne: objectif.dejaEpargne || 0,
      dateLimite: objectif.dateLimite,
      historique: objectif.historique || [],
    }));
    setObjectifsLocaux(objectifsFormates);
  }, [objectifs]);

  // Fonction pour ajouter un nouvel objectif
  const ajouterNouvelObjectif = useCallback((label: string, montantCible: number, dateLimite?: string) => {
    const nouvelObjectif = {
      nom: label,
      montantCible,
      montantActuel: 0,
      dateLimite: dateLimite || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priorite: 'moyenne' as const,
      description: `Objectif d'épargne: ${label}`,
      dejaEpargne: 0,
      historique: [],
    };
    
    ajouterObjectif(nouvelObjectif);
  }, [ajouterObjectif]);

  // Fonction pour incrémenter l'épargne d'un objectif
  const incrementerEpargne = useCallback((id: string, montant: number) => {
    const objectif = objectifsLocaux.find(o => o.id === id);
    if (!objectif) return;

    // Calculer la nouvelle épargne (peut être négative en cas de retrait)
    const nouvelleEpargne = Math.max(0, objectif.dejaEpargne + montant);

    // Créer l'entrée d'historique
    const nouvelleEntree = {
      date: new Date().toISOString(),
      montant: montant // Garder le montant tel quel (positif ou négatif)
    };

    // Mettre à jour localement pour une réponse immédiate
    setObjectifsLocaux(prev => 
      prev.map(o => 
        o.id === id ? { 
          ...o, 
          dejaEpargne: nouvelleEpargne,
          historique: [...(o.historique || []), nouvelleEntree]
        } : o
      )
    );

    // Mettre à jour dans le store
    modifierObjectif(id, { 
      dejaEpargne: nouvelleEpargne,
      historique: [...(objectif.historique || []), nouvelleEntree]
    });
  }, [objectifsLocaux, modifierObjectif]);

  // Fonction pour supprimer un objectif
  const supprimerObjectifLocal = useCallback((id: string) => {
    setObjectifsLocaux(prev => prev.filter(o => o.id !== id));
    supprimerObjectif(id);
  }, [supprimerObjectif]);

  // Calculer les statistiques globales
  const statistiques = useCallback(() => {
    const totalObjectifs = objectifsLocaux.length;
    const objectifsAtteints = objectifsLocaux.filter(o => o.dejaEpargne >= o.montantCible).length;
    const totalMontantCible = objectifsLocaux.reduce((sum, o) => sum + o.montantCible, 0);
    const totalEpargne = objectifsLocaux.reduce((sum, o) => sum + o.dejaEpargne, 0);
    const pourcentageGlobal = totalMontantCible > 0 ? (totalEpargne / totalMontantCible) * 100 : 0;

    return {
      totalObjectifs,
      objectifsAtteints,
      totalMontantCible,
      totalEpargne,
      pourcentageGlobal,
      resteTotal: totalMontantCible - totalEpargne
    };
  }, [objectifsLocaux]);

  return {
    objectifs: objectifsLocaux,
    ajouterNouvelObjectif,
    incrementerEpargne,
    supprimerObjectif: supprimerObjectifLocal,
    statistiques: statistiques(),
  };
}; 