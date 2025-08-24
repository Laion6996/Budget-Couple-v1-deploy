import React from 'react';
import { useObjectifs } from '@hooks/useObjectifs';
import { ObjectifRow } from '@components/ObjectifRow';
import { AjouterObjectif } from '@components/AjouterObjectif';
import { SortableCollapsible } from '@components/SortableCollapsible';
import { useSortableCollapsible } from '@hooks/useSortableCollapsible';

/**
 * Page Objectifs - Gestion des objectifs d'épargne
 */
export const Objectifs: React.FC = () => {
  const { objectifs, ajouterNouvelObjectif, incrementerEpargne, supprimerObjectif, statistiques } = useObjectifs();
  
  // Hook pour le tri et repli des objectifs
  const {
    preferences: objectifsPreferences,
    handleSortChange: handleObjectifsSortChange
  } = useSortableCollapsible({
    storageKey: 'objectifs-preferences',
    defaultSortField: 'nom',
    defaultSortDirection: 'asc',
    defaultCollapsed: false
  });
  
  // État local pour l'interface
  const [showAjouterObjectif, setShowAjouterObjectif] = React.useState(false);
  
  const toggleAjouterObjectif = () => setShowAjouterObjectif(!showAjouterObjectif);
  
  const handleAjouterObjectif = (nom: string, montant: number, dateLimite?: string) => {
    ajouterNouvelObjectif(nom, montant, dateLimite);
    setShowAjouterObjectif(false);
  };

  // Utiliser les statistiques du hook
  const totalObjectifs = statistiques.totalObjectifs;
  const objectifsAtteints = statistiques.objectifsAtteints;
  const objectifsEnCours = totalObjectifs - objectifsAtteints;
  const totalMontantCible = statistiques.totalMontantCible;
  const totalEpargne = statistiques.totalEpargne;
  const pourcentageGlobal = statistiques.pourcentageGlobal;

  return (
    <div className="p-4 sm:p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          🎯 Objectifs d'Épargne
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 text-center">
          Suivez et gérez vos objectifs financiers
        </p>

        {/* Statistiques globales */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h3 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">
            📊 Vue d'Ensemble
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700 text-center">
              <div className="text-2xl font-bold text-blue-200">{totalObjectifs}</div>
              <div className="text-blue-300 text-sm">Total Objectifs</div>
            </div>
            
            <div className="bg-green-900 p-4 rounded-lg border border-green-700 text-center">
              <div className="text-2xl font-bold text-green-200">{objectifsAtteints}</div>
              <div className="text-green-300 text-sm">Objectifs Atteints</div>
            </div>
            
            <div className="bg-orange-900 p-4 rounded-lg border border-orange-700 text-center">
              <div className="text-2xl font-bold text-orange-200">{objectifsEnCours}</div>
              <div className="text-orange-300 text-sm">En Cours</div>
            </div>
            
            <div className="bg-purple-900 p-4 rounded-lg border border-purple-700 text-center">
              <div className="text-2xl font-bold text-purple-200">{pourcentageGlobal.toFixed(1)}%</div>
              <div className="text-purple-300 text-sm">Progression</div>
            </div>
          </div>

          {/* Barre de progression globale */}
          {totalMontantCible > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">Progression globale</span>
                <span className="text-yellow-400 font-bold text-lg">{pourcentageGlobal.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(pourcentageGlobal, 100)}%` }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-gray-400 text-sm">
                  {totalEpargne.toLocaleString()}€ sur {totalMontantCible.toLocaleString()}€
                  {(totalMontantCible - totalEpargne) > 0 && (
                    <span className="text-orange-400 ml-2">
                      (Reste: {(totalMontantCible - totalEpargne).toLocaleString()}€)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Liste des objectifs avec Tri et Repli */}
        <SortableCollapsible
          title="🎯 Mes Objectifs"
          items={objectifs}
          sortFields={[
            { key: 'nom', label: 'Nom', getValue: (objectif) => objectif.label },
            { key: 'montant', label: 'Montant Cible', getValue: (objectif) => objectif.montantCible },
            { key: 'restant', label: 'Reste à Épargner', getValue: (objectif) => objectif.montantCible - objectif.dejaEpargne },
            { key: 'progression', label: 'Progression', getValue: (objectif) => (objectif.dejaEpargne / objectif.montantCible) * 100 }
          ]}
          defaultSortField="nom"
          defaultSortDirection="asc"
          defaultCollapsed={objectifsPreferences.isCollapsed}
          onSortChange={handleObjectifsSortChange}
          className="mb-8"
        >
          {(sortedObjectifs) => (
            <>
              {/* Bouton d'ajout */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={toggleAjouterObjectif}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Ajouter un nouvel objectif d'épargne"
                >
                  <span>+</span>
                  <span>Nouvel objectif</span>
                </button>
              </div>

              {/* Formulaire d'ajout */}
              {showAjouterObjectif && (
                <div className="mb-6">
                  <AjouterObjectif
                    onAjouter={handleAjouterObjectif}
                  />
                </div>
              )}

              {/* Liste des objectifs triés */}
              <div className="space-y-4">
                {sortedObjectifs && sortedObjectifs.length > 0 ? (
                  sortedObjectifs.map((objectif) => (
                    <ObjectifRow
                      key={objectif.id}
                      objectif={objectif}
                      onDelete={supprimerObjectif}
                      onIncrementer={incrementerEpargne}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-xl font-semibold text-white mb-2">Aucun objectif configuré</h4>
                    <p className="text-slate-300 mb-6">
                      Commencez par créer votre premier objectif d'épargne !
                    </p>
                    <button
                      onClick={toggleAjouterObjectif}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      🎯 Créer mon premier objectif
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </SortableCollapsible>

        {/* Conseils */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl border border-blue-700">
          <h3 className="text-xl font-semibold text-blue-100 mb-4 text-center">
            💡 Conseils pour vos Objectifs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="text-blue-200 font-semibold">Soyez spécifique</h4>
                  <p className="text-blue-300 text-sm">Définissez des objectifs clairs avec des montants et dates précis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📅</div>
                <div>
                  <h4 className="text-blue-200 font-semibold">Dates réalistes</h4>
                  <p className="text-blue-300 text-sm">Fixez des échéances atteignables pour maintenir votre motivation</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">⚖️</div>
                <div>
                  <h4 className="text-blue-200 font-semibold">Priorisez</h4>
                  <p className="text-blue-300 text-sm">Classez vos objectifs par ordre d'importance (haute, moyenne, basse)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📈</div>
                <div>
                  <h4 className="text-blue-200 font-semibold">Suivez vos progrès</h4>
                  <p className="text-blue-300 text-sm">Mettez à jour régulièrement vos montants épargnés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objectifs;