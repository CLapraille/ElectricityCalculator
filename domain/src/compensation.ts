import { roundCents, type Cents } from './money.ts';

/**
 * kWh de recharge réellement facturés avec un compteur qui tourne à l'envers (compensation annuelle).
 * Seul le solde net annuel (prélèvement − injection) est facturé, et un solde négatif n'est pas payé.
 * La voiture profite donc d'abord du surplus solaire, sinon perdu (décision D9) :
 * facturés = max(0, N) − max(0, N − C), où N = solde net du foyer **avec** la voiture et C = kWh de recharge.
 */
export function billableCarKwh(netWithCarKwh: number, carKwh: number): number {
  const v = Math.max(0, netWithCarKwh) - Math.max(0, netWithCarKwh - carKwh);
  return Math.min(carKwh, Math.max(0, v));
}

export interface CompensationSettlement {
  carKwh: number;
  billableKwh: number;
  /** kWh couverts par le surplus solaire : coût nul. */
  freeKwh: number;
  provisionedCents: Cents;
  /** Part réelle de la voiture : provisions × part facturée (prix moyen des recharges provisionnées). */
  carShareCents: Cents;
  /** À reprendre du compte séparé (positif) ou à y ajouter (négatif). */
  refundCents: Cents;
}

/**
 * Bilan à la régularisation : chaque recharge a été provisionnée au prix marginal complet (D10) ;
 * on rend la part des kWh couverts par le surplus. Le prix moyen appliqué est celui des provisions : à comparer
 * ensuite aux prix unitaires de la facture réelle.
 */
export function settleCompensation(input: {
  netWithCarKwh: number;
  carKwh: number;
  provisionedCents: Cents;
}): CompensationSettlement {
  const { netWithCarKwh, carKwh, provisionedCents } = input;
  const billableKwh = billableCarKwh(netWithCarKwh, carKwh);
  const carShareCents = carKwh === 0 ? 0 : roundCents((provisionedCents * billableKwh) / carKwh);
  return {
    carKwh,
    billableKwh,
    freeKwh: carKwh - billableKwh,
    provisionedCents,
    carShareCents,
    refundCents: provisionedCents - carShareCents,
  };
}
