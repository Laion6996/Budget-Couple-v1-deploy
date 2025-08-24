import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Hook simple pour gérer les toasts
 * Permet d'afficher des notifications temporaires
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove après la durée spécifiée
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts
  };
};

// Fonction utilitaire pour utiliser le toast depuis n'importe où
let toastInstance: ReturnType<typeof useToast> | null = null;

export const setToastInstance = (instance: ReturnType<typeof useToast>) => {
  toastInstance = instance;
};

export const toast = (message: string, type: ToastType = 'info', duration: number = 4000) => {
  if (toastInstance) {
    return toastInstance.showToast(message, type, duration);
  }
  // Fallback : console.log si pas d'instance
  console.log(`[${type.toUpperCase()}] ${message}`);
  return null;
};

