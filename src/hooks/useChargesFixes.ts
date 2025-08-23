import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores';
import type { ChargeFixe } from '../schemas/parametres';

/**
 * Hook personnalisé pour gérer les charges fixes avec autosave
 */
export const useChargesFixes = () => {
  const { charges, ajouterCharge, modifierCharge, supprimerCharge } = useAppStore();
  
  // État local des charges fixes (pour l'édition)
  const [chargesFixes, setChargesFixes] = useState<ChargeFixe[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser avec les charges existantes
  useEffect(() => {
    const chargesFixes = charges.map(charge => ({
      id: charge.id,
      label: charge.nom,
      montant: charge.montant,
    }));
    setChargesFixes(chargesFixes);
  }, [charges]);

  // Fonction pour ajouter une nouvelle charge
  const ajouterChargeFixe = useCallback(() => {
    const nouvelleCharge: ChargeFixe = {
      id: `temp-${Date.now()}`,
      label: '',
      montant: 0,
    };
    
    setChargesFixes(prev => [...prev, nouvelleCharge]);
    setEditingId(nouvelleCharge.id);
  }, []);

  // Fonction pour supprimer une charge
  const supprimerChargeFixe = useCallback((id: string) => {
    setChargesFixes(prev => prev.filter(c => c.id !== id));
    
    // Si c'était une charge existante, la supprimer du store
    if (!id.startsWith('temp-')) {
      supprimerCharge(id);
    }
    
    if (editingId === id) {
      setEditingId(null);
    }
  }, [supprimerCharge, editingId]);

  // Fonction pour modifier une charge
  const modifierChargeFixe = useCallback((id: string, updates: Partial<ChargeFixe>) => {
    setChargesFixes(prev => 
      prev.map(charge => 
        charge.id === id ? { ...charge, ...updates } : charge
      )
    );
  }, []);

  // Fonction pour commencer l'édition
  const commencerEdition = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  // Fonction pour sauvegarder une charge
  const sauvegarderCharge = useCallback((id: string) => {
    const charge = chargesFixes.find(c => c.id === id);
    if (!charge) return;

    if (charge.label.trim() === '') {
      setErrors(prev => ({ ...prev, [id]: 'Le label est requis' }));
      return;
    }
    
    if (charge.montant <= 0) {
      setErrors(prev => ({ ...prev, [id]: 'Le montant doit être positif' }));
      return;
    }

    // Effacer les erreurs
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    // Si c'est une nouvelle charge, l'ajouter au store
    if (id.startsWith('temp-')) {
      ajouterCharge({
        nom: charge.label,
        montant: charge.montant,
        dateEcheance: new Date().toISOString().slice(0, 10),
        categorie: 'autre',
        payee: false,
      });
      
      // Remplacer l'ID temporaire par l'ID réel
      const nouvelleCharge = charges[charges.length - 1];
      if (nouvelleCharge) {
        setChargesFixes(prev => 
          prev.map(c => 
            c.id === id ? { ...c, id: nouvelleCharge.id } : c
          )
        );
      }
    } else {
      // Modifier la charge existante
      modifierCharge(id, {
        nom: charge.label,
        montant: charge.montant,
      });
    }

    setEditingId(null);
  }, [ajouterCharge, modifierCharge, charges, chargesFixes]);

  // Calculer le total des charges
  const totalCharges = chargesFixes.reduce((sum, charge) => sum + charge.montant, 0);

  return {
    chargesFixes,
    editingId,
    errors,
    totalCharges,
    ajouterChargeFixe,
    supprimerChargeFixe,
    modifierChargeFixe,
    commencerEdition,
    sauvegarderCharge,
  };
}; 