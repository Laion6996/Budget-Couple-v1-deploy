import React from 'react';
import { useBudgetsPerso } from '@hooks/useBudgetsPerso';
import { BudgetPersoRow } from '@components/BudgetPersoRow';
import { LazyDonutChart } from '@components/LazyDonutChart';

/**
 * Page Budgets Personnels - Gestion des budgets individuels
 */
export const Perso: React.FC = () => {
  // Hook pour Hoël
  const hoelHook = useBudgetsPerso('hoel');
  const zelieHook = useBudgetsPerso('zelie');

  // Calculs pour Hoël
  const budgetsHoel = hoelHook.budgets;
  const totalMontantHoel = hoelHook.totalBudget;
  const totalDepenseHoel = hoelHook.totalDepense;
  const resteHoel = hoelHook.totalReste;

  // Calculs pour Zélie  
  const budgetsZelie = zelieHook.budgets;
  const totalMontantZelie = zelieHook.totalBudget;
  const totalDepenseZelie = zelieHook.totalDepense;
  const resteZelie = zelieHook.totalReste;

  // Données pour le donut Hoël
  const dataDonutHoel = budgetsHoel.map((budget, index) => ({
    name: budget.nom,
    value: budget.depense,
    color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][index % 5]
  }));

  // Données pour le donut Zélie
  const dataDonutZelie = budgetsZelie.map((budget, index) => ({
    name: budget.nom,
    value: budget.depense,
    color: ['#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'][index % 5]
  }));

  return (
    <div className="p-4 sm:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          👥 Budgets Personnels
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 text-center">
          Gestion des dépenses individuelles de chacun
        </p>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Résumé Hoël */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700">
            <h3 className="text-2xl font-semibold text-blue-100 mb-4 text-center">👨‍💼 Hoël</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-blue-200 text-sm">Budget Total</p>
                <p className="text-white text-xl font-bold">{totalMontantHoel.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Dépensé</p>
                <p className="text-orange-300 text-xl font-bold">{totalDepenseHoel.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Reste</p>
                <p className={`text-xl font-bold ${resteHoel >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {resteHoel.toLocaleString()}€
                </p>
              </div>
            </div>
          </div>

          {/* Résumé Zélie */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700">
            <h3 className="text-2xl font-semibold text-green-100 mb-4 text-center">👩‍💼 Zélie</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-green-200 text-sm">Budget Total</p>
                <p className="text-white text-xl font-bold">{totalMontantZelie.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-green-200 text-sm">Dépensé</p>
                <p className="text-orange-300 text-xl font-bold">{totalDepenseZelie.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-green-200 text-sm">Reste</p>
                <p className={`text-xl font-bold ${resteZelie >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {resteZelie.toLocaleString()}€
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Donut Hoël */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
              📊 Dépenses Hoël
            </h3>
            {budgetsHoel.length > 0 ? (
              <div className="h-64">
                <LazyDonutChart
                  data={dataDonutHoel}
                  totalBudget={totalMontantHoel}
                  totalDepense={totalDepenseHoel}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-400">Aucun budget configuré</p>
              </div>
            )}
          </div>

          {/* Donut Zélie */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-green-400 mb-4 text-center">
              📊 Dépenses Zélie
            </h3>
            {budgetsZelie.length > 0 ? (
              <div className="h-64">
                <LazyDonutChart
                  data={dataDonutZelie}
                  totalBudget={totalMontantZelie}
                  totalDepense={totalDepenseZelie}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-400">Aucun budget configuré</p>
              </div>
            )}
          </div>
        </div>

        {/* Budgets Hoël */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-2xl font-semibold text-blue-400">
              👨‍💼 Budgets Hoël
            </h3>
            <button
              onClick={hoelHook.ajouterBudgetPerso}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>+</span>
              <span>Ajouter budget</span>
            </button>
          </div>

          <div className="overflow-hidden">
            {budgetsHoel.length > 0 ? (
              <div className="space-y-4">
                {budgetsHoel.map((budget) => (
                  <BudgetPersoRow
                    key={budget.id}
                    budget={budget}
                    isEditing={hoelHook.editingId === budget.id}
                    error={hoelHook.errors[budget.id]}
                    onEdit={hoelHook.commencerEdition}
                    onSave={hoelHook.sauvegarderBudget}
                    onDelete={hoelHook.supprimerBudgetPerso}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun budget personnel configuré pour Hoël. Cliquez sur "Ajouter budget" pour commencer.
              </div>
            )}
          </div>
        </div>

        {/* Budgets Zélie */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-2xl font-semibold text-green-400">
              👩‍💼 Budgets Zélie
            </h3>
            <button
              onClick={zelieHook.ajouterBudgetPerso}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>+</span>
              <span>Ajouter budget</span>
            </button>
          </div>

          <div className="overflow-hidden">
            {budgetsZelie.length > 0 ? (
              <div className="space-y-4">
                {budgetsZelie.map((budget) => (
                  <BudgetPersoRow
                    key={budget.id}
                    budget={budget}
                    isEditing={zelieHook.editingId === budget.id}
                    error={zelieHook.errors[budget.id]}
                    onEdit={zelieHook.commencerEdition}
                    onSave={zelieHook.sauvegarderBudget}
                    onDelete={zelieHook.supprimerBudgetPerso}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun budget personnel configuré pour Zélie. Cliquez sur "Ajouter budget" pour commencer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perso;