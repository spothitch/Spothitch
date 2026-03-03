# Vérification complète Spothitch

Effectue une vérification complète dans cet ordre :

1. `npx vitest run tests/wiring/` — vérifier que tous les tests passent
2. `npm run build` — vérifier que la compilation réussit
3. `gh run view` — vérifier que le dernier CI est vert
4. `node scripts/monitor.mjs` — vérifier que le site répond en production

Résume-moi le résultat en français, simplement :
- ✅ ce qui marche
- ❌ ce qui est cassé avec la cause exacte
- 🔧 ce que tu vas corriger si quelque chose est cassé

Ne pas demander de confirmation — corriger directement ce qui est cassé.
