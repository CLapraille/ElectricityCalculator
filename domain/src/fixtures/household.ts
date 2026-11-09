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
  /** Indice BELPEX_M_RLP déduit du prix indicatif de novembre 2026 de la carte (15,96 c€ TVAC en simple). */
  belpexMRlpOctober2026: 114.46,
} as const;
