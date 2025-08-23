import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export interface CategoryDetail {
  id: string;
  name: string;
  value: number;
  color: string;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    name: string;
    value: number;
    color: string;
    totalBudget: number;
  };
  details: CategoryDetail[];
  onNavigateToCategory?: (categoryId: string) => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  details,
  onNavigateToCategory
}) => {
  if (!isOpen) return null;

  const totalDetail = details.reduce((sum, item) => sum + item.value, 0);
  const percentageOfTotal = ((category.value / category.totalBudget) * 100).toFixed(1);

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };



  return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{category.name}</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {percentageOfTotal}% du budget total
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

                    {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Summary */}
              <div className="bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <span className="text-gray-300 text-sm sm:text-base">Total {category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {category.value.toLocaleString()}€
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      sur {category.totalBudget.toLocaleString()}€
                    </div>
                  </div>
                </div>
              </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {details.map((detail) => (
              <div
                key={detail.id}
                className="bg-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => onNavigateToCategory?.(detail.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: detail.color }}
                    />
                    <span className="text-white font-medium text-sm sm:text-base">{detail.name}</span>
                  </div>
                  {getTrendIcon(detail.trend)}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {detail.value.toLocaleString()}€
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {((detail.value / totalDetail) * 100).toFixed(1)}% de {category.name}
                </div>
                {detail.description && (
                  <p className="text-xs text-gray-500 mt-2">{detail.description}</p>
                )}
              </div>
            ))}
          </div>

                        {/* Chart Preview */}
              <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className="text-gray-300 font-medium text-sm sm:text-base">Répartition {category.name}</span>
                </div>
                <div className="flex items-center justify-center h-24 sm:h-32">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {details.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">sous-catégories</div>
                  </div>
                </div>
              </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-700 space-y-2 sm:space-y-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              console.log('🔗 [CategoryDetailModal] Navigation vers:', category.name);
              onNavigateToCategory?.(category.name);
              onClose(); // Fermer le modal après navigation
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Voir tous les détails
          </button>
        </div>
      </div>
    </div>
  );
};
