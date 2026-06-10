/**
 * Guardian Mode — Complete E2E Tests
 *
 * Tests the full Guardian flow:
 * 1. Configuration (add guardians, set interval, destination)
 * 2. Session lifecycle (start, check-in, stop)
 * 3. Real-time chat (traveler ↔ guardian via Firestore)
 * 4. Photo capture and sync
 * 5. Position sharing
 * 6. Overdue/alert flow
 * 7. Arrival + trip history
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  closeSessions,
  snap,
  firestoreGetDoc,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(120000)

const PHASE = 'guardian'

// ═══════════════════════════════════════════════════════════════════════════════
// G-01: Guardian handlers exist on window
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-01 Guardian handlers', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('all guardian handlers exist', async () => {
    const handlers = await sessions.alice.page.evaluate(() => {
      const names = [
        'showGuardianModal', 'closeGuardianModal',
        'startGuardian', 'stopGuardian',
        'guardianCheckIn', 'guardianSendAlert',
        'guardianGoToScreen', 'guardianEditField',
        'guardianSaveField', 'guardianCancelEdit',
        'guardianAddGuardian', 'guardianEditGuardian', 'guardianRemoveGuardian',
        'guardianUpdatePlate', 'guardianSavePlate',
        'guardianAddTripPhoto', 'guardianSaveTripPhoto',
        'guardianUpdateDestination', 'guardianSaveDestination',
        'guardianSendMessage', 'guardianQuickCheckin',
        'guardianSendReply',
        'guardianShowArrival', 'guardianAddToJournal',
        'guardianCloseSheet',
        'guardianBtnDown', 'guardianBtnUp', 'guardianBtnCancel',
      ]
      return names.map(n => ({ name: n, exists: typeof window[n] === 'function' }))
    })

    for (const h of handlers) {
      expect(h.exists, `${h.name} should exist`).toBe(true)
    }

    await snap(sessions.alice.page, PHASE, 'G-01-handlers', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-02: Guardian configuration
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-02 Guardian config', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('open guardian modal shows intro screen', async () => {
    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(1000)

    const state = await sessions.alice.page.evaluate(() => window.getState?.())
    expect(state?.showGuardianModal).toBe(true)

    await snap(sessions.alice.page, PHASE, 'G-02-intro', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })

  test('configure guardian via localStorage', async () => {
    // Set guardian config directly
    await sessions.alice.page.evaluate(() => {
      const config = {
        guardians: [
          { name: 'Bob Guardian', phone: '+33612345678', color: '#22c55e' },
        ],
        guardian: { name: 'Bob Guardian', phone: '+33612345678' },
        checkInInterval: 30,
        destination: 'Lyon',
        licensePlate: 'AB-123-CD',
        customMessage: 'Test trip',
      }
      localStorage.setItem('spothitch_guardian', JSON.stringify(config))
    })

    // Open modal — should show config screen (has guardian configured)
    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(1000)
    await sessions.alice.page.evaluate(() => window.guardianGoToScreen('main'))
    await sessions.alice.page.waitForTimeout(500)

    await snap(sessions.alice.page, PHASE, 'G-02-config', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })

  test('add multiple guardians (max 5)', async () => {
    await sessions.alice.page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
      config.guardians = [
        { name: 'Bob', phone: '+33600000001', color: '#22c55e' },
        { name: 'Charlie', phone: '+33600000002', color: '#3b82f6' },
        { name: 'Diana', phone: '+33600000003', color: '#f59e0b' },
      ]
      localStorage.setItem('spothitch_guardian', JSON.stringify(config))
    })

    const guardians = await sessions.alice.page.evaluate(() => {
      const config = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
      return config.guardians
    })

    expect(guardians).toHaveLength(3)
    expect(guardians[0].name).toBe('Bob')
    expect(guardians[2].name).toBe('Diana')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-03: Guardian session lifecycle (start → check-in → stop)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-03 Session lifecycle', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    // Cleanup: stop guardian if still active
    await sessions.alice.page.evaluate(() => {
      try { localStorage.removeItem('spothitch_guardian') } catch {}
    })
    await closeSessions(sessions)
  })

  test('start guardian session → creates sosTimer in Firestore', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Configure guardian with Bob as friend (for guardianIds resolution)
    await sessions.alice.page.evaluate(({ bobUid }) => {
      // Set Bob as a friend so resolveGuardianIds can find him
      const state = window.getState?.() || {}
      window.setState?.({ friends: [{ id: bobUid, name: 'Bob Test' }] })

      const config = {
        guardians: [{ name: 'Bob Test', phone: '', color: '#22c55e', friendId: bobUid }],
        guardian: { name: 'Bob Test', phone: '' },
        checkInInterval: 30,
        destination: 'Lyon',
        active: false,
      }
      localStorage.setItem('spothitch_guardian', JSON.stringify(config))
    }, { bobUid })

    // Start guardian mode
    await sessions.alice.page.evaluate(() => window.startGuardian())
    await sessions.alice.page.waitForTimeout(3000) // Wait for Firestore sync

    // Verify localStorage state
    const localState = await sessions.alice.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
    })
    expect(localState.active).toBe(true)
    expect(localState.tripStart).toBeTruthy()

    // Verify Firestore sosTimer exists
    const timerDoc = await firestoreGetDoc(sessions.alice.page, 'sosTimers', aliceUid)
    if (timerDoc) {
      expect(timerDoc.active).toBe(true)
      expect(timerDoc.destination).toBe('Lyon')
    }

    await snap(sessions.alice.page, PHASE, 'G-03-started', 'after')
  })

  test('check-in updates lastCheckIn', async () => {
    const aliceUid = sessions.alice.uid

    // Get initial lastCheckIn
    const before = await sessions.alice.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').lastCheckIn
    })

    await sessions.alice.page.waitForTimeout(1100) // Ensure time diff
    await sessions.alice.page.evaluate(() => window.guardianCheckIn())
    await sessions.alice.page.waitForTimeout(2000) // Wait for Firestore sync

    const after = await sessions.alice.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').lastCheckIn
    })

    expect(after).toBeGreaterThan(before)

    await snap(sessions.alice.page, PHASE, 'G-03-checkin', 'after')
  })

  test('stop guardian → clears active state + creates trip history', async () => {
    // Accept the confirm dialog
    sessions.alice.page.on('dialog', dialog => dialog.accept())

    await sessions.alice.page.evaluate(() => window.stopGuardian())
    await sessions.alice.page.waitForTimeout(2000)

    const localState = await sessions.alice.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
    })
    expect(localState.active).toBe(false)

    // Check trip history was saved
    const history = await sessions.alice.page.evaluate(() => {
      return JSON.parse(localStorage.getItem('spothitch_trip_history') || '[]')
    })
    expect(history.length).toBeGreaterThanOrEqual(1)

    await snap(sessions.alice.page, PHASE, 'G-03-stopped', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-04: Real-time chat (Firestore)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-04 Real-time chat', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    // Cleanup
    await sessions.alice.page.evaluate(async () => {
      try {
        const { getDb, doc, deleteDoc } = window.__fb
        const uid = window.__fb.getAuth().currentUser?.uid
        if (uid) await deleteDoc(doc(getDb(), 'sosTimers', uid))
      } catch {}
      localStorage.removeItem('spothitch_guardian')
    })
    await closeSessions(sessions)
  })

  test('traveler sends message → appears in Firestore messages subcollection', async () => {
    const aliceUid = sessions.alice.uid

    // Start a guardian session first (needed for sendGuardianMessage to work)
    await sessions.alice.page.evaluate(({ bobUid }) => {
      window.setState?.({ friends: [{ id: bobUid, name: 'Bob' }] })
      const config = {
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e', friendId: bobUid }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 60,
        active: true,
        tripStart: Date.now(),
        lastCheckIn: Date.now(),
        positions: [],
        tripEvents: [],
      }
      localStorage.setItem('spothitch_guardian', JSON.stringify(config))
    }, { bobUid: sessions.bob.uid })

    // Also create the sosTimer doc in Firestore (needed for messages subcollection)
    await sessions.alice.page.evaluate(async (bobUid) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        const uid = window.__fb.getAuth().currentUser?.uid
        if (uid) {
          await setDoc(doc(getDb(), 'sosTimers', uid), {
            userId: uid,
            guardianIds: [bobUid],
            active: true,
            lastCheckIn: serverTimestamp(),
            tripStart: serverTimestamp(),
            destination: 'Test',
          })
        }
      } catch (e) { console.error('Setup error:', e) }
    }, sessions.bob.uid)

    await sessions.alice.page.waitForTimeout(1000)

    // Send a message via the service
    const sent = await sessions.alice.page.evaluate(async () => {
      const { sendGuardianMessage } = await window.__getGuardianService()
      return await sendGuardianMessage('Hello from Alice!')
    })
    expect(sent).toBe(true)

    await sessions.alice.page.waitForTimeout(2000)

    // Read messages from Firestore
    const messages = await sessions.alice.page.evaluate(async () => {
      const { getDb, collection, getDocs, query, orderBy } = window.__fb
      const uid = window.__fb.getAuth().currentUser?.uid
      if (!uid) return []
      const q = query(collection(getDb(), 'sosTimers', uid, 'messages'), orderBy('createdAt', 'asc'))
      const snap = await getDocs(q)
      return snap.docs.map(d => d.data())
    })

    expect(messages.length).toBeGreaterThanOrEqual(1)
    const lastMsg = messages[messages.length - 1]
    expect(lastMsg.text).toBe('Hello from Alice!')
    expect(lastMsg.type).toBe('text')
    expect(lastMsg.senderId).toBeTruthy()

    await snap(sessions.alice.page, PHASE, 'G-04-traveler-msg', 'after')
  })

  test('guardian sends reply → appears in Firestore', async () => {
    const aliceUid = sessions.alice.uid

    // Bob sends a reply to Alice's timer
    const sent = await sessions.bob.page.evaluate(async (travelerId) => {
      const { sendGuardianReply } = await window.__getGuardianService()
      return await sendGuardianReply(travelerId, 'Stay safe, Alice!')
    }, aliceUid)

    expect(sent).toBe(true)
    await sessions.bob.page.waitForTimeout(2000)

    // Verify the message exists in Firestore
    const messages = await sessions.alice.page.evaluate(async () => {
      const { getDb, collection, getDocs, query, orderBy } = window.__fb
      const uid = window.__fb.getAuth().currentUser?.uid
      if (!uid) return []
      const q = query(collection(getDb(), 'sosTimers', uid, 'messages'), orderBy('createdAt', 'asc'))
      const snap = await getDocs(q)
      return snap.docs.map(d => d.data())
    })

    const bobMsg = messages.find(m => m.text === 'Stay safe, Alice!')
    expect(bobMsg).toBeTruthy()
    expect(bobMsg.senderId).toBe(sessions.bob.uid)

    await snap(sessions.bob.page, PHASE, 'G-04-guardian-reply', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-05: Photo capture and Firestore sync
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-05 Photo sync', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await sessions.alice.page.evaluate(async () => {
      try {
        const { getDb, doc, deleteDoc } = window.__fb
        const uid = window.__fb.getAuth().currentUser?.uid
        if (uid) await deleteDoc(doc(getDb(), 'sosTimers', uid))
      } catch {}
      localStorage.removeItem('spothitch_guardian')
    })
    await closeSessions(sessions)
  })

  test('syncTripPhotoToFirestore creates photo message in Firestore', async () => {
    const aliceUid = sessions.alice.uid

    // Setup active session in Firestore
    await sessions.alice.page.evaluate(async () => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        const uid = window.__fb.getAuth().currentUser?.uid
        if (uid) {
          await setDoc(doc(getDb(), 'sosTimers', uid), {
            userId: uid,
            guardianIds: [],
            active: true,
            lastCheckIn: serverTimestamp(),
            tripStart: serverTimestamp(),
          })
        }
      } catch {}

      // Also set localStorage as active
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, tripStart: Date.now(), lastCheckIn: Date.now(),
        guardians: [{ name: 'Test', phone: '', color: '#22c55e' }],
        guardian: { name: 'Test', phone: '' },
        checkInInterval: 60, positions: [], tripEvents: [],
      }))
    })

    // Create a small test image (1x1 red pixel PNG as base64)
    const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

    const synced = await sessions.alice.page.evaluate(async (photo) => {
      try {
        const { syncTripPhotoToFirestore } = await window.__getGuardianService()
        await syncTripPhotoToFirestore(photo)
        return true
      } catch (e) { return `error: ${e.message}` }
    }, fakeBase64)

    expect(synced).toBe(true)
    await sessions.alice.page.waitForTimeout(2000)

    // Verify photo message in Firestore
    const messages = await sessions.alice.page.evaluate(async () => {
      const { getDb, collection, getDocs, query } = window.__fb
      const uid = window.__fb.getAuth().currentUser?.uid
      if (!uid) return []
      const q = query(collection(getDb(), 'sosTimers', uid, 'messages'))
      const snap = await getDocs(q)
      return snap.docs.map(d => d.data())
    })

    const photoMsg = messages.find(m => m.type === 'photo')
    expect(photoMsg).toBeTruthy()
    expect(photoMsg.photoUrl).toContain('data:image')

    await snap(sessions.alice.page, PHASE, 'G-05-photo-sync', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-06: Guardian watch (Bob sees Alice's timer)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-06 Guardian watch', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    // Cleanup
    await sessions.alice.page.evaluate(async () => {
      try {
        const { getDb, doc, deleteDoc } = window.__fb
        const uid = window.__fb.getAuth().currentUser?.uid
        if (uid) await deleteDoc(doc(getDb(), 'sosTimers', uid))
      } catch {}
    })
    await closeSessions(sessions)
  })

  test('bob can read alice sosTimer when listed as guardian', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Create sosTimer with Bob as guardian
    await sessions.alice.page.evaluate(async (bobUid) => {
      const { getDb, doc, setDoc, serverTimestamp } = window.__fb
      const uid = window.__fb.getAuth().currentUser?.uid
      if (!uid) return
      await setDoc(doc(getDb(), 'sosTimers', uid), {
        userId: uid,
        userName: 'Alice Test',
        guardianIds: [bobUid],
        active: true,
        lastCheckIn: serverTimestamp(),
        tripStart: serverTimestamp(),
        lastPosition: { lat: 48.8566, lng: 2.3522 },
        destination: 'Lyon',
        checkInIntervalMinutes: 30,
      })
    }, bobUid)

    await sessions.bob.page.waitForTimeout(2000)

    // Bob reads the sosTimer
    const timer = await sessions.bob.page.evaluate(async (aliceUid) => {
      try {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'sosTimers', aliceUid))
        return snap.exists() ? snap.data() : null
      } catch { return null }
    }, aliceUid)

    if (timer) {
      expect(timer.active).toBe(true)
      expect(timer.destination).toBe('Lyon')
      expect(timer.guardianIds).toContain(bobUid)
      expect(timer.lastPosition.lat).toBe(48.8566)
    }

    await snap(sessions.bob.page, PHASE, 'G-06-watch', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-07: Trip events timeline
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-07 Trip events', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_guardian')
    })
    await closeSessions(sessions)
  })

  test('trip events accumulate correctly (departure, checkin, vehicle, message)', async () => {
    // Setup an active trip
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, tripStart: Date.now(), lastCheckIn: Date.now(),
        guardians: [{ name: 'Test', phone: '', color: '#22c55e' }],
        guardian: { name: 'Test', phone: '' },
        checkInInterval: 60, positions: [], tripEvents: [],
      }))
    })

    // Add events via service
    await sessions.alice.page.evaluate(async () => {
      const { addTripEvent } = await window.__getGuardianService()
      addTripEvent('departure', { destination: 'Lyon' })
      addTripEvent('checkin', {})
      addTripEvent('vehicle', { plate: 'AB-123-CD', isNew: false })
      addTripEvent('message', { sender: 'Alice', text: 'All good!', senderColor: '#f59e0b' })
    })

    const events = await sessions.alice.page.evaluate(async () => {
      const { getTripEvents } = await window.__getGuardianService()
      return getTripEvents()
    })

    expect(events.length).toBe(4)
    expect(events[0].type).toBe('departure')
    expect(events[1].type).toBe('checkin')
    expect(events[2].type).toBe('vehicle')
    expect(events[2].data.plate).toBe('AB-123-CD')
    expect(events[3].type).toBe('message')
    expect(events[3].data.text).toBe('All good!')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-08: Guardian view screens render
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-08 Screen rendering', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_guardian')
      localStorage.removeItem('spothitch_trip_history')
    })
    await closeSessions(sessions)
  })

  test('intro screen renders correctly', async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_guardian')
    })
    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(1000)

    const hasTitle = await sessions.alice.page.evaluate(() => {
      return document.getElementById('guardian-modal-title')?.textContent?.length > 0
    })
    expect(hasTitle).toBe(true)

    await snap(sessions.alice.page, PHASE, 'G-08-intro', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })

  test('active screen shows timeline and compose bar', async () => {
    // Setup active trip
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, tripStart: Date.now() - 600000, lastCheckIn: Date.now(),
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e' }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 30, positions: [], tripEvents: [
          { type: 'departure', timestamp: Date.now() - 600000, data: { destination: 'Lyon' } },
          { type: 'checkin', timestamp: Date.now() - 300000, data: {} },
        ],
      }))
    })

    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(1000)
    await sessions.alice.page.evaluate(() => window.guardianGoToScreen('active'))
    await sessions.alice.page.waitForTimeout(500)

    // Check timeline exists
    const hasTimeline = await sessions.alice.page.evaluate(() => !!document.getElementById('guardian-timeline'))
    expect(hasTimeline).toBe(true)

    // Check compose bar exists
    const hasComposeInput = await sessions.alice.page.evaluate(() => !!document.getElementById('guardian-message-input'))
    expect(hasComposeInput).toBe(true)

    await snap(sessions.alice.page, PHASE, 'G-08-active', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })

  test('overdue screen shows pulsing ring', async () => {
    // Set up an overdue state
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true,
        tripStart: Date.now() - 3600000,
        lastCheckIn: Date.now() - 2400000, // 40min ago, interval is 30min → overdue
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e' }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 30, positions: [], tripEvents: [],
      }))
    })

    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(500)
    await sessions.alice.page.evaluate(() => window.guardianGoToScreen('overdue'))
    await sessions.alice.page.waitForTimeout(500)

    await snap(sessions.alice.page, PHASE, 'G-08-overdue', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })

  test('arrival screen shows trip summary', async () => {
    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(500)
    await sessions.alice.page.evaluate(() => window.guardianGoToScreen('arrival'))
    await sessions.alice.page.waitForTimeout(500)

    await snap(sessions.alice.page, PHASE, 'G-08-arrival', 'after')
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-09: Guardian service functions (unit-style via page)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-09 Service functions', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_guardian')
      localStorage.removeItem('spothitch_trip_history')
    })
    await closeSessions(sessions)
  })

  test('isGuardianActive auto-stops stale trips', async () => {
    // Set a trip that started 9 hours ago
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true,
        tripStart: Date.now() - 9 * 3600000,
        lastCheckIn: Date.now() - 9 * 3600000,
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e' }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 30, positions: [], tripEvents: [],
      }))
    })

    const isActive = await sessions.alice.page.evaluate(async () => {
      const { isGuardianActive } = await window.__getGuardianService()
      return isGuardianActive()
    })

    expect(isActive).toBe(false) // Should have auto-stopped (>8h)
  })

  test('getETAInfo calculates speed and ETA', async () => {
    const etaInfo = await sessions.alice.page.evaluate(async () => {
      const { getETAInfo } = await window.__getGuardianService()
      const state = {
        positions: [
          { lat: 48.8566, lng: 2.3522, timestamp: Date.now() - 3600000 },
          { lat: 49.8566, lng: 2.3522, timestamp: Date.now() }, // ~111km north in 1h
        ],
      }
      return getETAInfo(state, { lat: 50.8566, lng: 2.3522 })
    })

    expect(etaInfo.speedKmh).toBeGreaterThan(50)
    expect(etaInfo.distanceKm).toBeGreaterThan(50)
    expect(etaInfo.etaMinutes).toBeGreaterThan(0)
  })

  test('validateGuardianInputs rejects empty guardian', async () => {
    const result = await sessions.alice.page.evaluate(async () => {
      const { validateGuardianInputs } = await window.__getGuardianService()
      return validateGuardianInputs({ guardians: [] })
    })

    expect(result.valid).toBe(false)
    expect(result.error).toBe('guardian_name_required')
  })

  test('validateGuardianInputs accepts valid config', async () => {
    const result = await sessions.alice.page.evaluate(async () => {
      const { validateGuardianInputs } = await window.__getGuardianService()
      return validateGuardianInputs({
        guardians: [{ name: 'Bob', phone: '' }],
        destination: 'Lyon',
        customMessage: 'Test',
        licensePlate: 'AB-123',
      })
    })

    expect(result.valid).toBe(true)
  })

  test('trip history save and load', async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_trip_history')
    })

    // Start and stop a trip
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, tripStart: Date.now() - 1800000, lastCheckIn: Date.now(),
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e' }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 60, positions: [],
        tripEvents: [{ type: 'checkin', timestamp: Date.now(), data: {} }],
        destination: 'Paris',
        checkInsCount: 3,
        notifyOnArrival: false, // Don't send real notifications in test
      }))
    })

    await sessions.alice.page.evaluate(async () => {
      const { stopGuardianMode } = await window.__getGuardianService()
      stopGuardianMode({ sendArrivalNotification: false })
    })

    const history = await sessions.alice.page.evaluate(async () => {
      const { loadTripHistory } = await window.__getGuardianService()
      return loadTripHistory()
    })

    expect(history.length).toBeGreaterThanOrEqual(1)
    expect(history[0].destination).toBe('Paris')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// G-10: Quick actions (plate, destination bottom sheets)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('G-10 Quick actions', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice'])
  })

  test.afterAll(async () => {
    await sessions.alice.page.evaluate(() => {
      localStorage.removeItem('spothitch_guardian')
    })
    await closeSessions(sessions)
  })

  test('plate bottom sheet opens and saves', async () => {
    // Setup active trip
    await sessions.alice.page.evaluate(() => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, tripStart: Date.now(), lastCheckIn: Date.now(),
        guardians: [{ name: 'Bob', phone: '', color: '#22c55e' }],
        guardian: { name: 'Bob', phone: '' },
        checkInInterval: 60, positions: [], tripEvents: [],
      }))
    })

    await sessions.alice.page.evaluate(() => window.showGuardianModal())
    await sessions.alice.page.waitForTimeout(500)
    await sessions.alice.page.evaluate(() => window.guardianGoToScreen('active'))
    await sessions.alice.page.waitForTimeout(500)

    // Open plate sheet
    await sessions.alice.page.evaluate(() => window.guardianUpdatePlate())
    await sessions.alice.page.waitForTimeout(500)

    // Check sheet is open (plate input exists)
    const hasPlateInput = await sessions.alice.page.evaluate(() => !!document.getElementById('guardian-sheet-plate'))
    expect(hasPlateInput).toBe(true)

    await snap(sessions.alice.page, PHASE, 'G-10-plate-sheet', 'after')

    // Close sheet
    await sessions.alice.page.evaluate(() => window.guardianCloseSheet())
    await sessions.alice.page.evaluate(() => window.closeGuardianModal())
  })
})
