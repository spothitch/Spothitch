import { execSync } from 'child_process'
import fs from 'fs'

const files = execSync('find src -name "*.js"').toString().trim().split('\n')
const builtins = new Set(['if', 'for', 'while', 'return', 'function', 'fn', 'Number', 'String', 'Boolean', 'Array', 'Object', 'Event', 'CustomEvent', 'Date', 'Math', 'JSON', 'console', 'setTimeout', 'setInterval', 'clearTimeout', 'preventDefault', 'stopPropagation', 'stopImmediatePropagation', 'dispatchEvent', 'addEventListener', 'removeEventListener', 'querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 'closest', 'forEach', 'map', 'filter', 'remove', 'add', 'toggle', 'contains', 'focus', 'blur', 'click', 'reload', 'scrollIntoView', 'scrollTo', 'setItem', 'getItem', 'removeItem', 'trim', 'slice', 'split', 'replace', 'includes', 'push', 'parseInt', 'parseFloat', 'escapeHtml', 'escapeHTML', 'escapeJSString', 'key', 'value', 'catch', 'then', 'event', 'window', 'document', 'this'])

const target = process.argv[2] // optional file filter
for (const f of files) {
  if (target && !f.includes(target)) continue
  const t = fs.readFileSync(f, 'utf8')
  const ev = [...t.matchAll(/on(click|input|change|submit|keydown|keyup|focus|blur|mousedown|mouseup|touchstart|touchend|touchmove)\s*=\s*"([^"]*)"/g)]
  const calls = new Set()
  for (const m of ev) for (const c of m[2].matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g)) { if (!builtins.has(c[1])) calls.add(c[1]) }
  if (calls.size) console.log('\n## ' + f.replace('src/', '') + ' (' + calls.size + ')\n' + [...calls].sort().join(', '))
}
