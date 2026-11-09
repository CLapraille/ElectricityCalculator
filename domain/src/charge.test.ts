import { expect, it } from 'vitest';
import { chargeCost } from './charge.ts';
import { household, myComfortAug2026OresLux as card } from './fixtures/index.ts';
import { marginalUnitPrice } from './price.ts';

const price = marginalUnitPrice(card, { BELPEX_M_RLP: household.belpexMRlpOctober2026 });

it('recharge de 20 kWh : 7,83 € TVAC, ligne par ligne', () => {
  const c = chargeCost(20, price);
  expect(c.lines.map((l) => [l.key, l.htvaCents])).toEqual([
    ['energy', 301],
    ['green', 62],
    ['distribution', 226],
    ['transport', 52],
    ['excise', 92],
    ['energyContribution', 4],
    ['connectionFee', 2],
  ]);
  expect(c.vat).toEqual([
    { rate: 0.06, baseCents: 737, vatCents: 44 },
    { rate: 0, baseCents: 2, vatCents: 0 },
  ]);
  expect(c.tvacCents).toBe(783);
});

it('recharges de 40 et 60 kWh', () => {
  expect(chargeCost(40, price).tvacCents).toBe(1565);
  expect(chargeCost(60, price).tvacCents).toBe(2348);
});

it('accepte les kWh décimaux de la borne et refuse une quantité invalide', () => {
  expect(chargeCost(12.345, price).tvacCents).toBe(483);
  expect(chargeCost(0, price).tvacCents).toBe(0);
  expect(() => chargeCost(-1, price)).toThrow();
  expect(() => chargeCost(Number.NaN, price)).toThrow();
});
