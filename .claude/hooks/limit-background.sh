#!/bin/bash
# Règle #21: Max 1 tâche en arrière-plan à la fois
# Empêche les crashs causés par trop de tâches background simultanées

LOCK_FILE="/tmp/claude_bg_task.lock"
MAX_AGE=300  # 5 minutes auto-expiry

# Read stdin and check if run_in_background is true (using node instead of jq)
INPUT=$(cat)
RUN_BG=$(echo "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(j.tool_input?.run_in_background===true?'true':'false')}catch{console.log('false')}})")

if [ "$RUN_BG" != "true" ]; then
  exit 0
fi

# Check if a background task is already running
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0) ))
  if [ "$LOCK_AGE" -lt "$MAX_AGE" ]; then
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"🚫 Une tâche tourne déjà en arrière-plan (lancée il y a ${LOCK_AGE}s). Attendre qu'elle finisse avant d'en lancer une autre. (Règle #21)\"}}"
    exit 0
  fi
fi

# Allow and create lock
touch "$LOCK_FILE"
exit 0
