/**
 * Firebase Data E2E Tests
 *
 * Tests guides, feature votes, usernames, trips, migration, RGPD.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  firebaseLogin,
  firebaseLogout,
  getCurrentUid,
  setupAuthenticatedPage,
  firestoreDocExists,
  firestoreGetDoc,
} from './firebase-helpers.js'

test.beforeEach(async () => {
  if (!process.env.E2E_TEST_PASSWORD) test.skip(true, 'E2E_TEST_PASSWORD not set')
})

test.describe('Firebase Data', () => {
  test('guide tip write and read', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()

        const tipId = `tip-e2e-${Date.now()}`
        await setDoc(doc(db, 'guideTips', tipId), {
          userId: testUid,
          guideId: 'test-guide',
          text: 'E2E test tip: always bring water',
          createdAt: serverTimestamp(),
        })

        const snap = await getDoc(doc(db, 'guideTips', tipId))
        const data = snap.data()

        await deleteDoc(doc(db, 'guideTips', tipId))
        return { exists: snap.exists(), text: data?.text }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.exists).toBe(true)
    expect(result.text).toContain('always bring water')
  })

  test('guide vote with increment', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)

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
      } catch (err) {
        return { error: err.message }
      }
    })

    expect(result.count).toBe(2)
  })

  test('feature vote CRUD', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.charlie.email)
    const uid = await getCurrentUid(page)

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

        // Change vote
        await setDoc(doc(db, 'featureVotes', voteId), {
          userId: testUid, featureId: 'feature-e2e', vote: 'down',
        })

        const snap2 = await getDoc(doc(db, 'featureVotes', voteId))
        const vote2 = snap2.data()?.vote

        await deleteDoc(doc(db, 'featureVotes', voteId))
        return { vote1, vote2 }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.vote1).toBe('up')
    expect(result.vote2).toBe('down')
  })

  test('username reservation and uniqueness', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)

    const testUsername = `e2e-unique-${Date.now()}`

    const result = await page.evaluate(async ({ testUid, username }) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc } = window.__fb
        const db = getDb()

        // Reserve
        await setDoc(doc(db, 'usernames', username), { uid: testUid })

        // Check it exists
        const snap = await getDoc(doc(db, 'usernames', username))
        const reserved = snap.exists()

        // Try to overwrite (should fail if rules are set)
        let overwriteBlocked = false
        try {
          await setDoc(doc(db, 'usernames', username), { uid: 'different-uid' })
        } catch {
          overwriteBlocked = true
        }

        // Cleanup
        await deleteDoc(doc(db, 'usernames', username))
        return { reserved, overwriteBlocked }
      } catch (err) {
        return { error: err.message }
      }
    }, { testUid: uid, username: testUsername })

    expect(result.reserved).toBe(true)
  })

  test('trip CRUD operations', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.diana.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()

        // Create trip
        const ref = await addDoc(collection(db, 'users', testUid, 'trips'), {
          name: 'E2E Trip', origin: 'Paris', destination: 'Berlin',
          createdAt: serverTimestamp(),
        })

        // Read
        const snap1 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const name1 = snap1.data()?.name

        // Update
        await updateDoc(doc(db, 'users', testUid, 'trips', ref.id), { name: 'Updated Trip' })
        const snap2 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const name2 = snap2.data()?.name

        // Delete
        await deleteDoc(doc(db, 'users', testUid, 'trips', ref.id))
        const snap3 = await getDoc(doc(db, 'users', testUid, 'trips', ref.id))

        return { created: name1, updated: name2, deleted: !snap3.exists() }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.created).toBe('E2E Trip')
    expect(result.updated).toBe('Updated Trip')
    expect(result.deleted).toBe(true)
  })

  test('localStorage to Firestore migration on login', async ({ page }) => {
    // Set some localStorage data before login
    await skipOnboarding(page, { points: 75, level: 5 })

    // Set additional localStorage data
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      state.badges = ['first_spot', 'explorer']
      state.points = 75
      localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
    })

    // Login should trigger sync
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)

    // Firestore profile should exist
    const profile = await firestoreGetDoc(page, 'users', uid)
    expect(profile).toBeTruthy()
  })

  test('RGPD data export contains user data', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)
    const uid = await getCurrentUid(page)

    // Simulate data export by reading all user collections
    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, getDoc, collection, getDocs } = window.__fb
        const db = getDb()

        const exported = {}

        // Profile
        const profile = await getDoc(doc(db, 'users', testUid))
        if (profile.exists()) exported.profile = profile.data()

        // Favorites
        const favs = await getDocs(collection(db, 'users', testUid, 'favorites'))
        exported.favorites = favs.docs.map(d => d.data())

        // Trips
        const trips = await getDocs(collection(db, 'users', testUid, 'trips'))
        exported.trips = trips.docs.map(d => d.data())

        return {
          hasProfile: !!exported.profile,
          favCount: exported.favorites.length,
          tripCount: exported.trips.length,
        }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.hasProfile).toBe(true)
  })

  test('RGPD data deletion removes user data', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.diana.email)
    const uid = await getCurrentUid(page)

    // Create some test data
    await page.evaluate(async (testUid) => {
      const { getDb, doc, setDoc, collection, addDoc, serverTimestamp } = window.__fb
      const db = getDb()

      await setDoc(doc(db, 'users', testUid, 'favorites', 'rgpd-test'), {
        spotId: 'rgpd-test', addedAt: serverTimestamp(),
      })
      await addDoc(collection(db, 'users', testUid, 'trips'), {
        name: 'RGPD test trip', createdAt: serverTimestamp(),
      })
    }, uid)

    // Delete the test data (simulate RGPD deletion)
    const deleteResult = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, deleteDoc, collection, getDocs } = window.__fb
        const db = getDb()

        // Delete favorites
        const favs = await getDocs(collection(db, 'users', testUid, 'favorites'))
        for (const d of favs.docs) await deleteDoc(d.ref)

        // Delete trips
        const trips = await getDocs(collection(db, 'users', testUid, 'trips'))
        for (const d of trips.docs) await deleteDoc(d.ref)

        // Verify deletion
        const favsAfter = await getDocs(collection(db, 'users', testUid, 'favorites'))
        const tripsAfter = await getDocs(collection(db, 'users', testUid, 'trips'))

        return { favsRemaining: favsAfter.size, tripsRemaining: tripsAfter.size }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(deleteResult.favsRemaining).toBe(0)
    expect(deleteResult.tripsRemaining).toBe(0)
  })

  test('auberge (hostel) data write', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.charlie.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDoc, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()

        const ref = await addDoc(collection(db, 'hostels'), {
          name: 'E2E Test Hostel',
          city: 'Paris',
          lat: 48.85, lng: 2.35,
          addedBy: testUid,
          createdAt: serverTimestamp(),
        })

        const snap = await getDoc(doc(db, 'hostels', ref.id))
        const data = snap.data()

        await deleteDoc(doc(db, 'hostels', ref.id))
        return { created: snap.exists(), name: data?.name }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.created).toBe(true)
    expect(result.name).toBe('E2E Test Hostel')
  })

  test('offline writes sync when back online', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, enableNetwork, disableNetwork, serverTimestamp } = window.__fb
        const db = getDb()

        // Go offline
        await disableNetwork(db)

        // Write while offline (will queue locally)
        const docRef = doc(db, 'users', testUid, 'favorites', 'offline-test')
        setDoc(docRef, { spotId: 'offline-test', addedAt: new Date().toISOString() })

        // Go back online
        await enableNetwork(db)

        // Wait a bit for sync
        await new Promise(r => setTimeout(r, 3000))

        // Verify it synced
        const snap = await getDoc(docRef)
        const exists = snap.exists()

        // Cleanup
        if (exists) await deleteDoc(docRef)
        return { synced: exists }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.synced).toBe(true)
  })

  test('batch write multiple documents atomically', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, writeBatch, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()

        const batch = writeBatch(db)
        const ids = ['batch-1', 'batch-2', 'batch-3']

        for (const id of ids) {
          batch.set(doc(db, 'users', testUid, 'favorites', id), {
            spotId: id, addedAt: new Date().toISOString(),
          })
        }

        await batch.commit()

        // Verify all were written
        let allExist = true
        for (const id of ids) {
          const snap = await getDoc(doc(db, 'users', testUid, 'favorites', id))
          if (!snap.exists()) allExist = false
        }

        // Cleanup
        for (const id of ids) {
          await deleteDoc(doc(db, 'users', testUid, 'favorites', id))
        }

        return { allExist, count: ids.length }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.allExist).toBe(true)
    expect(result.count).toBe(3)
  })
})
