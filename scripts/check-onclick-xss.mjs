#!/usr/bin/env node
/**
 * XSS Scanner: onclick handlers with unescaped template variables
 * Finds onclick="handler('${variable}')" without escapeJSString
 * Run: node scripts/check-onclick-xss.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const SRC = 'src'
// Pattern: onclick="...('${xxx}')..." without escapeJSString
const UNSAFE_PATTERN = /onclick="[^"]*'\$\{(?!escapeJSString|escapeHTML|Number\(|parseInt\(|JSON\.|t\(')[^}]+\}[^"]*"/g
const SAFE_EXCEPTIONS = [
  /\$\{isSignUp/,        // hardcoded ternary
  /\$\{d\}/,             // single-char loop var (delay value)
  /toFixed/,             // numeric
]

function getAllJsFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...getAllJsFiles(full))
    else if (entry.endsWith('.js')) files.push(full)
  }
  return files
}

let issues = 0
for (const file of getAllJsFiles(SRC)) {
  const content = readFileSync(file, 'utf8')
  const lines = content.split('\n')

  lines.forEach((line, i) => {
    const matches = line.match(UNSAFE_PATTERN)
    if (!matches) return

    for (const match of matches) {
      // Check if it's a known safe exception
      if (SAFE_EXCEPTIONS.some(re => re.test(match))) continue

      issues++
      console.error(`  ${file}:${i + 1}: ${match.slice(0, 100)}...`)
    }
  })
}

if (issues > 0) {
  console.error(`\n❌ Found ${issues} onclick handler(s) with unescaped template variables`)
  console.error('Fix: wrap variables with escapeJSString()')
  // Don't exit(1) yet — there are still some borderline cases (hardcoded enums)
  // TODO: make this blocking once all are fixed
} else {
  console.log('✅ No unescaped onclick handlers found')
}
