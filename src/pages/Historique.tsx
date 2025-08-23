import React from 'react';
import { useAppStore } from '@/stores/useAppStore';

/**
 * Page Historique - Vue de l'historique des transactions et snapshots
 */
export const Historique: React.FC = () => {
  const { historique } = useAppStore();

  // Grouper les snapshots par mois
  const snapshots = historique.filter(t => t.type === 'snapshot' && t.snapshot);
  const snapshotsParMois = snapshots.reduce((acc, t) => {
    if (t.snapshot) {
      const mois = t.snapshot.mois;
      if (!acc[mois]) {
        acc[mois] = t.snapshot;
      }
    }
    return acc;
  }, {} as Record<string, any>);

  const moisOrdonnes = Object.keys(snapshotsParMois).sort().reverse();

  return (
    <div className="p-4 sm:p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          📊 Historique Financier
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 text-center">
          Évolution de vos finances au fil des mois
        </p>

        {moisOrdonnes.length > 0 ? (
          <div className="space-y-6">
            {moisOrdonnes.map((mois) => {
              const snapshot = snapshotsParMois[mois];
              const pourcentageCharges = snapshot.revenus > 0 
                ? (snapshot.charges / snapshot.revenus) * 100 
                : 0;
              const economiesPotentielles = snapshot.resteHoel + snapshot.resteZelie;

              return (
                <div key={mois} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      📅 {new Date(mois + '-01').toLocaleDateString('fr-FR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h3>
                    <div className="text-sm text-gray-400 mt-2 lg:mt-0">
                      Snapshot créé le {new Date(historique.find(t => t.snapshot?.mois === mois)?.date || '').toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Métriques principales */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-900 p-4 rounded-lg border border-green-700 text-center">
                      <div className="text-xl font-bold text-green-200">{snapshot.revenus.toLocaleString()}€</div>
                      <div className="text-green-300 text-sm">Revenus Total</div>
                    </div>
                    
                    <div className="bg-red-900 p-4 rounded-lg border border-red-700 text-center">
                      <div className="text-xl font-bold text-red-200">{snapshot.charges.toLocaleString()}€</div>
                      <div className="text-red-300 text-sm">Charges Total</div>
                    </div>
                    
                    <div className="bg-blue-900 p-4 rounded-lg border border-blue-700 text-center">
                      <div className="text-xl font-bold text-blue-200">{economiesPotentielles.toLocaleString()}€</div>
                      <div className="text-blue-300 text-sm">Reste Total</div>
                    </div>
                    
                    <div className="bg-purple-900 p-4 rounded-lg border border-purple-700 text-center">
                      <div className="text-xl font-bold text-purple-200">{pourcentageCharges.toFixed(1)}%</div>
                      <div className="text-purple-300 text-sm">% Charges/Revenus</div>
                    </div>
                  </div>

                  {/* Détails par personne */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hoël */}
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700">
                      <h4 className="text-lg font-semibold text-blue-100 mb-3 text-center">👨‍💼 Hoël</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200 text-sm">Versement:</span>
                          <span className="text-white font-bold">{snapshot.versementHoel.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200 text-sm">Reste personnel:</span>
                          <span className="text-green-300 font-bold">{snapshot.resteHoel.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200 text-sm">% du total charges:</span>
                          <span className="text-blue-100 text-sm">
                            {snapshot.charges > 0 ? ((snapshot.versementHoel / snapshot.charges) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Zélie */}
                    <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-lg border border-green-700">
                      <h4 className="text-lg font-semibold text-green-100 mb-3 text-center">👩‍💼 Zélie</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-200 text-sm">Versement:</span>
                          <span className="text-white font-bold">{snapshot.versementZelie.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-200 text-sm">Reste personnel:</span>
                          <span className="text-green-300 font-bold">{snapshot.resteZelie.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-200 text-sm">% du total charges:</span>
                          <span className="text-green-100 text-sm">
                            {snapshot.charges > 0 ? ((snapshot.versementZelie / snapshot.charges) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barre de répartition */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium text-sm">Répartition des charges</span>
                      <span className="text-gray-400 text-sm">{snapshot.charges.toLocaleString()}€ total</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden flex">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ 
                          width: snapshot.charges > 0 ? `${(snapshot.versementHoel / snapshot.charges) * 100}%` : '50%'
                        }}
                      />
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: snapshot.charges > 0 ? `${(snapshot.versementZelie / snapshot.charges) * 100}%` : '50%'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Hoël: {snapshot.versementHoel.toLocaleString()}€</span>
                      <span>Zélie: {snapshot.versementZelie.toLocaleString()}€</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Aucun historique disponible</h3>
            <p className="text-gray-400 mb-6">
              L'historique se construit automatiquement quand vous créez des snapshots depuis la page Paramètres.
            </p>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700 max-w-md mx-auto">
              <h4 className="text-blue-200 font-semibold mb-2">💡 Comment créer un snapshot ?</h4>
              <p className="text-blue-300 text-sm">
                Rendez-vous dans la page <strong>Paramètres</strong> et cliquez sur le bouton 
                <strong> "📸 Créer Snapshot du Mois"</strong> pour enregistrer la configuration actuelle.
              </p>
            </div>
          </div>
        )}

        {/* Statistiques globales */}
        {moisOrdonnes.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-xl border border-purple-700">
            <h3 className="text-xl font-semibold text-purple-100 mb-4 text-center">
              📈 Statistiques Globales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-200">{moisOrdonnes.length}</div>
                <div className="text-purple-300 text-sm">Mois enregistrés</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-200">
                  {(Object.values(snapshotsParMois).reduce((sum: number, s: any) => sum + s.revenus, 0) / moisOrdonnes.length).toFixed(0)}€
                </div>
                <div className="text-purple-300 text-sm">Revenus moyens/mois</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-200">
                  {(Object.values(snapshotsParMois).reduce((sum: number, s: any) => sum + s.charges, 0) / moisOrdonnes.length).toFixed(0)}€
                </div>
                <div className="text-purple-300 text-sm">Charges moyennes/mois</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;