/**
 * Guides Service — Load, approve, reject guide tips
 */

import { getFilteredDocs, getAllDocs, updateDocument } from './firebase.js'

export async function loadPendingTips() {
  return getFilteredDocs('guideTips', 'status', '==', 'pending', 'createdAt', 100)
}

export async function loadApprovedTips() {
  return getFilteredDocs('guideTips', 'status', '==', 'approved', 'createdAt', 100)
}

export async function loadRejectedTips() {
  return getFilteredDocs('guideTips', 'status', '==', 'rejected', 'createdAt', 50)
}

export async function approveTip(tipId) {
  return updateDocument('guideTips', tipId, {
    status: 'approved',
    moderatedAt: new Date().toISOString(),
  })
}

export async function rejectTip(tipId) {
  return updateDocument('guideTips', tipId, {
    status: 'rejected',
    moderatedAt: new Date().toISOString(),
  })
}
