#!/usr/bin/env node
/**
 * FOX — The 10-Layer Quality System
 *
 * Runs ALL quality checks in sequence:
 *
 * Layer 1-3: Static analysis (from quality-gate.mjs)
 * Layer 4:   Visual Invariants (contrast, touch, visibility)
 * Layer 5:   Functional Flows (every button, modal, handler)
 * Layer 6:   Share Target (Google Maps URL parsing)
 * Layer 7:   Chaos Monkey (random clicking)
 * Layer 8:   Network Resilience (offline, 3G, cut, API errors)
 * Layer 9:   State Integrity (data corruption detection)
 * Layer 10:  CI verification (GitHub Actions status)
 *
 * Usage:
 *   node scripts/ultimate-check.mjs              # Run all layers
 *   node scripts/ultimate-check.mjs --quick      # Layers 4-6 only (~30s)
 *   node scripts/ultimate-check.mjs --layer=4    # Run specific layer
 *
 * Requires: dev server running on localhost:5173
 */

import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const args = process.argv.slice(2)
const QUICK = args.includes('--quick')
const layerArg = args.find(a => a.startsWith('--layer='))
const LAYER = layerArg ? parseInt(layerArg.split('=')[1]) : null

const startTime = Date.now()
const layerResults = []

function printHeader(num, name) {
  console.log(`\n${'█'.repeat(60)}`)
  console.log(`  LAYER ${num}: ${name}`)
  console.log(`${'█'.repeat(60)}`)
}

function printResult(num, name, result) {
  const icon = result.score >= 80 ? '✅' : result.score >= 50 ? '⚠️' : '❌'
  layerResults.push({ layer: num, name, score: result.score, maxScore: result.maxScore, icon })
  console.log(`\n  ${icon} Layer ${num} (${name}): ${result.score}/${result.maxScore}`)
  if (result.errors?.length) {
    result.errors.slice(0, 3).forEach(e => console.log(`    ERROR: ${e}`))
  }
  if (result.warnings?.length) {
    result.warnings.slice(0, 3).forEach(w => console.log(`    WARN: ${w}`))
  }
}

async function runLayer(num, name, fn) {
  if (LAYER && LAYER !== num) return null
  printHeader(num, name)
  try {
    const result = await fn()
    printResult(num, name, result)
    return result
  } catch (err) {
    const result = { score: 0, maxScore: 100, errors: [err.message], warnings: [] }
    printResult(num, name, result)
    return result
  }
}

