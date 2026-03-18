---
name: Bug destination Hitchwiki validation
description: Bug en cours. Impossible de taper une destination quand on valide un spot Hitchwiki. Investigation en cours, pas encore corrige.
type: project
---

## Bug : champ destination inutilisable dans validation spot Hitchwiki

**Signale par Antoine** : 2026-03-17
**Statut** : EN COURS D'INVESTIGATION, pas encore corrige

### Description du probleme

Quand un utilisateur ouvre un spot Hitchwiki et clique "Mon experience" / "Valider", le formulaire AddSpot s'ouvre en mode validation (3 etapes). Sur l'etape 2, le champ "Direction (destination city)" ne fonctionne pas. L'utilisateur ne peut pas ecrire/taper une destination. Tout le reste fonctionne (type de spot, ville de depart, methode, groupe, moment, etc.).

### Fichiers impliques

- `src/components/modals/AddSpot.js` : renderStep2() (ligne 220-367), initStep2Autocomplete() (ligne 1596-1637), swapStepContent() (ligne 879-914), initAddSpotAfterRender() (ligne 1717+)
- `src/handlers/spotActions.js` : openTestSpot() (ligne 171-205)
- `src/utils/autocomplete.js` : initAutocomplete() avec forceSelection: true
- `src/services/osrm.js` : searchPhoton()

### Ce qui a ete teste (Playwright sur spothitch.com)

1. **L'input `#spot-direction-city` est visible** dans le DOM, pas readonly, pas disabled
2. **`elementFromPoint` confirme** que l'input est l'element le plus haut (pas d'overlay dessus)
3. **`page.focus()` ECHOUE** : `document.activeElement` ne pointe pas vers l'input apres focus()
4. **`page.keyboard.type()` N'ECRIT RIEN** : la valeur reste vide
5. **`page.fill()` FONCTIONNE** : la valeur est definie ET l'autocomplete dropdown apparait avec des resultats
6. **L'API Photon fonctionne** : retourne 8 resultats pour "Lyon"
7. **Le `alpha-welcome-overlay` (id="alpha-welcome-overlay") existe dans le DOM** meme apres bypass du code alpha. Il est `fixed inset-0 z-50` et pourrait intercepter les evenements

### Hypotheses principales

**Hypothese 1 (la plus probable) : l'alpha-welcome-overlay intercepte les clics**
- L'overlay `#alpha-welcome-overlay` a `position: fixed; inset: 0; z-50` et couvre tout l'ecran
- Le modal AddSpot est aussi `z-50` mais dans `#app-modals` (apres `#app-overlays` dans le DOM)
- Meme si visuellement le modal est dessus, l'overlay pourrait capturer les evenements touch/click
- Sur le vrai telephone d'Antoine, l'overlay est peut-etre encore present dans le DOM meme apres avoir entre le code alpha (car `renderBetaBanner()` re-rend le popup a chaque render si `hasSeen()` est mal evalue)

**Hypothese 2 : probleme de focus dans la modal AddSpot**
- Le modal a un trap focus ou le `tabindex="0"` sur le dialog empecherait le focus de descendre aux inputs enfants
- `page.fill()` contourne ce probleme car il ecrit directement dans le DOM sans focus

**Hypothese 3 : timing autocomplete**
- `initStep2Autocomplete()` utilise 2 `import().then()` imbriques (async)
- Si un re-render survient entre le swapStepContent et l'init autocomplete, les listeners pourraient etre perdus
- Mais `page.fill()` fonctionne et declenche le dropdown, donc l'autocomplete EST initialise correctement

### Prochaines etapes pour corriger

1. **Verifier le `alpha-welcome-overlay`** : est-il present dans le DOM de production apres avoir entre le code alpha ? Si oui, c'est le bug. Fix : ajouter `pointer-events: none` ou le supprimer du DOM apres fermeture.
2. **Tester le focus trap** : verifier si `trapFocus()` dans App.js empêche le focus d'atteindre l'input direction
3. **Tester sur un vrai telephone** : demander a Antoine de faire un screen recording pour confirmer le comportement exact
4. **Fix preventif** : ajouter `pointer-events: none` a `#alpha-welcome-overlay` quand il est ferme, ou mieux, le supprimer du DOM avec `.remove()`

### Notes Playwright

Pour tester sur spothitch.com, ces cles localStorage sont necessaires :
```js
localStorage.setItem('spothitch_landing_v2', '1');
localStorage.setItem('spothitch_alpha_code', 'ok');
localStorage.setItem('spothitch_beta_popup_seen', '1');
localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
  preferences: { necessary: true }, timestamp: Date.now(), version: '1.0'
}));
localStorage.setItem('spothitch_v4_state', JSON.stringify({
  tutorialCompleted: true, showTutorial: false, showWelcome: false,
  showLanding: false, username: 'TestUser', points: 100
}));
```

`page.fill()` fonctionne pour injecter du texte, `page.focus()` + `page.keyboard.type()` ne fonctionne PAS.
3 spots sont charges en state avec `window.getState()`.
`window.openAddSpot()` et `window.openTestSpot(id)` fonctionnent.
