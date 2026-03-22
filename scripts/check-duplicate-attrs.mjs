#!/usr/bin/env node
/**
 * check-duplicate-attrs.mjs
 * Scans JS/HTML files for duplicate HTML attributes on the same element.
 * Catches: two class="" on one tag, two style="" on one tag, etc.
 *
 * Usage:
 *   node scripts/check-duplicate-attrs.mjs                 # scan all src JS files
 *   node scripts/check-duplicate-attrs.mjs file1.js ...   # scan specific files
 *
 * Exit code 0 = clean, 1 = duplicates found
 */

import { readFileSync } from 'fs'
import { glob } from 'glob'

const ATTRS_TO_CHECK = ['class', 'style', 'id']

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const errors = []

  // Extract individual HTML tags (including multi-line) and check each one.
  // A tag starts with < and ends with > or />
  // We track opening < that are NOT </ (closing tags)
  let tagBuffer = ''
  let tagStartLine = -1
  let depth = 0 // track nested < within the tag buffer

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip JS comments
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue

    for (let c = 0; c < line.length; c++) {
      const ch = line[c]

      if (tagBuffer === '' && ch === '<' && line[c + 1] !== '/') {
        // Start of a new opening tag
        tagBuffer = '<'
        tagStartLine = i
        depth = 1
      } else if (tagBuffer !== '') {
        tagBuffer += ch

        if (ch === '<') depth++
        if (ch === '>') {
          depth--
          if (depth <= 0) {
            // End of tag — check for duplicate attrs
            checkTag(tagBuffer, tagStartLine, i, filePath, errors)
            tagBuffer = ''
            tagStartLine = -1
            depth = 0
          }
        }
      }
    }

    if (tagBuffer !== '') {
      tagBuffer += '\n'
    }

    // Safety: if buffer is too large, it's not a real HTML tag
    if (tagBuffer.length > 3000) {
      tagBuffer = ''
      tagStartLine = -1
      depth = 0
    }
  }

  return errors
}

function checkTag(tag, startLine, endLine, file, errors) {
  // Only check the FIRST level tag (not nested tags inside)
  // Find the first > to isolate just the opening tag's attributes
  // But we need to handle nested tags inside attribute values like onclick="<div..."
  // Simpler approach: split by lines and look for duplicate attr= on different lines
  // within the same tag, EXCLUDING lines that start a new nested tag

  // Remove the tag name and extract attribute area
  // e.g. <div class="a" class="b" onclick="..."> → isolate attributes
  const firstClose = tag.indexOf('>')
  if (firstClose < 0) return

  const tagHead = tag.substring(0, firstClose + 1)

  // Check if this tag head contains nested < (nested elements inside attributes)
  // If so, only consider up to the first nested <
  const firstNestedOpen = tagHead.indexOf('<', 1)
  const attrArea = firstNestedOpen > 0 ? tagHead.substring(0, firstNestedOpen) : tagHead

  for (const attr of ATTRS_TO_CHECK) {
    // Match standalone attr=" (word boundary before, = after)
    const regex = new RegExp(`(?:^|\\s)${attr}=`, 'g')
    const matches = [...attrArea.matchAll(regex)]
    if (matches.length >= 2) {
      errors.push({
        file,
        attr,
        startLine: startLine + 1,
        endLine: endLine + 1,
        preview: attrArea.trim().substring(0, 200),
      })
    }
  }
}

// Main
const args = process.argv.slice(2)
let files

if (args.length > 0) {
  files = args.filter(f => f.endsWith('.js') || f.endsWith('.html'))
} else {
  files = await glob('src/**/*.js')
}

let totalErrors = 0

for (const file of files) {
  try {
    const errs = scanFile(file)
    for (const err of errs) {
      totalErrors++
      console.error(`\n❌ Duplicate "${err.attr}" in ${err.file} (lines ${err.startLine}-${err.endLine}):`)
      console.error(`   ${err.preview}`)
    }
  } catch {
    // File might not exist (deleted), skip
  }
}

if (totalErrors > 0) {
  console.error(`\n🚫 Found ${totalErrors} duplicate HTML attribute(s). Fix before committing.`)
  console.error('   HTML ignores duplicate attributes — only the first one is used.\n')
  process.exit(1)
} else {
  if (args.length === 0) {
    console.log('✅ No duplicate HTML attributes found.')
  }
  process.exit(0)
}
