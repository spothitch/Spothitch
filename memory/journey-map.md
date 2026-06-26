# Carte mathématique des PARCOURS réels de SpotHitch

> Base mathématique : **554 actions cliquables distinctes** (chaque `on*="..."` du code, hors
> fonctions JS natives) — extraites par `scripts/analyze-journeys.mjs`. Ci-dessous elles sont
> regroupées en **PARCOURS** (séquences réelles : cliquer le vrai bouton, remplir les vrais
> champs, dans le vrai contexte). Pour chaque parcours, 3 dimensions à vérifier :
> - **[V]** Variations / détails (chaque type, chaque champ, vide vs rempli, chaque cas)
> - **[D]** Conformité visuelle (couleurs, icônes, layout = ce qui était prévu)
> - **[M]** Conséquence multi-utilisateur (A clique CE bouton → B voit-il l'effet sur SON interface ?)
>
> Règle absolue : **cliquer les vrais boutons, jamais appeler la fonction seule.**
> Statut : ☐ à faire en click-through · ◐ partiellement · ✅ click-through fait

---

## 1. LANDING / ACCÈS (6 parcours)
1. ☐ Saisir le code alpha → déblocage [V: bon code / mauvais code / vide]
2. ☐ Parcourir les slides d'intro (Suivant jusqu'au bout) [D: visuel de chaque slide]
3. ☐ Changer la langue sur le landing [V: FR/EN/ES/DE] [D: tout se traduit]
4. ☐ Installer la PWA depuis le landing [D: prompt d'install]
5. ☐ Ouvrir le changelog
6. ☐ Ouvrir FAQ / Contact / Mentions légales depuis le landing

## 2. AUTHENTIFICATION & ONBOARDING (12 parcours)
7. ☐ Vérification d'âge (accepter) [V: <18 bloqué]
8. ☐ Permission localisation — accepter [M: carte se centre]
9. ☐ Permission localisation — refuser [V: fallback gracieux]
10. ☐ Welcome : choisir un avatar + pseudo + valider [D: avatars affichés]
11. ☐ Welcome : passer (skip)
12. ☐ Login email + mot de passe [V: bon / mauvais / champs vides]
13. ☐ Signup email (vérif pseudo dispo → compléter profil) [V: pseudo pris]
14. ☐ Login Google [M: profil créé visible par autres]
15. ☐ Login Apple (iPhone)
16. ☐ Mot de passe oublié (recevoir l'email)
17. ☐ Compléter le profil après 1ère connexion
18. ☐ Se déconnecter (handleLogout) → reconnexion

## 3. CARTE / ACCUEIL (10 parcours)
19. ☐ Zoom + / − sur la carte [D: la carte zoome vraiment]
20. ☐ Centrer sur ma position [M: ma position GPS réelle]
21. ☐ Rechercher une destination → la carte y va [V: ville existante / inexistante]
22. ☐ Effacer la recherche
23. ☐ Afficher / masquer la légende de la carte [D: couleurs des marqueurs = prévu]
24. ☐ Afficher les stations-service [D: icônes stations]
25. ☐ Bulles pays → télécharger un pays / créer un spot depuis une bulle
26. ☐ Ouvrir le panneau d'une ville → voir routes / spots de la ville
27. ☐ Cliquer un spot sur la carte → ouvre le détail [D: couleur du marqueur selon qualité]
28. ☐ Changer d'onglet (carte / voyage / social / carnet / profil) [D: nav active]

## 4. SPOTS — CRÉER UN SPOT (20 parcours) ⚠️ détails complets exigés
29. ☐ Créer un spot type "Sortie de ville" — flux complet 1→2→3→envoi [D: icône+couleur type]
30. ☐ Créer un spot type "Station-service" — flux complet [D]
31. ☐ Créer un spot type "Bord de route" — flux complet [D]
32. ☐ Créer un spot type "Autre" — flux complet [D]
33. ☐ Position via GPS réel (useGPSForSpot) [M: spot apparaît pour les autres]
34. ☐ Position via picker carte plein écran (openFullscreenMapPicker)
35. ☐ Détection auto de la route (autoDetectRoad)
36. ☐ Saisir ville de départ + ville de direction (recherche + sélection)
37. ☐ Étape 2 : direction + méthode + taille groupe + heure + saison [V: chaque champ obligatoire]
38. ☐ Étape 3 : noter sécurité/trafic/accessibilité (3 barres) [D: couleurs des barres]
39. ☐ Étape 3 : cocher les commodités (abri/eau/toilettes/visibilité/place) [D: toggles]
40. ☐ Étape 3 : ajouter une photo (triggerPhotoUpload) [V: avec / sans photo]
41. ☐ Étape 3 : date d'expérience (aujourd'hui / personnalisée)
42. ☐ Ajouter une destination supplémentaire / la retirer
43. ☐ Voir le récapitulatif → envoyer (handleAddSpot) [M: créateur + autres voient le spot]
44. ☐ Précédent (revenir à l'étape d'avant) sans perdre les données
45. ☐ Sauver en brouillon → fermer → reprendre le brouillon → supprimer le brouillon
46. ☐ Détection doublon : "spot à proximité" → valider l'existant
47. ☐ Détection doublon : "c'est un autre" → continuer la création
48. ☐ Astuce Google Maps (afficher en entier / masquer)

## 5. SPOTS — DÉTAIL / VALIDER / NOTER (18 parcours) ⚠️ détails complets exigés
49. ☐ Ouvrir le détail d'un spot → voir TOUS les détails (photo, 3 notes, validations, direction, méthode, attente) [D: tout est correct et lisible]
50. ✅ Valider "j'ai fait du stop ici" — flux complet (étape 1 Suivant CORRIGÉ) [M: compteur de validations monte pour les autres]
51. ☐ Validation rapide (quickValidateSpot) [M]
52. ☐ Check-in complet (résultat trajet, attente, caractère, photo, envoi) [M]
53. ☐ Noter le spot (ouvrir notation → 3 critères → fermer) [D: étoiles/barres]
54. ☐ Écrire un avis (submitReview) [V: vide / trop court / OK] [M: visible par les autres]
55. ☐ Mettre / retirer des favoris (toggleFavorite) [D: cœur change]
56. ☐ Signaler le spot (choisir raison → envoyer) [M: l'admin le voit en modération]
57. ☐ Voir en Street View (confirmer dispo / pas dispo)
58. ✅ Ouvrir une photo en plein écran (openPhotoFullscreen — CORRIGÉ) + fermer
59. ☐ Partager le spot (carte de partage / lien Google Maps)
60. ☐ Lancer la navigation vers le spot (apps externes)
61. ☐ Traduire les avis (traduire / voir l'original)
62. ☐ Supprimer mon propre spot (sans validations d'autres) [M: disparaît pour les autres]
63. ☐ Empêcher la suppression d'un spot validé par d'autres [V: blocage attendu]
64. ☐ Voir le profil du créateur du spot
65. ☐ Filtrer les spots (note min, attente max, favoris, tri) → appliquer / réinitialiser
66. ☐ Changer le mode d'affichage (carte / liste)

## 6. VOYAGE / PLANIFICATEUR (15 parcours)
67. ☐ Planifier un trajet (départ + arrivée → calculer) [V: villes valides / invalides]
68. ☐ Échanger départ/arrivée (swap)
69. ☐ Voir les spots sur l'itinéraire [D: marqueurs sur la route]
70. ☐ Stations-service / commodités le long du trajet (toggle)
71. ☐ Filtrer la route (setRouteFilter)
72. ☐ Sauver le trajet avec ses spots [M: si public, visible]
73. ☐ Charger un trajet sauvé / le renommer / le supprimer
74. ☐ Retirer un spot du trajet
75. ☐ Centrer la carte trajet sur le GPS
76. ☐ Démarrer un trajet (startTrip) → le terminer (finishTrip)
77. ☐ Voir un trajet sur la carte (viewTripOnMap)
78. ☐ Plier / déplier le formulaire de trajet (bottom sheet)
79. ☐ Sélectionner une suggestion de ville (autocomplétion)
80. ☐ Sous-onglets Voyage (guides, etc.)
81. ☐ Sélectionner un guide depuis le voyage

## 7. CARNET DE VOYAGE / JOURNAL (16 parcours)
82. ☐ Créer un nouveau voyage (journalNewTrip / journalCreateTrip)
83. ☐ Ouvrir un voyage existant
84. ☐ Ajouter une étape (leg) → choisir le transport → sauver
85. ☐ Choisir un spot pour l'étape (depuis la carte / picker)
86. ☐ Ajouter / supprimer une photo du jour
87. ☐ Éditer une note de jour → sauver
88. ☐ Éditer les dépenses du jour → sauver
89. ☐ Afficher / masquer les dépenses, voir les stats
90. ☐ Utiliser ma position pour une étape
91. ☐ Terminer le voyage (journalEndTrip)
92. ☐ Publier le voyage (journalTogglePublic) [M: visible des autres en lecture]
93. ☐ Partager le voyage / copier le lien
94. ☐ Exporter le voyage (export)
95. ☐ Supprimer un voyage
96. ☐ Revenir en arrière (journalBack) sans perdre
97. ☐ Sélectionner un spot depuis la carte du carnet

## 8. SOCIAL — AMIS (10 parcours) — multi-utilisateur fort
98. ☐ Ajouter un ami par pseudo [M: B reçoit la demande]
99. ☐ Envoyer une demande d'ami depuis un profil [M: B la voit]
100. ☐ Accepter une demande d'ami [M: les deux deviennent amis]
101. ☐ Refuser une demande d'ami [M: A voit le refus / disparition]
102. ☐ Retirer un ami [M: disparaît des deux côtés]
103. ☐ Voir le profil d'un ami (showFriendProfile)
104. ☐ Copier le lien d'invitation / partager mon profil
105. ☐ Options d'un ami (showFriendOptions)
106. ☐ Bloquer un utilisateur [M: B ne peut plus interagir]
107. ☐ Débloquer un utilisateur [M: interactions rétablies]

## 9. SOCIAL — MESSAGERIE (8 parcours) — multi-utilisateur fort
108. ☐ Ouvrir une conversation 1-à-1 → envoyer un DM [M: B reçoit en temps réel]
109. ☐ Partager sa position dans un DM [M: B voit la position]
110. ☐ Partager un spot dans un DM [M: B voit le spot]
111. ☐ Créer une conversation de groupe (choisir amis) [M: membres ajoutés voient le groupe]
112. ☐ Envoyer un message de groupe [M: tous les membres reçoivent]
113. ☐ Quitter une conversation de groupe [M: les autres voient le départ]
114. ☐ Cocher/décocher un ami pour le groupe (toggleFriendForGroup)
115. ☐ Signaler un message / utilisateur depuis la conversation

## 10. SOCIAL — COMPAGNONS DE VOYAGE / RADAR (11 parcours) — multi-utilisateur
116. ☐ Créer une annonce de compagnon (départ/destination/dates/desc) [M: visible des autres]
117. ☐ Voir la liste des annonces / le détail d'une annonce
118. ☐ Contacter l'auteur d'une annonce [M: il reçoit le contact]
119. ☐ Chat de l'annonce (sendBuddyChatMessage) [M: l'autre reçoit]
120. ☐ Supprimer mon annonce [M: disparaît pour les autres]
121. ☐ Partager une annonce
122. ☐ Filtrer par pays / mode de voyage / dates flexibles
123. ☐ Radar de proximité : activer / régler le rayon / message [M: voyageurs proches notifiés]
124. ☐ Contacter un voyageur à proximité [M]
125. ☐ Retour depuis la vue compagnons (backFromVoyageurs)
126. ☐ Demande de compagnon depuis le feed (postCompanionRequest)

## 11. SOCIAL — ÉVÉNEMENTS & FEED (10 parcours) — multi-utilisateur
127. ☐ Créer un événement (submitCreateEvent) [M: visible des autres]
128. ☐ Voir le détail d'un événement
129. ☐ Rejoindre un événement [M: organisateur voit le participant]
130. ☐ Quitter un événement [M]
131. ☐ Commenter un événement [M: les autres voient le commentaire]
132. ☐ Répondre à un commentaire / afficher la réponse
133. ☐ Réagir à un commentaire [M]
134. ☐ Supprimer un événement / un commentaire (organisateur)
135. ☐ Partager un événement
136. ☐ Filtrer le feed / les événements (setFeedFilter, setEventFilter)

## 12. SOCIAL — CHATS PAYS (2 parcours) — multi-utilisateur
137. ☐ Rejoindre le chat d'un pays [M: les membres voient l'arrivée]
138. ☐ Voir tous les chats pays

## 13. MODE GARDIEN (15 parcours) ⚠️ SÉCURITÉ — détails complets + multi-utilisateur
139. ☐ Configurer un gardien (ajouter le gardien : nom + téléphone) [M: le gardien est lié]
140. ☐ Ajouter / retirer un contact de confiance
141. ☐ Régler l'intervalle de check-in (guardianSelectInterval)
142. ☐ Saisir la destination / la plaque du véhicule (saisir + sauver)
143. ☐ Démarrer une session gardien (startGuardian) [M: le gardien est notifié]
144. ☐ Faire un check-in (guardianCheckIn / guardianQuickCheckin) [M: le gardien voit "OK"]
145. ☐ Naviguer entre les écrans gardien (guardianGoToScreen)
146. ☐ Envoyer un message au gardien (guardianSendMessage) [M: le gardien le reçoit]
147. ☐ Le gardien répond (guardianSendReply) [M: le voyageur le reçoit]
148. ☐ Ajouter une photo de trajet [M: le gardien la voit]
149. ☐ Ajouter au journal depuis le gardien (guardianAddToJournal)
150. ☐ Le gardien appelle / message le voyageur (guardianCallTraveler/MessageTraveler) [M]
151. ☐ Appel d'urgence depuis le gardien (guardianCallEmergency)
152. ☐ Effacer l'historique de trajets (guardianClearHistory)
153. ☐ Check-in raté → escalade automatique [M: le gardien reçoit l'alerte] (test serveur/temps)

## 14. SOS (12 parcours) ⚠️ SÉCURITÉ — multi-utilisateur
154. ☐ Lire l'intro SOS → accepter
155. ☐ Déclencher le SOS [M: contacts notifiés]
156. ☐ Ajouter / retirer un contact d'urgence
157. ☐ Définir le contact principal (sosSetPrimaryContact)
158. ☐ Ajouter un ami comme contact (sosAddFriendAsContact)
159. ☐ Partager sa position SOS [M: les contacts voient la position]
160. ☐ SOS silencieux (toggle / config)
161. ☐ Diffusion communautaire (toggleCommunityAlerts + rayon) [M: la communauté voit sur la carte]
162. ☐ Personnaliser le message SOS (sosUpdateCustomMsg) [V: 4 langues]
163. ☐ Faux appel (ouvrir / répondre / refuser) [D: écran d'appel crédible]
164. ☐ Enregistrement audio (démarrer / arrêter)
165. ☐ Appel d'urgence (callEmergency) + marquer "en sécurité" (markSafe)

## 15. PROFIL & PARAMÈTRES (25 parcours)
166. ☐ Éditer le nom (openEditName → sauver)
167. ☐ Éditer la bio (saveBio)
168. ☐ Ajouter / supprimer / définir principale une photo de profil ⚠️ caméra native
169. ☐ Éditer les liens sociaux (editSocialLinks)
170. ☐ Éditer les infos personnelles (openEditPersonalInfo)
171. ☐ Changer pseudo / email / mot de passe
172. ☐ Gérer les langues parlées (ajouter / niveau / retirer)
173. ☐ Changer le thème (clair/sombre) [D: tout change de couleur]
174. ☐ Voir mes spots / mes pays / mes validations
175. ☐ Trier mes spots (sortMySpots)
176. ☐ Vérification d'identité (lancer le flux) ⚠️ gated alpha
177. ☐ Faire appel (openAppealForm) si banni
178. ☐ Exporter mes données (downloadMyData) [V: fichier complet]
179. ☐ Paramètres de confidentialité / consentement
180. ☐ Voir les utilisateurs bloqués
181. ☐ Signaler un bug (openBugReport)
182. ☐ Gérer le téléchargement hors-ligne d'un pays (télécharger / supprimer)
183. ☐ Tout effacer hors-ligne (clearAllOfflineData)
184. ☐ Réinitialiser l'app (resetApp) ⚠️ destructeur
185. ☐ Supprimer le compte (openDeleteAccount → confirmer) ⚠️ destructeur, 30j
186. ☐ Partager l'app / mon profil
187. ☐ Gérer les appareils connus (removeKnownDevice)
188. ☐ Sections paramètres (toggleSettingsSection)
189. ☐ Partage de position avec les amis (toggleLocationSharing) [M: amis voient ma position]
190. ☐ Aide accessibilité (openAccessibilityHelp)

## 16. GUIDES PAYS (6 parcours)
191. ☐ Parcourir un guide pays (sélectionner / catégories / sections)
192. ☐ Contribuer un conseil (submitGuideContribution) [M: après modération, visible]
193. ☐ Voter un conseil communautaire (voteCommunityTip) [M: le compteur monte]
194. ☐ Signaler une erreur de guide (reportGuideError)
195. ☐ Supprimer ma contribution
196. ☐ Filtrer les conseils par type

## 17. HÉBERGEMENTS / AFFILIÉS (3 parcours)
197. ☐ Voir / filtrer les recommandations d'auberges
198. ☐ Ajouter une recommandation d'auberge (submitHostelRec) [M: visible des autres]
199. ☐ Upvoter une auberge (upvoteHostel) [M]

## 18. DONS (2 parcours)
200. ☐ Faire un don (handleDonationClick → PayPal/Ko-fi) [V: petit montant réel]
201. ☐ Voir le remerciement après don

## 19. RGPD / LÉGAL (4 parcours)
202. ☐ Bandeau cookies : tout accepter / personnaliser / refuser
203. ☐ Sauver des préférences cookies personnalisées
204. ☐ Voir les pages légales (CGU / confidentialité / sécurité)
205. ☐ Demander la suppression de compte depuis Mes Données

## 20. ADMIN / MODÉRATION (12 parcours) — admin uniquement
206. ☐ Charger / filtrer les signalements (loadAdminReports + filtres)
207. ☐ Confirmer un signalement (action sur le spot) [M: spot marqué/masqué pour tous]
208. ☐ Rejeter un signalement
209. ☐ Relocaliser un spot signalé
210. ☐ Charger / approuver / rejeter les conseils guides
211. ☐ Charger / approuver / rejeter les vérifs d'identité
212. ☐ Charger le feedback / exporter en CSV
213. ☐ Charger les erreurs Sentry
214. ☐ Voir un spot signalé (adminViewSpot)
215. ☐ Outils debug (points, niveau, max stats, reset state, export state)
216. ☐ Naviguer dans les onglets admin
217. ☐ Voir le profil d'un utilisateur signalé

## 21. GAMIFICATION (12 parcours) — cachée en alpha, à tester si réactivée
218. ☐ Badges : voir la liste / le détail / popup de déblocage
219. ☐ Défis (Challenges) : onglets / participer
220. ☐ Classement (Leaderboard) : pays / onglets
221. ☐ Boutique (Shop) : catégories / échanger une récompense / mes récompenses
222. ☐ Quiz : choisir pays → jouer → répondre → réessayer
223. ☐ Récompense quotidienne (claim)
224. ☐ Équiper avatar / cadre / titre
225. ☐ Activer un booster
226. ☐ Défis entre amis (créer / accepter / refuser / annuler) [M]
227. ☐ Équipes (créer / rejoindre / inviter / paramètres / défi d'équipe) [M]
228. ☐ Titres (voir / fermer)
229. ☐ Stats (voir / partager)

## 22. DIVERS / NOTIFS / OUTILS (8 parcours)
230. ☐ Notification push de proximité : recevoir → valider rapide / signaler rapide [M]
231. ☐ Nudge d'activation des notifs (accepter / refuser)
232. ☐ Astuce contextuelle (afficher / fermer)
233. ☐ FAQ : rechercher / catégorie / ouvrir une question
234. ☐ Formulaire de contact (soumettre)
235. ☐ Webhooks (ajouter / activer / retirer) — avancé
236. ☐ Feature intro / slides (suivant / précédent / voter / feedback)
237. ☐ Démos profil (points/journal/social/gardien/auberges/spot) — vitrine

---

## TOTAL : 237 parcours réels
- **Mono-utilisateur** : ~180 parcours (un seul téléphone suffit)
- **Multi-utilisateur [M]** : ~57 parcours qui exigent **2 comptes / 2 téléphones** pour vérifier
  que l'action de A produit bien l'effet attendu sur l'interface de B.
- **Sécurité critique** (Gardien + SOS) : 27 parcours — priorité absolue
- **Destructeurs / gated** : ~15 (à faire avec précaution / si réactivés)

### Pour chaque parcours, 3 vérifications obligatoires
1. **[V] Fonctionnel + variations** : le bouton fait ce qu'il doit, dans tous les cas (vide,
   rempli, chaque type, erreur)
2. **[D] Visuel** : couleurs, icônes, layout = ce qui était prévu (pas de texte coupé/invisible)
3. **[M] Multi-utilisateur** : quand pertinent, l'effet est bien visible côté autre(s) utilisateur(s)

### État actuel (honnête)
- **2 parcours** vérifiés en VRAI click-through (validation spot étape 1 ✅, photo plein écran ✅)
- **235 parcours** restent à tester en cliquant les vrais boutons. Les "tests handlers" existants
  prouvent la tuyauterie, PAS le parcours réel — d'où ce plan.
