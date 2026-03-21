/**
 * Accounts to ignore for Telegram notifications.
 * - Admin accounts (Antoine)
 * - CI/E2E test accounts (automated tests)
 *
 * These accounts should NOT trigger Telegram alerts.
 */

const IGNORED_EMAILS = [
  'antoine.v.ville@gmail.com',
  'ci-admin@spothitch.com',
  'ci-alice@spothitch.com',
  'ci-bob@spothitch.com',
  'ci-charlie@spothitch.com',
  'ci-diana@spothitch.com',
  'ci-alice-new@spothitch.com',
  'ci-bob-new@spothitch.com',
]

/**
 * Check if an email should be ignored for Telegram notifications.
 * Matches exact emails from the list + any ci-*@spothitch.com pattern.
 */
function isIgnoredAccount(email) {
  if (!email) return false
  const lower = email.toLowerCase()
  if (IGNORED_EMAILS.includes(lower)) return true
  // Catch any future ci-* test accounts automatically
  if (/^ci-.*@spothitch\.com$/.test(lower)) return true
  return false
}

module.exports = { IGNORED_EMAILS, isIgnoredAccount }
