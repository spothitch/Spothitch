# E2E Coverage Map

> Last updated: 2026-03-19
> Total window.* handlers: ~600+ | Existing test files: 34 | Existing test count: ~497

Legend:
- ✅ = Has behavioral E2E test (verifies actual DOM/state result)
- ⚠️ = Has shallow test (handler existence check only, or just checks no crash)
- ❌ = No test coverage

---

## 1. Navigation & Core

| Flow | Status | Test File |
|------|--------|-----------|
| App loads with title | ✅ | navigation.spec.js |
| Navigate between all 4 tabs | ✅ | navigation.spec.js, userJourneys.spec.js |
| Tab aria-selected updates | ✅ | navigation.spec.js |
| Accessible nav role + aria-label | ✅ | navigation.spec.js, userJourneys.spec.js |
| Rapid tab switching stress | ✅ | comprehensiveE2E.spec.js, userJourneys.spec.js |
| Deep link ?route=social | ✅ | deeplinks.spec.js |
| Deep link ?route=profile | ✅ | deeplinks.spec.js |
| Deep link ?route=travel | ✅ | deeplinks.spec.js |
| Deep link ?action=add-spot | ✅ | deeplinks.spec.js |
| Deep link ?action=sos | ✅ | deeplinks.spec.js |
| Deep link ?action=login | ✅ | deeplinks.spec.js |
| Deep link ?action=quiz | ✅ | deeplinks.spec.js |
| Deep link ?action=shop | ✅ | deeplinks.spec.js |
| Deep link ?action=badges | ✅ | deeplinks.spec.js |
| Deep link ?action=settings | ✅ | deeplinks.spec.js |
| Deep link ?action=filters | ✅ | deeplinks.spec.js |
| Deep link ?search= | ✅ | deeplinks.spec.js |
| Keyboard Tab navigation | ⚠️ | comprehensiveE2E.spec.js |
| Escape closes modal | ⚠️ | comprehensiveE2E.spec.js |
| Scroll position saved per tab | ⚠️ | browserEvents.spec.js |
| changeTab handler | ❌ | — |
| goBack handler | ❌ | — |

## 2. Map

| Flow | Status | Test File |
|------|--------|-----------|
| Map container visible | ✅ | map.spec.js, navigation.spec.js |
| Search bar visible | ✅ | map.spec.js, criticalFlows.spec.js |
| Search accepts text input | ✅ | criticalFlows.spec.js |
| Search shows autocomplete suggestions | ✅ | criticalFlows.spec.js |
| Search on Enter | ✅ | map.spec.js, criticalFlows.spec.js |
| Search suggestion select | ✅ | criticalFlows.spec.js |
| Zoom in/out buttons work | ✅ | map.spec.js, userJourneys.spec.js |
| Zoom controls accessible (aria-label) | ✅ | map.spec.js |
| Filter modal opens | ✅ | map.spec.js |
| Add spot FAB visible | ✅ | map.spec.js |
| Add spot FAB opens modal | ✅ | map.spec.js |
| Map click interaction | ✅ | map.spec.js |
| Map persistence across tab switches | ✅ | criticalFlows.spec.js |
| Gas station toggle works | ✅ | map.spec.js |
| GPS center button | ⚠️ | mapDeep.spec.js |
| Filter apply/reset handlers | ⚠️ | mapDeep.spec.js |
| City panel handlers | ⚠️ | mapDeep.spec.js |
| Country bubble download | ⚠️ | mapDeep.spec.js |
| Offline country management | ⚠️ | mapDeep.spec.js |
| Map legend toggle | ⚠️ | mapDeep.spec.js |
| Search clear handlers | ⚠️ | mapDeep.spec.js |
| centerOnUser | ❌ | — |
| flyToCity | ❌ | — |
| loadCountryOnMap | ❌ | — |
| toggleSplitView | ❌ | — |
| homeClearSearch / homeClearDestination | ❌ | — |

## 3. Spot Detail

