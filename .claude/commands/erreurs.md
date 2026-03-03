# Correction d'erreurs Spothitch

1. Lire memory/errors.md en entier pour connaître les erreurs déjà connues
2. Identifier l'erreur actuelle et vérifier si elle ressemble à une erreur déjà documentée
3. Chercher la cause racine — ne jamais corriger un symptôme sans comprendre la cause
4. Corriger jusqu'à ce que tout soit parfait :
   - Tests passent
   - Build OK
   - Visuellement correct sur mobile
5. Ajouter l'erreur dans memory/errors.md avec :
   - Date, gravité, description, cause racine, correction, leçon apprise
6. Committer la correction avec un message clair

Ne jamais dire "c'est corrigé" sans avoir vérifié que les tests passent et que le build est OK.
Expliquer en français simple ce qui était cassé et pourquoi.
