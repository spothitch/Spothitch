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

---

## Splash Screen — v12a "Thumb Grows" (approuvé 2026-03-21)

**Fichier** : `memory/mockups/splash-v12a-approved.html`

**Structure** :
- Logo SpotHitch centré en haut (72px, coins arrondis)
- Nom "SpotHitch" sous le logo (1.8rem, amber, font-weight 800)
- Scène animée au milieu (300x150px) :
  - Autostoppeur avec pouce (icône SVG directe, PAS de cadre/cercle)
  - Voiture qui passe de droite à gauche (SVG directe, PAS de cadre)
  - Le pouce GROSSIT (scale 1 → 1.4) quand la voiture approche
  - Soleil amber en haut à droite (pulse)
  - 2 nuages gris qui dérivent
  - Route avec lignes pointillées animées
- Barre de progression (220px, 4px, amber gradient, pas de pourcentage)
- Tip en dessous (14px, gris, change toutes les 4 secondes)

**Tips validés (retirer 5, 6, 16, 21, 23)** :
- Appuie longtemps sur la carte pour créer un spot
- Tu peux créer un spot depuis Google Maps : partage un lieu
- Le mode Gardien permet à un proche de suivre ton trajet
- Configure le SOS avant ton trajet. Un geste alerte tes proches
- Le faux appel simule un vrai appel pour quitter une situation
- Ajoute des amis pour partager tes spots et trajets
- Appuie sur une station-service pour créer un spot station
- Tu peux enregistrer audio ou vidéo comme preuve
- Note tes voyages dans le journal pour garder une trace
- Envoie un message privé depuis le profil d'un autostoppeur
- Crée un groupe pour organiser un trajet à plusieurs
- Les spots avec une direction précise sont les plus utiles
- Active l'aide communautaire pour aider les proches
- Tu peux ajouter jusqu'à 3 photos par spot
- Ton score de confiance augmente avec chaque spot vérifié
- Vote sur la Roadmap pour les prochaines fonctionnalités
- Consulte les guides pays avant de partir
- Ajoute tes langues parlées pour que les autres sachent te contacter
- Cherche une ville pour voir tous les spots de sortie autour
- SpotHitch fonctionne même sans internet

**Décisions design** :
- PAS de pourcentage affiché (juste la barre)
- PAS de cadre/cercle autour des icônes (SVG directes)
- Animation plus grande que l'ancien splash
- Police tips 14px (plus lisible)
- Tips toutes les 4 secondes avec fade
- Minimum 2.5s d'affichage, max 6s

**Why:** Le splash doit charger tout en arrière-plan (MapLibre, style carte, spots, GPS) pour que la carte soit instantanée quand il disparaît. Les tips éduquent l'utilisateur sur les features cachées.

**How to apply:** Implémenter dans SplashScreen.js + index.html (inline pour affichage instantané).
