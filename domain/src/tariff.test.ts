import { expect, it } from 'vitest';
import { myComfortAug2026OresLux as card } from './fixtures/index.ts';
import { cardFor } from './tariff.ts';

it('choisit la carte du jour de recharge et refuse les trous ou chevauchements', () => {
  expect(cardFor([card], '2027-02-15').id).toBe(card.id);
  expect(() => cardFor([card], '2026-10-31')).toThrow(/0 carte/);
  expect(() => cardFor([card, { ...card, id: 'doublon' }], '2027-02-15')).toThrow(/2 carte/);
});
