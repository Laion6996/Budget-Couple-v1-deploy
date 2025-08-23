import React, { useState, useCallback, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import {
  Car,
  Home,
  Zap,
  Coffee,
  Tv,
  Smartphone,
  Wifi,
  Flame,
  Shield
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type DonutSlice = {
  id: string
  label: string
  value: number          // en euros
  color: string          // ex: '#10b981'
  icon?: string          // 'car','home','bolt','coffee','tv',...
}

export type DonutAnalysisProps = {
  title?: string
  subtitle?: string           // ex: "Août 2025"
  unit?: '€' | '€ / mois' | string
  slices: DonutSlice[]
  centerLabel?: string        // ex: "Total"
  formatValue?: (n: number) => string // défaut: format EUR fr-FR
  onSliceSelect?: (id: string) => void
}

// Map des icônes
const iconMap: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  bolt: Zap,
  coffee: Coffee,
  tv: Tv,
  phone: Smartphone,
  wifi: Wifi,
  flame: Flame,
  shield: Shield,
}

export const DonutAnalysis: React.FC<DonutAnalysisProps> = ({
  title,
  subtitle,
  unit = '€',
  slices,
  centerLabel = 'Total',
  formatValue,
  onSliceSelect
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Formatage par défaut des valeurs
  const defaultFormatValue = useCallback((n: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(n)
  }, [])

  const finalFormatValue = formatValue || defaultFormatValue

  // Calculs
  const total = useMemo(() => slices.reduce((sum, slice) => sum + slice.value, 0), [slices])
  
  const data = useMemo(() => 
    slices.map((slice, index) => ({
      ...slice,
      index,
      percentage: Math.round((slice.value / total) * 1000) / 10
    })), [slices, total]
  )

  // Gestion des interactions
  const handleMouseEnter = useCallback((_: any, index: number) => {
    setHoveredIndex(index)
    setActiveIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
    setActiveIndex(null)
  }, [])

  const handleClick = useCallback((_: any, index: number) => {
    setActiveIndex(index)
    if (onSliceSelect) {
      onSliceSelect(slices[index].id)
    }
  }, [onSliceSelect, slices])

  // Gestion du survol de la légende
  const handleLegendHover = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleLegendLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  // Gestion du clavier
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (activeIndex === null) return
    
    let newIndex = activeIndex
    if (event.key === 'ArrowLeft') {
      newIndex = activeIndex > 0 ? activeIndex - 1 : slices.length - 1
    } else if (event.key === 'ArrowRight') {
      newIndex = activeIndex < slices.length - 1 ? activeIndex + 1 : 0
    }
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
      if (onSliceSelect) {
        onSliceSelect(slices[newIndex].id)
      }
    }
  }, [activeIndex, slices, onSliceSelect])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Titre et sous-titre */}
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-300">{subtitle}</p>}
        </div>
      )}

      {/* Conteneur principal */}
      <div className="relative">
        {/* Donut Chart */}
        <div className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] mx-auto relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                tabIndex={0}
                role="img"
                aria-label={`Graphique en anneau montrant ${title || 'les données'}`}
                onKeyDown={handleKeyDown}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#1f2937"
                    strokeWidth={3}
                    r={hoveredIndex === index ? 118 : 110}
                    className={`transition-all duration-300 ${
                      hoveredIndex === index ? 'opacity-90 drop-shadow-xl' : 'opacity-100'
                    }`}
                    aria-current={activeIndex === index ? 'true' : 'false'}
                    tabIndex={0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Overlay central */}
          <div 
            className={`absolute inset-0 flex items-center justify-center text-center transition-opacity duration-300 ${
              hoveredIndex !== null ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {finalFormatValue(total)}
              </div>
              <div className="text-gray-300 text-sm">
                {centerLabel}
                {unit && unit !== '€' && (
                  <span className="block text-xs mt-1 text-gray-400">{unit}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {data.map((slice) => {
            const IconComponent = slice.icon ? iconMap[slice.icon] : null
            const isActive = activeIndex === slice.index
            const isHovered = hoveredIndex === slice.index
            
            return (
              <div
                key={slice.id}
                className={`flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 ${
                  isHovered 
                    ? 'bg-gray-700 border-blue-500 shadow-xl scale-105 ring-2 ring-blue-500/50' 
                    : isActive 
                      ? 'ring-2 ring-blue-500 bg-gray-700 border-blue-600' 
                      : 'hover:bg-gray-700/80 hover:border-gray-600'
                }`}
                onClick={() => handleClick(null, slice.index)}
                onMouseEnter={() => handleLegendHover(slice.index)}
                onMouseLeave={handleLegendLeave}
                tabIndex={0}
                role="button"
                aria-label={`Sélectionner ${slice.label}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                {/* Pastille de couleur */}
                <div 
                  className={`w-5 h-5 rounded-full flex-shrink-0 transition-all duration-300 shadow-md ${
                    isHovered ? 'scale-125' : 'scale-100'
                  }`}
                  style={{ backgroundColor: slice.color }}
                />
                
                {/* Icône */}
                {IconComponent && (
                  <IconComponent 
                    className={`w-5 h-5 text-gray-300 flex-shrink-0 transition-all duration-300 ${
                      isHovered ? 'scale-125 text-blue-300' : 'scale-100'
                    }`}
                  />
                )}
                
                {/* Label et valeurs */}
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold truncate transition-colors duration-300 text-base ${
                    isHovered ? 'text-white' : 'text-gray-200'
                  }`}>
                    {slice.label}
                  </div>
                  <div className={`font-bold transition-colors duration-300 text-sm mt-1 ${
                    isHovered ? 'text-blue-300' : 'text-blue-400'
                  }`}>
                    {finalFormatValue(slice.value)}
                  </div>
                  <div className={`text-xs transition-colors duration-300 mt-1 ${
                    isHovered ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {slice.percentage}% du total
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
