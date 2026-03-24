# features.md - Inventaire complet des fonctionnalités SpotHitch

> Dernière mise à jour : 2026-03-23
> IMPORTANT : Vérifier ce fichier AVANT de proposer une feature — elle existe peut-être déjà !

---

## Carte & Navigation

- [x] Carte interactive MapLibre GL JS avec tuiles OpenFreeMap
- [x] Clustering dynamique des spots (dé-cluster au zoom)
- [x] Système 2 tiers spots : bleu (communauté) → vert (3+ tests ET validations) → or (10+) + couronne ambassadeur + anneau rouge station (gris supprimé avec HW)
- [x] Marqueurs carte couleurs combinées (tier + anneau rouge station-service)
- [x] Centrage GPS sur position utilisateur (bouton visible sur tous les appareils, demande permission au clic)
- [x] ~~Split view (carte + liste côte à côte)~~ (supprimé session 16 — bouton "nearby spots" retiré)
- [x] Affichage stations-service (toggle ⛽, Overpass API, viewport actuel, zoom guard >= 8)
- [ ] ~~Heatmap densité des spots~~ (supprimé session 11 — code fantôme sans UI)
- [x] Filtres carte (type de spot, note, fraîcheur)
- [x] Panneau ville (infos + routes depuis une ville, affichage même avec 0 spots)
- [x] Style carte clair/sombre selon thème
- [x] Compteur de spots supprimé (nettoyage UI)
- [x] Bouton guide clignotant supprimé (nettoyage UI)
- [x] Bouton itinéraire supprimé de la carte (déjà dans Voyage)
- [x] Bouton guide redirige vers Voyage > Guides (raccourci)
- [x] Bouton stations-service toggle sur la carte (⛽)
- [x] Scroll vertical bloqué sur onglet carte (touch-action: none)
- [x] Focus orange/ambre supprimé au touch (conservé clavier)
- [x] Carte persistante entre onglets (display:none au lieu de destruction DOM)
- [x] Carte initialisée au lancement de l'app (pas seulement quand onglet carte affiché)
- [x] Boutons carte persistants (zoom/GPS/stations injectés dans le DOM préservé, plus de clignotement)

## Spots

- [x] 3026 spots dans 74 pays (données importées, filtrées >= 2 reviews)
- [x] Chargement lazy par pays (JSON)
- [x] Déduction automatique method/groupSize/timeOfDay/season depuis les commentaires
- [x] Création spot : wizard 3 étapes (Photo+Type → Expérience → Détails)
- [x] Mini-carte toujours visible à l'étape 1 (tap pour placer le spot, GPS en raccourci)
- [x] Photo optionnelle en alpha (compression WebP + preview, max 5 photos par spot)
- [x] Photos Mapillary automatiques (street-level, gratuites, quand pas de photo utilisateur)
- [x] Bouton Street View dans SpotDetail (ouvre Google Maps, gratuit)
- [x] Priorité photos : utilisateur > Mapillary > placeholder
- [x] 6 types : station-service/aire de repos, péage, rond-point, bretelle d'accès, bord de route, autre
- [x] Vérification station-service automatique à la création (Overpass API, rayon 300m, popup confirmation si aucune station détectée)
- [x] 3 critères notation : sécurité, trafic, accessibilité (1-5 étoiles)
- [x] Tags enrichis : abri, visibilité, parking, commodités, méthode signalisation
- [x] Direction/destination obligatoire
- [x] Détail spot design final v3 : photo arrondie 20px+padding, badge statut solide opaque, score cercle émeraude, boutons vert/ambre/bleu, cartes dates 2 colonnes, strip météo/légal/saison, 4 métriques, tags badges, 6 sections ouvertes par défaut, 3 boutons secondaires, dates relatives, method/group/time/season chips, taux succès réel, photo fallback, station name, road number
- [x] 2 boutons spot : "Je valide" (quick 1-tap, validationCount) + "J'ai testé" (formulaire, testCount)
- [x] Infos légales par pays dans SpotDetail (vert/jaune/rouge depuis guides.js)
- [x] Spots alternatifs proches (rayon 5km, triés par rating)
- [x] Tips experts (reviews marquées isTip par utilisateurs vérifiés)
- [x] Meilleurs créneaux horaires (agrégation timeOfDay + waitTime)
- [x] Check-in : temps d'attente, résultat, photo, tracker "personnages"
- [x] Favoris : sauvegarder/retirer, tri par date/note, affichage sur carte
- [x] Export favoris
- [x] Badges de vérification (ambassadeur, validé par utilisateur)

