import { chargeCost, type ChargeCost } from './charge.ts';
import { billableCarKwh } from './compensation.ts';
import { roundCents, type Cents } from './money.ts';
import { formulaCtHtva, marginalUnitPrice } from './price.ts';
import type { Indices, MeterRegister, TariffCard } from './tariff.ts';

/** Une année type du foyer, pour estimer une facture annuelle et comparer des contrats. */
export interface YearScenario {
  /** Prélèvement réseau hors voiture (kWh). */
  offtakeKwh: number;
  /** Injection réseau (kWh). */
  injectionKwh: number;
  /** Recharges de la voiture, mesurées par la borne (kWh), prises au réseau. */
  carKwh: number;
  /** Compteur qui tourne à l'envers (jusqu'à fin 2030 pour une installation d'avant 2024). */
  compensation: boolean;
  /** Puissance de l'onduleur (kVA / kWe) pour le tarif prosumer. */
  inverterKva: number;
  /** Indices moyens de l'année (€/MWh). */
  indices: Indices;
  register?: MeterRegister;
}

export interface FeeLine {
  key: string;
  label: string;
  htvaCents: Cents;
  vatCents: Cents;
}

export interface AnnualBill {
  cardId: string;
  fixed: FeeLine[];
  fixedTvacCents: Cents;
  billableKwh: number;
  variable: ChargeCost;
  /** Compensation d'injection (sans compteur qui tourne à l'envers), déduite. */
  injectionCreditCents: Cents;
  totalTvacCents: Cents;
}

export function annualBill(card: TariffCard, s: YearScenario): AnnualBill {
  const fixed = card.annual
    .filter((f) => f.onlyWith !== 'compensation' || s.compensation)
    .map((f) => {
      const htvaCents = roundCents((f.perKva ? f.eurHtva * s.inverterKva : f.eurHtva) * 100);
      return { key: f.key, label: f.label, htvaCents, vatCents: roundCents(htvaCents * f.vatRate) };
    });
  const fixedTvacCents = fixed.reduce((t, f) => t + f.htvaCents + f.vatCents, 0);

  const gross = s.offtakeKwh + s.carKwh;
  const billableKwh = s.compensation ? Math.max(0, gross - s.injectionKwh) : gross;
  const variable = chargeCost(billableKwh, marginalUnitPrice(card, s.indices, s.register ?? 'single'));

  let injectionCreditCents = 0;
  if (!s.compensation && s.injectionKwh > 0) {
    if (!card.injection) throw new Error(`${card.id} : pas de prix d'injection`);
    const ht = roundCents(s.injectionKwh * formulaCtHtva(card.injection, s.indices));
    injectionCreditCents = ht + roundCents(ht * card.injection.vatRate);
  }
  return {
    cardId: card.id,
    fixed,
    fixedTvacCents,
    billableKwh,
    variable,
    injectionCreditCents,
    totalTvacCents: fixedTvacCents + variable.tvacCents - injectionCreditCents,
  };
}

export interface ContractComparison {
  cardId: string;
  supplier: string;
  product: string;
  withCar: AnnualBill;
  withoutCar: AnnualBill;
  /** Ce que la voiture ajoute à la facture annuelle avec ce contrat (règle A). */
  carMarginalCents: Cents;
}

/** Facture annuelle estimée avec chaque contrat, du moins cher au plus cher (avec la voiture). */
export function compareContracts(cards: readonly TariffCard[], s: YearScenario): ContractComparison[] {
  return cards
    .map((card) => {
      const withCar = annualBill(card, s);
      const withoutCar = annualBill(card, { ...s, carKwh: 0 });
      return {
        cardId: card.id,
        supplier: card.supplier,
        product: card.product,
        withCar,
        withoutCar,
        carMarginalCents: withCar.totalTvacCents - withoutCar.totalTvacCents,
      };
    })
    .sort((a, b) => a.withCar.totalTvacCents - b.withCar.totalTvacCents);
}

/** kWh de recharge facturés dans un scénario avec compensation (le reste est couvert par le surplus). */
export const scenarioBillableCarKwh = (s: YearScenario): number =>
  s.compensation ? billableCarKwh(s.offtakeKwh + s.carKwh - s.injectionKwh, s.carKwh) : s.carKwh;
