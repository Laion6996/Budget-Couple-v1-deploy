import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmation générique pour les actions importantes
 * Utilise des variantes de couleur selon le type d'action
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  itemName,
  itemType = 'élément',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  // Générer le titre et la description par défaut si non fournis
  const defaultTitle = title || `Supprimer ${itemType}`;
  const defaultDescription = description || 
    (itemName ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ?` : `Êtes-vous sûr de vouloir supprimer cet ${itemType} ?`);

  const getConfirmButtonStyles = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }
  };

  const getIcon = () => {
    switch (confirmVariant) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'primary':
        return 'ℹ️';
      default:
        return '🗑️';
    }
  };

  // Confirmer la suppression
  const handleConfirm = () => {
    console.log('🔧 [ConfirmModal] Bouton Confirmer cliqué');
    onConfirm();
  };

  // Annuler la modal
  const handleCancel = () => {
    console.log('🔧 [ConfirmModal] Bouton Annuler cliqué');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay sombre */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 border border-gray-600 shadow-xl transition-all">
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getIcon()}</span>
              <h3 className="text-lg font-semibold text-white">
                {defaultTitle}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              {defaultDescription}
            </p>
            <p className="text-gray-400 text-xs mt-3">
              ⚠️ Cette action est irréversible
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 p-6 border-t border-gray-600">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
