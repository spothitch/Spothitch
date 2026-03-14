#!/usr/bin/env node
/**
 * Trigger a Cloudflare Pages deploy without GitHub Actions.
 *
 * Usage:
 *   node scripts/deploy-hook.mjs
 *
 * Setup (once):
 *   1. Go to Cloudflare Dashboard > Pages > spothitch > Settings > Builds & deployments
 *   2. Create a "Deploy Hook" — copy the URL
 *   3. Paste it in .env.local as CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/...
 *
 * This replaces the old nightly-rebuild.yml GitHub Action.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // .env.local is optional
  }
}

loadEnv()

const hookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL

if (!hookUrl) {
  console.error('CLOUDFLARE_DEPLOY_HOOK_URL not set.')
  console.error('Add it to .env.local or set it as environment variable.')
  console.error('Get it from: Cloudflare Dashboard > Pages > spothitch > Settings > Deploy Hooks')
  process.exit(1)
}

console.log('Triggering Cloudflare Pages deploy...')

try {
  const res = await fetch(hookUrl, { method: 'POST' })
  if (res.ok) {
    const data = await res.json()
    console.log('Deploy triggered successfully.')
    console.log(`Build ID: ${data.result?.id || 'unknown'}`)
  } else {
    console.error(`Deploy hook failed: ${res.status} ${res.statusText}`)
    const body = await res.text()
    if (body) console.error(body)
    process.exit(1)
  }
} catch (err) {
  console.error(`Network error: ${err.message}`)
  process.exit(1)
}