## Voyage / Trip

- [x] Planificateur de voyage multi-villes (OSRM routing)
- [x] Analyse de route (distance, durée, spots le long du trajet)
- [x] Historique des voyages (sauvegarder/charger/renommer/supprimer avec confirmation)
- [x] Chargement voyage sauvegardé → rouvre carte + bottom sheet
- [x] Date relative affichée sur les voyages sauvegardés
- [x] Système favori unifié ❤️ (coeur unique au lieu de ⭐ highlight + 🔖 bookmark séparés)
- [x] Bouton coeur ❤️ dans bottom sheet itinéraire + popup carte
- [x] Commodités le long de la route
- [x] Barre de voyage active (indicateur flottant pendant planification)
- [x] Suggestions de spots le long de l'itinéraire
- [x] Filtres route (station, note 4+, attente <20min, vérifié, récent, abri) — unifiés en tripFilters.js, compteurs par chip, chips grisés si 0, masquage carte, reset auto
- [x] Labels spots sans overlap sur carte trip (halo + collision detection)
- [x] Nommage spots par distance au lieu de commentaires

## Guides pays

- [x] 96 guides pays enrichis (10 sections : lois, autostop, sécurité, femmes, langue, budget, camping, transport, saisons, culture)
- [x] Traduction 4 langues (FR/EN/ES/DE) avec chargement dynamique par langue (code-splitting Vite)
- [x] guideSectionsLoader.js : charge uniquement le fichier de la langue active, cache en mémoire
- [x] Noms de pays localisés en 4 langues (name FR, nameEn, nameEs, nameDe) pour les 96 pays
- [x] legalityText affiché dans la langue de l'utilisateur (legalityTextEn pour non-FR)
- [x] Nettoyage contenu : 67 témoignages/pubs/références personnelles supprimés, tout est factuel et générique
- [x] 30/30 bugs guides corrigés (5 critiques, 13 majeurs, 12 mineurs) le 2026-03-23
- [x] COUNTRY_CENTERS complet pour 96 pays (tri par proximité géographique)
- [x] COUNTRY_LANG complet pour 96 pays (phrases universelles dans la langue locale)
- [x] Codes pays ISO-2 standards (NAM→NA, IDN→ID)
- [x] 21 clés i18n guide ajoutées dans FR/EN/ES/DE (chips, forum messages, badge, anonymous)
- [x] legality 'varies' affiché comme "Variable" (US, AU, IN)
- [x] 192 lignes dead code supprimées (ETIQUETTE_DATA, VISA_DATA, CURRENCY_DATA)
- [x] 99 accents français corrigés dans guides.js
- [x] 3 duplicate i18n keys corrigées (validations dans fr/es/de)
- [x] Conseils communautaires (ajout + vote up/down)
- [x] Vote utile/pas utile avec compteur affiché + feedback instantané DOM
- [x] Formulaire de suggestion de conseils par section
- [x] Service feedback centralisé (feedbackService.js, localStorage)
- [x] Sections guides : 3 onglets (Débuter, Pays, Sécurité)
- [x] Suggestions villes Photon API (plus rapide que Nominatim, 100ms debounce)
- [ ] UI contribution : rectangle moche sous chaque catégorie, choix de type manquant (question/conseil/alerte/bon plan)
- [ ] Uniformisation des phrases utiles par pays
- [ ] Vérification qualité traductions EN/ES/DE (relecture par locuteurs natifs)

## Gamification

