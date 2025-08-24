import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@components/Toast';

interface DeletedItem<T> {
  id: string;
  data: T;
  timestamp: number;
}

/**
 * Hook pour gérer la suppression sécurisée avec fonctionnalité Undo
 * Stocke temporairement les éléments supprimés pour permettre leur restauration
 */
export const useSecureDelete = <T extends { id: string }>() => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem<T>[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const { showUndoToast } = useToast();

  // Préparer la suppression (ouvrir la modal de confirmation)
  const prepareDelete = useCallback((item: T) => {
    console.log('🔧 [useSecureDelete] prepareDelete appelé avec item:', item);
    console.log('🔧 [useSecureDelete] Type de item:', typeof item);
    console.log('🔧 [useSecureDelete] Propriétés de item:', Object.keys(item || {}));
    console.log('🔧 [useSecureDelete] item.id:', item?.id);
    
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  }, []);

  // Annuler la suppression
  const undoDelete = useCallback((itemId: string, onRestore: (item: T) => void) => {
    const deletedItem = deletedItems.find(item => item.id === itemId);
    if (!deletedItem) return;
    
    // Restaurer l'élément
    onRestore(deletedItem.data);
    
    // Retirer de la liste des supprimés
    setDeletedItems(prev => prev.filter(item => item.id !== itemId));
  }, [deletedItems]);

  // Confirmer la suppression
  const confirmDelete = useCallback((onDelete: (id: string) => void) => {
    console.log('🔧 [useSecureDelete] confirmDelete appelé');
    console.log('🔧 [useSecureDelete] itemToDelete:', itemToDelete);
    
    if (!itemToDelete) {
      console.error('❌ [useSecureDelete] itemToDelete est null/undefined');
      return;
    }

    const itemId = itemToDelete.id;
    console.log('🔧 [useSecureDelete] itemId extrait:', itemId);
    console.log('🔧 [useSecureDelete] Type de itemId:', typeof itemId);
    
    if (!itemId) {
      console.error('❌ [useSecureDelete] itemId est null/undefined/empty');
      return;
    }
    
    console.log('🔧 [useSecureDelete] Appel de onDelete avec itemId:', itemId);
    
    // Exécuter la suppression
    onDelete(itemId);
    
    // Stocker l'élément supprimé pour l'Undo
    const deletedItem: DeletedItem<T> = {
      id: itemId,
      data: itemToDelete,
      timestamp: Date.now()
    };
    
    setDeletedItems(prev => [...prev, deletedItem]);
    
    // Afficher le toast avec option d'annulation
    showUndoToast(
      `"${(itemToDelete as any).label || itemToDelete.id}" supprimé — Annuler ?`,
      () => undoDelete(itemId, (item) => {
        // Callback optionnel pour des actions supplémentaires après annulation
        console.log('Élément restauré:', item);
      }),
      5000
    );
    
    // Nettoyer l'état
    setItemToDelete(null);
    setIsConfirmModalOpen(false);
    
    // Supprimer l'élément de la liste des supprimés après 5 secondes
    setTimeout(() => {
      setDeletedItems(prev => prev.filter(item => item.id !== itemId));
    }, 5000);
  }, [itemToDelete, showUndoToast, undoDelete]);

  // Annuler la modal de confirmation
  const cancelDelete = useCallback(() => {
    setItemToDelete(null);
    setIsConfirmModalOpen(false);
  }, []);

  // Nettoyer les éléments supprimés expirés
  const cleanupExpiredItems = useCallback(() => {
    const now = Date.now();
    const expiredItems = deletedItems.filter(item => (now - item.timestamp) > 5000);
    
    if (expiredItems.length > 0) {
      setDeletedItems(prev => prev.filter(item => !expiredItems.includes(item)));
    }
  }, [deletedItems]);

  // Nettoyer périodiquement
  useEffect(() => {
    const interval = setInterval(cleanupExpiredItems, 1000);
    return () => clearInterval(interval);
  }, [cleanupExpiredItems]);

  return {
    // État
    isConfirmModalOpen,
    itemToDelete,
    deletedItems,
    
    // Actions
    prepareDelete,
    confirmDelete,
    cancelDelete,
    undoDelete,
    
    // Utilitaires
    cleanupExpiredItems
  };
};
