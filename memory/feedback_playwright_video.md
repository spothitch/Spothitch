---
name: Toujours tester avec vidéo Playwright
description: Utiliser recordVideo dans tous les tests Playwright, pas juste des screenshots
type: feedback
---

Toujours utiliser `recordVideo` dans les tests Playwright, pas seulement des screenshots.

**Why:** Les screenshots ne montrent pas le temps de latence, les transitions, ni combien de temps l'utilisateur doit attendre. Une vidéo montre l'expérience réelle.

**How to apply:** Dans chaque test Playwright, créer le contexte avec `recordVideo: { dir: 'audit-screenshots/', size: { width: 390, height: 844 } }`. Toujours mentionner le chemin de la vidéo dans les résultats. Les screenshots restent utiles en complément pour des vérifications ponctuelles, mais la vidéo est le principal outil de diagnostic.