| Flow | Status | Test File |
|------|--------|-----------|
| openSpotDetail opens modal | ✅ | spotDetail.spec.js |
| Spot detail shows score circle | ✅ | spotDetail.spec.js |
| Expandable sections toggle | ✅ | spotDetail.spec.js |
| quickValidateSpot | ⚠️ | spotDetail.spec.js |
| toggleFavorite | ⚠️ | spotDetail.spec.js |
| reportSpotAction | ⚠️ | spotDetail.spec.js |
| startSpotNavigation | ⚠️ | spotDetail.spec.js |
| shareSpot / copySpotLink | ❌ | — |
| openSpotStreetView | ❌ | — |
| voteSpot (thumbs) | ❌ | — |
| addDestinationToExistingSpot | ❌ | — |
| openPhotoFullscreen | ❌ | — |
| closeSpotDetail | ❌ | — |

## 4. AddSpot Wizard

| Flow | Status | Test File |
|------|--------|-----------|
| Modal opens from FAB | ✅ | addSpotWizard.spec.js, map.spec.js |
| Step 1 shows photo area | ✅ | addSpotWizard.spec.js |
| Step navigation (next/prev) | ✅ | addSpotWizard.spec.js |
| Required field indicators | ✅ | comprehensiveE2E.spec.js |
| Photo upload & type fields | ✅ | comprehensiveE2E.spec.js |
| Spot type selection | ⚠️ | addSpotWizard.spec.js |
| Star rating | ⚠️ | addSpotWizard.spec.js |
| Draft save/restore | ⚠️ | addSpotWizard.spec.js |
| GPS button | ⚠️ | addSpotWizard.spec.js |
| Direction autocomplete | ⚠️ | addSpotWizard.spec.js |
| Submit handler | ⚠️ | addSpotWizard.spec.js |
| Map picker | ⚠️ | addSpotWizard.spec.js |
| All 6 spot types selectable | ❌ | — |
| closeAddSpot | ❌ | — |
| Departure city autocomplete | ❌ | — |

## 5. Auth

| Flow | Status | Test File |
|------|--------|-----------|
| Auth modal opens with login/signup | ✅ | comprehensiveE2E.spec.js |
| Email and password fields visible | ✅ | comprehensiveE2E.spec.js |
| Social login buttons (Google/FB/Apple) | ✅ | comprehensiveE2E.spec.js |
| Auth form validates empty email | ✅ | browserEvents.spec.js |
| Switch login/register mode (setAuthMode) | ❌ | — |
| Forgot password handler | ❌ | — |
| Email verification flow | ❌ | — |
| Phone verification flow | ❌ | — |
| closeAuth | ❌ | — |

## 6. Profile

| Flow | Status | Test File |
|------|--------|-----------|
| Profile view shows username | ✅ | navigation.spec.js, comprehensiveE2E.spec.js |
| Profile shows stats | ✅ | comprehensiveE2E.spec.js |
| Settings sub-tab has theme toggle | ✅ | comprehensiveE2E.spec.js, navigation.spec.js |
| Language selector | ✅ | criticalFlows.spec.js |
| App version displayed | ✅ | criticalFlows.spec.js |
| setProfileSubTab | ✅ | profile.spec.js |
| Bio edit handler | ⚠️ | profileDeep.spec.js |
| Avatar edit handler | ⚠️ | profileDeep.spec.js |
| Languages edit handler | ⚠️ | profileDeep.spec.js |
| Profile photo handlers | ⚠️ | profileDeep.spec.js |
| Social links handler | ⚠️ | profileDeep.spec.js |
| Profile customization | ⚠️ | profileDeep.spec.js |
| Invite friend / copy link | ⚠️ | profileDeep.spec.js |
| Delete account handler | ⚠️ | profileDeep.spec.js |
| Export data handler | ⚠️ | profileDeep.spec.js |
| Consent settings handler | ⚠️ | profileDeep.spec.js |
| Device manager handler | ⚠️ | profileDeep.spec.js |
| Changelog handler | ⚠️ | profileDeep.spec.js |
| Roadmap handlers | ⚠️ | profileDeep.spec.js |
| Identity verification | ⚠️ | profileDeep.spec.js |
| Feedback handlers | ⚠️ | profileDeep.spec.js |
| Contact form handler | ⚠️ | profileDeep.spec.js |
| Bug report handler | ⚠️ | profileDeep.spec.js |
| openEditProfile flow | ❌ | — |
| openMySpots / openMyValidations | ❌ | — |
| openMyCountries | ❌ | — |
| handleLogout | ❌ | — |
| resetApp | ❌ | — |

