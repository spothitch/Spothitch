/**
 * Stats Service — Aggregate queries for KPIs
 * Logic: a user is "real" ONLY if they have a real email (not ci-*, not empty).
 * A spot is "real" ONLY if its creatorId matches a real user.
 * Everything else = test data.
 */

import {
  getFilteredCount,
  getRecentDocs,
  loadAllDocs,
} from './firebase.js'

/** Known real user emails (admin) */
const KNOWN_REAL_EMAILS = ['antoine.v.ville@gmail.com']

/** Check if an email is a test/CI account */
export function isTestEmail(email) {
  if (!email) return true // no email = test
  if (/^ci-.*@spothitch\.com$/i.test(email)) return true
  return false
}

/** Check if a user is real (has a real email from a real provider) */
export function isRealUser(user) {
  const email = (user.email || '').toLowerCase().trim()
  if (!email) return false
  if (/^ci-.*@spothitch\.com$/i.test(email)) return false
  // Must have a real email domain (gmail, outlook, yahoo, hotmail, etc.)
  if (email.includes('@')) return true
  return false
}

/** Check if a user is a test account (inverse of isRealUser) */
export function isTestUser(user) {
  return !isRealUser(user)
}

/** Check if a spot is real (created by a real user) */
export function isRealSpot(spot, realUserIds = []) {
  // If we have a list of real user IDs, check against it
  if (realUserIds.length > 0 && spot.creatorId) {
    return realUserIds.includes(spot.creatorId)
  }
  // Fallback: check creator email
  const creatorEmail = (spot.creatorEmail || spot.userEmail || '').toLowerCase()
  if (creatorEmail && !isTestEmail(creatorEmail)) return true
  return false
}

export async function loadDashboardStats() {
  const [allUsers, allSpots, allReports, pendingTipsCount] = await Promise.all([
    loadAllDocs('users').catch(() => []),
    loadAllDocs('spots').catch(() => []),
    loadAllDocs('reports').catch(() => []),
    getFilteredCount('guideTips', 'status', '==', 'pending').catch(() => 0),
  ])

  const realUsers = allUsers.filter((u) => isRealUser(u))
  const testUsers = allUsers.filter((u) => isTestUser(u))
  const realUserIds = realUsers.map((u) => u.id)
  const realSpots = allSpots.filter((s) => isRealSpot(s, realUserIds))
  const testSpots = allSpots.filter((s) => !isRealSpot(s, realUserIds))

  return {
    userCount: realUsers.length,
    spotCountFirebase: realSpots.length,
    pendingTipsCount,
    testUserCount: testUsers.length,
    testSpotCount: testSpots.length,
    testReportCount: allReports.length,
  }
}

export async function loadRecentActivity() {
  // Load all users first to know which are real
  const [allUsers, recentSpots] = await Promise.all([
    loadAllDocs('users').catch(() => []),
    getRecentDocs('spots', 'createdAt', 30).catch(() => []),
  ])

  const realUsers = allUsers.filter((u) => isRealUser(u))
  const realUserIds = realUsers.map((u) => u.id)

  // Recent users = real users sorted by last login
  const recentRealUsers = realUsers
    .filter((u) => u.lastLogin)
    .sort((a, b) => {
      const da = a.lastLogin?.toDate ? a.lastLogin.toDate().getTime() : new Date(a.lastLogin || 0).getTime()
      const db2 = b.lastLogin?.toDate ? b.lastLogin.toDate().getTime() : new Date(b.lastLogin || 0).getTime()
      return db2 - da
    })
    .slice(0, 10)

  const filteredSpots = recentSpots.filter((s) => isRealSpot(s, realUserIds)).slice(0, 10)

  return { recentUsers: recentRealUsers, recentSpots: filteredSpots }
}

export async function loadAllSpots() {
  return loadAllDocs('spots')
}

export async function loadAllUsers() {
  return loadAllDocs('users')
}
