import { useState, useRef } from 'react';

interface Objectif {
  id: string;
  label: string;
  montantCible: number;
  dejaEpargne: number;
  historique?: { date: string; montant: number }[];
}

interface ObjectifRowProps {
  objectif: Objectif;
  onIncrementer: (id: string, montant: number) => void;
  onDelete: (id: string) => void;
}

/**
 * Composant pour une ligne d'objectif avec barre de progression et boutons d'incrémentation
 */
export const ObjectifRow = ({ objectif, onIncrementer, onDelete }: ObjectifRowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const inputAjouterRef = useRef<HTMLInputElement>(null);
  const inputRetirerRef = useRef<HTMLInputElement>(null);
  
  const pourcentage = objectif.montantCible > 0 
    ? Math.min((objectif.dejaEpargne / objectif.montantCible) * 100, 100) 
    : 0;
  
  const reste = objectif.montantCible - objectif.dejaEpargne;
  const isCompleted = objectif.dejaEpargne >= objectif.montantCible;

  // Fonction pour valider et ajouter le montant
  const ajouterMontant = () => {
    if (!inputAjouterRef.current) return;
    
    const montant = parseFloat(inputAjouterRef.current.value);
    if (!isNaN(montant) && montant > 0) {
      onIncrementer(objectif.id, montant);
      inputAjouterRef.current.value = ''; // Vider l'input après utilisation
    } else {
      alert('❌ Veuillez entrer un montant valide (ex: 40, 245.50)');
    }
  };

  // Fonction pour valider et retirer le montant
  const retirerMontant = () => {
    if (!inputRetirerRef.current) return;
    
    const montant = parseFloat(inputRetirerRef.current.value);
    if (!isNaN(montant) && montant > 0) {
      // Vérifier qu'on ne retire pas plus que ce qui est épargné
      if (montant > objectif.dejaEpargne) {
        alert(`❌ Impossible de retirer ${montant}€ car vous n'avez épargné que ${objectif.dejaEpargne.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€`);
        return;
      }
      
      // Retirer le montant (montant négatif)
      onIncrementer(objectif.id, -montant);
      inputRetirerRef.current.value = ''; // Vider l'input après utilisation
    } else {
      alert('❌ Veuillez entrer un montant valide (ex: 40, 245.50)');
    }
  };

  // Couleur de la barre selon le pourcentage
  const getBarColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (pourcentage >= 75) return 'bg-blue-500';
    if (pourcentage >= 50) return 'bg-yellow-500';
    if (pourcentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Couleur du texte selon le pourcentage
  const getTextColor = () => {
    if (isCompleted) return 'text-green-400';
    if (pourcentage >= 75) return 'text-blue-400';
    if (pourcentage >= 50) return 'text-yellow-400';
    if (pourcentage >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div 
      className={`group bg-gray-800 p-6 rounded-lg border border-gray-700 transition-all duration-200 ${
        isHovered ? 'shadow-lg transform scale-[1.02]' : ''
      } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* En-tête de l'objectif */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
            {isCompleted && '🎯 '}{objectif.label}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Objectif: {objectif.montantCible.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
          </p>
        </div>
        
        {/* Bouton supprimer */}
        <button
          onClick={() => onDelete(objectif.id)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Supprimer cet objectif"
        >
          🗑
        </button>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${getTextColor()}`}>
            {pourcentage.toFixed(1)}% atteint
          </span>
          <span className="text-gray-400 text-sm">
            {objectif.dejaEpargne.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€ / {objectif.montantCible.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${getBarColor()}`}
            style={{ width: `${pourcentage}%` }}
          />
        </div>
      </div>

      {/* Informations de progression */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-300 text-sm">Déjà épargné</p>
          <p className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
            {objectif.dejaEpargne.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
          </p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-300 text-sm">Reste à épargner</p>
          <p className={`text-lg font-bold ${reste <= 0 ? 'text-green-400' : 'text-orange-400'}`}>
            {reste > 0 ? reste.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0.00'}€
          </p>
        </div>
      </div>

      {/* Boutons d'incrémentation */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => onIncrementer(objectif.id, 10)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          disabled={isCompleted}
        >
          <span>+10€</span>
        </button>
        
        <button
          onClick={() => onIncrementer(objectif.id, 25)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          disabled={isCompleted}
        >
          <span>+25€</span>
        </button>
        
        <button
          onClick={() => onIncrementer(objectif.id, 50)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          disabled={isCompleted}
        >
          <span>+50€</span>
        </button>
        
        <button
          onClick={() => onIncrementer(objectif.id, 100)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          disabled={isCompleted}
        >
          <span>+100€</span>
        </button>

        {/* Input montant personnalisé */}
        <div className="flex items-center space-x-2">
          <input
            ref={inputAjouterRef}
            type="number"
            placeholder="Montant à ajouter"
            min="0"
            step="0.01"
            className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                ajouterMontant();
              }
            }}
          />
          <button
            onClick={ajouterMontant}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            disabled={isCompleted}
            title="Ajouter le montant saisi"
          >
            <span>💜</span>
            <span>Ajouter</span>
          </button>
        </div>
        
        {/* Input montant à retirer */}
        <div className="flex items-center space-x-2">
          <input
            ref={inputRetirerRef}
            type="number"
            placeholder="Montant à retirer"
            min="0"
            step="0.01"
            className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                retirerMontant();
              }
            }}
          />
          <button
            onClick={retirerMontant}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            disabled={objectif.dejaEpargne <= 0}
            title="Retirer le montant saisi de l'épargne"
          >
            <span>💔</span>
            <span>Retirer</span>
          </button>
        </div>
      </div>

      {/* Historique des montants épargnés */}
      <div className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
        <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
          📅 Historique des épargnes
        </h5>
        
        {objectif.historique && objectif.historique.length > 0 ? (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {objectif.historique.map((entry, index) => {
              const isRetrait = entry.montant < 0;
              const montantAbsolu = Math.abs(entry.montant);
              
              return (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className={`font-semibold flex items-center space-x-1 ${
                    isRetrait ? 'text-red-400' : 'text-green-400'
                  }`}>
                    <span>{isRetrait ? '💔' : '💜'}</span>
                    <span>{isRetrait ? '-' : '+'}{montantAbsolu.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-2">
            Aucun montant épargné pour le moment
          </p>
        )}
      </div>

      {/* Message de félicitations si objectif atteint */}
      {isCompleted && (
        <div className="mt-4 bg-green-900 p-4 rounded-lg border border-green-700 text-center">
          <p className="text-green-200 font-semibold text-lg">
            🎉 Félicitations ! Objectif atteint !
          </p>
          <p className="text-green-300 text-sm mt-1">
            Vous avez épargné {objectif.dejaEpargne.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€ pour {objectif.label}
          </p>
        </div>
      )}
    </div>
  );
}; 