# decisions.md - Historique des décisions SpotHitch

> Dernière mise à jour : 2026-03-28

---

## Architecture & Build

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Build system | Vite 7.x | Build rapide, HMR, ES Modules natifs, code splitting | 2025-12-27 |
| CSS | Tailwind CSS 4 compilé local | Pas de CDN, performance, contrôle total | 2025-12-27 |
| Carte | MapLibre GL JS 5 + OpenFreeMap | Gratuit, pas d'API key, WebGL, remplace Leaflet | 2026-01 |
| Backend | Firebase (Auth, Firestore, Storage) | Pas d'infra serveur, pay-as-you-go, auto-scaling | 2025-12-23 |
| Hosting | GitHub Pages | Gratuit, deploy auto via GitHub Actions | 2025-12-23 |
| Monitoring erreurs | Sentry (optionnel) | Chunk isolé, ne bloque pas si pas configuré | 2026-02 |
| PWA | vite-plugin-pwa (Workbox) | Offline-first, installable, auto-update | 2025-12-27 |
| Tests | Vitest + Playwright | Rapide, compatible Jest, E2E navigateur réel | 2025-12-27 |
| Linting | ESLint + Prettier | No semicolons, 2 espaces, camelCase | 2025-12-27 |
| Rendering | Dirty-checking + fingerprint | Pas de virtual DOM, mais skip renders si rien ne change visuellement | 2026-02-24 |
| MutationObservers | afterRender hooks ciblés | Les MO globaux sur body/subtree déclenchaient à chaque render, gaspillage CPU | 2026-02-24 |
| CSS transitions | transition-colors au lieu de transition-all | transition-all force le navigateur à vérifier toutes les propriétés CSS | 2026-02-24 |
| persistState | Debounce 500ms | Sérialisation JSON à chaque setState était coûteux, 500ms suffit | 2026-02-24 |

## Données

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Source spots | Données communautaires uniquement | Spots créés par les utilisateurs SpotHitch | 2026-03 |
| Stockage spots | JSON par pays dans public/data/spots/ | Chargement lazy par pays, pas de backend | 2026-01 |
| Cache client | IndexedDB + localStorage | Offline, pas de limite 5MB (IndexedDB) | 2025-12-26 |
| Nettoyage données | Suppression 3642 spots dangereux/peu fiables | Qualité > quantité | 2026-02 |
| Données importées supprimées | Toutes les données importées retirées, 100% communautaire | SpotHitch repart de zéro avec uniquement les spots créés par la communauté | 2026-03-18 |
| Destinations avec pourcentages | Extraites des commentaires + nearest city lookup | L'utilisateur voit "→ Budapest 40%, → Bratislava 30%" au lieu de commentaires bruts | 2026-03-15 |
| Noms spots = ville principale | Quartiers/arrondissements en sous-info, pas dans le titre | "Paris #5" avec "13e arrondissement" en dessous, pas "Paris 13e Arrondissement #5" | 2026-03-15 |

