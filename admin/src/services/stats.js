/**
 * Stats Service — Aggregate queries for KPIs
 */

import {
  getCollectionCount,
  getFilteredCount,
  getRecentDocs,
  loadAllDocs,
} from './firebase.js'

export async function loadDashboardStats() {
  const [userCount, spotCount, pendingTipsCount, hitchwikiStats] = await Promise.all([
    getCollectionCount('users').catch(() => 0),
    getCollectionCount('spots').catch(() => 0),
    getFilteredCount('guideTips', 'status', '==', 'pending').catch(() => 0),
    loadHitchwikiStats(),
  ])

  return {
    userCount,
    spotCountFirebase: spotCount,
    spotCountHitchwiki: hitchwikiStats.totalHitchwiki,
    hitchwikiCountries: hitchwikiStats.countries,
    pendingTipsCount,
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
    getRecentDocs('users', 'lastLogin', 10).catch(() => []),
    getRecentDocs('spots', 'createdAt', 10).catch(() => []),
  ])

  return { recentUsers, recentSpots }
}

export async function loadAllSpots() {
  return loadAllDocs('spots')
}

export async function loadAllUsers() {
  return loadAllDocs('users')
}
