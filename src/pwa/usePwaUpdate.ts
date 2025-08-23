import { useState, useEffect } from 'react'

export function usePwaUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    // Vérifier si le Service Worker est supporté
    if ('serviceWorker' in navigator) {
      // Écouter les événements de mise à jour
      const handleUpdateFound = () => {
        console.log('[PWA] Nouvelle version disponible.')
        setNeedRefresh(true)
      }

      // Écouter les messages du Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          setNeedRefresh(true)
        }
      })

      // Vérifier l'état actuel du Service Worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setNeedRefresh(true)
        }
      })

      // Écouter les changements d'état
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Nouveau Service Worker activé.')
        window.location.reload()
      })

      // Écouter les mises à jour
      navigator.serviceWorker.addEventListener('updatefound', handleUpdateFound)

      // Écouter la disponibilité hors-ligne
      window.addEventListener('online', () => setOfflineReady(false))
      window.addEventListener('offline', () => setOfflineReady(true))

      // Vérifier l'état de connectivité initial
      if (navigator.onLine) {
        setOfflineReady(false)
      } else {
        setOfflineReady(true)
      }
    }
  }, [])

  const update = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          // Envoyer un message au Service Worker pour activer la mise à jour
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    }
  }

  return { needRefresh, offlineReady, update }
}
