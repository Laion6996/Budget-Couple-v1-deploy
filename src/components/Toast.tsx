import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'undo';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
  onUndo?: () => void;
  showUndo?: boolean;
}

/**
 * Composant Toast amélioré avec fonctionnalité Undo
 * Supporte différents types de notifications et actions
 */
export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose,
  onUndo,
  showUndo = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre l'animation de sortie
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Compte à rebours pour les toasts avec Undo
  useEffect(() => {
    if (showUndo && onUndo) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showUndo, onUndo]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out max-w-sm";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-600 text-white border border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-600 text-white border border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-600 text-white border border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-600 text-white border border-blue-500`;
      case 'undo':
        return `${baseStyles} bg-purple-600 text-white border border-purple-500`;
      default:
        return `${baseStyles} bg-gray-600 text-white border border-gray-500`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'undo':
        return '↩️';
      default:
        return '💬';
    }
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
      setIsVisible(false);
      setTimeout(onClose, 300);
    }
  };

  return (
    <div 
      className={`${getToastStyles()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-relaxed text-white">{message}</p>
          
          {/* Barre de progression pour les toasts avec Undo */}
          {showUndo && onUndo && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                <span>Annuler dans</span>
                <span>{timeLeft}s</span>
              </div>
              <div className="w-full bg-slate-300 rounded-full h-1">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / (duration / 1000)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bouton fermer */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-slate-200 hover:text-white transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-300 rounded"
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      </div>

      {/* Bouton Undo */}
      {showUndo && onUndo && (
        <div className="mt-3 pt-3 border-t border-slate-300">
          <button
            onClick={handleUndo}
            className="w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            ↩️ Annuler
          </button>
        </div>
      )}
    </div>
  );
};

// Hook pour gérer les toasts avec fonctionnalité Undo
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onUndo?: () => void;
    showUndo?: boolean;
  }>>([]);

  const showToast = (
    message: string, 
    type: ToastType = 'info', 
    duration?: number,
    onUndo?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const showUndo = type === 'undo' && !!onUndo;
    
    setToasts(prev => [...prev, { 
      id, 
      message, 
      type, 
      duration, 
      onUndo, 
      showUndo 
    }]);
    
    // Auto-remove après la durée spécifiée (sauf pour les toasts avec Undo)
    if (duration !== 0 && !showUndo) {
      setTimeout(() => {
        removeToast(id);
      }, duration || 4000);
    }
  };

  const showUndoToast = (
    message: string,
    onUndo: () => void,
    duration: number = 5000
  ) => {
    showToast(message, 'undo', duration, onUndo);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          onUndo={toast.onUndo}
          showUndo={toast.showUndo}
        />
      ))}
    </div>
  );

  return {
    showToast,
    showUndoToast,
    removeToast,
    ToastContainer,
    toasts
  };
};
