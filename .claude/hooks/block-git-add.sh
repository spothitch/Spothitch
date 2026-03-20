#!/bin/bash
# Règle #9: Interdit git add -A et git add .
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(j.tool_input?.command||'')}catch{console.log('')}})")

if echo "$COMMAND" | grep -qE 'git add -A|git add \.'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"🚫 git add -A et git add . sont interdits (Règle #9). Utiliser des fichiers spécifiques : git add src/fichier.js"}}'
  exit 0
fi
exit 0
