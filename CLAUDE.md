# CLAUDE.md - Guide de développement SpotHitch

> **RÈGLE #0 — AUCUNE PERMISSION** : NE JAMAIS demander la permission pour exécuter des commandes bash, lire des fichiers, ou faire des opérations techniques. AGIR directement. La seule exception = les décisions PRODUIT (ce qu'on construit, pas comment on le construit).

> **RÈGLE #21 — MAXIMUM 1 TÂCHE EN ARRIÈRE-PLAN** (ABSOLUMENT OBLIGATOIRE) :
> - JAMAIS plus de 1 agent ou commande bash en arrière-plan (`run_in_background`) en même temps
> - Avant de lancer un agent ou une commande en arrière-plan → vérifier qu'il n'y en a PAS déjà un en cours
> - Si un agent/commande tourne déjà en arrière-plan → ATTENDRE qu'il finisse avant d'en lancer un autre
> - Préférer les appels en SÉQUENTIEL (un après l'autre) plutôt qu'en parallèle quand c'est des tâches lourdes
> - Les appels parallèles légers (lecture de fichiers, grep, glob) restent OK car ils ne consomment pas de ressources
> - Cette règle existe parce que trop de tâches en arrière-plan simultanées font CRASHER la session (crash du 2026-03-20)

> **RÈGLE #1 — BRANCHES ET DEPLOY** :
>
> **Structure des branches (OBLIGATOIRE) :**
> - `feature/xxx` → UNE branche par fonctionnalité. Créer depuis `dev`. Tests CI uniquement, pas de deploy.
> - `dev` → rassemble les features terminées. Deploy auto sur URL preview Cloudflare.
> - `main` → version alpha stable pour les testeurs sur spothitch.com. JAMAIS toucher sans ordre explicite d'Antoine.
>
> **Workflow obligatoire pour chaque feature :**
> 1. `git checkout dev && git pull origin dev` → partir de dev à jour
> 2. `git checkout -b feature/nom-feature` → créer la branche feature
> 3. Développer + commits réguliers sur `feature/nom-feature`
> 4. `npx vitest run tests/wiring/` + `npm run build` → tout doit passer
> 5. `git checkout dev && git merge feature/nom-feature && git push origin dev` → merger dans dev
> 6. `git branch -d feature/nom-feature` → supprimer la branche feature locale
>
> **Merger dev → main (UNIQUEMENT sur ordre d'Antoine) :**
> `git checkout main && git merge dev && git push origin main && git checkout dev`
>
> **Règles push :**
> - Push sur `feature/xxx` → automatique après chaque modification
> - Push sur `dev` → automatique après merge d'une feature
> - Push sur `main` → JAMAIS sans ordre explicite d'Antoine
> - `git add` FICHIERS SPÉCIFIQUES UNIQUEMENT — JAMAIS `git add -A` ou `git add .`
> 6. Regrouper les modifications liées en un seul push quand c'est possible
> 7. Avant `git add` → TOUJOURS `git diff --stat` pour vérifier qu'il n'y a PAS de fichiers inattendus (suppressions, fichiers générés, fichiers de données)

> **RÈGLE #2 — JAMAIS DIRE "C'EST BON" SI C'EST PAS PARFAIT** :
> - Si quelque chose casse → corriger jusqu'à ce que ça marche PARFAITEMENT
> - NE JAMAIS dire "c'est fait" sans avoir VÉRIFIÉ (tests passent, build OK, site répond)
> - Après chaque deploy → vérifier que le site charge, pas d'erreur console
> - Si un doute → vérifier encore plutôt que supposer
> - Si ça marche pas → trouver une solution, pas juste signaler le problème

> **RÈGLE #2b — VÉRIFICATION VISUELLE OBLIGATOIRE** :
> - Après TOUT changement UI/visuel → prendre un screenshot Playwright AVANT de dire "c'est fait"
> - Vérifier les screenshots soi-même : le contenu est-il VISIBLE ? Le layout est-il correct ?
> - Tester avec `localStorage.clear()` pour simuler un nouvel utilisateur
> - Si un élément est censé apparaître → vérifier qu'il apparaît VRAIMENT (pas juste que le DOM existe)
> - Commande : `node -e "const {chromium}=require('playwright');..."` avec viewport mobile 390x844
> - Montrer le screenshot à l'utilisateur AVANT de push
> - Vérifier au minimum : 1) contenu visible 2) texte lisible 3) boutons cliquables 4) pas de zone vide inexpliquée
> - Si le fond est sombre → vérifier que le texte n'est PAS invisible (même couleur que le fond)

