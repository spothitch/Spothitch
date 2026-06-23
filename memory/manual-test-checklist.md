# Checklist des tests MANUELS — ce que Antoine doit tester lui-même

> Ces tests ne peuvent PAS être automatisés : ils ont besoin d'un vrai compte, d'un vrai
> téléphone, du vrai GPS/caméra/réseau, ou de 2 personnes. Le reste (615 actions) est déjà
> testé automatiquement et vert en CI.
>
> Conseil : coche au fur et à mesure. Teste sur **2 téléphones différents** (un récent, un
> vieux/pas cher) et idéalement **Android ET iPhone**.

---

## A. Connexion / Compte (vrais services)
- [ ] **Google** : se connecter avec un vrai compte Google → profil créé, photo récupérée
- [ ] **Apple** : se connecter avec Apple (sur iPhone) → compte créé
- [ ] **Email** : créer un compte avec un vrai email → recevoir l'email, valider, se connecter
- [ ] **Téléphone** : auth par SMS → recevoir le vrai code, valider
- [ ] **Mot de passe oublié** : demander la réinitialisation → recevoir l'email → changer le mot de passe
- [ ] **Déconnexion** puis reconnexion → on retrouve bien ses données
- [ ] **2 comptes sur 2 téléphones** : vérifier qu'ils sont bien distincts

## B. Caméra & Photos (sélecteur de fichier natif — non testable en auto)
- [ ] **Photo de spot** : créer un spot, ajouter une photo depuis l'appareil photo
- [ ] **Photo de spot** : ajouter une photo depuis la galerie
- [ ] La photo s'**upload**, s'affiche, et reste après rechargement
- [ ] **Photo de profil** : ajouter, en mettre une en principale, supprimer
- [ ] **Photo de check-in** : prendre une photo en validant un spot
- [ ] **Vérification d'identité** : photo du document + selfie
- [ ] **Photo gardien** : ajouter une photo de trajet pendant un mode gardien
- [ ] Vérifier qu'une **image trop grosse** est refusée/compressée proprement

## C. GPS / Localisation réelle
- [ ] **Autoriser la localisation** → la carte se centre sur ta vraie position
- [ ] **Refuser la localisation** → message clair, l'app marche quand même
- [ ] Bouton **"Me centrer"** → revient sur ta position
- [ ] **Créer un spot à ta position actuelle** → bonnes coordonnées
- [ ] **Spots à proximité** : voir les spots réellement proches de toi
- [ ] **Amis à proximité** (radar) avec un 2e téléphone
- [ ] Bouger physiquement → la position se met à jour

## D. Notifications push réelles
- [ ] **Activer les notifications** (accepter la permission)
- [ ] Recevoir une notif : **alerte gardien**, **nouveau message**, **validation de spot**
- [ ] Recevoir une notif **app fermée** (en arrière-plan)
- [ ] **Taper la notif** → ouvre le bon écran
- [ ] Refuser les notifs → l'app marche quand même

## E. Réseau réel
- [ ] **3G lente** : l'app charge, la carte, la recherche fonctionnent
- [ ] **Passer hors-ligne en pleine utilisation** → mode hors-ligne, spots en cache visibles
- [ ] **Revenir en ligne** → les données se synchronisent
- [ ] **Télécharger un pays hors-ligne** → puis le consulter sans réseau
- [ ] **Mode avion** : que fait le SOS ? (comportement de secours)
- [ ] Partage Google Maps d'un spot fonctionne

## F. Multi-utilisateurs réels (2 vrais téléphones)
- [ ] A crée un spot → **B le voit** apparaître
- [ ] A envoie un **message privé** → B le reçoit (et en temps réel si possible)
- [ ] A **valide le spot de B** → B voit la mise à jour
- [ ] **Demande d'ami** : A envoie → B accepte → amis des deux côtés
- [ ] **Conversation de groupe** : créer, ajouter des amis, échanger
- [ ] **Compagnon de voyage** : créer une annonce → B la voit → chat
- [ ] **SOS communautaire** : A déclenche → B le voit sur la carte

