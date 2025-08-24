import { z } from 'zod';

// Schéma de validation pour les charges fixes
export const chargeFixeSchema = z.object({
  label: z.string()
    .min(1, 'Le nom de la charge est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  montant: z.number()
    .positive('Le montant doit être positif')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000€')
});

// Schéma de validation pour les objectifs
export const objectifSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom de l\'objectif est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  montantCible: z.number()
    .positive('Le montant cible doit être positif')
    .max(1000000, 'Le montant cible ne peut pas dépasser 1 000 000€'),
  dejaEpargne: z.number()
    .min(0, 'L\'épargne déjà réalisée ne peut pas être négative')
    .max(1000000, 'L\'épargne déjà réalisée ne peut pas dépasser 1 000 000€')
});

// Schéma de validation pour les budgets personnels
export const budgetPersoSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du budget est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  montant: z.number()
    .positive('Le montant doit être positif')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000€')
});

// Schéma de validation pour les salaires
export const salaireSchema = z.object({
  montant: z.number()
    .positive('Le salaire doit être positif')
    .max(1000000, 'Le salaire ne peut pas dépasser 1 000 000€')
});

// Types dérivés des schémas
export type ChargeFixeInput = z.input<typeof chargeFixeSchema>;
export type ChargeFixeValidated = z.output<typeof chargeFixeSchema>;
export type ObjectifInput = z.input<typeof objectifSchema>;
export type ObjectifValidated = z.output<typeof objectifSchema>;
export type BudgetPersoInput = z.input<typeof budgetPersoSchema>;
export type BudgetPersoValidated = z.output<typeof budgetPersoSchema>;
export type SalaireInput = z.input<typeof salaireSchema>;
export type SalaireValidated = z.output<typeof salaireSchema>;

// Fonction utilitaire pour valider et retourner les erreurs
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      const zodError = error as z.ZodError;
      zodError.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Erreur de validation inattendue' } };
  }
}

// Fonction pour valider un champ spécifique
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): string | null {
  try {
    // Créer un objet temporaire avec le champ à valider
    const tempData = { [fieldName]: value };
    // Utiliser une approche plus simple pour la validation de champ
    const fieldSchema = z.object({ [fieldName]: (schema as any).shape?.[fieldName] || z.any() });
    fieldSchema.parse(tempData);
    return null; // Pas d'erreur
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const fieldError = zodError.issues.find((issue: z.ZodIssue) => issue.path[0] === fieldName);
      return fieldError ? fieldError.message : null;
    }
    return null;
  }
}
