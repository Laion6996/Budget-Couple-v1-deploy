import { useMemo } from 'react';
import type { CategoryDetail } from '@components/CategoryDetailModal';

export const useCategoryDetails = () => {
  const categoryDetails = useMemo<Record<string, CategoryDetail[]>>(() => ({
    // Charges réelles du store
    'Internet': [
      {
        id: 'fibre',
        name: 'Fibre optique',
        value: 45,
        color: '#3B82F6',
        description: 'Connexion haut débit',
        trend: 'stable'
      },
      {
        id: 'mobile',
        name: 'Forfaits mobiles',
        value: 35,
        color: '#1D4ED8',
        description: 'Forfaits téléphones',
        trend: 'stable'
      }
    ],
    'Gaz': [
      {
        id: 'chauffage',
        name: 'Chauffage',
        value: 80,
        color: '#F59E0B',
        description: 'Chauffage principal',
        trend: 'down'
      },
      {
        id: 'eau-chaude',
        name: 'Eau chaude',
        value: 40,
        color: '#D97706',
        description: 'Production eau chaude',
        trend: 'stable'
      }
    ],
    'Électricité': [
      {
        id: 'base',
        name: 'Consommation de base',
        value: 60,
        color: '#EF4444',
        description: 'Électricité générale',
        trend: 'up'
      },
      {
        id: 'chauffage-elec',
        name: 'Chauffage électrique',
        value: 40,
        color: '#DC2626',
        description: 'Appoint chauffage',
        trend: 'stable'
      }
    ],
    'Crédit Voiture': [
      {
        id: 'capital',
        name: 'Remboursement capital',
        value: 450,
        color: '#8B5CF6',
        description: 'Part capital du crédit',
        trend: 'stable'
      },
      {
        id: 'interets',
        name: 'Intérêts',
        value: 150,
        color: '#7C3AED',
        description: 'Part intérêts',
        trend: 'down'
      }
    ],
    'Ordures': [
      {
        id: 'collecte',
        name: 'Collecte ordures',
        value: 12,
        color: '#10B981',
        description: 'Ramassage déchets',
        trend: 'stable'
      },
      {
        id: 'recyclage',
        name: 'Recyclage',
        value: 6,
        color: '#059669',
        description: 'Tri et recyclage',
        trend: 'stable'
      }
    ],
    'Assurance Maison': [
      {
        id: 'habitation',
        name: 'Assurance habitation',
        value: 12,
        color: '#EC4899',
        description: 'Protection logement',
        trend: 'stable'
      },
      {
        id: 'responsabilite',
        name: 'Responsabilité civile',
        value: 5,
        color: '#DB2777',
        description: 'Protection responsabilité',
        trend: 'stable'
      }
    ],
    'Épargne': [
      {
        id: 'livret-a',
        name: 'Livret A',
        value: 300,
        color: '#10B981',
        description: 'Épargne sécurisée et accessible',
        trend: 'up'
      },
      {
        id: 'pel',
        name: 'PEL',
        value: 150,
        color: '#059669',
        description: 'Plan d\'épargne logement',
        trend: 'stable'
      },
      {
        id: 'assurance-vie',
        name: 'Assurance-vie',
        value: 50,
        color: '#047857',
        description: 'Investissement long terme',
        trend: 'up'
      }
    ],
    'Charges fixes': [
      {
        id: 'loyer',
        name: 'Loyer',
        value: 500,
        color: '#EF4444',
        description: 'Logement principal',
        trend: 'stable'
      },
      {
        id: 'electricite',
        name: 'Électricité',
        value: 120,
        color: '#DC2626',
        description: 'Consommation mensuelle',
        trend: 'down'
      },
      {
        id: 'internet',
        name: 'Internet',
        value: 50,
        color: '#B91C1C',
        description: 'Abonnement fibre',
        trend: 'stable'
      },
      {
        id: 'assurance-habitation',
        name: 'Assurance habitation',
        value: 80,
        color: '#991B1B',
        description: 'Protection du logement',
        trend: 'stable'
      },
      {
        id: 'charges-copro',
        name: 'Charges copropriété',
        value: 50,
        color: '#7F1D1D',
        description: 'Frais communs',
        trend: 'up'
      }
    ],
    'Dépenses variables': [
      {
        id: 'courses',
        name: 'Courses alimentaires',
        value: 200,
        color: '#F59E0B',
        description: 'Nourriture et produits ménagers',
        trend: 'up'
      },
      {
        id: 'restaurants',
        name: 'Restaurants',
        value: 100,
        color: '#D97706',
        description: 'Sorties gastronomiques',
        trend: 'down'
      },
      {
        id: 'essence',
        name: 'Essence',
        value: 100,
        color: '#B45309',
        description: 'Carburant véhicule',
        trend: 'stable'
      }
    ],
    'Loisirs': [
      {
        id: 'sorties',
        name: 'Sorties culturelles',
        value: 150,
        color: '#8B5CF6',
        description: 'Cinéma, théâtre, expositions',
        trend: 'up'
      },
      {
        id: 'shopping',
        name: 'Shopping',
        value: 100,
        color: '#7C3AED',
        description: 'Vêtements et accessoires',
        trend: 'down'
      },
      {
        id: 'sport',
        name: 'Activités sportives',
        value: 50,
        color: '#6D28D9',
        description: 'Abonnements et équipements',
        trend: 'stable'
      }
    ],
    'Transport': [
      {
        id: 'essence-transport',
        name: 'Essence',
        value: 120,
        color: '#3B82F6',
        description: 'Carburant principal',
        trend: 'stable'
      },
      {
        id: 'entretien',
        name: 'Entretien véhicule',
        value: 50,
        color: '#2563EB',
        description: 'Révisions et réparations',
        trend: 'up'
      },
      {
        id: 'assurance-auto',
        name: 'Assurance auto',
        value: 30,
        color: '#1D4ED8',
        description: 'Protection véhicule',
        trend: 'stable'
      }
    ],
    'Alimentation': [
      {
        id: 'courses-principales',
        name: 'Courses principales',
        value: 250,
        color: '#10B981',
        description: 'Alimentation de base',
        trend: 'up'
      },
      {
        id: 'restaurants-alimentation',
        name: 'Restaurants',
        value: 100,
        color: '#059669',
        description: 'Repas extérieurs',
        trend: 'down'
      },
      {
        id: 'livraisons',
        name: 'Livraisons',
        value: 50,
        color: '#047857',
        description: 'Services de livraison',
        trend: 'up'
      }
    ]
  }), []);

  // Log de débogage
  console.log('🔧 [useCategoryDetails] Hook initialisé');
  console.log('🔧 [useCategoryDetails] Nombre de catégories:', Object.keys(categoryDetails).length);
  console.log('🔧 [useCategoryDetails] Catégories disponibles:', Object.keys(categoryDetails));

  return { categoryDetails };
};
