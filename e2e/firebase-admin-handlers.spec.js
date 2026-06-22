/**
 * Firebase admin-moderation handler E2E (Brique 2 + 4). Logs in as the admin account,
 * seeds the docs a moderator would act on, runs the REAL admin handlers and asserts the
 * moderation result is persisted in Firestore.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  getCurrentUid,
  cleanupTestData,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase admin handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, adminUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: adminUid } = await initFirebasePage(browser, TEST_ACCOUNTS.admin.email))
    isFallback = adminUid?.startsWith('ci-ci-') || false
    if (!isFallback) await page.evaluate(() => window.setState({ isAdmin: true }))
  })

  test.afterAll(async () => {
    if (adminUid && page && !isFallback) await cleanupTestData(page, adminUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  async function loadAdminPanel() {
    await page.evaluate(() => window.setState({ isAdmin: true, showAdminPanel: true }))
    await page.waitForFunction(() => typeof window.adminDismissReport === 'function' &&
      window.adminDismissReport.toString().includes('dismissed'), { timeout: 20000 })
    // Re-assert admin state right before acting (handlers gate on getState().isAdmin).
    await page.evaluate(() => window.setState({ isAdmin: true }))
  }

  test('adminDismissReport marks a report dismissed in Firestore', async () => {
    await loadAdminPanel()
    const reportId = await page.evaluate(async () => {
      const { getDb, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'reports'), {
        type: 'spot', targetId: 'seed-spot-' + Date.now(), reason: 'spam',
        reporterId: 'someone', status: 'pending', createdAt: serverTimestamp(),
      })
      return ref.id
    })
    await page.evaluate((id) => window.adminDismissReport(id), reportId)
    await expect.poll(async () => {
      return await page.evaluate(async (id) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'reports', id))
        return snap.exists() ? snap.data().status : null
      }, reportId)
    }, { timeout: 15000 }).toBe('dismissed')
  })

  test('adminConfirmReport confirms the report and flags the spot dangerous', async () => {
    await loadAdminPanel()
    const { reportId, spotId } = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const db = getDb()
      const spotRef = await addDoc(collection(db, 'spots'), {
        lat: 48.85, lng: 2.35, direction: 'north', type: 'city_exit', description: 'report target',
        creatorId: getAuth().currentUser?.uid, createdAt: serverTimestamp(),
        rating: { safety: 4, traffic: 3, accessibility: 4 },
      })
      const repRef = await addDoc(collection(db, 'reports'), {
        type: 'spot', targetId: spotRef.id, reason: 'danger', reporterId: 'someone',
        status: 'pending', createdAt: serverTimestamp(),
      })
      return { reportId: repRef.id, spotId: spotRef.id }
    })
    await page.evaluate(({ reportId, spotId }) => window.adminConfirmReport(reportId, spotId, 'dangerous'), { reportId, spotId })
    await expect.poll(async () => {
      return await page.evaluate(async (id) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'reports', id))
        return snap.exists() ? snap.data().status : null
      }, reportId)
    }, { timeout: 15000 }).toBe('confirmed')
    const dangerous = await page.evaluate(async (id) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'spots', id))
      return snap.exists() ? snap.data().dangerous : null
    }, spotId)
    expect(dangerous).toBe(true)
  })

  test('adminApproveGuideTip approves a pending tip in Firestore', async () => {
    // Load the Guides module (real adminApproveGuideTip lives there).
    await page.evaluate(() => { window.changeTab('voyage'); window.setVoyageSubTab?.('guides') })
    await page.waitForFunction(() => typeof window.adminApproveGuideTip === 'function', { timeout: 15000 })

    const tipId = await page.evaluate(async () => {
      const { getDb, getAuth, doc, setDoc, serverTimestamp } = window.__fb
      const uid = getAuth().currentUser?.uid
      const id = `${uid}_FR_general_seed_${Date.now()}`
      await setDoc(doc(getDb(), 'guideTips', id), {
        countryCode: 'FR', category: 'general', text: 'seed tip', userId: uid,
        status: 'pending', createdAt: serverTimestamp(),
      })
      return id
    })
    await page.evaluate((id) => window.adminApproveGuideTip(id), tipId)
    await expect.poll(async () => {
      return await page.evaluate(async (id) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guideTips', id))
        return snap.exists() ? snap.data().status : null
      }, tipId)
    }, { timeout: 15000 }).toBe('approved')
  })

  async function seedGuideTip(status) {
    return await page.evaluate(async (status) => {
      const { getDb, getAuth, doc, setDoc, serverTimestamp } = window.__fb
      const uid = getAuth().currentUser?.uid
      const id = `${uid}_DE_general_seed_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      await setDoc(doc(getDb(), 'guideTips', id), {
        countryCode: 'DE', category: 'general', text: 'seed', userId: uid, status, createdAt: serverTimestamp(),
      })
      return id
    }, status)
  }

  test('adminRejectGuideTip rejects a pending tip in Firestore', async () => {
    await page.evaluate(() => { window.changeTab('voyage'); window.setVoyageSubTab?.('guides') })
    await page.waitForFunction(() => typeof window.adminRejectGuideTip === 'function', { timeout: 15000 })
    const tipId = await seedGuideTip('pending')
    await page.evaluate((id) => window.adminRejectGuideTip(id), tipId)
    await expect.poll(async () => page.evaluate(async (id) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'guideTips', id))
      return snap.exists() ? snap.data().status : null
    }, tipId), { timeout: 15000 }).toBe('rejected')
  })

  async function seedIdVerification() {
    return await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'id_verifications'), {
        userId: getAuth().currentUser?.uid, status: 'pending', createdAt: serverTimestamp(),
      })
      return ref.id
    })
  }

  test('adminApproveIdVerification approves an id verification', async () => {
    await loadAdminPanel()
    const vId = await seedIdVerification()
    await page.evaluate((id) => window.adminApproveIdVerification(id), vId)
    await expect.poll(async () => page.evaluate(async (id) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'id_verifications', id))
      return snap.exists() ? snap.data().status : null
    }, vId), { timeout: 15000 }).toBe('approved')
  })

  test('adminRejectIdVerification rejects an id verification', async () => {
    await loadAdminPanel()
    const vId = await seedIdVerification()
    await page.evaluate((id) => window.adminRejectIdVerification(id), vId)
    await expect.poll(async () => page.evaluate(async (id) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'id_verifications', id))
      return snap.exists() ? snap.data().status : null
    }, vId), { timeout: 15000 }).toBe('rejected')
  })

  test('adminRelocateSpot confirms the report after moving the spot', async () => {
    await loadAdminPanel()
    const { reportId, spotId } = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const db = getDb()
      const spotRef = await addDoc(collection(db, 'spots'), {
        lat: 50.0, lng: 4.0, direction: 'east', type: 'city_exit', description: 'relocate target',
        creatorId: getAuth().currentUser?.uid, createdAt: serverTimestamp(), rating: { safety: 3, traffic: 3, accessibility: 3 },
      })
      const repRef = await addDoc(collection(db, 'reports'), {
        type: 'spot', targetId: spotRef.id, reason: 'misplaced', reporterId: 'someone', status: 'pending', createdAt: serverTimestamp(),
      })
      return { reportId: repRef.id, spotId: spotRef.id }
    })
    await page.evaluate(({ reportId, spotId }) => window.adminRelocateSpot(reportId, spotId, 48.0, 2.5), { reportId, spotId })
    await expect.poll(async () => page.evaluate(async (id) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'reports', id))
      return snap.exists() ? snap.data().status : null
    }, reportId), { timeout: 15000 }).toBe('confirmed')
  })
})
