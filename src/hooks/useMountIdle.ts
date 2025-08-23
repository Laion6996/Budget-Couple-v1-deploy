import { useState, useEffect } from 'react';

/**
 * Hook qui utilise requestIdleCallback pour retarder le montage de composants lourds
 * Fallback sur setTimeout si requestIdleCallback n'est pas disponible
 * 
 * @param delay - Délai en millisecondes avant de marquer comme "ready" (défaut: 200ms)
 * @returns boolean - true quand le composant peut être monté
 */
export const useMountIdle = (delay: number = 200): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const markAsReady = () => {
      if (!cancelled) {
        setIsReady(true);
      }
    };

    // Utiliser requestIdleCallback si disponible, sinon fallback sur setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(
        markAsReady,
        { timeout: delay + 100 } // Timeout légèrement plus long que le delay
      );

      // Fallback avec setTimeout au cas où requestIdleCallback prend trop de temps
      timeoutId = setTimeout(markAsReady, delay) as NodeJS.Timeout;

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleCallback);
        clearTimeout(timeoutId);
      };
    } else {
      // Fallback pour les environnements qui ne supportent pas requestIdleCallback
      timeoutId = setTimeout(markAsReady, delay);

      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
      };
    }
  }, [delay]);

  return isReady;
};
