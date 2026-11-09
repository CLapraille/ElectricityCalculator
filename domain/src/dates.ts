/** Date civile au format ISO `yyyy-mm-dd` ; l'ordre alphabétique est l'ordre chronologique. */
export type IsoDate = string;

const parse = (d: IsoDate) => new Date(`${d}T00:00:00Z`);
const format = (x: Date): IsoDate => x.toISOString().slice(0, 10);

export function addDays(d: IsoDate, n: number): IsoDate {
  const x = parse(d);
  x.setUTCDate(x.getUTCDate() + n);
  return format(x);
}

/** Ajoute des mois en restant sur le dernier jour du mois si le jour n'existe pas (31/01 + 1 mois = 28/02). */
export function addMonths(d: IsoDate, n: number): IsoDate {
  const x = parse(d);
  const day = x.getUTCDate();
  const target = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + n, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return format(target);
}

export function endOfMonth(d: IsoDate): IsoDate {
  const x = parse(d);
  return format(new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)));
}

export const daysBetween = (from: IsoDate, to: IsoDate): number =>
  Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
