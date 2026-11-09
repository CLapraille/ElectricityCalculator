/**
 * Chiffres réels du foyer, tirés des factures de régularisation (sans aucun identifiant : dépôt public).
 * Le compteur bihoraire « tourne à l'envers » et est traité administrativement en monohoraire.
 * Les index ne donnent que le **solde net** (prélèvement − injection), pas les deux flux séparément.
 */
export const household = {
  inverterKwe: 5.5,
  compensationUntil: '2030-12-31',
  regularisations: [
    {
      from: '2024-08-20',
      to: '2025-08-31',
      days: 377,
      peakDeltaKwh: -2327,
      offPeakDeltaKwh: 562,
      netKwh: -1765,
    },
    {
      from: '2025-09-01',
      to: '2026-09-13',
      days: 378,
      peakDeltaKwh: 111,
      offPeakDeltaKwh: -1024,
      netKwh: -913,
    },
  ],
  /**
   * Production solaire mensuelle (kWh), rapport journalier de l'onduleur du 01/09/2025 au 30/08/2026.
   * Total 7 009 kWh sur 364 jours.
   */
  monthlyProductionKwh: {
    '2025-09': 547.7,
    '2025-10': 328.1,
    '2025-11': 206.0,
    '2025-12': 155.4,
    '2026-01': 86.1,
    '2026-02': 209.2,
    '2026-03': 670.6,
    '2026-04': 917.6,
    '2026-05': 930.0,
    '2026-06': 980.8,
    '2026-07': 1136.1,
    '2026-08': 841.4,
  },
  /** Indice BELPEX_M_RLP déduit du prix indicatif de novembre 2026 de la carte (15,96 c€ TVAC en simple). */
  belpexMRlpOctober2026: 114.46,
} as const;
