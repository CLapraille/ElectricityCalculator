import type { IsoDate } from './dates.ts';

/** Taux de TVA (0,06 = 6 %). */
export type VatRate = number;

/** Registre de comptage : simple (mono), bihoraire heures pleines / creuses, exclusif nuit. */
export type MeterRegister = 'single' | 'peak' | 'offPeak' | 'exclusiveNight';

/**
 * Indices de marché mensuels en €/MWh.
 * - `BELPEX_M_RLP` : moyenne des prix Day-Ahead baseload journaliers du mois, pondérée par le profil RLP Synergrid
 *   (sert au prix de la consommation).
 * - `BELPEX_M` : moyenne simple des prix baseload journaliers du mois (sert à la compensation d'injection).
 */
export interface Indices {
  BELPEX_M_RLP: number;
  BELPEX_M?: number;
}

/** Formule fournisseur : prix HTVA en c€/kWh = coef × indice (€/MWh) + addCt. */
export interface LinearFormula {
  coef: number;
  addCt: number;
  index: keyof Indices;
}

export type ComponentCategory = 'energy' | 'green' | 'network' | 'tax';

/** Composante payée par kWh prélevé (hors prix de l'énergie), en c€/kWh HTVA. */
export interface PerKwhComponent {
  key: string;
  label: string;
  category: ComponentCategory;
  /** Un seul prix, ou un prix par registre (ex. distribution bihoraire). */
  ctHtva: number | Partial<Record<MeterRegister, number>>;
  vatRate: VatRate;
  /** D'où vient le chiffre (carte, facture, CWaPE) : on ne l'invente jamais. */
  source: string;
}

/** Frais annuel fixe, indépendant des kWh consommés. */
export interface AnnualFee {
  key: string;
  label: string;
  /** € HTVA par an, ou par kVA d'onduleur et par an si `perKva`. */
  eurHtva: number;
  vatRate: VatRate;
  perKva?: boolean;
  /** `compensation` : dû seulement tant que le compteur « tourne à l'envers » (tarif prosumer). */
  onlyWith?: 'compensation';
  source: string;
}

/**
 * Carte tarifaire d'un produit, pour une région et un gestionnaire de réseau, sur une période de validité.
 * Tous les montants sont **HTVA** : les cartes publient souvent des montants TVAC arrondis, qu'on convertit
 * (voir `htvaFromTvac`) ou qu'on remplace par la valeur exacte d'une facture quand on l'a.
 */
export interface TariffCard {
  id: string;
  supplier: string;
  product: string;
  region: 'WAL';
  dso: string;
  /** Mois de la carte (ex. `2026-08-01` pour « août 2026 »). */
  cardMonth: IsoDate;
  /** Période de fourniture couverte, bornes incluses. */
  validFrom: IsoDate;
  validTo: IsoDate;
  energy: Partial<Record<MeterRegister, LinearFormula>>;
  energyVatRate: VatRate;
  /** Compensation d'injection (rétrocession), sans compteur qui tourne à l'envers. */
  injection?: LinearFormula & { vatRate: VatRate };
  perKwh: PerKwhComponent[];
  annual: AnnualFee[];
}

/** Convertit un montant TVAC publié en HTVA, sans arrondi (l'arrondi d'origine reste une incertitude). */
export const htvaFromTvac = (tvac: number, vatRate: VatRate): number => tvac / (1 + vatRate);

export const cardCovers = (card: TariffCard, day: IsoDate): boolean =>
  card.validFrom <= day && day <= card.validTo;

/** La carte applicable à un jour donné ; erreur si aucune ou plusieurs (jamais de choix silencieux). */
export function cardFor(cards: readonly TariffCard[], day: IsoDate): TariffCard {
  const found = cards.filter((c) => cardCovers(c, day));
  if (found.length !== 1) {
    throw new Error(`${found.length} carte(s) tarifaire(s) pour le ${day} : il en faut exactement une`);
  }
  return found[0]!;
}

export function componentCt(c: PerKwhComponent, register: MeterRegister): number {
  if (typeof c.ctHtva === 'number') return c.ctHtva;
  const v = c.ctHtva[register];
  if (v === undefined) throw new Error(`« ${c.label} » n'a pas de prix pour le registre ${register}`);
  return v;
}
