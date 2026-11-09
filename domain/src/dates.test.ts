import { expect, it } from 'vitest';
import { addDays, addMonths, daysBetween, endOfMonth } from './dates.ts';

it('calcule les échéances au calendrier', () => {
  expect(addDays('2026-10-13', 5)).toBe('2026-10-18');
  expect(addMonths('2026-06-08', 24)).toBe('2028-06-08');
  expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
  expect(addMonths('2028-02-29', 12)).toBe('2029-02-28');
  expect(endOfMonth('2026-06-08')).toBe('2026-06-30');
  expect(daysBetween('2025-10-31', '2026-09-04')).toBe(308);
});
