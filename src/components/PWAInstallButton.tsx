import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Debug: Vérifier l'état initial
    console.log('🔍 PWA Debug: Composant monté');
    
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInApp = 
      (navigator as { standalone?: boolean }).standalone === true ||
      window.matchMedia?.('(display-mode: standalone)').matches;
    
    console.log('🔍 PWA Debug: display-mode standalone =', isStandalone);
    console.log('🔍 PWA Debug: navigator.standalone =', isInApp);
    
    if (isStandalone || isInApp) {
      console.log('✅ PWA Debug: App déjà installée');
      setIsInstalled(true);
      setIsInstallable(false);
      setDebugInfo('App déjà installée');
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA Debug: beforeinstallprompt reçu!', e);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setDebugInfo('Prompt d\'installation disponible');
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      console.log('✅ PWA Debug: App installée!');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setDebugInfo('App installée avec succès');
    };

    // Vérifier les critères d'installabilité
    const checkInstallability = () => {
      console.log('🔍 PWA Debug: Vérification des critères d\'installabilité');
      
      // Vérifier si le manifeste est accessible
      fetch('/manifest.webmanifest')
        .then(response => {
          console.log('✅ PWA Debug: Manifest accessible:', response.status);
          if (response.ok) {
            return response.json();
          }
          throw new Error('Manifest non accessible');
        })
        .then(manifest => {
          console.log('✅ PWA Debug: Manifest valide:', manifest.name);
        })
        .catch(error => {
          console.error('❌ PWA Debug: Erreur manifest:', error);
          setDebugInfo('Erreur manifest: ' + error.message);
        });

      // Vérifier le service worker
      if ('serviceWorker' in navigator) {
        console.log('✅ PWA Debug: Service Worker supporté');
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log('🔍 PWA Debug: SW enregistrés:', registrations.length);
          registrations.forEach(reg => {
            console.log('🔍 PWA Debug: SW actif:', reg.active?.state);
          });
        });
      } else {
        console.log('❌ PWA Debug: Service Worker non supporté');
        setDebugInfo('Service Worker non supporté');
      }
    };

    // Vérifier après un délai
    setTimeout(checkInstallability, 1000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('❌ PWA Debug: Aucun prompt disponible');
      return;
    }

    try {
      console.log('🚀 PWA Debug: Déclenchement du prompt d\'installation');
      // Afficher le prompt d'installation
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('🔍 PWA Debug: Résultat du prompt:', outcome);
      
      if (outcome === 'accepted') {
        console.log('✅ PWA Debug: Application installée avec succès !');
        setIsInstalled(true);
        setIsInstallable(false);
        setDebugInfo('Installation réussie!');
      } else {
        console.log('❌ PWA Debug: Installation refusée par l\'utilisateur');
        setDebugInfo('Installation refusée');
      }
    } catch (error) {
      console.error('❌ PWA Debug: Erreur lors de l\'installation:', error);
      setDebugInfo('Erreur: ' + error);
    }

    // Nettoyer le prompt
    setDeferredPrompt(null);
  };

  // Debug: Afficher les informations de debug
  if (import.meta.env.MODE === 'development') {
    console.log('🔍 PWA Debug: État actuel:', {
      isInstallable,
      isInstalled,
      hasDeferredPrompt: !!deferredPrompt,
      debugInfo
    });
  }

  // Ne pas afficher si l'app est déjà installée
  if (isInstalled) {
    return (
      <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
        <span className="text-xl">✅</span>
        <span className="ml-2 font-semibold">App installée</span>
      </div>
    );
  }

  // Afficher le bouton d'installation ou les informations de debug
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isInstallable ? (
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          title="Installer l'application Budget Couple"
          aria-label="Installer l'application Budget Couple sur votre appareil"
        >
          <span className="text-xl">📱</span>
          <span className="font-semibold">Installer l'app</span>
        </button>
      ) : (
        <div className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <div className="text-center">
            <div className="text-lg mb-1">🔍</div>
            <div className="font-semibold">PWA Debug</div>
            <div className="text-xs mt-1">{debugInfo || 'Vérification...'}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 