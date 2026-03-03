#!/bin/bash
COMMAND=$(echo "$CLAUDE_TOOL_INPUT" | jq -r '.command // ""')

if echo "$COMMAND" | grep -qE 'git add -A|git add \.'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"🚫 git add -A et git add . sont interdits (Règle #9). Utiliser des fichiers spécifiques : git add src/fichier.js"}}'
  exit 0
fi
exit 0
