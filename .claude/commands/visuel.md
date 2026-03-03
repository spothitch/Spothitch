# Audit visuel Spothitch

Effectue un audit visuel complet de l'app :

1. `node scripts/visual-check.mjs` — screenshots automatiques de tous les écrans
2. Vérifier chaque screenshot :
   - Texte lisible et non coupé
   - Boutons cliquables (min 44x44px)
   - Pas de débordement horizontal
   - Icônes visibles
   - Espacement cohérent
   - Pas de zone vide inexpliquée
   - Texte non invisible
3. Tester avec localStorage.clear() pour simuler un nouvel utilisateur

Montrer chaque screenshot et décrire en français simple ce que je verrai sur mon téléphone.
Si quelque chose est cassé visuellement → corriger avant de continuer.
