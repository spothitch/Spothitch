#!/bin/bash
# Sauvegarde automatique en fin de session
cd /home/antoine/Spothitch

DATE=$(date '+%Y-%m-%d %H:%M')
COMMITS=$(git log --oneline -5 2>/dev/null || echo "aucun commit récent")

cat > memory/last-session.md << ENDSESSION
# Dernière session sauvegardée automatiquement

Date : $DATE

## Derniers commits
$COMMITS

## Note
Reprendre avec : claude --continue
ENDSESSION

exit 0
