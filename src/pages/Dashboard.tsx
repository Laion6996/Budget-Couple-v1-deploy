import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useChargesFixes } from '@hooks/useChargesFixes';
import { useObjectifs } from '@hooks/useObjectifs';
import { useCategoryDetails } from '@hooks/useCategoryDetails';
import { useCategoryNavigation } from '@hooks/useCategoryNavigation';
import { LazyDonutChart } from '@components/LazyDonutChart';
import {
  sumRevenus,
  sumCharges,
  pctHoel,
  pctZelie,
  versementHoel,
  versementZelie,
  resteHoel,
  resteZelie
} from '@utils/calc';

interface DashboardProps {
  navigateTo: (page: 'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut') => void;
}

/**
 * Page Dashboard - Vue d'ensemble des finances du couple
 */
export const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const { salaireHoel, salaireZelie } = useAppStore();
  
  // Récupérer les données nécessaires pour le dashboard
  const { chargesFixes } = useChargesFixes();
  const { objectifs } = useObjectifs();
  const { categoryDetails } = useCategoryDetails();
  const { navigateToCategory } = useCategoryNavigation(navigateTo);
  
  // Calculs dérivés avec calc.ts
  const totalRevenus = sumRevenus(salaireHoel, salaireZelie);
  const totalCharges = sumCharges(chargesFixes.map(c => ({ ...c, nom: c.label, montant: c.montant } as any)));
  const pourcentageHoel = pctHoel(salaireHoel, salaireZelie);
  const pourcentageZelie = pctZelie(salaireHoel, salaireZelie);
  const versementHoelCharges = versementHoel(totalCharges, pourcentageHoel);
  const versementZelieCharges = versementZelie(totalCharges, pourcentageZelie);
  const resteHoelApresCharges = resteHoel(salaireHoel, versementHoelCharges);
  const resteZelieApresCharges = resteZelie(salaireZelie, versementZelieCharges);

  // Données pour le donut des dépenses communes
  console.log('🔧 [Dashboard] Charges fixes reçues:', chargesFixes);
  console.log('🔧 [Dashboard] Nombre de charges:', chargesFixes.length);
  
  const dataDonutCharges = chargesFixes.map((charge, index) => ({
    name: charge.label,
    value: charge.montant,
    color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#A855F7', '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4', '#84CC16', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#F97316', '#A855F7', '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4'][index % 25]
  }));
  
  console.log('🔧 [Dashboard] Données duut préparées:', dataDonutCharges);
  console.log('🔧 [Dashboard] Nombre de catégories dans le donut:', dataDonutCharges.length);

  // Données pour les barres comparatives
  const dataBarresVersements = [
    { name: 'Hoël', versement: versementHoelCharges, reste: resteHoelApresCharges, couleur: '#3B82F6' },
    { name: 'Zélie', versement: versementZelieCharges, reste: resteZelieApresCharges, couleur: '#10B981' }
  ];

  // Statistiques des objectifs
  const totalObjectifs = objectifs?.length || 0;
  const objectifsAtteints = objectifs?.filter(o => o.dejaEpargne >= o.montantCible).length || 0;
  const totalMontantCible = objectifs?.reduce((sum, o) => sum + o.montantCible, 0) || 0;
  const totalEpargne = objectifs?.reduce((sum, o) => sum + o.dejaEpargne, 0) || 0;
  const pourcentageGlobal = totalMontantCible > 0 ? (totalEpargne / totalMontantCible) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* En-tête du Dashboard */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            🏠 Dashboard Budget Couple
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Vue d'ensemble de vos finances en couple
          </p>
          <div className="text-xs sm:text-sm text-gray-400 mt-2">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Section 1: Cartes "À verser au commun" */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Carte Hoël */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-3 sm:p-6 rounded-xl border border-blue-700 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-xl font-semibold text-blue-100">👨‍💼 Hoël</h3>
              <div className="text-xl sm:text-3xl font-bold text-blue-200">{pourcentageHoel}%</div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs sm:text-base">Salaire:</span>
                <span className="text-white font-bold text-xs sm:text-base">{salaireHoel.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs sm:text-base">À verser:</span>
                <span className="text-lg sm:text-2xl font-bold text-blue-100">{versementHoelCharges.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs sm:text-base">Reste perso:</span>
                <span className="text-sm sm:text-lg font-semibold text-green-300">{resteHoelApresCharges.toLocaleString()}€</span>
              </div>
            </div>
          </div>

          {/* Carte Zélie */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 p-3 sm:p-6 rounded-xl border border-green-700 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-xl font-semibold text-green-100">👩‍💼 Zélie</h3>
              <div className="text-xl sm:text-3xl font-bold text-green-200">{pourcentageZelie}%</div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-xs sm:text-base">Salaire:</span>
                <span className="text-white font-bold text-xs sm:text-base">{salaireZelie.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-xs sm:text-base">À verser:</span>
                <span className="text-lg sm:text-2xl font-bold text-green-100">{versementZelieCharges.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200 text-xs sm:text-base">Reste perso:</span>
                <span className="text-sm sm:text-lg font-semibold text-green-300">{resteZelieApresCharges.toLocaleString()}€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Cartes "Objectifs" */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h3 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">
            🎯 Objectifs d'Épargne
          </h3>
          
          {objectifs && objectifs.length > 0 ? (
            <>
                             <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
                 <div className="bg-blue-900 p-2 sm:p-4 rounded-lg border border-blue-700 text-center">
                   <div className="text-lg sm:text-2xl font-bold text-blue-200">{totalObjectifs}</div>
                   <div className="text-blue-300 text-xs sm:text-sm">Total Objectifs</div>
                 </div>
                 
                 <div className="bg-green-900 p-2 sm:p-4 rounded-lg border border-green-700 text-center">
                   <div className="text-lg sm:text-2xl font-bold text-green-200">{objectifsAtteints}</div>
                   <div className="text-green-300 text-xs sm:text-sm">Objectifs Atteints</div>
                 </div>
                 
                 <div className="bg-purple-900 p-2 sm:p-4 rounded-lg border border-purple-700 text-center">
                   <div className="text-lg sm:text-2xl font-bold text-purple-200">{totalMontantCible.toLocaleString()}€</div>
                   <div className="text-purple-300 text-xs sm:text-sm">Montant Total Cible</div>
                 </div>
                 
                 <div className="bg-orange-900 p-2 sm:p-4 rounded-lg border border-orange-700 text-center">
                   <div className="text-lg sm:text-2xl font-bold text-orange-200">{totalEpargne.toLocaleString()}€</div>
                   <div className="text-orange-300 text-xs sm:text-sm">Total Épargné</div>
                 </div>
               </div>

              {/* Barre de progression globale */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-1 sm:space-y-0">
                  <span className="text-gray-300 font-medium text-sm sm:text-base">Progression globale</span>
                  <span className="text-yellow-400 font-bold text-lg sm:text-xl">{pourcentageGlobal.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(pourcentageGlobal, 100)}%` }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {totalEpargne.toLocaleString()}€ sur {totalMontantCible.toLocaleString()}€
                    {(totalMontantCible - totalEpargne) > 0 && (
                      <span className="text-orange-400 ml-2">
                        (Reste: {(totalMontantCible - totalEpargne).toLocaleString()}€)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-400">Aucun objectif configuré</p>
              <button
                onClick={() => navigateTo('objectifs')}
                className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                Créer un objectif
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Graphiques */}
        <div className="space-y-8 mb-8">
          {/* Donut Dépenses communes par catégorie - Responsive */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-4 text-center">
              🍩 Dépenses Communes par Catégorie
            </h3>
            

            {chargesFixes.length > 0 ? (
              <div className="h-auto min-h-80 sm:min-h-96 overflow-visible">
                <LazyDonutChart
                  data={dataDonutCharges}
                  totalBudget={totalCharges}
                  totalDepense={totalCharges}
                  categoryDetails={categoryDetails}
                  onCategoryClick={navigateToCategory}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🏠</div>
                <p className="text-gray-400">Aucune charge configurée</p>
              </div>
            )}
          </div>

          {/* Barres Comparatif versements - Responsive */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 mb-4 text-center">
              📊 Comparatif Versements (Hoël vs Zélie)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {dataBarresVersements.map((personne, index) => (
                <div key={index} className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-white mb-2">{personne.name}</h4>
                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: personne.couleur }}>
                      {personne.versement.toLocaleString()}€
                    </div>
                    <p className="text-gray-400 text-sm">Versement commun</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">Versement</span>
                      <span className="text-white font-bold text-sm sm:text-base">{personne.versement.toLocaleString()}€</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${(personne.versement / totalCharges) * 100}%`,
                          backgroundColor: personne.couleur
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        {((personne.versement / totalCharges) * 100).toFixed(1)}% des charges
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg text-center">
                    <p className="text-gray-300 text-xs sm:text-sm">Reste disponible</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-400">{personne.reste.toLocaleString()}€</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Liens rapides */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-6 text-center">
            ⚡ Accès Rapide
          </h3>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-6">
            <button 
              onClick={() => navigateTo('parametres')}
              className="group bg-gradient-to-br from-green-900 to-green-800 p-3 sm:p-6 rounded-xl border border-green-700 hover:from-green-800 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">⚙️</div>
                <h4 className="text-base sm:text-xl font-semibold text-green-100 mb-2">Paramètres</h4>
                <p className="text-green-200 text-xs sm:text-sm">Salaires, charges, répartition</p>
              </div>
            </button>

            <button 
              onClick={() => navigateTo('perso')}
              className="group bg-gradient-to-br from-purple-900 to-purple-800 p-3 sm:p-6 rounded-xl border border-purple-700 hover:from-purple-800 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">👥</div>
                <h4 className="text-base sm:text-xl font-semibold text-purple-100 mb-2">Budgets Personnels</h4>
                <p className="text-purple-200 text-xs sm:text-sm">Gestion des dépenses individuelles</p>
              </div>
            </button>

            <button 
              onClick={() => navigateTo('objectifs')}
              className="group bg-gradient-to-br from-yellow-900 to-yellow-800 p-3 sm:p-6 rounded-xl border border-yellow-700 hover:from-yellow-800 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h4 className="text-base sm:text-xl font-semibold text-yellow-100 mb-2">Objectifs</h4>
                <p className="text-yellow-200 text-xs sm:text-sm">Suivi des objectifs d'épargne</p>
              </div>
            </button>
          </div>
        </div>

        {/* Section 5: Statistiques rapides */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-blue-900 p-2 sm:p-4 rounded-lg border border-blue-700 text-center">
            <div className="text-lg sm:text-3xl font-bold text-blue-200">{totalRevenus.toLocaleString()}€</div>
            <div className="text-blue-300 text-xs sm:text-sm">Total Revenus</div>
          </div>
          
          <div className="bg-red-900 p-2 sm:p-4 rounded-lg border border-red-700 text-center">
            <div className="text-lg sm:text-3xl font-bold text-red-200">{totalCharges.toLocaleString()}€</div>
            <div className="text-red-300 text-xs sm:text-sm">Total Charges</div>
          </div>
          
          <div className="bg-green-900 p-2 sm:p-4 rounded-lg border border-green-700 text-center">
            <div className="text-lg sm:text-3xl font-bold text-green-200">{(totalRevenus - totalCharges).toLocaleString()}€</div>
            <div className="text-green-300 text-xs sm:text-sm">Reste Total</div>
          </div>
          
          <div className="bg-purple-900 p-2 sm:p-4 rounded-lg border border-purple-700 text-center">
            <div className="text-lg sm:text-3xl font-bold text-purple-200">{chargesFixes.length}</div>
            <div className="text-purple-300 text-xs sm:text-sm">Charges Actives</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
