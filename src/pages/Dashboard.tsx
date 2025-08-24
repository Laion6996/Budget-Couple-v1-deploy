import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useChargesFixes } from '@hooks/useChargesFixes';
import { useObjectifs } from '@hooks/useObjectifs';
import { useBudgetsPerso } from '@hooks/useBudgetsPerso';
import { useCategoryDetails } from '@hooks/useCategoryDetails';
import { useCategoryNavigation } from '@hooks/useCategoryNavigation';
import { LazyDonutChart } from '@components/LazyDonutChart';
import { SmartBudgetAlert } from '@components/SmartBudgetAlert';
import { HistoryExport } from '@components/HistoryExport';
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
 * Corrigé pour éviter le scroll résiduel et optimiser l'affichage
 */
export const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const { salaireHoel, salaireZelie } = useAppStore();
  
  // Récupérer les données nécessaires pour le dashboard
  const { chargesFixes } = useChargesFixes();
  const { objectifs } = useObjectifs();
  const hoelBudgets = useBudgetsPerso('hoel');
  const zelieBudgets = useBudgetsPerso('zelie');
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
    <div className="min-h-[calc(100svh-4rem)] overflow-y-auto">
      <div className="p-3 sm:p-4">
        <div className="max-w-7xl mx-auto">
          {/* En-tête du Dashboard - Compact */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              🏠 Dashboard Budget Couple
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-1">
              Vue d'ensemble de vos finances en couple
            </p>
            <div className="text-xs text-gray-400">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Section 1: Cartes "À verser au commun" - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Carte Hoël */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-3 rounded-lg border border-blue-700 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-blue-100">👨‍💼 Hoël</h3>
                <div className="text-xl font-bold text-blue-200">{pourcentageHoel}%</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Salaire:</span>
                  <span className="text-white font-bold">{salaireHoel.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">À verser:</span>
                  <span className="text-lg font-bold text-blue-100">{versementHoelCharges.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Reste perso:</span>
                  <span className="font-semibold text-green-300">{resteHoelApresCharges.toLocaleString()}€</span>
                </div>
              </div>
            </div>

            {/* Carte Zélie */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 p-3 rounded-lg border border-green-700 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-green-100">👩‍💼 Zélie</h3>
                <div className="text-xl font-bold text-green-200">{pourcentageZelie}%</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-200">Salaire:</span>
                  <span className="text-white font-bold">{salaireZelie.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200 text-sm">À verser:</span>
                  <span className="text-lg font-bold text-green-100">{versementZelieCharges.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-200">Reste perso:</span>
                  <span className="font-semibold text-green-300">{resteZelieApresCharges.toLocaleString()}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cartes "Objectifs" - Compact */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
              🎯 Objectifs d'Épargne
            </h3>
            
            {objectifs && objectifs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <div className="bg-blue-900 p-2 rounded border border-blue-700 text-center">
                    <div className="text-lg font-bold text-blue-200">{totalObjectifs}</div>
                    <div className="text-blue-300 text-xs">Total</div>
                  </div>
                  
                  <div className="bg-green-900 p-2 rounded border border-green-700 text-center">
                    <div className="text-lg font-bold text-green-200">{objectifsAtteints}</div>
                    <div className="text-green-300 text-xs">Atteints</div>
                  </div>
                  
                  <div className="bg-purple-900 p-2 rounded border border-purple-700 text-center">
                    <div className="text-lg font-bold text-purple-200">{totalMontantCible.toLocaleString()}€</div>
                    <div className="text-purple-300 text-xs">Cible</div>
                  </div>
                  
                  <div className="bg-orange-900 p-2 rounded border border-orange-700 text-center">
                    <div className="text-lg font-bold text-orange-200">{totalEpargne.toLocaleString()}€</div>
                    <div className="text-orange-300 text-xs">Épargné</div>
                  </div>
                </div>

                {/* Barre de progression globale - Compact */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium text-sm">Progression globale</span>
                    <span className="text-yellow-400 font-bold text-lg">{pourcentageGlobal.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(pourcentageGlobal, 100)}%` }}
                    />
                  </div>
                  <div className="text-center mt-1.5">
                    <span className="text-gray-400 text-xs">
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
              <div className="text-center py-6">
                <div className="text-3xl mb-3">🎯</div>
                <p className="text-gray-400 text-sm">Aucun objectif configuré</p>
                <button
                  onClick={() => navigateTo('objectifs')}
                  className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors text-sm"
                >
                  Créer un objectif
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Alertes de Budget - Compact */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
            <h3 className="text-xl font-semibold text-red-400 mb-4 text-center">
              🚨 Alertes de Budget
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Alertes Hoël */}
              <div className="bg-blue-900 p-3 rounded border border-blue-700">
                <h4 className="text-base font-semibold text-blue-100 mb-2">👨‍💼 Hoël</h4>
                                 {hoelBudgets.budgets && hoelBudgets.budgets.length > 0 ? (
                   <div className="space-y-1.5">
                     {hoelBudgets.budgets.map((budget) => (
                       <SmartBudgetAlert 
                         key={budget.id}
                         budget={{
                           id: budget.id,
                           nom: budget.nom,
                           montant: budget.montant,
                           depense: budget.depense || 0,
                           categorie: 'hoel',
                           mois: new Date().toISOString().slice(0, 7),
                           dateLimite: budget.dateLimite
                         }}
                         showToast={true}
                       />
                     ))}
                   </div>
                 ) : (
                   <p className="text-blue-300 text-sm">Aucun budget configuré</p>
                 )}
              </div>

              {/* Alertes Zélie */}
              <div className="bg-green-900 p-3 rounded border border-green-700">
                <h4 className="text-base font-semibold text-green-100 mb-2">👩‍💼 Zélie</h4>
                                 {zelieBudgets.budgets && zelieBudgets.budgets.length > 0 ? (
                   <div className="space-y-1.5">
                     {zelieBudgets.budgets.map((budget) => (
                       <SmartBudgetAlert 
                         key={budget.id}
                         budget={{
                           id: budget.id,
                           nom: budget.nom,
                           montant: budget.montant,
                           depense: budget.depense || 0,
                           categorie: 'zelie',
                           mois: new Date().toISOString().slice(0, 7),
                           dateLimite: budget.dateLimite
                         }}
                         showToast={true}
                       />
                     ))}
                   </div>
                 ) : (
                   <p className="text-green-300 text-sm">Aucun budget configuré</p>
                 )}
              </div>
            </div>
          </div>

          {/* Section 4: Export et Historique - Compact */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
            <HistoryExport 
              snapshots={[
                // Données du mois actuel
                {
                  mois: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                  revenus: totalRevenus,
                  charges: totalCharges,
                  versementHoel: versementHoelCharges,
                  versementZelie: versementZelieCharges,
                  resteHoel: resteHoelApresCharges,
                  resteZelie: resteZelieApresCharges
                },
                // Données d'exemple pour démontrer l'export
                {
                  mois: 'juillet 2025',
                  revenus: 4200,
                  charges: 750,
                  versementHoel: 487.50,
                  versementZelie: 262.50,
                  resteHoel: 2312.50,
                  resteZelie: 1187.50
                },
                {
                  mois: 'juin 2025',
                  revenus: 4100,
                  charges: 720,
                  versementHoel: 468.00,
                  versementZelie: 252.00,
                  resteHoel: 2232.00,
                  resteZelie: 1148.00
                }
              ]}
            />
          </div>

          {/* Section 5: Graphiques - Compact */}
          <div className="space-y-4 mb-4">
            {/* Donut Dépenses communes par catégorie - Responsive */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 text-center">
                🍩 Dépenses Communes par Catégorie
              </h3>
              
              {chargesFixes.length > 0 ? (
                <div className="h-auto min-h-64 overflow-visible">
                  <LazyDonutChart
                    data={dataDonutCharges}
                    totalBudget={totalCharges}
                    totalDepense={totalCharges}
                    categoryDetails={categoryDetails}
                    onCategoryClick={navigateToCategory}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">🏠</div>
                  <p className="text-gray-400 text-sm">Aucune charge configurée</p>
                </div>
              )}
            </div>

            {/* Barres Comparatif versements - Responsive */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3 text-center">
                📊 Comparatif Versements (Hoël vs Zélie)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataBarresVersements.map((personne, index) => (
                  <div key={index} className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-base font-semibold text-white mb-1">{personne.name}</h4>
                      <div className="text-xl font-bold" style={{ color: personne.couleur }}>
                        {personne.versement.toLocaleString()}€
                      </div>
                      <p className="text-gray-400 text-xs">Versement commun</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium text-sm">Versement</span>
                        <span className="text-white font-bold text-sm">{personne.versement.toLocaleString()}€</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${(personne.versement / totalCharges) * 100}%`,
                            backgroundColor: personne.couleur
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 text-xs">
                          {((personne.versement / totalCharges) * 100).toFixed(1)}% des charges
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-2 rounded text-center">
                      <p className="text-gray-300 text-xs">Reste disponible</p>
                      <p className="text-lg font-bold text-green-400">{personne.reste.toLocaleString()}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Liens rapides */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 text-center">
              ⚡ Accès Rapide
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {/* Section 7: Statistiques rapides - Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-900 p-2 rounded border border-blue-700 text-center">
              <div className="text-lg font-bold text-blue-200">{totalRevenus.toLocaleString()}€</div>
              <div className="text-blue-300 text-xs">Revenus</div>
            </div>
            
            <div className="bg-red-900 p-2 rounded border border-red-700 text-center">
              <div className="text-lg font-bold text-red-200">{totalCharges.toLocaleString()}€</div>
              <div className="text-red-300 text-xs">Charges</div>
            </div>
            
            <div className="bg-green-900 p-2 rounded border border-green-700 text-center">
              <div className="text-lg font-bold text-green-200">{(totalRevenus - totalCharges).toLocaleString()}€</div>
              <div className="text-green-300 text-xs">Reste</div>
            </div>
            
            <div className="bg-purple-900 p-2 rounded border border-purple-700 text-center">
              <div className="text-lg font-bold text-purple-200">{chargesFixes.length}</div>
              <div className="text-purple-300 text-xs">Actives</div>
            </div>
          </div>

          {/* Pied de page pour indiquer la fin du contenu - Compact */}
          <div className="text-center py-4 border-t border-gray-700">
            <p className="text-gray-500 text-xs">
              🏁 Fin du récapitulatif - Dashboard Budget Couple
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
