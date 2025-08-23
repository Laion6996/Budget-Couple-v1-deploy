import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoney } from '@utils/money';
import { useWindowSize } from '@hooks/useWindowSize';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalBudget: number;
  totalDepense: number;
}

// Tooltip personnalisé pour afficher les informations de manière claire
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string; totalBudget: number } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
          <span className="text-white font-semibold text-sm truncate">{data.name}</span>
        </div>
        <p className="text-gray-300 text-xs mb-1">Montant : <span className="font-bold text-white">{formatMoney(data.value)}</span></p>
        <p className="text-gray-400 text-xs">Pourcentage : <span className="font-bold text-gray-200">{((data.value / data.totalBudget) * 100).toFixed(1)}%</span></p>
        {data.totalBudget > 0 && (
          <p className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-800">Total des dépenses : <span className="font-normal text-gray-500">{formatMoney(data.totalBudget)}</span></p>
        )}
      </div>
    );
  }
  return null;
};

// Composant pour le tooltip de la légende (positionné manuellement)
const LegendTooltip: React.FC<{
  data: { name: string; value: number; color: string; totalBudget: number } | null;
  position: { x: number; y: number } | null;
  isVisible: boolean;
}> = ({ data, position, isVisible }) => {
  if (!isVisible || !position || !data) return null;

  return (
    <div
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg max-w-xs pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
        <span className="text-white font-semibold text-sm truncate">{data.name}</span>
      </div>
      <p className="text-gray-300 text-xs mb-1">Montant : <span className="font-bold text-white">{formatMoney(data.value)}</span></p>
      <p className="text-gray-400 text-xs">Pourcentage : <span className="font-bold text-gray-200">{((data.value / data.totalBudget) * 100).toFixed(1)}%</span></p>
      {data.totalBudget > 0 && (
        <p className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-800">Total des dépenses : <span className="font-normal text-gray-500">{formatMoney(data.totalBudget)}</span></p>
      )}
    </div>
  );
};

const DonutChart: React.FC<DonutChartProps> = ({ data, totalBudget }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [legendTooltipData, setLegendTooltipData] = useState<{ name: string; value: number; color: string; totalBudget: number } | null>(null);
  const [legendTooltipPosition, setLegendTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const { isMobile } = useWindowSize();

  // Préparer les données pour le graphique avec le total pour les calculs
  const chartData = data.map(item => ({
    ...item,
    totalBudget
  }));

  // Gestion des interactions
  const handleLegendHover = (item: { name: string; value: number; color: string; totalBudget: number }, index: number, event: React.MouseEvent) => {
    setHoveredIndex(index);
    setLegendTooltipData(item);
    setLegendTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleLegendLeave = () => {
    setHoveredIndex(null);
    setLegendTooltipData(null);
    setLegendTooltipPosition(null);
  };

  const handlePieHover = (_entry: { name: string; value: number; color: string; totalBudget: number }, index: number) => {
    setHoveredIndex(index);
    // Masquer le tooltip de la légende quand on survole le donut
    setLegendTooltipData(null);
    setLegendTooltipPosition(null);
  };

  const handlePieLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="w-full">
      {/* Version Mobile : Design inspiré de Hello Watt */}
      {isMobile ? (
        <div className="space-y-4">
          {/* Donut Chart centré - Taille optimisée mobile */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Container du donut avec taille fixe et responsive */}
              <div className="h-48 w-48 sm:h-56 sm:w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      onMouseEnter={handlePieHover}
                      onMouseLeave={handlePieLeave}
                    >
                      {chartData.map((item, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={item.color}
                          className={`transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-80 drop-shadow-lg' : 'opacity-100'
                          }`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Total au centre - Masqué lors du survol */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  hoveredIndex !== null ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="text-center">
                  <p className="text-gray-300 text-sm font-medium">Total</p>
                  <p className="text-white text-lg font-bold">{formatMoney(totalBudget)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Légende mobile - Design inspiré de Hello Watt */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-4">
            {/* En-tête de la légende */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-600">
              <h4 className="text-base font-semibold text-white">📊 Répartition des dépenses</h4>
              <span className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                {chartData.length} catégorie{chartData.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Zone de scroll avec toutes les catégories */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    hoveredIndex === index
                      ? 'bg-gray-700 border border-gray-500 shadow-lg scale-105'
                      : 'hover:bg-gray-700/50 bg-gray-750'
                  }`}
                  onMouseEnter={(e) => handleLegendHover(item, index, e)}
                  onMouseLeave={handleLegendLeave}
                >
                  {/* Icône et nom de la catégorie */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 rounded-sm flex-shrink-0 transition-all duration-300 ${
                        hoveredIndex === index ? 'scale-125' : 'scale-100'
                      }`}
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 truncate ${
                        hoveredIndex === index ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Montant et pourcentage */}
                  <div className="text-right flex-shrink-0 ml-3">
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-white' : 'text-white'
                      }`}
                    >
                      {formatMoney(item.value)}
                    </span>
                    <span
                      className={`text-xs ml-2 transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-gray-200' : 'text-gray-400'
                      }`}
                    >
                      {((item.value / totalBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicateur de scroll */}
            <div className="text-center mt-3 pt-3 border-t border-gray-600">
              <div className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                <span>📱</span>
                <span>Scroll pour voir toutes les catégories</span>
                <span>📱</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Version Desktop : Layout horizontal optimisé
        <div className="flex items-start space-x-6">
          {/* Donut Chart - Taille adaptée desktop */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={handlePieHover}
                      onMouseLeave={handlePieLeave}
                    >
                      {chartData.map((item, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={item.color}
                          className={`transition-all duration-300 ${
                            hoveredIndex === index ? 'opacity-80 drop-shadow-lg' : 'opacity-100'
                          }`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Total au centre */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  hoveredIndex !== null ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="text-center">
                  <p className="text-gray-300 text-sm font-medium">Total</p>
                  <p className="text-white text-xl font-bold">{formatMoney(totalBudget)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Légende desktop - Layout vertical compact */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-white mb-4">📊 Répartition des dépenses</h4>
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    hoveredIndex === index
                      ? 'bg-gray-700 border border-gray-500 shadow-lg'
                      : 'hover:bg-gray-700/50 bg-gray-750'
                  }`}
                  onMouseEnter={(e) => handleLegendHover(item, index, e)}
                  onMouseLeave={handleLegendLeave}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 rounded-sm flex-shrink-0 transition-all duration-300 ${
                        hoveredIndex === index ? 'scale-125' : 'scale-100'
                      }`}
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 truncate ${
                        hoveredIndex === index ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0 ml-4">
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-white' : 'text-white'
                      }`}
                    >
                      {formatMoney(item.value)}
                    </span>
                    <span
                      className={`text-xs ml-2 transition-colors duration-300 ${
                        hoveredIndex === index ? 'text-gray-200' : 'text-gray-400'
                      }`}
                    >
                      {((item.value / totalBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tooltip flottant pour la légende */}
      <LegendTooltip
        data={legendTooltipData}
        position={legendTooltipPosition}
        isVisible={!!legendTooltipData && !!legendTooltipPosition}
      />
    </div>
  );
};

export default DonutChart; 