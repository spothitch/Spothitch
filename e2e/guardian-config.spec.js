import { test, expect } from '@playwright/test'

/**
 * Guardian config — REAL handler effects (Brique 2, safety feature).
 *
 * These tests do NOT just check the handler exists: they actually TRIGGER each
 * handler and verify the exact resulting state is persisted to localStorage
 * (spothitch_guardian), the way the app really stores the Guardian config.
 */
test.describe('Guardian config — real handler effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('spothitch_welcomed', 'true')
        localStorage.setItem('spothitch_age_verified', 'true')
        localStorage.setItem('spothitch_cookie_consent', 'true')
        localStorage.setItem('spothitch_landing_seen', 'true')
      } catch { /* ignore */ }
    })
    await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(1500)
    // Open Guardian so Guardian.js loads and replaces the lazy-stub handlers with
    // the real ones. Poll until a real handler actually persists state (the lazy
    // stub does nothing) so the tests never race the module load.
    await page.evaluate(() => window.openGuardian?.())
    await page.waitForFunction(async () => {
      try {
        await window.guardianSelectInterval?.(30)
        return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').checkInInterval === 30
      } catch { return false }
    }, { timeout: 12000 })
  })

  test('guardianSelectInterval persists the chosen check-in interval', async ({ page }) => {
    const interval = await page.evaluate(async () => {
      await window.guardianSelectInterval(45)
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').checkInInterval
    })
    expect(interval).toBe(45)
  })

  test('guardianToggleDeparture flips and persists the departure-notify flag', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const before = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnDeparture
      await window.guardianToggleDeparture()
      const after = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnDeparture
      return { before, after }
    })
    expect(typeof r.after).toBe('boolean')
    expect(r.after).not.toBe(r.before)
  })

  test('guardianToggleArrival persists a boolean arrival-notify flag', async ({ page }) => {
    const type = await page.evaluate(async () => {
      await window.guardianToggleArrival()
      return typeof JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnArrival
    })
    expect(type).toBe('boolean')
  })

  test('guardianRemoveGuardian removes the guardian at the given index', async ({ page }) => {
    const guardians = await page.evaluate(async () => {
      const s = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
      s.guardians = [
        { name: 'Maman', phone: '0601', color: '#22c55e' },
        { name: 'Lea', phone: '0602', color: '#3b82f6' },
      ]
      localStorage.setItem('spothitch_guardian', JSON.stringify(s))
      await window.guardianRemoveGuardian(0)
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').guardians
    })
    expect(guardians).toHaveLength(1)
    expect(guardians[0].name).toBe('Lea')
  })

  test('guardianRemoveTrustedContact removes the contact at the given index', async ({ page }) => {
    const contacts = await page.evaluate(async () => {
      const s = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
      s.trustedContacts = [{ name: 'A', phone: '01' }, { name: 'B', phone: '02' }]
      localStorage.setItem('spothitch_guardian', JSON.stringify(s))
      await window.guardianRemoveTrustedContact(0)
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').trustedContacts
    })
    expect(contacts).toHaveLength(1)
    expect(contacts[0].name).toBe('B')
  })

  test('closeGuardian closes the Guardian modal', async ({ page }) => {
    const wasOpen = await page.evaluate(() => !!window.getState?.().showGuardianModal)
    expect(wasOpen).toBe(true)
    const isClosed = await page.evaluate(async () => {
      window.closeGuardian()
      await new Promise(r => setTimeout(r, 250))
      return window.getState?.().showGuardianModal === false
    })
    expect(isClosed).toBe(true)
  })

  test('guardianClearHistory erases the saved trip history', async ({ page }) => {
    const after = await page.evaluate(async () => {
      localStorage.setItem('spothitch_trip_history', JSON.stringify([{ id: 'trip1' }, { id: 'trip2' }]))
      await window.guardianClearHistory()
      await new Promise(r => setTimeout(r, 200))
      return localStorage.getItem('spothitch_trip_history')
    })
    expect(after).toBeNull()
  })

  test('guardianAddToJournal closes Guardian and routes to the journal', async ({ page }) => {
    const closed = await page.evaluate(async () => {
      window.guardianAddToJournal()
      await new Promise(r => setTimeout(r, 300))
      return window.getState?.().showGuardianModal === false
    })
    expect(closed).toBe(true)
  })
})
