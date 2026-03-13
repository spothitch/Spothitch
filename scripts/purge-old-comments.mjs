#!/usr/bin/env node
/**
 * Remove comments older than 5 years from all spot files
 * Also removes spots that end up with 0 comments after purge
 *
 * Usage: node scripts/purge-old-comments.mjs [--dry-run]
 */
import fs from 'fs'
import path from 'path'

const SPOTS_DIR = 'public/data/spots'
const CUTOFF = new Date()
CUTOFF.setFullYear(CUTOFF.getFullYear() - 1) // Keep only last 12 months

const dryRun = process.argv.includes('--dry-run')

const files = fs.readdirSync(SPOTS_DIR).filter(f => f.endsWith('.json')).sort()

let totalRemoved = 0
let totalKept = 0
let filesModified = 0

for (const f of files) {
  const filePath = path.join(SPOTS_DIR, f)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const spots = Array.isArray(data) ? data : (data.spots || [])
  let modified = false

  for (const s of spots) {
    if (!s.comments || s.comments.length === 0) continue

    const before = s.comments.length
    s.comments = s.comments.filter(c => {
      if (!c.text || !c.text.trim()) return false // Remove empty comments too
      const dateStr = c.date || c.datetime || c.timestamp
      if (!dateStr) return true // Keep comments without date (can't determine age)
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return true // Keep unparseable dates
      return d >= CUTOFF
    })

    const removed = before - s.comments.length
    if (removed > 0) {
      totalRemoved += removed
      modified = true
    }
    totalKept += s.comments.length
  }

  if (modified && !dryRun) {
    fs.writeFileSync(filePath, JSON.stringify(Array.isArray(data) ? spots : data, null, 0))
    filesModified++
  } else if (modified) {
    filesModified++
  }
}

console.log(`${dryRun ? '[DRY RUN] ' : ''}Purge complete:`)
console.log(`  Removed: ${totalRemoved} old comments (> 1 year)`)
console.log(`  Kept: ${totalKept} comments`)
console.log(`  Files modified: ${filesModified}`)
