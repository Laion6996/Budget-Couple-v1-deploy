import type { Charge } from '../types/budget';

/**
 * Utilitaires de calcul financier pour Budget Couple
 * Toutes les fonctions sont pures et gèrent les cas d'erreur
 */

/**
 * Calcule la somme totale des charges
 * @param charges - Tableau des charges
 * @returns Somme arrondie à 2 décimales
 */
export const sumCharges = (charges: Charge[]): number => {
  if (!charges || charges.length === 0) return 0;
  
  const total = charges.reduce((sum, charge) => {
    const montant = Number(charge.montant) || 0;
    return sum + montant;
  }, 0);
  
  return Math.round(total * 100) / 100;
};

/**
 * Calcule la somme totale des revenus (Hoel + Zelie)
 * @param h - Salaire de Hoel
 * @param z - Salaire de Zelie
 * @returns Somme arrondie à 2 décimales
 */
export const sumRevenus = (h: number, z: number): number => {
  const hoel = Number(h) || 0;
  const zelie = Number(z) || 0;
  const total = hoel + zelie;
  
  return Math.round(total * 100) / 100;
};

/**
 * Calcule le pourcentage de Hoel dans le total des revenus
 * @param h - Salaire de Hoel
 * @param z - Salaire de Zelie
 * @returns Pourcentage arrondi à 2 décimales
 */
export const pctHoel = (h: number, z: number): number => {
  const hoel = Number(h) || 0;
  const zelie = Number(z) || 0;
  const total = hoel + zelie;
  
  if (total === 0) return 0;
  
  const pourcentage = (hoel / total) * 100;
  return Math.round(pourcentage * 100) / 100;
};

/**
 * Calcule le pourcentage de Zelie dans le total des revenus
 * @param h - Salaire de Hoel
 * @param z - Salaire de Zelie
 * @returns Pourcentage arrondi à 2 décimales
 */
export const pctZelie = (h: number, z: number): number => {
  const hoel = Number(h) || 0;
  const zelie = Number(z) || 0;
  const total = hoel + zelie;
  
  if (total === 0) return 0;
  
  const pourcentage = (zelie / total) * 100;
  return Math.round(pourcentage * 100) / 100;
};

/**
 * Calcule le montant que Hoel doit verser pour les charges
 * @param total - Total des charges
 * @param pct - Pourcentage de Hoel
 * @returns Montant arrondi à 2 décimales
 */
export const versementHoel = (total: number, pct: number): number => {
  const charges = Number(total) || 0;
  const pourcentage = Number(pct) || 0;
  
  if (pourcentage < 0 || pourcentage > 100) return 0;
  
  const montant = (charges * pourcentage) / 100;
  return Math.round(montant * 100) / 100;
};

/**
 * Calcule le montant que Zelie doit verser pour les charges
 * @param total - Total des charges
 * @param pct - Pourcentage de Zelie
 * @returns Montant arrondi à 2 décimales
 */
export const versementZelie = (total: number, pct: number): number => {
  const charges = Number(total) || 0;
  const pourcentage = Number(pct) || 0;
  
  if (pourcentage < 0 || pourcentage > 100) return 0;
  
  const montant = (charges * pourcentage) / 100;
  return Math.round(montant * 100) / 100;
};

/**
 * Calcule le reste d'argent pour Hoel après versement des charges
 * @param h - Salaire de Hoel
 * @param versement - Montant versé pour les charges
 * @returns Reste arrondi à 2 décimales
 */
export const resteHoel = (h: number, versement: number): number => {
  const salaire = Number(h) || 0;
  const vers = Number(versement) || 0;
  
  const reste = salaire - vers;
  return Math.round(reste * 100) / 100;
};

/**
 * Calcule le reste d'argent pour Zelie après versement des charges
 * @param z - Salaire de Zelie
 * @param versement - Montant versé pour les charges
 * @returns Reste arrondi à 2 décimales
 */
export const resteZelie = (z: number, versement: number): number => {
  const salaire = Number(z) || 0;
  const vers = Number(versement) || 0;
  
  const reste = salaire - vers;
  return Math.round(reste * 100) / 100;
};

/**
 * Crée un snapshot mensuel complet avec tous les calculs
 * @param mois - Mois du snapshot (format: "YYYY-MM")
 * @param salaireHoel - Salaire de Hoel
 * @param salaireZelie - Salaire de Zelie
 * @param charges - Tableau des charges
 * @returns Objet snapshot complet
 */
