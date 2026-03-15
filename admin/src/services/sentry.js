/**
 * Sentry Service — Fetch errors via GitHub Issues API
 */

const GH_API = 'https://api.github.com/repos/Spothitch/spothitch.github.io/issues'

export async function loadSentryIssues() {
  try {
    const res = await fetch(
      `${GH_API}?labels=sentry&state=open&per_page=20&sort=created&direction=desc`
    )
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Failed to load Sentry issues:', err)
    // Fallback: try without label filter
    try {
      const res = await fetch(
        `${GH_API}?state=open&per_page=30&sort=created&direction=desc`
      )
      if (res.ok) {
        const allIssues = await res.json()
        return allIssues.filter((i) =>
          (i.labels || []).some((l) =>
            (l.name || '').toLowerCase().includes('sentry')
          )
        )
      }
    } catch {
      // silent
    }
    return []
  }
}
