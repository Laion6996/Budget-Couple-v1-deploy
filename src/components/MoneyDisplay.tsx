import { formatMoney, formatMoneyCompact, formatMoneyInteger, formatPercentage } from '../utils/money';

interface MoneyDisplayProps {
  amount: number;
  variant?: 'full' | 'compact' | 'integer';
  className?: string;
}

interface PercentageDisplayProps {
  value: number; // 0.0 à 1.0
  decimals?: number;
  className?: string;
}

/**
 * Composant pour afficher les montants avec formatage EUR fr-FR
 */
export const MoneyDisplay = ({ amount, variant = 'full', className = '' }: MoneyDisplayProps) => {
  let formattedAmount: string;
  
  switch (variant) {
    case 'compact':
      formattedAmount = formatMoneyCompact(amount);
      break;
    case 'integer':
      formattedAmount = formatMoneyInteger(amount);
      break;
    default:
      formattedAmount = formatMoney(amount);
  }

  return (
    <span className={className}>
      {formattedAmount}
    </span>
  );
};

/**
 * Composant pour afficher les pourcentages avec formatage fr-FR
 */
export const PercentageDisplay = ({ value, decimals = 1, className = '' }: PercentageDisplayProps) => {
  const formattedPercentage = formatPercentage(value, decimals);
  
  return (
    <span className={className}>
      {formattedPercentage}
    </span>
  );
};

/**
 * Hook utilitaire pour formater les montants
 */
export const useMoneyFormatting = () => {
  return {
    formatMoney,
    formatMoneyCompact,
    formatMoneyInteger,
    formatPercentage
  };
}; 