> **RÈGLE #2c — SCREENSHOT AVANT ET APRÈS — ZÉRO RÉGRESSION** (RÈGLE ABSOLUE) :
> - **AVANT toute modification** → screenshot des écrans/fonctions TOUCHÉS par le changement
> - **APRÈS la modification** → screenshot des MÊMES écrans pour comparer
> - **Comparer visuellement AVANT vs APRÈS** : tout ce qui existait avant doit encore fonctionner après
> - **Tester les 3 profils utilisateurs** pour CHAQUE changement :
>   1. Nouvel utilisateur (localStorage vide) — vérifier que le nouveau comportement marche
>   2. Utilisateur existant (state avec points/username) — vérifier qu'AUCUNE régression
>   3. Utilisateur connecté Firebase — vérifier que les actions authentifiées marchent
> - **Si un changement touche des wrappers/intercepteurs** (window.*, handlers, middlewares) → tester TOUS les boutons/actions interceptées, pas juste le cas nominal
> - **Si un changement introduit une nouvelle clé localStorage** → tester la migration pour les utilisateurs existants qui n'ont PAS cette clé
> - NE JAMAIS push sans avoir vérifié que les fonctions existantes marchent toujours — une feature cassée est pire qu'une feature manquante
> - Cette règle a été ajoutée après que les wrappers "premier clic" aient cassé tous les boutons de la carte pour les utilisateurs existants (2026-03-04)

> **RÈGLE #3 — PARLER SIMPLE** :
> - L'utilisateur ne code PAS. Tout expliquer simplement.
> - Pas de jargon sans explication ("push" = envoyer le code sur le site)
> - Quand je pose une question : expliquer les options ET ce que je recommande, avec pourquoi
> - Après un changement visuel : décrire ce que l'user VERRA sur son téléphone
> - Donner l'URL ou la manip exacte pour voir le résultat

> **RÈGLE #4 — AGIR, PAS DEMANDER** :
> - Si la règle dit de le faire → le faire sans demander
> - Poser des questions uniquement pour les VRAIES décisions produit (pas les décisions techniques)
> - Ne jamais demander confirmation pour quelque chose de technique que l'user ne peut pas juger

> **RÈGLE #5 — CHECKLIST QUALITÉ À CHAQUE CHANGEMENT** :
> À chaque modification, se poser TOUTES ces questions :
> - L'utilisateur va comprendre et aimer ?
> - Un débutant qui ouvre l'app pour la 1ère fois va s'y retrouver ?
> - Une fille seule la nuit se sentirait en sécurité avec cette feature ?
> - Ça marche sans internet ou avec une connexion lente ?
> - Ça marche sur un vieux téléphone pas cher ?
> - C'est traduit dans les 4 langues (FR/EN/ES/DE) ?
> - Les données sont protégées (RGPD, vie privée) ?
> - Google va trouver le site (SEO) ?
> - C'est légal partout ?
> - Ça peut rapporter de l'argent un jour ?
> - Ça tiendra avec 100 000 utilisateurs ?
> - Ça donne envie de revenir et d'inviter ses potes ?
> - C'est mieux que la concurrence ?
> - Les données seront fiables et utiles ?
> - Ça coûte combien à faire tourner ?
> - C'est facile à maintenir et faire évoluer ?
> - Tout le monde peut l'utiliser (handicap, daltonien) ?
> - La communauté va bien réagir ?
> - C'est la solution la plus SIMPLE qui marche ?

> **RÈGLE #6 — MÉMOIRE** :
> - Relire MEMORY.md + decisions.md + features.md au DÉBUT de chaque session — OBLIGATOIRE
> - Mettre à jour MEMORY.md + decisions.md + features.md après CHAQUE changement — pas à la fin, EN CONTINU
> - Après chaque commit/push → mettre à jour immédiatement les fichiers mémoire avec ce qui a changé
> - NE JAMAIS laisser des infos périmées (chiffres, états, TODO déjà faits, APIs déjà configurées)
> - NE JAMAIS proposer une feature qui EXISTE DÉJÀ → vérifier features.md d'abord
> - NE JAMAIS demander à l'utilisateur ce qui a déjà été fait — le retrouver soi-même
> - NE JAMAIS contredire la mémoire sans vérifier d'abord (ex: dire "Firebase pas configuré" alors que MEMORY.md dit le contraire)
> - Si un doute sur l'état d'un service → vérifier avec `gh secret list` ou les fichiers de config, pas deviner

