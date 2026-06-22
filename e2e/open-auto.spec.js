import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

/**
 * Auto-discovering open/show coverage (Brique 2) — every modal-opening handler
 * must actually OPEN something the user can see: a boolean state flag flips to true,
 * or a [role=dialog] / [aria-modal] node appears.
 *
 * Self-syncing: the handler list is extracted from source at run time, so a NEW
 * window.openX / window.showX added later is automatically required to open something
 * (ratchet) — unless it legitimately needs an argument/context, in which case it goes
 * in NEEDS_CONTEXT (those are covered by their feature-specific specs).
 */
const OPEN = (() => {
  const out = execSync("grep -rhoP 'window\\.(?:open|show)[A-Z]\\w* =' src/ --include=*.js").toString()
  return [...new Set([...out.matchAll(/window\.(\w+) =/g)].map((m) => m[1]))].sort()
})()

// Handlers that need an argument (a spot, a friend, a draft…) or perform an external
// navigation / toast instead of opening a modal. They get no-op when called bare and
// are verified in their own feature specs.
const NEEDS_CONTEXT = new Set([
  'openAddHostel', 'openAddTripNote', 'openAddWebhook', 'openAppealForm', 'openBlockModal',
  'openChangeEmail', 'openChangePassword', 'openChangeUsername', 'openCheckinModal', 'openCityPanel',
  'openComingSoonProximity', 'openConsentSettings', 'openConversation', 'openCountryGuide', 'openDeleteAccount',
  'openEditName', 'openEditPersonalInfo', 'openEditTrip', 'openEventDetail', 'openExportData',
  'openExternalNavigation', 'openFeatureSlides', 'openFeedbackDetail', 'openFriendChat', 'openFriendsChat',
  'openFullMap', 'openFullscreenMapPicker', 'openGroupConversation', 'openGuardianChat', 'openGuideCategory',
  'openGuidesOverlay', 'openInAppleMaps', 'openInGoogleMaps', 'openInNativeMaps', 'openInNavigationApp',
  'openInWaze', 'openJoinTeam', 'openMyCountries', 'openMySpots', 'openMyValidations',
  'openNavigation', 'openOfflinePanel', 'openPhotoManager', 'openProgressionStats', 'openReferences',
  'openRoadmapFeature', 'openSettings', 'openShareCard', 'openSideMenu', 'openSpotDetail',
  'openSpotDraft', 'openSpotStreetView', 'openTeamSettings', 'openTestSpot', 'openTripDetail',
  'openTripPhotoUpload', 'openTripPlanner', 'openUnblockModal', 'openValidateSpot', 'showAddFriend',
  'showAllCountryChats', 'showBadgeUnlock', 'showBuddyCreate', 'showBuddyDetail', 'showBuddyList',
  'showCommunitySOSOnMap', 'showCookieCustomize', 'showCountryDetail', 'showCountryQuizSelection', 'showErrorAnimation',
  'showFeatureIntro', 'showFriendOnMap', 'showFriendOptions', 'showFriendProfile', 'showFriends',
  'showFullNavigation', 'showGuides', 'showLevelUp', 'showLoading', 'showOriginal',
  'showPoints', 'showRadarExpanded', 'showSpotSummary', 'showSuccessAnimation', 'showToast',
])

const TARGETS = OPEN.filter((h) => !NEEDS_CONTEXT.has(h))

test('every modal opener actually opens something (flag true or dialog node)', async ({ page }) => {
  test.setTimeout(180000)
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

  expect(TARGETS.length).toBeGreaterThan(50)

  const fails = []
  for (const h of TARGETS) {
    const r = await page.evaluate((h) => {
      if (typeof window[h] !== 'function') return { ok: false, why: 'not-a-function' }
      const before = { ...window.getState() }
      const dlgBefore = document.querySelectorAll('[role=dialog],[aria-modal=true]').length
      try { window[h]() } catch (e) { void e }
      const after = window.getState()
      const newlyTrue = Object.keys(after).filter((k) => after[k] === true && before[k] !== true)
      const dlgAfter = document.querySelectorAll('[role=dialog],[aria-modal=true]').length
      const reset = {}
      newlyTrue.forEach((k) => (reset[k] = false))
      if (newlyTrue.length) window.setState(reset)
      const opened = newlyTrue.length > 0 || dlgAfter > dlgBefore
      return { ok: opened, why: opened ? '' : 'no-flag-no-dialog' }
    }, h)
    if (!r.ok) fails.push(`${h}:${r.why}`)
  }

  expect(fails, 'open/show handlers that opened nothing visible').toEqual([])
})
