import { useState, useEffect } from 'react';
import type { ChargeFixe } from '../schemas/parametres';

interface ChargeFixeRowProps {
  charge: ChargeFixe;
  isEditing: boolean;
  error?: string;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Composant pour une ligne de charge fixe éditables - RESPONSIVE MOBILE
 * Layout mobile-first : empilé sur mobile, tableau sur desktop
 */
export const ChargeFixeRow = ({
  charge,
  isEditing,
  error,
  onEdit,
  onSave,
  onDelete,
}: ChargeFixeRowProps) => {
  const [label, setLabel] = useState(charge.label);
  const [montant, setMontant] = useState(charge.montant.toString());
  const [localError, setLocalError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Synchroniser avec les changements externes
  useEffect(() => {
    setLabel(charge.label);
    setMontant(charge.montant.toString());
  }, [charge]);

  const handleSave = () => {
    if (label.trim() === '') {
      setLocalError('Le nom de la charge est requis');
      return;
    }

    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      setLocalError('Le montant doit être un nombre positif');
      return;
    }

    onSave(charge.id);
    setLocalError('');
  };

  const handleCancel = () => {
    setLabel(charge.label);
    setMontant(charge.montant.toString());
    onEdit(''); // Arrêter l'édition
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Layout mobile : carte empilée
  if (isMobile) {
    if (isEditing) {
      return (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            {/* Nom de la charge */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la charge
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-500'
                }`}
                placeholder="Nom de la charge"
                autoFocus
              />
            </div>
            
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Montant mensuel
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  onKeyDown={handleKeyPress}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-500'
                  }`}
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  €
                </div>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center justify-center"
              >
                <span className="mr-2">💾</span>
                Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center justify-center"
              >
                <span className="mr-2">❌</span>
                Annuler
              </button>
            </div>
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
            >
              <span className="mr-2">✏️</span>
              Modifier
            </button>
            <button
              onClick={() => onDelete(charge.id)}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center justify-center"
            >
              <span className="mr-2">🗑</span>
              Supprimer
            </button>
          </div>
          
          {/* Erreur locale */}
          {localError && (
            <p className="text-sm text-red-400 mt-2 text-center">
              {localError}
            </p>
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
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder="Nom de la charge"
            autoFocus
          />
        </td>
        <td className="px-4 py-3">
          <div className="relative">
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              onKeyDown={handleKeyPress}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="0.00"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              €
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              💾
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            >
              ❌
            </button>
          </div>
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
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(charge.id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
          >
            🗑
          </button>
        </div>
        
        {localError && (
          <p className="text-sm text-red-400 mt-1">
            {localError}
          </p>
        )}
      </td>
    </tr>
  );
}; 