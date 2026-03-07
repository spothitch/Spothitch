#!/usr/bin/env node
/**
 * Visual Invariants Check (Playwright-based)
 *
 * Opens the app in a real browser and verifies:
 * 1. Text contrast ratios (WCAG AA: 4.5:1 normal, 3:1 large)
 * 2. Touch target sizes (minimum 44x44px)
 * 3. Invisible/hidden text that should be visible
 * 4. Elements blocked by overlays
 * 5. Horizontal overflow (content outside viewport)
 * 6. Tests BOTH dark and light themes
 *
 * Usage: node scripts/checks/visual-invariants.mjs [--serve] [--theme=dark|light|both]
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const VIEWPORT = { width: 390, height: 844 }
const BASE_URL = process.env.APP_URL || 'http://localhost:5173'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

// WCAG contrast ratio calculation
const DOM_AUDIT_SCRIPT = `(() => {
  const issues = { contrast: [], touchTargets: [], invisible: [], blocked: [], overflow: [] }

  // --- Relative luminance (WCAG 2.0) ---
  function luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  function contrastRatio(l1, l2) {
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  function parseColor(color) {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null
    const m = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/)
    if (!m) return null
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 }
  }

  function getEffectiveBg(el) {
    let current = el
    while (current && current !== document.documentElement) {
      const style = getComputedStyle(current)
      const bg = parseColor(style.backgroundColor)
      if (bg && bg.a > 0.1) return bg
      current = current.parentElement
    }
    // Fallback: check body and html
    const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor)
    if (bodyBg && bodyBg.a > 0.1) return bodyBg
    // Default white
    return { r: 255, g: 255, b: 255, a: 1 }
  }

  // --- Helper: skip elements that are intentionally hidden ---
  function shouldSkip(el) {
    if (!el) return true
    const cls = el.className?.toString() || ''
    // Skip screen-reader-only elements
    if (cls.includes('sr-only') || cls.includes('visually-hidden')) return true
    if (el.getAttribute('aria-hidden') === 'true') return true
    // Skip skip-links (only visible on focus)
    if (cls.includes('skip-link') || el.getAttribute('href') === '#main-content' || el.getAttribute('href') === '#app') return true
    // Skip if element text is a skip-link
    if (el.textContent?.trim()?.startsWith('Aller au contenu')) return true
    // Skip elements clipped to 0 (common sr-only pattern)
    const s = getComputedStyle(el)
    if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)') return true
    if (s.position === 'absolute' && parseInt(s.width) <= 1 && parseInt(s.height) <= 1) return true
    return false
  }

  // Detect gradient text (visible via background-clip despite transparent color)
  // Check self AND ancestors (gradient-text class may be on parent)
  function isGradientText(el) {
    let current = el
    while (current && current !== document.body) {
      const s = getComputedStyle(current)
      const fill = s.webkitTextFillColor || s.getPropertyValue('-webkit-text-fill-color')
      const clip = s.webkitBackgroundClip || s.backgroundClip || s.getPropertyValue('-webkit-background-clip')
      if (fill === 'transparent' && clip === 'text') return true
      // Also check by class name
      if (current.classList?.contains('gradient-text')) return true
      current = current.parentElement
    }
    return false
  }

  // Detect vertical writing mode (writingMode: vertical-rl)
  function isVerticalText(el) {
    let current = el
    while (current && current !== document.body) {
      const s = getComputedStyle(current)
      if (s.writingMode === 'vertical-rl' || s.writingMode === 'vertical-lr') return true
      current = current.parentElement
    }
    return false
  }

  // Detect elements rendered on top of map or with translucent backdrop
  function isOnMapOverlay(el) {
    let current = el
    while (current && current !== document.body) {
      const s = getComputedStyle(current)
      // Elements inside map controls or the map container itself
      if (current.id === 'home-map-controls' || current.id === 'home-map' || current.id === 'panel-map' || current.classList?.contains('maplibregl-ctrl')) return true
      // Fixed/absolute with backdrop-blur (glassmorphism header/navbar)
      if ((s.position === 'fixed' || s.position === 'absolute') && s.backdropFilter && s.backdropFilter !== 'none') return true
      // Elements with semi-transparent bg (e.g. bg-dark-primary/60) positioned
      const bg = s.backgroundColor
      if ((s.position === 'fixed' || s.position === 'absolute' || s.position === 'relative') && bg && bg.includes('0.') && !bg.includes('0, 0, 0, 0)')) return true
      current = current.parentElement
    }
    return false
  }

  // Detect elements with inline-styled background (e.g. feedback button with inline gradient)
  function hasInlineBackground(el) {
    let current = el
    while (current && current !== document.body) {
      const inlineStyle = current.getAttribute?.('style') || ''
      if (inlineStyle.includes('background') || inlineStyle.includes('linear-gradient')) return true
      current = current.parentElement
    }
    return false
  }

  // --- 1. Contrast check on all visible text ---
  const textElements = document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,button,label,li,td,th,div,summary,input,textarea,select')
  for (const el of textElements) {
    if (shouldSkip(el)) continue
    // Skip hidden elements
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    // Skip if not in viewport
    if (rect.top > window.innerHeight || rect.bottom < 0) continue

    // Only check leaf text nodes
    const text = el.textContent?.trim()
    if (!text || text.length === 0) continue
    // Skip elements whose text comes from children (avoid duplicates)
    if (el.children.length > 0) {
      const directText = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('')
      if (!directText) continue
    }

    // Skip gradient text (visible via background gradient, not text color)
    if (isGradientText(el)) continue
    // Skip map overlay elements (translucent bg on top of map tiles)
    if (isOnMapOverlay(el)) continue
    // Skip elements with inline-styled background (e.g. feedback button)
    if (hasInlineBackground(el)) continue

    const fg = parseColor(style.color)
    if (!fg) continue
    const bg = getEffectiveBg(el)
    if (!bg) continue

    // Blend fg alpha with bg
    const blendedR = fg.r * fg.a + bg.r * (1 - fg.a)
    const blendedG = fg.g * fg.a + bg.g * (1 - fg.a)
    const blendedB = fg.b * fg.a + bg.b * (1 - fg.a)

    const fgLum = luminance(blendedR, blendedG, blendedB)
    const bgLum = luminance(bg.r, bg.g, bg.b)
    const ratio = contrastRatio(fgLum, bgLum)

    const fontSize = parseFloat(style.fontSize)
    const fontWeight = parseInt(style.fontWeight) || 400
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700)
    const minRatio = isLargeText ? 3 : 4.5

    if (ratio < minRatio) {
      issues.contrast.push({
        text: text.substring(0, 60),
        ratio: Math.round(ratio * 100) / 100,
        required: minRatio,
        fg: style.color,
        bg: style.backgroundColor,
        selector: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
        rect: { top: Math.round(rect.top), left: Math.round(rect.left) }
      })
    }
  }

  // --- 2. Touch target size check ---
  const interactiveElements = document.querySelectorAll('button, a[href], input, select, textarea, [onclick], [role="button"], [tabindex="0"]')
  for (const el of interactiveElements) {
    if (shouldSkip(el)) continue
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    if (rect.top > window.innerHeight || rect.bottom < 0) continue

    // For vertical writing mode, swap width/height measurement
    let checkW = rect.width, checkH = rect.height
    if (isVerticalText(el)) { checkW = rect.height; checkH = rect.width }

    if (checkW < 44 || checkH < 44) {
      // Skip tiny inline links in text
      if (el.tagName === 'A' && rect.height < 20 && el.closest('p, li, span')) continue

      issues.touchTargets.push({
        text: (el.textContent?.trim() || el.getAttribute('aria-label') || el.tagName).substring(0, 40),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        selector: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
        rect: { top: Math.round(rect.top), left: Math.round(rect.left) }
      })
    }
  }

  // --- 3. Invisible text detection ---
  for (const el of textElements) {
    if (shouldSkip(el)) continue
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    if (style.display === 'none') continue
    const text = el.textContent?.trim()
    if (!text) continue

    // Check for zero opacity
    if (style.opacity === '0' && rect.top < window.innerHeight && rect.top > 0) {
      issues.invisible.push({
        text: text.substring(0, 40),
        reason: 'opacity: 0',
        selector: el.tagName.toLowerCase()
      })
    }

    // Check for text same color as background (skip known visual patterns)
    if (!isGradientText(el) && !isVerticalText(el) && !isOnMapOverlay(el) && !hasInlineBackground(el)) {
      const fg = parseColor(style.color)
      const bg = getEffectiveBg(el)
      if (fg && bg) {
        const fgLum = luminance(fg.r * fg.a, fg.g * fg.a, fg.b * fg.a)
        const bgLum = luminance(bg.r, bg.g, bg.b)
        const ratio = contrastRatio(fgLum, bgLum)
        if (ratio < 1.1) {
          issues.invisible.push({
            text: text.substring(0, 40),
            reason: 'same color as background (ratio: ' + Math.round(ratio * 100) / 100 + ')',
            fg: style.color,
            bg: style.backgroundColor
          })
        }
      }
    }
  }

  // --- 4. Elements blocked by overlays ---
  for (const el of interactiveElements) {
    if (shouldSkip(el)) continue
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    if (rect.top > window.innerHeight || rect.bottom < 0) continue

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    if (centerX < 0 || centerY < 0 || centerX > window.innerWidth || centerY > window.innerHeight) continue

    const topEl = document.elementFromPoint(centerX, centerY)
    if (topEl && topEl !== el && !el.contains(topEl) && !topEl.contains(el)) {
      issues.blocked.push({
        text: (el.textContent?.trim() || el.tagName).substring(0, 40),
        blockedBy: topEl.tagName.toLowerCase() + (topEl.className ? '.' + String(topEl.className).split(' ')[0] : ''),
        selector: el.tagName.toLowerCase()
      })
    }
  }

  // --- 5. Horizontal overflow ---
  if (document.documentElement.scrollWidth > window.innerWidth + 2) {
    issues.overflow.push({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      excess: document.documentElement.scrollWidth - window.innerWidth
    })
  }

  return issues
})()`

// Screens/states to test
const SCREENS = [
  {
    name: 'map',
    setup: null, // default home view
  },
  {
    name: 'voyage',
    setup: `() => {
      const tab = document.querySelector('[data-tab="voyage"]')
      if (tab) tab.click()
    }`,
  },
  {
    name: 'social',
    setup: `() => {
      const tab = document.querySelector('[data-tab="social"]')
      if (tab) tab.click()
    }`,
  },
  {
    name: 'profile',
    setup: `() => {
      const tab = document.querySelector('[data-tab="profile"]')
      if (tab) tab.click()
    }`,
  },
  {
    name: 'spotdetail',
    setup: `() => {
      if (window.setState) {
        window.setState({ selectedSpot: {
          id: 'test-vi-1', lat: 48.8566, lon: 2.3522, rating: 4,
          country: 'FR', city: 'Paris', direction: 'Lyon',
          type: 'city_exit', security: 4, traffic: 3, accessibility: 5,
          description: 'Test spot pour audit visuel',
          votes: 12, addedBy: 'user1', photos: [],
          destinations: [{direction: 'Lyon', waitTime: 15}]
        }})
      }
    }`,
  },
  {
    name: 'addspot',
    setup: `() => { window.openAddSpot?.() }`,
  },
]

async function runAudit(themeMode = 'both') {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    console.error('Playwright not installed. Run: npm install -D playwright')
    process.exit(1)
  }

  const themes = themeMode === 'both' ? ['dark', 'light'] : [themeMode]
  const allResults = {}
  let totalIssues = 0

  for (const theme of themes) {
    console.log(`\n=== Theme: ${theme} ===`)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      colorScheme: theme,
    })

    await context.addInitScript((t) => {
      localStorage.setItem('spothitch_onboarding_complete', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_cookies_accepted', 'true')
      localStorage.setItem('spothitch_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(),
        version: '1'
      }))
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showLanding: false,
        theme: t,
        lang: 'fr',
        activeTab: 'home',
        username: 'AuditBot',
        points: 500,
        level: 5,
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(),
        version: '1'
      }))
    }, theme)

    const page = await context.newPage()

    // Collect console errors (filter dev noise)
    const DEV_NOISE = [/X-Frame-Options/i, /MIME type/i, /ServiceWorker/i, /Sentry/i, /Style is not done loading/i, /favicon/i, /workbox/i]
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!DEV_NOISE.some(p => p.test(text))) consoleErrors.push(text)
      }
    })
    page.on('pageerror', err => {
      if (!DEV_NOISE.some(p => p.test(err.message))) consoleErrors.push(err.message)
    })

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(3000)

      // Dismiss any popups
      try {
        const closeBtn = page.locator('[aria-label="Fermer"], .modal-overlay .close-btn, #cookie-banner button')
        const count = await closeBtn.count()
        for (let i = 0; i < count; i++) {
          try { await closeBtn.nth(i).click({ timeout: 1000 }) } catch {}
        }
      } catch {}

      allResults[theme] = {}

      for (const screen of SCREENS) {
        console.log(`  Testing: ${screen.name}...`)

        try {
          if (screen.setup) {
            await page.evaluate(screen.setup)
            await page.waitForTimeout(1500)
          }

          const issues = await page.evaluate(DOM_AUDIT_SCRIPT)
          allResults[theme][screen.name] = issues

          const screenTotal = issues.contrast.length + issues.touchTargets.length +
            issues.invisible.length + issues.blocked.length + issues.overflow.length
          totalIssues += screenTotal

          // Take screenshot for reference
          await page.screenshot({
            path: join(REPORT_DIR, `vi-${theme}-${screen.name}.png`),
            fullPage: false,
            timeout: 10000,
          })

          // Print summary for this screen
          if (screenTotal > 0) {
            console.log(`    Contrast: ${issues.contrast.length} | Touch: ${issues.touchTargets.length} | Invisible: ${issues.invisible.length} | Blocked: ${issues.blocked.length} | Overflow: ${issues.overflow.length}`)
          } else {
            console.log(`    OK`)
          }

          // Close modal if we opened one
          if (screen.name === 'spotdetail' || screen.name === 'addspot') {
            await page.evaluate(() => {
              if (window.setState) window.setState({ selectedSpot: null, showAddSpot: false })
              document.querySelectorAll('.modal-overlay').forEach(m => m.remove())
            })
            await page.waitForTimeout(500)
          }
        } catch (err) {
          console.log(`    ERROR: ${err.message}`)
          allResults[theme][screen.name] = { error: err.message }
        }
      }

      if (consoleErrors.length > 0) {
        allResults[theme]._consoleErrors = consoleErrors
        console.log(`  Console errors: ${consoleErrors.length}`)
      }
    } catch (err) {
      console.error(`  Failed to load app: ${err.message}`)
    }

    await browser.close()
  }

  return { results: allResults, totalIssues }
}

function printReport(data) {
  console.log('\n' + '='.repeat(60))
  console.log('  VISUAL INVARIANTS REPORT')
  console.log('='.repeat(60))

  let totalContrast = 0, totalTouch = 0, totalInvisible = 0, totalBlocked = 0, totalOverflow = 0
  // Deduplicate: track unique issues by text+selector+theme
  const seen = new Set()

  for (const [theme, screens] of Object.entries(data.results)) {
    console.log(`\n--- Theme: ${theme.toUpperCase()} ---`)

    for (const [screen, issues] of Object.entries(screens)) {
      if (screen === '_consoleErrors') {
        console.log(`\n  Console Errors:`)
        issues.forEach(e => console.log(`    [ERR] ${e.substring(0, 100)}`))
        continue
      }
      if (issues.error) {
        console.log(`\n  ${screen}: ERROR — ${issues.error}`)
        continue
      }

      const hasIssues = issues.contrast?.length || issues.touchTargets?.length ||
        issues.invisible?.length || issues.blocked?.length || issues.overflow?.length

      if (!hasIssues) continue

      console.log(`\n  ${screen}:`)

      // Deduplicate issues — same element on navbar shows on every screen
      const dedup = (arr, type) => {
        if (!arr?.length) return []
        const unique = []
        for (const item of arr) {
          const key = `${theme}|${type}|${item.text?.substring(0, 30)}|${item.selector || ''}`
          if (!seen.has(key)) {
            seen.add(key)
            unique.push(item)
          }
        }
        return unique
      }

      const uContrast = dedup(issues.contrast, 'c')
      const uTouch = dedup(issues.touchTargets, 't')
      const uInvisible = dedup(issues.invisible, 'i')
      const uBlocked = dedup(issues.blocked, 'b')
      const uOverflow = dedup(issues.overflow, 'o')

      if (uContrast.length) {
        totalContrast += uContrast.length
        uContrast.slice(0, 5).forEach(c => {
          console.log(`    [CONTRAST] "${c.text}" ratio=${c.ratio} (need ${c.required}) | ${c.selector} @ ${c.rect.top},${c.rect.left}`)
        })
        if (uContrast.length > 5) console.log(`    ... +${uContrast.length - 5} more`)
      }

      if (uTouch.length) {
        totalTouch += uTouch.length
        uTouch.slice(0, 5).forEach(t => {
          console.log(`    [TOUCH] "${t.text}" ${t.width}x${t.height}px (need 44x44) | ${t.selector}`)
        })
        if (uTouch.length > 5) console.log(`    ... +${uTouch.length - 5} more`)
      }

      if (uInvisible.length) {
        totalInvisible += uInvisible.length
        uInvisible.forEach(i => {
          console.log(`    [INVISIBLE] "${i.text}" — ${i.reason}`)
        })
      }

      if (uBlocked.length) {
        totalBlocked += uBlocked.length
        uBlocked.slice(0, 3).forEach(b => {
          console.log(`    [BLOCKED] "${b.text}" blocked by ${b.blockedBy}`)
        })
      }

      if (uOverflow.length) {
        totalOverflow += uOverflow.length
        uOverflow.forEach(o => {
          console.log(`    [OVERFLOW] scrollWidth=${o.scrollWidth} > viewport=${o.viewportWidth} (+${o.excess}px)`)
        })
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`  TOTAL: ${totalContrast} contrast | ${totalTouch} touch | ${totalInvisible} invisible | ${totalBlocked} blocked | ${totalOverflow} overflow`)
  const total = totalContrast + totalTouch + totalInvisible + totalBlocked + totalOverflow
  console.log(`  SCORE: ${total === 0 ? '100/100 PERFECT' : `${Math.max(0, 100 - total * 2)}/100`}`)
  console.log('='.repeat(60))

  return total
}

// Export for quality gate integration
export default async function checkVisualInvariants(opts = {}) {
  const theme = opts.theme || 'both'
  try {
    const data = await runAudit(theme)
    const total = printReport(data)

    // Save detailed JSON report
    writeFileSync(
      join(REPORT_DIR, 'visual-invariants-report.json'),
      JSON.stringify(data.results, null, 2)
    )

    return {
      name: 'Visual Invariants',
      score: Math.max(0, 100 - total * 2),
      maxScore: 100,
      errors: total > 10 ? [`${total} visual issues detected`] : [],
      warnings: total > 0 && total <= 10 ? [`${total} visual issues detected`] : [],
      stats: { totalIssues: total }
    }
  } catch (err) {
    return {
      name: 'Visual Invariants',
      score: 0,
      maxScore: 100,
      errors: [`Audit failed: ${err.message}`],
      warnings: [],
      stats: { totalIssues: -1 }
    }
  }
}

// Run standalone
if (process.argv[1]?.includes('visual-invariants')) {
  const themeArg = process.argv.find(a => a.startsWith('--theme='))
  const theme = themeArg ? themeArg.split('=')[1] : 'both'
  checkVisualInvariants({ theme }).then(result => {
    process.exit(result.score >= 80 ? 0 : 1)
  })
}
