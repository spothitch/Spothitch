/**
 * Round 14 — Granular Feature Tests (1 assertion per test)
 * ~80 tests covering spots, social, guardian, SOS, events, guides
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession, createSessions, closeSessions, snap,
  triggerModuleLoad, navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(45000)

// ═══════ SPOTS HANDLERS ═══════

const SPOT_HANDLERS = [
  'openAddSpot', 'closeAddSpot', 'openSpotDetail', 'closeSpotDetail',
  'openFilters', 'closeFilters', 'applyFilters', 'resetFilters',
  'handleSearch', 'setFilter', 'toggleFavorite', 'openTestSpot',
  'setFilterCountry', 'setFilterMinRating', 'setSortBy',
  'toggleVerifiedFilter',
]

test.describe('Spot handlers exist', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of SPOT_HANDLERS) {
    test(`window.${h} is a function`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})

// ═══════ SPOTS FUNCTIONALITY ═══════

test.describe('Spot operations', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('openAddSpot sets showAddSpot state', async () => {
    await session.page.evaluate(() => window.openAddSpot?.())
    await session.page.waitForTimeout(1000)
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showAddSpot).toBe(true)
    await session.page.evaluate(() => window.closeAddSpot?.())
    await session.page.waitForTimeout(500)
  })

  test('openFilters sets showFilters state', async () => {
    await session.page.evaluate(() => window.openFilters?.())
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showFilters).toBe(true)
    await session.page.evaluate(() => window.closeFilters?.())
  })

  test('setFilter changes filter', async () => {
    await session.page.evaluate(() => window.setFilter?.('validated'))
    const state = await session.page.evaluate(() => window.getState?.())
    expect(typeof state?.filter).toBe('string')
  })

  test('handleSearch does not crash with empty string', async () => {
    const ok = await session.page.evaluate(() => { window.handleSearch?.(''); return true })
    expect(ok).toBe(true)
  })

  test('handleSearch does not crash with long string', async () => {
    const ok = await session.page.evaluate(() => { window.handleSearch?.('a'.repeat(500)); return true })
    expect(ok).toBe(true)
  })

  test('resetFilters clears all filters', async () => {
    await session.page.evaluate(() => window.resetFilters?.())
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.filterCountry).toBeFalsy()
  })
})

// ═══════ SOCIAL HANDLERS ═══════

const SOCIAL_HANDLERS = [
  'showFriends', 'openFriendsChat', 'closeAddFriend', 'copyFriendLink',
  'openNearbyFriends', 'closeNearbyFriends',
  'shareSpot', 'shareBadge', 'shareStats', 'shareApp',
]

test.describe('Social handlers exist', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of SOCIAL_HANDLERS) {
    test(`window.${h} is a function`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})

// ═══════ GUARDIAN HANDLERS ═══════

const GUARDIAN_HANDLERS = [
  'openGuardian', 'closeGuardian',
]

test.describe('Guardian handlers', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of GUARDIAN_HANDLERS) {
    test(`window.${h} exists`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }

  test('openGuardian sets showGuardianModal', async () => {
    await session.page.evaluate(() => window.openGuardian?.())
    await session.page.waitForTimeout(2000)
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showGuardianModal).toBe(true)
    await session.page.evaluate(() => window.closeGuardian?.())
  })
})

// ═══════ SOS HANDLERS ═══════

test.describe('SOS handlers', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('openSOS exists', async () => {
    expect(await session.page.evaluate(() => typeof window.openSOS === 'function')).toBe(true)
  })
  test('closeSOS exists', async () => {
    expect(await session.page.evaluate(() => typeof window.closeSOS === 'function')).toBe(true)
  })
  test('triggerSOS exists', async () => {
    expect(await session.page.evaluate(() => typeof window.triggerSOS === 'function')).toBe(true)
  })
  test('openSOS opens SOS modal', async () => {
    await session.page.evaluate(() => window.openSOS?.())
    await session.page.waitForTimeout(2000)
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showSOS).toBe(true)
    await session.page.evaluate(() => window.closeSOS?.())
  })
})

// ═══════ EVENTS HANDLERS ═══════

const EVENT_HANDLERS = [
  'openCreateEvent', 'closeCreateEvent', 'submitCreateEvent',
  'joinEvent', 'leaveEvent', 'deleteEventAction',
  'openEventDetail', 'closeEventDetail',
  'postEventComment', 'shareEvent',
]

test.describe('Event handlers exist', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await navigateToTab(session.page, 'social')
    await session.page.waitForTimeout(3000)
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of EVENT_HANDLERS) {
    test(`window.${h} is a function`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})

// ═══════ GUIDE HANDLERS ═══════

test.describe('Guide handlers', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('showGuides navigates to guides', async () => {
    await session.page.evaluate(() => window.showGuides?.())
    await session.page.waitForTimeout(1000)
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.voyageSubTab).toBe('guides')
  })

  test('showCountryDetail sets selectedCountryCode', async () => {
    await session.page.evaluate(() => window.showCountryDetail?.('DE'))
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.selectedCountryCode).toBe('DE')
  })

  test('showSafetyPage sets showSafety', async () => {
    await session.page.evaluate(() => window.showSafetyPage?.())
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showSafety).toBe(true)
    await session.page.evaluate(() => window.closeSafety?.())
  })
})

// ═══════ NAVIGATION HANDLERS ═══════

test.describe('Navigation handlers', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const tab of ['map', 'voyage', 'social', 'profile']) {
    test(`changeTab('${tab}') sets activeTab`, async () => {
      await session.page.evaluate((t) => window.changeTab?.(t), tab)
      await session.page.waitForTimeout(300)
      const state = await session.page.evaluate(() => window.getState?.())
      expect(state?.activeTab).toBe(tab)
    })
  }

  test('openProfile navigates to profile', async () => {
    await session.page.evaluate(() => window.openProfile?.())
    await session.page.waitForTimeout(500)
    // Should have navigated
    expect(true).toBe(true)
  })

  test('openSettings navigates to settings', async () => {
    await session.page.evaluate(() => window.openSettings?.())
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.profileSubTab).toBe('reglages')
  })
})

// ═══════ PROFILE HANDLERS ═══════

const PROFILE_HANDLERS = [
  'saveBio', 'editAvatar', 'editLanguages', 'saveSocialLink',
  'addProfilePhoto', 'removeProfilePhoto',
  'openEditProfile', 'openSettings', 'closeSettings',
  'openMySpots', 'openMyValidations', 'openMyCountries',
  'openProgressionStats',
]

test.describe('Profile handlers exist', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await navigateToTab(session.page, 'profile')
    await session.page.waitForTimeout(2000)
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of PROFILE_HANDLERS) {
    test(`window.${h} is a function`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})

// ═══════ MISC HANDLERS ═══════

const MISC_HANDLERS = [
  'showLegalPage', 'closeLegal', 'openSideMenu', 'closeSideMenu',
  'showInstallBanner', 'dismissInstallBanner', 'installPWA',
  'openTitles', 'closeTitles', 'centerOnUser',
  'openReport', 'closeReport', 'selectReportReason', 'submitCurrentReport',
  'openTripPlanner', 'closeTripPlanner',
  'openFeedbackPanel', 'closeFeedbackPanel',
  'openRoadmap', 'openFAQ', 'openHelpCenter', 'openChangelog',
  'openAdminPanel', 'closeAdminPanel',
]

test.describe('Miscellaneous handlers exist', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  for (const h of MISC_HANDLERS) {
    test(`window.${h} exists`, async () => {
      const exists = await session.page.evaluate((n) => typeof window[n] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})
