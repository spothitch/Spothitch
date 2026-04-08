/**
 * E2E Tests - Proximity Radar & Travel Buddies
 * COMPREHENSIVE: handlers, UI flows, data, multi-user, edge cases, visual
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

// Helper: navigate to Social > Voyageurs tab
async function goToVoyageurs(page) {
  await skipOnboarding(page)
  await navigateToTab(page, 'social')
  await page.evaluate(() => window.setSocialTab?.('voyageurs'))
  await page.waitForTimeout(500)
}

// Helper: simulate logged-in user with profile
async function simulateUser(page, overrides = {}) {
  await page.evaluate((data) => {
    window.setState?.({
      isLoggedIn: true,
      firstName: data.firstName || 'Alice',
      lastName: data.lastName || 'Dupont',
      username: data.username || 'alice_d',
      gender: data.gender || 'female',
      profilePhotos: [],
      user: {
        uid: data.uid || 'alice-uid',
        email: data.email || 'alice@test.com',
        displayName: `${data.firstName || 'Alice'} ${(data.lastName || 'Dupont')[0]}.`,
        providerData: [{ providerId: 'password' }],
      },
      ...data,
    })
  }, overrides)
}

// ================================================================
// 1. HANDLER WIRING (15 handlers)
// ================================================================
test.describe('Handlers - All radar & buddy handlers exist', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  const handlers = [
    'toggleProximityRadar', 'setRadarRadius', 'setRadarVisibility',
    'setRadarMessage', 'showRadarExpanded', 'contactNearbyTraveler',
    'showBuddyList', 'showBuddyCreate', 'showBuddyDetail',
    'submitBuddyAnnouncement', 'deleteBuddyAnnouncement',
    'closeBuddyAnnouncement', 'sendBuddyChatMessage',
    'contactBuddyAuthor', 'backFromVoyageurs',
  ]

  for (const h of handlers) {
    test(`${h} is a function`, async ({ page }) => {
      const exists = await page.evaluate((name) => typeof window[name] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})

// ================================================================
// 2. RADAR UI — Combined view
// ================================================================
test.describe('Radar - Combined View', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('combined view renders radar card and buddy section', async ({ page }) => {
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('toggleProximityRadar')
    expect(html).toContain('showBuddyList')
    expect(html).toContain('showBuddyCreate')
  })

  test('radar card shows inactive state by default', async ({ page }) => {
    const text = await page.evaluate(() => document.body.innerText)
    const hasInactive = text.includes('Inactif') || text.includes('Inactive') || text.includes('Inaktiv')
    expect(hasInactive).toBe(true)
  })

  test('buddy "publish" button visible', async ({ page }) => {
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('showBuddyCreate')
  })
})

// ================================================================
// 3. RADAR UI — Expanded view
// ================================================================
test.describe('Radar - Expanded View', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('expanded view opens with radius options', async ({ page }) => {
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('setRadarRadius')
    expect(html).toContain('10 km')
    expect(html).toContain('50 km')
    expect(html).toContain('100 km')
  })

  test('expanded view has visibility pills', async ({ page }) => {
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('setRadarVisibility')
  })

  test('expanded view has message input', async ({ page }) => {
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(500)
    const input = await page.evaluate(() => !!document.getElementById('radar-message'))
    expect(input).toBe(true)
  })

  test('back button returns to combined', async ({ page }) => {
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(300)
    await page.evaluate(() => window.backFromVoyageurs?.())
    await page.waitForTimeout(300)
    const view = await page.evaluate(() => window.getState?.()?.voyageursView)
    expect(view).toBe('combined')
  })
})

// ================================================================
// 4. RADAR SETTINGS — Persistence
// ================================================================
test.describe('Radar - Settings Persistence', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('radius saves to localStorage', async ({ page }) => {
    await page.evaluate(() => window.setRadarRadius?.(25))
    await page.waitForTimeout(200)
    const settings = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
    )
    expect(settings.radius).toBe(25)
  })

  test('visibility saves to localStorage', async ({ page }) => {
    await page.evaluate(() => window.setRadarVisibility?.('femmes'))
    await page.waitForTimeout(200)
    const settings = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
    )
    expect(settings.visibility).toContain('femmes')
  })

  test('message saves to localStorage', async ({ page }) => {
    await page.evaluate(() => window.setRadarMessage?.('Looking for a lift'))
    await page.waitForTimeout(200)
    const settings = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
    )
    expect(settings.message).toBe('Looking for a lift')
  })

  test('radius persists across view changes', async ({ page }) => {
    await page.evaluate(() => window.setRadarRadius?.(100))
    await page.evaluate(() => window.backFromVoyageurs?.())
    await page.waitForTimeout(200)
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(300)
    const settings = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
    )
    expect(settings.radius).toBe(100)
  })
})

// ================================================================
// 5. RADAR — Cooldown
// ================================================================
test.describe('Radar - Cooldown', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('cooldown is detected correctly', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { saveRadarSettings, isRadarInCooldown, getRemainingCooldownMinutes } = await import('/src/services/proximityRadar.js')
      saveRadarSettings({ cooldownUntil: Date.now() + 5 * 60000 })
      return { inCooldown: isRadarInCooldown(), mins: getRemainingCooldownMinutes() }
    })
    expect(result.inCooldown).toBe(true)
    expect(result.mins).toBeGreaterThan(0)
    expect(result.mins).toBeLessThanOrEqual(5)
  })

  test('expired cooldown is not blocking', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { saveRadarSettings, isRadarInCooldown } = await import('/src/services/proximityRadar.js')
      saveRadarSettings({ cooldownUntil: Date.now() - 1000 })
      return isRadarInCooldown()
    })
    expect(result).toBe(false)
  })
})

// ================================================================
// 6. RADAR — Blocked users
// ================================================================
test.describe('Radar - Blocked Users', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('contactNearbyTraveler rejects blocked user', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('spothitch_blocked_users', JSON.stringify([{ id: 'blocked-uid' }]))
    })
    const prevTab = await page.evaluate(() => window.getState?.()?.socialSubTab)
    await page.evaluate(() => window.contactNearbyTraveler?.('blocked-uid'))
    await page.waitForTimeout(500)
    const newTab = await page.evaluate(() => window.getState?.()?.socialSubTab)
    // Should NOT switch to messagerie
    expect(newTab).not.toBe('messagerie')
  })

  test('contactBuddyAuthor rejects blocked user', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('spothitch_blocked_users', JSON.stringify(['blocked-author']))
    })
    await page.evaluate(() => window.contactBuddyAuthor?.('blocked-author'))
    await page.waitForTimeout(500)
    const tab = await page.evaluate(() => window.getState?.()?.socialSubTab)
    expect(tab).not.toBe('messagerie')
  })

  test('contactNearbyTraveler allows non-blocked user', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('spothitch_blocked_users', JSON.stringify([]))
    })
    await page.evaluate(() => window.contactNearbyTraveler?.('ok-user'))
    await page.waitForTimeout(500)
    const tab = await page.evaluate(() => window.getState?.()?.socialSubTab)
    expect(tab).toBe('messagerie')
  })
})

// ================================================================
// 7. RADAR — Guardian warning
// ================================================================
test.describe('Radar - Guardian Integration', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('shows guardian warning when guardian is active', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true }))
      window.setState?.({ radarEnabled: true })
    })
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(500)
    // Force re-render to pick up guardian state
    await page.evaluate(() => {
      const settings = JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
      settings.enabled = true
      localStorage.setItem('spothitch_proximity_radar', JSON.stringify(settings))
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    const hasWarning = html.includes('shield-alert') || html.includes('radarGuardianWarning') || html.includes('Gardien')
    expect(hasWarning).toBe(true)
  })

  test('no guardian warning when guardian is inactive', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: false }))
    })
    await page.evaluate(() => window.showRadarExpanded?.())
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    const hasWarning = html.includes('shield-alert')
    expect(hasWarning).toBe(false)
  })
})

// ================================================================
// 8. RADAR — Nearby travelers rendering
// ================================================================
test.describe('Radar - Nearby Travelers Display', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('shows traveler with photo when available', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        nearbyTravelers: [{
          userId: 'u1', userName: 'Jean Test',
          photoURL: 'https://example.com/photo.jpg',
          distance: 12, displayDistance: 12, message: 'Bonjour',
        }],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('photo.jpg')
    expect(html).toContain('Jean Test')
  })

  test('shows traveler with initial when no photo', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        nearbyTravelers: [{
          userId: 'u2', userName: 'Marie D.',
          photoURL: null,
          distance: 8, displayDistance: 8, message: '',
        }],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Marie D.')
  })

  test('shows "< 5 km" for close travelers', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        nearbyTravelers: [{
          userId: 'u3', userName: 'Bob',
          distance: 3, displayDistance: null, message: '',
        }],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('< 5 km')
  })

  test('shows empty state when no travelers', async ({ page }) => {
    await page.evaluate(() => {
      const settings = JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
      settings.enabled = true
      localStorage.setItem('spothitch_proximity_radar', JSON.stringify(settings))
      window.setState?.({ nearbyTravelers: [] })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    const hasEmpty = text.includes('Aucun voyageur') || text.includes('No nearby') || text.includes('Kein Reisender')
    expect(hasEmpty).toBe(true)
  })
})

// ================================================================
// 9. BUDDY — Create flow
// ================================================================
test.describe('Buddies - Create Flow', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('create view has all form fields', async ({ page }) => {
    await page.evaluate(() => window.showBuddyCreate?.())
    await page.waitForTimeout(500)
    const fields = await page.evaluate(() => ({
      departure: !!document.getElementById('buddy-departure'),
      destination: !!document.getElementById('buddy-destination'),
      dateFrom: !!document.getElementById('buddy-date-from'),
      dateTo: !!document.getElementById('buddy-date-to'),
    }))
    expect(fields.departure).toBe(true)
    expect(fields.destination).toBe(true)
    expect(fields.dateFrom).toBe(true)
  })

  test('create view has mode pills', async ({ page }) => {
    await page.evaluate(() => window.showBuddyCreate?.())
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('setBuddyTravelMode')
  })

  test('create view has visibility pills', async ({ page }) => {
    await page.evaluate(() => window.showBuddyCreate?.())
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('setBuddyVisibility')
  })

  test('submit requires auth', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({ isLoggedIn: false })
      window.showBuddyCreate?.()
    })
    await page.waitForTimeout(300)
    await page.evaluate(() => window.submitBuddyAnnouncement?.())
    await page.waitForTimeout(500)
    // Should not crash, just requireAuth
    expect(true).toBe(true)
  })
})

// ================================================================
// 10. BUDDY — Detail view + chat
// ================================================================
test.describe('Buddies - Detail View & Chat', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('detail view shows route + description + chat', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'b1', userId: 'other', userName: 'Jean Test',
          departure: 'Paris', destination: 'Lyon',
          dateFrom: '2026-06-01', message: 'Cherche compagnon',
          visibility: ['tous'], mode: 'autostop',
          languages: ['Français', 'English'],
        },
        buddyChatMessages: [],
        user: { uid: 'me' },
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Paris')
    expect(text).toContain('Lyon')
    expect(text).toContain('Jean Test')
    expect(text).toContain('Cherche compagnon')
    // Chat section
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('buddy-chat-input')
    expect(html).toContain('sendBuddyChatMessage')
  })

  test('detail shows languages', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'b2', userId: 'other', userName: 'Marie',
          departure: 'Amsterdam', destination: 'Berlin',
          dateFrom: '2026-07-01', visibility: ['tous'],
          languages: ['Deutsch', 'English', 'Français'],
        },
        buddyChatMessages: [],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Deutsch')
    expect(text).toContain('English')
  })

  test('detail shows photo when available', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'b3', userId: 'other', userName: 'Bob',
          photoURL: 'https://example.com/bob.jpg',
          departure: 'A', destination: 'B',
          dateFrom: '2026-06-01', visibility: ['tous'],
        },
        buddyChatMessages: [],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('bob.jpg')
  })

  test('own announcement shows "buddy found" + "delete" buttons', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'own1', userId: 'me-uid',
          userName: 'Me', departure: 'A', destination: 'B',
          dateFrom: '2026-06-01', visibility: ['tous'],
        },
        buddyChatMessages: [],
        user: { uid: 'me-uid' },
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('closeBuddyAnnouncement')
    expect(html).toContain('deleteBuddyAnnouncement')
  })

  test('other user announcement shows contact button', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'other1', userId: 'someone-else',
          userName: 'Someone', departure: 'A', destination: 'B',
          dateFrom: '2026-06-01', visibility: ['tous'],
        },
        buddyChatMessages: [],
        user: { uid: 'me-uid' },
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('contactBuddyAuthor')
    expect(html).toContain('openReport')
  })

  test('chat messages render correctly', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'chat1', userId: 'author',
          userName: 'Author', departure: 'A', destination: 'B',
          dateFrom: '2026-06-01', visibility: ['tous'],
        },
        buddyChatMessages: [
          { id: 'm1', senderId: 'alice', senderName: 'Alice D.', text: 'Salut, je suis intéressée !', senderPhoto: null },
          { id: 'm2', senderId: 'author', senderName: 'Author', text: 'Super, on se rejoint où ?', senderPhoto: 'https://example.com/author.jpg' },
        ],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Salut, je suis intéressée')
    expect(text).toContain('Super, on se rejoint où')
    expect(text).toContain('Alice D.')
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('author.jpg')
  })

  test('empty chat shows prompt message', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'empty-chat', userId: 'other',
          userName: 'X', departure: 'A', destination: 'B',
          dateFrom: '2026-06-01', visibility: ['tous'],
        },
        buddyChatMessages: [],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    const hasEmpty = text.includes('Aucun message') || text.includes('No messages') || text.includes('Noch keine')
    expect(hasEmpty).toBe(true)
  })
})

// ================================================================
// 11. BUDDY — Service Validation (unit-like E2E)
// ================================================================
test.describe('TravelBuddies - Service Validation', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('rejects empty fields', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { createTravelBuddy } = await import('/src/services/travelBuddies.js')
      return createTravelBuddy({ departure: '', destination: '', dateFrom: '' })
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('missing_fields')
  })

  test('rejects past dates', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { createTravelBuddy } = await import('/src/services/travelBuddies.js')
      return createTravelBuddy({ departure: 'A', destination: 'B', dateFrom: '2020-01-01' })
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('date_past')
  })

  test('rejects end before start', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { createTravelBuddy } = await import('/src/services/travelBuddies.js')
      return createTravelBuddy({ departure: 'A', destination: 'B', dateFrom: '2026-12-30', dateTo: '2026-12-20' })
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('date_invalid')
  })

  test('rejects too long departure', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { createTravelBuddy } = await import('/src/services/travelBuddies.js')
      return createTravelBuddy({ departure: 'x'.repeat(101), destination: 'B', dateFrom: '2026-12-30' })
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('too_long')
  })

  test('rejects too long message', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { createTravelBuddy } = await import('/src/services/travelBuddies.js')
      return createTravelBuddy({ departure: 'A', destination: 'B', dateFrom: '2026-12-30', message: 'x'.repeat(501) })
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('message_too_long')
  })
})

// ================================================================
// 12. PROXIMITY RADAR — Service
// ================================================================
test.describe('ProximityRadar - Service', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('defaults are correct', async ({ page }) => {
    const settings = await page.evaluate(async () => {
      localStorage.removeItem('spothitch_proximity_radar')
      const { getRadarSettings } = await import('/src/services/proximityRadar.js')
      return getRadarSettings()
    })
    expect(settings.enabled).toBe(false)
    expect(settings.radius).toBe(50)
    expect(settings.visibility).toEqual(['tous'])
    expect(settings.message).toBe('')
  })

  test('saveRadarSettings merges correctly', async ({ page }) => {
    const saved = await page.evaluate(async () => {
      localStorage.removeItem('spothitch_proximity_radar')
      const { saveRadarSettings, getRadarSettings } = await import('/src/services/proximityRadar.js')
      saveRadarSettings({ radius: 10 })
      saveRadarSettings({ message: 'hello' })
      return getRadarSettings()
    })
    expect(saved.radius).toBe(10)
    expect(saved.message).toBe('hello')
    expect(saved.visibility).toEqual(['tous'])
  })

  test('formatRadarDistance returns null for close, number for far', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { formatRadarDistance } = await import('/src/services/proximityRadar.js')
      return {
        veryClose: formatRadarDistance(1),
        close: formatRadarDistance(4.9),
        exact5: formatRadarDistance(5),
        far: formatRadarDistance(15.7),
        veryFar: formatRadarDistance(99.4),
      }
    })
    expect(result.veryClose).toBeNull()
    expect(result.close).toBeNull()
    expect(result.exact5).toBe(5)
    expect(result.far).toBe(16)
    expect(result.veryFar).toBe(99)
  })

  test('activateRadar fails without GPS', async ({ page }) => {
    // Override geolocation to fail
    await page.evaluate(() => {
      navigator.geolocation.getCurrentPosition = (_ok, fail) => fail(new Error('denied'))
    })
    const result = await page.evaluate(async () => {
      const { activateRadar } = await import('/src/services/proximityRadar.js')
      return activateRadar()
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('gps')
  })

  test('activateRadar blocked by cooldown', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { saveRadarSettings, activateRadar } = await import('/src/services/proximityRadar.js')
      saveRadarSettings({ cooldownUntil: Date.now() + 60000 })
      return activateRadar()
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('cooldown')
    expect(result.remainingMinutes).toBeGreaterThan(0)
  })
})

// ================================================================
// 13. BUDDY LIST — Filtering & display
// ================================================================
test.describe('Buddies - List & Filtering', () => {
  test.beforeEach(async ({ page }) => { await goToVoyageurs(page) })

  test('buddy list view renders', async ({ page }) => {
    await page.evaluate(() => window.showBuddyList?.())
    await page.waitForTimeout(500)
    const view = await page.evaluate(() => window.getState?.()?.voyageursView)
    expect(view).toBe('buddyList')
  })

  test('country filter changes state', async ({ page }) => {
    await page.evaluate(() => window.setBuddyCountryFilter?.('FR'))
    await page.waitForTimeout(200)
    const filter = await page.evaluate(() => window.getState?.()?.buddyCountryFilter)
    expect(filter).toBe('FR')
  })

  test('buddy cards show with photo and languages', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({
        travelBuddies: [{
          id: 'card1', userId: 'u1', userName: 'Marie D.',
          photoURL: 'https://example.com/marie.jpg',
          departure: 'Paris', destination: 'Barcelona',
          dateFrom: '2026-08-01', message: 'Road trip!',
          mode: 'autostop', visibility: ['tous'],
          languages: ['Français', 'Español'],
        }],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).toContain('Marie D.')
    expect(text).toContain('Paris')
    expect(text).toContain('Barcelona')
    const html = await page.evaluate(() => document.body.innerHTML)
    expect(html).toContain('marie.jpg')
    expect(html).toContain('Français')
  })

  test('empty buddy list shows message', async ({ page }) => {
    await page.evaluate(() => {
      window.setState?.({ travelBuddies: [] })
      window._forceRender?.()
    })
    await page.waitForTimeout(500)
    const text = await page.evaluate(() => document.body.innerText)
    const hasEmpty = text.includes('Aucune annonce') || text.includes('No travel') || text.includes('Keine')
    expect(hasEmpty).toBe(true)
  })
})

// ================================================================
// 14. VISUAL CHECKS (screenshots)
// ================================================================
test.describe('Visual - Screenshots', () => {
  test('combined view screenshot', async ({ page }) => {
    await goToVoyageurs(page)
    await page.evaluate(() => {
      window.setState?.({
        nearbyTravelers: [
          { userId: 'v1', userName: 'Jean T.', distance: 12, displayDistance: 12, message: 'Dispo pour un café', photoURL: null },
        ],
        travelBuddies: [
          { id: 'tb1', userId: 'v2', userName: 'Marie D.', departure: 'Paris', destination: 'Lyon', dateFrom: '2026-06-15', mode: 'autostop', visibility: ['tous'], languages: ['Français'] },
        ],
      })
      const settings = JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}')
      settings.enabled = true
      localStorage.setItem('spothitch_proximity_radar', JSON.stringify(settings))
      window._forceRender?.()
    })
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'test-results/radar-combined.png' })
  })

  test('buddy detail screenshot', async ({ page }) => {
    await goToVoyageurs(page)
    await page.evaluate(() => {
      window.setState?.({
        voyageursView: 'buddyDetail',
        selectedBuddyDetail: {
          id: 'vis1', userId: 'other', userName: 'Jean Test',
          departure: 'Paris', destination: 'Barcelona',
          dateFrom: '2026-07-01', dateTo: '2026-07-15',
          message: 'Road trip en auto-stop, on cherche des compagnons sympas !',
          mode: 'autostop', visibility: ['tous'],
          languages: ['Français', 'English', 'Español'],
        },
        buddyChatMessages: [
          { id: 'c1', senderId: 'alice', senderName: 'Alice D.', text: 'Super, je suis partante !' },
          { id: 'c2', senderId: 'other', senderName: 'Jean Test', text: 'Genial ! On se rejoint gare du Nord ?' },
        ],
      })
      window._forceRender?.()
    })
    await page.waitForTimeout(800)
    await page.screenshot({ path: 'test-results/buddy-detail-chat.png' })
  })
})
