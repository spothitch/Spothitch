# Plan d'adaptation desktop SpotHitch

> Créé : 2026-03-24
> Statut : À FAIRE
> Objectif : Rendre SpotHitch parfait sur mobile, tablette ET desktop

---

## Contexte

L'app est 100% mobile-first sans aucune adaptation desktop. Sur un écran 1440px :
- Tout le contenu s'étire sur toute la largeur (texte illisible)
- La barre de navigation en bas fait 1408px de large
- Les panneaux fixes (offline, draft, trip) s'étirent
- Les modals glissent depuis le bas sans centrage
- Aucun media query `min-width` dans le CSS

## Principes

- **Container Queries** (93.92% support) pour les composants réutilisables
- **CSS Grid** pour les layouts split-view
- **Tailwind `md:` `lg:`** pour les breakpoints globaux
- **Mobile-first** : le mobile ne change PAS, on ajoute uniquement pour desktop
- Pattern **Airbnb/Google Maps** : carte + panneau latéral sur desktop

## Breakpoints

- **Mobile** : < 768px (inchangé, c'est la base)
- **Tablette** : 768px - 1023px
- **Desktop** : 1024px+

---

## Étape 1 : Fondations CSS (session 1)
> Fichiers : `main.css`, `index.html`, `App.js`
> Durée estimée : 1 session

### 1.1 Conteneur responsive `#app`
- [ ] Ajouter un wrapper `#app-shell` autour du contenu (pas la carte)
- [ ] Mobile : pas de max-width (comme maintenant)
- [ ] Tablette : max-width 640px, centré
- [ ] Desktop : max-width 640px, centré, fond sombre derrière
- [ ] La carte est EXCLUE du wrapper (reste pleine largeur)

### 1.2 Navigation responsive
- [ ] Mobile : barre en bas fixe (inchangé)
- [ ] Tablette : barre en bas, contrainte à max-width 640px centré
- [ ] Desktop : barre en bas, contrainte à max-width 640px centré
- [ ] Les icônes restent les mêmes, juste la largeur change

### 1.3 Header responsive
- [ ] Mobile : inchangé
- [ ] Desktop : header contraint à la même largeur que le contenu
- [ ] Boutons SOS/Companion bien positionnés

### 1.4 Panneaux fixes
- [ ] Draft banner : contraint au wrapper
- [ ] Active trip bar : contraint au wrapper
- [ ] Offline panel : contraint au wrapper
- [ ] City panel : contraint au wrapper

### 1.5 Fond desktop
- [ ] Fond sombre/dégradé subtil visible sur les côtés quand l'app est centrée
- [ ] Optionnel : motif ou illustration en fond

### Vérification étape 1
- [ ] Screenshot mobile 390x844 : rien n'a changé
- [ ] Screenshot tablette 768x1024 : contenu centré, navigation contrainte
- [ ] Screenshot desktop 1440x900 : contenu centré, fond visible sur les côtés
- [ ] Tests wiring passent
- [ ] Build OK

---

## Étape 2 : Carte split-view desktop (session 2)
> Fichiers : `Home.js`, `App.js`, `main.css`, `CityPanel.js`, `SpotDetail.js`
> Durée estimée : 1-2 sessions

### 2.1 Layout split-view
- [ ] Desktop : CSS Grid 2 colonnes (panneau 380px | carte flex-1)
- [ ] Tablette : pas de split (carte plein écran comme mobile)
- [ ] Mobile : inchangé

### 2.2 Panneau latéral gauche (desktop uniquement)
- [ ] Contient : barre de recherche, filtres, résultats
- [ ] Quand un spot est sélectionné : SpotDetail s'affiche dans le panneau au lieu d'un modal
- [ ] Quand une ville est cliquée : CityPanel s'affiche dans le panneau au lieu d'un bottom sheet
- [ ] Scroll indépendant du panneau et de la carte

### 2.3 Contrôles carte repositionnés
- [ ] Boutons zoom/GPS/stations : positionnés par rapport à la carte, pas au viewport
- [ ] Search bar : dans le panneau latéral sur desktop, sur la carte sur mobile
- [ ] FAB "Ajouter spot" : positionné dans le panneau ou en bas à droite de la carte

### 2.4 Responsive map controls
- [ ] Desktop : hover states sur les marqueurs (tooltip au survol)
- [ ] Desktop : curseur pointer sur les spots cliquables
- [ ] Desktop : scroll zoom sans Ctrl (la carte n'est pas plein écran)

### Vérification étape 2
- [ ] Screenshot desktop carte : split view visible, panneau à gauche
- [ ] Screenshot desktop spot sélectionné : détail dans le panneau
- [ ] Screenshot mobile : rien n'a changé
- [ ] Tests wiring + build OK

---

## Étape 3 : Modals responsive (session 3)
> Fichiers : tous les modals dans `src/components/modals/`
> Durée estimée : 1 session

### 3.1 Comportement modal par device
- [ ] Mobile : slide-up depuis le bas (comme maintenant)
- [ ] Desktop : centré verticalement et horizontalement, max-width adapté
- [ ] Animation : mobile = slideUp, desktop = fadeIn + scale

### 3.2 Uniformiser les modals
- [ ] Tous les modals utilisent `sm:items-center sm:max-w-lg` (ou adapté)
- [ ] Auth modal : centré sur desktop
- [ ] AddSpot modal : centré sur desktop, formulaire plus large
- [ ] SOS modal : centré sur desktop
- [ ] SpotDetail : dans le panneau latéral sur desktop (étape 2), modal sur mobile
- [ ] Tutorial/Welcome : centré, max-width 480px

### 3.3 Overlays
- [ ] Backdrop click ferme le modal sur desktop (déjà fait pour certains)
- [ ] Touche Escape ferme le modal

### Vérification étape 3
- [ ] Screenshot desktop AddSpot modal : centré, pas plein écran
- [ ] Screenshot desktop Auth modal : centré
- [ ] Screenshot mobile : inchangé
- [ ] Tests wiring + build OK

---

## Étape 4 : Grilles et listes adaptatives (session 4)
> Fichiers : `Guides.js`, `Social.js`, `Profile.js`, `Travel.js`
> Durée estimée : 1 session

### 4.1 Guides pays
- [ ] Mobile : grille 2 colonnes (inchangé)
- [ ] Tablette : grille 2 colonnes
- [ ] Desktop : grille 3 colonnes

### 4.2 Social
- [ ] Mobile : liste verticale (inchangé)
- [ ] Desktop : split view master-detail (liste conversations à gauche, conversation ouverte à droite)

### 4.3 Profil
- [ ] Mobile : vertical scroll (inchangé)
- [ ] Desktop : contenu centré, sections en grille 2 colonnes si pertinent

### 4.4 Voyage
- [ ] Mobile : vertical scroll (inchangé)
- [ ] Desktop : contenu centré, sections de voyage plus larges

### Vérification étape 4
- [ ] Screenshot desktop guides : 3 colonnes
- [ ] Screenshot desktop social : split view conversations
- [ ] Screenshot mobile : inchangé
- [ ] Tests wiring + build OK

---

## Étape 5 : Polish et interactions desktop (session 5)
> Fichiers : divers
> Durée estimée : 1 session

### 5.1 Hover states
- [ ] Boutons : effet hover visible (couleur change)
- [ ] Cards guides : effet hover (bordure ambre)
- [ ] Spots sur la carte : tooltip au survol
- [ ] Liens : underline au hover

### 5.2 Raccourcis clavier
- [ ] Escape : fermer le modal ouvert
- [ ] / : focus sur la barre de recherche
- [ ] ← → : naviguer entre les onglets
- [ ] M : centrer la carte sur ma position

### 5.3 Curseurs
- [ ] pointer sur tous les éléments cliquables
- [ ] grab/grabbing sur la carte
- [ ] text sur les champs de texte

### 5.4 Scrollbar styling
- [ ] Scrollbar fine et discrète sur desktop (pas la scrollbar système)
- [ ] Scrollbar cachée sur les éléments horizontaux (déjà fait avec scrollbar-none)

### 5.5 Print styles
- [ ] Les guides pays sont imprimables proprement (optionnel)

### Vérification étape 5
- [ ] Test hover sur tous les boutons/cards
- [ ] Test raccourcis clavier
- [ ] Screenshot desktop final complet
- [ ] Tests wiring + build OK
- [ ] Lighthouse performance check

---

## Étape 6 : Welcome/Onboarding responsive (session 6)
> Fichiers : `Welcome.js`, `Tutorial.js`, `main.css`
> Durée estimée : 0.5 session

### 6.1 Welcome wizard
- [ ] Mobile : plein écran vertical (inchangé)
- [ ] Desktop : centré, max-width 480px, fond flou derrière
- [ ] Les étapes restent les mêmes

### 6.2 Tutorial
- [ ] Desktop : adapté si visible

### Vérification étape 6
- [ ] Screenshot desktop welcome : centré avec fond
- [ ] Screenshot mobile : inchangé

---

## Résumé

| Étape | Contenu | Sessions | Priorité |
|-------|---------|----------|----------|
| 1 | Fondations (conteneur, nav, panneaux) | 1 | CRITIQUE |
| 2 | Carte split-view | 1-2 | HAUTE |
| 3 | Modals responsive | 1 | HAUTE |
| 4 | Grilles adaptatives | 1 | MOYENNE |
| 5 | Polish (hover, clavier, curseurs) | 1 | BASSE |
| 6 | Welcome responsive | 0.5 | BASSE |
| **Total** | | **5-6 sessions** | |

## Règles

- Chaque étape est un commit séparé, testable indépendamment
- Le mobile ne doit JAMAIS changer (tests visuels avant/après)
- Chaque étape a ses propres screenshots de vérification
- Push sur main uniquement quand l'étape est complète et vérifiée
