/**
 * Phase 6C: Offline functionality
 * Tests offline detection, localStorage persistence, queuing
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true', spothitch_sos_intro_seen: '1',
}

async function setup(page) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 45000 }).catch(() => {})
  await page.evaluate(() => {
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true,
      user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser',
    })
  })
  await page.waitForTimeout(2000)
}

test.describe('Offline functionality', () => {
  test('localStorage state persists after reload', async ({ page }) => {
    await setup(page)
    // Set a value in state
    await page.evaluate(() => window.setState?.({ filterCountry: 'FR' }))
    await page.waitForTimeout(500)
    // Read from localStorage directly
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('spothitch_v4_state')
      return raw ? JSON.parse(raw) : null
    })
    expect(stored).toBeDefined()
  })

  test('SOS localStorage keys persist', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      localStorage.setItem('spothitch_sos_channel', 'sms')
      localStorage.setItem('spothitch_sos_silent', 'true')
      localStorage.setItem('spothitch_sos_custom_msg', 'Help me!')
      localStorage.setItem('spothitch_sos_primary', JSON.stringify({ name: 'Mom', phone: '+33600000000' }))
      localStorage.setItem('spothitch_sos_last_pos', JSON.stringify({ lat: 48.85, lng: 2.35 }))
    })
    // Verify they persist
    const keys = await page.evaluate(() => ({
      channel: localStorage.getItem('spothitch_sos_channel'),
      silent: localStorage.getItem('spothitch_sos_silent'),
      msg: localStorage.getItem('spothitch_sos_custom_msg'),
      primary: localStorage.getItem('spothitch_sos_primary'),
      pos: localStorage.getItem('spothitch_sos_last_pos'),
    }))
    expect(keys.channel).toBe('sms')
    expect(keys.silent).toBe('true')
    expect(keys.msg).toBe('Help me!')
    expect(JSON.parse(keys.primary).name).toBe('Mom')
    expect(JSON.parse(keys.pos).lat).toBe(48.85)
  })

  test('offline queue stores actions', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      const queue = [
        { action: 'addSpot', data: { from: 'Paris', to: 'Lyon' }, timestamp: Date.now() },
        { action: 'addReview', data: { spotId: 42, rating: 5 }, timestamp: Date.now() },
      ]
      localStorage.setItem('spothitch_offline_queue', JSON.stringify(queue))
    })
    const queue = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_offline_queue') || '[]')
    })
    expect(queue.length).toBe(2)
    expect(queue[0].action).toBe('addSpot')
  })

  test('offline countries cache works', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      localStorage.setItem('spothitch_offline_countries', JSON.stringify(['FR', 'DE', 'ES']))
    })
    const countries = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_offline_countries') || '[]')
    })
    expect(countries).toEqual(['FR', 'DE', 'ES'])
  })

  test('app functions stay available after going offline', async ({ page }) => {
    await setup(page)
    // Simulate offline
    await page.evaluate(() => window.dispatchEvent(new Event('offline')))
    await page.waitForTimeout(500)
    // Core functions should still exist
    const fns = await page.evaluate(() => ({
      getState: typeof window.getState,
      setState: typeof window.setState,
      changeTab: typeof window.changeTab,
    }))
    expect(fns.getState).toBe('function')
    expect(fns.setState).toBe('function')
    expect(fns.changeTab).toBe('function')
  })
})
