---
name: Favicon avec contour obligatoire
description: Toujours utiliser outlined-transparent pour les favicons car sans contour c'est invisible sur fond blanc
type: feedback
---

Toujours utiliser la version `outlined-transparent` (avec contour noir) pour les favicons et petites icônes (16, 32, 48px).

**Why:** La version `no-outline-transparent` (sans contour) est invisible sur fond blanc (onglets Chrome en mode clair). Antoine l'a signalé immédiatement. Le contour noir garantit la visibilité sur fond clair ET sombre.

**How to apply:**
- Favicon (onglet navigateur) → `outlined-transparent-*`
- Petites icônes (< 96px) → `outlined-transparent-*` (le contour aide à la lisibilité à petite taille)
- Grandes icônes PWA (192, 512) → `navy-background-*` (le fond bleu marine donne un look propre sur l'écran d'accueil)
- iOS home screen → `ios-rounded-*`
- Guide complet des logos : `assets/logos/spothitch-logos/COULEURS-ET-GUIDE.txt`