> **RÈGLE #7 — CÂBLAGE** : Chaque nouvelle feature/modal/composant DOIT inclure :
> 1. Ajouter les handlers `window.*` dans `MAIN_JS_HANDLERS` de `tests/wiring/globalHandlers.test.js`
> 2. Ajouter un `testModalFlag(...)` dans `tests/wiring/modalFlags.test.js`
> 3. Ajouter un bloc `describe('Integration: NomModal')` dans `tests/integration/modals.test.js`
> 4. `npx vitest run tests/wiring/ tests/integration/modals.test.js` → tout passe

> **RÈGLE #8 — i18n** : TOUT en t('key'), 4 langues (FR/EN/ES/DE), jamais de texte hardcodé

> **RÈGLE #16 — ZÉRO TIRET DANS LES TEXTES** (ABSOLUMENT OBLIGATOIRE) :
> - JAMAIS de tiret ( - ou — ) comme ponctuation dans les textes visibles par l'utilisateur
> - Les seuls tirets autorisés sont ceux dans les mots composés (auto-stop, hors-ligne, check-in, etc.)
> - Remplacer par : un point (.), une virgule (,), deux-points (:), un point médian (·) ou reformuler la phrase
> - Exemples interdits : "Carte des spots — trouve le meilleur endroit", "SOS SpotHitch - Position en temps réel"
> - Exemples corrigés : "Carte des spots. Trouve le meilleur endroit", "SOS SpotHitch · Position en temps réel"
> - S'applique aux 4 langues (FR/EN/ES/DE), aux textes i18n ET aux textes hardcodés
> - Raison : les tirets en milieu de phrase sont un tic d'écriture IA, ça se voit et c'est inutile
> - Cette règle s'applique aussi aux mockups, designs, et tout texte écrit pour l'app

> **RÈGLE #17 — FOX EN DÉBUT DE SESSION** (OBLIGATOIRE) :
> - Au DÉBUT de chaque session, lancer `node scripts/fox.mjs --quick` et vérifier le résultat
> - Si le score est < 80 → corriger les layers rouges AVANT de travailler sur la demande d'Antoine
> - Le Fox quick prend ~30s et vérifie les layers 4-6 (visual, functional, share target)
> - Ne JAMAIS commencer à coder une feature si le Fox quick est rouge
> - L'historique des scores est sauvé automatiquement dans `memory/fox-history.json`
> - Objectif : jamais de session qui commence sur une base instable

> **RÈGLE #18 — COUVERTURE E2E TOTALE** (ABSOLUMENT OBLIGATOIRE) :
> - **Carte de couverture** : `memory/e2e-coverage-map.md` contient l'inventaire COMPLET des ~200+ flux testables. La consulter AVANT et APRÈS chaque modification.
> - **AVANT de modifier du code** : identifier tous les flux impactés dans la carte de couverture. Vérifier qu'ils ont un test E2E.
> - **APRÈS chaque modification** : vérifier que les tests E2E des flux impactés passent encore. Si un flux change, chercher les RÉPERCUSSIONS (autres flux qui dépendent du même code) et les tester aussi.
> - **Scan régulier** : à chaque session, scanner le code pour trouver de nouveaux flux non testés (nouveaux handlers `window.*`, nouvelles modals, nouveaux événements, nouveaux formulaires). Comparer avec la carte de couverture et ajouter les manquants.
> - **Si un nouveau handler `window.*` est créé** → ajouter un test E2E dans la même session, pas "plus tard"
> - **Si un test E2E échoue après une modification** → c'est un bug. Le corriger AVANT de push.
> - **Commande de vérification** : `grep -c "test(" e2e/*.spec.js` pour compter les tests par fichier
> - **Objectif** : 0 flux utilisateur sans test E2E. Chaque bouton, chaque formulaire, chaque geste, chaque raccourci.

