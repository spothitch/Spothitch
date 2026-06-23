import { test, expect } from '@playwright/test'

/**
 * Remaining state-changing handlers — STABLE (Brique 2). Unlike the abandoned shared-loop
 * version, each handler gets its OWN test with a FRESH page, so there is zero cross-handler
 * interference. Each test boots, resets the target key to a unique sentinel, runs the real
 * handler, and asserts the key changed. A few handlers need their view mounted first (tab).
 */
const CASES = [
  // [handler, targetKey, arg, tabToLoad]
  ['claimDailyReward', 'showDailyReward', undefined, null],
  ['declineLocationPermission', 'locationPermissionDenied', undefined, null],
  ['hideCookieCustomize', 'showCookieCustomize', undefined, null],
  ['guardianBtnUp', 'showGuardianModal', undefined, null],
  ['triggerSOS', 'showSOS', undefined, null],
  ['openSettings', 'activeTab', undefined, null],
  ['openFriendsChat', 'selectedFriendId', 'friend-1', null],
  ['reportSpotAction', 'showReport', 'spot-1', null],
  ['nearbySpotChooseCreate', 'nearbySpotChoiceData', undefined, null],
  ['contactBuddyAuthor', 'activeDMConversation', 'u1', null],
  ['openGuidesOverlay', 'voyageSubTab', undefined, null],
  ['openTripPlanner', 'voyageSubTab', undefined, null],
  ['showBuddyCreate', 'voyageursView', undefined, 'social'],
  ['showBuddyList', 'voyageursView', undefined, 'social'],
  ['showFriends', 'socialSubTab', undefined, 'social'],
  ['showGuides', 'selectedCountryCode', 'FR', null],
  ['journalAddLeg', 'journalView', undefined, 'carnet'],
  ['closeSettings', 'profileSubTab', undefined, null],
  ['sortMySpots', '_mySpotsSort', 'recent', 'profil'],
  ['setBuddyTravelMode', 'buddyFormData', 'car', 'social'],
  ['setBuddyVisibility', 'buddyFormData', 'public', 'social'],
  ['openCountryGuide', 'selectedCountryGuide', 'FR', null],
  ['openFriendChat', 'activeDMConversation', 'u1', null],
  ['openMyCountries', 'profileDetailView', undefined, 'profil'],
  ['openMySpots', 'profileDetailView', undefined, 'profil'],
  ['openMyValidations', 'profileDetailView', undefined, 'profil'],
  ['openTripDetail', 'tripDetailIndex', 1, null],
  ['acceptLocationPermission', 'showLocationPermission', undefined, null],
  ['backFromVoyageurs', 'voyageursView', undefined, 'social'],
  ['contactNearbyTraveler', 'socialSubTab', 'u1', 'social'],
]

for (const [fn, key, arg, tab] of CASES) {
  test(`${fn} changes ${key}`, async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('spothitch_welcomed', 'true')
        localStorage.setItem('spothitch_age_verified', 'true')
        localStorage.setItem('spothitch_cookie_consent', 'true')
        localStorage.setItem('spothitch_landing_seen', 'true')
      } catch { /* ignore */ }
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForFunction(() => typeof window.getState === 'function', { timeout: 15000 })
    if (tab) {
      await page.evaluate((t) => window.changeTab?.(t), tab)
      await page.waitForFunction((f) => typeof window[f] === 'function', fn, { timeout: 15000 }).catch(() => {})
    }
    const r = await page.evaluate(async ({ fn, key, arg }) => {
      if (typeof window[fn] !== 'function') return 'not-a-function'
      const reset = '__RESET_' + Math.random().toString(36).slice(2)
      window.setState({ [key]: reset })
      try {
        const x = window[fn](arg === undefined ? '__t__' : arg)
        if (x && typeof x.then === 'function') await Promise.race([x.catch(() => {}), new Promise((y) => setTimeout(y, 250))])
      } catch (e) { return 'threw ' + String(e.message).slice(0, 40) }
      return window.getState()[key] !== reset ? 'ok' : 'no-change'
    }, { fn, key, arg })
    expect(r, `${fn} should change ${key}`).toBe('ok')
  })
}