- [x] Points & XP (100 XP par niveau)
- [x] 50+ badges (Safety Scout, Jet Setter, Local Expert...)
- [x] Titres débloquables par progression
- [x] Boutique (cadres avatar, titres, boosters)
- [x] Récompense quotidienne avec streak
- [x] Leaderboard (hebdo/all-time, par points/saison)
- [x] 10+ niveaux VIP avec multiplicateurs XP
- [x] Système de ligues (Bronze → Diamond)
- [x] Défis équipe, défis amis, défis personnels
- [x] Quiz géographique interactif
- [x] Hub de défis (actifs/en attente)
- [x] Modal historique des Pouces (toggle dans ChallengesHub)
- [x] Badges/défis cliquables (cursor-pointer, z-index)
- [x] Boutons d'action sur les défis (challenges)
- [x] Leaderboard activé avec filtre pays/région
- [x] Récompenses mensuelles dans le leaderboard

## Social

- [x] Système d'amis Firebase (envoi/accepter/refuser demandes, recherche utilisateurs, temps réel)
- [x] Messages privés 1-on-1 Firebase Firestore (temps réel, non-lus, partage spot/position)
- [x] Chat par zone / salons
- [x] Réactions emoji sur messages (10+ emojis)
- [x] Groupes de voyage (création/rejoindre) — localStorage
- [x] Conversations de groupe Firebase (créer avec plusieurs amis, messages temps réel, quitter, ajouter membre)
- [x] Amis à proximité (avec contrôles vie privée)
- [x] Profils utilisateurs (stats, badges, titres)
- [x] ~~Personnalisation profil (cadres, titres, avatars)~~ (bouton palette supprimé, emoji avatar conservé)
- [x] Fil d'activité amis
- [x] Profil enrichi : bio, langues parlées, carte pays visités, références, voyages partagés, contrôles vie privée
- [x] Mini-galerie photos profil (6 photos max, compression WebP, localStorage)
- [x] Liens réseaux sociaux (Instagram, TikTok, Facebook) dans profil
- [x] Formulaire voyage passé amélioré (dates début/fin, layout 2 colonnes)
- [x] Sélecteur de langues in-app (modal au lieu de prompt())
- [x] Vérification identité déplacée dans Réglages
- [x] Carte donation dans Profil et Réglages (lien PayPal.me/antoineville actif, montants 3/10/50€ + libre)
- [x] **Roadmap / Feature Requests** : sous-onglet dans Profil (remplace Progression), 7 features détaillées, votes approve/disapprove Firebase partagés, commentaires Firebase, auth requise, optimistic UI + localStorage fallback
- [x] Toggles 👍/👎 pill classique unifié (renderToggle via src/utils/toggle.js — 19 toggles)

## Sécurité & Vérification

- [x] Mode SOS v2 : partage position, choix SMS/WhatsApp, mode offline, countdown 5s, alarme silencieuse, faux appel, enregistrement audio/vidéo, contact principal, message personnalisable, auto-détection pays urgence
- [x] Mode Compagnon v2 : check-in régulier, choix SMS/WhatsApp, GPS breadcrumb, notification arrivée/départ, alerte batterie faible, estimation ETA, rappel check-in, contacts multiples (5 max), historique voyages
- [x] Vérification identité progressive (0-5 : non vérifié → email → téléphone → selfie+ID → vérifié)
- [x] Score de confiance 11 facteurs : ancienneté, spots, vérifications, avis, identité, votes, photos profil, réseaux sociaux, bio, langues, check-ins
- [x] Vérification d'âge (modal confirmation)
- [x] Blocage utilisateur (bloquer/débloquer, liste)
- [x] Système de signalement complet : spots (7 raisons), utilisateurs (5), messages (5), guides (erreur)
- [x] Signalement : stubs lazy-load pour selectReportReason/submitCurrentReport
- [x] Signalement : bouton sur messages chat (DM + groupe)
- [x] Signalement : bouton erreur sur fiches guides pays
- [x] Signalement : reportSpotAction redirigé vers modal moderne (suppression legacy prompt)
- [x] Admin signalements : auto-load, filtres type/statut, liens "Voir le spot/profil/guide", badge compteur header
- [x] Admin signalements : fusion guide_reports + reports dans un seul onglet
- [x] Disclaimer SOS
- [x] Consentement compagnon

