import { describe, expect, it } from 'vitest';
import { dailyBaseload, deliveryDay, monthlyIndex, type PricePoint } from './belpex.ts';

/** Quarts d'heure d'un jour de livraison belge, à partir de minuit heure belge exprimé en UTC. */
const day = (utcMidnight: string, count: number, price: (i: number) => number): PricePoint[] =>
  Array.from({ length: count }, (_, i) => ({
    start: new Date(Date.parse(utcMidnight) + i * 900_000).toISOString(),
    eurPerMwh: price(i),
  }));

describe('jour de livraison', () => {
  it('suit l’heure belge, pas l’UTC', () => {
    expect(deliveryDay('2026-11-08T23:00:00Z')).toBe('2026-11-09');
    expect(deliveryDay('2026-07-08T22:00:00Z')).toBe('2026-07-09');
    expect(deliveryDay('2026-11-09T00:00:00+01:00')).toBe('2026-11-09');
  });
});

describe('prix baseload journalier', () => {
  it('moyenne des 96 quarts d’heure', () => {
    const d = dailyBaseload(day('2026-11-08T23:00:00Z', 96, (i) => (i < 48 ? 60 : 140)));
    expect([...d]).toEqual([['2026-11-09', 100]]);
  });

  it('jours de changement d’heure : 92 et 100 quarts d’heure', () => {
    const spring = dailyBaseload(day('2026-03-28T23:00:00Z', 92, () => 80));
    const autumn = dailyBaseload(day('2026-10-24T22:00:00Z', 100, () => 90));
    expect(spring.get('2026-03-29')).toBe(80);
    expect(autumn.get('2026-10-25')).toBe(90);
    expect(spring.size + autumn.size).toBe(2);
  });

  it('pondère par la durée si des pas horaires se mêlent aux quarts d’heure', () => {
    const d = dailyBaseload([
      { start: '2026-11-08T23:00:00Z', eurPerMwh: 100, minutes: 60 },
      { start: '2026-11-09T00:00:00Z', eurPerMwh: 40, minutes: 15 },
    ]);
    expect(d.get('2026-11-09')).toBeCloseTo(88, 9);
  });
});

describe('indice mensuel', () => {
  const daily = new Map(
    Array.from({ length: 30 }, (_, i) => [`2026-11-${String(i + 1).padStart(2, '0')}`, i < 15 ? 100 : 130]),
  );

  it('BELPEX_M : moyenne simple des jours', () => {
    const m = monthlyIndex(daily, '2026-11');
    expect(m).toEqual({ month: '2026-11', value: 115, weighted: false, missingDays: [] });
  });

  it('BELPEX_M_RLP : pondéré par le volume RLP de chaque jour', () => {
    // Deux fois plus de consommation type pendant la seconde quinzaine (plus froide).
    const rlp = new Map([...daily.keys()].map((d, i) => [d, i < 15 ? 1 : 2]));
    expect(monthlyIndex(daily, '2026-11', rlp).value).toBe(120);
  });

  it('signale les jours manquants (indice provisoire)', () => {
    const partial = new Map([...daily].slice(0, 9));
    const m = monthlyIndex(partial, '2026-11');
    expect(m.value).toBe(100);
    expect(m.missingDays).toHaveLength(21);
    expect(() => monthlyIndex(new Map(), '2026-11')).toThrow();
  });
});
