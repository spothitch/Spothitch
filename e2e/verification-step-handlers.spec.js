import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — identity-verification step navigation. All effects land on
 * window.identityVerificationState (the modal re-renders from it). Each test opens the modal so
 * the REAL handlers load, then drives the selfie+ID step flow and asserts the state.
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

async function openVerif(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showIdentityVerification: true }))
    ok = await page.waitForFunction(
      (n) => typeof window[n] === 'function', handlerName, { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

const step = (page) => page.evaluate(() => window.identityVerificationState.currentStep)
const selfieStep = (page) => page.evaluate(() => window.identityVerificationState.selfieIdStep)

test('setVerificationStep sets the current step of the verification modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'setVerificationStep')
  await page.evaluate(() => window.setVerificationStep('phone'))
  expect(await step(page)).toBe('phone')
})

test('startVerificationStep(4) enters the selfie+ID flow at step 1', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'startVerificationStep')
  await page.evaluate(() => window.startVerificationStep(4))
  expect(await step(page)).toBe('selfie-id')
  expect(await selfieStep(page)).toBe(1)
})

test('goToNextSelfieIdStep / goToPreviousSelfieIdStep navigate and clamp 1..3', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'goToNextSelfieIdStep')
  await page.evaluate(() => window.startVerificationStep(4))
  expect(await selfieStep(page)).toBe(1)
  await page.evaluate(() => window.goToNextSelfieIdStep())
  expect(await selfieStep(page)).toBe(2)
  await page.evaluate(() => window.goToNextSelfieIdStep())
  expect(await selfieStep(page)).toBe(3)
  // Clamped at 3
  await page.evaluate(() => window.goToNextSelfieIdStep())
  expect(await selfieStep(page)).toBe(3)
  // Back down, clamped at 1
  await page.evaluate(() => { window.goToPreviousSelfieIdStep(); window.goToPreviousSelfieIdStep(); window.goToPreviousSelfieIdStep() })
  expect(await selfieStep(page)).toBe(1)
})
