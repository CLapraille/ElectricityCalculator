import { describe, expect, it } from 'vitest';
import { household, myComfortAug2026OresLux as card } from './fixtures/index.ts';
import { formulaCtHtva, marginalUnitPrice } from './price.ts';

const indices = { BELPEX_M_RLP: household.belpexMRlpOctober2026 };
const tvac2 = (ctHtva: number) => Math.round(ctHtva * 1.06 * 100) / 100;

describe('formule myComfort (unités : indice en €/MWh → c€/kWh HTVA)', () => {
  it('retrouve les 4 prix indicatifs de novembre 2026 de la carte avec un seul indice', () => {
    expect(tvac2(formulaCtHtva(card.energy.single!, indices))).toBe(15.96);
    expect(tvac2(formulaCtHtva(card.energy.peak!, indices))).toBe(17.33);
    expect(tvac2(formulaCtHtva(card.energy.offPeak!, indices))).toBe(14.78);
    expect(tvac2(formulaCtHtva(card.energy.exclusiveNight!, indices))).toBe(15.32);
  });
});

describe('montants TVAC de la carte ↔ HTVA des factures', () => {
  it('redevance fixe : 84,91 HTVA = 90,00 TVAC', () => {
    expect(tvac2(card.annual.find((f) => f.key === 'supplierFee')!.eurHtva)).toBe(90);
  });
  it('tarif prosumer : 80,9813 HTVA (facture) = 85,84 TVAC (carte)', () => {
    expect(tvac2(card.annual.find((f) => f.key === 'prosumer')!.eurHtva)).toBe(85.84);
  });
  it('mesure et comptage : 14,10 TVAC = 0,0364 €/jour HTVA (facture)', () => {
    const perDay = card.annual.find((f) => f.key === 'metering')!.eurHtva / 365;
    expect(perDay.toFixed(4)).toBe('0.0364');
  });
});

describe('coût marginal d’un kWh (règle A)', () => {
  const p = marginalUnitPrice(card, indices);

  it('additionne énergie, verte, réseau et taxes, chacune avec sa TVA', () => {
    expect(p.lines.map((l) => l.key)).toEqual([
      'energy',
      'green',
      'distribution',
      'transport',
      'excise',
      'energyContribution',
      'connectionFee',
    ]);
    expect(p.lines.find((l) => l.key === 'connectionFee')!.vatRate).toBe(0);
    expect(p.ctTvac).toBeCloseTo(39.135, 2);
  });

  it('n’inclut aucun frais fixe', () => {
    expect(p.lines.some((l) => ['supplierFee', 'metering', 'prosumer'].includes(l.key))).toBe(false);
  });

  it('+10 €/MWh sur l’indice ajoute ≈ 1,16 c€/kWh TVAC', () => {
    const q = marginalUnitPrice(card, { BELPEX_M_RLP: indices.BELPEX_M_RLP + 10 });
    expect(q.ctTvac - p.ctTvac).toBeCloseTo(1.1628, 4);
  });

  it('refuse un registre sans formule', () => {
    expect(() => marginalUnitPrice({ ...card, energy: {} }, indices)).toThrow(/registre single/);
  });
});
