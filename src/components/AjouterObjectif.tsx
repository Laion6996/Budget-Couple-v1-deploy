import { useState } from 'react';

interface AjouterObjectifProps {
  onAjouter: (label: string, montantCible: number, dateLimite?: string) => void;
}

/**
 * Composant pour ajouter un nouvel objectif
 */
export const AjouterObjectif = ({ onAjouter }: AjouterObjectifProps) => {
  const [label, setLabel] = useState('');
  const [montantCible, setMontantCible] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (label.trim() === '') {
      setError('Le nom de l\'objectif est requis');
      return;
    }
    
    const montant = parseFloat(montantCible);
    if (isNaN(montant) || montant <= 0) {
      setError('Le montant cible doit être un nombre positif');
      return;
    }

    // Ajouter l'objectif
    onAjouter(label.trim(), montant, dateLimite || undefined);
    
    // Réinitialiser le formulaire
    setLabel('');
    setMontantCible('');
    setDateLimite('');
    setError('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLabel('');
    setMontantCible('');
    setDateLimite('');
    setError('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg border border-purple-500 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center space-x-3"
      >
        <span className="text-2xl">➕</span>
        <span className="text-xl font-semibold">Ajouter un nouvel objectif</span>
      </button>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">
        🎯 Nouvel objectif d'épargne
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom de l'objectif */}
        <div>
          <label htmlFor="label" className="block text-gray-300 text-sm font-medium mb-2">
            Nom de l'objectif *
          </label>
          <input
            type="text"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: Voyage en Italie, Nouvelle voiture..."
            autoFocus
          />
        </div>

        {/* Montant cible */}
        <div>
          <label htmlFor="montant" className="block text-gray-300 text-sm font-medium mb-2">
            Montant cible (€) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="montant"
              value={montantCible}
              onChange={(e) => setMontantCible(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
              placeholder="0.00"
            />
            <div className="absolute right-4 top-3 text-gray-400">
              €
            </div>
          </div>
        </div>

        {/* Date limite (optionnelle) */}
        <div>
          <label htmlFor="dateLimite" className="block text-gray-300 text-sm font-medium mb-2">
            Date limite (optionnelle)
          </label>
          <input
            type="date"
            id="dateLimite"
            value={dateLimite}
            onChange={(e) => setDateLimite(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-400 mt-1">
            Définir une deadline aide à maintenir le cap et à calculer la progression théorique
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-900 p-3 rounded-lg border border-red-700">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            ✅ Ajouter l'objectif
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  );
}; 