## G. Mode Gardien (SÉCURITÉ — à tester à fond)
- [ ] **Session complète** : configurer gardien + contacts + destination → démarrer → arriver → terminer
- [ ] **Rappels de check-in** arrivent à l'heure
- [ ] **Check-in raté** → escalade vers le gardien (le gardien est prévenu)
- [ ] Le **gardien voit le trajet en temps réel** (sur son téléphone)
- [ ] **Batterie qui meurt** : laisser le téléphone s'éteindre → le serveur détecte le timeout
- [ ] Déclencher un **SOS pendant le mode gardien**
- [ ] Ajouter/retirer un **contact de confiance**

## H. SOS (SÉCURITÉ — à tester à fond)
- [ ] **Déclencher le SOS** → les contacts sont notifiés (vrai SMS/appel si configuré)
- [ ] **SOS silencieux**
- [ ] **Position partagée** précise et à jour
- [ ] Bouton **appel d'urgence** (112/911)
- [ ] Le **template de message SOS** est correct dans les 4 langues

## I. Paiements / Affiliés
- [ ] **Don** (Ko-fi / PayPal) : aller au bout du paiement réel (petit montant)
- [ ] **Liens affiliés** (Booking, Hostelworld) → s'ouvrent correctement
- [ ] (Si configuré) le don est bien reçu

## J. Visuel / UX sur vrai téléphone
- [ ] Chaque écran sur un **petit téléphone** ET un **grand téléphone**
- [ ] **Mode sombre** cohérent partout
- [ ] **Gros texte / accessibilité** activé → tout reste lisible
- [ ] **Encoche / barres système** (notch, safe areas) ne cachent rien
- [ ] **Vieux téléphone pas cher** : l'app reste fluide
- [ ] Les **4 langues** (FR/EN/ES/DE) s'affichent sans texte coupé
- [ ] Pas de texte invisible (même couleur que le fond)
- [ ] Tous les boutons sont cliquables au doigt (pas trop petits)

## K. PWA / Installation
- [ ] **Installer sur l'écran d'accueil** (Android : "Ajouter à l'écran d'accueil")
- [ ] **Installer sur iPhone** (Safari → Partager → Sur l'écran d'accueil)
- [ ] **Splash screen** + **icône** corrects
- [ ] **Lancer l'app installée hors-ligne**
- [ ] Une mise à jour s'applique au prochain lancement (sans recharger en plein usage)

## L. Actions destructrices (exclues des tests auto — à vérifier soi-même)
- [ ] **Supprimer son compte** → délai de récupération 30 jours → puis suppression
- [ ] **Réinitialiser les données** de l'app
- [ ] **Supprimer son propre spot** (qui n'a pas d'avis d'autres users)
- [ ] **Bloquer / débloquer** un utilisateur
- [ ] **Signaler** un spot/user → vérifier côté **admin** (modération)

## M. Légal / RGPD
- [ ] **Bandeau cookies** : accepter / personnaliser / refuser
- [ ] **Exporter mes données** (télécharger) → le fichier est complet
- [ ] **Paramètres de confidentialité** (partage position, etc.)
- [ ] **Vérification d'âge** au premier lancement
- [ ] Pages légales (CGU, confidentialité, sécurité) s'affichent

## N. Gamification (seulement si tu la réactives en beta)
- [ ] Débloquer un **badge**
- [ ] **Défis** / challenges
- [ ] **Classement** (leaderboard)
- [ ] Montée de **niveau** + points

---

## Priorité si tu manques de temps
1. **G + H (Gardien + SOS)** — c'est la sécurité, le cœur de la promesse de l'app
2. **A (Connexion)** — si on ne peut pas se connecter, rien ne marche
3. **C + D (GPS + Notifs)** — le cœur fonctionnel
4. **F (Multi-users)** — sur 2 téléphones, l'expérience réelle
5. Le reste

> Tout ce qui n'est PAS dans cette liste est déjà couvert par les tests automatiques (615
> actions, CI vert). Cette liste = uniquement ce qui a besoin de TOI et du monde réel.
