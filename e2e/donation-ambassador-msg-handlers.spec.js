import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - processDonation opens the donation thank-you (state.showDonationThankYou).
 *  - sendAmbassadorMessage shows a "message sent" toast (reads #ambassador-message).
 */
async function boot(page) {
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

test('processDonation opens the donation thank-you', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.processDonation === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'processDonation should register').toBe(true)
  await page.evaluate(() => window.setState({ showDonationThankYou: false }))
  await page.evaluate(() => window.processDonation('paypal'))
  await expect.poll(() => page.evaluate(() => window.getState().showDonationThankYou), { timeout: 8000 }).toBe(true)
})

test('sendAmbassadorMessage shows a sent toast', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.sendAmbassadorMessage === 'function', { timeout: 15000 })
  await page.evaluate(() => {
    window.__toasted = false
    window.showToast = () => { window.__toasted = true }
    const el = document.createElement('textarea'); el.id = 'ambassador-message'; el.value = 'Salut, question spot'; document.body.appendChild(el)
  })
  await page.evaluate(() => window.sendAmbassadorMessage('amb1'))
  expect(await page.evaluate(() => window.__toasted)).toBe(true)
})
