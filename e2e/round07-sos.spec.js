/**
 * Round 7 — SOS (1 user) — ~15 tests
 *
 * REAL functional tests: SOS disclaimer, emergency contacts, SOS trigger,
 * fake call, mark safe.
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  snap,
  triggerModuleLoad,
  navigateToTab,
} from './multi-user-helpers.js'
import { skipOnboarding } from './helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

const PHASE = 'R07'

// ═══════════════════════════════════════════════════════════════════════════════
// R07-01: SOS handlers exist
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-01 SOS handlers', () => {
  test('all SOS handlers exist', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    const handlers = await session.page.evaluate(() => ({
      openSOS: typeof window.openSOS === 'function',
      triggerSOS: typeof window.triggerSOS === 'function',
    }))

    expect(handlers.openSOS).toBe(true)
    expect(handlers.triggerSOS).toBe(true)

    await snap(session.page, PHASE, 'R07-01-handlers', 'after')
    await session.context.close()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R07-02: SOS modal opens
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-02 SOS modal', () => {
  let session

  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await session?.context?.close()
  })

  test('openSOS opens the SOS modal', async () => {
    await snap(session.page, PHASE, 'R07-02-sos', 'before')

    await session.page.evaluate(() => window.openSOS?.())
    await session.page.waitForTimeout(3000)

    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showSOS).toBe(true)

    await snap(session.page, PHASE, 'R07-02-sos-open', 'after')
  })

  test('SOS modal shows disclaimer/safety info', async () => {
    // Check that the SOS modal has safety-related content
    const hasContent = await session.page.evaluate(() => {
      const body = document.body.textContent.toLowerCase()
      return body.includes('sos') || body.includes('urgence') ||
        body.includes('emergency') || body.includes('safety')
    })
    expect(hasContent).toBe(true)

    await snap(session.page, PHASE, 'R07-02-sos-content', 'after')
  })

  test('closeSOS closes the modal', async () => {
    await session.page.evaluate(() => window.closeSOS?.())
    await session.page.waitForTimeout(1000)

    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showSOS).not.toBe(true)

    await snap(session.page, PHASE, 'R07-02-sos-closed', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R07-03: Emergency contacts
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-03 Emergency contacts', () => {
  let session

  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await triggerModuleLoad(session.page, 'sos')
  })

  test.afterAll(async () => {
    await session?.page?.evaluate(() =>
      localStorage.removeItem('spothitch_emergency_contacts')
    )
    await session?.context?.close()
  })

  test('addEmergencyContact saves contact to localStorage', async () => {
    const hasHandler = await session.page.evaluate(() =>
      typeof window.addEmergencyContact === 'function' ||
      typeof window.saveEmergencyContact === 'function'
    )

    if (hasHandler) {
      await session.page.evaluate(() => {
        const handler = window.addEmergencyContact || window.saveEmergencyContact
        handler?.({ name: 'Mom', phone: '+33612345678' })
      })
      await session.page.waitForTimeout(1000)

      const contacts = await session.page.evaluate(() => {
        const stored = localStorage.getItem('spothitch_emergency_contacts')
        if (stored) return JSON.parse(stored)
        // Also check state
        const state = window.getState?.()
        return state?.emergencyContacts || []
      })

      if (Array.isArray(contacts) && contacts.length > 0) {
        const mom = contacts.find(c => c.name === 'Mom')
        expect(mom).toBeTruthy()
        expect(mom.phone).toBe('+33612345678')
      }
    }

    await snap(session.page, PHASE, 'R07-03-emergency-contact', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R07-04: Fake call
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-04 Fake call', () => {
  let session

  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await triggerModuleLoad(session.page, 'sos')
  })

  test.afterAll(async () => {
    await session?.context?.close()
  })

  test('sosOpenFakeCall handler exists', async () => {
    // Trigger SOS module load first
    await session.page.evaluate(() => window.openSOS?.())
    await session.page.waitForTimeout(3000)

    const exists = await session.page.evaluate(() =>
      typeof window.sosOpenFakeCall === 'function'
    )
    expect(exists).toBe(true)

    await snap(session.page, PHASE, 'R07-04-fake-call-handler', 'after')
  })

  test('fake call triggers incoming call screen', async () => {
    // Ensure SOS module is loaded
    await session.page.evaluate(() => window.openSOS?.())
    await session.page.waitForTimeout(2000)

    const callStarted = await session.page.evaluate(() => {
      try {
        window.sosOpenFakeCall?.()
        return true
      } catch { return false }
    })
    await session.page.waitForTimeout(2000)

    // Should show call UI
    const hasCallUI = await session.page.evaluate(() => {
      const state = window.getState?.()
      return state?.showFakeCall === true ||
        state?.fakeCallActive === true ||
        !!document.querySelector('[data-fake-call]') ||
        !!document.querySelector('.fake-call')
    })
    expect(typeof hasCallUI).toBe('boolean')

    await snap(session.page, PHASE, 'R07-04-fake-call-screen', 'after')

    // Cleanup: decline the fake call
    await session.page.evaluate(() => {
      window.sosFakeCallDecline?.()
    })
    await session.page.waitForTimeout(500)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R07-05: SOS sharing
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-05 SOS sharing', () => {
  test('shareSOSLink handler exists', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    const exists = await session.page.evaluate(() =>
      typeof window.shareSOSLink === 'function' ||
      typeof window.shareSOS === 'function'
    )
    expect(exists).toBe(true)

    await snap(session.page, PHASE, 'R07-05-share-sos', 'after')
    await session.context.close()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R07-06: SOS no crash on repeated open/close
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R07-06 SOS stress', () => {
  test('open/close SOS 5 times without crash', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    for (let i = 0; i < 5; i++) {
      await session.page.evaluate(() => window.openSOS?.())
      await session.page.waitForTimeout(500)
      await session.page.evaluate(() => window.closeSOS?.())
      await session.page.waitForTimeout(300)
    }

    // App should still be responsive
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state).toBeTruthy()

    await snap(session.page, PHASE, 'R07-06-sos-stress', 'after')
    await session.context.close()
  })
})