## UX / Produit

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Auth | Progressive (anonyme → email → social → vérifié) | Friction minimale, on montre la valeur d'abord | 2026-02 |
| Auth obligatoire AddSpot | Firebase Auth requis pour créer un spot (+ mode test localStorage) | Empêcher les données poubelle, garantir traçabilité | 2026-02-20 |
| SW denylist city/guides | /city/* et /guides/* exclus du navigateFallback SW | Pages SEO statiques ne doivent pas être interceptées par le SPA | 2026-02-20 |
| Onboarding | Carousel 5 slides puis carte directe | Map-first, montrer la valeur immédiatement | 2026-02 |
| Spots : 3 critères | Sécurité, trafic, accessibilité (1-5 étoiles) | Simple et suffisant pour évaluer un spot | 2025-12-23 |
| Direction obligatoire | Toujours indiquer la destination | Le coeur de l'app = trouver un spot VERS une destination | 2025-12-23 |
| 6 types de spots | Station/aire, péage, rond-point, bretelle, bord de route, autre | Types physiques (où tu te poses). "Sortie de ville" retiré car c'est une situation, pas un lieu. | 2026-03-15 |
| Photo obligatoire | Requise à la création de spot | Qualité des données, preuve visuelle | 2025-12-23 |
| Pas de paywall | Gratuit pour tous | Les autostoppeurs sont fauchés | 2025-12-23 |
| 4 langues | FR, EN, ES, DE | Couverture Europe principale | 2025-12-23 |
| Pages SEO villes | 428 pages générées auto depuis les spots | Google indexe, trafic organique | 2026-02 |
| Voyage carte totale | Carte plein écran + bottom sheet 3 états | Map-first UX, comme Google Maps | 2026-02-26 |
| Compagnon app-only | Supprimé SMS/WhatsApp, notifications push uniquement | Plus simple, pas de numéro requis, in-app | 2026-02-26 |
| SOS triple envoi | Push + SMS + appel en parallèle (Promise.allSettled) | Maximise les chances d'alerte en urgence | 2026-02-26 |
| Profil Firestore sync | Bio, réseaux sociaux, langues dans Firestore + localStorage | Visible par les autres, persiste entre appareils | 2026-02-26 |
| Firebase plan Spark | Rester gratuit pour maintenant, Blaze plus tard | Pas de coût tant que pas de notifs entre utilisateurs | 2026-02-26 |
| Proximité spots | 500m rayon, 1 vote/an, pas de popup permanente | Non-intrusif, anti-spam | 2026-02-26 |
| Mode En Route | Point bleu GPS live, pause/arrêt, pas de barre progression | Simple, réaliste (pas de progression linéaire en stop) | 2026-02-26 |
| Spots 3 tiers | Gris/Vert/Or au lieu de 6 couleurs | Plus simple, basé sur testCount+validationCount au lieu de userValidations seul | 2026-03-02 |
| Rouge = station uniquement | Rouge n'est PAS "dangereux", c'est station-service | Combinable avec n'importe quel tier (gris-rouge, vert-rouge, or-rouge) | 2026-03-02 |
| Valider vs Tester | 2 boutons séparés (quick validate + formulaire test) | Valider = le spot existe (drive-by), Tester = j'ai fait du stop ici | 2026-03-02 |
| SpotDetail K9 | Design arrondi organique avec sections dépliables | Plus lisible, moins de scroll, info hiérarchisée | 2026-03-02 |
| SpotDetail sections ouvertes | Toutes les sections `<details open>` par défaut | Antoine veut tout visible sans cliquer | 2026-03-10 |
| SpotDetail ordre sections | Stats > Ratings > Destinations > Description > Reviews > Amenities > Location | Amenities avant Location sur demande Antoine | 2026-03-10 |
| SPOT_ALLOWED_FIELDS 35+ | Whitelist Firebase étendue de 21 à 35+ champs + flattening | v3 AddSpot collecte plus de données (method, group, time, season, tags, etc.) | 2026-03-10 |
| Pas de faux avis | generatePlaceholderReviews supprimé | Seuls les vrais avis sont affichés | 2026-03-10 |
| Marqueurs carte Style D | Split vertical (gauche=tier, droite=rouge) pour stations + bordure dorée brillante pour certifié. **VERROUILLÉ** — ne jamais changer sans accord Antoine. | Choisi par Antoine parmi 6 propositions (A-F). Icônes canvas, symbol layer. | 2026-03-02 |
| Or auto-certifié | Spot d'Or (10+ tests + 10+ validations) est TOUJOURS certifié, même sans ambassadeur | La communauté qui valide massivement = preuve suffisante | 2026-03-02 |
| Photo optionnelle + 50pts | Photo pas obligatoire à la création ni au test, mais donne +50 points bonus | Testeurs ajoutent beaucoup de spots sans photos au début | 2026-03-02 |
| Champs spot obligatoires | Tout obligatoire sauf photo : position, type, ville, direction, méthode, groupe, heure, résultat, description, 3 notes | Qualité des données communautaires | 2026-03-02 |
| Âge/genre inscription | birthYear (obligatoire, 16+) et gender (optionnel) collectés à l'inscription | Données communautaires pour analytics | 2026-03-02 |
| @pseudo obligatoire | Username unique style Instagram (@pseudo), 3-20 chars, lettres/chiffres/._. Firestore `usernames/{pseudo}` pour unicité. Obligatoire email + Google. | Identité communautaire, mentions futures, social | 2026-03-02 |
| Complete Profile Google | Après 1er Google sign-in, modal "Complète ton profil" (pseudo+âge+genre) avant de continuer | Google ne fournit pas ces infos, on les demande post-auth | 2026-03-02 |
| Favori unique ❤️ | Coeur unique remplace ⭐ highlight + 🔖 bookmark séparés | Simplification UX, 1 geste = 1 action | 2026-03-02 |
| Renommer voyage | prompt() natif pour renommer un voyage sauvegardé | Simple, pas besoin de modal custom | 2026-03-02 |
| Confirm suppression voyage | confirm() natif avant suppression | Protection contre les clics accidentels | 2026-03-02 |

## Performance

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| E2E CI speed | 2 workers, 1 retry, 30s timeout, no video, 60s webServer timeout | CI 2x plus rapide, réduit les timeouts | 2026-02-20 |
| Code splitting | Chunks manuels (maplibre, firebase, sentry, gamification) | Bundle initial minimal | 2026-02 |
| i18n lazy | 1 langue chargée à la fois | ~20KB au lieu de 80KB | 2026-02 |
| MapLibre lazy | Chargé uniquement quand la carte est affichée | 277KB économisés au premier chargement | 2026-02 |
| Images | Compression WebP 128/256px | Chargement rapide, surtout sur mobile | 2026-02 |
| Auto-update | Polling version.json + SW listener | L'utilisateur voit toujours la dernière version | 2026-01 |
| Lazy-load modales/vues | ~30 composants lazy dans App.js | Bundle 785KB → 200KB (-75%) | 2026-02-22 |
| Nommage cohérent | Règle #8b — 1 nom unique par handler, jamais d'alias | Éviter confusion rejectFriendRequest/declineFriendRequest | 2026-02-22 |

## Sécurité

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Sanitisation | DOMPurify | Protection XSS professionnelle | 2025-12-26 |
| CSP | Content Security Policy header | Anti-injection | 2025-12-26 |
| RGPD | Cookie banner + data export + audit script | Conformité EU | 2026-02 |
| CCPA | Opt-out California | Conformité US | 2026-02 |
| Git sécurité | Jamais git add -A, fichiers listés 1 par 1 | Éviter commits accidentels de données | 2026-02 |

## Composant / Rendering

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Framework | Aucun (vanilla JS) | Zéro dépendance runtime, rendu rapide | 2025-12-23 |
| Rendu | String-based (innerHTML) | Pas de virtual DOM, simple et performant | 2025-12-23 |
| Handlers | window.* globaux | Compatible avec innerHTML onclick="..." | 2025-12-23 |
| État | Store réactif custom (state.js) | Pub/sub simple, pas de Redux overhead | 2025-12-27 |
| Persistence état | localStorage sélectif | Certaines clés persistent, d'autres non | 2025-12-27 |

## APIs externes

| Service | Usage | Limite | Coût |
|---------|-------|--------|------|
| Firebase | Auth, DB, Storage, Push | Free tier: 50K docs/jour | Gratuit (tier gratuit) |
| OSRM | Routing itinéraires | 50 req/min par IP | Gratuit |
| Nominatim | Géocodage (nom → coords) | 1 req/sec | Gratuit |
| Overpass | Stations-service sur carte | 5 concurrent | Gratuit |
| OpenFreeMap | Tuiles carte | Illimité | Gratuit |
| MyMemory | Traduction in-app | 5000 mots/jour | Gratuit |
| Sentry | Monitoring erreurs | 5K events/mois (free) | Gratuit |

## Décisions Session Multi-User (2026-03-21)

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Spots immuables | Créateur ne peut plus modifier après publication | Empêche vandalisme et manipulation de coordonnées. Seul admin modifie. | 2026-03-21 |
| Check-in 500m | GPS actuel ou historique 24h | Distance réaliste pour être au spot. Marge pour imprécision GPS. | 2026-03-21 |
| Validation 2km | GPS actuel ou historique 24h | On peut passer en voiture et confirmer l'existence du spot. | 2026-03-21 |
| GPS historique PWA | Foreground only, 1 position/min, 24h rétention | iOS bloque le background. App native nécessaire pour tracking permanent. | 2026-03-21 |
| Niveaux confiance check-in | verified_on_spot (<500m), position_confirmed (<2km), no_history | Transparence : l'utilisateur voit la fiabilité de chaque validation. | 2026-03-21 |
| Reviews 10 chars min + profanité | Filtre basique FR/EN | Qualité minimale des avis. À enrichir avec ES/DE. | 2026-03-21 |
| 1 review par user par spot | localStorage + Firestore ID | Empêche le spam de reviews. | 2026-03-21 |
| Détection doublons 500m | Confirmation utilisateur + info admin | Évite les doublons mais permet les spots direction opposée avec justification. | 2026-03-21 |
| Zéro données fictives | Tout supprimé : faux ambassadeurs, faux chiffres, faux profils | Antoine insiste : rien de faux. Les démos ont un bandeau "Aperçu fictif". | 2026-03-21 |
| loginAsAdmin protégé | Guard VITE_SHOW_BETA | Inaccessible en production. | 2026-03-21 |
| Firebase session persistence | setPersistence(browserLocalPersistence) | L'utilisateur ne se déconnecte plus au refresh. | 2026-03-21 |
| App native future | React Native prévu | Pour tracking GPS arrière-plan, notifications push fiables, performance. | 2026-03-21 |

## Décisions Phase 8 — Carte & Navigation (2026-03-22)

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| WebGL fallback | Message + suggestion navigateur récent | 5-10% des vieux Android n'ont pas WebGL. Mieux qu'un écran blanc. | 2026-03-22 |
| MapLibre crash recovery | Message d'erreur + bouton Réessayer | L'utilisateur sait quoi faire au lieu de voir du vide | 2026-03-22 |
| Cleanup listeners au changement d'onglet | Fonctions nommées + _cleanupMapListeners() | Empêche l'accumulation et la fuite mémoire | 2026-03-22 |
| Request ID sur recherche et sélection | Incrémente un compteur, ignore les résultats périmés | Empêche les race conditions sans AbortController | 2026-03-22 |
| Respect du zoom utilisateur | Math.max(12, currentZoom) quand on clique une ville | Si l'utilisateur est zoomé à 15, on ne force pas à 12 | 2026-03-22 |
| Toast sur échec recherche | Seulement si erreur réseau (pas si 0 résultats) | L'utilisateur sait que c'est un problème de connexion, pas d'absence de données | 2026-03-22 |

## Décisions Session 44 — GPS Trust & Dates (2026-03-22)

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Dates d'expérience | lastValidated/lastTested = experienceDate | La date de soumission n'a pas de sens si l'expérience date d'il y a un mois | 2026-03-22 |
| GPS obligatoire pour "Disponible" | Vérification GPS + popup confirmation si pas proche | "Disponible" = on est sur place, le GPS doit confirmer | 2026-03-22 |
| Confirmation manuelle si GPS échoue | Popup "Oui je suis sur place" sans badge | Le GPS peut échouer même quand on est là (tunnel, forêt) | 2026-03-22 |
| Ratio de confiance GPS 1/3 | Min 33% des validations avec GPS après 3 total | Bloque le spam depuis le canapé sans punir les GPS capricieux | 2026-03-22 |
| Grace period 3 validations | Les 3 premières sont toujours acceptées | Nouveau utilisateur ne doit pas être bloqué immédiatement | 2026-03-22 |
| Badge GPS sur le spot (pas l'user) | lastGpsVerified sur le document spot | Le badge dit "quelqu'un a été physiquement ici récemment" | 2026-03-22 |
| Scanner duplicate class attrs | lint-staged + CI | Empêche définitivement les attributs HTML dupliqués (bug ERR-125) | 2026-03-22 |

## Décisions Sessions 22-26 mars

| Décision | Choix | Raison | Date |
|----------|-------|--------|------|
| Guides pays 96 pays | 10 sections enrichies par pays (lois, autostop, sécurité, femmes, langue, budget, camping, transport, saisons, culture) | Contenu triangulé multi-langues, pas de copié-collé Hitchwiki | 2026-03-22 |
| i18n guides dynamique | 4 fichiers guideSections-{fr,en,es,de}.js chargés par langue (code-splitting) | Économie mémoire, un seul fichier chargé à la fois | 2026-03-22 |
| Guide design v16a | Filter chips + social feed style (stories Instagram) | Retenu par Antoine parmi v15d et v16a | 2026-03-22 |
| Signalements complets | 4 types (spot/user/message/guide), raisons différenciées, admin panel avec filtres | Modération communautaire indispensable avant la beta | 2026-03-23 |
| 14 couches CI | CodeRabbit, DeepSource, Aikido, Argos, CodeQL, Lighthouse + 8 jobs CI | Qualité et sécurité vérifiées automatiquement sur chaque PR | 2026-03-23 |
| Workflow PR obligatoire | Claude lit les commentaires CodeRabbit/DeepSource, corrige, merge. Antoine ne lit pas les PR. | Automatisation de la revue de code | 2026-03-23 |
| Détection spot proche étape 1 | Modal mini-carte dès étape 1 si spot existant < 500m | Évite création de doublons, plus tôt dans le wizard | 2026-03-24 |
| Parser Google Maps exhaustif | 19+ formats supportés (protobuf, embed, navigation, streetview, maps.app.goo.gl) | Le partage Google Maps est le cas d'usage principal | 2026-03-24 |
| Worker Cloudflare URL resolver | Résout les URLs courtes goo.gl/maps.app.goo.gl côté serveur (CORS) | Les redirections Google sont bloquées côté client par CORS | 2026-03-24 |
| 30 modals fingerprint fix | Toutes les 61 clés state dans getModalFingerprint() | Bug systémique : 30 modals/panels ne s'affichaient jamais car non inclus dans le fingerprint | 2026-03-24 |
| Desktop split-view Home | Panneau latéral 380px + carte flex (style Airbnb) avec breakpoint lg: | Utilisation desktop/tablette optimale | 2026-03-25 |
| Social master-detail desktop | Liste conversations 320px à gauche + chat à droite | Pattern classique messagerie desktop | 2026-03-25 |
| Guardian Mode v1 | 5 écrans (Intro, Main/2 onglets, Active, Guardian, Alert) | Redesign complet, UX moderne avec onglets | 2026-03-25 |
| SEO 96 pays | Pages HTML pré-rendues, 2000+ mots/page, Schema.org FAQ+Breadcrumb, sitemap 97 URLs | Google indexe du contenu riche | 2026-03-24 |
| /city/* → 410 Gone | Anciennes pages villes retournent 410 au lieu de 200 | Désindexation propre des pages obsolètes | 2026-03-24 |
| Firebase Emulators en CI | Auth+Firestore émulés dans les jobs E2E, vrais secrets pour deploy | Élimine les coûts billing Firebase liés aux ~100 CI runs/jour | 2026-03-26 |
| Rester PWA (pas Capacitor) | PWA pure en alpha, Capacitor envisageable en beta (100+ users réguliers) | Coût Apple 99€/an, double maintenance, risque rejet store | 2026-03-26 |
| NLNet NGI Zero Commons Fund | Candidature ~46K€ sur 6 mois, focus SOS+Guardian comme briques open source | Deadline 1er avril 2026, financement européen pour communs numériques | 2026-03-24 |
| Splash tips randomisés | Fisher-Yates shuffle au lieu de commencer toujours par le premier | UX plus variée à chaque ouverture | 2026-03-24 |
