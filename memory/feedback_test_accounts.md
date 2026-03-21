---
name: Comptes test Firebase
description: Les 5 comptes CI test, leur mot de passe est dans GitHub Secret E2E_TEST_PASSWORD, JAMAIS les recréer via auth:import
type: reference
---

## Comptes test Firebase (créés le 2026-03-21)

| Email | Username | Statut |
|-------|----------|--------|
| ci-alice@spothitch.com | ci_alice | OK |
| ci-bob@spothitch.com | ci_bob | OK |
| ci-charlie@spothitch.com | ci_charlie | OK |
| ci-diana@spothitch.com | ci_diana | OK |
| ci-admin@spothitch.com | — | FAIL (code alpha requis) |

**Mot de passe** : stocké dans GitHub Secret `E2E_TEST_PASSWORD`. JAMAIS le stocker en local.

**Why:** Ces comptes ont été créés via le formulaire d'inscription du site (createUserWithEmailAndPassword). C'est la SEULE méthode qui fonctionne. `firebase auth:import` avec HMAC/PBKDF2/SCRYPT ne produit PAS un hash compatible avec signInWithEmailAndPassword. On a perdu 2h à essayer.

**How to apply:**
- JAMAIS recréer via `firebase auth:import` → toujours via le formulaire signup du site
- JAMAIS stocker le mot de passe en local → utiliser `gh secret list` pour vérifier qu'il existe
- Si les comptes sont supprimés → les recréer via Playwright sur le preview server (voir scripts/test-multi-user.mjs)
- Les emails `ci-*@spothitch.com` sont dans `functions/config/ignoredAccounts.js` (pas de notifications Telegram)
- Ces comptes survivent aux crashs Linux (ils sont dans Firebase, pas en local)
