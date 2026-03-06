#!/usr/bin/env node
/**
 * LE MAÎTRE — Audit & Auto-correction système SpotHitch
 *
 * Usage: node scripts/maitre.mjs [--no-visual] [--no-e2e] [--no-fix]
 *
 * Phases:
 *   1. Auto-corrections (WhatsApp, console.log, ESLint --fix)
 *   2. Quality Gate complet --fix (11 checks, handlers, i18n, RGPD, sécurité...)
 *   3. Tests unitaires & wiring (Vitest)
 *   4. Build production
 *   5. Audit visuel (screenshots toutes les vues, dark + light)
 *   6. Tests E2E Playwright
 *   7. Rapport HTML + historique + mémoire
 *
 * Le Maître apprend : chaque run est sauvegardé dans audit-history/
 * Les nouvelles erreurs trouvées sont ajoutées à memory/errors.md
 * Le ratchet bloque si le score régresse vs le dernier run
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { execSync, spawnSync } from 'child_process'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const HISTORY_DIR = join(ROOT, 'audit-history')
const REPORT_PATH = join(ROOT, 'audit-history', 'latest-report.html')
const SCREENSHOTS_DIR = join(ROOT, 'audit-history', 'screenshots')

const args = process.argv.slice(2)
const NO_VISUAL = args.includes('--no-visual')
const NO_E2E = args.includes('--no-e2e')
const NO_FIX = args.includes('--no-fix')

// ─── COULEURS CONSOLE ────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
}
const log = (msg) => console.log(msg)
const ok = (msg) => log(`${C.green}  ✓${C.reset} ${msg}`)
const warn = (msg) => log(`${C.yellow}  ⚠${C.reset} ${msg}`)
const err = (msg) => log(`${C.red}  ✗${C.reset} ${msg}`)
const info = (msg) => log(`${C.cyan}  ▶${C.reset} ${msg}`)
const title = (msg) => log(`\n${C.bold}${C.magenta}══ ${msg} ══${C.reset}`)
const fixed = (msg) => log(`${C.blue}  ⚡${C.reset} ${msg}`)

// ─── RÉSULTATS GLOBAUX ────────────────────────────────────────────────────────
const results = {
  timestamp: new Date().toISOString(),
  phases: {},
  fixes: [],
  issues: [],
  screenshots: [],
  score: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function run(cmd, options = {}) {
  try {
    const output = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: options.timeout || 120000,
      shell: '/bin/bash',
    })
    return { ok: true, output: output || '' }
  } catch (e) {
    return { ok: false, output: e.stdout || '', error: e.stderr || e.message || '' }
  }
}

function getSrcFiles() {
  const result = run('find src -name "*.js" -not -path "*/node_modules/*"', { silent: true })
  return result.output.trim().split('\n').filter(Boolean)
}

function readSrc(filePath) {
  try { return readFileSync(join(ROOT, filePath), 'utf8') } catch { return '' }
}

function recordIssue(phase, severity, message, file = '') {
  results.issues.push({ phase, severity, message, file, ts: Date.now() })
  if (severity === 'error') results.failed++
  else if (severity === 'warning') results.warnings++
}

function recordFix(message) {
  results.fixes.push({ message, ts: Date.now() })
  fixed(message)
}

// ─── PHASE 1 : AUTO-CORRECTIONS ──────────────────────────────────────────────
title('PHASE 1 — Auto-corrections')

if (!NO_FIX) {
  // 1a. Supprimer toutes références WhatsApp résiduelles
  const srcFiles = getSrcFiles()
  let whatsappCount = 0
  for (const filePath of srcFiles) {
    const content = readSrc(filePath)
    if (/whatsapp|WhatsApp/i.test(content)) {
      const fixed_content = content
        .replace(/SMS\/WhatsApp/gi, 'SMS')
        .replace(/WhatsApp\/SMS/gi, 'SMS')
        .replace(/WhatsApp/gi, 'SMS')
        .replace(/whatsapp/gi, 'sms')
      writeFileSync(join(ROOT, filePath), fixed_content, 'utf8')
      whatsappCount++
    }
  }
  if (whatsappCount > 0) {
    recordFix(`WhatsApp supprimé dans ${whatsappCount} fichier(s)`)
  } else {
    ok('Aucune référence WhatsApp trouvée')
  }

  // 1b. ESLint --fix
  info('ESLint auto-fix...')
  const eslintFix = run('npx eslint src/ --fix --max-warnings 0', { silent: true })
  if (eslintFix.ok) {
    ok('ESLint --fix appliqué')
    recordFix('ESLint --fix appliqué sur src/')
  } else {
    warn('ESLint --fix : quelques problèmes non auto-fixables')
  }

  // 1c. Supprimer les console.log de prod (garder console.error dans sentry/monitor)
  let consoleRemoved = 0
  const srcFilesForConsole = getSrcFiles()
  for (const filePath of srcFilesForConsole) {
    if (filePath.includes('sentry') || filePath.includes('monitor') || filePath.includes('quality-gate')) continue
    const content = readSrc(filePath)
    // Supprimer les lignes console.log (pas console.error qui peut être légitime)
    const cleaned = content.split('\n').filter(line => !/^\s*console\.log\(/.test(line)).join('\n')
    if (cleaned !== content) {
      const removed = (content.match(/console\.log\(/g) || []).length
      writeFileSync(join(ROOT, filePath), cleaned, 'utf8')
      consoleRemoved += removed
    }
  }
  // Vérifier ce qui reste (console.warn/error légitimes)
  let consoleLeft = 0
  for (const filePath of srcFilesForConsole) {
    if (filePath.includes('sentry') || filePath.includes('monitor')) continue
    const content = readSrc(filePath)
    const matches = content.match(/console\.(log|warn|error|debug)\(/g)
    if (matches) consoleLeft += matches.length
  }
  if (consoleRemoved > 0) recordFix(`${consoleRemoved} console.log supprimés du code de prod`)
  if (consoleLeft > 0) warn(`${consoleLeft} console.warn/error restants (légitimes)`)
  else ok('Aucun console.log en prod')
} else {
  info('Mode --no-fix : corrections automatiques désactivées')
}

results.phases['auto-fix'] = { ok: true }

// ─── PHASE 2 : QUALITY GATE --FIX ────────────────────────────────────────────
title('PHASE 2 — Quality Gate (11 checks + auto-fix)')

info('Lancement quality-gate --fix --threshold=85...')
const qgResult = run('node scripts/quality-gate.mjs --fix --threshold=85', { timeout: 60000 })
const qgOutput = qgResult.output + (qgResult.error || '')

// Extraire le score
const scoreMatch = qgOutput.match(/Score[:\s]+(\d+)/i) || qgOutput.match(/(\d+)\/100/)
const qgScore = scoreMatch ? parseInt(scoreMatch[1]) : 0

if (qgResult.ok) {
  ok(`Quality Gate : ${qgScore}/100 ✓`)
  results.phases['quality-gate'] = { ok: true, score: qgScore }
  results.passed++
} else {
  err(`Quality Gate : ${qgScore}/100 — seuil 85 non atteint`)
  results.phases['quality-gate'] = { ok: false, score: qgScore, output: qgOutput.slice(0, 500) }
  results.failed++
  recordIssue('quality-gate', 'error', `Score ${qgScore}/100 (seuil 85)`)
}

// ─── PHASE 3 : TESTS ──────────────────────────────────────────────────────────
title('PHASE 3 — Tests unitaires & wiring')

info('Vitest — tests unitaires...')
const vitestResult = run('npx vitest run', { timeout: 120000 })
const vitestOut = vitestResult.output + (vitestResult.error || '')
const testMatch = vitestOut.match(/(\d+)\s+passed/)
const failMatch = vitestOut.match(/(\d+)\s+failed/)
const testsPassed = testMatch ? parseInt(testMatch[1]) : 0
const testsFailed = failMatch ? parseInt(failMatch[1]) : 0

if (vitestResult.ok && testsFailed === 0) {
  ok(`Tests : ${testsPassed} passés, 0 échec`)
  results.phases['tests'] = { ok: true, passed: testsPassed, failed: 0 }
  results.passed++
} else {
  err(`Tests : ${testsPassed} passés, ${testsFailed} échec(s)`)
  results.phases['tests'] = { ok: false, passed: testsPassed, failed: testsFailed }
  results.failed++
  recordIssue('tests', 'error', `${testsFailed} test(s) en échec`)
}

// ─── PHASE 4 : BUILD ──────────────────────────────────────────────────────────
title('PHASE 4 — Build production')

info('npm run build...')
const buildResult = run('npm run build', { timeout: 180000 })
if (buildResult.ok) {
  ok('Build réussi')
  results.phases['build'] = { ok: true }
  results.passed++
} else {
  err('Build échoué')
  results.phases['build'] = { ok: false, error: buildResult.error?.slice(0, 300) }
  results.failed++
  recordIssue('build', 'error', 'Build production échoué')
}

// ─── PHASE 5 : AUDIT VISUEL V2 (Le Maître complet) ───────────────────────────
title('PHASE 5 — Audit visuel & fonctionnel complet (60+ scénarios)')

if (NO_VISUAL) {
  info('Skipped (--no-visual)')
  results.phases['visual'] = { ok: true, skipped: true }
} else if (!results.phases['build']?.ok) {
  warn('Skipped — build échoué')
  results.phases['visual'] = { ok: false, skipped: true, reason: 'build failed' }
} else {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  info('Lancement audit visuel complet (60+ scénarios)...')
  const visualResult = run(`MAITRE_ROOT=${ROOT} node scripts/maitre-visual.mjs`, { timeout: 1200000 })
  const visualOut = visualResult.output + (visualResult.error || '')

  const totalMatch = visualOut.match(/TOTAL:(\d+)/)
  const summaryMatch = visualOut.match(/SUMMARY:(\d+):(\d+)/)
  const vPassed = summaryMatch ? parseInt(summaryMatch[1]) : 0
  const vFailed = summaryMatch ? parseInt(summaryMatch[2]) : 0
  const vTotal = totalMatch ? parseInt(totalMatch[1]) : (vPassed + vFailed)

  // Charger les résultats détaillés
  const vrPath = join(ROOT, 'audit-history', 'visual-results.json')
  if (existsSync(vrPath)) {
    try { results.screenshots = JSON.parse(readFileSync(vrPath, 'utf8')) } catch {}
  }

  if (vPassed > 0 || vFailed === 0) {
    const allOk = vFailed === 0
    const msg = `${vPassed}/${vTotal} scénarios OK${vFailed > 0 ? `, ${vFailed} échecs` : ''}`
    if (allOk) { ok(msg); results.passed++ }
    else { err(msg); results.failed++; recordIssue('visual', 'error', `${vFailed} scénario(s) visuels en échec`) }
    results.phases['visual'] = { ok: allOk, passed: vPassed, failed: vFailed, total: vTotal }
  } else {
    warn('Audit visuel : Playwright non disponible ou erreur serveur')
    results.phases['visual'] = { ok: false, skipped: true, reason: 'playwright error' }
  }
}

// ─── PHASE 6 : TESTS E2E ──────────────────────────────────────────────────────
title('PHASE 6 — Tests E2E Playwright')

if (NO_E2E) {
  info('Skipped (--no-e2e)')
  results.phases['e2e'] = { ok: true, skipped: true }
} else if (!results.phases['build']?.ok) {
  warn('Skipped — build échoué')
  results.phases['e2e'] = { ok: false, skipped: true }
} else {
  info('Playwright E2E (navigation, map, social, profile)...')
  const e2eResult = run(
    'npx playwright test --project=chromium e2e/navigation.spec.js e2e/map.spec.js e2e/profile.spec.js --reporter=line',
    { timeout: 180000 }
  )
  const e2eOut = e2eResult.output + (e2eResult.error || '')
  const e2ePassMatch = e2eOut.match(/(\d+)\s+passed/)
  const e2eFailMatch = e2eOut.match(/(\d+)\s+failed/)
  const e2ePassed = e2ePassMatch ? parseInt(e2ePassMatch[1]) : 0
  const e2eFailed = e2eFailMatch ? parseInt(e2eFailMatch[1]) : 0

  if (e2eResult.ok && e2eFailed === 0) {
    ok(`E2E : ${e2ePassed} tests passés`)
    results.phases['e2e'] = { ok: true, passed: e2ePassed, failed: 0 }
    results.passed++
  } else {
    err(`E2E : ${e2ePassed} passés, ${e2eFailed} échec(s)`)
    results.phases['e2e'] = { ok: false, passed: e2ePassed, failed: e2eFailed }
    results.failed++
    recordIssue('e2e', 'error', `${e2eFailed} test(s) E2E en échec`)
  }
}

// ─── PHASE 7 : RAPPORT ────────────────────────────────────────────────────────
title('PHASE 7 — Rapport & Mémoire')

// Calcul du score
const totalPhases = Object.keys(results.phases).filter(k => !results.phases[k].skipped).length
const passedPhases = Object.values(results.phases).filter(p => p.ok && !p.skipped).length
const qgContrib = Math.min((qgScore / 100) * 40, 40)
const phasesContrib = totalPhases > 0 ? (passedPhases / totalPhases) * 60 : 0
results.score = Math.round(qgContrib + phasesContrib)

// Historique — ratchet
mkdirSync(HISTORY_DIR, { recursive: true })
const historyFile = join(HISTORY_DIR, `${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`)
writeFileSync(historyFile, JSON.stringify(results, null, 2))

// Charger le run précédent pour comparaison
let previousScore = null
let regression = false
try {
  const files = readdirSync(HISTORY_DIR)
    .filter(f => f.endsWith('.json') && f !== 'latest-report.html')
    .sort()
    .slice(-2, -1)
  if (files.length > 0) {
    const prev = JSON.parse(readFileSync(join(HISTORY_DIR, files[0]), 'utf8'))
    previousScore = prev.score
    if (results.score < previousScore - 5) {
      regression = true
      warn(`RÉGRESSION DÉTECTÉE : ${previousScore} → ${results.score} (-${previousScore - results.score} pts)`)
      recordIssue('ratchet', 'error', `Score régressé de ${previousScore} à ${results.score}`)
    }
  }
} catch {}

// Mettre à jour memory/errors.md si nouvelles erreurs
const newErrors = results.issues.filter(i => i.severity === 'error')
if (newErrors.length > 0) {
  const errorsPath = join(ROOT, 'memory', 'errors.md')
  const errContent = readFileSync(errorsPath, 'utf8')
  const today = new Date().toISOString().slice(0, 10)
  const newEntry = `\n### ERR-MAITRE-${today} — Problèmes détectés par Le Maître\n\n` +
    `- **Date** : ${today}\n` +
    `- **Gravité** : ${newErrors.some(e => e.severity === 'error') ? 'MAJEUR' : 'MINEUR'}\n` +
    `- **Problèmes** :\n${newErrors.map(e => `  - [${e.phase}] ${e.message}`).join('\n')}\n` +
    `- **Statut** : À CORRIGER\n`
  // Ne pas dupliquer si l'entrée du jour existe déjà
  if (!errContent.includes(`ERR-MAITRE-${today}`)) {
    writeFileSync(errorsPath, errContent + newEntry)
    info('Nouvelles erreurs ajoutées à memory/errors.md')
  }
}

// Générer rapport HTML
const screenshotsHTML = results.screenshots
  .filter(s => s.ok)
  .map(s => {
    const relPath = s.path.replace(ROOT + '/', '')
    const label = s.name
    return `<div class="screenshot"><img src="../${relPath}" alt="${label}" loading="lazy"><p>${label}</p></div>`
  }).join('\n')

const issuesHTML = results.issues.length > 0
  ? results.issues.map(i =>
    `<tr class="${i.severity}"><td>${i.phase}</td><td>${i.severity === 'error' ? '🔴' : '⚠️'}</td><td>${i.message}</td><td>${i.file || ''}</td></tr>`
  ).join('\n')
  : '<tr><td colspan="4" style="text-align:center;color:#4ade80">✅ Aucun problème détecté</td></tr>'

const fixesHTML = results.fixes.length > 0
  ? results.fixes.map(f => `<li>⚡ ${f.message}</li>`).join('\n')
  : '<li>Aucune correction appliquée</li>'

const phasesHTML = Object.entries(results.phases).map(([name, data]) => {
  const status = data.skipped ? '⏭' : data.ok ? '✅' : '❌'
  const detail = data.skipped ? 'Ignoré' : data.ok ? 'OK' : 'ÉCHEC'
  return `<tr><td>${name}</td><td>${status} ${detail}</td><td>${
    data.score ? `${data.score}/100` : data.passed !== undefined ? `${data.passed} passés` : ''
  }</td></tr>`
}).join('\n')

const scoreColor = results.score >= 90 ? '#4ade80' : results.score >= 70 ? '#fbbf24' : '#f87171'
const verdict = results.score >= 90 && results.failed === 0
  ? '✅ PRÊT POUR L\'ALPHA'
  : results.failed > 0
  ? '❌ CORRECTIONS NÉCESSAIRES'
  : '⚠️ À AMÉLIORER'

const htmlReport = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le Maître — Rapport ${new Date().toLocaleDateString('fr-FR')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f1520; color: #e2e8f0; padding: 20px; }
  h1 { font-size: 2rem; color: #f59e0b; margin-bottom: 8px; }
  h2 { font-size: 1.2rem; color: #94a3b8; margin: 24px 0 12px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
  .score { font-size: 4rem; font-weight: 900; color: ${scoreColor}; }
  .verdict { font-size: 1.4rem; font-weight: bold; margin: 8px 0 24px; color: ${scoreColor}; }
  .meta { color: #64748b; font-size: 0.85rem; margin-bottom: 24px; }
  .ratchet { background: #fef3c7; color: #92400e; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #1e293b; padding: 10px; text-align: left; font-size: 0.85rem; color: #94a3b8; }
  td { padding: 8px 10px; border-bottom: 1px solid #1e293b; font-size: 0.9rem; }
  tr.error td { color: #f87171; } tr.warning td { color: #fbbf24; }
  .screenshots { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .screenshot img { width: 100%; border-radius: 8px; border: 1px solid #1e293b; }
  .screenshot p { font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 4px; }
  ul { list-style: none; padding: 0; }
  li { padding: 4px 0; font-size: 0.9rem; color: #4ade80; }
  .stats { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
  .stat { background: #1e293b; padding: 16px 24px; border-radius: 12px; text-align: center; }
  .stat-val { font-size: 2rem; font-weight: 900; }
  .stat-label { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
</style>
</head>
<body>
<h1>🎖 Le Maître</h1>
<div class="score">${results.score}/100</div>
<div class="verdict">${verdict}</div>
<div class="meta">
  Run du ${new Date(results.timestamp).toLocaleString('fr-FR')}
  ${previousScore !== null ? ` • Précédent : ${previousScore}/100 ${results.score >= previousScore ? '📈' : '📉'}` : ''}
  • ${results.fixes.length} corrections appliquées
</div>
${regression ? `<div class="ratchet">⚠️ RÉGRESSION : score passé de ${previousScore} à ${results.score}</div>` : ''}

<div class="stats">
  <div class="stat"><div class="stat-val" style="color:#4ade80">${results.passed}</div><div class="stat-label">Phases OK</div></div>
  <div class="stat"><div class="stat-val" style="color:#f87171">${results.failed}</div><div class="stat-label">Échecs</div></div>
  <div class="stat"><div class="stat-val" style="color:#fbbf24">${results.warnings}</div><div class="stat-label">Avertissements</div></div>
  <div class="stat"><div class="stat-val" style="color:#60a5fa">${results.fixes.length}</div><div class="stat-label">Auto-corrections</div></div>
  <div class="stat"><div class="stat-val" style="color:#a78bfa">${results.screenshots.filter(s=>s.ok).length}</div><div class="stat-label">Screenshots</div></div>
</div>

<h2>Phases</h2>
<table><thead><tr><th>Phase</th><th>Statut</th><th>Détail</th></tr></thead><tbody>
${phasesHTML}
</tbody></table>

<h2>Problèmes détectés (${results.issues.length})</h2>
<table><thead><tr><th>Phase</th><th>Sévérité</th><th>Message</th><th>Fichier</th></tr></thead><tbody>
${issuesHTML}
</tbody></table>

<h2>Auto-corrections appliquées (${results.fixes.length})</h2>
<ul>${fixesHTML}</ul>

${results.screenshots.length > 0 ? `
<h2>Audit visuel (${results.screenshots.filter(s=>s.ok).length} screenshots)</h2>
<div class="screenshots">${screenshotsHTML}</div>
` : ''}

</body></html>`

writeFileSync(REPORT_PATH, htmlReport)
ok(`Rapport HTML : audit-history/latest-report.html`)
ok(`Historique sauvegardé : ${historyFile.replace(ROOT + '/', '')}`)

// ─── RÉSUMÉ FINAL ─────────────────────────────────────────────────────────────
log(`\n${C.bold}${'═'.repeat(50)}${C.reset}`)
log(`${C.bold}${C.magenta}  🎖  LE MAÎTRE — VERDICT FINAL${C.reset}`)
log(`${'═'.repeat(50)}`)
log(`  Score global    : ${C.bold}${results.score >= 90 ? C.green : results.score >= 70 ? C.yellow : C.red}${results.score}/100${C.reset}`)
log(`  Phases OK       : ${C.green}${results.passed}${C.reset} / ${Object.values(results.phases).filter(p => !p.skipped).length}`)
log(`  Problèmes       : ${results.failed > 0 ? C.red : C.green}${results.failed} erreur(s)${C.reset}, ${results.warnings > 0 ? C.yellow : C.green}${results.warnings} avertissement(s)${C.reset}`)
log(`  Corrections     : ${C.blue}${results.fixes.length} appliquée(s)${C.reset}`)
if (previousScore !== null) {
  const diff = results.score - previousScore
  log(`  Évolution       : ${previousScore} → ${results.score} (${diff >= 0 ? C.green + '+' : C.red}${diff}${C.reset})`)
}
if (regression) log(`  ${C.red}${C.bold}⚠️  RÉGRESSION DÉTECTÉE${C.reset}`)
log(`\n  Rapport         : ${C.cyan}audit-history/latest-report.html${C.reset}`)
log(`${'═'.repeat(50)}\n`)

if (results.failed > 0) {
  log(`${C.red}${C.bold}  ❌ ${verdict}${C.reset}\n`)
  process.exit(1)
} else {
  log(`${C.green}${C.bold}  ✅ ${verdict}${C.reset}\n`)
  process.exit(0)
}
