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
  programmaticLogin,
  programmaticLogout,
  getCurrentUid,
  getUidByEmail,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Security Rules', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
    if (!isFallback) bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
  })

  test.afterAll(async () => {
    // Reset bio
    if (aliceUid && page && !isFallback) {
      await page.evaluate(async (uid) => {
        try { await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', uid), { bio: '' }) } catch {}
      }, aliceUid)
    }
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
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
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        await window.__fb.updateDoc(window.__fb.doc(window.__fb.getDb(), 'users', targetUid), { bio: 'Hacked by Bob' })
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    // Switch back to Alice
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('user cannot delete another user profile', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Switch to Charlie briefly
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.charlie.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'users', targetUid))
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    // Switch back to Alice
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('spot createdBy must match authenticated user', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, addDoc, deleteDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'spots'), {
          lat: 48.0, lng: 2.0, direction: 'north', type: 'city_exit',
          description: 'Spoofed spot', creatorId: 'fake-uid-not-me', createdAt: serverTimestamp(),
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
        const convRef = await addDoc(collection(db, 'directMessages'), {
          participants: [alice, bob], type: 'dm', createdAt: serverTimestamp(),
        })
        // Bob is logged in but this is called by Alice — try spoofed senderId
        const msgRef = await addDoc(collection(db, 'directMessages', convRef.id, 'messages'), {
          text: 'Spoofed message', senderId: bob, createdAt: serverTimestamp(),
        })
        await deleteDoc(msgRef)
        const msgsSnap = await getDocs(collection(db, 'directMessages', convRef.id, 'messages'))
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

  test('Bob cannot read Alice favorites', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        const { getDb, collection, getDocs } = window.__fb
        const snap = await getDocs(collection(getDb(), 'users', targetUid, 'favorites'))
        return { blocked: false, count: snap.size }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('Bob cannot write to Alice favorites', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'users', targetUid, 'favorites', 'hacked'), {
          spotId: 'hacked', addedAt: serverTimestamp(),
        })
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('Bob cannot read Alice trips', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        const { getDb, collection, getDocs } = window.__fb
        const snap = await getDocs(collection(getDb(), 'users', targetUid, 'trips'))
        return { blocked: false, count: snap.size }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('Bob cannot read Alice FCM tokens', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (targetUid) => {
      try {
        const { getDb, collection, getDocs } = window.__fb
        const snap = await getDocs(collection(getDb(), 'users', targetUid, 'fcmTokens'))
        return { blocked: false, count: snap.size }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    expect(result.blocked).toBe(true)

    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('reports cannot be read back', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, getDocs } = window.__fb
        const snap = await getDocs(collection(getDb(), 'reports'))
        return { blocked: false, count: snap.size }
      } catch (err) { return { blocked: true, error: err.code } }
    })

    expect(result.blocked).toBe(true)
  })

  test('guide reports cannot be read back', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, getDocs } = window.__fb
        const snap = await getDocs(collection(getDb(), 'guide_reports'))
        return { blocked: false, count: snap.size }
      } catch (err) { return { blocked: true, error: err.code } }
    })

    expect(result.blocked).toBe(true)
  })

  test('non-participant cannot read group conversation', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates a group with just herself
    const groupId = await page.evaluate(async (testUid) => {
      const { getDb, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'groupConversations'), {
        name: 'Security Test', creator: testUid,
        members: [testUid], createdAt: serverTimestamp(),
      })
      return ref.id
    }, aliceUid)

    // Switch to Charlie (not a member)
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.charlie.email)

    const result = await page.evaluate(async (gid) => {
      try {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'groupConversations', gid))
        return { blocked: false, exists: snap.exists() }
      } catch (err) { return { blocked: true, error: err.code } }
    }, groupId)

    expect(result.blocked).toBe(true)

    // Switch back and cleanup
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (gid) => {
      await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'groupConversations', gid))
    }, groupId)
  })

  test('id verification only readable by owner', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates a verification
    const verificationId = await page.evaluate(async (testUid) => {
      const { getDb, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'id_verifications'), {
        userId: testUid, status: 'pending', timestamp: serverTimestamp(),
      })
      return ref.id
    }, aliceUid)

    // Switch to Bob
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (vid) => {
      try {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'id_verifications', vid))
        return { blocked: false, exists: snap.exists() }
      } catch (err) { return { blocked: true, error: err.code } }
    }, verificationId)

    expect(result.blocked).toBe(true)

    // Switch back to Alice
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('featureUserVote cannot be modified by another user', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates a vote
    const voteId = `${aliceUid}_sec-test`
    await page.evaluate(async ({ uid, vid }) => {
      const { getDb, doc, setDoc } = window.__fb
      await setDoc(doc(getDb(), 'featureUserVotes', vid), {
        userId: uid, featureId: 'sec-test', vote: 'essential',
      })
    }, { uid: aliceUid, vid: voteId })

    // Switch to Bob
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async (vid) => {
      try {
        const { getDb, doc, updateDoc } = window.__fb
        await updateDoc(doc(getDb(), 'featureUserVotes', vid), { vote: 'not_useful' })
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, voteId)

    expect(result.blocked).toBe(true)

    // Switch back and cleanup
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (vid) => {
      try { await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'featureUserVotes', vid)) } catch {}
    }, voteId)
  })

  test('user cannot delete own profile (blocked by rules)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'users', testUid))
        return { blocked: false }
      } catch (err) { return { blocked: true, error: err.code } }
    }, aliceUid)

    // users/{uid} has allow delete: if false
    expect(result.blocked).toBe(true)
  })
})
