# Architecture

Décisions : [DECISIONS.md](DECISIONS.md). Modèle repris de HealthMoneyTracker (D7).

## Monorepo (npm workspaces)

| Dossier | Rôle | État |
|---|---|---|
| `domain/` | Règles de calcul pures, sans entrée/sortie, toutes testées. | ✅ v1 |
| `server/` | BFF Fastify + zod : API de la PWA, récupération des prix Elia et des sessions Zaptec, Cosmos. | à faire |
| `web/` | PWA (saisie d'une recharge, montant à mettre de côté, bilan, comparaison de contrats). | à faire |
| `infra/` | Bicep : resource group, budget, identité, conteneur `ec` dans la base `hmt`, Container Apps. | à faire |

### `domain/src`

| Fichier | Rôle |
|---|---|
| `money.ts` | Centimes entiers, arrondi d'une ligne kWh × c€/kWh. |
| `dates.ts` | Dates civiles ISO (repris de HMT). |
| `tariff.ts` | Modèle d'une carte tarifaire datée (formules d'énergie, composantes par kWh avec leur TVA, frais annuels), choix de la carte d'un jour. |
| `price.ts` | Prix marginal d'un kWh, composante par composante (règle A). |
| `charge.ts` | Coût d'une recharge comme sur une facture (lignes HTVA, TVA par taux). |
| `belpex.ts` | Prix quart-horaires → baseload journalier (heure belge, jours de 92/100 quarts d'heure) → BELPEX_M ou BELPEX_M_RLP. |
| `compensation.ts` | kWh de recharge facturés avec compensation annuelle (surplus d'abord) et bilan des provisions à la régularisation. |
| `comparison.ts` | Facture annuelle estimée par carte et coût marginal de la voiture ; classement des contrats. |
| `fixtures/` | Carte myComfort août 2026 ORES Luxembourg ; chiffres annuels du foyer (sans identifiant). |

## Flux prévus

1. **Indice** : chaque jour, le serveur lit les prix quart-horaires Elia (`griddata.elia.be/.../auctionresultsqh/YYYY-MM-DD`),
   les garde, et calcule l'indice du mois écoulé (pondération RLP Synergrid).
2. **Recharge** : saisie (puis API Zaptec) → carte du jour → prix marginal à l'indice du dernier mois connu →
   **montant à virer**. En fin de mois, recalcul à l'indice définitif et ajustement (D13).
3. **Régularisation** : solde net réel → part réellement facturée de la voiture → montant à reprendre du compte séparé.
4. **Comparaison** : scénario annuel du foyer × cartes disponibles → contrat le moins cher et coût de la voiture avec chacun.

## Commandes

```bash
npm install
npm test
npm run typecheck
npm run lint
```