export const creerSnapshotMensuel = (
  mois: string,
  salaireHoel: number,
  salaireZelie: number,
  charges: Charge[]
) => {
  const totalRevenus = sumRevenus(salaireHoel, salaireZelie);
  const totalCharges = sumCharges(charges);
  const pourcentageHoel = pctHoel(salaireHoel, salaireZelie);
  const pourcentageZelie = pctZelie(salaireHoel, salaireZelie);
  const versementHoelMontant = versementHoel(totalCharges, pourcentageHoel);
  const versementZelieMontant = versementZelie(totalCharges, pourcentageZelie);
  const resteHoelMontant = resteHoel(salaireHoel, versementHoelMontant);
  const resteZelieMontant = resteZelie(salaireZelie, versementZelieMontant);

  return {
    id: `snapshot-${mois}-${Date.now()}`,
    mois,
    dateCreation: new Date().toISOString(),
    revenus: {
      hoel: salaireHoel,
      zelie: salaireZelie,
      total: totalRevenus
    },
    charges: {
      total: totalCharges,
      details: charges.map(c => ({ nom: c.nom, montant: c.montant }))
    },
    repartition: {
      pourcentageHoel,
      pourcentageZelie,
      versementHoel: versementHoelMontant,
      versementZelie: versementZelieMontant
    },
    restes: {
      hoel: resteHoelMontant,
      zelie: resteZelieMontant
    }
  };
};

/**
 * Tests intégrés pour valider les calculs
 * Exécutez cette fonction dans la console pour tester
 */
export const runTests = (): void => {
  console.log('🧪 TESTS DES CALCULS FINANCIERS');
  console.log('================================');
  
  // Test avec les données demandées
  const salaireHoel = 3100;
  const salaireZelie = 1500;
  const totalCharges = 1896;
  
  console.log(`📊 Données de test:`);
  console.log(`   Salaire Hoel: ${salaireHoel}€`);
  console.log(`   Salaire Zelie: ${salaireZelie}€`);
  console.log(`   Total Charges: ${totalCharges}€`);
  console.log('');
  
  // Calculs
  const revenus = sumRevenus(salaireHoel, salaireZelie);
  const pctH = pctHoel(salaireHoel, salaireZelie);
  const pctZ = pctZelie(salaireHoel, salaireZelie);
  const versH = versementHoel(totalCharges, pctH);
  const versZ = versementZelie(totalCharges, pctZ);
  const resteH = resteHoel(salaireHoel, versH);
  const resteZ = resteZelie(salaireZelie, versZ);
  
  console.log(`💰 Résultats:`);
  console.log(`   Total Revenus: ${revenus}€`);
  console.log(`   % Hoel: ${pctH}%`);
  console.log(`   % Zelie: ${pctZ}%`);
  console.log(`   Versement Hoel: ${versH}€`);
  console.log(`   Versement Zelie: ${versZ}€`);
  console.log(`   Reste Hoel: ${resteH}€`);
  console.log(`   Reste Zelie: ${resteZ}€`);
  console.log('');
  
  // Vérifications
  console.log(`✅ Vérifications:`);
  console.log(`   % Total = 100%: ${pctH + pctZ === 100 ? 'OK' : 'ERREUR'}`);
  console.log(`   Versements = Charges: ${Math.abs(versH + versZ - totalCharges) < 0.01 ? 'OK' : 'ERREUR'}`);
  console.log(`   Restes cohérents: ${(resteH + resteZ + totalCharges) === revenus ? 'OK' : 'ERREUR'}`);
  
  // Test des cas limites
  console.log('');
  console.log(`🔍 Tests des cas limites:`);
  console.log(`   sumCharges([]): ${sumCharges([])}€`);
  console.log(`   pctHoel(0, 0): ${pctHoel(0, 0)}%`);
  console.log(`   versementHoel(100, 150): ${versementHoel(100, 150)}€`);
  console.log(`   resteHoel(NaN, 100): ${resteHoel(NaN, 100)}€`);
};

/**
 * Version simplifiée pour test rapide
 */
export const testRapide = (): void => {
  const h = 3100, z = 1500, charges = 1896;
  
  console.log('🧮 Test rapide:');
  console.log(`Hoel: ${pctHoel(h, z)}% → ${versementHoel(charges, pctHoel(h, z))}€`);
  console.log(`Zelie: ${pctZelie(h, z)}% → ${versementZelie(charges, pctZelie(h, z))}€`);
  console.log(`Total: ${sumRevenus(h, z)}€, Charges: ${charges}€`);
}; 