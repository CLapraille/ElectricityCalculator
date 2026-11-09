import { expect, it } from 'vitest';
import { lineCents, roundCents, toCents } from './money.ts';

it('arrondit au centime sans erreur de flottant', () => {
  expect(toCents(51.8)).toBe(5180);
  expect(lineCents(20, 15.0566)).toBe(301);
  expect(roundCents(1.5)).toBe(2);
  expect(roundCents(0.1 + 0.2 + 1.2)).toBe(2);
});
