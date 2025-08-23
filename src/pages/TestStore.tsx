import { useAppStore } from '../stores';

/**
 * Page de test du store - Pour vérifier le fonctionnement de Zustand
 * Cette page peut être supprimée en production
 */
const TestStore = () => {
  const {
    moisActuel,
    salaireHoel,
    salaireZelie,
    charges,
    epargneCommune,
    setSalaires,
    setEpargneCommune,
    reinitialiserDonnees,
  } = useAppStore();

  const handleTestSalaires = () => {
    setSalaires(3500, 1800);
  };

  const handleTestEpargne = () => {
    setEpargneCommune(3000);
  };

  const handleReinitialiser = () => {
    reinitialiserDonnees();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Test du Store Zustand
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Page de test pour vérifier le fonctionnement du store et la persistance
        </p>

        {/* Affichage des données actuelles */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl font-semibold text-blue-400 mb-4">
            Données Actuelles
          </h3>
          
          <div className="space-y-4 text-left">
            <div>
              <span className="text-gray-300">Mois actuel : </span>
              <span className="text-white font-semibold">{moisActuel}</span>
            </div>
            <div>
              <span className="text-gray-300">Salaire Hoel : </span>
              <span className="text-white font-semibold">{salaireHoel}€</span>
            </div>
            <div>
              <span className="text-gray-300">Salaire Zelie : </span>
              <span className="text-white font-semibold">{salaireZelie}€</span>
            </div>
            <div>
              <span className="text-gray-300">Épargne commune : </span>
              <span className="text-white font-semibold">{epargneCommune}€</span>
            </div>
            <div>
              <span className="text-gray-300">Nombre de charges : </span>
              <span className="text-white font-semibold">{charges.length}</span>
            </div>
          </div>
        </div>

        {/* Boutons de test */}
        <div className="space-y-4">
          <div>
            <button
              onClick={handleTestSalaires}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mr-4 transition-colors"
            >
              Modifier Salaires (3500€ / 1800€)
            </button>
          </div>
          
          <div>
            <button
              onClick={handleTestEpargne}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mr-4 transition-colors"
            >
              Modifier Épargne (3000€)
            </button>
          </div>
          
          <div>
            <button
              onClick={handleReinitialiser}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réinitialiser Données
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-yellow-400 mb-3">
            Instructions de Test
          </h3>
          <ol className="text-gray-300 text-left space-y-2">
            <li>1. Cliquez sur un bouton pour modifier les données</li>
            <li>2. Rechargez la page (F5) pour vérifier la persistance</li>
            <li>3. Les données doivent être conservées</li>
            <li>4. Utilisez "Réinitialiser" pour revenir aux données de départ</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestStore; 