> **RÈGLE #8b — NOMMAGE COHÉRENT** :
> - JAMAIS créer d'alias (`window.openX = window.showX`) — utiliser UN SEUL nom partout
> - Quand une fonction `window.*` est créée, utiliser le MÊME nom dans : le code, les onclick HTML, les tests, le Wolf
> - Si un nom existe déjà dans le code → réutiliser ce nom, ne PAS en inventer un nouveau
> - Convention : `window.verbNom` (ex: `showCompanionModal`, `openSpotDetail`, `submitNewSpot`)
> - Si le Wolf attend un nom différent du code → corriger le Wolf, PAS ajouter un alias

> **RÈGLE #9 — SÉCURITÉ GIT** :
> - JAMAIS `git add -A` ou `git add .` → toujours lister les fichiers un par un
> - Avant chaque commit → `git diff --stat HEAD` pour vérifier EXACTEMENT ce qui va être commité
> - Si des fichiers inattendus apparaissent (suppressions de données, fichiers JSON de spots) → S'ARRÊTER et investiguer
> - JAMAIS exécuter de scripts destructifs (order66, migrations, purge) sans confirmation EXPLICITE de l'utilisateur
> - Si un `git add -A` a été fait par erreur → `git reset HEAD` immédiatement avant de commiter

> **RÈGLE #10 — CI/CD VÉRIFICATION (ZÉRO TOLÉRANCE)** :
> - Après chaque push → attendre et vérifier `gh run view` pour confirmer que TOUS les jobs passent
> - **TOUS les jobs DOIVENT passer, y compris les E2E** — il n'y a AUCUN job "non-bloquant" ou "optionnel"
> - Si un job E2E échoue (timeout, failure, flaky) → le corriger IMMÉDIATEMENT dans la même session
> - **NE JAMAIS dire "c'est bon" ou "c'est déployé" si un seul job est en échec** — même un E2E
> - Les "cancelled" sont normaux (push suivant trop rapide), les "failure" doivent être investigués et corrigés
> - **NE JAMAIS dire "déployé" ou "en ligne" tant que le CI n'est pas passé au vert** — dire "poussé sur GitHub" quand c'est push, et "déployé" UNIQUEMENT après avoir vérifié `gh run view` et confirmé que le deploy Cloudflare est completed/success
> - **Si un test E2E timeout** → c'est un bug du test, pas un problème acceptable. Corriger : ajouter des early return guards, augmenter les timeouts, simplifier le test. Un test qui timeout = un test cassé.
> - **Checklist CI après chaque push** :
>   1. `gh run view` → TOUS les jobs (lint, test, wiring, build, e2e-core, e2e-features, e2e-comprehensive, e2e-stress, deploy) doivent être `success`
>   2. Si un seul est `failure` → corriger et re-push avant de dire quoi que ce soit à l'utilisateur
>   3. Vérifier le nombre de tests passed/failed dans chaque E2E job — 0 failed obligatoire

> **RÈGLE #15 — PROPAGATION D'ERREUR AUTOMATIQUE** (ABSOLUMENT OBLIGATOIRE) :
> - Dès qu'un bug est trouvé (par Antoine OU par moi), IMMÉDIATEMENT chercher si le même pattern existe ailleurs dans le code
> - Ne JAMAIS corriger un bug de façon isolée sans faire ce scan — c'est la règle, pas une option
> - Exemples : handler lazy sans stub → scanner tous les modals. Règle Firestore manquante → scanner toutes les collections. Clé i18n absente → vérifier les 4 langues. Race condition auth → vérifier tous les flux auth.
> - Le scan se fait AVANT de push, dans la même branche/commit
> - Si d'autres instances sont trouvées → les corriger dans le même commit, pas dans un commit séparé
> - Cette règle a été ajoutée le 2026-03-05 après qu'Antoine ait dû signaler manuellement que le bug openDeleteAccount existait aussi pour 8 autres handlers