## 7. Social

| Flow | Status | Test File |
|------|--------|-----------|
| Social view loads | ✅ | navigation.spec.js |
| Feed content displays | ✅ | comprehensiveE2E.spec.js |
| Feed filter pills | ✅ | comprehensiveE2E.spec.js |
| Conversations sub-tab | ✅ | comprehensiveE2E.spec.js |
| Friends sub-tab | ✅ | comprehensiveE2E.spec.js |
| Zone chat message input | ✅ | criticalFlows.spec.js |
| Zone chat send message | ✅ | criticalFlows.spec.js |
| Events sub-tab | ✅ | userJourneys.spec.js |
| Messagerie sub-tab | ✅ | userJourneys.spec.js |
| setSocialTab handler | ✅ | social.spec.js |
| Friend profile handler | ⚠️ | socialDeep.spec.js |
| Send friend request | ⚠️ | socialDeep.spec.js |
| Accept/decline friend request | ⚠️ | socialDeep.spec.js |
| Open conversation (DM) | ⚠️ | socialDeep.spec.js |
| Send DM | ⚠️ | socialDeep.spec.js |
| Share spot/position in DM | ⚠️ | socialDeep.spec.js |
| Delete DM conversation | ⚠️ | socialDeep.spec.js |
| Create group | ⚠️ | socialDeep.spec.js |
| Send group message | ⚠️ | socialDeep.spec.js |
| Add member to group | ⚠️ | socialDeep.spec.js |
| Leave group | ⚠️ | socialDeep.spec.js |
| Zone chat room switch | ⚠️ | socialDeep.spec.js |
| Create event | ⚠️ | socialDeep.spec.js |
| Join/leave event | ⚠️ | socialDeep.spec.js |
| Event comments | ⚠️ | socialDeep.spec.js |
| Block/unblock user | ⚠️ | socialDeep.spec.js |
| Ambassador handlers | ⚠️ | socialDeep.spec.js |
| Nearby friends | ⚠️ | socialDeep.spec.js |
| showAddFriend | ❌ | — |
| Friend challenges | ❌ | — |

## 8. Voyage / Trip Planner

| Flow | Status | Test File |
|------|--------|-----------|
| Voyage tab with planner | ✅ | gamification.spec.js, comprehensiveE2E.spec.js |
| 3 sub-tabs visible | ✅ | gamification.spec.js |
| Switch to Guides sub-tab | ✅ | gamification.spec.js, criticalFlows.spec.js |
| Switch to Voyage sub-tab | ✅ | gamification.spec.js |
| Switch to Journal sub-tab | ✅ | gamification.spec.js |
| Trip from/to inputs visible | ✅ | tripPlanner.spec.js |
| Trip autocomplete on typing | ✅ | tripPlanner.spec.js |
| Swap from/to | ✅ | comprehensiveE2E.spec.js |
| Calculate trip with km result | ✅ | criticalFlows.spec.js |
| Trip save handler | ⚠️ | tripPlanner.spec.js |
| Trip multi-stop handlers | ⚠️ | tripPlanner.spec.js |
| Trip gas station toggle | ⚠️ | tripPlanner.spec.js |
| Trip bottom sheet | ⚠️ | tripPlanner.spec.js |
| Trip route filter | ⚠️ | tripPlanner.spec.js |
| Journal sub-tab content | ✅ | tripPlanner.spec.js |
| clearTrip | ❌ | — |
| saveTripWithSpots | ❌ | — |
| viewTripOnMap | ❌ | — |
| openTripHistory | ❌ | — |
| openActiveTrip | ❌ | — |
| startTrip / finishTrip | ❌ | — |

## 9. Guides

