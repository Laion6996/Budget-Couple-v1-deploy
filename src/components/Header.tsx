import { useAppStore } from '../stores';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { reinitialiserDonnees } = useAppStore();

  const handleResetDemo = () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données ?\n\nCette action remettra les données de démonstration et supprimera toutes vos modifications.')) {
      reinitialiserDonnees();
      alert('✅ Données réinitialisées avec succès !');
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">
            Budget Couple
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Gestion de budget simplifiée
          </p>
          {/* Bouton Réinitialiser démo */}
          <button
            onClick={handleResetDemo}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm transition-all duration-300 hover:scale-105"
            title="Remettre les données de démonstration"
            aria-label="Réinitialiser toutes les données de démonstration"
          >
            🔄 Réinitialiser démo
          </button>
        </div>
        
        {/* Navigation simple */}
        <nav className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onNavigate('accueil')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'accueil' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            aria-label="Aller à la page d'accueil"
          >
            Accueil
          </button>
          <button 
            onClick={() => onNavigate('parametres')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'parametres' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            aria-label="Aller aux paramètres"
          >
            Paramètres
          </button>
          <button 
            onClick={() => onNavigate('perso')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'perso' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            aria-label="Aller aux budgets personnels"
          >
            Perso
          </button>
          <button 
            onClick={() => onNavigate('objectifs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'objectifs' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            aria-label="Aller aux objectifs d'épargne"
          >
            Objectifs
          </button>
          <button 
            onClick={() => onNavigate('historique')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'historique' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            aria-label="Aller à l'historique"
          >
            📊 Historique
          </button>
        </nav>
      </div>
    </header>
  );
}; 