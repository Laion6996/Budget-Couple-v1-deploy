import { useState, useEffect } from 'react';
import { FormField } from './FormField';
import type { ChargeFixe } from '../schemas/parametres';

interface ChargeFixeRowProps {
  charge: ChargeFixe;
  isEditing: boolean;
  error?: string;
  onEdit: (id: string) => void;
  onSave: (id: string, updatedData?: { label: string; montant: number }) => boolean;
  onDelete: (charge: ChargeFixe) => void;
  isMobileView?: boolean;
}

/**
 * Composant pour une ligne de charge fixe éditables - RESPONSIVE MOBILE
 * Layout mobile-first : empilé sur mobile, tableau sur desktop
 * Amélioré avec sauvegarde intuitive et validation
 */
export const ChargeFixeRow = ({
  charge,
  isEditing,
  error,
  onEdit,
  onSave,
  onDelete,
  isMobileView = false,
}: ChargeFixeRowProps) => {
  const [label, setLabel] = useState(charge.label);
  const [montant, setMontant] = useState(charge.montant.toString());
  const [localError, setLocalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Synchroniser avec les changements externes
  useEffect(() => {
    setLabel(charge.label);
    setMontant(charge.montant.toString());
    setHasChanges(false);
    setLocalError('');
  }, [charge]);

  // Détecter les changements
  useEffect(() => {
    const hasLabelChanged = label !== charge.label;
    const hasMontantChanged = Number(montant) !== charge.montant;
    setHasChanges(hasLabelChanged || hasMontantChanged);
  }, [label, montant, charge.label, charge.montant]);

  // Validation avec Zod-like (validation locale)
  const validateFields = () => {
    const errors: string[] = [];
    
    if (!label || label.trim() === '') {
      errors.push('Le nom de la charge est requis');
    }
    
    const montantNum = Number(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      errors.push('Le montant doit être un nombre positif');
    }

    return errors;
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    const errors = validateFields();
    if (errors.length > 0) {
      setLocalError(errors.join(', '));
      return;
    }

    setIsSaving(true);
    setLocalError('');

    try {
      const updatedCharge = {
        ...charge,
        label: label.trim(),
        montant: Number(montant)
      };

      const success = onSave(charge.id, {
        label: updatedCharge.label,
        montant: updatedCharge.montant
      });

      if (success) {
        setHasChanges(false);
        // Les valeurs seront synchronisées via useEffect
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarde automatique sur onBlur si les champs sont valides
  const handleBlur = () => {
    if (hasChanges && validateFields().length === 0) {
      handleSave();
    }
  };

  const handleCancel = () => {
    setLabel(charge.label);
    setMontant(charge.montant.toString());
    setLocalError('');
    setHasChanges(false);
    onEdit(''); // Arrêter l'édition
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Layout mobile : carte empilée
  if (isMobileView) {
    if (isEditing) {
      return (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            {/* Nom de la charge */}
            <FormField
              label="Nom de la charge"
              name="label"
              type="text"
              value={label}
              onChange={(value) => setLabel(value as string)}
              onBlur={handleBlur}
              placeholder="Nom de la charge"
              error={error || localError}
              required
            />
            
            {/* Montant */}
            <FormField
              label="Montant mensuel"
              name="montant"
              type="number"
              value={montant}
              onChange={(value) => setMontant(value.toString())}
              onBlur={handleBlur}
              placeholder="0.00"
              error={error || localError}
              required
              min={0}
              step={0.01}
            />
            
            {/* Boutons d'action */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`flex-1 px-4 py-2 text-white text-sm rounded transition-colors flex items-center justify-center ${
                  isSaving || !hasChanges
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                aria-label="Enregistrer"
                title="Enregistrer les modifications"
              >
                <span className="mr-2">💾</span>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center justify-center"
                aria-label="Annuler"
                title="Annuler les modifications"
              >
                <span className="mr-2">❌</span>
                Annuler
              </button>
            </div>

            {/* Indicateur de changements */}
            {hasChanges && (
              <div className="text-xs text-yellow-400 text-center">
                ⚠️ Modifications non sauvegardées
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 hover:bg-gray-700 transition-colors">
        <div className="space-y-3">
          {/* Informations de la charge */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-medium text-lg">{charge.label}</h4>
              <p className="text-gray-400 text-sm">Charge mensuelle</p>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-xl font-bold">
                {charge.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onEdit(charge.id)}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center justify-center"
              aria-label="Modifier"
              title="Modifier cette charge"
            >
              <span className="mr-2">✏️</span>
              Modifier
            </button>
            <button
              onClick={() => onDelete(charge)}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center justify-center"
              aria-label="Supprimer"
              title="Supprimer cette charge"
            >
              <span className="mr-2">🗑</span>
              Supprimer
            </button>
          </div>
          
          {/* Affichage des erreurs */}
          {(error || localError) && (
            <div className="mt-2">
              <p className="text-sm text-red-400 text-center">
                {error || localError}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout desktop : tableau classique
  if (isEditing) {
    return (
      <tr className="bg-gray-700 border-b border-gray-600">
        <td className="px-4 py-3">
          <div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                (error || localError) ? 'border-red-500 ring-red-500' : 'border-gray-500'
              }`}
              placeholder="Nom de la charge"
              autoFocus
              aria-label="Nom de la charge"
            />
            {(error || localError) && (
              <p className="mt-1 text-xs text-red-400">
                {error || localError}
              </p>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="relative">
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                (error || localError) ? 'border-red-500 ring-red-500' : 'border-gray-500'
              }`}
              placeholder="0.00"
              aria-label="Montant mensuel"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              €
            </div>
          </div>
          {(error || localError) && (
            <p className="mt-1 text-xs text-red-400">
              {error || localError}
            </p>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`px-4 py-2 text-white text-sm rounded transition-colors flex items-center space-x-2 ${
                isSaving || !hasChanges
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              aria-label="Enregistrer"
              title="Enregistrer les modifications"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Sauvegarder</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center space-x-2"
              aria-label="Annuler"
              title="Annuler les modifications"
            >
              <span>❌</span>
              <span className="hidden sm:inline">Annuler</span>
            </button>
          </div>
          
          {/* Indicateur de changements */}
          {hasChanges && (
            <div className="mt-2">
              <p className="text-xs text-yellow-400">
                ⚠️ Modifications non sauvegardées
              </p>
            </div>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-700 border-b border-gray-600">
      <td className="px-4 py-3 text-white">
        {charge.label}
      </td>
      <td className="px-4 py-3 text-white font-mono">
        {charge.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(charge.id)}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            aria-label="Modifier"
            title="Modifier cette charge"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(charge)}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            aria-label="Supprimer"
            title="Supprimer cette charge"
          >
            🗑
          </button>
        </div>
        
        {/* Affichage des erreurs */}
        {(error || localError) && (
          <div className="mt-2">
            <p className="text-sm text-red-400">
              {error || localError}
            </p>
          </div>
        )}
      </td>
    </tr>
  );
}; 