> **RÈGLE #12 — JOURNAL DES ERREURS + APPRENTISSAGE CONTINU** (ABSOLUMENT OBLIGATOIRE) :
> - Après CHAQUE bug trouvé → ajouter une entrée dans `memory/errors.md` avec : date, gravité, description, cause racine, correction, leçon apprise, fichiers, statut
> - Après CHAQUE correction → mettre à jour l'entrée avec la solution et la leçon
> - **AVANT de coder quoi que ce soit** → relire `memory/errors.md` EN ENTIER pour ne PAS reproduire les mêmes erreurs
> - **Appliquer ACTIVEMENT les leçons** : chaque leçon dans errors.md est une règle permanente. Si une leçon dit "Ne JAMAIS faire X" → ne JAMAIS le refaire. Si elle dit "Toujours vérifier Y" → TOUJOURS le vérifier.
> - **Évoluer en continu** : le journal d'erreurs est la MÉMOIRE VIVANTE. Chaque bug corrigé rend le code futur meilleur. Ne JAMAIS reproduire une erreur déjà documentée — c'est la règle la plus importante.
> - Le Plan Wolf analyse ce fichier — les leçons non appliquées font baisser le score
> - Format : ERR-XXX avec gravité CRITIQUE / MAJEUR / MINEUR
> - Une "leçon" doit être **actionnable** ("Ne JAMAIS faire X" ou "Toujours vérifier Y") — pas juste "c'était un bug"
> - **Checklist erreurs connues à vérifier AVANT chaque commit** :
>   - Pas de handlers `window.*` dupliqués entre fichiers (ERR-001)
>   - Les actions qui écrivent des données vérifient Firebase Auth (ERR-002)
>   - Tout champ marqué * a une validation côté code (ERR-003)
>   - Les sélecteurs CSS matchent le HTML réel du template (ERR-008)
>   - La validation existe au passage d'étape ET à la soumission finale (ERR-009)
>   - Pas de MutationObserver qui modifie le DOM qu'il observe sans garde (ERR-011)
>   - ZÉRO test E2E en échec — tout timeout ou failure doit être corrigé immédiatement (ERR-018)
>   - Utiliser `escapeJSString()` pour les onclick, JAMAIS `.replace(/'/g, "\\'")` (ERR-019)
>   - JAMAIS `innerHTML` avec des variables non échappées — utiliser `textContent` (ERR-019)
>   - JAMAIS `Math.random()` pour des IDs de sécurité — utiliser `crypto.getRandomValues()` (ERR-019)

> **RÈGLE #11 — AUDIT COMPLET AVANT LIVRAISON** :
> - À la fin de chaque session ou avant une livraison majeure, exécuter EN PARALLÈLE :
>   1. `npx vitest run` (TOUS les tests, pas juste wiring)
>   2. `npm run build`
>   3. `npx eslint src/` (0 erreurs obligatoire)
>   4. `node scripts/audit-rgpd.mjs`
>   5. Screenshots Playwright de chaque feature modifiée
>   6. `gh run view` du dernier CI
> - NE PAS dire "c'est terminé" tant que les 6 checks ne sont pas verts

