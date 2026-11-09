import type { IsoDate } from './dates.ts';

/** Un prix Day-Ahead de la zone belge (série Elia / EPEX), sur un pas de temps (15 min depuis le 1/10/2025). */
export interface PricePoint {
  /** Début du pas, ISO 8601 avec fuseau (`2026-11-08T23:00:00Z` ou `2026-11-09T00:00:00+01:00`). */
  start: string;
  eurPerMwh: number;
  /** Durée du pas en minutes (15 par défaut). */
  minutes?: number;
}

const brusselsDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Brussels',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Jour civil à Bruxelles d'un instant : le jour de livraison va de 00:00 à 24:00 heure belge. */
export const deliveryDay = (instant: string): IsoDate => brusselsDay.format(new Date(instant));

/**
 * Prix baseload de chaque jour de livraison : moyenne des prix du jour pondérée par la durée des pas
 * (92 ou 100 quarts d'heure les jours de changement d'heure).
 */
export function dailyBaseload(points: readonly PricePoint[]): Map<IsoDate, number> {
  const acc = new Map<IsoDate, { sum: number; minutes: number }>();
  for (const p of points) {
    const day = deliveryDay(p.start);
    const m = p.minutes ?? 15;
    const a = acc.get(day) ?? { sum: 0, minutes: 0 };
    a.sum += p.eurPerMwh * m;
    a.minutes += m;
    acc.set(day, a);
  }
  return new Map([...acc].sort(([a], [b]) => a.localeCompare(b)).map(([d, a]) => [d, a.sum / a.minutes]));
}

export interface MonthlyIndex {
  /** `yyyy-mm` */
  month: string;
  /** €/MWh */
  value: number;
  /** Pondéré par le profil RLP (sinon moyenne simple : c'est alors BELPEX_M, ou une approximation de BELPEX_M_RLP). */
  weighted: boolean;
  /** Jours du mois sans prix (ou sans poids RLP) : l'indice n'est définitif que si la liste est vide. */
  missingDays: IsoDate[];
}

const daysOfMonth = (month: string): IsoDate[] => {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
};

/**
 * Indice mensuel à partir des prix baseload journaliers.
 * - Sans `rlpDailyWeights` : moyenne simple = BELPEX_M.
 * - Avec : moyenne pondérée par le volume RLP de chaque jour (somme des quarts d'heure du profil) = BELPEX_M_RLP,
 *   selon la définition de la carte TotalEnergies (« moyenne pondérée des cotations journalières Day Ahead
 *   Baseload par le profil RLP durant le mois de fourniture »).
 */
export function monthlyIndex(
  daily: ReadonlyMap<IsoDate, number>,
  month: string,
  rlpDailyWeights?: ReadonlyMap<IsoDate, number>,
): MonthlyIndex {
  const missingDays: IsoDate[] = [];
  let sum = 0;
  let weights = 0;
  for (const day of daysOfMonth(month)) {
    const price = daily.get(day);
    const w = rlpDailyWeights ? rlpDailyWeights.get(day) : 1;
    if (price === undefined || w === undefined) {
      missingDays.push(day);
      continue;
    }
    sum += price * w;
    weights += w;
  }
  if (weights === 0) throw new Error(`Aucun prix pour ${month}`);
  return { month, value: sum / weights, weighted: rlpDailyWeights !== undefined, missingDays };
}
