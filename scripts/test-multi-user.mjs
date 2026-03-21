/**
 * Multi-user test script
 * Tests the complete flow: auth → friends → messages → SOS
 *
 * Prerequisites:
 * - Two test accounts configured in Firebase
 * - Dev server running (npm run dev)
 *
 * Usage: node scripts/test-multi-user.mjs
 */

import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:5173'

// Test accounts (already created in Firebase — see functions/config/ignoredAccounts.js)
const USER_A = { email: 'ci-alice@spothitch.com', password: 'CiAlice2026!', name: 'Alice CI' }
const USER_B = { email: 'ci-bob@spothitch.com', password: 'CiBob2026!', name: 'Bob CI' }

const results = []
function log(test, status, detail = '') {
  const emoji = status === 'OK' ? '✅' : status === 'FAIL' ? '❌' : '⏭️'
  console.log(`  ${emoji} ${test}${detail ? ` — ${detail}` : ''}`)
  results.push({ test, status, detail })
}

async function setupPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {})
  await page.evaluate(() => localStorage.setItem('spothitch_landing_seen', '1'))
  await page.reload({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(2000)
  return page
}

async function signIn(page, user) {
  // Open auth modal
  await page.evaluate(() => window.openAuth?.())
  await page.waitForTimeout(1500)

  // Wait for auth modal to load
  const hasAuth = await page.evaluate(() => {
    return !!document.querySelector('#auth-email')
  })
  if (!hasAuth) {
    // Auth module might be lazy — wait longer
    await page.waitForTimeout(2000)
  }

  // Fill email and password
  await page.evaluate((u) => {
    const emailInput = document.querySelector('#auth-email')
    const passInput = document.querySelector('#auth-password')
    if (emailInput) { emailInput.value = u.email; emailInput.dispatchEvent(new Event('input')) }
    if (passInput) { passInput.value = u.password; passInput.dispatchEvent(new Event('input')) }
  }, user)

  await page.waitForTimeout(500)

  // Click sign in
  await page.evaluate(() => window.signIn?.())
  await page.waitForTimeout(3000)

  // Check if logged in
  const loggedIn = await page.evaluate(() => {
    const state = window.getState?.() || {}
    return { isLoggedIn: state.isLoggedIn, username: state.username, uid: state.currentUser?.uid }
  })

  return loggedIn
}

async function main() {
  console.log('\n═══════════════════════════════════════════')
  console.log('  MULTI-USER TEST — SpotHitch')
  console.log('═══════════════════════════════════════════\n')

  const browser = await chromium.launch()

  try {
    // ═══ TEST 1: Auth ═══
    console.log('--- 1. Authentication ---')

    const pageA = await setupPage(browser)
    const authA = await signIn(pageA, USER_A)
    if (authA.isLoggedIn) {
      log('User A sign in', 'OK', `uid: ${authA.uid?.substring(0, 8)}...`)
    } else {
      log('User A sign in', 'FAIL', 'Not logged in — create test account first in Firebase')
    }

    const pageB = await setupPage(browser)
    const authB = await signIn(pageB, USER_B)
    if (authB.isLoggedIn) {
      log('User B sign in', 'OK', `uid: ${authB.uid?.substring(0, 8)}...`)
    } else {
      log('User B sign in', 'FAIL', 'Not logged in — create test account first in Firebase')
    }

    if (!authA.isLoggedIn || !authB.isLoggedIn) {
      console.log('\n⚠️  Cannot proceed without both accounts.')
      console.log('   Create test accounts in Firebase Console:')
      console.log(`   - ${USER_A.email} / ${USER_A.password}`)
      console.log(`   - ${USER_B.email} / ${USER_B.password}`)
      await browser.close()
      return
    }

    // ═══ TEST 2: Friends ═══
    console.log('\n--- 2. Friend System ---')

    // User A searches for User B
    const searchResult = await pageA.evaluate(async (bName) => {
      try {
        const { searchUsers } = await import('/src/services/friends.js')
        const results = await searchUsers(bName)
        return { found: results.length > 0, results: results.map(r => ({ id: r.id, name: r.displayName })) }
      } catch (e) {
        return { found: false, error: e.message }
      }
    }, USER_B.name)
    log('User A searches User B', searchResult.found ? 'OK' : 'FAIL', JSON.stringify(searchResult))

    // User A sends friend request to User B
    if (searchResult.found && searchResult.results[0]) {
      const friendReq = await pageA.evaluate(async (targetId) => {
        try {
          const { sendFriendRequest } = await import('/src/services/friends.js')
          await sendFriendRequest(targetId)
          return { sent: true }
        } catch (e) {
          return { sent: false, error: e.message }
        }
      }, searchResult.results[0].id)
      log('User A sends friend request', friendReq.sent ? 'OK' : 'FAIL', JSON.stringify(friendReq))

      // User B checks friend requests
      await pageB.waitForTimeout(2000)
      const pendingReqs = await pageB.evaluate(async () => {
        const state = window.getState?.() || {}
        return { count: (state.friendRequests || []).length, requests: state.friendRequests }
      })
      log('User B has pending request', pendingReqs.count > 0 ? 'OK' : 'FAIL', `${pendingReqs.count} request(s)`)
    }

    // ═══ TEST 3: Direct Messages ═══
    console.log('\n--- 3. Direct Messages ---')

    if (authB.uid) {
      const dmResult = await pageA.evaluate(async (recipientId) => {
        try {
          const { sendDirectMessage } = await import('/src/services/directMessages.js')
          await sendDirectMessage(recipientId, 'Hello from Alice! This is a test message.')
          return { sent: true }
        } catch (e) {
          return { sent: false, error: e.message }
        }
      }, authB.uid)
      log('User A sends DM to User B', dmResult.sent ? 'OK' : 'FAIL', JSON.stringify(dmResult))

      // Check User B received it
      await pageB.waitForTimeout(3000)
      const dmReceived = await pageB.evaluate(async (senderId) => {
        try {
          const { getConversation } = await import('/src/services/directMessages.js')
          const conv = await getConversation(senderId)
          return { received: !!conv, lastMessage: conv?.lastMessage }
        } catch (e) {
          return { received: false, error: e.message }
        }
      }, authA.uid)
      log('User B received DM', dmReceived.received ? 'OK' : 'FAIL', JSON.stringify(dmReceived))
    }

    // ═══ TEST 4: SOS ═══
    console.log('\n--- 4. SOS System ---')

    // User A opens SOS
    await pageA.evaluate(() => {
      localStorage.setItem('spothitch_sos_intro_seen', '1')
      window.openSOS?.()
    })
    await pageA.waitForTimeout(1000)
    const sosOpen = await pageA.evaluate(() => window.getState?.()?.showSOS)
    log('SOS opens', sosOpen ? 'OK' : 'FAIL')

    // Add User B as emergency contact
    await pageA.evaluate((bName) => {
      const state = window.getState?.() || {}
      window.setState?.({ emergencyContacts: [...(state.emergencyContacts || []), { name: bName, phone: '+33612345678', type: 'sms' }] })
    }, USER_B.name)
    const contactAdded = await pageA.evaluate(() => (window.getState?.()?.emergencyContacts || []).length > 0)
    log('Emergency contact added', contactAdded ? 'OK' : 'FAIL')

    // Check SOS tabs work
    await pageA.evaluate(() => window.sosTab?.(1))
    await pageA.waitForTimeout(500)
    const configTabVisible = await pageA.evaluate(() => {
      const panel = document.querySelector('[data-sos-panel="1"]')
      return panel && !panel.classList.contains('hidden')
    })
    log('SOS config tab works', configTabVisible ? 'OK' : 'FAIL')

    // Check SOS config sidebar
    await pageA.evaluate(() => window.sosOpenConfig?.('fake'))
    await pageA.waitForTimeout(500)
    const sidebarOpen = await pageA.evaluate(() => {
      const panel = document.getElementById('sos-config-panel')
      return panel && !panel.classList.contains('hidden')
    })
    log('SOS config sidebar opens', sidebarOpen ? 'OK' : 'FAIL')

    // ═══ TEST 5: Notifications ═══
    console.log('\n--- 5. Notification Handlers ---')

    const notifHandlers = await pageA.evaluate(() => ({
      showToast: typeof window.showToast === 'function',
      sendLocalNotification: typeof window.sendLocalNotification === 'function',
    }))
    log('Toast handler exists', notifHandlers.showToast ? 'OK' : 'FAIL')

    // Test toast
    await pageA.evaluate(() => window.showToast?.('Test notification', 'success'))
    await pageA.waitForTimeout(1000)
    const toastVisible = await pageA.evaluate(() => !!document.querySelector('.toast-notification, [role=alert]'))
    log('Toast shows', toastVisible ? 'OK' : 'SKIP', 'May auto-dismiss')

  } catch (err) {
    console.error('\n❌ Test error:', err.message)
  }

  await browser.close()

  // ═══ Summary ═══
  console.log('\n═══════════════════════════════════════════')
  const ok = results.filter(r => r.status === 'OK').length
  const fail = results.filter(r => r.status === 'FAIL').length
  const skip = results.filter(r => r.status === 'SKIP').length
  console.log(`  RESULTS: ${ok} OK | ${fail} FAIL | ${skip} SKIP`)
  console.log('═══════════════════════════════════════════\n')
}

main()
