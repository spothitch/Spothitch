/**
 * Stats Service — Aggregate queries for KPIs
 */

import {
  getCollectionCount,
  getFilteredCount,
  getRecentDocs,
} from './firebase.js'

export async function loadDashboardStats() {
  const [userCount, spotCount, pendingTipsCount] = await Promise.all([
    getCollectionCount('users').catch(() => 0),
    getCollectionCount('spots').catch(() => 0),
    getFilteredCount('guideTips', 'status', '==', 'pending').catch(() => 0),
  ])

  return { userCount, spotCount, pendingTipsCount }
}

export async function loadRecentActivity() {
  const [recentUsers, recentSpots] = await Promise.all([
    getRecentDocs('users', 'lastLogin', 10).catch(() => []),
    getRecentDocs('spots', 'createdAt', 10).catch(() => []),
  ])

  return { recentUsers, recentSpots }
}
