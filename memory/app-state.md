# État des lieux complet SpotHitch

> Dernière mise à jour : 2026-03-13
> Ce fichier décrit l'état COMPLET de l'app : visuel, technique, services, ce qui marche, ce qui est en beta guard.
> RELIRE AU DÉBUT DE CHAQUE SESSION. METTRE À JOUR après chaque push.

---

## 1. Infrastructure & Deploy

| Service | État | Détails |
|---------|------|---------|
| **Hébergement** | Cloudflare Pages | Deploy auto depuis GitHub Actions |
| **URL prod** | spothitch.com | Branch `main` |
| **URL preview** | *.spothitch.pages.dev | Branch `dev`, auto-deploy |
| **Firebase Auth** | Configuré | Google, Email, Facebook, Apple. Secrets GitHub OK depuis 2025-12-26 |
| **Firestore** | Configuré | Users, validations, messages, events, roadmap votes/comments |
| **Firebase Storage** | Configuré | Photos spots, avatars |
| **Sentry** | Configuré | DSN + Token depuis 2026-02-17/24. Sync GitHub Issues auto 6h |
| **Cloudflare** | Configuré | Account ID + API Token depuis 2026-02-16 |
| **HTTPS** | Actif | Cert expire 2026-05-13 |
| **Affiliés** | PAS configuré | Inscription manuelle Hostelworld/Booking nécessaire |
| **GitHub** | Compte suspendu (2026-03-13) | Push impossible temporairement |

## 2. Stack technique

- **Build** : Vite 5.x, ES Modules, Tailwind CSS 4
- **Carte** : MapLibre GL JS + OpenFreeMap (tuiles gratuites)
- **Routing** : OSRM (calcul itinéraires)
- **Geocoding** : Photon API (100ms) avec fallback Nominatim
- **Auth** : Firebase Auth (Google, email, Facebook, Apple)
- **DB** : Firestore (temps réel) + localStorage (offline)
- **Spots** : 7061 spots importés dans `public/data/spots/` (137 fichiers JSON par pays)
- **i18n** : 4 langues (FR/EN/ES/DE), lazy-loaded par langue, ~4500 clés
- **Tests** : Vitest (131 wiring tests) + Playwright E2E + Quality Gate CI
- **PWA** : Service Worker Workbox, offline-first, installable

## 3. CI/CD Pipeline

| Job | Rôle | Obligatoire |
|-----|------|-------------|
| lint | ESLint | Oui |
| test | Vitest wiring + integration | Oui |
| wiring | Tests câblage handlers/modals | Oui |
| build | Vite production build | Oui |
| quality-gate | 6 checks auto (score /100, seuil 70) | Oui |
| e2e-core | Tests E2E principaux | Oui |
| e2e-features | Tests E2E features | Oui |
| e2e-comprehensive | Tests E2E exhaustifs | Oui |
| e2e-stress | Tests stress/perf | Oui |
| deploy | Cloudflare Pages | Après tout vert |

**Règle** : TOUS les jobs doivent être `success`. Aucun n'est optionnel.

## 4. Données

| Donnée | Source | Quantité | Format |
|--------|--------|----------|--------|
| Spots importés | Import initial | 7061 spots enrichis | JSON par pays |
| Spots communauté | Firebase | 0 (alpha) | Firestore |
| Guides pays | Statique | 53 pays | `guides.js` |
| Pages villes SEO | Auto-générées | 188 villes | HTML statique |
| Badges | Statique | 50+ | `gamification.js` |
| Features feedback | Statique + Firebase | 28 features | `featuresData.js` |

**IMPORTANT** : Les 7061 spots importés seront SUPPRIMÉS avant le lancement public. SpotHitch repart de zéro avec uniquement les spots communauté.

## 5. Features par état

### ACTIF (fonctionne en prod)

