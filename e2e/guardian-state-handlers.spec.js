import { test, expect } from '@playwright/test'

/**
 * Guardian (safety) handlers — REAL effect (Brique 2). The Guardian module is lazy, so we
 * open it first (showGuardianModal), then drive the real handlers and verify the guardian
 * state really persists to localStorage 'spothitch_guardian' (the source of truth the
 * safety timer reads). No Firebase needed — these are local-safety-config handlers.
 */
async function bootGuardian(page) {
  test.setTimeout(90000) // the Guardian module is heavy; cold lazy load can be slow
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
  // Re-trigger the open a couple of times in case the first lazy render races, then wait
  // generously for the (heavy) Guardian module to install its handlers.
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.setState({ showGuardianModal: true }))
    const ready = await page.waitForFunction(
      () => typeof window.guardianAddTrustedContact === 'function' && typeof window.guardianSaveField === 'function',
      { timeout: 10000 },
    ).then(() => true).catch(() => false)
    if (ready) return
  }
  throw new Error('Guardian module did not load')
}

const guardianLS = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}') } catch { return {} }
})

test('guardianAddTrustedContact persists a trusted contact', async ({ page }) => {
  await bootGuardian(page)
  const before = (await guardianLS(page)).trustedContacts?.length || 0
  await page.evaluate(() => {
    const mk = (id, val) => { let el = document.getElementById(id); if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) } el.value = val }
    mk('guardian-tc-name', 'Trusted Test')
    mk('guardian-tc-phone', '+33611998877')
    window.guardianAddTrustedContact()
  })
  await expect.poll(async () => (await guardianLS(page)).trustedContacts?.length || 0,
    { timeout: 8000 }).toBeGreaterThan(before)
})

test('guardianSaveField (edit -> save) adds a guardian', async ({ page }) => {
  await bootGuardian(page)
  const before = (await guardianLS(page)).guardians?.length || 0
  // Enter edit mode for a new guardian (sets the module-local _editOverlay), then fill + save.
  await page.evaluate(() => window.guardianEditField('guardian'))
  await page.waitForTimeout(200)
  await page.evaluate(() => {
    const mk = (id, val) => { let el = document.getElementById(id); if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) } el.value = val }
    mk('guardian-edit-input', 'Maman')
    mk('guardian-edit-phone', '+33611223344')
    window.guardianSaveField()
  })
  await expect.poll(async () => {
    const g = await guardianLS(page)
    return (g.guardians || []).length
  }, { timeout: 8000 }).toBeGreaterThan(before)
})

test('guardianSavePlate persists the licence plate', async ({ page }) => {
  await bootGuardian(page)
  await page.evaluate(() => {
    let el = document.getElementById('guardian-sheet-plate')
    if (!el) { el = document.createElement('input'); el.id = 'guardian-sheet-plate'; document.body.appendChild(el) }
    el.value = 'ab-123-cd'
    window.guardianSavePlate()
  })
  await expect.poll(async () => (await guardianLS(page)).licensePlate, { timeout: 8000 }).toBe('AB-123-CD')
})

test('guardianSaveDestination persists the destination', async ({ page }) => {
  await bootGuardian(page)
  const dest = 'Berlin-' + Date.now()
  await page.evaluate((dest) => {
    let el = document.getElementById('guardian-sheet-dest')
    if (!el) { el = document.createElement('input'); el.id = 'guardian-sheet-dest'; document.body.appendChild(el) }
    el.value = dest
    window.guardianSaveDestination()
  }, dest)
  await expect.poll(async () => (await guardianLS(page)).destination, { timeout: 8000 }).toBe(dest)
})
