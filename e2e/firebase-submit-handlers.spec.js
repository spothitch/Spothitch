/**
 * Firebase submit-handler E2E (Brique 2 + 4) — the REAL window.submit* handlers run
 * end to end against the emulator, and we assert the data actually landed in Firestore.
 * This is stronger than the data-layer specs: it exercises the handler's own validation,
 * write path and state effects exactly as a user click would.
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

test.describe('Firebase submit handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    if (aliceUid && page && !isFallback) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('submitReview writes a validation/review doc to Firestore (Bob reviews Alice spot)', async () => {
    // 1. Alice creates a spot.
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const db = getDb()
      const uid = getAuth().currentUser?.uid
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 48.8566, lng: 2.3522, direction: 'north', type: 'city_exit',
        description: 'submitReview target spot', creatorId: uid, createdAt: serverTimestamp(),
        rating: { safety: 4, traffic: 3, accessibility: 4 },
      })
      return ref.id
    })
    expect(spotId).toBeTruthy()
    const aliceUidNow = await getCurrentUid(page)

    // 2. Switch to Bob (a different user — no self-review).
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    expect(bobUid).toBeTruthy()
    expect(bobUid).not.toBe(aliceUidNow)

    // 3. Set up the exact state submitReview reads, then run the REAL handler.
    const ran = await page.evaluate(async ({ spotId, aliceUid, bobUid }) => {
      window.setState({
        username: 'BobReviewer',
        selectedSpot: { id: spotId, creatorId: aliceUid },
        user: { uid: bobUid },
        currentRating: 4,
      })
      // No comment element → review with rating only (allowed).
      try { localStorage.removeItem(`spothitch_review_${spotId}_${bobUid}`) } catch { /* ignore */ }
      await window.submitReview(spotId)
      return true
    }, { spotId, aliceUid: aliceUidNow, bobUid })
    expect(ran).toBe(true)

    // 4. The handler must have written a validation doc authored by Bob.
    await expect.poll(async () => {
      return await page.evaluate(async ({ spotId, bobUid }) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const db = getDb()
        const snap = await getDocs(query(collection(db, 'spots', spotId, 'validations'), where('userId', '==', bobUid)))
        return snap.size
      }, { spotId, bobUid })
    }, { timeout: 10000 }).toBeGreaterThan(0)

    // 5. And the handler cleared the rating state on success.
    expect(await page.evaluate(() => window.getState().currentRating)).toBe(0)
  })

  test('submitPastTrip saves a trip to Firestore (users/{uid}/trips)', async () => {
    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()

    // Load the real submitPastTrip handler (profileRender module) by visiting the profile.
    await page.evaluate(() => { window.changeTab('profile'); window.setState({ showAddPastTrip: true }) })
    await page.waitForFunction(() => typeof window.submitPastTrip === 'function', { timeout: 15000 })

    // The handler reads the form fields via getElementById — provide them, fill, run it.
    const marker = 'E2E-' + Date.now()
    await page.evaluate(({ marker, uid }) => {
      window.setState({ currentUser: { uid }, username: 'AliceTraveller' })
      const mk = (id, val) => {
        let el = document.getElementById(id)
        if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) }
        el.value = val
      }
      mk('past-trip-from', marker + '-From')
      mk('past-trip-to', marker + '-To')
      mk('past-trip-date', '2026-01-01')
      mk('past-trip-km', '120')
      mk('past-trip-lifts', '3')
      mk('past-trip-note', 'e2e trip')
      window.submitPastTrip()
    }, { marker, uid })

    // The handler imports firebase.saveTrip(uid, trip) → users/{uid}/trips/{id}.
    await expect.poll(async () => {
      return await page.evaluate(async ({ uid, marker }) => {
        const { getDb, collection, getDocs } = window.__fb
        const db = getDb()
        const snap = await getDocs(collection(db, 'users', uid, 'trips'))
        let found = 0
        snap.forEach((d) => { const t = d.data(); if ((t.from || '').includes(marker)) found++ })
        return found
      }, { uid, marker })
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('submitCommunityTip writes a guideTip to Firestore (guideTips/{uid}_{cc}_general)', async () => {
    const uid = await getCurrentUid(page)
    const text = 'E2E community tip ' + Date.now()
    await page.evaluate((text) => {
      window.setState({ username: 'TipAuthor' })
      let el = document.getElementById('community-tip-input')
      if (!el) { el = document.createElement('input'); el.id = 'community-tip-input'; document.body.appendChild(el) }
      el.value = text
      window.submitCommunityTip('FR')
    }, text)

    await expect.poll(async () => {
      return await page.evaluate(async (uid) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', `${uid}_FR_general`))
        return snap.exists()
      }, uid)
    }, { timeout: 12000 }).toBe(true)
  })

  test('submitCurrentReport writes a report to Firestore (reports collection)', async () => {
    const marker = 'spot-' + Date.now()
    // selectReportReason loads the moderation module (real handlers) and sets the reason.
    await page.evaluate(() => window.selectReportReason('spam'))
    await page.waitForFunction(() => window.getState().selectedReportReason === 'spam', { timeout: 8000 })
    await page.evaluate((marker) => {
      window.setState({ reportType: 'spot', reportTargetId: marker, username: 'Reporter' })
      let el = document.getElementById('report-details')
      if (!el) { el = document.createElement('textarea'); el.id = 'report-details'; document.body.appendChild(el) }
      el.value = 'e2e report details'
      window.submitCurrentReport()
    }, marker)

    // The reports collection is admin-read-only (firestore.rules), so verify as the admin.
    await page.waitForTimeout(1500)
    await programmaticLogin(page, TEST_ACCOUNTS.admin.email)
    await expect.poll(async () => {
      return await page.evaluate(async (marker) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const snap = await getDocs(query(collection(getDb(), 'reports'), where('targetId', '==', marker)))
        return snap.size
      }, marker)
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('submitBuddyAnnouncement writes a travelBuddy to Firestore', async () => {
    const uid = await getCurrentUid(page)
    const marker = 'Dep-' + Date.now()
    // Load the real handler (lazy with Voyageurs.js) by visiting the social/buddies view.
    await page.evaluate(() => { window.changeTab('social'); window.showBuddyCreate?.() })
    await page.waitForFunction(() => typeof window.submitBuddyAnnouncement === 'function' &&
      window.submitBuddyAnnouncement.toString().includes('buddy-departure'), { timeout: 15000 })

    await page.evaluate(({ marker }) => {
      window.setState({ isLoggedIn: true, username: 'BuddySeeker' })
      const mk = (id, val) => {
        let el = document.getElementById(id)
        if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) }
        el.value = val
      }
      const future = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      mk('buddy-departure', marker)
      mk('buddy-destination', 'Berlin')
      mk('buddy-date-from', future)
      mk('buddy-description', 'e2e buddy announcement')
      window.submitBuddyAnnouncement()
    }, { marker })

    await expect.poll(async () => {
      return await page.evaluate(async ({ uid, marker }) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const snap = await getDocs(query(collection(getDb(), 'travelBuddies'), where('userId', '==', uid)))
        let found = 0
        snap.forEach((d) => { if ((d.data().departure || '') === marker) found++ })
        return found
      }, { uid, marker })
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('toggleFavorite persists a favorite to Firestore (users/{uid}/favorites)', async () => {
    const uid = await getCurrentUid(page)
    const spotId = 'fav-spot-' + Date.now()
    // A fresh spotId is not yet favourited, so the real toggle adds it (writes Firestore).
    await page.evaluate(async (spotId) => { await window.toggleFavorite(spotId) }, spotId)
    await expect.poll(async () => {
      return await page.evaluate(async ({ uid, spotId }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', uid, 'favorites', spotId))
        return snap.exists()
      }, { uid, spotId })
    }, { timeout: 12000 }).toBe(true)
  })

  test('submitIntroVote persists a feature vote to Firestore (featureUserVotes)', async () => {
    const uid = await getCurrentUid(page)
    const featureId = 'feat-' + Date.now()
    // Load the FeatureIntro module so the real handler exists, then provide the overlay
    // node it reads the selected vote from, and run it.
    await page.evaluate((fid) => { window.showFeatureIntro?.(fid); window.setState({ showFeatureIntro: true }) }, featureId)
    await page.waitForFunction(() => typeof window.submitIntroVote === 'function', { timeout: 15000 })
    await page.evaluate(({ fid }) => {
      let ov = document.getElementById('feature-intro-overlay')
      if (!ov) { ov = document.createElement('div'); ov.id = 'feature-intro-overlay'; document.body.appendChild(ov) }
      ov.dataset.selectedVote = 'up'
      window.submitIntroVote(fid)
    }, { fid: featureId })

    await expect.poll(async () => {
      return await page.evaluate(async ({ uid, fid }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'featureUserVotes', `${uid}_${fid}`))
        return snap.exists()
      }, { uid, fid: featureId })
    }, { timeout: 12000 }).toBe(true)
  })

  test('doCheckin writes a validation to the spot (spots/{id}/validations)', async () => {
    const uid = await getCurrentUid(page)
    // Create a spot to check in on.
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'spots'), {
        lat: 47.2, lng: 5.0, direction: 'south', type: 'city_exit', description: 'checkin target',
        creatorId: getAuth().currentUser?.uid, createdAt: serverTimestamp(), rating: { safety: 4, traffic: 3, accessibility: 4 },
      })
      return ref.id
    })
    await page.evaluate(async ({ spotId, uid }) => {
      window.setState({ username: 'CheckinUser', user: { uid } })
      await window.doCheckin(spotId)
    }, { spotId, uid })

    await expect.poll(async () => {
      return await page.evaluate(async ({ spotId, uid }) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const snap = await getDocs(query(collection(getDb(), 'spots', spotId, 'validations'), where('userId', '==', uid)))
        return snap.size
      }, { spotId, uid })
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('sosBroadcastCommunity writes a community SOS alert to Firestore', async () => {
    const uid = await getCurrentUid(page)
    // Open the SOS modal so the real handler (lazy with SOS.js) is installed.
    await page.evaluate(() => { window.openSOS?.(); window.setState({ showSOS: true }) })
    await page.waitForFunction(() => typeof window.sosBroadcastCommunity === 'function', { timeout: 15000 })
    await page.evaluate(({ uid }) => {
      window.setState({ username: 'SOSUser', user: { uid }, isLoggedIn: true })
      // Mock geolocation so _getSOSPosition resolves a real position headlessly.
      navigator.geolocation.getCurrentPosition = (ok) => ok({ coords: { latitude: 48.0, longitude: 2.0, accuracy: 10 } })
      window.sosBroadcastCommunity()
    }, { uid })

    await expect.poll(async () => {
      return await page.evaluate(async (uid) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const snap = await getDocs(query(collection(getDb(), 'communityAlerts'), where('userId', '==', uid)))
        return snap.size
      }, uid)
    }, { timeout: 12000 }).toBeGreaterThan(0)
  })

  test('submitGuideContribution writes a guideTip to Firestore (guideTips/{uid}_{cc}_{cat})', async () => {
    const uid = await getCurrentUid(page)
    // Load the Guides view so the real handler (lazy with Guides.js) is installed.
    await page.evaluate(() => window.showGuides?.())
    await page.waitForFunction(() => typeof window.submitGuideContribution === 'function', { timeout: 15000 })
    await page.evaluate(() => {
      window.requireOnline = () => true
      window.setState({ selectedCountryGuide: 'FR', guideOpenCategory: 'safety', username: 'GuideAuthor' })
      window._guideFormRating = 5
      window._guideFormType = 'c'
      let el = document.getElementById('guide-contrib-text')
      if (!el) { el = document.createElement('textarea'); el.id = 'guide-contrib-text'; document.body.appendChild(el) }
      el.value = 'E2E guide contribution ' + Date.now()
      window.submitGuideContribution()
    })
    await expect.poll(async () => {
      return await page.evaluate(async (uid) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', `${uid}_FR_safety`))
        return snap.exists()
      }, uid)
    }, { timeout: 12000 }).toBe(true)
  })

  test('submitCustomCategory writes a custom guideTip to Firestore', async () => {
    const uid = await getCurrentUid(page)
    await page.evaluate(() => window.showGuides?.())
    await page.waitForFunction(() => typeof window.submitCustomCategory === 'function', { timeout: 15000 })
    const catName = 'e2ecat'
    await page.evaluate(({ catName }) => {
      window.requireOnline = () => true
      window.setState({ selectedCountryGuide: 'DE', username: 'CustomCatAuthor' })
      window._guideFormRating = 4
      const mk = (id, val, tag = 'input') => {
        let el = document.getElementById(id)
        if (!el) { el = document.createElement(tag); el.id = id; document.body.appendChild(el) }
        el.value = val
      }
      mk('guide-custom-name', catName)
      mk('guide-custom-text', 'E2E custom category tip', 'textarea')
      window.submitCustomCategory()
    }, { catName })
    await expect.poll(async () => {
      return await page.evaluate(async ({ uid, catName }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', `${uid}_DE_custom_${catName}`))
        return snap.exists()
      }, { uid, catName })
    }, { timeout: 12000 }).toBe(true)
  })

  test('deleteGuideContribution removes a guideTip from Firestore', async () => {
    const uid = await getCurrentUid(page)
    await page.evaluate(() => window.showGuides?.())
    await page.waitForFunction(() => typeof window.deleteGuideContribution === 'function', { timeout: 15000 })
    const docId = `${uid}_FR_deltest`
    // Create the tip directly, then delete it via the real handler.
    await page.evaluate(async ({ uid, docId }) => {
      const { getDb, doc, setDoc, serverTimestamp } = window.__fb
      await setDoc(doc(getDb(), 'guideTips', docId), {
        id: docId, userId: uid, countryCode: 'FR', category: 'deltest',
        text: 'to delete', rating: 3, createdAt: serverTimestamp(),
      })
      await window.deleteGuideContribution(docId)
    }, { uid, docId })
    await expect.poll(async () => {
      return await page.evaluate(async (docId) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', docId))
        return snap.exists()
      }, docId)
    }, { timeout: 12000 }).toBe(false)
  })

  // NOTE: identity Storage-upload handlers (submitPhotoVerification / submitIdentityDocument /
  // submitSelfieIdVerification / submitVerificationPhotos) are NOT covered here — Firebase Storage
  // uploads don't complete from the browser in the isolated CI build (same limitation that gates
  // the browser Firestore fallback), so uploadImage() fails and the observable state never sets.
})
