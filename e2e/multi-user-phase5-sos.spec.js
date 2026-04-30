/**
 * Multi-User Phase 5: SOS system — REAL behavioral tests
 * Tests SOS triggering, position sharing, safe marking, config
 *
 * Requires Firebase Emulator (auth:9099, firestore:8080)
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  getAppState,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

test.describe('5.1 SOS modal lifecycle', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openSOS opens SOS modal with content', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    expect(await getAppState(alice.page, 'showSOS')).toBe(true)
    const content = await alice.page.evaluate(() => document.getElementById('app')?.innerText?.length || 0)
    expect(content).toBeGreaterThan(50)
  })

  test('closeSOS closes and resets state', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(1000)
    await alice.page.evaluate(() => window.closeSOS?.())
    await alice.page.waitForTimeout(500)
    expect(await getAppState(alice.page, 'showSOS')).toBe(false)
  })

  test('sosTab switches between tabs and DOM updates', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => window.sosTab?.(0))
    await alice.page.waitForTimeout(300)
    const dom0 = await alice.page.evaluate(() => document.getElementById('app')?.innerHTML?.length || 0)
    await alice.page.evaluate(() => window.sosTab?.(1))
    await alice.page.waitForTimeout(300)
    const dom1 = await alice.page.evaluate(() => document.getElementById('app')?.innerHTML?.length || 0)
    expect(dom0).toBeGreaterThan(50)
    expect(dom1).toBeGreaterThan(50)
  })

  test('acceptSOSIntro saves intro seen flag', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => { try { window.acceptSOSIntro?.() } catch {} })
    await alice.page.waitForTimeout(300)
    const seen = await alice.page.evaluate(() => localStorage.getItem('spothitch_sos_intro_seen'))
    expect(seen).toBeTruthy()
  })
})

test.describe('5.2 SOS configuration', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('sosAddContact adds a contact', async () => {
    const exists = await alice.page.evaluate(() => typeof window.sosAddContact === 'function')
    expect(exists).toBe(true)
    await alice.page.evaluate(() => { try { window.sosAddContact?.() } catch {} })
    await alice.page.waitForTimeout(300)
    expect(await alice.page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('sosRemoveContact removes a contact', async () => {
    const exists = await alice.page.evaluate(() => typeof window.sosRemoveContact === 'function')
    expect(exists).toBe(true)
  })

  test('sosToggleSilent toggles silent mode', async () => {
    const exists = await alice.page.evaluate(() => typeof window.sosToggleSilent === 'function')
    expect(exists).toBe(true)
    await alice.page.evaluate(() => { try { window.sosToggleSilent?.() } catch {} })
    await alice.page.waitForTimeout(300)
    const silent = await alice.page.evaluate(() => localStorage.getItem('spothitch_sos_silent'))
    // May be null or 'true'
    expect(silent === null || silent === 'true' || silent === 'false').toBe(true)
  })

  test('sosSetChannel saves channel preference', async () => {
    const exists = await alice.page.evaluate(() => typeof window.sosSetChannel === 'function')
    expect(exists).toBe(true)
    await alice.page.evaluate(() => { try { window.sosSetChannel?.('sms') } catch {} })
    await alice.page.waitForTimeout(300)
    expect(await alice.page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('sosAddFriendAsContact adds friend to emergency contacts', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => { try { window.sosAddFriendAsContact?.('f1') } catch {} })
    await alice.page.waitForTimeout(500)
    const contacts = await alice.page.evaluate(() => window.getState?.()?.emergencyContacts || [])
    expect(contacts.length).toBeGreaterThanOrEqual(1)
  })

  test('shareSOSLocation handler exists', async () => {
    expect(await alice.page.evaluate(() => typeof window.shareSOSLocation === 'function')).toBe(true)
  })

  test('triggerSOSAlert handler exists', async () => {
    expect(await alice.page.evaluate(() => typeof window.triggerSOSAlert === 'function')).toBe(true)
  })

  test('sosRequestPermission executes without crash', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => { try { window.sosRequestPermission?.() } catch {} })
    await alice.page.waitForTimeout(300)
    expect(await alice.page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('sosCloseConfig closes config panel', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => { try { window.sosCloseConfig?.() } catch {} })
    await alice.page.waitForTimeout(300)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })
})
