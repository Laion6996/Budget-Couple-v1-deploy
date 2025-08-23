import React, { useState, Suspense } from 'react';
import { PWAInstallButton } from './components/PWAInstallButton';
import { PageSkeleton } from './components/Skeleton';
import { usePrefetchIdle } from './hooks/usePrefetchIdle';
import { PrefetchDebug } from './components/PrefetchDebug';

// Lazy loading des pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Parametres = React.lazy(() => import('./pages/Parametres'));
const Perso = React.lazy(() => import('./pages/Perso'));
const Objectifs = React.lazy(() => import('./pages/Objectifs'));
const Historique = React.lazy(() => import('./pages/Historique'));
const DemoDonut = React.lazy(() => import('./pages/DemoDonut'));

/**
 * Composant principal SANS React Router - Navigation par état local avec lazy loading
 */
function App() {
  const [currentPage, setCurrentPage] = useState<'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut'>('accueil');

  // Navigation simple
  const navigateTo = (page: 'accueil' | 'parametres' | 'perso' | 'objectifs' | 'historique' | 'demo-donut') => {
    setCurrentPage(page);
  };

  // Prefetch intelligent après que l'app soit idle
  const { prefetchCompleted } = usePrefetchIdle();

  // Fonction pour rendre le contenu de la page avec Suspense
  const renderPageContent = () => {
    switch (currentPage) {
      case 'accueil':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard navigateTo={navigateTo} />
          </Suspense>
        );
      case 'parametres':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Parametres />
          </Suspense>
        );
      case 'perso':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Perso />
          </Suspense>
        );
      case 'objectifs':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Objectifs />
          </Suspense>
        );
      case 'historique':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Historique />
          </Suspense>
        );
      case 'demo-donut':
        return (
          <Suspense fallback={<PageSkeleton />}>
            <DemoDonut navigateTo={navigateTo} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard navigateTo={navigateTo} />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* En-tête avec navigation */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-gray-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Titre */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <h1 className="text-xl font-bold text-white">Budget Couple</h1>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => navigateTo('accueil')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'accueil' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🏠 Accueil
              </button>
              <button 
                onClick={() => navigateTo('parametres')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'parametres' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                ⚙️ Paramètres
              </button>
              <button 
                onClick={() => navigateTo('perso')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'perso' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                👥 Perso
              </button>
              <button 
                onClick={() => navigateTo('objectifs')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'objectifs' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🎯 Objectifs
              </button>
              <button 
                onClick={() => navigateTo('historique')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'historique' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                📊 Historique
              </button>
              <button 
                onClick={() => navigateTo('demo-donut')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'demo-donut' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🍩 Démo
              </button>
            </nav>

            {/* Menu Burger Mobile */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Mobile */}
          <nav className="md:hidden pb-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => navigateTo('accueil')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'accueil' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🏠 Accueil
              </button>
              <button 
                onClick={() => navigateTo('parametres')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'parametres' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                ⚙️ Paramètres
              </button>
              <button 
                onClick={() => navigateTo('perso')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'perso' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                👥 Perso
              </button>
              <button 
                onClick={() => navigateTo('objectifs')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'objectifs' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🎯 Objectifs
              </button>
              <button 
                onClick={() => navigateTo('historique')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'historique' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                📊 Historique
              </button>
              <button 
                onClick={() => navigateTo('demo-donut')}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'demo-donut' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                🍩 Démo
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal avec lazy loading */}
      <main className="min-h-screen">
        {renderPageContent()}
      </main>

      {/* Bouton d'installation PWA */}
      <PWAInstallButton />
      
      {/* Debug du prefetch (mode développement uniquement) */}
      <PrefetchDebug prefetchCompleted={prefetchCompleted} />
    </div>
  );
}

export default App;
