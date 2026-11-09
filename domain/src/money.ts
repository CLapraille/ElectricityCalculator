/** Montants en centimes entiers : les factures sont au centime près et les sommes doivent tomber juste. */
export type Cents = number;

/**
 * Arrondi au centime le plus proche (moitié vers le haut), robuste aux erreurs de flottant :
 * 20 × 15,0566 c€ = 301,132 c€ → 301 c ; 1,5 c → 2 c.
 */
export const roundCents = (x: number): Cents => Math.round(Number(x.toFixed(6)));

export const toCents = (euros: number): Cents => roundCents(euros * 100);

/** Montant d'une ligne de facture : quantité (kWh) × prix unitaire (c€/kWh), arrondi au centime. */
export const lineCents = (kwh: number, ctPerKwh: number): Cents => roundCents(kwh * ctPerKwh);

export const formatEuros = (c: Cents): string =>
  (c / 100).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });
