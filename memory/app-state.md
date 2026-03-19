# État des lieux complet SpotHitch

> Dernière mise à jour : 2026-03-15
> Ce fichier décrit l'état COMPLET de l'app : visuel, technique, services, ce qui marche, ce qui est en beta guard.
> RELIRE AU DÉBUT DE CHAQUE SESSION. METTRE À JOUR après chaque push.

---

## 1. Infrastructure & Deploy

| Service | État | Détails |
|---------|------|---------|
| **GitHub** | Nouveau compte `spothitch` | Ancien compte `antoine626` suspendu. Repo: github.com/spothitch/Spothitch |
| **Hébergement** | Cloudflare Pages | Deploy auto depuis GitHub Actions (ci.yml) |
| **URL prod** | spothitch.com | Branch `main`, deploy via wrangler |
| **URL preview** | *.spothitch.pages.dev | Branch `dev`, auto-deploy |
| **Firebase Auth** | Configuré | Google, Email. Secrets GitHub OK (nouveau repo) |
| **Firestore** | Configuré | Users, validations, messages, events, roadmap votes/comments |
| **Firebase Storage** | Configuré | Photos spots, avatars |
| **Sentry** | Configuré + optimisé | DSN dans secrets GitHub. Filtres agressifs (réseau, WebGL, extensions), rate limit 5/min, traces 2%, un seul error handler. Intégration Sentry → GitHub active. |
| **Worker Cloudflare** | Déployé | `spothitch-resolve-map-url.antoine-v-ville.workers.dev` résout les URLs courtes Google Maps avec coordonnées exactes via embed |
| **Cloudflare** | Configuré | Account ID + API Token dans secrets GitHub |
| **Monitoring** | UptimeRobot | Surveillance spothitch.com toutes les 5 min (remplace ancien workflow monitor.yml) |
| **HTTPS** | Actif | Géré par Cloudflare |
| **Affiliés** | PAS configuré | Inscription manuelle Hostelworld/Booking nécessaire |
| **Dons PayPal** | Actif | paypal.me/antoineville. Bouton dans Profil + Réglages. Montants 3/10/50€ + libre |

### Secrets GitHub (11 configurés)
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`, `VITE_SENTRY_DSN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `E2E_TEST_PASSWORD`

### Workflows GitHub Actions (2 restants, conformes)
- `ci.yml` : lint, tests, build, E2E, Fox, deploy (100% légitime)
- `codeql.yml` : analyse sécurité statique (outil GitHub natif)
- **Supprimés** (2026-03-14) : `monitor.yml`, `sentry-sync.yml`, `nightly-rebuild.yml`, `sync-spots.yml` (causaient la suspension du compte)

## 2. Stack technique

- **Build** : Vite 5.x, ES Modules, Tailwind CSS 4
- **Carte** : MapLibre GL JS + OpenFreeMap (tuiles gratuites)
- **Routing** : OSRM (calcul itinéraires)
- **Geocoding** : Photon API (100ms) avec fallback Nominatim
- **Auth** : Firebase Auth (Google, email)
- **DB** : Firestore (temps réel) + localStorage (offline)
- **Spots** : 3026 spots importés dans `public/data/spots/` (74 fichiers JSON par pays, filtrés >= 2 reviews, 6 types, destinations avec %, commentaires/descriptions supprimés)
- **i18n** : 4 langues (FR/EN/ES/DE), lazy-loaded par langue, ~4500 clés
- **Tests** : Vitest (131 wiring tests) + Playwright E2E + Quality Gate CI
- **PWA** : Service Worker Workbox, offline-first, installable

## 3. CI/CD Pipeline (17 jobs, tous obligatoires)

| Job | Rôle |
|-----|------|
| lint | ESLint |
| test | Vitest unit tests |
| wiring | Tests câblage handlers/modals |
| i18n-lint | Vérification clés i18n |
| rgpd-audit | Audit RGPD |
| error-registry | Audit registre erreurs |
| quality-gate | 6 checks auto (score /100, seuil 90) |
| build | Vite production build + bundle size check |
| lighthouse | Lighthouse CI |
| e2e-core | Tests E2E principaux |
| e2e-features | Tests E2E features |
| e2e-comprehensive | Tests E2E exhaustifs |
| e2e-stress | Tests stress/perf |
| e2e-firebase | Tests auth/Firestore/social |
| fox | Fox 26-Layer Quality Check |
| deploy | Cloudflare Pages (main → spothitch.com) |
| deploy-dev | Cloudflare Pages (dev → preview) |

**Optimisation CI (2026-03-14)** : feature/* = lint+tests+build seulement. dev = +E2E core/features +Fox quick. main = tout (E2E complet + Fox 26 layers + Lighthouse + Firebase).

**Règle** : TOUS les jobs doivent être `success`. Le dernier CI complet sur main (2026-03-14 15h05) : 17/17 verts + deploy Cloudflare OK.

**Incident 2026-03-14** : le CI était bloqué de 10h06 à 15h05 (5h) à cause de : clé RGPD non enregistrée (spothitch_alpha_code) + clé i18n dupliquée (downloading) + quality gate ratchet regression. Aucun deploy pendant ce temps. Leçon : toujours vérifier `gh run view` après chaque push.

## 4. Données

| Donnée | Source | Quantité | Format |
|--------|--------|----------|--------|
| Spots importés | Import initial, retraité 2026-03-15 | 3026 spots (74 pays, 6 types, destinations avec %, sans commentaires) | JSON par pays |
| Spots communauté | Firebase | 0 (alpha) | Firestore |
| Guides pays | Statique | 53 pays | `guides.js` |
| Pages villes SEO | Supprimées | 0 (nettoyage 2026-03-14) | — |
| Badges | Statique | 50+ | `gamification.js` |
| Features feedback | Statique + Firebase | 28 features | `featuresData.js` |

**IMPORTANT** : Les 3026 spots importés seront SUPPRIMÉS avant le lancement public. SpotHitch repart de zéro avec uniquement les spots communauté.

## 5. Features par état

### ACTIF (fonctionne en prod)

- Carte interactive avec clustering, marqueurs colorés (tier gris/vert/or)
- Recherche villes (Photon API, suggestions instantanées)
- Détail spot complet (photos Mapillary/Street View, ratings, destinations avec %, quartier en sous-info, infos légales)
- Création spot (wizard 3 étapes, photo OPTIONNELLE en alpha, 6 types : station/aire, péage, rond-point, bretelle, bord de route, autre, 3 critères)
- Validation spot ("Je valide" quick + "J'ai testé" formulaire complet)
- Filtres carte (note, attente, vérifiés, tri)
- 53 guides pays (légalité, phrases, urgences, culture, visa, devise)
- Panneau ville (infos + destinations depuis une ville)
- Planificateur itinéraire multi-villes (OSRM)
- Journal de voyages (historique, ajouter voyage passé)
- Système de favoris (coeur, export)
- Auth progressive (Google, email, anonyme possible)
- Profil enrichi (bio, langues, 6 réseaux sociaux cliquables : Instagram/TikTok/Facebook/YouTube/X/Snapchat, galerie photos)
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
- SEO (sitemap, structured data, Open Graph). Pages villes SEO supprimées (nettoyage).
- Onboarding carousel 8 slides (5 originales + timeline communautaire + code alpha + PWA install + connexion). Bouton Skip supprimé.
- Astuce Google Maps dans AddSpot (design avant/après, masquable, lien discret après masquage)
- Code d'accès alpha (slide 6 du carousel, code "Dreamer2026", bloquant, contact @captain_pouce / spothitch@gmail.com)
- Compteur spots communautaires sur la carte (à droite du bouton Guides)
- Téléchargement offline par pays (sélecteur dans settings, i18n corrigé, jauge espace fonctionnelle)
- Recherche suggestions dédupliquées (plus de doublons)
- Réseaux sociaux avec emoji + label texte + liens cliquables (📷 Instagram, 🎵 TikTok, 👤 Facebook, ▶️ YouTube, 𝕏 X/Twitter, 👻 Snapchat)
- Vérification identité progressive (5 niveaux)
- Score de confiance (11 facteurs) dans Réglages > Vérification (retiré du Profil)
- Signalement/blocage utilisateurs
- Admin panel (feedbacks, erreurs Sentry, outils)
- Auto-update immédiat (version.json polling + toast "Mise à jour..." + reload, même quand app active)
- Manifest simplifié (nom "SpotHitch" seul)
- Récupération cache périmé PWA (stale cache recovery après deploy)
- Beta guards FeatureIntroModal pour features pas encore prêtes
- Sentry optimisé (filtres agressifs réseau/WebGL/extensions, rate limit 5/min, traces 2%)

### BETA GUARDS (modal "ARRIVE BIENTÔT" + vote, feature pas encore active)

- **SOS d'urgence** : SMS/GPS aux contacts, faux appel, alarme silencieuse
- **Mode Compagnon** : check-in régulier, GPS breadcrumb, alertes gardien
- **Itinéraire** (dans Voyage) : planificateur de trip
- **Radar proximité** : voir autostoppeurs proches en temps réel
- **Alertes proximité** : notification quand on passe près d'un bon spot
- **Événements** (dans Social) : meetups d'autostoppeurs

### PAS ENCORE CONFIGURÉ

- Affiliés Hostelworld/Booking (inscription manuelle nécessaire)
- FAQ & Aide : contenu existe, bouton caché dans Réglages alpha
- Changelog : ouvre la FAQ (pas un vrai changelog)
- Liens sociaux Instagram/TikTok/Discord (pages pas encore créées)

---

## 6. État visuel écran par écran

### Éléments persistants (TOUS les écrans)
- **Bandeau alpha** (haut) : barre orange "Version alpha" → VOULU
- **Badge "Avis"** (côté gauche) : bouton feedback draggable avec compteur rouge → VOULU
- **Bannière cookies** (bas) : RGPD, disparaît après clic Accepter → FONCTIONNE
- **Navigation bottom** : 4 onglets (Carte, Voyage, Social, Profil) en pill flottant
- **Header** : logo + icône amis + bouton SOS rouge

---

## 7. Décisions design à ne PAS remettre en question

| Élément | Décision | Raison |
|---------|----------|--------|
| Badge "Avis" flottant | Visible partout, draggable | Mécanisme central feedback alpha |
| Bandeau alpha | Toujours affiché | Phase alpha, sera retiré en beta |
| Code alpha "Dreamer2026" | Slide 6 du carousel, bloquant | Empêche l'accès sans invitation |
| Bouton Skip supprimé | Plus de raccourci dans le carousel | Tout le monde doit passer par le code |
| Zéros nouvel utilisateur | Normal partout | Données viennent avec l'usage |
| Beta guards | Modal "ARRIVE BIENTÔT" + vote | Collecte priorités avant dev |
| Spots importés | 3026 spots (filtrés >= 2 reviews) | Seront supprimés au lancement |
| Auth pas obligatoire | On peut utiliser l'app sans compte | Auth progressive par design |

---

## 8. Patterns techniques

- **Textes** : JAMAIS de tirets — ou - comme ponctuation (RÈGLE #16), utiliser : · , .
- **Toggles** : pill 👍/👎 via `renderToggle()` de `src/utils/toggle.js`
- **Modales** : overlay noir/blur, X en haut droite, Escape ferme
- **localStorage** : toutes les clés préfixées `spothitch_`
- **Handlers window.\*** : convention `verbNom` (ex: `openSpotDetail`, `showProfile`)
- **i18n** : `t('key')` partout, jamais de texte hardcodé, 4 langues obligatoires
- **IDs spots** : `hm_XX_N` (importés) ou `community_XXX`

---

## 9. Scripts de remplacement (après suppression des workflows)

| Ancien workflow | Remplacement | Commande |
|---|---|---|
| monitor.yml | UptimeRobot (externe) | Automatique, config sur uptimerobot.com |
| sentry-sync.yml | Intégration native Sentry → GitHub | Automatique |
| nightly-rebuild.yml | Deploy hook Cloudflare | `node scripts/deploy-hook.mjs` |
| sync-spots.yml | Script manuel | `node scripts/extract-spots.mjs /path/dump.sqlite` |

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
node scripts/deploy-hook.mjs  # Trigger rebuild Cloudflare
```
