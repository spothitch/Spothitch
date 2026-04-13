#!/usr/bin/env node
/**
 * Dead File Detector
 * Finds JS files in src/ that are never imported by any other file.
 * Run: node scripts/check-dead-files.mjs
 * Add to CI to prevent dead code accumulation.
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, basename, relative } from 'path'

const SRC = 'src'
const IGNORE = [
  'src/main.js', // entry point
  'src/services/newDeviceNotification.js', // side-effect module, loaded lazily via window handler
]

function getAllJsFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...getAllJsFiles(full))
    } else if (entry.endsWith('.js')) {
      files.push(full)
    }
  }
  return files
}

const allFiles = getAllJsFiles(SRC)
const allContent = allFiles.map(f => ({ path: f, content: readFileSync(f, 'utf8') }))

const deadFiles = []

for (const file of allFiles) {
  const rel = relative('.', file)
  if (IGNORE.includes(rel)) continue

  const base = basename(file, '.js')

  // Check if any other file imports this one (static or dynamic)
  const isImported = allContent.some(other => {
    if (other.path === file) return false
    return other.content.includes(base) &&
      (other.content.includes(`from '`) || other.content.includes(`from "`) || other.content.includes(`import(`))
  })

  if (!isImported) {
    deadFiles.push(rel)
  }
}

if (deadFiles.length > 0) {
  console.error(`\n❌ Found ${deadFiles.length} dead file(s) in src/ (never imported):\n`)
  deadFiles.forEach(f => console.error(`  - ${f}`))
  console.error('\nRemove these files or add them to the IGNORE list in check-dead-files.mjs\n')
  process.exit(1)
} else {
  console.log('✅ No dead files found in src/')
}
