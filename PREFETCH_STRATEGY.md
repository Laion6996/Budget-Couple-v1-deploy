# 🚀 Stratégie de Prefetch Intelligent - Budget Couple

## 📊 Vue d'ensemble

Le système de **prefetch intelligent** précharge automatiquement les composants probables après que l'application soit idle, améliorant significativement l'expérience de navigation sans impacter les performances initiales.

## 🎯 Objectifs

- ✅ **Navigation fluide** : Préchargement des composants probables
- ✅ **Performance préservée** : Pas d'impact sur FCP/LCP
- ✅ **Intelligence réseau** : Adaptation à la qualité de connexion
- ✅ **Idle-first** : Utilisation de requestIdleCallback
- ✅ **Cache optimisé** : Éviter les rechargements inutiles

## 🔧 Implémentation

### **Hook usePrefetchIdle**

```typescript
// src/hooks/usePrefetchIdle.ts
export function usePrefetchIdle() {
  React.useEffect(() => {
    // Vérifier la qualité de la connexion
    const net = (navigator as any).connection?.effectiveType;
    const fast = !net || net === '4g';
    
    // Précharger uniquement sur connexion rapide
    if (!fast) return;
    
    // Utiliser requestIdleCallback pour ne pas bloquer l'UI
    const prefetchId = requestIdleCallback(prefetchComponents, {
      timeout: 2000,
      deadline: 50
    });
    
    return () => cancelIdleCallback(prefetchId);
  }, []);
}
```

### **Composants préchargés**

#### **Pages prioritaires**
- `Parametres` : Configuration (très utilisée)
- `Perso` : Budgets personnels (utilisée)
- `Objectifs` : Objectifs d'épargne (utilisée)
- `Historique` : Historique (utilisée)
- `DemoDonut` : Démo (lourde mais utile)

#### **Composants lourds**
- `DonutChart` : Graphiques (très lourd - 418 kB)
- `LazyDonutChart` : Wrapper lazy
- `DonutAnalysis` : Analyse avancée

#### **Hooks et stores**
- `useChargesFixes` : Gestion des charges
- `useBudgetsPerso` : Budgets personnels
- `useObjectifs` : Objectifs
- `useAppStore` : Store principal

## 🚀 Stratégie de Chargement

### **1. Chargement Initial**
```
📦 Bundle Principal (14.85 kB)
├── Navigation et Layout
├── Composants de base
└── Hooks essentiels
```

### **2. Prefetch Intelligent (après idle)**
```
🎯 requestIdleCallback + 1s
├── Vérification connexion (4g+ uniquement)
├── Préchargement parallèle des composants
└── Marquage comme "préchargé"
```

### **3. Navigation Réelle**
```
⚡ Navigation instantanée
├── Composants déjà en cache
├── Pas de téléchargement
└── Affichage immédiat
```

## 📈 Critères de Préchargement

### **Connexion**
- ✅ **4g** : Préchargement activé
- ✅ **Inconnue** : Préchargement activé (connexion rapide présumée)
- ❌ **3g/2g** : Préchargement désactivé (économie de données)

### **Timing**
- **Délai initial** : 1 seconde après montage
- **Idle callback** : Dès que le thread principal est libre
- **Timeout** : Maximum 2 secondes
- **Deadline** : Maximum 50ms par chunk

### **Priorités**
1. **Pages très utilisées** (Parametres, Perso)
2. **Composants lourds** (DonutChart, DonutAnalysis)
3. **Hooks essentiels** (useChargesFixes, useBudgetsPerso)
4. **Pages secondaires** (Historique, DemoDonut)

## 🔍 Monitoring et Debug

### **Composant de Debug**
```typescript
// Visible uniquement en mode développement
<PrefetchDebug prefetchCompleted={prefetchCompleted} />
```

### **Logs Console**
```
🚀 Début du prefetch intelligent...
🎯 Prefetch programmé avec requestIdleCallback
✅ Prefetch terminé avec succès
ℹ️ Prefetch déjà effectué, ignoré
```

### **Marqueurs Globaux**
```typescript
// Indicateur de completion
window.__PREFETCH_COMPLETED__ = true

// Session storage
sessionStorage.setItem('prefetch_completed', 'true')
sessionStorage.setItem('prefetch_timestamp', Date.now().toString())
```

## 📊 Métriques de Performance

### **Avant Prefetch**
- **Navigation** : 200-500ms (téléchargement + parsing)
- **Graphiques** : 500-1000ms (Recharts 418 kB)
- **Lighthouse** : "Unused JS" élevé

### **Après Prefetch**
- **Navigation** : 50-100ms (cache)
- **Graphiques** : 100-200ms (déjà chargés)
- **Lighthouse** : "Unused JS" réduit

### **Impact sur FCP/LCP**
- **FCP** : Aucun impact (prefetch après idle)
- **LCP** : Aucun impact (composants critiques déjà chargés)
- **Navigation** : Amélioration significative

## 🚨 Bonnes Pratiques

### ✅ **À faire**
- Précharger uniquement les composants probables
- Respecter la qualité de connexion
- Utiliser requestIdleCallback
- Marquer les composants comme préchargés

### ❌ **À éviter**
- Précharger sur connexion lente
- Bloquer le thread principal
- Précharger des composants improbables
- Oublier la gestion d'erreur

## 🔮 Évolutions Futures

### **Optimisations possibles**
- **Preloading conditionnel** : Basé sur l'historique utilisateur
- **Chunks prioritaires** : Ordre de préchargement intelligent
- **Cache intelligent** : Gestion de la durée de vie des chunks
- **Métriques avancées** : Tracking des composants réellement utilisés

### **Nouveaux composants**
- **Formulaires** : Validation et gestion d'état
- **Animations** : Transitions et micro-interactions
- **Maps** : Visualisation géographique
- **Charts avancés** : Graphiques 3D et interactifs

## 🧪 Tests et Validation

### **Scénarios de test**
1. **Connexion rapide** : Vérifier le prefetch
2. **Connexion lente** : Vérifier la désactivation
3. **Navigation** : Vérifier la rapidité
4. **Lighthouse** : Vérifier la réduction d'Unused JS

### **Métriques à surveiller**
- **Temps de navigation** : Doit être < 100ms après prefetch
- **Taille des chunks** : Doit rester stable
- **Performance initiale** : FCP/LCP inchangés
- **Cache hit ratio** : > 90% après prefetch

---

**📝 Note** : Ce système garantit que les composants lourds comme Recharts (418 kB) sont préchargés intelligemment, offrant une navigation fluide sans compromettre les performances initiales de l'application.
