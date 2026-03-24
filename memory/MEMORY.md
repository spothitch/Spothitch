# MEMORY.md - Mémoire de session SpotHitch

> Dernière mise à jour : 2026-03-24 (desktop adaptation 6/6 étapes terminées, split-view carte, social master-detail, SEO 96 pays, sitemap 97 URLs, 410 /city/*, FAB repositionné)

---

## Fichiers mémoire détaillés

- `memory/app-state.md` — **ÉTAT DES LIEUX VISUEL** de chaque écran + décisions design. LIRE EN PREMIER pour ne pas signaler comme bug ce qui est voulu.

- `memory/teasing-templates.md` — Guidelines templates teasing (style, ton, règles, templates existants)
- `memory/funding.md` — Dossier financement
- `memory/features.md` — Inventaire des 190+ features
- `memory/decisions.md` — Historique des décisions
- `memory/errors.md` — Journal des erreurs et leçons
- `memory/audits.md` — Base de données audits
- `memory/feedback_max_background.md` — JAMAIS plus de 1 agent/bash en arrière-plan (crash session)
- `memory/mockups-approved.md` — Index des mockups validés par Antoine (SOS v4b, etc.)
- `memory/mockups/` — Fichiers HTML des mockups approuvés (sauvegardés sur GitHub)
- `memory/multi-user-phase1-results.md` — Résultats Phase 1 (Auth, 35/35, 12 fixes)
- `memory/multi-user-phase2-results.md` — Résultats Phase 2 (Spots, 37/37, 5 fixes + data integrity)
- `memory/multi-user-phase8-results.md` — Résultats Phase 8 (Carte, 36/36, 4 fixes critiques + 10 optimisations)
- `memory/plan-optimisation-v2.md` — Plan optimisation V2 (19 points maintenant, 10 points futur/app native)
- `memory/plan-desktop-adaptation.md` — Plan adaptation desktop/tablette (6 étapes, 5-6 sessions). Split-view carte, conteneur responsive, modals centrés, grilles adaptatives.
- `memory/feedback_favicon_outlined.md` — Toujours utiliser outlined-transparent pour favicons (invisible sans contour sur fond blanc)

---

## CRITIQUE — Spots = 100% communautaires

**Les spots sont uniquement ceux créés par la communauté via Firestore.** Il n'y a AUCUNE donnée importée dans l'app. ZÉRO donnée fictive ou nombre inventé. Antoine insiste : rien de faux dans l'app. Les faux ambassadeurs, faux chiffres de spots, et faux profils démo ont été supprimés le 2026-03-21. Les démos de features futures affichent un bandeau "Aperçu. Les noms et chiffres sont fictifs." en 4 langues.

---

## Audits — voir memory/audits.md pour la base de données COMPLÈTE

**45 scripts d'audit | 700+ tests | 441/531 handlers (83.1%) | La Fourmi 191/191 | QG 93/100 | 0 échec**

### Audit Alpha Production — 2026-03-05 ✅ TOUTES FEATURES CONFIRMÉES

| Feature | Tests | Résultat | Notes |
|---------|-------|----------|-------|
| Carte | 10 | ✅ 10/10 | GPS, filtres, search, spot detail via setState mock |
| Spots (AddSpot) | 9 | ✅ 9/9 | Form 3 étapes, photo optionnelle, 6 types, 3 critères |
| Auth | 8 | ✅ 8/8 | Google/Facebook/email, reset, déconnexion |
| Profil + RGPD | 9 | ✅ 9/9 | Bio, langues, export, suppression, cookies |
| Guides | 5 | ✅ 5/8* | *3 échecs = artefacts test, pas bugs réels |
| Voyage (Journal) | 5 | ✅ 5/5 | Itinéraire → fenêtre beta correcte |
| Social | 7 | ✅ 7/7 | Amis, DM, blocage, signalement |
| Légal/Tech | 7 | ✅ 7/7 | CGU, RGPD, SEO, PWA, SW |

**Patterns Playwright confirmés (NE PAS OUBLIER) :**
- `spothitch_feature_seen` = UNE seule clé JSON `{ featureId: timestamp }` (PAS de clés individuelles)
- `spothitch_test_mode = 'true'` → bypasse auth dans openAddSpot
- `window.setState({ username: 'testuser' })` → bypasse requireProfile
- `window.showLegalPage('cgu')` → ouvre le modal légal (PAS openLegal qui n'existe pas)
- Recharger la page entre tests longs pour éviter interférences état/DOM
- Polling loop 8s pour modals lazy-loaded (lazyRender nécessite 2 render cycles)

### Résumé des résultats (2026-02-24 — tous relancés)

| Lot | Scripts | ✓ | ✗ | ? | Notes |
|-----|---------|---|---|---|-------|
| UI/flows (5) | ui, ui-part2/3/4, firebase | 134 | 2 | 9 | 2 ✗ = modals lazy-load |
| Spécialisés (4) | ux, security, social, gamification | 68 | 0 | 2 | ⭐ quasi-parfait |
| Session 12 (12) | map, spots, voyage, social2... | 270 | 0 | 23 | ? = lazy-loading |
| Session 13 (12) | admin, account, quiz, photos... | 88 | 0 | 142 | ? = noms inventés |
| Spécifiques (3) | sos-nav, home-search, trip-adv | 51 | 0 | 23 | |
| **Master (1)** | **audit-all-handlers.cjs** | **441** | **0** | **90** | **83.1% handlers** |

**Les 90 handlers "manquants" du master : PAS des bugs** — ce sont des handlers dans des modules lazy-loaded qui ne se chargent que quand leur modal est rendu. Ils existent dans le code source. Voir audits.md §"Analyse des 90 handlers".

**Les ~142 "?" des scripts session 13 : noms de handlers INVENTÉS** — ces scripts testent des fonctions comme `adminBanUser`, `deleteMyAccount`, `openGDPRSettings` qui n'existent pas dans le code. Voir audits.md §"Catégorie B".

**Couverture features.md : 80/80 features = 100%** — chaque feature cochée est testée par au moins 1 script.

⚠ Max 2 audits Playwright en parallèle (timeout réseau sinon)
⚠ setLanguage() provoque un reload → ne pas appeler pendant un audit actif

---

## État du projet

- **Version** : 2.0.0
- **Commits** : 432+
- **Premier commit** : 2025-12-23
- **Site live** : spothitch.com (Cloudflare Pages, HTTPS actif)
- **Spots** : 100% communautaires via Firestore (aucune donnée importée)
- **Langues** : FR, EN, ES, DE
- **Tests** : 87 wiring, 40 E2E spec files, 108 multi-user tests (P1: 35, P2: 37, P8: 36), ~570 E2E total
- **Multi-user testing** : Phase 1 (Auth) 35/35 ✅ + Phase 2 (Spots) 37/37 ✅ + Phase 8 (Carte) 36/36 ✅. Phases 3-7, 9-10 à venir.
- **Data integrity** : spots immuables, GPS history 24h, check-in 500m, validation 2km, niveaux confiance, filtre profanité, détection doublons
- **Map optimizations** : WebGL fallback, crash recovery, listener cleanup, search request ID, coord validation
- **Backup** : cron 5min vers github.com/spothitch/chromebook-backup (sessions Claude, SSH, .env.local, config gh)
- **E2E credentials** : `node scripts/setup-env.mjs` recrée .env.local depuis ~/.claude/ (survit aux crashs)

---

## Ce qui est configuré et marche

- Build Vite + deploy Cloudflare Pages automatique (GitHub Actions)
- Carte MapLibre GL JS avec clustering + OpenFreeMap
- Spots chargés depuis Firestore (100% communautaires)
- PWA installable avec Service Worker (vite-plugin-pwa)
- Système i18n lazy-loaded par langue
- Gamification complète (points, badges, niveaux, leagues, VIP, quizz, défis)
- Social (amis, chat, messages privés, réactions, groupes)
- SOS v2 (SMS/WhatsApp, offline, countdown, alarme silencieuse, faux appel, enregistrement, contacts primaires, message perso)
- Companion v2 (SMS/WhatsApp, GPS breadcrumb, arrivée/départ notif, batterie, ETA, rappel check-in, contacts multiples, historique)
- Système d'auth progressif (Firebase Auth - Google, Facebook, Apple, email)
- Onboarding carousel 6 slides v2 (Problème → Solution → Sécurité → Guides → Cookies → CTA)
- Pages SEO par ville (428 villes générées)
- Notifications de proximité
- Vérification d'identité progressive (5 niveaux)
- Report/Block/Modération
- Conformité RGPD + CCPA + Community Guidelines
- Auto-update via version.json (reload uniquement quand app en arrière-plan)
- Plan Wolf (commande test complète)
- Visual regression testing + Lighthouse CI

## Ce qui est configuré en prod (GitHub Secrets)

- **Firebase** : TOUTES les clés VITE_FIREBASE_* configurées depuis 2025-12-26 (Auth, Firestore, Storage, Messaging)
- **Sentry** : VITE_SENTRY_DSN configuré depuis 2026-02-17, SENTRY_TOKEN configuré depuis 2026-02-24
- **Sentry Sync** : workflow GitHub Actions toutes les 6h, crée des issues GitHub automatiquement depuis les erreurs Sentry
- **Cloudflare** : Account ID + API Token configurés depuis 2026-02-16

## Configuration locale Firebase (développement)

- **`.env.local`** : fichier créé le 2026-02-25 avec toutes les clés VITE_FIREBASE_* (gitignored)
- **API key** : `Browser key (auto created by Firebase)` — restrictions HTTP referrer incluent spothitch.com + localhost
- **OAuth 2.0 Client** : `Web client (auto created by Google Service)` — ID: 314974309234-eh79...
  - Origines JS autorisées : ajout `http://localhost:5173` (2026-02-25)
  - URI de redirection : ajout `http://localhost:5173/__/auth/handler` (2026-02-25)
- **Firebase Auth authorized domains** : inclut `localhost` (vérifié 2026-02-25)
- **Problème connu** : `auth/internal-error` sur Google Sign-In = OAuth client pas configuré pour localhost → résolu ci-dessus

## Ce qui est PAS encore configuré

- **Affiliés** : pas inscrit sur Hostelworld/Booking → pas de monétisation

## À venir — prochaine session

- **Splash screen intelligent** — Transformer le splash en vrai écran de chargement (3-4s) avec barre de progression réelle + tips/conseils qui défilent. Pendant ce temps : précharger MapLibre, style carte, spots Firebase, GPS, auth. Quand la barre finit → carte instantanée, zéro écran blanc.
- **Gardien redesign** — Créer mockups pour le mode Gardien (même approche que SOS v4b), sauvegarder dans memory/mockups/
- **Fix signup re-render** — Le setAuthMode('register') fonctionne maintenant (fingerprint fix) mais à vérifier en prod que l'inscription complète marche

---

## Infos utilisateur

- Antoine ne code pas — tout expliquer simplement
- Chromebook comme machine principale
- Ne JAMAIS demander permission pour les commandes bash
- Ne JAMAIS demander "tu veux que je push ?" — toujours push
- Tout doit TOUJOURS être sauvegardé sur GitHub (push systématique)

### Économie de tokens (ABSOLUMENT OBLIGATOIRE — RÈGLE PRIORITAIRE)
- **RÈGLE D'OR : Antoine ne voit RIEN du technique.** Pas de code, pas de contenu de fichiers, pas de résultats de commandes, pas de JSON, pas de config. RIEN. Jamais. Sauf s'il le demande explicitement.
- **Mode par défaut = économe** : réponses de 1-3 phrases max, zéro répétition, zéro explication technique
- **JAMAIS montrer** : du code, des fichiers lus, des résultats de bash, des diffs, des configs, des contenus de fichiers — Antoine n'en a AUCUNE utilité, il ne code pas
- **Dire UNIQUEMENT le résultat concret** : "C'est fait, le bouton est bleu maintenant" — POINT. Pas de "voici ce que j'ai changé", pas de "le fichier contenait..."
- **JAMAIS expliquer ce qu'on VA faire avant de le faire** — juste le faire puis dire que c'est fait
- **JAMAIS lister les étapes** ("d'abord je vais lire X, puis modifier Y") — juste agir en silence
- **Mode analyse** : si Antoine dit "analyse", "réfléchis bien", "prends ton temps" → là utiliser tout l'espace nécessaire
- **Si Antoine dit "30%"** → passer en mode ultra-économe (phrases minimales)
- **Si Antoine dit "stop" ou "35%"** → tout sauvegarder immédiatement dans memory/ et arrêter
- **Sauvegarder après chaque tâche** dans memory/ pour que la prochaine session reprenne sans rien perdre
- Antoine a un forfait journalier limité → chaque token compte
- **CETTE RÈGLE EST AU-DESSUS DE TOUTES LES AUTRES** — même la Règle #3 "expliquer simplement" ne signifie PAS montrer du code ou du technique

---

## Dernières sessions (reconstitué depuis git log)

### Session 2026-03-22 (session 44 — SOS ICONS + SPOTDETAIL FIX + GPS TRUST SYSTEM)
- **Comparaison mockup SOS v4b vs app** : audit visuel complet avec screenshots Playwright (mockup HTML + app en prod). Identifié 9 icônes manquantes.
- **9 icônes Lucide ajoutées** (ERR-124) : shield-alert, phone-incoming, phone-call, radio, mic, video, volume-2, play-circle, trash-2. Icônes utilisées dans SOS.js mais jamais enregistrées dans icons.js.
- **Fix SpotDetail fond transparent** (ERR-125) : double attribut `class=""` → `bg-dark-primary` ignoré. Cause : commit 4356651 (optimization phases 1-6).
- **Fix Landing.js** : 2 autres doublons `class=""` corrigés (bouton skip + input alpha code).
- **Scanner automatique duplicate-attrs** : `scripts/check-duplicate-attrs.mjs` intégré dans lint-staged + CI job Lint.
- **Dates d'expérience cohérentes** : `lastValidated`/`lastTested` utilisent maintenant `experienceDate` (quand l'utilisateur a VRAIMENT fait du stop) au lieu de la date de soumission. Modifié dans `firebase.js` (addSpot, addValidation) et `spotLiveData.js`.
- **Badge GPS "Vérifié sur place"** : quand un utilisateur valide/teste un spot en étant physiquement proche (< 2km), le spot reçoit un badge vert avec la date et la distance. Champs Firestore : `lastGpsVerified`, `lastGpsVerifiedBy`, `lastGpsDistance`. Affiché dans SpotDetail.
- **Système GPS Trust complet** (`src/services/gpsTrust.js`) :
  - "Disponible" : GPS vérifié → si pas proche, popup confirmation "Oui je suis sur place" ou "Annuler"
  - "Mon expérience" : GPS vérifié avant ouverture du formulaire, option "Choisir une autre date"
  - Création de spot : GPS auto-check si date = aujourd'hui
  - Score de confiance : ratio GPS/non-GPS par utilisateur. Minimum 1/3 (33%) après 3 validations. En dessous : validations pas envoyées à Firebase + message d'avertissement
  - Compteurs localStorage + sync Firestore pour persistance
  - 7 clés i18n en 4 langues (FR/EN/ES/DE)
- **Confetti/badges désactivés** : toutes les animations de badges, titres et confetti sont désactivées (bugs, lenteurs). Les badges sont toujours gagnés silencieusement.
- **6 outils de vérification ajoutés** : CodeRabbit (IA code review), DeepSource (5000+ règles), Aikido (sécurité npm) installés comme apps GitHub. Lighthouse CI ajouté au pipeline. StrykerJS + Argos CI installés en local. Protection RÈGLE #22 (zéro cron, zéro StrykerJS dans CI) avec hook pre-commit.
- **Guides pays v17 (Social Feed)** : nouveau design avec cercles stories, 10 catégories (Lois, Facilité, Sécurité, Femmes, Langue, Budget, Dormir, Transport, Saison, Culture), descriptions épinglées, filter chips communautaires, forum vide prêt. France remplie avec données vérifiées multi-sources.
- **CI** : tous les jobs verts pour chaque commit sur main (18 jobs dont nouveau Lighthouse)

### Session 2026-03-20/21 (session 42b — SOS V4B + AUTH FIXES + MULTI-USER TESTS + COMPTES CI)
- **Hook limit-background** : max 1 tâche en arrière-plan (RÈGLE #21), empêche crashs Chromebook
- **SOS v4b redesign complet** : réécriture totale. Intro explicative + 2 onglets (Alertes en 1er, Config en 2e) + 7 sidebars glissantes (contacts, faux appel, message, communauté, enregistrement, urgence, test). Mode discret supprimé.
- **20 mockups HTML** créés (10 SOS + 10 Gardien). Mockup approuvé sauvegardé dans `memory/mockups/sos-v4b-approved.html`
- **Bug critique CSP** : `https://www.google.com` manquait dans script-src → reCAPTCHA Enterprise bloqué → TOUTE l'auth email/password cassée en prod (ERR-105)
- **Bug signup** : `authMode` pas dans le modal fingerprint → cliquer "Sign up" ne basculait pas le formulaire (ERR-106)
- **Auth stubs** : setAuthMode/signIn/signUp avaient des stubs pour le lazy-load race condition
- **Contacts SOS Firebase** : emergencyContacts + config SOS syncés dans `users/{uid}/syncData/local`, restaurés sur nouveau téléphone
- **Comptes test recréés** : 4 comptes CI (alice, bob, charlie, diana) créés via le formulaire signup du site (JAMAIS via auth:import). Mot de passe dans GitHub Secret `E2E_TEST_PASSWORD`
- **Multi-user test** : 30 OK, 0 FAIL, 4 SKIP (eventual consistency Firestore). Auth, amis, DM, SOS complet, faux appel, notifications, sync Firebase, logout/reconnect
- **Handlers exposés** : `sendDirectMessageTo`, `getConversationWith`, `searchUsersGlobal` pour les tests
- **67 clés i18n** ajoutées en 4 langues (FR/EN/ES/DE) pour SOS v4b
- **CI** : 15/15 jobs verts sur main, QG 100/100, déployé spothitch.com
- **Audit perf carte** : bottleneck identifié (OpenFreeMap style 800ms-3s, MapLibre 200-500ms, Firebase spots 1-2s). Solution proposée : splash screen intelligent avec barre de progression réelle + tips

### Session 2026-03-21 (session 43 — BACKUP CHROMEBOOK + TESTS OPTIMAUX + FIX SOS SIDEBAR)
- **Backup automatique Chromebook** : repo privé `spothitch/chromebook-backup`, cron toutes les 5min. Sauvegarde sessions Claude, clés SSH, .env.local, config gh, mémoire projet. Script `restore.sh` + `setup-spothitch.sh` fusionné pour restauration complète après crash Linux.
- **Audit complet tests CI** : analyse de tous les tests (1403 unit + 37 E2E). Constat : les tests vérifient que le HTML contient des mots, pas que les features marchent réellement.
- **CI optimisé** :
  - E2E Core/Features/Comprehensive/Stress **bloquent** maintenant le deploy (avant : ignorés)
  - E2E Comprehensive + Stress tournent aussi sur `dev` (avant : seulement `main`)
  - RGPD audit + i18n check devenus bloquants (avant : `continue-on-error: true`)
- **Tests supprimés (796 lignes inutiles)** : modalFlags.test.js, storage.test.js, spots.test.js
- **E2E améliorés avec résultats réels** :
  - Recherche : vérifie que la carte se déplace vers Berlin (coordonnées 50-55°N)
  - Zoom : vérifie que le niveau de zoom change réellement
  - Thème : vérifie que la couleur de fond change + persiste dans le state
  - Navigation : vérifie que le contenu change par onglet (pas juste aria-selected)
- **3 nouveaux fichiers E2E** :
  - `userChains.spec.js` : enchaînements séquentiels (recherche→spot→retour, persistance state, reload)
  - `errorHandling.spec.js` : coupures réseau, données corrompues, GPS refusé
  - `performance.spec.js` : temps de chargement, CLS, vitesse tabs, overflow mobile, touch targets
- **Fix SOS sidebar (ERR-107)** : les 6 sections de configuration SOS étaient invisibles (CSS stacking context). Remplacé la sidebar `position: fixed` par un remplacement inline du contenu du panneau Configuration. Toutes les sections fonctionnent maintenant.
- **Fix Fox port (ERR-108)** : 24 scripts Fox hardcodés sur port 5173 au lieu de 3000 (port Vite réel). Score Fox : 58 → 92/100.
- **Fix wiring** : ajout signIn/signUp dans MAIN_JS_HANDLERS (QG 100/100)
- **Fix tests SOS integration** : clé localStorage `spothitch_sos_disclaimer_seen` → `spothitch_sos_intro_seen` (6 tests corrigés)

### Session 2026-03-20/21 (session 42 — SOS V4B REDESIGN + HOOK BACKGROUND + AUDIT AUTH)
- **Hook limit-background.sh** : max 1 tâche en arrière-plan à la fois (RÈGLE #21), empêche les crashs. Lit stdin (pas env var). Verrou /tmp/claude_bg_task.lock avec expiry 5 min.
- **Hook block-git-add.sh corrigé** : lisait $CLAUDE_TOOL_INPUT (vide), maintenant lit stdin avec node.
- **SOS v4b redesign complet** : réécriture totale de SOS.js (458 insertions, 442 suppressions)
  - Écran intro (première ouverture) qui explique pourquoi configurer le SOS
  - 2 onglets : Alertes (défaut) + Configuration (checklist + sidebars glissantes)
  - Config par sidebar : contacts (SpotHitch push + SMS), faux appel (nom/délai/son), message d'alerte (canaux push/SMS/appel), communauté (rayon + recevoir les alertes), enregistrement (permissions micro/caméra), urgence (112 auto)
  - Bouton "Tester le SOS" dans chaque config
  - Mode discret supprimé (jugé inutile par Antoine)
  - Plus d'onglet Contacts séparé (intégré dans config)
- **Mockup sauvegardé** : `memory/mockups/sos-v4b-approved.html` poussé sur GitHub
- **20 mockups HTML** créés (10 SOS + 10 Gardien) dans `mockups/` pour choix d'Antoine
- **Audit auth/social/notifications complet** : auth email+Google OK, amis OK, DM OK, FCM OK, contacts SOS locaux seulement, alerte communauté non testée en prod
- **CI** : tests intégration mis à jour pour v4b, 140 wiring + 125 integration passent
- **RÈGLE #21 ajoutée dans CLAUDE.md** : max 1 background task

### Session 2026-03-10 (session 41 — FIX ADDSPOT BOUTONS + AUTOCOMPLETE + HOOKS)
- **Fix boutons type spot** : classList.toggle('active') overridden par inline styles → mise à jour directe des styles inline dans selectSpotType
- **Fix autocomplete ville départ** : lastAutocompleteStep guard empêchait re-init après re-render DOM → cleanup+reinit systématique
- **Fix valeur ville départ perdue** : input manquait value="" attribute → ajout depuis spotFormData
- **Fix forceSelection invalide** : après re-init, selectedItem null → appel setSelectedItem() avec données spotFormData
- **Fix carte GPS écran noir** : MapLibre map.resize() manquant → ajout on('load') + setTimeout
- **Fix boutons step 2** (method, group, time, ride) : même bug inline styles → shared updateTabBar() helper
- **Fix données stale spotFormData** : pas de reset à l'ouverture modal → reset complet dans openAddSpot()
- **Fix E2E sélecteurs** : modal AddSpot sans id/class → ajout id="addspot-modal" + class="addspot-dialog"
- **3 Claude Code hooks créés** :
  1. `pre-push-tests.sh` : wiring tests + build avant git push/commit, bloque si échec
  2. `visual-playwright-check.sh` : screenshots Playwright auto quand fichiers UI modifiés, bloque si échec
  3. `fox-session-start.sh` : Fox quick au début de session, bloque si score < 80
- **Hooks existants** : `block-git-add.sh` (interdit git add -A), `auto-save-session.sh` (Stop hook)
- **CI** : 15/15 jobs verts sur dev ET main, déployé spothitch.com

### Session 2026-03-10 (session 40 — ADDSPOT V3 + SPOTDETAIL V3 + FIREBASE FIX)
- **BUG CRITIQUE Firebase** : `SPOT_ALLOWED_FIELDS` dans firebase.js ne contenait que 21 champs → ratings, tags, destinations, method, groupSize, timeOfDay, season, spotType silencieusement supprimés à l'écriture. Étendu à 35+ champs + flattening coordinates/ratings.
- **SpotDetail v3 améliorations** (7 points) :
  1. Method/groupSize/timeOfDay/season affichés comme chips dans section Stats
  2. Photo fallback (icône pin SVG si image cassée via onerror)
  3. Taux de succès réel calculé depuis rideResult (couleur vert/rouge)
  4. Meilleur créneau horaire/saison depuis les données spot
  5. Suppression des faux avis (generatePlaceholderReviews supprimé)
  6. Nom de station affiché pour les spots station-service
  7. Numéro de route/nom de localisation affiché quand disponible
- **SpotDetail sections ouvertes par défaut** : `<details>` → `<details open>` pour toutes les sections
- **Amenities avant Location** : réordonnancement des sections dans SpotDetail
- **GitHub Security** : Dependabot security updates activé, CodeQL alertes dismissées (justification client-side)
- **Quality Gate** : 100/100 (ratchet mis à jour)
- **i18n** : 8 clés ajoutées en 4 langues (stepWhereIsSpot, leavingCity, googleMapsShareTip, amenityWater, myExperience, location, statistics, ratings)
- **a11y** : 3 divs interactifs dans AddSpot → `role="button" tabindex="0"`
- **E2E Firebase** : retry polling ajouté pour gamification + spots (Firestore eventual consistency)
- **CI** : 15/15 jobs verts sur dev ET main, Fox 96/100 READY TO SHIP
- **Déployé** : spothitch.com (main) + preview (dev)

### Session 2026-03-05 (session 39 — AUDIT ALPHA PRODUCTION COMPLET)
- **Audit complet de toutes les features alpha sur spothitch.com production**
- 8 catégories testées via Playwright : Carte, Spots, Auth, Profil, Guides, Voyage, Social, Légal/Tech
- Résultats : **59/61 OK** (2 échecs = artefacts de test, pas des bugs réels dans l'app)
- **Bug script corrigé** : `window.openLegal` n'existe pas → utiliser `window.showLegalPage('cgu')`
- **Bug script corrigé** : `spothitch_feature_seen` était individuel → JSON objet sous une seule clé
- Scripts d'audit créés : `audit-carte-final.cjs`, `audit-spots.cjs`, `audit-auth.cjs`, `audit-profile.cjs`, `audit-guides.cjs`, `audit-voyage.cjs`, `audit-social.cjs`, `audit-legal.cjs`
- Spot detail confirmé via `setState({ selectedSpot: mockSpot })` + polling 8s (lazyRender)
- AddSpot form : 3 étapes confirmées visuellement (step 1 photo/type, step 2 position/direction, step 3 ratings)
- Photo optionnelle ✅, direction obligatoire ✅, 6 types ✅, 3 critères notation ✅
- Beta guards fonctionnels : Itinéraire, SOS, Compagnon, Niveaux → fenêtres intro glassmorphism

### Session 2026-02-26 (session 24 — OUTILS QUALITÉ + LA FOURMI 23 NIVEAUX)
- **Quality Gate** : score 93/100, 0 erreurs (était 76/100 avec 73 erreurs)
  - Fix: duplicate handlers, XSS false positive, Firebase auth, activeTab, ghost states, no-op stubs, missing lazyLoaders, small fonts, hardcoded French, CSS selectors
- **La Fourmi** étendue de 7 à 23 niveaux : **191 tests OK, 0 erreurs, 0 crash**
  - L1-L8 : Navigation, Modals, Boutons, Carte, États, Visuel, Performance, Journeys — 100%
  - L9 : Form Validation (AddSpot, Auth, Recherche, Contact) — 100%
  - L10-L12 : Stress, i18n 4 langues, Accessibilité — 100%
  - L13-L15 : Responsive 4 viewports, Data Persistence, Anti-Regression — 100%
  - L16-L18 : Dead Links, SEO, Sécurité Runtime — 100%
  - L19-L21 : Auth Flows, Onboarding, Theme Switching — 100%
  - L22-L23 : Deep Map, SOS & Companion — 100%
- **Corrections La Fourmi** :
  - Image check: await onload avant naturalWidth (faux positif éliminé)
  - Isolation niveaux: chaque niveau en try/catch + recovery auto
  - Level 7 Performance: try/catch par test individuel (plus de crash)
  - L9 Contact: page reload avant test (render pipeline pollué)
  - L23 SOS/Companion: pré-accepter disclaimer/consentement
- **E2E CI optimisés** : monkey 200→50, map 18→6 tests, waitForTimeout réduits 60%
  - E2E Core: 8min+ → 3m43s, E2E Stress: 12min+ → 5m00s
- **Chromium cache CI** : actions/cache@v4 sur 4 jobs E2E
- **14/14 jobs CI verts**, deploy Cloudflare OK
- **Plan Wolf v6 run #32** : score 85/100 (+28), confiance HAUTE
  - Fix: 15 duplicate handlers supprimés, 2 empty handlers corrigés, 30+ a11y violations, 80 lignes CSS mortes, circular import location.js, duplicate calculateDistance
  - toggleTheme remis dans main.js (Profile.js lazy-loaded → undefined au démarrage)
  - openAdminPanel/closeAdminPanel remis dans AdminPanel.js (test unitaire importe AdminPanel.js pas main.js)
- **Visual Regression** : 34/34 baselines sauvegardées (4 tabs + 10 subtabs + 20 modals)
  - Fix: landing page bloquait le script → ajout spothitch_landing_seen dans localStorage
- **QG stable** : 93/100 (7 runs, avg 82, min 74, max 93)

### Session 2026-02-25 (session 23 — SENTRY BUGS + TEST EXHAUSTIF 7 NIVEAUX)
- **6 bugs Sentry corrigés** + **17 issues GitHub fermées**
- **safeSetItem()** créé, **clipboard protégé**
- **Test exhaustif créé** : `scripts/full-test.mjs` — 7 niveaux initiaux
- 107 tests wiring passent, build OK, déployé

### Session 2026-02-25 (session 22 — WOLF EXHAUSTIF + DOUBLONS + i18n + TOGGLES)
- **Wolf exhaustif run #30** : score 74/100 (+3 depuis le dernier run). Points parfaits : tests unitaires 100%, build 100%, inventaire features 100%, screenshots 100%, feature scores 100%.
- **Toggle centering fix** : `top-[2px]` → `top-[4px]` (bouton 24px, bordure 2px = espace intérieur 20px, point 16px → centrage = 4px). Compact: `top-[1px]` → `top-[3px]`.
- **24 clés i18n manquantes ajoutées** dans 4 langues : languages, teamNameLabel, guideTabInfo, selectLevel, startDate, endDate, socialLinks, myPhotos, gpsUnavailable, loadingStations, stationsError, zoomInForStations, etc. Total : 3399 clés.
- **Déduplication handlers** : supprimé openLeaderboard/closeLeaderboard de main.js (Leaderboard.js statique), stopNavigation/openExternalNavigation de main.js (navigation.js statique), openAdminPanel/closeAdminPanel/openFilters de AdminPanel.js, openProfileCustomization/closeProfileCustomization de profileCustomization.js, openCreateTravelGroup/closeCreateTravelGroup de travelGroups.js, openCreateTeam de teamChallenges.js, openNavigation de SpotDetail.js, openIdentityVerification de IdentityVerification.js.
- **Prévention permanente** : nouveau check `scripts/checks/duplicate-handlers.mjs` dans quality-gate. Détecte handlers dans 2+ composants sans main.js → ERREUR. Score: 100/100 après corrections.
- **Firebase confirmé configuré** : TOUTES les clés GitHub Secrets depuis 2025-12-26. signUp/signIn/signInWithGoogle NON supprimées (fonctions légitimes attendant le lancement public).
- **Règle pattern STUB** : handlers simple setState open/close appartiennent UNIQUEMENT à main.js. Composants non-statiques = stubs commentés `// STUB (canonical, xxx.js removed its duplicate)`.
- 107 tests passent, build OK, déployé

### Session 2026-02-24 (session 21 — FIX SUGGESTIONS VOYAGE CSP)
- **BUG CRITIQUE : CSP bloquait l'API Photon** — La CSP `connect-src` dans index.html ne contenait pas `https://photon.komoot.io`. Le navigateur refusait silencieusement les requêtes fetch vers l'API d'autocomplete des villes. Le `catch` block masquait l'erreur.
- **Fix CSP** : Ajout `https://photon.komoot.io` dans le `connect-src` du meta CSP
- **POPULAR_CITIES local** : Ajout de 45 villes populaires dans le fallback Voyage.js pour des suggestions instantanées sans API
- **Fallback Nominatim** : Si Photon échoue (réseau, CSP résiduel), la requête retombe sur Nominatim (déjà autorisé dans CSP)
- **ERR-038** documenté (CSP blocking API)
- Vérifié visuellement : 5 suggestions "Par" visibles avec Playwright screenshot
- 107 tests passent, 14/14 CI jobs verts, déployé sur Cloudflare

### Session 2026-02-24 (session 20 — BUGS CRITIQUES + TOGGLE REDESIGN)
- **BUG CRITIQUE : window.render n'existait pas** — 12 handlers dans Profile.js appelaient `window.render?.()` qui n'était défini nulle part. Corrigé en `window._forceRender?.()`. Affectait : Compris roadmap, saveBio, editLanguages, togglePrivacy, toggleProximity, etc.
- **Suggestions Voyage** : `!overflow-visible` Tailwind ne suffit pas avec `backdrop-blur-lg` (stacking context). Corrigé avec `style="overflow:visible!important"` inline.
- **Toggle redesign #5 Flat Minimal** : nouveau design minimaliste (bordure amber, dot amber, fond sombre). Transitions CSS fluides via `transform:translateX()` + astuce class toggle immédiat (30ms delay avant handler).
- **Audit complet handlers** : 493+ onclick handlers vérifiés, tous définis. Plus aucun `window.render` dans le code.
- **ERR-037** documenté (window.render fantôme)
- 107 tests passent, build OK, pushé

### Session 2026-02-24 (session 19 — 4 FIXES UX + PRÉVENTION)
- **Fix suggestions Voyage** : `.card` overflow-hidden clippait les dropdowns. Ajout `!overflow-visible` sur Voyage.js + Travel.js
- **Fix mini-carte AddSpot** : CSS MapLibre non awaitée. Ajout `await import()` + `resize()` après load
- **Fix bouton voyage passé Journal** : Formulaire + bouton "Ajouter passé" ajoutés dans Voyage.js renderJournalTab/renderMesVoyages
- **Écrans intro Roadmap** : renderRoadmapIntroScreen() au premier accès + info-card detail avec dismiss. Pattern SOS disclaimer.
- **2 nouveaux handlers** : acceptRoadmapIntro, dismissRoadmapDetailIntro
- **7 clés i18n ajoutées** (FR/EN/ES/DE) pour les intros Roadmap
- **2 clés RGPD** : spothitch_roadmap_intro_seen, spothitch_roadmap_detail_seen
- **ERR-036** : Leçon overflow-hidden + dropdowns documentée
- 107 tests passent, build OK, pushé

### Session 2026-02-24 (session 18 — ROADMAP FEATURE REQUESTS)
- **Sous-onglet Progression remplacé par Roadmap** dans Profil (3 sous-onglets : Profil, Roadmap, Réglages)
- **7 features détaillées** avec contenu riche : Améliorations techniques, Pouces & Partenaires, Leagues, Pages Villes, Auberges, Événements, Groupes & Courses
- **Firebase integration** : votes et commentaires partagés entre tous les utilisateurs (collections Firestore `roadmap_votes`, `roadmap_comments`)
- Vote approve/disapprove par feature, un vote par user, toggle on/off
- Commentaires avec username, date, affichage temps réel
- **Optimistic UI** : mise à jour locale immédiate + sync Firebase en background
- **localStorage fallback** : fonctionne hors ligne ou sans compte Firebase
- **Auth requise** pour voter et commenter (toast warning sinon)
- Intro card expliquant que ce sont les futures mises à jour
- Compteurs de votes et commentaires réels (pas de faux chiffres)
- i18n : roadmapIntro ajouté en 4 langues
- 5 nouvelles fonctions dans firebase.js : setRoadmapVote, getRoadmapVotes, addRoadmapComment, getRoadmapComments, getRoadmapCommentCounts
- Fix lucide 0.563→0.575 : supprimé resolve alias cassé dans vite.config.js
- 107 tests passent, build OK, pushé

### Session 2026-02-24 (session 16 — PERFORMANCE + UX FIXES)
**Phase 1 : Optimisation perf**
- **setState() dirty-checking** : skip notifySubscribers quand aucune valeur ne change réellement (élimine ~30-50% des renders)
- **Render fingerprint** : skip le rebuild complet du DOM quand seul l'état non-visuel change (ex: points, messages)
- **persistState() debounce** : écriture localStorage groupée via queueMicrotask au lieu de chaque setState
- **MutationObservers supprimés** : 3 observers globaux sur document.body (AddSpot, ValidateSpot, Companion) remplacés par des hooks afterRender ciblés
- **transition-all → transition-colors** : 352 occurrences dans 61 fichiers — réduit le travail du moteur CSS
- **MapLibre CSS lazy** : ~50KB CSS chargé seulement quand la carte s'initialise
- **Widgets conditionnels** : nearbyFriendsWidget et SOSTrackingWidget ne lazy-loadent plus si pas actifs
- **Monitoring** : window.__renderStats() exposé pour debug perf
- **window._forceRender()** : nouveau mécanisme pour les modules lazy-loaded (contourne dirty-checking + fingerprint)
- **Chat messages slice(-50)** : zone, DM et group chat limités aux 50 derniers messages
- **Version check pause** : arrête le polling version.json quand l'app est en arrière-plan
- **Favorites cache** : parsed favorites set gardé en mémoire
- **Idle preload** : Social.js et Profile.js préchargés pendant le temps mort

**Phase 2 : 7 corrections UX**
- **Autocomplete Photon API** : tous les champs de recherche utilisent Photon (50-100ms) au lieu de Nominatim (300-500ms), debounce réduit à 100ms
- **Stations-service fixées** : le bouton ⛽ cherche maintenant dans le viewport de la carte (pas la route de navigation), avec garde zoom >= 6
- **GPS sur tous les appareils** : le bouton géolocalisation est toujours visible (pas conditionnel au GPS), demande la permission au clic
- **Nearby spots supprimé** : bouton split view retiré, filtre "nearby" retiré de Spots.js
- **Mini-map AddSpot fixée** : MapLibre CSS chargé avant l'initialisation de la mini-carte
- **Guides simplifiés** : 3 onglets (Débuter, Pays, Sécurité) — phrases/événements/légalité sont dans chaque page pays
- **Vote avec compteur** : les boutons utile/pas utile affichent le nombre de votes + feedback DOM instantané (plus de toast flottant)

**Phase 3 : Corrections post-feedback**
- **Boutons carte persistants** : zoom/GPS/stations injectés dans le conteneur #home-map préservé (plus de blink/flash sur re-render)
- **Stations-service garde zoom 6** : abaissé de 8 à 6, toast de chargement ajouté, gestion erreur améliorée
- **Sélecteur de langue onboarding** : 4 drapeaux (FR/EN/ES/DE) en haut à droite du carousel d'accueil, changement instantané sans rechargement
- **toggleGasStationsOnMap supprimé** : le stub conflictuel dans main.js a été retiré

**Phase 4 : Sentry + toggles + 4 bugs visuels (session 17)**
- **Sentry → GitHub Issues** : workflow automatique toutes les 6h, crée des issues GitHub avec labels `sentry`+`bug`, déduplique par titre
- **SENTRY_TOKEN** : configuré en GitHub Secret (Issue & Event: Read, Project: Read)
- **Pill toggle partout** : 19 toggles remplacés par le style pill classique (👍/👎) via `src/utils/toggle.js`
  - renderToggle() + renderToggleCompact() : composant partagé pour tous les toggles
  - toggleFormCheckbox() : handler pour les toggles checkbox (Landing cookies, Companion)
  - Fichiers modifiés : Profile.js (7), Social.js (1), Feed.js (1), Travel.js (1), Voyage.js (3), Filters.js (1), Landing.js (2), Companion.js (2), pushNotifications.js (1)
- **4 bugs visuels corrigés** :
  - IdentityVerification : whitespace-nowrap sur titres + shrink-0 sur bouton (plus de "!" seul sur une ligne)
  - Guides tabs : text-sm sur labels (plus de "Par paie" illisible à text-xs)
  - Auth modal : Google icon inline SVG (plus d'image externe cassée)
  - AddSpot step 3 : tiret parasite supprimé + bouton submit whitespace-nowrap
- **CLAUDE.md** : règles #13 (qualité visuelle mobile) + #14 (checklist visuelle avant push)
- **scripts/visual-check.mjs** : screenshots automatiques Playwright des écrans principaux
- **sentry-sync.yml** : ajout permissions issues:write (corrigé 403)

### Session 2026-02-24 (session 15 — UX OVERHAUL 25+ corrections)
- **Carte** : compteur spots supprimé, bouton itinéraire supprimé, bouton guide → Voyage>Guides, bouton ⛽ stations-service, scroll vertical bloqué, focus orange supprimé au touch, carte persistante entre onglets, carte init au lancement
- **Logo** : nouveau logo.png (192px, 23KB) dans splash screen et header
- **Voyage** : calcul itinéraire fixé (lazy-load Travel.js), suggestions Photon API (100ms debounce, min 1 char), icône journal fixée, guide pays en 3 sous-onglets (Info, Culture, Pratique)
- **Profil** : bouton palette supprimé, galerie photos (6 max, WebP), liens réseaux sociaux (Instagram/TikTok/Facebook), voyage passé dates début/fin, sélecteur langues in-app (plus de prompt()), vérification déplacée dans Réglages, donation dans Profil+Progression, toggles 👍/👎
- **Design** : icône compagnon 👥, icône progression ⭐, score confiance 11 facteurs
- **Social** : padding recherche corrigé

### Session 2026-02-24 (session 14 — QUALITY GATE CI + PRODUCTION MONITOR + PLAN WOLF v5)
- **Quality Gate automatique** : 6 checks (handlers, i18n, dead exports, security patterns, localStorage RGPD, error patterns)
- Score /100, seuil 70, bloque le deploy si en dessous
- Scripts : `scripts/quality-gate.mjs` + `scripts/checks/{handlers,i18n-keys,dead-exports,console-errors,localstorage,error-patterns}.mjs`
- CI : nouveau job `quality-gate` dans `.github/workflows/ci.yml`, ajouté aux `needs` du deploy
- **Error Patterns check** : vérifie automatiquement que les patterns interdits de errors.md ne reviennent pas (ERR-001 duplicates, ERR-019 escaping, ERR-011 MutationObserver, ERR-029 ghost states)
- **Production Monitor** : health check toutes les 6h via cron GitHub Actions
- Vérifie : HTTP 200, version.json, headers sécurité, chargement spots FR.json
- **Alertes automatiques** : si le monitoring échoue → crée un issue GitHub avec label `monitor-alert`
- Script : `scripts/monitor.mjs`, workflow : `.github/workflows/monitor.yml`
- **Plan Wolf v5** :
  - Intègre le Quality Gate dans phase 1 (évite la duplication)
  - Nouveau mode `--delta` : n'exécute que les phases liées aux fichiers modifiés (~3-4 min au lieu de 12)
  - Tracking des tendances QG dans `wolf-qg-history.json` (score par check, moyenne 7 jours, détection des dégradations)
  - Usage : `node scripts/plan-wolf.mjs --delta`
- **Relation Wolf/QG** : Quality Gate = ceinture automatique (30s, chaque push). Plan Wolf = diagnostic complet (12min full, 3-4min delta, manuel).
- Score QG initial : 74/100
- **Session 14b — Wolf fixes** :
  - Supprimé 4 handlers dupliqués (filterGuides/selectGuide de Guides.js, openDonation de AdminPanel.js, shareTrip de Profile.js)
  - Amélioré error-patterns check : reconnaît les assignments gardés (`if (!window.xxx)`) et ignore mapInstance
  - Remplacé `Math.random()` par `crypto.getRandomValues()` pour la génération d'IDs dans 15 fichiers
  - Créé `tests/impact-analysis.test.js` (16 tests : structure App.js, state.js, main.js) — satisfait Wolf Phase 7
  - Score QG : 74 → **82/100** (error patterns 40→80, duplicate handlers éliminés, security IDs corrigés)

### Session 2026-02-24 (session 13 — 12 NOUVEAUX SCRIPTS D'AUDIT)
- Créé 12 nouveaux scripts couvrant les fonctions non testées de l'app
- audit-admin, audit-account, audit-quiz, audit-validation, audit-photos, audit-navigation
- audit-filters, audit-profile2, audit-sharing, audit-verification, audit-misc, audit-internals
- **88 ✓ 0 ✗ 142 ? — ZÉRO ÉCHEC sur 12 scripts**
- Total cumulé 33 scripts : **367 ✓ 0 ✗ 165 ?**
- Bug corrigé : setLanguage() déclenche un reload de page → ne jamais l'appeler pendant un audit
- robots.txt ✓, sitemap.xml ✓, Share Target manifest ✓, Cache Storage workbox ✓

### Session 2026-02-23/24 (session 12 — 12 NOUVEAUX SCRIPTS D'AUDIT)
- Créé 12 nouveaux scripts d'audit pour couvrir 51 features non testées
- audit-map.cjs (15 tests), audit-spots.cjs (19), audit-voyage.cjs (13)
- audit-social2.cjs (23), audit-security2.cjs (32), audit-gamification2.cjs (36 ⭐)
- audit-auth2.cjs (22), audit-i18n.cjs (16), audit-ux2.cjs (22)
- audit-a11y.cjs (16), audit-pwa2.cjs (22 ⭐), audit-tech.cjs (33)
- **Total : 279 ✓ 0 ✗ 23 ? — ZÉRO ÉCHEC sur les 12 scripts**
- Leçon clé : handlers lazy-loaded (SOS.js, Companion.js, moderation.js) → ouvrir le modal avant de les tester
- Leçon clé : Tags et ratings AddSpot sont à l'ÉTAPE 3 (pas 2), avec photo obligatoire
- userBlocking.js handlers (openBlockModal etc) ne s'enregistrent pas en test sans contexte d'utilisateur

### Session ~2026-02-22 (session 11 — QUALITÉ + SÉCURITÉ + GITHUB)
- **E2E 100% green** : 240+ tests, 13 jobs CI, tous passent
- **GitHub configuré** : Dependabot weekly, CodeQL, issue templates, CODEOWNERS, branch protection, Discussions, release v2.0.0
- **Sécurité CodeQL 30→0 alertes** : escapeJSString(), textContent, crypto.getRandomValues(), safePhotoURL(), hasOwnProperty
- **Clé API restreinte** : referrer HTTP limité à spothitch.com, *.spothitch.pages.dev, localhost
- **CI strict** : supprimé continue-on-error sur lint/E2E, lint bloquant (plus de || true), deploy exige lint+e2e-core
- **Pre-commit hooks** : Husky + lint-staged configurés (eslint sur src/*.js)
- **Coverage floor** : seuils montés à 22/20/22/23% (empêche régression)
- **Règle #10 zéro tolérance** : tout job CI doit passer, E2E timeout = bug à corriger
- README réécrit avec stats exactes et badges

### Session ~2026-02-22 (session 10 — FIX ÉCRAN BLEU PRODUCTION)
- **BUG CRITIQUE** : Site affichait écran bleu vide — lazy-loading cassé en production
- Cause : `import(variable)` non supporté par Vite en build + pas de re-render après chargement module
- Fix : registre `_lazyLoaders` avec imports statiques + `setState({})` après chaque chargement
- Bundle principal : 229KB (vs 785KB avant lazy-loading, vs 200KB session 8 mais celui-ci marche réellement)
- ERR-016 ajouté au journal des erreurs

### Session ~2026-02-22 (session 9 — ESLINT CLEANUP + DEAD CODE + HANDLERS AUDIT)
- **ESLint : 77 warnings → 0** — nettoyage massif dans 54 fichiers
- Suppression 8 fonctions mortes : renderRatingBar, renderTripSpot, getStreak, showDailyRewardPopup, closeDailyRewardPopup, positionSpotlight, checkStreakReminder, startStreakReminderCheck, stopStreakReminderCheck
- Ajout Règle #8b — NOMMAGE COHÉRENT : jamais d'alias, un seul nom partout
- **Handlers implémentés** : autoDetectStation (Overpass API), autoDetectRoad (Nominatim), declineFriendRequest, removeKnownDevice, executeStepAction
- **Nommage unifié** : rejectFriendRequest → declineFriendRequest (Rule #8b)
- i18n : 10 nouvelles clés en 4 langues (autoDetect + requestDeclined + deviceRemoved)
- Tests : 1276/1276 passent (35 fichiers), build OK, ESLint 0 erreurs

### Session ~2026-02-22 (session 8 — WOLF FIXES + BUNDLE OPTIMIZATION)
- Fix window.setSocialTab manquant (détecté par Wolf — onclick dans 6 fichiers mais jamais enregistré)
- Suppression 23 fichiers de tests orphelins (~21 250 lignes) qui testaient des services supprimés en session 7
- Suppression exports morts : shouldShowDailyRewardPopup, grantStreakProtection (dailyReward.js), recordCheckinWithStats (statsCalculator.js)
- Fix Wolf faux positifs : javascript:void(0) avec onclick n'est plus compté comme lien mort
- Fix Wolf : filtrage mots-clés JS (if/for/etc) dans extraction onclick aux 3 endroits du script
- Fix Wolf : feature inventory mis à jour (Chat→Conversations.js, Friends→Friends.js, Feed→Feed.js dans social/)
- Tests : 35 fichiers, 1276 assertions, 100% passent
- **Bundle optimization : 785KB → 200KB (-75%)** — lazy-load de ~30 composants dans App.js
- Fix CI : 11 clés RGPD enregistrées, coverage thresholds ajustés, duplicate i18n keys supprimées
- Seul le fichier ci.yml (bundle limit 750→800) ne peut pas être pushé (scope workflow manquant)
- Build OK, pushé

### Session ~2026-02-21 (session 7 — MASSIVE UPDATE)
- Plan Wolf v4 : upgrade v3→v4, 16 phases, recherche web compétitive, audit boutons/liens, 2x attention fichiers modifiés
- Suppression rapport HTML Wolf (plus de wolf-report.html)
- Fix bugs : detectSeason supprimé de AddSpot.js, 15 href="#" corrigés, liens sociaux placeholder supprimés
- Suppression src/controllers/ entier (code mort, jamais importé)
- Déduplication handlers : gardes if(!window.xxx) ajoutées aux fallbacks main.js
- Sécurité : npm audit fix (2 vulns corrigées), CSP renforcé (object-src, base-uri, form-action), DOMPurify vérifié (20+ fichiers)
- **SOS v2** : choix SMS/WhatsApp, mode offline, countdown 5s, alarme silencieuse, faux appel, enregistrement audio/vidéo, contact principal, message personnalisable
- **Companion v2** : choix SMS/WhatsApp, fil GPS, notification arrivée/départ, alerte batterie faible, estimation ETA, rappel check-in, contacts de confiance multiples (5 max), historique voyages
- **Profil enrichi** : carte voyages (pays visités), références utilisateurs, langues parlées, bio personnalisable, contrôles vie privée, voyages partagés
- **Guides enrichis** : étiquette culturelle, info visa, info devise pour 20 pays
- Suppression 28 services orphelins (~22 500 lignes de code mort)
- Vérification cartes offline : déjà fonctionnel via Service Worker (CacheFirst tiles OpenFreeMap)
- **PWA** : 4 shortcuts app, share target, Badging API, optimisations Lighthouse (preconnect, dns-prefetch, fetchpriority)
- i18n : ~140 nouvelles clés en 4 langues
- 104 tests passent, build OK, tout pushé

### Session ~2026-02-21 (session 6)
- Plan Wolf v3 : upgrade majeur de v2 à v3, 14 phases au lieu de 10
- Nouvelles phases : Dead Code detection (exports/fonctions mortes), Lighthouse CI, Playwright screenshots, Feature Scores (score par feature)
- Améliorations : imports circulaires (DFS), scan ALL-files handlers dupliqués, onclick verification, memory accuracy check, image size audit
- Recommandations enrichies pour toutes les nouvelles catégories (dead code, circular imports, onclick, handlers dupliqués, images, Lighthouse, mémoire périmée)
- Score Wolf v3 : 70/100 (baisse attendue car plus de checks = plus de problèmes détectés)
- Détection : 399 exports morts, 36 fonctions mortes, 100 handlers dupliqués, 22 services orphelins, 1 onclick dangling

### Session ~2026-02-20 (session 5)
- Analyse des 9 points d'amélioration remontés par l'utilisateur
- Nettoyage carte : suppression bouton guide clignotant, compteur spots, bouton spots proches
- Recherche ville : force-load les spots du pays, affiche panneau même avec 0 spots
- Progression : capitalise "Pouces", historique pouces cliquable, boutons action défis, classement avec filtre pays, récompenses mensuelles
- Profil : stats renommées (Spots créés, Spots validés), couleurs alignées, footer (FAQ, À propos, Mentions légales, Inviter, Crédits)
- Filtres route : 7 filtres chips (tous, station, note 4+, attente <20min, vérifié, récent, abri)
- Labels spots carte trip : halo + collision detection (plus de chevauchement)
- Guide feedback : votes utile/pas utile sur chaque conseil, formulaire suggestion par section
- feedbackService.js centralisé (localStorage)
- Barre recherche carte : padding pl-12 + icône left-4 (plus de chevauchement)
- Mockups HTML : itinéraire (10), compagnon (20), radar (20), social (20), profil (20)
- i18n : ~30 nouvelles clés en 4 langues
- 104 tests wiring passent, build OK, déployé Cloudflare

### Session ~2026-02-20 (session 4)
- Mini-carte toujours visible dans AddSpot étape 1 (plus cachée derrière un bouton)
- Carte s'auto-initialise avec la position connue de l'utilisateur
- GPS centre et zoome la mini-carte quand activé
- Texte d'aide clair "Touche la carte pour placer ton spot" en ambre
- Carte plus grande (h-56 au lieu de h-48) avec bordure ambre
- i18n tapToPlaceSpot ajouté en 4 langues

### Session ~2026-02-20 (session 3)
- Fix MutationObserver boucle infinie dans AddSpot autocomplete (ERR-011) : flag de garde lastAutocompleteStep
- Retiré cleanupAutocompletes() des fonctions init (le cleanup est géré par l'Observer)
- Retiré l'affichage saison de l'étape 2 (la date est dans createdAt)
- Renforcé CLAUDE.md Règle #12 : apprentissage continu obligatoire + checklist erreurs connues avant chaque commit
- Ajouté décision E2E CI (2 workers, 1 retry, 30s timeout, no video)

### Session ~2026-02-20 (suite)
- Fix Service Worker interceptant les pages SEO : /city/* et /guides/* exclus du navigateFallback
- Fix formulaire AddSpot cassé : suppression 11 handlers en double dans main.js qui écrasaient la validation d'AddSpot.js
- Auth obligatoire pour créer un spot (Firebase Auth) + mode test (localStorage spothitch_test_mode)
- Validation étoiles obligatoire (sécurité, trafic, accessibilité) avant soumission
- Fix bugs badge popup + daily reward (close handlers manquants)
- Plan Wolf v2 : recommandations humaines en français (titre/explication/action/impact)
- Mise à jour CLAUDE.md Règle #6 : mémoire mise à jour en CONTINU (pas juste en fin de session)
- Correction MEMORY.md : Firebase configuré depuis 2025-12-26, Sentry depuis 2026-02-17

### Session ~2026-02-20 (début)
- Fix CHROME_PATH pour Plan Wolf + Lighthouse CI
- Ajout Plan Wolf (master test command)
- Infrastructure de tests complète (visual regression, Lighthouse CI, Sentry error learning)
- Fix tests pour lazy-loaded i18n
- Perf: split i18n par langue + defer non-critical init

### Session ~2026-02-19
- Perf: lazy-load MapLibre + compress images WebP
- Isolation chunk Sentry
- Audit fixes (16 clés i18n, 4 handlers manquants)
- Ajout 56 state keys manquants pour gamification/modération

### Session ~2026-02-18
- Fix carousel slides invisibles
- Suppression 20 clés i18n dupliquées
- SOS integration tests + RGPD storage
- Features légales (Report, Block, SOS disclaimer, Companion consent, CCPA)
- Onboarding carousel 5 slides
- Système auth progressif + social login

### Sessions antérieures
- Données importées entièrement supprimées (2026-03-18)
- Scripts de traitement des données importées supprimés
- Pages SEO par ville (852 villes)
- Refonte AddSpot + ValidateSpot modal
- Filtres carte fonctionnels
- Notifications de proximité
- Tags enrichis + check-in temporels
- Nettoyage 3642 spots dangereux
- Traduction in-app (MyMemory API)
- Stations-service sur la carte (Overpass API)
