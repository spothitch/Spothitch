import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — three boot handlers.
 *  - reportGuideError opens the guide-error input overlay.
 *  - toggleWebhookAction flips a webhook's enabled flag (spothitch_webhooks).
 *  - removeWebhookAction removes a webhook.
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

const hooks = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_webhooks') || '[]') } catch { return [] }
})

test('reportGuideError opens the guide-error input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.reportGuideError === 'function', { timeout: 15000 })
  await page.evaluate(() => { window.reportGuideError('FR'); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})

test('toggleWebhookAction flips a webhook enabled flag', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.toggleWebhookAction === 'function', { timeout: 15000 })
  await page.evaluate(() => localStorage.setItem('spothitch_webhooks', JSON.stringify([{ id: 'w1', url: 'https://x.y', enabled: false }])))
  await page.evaluate(() => window.toggleWebhookAction('w1'))
  await expect.poll(async () => (await hooks(page)).find(w => w.id === 'w1')?.enabled, { timeout: 8000 }).toBe(true)
})

test('removeWebhookAction removes a webhook', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.removeWebhookAction === 'function', { timeout: 15000 })
  await page.evaluate(() => localStorage.setItem('spothitch_webhooks', JSON.stringify([{ id: 'w1', url: 'https://x.y', enabled: true }])))
  await page.evaluate(() => window.removeWebhookAction('w1'))
  await expect.poll(async () => (await hooks(page)).some(w => w.id === 'w1'), { timeout: 8000 }).toBe(false)
})
