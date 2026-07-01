import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — submitFeatureOpinion. It persists the opinion comment to
 * localStorage (spothitch_feature_opinions) before the optional Firestore sync, so the local
 * write is verifiable here. Boot handler (FeatureSlides.js).
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

test('submitFeatureOpinion stores the comment in localStorage', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.submitFeatureOpinion === 'function', { timeout: 15000 })

  await page.evaluate(() => {
    localStorage.removeItem('spothitch_feature_opinions')
    const ta = document.createElement('textarea')
    ta.id = 'feature-opinion-comment'
    ta.value = 'Super utile pour planifier'
    document.body.appendChild(ta)
  })
  await page.evaluate(() => window.submitFeatureOpinion('carte'))
  await expect.poll(
    () => page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')?.carte?.comment),
    { timeout: 8000 },
  ).toBe('Super utile pour planifier')
})
