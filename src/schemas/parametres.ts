import { z } from 'zod';

/**
 * Schémas de validation pour la page Paramètres
 */

// Schéma pour un salaire
export const salaireSchema = z.object({
  montant: z.number()
    .min(0, 'Le montant doit être positif')
    .max(100000, 'Le montant semble trop élevé'),
});

// Schéma pour une charge fixe
export const chargeFixeSchema = z.object({
  id: z.string(),
  label: z.string()
    .min(1, 'Le label est requis')
    .max(50, 'Le label est trop long'),
  montant: z.number()
    .min(0, 'Le montant doit être positif')
    .max(10000, 'Le montant semble trop élevé'),
});

// Schéma pour la création d'une charge (sans ID)
export const nouvelleChargeSchema = chargeFixeSchema.omit({ id: true });

// Schéma pour la page paramètres complète
export const parametresSchema = z.object({
  salaireHoel: salaireSchema.shape.montant,
  salaireZelie: salaireSchema.shape.montant,
  chargesFixes: z.array(chargeFixeSchema),
});

// Types dérivés des schémas
export type Salaire = z.infer<typeof salaireSchema>;
export type ChargeFixe = z.infer<typeof chargeFixeSchema>;
export type NouvelleCharge = z.infer<typeof nouvelleChargeSchema>;
export type Parametres = z.infer<typeof parametresSchema>; 