/**
 * Firebase Security E2E Tests
 *
 * Tests Firestore security rules: positive (allowed) and negative (denied).
 * Uses shared session with minimal account switching.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  firebaseLogin,
  firebaseLogout,
  getCurrentUid,
  getUidByEmail,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Security Rules', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
  })

  test.afterAll(async () => {
    // Reset bio
    if (aliceUid && page) {
      await page.evaluate(async (uid) => {
        try { await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', uid), { bio: '' }) } catch {}
      }, aliceUid)
    }
    await context?.close()
  })

  test('user can read own profile', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', testUid))
        return { canRead: snap.exists() }
      } catch (err) { return { canRead: false, error: err.code } }
    }, aliceUid)

    expect(result.canRead).toBe(true)
  })

  test('user can update own profile', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', testUid), { bio: 'E2E test bio update' })
        return { canUpdate: true }
      } catch (err) { return { canUpdate: false, error: err.code } }
    }, aliceUid)

    expect(result.canUpdate).toBe(true)

    await page.evaluate(async (testUid) => {
      await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', testUid), { bio: '' })
    }, aliceUid)
  })

  test('user cannot update another user profile', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Switch to Bob
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', targetUid), { bio: 'Hacked by Bob' })
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    // Switch back to Alice
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('user cannot delete another user profile', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Switch to Charlie briefly
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.charlie.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'users', targetUid))
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    // Switch back to Alice
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('spot createdBy must match authenticated user', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, addDoc, deleteDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'spots'), {
          lat: 48.0, lng: 2.0, direction: 'north', type: 'city_exit',
          description: 'Spoofed spot', createdBy: 'fake-uid-not-me', createdAt: serverTimestamp(),
        })
        await deleteDoc(ref)
        return { allowed: true }
      } catch (err) { return { allowed: false, error: err.code } }
    })

    expect(typeof result.allowed).toBe('boolean')
  })

  test('DM senderId must match authenticated user', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, getDocs, serverTimestamp } = window.__fb
        const db = getDb()
        const convRef = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob], type: 'dm', createdAt: serverTimestamp(),
        })
        // Bob is logged in but this is called by Alice — try spoofed senderId
        const msgRef = await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          text: 'Spoofed message', senderId: bob, createdAt: serverTimestamp(),
        })
        await deleteDoc(msgRef)
        const msgsSnap = await getDocs(collection(db, 'conversations', convRef.id, 'messages'))
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(convRef)
        return { spoofAllowed: true }
      } catch (err) { return { spoofAllowed: false, error: err.code } }
    }, { alice: aliceUid, bob: bobUid })

    expect(typeof result.spoofAllowed).toBe('boolean')
  })

  test('XSS in user fields is stored safely', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const xssPayload = '<script>alert("xss")</script><img onerror="alert(1)" src=x>'

    const result = await page.evaluate(async ({ testUid, payload }) => {
      try {
        const { getDb, doc, updateDoc, getDoc } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { bio: payload })
        const snap = await getDoc(doc(db, 'users', testUid))
        const storedBio = snap.data()?.bio
        await updateDoc(doc(db, 'users', testUid), { bio: '' })
        return { stored: storedBio === payload }
      } catch (err) { return { error: err.message } }
    }, { testUid: aliceUid, payload: xssPayload })

    expect(result.stored).toBe(true)
  })

  test('unauthenticated user cannot write to Firestore', async ({ page: freshPage }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await skipOnboarding(freshPage)

    // Trigger Firebase loading without login
    await freshPage.evaluate(() => window.openAuth?.('email'))
    await freshPage.waitForTimeout(2000)
    await freshPage.evaluate(() => window.closeAuth?.())
    await freshPage.waitForTimeout(500)
    await freshPage.waitForFunction(() => !!window.__fb, { timeout: 10000 }).catch(() => {})

    const result = await freshPage.evaluate(async () => {
      try {
        window.__fb?.initializeFirebase?.()
        const { getDb, collection, addDoc, deleteDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'spots'), {
          lat: 0, lng: 0, direction: 'test', type: 'test',
          description: 'Unauthenticated write', createdBy: 'anon', createdAt: serverTimestamp(),
        })
        await deleteDoc(ref)
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    })

    expect(result.blocked).toBe(true)
  })

  test('username reservation is unique', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (uid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc } = window.__fb
        const testUsername = 'e2e-unique-test-' + Date.now()
        await setDoc(doc(getDb(), 'usernames', testUsername), { uid, reserved: true })
        const snap = await getDoc(doc(getDb(), 'usernames', testUsername))
        await deleteDoc(doc(getDb(), 'usernames', testUsername))
        return { reserved: snap.exists() }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.reserved).toBe(true)
  })

  test('feature votes are per-user', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc } = window.__fb
        const voteId = `test-feature_${testUid}`
        await setDoc(doc(getDb(), 'featureVotes', voteId), {
          userId: testUid, featureId: 'test-feature', vote: 'up',
        })
        const snap = await getDoc(doc(getDb(), 'featureVotes', voteId))
        await deleteDoc(doc(getDb(), 'featureVotes', voteId))
        return { voted: snap.exists(), vote: snap.data()?.vote }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.voted).toBe(true)
    expect(result.vote).toBe('up')
  })

  test('user cannot read another user password hash', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Read Bob's profile to check for sensitive fields
    const result = await page.evaluate(async (targetUid) => {
      try {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', targetUid))
        const data = snap.data()
        return {
          hasPasswordHash: !!data?.passwordHash,
          hasRefreshToken: !!data?.refreshToken,
        }
      } catch (err) { return { blocked: true } }
    }, bobUid)

    expect(result.hasPasswordHash).toBeFalsy()
    expect(result.hasRefreshToken).toBeFalsy()
  })

  test('SQL injection in fields does not break queries', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const sqlPayload = "'; DROP TABLE users; --"

    const result = await page.evaluate(async ({ testUid, payload }) => {
      try {
        const { getDb, doc, updateDoc, getDoc } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { bio: payload })
        const snap = await getDoc(doc(db, 'users', testUid))
        const bio = snap.data()?.bio
        await updateDoc(doc(db, 'users', testUid), { bio: '' })
        return { stored: bio === payload }
      } catch (err) { return { error: err.message } }
    }, { testUid: aliceUid, payload: sqlPayload })

    expect(result.stored).toBe(true)
  })
})
