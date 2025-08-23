import React from 'react';
import { LazyDonutChart } from '@components/LazyDonutChart';
import { DonutAnalysis } from '@/charts/DonutAnalysis';
import type { DonutSlice } from '@/charts/DonutAnalysis';

/**
 * Page Démo Donut - Page de démonstration des graphiques DonutChart
 */
export const DemoDonut: React.FC = () => {
  // Données d'exemple pour les démonstrations
  const demoDataBudget = [
    { name: 'Loyer', value: 800, color: '#3B82F6' },
    { name: 'Alimentation', value: 400, color: '#10B981' },
    { name: 'Transport', value: 200, color: '#F59E0B' },
    { name: 'Loisirs', value: 300, color: '#8B5CF6' },
    { name: 'Assurance', value: 150, color: '#EC4899' },
    { name: 'Internet', value: 50, color: '#EF4444' }
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
    { id: '2', label: 'Charges fixes', value: 900, color: '#EF4444' },
    { id: '3', label: 'Variable', value: 400, color: '#F59E0B' },
    { id: '4', label: 'Loisirs', value: 200, color: '#8B5CF6' }
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
        <div className="bg-gradient-to-r from-green-900 to-blue-900 p-4 rounded-lg border border-green-700 mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-green-200 font-semibold">Optimisation Performance</h3>
              <p className="text-green-300 text-sm">
                Ces graphiques utilisent le lazy loading avec requestIdleCallback. 
                Recharts n'est chargé qu'après 200ms d'inactivité du thread principal.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de démonstrations */}
        <div className="space-y-8">
          {/* Première ligne : DonutChart classique */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
                💰 Répartition Budget Mensuel
              </h3>
              <div className="h-80">
                <LazyDonutChart
                  data={demoDataBudget}
                  totalBudget={totalBudget}
                  totalDepense={totalBudget}
                  delay={100}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                  Total budget: <span className="text-white font-bold">{totalBudget.toLocaleString()}€</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-green-400 mb-4 text-center">
                🛒 Dépenses Variables
              </h3>
              <div className="h-80">
                <LazyDonutChart
                  data={demoDataDepenses}
                  totalBudget={totalDepenses}
                  totalDepense={totalDepenses}
                  delay={150}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">
                  Total dépenses: <span className="text-white font-bold">{totalDepenses.toLocaleString()}€</span>
                </p>
              </div>
            </div>
          </div>

          {/* Deuxième ligne : DonutAnalysis */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-400 mb-4 text-center">
              📊 DonutAnalysis Avancé (avec interactions)
            </h3>
            <div className="h-96">
              <DonutAnalysis 
                slices={demoSlices}
                title="Répartition Financière"
                subtitle="Analyse détaillée de vos finances"
              />
            </div>
          </div>

          {/* Troisième ligne : Comparaison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3 text-center">
                🚀 Petit Donut
              </h4>
              <div className="h-48">
                <LazyDonutChart
                  data={demoDataBudget.slice(0, 3)}
                  totalBudget={demoDataBudget.slice(0, 3).reduce((s, i) => s + i.value, 0)}
                  totalDepense={demoDataBudget.slice(0, 3).reduce((s, i) => s + i.value, 0)}
                  delay={200}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-orange-400 mb-3 text-center">
                🎯 Moyen Donut
              </h4>
              <div className="h-48">
                <LazyDonutChart
                  data={demoDataDepenses.slice(0, 4)}
                  totalBudget={demoDataDepenses.slice(0, 4).reduce((s, i) => s + i.value, 0)}
                  totalDepense={demoDataDepenses.slice(0, 4).reduce((s, i) => s + i.value, 0)}
                  delay={250}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-pink-400 mb-3 text-center">
                🎨 Grand Donut
              </h4>
              <div className="h-48">
                <LazyDonutChart
                  data={[...demoDataBudget.slice(0, 2), ...demoDataDepenses.slice(0, 2)]}
                  totalBudget={600}
                  totalDepense={600}
                  delay={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
            🔧 Informations Techniques
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-blue-200 font-semibold mb-2">🚀 Optimisations Appliquées</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• <strong>Lazy Loading:</strong> Charts chargés uniquement quand nécessaire</li>
                <li>• <strong>Code Splitting:</strong> Recharts séparé du bundle principal</li>
                <li>• <strong>Idle Callback:</strong> Chargement durant les temps morts du navigateur</li>
                <li>• <strong>Suspense:</strong> Fallback avec skeleton pendant le chargement</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-blue-200 font-semibold mb-2">📊 Fonctionnalités</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• <strong>Responsive:</strong> Adaptation mobile/desktop automatique</li>
                <li>• <strong>Interactif:</strong> Tooltips et hover effects</li>
                <li>• <strong>Personnalisable:</strong> Couleurs et délais configurables</li>
                <li>• <strong>Accessible:</strong> Support clavier et lecteurs d'écran</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-gray-200 font-semibold mb-2">📈 Impact Performance</h4>
            <p className="text-gray-300 text-sm">
              Grâce au lazy loading, le bundle initial ne contient plus Recharts (~200KB), 
              ce qui améliore significativement le temps de premier chargement de l'application.
              Les graphiques se chargent avec un délai configurable pour une expérience utilisateur fluide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDonut;
