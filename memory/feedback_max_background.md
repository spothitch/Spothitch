---
name: Max 1 tâche en arrière-plan
description: Ne jamais lancer plus de 1 agent ou bash en background simultanément, ça crash la session
type: feedback
---

Maximum 1 agent ou commande bash en arrière-plan à la fois. Jamais 2+ en parallèle.

**Why:** La session du 2026-03-20 a crashé à cause de trop de tâches en arrière-plan lancées simultanément. Antoine a un Chromebook avec des ressources limitées, et les agents/bash en background consomment beaucoup de mémoire.

**How to apply:** Avant chaque `run_in_background: true`, vérifier qu'aucun autre agent/bash ne tourne déjà en background. Attendre la fin du précédent. Les lectures de fichiers parallèles (Read, Grep, Glob) restent OK car elles sont légères. Règle ajoutée dans CLAUDE.md comme RÈGLE #21.
