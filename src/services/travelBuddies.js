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

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      const buddy = { id: docSnap.id, ...data }

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

    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return { success: false, error: 'auth' }

    const { getState } = await import('../stores/state.js')
    const state = getState()

    const docRef = await addDoc(collection(db, 'travelBuddies'), {
      userId: user.uid,
      userName: user.displayName || state.username || '',
      departure: data.departure,
      destination: data.destination,
      country: data.country || '',
      dateFrom: data.dateFrom,
      dateTo: data.dateTo || '',
      message: data.message || '',
      visibility: data.visibility || ['tous'],
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
