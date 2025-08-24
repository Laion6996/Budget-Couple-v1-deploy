import { useState, useEffect, useCallback } from 'react';
import type { SortField, SortDirection } from '../components/SortableCollapsible';

interface SortableCollapsiblePreferences {
  sortField: SortField;
  sortDirection: SortDirection;
  isCollapsed: boolean;
}

interface UseSortableCollapsibleOptions {
  storageKey: string;
  defaultSortField?: SortField;
  defaultSortDirection?: SortDirection;
  defaultCollapsed?: boolean;
}

/**
 * Hook pour gérer la persistance des préférences de tri et repli
 * Sauvegarde automatiquement dans le localStorage
 */
export function useSortableCollapsible({
  storageKey,
  defaultSortField = 'nom',
  defaultSortDirection = 'asc',
  defaultCollapsed = false
}: UseSortableCollapsibleOptions) {
  // État local avec valeurs par défaut
  const [preferences, setPreferences] = useState<SortableCollapsiblePreferences>({
    sortField: defaultSortField,
    sortDirection: defaultSortDirection,
    isCollapsed: defaultCollapsed
  });

  // Charger les préférences depuis le localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SortableCollapsiblePreferences;
        setPreferences(parsed);
      }
    } catch (error) {
      console.warn(`Impossible de charger les préférences pour ${storageKey}:`, error);
    }
  }, [storageKey]);

  // Sauvegarder les préférences dans le localStorage
  const savePreferences = useCallback((newPreferences: Partial<SortableCollapsiblePreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.warn(`Impossible de sauvegarder les préférences pour ${storageKey}:`, error);
    }
  }, [preferences, storageKey]);

  // Gestionnaires pour les changements de tri
  const handleSortChange = useCallback((field: SortField, direction: SortDirection) => {
    savePreferences({ sortField: field, sortDirection: direction });
  }, [savePreferences]);

  // Gestionnaire pour le collapse
  const handleCollapseChange = useCallback((isCollapsed: boolean) => {
    savePreferences({ isCollapsed });
  }, [savePreferences]);

  // Réinitialiser les préférences aux valeurs par défaut
  const resetPreferences = useCallback(() => {
    const defaultPreferences: SortableCollapsiblePreferences = {
      sortField: defaultSortField,
      sortDirection: defaultSortDirection,
      isCollapsed: defaultCollapsed
    };
    
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn(`Impossible de supprimer les préférences pour ${storageKey}:`, error);
    }
  }, [storageKey, defaultSortField, defaultSortDirection, defaultCollapsed]);

  return {
    preferences,
    handleSortChange,
    handleCollapseChange,
    resetPreferences,
    savePreferences
  };
}
