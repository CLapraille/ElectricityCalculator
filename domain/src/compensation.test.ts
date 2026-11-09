import { describe, expect, it } from 'vitest';
import { billableCarKwh, settleCompensation } from './compensation.ts';

describe('kWh de recharge facturés avec compensation annuelle', () => {
  it('foyer en surplus de 913 kWh, voiture 2 700 kWh : 1 787 facturés, 913 gratuits', () => {
    expect(billableCarKwh(-913 + 2700, 2700)).toBe(1787);
  });
  it('surplus plus grand que les recharges : rien de facturé', () => {
    expect(billableCarKwh(-1765 + 500, 500)).toBe(0);
  });
  it('foyer déjà consommateur net : tout est facturé', () => {
    expect(billableCarKwh(300 + 2700, 2700)).toBe(2700);
  });
});

describe('bilan à la régularisation', () => {
  it('rend la part des provisions correspondant aux kWh couverts par le surplus', () => {
    const s = settleCompensation({ netWithCarKwh: 1787, carKwh: 2700, provisionedCents: 105_660 });
    expect(s).toEqual({
      carKwh: 2700,
      billableKwh: 1787,
      freeKwh: 913,
      provisionedCents: 105_660,
      carShareCents: 69_931,
      refundCents: 35_729,
    });
  });
  it('sans recharge, rien à rendre', () => {
    expect(settleCompensation({ netWithCarKwh: -900, carKwh: 0, provisionedCents: 0 }).refundCents).toBe(0);
  });
});
