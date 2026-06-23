/**
 * Firebase extra-handler E2E (Brique 2 + 4) — the remaining Firestore-writing handlers run
 * for real against the emulator and the persisted result is verified.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  getCurrentUid,
  cleanupTestData,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase extra handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, uid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = uid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    if (uid && page && !isFallback) await cleanupTestData(page, uid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.setTimeout(90000)
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('voteCommunityTip increments the upvote count in Firestore', async () => {
    // Load the Guides module (real handler), seed a tip, then vote it up.
    await page.evaluate(() => { window.changeTab('voyage'); window.setVoyageSubTab?.('guides') })
    await page.waitForFunction(() => typeof window.voteCommunityTip === 'function', { timeout: 15000 })
    const tipId = await page.evaluate(async () => {
      const { getDb, getAuth, doc, setDoc, serverTimestamp } = window.__fb
      const u = getAuth().currentUser?.uid
      const id = `${u}_FR_general_vote_${Date.now()}`
      await setDoc(doc(getDb(), 'guideTips', id), {
        countryCode: 'FR', category: 'general', text: 'vote target', userId: u,
        status: 'approved', upvotes: 0, downvotes: 0, createdAt: serverTimestamp(),
      })
      return id
    })
    await page.evaluate((id) => window.voteCommunityTip(id, 'up'), tipId)
    await expect.poll(async () => {
      return await page.evaluate(async (id) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', id))
        return snap.exists() ? snap.data().upvotes : null
      }, tipId)
    }, { timeout: 12000 }).toBe(1)
  })

  test('sendBuddyChatMessage writes a message to the buddy thread', async () => {
    await page.evaluate(() => window.changeTab('social'))
    await page.waitForFunction(() => typeof window.sendBuddyChatMessage === 'function', { timeout: 15000 })
    // Create a travel-buddy announcement to chat on.
    const buddyId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'travelBuddies'), {
        userId: getAuth().currentUser?.uid, departure: 'Lyon', destination: 'Nice',
        dateFrom: '2027-01-01', status: 'active', createdAt: serverTimestamp(),
      })
      return ref.id
    })
    const msg = 'buddy-msg-' + Date.now()
    await page.evaluate(({ buddyId, msg }) => {
      window.setState({ isLoggedIn: true, username: 'Alice', user: { uid: window.__fb.getAuth().currentUser?.uid } })
      let el = document.getElementById('buddy-chat-input')
      if (!el) { el = document.createElement('input'); el.id = 'buddy-chat-input'; document.body.appendChild(el) }
      el.value = msg
      window.sendBuddyChatMessage(buddyId)
    }, { buddyId, msg })
    await expect.poll(async () => {
      return await page.evaluate(async ({ buddyId, msg }) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const snap = await getDocs(query(collection(getDb(), 'travelBuddies', buddyId, 'messages'), where('text', '==', msg)))
        return snap.size
      }, { buddyId, msg })
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('journalTogglePublic publishes the trip to publicTrips', async () => {
    const shortId = 'PUB' + Date.now().toString().slice(-5) // 8 chars
    const tripId = 'trip_' + shortId + '_extra'
    // Load the journal module and seed a private trip in localStorage (getTrip reads it).
    await page.evaluate((tripId) => {
      window.changeTab('carnet')
      localStorage.setItem('spothitch_journal_trips', JSON.stringify([
        { id: tripId, title: 'E2E trip', isPublic: false, status: 'active', legs: [{ from: 'A', to: 'B' }],
          startDate: '2026-01-01', endDate: '2026-01-05', dayNotes: {}, dayExpenses: {} },
      ]))
    }, tripId)
    await page.waitForFunction(() => typeof window.journalTogglePublic === 'function', { timeout: 15000 })
    await page.evaluate((tripId) => window.journalTogglePublic(tripId), tripId)
    await expect.poll(async () => {
      return await page.evaluate(async (shortId) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'publicTrips', shortId))
        return snap.exists()
      }, shortId)
    }, { timeout: 12000 }).toBe(true)
  })
})
