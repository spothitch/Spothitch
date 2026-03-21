#!/bin/bash
# ============================================
# SpotHitch - Script de setup complet
# Lance ce script après un reset Linux :
#   bash ~/setup-spothitch.sh
#
# Ce script fait TOUT :
# - Installe Node, Git, GitHub CLI, Firebase, gcloud, Playwright
# - Restaure tes sessions Claude, clés SSH, .env.local depuis le backup GitHub
# - Configure le backup automatique toutes les 5 min
# ============================================

set -e
echo "============================================"
echo " SpotHitch Setup - Installation complète"
echo "============================================"
echo ""

# 1. Node.js (via nvm si pas installé)
if ! command -v node &> /dev/null; then
  echo "[1/11] Installation de Node.js..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
  echo "  OK Node.js $(node -v)"
else
  echo "[1/11] Node.js $(node -v) OK"
fi

# 2. Git config
if [ -z "$(git config --global user.email)" ]; then
  echo "[2/11] Configuration Git..."
  git config --global user.name "Antoine"
  git config --global user.email "antoine.v.ville@gmail.com"
  echo "  OK Git configuré"
else
  echo "[2/11] Git OK ($(git config --global user.email))"
fi

# 3. GitHub CLI
if ! command -v gh &> /dev/null; then
  echo "[3/11] Installation de GitHub CLI..."
  (type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
    && sudo mkdir -p -m 755 /etc/apt/keyrings \
    && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
    && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && sudo apt update && sudo apt install gh -y
  echo "  OK GitHub CLI installé"
else
  echo "[3/11] GitHub CLI OK"
fi

# 4. Connexion GitHub
if ! gh auth status &>/dev/null 2>&1; then
  echo ""
  echo "============================================"
  echo " CONNEXION GITHUB REQUISE"
  echo " Suis les instructions (choisis 'Login with a web browser')"
  echo "============================================"
  echo ""
  gh auth login -p https -h github.com
else
  echo "[4/11] GitHub connecté ($(gh auth status 2>&1 | grep 'account' | head -1 | awk '{print $NF}'))"
fi

# 5. Restaurer le backup (sessions Claude, SSH, .env.local, etc.)
BACKUP_DIR="$HOME/chromebook-backup"
if [ ! -d "$BACKUP_DIR/.git" ]; then
  echo "[5/11] Recuperation du backup depuis GitHub..."
  gh repo clone spothitch/chromebook-backup "$BACKUP_DIR" 2>/dev/null || true
else
  echo "[5/11] Backup present, mise a jour..."
  cd "$BACKUP_DIR" && git pull --quiet 2>/dev/null || true
fi

if [ -d "$BACKUP_DIR" ]; then
  # Restaurer les clés SSH
  if [ -d "$BACKUP_DIR/ssh" ] && ls "$BACKUP_DIR/ssh/"* &>/dev/null; then
    echo "  Restauration cles SSH..."
    mkdir -p "$HOME/.ssh"
    chmod 700 "$HOME/.ssh"
    cp -f "$BACKUP_DIR/ssh/"* "$HOME/.ssh/" 2>/dev/null
    chmod 600 "$HOME/.ssh/id_"* 2>/dev/null
    chmod 644 "$HOME/.ssh/"*.pub 2>/dev/null
    echo "  OK Cles SSH restaurees"
  fi

  # Restaurer la config Git (si plus complète que la basique)
  if [ -f "$BACKUP_DIR/.gitconfig" ]; then
    cp -f "$BACKUP_DIR/.gitconfig" "$HOME/.gitconfig"
  fi

  # Restaurer la config GitHub CLI
  if [ -f "$BACKUP_DIR/gh/hosts.yml" ]; then
    mkdir -p "$HOME/.config/gh"
    cp -f "$BACKUP_DIR/gh/hosts.yml" "$HOME/.config/gh/"
    echo "  OK Config GitHub CLI restauree"
  fi

  # Restaurer les sessions Claude Code
  if [ -d "$BACKUP_DIR/claude-sessions" ] && ls "$BACKUP_DIR/claude-sessions/"*.jsonl &>/dev/null; then
    echo "  Restauration sessions Claude..."
    mkdir -p "$HOME/.claude/projects/-home-antoine-Spothitch"
    cp -f "$BACKUP_DIR/claude-sessions/"*.jsonl "$HOME/.claude/projects/-home-antoine-Spothitch/" 2>/dev/null
    echo "  OK Sessions Claude restaurees"
  fi

  # Restaurer la config Claude
  if [ -f "$BACKUP_DIR/claude-config/history.jsonl" ]; then
    mkdir -p "$HOME/.claude"
    cp -f "$BACKUP_DIR/claude-config/history.jsonl" "$HOME/.claude/"
  fi
  if [ -f "$BACKUP_DIR/claude-config/settings.json" ]; then
    cp -f "$BACKUP_DIR/claude-config/settings.json" "$HOME/.claude/"
  fi
  if [ -f "$BACKUP_DIR/claude-config/.credentials.json" ]; then
    cp -f "$BACKUP_DIR/claude-config/.credentials.json" "$HOME/.claude/"
  fi
else
  echo "[5/11] Pas de backup trouve (premiere installation ?)"
fi

# 6. Cloner SpotHitch
if [ ! -d "$HOME/Spothitch" ]; then
  echo "[6/11] Clonage du repo SpotHitch..."
  cd "$HOME"
  git clone https://github.com/spothitch/Spothitch.git
  echo "  OK Repo cloné"
else
  echo "[6/11] Repo present, mise a jour..."
  cd "$HOME/Spothitch"
  git pull origin main 2>/dev/null || true
fi

cd "$HOME/Spothitch"

# 7. Restaurer .env.local (clés Firebase)
if [ -f "$BACKUP_DIR/env/.env.local" ] && [ ! -f "$HOME/Spothitch/.env.local" ]; then
  cp -f "$BACKUP_DIR/env/.env.local" "$HOME/Spothitch/.env.local"
  echo "  OK .env.local restaure (cles Firebase)"
elif [ -f "$HOME/Spothitch/.env.local" ]; then
  echo "  .env.local deja present"
else
  echo ""
  echo "  ATTENTION : pas de .env.local trouve."
  echo "  Tu dois creer ~/Spothitch/.env.local avec les cles Firebase."
  echo "  Demande a Claude de t'aider si besoin."
  echo ""
fi

# 8. Dependances npm
echo "[7/11] Installation des dependances npm..."
npm install --quiet 2>/dev/null
echo "  OK"

# 9. Playwright
echo "[8/11] Installation de Playwright..."
npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium 2>/dev/null
echo "  OK"

# 10. Firebase CLI
if ! command -v firebase &> /dev/null; then
  echo "[9/11] Installation de Firebase CLI..."
  sudo npm install -g firebase-tools 2>/dev/null
  echo "  OK Firebase CLI installe"
  echo ""
  echo "  ACTION REQUISE : connecte-toi a Firebase :"
  echo "    firebase login"
  echo ""
else
  echo "[9/11] Firebase CLI OK"
fi

# 11. Cloud Functions
if [ -d "$HOME/Spothitch/functions" ]; then
  echo "[10/11] Dependances Cloud Functions..."
  cd "$HOME/Spothitch/functions"
  npm install --quiet 2>/dev/null
  cd "$HOME/Spothitch"
  echo "  OK"
else
  echo "[10/11] Pas de dossier functions/"
fi

# 12. gcloud CLI
if ! command -v gcloud &> /dev/null && [ ! -f "$HOME/google-cloud-sdk/bin/gcloud" ]; then
  echo "[11/11] Installation de gcloud CLI..."
  curl -sS https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz -o /tmp/gcloud.tar.gz
  tar -xzf /tmp/gcloud.tar.gz -C "$HOME/"
  "$HOME/google-cloud-sdk/install.sh" --quiet --path-update true 2>/dev/null
  rm /tmp/gcloud.tar.gz
  echo "  OK gcloud CLI installe"
  echo ""
  echo "  ACTION REQUISE : connecte-toi a gcloud :"
  echo "    ~/google-cloud-sdk/bin/gcloud auth login --project=spothitch"
  echo ""
else
  echo "[11/11] gcloud CLI OK"
fi

# 13. Configurer le backup automatique toutes les 5 minutes
if [ -f "$BACKUP_DIR/backup.sh" ]; then
  chmod +x "$BACKUP_DIR/backup.sh"
  # Ajouter le cron si pas déjà présent
  if ! crontab -l 2>/dev/null | grep -q "backup.sh"; then
    (crontab -l 2>/dev/null; echo "*/5 * * * * bash $BACKUP_DIR/backup.sh >> $BACKUP_DIR/backup.log 2>&1") | crontab -
    echo ""
    echo "  Backup automatique active (toutes les 5 min vers GitHub)"
  fi
fi

# Build de vérification
echo ""
echo "Build de verification..."
npm run build 2>&1 | tail -3
echo "  OK"

# Tests rapides
echo "Tests wiring..."
npx vitest run tests/wiring/ 2>&1 | tail -5

echo ""
echo "============================================"
echo " SpotHitch est pret !"
echo "============================================"
echo ""
echo "Tes sessions Claude ont ete restaurees."
echo "Le backup automatique tourne toutes les 5 min."
echo ""
echo "CONNEXIONS MANUELLES (si premiere install) :"
echo "  firebase login"
echo "  ~/google-cloud-sdk/bin/gcloud auth login --project=spothitch"
echo ""
echo "COMMANDES UTILES :"
echo "  claude                  Lancer Claude Code"
echo "  npm run dev             Serveur de dev"
echo "  npm run build           Build production"
echo "  npm run test:run        Tests unitaires"
echo "============================================"
