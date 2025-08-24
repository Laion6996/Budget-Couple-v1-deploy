import React, { useState, useCallback } from 'react';

export type SortField = 'nom' | 'montant' | 'restant' | 'date' | 'progression';
export type SortDirection = 'asc' | 'desc';

interface SortableCollapsibleProps<T> {
  title: string;
  items: T[];
  children: (sortedItems: T[]) => React.ReactNode;
  sortFields: Array<{
    key: SortField;
    label: string;
    getValue: (item: T) => string | number;
  }>;
  defaultSortField?: SortField;
  defaultSortDirection?: SortDirection;
  defaultCollapsed?: boolean;
  onSortChange?: (field: SortField, direction: SortDirection) => void;
  className?: string;
}

/**
 * Composant de tri et repli réutilisable pour les listes
 * Supporte le tri par différents champs et le collapse des sections
 */
export function SortableCollapsible<T>({
  title,
  items,
  children,
  sortFields,
  defaultSortField = 'nom',
  defaultSortDirection = 'asc',
  defaultCollapsed = false,
  onSortChange,
  className = ''
}: SortableCollapsibleProps<T>) {
  const [sortField, setSortField] = useState<SortField>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Fonction de tri
  const sortItems = useCallback((itemsToSort: T[]): T[] => {
    const sortFieldConfig = sortFields.find(field => field.key === sortField);
    if (!sortFieldConfig) return itemsToSort;

    return [...itemsToSort].sort((a, b) => {
      const valueA = sortFieldConfig.getValue(a);
      const valueB = sortFieldConfig.getValue(b);

      let comparison = 0;
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB, 'fr-FR');
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection, sortFields]);

  // Gestionnaire de changement de tri
  const handleSortChange = useCallback((field: SortField) => {
    if (field === sortField) {
      // Inverser la direction si c'est le même champ
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      onSortChange?.(field, newDirection);
    } else {
      // Nouveau champ, direction par défaut
      setSortField(field);
      setSortDirection('asc');
      onSortChange?.(field, 'asc');
    }
  }, [sortField, sortDirection, onSortChange]);

  // Gestionnaire de collapse
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const sortedItems = sortItems(items);
  const sortFieldConfig = sortFields.find(field => field.key === sortField);

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      {/* En-tête avec titre, tri et collapse */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-sm text-gray-400">({items.length} éléments)</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Sélecteur de tri */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Trier par:</span>
            <select
              value={sortField}
              onChange={(e) => handleSortChange(e.target.value as SortField)}
              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Champ de tri"
            >
              {sortFields.map(field => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>
            
            {/* Bouton de direction de tri */}
            <button
              onClick={() => handleSortChange(sortField)}
              className="p-1 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={`Tri ${sortDirection === 'asc' ? 'croissant' : 'décroissant'}`}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Bouton collapse */}
          <button
            onClick={toggleCollapse}
            className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={isCollapsed ? 'Déplier la section' : 'Replier la section'}
          >
            {isCollapsed ? '▶️' : '▼'}
          </button>
        </div>
      </div>

      {/* Contenu (trié et potentiellement replié) */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Indicateur de tri actuel */}
          {sortFieldConfig && (
            <div className="mb-4 p-2 bg-gray-700 rounded text-sm text-gray-300">
              <span>Trié par: </span>
              <span className="font-medium text-white">{sortFieldConfig.label}</span>
              <span className="ml-2">
                ({sortDirection === 'asc' ? 'croissant' : 'décroissant'})
              </span>
            </div>
          )}

          {/* Contenu principal */}
          {children(sortedItems)}
        </div>
      )}

      {/* Indicateur de collapse */}
      {isCollapsed && (
        <div className="p-4 text-center text-gray-400 text-sm">
          Section repliée - Cliquez sur ▶️ pour déplier
        </div>
      )}
    </div>
  );
}
