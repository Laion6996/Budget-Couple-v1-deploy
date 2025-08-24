// Hooks de gestion des données
export { useAppStore } from '@/stores/useAppStore';
export { useBudgetsPerso } from './useBudgetsPerso';
export { useChargesFixes } from './useChargesFixes';
export { useObjectifs } from './useObjectifs';
export { useCategoryDetails } from './useCategoryDetails';
export { useCategoryNavigation } from './useCategoryNavigation';

// Hooks utilitaires
export { useDebounce } from './useDebounce';
export { useMountIdle } from './useMountIdle';
export { usePrefetchIdle } from './usePrefetchIdle';
export { useWindowSize } from './useWindowSize';

// Hooks de sécurité et UX
export { useSecureDelete } from './useSecureDelete';
export { useSortableCollapsible } from './useSortableCollapsible';

// Hooks de notification
export { useToast, toast } from './useToast'; 