## Auth

- [x] Login email/mot de passe (Firebase Auth)
- [x] Login social : Google, Facebook, Apple
- [x] Réinitialisation mot de passe par email
- [x] Sessions persistantes (auto-restore)
- [x] Auth progressive (anonyme d'abord, login quand nécessaire)
- [x] Auth gate (certaines actions demandent login)

## i18n & Localisation

- [x] 4 langues : Français, English, Español, Deutsch
- [x] Lazy-loading par langue (1 seule en mémoire)
- [x] Pluralisation correcte par langue
- [x] Détection auto langue navigateur
- [x] Switch de langue instantané (pas de reload)
- [x] Traduction in-app des descriptions (MyMemory API)

## Onboarding & UX

- [x] Carousel d'accueil 7 slides (5 originales + PWA install prompt + timeline communautaire) + sélecteur de langue
- [x] Astuce Google Maps dans AddSpot (design avant/après : manuel ~2min vs partage 3sec, masquable, lien discret)
- [x] Compteur spots communautaires sur la carte
- [x] Map-first : montrer la carte immédiatement
- [x] États vides avec messages et actions
- [x] Skeletons de chargement animés
- [x] Loading indicator avec progression
- [x] Toast notifications (info, succès, erreur, warning)
- [x] Dialogues de confirmation (actions destructives)
- [x] Tooltips
- [x] Thème clair/sombre
- [x] Profile footer reorganized: Help (FAQ, Contact, Bug Report), Legal (Privacy, CGU, Guidelines), About (Changelog, Invite, Social, Credits)
- [x] FAQ opens as fullscreen overlay (not broken tab navigation)
- [x] Legal pages open as fullscreen overlay (not broken tab navigation)
- [x] Bug report button in profile footer
- [x] Social links (Instagram, TikTok, Discord) in profile footer

## Accessibilité

- [x] Navigation clavier + focus trap dans modales
- [x] Support lecteur d'écran (ARIA, live regions, annonces)
- [x] Respect prefers-reduced-motion
- [x] Contraste couleurs WCAG AA
- [x] Alt text sur toutes les images
- [x] ARIA landmarks (structure sémantique)
- [x] Raccourcis clavier (Escape ferme modales, Ctrl+K recherche)

## Performance & Offline

- [x] Code splitting (chunks : maplibre, firebase, sentry, gamification, social, admin, guides)
- [x] Lazy-loading images (IntersectionObserver)
- [x] Compression images WebP (photos spots 1200px, thumbnails 400px, fallback JPEG)
- [x] Service Worker offline-first (Workbox)
- [x] Cache tuiles carte pour offline
- [x] IndexedDB pour spots offline
- [x] localStorage pour préférences
- [x] Sync en arrière-plan quand retour online
- [x] Auto-update silencieux (version.json polling + SW)
- [x] Preloading carte pendant idle time
- [x] setState() dirty-checking (skip render si aucune valeur ne change)
- [x] Render fingerprint (skip DOM rebuild si état visuel identique)
- [x] persistState() debounce 500ms (moins d'écritures localStorage)
- [x] MutationObservers ciblés (plus de subtree:true sur body)
- [x] transition-colors au lieu de transition-all (352 occurrences, 61 fichiers)
- [x] MapLibre CSS lazy-loaded (50KB différé)
- [x] Widgets conditionnels (nearbyFriends, SOS tracking)
- [x] window.__renderStats() monitoring dev
- [x] Chat messages windowed (derniers 50 seulement)
- [x] Version check pause quand app backgrounded
- [x] Favorites cache en mémoire (pas de JSON.parse répété)
- [x] Idle preload Social.js + Profile.js
- [x] Autocomplete Photon API partout (100ms debounce, ~50ms réponse vs 300ms Nominatim)

## Légal & Conformité

- [x] Cookie banner RGPD + préférences
- [x] Export données personnelles (RGPD)
- [x] Audit RGPD automatisé (script)
- [x] CCPA (opt-out Californie)
- [x] Community Guidelines
- [x] Politique de confidentialité (PRIVACY.md)
- [x] Conditions d'utilisation (TERMS.md)

## Admin & Modération

- [x] Panneau admin (file modération, propositions suppression, warnings/bans)
- [x] Modération contenu

## SEO

- [x] Pages SEO 96 pays avec contenu complet des 10 sections (2000+ mots/page, 192 000+ mots indexables)
- [x] Schema.org FAQPage (3 questions/réponses par pays pour Google Rich Results)
- [x] Schema.org BreadcrumbList (SpotHitch > Guides > Pays)
- [x] Twitter Card meta tags
- [x] Design web propre pour pages SEO (hero, sections, saison bar, phrases table, cross-links)
- [x] Sitemap 97 URLs (1 accueil + 96 guides pays, généré dynamiquement par prerender-seo.mjs)
- [x] Ancien sitemap statique (2 URLs) supprimé
- [x] /city/* retourne 410 Gone (anciennes pages villes désindexées)
- [x] gone.html avec meta noindex pour les pages supprimées
- [x] robots.txt Allow: / + Sitemap déclaré
- [x] Meta tags Open Graph
- [x] JSON-LD structured data
- [ ] ~~Pages SEO par ville~~ (supprimées, seront réactivées avec données communautaires)

## Desktop / Tablette

- [x] Adaptation desktop étape 1 : contenu centré 640px (tablette) / 720px (grand desktop)
- [x] Navigation barre en bas contrainte à la largeur du contenu
- [x] Header centré et arrondi sur les onglets non-carte, pleine largeur sur carte
- [x] body.tab-map toggleé dynamiquement pour CSS conditionnel
- [x] Modals centrés verticalement sur desktop (align-items: center)
- [x] Grille guides pays : 3 colonnes desktop, 4 grand desktop
- [x] Panneaux fixes (draft, trip) contraints au contenu
- [x] Hover states sur cards, guide-cards, nav-btn (pointer: fine)
- [x] Focus-visible avec outline amber pour navigation clavier
- [x] Scrollbars fines et discrètes sur desktop
- [x] Fond radial dégradé subtil visible sur les côtés
- [ ] Étape 2 : split-view carte (panneau latéral style Airbnb/Google Maps)
- [ ] Étape 3 : modals avec animation fade (au lieu de slide-up)
- [ ] Étape 4 : social master-detail (conversations split-view)
- [ ] Étape 5 : polish (raccourcis clavier, curseurs, print)
- [ ] Étape 6 : welcome/onboarding responsive

## PWA

- [x] Installable (manifest.json, icônes toutes tailles)
- [x] Offline complet
- [x] Push notifications (Firebase Messaging) — toggle UI branché session 11
- [x] Bannière d'installation après 30s
- [x] Screenshots pour install prompt
- [x] App shortcuts (Add Spot, SOS, Trip Planner, Profile)
- [x] Share Target API (recevoir des partages d'autres apps, coordonnées GPS exactes via Google Maps embed)
- [x] Carte de partage visuelle (WhatsApp, lien, screenshot) — branchée session 11
- [x] Téléchargement offline par pays (sélecteur dans settings)
- [x] Alertes de proximité spots (GPS, rayon configurable) — toggle branché session 11
- [x] Historique positions GPS (IndexedDB, 24h, 1min interval) — `locationHistory.js`
- [x] Vérification GPS sur validation spot (< 2km) avec popup confirmation si pas de GPS — session 44
- [x] Badge "Vérifié sur place" (GPS) affiché dans SpotDetail quand au moins une validation GPS confirmée — session 44
- [x] Score de confiance GPS par utilisateur (ratio 1/3 minimum, grace period 3 validations) — `gpsTrust.js` session 44
- [x] Dates d'expérience cohérentes (lastValidated/lastTested = date d'expérience, pas date de soumission) — session 44
- [x] Badging API (badge compteur messages non-lus)
- [x] Optimisations Lighthouse (preconnect, dns-prefetch, fetchpriority)

## Monitoring & Tests

- [x] Sentry error tracking (filtres agressifs, rate limit 5/min, traces 2%, un seul error handler)
- [x] 131 tests wiring + impact analysis (handlers, modal flags, structure App/state/main)
- [x] Tests integration modales
- [x] E2E Playwright
- [x] Visual regression (screenshots)
- [x] Lighthouse CI
- [x] ~~Plan Wolf v4~~ → v5 (16 phases, mode --delta, intégration Quality Gate, tracking tendances QG)
- [x] Audit RGPD automatisé
- [x] ESLint + Prettier + Husky pre-commit
- [x] Quality Gate CI (6 checks automatiques : handlers, i18n, dead exports, security patterns, localStorage RGPD, error patterns — score /100, bloque le deploy si < 70)
- [x] Production Monitor (health check toutes les 6h + alerte GitHub issue automatique si échec)
- [x] Plan Wolf v5 (mode --delta, intégration Quality Gate, tracking tendances QG)
- [x] Sentry → GitHub Issues intégration native (pas de workflow custom)
- [x] Visual Check script (screenshots automatiques Playwright, viewport 390x844)
- [x] Pill toggle unifié (👍/👎) via src/utils/toggle.js (renderToggle + renderToggleCompact)
- [x] 14 couches de vérification indépendantes (session 45, 2026-03-23) :
  - CodeRabbit (review AI sur PR, en français, .coderabbit.yaml)
  - DeepSource (qualité, sécurité, secrets, .deepsource.toml)
  - Aikido Security (packages npm malveillants, CVEs, via GitHub App PR checks)
  - Argos CI (régression visuelle pixel par pixel sur PR, ARGOS_TOKEN configuré)
  - CodeQL (analyse sécurité sur chaque push)
  - StrykerJS (mutation testing, local uniquement : npm run test:mutate)

## Monétisation (préparé mais pas activé)

- [ ] Affiliés Hostelworld/Booking (pas encore inscrit)
- [x] Contenu sponsorisé (hostels/hébergements recommandés — code prêt)
- [x] Modal donation (PayPal connecte : paypal.me/antoineville, montant pre-rempli)

## Configuré en prod

- [x] Firebase : GitHub Secrets configurés depuis 2025-12-26
- [x] Sentry : DSN configuré depuis 2026-02-17, SENTRY_TOKEN depuis 2026-02-24
- [x] Cloudflare : configuré depuis 2026-02-16

## Pas encore configuré en prod

- [ ] Affiliés : inscription manuelle nécessaire

## Désactivé pour l'alpha (à activer en beta)

- [ ] FAQ & Aide (bouton dans Réglages > Aide) — nécessite création featureId `faq` dans featuresData.js
- [ ] Notifications push (bouton dans Réglages > Notifications) — nécessite fenêtre dédiée push
- [ ] Quoi de neuf / Changelog (bouton dans Réglages > À propos) — nécessite vrai contenu changelog
- [ ] Liens sociaux "Nous suivre" Instagram/TikTok/Discord (dans Réglages > À propos) — créer les pages d'abord

---

## À venir — Mode Gardien (Companion In-App)

- [ ] Suivi temps réel du compagnon directement sur la carte SpotHitch du gardien
  - Le gardien voit la position live de l'autostoppeur (point mobile sur la carte)
  - Trajet déjà parcouru affiché (ligne sur la carte)
  - Niveau de batterie visible
  - Heure du dernier signal GPS
  - Bouton pour envoyer un message
- [ ] Lien smart : si le gardien a SpotHitch → ouvre l'app, sinon → page web
- [ ] Timer check-in : l'autostoppeur doit appuyer régulièrement pour remettre à zéro
- [ ] Si timer arrive à zéro sans réponse → alerte + notification push au gardien
- [ ] Alerte visible sur la carte du gardien (point rouge, bannière d'alerte)
- [ ] Arrivée confirmée manuellement par l'autostoppeur (pas de GPS auto)
- [ ] Pas d'alerte "immobile" (le stop = attendre, c'est normal)
- [ ] Technique : Firebase Firestore onSnapshot pour le temps réel
- [ ] Les données GPS existantes du mode Companion sont réutilisées
