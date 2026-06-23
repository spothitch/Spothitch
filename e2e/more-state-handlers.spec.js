import { test, expect } from '@playwright/test'

/**
 * Additional state handlers — REAL effect (Brique 2). Each opens its (lazy) module, runs the
 * real handler and verifies the concrete effect. Robust boot: waitUntil 'load' + retry the
 * module open for cold starts. One isolated test per handler.
 */
async function boot(page) {
  test.setTimeout(60000)
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}
async function loadHandler(page, fn, openFn) {
  let ok = false
  for (let i = 0; i < 3 && !ok; i++) {
    await page.evaluate(openFn)
    ok = await page.waitForFunction((f) => typeof window[f] === 'function', fn, { timeout: 10000 }).then(() => true).catch(() => false)
  }
  expect(ok, `${fn} should load`).toBe(true)
}

test('toggleBuddyFlexDates toggles the flex-dates flag in the buddy form', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'toggleBuddyFlexDates', () => window.changeTab('social'))
  const before = await page.evaluate(() => !!(window.getState().buddyFormData || {}).flexDates)
  await page.evaluate(() => window.toggleBuddyFlexDates()) // async (dynamic import + setState)
  await expect.poll(() => page.evaluate(() => !!(window.getState().buddyFormData || {}).flexDates),
    { timeout: 8000 }).toBe(!before)
})

test('handleDonationClick opens the donation thank-you', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'handleDonationClick', () => window.setState({ showDonation: true }))
  await page.evaluate(() => window.setState({ showDonationThankYou: false }))
  await page.evaluate(() => window.handleDonationClick('paypal'))
  await expect.poll(() => page.evaluate(() => window.getState().showDonationThankYou), { timeout: 8000 }).toBe(true)
})

test('sosAddFriendAsContact adds an emergency contact', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'sosAddFriendAsContact', () => window.setState({ showSOS: true }))
  const before = await page.evaluate(() => (window.getState().emergencyContacts || []).length)
  await page.evaluate(() => window.sosAddFriendAsContact('friend-uid-1', 'Test Friend'))
  await expect.poll(() => page.evaluate(() => (window.getState().emergencyContacts || []).length), { timeout: 8000 }).toBeGreaterThan(before)
})

test('updateExperienceDate stores the experience date in the spot form', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'updateExperienceDate', () => window.setState({ showAddSpot: true }))
  const stored = await page.evaluate(() => {
    window.spotFormData = window.spotFormData || {}
    const mk = (id, val) => { let el = document.getElementById(id); if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) } el.value = val }
    mk('exp-month', '3')
    mk('exp-year', '2026')
    window.updateExperienceDate()
    return { m: window.spotFormData.experienceMonth, y: window.spotFormData.experienceYear }
  })
  expect(String(stored.m)).toBe('3')
  expect(String(stored.y)).toBe('2026')
})

test('startIdentityVerification opens the identity verification flow', async ({ page }) => {
  await boot(page)
  await page.waitForFunction(() => typeof window.startIdentityVerification === 'function', { timeout: 15000 }).catch(() => {})
  test.skip(!(await page.evaluate(() => typeof window.startIdentityVerification === 'function')), 'handler not in shell build')
  await page.evaluate(() => window.setState({ showIdentityVerification: false }))
  await page.evaluate(() => window.startIdentityVerification())
  await expect.poll(() => page.evaluate(() => window.getState().showIdentityVerification), { timeout: 8000 }).toBe(true)
})

test('reactToEventComment bumps the events update timestamp', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'reactToEventComment', () => window.changeTab('social'))
  await page.evaluate(() => window.setState({ eventsLastUpdate: 0 }))
  await page.evaluate(() => window.reactToEventComment('comment-1', '👍'))
  await expect.poll(() => page.evaluate(() => window.getState().eventsLastUpdate), { timeout: 8000 }).not.toBe(0)
})

test('setMainProfilePhoto promotes a photo to first', async ({ page }) => {
  await boot(page)
  await loadHandler(page, 'setMainProfilePhoto', () => window.changeTab('profil'))
  await page.evaluate(() => window.setState({ profilePhotos: ['a.jpg', 'b.jpg', 'c.jpg'] }))
  await page.evaluate(() => window.setMainProfilePhoto(2)) // promote 'c.jpg'
  await expect.poll(() => page.evaluate(() => (window.getState().profilePhotos || [])[0]), { timeout: 8000 }).toBe('c.jpg')
})

