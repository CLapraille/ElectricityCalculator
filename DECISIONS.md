# ElectricityCalculator — Journal des décisions

Ce fichier garde chaque décision prise afin de ne pas reposer les questions (même format que HealthMoneyTracker).
Statuts : ✅ décidé · ❓ ouvert · 🔎 fait constaté.

## Faits constatés

Sources : carte tarifaire TotalEnergies myComfort Variable Wallonie d'août 2026, détail du produit 2026-2027,
factures de régularisation 2025 et 2026 (non versionnées : dépôt public). Vérifié le 2026-11-09.

- 🔎 **Contrat** : Pixel Variable jusqu'au 31/10/2026, puis **myComfort Variable du 01/11/2026 au 31/10/2027**
  (carte d'août 2026). ORES Luxembourg.
- 🔎 **La carte publie des montants TVAC** (« TVA 6 % incluse ») ; seules les **formules** d'énergie sont HTVA.
  Recoupé : redevance fixe 90,00 TVAC = 84,91 HTVA ; prosumer 85,84 TVAC = 80,9813 HTVA (facture) ;
  mesure et comptage 14,10 TVAC = 0,0364 €/jour HTVA (facture).
- 🔎 **Unités de la formule** : indice en €/MWh, résultat en c€/kWh HTVA. Les 4 prix indicatifs de novembre 2026
  (simple 15,96, HP 17,33, HC 14,78, excl. nuit 15,32 c€ TVAC) se retrouvent tous avec **BELPEX_M_RLP ≈ 114,46 €/MWh**.
- 🔎 **Le prix « 17,48 c€ » du tableau est une estimation prospective** (méthode VNR), pas le prix facturé.
  Le prix définitif utilise l'indice du mois de fourniture, connu à la fin du mois.
- 🔎 **BELPEX_M_RLP** = moyenne des prix Day-Ahead **baseload journaliers** du mois, pondérée par le profil RLP
  (moyenne des RLP de tous les GRD belges, publiés par Synergrid). L'injection utilise **BELPEX_M** (moyenne simple).
- 🔎 **Redevance de raccordement : TVA 0 %**, 0,0750 c€/kWh (facture ; la carte arrondit à 0,07). La TVA se calcule
  donc **par composante**, pas 6 % sur le total.
- 🔎 **Compteur** bihoraire qui tourne à l'envers, traité administrativement en monohoraire. Compensation
  jusqu'au **31/12/2030** (installation d'avant 2024). Onduleur 5,5 kWe.
- 🔎 **Bilan net annuel** (prélèvement − injection) : −1 765 kWh (2024-2025), −913 kWh (2025-2026). Énergie facturée :
  0 kWh. La facture n'est faite que de frais fixes (≈ 563 € TVAC en 2026, dont ≈ 463 € de tarif prosumer).
- 🔎 **Coût marginal d'un kWh** prélevé, indice 114,46 : ≈ **39,1 c€ TVAC** (énergie 15,96 + verte 3,30 + distribution
  11,98 + transport 2,74 + accise 4,88 + cotisation 0,20 + raccordement 0,075). Recharges : 20 kWh = 7,83 € ;
  40 kWh = 15,65 € ; 60 kWh = 23,48 €. +10 €/MWh d'indice = +1,16 c€/kWh.
- 🔎 **Les prix Elia quart-horaires ne sont pas le prix facturé** : myComfort applique un prix unique par mois.
  Les appliquer tels quels à une recharge de nuit sous-provisionnerait d'environ 6 c€/kWh. Ils servent de
  **matière première** pour calculer l'indice (96 quarts d'heure → baseload du jour → indice pondéré RLP).
- 🔎 **Tarif IMPACT** ORES Luxembourg (compteur communicant, dès janvier 2026) : distribution PIC 16,57 · MEDIUM 10,83 ·
  ECO 5,09 c€/kWh TVAC (mono 11,98). Incompatible avec le bihoraire fournisseur.
- 🔎 **Tarif capacitaire** : 0 €/kWh de 2026 à 2029 (compteur communicant actif).
- 🔎 **Réseau** : `griddata.elia.be`, `opendata.elia.be` et `elia.be` sont bloqués depuis l'environnement cloud de
  développement (403 du proxy). Le format exact des réponses Elia reste à relever.

## Décisions

- ✅ **D1 Objectif** : calculer le coût de chaque recharge de la voiture pour **mettre le montant de côté** sur un compte
  séparé et payer la régularisation, sans impacter la part de l'épouse (factures partagées).
