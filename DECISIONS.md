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
- 🔎 **Production solaire** (onduleur, années civiles) : 6,59 MWh (2024), 7,23 MWh (2025), 6,96 MWh (2026, au
  09/11/2026 si année en cours). Soit ≈ 1 200 à 1 300 kWh par kWe d'onduleur (puissance crête des panneaux
  probablement > 5,5 kWc). **Consommation totale estimée** = production + variation du compteur : ≈ 5 300 kWh/an
  (2024-2025) et ≈ 6 200 kWh/an (2025-2026), approximation car périodes civiles ≠ périodes de régularisation.
  La consommation augmente alors que la production est stable : le surplus fond. Cause : **climatisation**, très
  utilisée en été (au moment où les panneaux produisent). Le surplus dépendra donc de la chaleur de chaque été.
- 🔎 **Consommation 2025-2026 (précise)** : rapport journalier de l'onduleur, 7 009 kWh produits du 01/09/2025 au
  30/08/2026, plus ≈ 265 kWh estimés pour les 14 jours manquants jusqu'au 13/09/2026 (≈ 19 kWh/jour), soit ≈ 7 275 kWh
  sur la période de régularisation. Consommation = 7 275 − 913 ≈ **6 360 kWh sur 378 jours, ≈ 6 150 kWh/an**.
  Production très saisonnière : 86 kWh en janvier, 1 136 kWh en juillet. Le rapport prévoit des colonnes réseau,
  consommation et batterie, vides aujourd'hui.
- 🔎 **Installation électrique** (dépôt SchemaElectric) : réseau **3 × 230 V sans neutre**, schéma TT ; branchement
  **25 A triphasé = 10 kVA**, renforcement à **32 A triphasé ≈ 12,7 kVA** demandé (40 A abandonné : trop de travaux) ; compteur électromécanique de 2000.
  Gros consommateurs : taque induction (C25 3P), 2 unités extérieures de climatisation, prise triphasée X1.
- 🔎 **Photovoltaïque** : 19 panneaux Canadian Solar 395 Wc = **7,5 kWc**, mis en service le 20/09/2023 ; production
  ≈ 920 à 960 kWh/kWc (normal pour la Belgique). Onduleur **monophasé** ZCS Azzurro 5 kW (2e onduleur, référence
  exacte à lire sur l'étiquette), injection max **5,5 kVA** = base du tarif prosumer. Le 1er onduleur était un
  1PH 5000TLM-V3 (non hybride) ; les deux numéros de série commencent pareil, l'actuel est donc probablement de la
  même famille, sans entrée batterie. Pas de batterie, pas de compteur d'énergie relié à l'onduleur.
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

- ✅ **D18 Contrat** : **rester chez TotalEnergies myComfort Variable** pour l'instant. Comparaison du 09/11/2026
  (Comparateur-energie.be, 4 843 kWh, prix bihoraires TVAC, réseau identique 1 452,50 €) : part fournisseur
  récurrente myComfort ≈ 977 € (indice 114,46) contre 1 214 € (Engie Easy Fixed), 1 256 € (Engie Easy),
  1 317 € (Eneco Soleil & Vent Fix One), 1 322 € (Luminus ComfyFlex), 1 406 € (Luminus Comfy). Seule la prime de
  bienvenue d'Engie Easy Fixed (−387 €) la bat la 1re année (≈ 150 à 220 €). Prix mono des concurrents non connus.
- ✅ **D19 Tarif IMPACT** : à étudier quand le compteur communicant sera actif. Gain potentiel si toutes les recharges
  tombent en heures ECO : ≈ 6,9 c€/kWh TVAC de distribution (5,09 au lieu de 11,98), soit ≈ 280 €/an sur ≈ 4 087 kWh
  facturés, à mettre en balance avec la consommation du foyer en heures PIC (16,57). Dépend de Q2 (compatibilité avec
  la compensation) et demande des données horodatées (Zaptec, P1).

- ✅ **D20 Onglet « Historique »** : production, prélèvement, injection, consommation de la maison, recharges et montant
  provisionné, par mois et par année. Comparaison du **mois en cours avec le même mois de l'année précédente** sous forme
  de **barre de progression** mise à jour chaque jour : cumul du mois à date comparé au cumul de l'année précédente à la
  même date (et au total du mois complet de l'année précédente), avec l'écart en %. En tête, les informations importantes :
  surplus solaire restant (kWh de recharge encore « gratuits »), état du compte séparé (provisions comparées à la part
  réelle estimée), prix du kWh et indice du mois, alerte de production anormalement basse, échéances (fin de contrat,
  nouvelle carte tarifaire, régularisation, fin de la compensation).
- ✅ **D21 Sources automatiques** : production via l'**API du portail ZCS Azzurro** (accès à demander à ZCS ;
  import du rapport Excel en secours) ; recharges via l'**API Zaptec** (remplace la saisie manuelle de D6 dès que la
  borne est installée). Identifiants rangés dans le Key Vault, jamais dans le dépôt.

- ✅ **D22 Interface** : **sobre et compréhensible au premier regard** ; un **pictogramme pour chaque intervenant**
  (panneaux solaires, maison, voiture et borne, réseau, compte séparé, plus tard batterie), le même partout (cartes,
  tableaux, graphiques, barres de progression). Jeu d'icônes libre et cohérent (Lucide ou équivalent), une couleur
  fixe par intervenant, thème clair et sombre comme HMT.

- ✅ **D23 Maquette v1** (`docs/maquettes/maquette-v1.html`) : 4 onglets Accueil · Recharges · Historique · Contrat,
  même coque que HMT. Accueil = montant à mettre de côté, production du mois comparée à l'an passé, surplus restant,
  prix du kWh, compte séparé, « À savoir » (alerte et échéances). Production réelle ; recharges et provisions = exemples.

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
- ❓ **Q10** Accès API ZCS (« API Terze Parti Azzurro », manuel italien fourni par l'utilisateur) : jeton demandé
  depuis le portail zcsazzurrosystemsweb.com (fonction annoncée « en développement » dans le manuel : sinon ticket),
  reçu par e-mail. Appels `POST` sur une passerelle AWS (eu-west-1) avec les en-têtes `x-api-key` = e-mail et
  `x-api-secret` = jeton. Commandes : `realtimeData`, `historicData` (fenêtre de **24 h maximum**, un échantillon toutes
  les ~5 min), `deviceAlarm`, `deviceHistoricAlarm`. Production du jour = écart de `energyGeneratingTotal` (compteur
  cumulé) entre deux échantillons. Reprise de l'historique : import Excel plutôt que des centaines d'appels.
  Les alarmes de l'onduleur pourront alimenter l'alerte de production.
- ❓ **Q9** Après 2030 : prélèvement et injection séparés (les index actuels ne donnent que le net), batterie domestique,
  contrat dynamique.