- Carte interactive avec clustering, marqueurs colorés (tier gris/vert/or)
- Recherche villes (Photon API, suggestions instantanées)
- Détail spot complet (photos Mapillary/Street View, ratings, reviews, infos légales)
- Création spot (wizard 3 étapes, photo WebP, 4 types, 3 critères)
- Validation spot ("Je valide" quick + "J'ai testé" formulaire complet)
- Filtres carte (note, attente, vérifiés, tri)
- 53 guides pays (légalité, phrases, urgences, culture, visa, devise)
- Panneau ville (infos + destinations depuis une ville)
- Planificateur itinéraire multi-villes (OSRM)
- Journal de voyages (historique, ajouter voyage passé)
- Système de favoris (coeur, export)
- Auth progressive (Google, email, anonyme possible)
- Profil enrichi (bio, langues, réseaux sociaux, galerie photos)
- Système d'amis Firebase (envoi/accepter/refuser, temps réel)
- Messages privés 1-on-1 Firebase (temps réel)
- Conversations de groupe
- Salons de discussion par zone
- Gamification (points, 50+ badges, titres, niveaux VIP, ligues, défis, quiz)
- Récompense quotidienne avec streak
- Leaderboard (hebdo/all-time, filtre pays)
- Boutique (cadres, titres, boosters)
- Roadmap/Feature Requests (votes + commentaires Firebase partagés)
- Panneau feedback (badge "Avis", votes par feature, 28 features à noter)
- Thème clair/sombre
- 4 langues (FR/EN/ES/DE) avec switch instantané
- PWA installable, offline, push notifications (toggle UI)
- Share Target API (recevoir partages d'autres apps)
- Accessibilité (clavier, lecteur écran, ARIA, contraste WCAG AA)
- Conformité RGPD (cookie banner, export données, suppression compte)
- SEO (188 pages villes, sitemap, structured data, Open Graph)
- Onboarding carousel 5 slides + welcome alpha popup
- Vérification identité progressive (5 niveaux)
- Score de confiance (11 facteurs)
- Signalement/blocage utilisateurs
- Admin panel (feedbacks, erreurs Sentry, outils)
- Auto-update silencieux (version.json)

### BETA GUARDS (modal "ARRIVE BIENTÔT" + vote, feature pas encore active)

Les beta guards sont des modals qui s'affichent quand l'utilisateur essaie d'accéder à une feature pas encore développée. Ils montrent une description + permettent de voter pour prioriser le développement.

- **SOS d'urgence** : SMS/GPS aux contacts, faux appel, alarme silencieuse. Code SOS.js existe mais s'ouvre en mode "feature intro" pour collecter les votes.
- **Mode Compagnon** : check-in régulier, GPS breadcrumb, alertes gardien. Code Companion.js existe mais s'ouvre en mode "feature intro".
- **Itinéraire** (dans Voyage) : planificateur de trip. S'ouvre en beta guard.
- **Radar proximité** : voir autostoppeurs proches en temps réel
- **Alertes proximité** : notification quand on passe près d'un bon spot
- **Événements** (dans Social) : meetups d'autostoppeurs

**Comment ça marche** : `showFeatureIntro(featureId)` dans `FeatureIntroModal.js`. Cherche la feature dans `FEATURES_MAP`, affiche overlay avec description + vote (Essentiel/Utile/Pas urgent). Clé localStorage `spothitch_feature_seen`.

### PAS ENCORE CONFIGURÉ

- Affiliés Hostelworld/Booking (inscription manuelle nécessaire)
- FAQ & Aide : CONTENU EXISTE (5 catégories : Général, Spots, Sécurité, Compte, Technique). Bouton caché dans Réglages alpha. Accessible via `openFAQ()` et landing footer.
- Changelog/Quoi de neuf : `openChangelog()` OUVRE LA FAQ (pas un vrai changelog). Bouton caché dans Réglages alpha.
- Liens sociaux "Nous suivre" Instagram/TikTok/Discord (pages pas encore créées, section cachée dans Réglages)

### À VENIR (planifié mais pas codé)

- Mode Gardien in-app (suivi temps réel du compagnon sur la carte du gardien)
- Suppression des spots importés (repart de zéro communauté)

---

## 6. État visuel écran par écran

### Éléments persistants (TOUS les écrans)
- **Bandeau alpha** (haut) : barre orange "Version alpha. Aide-nous à améliorer SpotHitch !" → VOULU
- **Badge "💬 Avis"** (côté gauche) : bouton feedback draggable avec compteur rouge → VOULU ET IMPORTANT, mécanisme central feedback alpha
- **Bannière cookies** (bas) : RGPD, disparaît après clic Accepter → FONCTIONNE
- **Navigation bottom** : 4 onglets (Carte, Voyage, Social, Profil) en pill flottant
- **Header** : logo + icône amis + bouton SOS rouge

### Carte
- Carte plein écran MapLibre, clusters spots, boutons zoom/GPS/stations
- Recherche : suggestions villes + "Guide autostop : NomVille" (deux-points, pas tiret)
- Bouton "Guides" bas gauche, bouton "+" orange bas droite

### Spot Detail
- Photo (Mapillary/utilisateur/placeholder), ratings en cercles, boutons valider/tester/naviguer
- Reviews, infos légales pays, spots alternatifs proches
- **IDs spots** : `hm_XX_N` (importés) ou `community_XXX` (communauté)

### Voyage
- 3 sous-onglets : Itinéraire (beta guard), Guides, Journal (défaut)
- MON BILAN TOTAL : 4 stats à 0 pour nouveau user → NORMAL
- État vide : "Aucun voyage terminé" → NORMAL

### Social
- 2 sous-onglets : Messagerie, Événements
- Salons de discussion, Cherche compagnon, Nouveau groupe (bordure fine emerald)
- État vide : "Pas encore de conversation" → NORMAL

### Profil
- 3 sous-onglets : Profil, Prochainement, Réglages
- Avatar emoji, @Voyageur, Niveau 1 · Novice, "Non connecté"
- 3 stats à 0 → NORMAL
- Sections : À propos, Langues parlées, Réseaux sociaux

### Réglages
- Vérification (3 étapes), Apparence (thème), Langue (4 drapeaux)
- Aide, légal, à propos, donation, suppression compte

### Modales
- **Filtres** : note min, attente max, vérifiés, tri
- **Ajouter spot** : wizard 3 étapes (Type/Position → Direction → Ratings/Tags)
- **SOS** : beta guard avec vote (ARRIVE BIENTÔT)
- **Auth** : Google + email, se connecter/s'inscrire, continuer sans compte
- **Roadmap** : features à venir, votes + commentaires Firebase

### Thème clair
- Fond blanc, accents orange/ambre, cards blanches, bandeau alpha visible

---

## 7. Décisions design à ne PAS remettre en question

| Élément | Décision | Raison |
|---------|----------|--------|
| Badge "Avis" flottant | Visible partout, draggable | Mécanisme central feedback alpha |
| Bandeau alpha | Toujours affiché | Phase alpha, sera retiré en beta |
| Zéros nouvel utilisateur | Normal partout | Données viennent avec l'usage |
| Beta guards | Modal "ARRIVE BIENTÔT" + vote | Collecte priorités avant dev |
| "Chargement des spots..." | Texte temporaire | Chargement lazy par pays |
| "Non connecté" sur profil | Affiché sous le badge | Auth progressive |
| Spots importés | 7061 spots affichés | Seront supprimés au lancement |
| Auth pas obligatoire | On peut utiliser l'app sans compte | Auth progressive par design |

---

## 8. Patterns techniques

- **Textes** : JAMAIS de tirets — ou - comme ponctuation (RÈGLE #16), utiliser : · , .
- **Toggles** : pill 👍/👎 via `renderToggle()` de `src/utils/toggle.js`
- **Modales** : overlay noir/blur, X en haut droite, Escape ferme
- **Feature intros** : `showFeatureIntro(featureId)` → overlay glassmorphism + vote
- **localStorage** : toutes les clés préfixées `spothitch_`
- **Handlers window.\*** : 733 fonctions globales (721 publiques + 12 internes), convention `verbNom` (ex: `openSpotDetail`, `showProfile`)
- **Lazy-loading** : composants chargés à la demande via `_lazyLoaders` dans App.js
- **i18n** : `t('key')` partout, jamais de texte hardcodé, 4 langues obligatoires
- **IDs spots** : `hm_XX_N` (importés, ex: `hm_fr_123`) ou `community_XXX`

---

## 9. Clés localStorage importantes

| Clé | Rôle |
|-----|------|
| `spothitch_v4_state` | État global app (JSON) |
| `spothitch_landing_v2` | Landing carousel vu |
| `spothitch_beta_seen` | Welcome alpha popup vu |
| `spothitch_cookies_accepted` | Cookies acceptés |
| `spothitch_feature_seen` | Features intro vues (JSON: `{ featureId: timestamp }`) |
| `spothitch_test_mode` | Mode test (bypass auth) |

---

## 10. Commandes utiles

```bash
npm run dev          # Dev server (localhost:5173)
npm run build        # Build production
npx vitest run tests/wiring/  # Tests câblage (131 tests)
npm run lint         # ESLint
node scripts/quality-gate.mjs  # Quality Gate (score /100)
node scripts/fox.mjs --quick   # Fox check rapide
node scripts/plan-wolf.mjs --delta  # Wolf delta
node scripts/visual-check.mjs  # Screenshots Playwright
node scripts/audit-complete.mjs  # Audit fonctionnel complet Playwright (22 screenshots)
```

---

## 11. Audit du 2026-03-13 : Problèmes connus

### CRITIQUE
- **openCityPanel() sans beta guard** : panneaux ville accessibles via recherche sur prod alors que feature "villes" est marquée beta dans featuresData.js. Manque dans setupBetaGuards().
- **Note :** VITE_SHOW_BETA est CORRECTEMENT configuré. Absent sur main/staging (guards actifs), présent sur dev (accès total). Le build CI l'a aussi mais ce n'est PAS le build déployé.

### MAJEUR
- **openChangelog() → ouvre la FAQ** : pas de vrai changelog
- **2 handlers dupliqués** : closeAuth (main.js + Auth.js), openDeleteAccount (main.js + DeleteAccount.js)
- **29 handlers dans tests mais pas implémentés** : navigation maps, checkin modal, admin, share
- **40+ violations RÈGLE #16** : surtout ProfileDemos.js (25+), SOS.js, FeatureSlides.js, Companion.js
- **Événements affiche faux utilisateurs** : Sarah Nomad, Marco Traveler (données démo hardcodées)

### MINEUR
- 27 aria-labels hardcodés (pas traduits, problème a11y)
- 3 placeholders hardcodés (Welcome.js, Companion.js)
- 8 features beta sans guards même quand VITE_SHOW_BETA=false (6 incomplètes + guides + villes)
