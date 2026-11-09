import {
  componentCt,
  type ComponentCategory,
  type Indices,
  type LinearFormula,
  type MeterRegister,
  type TariffCard,
  type VatRate,
} from './tariff.ts';

export function formulaCtHtva(f: LinearFormula, indices: Indices): number {
  const index = indices[f.index];
  if (index === undefined) throw new Error(`Indice ${f.index} inconnu`);
  return f.coef * index + f.addCt;
}

export interface PriceLine {
  key: string;
  label: string;
  category: ComponentCategory;
  ctHtva: number;
  vatRate: VatRate;
  ctTvac: number;
}

/** Prix d'un kWh supplémentaire prélevé, composante par composante (non arrondi). */
export interface UnitPrice {
  cardId: string;
  register: MeterRegister;
  indices: Indices;
  lines: PriceLine[];
  ctHtva: number;
  ctTvac: number;
}

/**
 * Coût marginal d'un kWh prélevé au réseau : énergie (formule × indice) + toutes les composantes par kWh,
 * chacune avec son propre taux de TVA. Les frais annuels fixes n'en font pas partie (règle A, coût marginal).
 */
export function marginalUnitPrice(
  card: TariffCard,
  indices: Indices,
  register: MeterRegister = 'single',
): UnitPrice {
  const formula = card.energy[register];
  if (!formula) throw new Error(`${card.id} : pas de formule d'énergie pour le registre ${register}`);
  const line = (
    key: string,
    label: string,
    category: ComponentCategory,
    ctHtva: number,
    vatRate: VatRate,
  ): PriceLine => ({
    key,
    label,
    category,
    ctHtva,
    vatRate,
    ctTvac: ctHtva * (1 + vatRate),
  });
  const lines = [
    line(
      'energy',
      `Énergie (${formula.coef} × ${formula.index} + ${formula.addCt})`,
      'energy',
      formulaCtHtva(formula, indices),
      card.energyVatRate,
    ),
    ...card.perKwh.map((c) => line(c.key, c.label, c.category, componentCt(c, register), c.vatRate)),
  ];
  return {
    cardId: card.id,
    register,
    indices,
    lines,
    ctHtva: lines.reduce((s, l) => s + l.ctHtva, 0),
    ctTvac: lines.reduce((s, l) => s + l.ctTvac, 0),
  };
}
