import React from 'react';

/**
 * Hook qui précharge intelligemment les composants probables après que l'application soit idle
 * 
 * Critères de préchargement :
 * - Connexion rapide (4g ou inconnue)
 * - Thread principal libre (requestIdleCallback)
 * - Composants les plus susceptibles d'être utilisés
 * 
 * Avantages :
 * - Navigation plus fluide
 * - Réduction des "Unused JS" dans Lighthouse
 * - Pas d'impact sur FCP/LCP
 */
export function usePrefetchIdle() {
  React.useEffect(() => {
    // Vérifier la qualité de la connexion
    const net = (navigator as any).connection?.effectiveType;
    const fast = !net || net === '4g';
    
    // Si la connexion est lente, ne pas précharger
    if (!fast) {
      console.log('🚫 Prefetch désactivé: connexion lente (', net, ')');
      return;
    }

    // Fonction de préchargement des composants probables
    const prefetchComponents = async () => {
      try {
        console.log('🚀 Début du prefetch intelligent...');
        
        // Précharger les pages les plus probables
        const pagePromises = [
          import('../pages/Parametres'),    // Page de configuration (très utilisée)
          import('../pages/Perso'),         // Budgets personnels (utilisée)
          import('../pages/Objectifs'),     // Objectifs d'épargne (utilisée)
          import('../pages/Historique'),    // Historique (utilisée)
          import('../pages/DemoDonut')      // Démo (moins utilisée mais lourde)
        ];

        // Précharger les composants lourds
        const componentPromises = [
          import('../components/DonutChart'),      // Graphiques (très lourd)
          import('../components/LazyDonutChart'),  // Wrapper lazy
          import('../charts/DonutAnalysis')        // Analyse avancée
        ];

        // Précharger les hooks et stores
        const hookPromises = [
          import('../hooks/useChargesFixes'),      // Gestion des charges
          import('../hooks/useBudgetsPerso'),      // Budgets personnels
          import('../hooks/useObjectifs'),         // Objectifs
          import('../stores/useAppStore')          // Store principal
        ];

        // Lancer tous les préchargements en parallèle
        const allPromises = [
          ...pagePromises,
          ...componentPromises,
          ...hookPromises
        ];

        // Attendre que tous les préchargements soient terminés
        await Promise.allSettled(allPromises);
        
        console.log('✅ Prefetch terminé avec succès');
        
        // Marquer les composants comme préchargés dans le cache
        markComponentsAsPrefetched();
        
      } catch (error) {
        console.warn('⚠️ Erreur lors du prefetch:', error);
      }
    };

    // Marquer les composants comme préchargés pour éviter les rechargements
    const markComponentsAsPrefetched = () => {
      // Créer un marqueur global pour indiquer que le prefetch est terminé
      (window as any).__PREFETCH_COMPLETED__ = true;
      
      // Optionnel: stocker dans sessionStorage pour la session
      try {
        sessionStorage.setItem('prefetch_completed', 'true');
        sessionStorage.setItem('prefetch_timestamp', Date.now().toString());
      } catch (e) {
        // Ignorer les erreurs de sessionStorage
      }
    };

    // Vérifier si le prefetch a déjà été effectué
    const alreadyPrefetched = (window as any).__PREFETCH_COMPLETED__ || 
                              sessionStorage.getItem('prefetch_completed');
    
    if (alreadyPrefetched) {
      console.log('ℹ️ Prefetch déjà effectué, ignoré');
      return;
    }

    // Délai avant de commencer le prefetch (laisser l'app se stabiliser)
    const prefetchDelay = 1000; // 1 seconde
    
    // Utiliser requestIdleCallback si disponible, sinon fallback sur setTimeout
    let prefetchId: number | NodeJS.Timeout;
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Utiliser requestIdleCallback pour ne pas bloquer le thread principal
      prefetchId = (window as any).requestIdleCallback(
        prefetchComponents,
        { 
          timeout: 2000, // Timeout de 2 secondes maximum
          deadline: 50    // Délai maximum de 50ms par chunk
        }
      );
      
      console.log('🎯 Prefetch programmé avec requestIdleCallback');
    } else {
      // Fallback sur setTimeout avec un délai plus long
      prefetchId = setTimeout(prefetchComponents, prefetchDelay + 1200);
      console.log('⏰ Prefetch programmé avec setTimeout (fallback)');
    }

    // Nettoyage lors du démontage
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(prefetchId as number);
      } else {
        clearTimeout(prefetchId as NodeJS.Timeout);
      }
      console.log('🧹 Prefetch annulé');
    };
  }, []); // Exécuter une seule fois au montage

  // Retourner des informations sur l'état du prefetch
  return {
    isPrefetching: false, // Pour l'instant, on ne track pas l'état
    prefetchCompleted: (window as any).__PREFETCH_COMPLETED__ || false
  };
}
