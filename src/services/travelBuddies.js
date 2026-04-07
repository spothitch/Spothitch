/**
 * Travel Buddies Service
 * Manages travel companion announcements in Firestore.
 */

export async function getTravelBuddies(filters = {}) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return []

    const q = query(
      collection(db, 'travelBuddies'),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const buddies = []

    const today = new Date().toISOString().split('T')[0]

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      const buddy = { id: docSnap.id, ...data }

      // Skip expired announcements (dateTo or dateFrom is in the past)
      const expiryDate = buddy.dateTo || buddy.dateFrom
      if (expiryDate && expiryDate < today) return

      // Apply client-side filters
      if (filters.country && filters.country !== 'all') {
        if (buddy.country !== filters.country) return
      }
      if (filters.visibility && filters.visibility !== 'all') {
        if (!buddy.visibility || !buddy.visibility.includes(filters.visibility)) return
      }

      buddies.push(buddy)
    })

    return buddies
  } catch (err) {
    console.warn('[TravelBuddies] Fetch failed:', err.message)
    return []
  }
}

export async function createTravelBuddy(data) {
  try {
    // Validate required fields
    if (!data.departure || !data.destination || !data.dateFrom) {
      return { success: false, error: 'missing_fields' }
    }

    // Validate field lengths (prevent spam)
    if (data.departure.length > 100 || data.destination.length > 100) {
      return { success: false, error: 'too_long' }
    }
    if (data.message && data.message.length > 500) {
      return { success: false, error: 'message_too_long' }
    }

    // Validate dates
    const today = new Date().toISOString().split('T')[0]
    if (data.dateFrom < today) {
      return { success: false, error: 'date_past' }
    }
    if (data.dateTo && data.dateTo < data.dateFrom) {
      return { success: false, error: 'date_invalid' }
    }

    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return { success: false, error: 'auth' }

    const { getState } = await import('../stores/state.js')
    const state = getState()
    const displayName = state.firstName
      ? `${state.firstName} ${(state.lastName || '').charAt(0)}.`
      : (user.displayName || state.username || '')

    const docRef = await addDoc(collection(db, 'travelBuddies'), {
      userId: user.uid,
      userName: displayName,
      departure: data.departure.substring(0, 100),
      destination: data.destination.substring(0, 100),
      country: data.country || '',
      dateFrom: data.dateFrom,
      dateTo: data.dateTo || '',
      message: (data.message || '').substring(0, 500),
      preferences: (data.preferences || '').substring(0, 500),
      visibility: data.visibility || ['tous'],
      mode: data.mode || 'autostop',
      flexDates: data.flexDates || false,
      createdAt: serverTimestamp(),
    })

    return { success: true, id: docRef.id }
  } catch (err) {
    console.warn('[TravelBuddies] Create failed:', err.message)
    return { success: false, error: 'firestore' }
  }
}

export async function deleteTravelBuddy(buddyId) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, getDoc, deleteDoc } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return { success: false, error: 'auth' }

    // Check ownership
    const docRef = doc(db, 'travelBuddies', buddyId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return { success: false, error: 'not_found' }
    if (docSnap.data().userId !== user.uid) return { success: false, error: 'forbidden' }

    await deleteDoc(docRef)
    return { success: true }
  } catch (err) {
    console.warn('[TravelBuddies] Delete failed:', err.message)
    return { success: false, error: 'firestore' }
  }
}

export async function getTravelBuddyById(buddyId) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, getDoc } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return null

    const docSnap = await getDoc(doc(db, 'travelBuddies', buddyId))
    if (!docSnap.exists()) return null

    return { id: docSnap.id, ...docSnap.data() }
  } catch (err) {
    console.warn('[TravelBuddies] Fetch by ID failed:', err.message)
    return null
  }
}
