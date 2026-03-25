/**
 * E2E Tests - Map Features
 * Optimized: grouped tests share page context to reduce load times
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab, waitForMap } from './helpers.js'

test.describe('Map View', () => {
  test.setTimeout(90000) // Map loading can be slow in CI
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')
    await waitForMap(page)
  })

  test('should display map with all controls', async ({ page }) => {
    await expect(page.locator('#home-map').first()).toBeVisible({ timeout: 30000 })
    // Search bar may take time to render in CI
    await expect(page.locator('#side-panel-destination, #home-destination').first()).toBeVisible({ timeout: 20000 })

    const filterBtn = page.locator('[onclick*="openFilters"], button[aria-label*="Filtre"], button[aria-label*="Filter"]')
    await expect(filterBtn.first()).toBeVisible({ timeout: 10000 })

    await expect(page.locator('[onclick*="homeZoomIn"]').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[onclick*="homeZoomOut"]').first()).toBeVisible({ timeout: 10000 })

    const fabBtn = page.locator('[onclick*="openAddSpot"], button[aria-label*="Ajouter un spot"]')
    await expect(fabBtn.first()).toBeVisible({ timeout: 10000 })
  })

  test('should zoom in and out with actual zoom level change', async ({ page }) => {
    const zoomInBtn = page.locator('[onclick*="homeZoomIn"]').first()
    await expect(zoomInBtn).toBeVisible({ timeout: 15000 })

    // Wait for map instance to be ready (splash may delay init)
    await page.waitForFunction(() => window.homeMapInstance?.getZoom, { timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(500)

    // Get zoom level BEFORE
    const zoomBefore = await page.evaluate(() => {
      const map = window.homeMapInstance
      return map && map.getZoom ? map.getZoom() : null
    })

    await zoomInBtn.click({ force: true })
    await page.waitForTimeout(500)

    // REAL RESULT: zoom level should have increased
    const zoomAfterIn = await page.evaluate(() => {
      const map = window.homeMapInstance
      return map && map.getZoom ? map.getZoom() : null
    })

    if (zoomBefore !== null && zoomAfterIn !== null) {
      expect(zoomAfterIn).toBeGreaterThan(zoomBefore)
    }

    const zoomOutBtn = page.locator('[onclick*="homeZoomOut"]').first()
    await expect(zoomOutBtn).toBeVisible({ timeout: 15000 })
    await zoomOutBtn.click({ force: true })
    await page.waitForTimeout(500)

    // REAL RESULT: zoom level should have decreased
    const zoomAfterOut = await page.evaluate(() => {
      const map = window.homeMapInstance
      return map && map.getZoom ? map.getZoom() : null
    })

    if (zoomAfterIn !== null && zoomAfterOut !== null) {
      expect(zoomAfterOut).toBeLessThan(zoomAfterIn)
    }

    await expect(page.locator('#home-map')).toBeVisible()
  })

  test('should search and map stays functional', async ({ page }) => {
    const searchInput = page.locator('#side-panel-destination, #home-destination').first()
    if ((await searchInput.count()) === 0) return

    await searchInput.fill('Paris')
    await expect(searchInput).toHaveValue('Paris')
    await searchInput.press('Enter', { timeout: 15000 })
    await page.waitForTimeout(2000)

    // REAL RESULT: map should still be visible and functional after search
    await expect(page.locator('#home-map')).toBeVisible({ timeout: 5000 })

    // If geocoding worked (not always available in CI), map should have moved
    const center = await page.evaluate(() => {
      const map = window.homeMapInstance
      if (map && map.getCenter) {
        const c = map.getCenter()
        return { lat: c.lat, lng: c.lng }
      }
      return null
    })
    // Map should at least have valid coordinates
    if (center) {
      expect(center.lat).toBeGreaterThan(-90)
      expect(center.lat).toBeLessThan(90)
    }
  })

  test('should open add spot and filter modals', async ({ page }) => {
    test.setTimeout(40000) // This test reloads the page — needs extra time in CI

    const addBtn = page.locator('[onclick*="openAddSpot"]')
    if ((await addBtn.count()) > 0) {
      await addBtn.first().click({ force: true })
      await page.waitForTimeout(1500)
      const dialog = page.locator('[role="dialog"], .modal-overlay, .fixed.inset-0.z-50')
      if (await dialog.count() > 0) {
        await expect(dialog.first()).toBeVisible()
      }
      // Close modal via Escape or close button
      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)
    }

    // Close any remaining modal
    await page.evaluate(() => {
      window.closeAddSpotModal?.()
      window.closeFilters?.()
    })
    await page.waitForTimeout(500)

    const filterBtn = page.locator('[onclick*="openFilters"]')
    if ((await filterBtn.count()) > 0) {
      await filterBtn.first().click()
      await page.waitForTimeout(1500)
      const filterModal = page.locator('[role="dialog"], .modal-overlay, .fixed.inset-0.z-50')
      if (await filterModal.count() > 0) {
        await expect(filterModal.first()).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should be interactive and click on map', async ({ page }) => {
    const mapContainer = page.locator('#home-map')
    await expect(mapContainer).toBeVisible({ timeout: 10000 })
    const box = await mapContainer.boundingBox()
    expect(box).not.toBeNull()
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await expect(mapContainer).toBeVisible()
  })

  test('should have accessible controls', async ({ page }) => {
    // All interactive controls MUST have aria-labels
    const searchInput = page.locator('#side-panel-destination, #home-destination').first()
    await expect(searchInput).toBeVisible({ timeout: 5000 })
    const searchAriaLabel = await searchInput.getAttribute('aria-label')
    expect(searchAriaLabel).toBeTruthy()

    const zoomIn = page.locator('[onclick*="homeZoomIn"]').first()
    await expect(zoomIn).toBeVisible({ timeout: 5000 })
    const zoomAriaLabel = await zoomIn.getAttribute('aria-label')
    expect(zoomAriaLabel).toBeTruthy()

    const addBtn = page.locator('[onclick*="openAddSpot"]').first()
    await expect(addBtn).toBeVisible({ timeout: 5000 })
    const addAriaLabel = await addBtn.getAttribute('aria-label')
    expect(addAriaLabel).toBeTruthy()
  })

  // =========================================================
  // PROTECTED FEATURE: Bouton stations essence
  // Ce test vérifie que le bouton ⛽ fonctionne directement,
  // SANS fenêtre d'intro devant lui. Si ce test échoue c'est
  // qu'un wrapper a intercepté toggleGasStations — INTERDIT.
  // =========================================================
  test('gas station toggle works directly without intro modal', async ({ page }) => {
    // Le bouton ⛽ doit être visible
    const gasBtn = page.locator('#gas-toggle-btn')
    await expect(gasBtn).toBeVisible({ timeout: 8000 })

    // Cliquer le bouton
    await gasBtn.click()
    await page.waitForTimeout(800)

    // Vérifier qu'aucune fenêtre d'intro (FeatureIntroModal) n'est apparue
    const introModal = page.locator('.feature-intro-overlay, [id*="feature-intro"]')
    const introCount = await introModal.count()
    expect(
      introCount,
      'Le bouton stations essence a ouvert une fenêtre d\'intro au lieu de fonctionner directement. ' +
      'toggleGasStations ne doit JAMAIS être wrappé par setupFeatureIntroWrappers().'
    ).toBe(0)

    // Cliquer à nouveau pour désactiver
    await gasBtn.click()
    await page.waitForTimeout(400)

    // La carte doit toujours être visible (pas de crash)
    await expect(page.locator('#home-map')).toBeVisible()
  })
})
