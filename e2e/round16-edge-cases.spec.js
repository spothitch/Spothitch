/**
 * Round 16 — Edge Cases & Negative Tests
 * Double-clicks, empty inputs, max lengths, rapid actions — ~60 tests
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession, createSessions, closeSessions,
  captureConsoleErrors, navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(45000)

// ═══════ DOUBLE-CLICK PROTECTION ═══════

test.describe('Double-click protection', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  const doubleClickHandlers = [
    'openAddSpot', 'openSOS', 'openGuardian', 'openFilters',
    'openSettings', 'openSideMenu', 'openAdminPanel',
  ]

  for (const h of doubleClickHandlers) {
    test(`double-click ${h} does not crash`, async () => {
      await session.page.evaluate((n) => { window[n]?.(); window[n]?.() }, h)
      await session.page.waitForTimeout(300)
      const state = await session.page.evaluate(() => window.getState?.())
      expect(state).toBeTruthy()
    })
  }

  for (const h of doubleClickHandlers) {
    test(`rapid triple-click ${h} is safe`, async () => {
      const errors = captureConsoleErrors(session.page)
      await session.page.evaluate((n) => { window[n]?.(); window[n]?.(); window[n]?.() }, h)
      await session.page.waitForTimeout(300)
      const pageErrors = errors.errors.filter(e => e.startsWith('PAGE_ERROR'))
      expect(pageErrors.length).toBe(0)
    })
  }
})

// ═══════ EMPTY INPUT HANDLING ═══════

test.describe('Empty input handling', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await navigateToTab(session.page, 'profile')
    await session.page.waitForTimeout(2000)
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('saveBio with empty string', async () => {
    const ok = await session.page.evaluate(() => { window.saveBio?.(''); return true })
    expect(ok).toBe(true)
  })
  test('saveBio with null', async () => {
    const ok = await session.page.evaluate(() => { window.saveBio?.(null); return true })
    expect(ok).toBe(true)
  })
  test('saveBio with undefined', async () => {
    const ok = await session.page.evaluate(() => { window.saveBio?.(undefined); return true })
    expect(ok).toBe(true)
  })
  test('saveSocialLink with empty network', async () => {
    const ok = await session.page.evaluate(() => { window.saveSocialLink?.('', 'test'); return true })
    expect(ok).toBe(true)
  })
  test('saveSocialLink with empty value', async () => {
    const ok = await session.page.evaluate(() => { window.saveSocialLink?.('instagram', ''); return true })
    expect(ok).toBe(true)
  })
  test('handleSearch with null', async () => {
    const ok = await session.page.evaluate(() => { window.handleSearch?.(null); return true })
    expect(ok).toBe(true)
  })
  test('handleSearch with undefined', async () => {
    const ok = await session.page.evaluate(() => { window.handleSearch?.(undefined); return true })
    expect(ok).toBe(true)
  })
  test('changeTab with invalid tab name', async () => {
    const ok = await session.page.evaluate(() => { window.changeTab?.('nonexistent'); return true })
    expect(ok).toBe(true)
  })
  test('openSpotDetail with null id', async () => {
    const ok = await session.page.evaluate(() => { window.openSpotDetail?.(null); return true })
    expect(ok).toBe(true)
  })
  test('toggleFavorite with empty string', async () => {
    const ok = await session.page.evaluate(() => { window.toggleFavorite?.(''); return true })
    expect(ok).toBe(true)
  })
})

// ═══════ MAX LENGTH INPUTS ═══════

test.describe('Max length inputs', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
    await navigateToTab(session.page, 'profile')
    await session.page.waitForTimeout(2000)
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('bio with 10000 chars does not crash', async () => {
    const ok = await session.page.evaluate(() => { window.saveBio?.('x'.repeat(10000)); return true })
    expect(ok).toBe(true)
  })
  test('search with 1000 chars does not crash', async () => {
    const ok = await session.page.evaluate(() => { window.handleSearch?.('y'.repeat(1000)); return true })
    expect(ok).toBe(true)
  })
  test('social link with 500 chars is truncated', async () => {
    await session.page.evaluate(() => window.saveSocialLink?.('instagram', 'z'.repeat(500)))
    const stored = await session.page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_social_links') || '{}')?.instagram?.length
    )
    expect(stored).toBeLessThanOrEqual(200) // saveSocialLink truncates to 200
  })
})

// ═══════ RAPID TAB SWITCHING ═══════

test.describe('Rapid navigation', () => {
  let session
  test.beforeAll(async ({ browser }) => {
    session = await createUserSession(browser, 'alice')
  })
  test.afterAll(async () => { await session?.context?.close() })

  test('100 rapid tab switches', async () => {
    const errors = captureConsoleErrors(session.page)
    const tabs = ['map', 'voyage', 'social', 'profile']
    for (let i = 0; i < 100; i++) {
      await session.page.evaluate((t) => window.changeTab?.(t), tabs[i % 4])
    }
    await session.page.waitForTimeout(500)
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state).toBeTruthy()
    const pageErrors = errors.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })

  test('rapid open/close 10 modals', async () => {
    for (let i = 0; i < 10; i++) {
      await session.page.evaluate(() => { window.openSOS?.(); window.closeSOS?.() })
    }
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showSOS).not.toBe(true)
  })

  test('rapid open/close guardian 10 times', async () => {
    for (let i = 0; i < 10; i++) {
      await session.page.evaluate(() => { window.openGuardian?.(); window.closeGuardian?.() })
    }
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showGuardianModal).not.toBe(true)
  })
})

// ═══════ OFFLINE DURING OPERATIONS ═══════

test.describe('Offline during operations', () => {
  test('offline during search does not crash', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')
    await session.context.setOffline(true)
    const ok = await session.page.evaluate(() => { window.handleSearch?.('test'); return true })
    expect(ok).toBe(true)
    await session.context.setOffline(false)
    await session.context.close()
  })

  test('offline during tab switch does not crash', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')
    await session.context.setOffline(true)
    for (const tab of ['profile', 'social', 'voyage', 'map']) {
      await session.page.evaluate((t) => window.changeTab?.(t), tab)
      await session.page.waitForTimeout(100)
    }
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state).toBeTruthy()
    await session.context.setOffline(false)
    await session.context.close()
  })

  test('offline modal open/close does not crash', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')
    await session.context.setOffline(true)
    await session.page.evaluate(() => window.openAddSpot?.())
    await session.page.waitForTimeout(500)
    await session.page.evaluate(() => window.closeAddSpot?.())
    const state = await session.page.evaluate(() => window.getState?.())
    expect(state).toBeTruthy()
    await session.context.setOffline(false)
    await session.context.close()
  })
})

// ═══════ CROSS-USER EDGE CASES ═══════

test.describe('Cross-user edge cases', () => {
  test('5 users all switch tabs simultaneously', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie', 'diana', 'admin'])
    await Promise.all(
      Object.values(sessions).map(s =>
        s.page.evaluate(() => window.changeTab?.('profile'))
      )
    )
    for (const s of Object.values(sessions)) {
      const state = await s.page.evaluate(() => window.getState?.())
      expect(state).toBeTruthy()
    }
    await closeSessions(sessions)
  })
})

// ═══════ VIEWPORT EDGE CASES ═══════

test.describe('Extreme viewports', () => {
  const extremeViewports = [
    { name: 'tiny-320', width: 320, height: 480 },
    { name: 'wide-2560', width: 2560, height: 1440 },
    { name: 'tall-390x1200', width: 390, height: 1200 },
    { name: 'square-500x500', width: 500, height: 500 },
  ]

  for (const { name, width, height } of extremeViewports) {
    test(`${name} renders without crash`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } })
      const page = await ctx.newPage()
      await page.addInitScript(() => {
        localStorage.setItem('spothitch_v4_state', JSON.stringify({
          showWelcome: false, username: 'Test', activeTab: 'map',
          theme: 'dark', lang: 'en',
        }))
        localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
          preferences: { necessary: true }, timestamp: Date.now(), version: '1.0',
        }))
        localStorage.setItem('spothitch_age_verified', 'true')
        localStorage.setItem('spothitch_landing_v2', '1')
        localStorage.setItem('spothitch_beta_seen', '1')
      })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(3000)
      const hasContent = await page.evaluate(() => document.body.textContent.length > 10)
      expect(hasContent).toBe(true)
      await ctx.close()
    })
  }
})