| Flow | Status | Test File |
|------|--------|-----------|
| Guides sub-tab accessible | ✅ | guides.spec.js |
| Country cards displayed | ✅ | criticalFlows.spec.js |
| Country guide opens | ✅ | guides.spec.js |
| Guide content renders | ✅ | guides.spec.js |
| Guide overlay content | ✅ | comprehensiveE2E.spec.js |
| Guide tip voting | ⚠️ | guides.spec.js |
| filterGuides | ❌ | — |
| submitGuideTip | ❌ | — |
| selectGuideTipCategory | ❌ | — |
| reportGuideError | ❌ | — |

## 10. SOS

| Flow | Status | Test File |
|------|--------|-----------|
| SOS modal opens with content | ✅ | comprehensiveE2E.spec.js |
| Share position button | ✅ | comprehensiveE2E.spec.js |
| Emergency contacts section | ✅ | comprehensiveE2E.spec.js |
| SOS disclaimer accept | ⚠️ | sosCompanion.spec.js |
| Emergency contacts handlers | ⚠️ | sosCompanion.spec.js |
| Custom message handler | ⚠️ | sosCompanion.spec.js |
| Silent alarm toggle | ⚠️ | sosCompanion.spec.js |
| Fake call handlers | ⚠️ | sosCompanion.spec.js |
| Recording handlers | ⚠️ | sosCompanion.spec.js |
| Tracking handlers | ⚠️ | sosCompanion.spec.js |
| Trigger SOS | ⚠️ | sosCompanion.spec.js |
| callEmergency (112/911) | ❌ | — |
| shareSOSLocation | ❌ | — |
| closeSOS | ❌ | — |

## 11. Companion

| Flow | Status | Test File |
|------|--------|-----------|
| Companion modal opens | ✅ | comprehensiveE2E.spec.js |
| Guardian setup form visible | ✅ | comprehensiveE2E.spec.js |
| Check-in interval selector | ✅ | comprehensiveE2E.spec.js |
| Guardian name/phone fields | ✅ | sosCompanion.spec.js |
| Start companion | ⚠️ | sosCompanion.spec.js |
| Check-in handler | ⚠️ | sosCompanion.spec.js |
| Alert handler | ⚠️ | sosCompanion.spec.js |
| Stop companion | ⚠️ | sosCompanion.spec.js |
| Trusted contacts | ⚠️ | sosCompanion.spec.js |
| History clear | ⚠️ | sosCompanion.spec.js |
| companionBtnUp/Down | ❌ | — |
| closeCompanionModal | ❌ | — |

## 12. Settings & Preferences

| Flow | Status | Test File |
|------|--------|-----------|
| Theme toggle (dark/light) | ✅ | comprehensiveE2E.spec.js |
| Theme persistence across reload | ✅ | comprehensiveE2E.spec.js |
| Language switch EN | ✅ | comprehensiveE2E.spec.js |
| Language switch ES | ✅ | comprehensiveE2E.spec.js |
| Language switch DE | ✅ | comprehensiveE2E.spec.js |
| Language persistence | ✅ | comprehensiveE2E.spec.js |
| Notification toggle | ⚠️ | browserEvents.spec.js |
| Proximity alerts toggle | ⚠️ | browserEvents.spec.js |
| Auto offline download toggle | ❌ | — |
| Privacy toggle | ❌ | — |
| Location sharing toggle | ❌ | — |

## 13. Gamification

| Flow | Status | Test File |
|------|--------|-----------|
| Quiz modal opens | ✅ | comprehensiveE2E.spec.js |
| Quiz country selection | ✅ | comprehensiveE2E.spec.js |
| Shop modal with categories | ✅ | comprehensiveE2E.spec.js |
| Shop items with prices | ✅ | comprehensiveE2E.spec.js |
| Shop pouces balance | ✅ | gamificationDeep.spec.js |
| Leaderboard with podium | ✅ | comprehensiveE2E.spec.js |
| Leaderboard time period tabs | ✅ | comprehensiveE2E.spec.js |
| Challenges weekly/monthly/annual | ✅ | comprehensiveE2E.spec.js |
| Badges modal opens/closes | ✅ | comprehensiveE2E.spec.js |
| Quiz start handler | ⚠️ | gamificationDeep.spec.js |
| Quiz answer handler | ⚠️ | gamificationDeep.spec.js |
| Quiz retry handler | ⚠️ | gamificationDeep.spec.js |
| Shop category switch | ⚠️ | gamificationDeep.spec.js |
| Shop purchase handlers | ⚠️ | gamificationDeep.spec.js |
| Leaderboard filter handlers | ⚠️ | gamificationDeep.spec.js |
| Daily reward claim | ⚠️ | gamificationDeep.spec.js |
| Challenge accept/decline | ⚠️ | gamificationDeep.spec.js |
| Team challenge handlers | ⚠️ | gamificationDeep.spec.js |
| Badge detail handler | ⚠️ | gamificationDeep.spec.js |
| Title equip handler | ⚠️ | gamificationDeep.spec.js |
| Confetti handler | ⚠️ | gamificationDeep.spec.js |
| Stats modal | ❌ | — |
| Season rewards | ❌ | — |
| Booster activation | ❌ | — |