- ✅ **D2 Règle de partage A : coût marginal**. La voiture paie uniquement les frais **variables** de ses kWh, TVA comprise.
  Les frais fixes (redevance fournisseur, mesure et comptage, tarif prosumer) restent partagés comme avant.
  Un futur poste capacitaire, causé par la recharge, reviendrait à la voiture (0 € jusqu'en 2029).
- ✅ **D3 Quantité de référence** : les kWh **mesurés par la borne** Zaptec Go 2 (pertes de charge incluses).
- ✅ **D4 Pas d'optimisation horaire** tant que la compensation et myComfort s'appliquent : l'heure de recharge ne change
  pas le prix. Le comparateur d'heures n'a de sens qu'avec un contrat dynamique ou le tarif IMPACT (après 2030).
- ✅ **D5 Cartes tarifaires** = paramètres **datés et sourcés**, jamais de produit codé en dur ; montants stockés HTVA.
- ✅ **D6 Saisie des recharges** : manuelle d'abord, puis automatique via l'API Zaptec Cloud quand la borne sera installée.
- ✅ **D7 Stack** : celle de HealthMoneyTracker (monorepo TypeScript `domain/` · `server/` Fastify + zod · `web/` PWA
  React), même hébergement Azure (Container Apps à zéro réplique, Static Web App, < 5 €/mois). Montants en centimes.
- ✅ **D8 Stockage** : conteneur Cosmos **`ec` dans la base `hmt`** (400 RU/s partagés, palier gratuit déjà plein),
  droits de l'identité limités à ce conteneur.
- ✅ **D9 Surplus solaire** : la voiture en profite **en premier** (sans elle, il serait perdu).
- ✅ **D10 Provision** : chaque recharge est provisionnée au **prix marginal complet** ; la part couverte par le surplus est
  rendue à la régularisation (`settleCompensation`).
- ✅ **D11 Accès** : l'utilisateur seul ; **pas d'accès pour l'épouse**. Toutes les recharges sont pour son compte.
- ✅ **D12 Calendrier** : voiture (Tesla Model Y Standard), borne et **compteur communicant** en place d'ici **février 2027**.
  L'app ne gère donc jamais « voiture + compteur à relevé annuel ».
- ✅ **D13 Indice d'une recharge** (compteur communicant, relevés mensuels réels) : provision à l'indice du **dernier
  mois connu**, puis recalcul à l'indice définitif en fin de mois avec un petit ajustement.
- ✅ **D14 Avancement** : construire dès maintenant le domaine en **mode compensation annuelle** (hypothèse la plus
  probable), testé sur les chiffres réels ; ajuster selon les réponses d'ORES et TotalEnergies.
- ✅ **D15 Comparaison de contrats** : estimer la facture annuelle avec chaque carte (fournisseurs et produits) et le
  coût marginal de la voiture avec chacune, pour décider d'un changement de contrat ou de fournisseur.
  Seuls l'énergie, la contribution verte et la redevance fixe diffèrent entre fournisseurs ; réseau, taxes et prosumer
  sont régulés et identiques.
- ✅ **D16 Arrondis** : chaque ligne HTVA (kWh × c€/kWh) arrondie au centime, puis TVA par taux sur la somme des lignes
  de ce taux, comme sur les factures. Prix unitaires non arrondis (❓ Q5).
- ✅ **D17 Volume de recharge** : **≈ 5 000 kWh/an** à la borne pour ≈ 35 000 km/an (chiffre de l'utilisateur,
  ≈ 14,3 kWh/100 km pertes comprises). Avec le surplus 2025-2026 (913 kWh) : ≈ 4 087 kWh facturés, provision
  ≈ 1 957 €/an (≈ 163 €/mois), part réelle ≈ 1 600 €, ≈ 357 € à reprendre à la régularisation (indice 114,46).
  Les recharges hors domicile (Superchargeurs) ne sont pas comptées : seule la borne compte (D3).

## Questions ouvertes

À poser à **ORES** :
- ❓ **Q1** La compensation reste-t-elle **annuelle** avec le compteur communicant (prélèvement et injection mesurés
  séparément), jusqu'au 31/12/2030 ?
- ❓ **Q2** Le **tarif IMPACT** est-il compatible avec la compensation ? Le tarif prosumer peut-il devenir proportionnel aux
  prélèvements réels (défavorable avec une voiture) et, si oui, est-ce un choix ou automatique ?

À poser à **TotalEnergies** :
- ❓ **Q3** myComfort est réservé aux « compteurs à relevé annuel » : que devient le contrat quand la fonction
  communicante est activée (changement de produit, facturation mensuelle) ?
- ❓ **Q4** Avec compteur communicant **et** compensation, quel indice mensuel s'applique au solde net annuel ?
- ❓ **Q5** Les prix unitaires (énergie) sont-ils arrondis avant multiplication (4 décimales comme sur la facture) ?
- ❓ **Q6** Taux de TVA appliqué à la compensation d'injection.

Techniques :
- ❓ **Q7** Format des réponses `griddata.elia.be` (champs `dateTime`, `price`, fuseau) et équivalence avec le Belgian
  Reference Price / Belpex : à vérifier sur quelques jours dès que l'app a accès au réseau.
- ❓ **Q8** Source et format des profils RLP Synergrid (fichiers annuels), et leur moyenne « tous GRD ».
- ❓ **Q9** Après 2030 : prélèvement et injection séparés (les index actuels ne donnent que le net), batterie domestique,
  contrat dynamique.
