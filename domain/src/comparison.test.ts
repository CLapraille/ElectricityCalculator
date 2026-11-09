import { describe, expect, it } from 'vitest';
import { annualBill, compareContracts, scenarioBillableCarKwh, type YearScenario } from './comparison.ts';
import { household, myComfortAug2026OresLux as card } from './fixtures/index.ts';
import type { TariffCard } from './tariff.ts';

// Les factures ne donnent que le solde net (−913 kWh) : avec compensation, cela suffit.
const base: YearScenario = {
  offtakeKwh: 0,
  injectionKwh: 913,
  carKwh: 2700,
  compensation: true,
  inverterKva: household.inverterKwe,
  indices: { BELPEX_M_RLP: household.belpexMRlpOctober2026, BELPEX_M: 104.5 },
};

describe('facture annuelle estimée', () => {
  it('sans voiture et en surplus : uniquement des frais fixes', () => {
    const b = annualBill(card, { ...base, carKwh: 0 });
    expect(b.billableKwh).toBe(0);
    expect(b.variable.tvacCents).toBe(0);
    expect(b.fixed.map((f) => f.key)).toEqual(['supplierFee', 'metering', 'prosumer']);
    // 90,00 + 14,10 + 5,5 × 85,84 ≈ 576 € TVAC
    expect(b.totalTvacCents).toBe(57_622);
  });

  it('avec la voiture : seuls les kWh au-delà du surplus s’ajoutent', () => {
    const b = annualBill(card, base);
    expect(b.billableKwh).toBe(1787);
    expect(scenarioBillableCarKwh(base)).toBe(1787);
  });

  it('sans compensation : plus de tarif prosumer, injection rémunérée', () => {
    const b = annualBill(card, { ...base, compensation: false, offtakeKwh: 1500, injectionKwh: 2400 });
    expect(b.fixed.some((f) => f.key === 'prosumer')).toBe(false);
    expect(b.billableKwh).toBe(4200);
    // 2 400 kWh × (0,0235 × 104,5 − 0,625) c€ = 43,94 €
    expect(b.injectionCreditCents).toBe(4394);
  });
});

describe('comparaison de contrats', () => {
  const cheaperEnergy: TariffCard = {
    ...card,
    id: 'fictif-moins-cher',
    supplier: 'Fournisseur fictif',
    product: 'Test',
    energy: { single: { coef: 0.1, addCt: 1.5, index: 'BELPEX_M_RLP' } },
    annual: card.annual.map((f) => (f.key === 'supplierFee' ? { ...f, eurHtva: 120 } : f)),
  };

  it('classe les contrats et isole le coût marginal de la voiture', () => {
    const rows = compareContracts([card, cheaperEnergy], base);
    expect(rows.map((r) => r.cardId)).toEqual(['fictif-moins-cher', card.id]);
    const mc = rows.find((r) => r.cardId === card.id)!;
    // Les frais fixes s'annulent : marginal = 1 787 kWh au prix variable complet (≈ 39,1 c€).
    expect(mc.carMarginalCents).toBe(mc.withCar.variable.tvacCents);
    expect(mc.carMarginalCents).toBe(69_933);
  });

  it('sans voiture, le fournisseur au plus petit abonnement gagne (énergie non facturée)', () => {
    const rows = compareContracts([card, cheaperEnergy], { ...base, carKwh: 0 });
    expect(rows[0]!.cardId).toBe(card.id);
  });
});
