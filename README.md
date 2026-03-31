# 🤙 SpotHitch v2.0

**La communauté des autostoppeurs** — Trouvez et partagez les meilleurs spots d'auto-stop dans le monde.

[![CI/CD](https://github.com/antoine626/Spothitch/actions/workflows/ci.yml/badge.svg)](https://github.com/antoine626/Spothitch/actions/workflows/ci.yml)
[![CodeQL](https://github.com/antoine626/Spothitch/actions/workflows/codeql.yml/badge.svg)](https://github.com/antoine626/Spothitch/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa)](https://spothitch.com)
[![Langues](https://img.shields.io/badge/langues-FR%20%7C%20EN%20%7C%20ES%20%7C%20DE-blue)](https://spothitch.com)

🌐 **[spothitch.com](https://spothitch.com)** | 💬 **[Discussions](https://github.com/antoine626/Spothitch/discussions)** | 🐛 **[Signaler un bug](https://github.com/antoine626/Spothitch/issues/new?template=bug_report.md)**

---

## 🌍 Fonctionnalités

- 📍 **14 669 spots** dans **137 pays**
- 🗺️ **Carte interactive** MapLibre GL JS avec tuiles OpenFreeMap
- 📱 **PWA installable** — fonctionne hors-ligne sur mobile et desktop
- 🆘 **Mode SOS** — contacts d'urgence locaux + partage de position
- 👥 **Companion** — partage de position en temps réel avec un proche
- 🧭 **Planificateur de voyage** multi-villes avec OSRM
- 📖 **Guides pays** pour 53 pays + pages villes pour 428 villes
- 💬 **Chat communautaire** en temps réel
- 🎮 **Gamification** — quiz, défis, badges, boutique, classement
- ⭐ **3 critères de notation** : sécurité, trafic, accessibilité
- 🌐 **4 langues** : Français, English, Español, Deutsch
- ♿ **Accessibilité** WCAG (skip links, screen reader, contraste)
- 🔒 **RGPD compliant** — consentement, export, suppression de données

## 📦 Installation

```bash
git clone https://github.com/antoine626/Spothitch.git
cd Spothitch
npm install
npm run dev
```

## 🧪 Tests

```bash
npm run test:run        # Tests unitaires (104 tests)
npm run test:e2e        # Tests E2E Playwright (240+ tests)
npm run lint            # Linting ESLint
```

## 🏗️ Stack technique

| Outil | Usage |
|-------|-------|
| Vite 5 | Build + HMR |
| Tailwind CSS 4 | Styles |
| MapLibre GL JS | Carte |
| Firebase | Auth + Firestore + Storage |
| Vitest | Tests unitaires |
| Playwright | Tests E2E |
| GitHub Actions | CI/CD |
| Cloudflare Pages | Hébergement |
| Sentry | Monitoring erreurs |

## 📊 Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build |
| `npm run test:run` | Tests unitaires |
| `npm run test:e2e` | Tests E2E |
| `npm run lint` | Linting |
| `npm run sync:spots` | Synchronise les spots |

## 🔧 Configuration

Créer un fichier `.env.local` :

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SENTRY_DSN=your_sentry_dsn  # optionnel
```

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Add ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvre une [Pull Request](https://github.com/antoine626/Spothitch/pulls)

Pour les questions → [Discussions](https://github.com/antoine626/Spothitch/discussions)
Pour les bugs → [Issues](https://github.com/antoine626/Spothitch/issues/new?template=bug_report.md)

## 🤖 Utilisation de l'IA

Ce projet utilise **Claude** (Anthropic) comme assistant de développement via Claude Code CLI.

**Comment l'IA est utilisée :**
- Écriture de code (logique, composants UI, tests, scripts CI)
- Debugging et correction de bugs
- Traductions (FR/EN/ES/DE)
- Génération de tests E2E et unitaires

**Comment l'IA n'est PAS utilisée :**
- Les décisions produit (quoi construire, pour qui, pourquoi) sont prises par Antoine
- Les données communautaires (spots) sont 100% créées par des utilisateurs
- Le design et les mockups sont conçus par Antoine

**Traçabilité :**
- Chaque commit généré avec l'IA contient `Co-Authored-By: Claude` dans le message
- Un log de provenance complet est disponible dans `memory/nlnet-prompt-provenance-log.md`

## 🙏 Crédits

- Cartes : [OpenFreeMap](https://openfreemap.org) & [OpenStreetMap](https://www.openstreetmap.org)
- Routing : [OSRM](http://project-osrm.org)

## 📄 Licence

MIT — voir [LICENSE](LICENSE) pour les détails.

---

Fait avec 🤙 par la communauté SpotHitch
test
