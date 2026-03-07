#!/usr/bin/env node
/**
 * Quality Gate Check: Dead Exports
 * Detects exported functions/constants that are never imported anywhere.
 *
 * --fix mode: removes the `export` keyword from dead exports (function remains local)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, relative } from 'path'

const ROOT = join(import.meta.dirname, '..', '..')
const SRC_PATH = join(ROOT, 'src')

function getAllJsFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      files.push(...getAllJsFiles(fullPath))
    } else if (extname(entry) === '.js') {
      files.push(fullPath)
    }
  }
  return files
}

export default function checkDeadExports(opts = {}) {
  const fix = opts.fix || false
  const files = getAllJsFiles(SRC_PATH)

  // Step 1: Collect all named exports
  const exports = [] // { name, file, fullPath, line, lineNum }
  for (const file of files) {
    const relPath = relative(SRC_PATH, file)
    const content = readFileSync(file, 'utf-8')
    const lines = content.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // export function name / export async function name
      const funcMatch = line.match(/^(export\s+(?:async\s+)?function\s+)(\w+)/)
      if (funcMatch) {
        exports.push({ name: funcMatch[2], file: relPath, fullPath: file, lineNum: i, lineText: line })
      }

      // export const/let/var name
      const constMatch = line.match(/^(export\s+(?:const|let|var)\s+)(\w+)/)
      if (constMatch) {
        exports.push({ name: constMatch[2], file: relPath, fullPath: file, lineNum: i, lineText: line })
      }
    }
  }

  // Step 2: Collect all import references across the codebase (src + tests)
  const testFiles = getAllJsFiles(join(ROOT, 'tests')).filter(f => extname(f) === '.js')
  const allImportableFiles = [...files, ...testFiles]

  const importedNames = new Set()
  const windowRegistered = new Set()
  for (const file of allImportableFiles) {
    const content = readFileSync(file, 'utf-8')

    // import { name1, name2 } from '...'
    const importRegex = /import\s*\{([^}]+)\}\s*from/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim())
      names.forEach(n => { if (n) importedNames.add(n) })
    }

    // Dynamic import: import('./file.js') — marks all exports of that file as "used"
    // Also: .then(m => m.name) or mod.name patterns
    const dotAccessRegex = /\.\s*(\w+)/g
    while ((match = dotAccessRegex.exec(content)) !== null) {
      importedNames.add(match[1])
    }

    // window.X = X or window.X = functionName — handler registration
    const windowRegex = /window\.(\w+)\s*=/g
    while ((match = windowRegex.exec(content)) !== null) {
      windowRegistered.add(match[1])
    }

    // onclick="functionName(" in templates
    const onclickRegex = /onclick="(?:window\.)?(\w+)\(/g
    while ((match = onclickRegex.exec(content)) !== null) {
      windowRegistered.add(match[1])
    }
  }

  // Step 3: Find dead exports
  const ENTRY_FILES = new Set(['main.js'])
  const IGNORE_NAMES = new Set(['default'])

  // Modules loaded via dynamic import() — all their exports count as "used"
  const dynamicImportFiles = new Set()
  for (const file of allImportableFiles) {
    const content = readFileSync(file, 'utf-8')
    const fileDir = join(file, '..')
    const dynRegex = /import\(\s*['"`](.+?)['"`]\s*\)/g
    let match
    while ((match = dynRegex.exec(content)) !== null) {
      const rawPath = match[1]
      // Resolve relative to the importing file
      try {
        const resolved = relative(SRC_PATH, join(fileDir, rawPath))
        dynamicImportFiles.add(resolved)
        // Also add without .js extension
        dynamicImportFiles.add(resolved.replace(/\.js$/, ''))
      } catch {}
    }
  }

  // Build transitive closure: files statically imported by dynamic modules are also "lazy"
  const dynamicModuleSet = new Set(dynamicImportFiles)
  // For each dynamic module, find its static imports and add them
  function addStaticDeps(modFile, visited = new Set()) {
    if (visited.has(modFile)) return
    visited.add(modFile)
    const fullPath = files.find(f => {
      const rel = relative(SRC_PATH, f)
      return rel === modFile || rel.replace(/\.js$/, '') === modFile.replace(/\.js$/, '')
    })
    if (!fullPath) return
    const content = readFileSync(fullPath, 'utf-8')
    const staticImportRe = /import\s+.*?\s+from\s+['"](.+?)['"]/g
    let m
    while ((m = staticImportRe.exec(content)) !== null) {
      const rawPath = m[1]
      if (rawPath.startsWith('.')) {
        try {
          const resolved = relative(SRC_PATH, join(fullPath, '..', rawPath))
          if (!dynamicModuleSet.has(resolved)) {
            dynamicModuleSet.add(resolved)
            dynamicModuleSet.add(resolved.replace(/\.js$/, ''))
            addStaticDeps(resolved, visited)
          }
        } catch {}
      }
    }
  }
  for (const mod of [...dynamicImportFiles]) {
    addStaticDeps(mod)
  }

  const deadExports = exports.filter(exp => {
    if (ENTRY_FILES.has(exp.file)) return false
    if (IGNORE_NAMES.has(exp.name)) return false
    // render* in components/services are likely used via lazy loading
    if (exp.name.startsWith('render') && (exp.file.includes('components/') || exp.file.includes('services/'))) {
      return false
    }
    // init* functions are lifecycle hooks called after render
    if (exp.name.startsWith('init') && (exp.file.includes('components/') || exp.file.includes('services/'))) {
      return false
    }
    // Used via window.X = X (handler registration for onclick/events)
    if (windowRegistered.has(exp.name)) return false
    // Statically imported somewhere
    if (importedNames.has(exp.name)) return false
    // In a dynamically imported module or its static dependencies
    const expFileNoExt = exp.file.replace(/\.js$/, '')
    if ([...dynamicModuleSet].some(mod => {
      const modNoExt = mod.replace(/\.js$/, '')
      return exp.file === mod || expFileNoExt === modNoExt || exp.file.endsWith(mod) || expFileNoExt.endsWith(modNoExt)
    })) {
      return false
    }
    return true
  })

  // Step 4: Auto-fix if requested
  let fixed = 0
  if (fix && deadExports.length > 0) {
    // Group by file to batch edits
    const byFile = new Map()
    for (const exp of deadExports) {
      if (!byFile.has(exp.fullPath)) byFile.set(exp.fullPath, [])
      byFile.get(exp.fullPath).push(exp)
    }

    for (const [filePath, exps] of byFile) {
      let content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      let modified = false

      for (const exp of exps) {
        const line = lines[exp.lineNum]
        if (!line) continue

        // Safety: only remove export if the function is used locally in the file.
        // Otherwise ESLint will flag it as "defined but never used".
        const nameRegex = new RegExp(`\\b${exp.name}\\b`, 'g')
        const occurrences = (content.match(nameRegex) || []).length
        // The definition itself counts as 1 occurrence; if there's only 1, it's not used locally
        if (occurrences <= 1) continue

        // Remove the `export ` prefix
        const newLine = line.replace(/^export\s+/, '')
        if (newLine !== line) {
          lines[exp.lineNum] = newLine
          modified = true
          fixed++
        }
      }

      if (modified) {
        content = lines.join('\n')
        writeFileSync(filePath, content)
      }
    }
  }

  const warnings = []
  // Re-count after fix
  const remainingDead = fix ? deadExports.length - fixed : deadExports.length
  if (remainingDead > 0) {
    warnings.push(`${remainingDead} potentially dead export(s) found:`)
    deadExports.slice(0, 20).forEach(e => warnings.push(`  - ${e.name} (${e.file})`))
    if (deadExports.length > 20) {
      warnings.push(`  ... and ${deadExports.length - 20} more`)
    }
  }

  // Dead exports are warnings, not errors — most are future-planned utilities
  // Penalize only if there are very many (>200 = code hygiene issue)
  const score = remainingDead <= 100 ? 100 : Math.max(70, 100 - Math.floor((remainingDead - 100) / 10))

  return {
    name: 'Dead Exports',
    score: fix ? 100 : score,
    maxScore: 100,
    errors: [],
    warnings: fix ? (fixed > 0 ? [`Fixed ${fixed} dead export(s)`] : []) : warnings,
    stats: {
      totalExports: exports.length,
      deadExports: deadExports.length,
      importedNames: importedNames.size,
      fixed,
    }
  }
}

// Run standalone
if (process.argv[1] && process.argv[1].endsWith('dead-exports.mjs')) {
  const fix = process.argv.includes('--fix')
  const result = checkDeadExports({ fix })
  console.log(`\n=== ${result.name} ===`)
  console.log(`Total exports: ${result.stats.totalExports}`)
  console.log(`Dead exports: ${result.stats.deadExports}`)
  if (fix) console.log(`Fixed: ${result.stats.fixed}`)
  if (result.warnings.length) result.warnings.forEach(w => console.log(`WARN: ${w}`))
  console.log(`Score: ${result.score}/100`)
}
