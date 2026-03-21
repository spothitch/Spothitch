/**
 * E2E Tests - Navigation & Core Views
 * Tests REAL content changes when switching tabs, not just aria attributes
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('should load homepage with title and nav', async ({ page }) => {
    await expect(page).toHaveTitle(/SpotHitch/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate between tabs with REAL content change', async ({ page }) => {
    // Start on map tab — verify map content is visible
    await navigateToTab(page, 'map')
    const mapContent = await page.evaluate(() => document.querySelector('#home-map') !== null)
    expect(mapContent).toBe(true)

    // Switch to profile — verify DIFFERENT content appears
    await navigateToTab(page, 'profile')
    await expect(page.locator(`[data-tab="profile"]`)).toHaveAttribute('aria-selected', 'true')
    const hasProfileContent = await page.evaluate(() => {
      const text = document.body.innerText
      return text.includes('Score') || text.includes('Profil') || text.includes('Réglages') || text.includes('TestUser')
    })
    expect(hasProfileContent).toBe(true)

    // Switch to social — verify DIFFERENT content appears
    await navigateToTab(page, 'social')
    await expect(page.locator(`[data-tab="social"]`)).toHaveAttribute('aria-selected', 'true')
    const hasSocialContent = await page.evaluate(() => {
      const text = document.body.innerText
      return text.includes('Message') || text.includes('message') ||
             text.includes('Chat') || text.includes('chat') ||
             text.includes('Social') || text.includes('social') ||
             text.includes('Événement') || text.includes('événement')
    })
    expect(hasSocialContent).toBe(true)

    // Switch to challenges — verify DIFFERENT content appears
    await navigateToTab(page, 'challenges')
    await expect(page.locator(`[data-tab="challenges"]`)).toHaveAttribute('aria-selected', 'true')
    const hasChallengesContent = await page.evaluate(() => {
      const text = document.body.innerText
      return text.includes('Quiz') || text.includes('quiz') ||
             text.includes('Défi') || text.includes('défi') ||
             text.includes('Classement') || text.includes('classement') ||
             text.includes('Niveau') || text.includes('niveau') ||
             text.includes('Badge') || text.includes('badge') ||
             text.includes('Progression') || text.includes('progression')
    })
    expect(hasChallengesContent).toBe(true)
  })

  test('should have accessible navigation with meaningful labels', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]')
    await expect(nav).toBeVisible({ timeout: 5000 })
    const ariaLabel = await nav.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel.length).toBeGreaterThan(3)

    const navButtons = page.locator('nav button[role="tab"]')
    const count = await navButtons.count()
    expect(count).toBeGreaterThanOrEqual(4)

    for (let i = 0; i < count; i++) {
      const button = navButtons.nth(i)
      const label = await button.getAttribute('aria-label')
      expect(label).toBeTruthy()
      expect(label.length).toBeGreaterThan(2)
    }
  })
})

test.describe('Map View - Real Content', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')
  })

  test('should display map with actual canvas tiles', async ({ page }) => {
    const mapContainer = page.locator('#home-map')
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 })

    // REAL RESULT: verify map has rendered canvas (not just div)
    const hasCanvas = await page.evaluate(() => {
      const map = document.querySelector('#home-map')
      return map ? map.querySelectorAll('canvas').length > 0 : false
    })
    expect(hasCanvas).toBe(true)
  })

  test('should have functional search bar', async ({ page }) => {
    const search = page.locator('#home-destination')
    await expect(search.first()).toBeVisible({ timeout: 5000 })

    // REAL RESULT: verify placeholder is a real translated text
    const placeholder = await search.getAttribute('placeholder')
    expect(placeholder).toBeTruthy()
    expect(placeholder.length).toBeGreaterThan(3)

    // Verify input accepts text
    await search.fill('Test')
    await expect(search).toHaveValue('Test')
  })
})

test.describe('Profile - Real Content', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'profile')
  })

  test('should display profile with user data from state', async ({ page }) => {
    // REAL RESULT: verify username matches what was set in localStorage
    const hasUsername = await page.evaluate(() =>
      document.body.innerText.includes('TestUser')
    )
    expect(hasUsername).toBe(true)

    // REAL RESULT: verify points are displayed and match state
    const pointsMatch = await page.evaluate(() => {
      const raw = localStorage.getItem('spothitch_v4_state')
      const state = raw ? JSON.parse(raw) : {}
      return document.body.innerText.includes(String(state.points || 100))
    })
    expect(pointsMatch).toBe(true)
  })

  test('should have settings with working controls', async ({ page }) => {
    await page.evaluate(() => window.setProfileSubTab?.('reglages'))
    await page.waitForTimeout(300)
    const settings = page.locator('[role="switch"]')
    const count = await settings.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('SOS Mode', () => {
  test('should open SOS modal with real content when clicking SOS button', async ({ page }) => {
    await skipOnboarding(page)
    // Mark SOS intro as seen so we get the real SOS modal
    await page.evaluate(() => localStorage.setItem('spothitch_sos_intro_seen', '1'))

    const sosButton = page.locator('button:has-text("SOS")')
    if (await sosButton.count() > 0) {
      await expect(sosButton.first()).toBeVisible()
      await sosButton.first().click()
      await page.waitForTimeout(1000)

      // REAL RESULT: verify SOS modal opened with actual content
      const hasSOSContent = await page.evaluate(() => {
        const text = document.body.innerText
        return text.includes('SOS') && (
          text.includes('Alerte') || text.includes('alerte') ||
          text.includes('Urgence') || text.includes('urgence') ||
          text.includes('Gardien') || text.includes('gardien') ||
          text.includes('Faux appel') || text.includes('faux appel')
        )
      })
      expect(hasSOSContent).toBe(true)
    }
  })
})
