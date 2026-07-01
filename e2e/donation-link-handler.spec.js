import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — updateDonationLink. Pure DOM: sets the PayPal.me href from the
 * chosen amount, clamped to 1..500, defaulting to 5. (DonationCard.js loads with the profile view.)
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

test('updateDonationLink builds the PayPal link and clamps the amount', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.updateDonationLink === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'updateDonationLink should register').toBe(true)

  await page.evaluate(() => {
    const a = document.createElement('a')
    a.id = 'donation-paypal-link'
    document.body.appendChild(a)
  })
  const href = () => page.evaluate(() => document.getElementById('donation-paypal-link').href)

  await page.evaluate(() => window.updateDonationLink(50))
  expect(await href()).toContain('/50EUR')

  // Clamp above 500
  await page.evaluate(() => window.updateDonationLink(9999))
  expect(await href()).toContain('/500EUR')

  // Non-numeric → default 5
  await page.evaluate(() => window.updateDonationLink('abc'))
  expect(await href()).toContain('/5EUR')
})
