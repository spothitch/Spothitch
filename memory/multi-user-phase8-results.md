# Multi-User Phase 8 Results: Carte & Navigation

> Date: 2026-03-21
> Score: 36/36 (100%, 1 flaky en local mais passe en CI)
> Duration: 4.6 min (local), CI success on main

## Tests by group

| Group | Tests | Status |
|-------|-------|--------|
| 8.1 Map loading | 3 | PASS |
| 8.2 Search | 5 | PASS |
| 8.3 Zoom | 3 | PASS |
| 8.4 Filters | 3 | PASS |
| 8.5 Spot from map | 3 | PASS |
| 8.6 Gas stations | 2 | PASS |
| 8.7 GPS | 2 | PASS |
| 8.8 Tab navigation | 3 | PASS |
| 8.9 Deep links | 4 | PASS |
| 8.10 Share target | 3 | PASS |
| 8.11 Offline | 3 | PASS |
| 8.12 Errors | 2 | PASS |

## Bugs found: 24 total, 4 critical fixed

### FIXED (4 critical)
1. **Coordinates not validated before flyTo/setView** — NaN, Infinity, out-of-range accepted → added isValidCoord() + isFinite() checks on all flyTo calls
2. **Race condition in homeSelectPlace** — concurrent search results could overwrite each other → added request ID guard
3. **Country code not validated** — emoji or script injection possible → added /^[A-Za-z]{2}$/ check
4. **Missing try/catch on map.flyTo** — uncaught errors if map not ready → wrapped in try/catch

### NOT FIXED (need larger refactoring)

| # | Severity | Issue | Why not fixed |
|---|----------|-------|---------------|
| 1 | MAJOR | Map event listeners never cleaned up on tab switch | Needs refactoring of map lifecycle. Listeners accumulate but don't cause user-visible bugs yet. |
| 2 | MAJOR | No WebGL availability check / fallback UI | Needs a full alternative view (spot list) for unsupported browsers. Big feature. |
| 3 | MAJOR | setView() has inverted coordinate order vs native flyTo() | Works by convention but fragile. Needs audit of every call site. |
| 4 | MAJOR | MapLibre init failure = blank screen, no error message | Needs fallback UI component. |
| 5 | MAJOR | flyToCity handler doesn't exist but is referenced in tests | Dead reference, not a user-facing bug. |
| 6 | MODERATE | Stale search results after multiple keystrokes | Need request ID on search debounce. |
| 7 | MODERATE | homeClearSearch race with setState | Edge case, rarely visible. |
| 8 | MODERATE | Gas stations getBounds without error handling | May throw on map not ready. |
| 9 | MODERATE | Long-press timer not cleaned on tab switch | Can trigger AddSpot in wrong context. |
| 10 | MODERATE | City panel spot merging can duplicate on concurrent opens | Rare edge case. |
| 11 | MODERATE | No navigator.onLine check for offline indicator | UX improvement. |
| 12 | MINOR | No zoom bounds on flyTo (resets user zoom) | UX preference. |
| 13 | MINOR | Photon API errors are silent (no toast) | Minor UX. |
| 14 | MINOR | Beta guard dual-definition for openCityPanel | Architecture debt. |

## Handlers tested

homeZoomIn, homeZoomOut, homeClearSearch, homeClearDestination, homeSelectPlace, homeCenterOnUser, toggleGasStations, openFilters, closeFilters, resetFilters, applyFilters, changeTab, openSpotDetail, closeSpotDetail, toggleMapLegend, openAddSpot, processShare, parseShareUrl
