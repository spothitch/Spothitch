# Dossier NLNet NGI Zero — SpotHitch

> Dernière mise à jour : 2026-03-24
> Statut : EN COURS — budget à retravailler
> Deadline : 1er avril 2026 12:00 CEST
> Montant : À REVOIR (était 46K, à ajuster honnêtement)

---

## État des champs

| # | Champ | Limite | Statut |
|---|-------|--------|--------|
| 1 | Nom | — | ✅ SpotHitch |
| 2 | Site | — | ✅ spothitch.com |
| 3 | Résumé | 1 200 car. | ⚠️ v7 trop long, à raccourcir |
| 4 | Expérience | 2 500 car. | ✅ Antoine écrit ses mots |
| 5 | Montant | 5K-50K € | ⚠️ À recalculer |
| 6 | Budget | 2 500 car. | ❌ À refaire honnêtement |
| 7 | Comparaison | 4 000 car. | ✅ v5 |
| 8 | Défis techniques | 5 000 car. | ✅ v4 (3 défis) |
| 9 | Écosystème | 2 500 car. | ✅ v6 |
| 10 | Déclaration IA | radio + texte | ✅ v2 |

---

## Ce qui EXISTE vs ce qui MANQUE

### EXISTE (pas de financement nécessaire)
- Guardian/Companion : tracking GPS, check-in timer, alerte (843+824 lignes)
- SOS : bouton urgence, faux appel, alarme silencieuse (1 093 lignes)
- App complète : carte, 96 guides, social, profil, gamification, offline basique

### MANQUE (financement légitime)
- SMS automatique serveur Twilio (actuellement : lien sms: que l'user doit cliquer)
- Chiffrement E2E des positions (actuellement : en clair dans Firestore)
- Background Sync offline SOS (actuellement : inexistant)
- Alerte communautaire nearby (actuellement : inexistant)
- Enregistrement audio/vidéo persistant (actuellement : UI seulement)

---

## Professionnels à engager (taux marché vérifiables)

| Pro | Taux | Durée | Coût |
|-----|------|-------|------|
| Développeur code review | 400-500 €/jour | ~2 sem | 4 000-5 000 € |
| Expert cryptographie | 500-600 €/jour | ~1 sem | 2 500-3 000 € |
| Designer UX/UI | 350-450 €/jour | ~1-2 sem | 2 500-4 000 € |
| UX Researcher | 300-400 €/jour | ~1 sem | 2 000-2 500 € |
| Traducteur pro 4 langues | 0.10-0.15 €/mot | — | ~3 500 € |
| Avocat tech/RGPD | 200-300 €/h | ~5-8h | 1 500-2 000 € |
| **Sous-total pros** | | | **16 000-20 000 €** |

### Question ouverte
- Faut-il demander pour le temps d'Antoine ? Le formulaire dit "Make rates explicit" et "human labor (including rates used)"

---

## Formulaire — structure exacte
- Call : NGI Zero Commons Fund
- Infos contact (nom, email, tel, organisation, pays)
- Nom projet + site web
- Abstract (1 200 car.)
- Expérience (2 500 car., optionnel)
- Montant (5K-50K €)
- Budget (2 500 car.) — "Make rates explicit"
- Comparaison (4 000 car.)
- Défis techniques (5 000 car., optionnel)
- Écosystème (2 500 car.)
- 3 pièces jointes projet (50 Mo chacune)
- Déclaration IA (radio + texte + 3 fichiers prompts)
- Privacy acknowledgment

---

## Ce qu'on SAIT des projets acceptés (vérifié)
- Karrot : 20K, ZÉRO milestones détaillés, juste "living expenses"
- Seppo : 50K, 6 mois, milestones mentionnés mais détails non publics
- Aral Balkan (rejeté) : trop confiant, a dit "c'est mon salaire"
- NLNet pèse "Cost effectiveness" à 30% du score
- Milestones détaillés = pour le contrat (MoU) APRÈS acceptation, pas le formulaire
- Aucune candidature complète n'est publique
- Le formulaire demande explicitement "Make rates explicit"

---

## Textes validés (versions finales avant réécriture Antoine)

### Résumé v7 (à raccourcir à 1 200 car.)
SpotHitch est une app open source pour les autostoppeurs. Carte communautaire, itinéraires, guides 96 pays, messagerie, radar de proximité, hors ligne. Prototype Guardian Mode et SOS Mode existant. Ce financement = professionnels (développeur, cryptographe, designer, UX researcher, avocat) pour vérifier et professionnaliser + features manquantes (SMS Twilio, chiffrement E2E, offline sync, alerte communautaire). Alpha → beta → stores après vérifications.

### Comparaison v5
Hitchmap (carte spots open source), Hitchwiki (wiki guides). OwnTracks/Grid (position sharing, pas de check-in auto/SOS). Life360 (propriétaire, surveillance parentale). Aucun ne combine check-in auto + alerte silence + SOS complet + alerte communautaire + offline, en open source.

### Défis v4 (3 défis)
1. SOS offline (IndexedDB + Background Sync)
2. Chiffrement E2E positions (vérifié par expert crypto)
3. Compatibilité iOS/Safari (PWA limitée)

### Écosystème v6
Alpha → beta → stores après audits. Modules Guardian/SOS = briques indépendantes réutilisables. Standard ouvert check-in. Services NLNet (audits gratuits). Durabilité : abonnement + licence commerciale.

### Déclaration IA v2
Claude pour recherche + structuration. Texte écrit par Antoine. Traduction par sa sœur. Chaque commit marqué Co-Authored-By. README conforme à la politique NLNet.

---

## Pièces jointes prévues
- **Projet 1** : Budget détaillé (PDF) — à refaire
- **Projet 2** : Screenshots app + schéma technique Guardian/SOS (PDF) — ✅ fait
- **Projet 3** : libre
- **IA 1** : Résumé prompts (PDF) — ✅ fait

## Prochaines étapes
1. [ ] Retravailler budget honnêtement
2. [ ] Décider montant pour temps d'Antoine
3. [ ] Raccourcir résumé à 1 200 caractères
4. [ ] Antoine réécrit tout avec ses mots
5. [ ] Sœur traduit en anglais
6. [ ] Soumettre avant 1er avril 2026 12:00 CEST
