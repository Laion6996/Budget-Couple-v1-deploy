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
    
    console.log('🔧 [useChargesFixes] Ajout d\'une nouvelle charge temporaire:', nouvelleCharge);
    
    setChargesFixes(prev => {
      const newCharges = [...prev, nouvelleCharge];
      console.log('🔧 [useChargesFixes] Charges fixes mises à jour:', newCharges);
      return newCharges;
    });
    setEditingId(nouvelleCharge.id);
    
    console.log('🔧 [useChargesFixes] Mode édition activé pour:', nouvelleCharge.id);
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
  const sauvegarderCharge = useCallback((id: string, updatedData?: { label: string; montant: number }): boolean => {
    console.log('🔧 [useChargesFixes] Début de sauvegarderCharge pour l\'ID:', id);
    console.log('🔧 [useChargesFixes] Données mises à jour reçues:', updatedData);
    console.log('🔧 [useChargesFixes] Charges fixes actuelles:', chargesFixes);
    
    const charge = chargesFixes.find(c => c.id === id);
    if (!charge) {
      console.error('❌ [useChargesFixes] Charge non trouvée pour l\'ID:', id);
      return false;
    }
    
    console.log('🔧 [useChargesFixes] Charge trouvée:', charge);
    
    // Si des données mises à jour sont fournies, les utiliser pour la validation
    const chargeToValidate = updatedData ? { ...charge, ...updatedData } : charge;
    console.log('🔧 [useChargesFixes] Charge à valider:', chargeToValidate);

    // Validation des données
    const errors: Record<string, string> = {};
    
    console.log('🔧 [useChargesFixes] Validation des données...');
    console.log('🔧 [useChargesFixes] Label:', chargeToValidate.label, 'Type:', typeof chargeToValidate.label);
    console.log('🔧 [useChargesFixes] Montant:', chargeToValidate.montant, 'Type:', typeof chargeToValidate.montant);
    
    if (!chargeToValidate.label || chargeToValidate.label.trim() === '') {
      errors.label = 'Le nom de la charge est requis';
      console.warn('⚠️ [useChargesFixes] Erreur de validation: label manquant');
    }
    
    const montant = Number(chargeToValidate.montant);
    if (isNaN(montant) || montant <= 0) {
      errors.montant = 'Le montant doit être un nombre positif';
      console.warn('⚠️ [useChargesFixes] Erreur de validation: montant invalide', montant);
    }

    // Si il y a des erreurs, les afficher et ne pas sauvegarder
    if (Object.keys(errors).length > 0) {
      console.error('❌ [useChargesFixes] Erreurs de validation:', errors);
      setErrors(prev => ({ ...prev, [id]: Object.values(errors).join(', ') }));
      return false; // Indiquer l'échec
    }
    
    console.log('✅ [useChargesFixes] Validation réussie');

    try {
      // Effacer les erreurs
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });

      // Si c'est une nouvelle charge, l'ajouter au store
      if (id.startsWith('temp-')) {
        console.log('🔧 [useChargesFixes] Ajout d\'une nouvelle charge au store...');
        try {
          // Appeler ajouterCharge et récupérer l'ID de la nouvelle charge
          console.log('🔧 [useChargesFixes] Appel de ajouterCharge avec:', {
            nom: chargeToValidate.label.trim(),
            montant: montant,
            dateEcheance: new Date().toISOString().slice(0, 10),
            categorie: 'autre',
            payee: false,
          });
          
          ajouterCharge({
            nom: chargeToValidate.label.trim(),
            montant: montant,
            dateEcheance: new Date().toISOString().slice(0, 10),
            categorie: 'autre',
            payee: false,
          });
          
          console.log('🔧 [useChargesFixes] ajouterCharge appelé avec succès');
          console.log('🔧 [useChargesFixes] Charges dans le store après ajout:', charges);
          
          // Récupérer la nouvelle charge depuis le store
          const nouvelleCharge = charges[charges.length - 1];
          console.log('🔧 [useChargesFixes] Nouvelle charge récupérée:', nouvelleCharge);
          
          if (nouvelleCharge && nouvelleCharge.nom === charge.label.trim()) {
            console.log('🔧 [useChargesFixes] Mise à jour de l\'ID temporaire vers:', nouvelleCharge.id);
            setChargesFixes(prev => 
              prev.map(c => 
                c.id === id ? { ...c, id: nouvelleCharge.id } : c
              )
            );
          } else {
            console.warn('⚠️ [useChargesFixes] Nouvelle charge non trouvée ou nom ne correspond pas');
          }
        } catch (error) {
          console.error('❌ [useChargesFixes] Erreur lors de l\'ajout au store:', error);
          throw error; // Remonter l'erreur
        }
              } else {
          console.log('🔧 [useChargesFixes] Modification d\'une charge existante...');
          // Modifier la charge existante
          modifierCharge(id, {
            nom: chargeToValidate.label.trim(),
            montant: montant,
          });
          console.log('🔧 [useChargesFixes] Charge modifiée avec succès');
        }

      setEditingId(null);
      console.log('✅ [useChargesFixes] Sauvegarde réussie, mode édition désactivé');
      return true; // Indiquer le succès
    } catch (error) {
      // En cas d'erreur, afficher le message d'erreur
      console.error('❌ [useChargesFixes] Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setErrors(prev => ({ ...prev, [id]: errorMessage }));
      return false; // Indiquer l'échec
    }
  }, [ajouterCharge, modifierCharge, chargesFixes]);

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