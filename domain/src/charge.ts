import { lineCents, roundCents, type Cents } from './money.ts';
import type { PriceLine, UnitPrice } from './price.ts';
import type { VatRate } from './tariff.ts';

export interface ChargeLine extends PriceLine {
  htvaCents: Cents;
}

export interface VatLine {
  rate: VatRate;
  baseCents: Cents;
  vatCents: Cents;
}

export interface ChargeCost {
  kwh: number;
  lines: ChargeLine[];
  htvaCents: Cents;
  vat: VatLine[];
  tvacCents: Cents;
}

/**
 * Coût d'une quantité prélevée (une recharge) comme sur une facture : chaque ligne HTVA arrondie au centime,
 * puis la TVA calculée par taux sur la somme des lignes de ce taux, arrondie au centime.
 * `kwh` = énergie mesurée par la borne (pertes de charge du véhicule déjà incluses).
 */
export function chargeCost(kwh: number, price: UnitPrice): ChargeCost {
  if (!(kwh >= 0)) throw new Error(`Quantité invalide : ${kwh} kWh`);
  const lines = price.lines.map((l) => ({ ...l, htvaCents: lineCents(kwh, l.ctHtva) }));
  const rates = [...new Set(lines.map((l) => l.vatRate))].sort((a, b) => b - a);
  const vat = rates.map((rate) => {
    const baseCents = lines.filter((l) => l.vatRate === rate).reduce((s, l) => s + l.htvaCents, 0);
    return { rate, baseCents, vatCents: roundCents(baseCents * rate) };
  });
  const htvaCents = lines.reduce((s, l) => s + l.htvaCents, 0);
  return { kwh, lines, htvaCents, vat, tvacCents: htvaCents + vat.reduce((s, v) => s + v.vatCents, 0) };
}