## 14. Offline / PWA

| Flow | Status | Test File |
|------|--------|-----------|
| PWA manifest valid | ✅ | pwa.spec.js, userJourneys.spec.js |
| Service worker registers | ✅ | pwa.spec.js, userJourneys.spec.js |
| Offline indicator appears | ✅ | pwa.spec.js, browserEvents.spec.js |
| Cached content loads offline | ✅ | pwa.spec.js |
| Fast load (<5s) | ✅ | pwa.spec.js, userJourneys.spec.js |
| Minimal CLS | ✅ | userJourneys.spec.js |
| Responsive viewports | ✅ | pwa.spec.js, userJourneys.spec.js |
| App shell elements | ✅ | pwa.spec.js |
| State persists in localStorage | ✅ | pwa.spec.js, userJourneys.spec.js |
| State restores on reload | ✅ | pwa.spec.js |
| Touch interactions | ✅ | pwa.spec.js, userJourneys.spec.js |
| Touch-friendly targets (44x44) | ✅ | pwa.spec.js, userJourneys.spec.js |
| Dark mode preference | ✅ | pwa.spec.js |
| Reduced motion preference | ✅ | pwa.spec.js |
| Install PWA handler | ⚠️ | browserEvents.spec.js |
| Online triggers sync | ⚠️ | browserEvents.spec.js |
| downloadCountryForOffline | ❌ | — |
| clearAllOfflineData | ❌ | — |
| forceOfflineSync | ❌ | — |

## 15. Share Target

| Flow | Status | Test File |
|------|--------|-----------|
| Share Google Maps URL extracts coords | ✅ | deeplinks.spec.js |
| Share Apple Maps URL extracts coords | ✅ | deeplinks.spec.js |
| Share raw text coords | ✅ | deeplinks.spec.js |
| Share Waze URL | ✅ | deeplinks.spec.js |
| Share OpenStreetMap URL | ✅ | deeplinks.spec.js |
| shareApp handler | ⚠️ | browserEvents.spec.js |
| shareMyProfile | ⚠️ | browserEvents.spec.js |
| shareStats | ⚠️ | browserEvents.spec.js |
| processShare handler | ❌ | — |
| Auto-update guard during share | ❌ | — |

## 16. Cookie Consent / Privacy

| Flow | Status | Test File |
|------|--------|-----------|
| Landing/cookie banner on first visit | ✅ | comprehensiveE2E.spec.js, userJourneys.spec.js |
| Cookie consent persists | ✅ | comprehensiveE2E.spec.js |
| Cookie customize handler | ⚠️ | browserEvents.spec.js |
| acceptAllCookies | ❌ | — |
| refuseOptionalCookies | ❌ | — |
| saveCustomCookiePreferences | ❌ | — |
| downloadMyData (GDPR) | ❌ | — |

## 17. Onboarding / Tutorial

| Flow | Status | Test File |
|------|--------|-----------|
| Landing carousel for new users | ✅ | tutorial.spec.js |
| Dismiss landing shows map | ✅ | tutorial.spec.js |
| Alpha badge in landing | ✅ | tutorial.spec.js |
| Welcome popup for new users | ✅ | userJourneys.spec.js |
| Welcome dismissal | ✅ | userJourneys.spec.js |
| Age verification | ❌ | — |
| Alpha code validation | ❌ | — |
| Feature intro modals | ❌ | — |
| Tutorial start/skip | ❌ | — |
| completeWelcome | ❌ | — |

