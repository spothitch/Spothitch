---
name: Mockups approuvés par Antoine
description: Liste des mockups validés pour l'implémentation. NE JAMAIS modifier sans accord d'Antoine.
type: project
---

## SOS Mode — v4b "Alerts First" (approuvé 2026-03-20)

**Fichier** : `memory/mockups/sos-v4b-approved.html`

**Structure** :
- Écran 1 : Intro explicative (première ouverture uniquement)
- Écran 2 : Modal SOS avec 2 onglets
  - Onglet 1 (défaut) : **Alertes** — grille 2x2 (faux appel, 112, communauté, enregistrer) + bouton "Alerter mes gardiens" + "Je suis en sécurité"
  - Onglet 2 : **Configuration** — checklist avec sidebar glissante pour chaque élément + bouton "Tester le SOS"

**Éléments de config (sidebar glissante pour chacun)** :
1. Contacts d'urgence (SpotHitch push + SMS hors app + choix du principal)
2. Faux appel (nom, délai direct/30s/1m/2m/5m, son+vibration, bouton test)
3. Message d'alerte (textarea + toggles push/SMS/appel, bouton test)
4. Communauté (toggle activer, rayon 5/10/25/50 km, toggle recevoir les alertes des autres)
5. Enregistrement (permissions micro/caméra à autoriser, durée max 2/5/10/30 min)
6. Appel d'urgence (112 auto-détecté, autres numéros)

**Décisions design** :
- Pas de mode discret (supprimé, jugé inutile)
- Alertes en premier onglet (pas la config)
- Pas d'onglet Contacts séparé (intégré dans la config)
- Icônes Lucide SVG uniquement, zéro emoji enfantin
- Thème dark (#1a1d27), accents amber (#f59e0b) et rouge (#ef4444)
- Bouton test dans chaque sidebar de config

**Why:** Antoine veut que le SOS soit prêt à l'emploi immédiatement, avec toute la config faite à l'avance.

**How to apply:** Implémenter SOS.js exactement comme ce mockup. Supprimer tout code SOS qui ne correspond pas.
