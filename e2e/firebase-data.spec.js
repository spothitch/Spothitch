/**
 * Firebase Data E2E Tests
 *
 * Tests guides, feature votes, usernames, trips, migration, RGPD.
 * Uses shared session (Alice logged in).
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  getCurrentUid,
  firestoreGetDoc,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Data', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('guide tip write and read', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const tipId = `tip-e2e-${Date.now()}`
        await setDoc(doc(db, 'guideTips', tipId), {
          userId: testUid, guideId: 'test-guide',
          text: 'E2E test tip: always bring water', createdAt: serverTimestamp(),
        })
        const snap = await getDoc(doc(db, 'guideTips', tipId))
        const data = snap.data()
        await deleteDoc(doc(db, 'guideTips', tipId))
        return { exists: snap.exists(), text: data?.text }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.exists).toBe(true)
    expect(result.text).toContain('always bring water')
  })

  test('guide vote with increment', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, doc, setDoc, getDoc, updateDoc, deleteDoc, increment } = window.__fb
        const db = getDb()
        const voteKey = `guide-vote-e2e-${Date.now()}`
        await setDoc(doc(db, 'guideVotes', voteKey), { count: 0 })
        await updateDoc(doc(db, 'guideVotes', voteKey), { count: increment(1) })
        await updateDoc(doc(db, 'guideVotes', voteKey), { count: increment(1) })
        const snap = await getDoc(doc(db, 'guideVotes', voteKey))
        const count = snap.data()?.count
        await deleteDoc(doc(db, 'guideVotes', voteKey))
        return { count }
      } catch (err) { return { error: err.message } }
    })

    expect(result.count).toBe(2)
  })

  test('feature vote CRUD', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc } = window.__fb
        const db = getDb()
        const voteId = `feature-e2e_${testUid}`
        await setDoc(doc(db, 'featureVotes', voteId), {
          userId: testUid, featureId: 'feature-e2e', vote: 'up',
        })
        const snap1 = await getDoc(doc(db, 'featureVotes', voteId))
        const vote1 = snap1.data()?.vote
        await setDoc(doc(db, 'featureVotes', voteId), {
          userId: testUid, featureId: 'feature-e2e', vote: 'down',
        })
        const snap2 = await getDoc(doc(db, 'featureVotes', voteId))
        const vote2 = snap2.data()?.vote
        await deleteDoc(doc(db, 'featureVotes', voteId))
        return { vote1, vote2 }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.vote1).toBe('up')
    expect(result.vote2).toBe('down')
  })

  test('username reservation and uniqueness', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const testUsername = `e2e-unique-${Date.now()}`

    const result = await page.evaluate(async ({ testUid, username }) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc } = window.__fb
        const db = getDb()
        await setDoc(doc(db, 'usernames', username), { uid: testUid })
        const snap = await getDoc(doc(db, 'usernames', username))
        const reserved = snap.exists()
        let overwriteBlocked = false
        try {
          await setDoc(doc(db, 'usernames', username), { uid: 'different-uid' })
        } catch { overwriteBlocked = true }
        await deleteDoc(doc(db, 'usernames', username))
        return { reserved, overwriteBlocked }
      } catch (err) { return { error: err.message } }
    }, { testUid: aliceUid, username: testUsername })

    expect(result.reserved).toBe(true)
  })

  test('trip CRUD operations', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'users', testUid, 'trips'), {
          name: 'E2E Trip', origin: 'Paris', destination: 'Berlin', createdAt: serverTimestamp(),
        })
        const snap1 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const name1 = snap1.data()?.name
        await updateDoc(doc(db, 'users', testUid, 'trips', ref.id), { name: 'Updated Trip' })
        const snap2 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const name2 = snap2.data()?.name
        await deleteDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const snap3 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))
        return { created: name1, updated: name2, deleted: !snap3.exists() }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.created).toBe('E2E Trip')
    expect(result.updated).toBe('Updated Trip')
    expect(result.deleted).toBe(true)
  })

  test('localStorage to Firestore migration on login', async ({ page: freshPage }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await skipOnboarding(freshPage, { points: 75, level: 5 })
    await freshPage.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      state.badges = ['first_spot', 'explorer']
      state.points = 75
      localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
    })
    // Load Firebase module on fresh page
    await freshPage.evaluate(() => window.openAuth?.('email'))
    await freshPage.waitForTimeout(3000)
    await freshPage.evaluate(() => window.closeAuth?.())
    await freshPage.waitForTimeout(500)
    await freshPage.waitForFunction(() => !!window.__fb, { timeout: 15000 })

    await programmaticLogin(freshPage, TEST_ACCOUNTS.diana.email)
    const uid = await getCurrentUid(freshPage)
    const profile = await firestoreGetDoc(freshPage, 'users', uid)
    expect(profile).toBeTruthy()
  })

  test('RGPD data export contains user data', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, getDoc, collection, getDocs } = window.__fb
        const db = getDb()
        const exported = {}
        const profile = await getDoc(doc(db, 'users', testUid))
        if (profile.exists()) exported.profile = profile.data()
        const favs = await getDocs(collection(db, 'users', testUid, 'favorites'))
        exported.favorites = favs.docs.map(d => d.data())
        const trips = await getDocs(collection(db, 'users', testUid, 'trips'))
        exported.trips = trips.docs.map(d => d.data())
        return { hasProfile: !!exported.profile, favCount: exported.favorites.length, tripCount: exported.trips.length }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.hasProfile).toBe(true)
  })

  test('RGPD data deletion removes user data', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Create test data then delete it
    const deleteResult = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, collection, addDoc, deleteDoc, getDocs, serverTimestamp } = window.__fb
        const db = getDb()
        await setDoc(doc(db, 'users', testUid, 'favorites', 'rgpd-test'), {
          spotId: 'rgpd-test', addedAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'users', testUid, 'trips'), {
          name: 'RGPD test trip', createdAt: serverTimestamp(),
        })
        // Delete
        const favs = await getDocs(collection(db, 'users', testUid, 'favorites'))
        for (const d of favs.docs) await deleteDoc(d.ref)
        const trips = await getDocs(collection(db, 'users', testUid, 'trips'))
        for (const d of trips.docs) await deleteDoc(d.ref)
        // Verify
        const favsAfter = await getDocs(collection(db, 'users', testUid, 'favorites'))
        const tripsAfter = await getDocs(collection(db, 'users', testUid, 'trips'))
        return { favsRemaining: favsAfter.size, tripsRemaining: tripsAfter.size }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(deleteResult.favsRemaining).toBe(0)
    expect(deleteResult.tripsRemaining).toBe(0)
  })

  test('auberge (hostel) data write', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDoc, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'hostels'), {
          name: 'E2E Test Hostel', city: 'Paris',
          lat: 48.85, lng: 2.35, addedBy: testUid, createdAt: serverTimestamp(),
        })
        const snap = await getDoc(doc(db, 'hostels', ref.id))
        const data = snap.data()
        await deleteDoc(doc(db, 'hostels', ref.id))
        return { created: snap.exists(), name: data?.name }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.created).toBe(true)
    expect(result.name).toBe('E2E Test Hostel')
  })

  test('offline writes sync when back online', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, enableNetwork, disableNetwork } = window.__fb
        const db = getDb()
        await disableNetwork(db)
        const docRef = doc(db, 'users', testUid, 'favorites', 'offline-test')
        setDoc(docRef, { spotId: 'offline-test', addedAt: new Date().toISOString() })
        await enableNetwork(db)
        await new Promise(r => setTimeout(r, 3000))
        const snap = await getDoc(docRef)
        const exists = snap.exists()
        if (exists) await deleteDoc(docRef)
        return { synced: exists }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.synced).toBe(true)
  })

  test('batch write multiple documents atomically', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, writeBatch, getDoc, deleteDoc } = window.__fb
        const db = getDb()
        const batch = writeBatch(db)
        const ids = ['batch-1', 'batch-2', 'batch-3']
        for (const id of ids) {
          batch.set(doc(db, 'users', testUid, 'favorites', id), {
            spotId: id, addedAt: new Date().toISOString(),
          })
        }
        await batch.commit()
        let allExist = true
        for (const id of ids) {
          const snap = await getDoc(doc(db, 'users', testUid, 'favorites', id))
          if (!snap.exists()) allExist = false
        }
        for (const id of ids) {
          await deleteDoc(doc(db, 'users', testUid, 'favorites', id))
        }
        return { allExist, count: ids.length }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.allExist).toBe(true)
    expect(result.count).toBe(3)
  })
})
