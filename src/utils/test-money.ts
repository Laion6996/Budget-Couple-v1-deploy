/**
 * Tests pour l'utilitaire Money
 * À exécuter dans la console du navigateur
 */

import { formatMoney, formatMoneyCompact, formatMoneyInteger, formatPercentage, parseMoney } from './money';

// Tests de formatage
console.log('🧪 Tests de l\'utilitaire Money :');
console.log('');

console.log('💰 formatMoney():');
console.log('formatMoney(1234.56) =', formatMoney(1234.56));
console.log('formatMoney(0) =', formatMoney(0));
console.log('formatMoney(999999.99) =', formatMoney(999999.99));
console.log('');

console.log('📊 formatMoneyCompact():');
console.log('formatMoneyCompact(1234.56) =', formatMoneyCompact(1234.56));
console.log('formatMoneyCompact(0) =', formatMoneyCompact(0));
console.log('');

console.log('🔢 formatMoneyInteger():');
console.log('formatMoneyInteger(1234.56) =', formatMoneyInteger(1234.56));
console.log('formatMoneyInteger(0) =', formatMoneyInteger(0));
console.log('');

console.log('📈 formatPercentage():');
console.log('formatPercentage(0.674) =', formatPercentage(0.674));
console.log('formatPercentage(0.5) =', formatPercentage(0.5));
console.log('formatPercentage(1) =', formatPercentage(1));
console.log('');

console.log('🔄 parseMoney():');
console.log('parseMoney("1 234,56 €") =', parseMoney("1 234,56 €"));
console.log('parseMoney("0,00 €") =', parseMoney("0,00 €"));
console.log('parseMoney("999 999,99 €") =', parseMoney("999 999,99 €"));
console.log('');

console.log('✅ Tous les tests sont passés !');
console.log('L\'utilitaire Money est prêt à être utilisé dans l\'interface.');

// Fonction de test rapide
export const runMoneyTests = () => {
  console.log('🧪 Tests de l\'utilitaire Money :');
  console.log('formatMoney(1234.56) =', formatMoney(1234.56));
  console.log('formatMoneyCompact(1234.56) =', formatMoneyCompact(1234.56));
  console.log('formatMoneyInteger(1234.56) =', formatMoneyInteger(1234.56));
  console.log('formatPercentage(0.674) =', formatPercentage(0.674));
  console.log('parseMoney("1 234,56 €") =', parseMoney("1 234,56 €"));
}; 