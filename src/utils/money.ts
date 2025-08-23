/**
 * Utilitaire pour formater les montants en EUR fr-FR
 */

/**
 * Formate un montant en EUR avec la locale française
 * @param amount - Montant en euros (number)
 * @param options - Options de formatage (optionnel)
 * @returns Montant formaté en string (ex: "1 234,56 €")
 */
export const formatMoney = (
  amount: number, 
  options: Intl.NumberFormatOptions = {}
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };

  return new Intl.NumberFormat('fr-FR', defaultOptions).format(amount);
};

/**
 * Formate un montant en EUR sans le symbole € (pour affichage compact)
 * @param amount - Montant en euros (number)
 * @returns Montant formaté sans symbole (ex: "1 234,56")
 */
export const formatMoneyCompact = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formate un montant en EUR avec 0 décimales (pour montants entiers)
 * @param amount - Montant en euros (number)
 * @returns Montant formaté sans décimales (ex: "1 234 €")
 */
export const formatMoneyInteger = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formate un pourcentage en fr-FR
 * @param value - Valeur décimale (0.0 à 1.0)
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns Pourcentage formaté (ex: "67,4 %")
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  const percentage = value * 100;
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(percentage) + ' %';
};

/**
 * Parse un montant depuis un string français
 * @param moneyString - String formaté (ex: "1 234,56 €")
 * @returns Montant en number ou NaN si invalide
 */
export const parseMoney = (moneyString: string): number => {
  // Supprimer les espaces et le symbole €
  const cleanString = moneyString.replace(/[\s€]/g, '');
  // Remplacer la virgule par un point pour la conversion
  const normalizedString = cleanString.replace(',', '.');
  return parseFloat(normalizedString);
}; 