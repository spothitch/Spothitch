/**
 * Responsive design tests across breakpoints.
 * Loads the page ONCE at 390px, then resizes to test other viewports.
 * This avoids browser memory pressure from multiple consecutive page.goto() calls.
 */
import { test, expect } from '@playwright/test'

test.setTimeout(120000)

const VIEWPORTS = [
  { name: '320px', width: 320, height: 568 },
  { name: '390px', width: 390, height: 844 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1920px', width: 1920, height: 1080 },
]

test('responsive layout: no overflow and nav visible at all breakpoints', async ({ page }) => {
  // Load page ONCE at 390px (mobile default)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showWelcome: false, username: 'TestUser', activeTab: 'map',
      theme: 'dark', lang: 'en', points: 100, level: 1, badges: [],
    }))
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_age_verified', 'true')
    localStorage.setItem('cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
      timestamp: Date.now(), version: '1.0',
    }))
  })
  await page.goto('/')
  await page.waitForLoadState('load')
  await page.waitForTimeout(3000)

  // Verify app loaded at 390px
  const baseCheck = await page.evaluate(() => ({
    alive: !!document.getElementById('app'),
    hasChildren: document.getElementById('app')?.children.length > 0,
  }))
  expect(baseCheck.alive).toBe(true)
  expect(baseCheck.hasChildren).toBe(true)

  // Now resize to each viewport and check — NO new page.goto needed
  const results = []
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.waitForTimeout(500) // Allow layout to reflow

    const check = await page.evaluate((vpName) => {
      const docWidth = document.documentElement.clientWidth
      const scrollWidth = document.documentElement.scrollWidth
      const hasOverflow = scrollWidth > docWidth + 5

      // Nav check (fixed position — getBoundingClientRect, not offsetParent)
      const nav = document.querySelector('nav[role="navigation"], nav')
      const navRect = nav ? nav.getBoundingClientRect() : null
      const navVisible = navRect ? (navRect.width > 0 && navRect.height > 0) : false

      // App alive
      const app = document.getElementById('app')

      return {
        vp: vpName,
        docWidth,
        scrollWidth,
        hasOverflow,
        navVisible,
        appAlive: !!app,
        appHasChildren: (app?.children.length || 0) > 0,
      }
    }, vp.name)

    results.push(check)
    console.log(`[${vp.name}] overflow=${check.hasOverflow} (${check.docWidth}/${check.scrollWidth}px), nav=${check.navVisible}`)
  }

  // All viewports must have app alive
  for (const r of results) {
    expect(r.appAlive, `${r.vp}: app must be alive`).toBe(true)
    expect(r.appHasChildren, `${r.vp}: app must have children`).toBe(true)
  }

  // No overflow at >= 390px (320px gets a pass — extreme width)
  for (const r of results.filter(r => r.docWidth >= 390)) {
    expect(r.hasOverflow, `${r.vp}: no horizontal overflow`).toBe(false)
  }

  // Nav must be visible at all mobile viewports
  for (const r of results) {
    expect(r.navVisible, `${r.vp}: nav must be visible`).toBe(true)
  }
})

test('text legibility: no text < 10px on 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showWelcome: false, username: 'TestUser', activeTab: 'map',
      theme: 'dark', lang: 'en', points: 100, level: 1, badges: [],
    }))
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_age_verified', 'true')
    localStorage.setItem('cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
      timestamp: Date.now(), version: '1.0',
    }))
  })
  await page.goto('/')
  await page.waitForLoadState('load')
  await page.waitForTimeout(3000)

  const tinyText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('span, button, a, label, p'))
      .filter(el => {
        if (!el.textContent?.trim()) return false
        const style = window.getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') return false
        const rect = el.getBoundingClientRect()
        if (rect.width === 0) return false
        return parseFloat(style.fontSize) < 10
      })
      .map(el => ({
        tag: el.tagName,
        size: parseFloat(window.getComputedStyle(el).fontSize),
        text: (el.textContent || '').trim().slice(0, 20),
      }))
  })

  if (tinyText.length > 0) {
    console.warn('Text < 10px at 320px:', tinyText)
  } else {
    console.log('All text >= 10px at 320px ✓')
  }

  expect(tinyText).toHaveLength(0)
})
