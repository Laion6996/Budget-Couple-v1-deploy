import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useChargesFixes } from '@hooks/useChargesFixes';
import { SalaireInput } from '@components/SalaireInput';
import { ChargeFixeRow } from '@components/ChargeFixeRow';
import { useToast } from '@components/Toast';
import {
  sumRevenus,
  pctHoel,
  pctZelie,
  versementHoel,
  versementZelie,
  resteHoel,
  resteZelie,
  creerSnapshotMensuel
} from '@utils/calc';

/**
 * Page Paramètres - Configuration des salaires et charges fixes
 */
export const Parametres: React.FC = () => {
  const { salaireHoel, salaireZelie, setSalaires, ajouterTransaction, moisActuel } = useAppStore();
  const {
    chargesFixes,
    editingId,
    errors,
    totalCharges,
    ajouterChargeFixe,
    supprimerChargeFixe,
    commencerEdition,
    sauvegarderCharge,
  } = useChargesFixes();
  
  const { ToastContainer } = useToast();
  
  // Logs pour debug
  console.log('🔧 [Parametres] État actuel:', {
    chargesFixes,
    editingId,
    errors,
    totalCharges
  });

  // Calculs dérivés avec calc.ts
  const totalRevenus = sumRevenus(salaireHoel, salaireZelie);
  const pourcentageHoel = pctHoel(salaireHoel, salaireZelie);
  const pourcentageZelie = pctZelie(salaireHoel, salaireZelie);
  const versementHoelCharges = versementHoel(totalCharges, pourcentageHoel);
  const versementZelieCharges = versementZelie(totalCharges, pourcentageZelie);
  const resteHoelApresCharges = resteHoel(salaireHoel, versementHoelCharges);
  const resteZelieApresCharges = resteZelie(salaireZelie, versementZelieCharges);

  const handleSalaireHoelChange = (value: number) => {
    setSalaires(value, salaireZelie);
  };

  const handleSalaireZelieChange = (value: number) => {
    setSalaires(salaireHoel, value);
  };

  // Fonction pour ajouter au snapshot
  const ajouterAuSnapshot = () => {
    console.log('🔄 Début de ajouterAuSnapshot');
    console.log('📊 Données:', { moisActuel, salaireHoel, salaireZelie, chargesFixes });
    
    try {
      const snapshot = creerSnapshotMensuel(
        moisActuel,
        salaireHoel,
        salaireZelie,
        chargesFixes.map(c => ({ ...c, nom: c.label, montant: c.montant } as any))
      );
      
      console.log('📸 Snapshot créé:', snapshot);
      
      // Créer un snapshot simplifié compatible avec la page Historique
      const snapshotSimplifie = {
        mois: snapshot.mois,
        revenus: snapshot.revenus.total,
        charges: snapshot.charges.total,
        versementHoel: snapshot.repartition.versementHoel,
        versementZelie: snapshot.repartition.versementZelie,
        resteHoel: snapshot.restes.hoel,
        resteZelie: snapshot.restes.zelie
      };
      
      console.log('📋 Snapshot simplifié:', snapshotSimplifie);
      
      // Ajouter à l'historique
      ajouterTransaction({
        type: 'snapshot',
        montant: totalCharges,
        categorie: 'repartition',
        description: `Snapshot ${moisActuel} - ${totalCharges}€ de charges`,
        date: new Date().toISOString(),
        personne: 'commune',
        snapshot: snapshotSimplifie
      });

      console.log('✅ Transaction ajoutée à l\'historique');
      
      // Feedback utilisateur
      alert(`✅ Snapshot ${moisActuel} ajouté à l'historique !`);
      
    } catch (error) {
      console.error('❌ Erreur dans ajouterAuSnapshot:', error);
      alert(`❌ Erreur lors de la création du snapshot: ${error}`);
    }
  };

  return (
    <div className="p-4 sm:p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          ⚙️ Paramètres
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 text-center">
          Configuration des salaires et charges fixes
        </p>

        {/* Section Salaires */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-6">
            💰 Salaires Mensuels
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SalaireInput
              label="Salaire Hoel"
              value={salaireHoel}
              onChange={handleSalaireHoelChange}
            />
            <SalaireInput
              label="Salaire Zelie"
              value={salaireZelie}
              onChange={handleSalaireZelieChange}
            />
          </div>

          {/* Résumé des salaires */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div>
                <p className="text-gray-300 text-sm">Total Revenus</p>
                <p className="text-white text-xl font-bold">{totalRevenus.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">% Hoel</p>
                <p className="text-blue-400 text-xl font-bold">{pourcentageHoel}%</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">% Zelie</p>
                <p className="text-green-400 text-xl font-bold">{pourcentageZelie}%</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Charges</p>
                <p className="text-orange-400 text-xl font-bold">{totalCharges.toLocaleString()}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Charges Fixes */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-2xl font-semibold text-green-400">
              🏠 Charges Fixes Mensuelles
            </h3>
            <button
              onClick={ajouterChargeFixe}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>+</span>
              <span>Ajouter ligne</span>
            </button>
          </div>

          {/* Tableau des charges - Responsive */}
          <div className="overflow-hidden">
            {/* Version Desktop : Tableau classique */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                      Nom de la charge
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                      Montant mensuel
                    </th>
                    <th className="px-4 py-3 text-center text-gray-300 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chargesFixes.map((charge) => (
                    <ChargeFixeRow
                      key={charge.id}
                      charge={charge}
                      isEditing={editingId === charge.id}
                      error={errors[charge.id]}
                      onEdit={commencerEdition}
                      onSave={sauvegarderCharge}
                      onDelete={supprimerChargeFixe}
                    />
                  ))}
                  
                  {chargesFixes.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Aucune charge fixe configurée. Cliquez sur "Ajouter ligne" pour commencer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Version Mobile : Cartes empilées */}
            <div className="md:hidden">
              {chargesFixes.map((charge) => (
                <ChargeFixeRow
                  key={charge.id}
                  charge={charge}
                  isEditing={editingId === charge.id}
                  error={errors[charge.id]}
                  onEdit={commencerEdition}
                  onSave={sauvegarderCharge}
                  onDelete={supprimerChargeFixe}
                  isMobileView={true}
                />
              ))}
              
              {chargesFixes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Aucune charge fixe configurée. Cliquez sur "Ajouter ligne" pour commencer.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Résumé des Versements */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
            📊 Résumé des Versements
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte Hoël */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700">
              <h4 className="text-xl font-semibold text-blue-100 mb-4 text-center">👨‍💼 Hoël</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Salaire:</span>
                  <span className="text-white font-bold">{salaireHoel.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Versement ({pourcentageHoel}%):</span>
                  <span className="text-blue-100 font-bold text-xl">{versementHoelCharges.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Reste personnel:</span>
                  <span className="text-green-300 font-bold">{resteHoelApresCharges.toLocaleString()}€</span>
                </div>
              </div>
            </div>

            {/* Carte Zélie */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700">
              <h4 className="text-xl font-semibold text-green-100 mb-4 text-center">👩‍💼 Zélie</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Salaire:</span>
                  <span className="text-white font-bold">{salaireZelie.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Versement ({pourcentageZelie}%):</span>
                  <span className="text-green-100 font-bold text-xl">{versementZelieCharges.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Reste personnel:</span>
                  <span className="text-green-300 font-bold">{resteZelieApresCharges.toLocaleString()}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 bg-gray-700 p-4 rounded-lg text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-sm">Total Versé</p>
                <p className="text-white text-2xl font-bold">{totalCharges.toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Disponible</p>
                <p className="text-green-400 text-2xl font-bold">{(resteHoelApresCharges + resteZelieApresCharges).toLocaleString()}€</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">% Charges/Revenus</p>
                <p className="text-orange-400 text-2xl font-bold">{((totalCharges / totalRevenus) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Action */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-yellow-400 mb-6 text-center">
            📸 Actions
          </h3>
          
          <div className="text-center">
            <button
              onClick={ajouterAuSnapshot}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors text-lg"
            >
              📸 Créer Snapshot du Mois
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Enregistre la configuration actuelle dans l'historique
            </p>
          </div>
        </div>
      </div>
      
      {/* Container des toasts */}
      <ToastContainer />
    </div>
  );
};

export default Parametres;