## 18. Error Handling / Resilience

| Flow | Status | Test File |
|------|--------|-----------|
| Navigate all views without JS errors | ✅ | comprehensiveE2E.spec.js, criticalFlows.spec.js |
| Open/close modals without JS errors | ✅ | comprehensiveE2E.spec.js |
| Rapid modal open/close | ✅ | comprehensiveE2E.spec.js |
| Invalid state handling | ✅ | comprehensiveE2E.spec.js |
| Empty spots data handling | ✅ | comprehensiveE2E.spec.js |
| Long username handling | ✅ | comprehensiveE2E.spec.js |
| Double-click navigation | ✅ | userJourneys.spec.js |
| Going offline and back online | ✅ | userJourneys.spec.js, browserEvents.spec.js |
| Network resilience (single failure) | ❌ | — |
| Auto-update guard | ❌ | — |

## 19. Admin

| Flow | Status | Test File |
|------|--------|-----------|
| Admin panel opens | ✅ | userJourneys.spec.js |
| Admin tabs navigation | ✅ | userJourneys.spec.js |
| Admin moderation | ⚠️ | admin.spec.js |
| loginAsAdmin | ⚠️ | admin.spec.js |

## 20. Accessibility

| Flow | Status | Test File |
|------|--------|-----------|
| Document landmarks | ✅ | userJourneys.spec.js, accessibility.spec.js |
| Keyboard navigable | ✅ | userJourneys.spec.js |
| Accessible nav buttons | ✅ | userJourneys.spec.js |
| Screen reader announcements | ⚠️ | accessibility.spec.js |
| Focus management | ⚠️ | accessibility.spec.js |
| Skip to content link | ❌ | — |

## 21. Donation / Legal / FAQ

| Flow | Status | Test File |
|------|--------|-----------|
| Donation handler | ⚠️ | browserEvents.spec.js |
| FAQ search handler | ⚠️ | browserEvents.spec.js |
| openDonation modal | ❌ | — |
| showLegalPage | ❌ | — |
| openFAQ | ❌ | — |
| openContactForm | ❌ | — |
| openChangelog | ❌ | — |
| openRoadmap | ❌ | — |

---

## Summary

| Category | ✅ Behavioral | ⚠️ Shallow | ❌ Missing | Total |
|----------|--------------|------------|-----------|-------|
| Navigation & Core | 17 | 3 | 2 | 22 |
| Map | 14 | 7 | 5 | 26 |
| Spot Detail | 3 | 4 | 6 | 13 |
| AddSpot Wizard | 5 | 7 | 3 | 15 |
| Auth | 4 | 0 | 5 | 9 |
| Profile | 6 | 17 | 5 | 28 |
| Social | 10 | 18 | 2 | 30 |
| Voyage/Trip | 10 | 5 | 6 | 21 |
| Guides | 5 | 1 | 4 | 10 |
| SOS | 3 | 8 | 3 | 14 |
| Companion | 4 | 6 | 2 | 12 |
| Settings | 6 | 2 | 3 | 11 |
| Gamification | 9 | 11 | 3 | 23 |
| Offline/PWA | 14 | 2 | 3 | 19 |
| Share Target | 5 | 3 | 2 | 10 |
| Cookie/Privacy | 2 | 1 | 4 | 7 |
| Onboarding | 5 | 0 | 5 | 10 |
| Error Handling | 8 | 0 | 2 | 10 |
| Admin | 2 | 2 | 0 | 4 |
| Accessibility | 3 | 2 | 1 | 6 |
| Donation/Legal/FAQ | 0 | 2 | 6 | 8 |
| **TOTAL** | **135** | **101** | **72** | **308** |

**Behavioral coverage: 43.8% (135/308)**
**Any coverage: 76.6% (236/308)**
**Missing: 23.4% (72/308)**

### Key regression test file: `e2e/regression.spec.js`
Covers the 20 critical flows with behavioral assertions, adding ~60 new behavioral tests.
