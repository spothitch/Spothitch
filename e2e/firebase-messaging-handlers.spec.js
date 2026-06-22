/**
 * Firebase messaging-handler E2E (Brique 2 + 3 + 4). Runs the real window.sendDM handler:
 * Alice sends a direct message to Bob, the message lands in Firestore, AND Bob (a different
 * user) can read it — proving cross-user visibility, not just a local write.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  getCurrentUid,
  getUidByEmail,
  cleanupTestData,
  initFirebasePage,
} from './firebase-helpers.js'

const convIdOf = (a, b) => [a, b].sort().join('_dm_')

test.describe('Firebase messaging handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
    if (!isFallback) bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
  })

  test.afterAll(async () => {
    if (aliceUid && page && !isFallback) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('sendDM delivers a message Bob can read (cross-user)', async () => {
    expect(bobUid).toBeTruthy()
    const text = 'Hello Bob from Alice ' + Date.now()
    const convId = convIdOf(aliceUid, bobUid)

    // Alice runs the real sendDM handler (reads #dm-input → sendDirectMessage).
    await page.evaluate(({ text, bobUid, aliceUid }) => {
      // sendDirectMessage reads state.user.uid — without it it falls back to localStorage.
      window.setState({ username: 'Alice', isLoggedIn: true, user: { uid: aliceUid } })
      let el = document.getElementById('dm-input')
      if (!el) { el = document.createElement('input'); el.id = 'dm-input'; document.body.appendChild(el) }
      el.value = text
      window.sendDM(bobUid)
    }, { text, bobUid, aliceUid })

    // The conversation parent doc must be created (the messages read rule reads its
    // participants). Wait for it, then assert the message is there.
    await expect.poll(async () => {
      return await page.evaluate(async ({ convId }) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'directMessages', convId))
          return snap.exists()
        } catch { return false }
      }, { convId })
    }, { timeout: 12000 }).toBe(true)

    const msgCount = await page.evaluate(async ({ convId, text }) => {
      const { getDb, collection, getDocs, query, where } = window.__fb
      const snap = await getDocs(query(collection(getDb(), 'directMessages', convId, 'messages'), where('text', '==', text)))
      return snap.size
    }, { convId, text })
    expect(msgCount).toBeGreaterThan(0)

    // Now Bob logs in and must be able to READ Alice's message (cross-user visibility).
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)
    expect(await getCurrentUid(page)).toBe(bobUid)
    const bobSees = await page.evaluate(async ({ convId, text }) => {
      const { getDb, collection, getDocs, query, where } = window.__fb
      const snap = await getDocs(query(collection(getDb(), 'directMessages', convId, 'messages'), where('text', '==', text)))
      let found = 0
      snap.forEach((d) => { if (d.data().text === text) found++ })
      return found
    }, { convId, text })
    expect(bobSees).toBeGreaterThan(0)
  })
})
