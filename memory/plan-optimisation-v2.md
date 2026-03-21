# Plan Optimisation V2 — SpotHitch

> Créé : 2026-03-21
> Source : discussion Phase 2 multi-user + retour Antoine

## MAINTENANT (à implémenter cette session)

### Intégrité des données
- [ ] 1. **Spots immuables** : verrouiller Firestore rules (créateur ne peut plus modifier après publication)
- [ ] 2. **Historique GPS local** : enregistrer positions quand l'app est ouverte, stocker dans IndexedDB, garder 24h
- [ ] 3. **Vérification check-in** : doit avoir été à <500m du spot dans les 24h
- [ ] 4. **Vérification validation** : doit avoir été à <2km du spot dans les 24h
- [ ] 5. **Niveau de confiance check-in** : GPS <500m = "Vérifié sur place", GPS <2km = "Position confirmée", pas de GPS = "Non vérifié"
- [ ] 6. **1 review par user par spot** + longueur min 10 chars + filtre profanité
- [ ] 7. **Signalement de reviews** (bouton signaler sur chaque review)
- [ ] 8. **Détection doublons** : si spot à <500m d'un existant → message "Un spot existe déjà ici" avec choix : valider l'existant / créer quand même (avec justification envoyée à l'admin)

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
