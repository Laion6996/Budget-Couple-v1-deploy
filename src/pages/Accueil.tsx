import { useAppStore } from '../stores';

/**
 * Page d'accueil - Vue d'ensemble du budget
 */
const Accueil = () => {
  // Récupération des données du store
  const {
    moisActuel,
    salaireHoel,
    salaireZelie,
    charges,
    epargneCommune,
    objectifs,
  } = useAppStore();

  // Calculs dérivés
  const totalSalaires = salaireHoel + salaireZelie;
  const chargesPayees = charges.filter((c) => c.payee);
  const chargesAPayer = charges.filter((c) => !c.payee);
  const totalChargesPayees = chargesPayees.reduce((sum, c) => sum + c.montant, 0);
  const totalChargesAPayer = chargesAPayer.reduce((sum, c) => sum + c.montant, 0);

  return (
    <div className="p-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Bienvenue sur Budget Couple
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Gérez votre budget en couple de manière simple et efficace
        </p>

        {/* Informations du mois actuel */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-semibold text-blue-400 mb-4">
            Mois de {moisActuel}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Salaire Hoel</p>
              <p className="text-white text-xl font-bold">{salaireHoel.toLocaleString()}€</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Salaire Zelie</p>
              <p className="text-white text-xl font-bold">{salaireZelie.toLocaleString()}€</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Total Salaires</p>
              <p className="text-white text-xl font-bold">{totalSalaires.toLocaleString()}€</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Épargne Commune</p>
              <p className="text-white text-xl font-bold">{epargneCommune.toLocaleString()}€</p>
            </div>
          </div>
        </div>

        {/* Résumé des charges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Charges Payées
            </h3>
            <p className="text-3xl font-bold text-white mb-2">
              {totalChargesPayees.toLocaleString()}€
            </p>
            <p className="text-gray-300 text-sm">
              {chargesPayees.length} charge(s) réglée(s)
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-orange-400 mb-3">
              Charges à Payer
            </h3>
            <p className="text-3xl font-bold text-white mb-2">
              {totalChargesAPayer.toLocaleString()}€
            </p>
            <p className="text-gray-300 text-sm">
              {chargesAPayer.length} charge(s) en attente
            </p>
          </div>
        </div>
        
        {/* Cartes d'action rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Vue d'ensemble
            </h3>
            <p className="text-gray-300">
              Consultez rapidement l'état de vos finances
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Ajouter une dépense
            </h3>
            <p className="text-gray-300">
              Enregistrez vos dépenses en quelques clics
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">
              Objectifs ({objectifs.length})
            </h3>
            <p className="text-gray-300">
              Suivez vos objectifs d'épargne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil; 