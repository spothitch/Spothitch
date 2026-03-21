# Plan Optimisation V2 — SpotHitch

> Créé : 2026-03-21
> Source : discussion Phase 2 multi-user + retour Antoine

## MAINTENANT (à implémenter cette session)

### Intégrité des données
- [x] 1. **Spots immuables** ✅ 2026-03-21
- [x] 2. **Historique GPS local** ✅ 2026-03-21 (src/services/locationHistory.js)
- [x] 3. **Vérification check-in 500m** ✅ 2026-03-21
- [x] 4. **Vérification validation 2km** ✅ 2026-03-21
- [x] 5. **Niveau de confiance check-in** ✅ 2026-03-21
- [x] 6. **1 review par user par spot + 10 chars + profanité** ✅ 2026-03-21
- [ ] 7. **Signalement de reviews** (bouton signaler sur chaque review)
- [x] 8. **Détection doublons 500m** ✅ 2026-03-21

### Performance
- [ ] 9. **TTL cache 1h** sur les données pays IndexedDB
- [ ] 10. **Batch écritures Firestore** : favoris, validations regroupés, sync toutes les 30s

### Sécurité
- [ ] 11. **Rate limit global** : max 10 spots créés/jour, max 50 validations/jour
- [ ] 12. **Vérification email obligatoire** avant de créer des spots

### UX
- [ ] 13. **Notification de proximité améliorée** : "Tu passes près de [nom spot] ([distance]m) ! Valide-le"
- [ ] 14. **Score de fraîcheur visible** : "Dernière validation il y a X jours" sur chaque spot
- [ ] 15. **Auto-complete avec compteur** : "Lyon (12 spots)" dans la recherche
- [ ] 16. **Photo obligatoire au check-in si score confiance < 2** (nouveaux users)

### Code
- [ ] 17. **Error boundary global** : attraper les erreurs JS, afficher un message propre
- [ ] 18. **Remplacer prompt() par des modals** (editBio, etc.)
- [ ] 19. **Unifier l'état** : langues, bio, photos, social links dans l'état principal

## PLUS TARD (TODO pour version native ou post-beta)

- [ ] **Tracking GPS en arrière-plan** : impossible en PWA (iOS bloque). À implémenter quand on passe en app native (React Native). NOTER : c'est la prochaine étape majeure d'architecture.
- [ ] **Monétisation** : auberges affiliées (Hostelworld/Booking), spots sponsorisés, SpotHitch Pro. Antoine dit : "dans les todo, pas maintenant."
- [ ] **Météo au spot** : Antoine dit "pas besoin."
- [ ] **Heure de pointe** : déjà en place via les données temporelles des check-ins. Améliorer l'affichage plus tard.
- [ ] **Partage de trajet temps réel** : les amis voient la progression sur la carte. Feature sociale future.
- [ ] **Blacklist IP/device** : détecter les multi-comptes. Nécessite Cloud Function.
- [ ] **Metrics anonymes** : temps chargement, taux complétion wizard. Posthog déjà configuré.
- [ ] **Migrer photos profil vers Firebase Storage** : grosse migration, à planifier séparément.
- [ ] **Lazy-load markers carte** : ne charger que les spots dans le viewport. MapLibre gère déjà le clustering.
- [ ] **Compression Brotli** : côté serveur (Cloudflare le fait déjà automatiquement).

## FAIT — Phase 8 Map Optimizations (2026-03-22)

- [x] WebGL detection + fallback message ✅
- [x] MapLibre crash recovery (message + bouton Réessayer) ✅
- [x] Nettoyage event listeners au changement d'onglet ✅
- [x] Timer long-press nettoyé au changement d'onglet ✅
- [x] Validation coordonnées sur tous les flyTo/setView (isFinite + range) ✅
- [x] Toast sur échec recherche (erreur réseau) ✅
- [x] Debounce recherche avec request ID (résultats périmés ignorés) ✅
- [x] Respect du zoom actuel quand on sélectionne une ville ✅
- [x] Validation country code (regex A-Z) ✅
- [x] Race condition guard sur homeSelectPlace ✅
- [x] i18n : 5 clés carte en FR/EN/ES/DE ✅
