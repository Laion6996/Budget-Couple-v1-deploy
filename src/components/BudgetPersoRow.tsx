import { useState, useEffect } from 'react';

interface BudgetPerso {
  id: string;
  nom: string;
  montant: number;
  depense: number;
  dateLimite?: string;
}

interface BudgetPersoRowProps {
  budget: BudgetPerso;
  isEditing: boolean;
  error?: string;
  onEdit: (id: string) => void;
  onSave: (budget: BudgetPerso) => boolean;
  onDelete: (id: string) => void;
}

/**
 * Composant pour une ligne de budget personnel éditables
 */
export const BudgetPersoRow = ({ 
  budget, 
  isEditing, 
  error, 
  onEdit, 
  onSave, 
  onDelete 
}: BudgetPersoRowProps) => {
  const [nom, setNom] = useState(budget.nom);
  const [montant, setMontant] = useState(budget.montant.toString());
  const [depense, setDepense] = useState(budget.depense.toString());
  const [dateLimite, setDateLimite] = useState(budget.dateLimite || '');

  // Synchroniser avec les changements externes
  useEffect(() => {
    setNom(budget.nom);
    setMontant(budget.montant.toString());
    setDepense(budget.depense.toString());
    setDateLimite(budget.dateLimite || '');
  }, [budget]);

  const handleSave = () => {
    const updatedBudget = {
      ...budget,
      nom: nom.trim(),
      montant: parseFloat(montant) || 0,
      depense: parseFloat(depense) || 0,
      dateLimite: dateLimite || undefined,
    };
    
    if (onSave(updatedBudget)) {
      // La sauvegarde a réussi
    }
  };

  const handleCancel = () => {
    setNom(budget.nom);
    setMontant(budget.montant.toString());
    setDepense(budget.depense.toString());
    setDateLimite(budget.dateLimite || '');
    onEdit(''); // Arrêter l'édition
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const reste = budget.montant - budget.depense;
  const pourcentageUtilise = budget.montant > 0 ? (budget.depense / budget.montant) * 100 : 0;

  if (isEditing) {
    return (
      <tr className="bg-gray-700 border-b border-gray-600">
        <td className="px-4 py-3">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder="Nom du budget"
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
          <div className="relative">
            <input
              type="number"
              value={depense}
              onChange={(e) => setDepense(e.target.value)}
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
          <input
            type="date"
            value={dateLimite}
            onChange={(e) => setDateLimite(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
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
        {budget.nom}
      </td>
      <td className="px-4 py-3 text-white font-mono">
        {budget.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
      </td>
      <td className="px-4 py-3 text-white font-mono">
        {budget.depense.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
      </td>
      <td className="px-4 py-3 text-white text-sm">
        {budget.dateLimite ? (
          <span className="text-blue-300">
            📅 {new Date(budget.dateLimite).toLocaleDateString('fr-FR')}
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <div className="text-gray-300">
              Reste: <span className={`font-bold ${reste >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {reste.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              {pourcentageUtilise.toFixed(1)}% utilisé
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(budget.id)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(budget.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              🗑
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}; 