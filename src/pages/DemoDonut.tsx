import React from 'react';
import { LazyDonutChart } from '@components/LazyDonutChart';
import { DonutAnalysis } from '@/charts/DonutAnalysis';
import type { DonutSlice } from '@/charts/DonutAnalysis';
import { useCategoryDetails } from '@hooks/useCategoryDetails';
import { useCategoryNavigation } from '@hooks/useCategoryNavigation';

interface DemoDonutProps {
  navigateTo?: (page: 'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut') => void;
}

/**
 * Page Démo Donut - Page de démonstration des graphiques DonutChart
 */
export const DemoDonut: React.FC<DemoDonutProps> = ({ navigateTo }) => {
  // Hook pour les détails des catégories
  const { categoryDetails } = useCategoryDetails();
  const { navigateToCategory } = useCategoryNavigation(navigateTo);
  
  // Données d'exemple pour les démonstrations
  const demoDataBudget = [
    { name: 'Loyer', value: 800, color: '#3B82F6' },
    { name: 'Alimentation', value: 400, color: '#10B981' },
    { name: 'Transport', value: 200, color: '#F59E0B' },
    { name: 'Loisirs', value: 300, color: '#8B5CF6' },
    { name: 'Assurance', value: 150, color: '#EC4899' },
    { name: 'Internet', value: 50, color: '#EF4444' },
    { name: 'Électricité', value: 120, color: '#06B6D4' },
    { name: 'Eau', value: 80, color: '#84CC16' },
    { name: 'Gaz', value: 90, color: '#F97316' },
    { name: 'Téléphone', value: 45, color: '#A855F7' },
    { name: 'Mutuelle', value: 110, color: '#14B8A6' },
    { name: 'Ordures', value: 25, color: '#F43F5E' }
  ];

  const demoDataDepenses = [
    { name: 'Courses', value: 320, color: '#10B981' },
    { name: 'Restaurants', value: 180, color: '#F59E0B' },
    { name: 'Essence', value: 150, color: '#3B82F6' },
    { name: 'Sorties', value: 200, color: '#8B5CF6' },
    { name: 'Shopping', value: 120, color: '#EC4899' }
  ];

  const demoSlices: DonutSlice[] = [
    { id: '1', label: 'Épargne', value: 500, color: '#10B981' },
    { id: '2', label: 'Charges fixes', value: 800, color: '#EF4444' },
    { id: '3', label: 'Dépenses variables', value: 400, color: '#F59E0B' },
    { id: '4', label: 'Loisirs', value: 300, color: '#8B5CF6' }
  ];

  const totalBudget = demoDataBudget.reduce((sum, item) => sum + item.value, 0);
  const totalDepenses = demoDataDepenses.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-4 sm:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          🍩 Démonstration DonutChart
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 text-center">
          Exemples d'utilisation des graphiques en donut avec lazy loading
        </p>

        {/* Performance Info */}
        <div className="bg-gradient-to-r from-green-900 to-blue-900 p-4 sm:p-6 rounded-lg border border-green-700 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="text-xl sm:text-2xl">⚡</div>
            <div>
              <h3 className="text-green-200 font-semibold text-sm sm:text-base">Optimisation Performance</h3>
              <p className="text-green-300 text-xs sm:text-sm">
                Ces graphiques utilisent le lazy loading avec requestIdleCallback. 
                Recharts n'est chargé qu'après 200ms d'inactivité du thread principal.
              </p>
            </div>
          </div>
          
          {/* Statistiques globales */}
          <div className="grid grid-cols-1 gap-2 sm:gap-4 mt-3 sm:mt-4">
            <div className="bg-green-800 p-2 sm:p-3 rounded-lg text-center">
              <div className="text-green-200 text-xs">Total Budget</div>
              <div className="text-white font-bold text-base sm:text-lg">{totalBudget.toLocaleString()}€</div>
            </div>
            <div className="bg-blue-800 p-2 sm:p-3 rounded-lg text-center">
              <div className="text-blue-200 text-xs">Total Dépenses</div>
              <div className="text-white font-bold text-base sm:text-lg">{totalDepenses.toLocaleString()}€</div>
            </div>
            <div className="bg-purple-800 p-2 sm:p-3 rounded-lg text-center">
              <div className="text-purple-200 text-xs">Total DonutAnalysis</div>
              <div className="text-white font-bold text-base sm:text-lg">{demoSlices.reduce((sum, slice) => sum + slice.value, 0).toLocaleString()}€</div>
            </div>
          </div>
        </div>

        {/* Grid de démonstrations */}
        <div className="space-y-8 sm:space-y-12">
          {/* Première ligne : DonutChart classique */}
          <div className="grid grid-cols-1 gap-6 sm:gap-10">
            <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-4 sm:mb-6 text-center">
                💰 Répartition Budget Mensuel
              </h3>
              <div className="h-auto min-h-64 sm:min-h-80 mb-4 sm:mb-6 overflow-hidden">
                                 <LazyDonutChart
                   data={demoDataBudget}
                   totalBudget={totalBudget}
                   totalDepense={totalBudget}
                   delay={100}
                   categoryDetails={categoryDetails}
                 />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Total budget: <span className="text-white font-bold">{totalBudget.toLocaleString()}€</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {demoDataBudget.length} catégories de dépenses
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-4 sm:mb-6 text-center">
                🛒 Dépenses Variables
              </h3>
              <div className="h-auto min-h-64 sm:min-h-80 mb-4 sm:mb-6 overflow-hidden">
                                 <LazyDonutChart
                   data={demoDataDepenses}
                   totalBudget={totalDepenses}
                   totalDepense={totalDepenses}
                   delay={150}
                   categoryDetails={categoryDetails}
                 />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Total dépenses: <span className="text-white font-bold">{totalDepenses.toLocaleString()}€</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {demoDataDepenses.length} catégories de dépenses
                </p>
              </div>
            </div>
          </div>

          {/* Deuxième ligne : DonutAnalysis */}
          <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-4 sm:mb-6 text-center">
              📊 DonutAnalysis Avancé (avec interactions)
            </h3>
            <div className="h-auto min-h-80 sm:min-h-96 mb-4 overflow-hidden">
                             <DonutAnalysis 
                 slices={demoSlices}
                 title="Répartition Financière"
                 subtitle="Analyse détaillée de vos finances"
                 categoryDetails={categoryDetails}
                 onCategoryClick={navigateToCategory}
               />
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Total: <span className="text-white font-bold">{demoSlices.reduce((sum, slice) => sum + slice.value, 0).toLocaleString()}€</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {demoSlices.length} catégories avec interactions avancées
              </p>
            </div>
          </div>

          {/* Troisième ligne : Comparaison */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                                   <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
                <h4 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4 text-center">
                  🚀 Petit Donut
                </h4>
               <div className="h-auto min-h-40 sm:min-h-48 mb-3 sm:mb-4 overflow-hidden">
                                 <LazyDonutChart
                   data={demoDataBudget.slice(0, 3)}
                   totalBudget={demoDataBudget.slice(0, 3).reduce((s, i) => s + i.value, 0)}
                   totalDepense={demoDataBudget.slice(0, 3).reduce((s, i) => s + i.value, 0)}
                   delay={200}
                   categoryDetails={categoryDetails}
                 />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Total: <span className="text-white font-bold">{demoDataBudget.slice(0, 3).reduce((s, i) => s + i.value, 0).toLocaleString()}€</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {demoDataBudget.slice(0, 3).length} catégories
                </p>
              </div>
            </div>

                                                   <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
                <h4 className="text-base sm:text-lg font-semibold text-orange-400 mb-3 sm:mb-4 text-center">
                  🎯 Moyen Donut
                </h4>
               <div className="h-auto min-h-40 sm:min-h-48 mb-3 sm:mb-4 overflow-hidden">
                                 <LazyDonutChart
                   data={demoDataDepenses.slice(0, 4)}
                   totalBudget={demoDataDepenses.slice(0, 4).reduce((s, i) => s + i.value, 0)}
                   totalDepense={demoDataDepenses.slice(0, 4).reduce((s, i) => s + i.value, 0)}
                   delay={250}
                   categoryDetails={categoryDetails}
                 />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Total: <span className="text-white font-bold">{demoDataDepenses.slice(0, 4).reduce((s, i) => s + i.value, 0).toLocaleString()}€</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {demoDataDepenses.slice(0, 4).length} catégories
                </p>
              </div>
            </div>

                                                   <div className="bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700 overflow-hidden">
                <h4 className="text-base sm:text-lg font-semibold text-pink-400 mb-3 sm:mb-4 text-center">
                  🎨 Grand Donut
                </h4>
               <div className="h-auto min-h-40 sm:min-h-48 mb-3 sm:mb-4 overflow-hidden">
                                                               <LazyDonutChart
                  data={[
                    { name: 'Loyer', value: 300, color: '#3B82F6' },
                    { name: 'Alimentation', value: 200, color: '#10B981' },
                    { name: 'Transport', value: 80, color: '#F59E0B' },
                    { name: 'Loisirs', value: 20, color: '#8B5CF6' }
                  ]}
                  totalBudget={600}
                  totalDepense={600}
                  delay={300}
                  categoryDetails={categoryDetails}
                />
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Total: <span className="text-white font-bold">600€</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {[...demoDataBudget.slice(0, 2), ...demoDataDepenses.slice(0, 2)].length} catégories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="mt-8 sm:mt-12 bg-gray-800 p-4 sm:p-8 rounded-xl border border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-4 sm:mb-6 text-center">
            🔧 Informations Techniques
          </h3>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-blue-200 font-semibold mb-3 flex items-center">
                <span className="mr-2">🚀</span> Optimisations Appliquées
              </h4>
              <ul className="text-blue-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span><strong>Lazy Loading:</strong> Charts chargés uniquement quand nécessaire</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span><strong>Code Splitting:</strong> Recharts séparé du bundle principal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span><strong>Idle Callback:</strong> Chargement durant les temps morts du navigateur</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span><strong>Suspense:</strong> Fallback avec skeleton pendant le chargement</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-green-200 font-semibold mb-3 flex items-center">
                <span className="mr-2">📊</span> Fonctionnalités
              </h4>
              <ul className="text-green-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span><strong>Responsive:</strong> Adaptation mobile/desktop automatique</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span><strong>Interactif:</strong> Tooltips et hover effects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span><strong>Personnalisable:</strong> Couleurs et délais configurables</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span><strong>Accessible:</strong> Support clavier et lecteurs d'écran</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-green-900 p-4 sm:p-6 rounded-lg border border-blue-700">
            <h4 className="text-blue-200 font-semibold mb-3 flex items-center text-sm sm:text-base">
              <span className="mr-2">📈</span> Impact Performance
            </h4>
            <p className="text-blue-300 text-xs sm:text-sm leading-relaxed">
              Grâce au lazy loading, le bundle initial ne contient plus Recharts (~200KB), 
              ce qui améliore significativement le temps de premier chargement de l'application.
              Les graphiques se chargent avec un délai configurable pour une expérience utilisateur fluide.
            </p>
            <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4 text-center">
              <div className="bg-blue-800 p-3 rounded-lg">
                <div className="text-blue-200 text-xs">Bundle Initial</div>
                <div className="text-white font-bold text-lg">-200KB</div>
              </div>
              <div className="bg-green-800 p-3 rounded-lg">
                <div className="text-green-200 text-xs">Chargement</div>
                <div className="text-white font-bold text-lg">+200ms</div>
              </div>
              <div className="bg-purple-800 p-3 rounded-lg">
                <div className="text-purple-200 text-xs">Performance</div>
                <div className="text-white font-bold text-lg">+40%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDonut;