> **RÈGLE #20 — TESTS OBLIGATOIRES AVANT CHAQUE PUSH + CORRECTION AUTOMATIQUE** (ABSOLUMENT OBLIGATOIRE) :
> - **AVANT chaque `git push`** → lancer `npx vitest run tests/wiring/` + `npm run build`. Si un seul test échoue → CORRIGER avant de push. JAMAIS push avec un test cassé.
> - **Si un test échoue après une modification** → c'est que la modification a cassé une fonction existante. Le test montre EXACTEMENT ce qui est cassé. Trouver la cause, corriger le code (pas le test), re-lancer les tests, et ne push que quand tout est vert.
> - **Si un test de régression échoue** (`e2e/regression.spec.js` ou `tests/wiring/networkGuards.test.js`) → c'est un BLOQUEUR ABSOLU. Ces tests protègent des fonctions critiques. Ne JAMAIS contourner ou supprimer un test de régression pour faire passer le CI.
> - **Quand une nouvelle feature est ajoutée** → ajouter les tests correspondants DANS LE MÊME COMMIT :
>   1. Tests wiring dans `tests/wiring/` (handlers existent)
>   2. Tests comportementaux dans `e2e/regression.spec.js` (la feature marche vraiment)
>   3. Mettre à jour `memory/e2e-coverage-map.md` (marquer ✅)
> - **Quand une feature existante est modifiée** → vérifier que ses tests passent toujours. Si le comportement change, mettre à jour les tests pour refléter le NOUVEAU comportement attendu.
> - **Couverture E2E** : `node scripts/check-e2e-coverage.mjs` vérifie que les handlers window.* sont couverts par les tests. Le seuil est à 30% minimum (objectif : 80%+). Ce seuil ne doit JAMAIS baisser.
> - **Ordre de priorité quand un test échoue** :
>   1. Comprendre POURQUOI le test échoue (lire le message d'erreur)
>   2. Vérifier si c'est la modification qui a cassé quelque chose (git diff)
>   3. Corriger le CODE source, pas le test (sauf si le test est obsolète)
>   4. Re-lancer les tests
>   5. Push seulement quand TOUT est vert
> - Cette règle existe parce que des modifications innocentes ont cassé des fonctions critiques (mode hors ligne, partage Google Maps) sans que personne ne s'en rende compte avant que les utilisateurs signalent le problème

> **RÈGLE #13 — QUALITÉ VISUELLE MOBILE** :
> - TOUT changement UI doit être testé sur viewport 390x844 (iPhone 14)
> - Vérifier CHAQUE écran modifié avec un screenshot Playwright AVANT de push
> - Checklist visuelle obligatoire :
>   - Texte lisible (pas trop petit, pas coupé, pas de retour à la ligne parasite)
>   - Boutons cliquables (min 44x44px touch target)
>   - Pas de débordement horizontal (overflow-x)
>   - Icônes visibles (pas d'image cassée, pas de carré vide)
>   - Espacement cohérent (pas de texte collé, pas de zones vides)
>   - Alignement correct (flex/grid, pas de décalage)
>   - Toggles : style pill classique avec 👍/👎 (renderToggle de src/utils/toggle.js)
>   - Les labels ne sont pas tronqués ou coupés (whitespace-nowrap si nécessaire)
> - Exemples de bugs à ÉVITER :
>   - Point d'exclamation seul sur une ligne (texte mal découpé)
>   - Bouton texte qui passe sur 2 lignes (whitespace-nowrap manquant)
>   - Icône externe cassée (toujours utiliser SVG inline ou icons.js)
>   - Tiret parasite ou placeholder visible (supprimer les placeholders inutiles)
>   - Texte illisible car trop petit (text-xs minimum, préférer text-sm)

> **RÈGLE #14 — CHECKLIST VISUELLE AVANT PUSH** :
> - Avant CHAQUE push, exécuter `node scripts/visual-check.mjs` si des fichiers UI ont changé
> - Le script prend des screenshots automatiques de : Carte, Profil, Voyage, Social, Guides, Auth, AddSpot, SOS
> - Vérifier visuellement CHAQUE screenshot pour détecter les régressions
> - Si un élément visuel est cassé → corriger AVANT le push
> - Les screenshots sont sauvegardés dans `audit-screenshots/` pour référence

> **RÈGLE #19 — EXHAUSTIVITÉ TOTALE** (ABSOLUMENT OBLIGATOIRE) :
> - Quand Antoine demande "tout", "tous", "toutes les solutions", "tout ce qui peut être corrigé", "liste complète", "analyse complète" → c'est LITTÉRALEMENT TOUT. Pas 10, pas 20, pas "les principaux". TOUT sans exception.
> - **PROCÉDURE OBLIGATOIRE quand "tout" est demandé :**
>   1. UTILISER extended thinking (hyper-think) pour faire l'analyse COMPLÈTE en interne AVANT de répondre
>   2. Lancer TOUS les outils d'analyse disponibles en parallèle (QG, Fox, vitest, eslint, grep, etc.)
>   3. Croiser TOUTES les sources : Fox layers, Quality Gate checks, tests E2E, tests unitaires, audit RGPD, eslint, build warnings, console errors
>   4. Compiler la liste COMPLÈTE en interne
>   5. Donner la liste ENTIÈRE d'un seul coup dans UNE SEULE réponse
> - **INTERDICTIONS :**
>   - JAMAIS dire "voici les principaux" ou "les plus importants" → TOUT donner
>   - JAMAIS dire "il y en a d'autres" ou "je peux continuer" → tout mettre dès la première réponse
>   - JAMAIS livrer en plusieurs fois (10 maintenant, 10 après) → TOUT d'un coup
>   - JAMAIS filtrer ou prioriser sauf si Antoine le demande explicitement
>   - JAMAIS arrondir ("une trentaine") → donner le nombre EXACT
> - **VÉRIFICATION :** Après avoir compilé la liste, se poser la question : "Est-ce que j'ai VRAIMENT tout couvert ? Est-ce qu'il reste des sources non consultées ?" Si oui → les consulter AVANT de répondre.
> - Si la liste est très longue (50+) → la structurer par catégorie mais TOUT inclure, ne RIEN couper
> - Cette règle a été ajoutée parce que le problème s'est reproduit PLUSIEURS FOIS malgré les demandes répétées d'Antoine

---

## Vue du Projet

**SpotHitch v2.0** - La communauté des autostoppeurs. PWA pour trouver et partager les meilleurs spots d'auto-stop (14 669 spots, 137 pays).

Site : **spothitch.com** (GitHub Pages, auto-deploy via GitHub Actions)

### Stack Technique
Vite 5.x | JavaScript ES Modules | Tailwind CSS 4 | MapLibre GL JS + OpenFreeMap | Firebase (Auth, Firestore) | Vitest | Playwright | Sentry | vite-plugin-pwa | GitHub Actions | ESLint + Prettier

### Structure
```
src/
├── components/          # UI (App.js, Header.js, Navigation.js, SpotCard.js)
│   ├── views/           # Home.js, Spots.js, Chat.js, Profile.js
│   └── modals/          # AddSpot.js, Auth.js, SOS.js, SpotDetail.js, Tutorial.js, Welcome.js
├── services/            # firebase.js, notifications.js, osrm.js, sentry.js + services
├── stores/state.js      # État global
├── i18n/index.js        # Traductions FR/EN/ES/DE
├── utils/               # a11y.js, image.js, seo.js, storage.js, prefetch.js
├── styles/main.css      # Tailwind
├── data/spots.js        # Vide (spots chargés dynamiquement via spotLoader.js)
└── main.js              # Point d'entrée + auto-reload (version.json)
public/data/spots/       # 137 fichiers JSON pays
tests/                   # Tests unitaires Vitest (88 tests wiring)
e2e/                     # Tests E2E Playwright
```

### Commandes
```bash
npm run dev          # Dev server
npm run build        # Build production
npm run test:run     # Tests unitaires (une fois)
npm run test:e2e     # Tests E2E
npm run lint         # Linting
node scripts/quality-gate.mjs  # Quality Gate (6 checks, score /100, seuil 70)
node scripts/monitor.mjs       # Health check production
node scripts/plan-wolf.mjs --delta  # Plan Wolf delta (fichiers modifiés uniquement)
```

### Conventions
- ES Modules (import/export), pas de point-virgule (Prettier), 2 espaces, camelCase (vars), PascalCase (composants)
- localStorage pour persistence services, clés préfixées `spothitch_`

### Variables d'environnement (.env.local)
```
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID,
VITE_SENTRY_DSN (optionnel)
```

---

## TODO actuel

- [x] ~~HTTPS~~ : Certificat SSL actif, HTTPS forcé (2026-02-12)
- [x] ~~Sentry~~ : DSN + Token configurés (2026-02-17), sync GitHub Actions (2026-02-24)
- [ ] Affiliés : s'inscrire Hostelworld + Booking (action user manuelle)

---

## Décisions Importantes

Voir `/memory/decisions.md` pour l'historique complet.

| Décision | Raison |
|----------|--------|
| Vite | Build rapide, HMR, ES Modules natifs |
| Tailwind CSS local | Performance, pas de CDN |
| 3 critères spots (sécurité, trafic, accessibilité) | Simple et suffisant |
| Direction toujours obligatoire | Le coeur de l'app = trouver un spot VERS une destination |
| 4 types de spots | Sortie de ville, station, bord de route, autre |
| Photo optionnelle en alpha | Les testeurs créent des spots de mémoire sans avoir les photos |
| Auto-reload via version.json | L'user voit les changements sans vider le cache |
| Pas de paywall | Les autostoppeurs sont fauchés |

---

## Problèmes Connus

| Problème | Statut |
|----------|--------|
| ~~HTTPS pas encore actif~~ | RÉSOLU — HTTPS actif + forcé (cert expire 2026-05-13) |
| Firebase non configuré | Config GitHub Secrets nécessaire |

---

## Services — voir features.md pour l'inventaire complet
