/**
 * Stats Service — Aggregate queries for KPIs
 * Filters out test accounts (ci-*@spothitch.com) and test spots
 */

import {
  getCollectionCount,
  getFilteredCount,
  getRecentDocs,
  loadAllDocs,
} from './firebase.js'

/** Check if an email belongs to a CI/E2E test account */
export function isTestEmail(email) {
  if (!email) return false
  return /^ci-.*@spothitch\.com$/i.test(email)
}

/** Check if a spot is test data (created by test account or contains test markers) */
export function isTestSpot(spot) {
  const creatorEmail = (spot.creatorEmail || spot.userEmail || '').toLowerCase()
  if (isTestEmail(creatorEmail)) return true
  const desc = (spot.description || '').toLowerCase()
  if (desc.includes('e2e') || desc.includes('test spot')) return true
  const creator = (spot.creator || spot.creatorId || '').toLowerCase()
  if (
    creator.includes('alice test') ||
    creator.includes('bob test') ||
    creator.includes('charlie test') ||
    creator.includes('diana test')
  )
    return true
  return false
}

/** Check if a user is a test account */
export function isTestUser(user) {
  return isTestEmail(user.email)
}

export async function loadDashboardStats() {
  const [allUsers, allSpots, pendingTipsCount, hitchwikiStats] = await Promise.all([
    loadAllDocs('users').catch(() => []),
    loadAllDocs('spots').catch(() => []),
    getFilteredCount('guideTips', 'status', '==', 'pending').catch(() => 0),
    loadHitchwikiStats(),
  ])

  const realUsers = allUsers.filter((u) => !isTestUser(u))
  const testUsers = allUsers.filter((u) => isTestUser(u))
  const realSpots = allSpots.filter((s) => !isTestSpot(s))
  const testSpots = allSpots.filter((s) => isTestSpot(s))

  return {
    userCount: realUsers.length,
    spotCountFirebase: realSpots.length,
    spotCountHitchwiki: hitchwikiStats.totalHitchwiki,
    hitchwikiCountries: hitchwikiStats.countries,
    pendingTipsCount,
    testUserCount: testUsers.length,
    testSpotCount: testSpots.length,
  }
}

async function loadHitchwikiStats() {
  try {
    const res = await fetch('https://spothitch.com/data/spots-stats.json')
    if (!res.ok) throw new Error('Failed to load stats')
    return await res.json()
  } catch {
    return { totalHitchwiki: 0, countries: 0 }
  }
}

export async function loadRecentActivity() {
  const [recentUsers, recentSpots] = await Promise.all([
    getRecentDocs('users', 'lastLogin', 30).catch(() => []),
    getRecentDocs('spots', 'createdAt', 30).catch(() => []),
  ])

  // Filter out test accounts/spots and return top 10
  const filteredUsers = recentUsers.filter((u) => !isTestUser(u)).slice(0, 10)
  const filteredSpots = recentSpots.filter((s) => !isTestSpot(s)).slice(0, 10)

  return { recentUsers: filteredUsers, recentSpots: filteredSpots }
}

export async function loadAllSpots() {
  return loadAllDocs('spots')
}

export async function loadAllUsers() {
  return loadAllDocs('users')
}
