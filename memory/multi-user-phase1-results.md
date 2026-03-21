# Multi-User Phase 1 Results: Auth & Profile

> Date: 2026-03-21
> Score: 35/35 (100%)
> Duration: 5.4 min (local), CI success on main

## Tests by group

| Group | Tests | Status |
|-------|-------|--------|
| 1.1 Login email (5 accounts) | 5 | PASS |
| 1.2 Auth errors | 4 | PASS |
| 1.3 Login/Register toggle | 2 | PASS |
| 1.4 Forgot password | 1 | PASS |
| 1.5 Profile editing | 6 | PASS |
| 1.6 Username | 5 | PASS |
| 1.7 Cross-profile | 3 | PASS |
| 1.8 Identity verification | 3 | PASS |
| 1.9 Logout/session | 4 | PASS |
| 1.10 Language picker | 2 | PASS |

## Handlers tested (28)

signIn, signUp, openAuth, closeAuth, setAuthMode, handleForgotPassword, handleLogout, saveBio, editAvatar, editLanguages, saveSocialLink, addProfilePhoto, removeProfilePhoto, checkUsernameField, showFriendProfile, openIdentityVerification, closeIdentityVerification, submitIdentityDocument/submitVerificationPhotos, selectLanguageFromPicker, selectLanguageLevel, removeLanguage, cycleLanguageLevel, closeWelcome, getCurrentUid, programmaticLogin, programmaticLogout, setProfileSubTab, requireAuth

## Bugs found and fixed (12)

1. **loginAsAdmin** accessible in production → added VITE_SHOW_BETA guard
2. **Firebase session** didn't persist across reload → added setPersistence(browserLocalPersistence)
3. **saveSocialLink** no input sanitization → strips HTML/JS, validates network name
4. **handleForgotPassword** didn't validate email format → added regex check
5. **handleLogout** defined twice (authIdentity.js + Profile.js) → consolidated to authIdentity.js
6. **requireAuth** pending action stayed forever → auto-clears after 5 min
7. **openIdentityVerification** _ivState configurable:false → simplified to regular property
8. **addProfilePhoto** 400px/0.7 quality risked localStorage overflow → reduced to 200px/0.5, added quota error handling
9. **removeLanguage** no toast → added feedback toast
10. **cycleLanguageLevel** no toast → added level name toast
11. **Fake data** removed: share.js "100 spots", 5 fake ambassadors, loginAsAdmin fake stats
12. **Demo previews** added "Aperçu. Fictif." banner in 4 languages

## Recommendations not yet implemented

- editBio uses native prompt() → needs custom modal component
- editAvatar reopens Welcome modal → needs dedicated avatar picker
- Profile photos in base64 localStorage → should migrate to Firebase Storage
- Languages stored in separate localStorage key → architecture inconsistency
