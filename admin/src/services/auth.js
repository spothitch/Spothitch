/**
 * Auth Service — Admin check
 */

const ADMIN_EMAILS = ['antoine.v.ville@gmail.com']

export function isAdmin(user) {
  if (!user || !user.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}
