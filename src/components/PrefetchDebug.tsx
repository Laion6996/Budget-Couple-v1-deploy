import React from 'react';

interface PrefetchDebugProps {
  prefetchCompleted: boolean;
}

/**
 * Composant de debug pour afficher l'état du prefetch
 * Visible uniquement en mode développement
 */
export const PrefetchDebug: React.FC<PrefetchDebugProps> = ({ prefetchCompleted }) => {
  // Ne s'afficher qu'en mode développement
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 bg-blue-900 text-white p-3 rounded-lg border border-blue-700 text-xs z-50">
      <div className="font-semibold mb-1">🚀 Prefetch Debug</div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span>Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            prefetchCompleted 
              ? 'bg-green-600 text-white' 
              : 'bg-yellow-600 text-white'
          }`}>
            {prefetchCompleted ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>
        <div className="text-blue-200">
          {prefetchCompleted 
            ? 'Composants préchargés' 
            : 'En attente d\'idle...'
          }
        </div>
      </div>
    </div>
  );
};
