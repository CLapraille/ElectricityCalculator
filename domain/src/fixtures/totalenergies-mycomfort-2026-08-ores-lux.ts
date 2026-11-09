import { htvaFromTvac, type TariffCard } from '../tariff.ts';

const VAT = 0.06;
const CARD =
  'Carte TotalEnergies myComfort Variable Wallonie, août 2026 (montants TVAC 6 %, arrondis à 0,01)';

/**
 * TotalEnergies myComfort Variable, Wallonie, ORES Luxembourg, carte d'août 2026,
 * contrat du 01/11/2026 au 31/10/2027.
 *
 * La carte publie des montants **TVAC** (« TVA 6 % incluse ») ; seules les formules d'énergie sont HTVA.
 * Les montants par kWh sont donc reconvertis en HTVA (incertitude d'arrondi < 0,005 c€/kWh), sauf quand une
 * facture donne la valeur exacte.
 */
export const myComfortAug2026OresLux: TariffCard = {
  id: 'totalenergies-mycomfort-variable-2026-08-ores-lux',
  supplier: 'TotalEnergies',
  product: 'myComfort Variable',
  region: 'WAL',
  dso: 'ORES (Luxembourg)',
  cardMonth: '2026-08-01',
  validFrom: '2026-11-01',
  validTo: '2027-10-31',
  energy: {
    single: { coef: 0.1097, addCt: 2.5, index: 'BELPEX_M_RLP' },
    peak: { coef: 0.121, addCt: 2.5, index: 'BELPEX_M_RLP' },
    offPeak: { coef: 0.1, addCt: 2.5, index: 'BELPEX_M_RLP' },
    exclusiveNight: { coef: 0.1053, addCt: 2.4, index: 'BELPEX_M_RLP' },
  },
  energyVatRate: VAT,
  // Taux de TVA de l'injection non précisé par la carte : 0 % supposé (particulier non assujetti), à vérifier.
  injection: { coef: 0.0235, addCt: -0.625, index: 'BELPEX_M', vatRate: 0 },
  perKwh: [
    {
      key: 'green',
      label: 'Contribution énergie verte Wallonie',
      category: 'green',
      ctHtva: htvaFromTvac(3.3, VAT),
      vatRate: VAT,
      source: CARD,
    },
    {
      key: 'distribution',
      label: 'Distribution ORES Luxembourg',
      category: 'network',
      ctHtva: {
        single: htvaFromTvac(11.98, VAT),
        peak: htvaFromTvac(13.27, VAT),
        offPeak: htvaFromTvac(7.39, VAT),
        exclusiveNight: htvaFromTvac(7.39, VAT),
      },
      vatRate: VAT,
      source: CARD,
    },
    {
      key: 'transport',
      label: 'Transport Elia',
      category: 'network',
      ctHtva: htvaFromTvac(2.74, VAT),
      vatRate: VAT,
      source: CARD,
    },
    {
      key: 'excise',
      label: 'Accise fédérale (0 à 20 000 kWh)',
      category: 'tax',
      ctHtva: htvaFromTvac(4.88, VAT),
      vatRate: VAT,
      source: CARD,
    },
    {
      key: 'energyContribution',
      label: "Cotisation sur l'énergie",
      category: 'tax',
      ctHtva: htvaFromTvac(0.2, VAT),
      vatRate: VAT,
      source: CARD,
    },
    // Facture : 0,0750 c€/kWh dans la colonne « TVA 0 % » ; la carte affiche 0,07.
    {
      key: 'connectionFee',
      label: 'Redevance de raccordement',
      category: 'tax',
      ctHtva: 0.075,
      vatRate: 0,
      source: 'Factures de régularisation 2025 et 2026',
    },
  ],
  annual: [
    // 84,91 € HTVA (détail du produit) = 90,00 € TVAC (carte).
    {
      key: 'supplierFee',
      label: 'Redevance fixe TotalEnergies',
      eurHtva: 84.91,
      vatRate: VAT,
      source: 'Détail du produit myComfort 2026-2027',
    },
    {
      key: 'metering',
      label: 'Activité de mesure et comptage ORES',
      eurHtva: htvaFromTvac(14.1, VAT),
      vatRate: VAT,
      source: CARD,
    },
    // 85,84 €/kVA/an TVAC sur la carte ; 80,9813 € HTVA sur la facture 2026.
    {
      key: 'prosumer',
      label: 'Tarif prosumer ORES Luxembourg',
      eurHtva: 80.9813,
      vatRate: VAT,
      perKva: true,
      onlyWith: 'compensation',
      source: 'Facture de régularisation 2026',
    },
  ],
};
