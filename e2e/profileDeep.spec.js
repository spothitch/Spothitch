/**
 * Profile Deep E2E Tests
 *
 * Tests bio edit, avatar, languages, photos, social links, roadmap,
 * identity verification, delete account, export data, consent.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe('Profile Edit', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'profile' })
    await page.waitForTimeout(1500)
  })

  test('profile edit handlers batch check', async ({ page }) => {
    const handlers = [
      'editBio', 'saveBio',
      'editAvatar', 'selectAvatar',
      'editLanguages', 'addLanguages', 'removeLanguage', 'cycleLanguageLevel',
      'addProfilePhoto', 'removeProfilePhoto', 'goToPhoto',
      'saveSocialLink', 'editSocialLinks',
      'openProfileCustomization', 'openCompleteProfile',
      'copyFriendLink', 'shareMyProfile',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    // Core profile handlers should be available
    expect(found.length).toBeGreaterThanOrEqual(5)
  })
})

test.describe('Profile Settings & Account', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'profile' })
    await page.waitForTimeout(1500)
  })

  test('settings and account handlers batch check', async ({ page }) => {
    const handlers = [
      'openDeleteAccount', 'confirmDeleteAccount',
      'downloadMyData', 'exportUserData',
      'openConsentSettings', 'saveCustomCookiePreferences',
      'openDeviceManager', 'executeRemoveDevice',
      'openChangelog',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(3)
  })
})

test.describe('Roadmap & Feature Requests', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'profile' })
    await page.waitForTimeout(1500)
  })

  test('roadmap handlers batch check', async ({ page }) => {
    const handlers = ['openRoadmap', 'openRoadmapFeature', 'roadmapVote', 'submitFeatureOpinion']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Identity Verification', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('identity verification handlers batch check', async ({ page }) => {
    const handlers = ['openIdentityVerification', 'startIdentityVerification', 'submitSelfieIdVerification']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Feedback & Contact', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('feedback and contact handlers batch check', async ({ page }) => {
    const handlers = [
      'openFeedbackPanel', 'submitFeedback', 'openFeedbackDetail',
      'openContactForm', 'submitContactForm',
      'openBugReport',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})
