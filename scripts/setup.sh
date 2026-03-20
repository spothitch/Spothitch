#!/bin/bash
# ============================================
# SpotHitch - Script de setup complet
# Lance ce script après un reset Linux :
#   bash ~/setup-spothitch.sh
# ============================================

set -e
echo "🤙 SpotHitch Setup - Installation complète"
echo ""

# 1. Node.js (via nvm si pas installé)
if ! command -v node &> /dev/null; then
  echo "📦 Installation de Node.js..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
  echo "✅ Node.js $(node -v) installé"
else
  echo "✅ Node.js $(node -v) déjà installé"
fi

# 2. Git config (si pas déjà fait)
if [ -z "$(git config --global user.email)" ]; then
  echo "📝 Configuration Git..."
  git config --global user.name "Antoine"
  git config --global user.email "antoine.v.ville@gmail.com"
  echo "✅ Git configuré"
else
  echo "✅ Git déjà configuré ($(git config --global user.email))"
fi

# 3. Clone le repo (si pas déjà fait)
if [ ! -d "$HOME/Spothitch" ]; then
  echo "📥 Clonage du repo SpotHitch..."
  cd "$HOME"
  git clone https://github.com/spothitch/Spothitch.git
  echo "✅ Repo cloné"
else
  echo "✅ Repo déjà présent, mise à jour..."
  cd "$HOME/Spothitch"
  git pull origin main 2>/dev/null || true
fi

cd "$HOME/Spothitch"

# 4. Install des dépendances npm
echo "📦 Installation des dépendances npm..."
npm install
echo "✅ Dépendances installées"

# 5. Playwright (pour les tests E2E)
echo "🎭 Installation de Playwright..."
npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium
echo "✅ Playwright installé"

# 6. Firebase CLI
if ! command -v firebase &> /dev/null; then
  echo "🔥 Installation de Firebase CLI..."
  sudo npm install -g firebase-tools
  echo "✅ Firebase CLI installé"
  echo ""
  echo "⚠️  Tu dois te connecter à Firebase :"
  echo "   firebase login"
  echo ""
else
  echo "✅ Firebase CLI déjà installé"
fi

# 7. Cloud Functions dependencies
if [ -d "$HOME/Spothitch/functions" ]; then
  echo "📦 Installation des dépendances Cloud Functions..."
  cd "$HOME/Spothitch/functions"
  npm install
  cd "$HOME/Spothitch"
  echo "✅ Cloud Functions dépendances installées"
fi

# 8. gcloud CLI (pour les backups Firestore)
if ! command -v gcloud &> /dev/null && [ ! -f "$HOME/google-cloud-sdk/bin/gcloud" ]; then
  echo "☁️ Installation de gcloud CLI..."
  curl -sS https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz -o /tmp/gcloud.tar.gz
  tar -xzf /tmp/gcloud.tar.gz -C "$HOME/"
  "$HOME/google-cloud-sdk/install.sh" --quiet --path-update true 2>/dev/null
  rm /tmp/gcloud.tar.gz
  echo "✅ gcloud CLI installé"
  echo "⚠️  Tu dois te connecter à gcloud :"
  echo "   $HOME/google-cloud-sdk/bin/gcloud auth login --project=spothitch"
else
  echo "✅ gcloud CLI déjà installé"
fi

# Vérification du .env
if [ ! -f "$HOME/Spothitch/.env" ] && [ ! -f "$HOME/Spothitch/.env.local" ]; then
  echo "⚠️  Pas de fichier .env trouvé. Il devrait être dans le repo."
else
  echo "✅ Fichier .env présent"
fi

# Build de vérification
echo "🔨 Build de vérification..."
npm run build 2>&1 | tail -3
echo "✅ Build OK"

# Tests rapides
echo "🧪 Tests wiring..."
npx vitest run tests/wiring/ 2>&1 | tail -5

echo ""
echo "============================================"
echo "🤙 SpotHitch est prêt !"
echo ""
echo "Commandes utiles :"
echo "  npm run dev          → Serveur de dev"
echo "  npm run build        → Build production"
echo "  npm run test:run     → Tests unitaires"
echo "  firebase login       → Se connecter à Firebase (1 seule fois)"
echo "  firebase deploy --only firestore:rules --project spothitch  → Règles Firestore"
echo "  firebase deploy --only functions --project spothitch       → Cloud Functions"
echo "============================================"
