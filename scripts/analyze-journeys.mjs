#!/usr/bin/env node
/**
 * Mathematically enumerate the app's clickable surface: every on*="..." handler the user can
 * trigger, by screen/modal. This is the base for the real user-journey test plan (click the
 * actual buttons, not the handler in isolation).
 */
import { execSync } from 'child_process'
import fs from 'fs'

const files = execSync('find src -name "*.js"').toString().trim().split('\n')
const builtins = new Set(['if', 'for', 'while', 'return', 'function', 'fn', 'Number', 'String', 'Boolean', 'Array', 'Object', 'Event', 'CustomEvent', 'Date', 'Math', 'JSON', 'console', 'setTimeout', 'setInterval', 'clearTimeout', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation', 'dispatchEvent', 'addEventListener', 'removeEventListener', 'querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 'closest', 'forEach', 'map', 'filter', 'remove', 'add', 'toggle', 'contains', 'focus', 'blur', 'click', 'reload', 'scrollIntoView', 'scrollTo', 'setItem', 'getItem', 'removeItem', 'trim', 'slice', 'split', 'replace', 'includes', 'push', 'parseInt', 'parseFloat', 'escapeHtml', 'escapeHTML', 'escapeJSString', 'key', 'value', 'catch', 'then', 'event', 'window', 'document', 'this'])

const byFile = {}
const allCalls = new Set()
const callToFiles = {}
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8')
  const ev = [...t.matchAll(/on(click|input|change|submit|keydown|keyup|focus|blur|mousedown|mouseup|touchstart|touchend|touchmove)\s*=\s*"([^"]*)"/g)]
  const calls = new Set()
  for (const m of ev) {
    for (const c of m[2].matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g)) {
      const n = c[1]
      if (builtins.has(n)) continue
      calls.add(n); allCalls.add(n)
      ;(callToFiles[n] ||= new Set()).add(f.replace('src/', ''))
    }
  }
  if (calls.size) byFile[f.replace('src/', '')] = calls.size
}

console.log('=== CLICKABLE SURFACE (mathematical) ===')
console.log('Distinct clickable actions (on*= calls, excl. JS builtins):', allCalls.size)
console.log('')
console.log('By file (screen/modal) — top 45:')
Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 45).forEach(([f, n]) => console.log('  ' + String(n).padStart(3) + '  ' + f))
fs.writeFileSync('/tmp/clickable.json', JSON.stringify({ total: allCalls.size, byFile, actions: [...allCalls].sort() }, null, 2))