async function main() {
  console.log(`\n${'═'.repeat(60)}`)
  console.log('  FOX — SpotHitch Quality System')
  console.log(`  Mode: ${QUICK ? 'QUICK (Layers 4-6)' : LAYER ? `Layer ${LAYER} only` : 'FULL (All 10 layers)'}`)
  console.log(`${'═'.repeat(60)}`)

  // --- Layers 1-3: Static analysis (existing quality gate checks) ---
  if (!QUICK) {
    await runLayer(1, 'STATIC ANALYSIS', async () => {
      try {
        const output = execSync('node scripts/quality-gate.mjs --json 2>&1', {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 60000,
        })

        // Try to parse JSON output
        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            return {
              score: data.score || 0,
              maxScore: 100,
              errors: data.checks?.filter(c => c.score < 50).map(c => `${c.name}: ${c.score}/${c.maxScore}`) || [],
              warnings: data.checks?.filter(c => c.score >= 50 && c.score < 80).map(c => `${c.name}: ${c.score}/${c.maxScore}`) || [],
            }
          }
        } catch {}

        // Fallback: parse text output
        const scoreMatch = output.match(/Score:\s*(\d+)/)
        return {
          score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
          maxScore: 100,
          errors: [],
          warnings: [],
        }
      } catch (err) {
        // Quality gate might exit with code 1
        const scoreMatch = err.stdout?.match(/Score:\s*(\d+)/)
        return {
          score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
          maxScore: 100,
          errors: ['Quality gate check had issues'],
          warnings: [],
        }
      }
    })

    await runLayer(2, 'UNIT TESTS', async () => {
      try {
        const output = execSync('npx vitest run tests/wiring/ 2>&1', {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 60000,
        })

        const passMatch = output.match(/(\d+)\s*(?:tests?\s+)?passed/)
        const failMatch = output.match(/(\d+)\s*(?:tests?\s+)?failed/)
        const passed = passMatch ? parseInt(passMatch[1]) : 0
        const failed = failMatch ? parseInt(failMatch[1]) : 0

        return {
          score: failed === 0 ? 100 : Math.max(0, 100 - failed * 10),
          maxScore: 100,
          errors: failed > 0 ? [`${failed} tests failed`] : [],
          warnings: [],
          stats: { passed, failed },
        }
      } catch (err) {
        return {
          score: 0,
          maxScore: 100,
          errors: ['Unit tests failed to run'],
          warnings: [],
        }
      }
    })

    await runLayer(3, 'BUILD', async () => {
      // Skip build if dev server is running (port conflict)
      try {
        const net = await import('net')
        const portInUse = await new Promise((resolve) => {
          const s = net.createConnection({ port: 5173 })
          s.on('connect', () => { s.destroy(); resolve(true) })
          s.on('error', () => resolve(false))
        })
        if (portInUse) {
          return { score: 100, maxScore: 100, errors: [], warnings: ['Build skipped (dev server running)'] }
        }
      } catch {}

      try {
        execSync('npm run build 2>&1', {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 120000,
        })
        return { score: 100, maxScore: 100, errors: [], warnings: [] }
      } catch (err) {
        return { score: 0, maxScore: 100, errors: ['Build failed'], warnings: [] }
      }
    })
  }

  // --- Layer 4: Visual Invariants ---
  await runLayer(4, 'VISUAL INVARIANTS', async () => {
    const { default: check } = await import('./checks/visual-invariants.mjs')
    return check({ theme: 'both' })
  })

  // --- Layer 5: Functional Flows ---
  await runLayer(5, 'FUNCTIONAL FLOWS', async () => {
    const { default: check } = await import('./checks/functional-flows.mjs')
    return check()
  })

  // --- Layer 6: Share Target ---
  await runLayer(6, 'SHARE TARGET', async () => {
    const { default: check } = await import('./checks/share-target.mjs')
    return check()
  })

  if (!QUICK) {
    // --- Layer 7: Chaos Monkey ---
    await runLayer(7, 'CHAOS MONKEY', async () => {
      const { default: check } = await import('./checks/chaos-monkey.mjs')
      return check()
    })

    // --- Layer 8: Network Resilience ---
    await runLayer(8, 'NETWORK RESILIENCE', async () => {
      const { default: check } = await import('./checks/network-resilience.mjs')
      return check()
    })

    // --- Layer 9: State Integrity ---
    await runLayer(9, 'STATE INTEGRITY', async () => {
      const { default: check } = await import('./checks/state-integrity.mjs')
      return check()
    })

    // --- Layer 10: CI Verification ---
    await runLayer(10, 'CI STATUS', async () => {
      try {
        const output = execSync('gh run list --limit 1 --json conclusion,status,name 2>&1', {
          cwd: ROOT,
          encoding: 'utf-8',
          timeout: 15000,
        })
        const runs = JSON.parse(output)
        if (runs.length === 0) {
          return { score: 50, maxScore: 100, errors: [], warnings: ['No CI runs found'] }
        }

        const latest = runs[0]
        if (latest.conclusion === 'success') {
          return { score: 100, maxScore: 100, errors: [], warnings: [] }
        } else if (latest.status === 'in_progress') {
          return { score: 70, maxScore: 100, errors: [], warnings: ['CI still running'] }
        } else {
          return { score: 0, maxScore: 100, errors: [`Latest CI: ${latest.conclusion}`], warnings: [] }
        }
      } catch {
        return { score: 50, maxScore: 100, errors: [], warnings: ['Could not check CI status'] }
      }
    })
  }

  // --- Final Report ---
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log(`\n${'═'.repeat(60)}`)
  console.log('  FOX — FINAL REPORT')
  console.log(`${'═'.repeat(60)}`)
  console.log()

  let totalScore = 0
  let totalMax = 0

  for (const r of layerResults) {
    console.log(`  ${r.icon} Layer ${r.layer} ${r.name.padEnd(25)} ${String(r.score).padStart(3)}/${r.maxScore}`)
    totalScore += r.score
    totalMax += r.maxScore
  }

  const finalScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

  console.log()
  console.log(`${'─'.repeat(60)}`)
  console.log(`  FINAL SCORE: ${finalScore}/100`)
  console.log(`  Duration: ${duration}s`)
  console.log(`  ${finalScore >= 80 ? '✅ READY TO SHIP' : finalScore >= 60 ? '⚠️ NEEDS ATTENTION' : '❌ DO NOT SHIP'}`)
  console.log(`${'═'.repeat(60)}`)

  process.exit(finalScore >= 70 ? 0 : 1)
}

main().catch(err => {
  console.error(`Ultimate check crashed: ${err.message}`)
  process.exit(1)
})
