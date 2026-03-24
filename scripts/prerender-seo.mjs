#!/usr/bin/env node
/**
 * Pre-rendering SEO Script
 * Generates static HTML pages for country guides so Google can index them
 * Run after build: node scripts/prerender-seo.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

const DIST_PATH = join(import.meta.dirname, '..', 'dist')
const GUIDES_PATH = join(import.meta.dirname, '..', 'src', 'data', 'guides.js')
const SECTIONS_PATH = join(import.meta.dirname, '..', 'src', 'data', 'guideSections-en.js')
const SPOTS_PATH = join(import.meta.dirname, '..', 'public', 'data', 'spots')
const BASE_URL = 'https://spothitch.com'

// Popular countries for cross-linking (top traffic)
const POPULAR_COUNTRIES = ['FR', 'DE', 'ES', 'IT', 'NL', 'PL', 'GB', 'US', 'AU', 'TR']

// Extract guide data by parsing each block between { code: ... }
function extractGuides() {
  const content = readFileSync(GUIDES_PATH, 'utf-8')
  const guides = []

  const blockRegex = /\{\s*\n\s*code:\s*'([A-Z]{2})'/g
  let match
  const starts = []
  while ((match = blockRegex.exec(content)) !== null) {
    starts.push({ index: match.index, code: match[1] })
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index
    const end = i + 1 < starts.length ? starts[i + 1].index : content.length
    const block = content.slice(start, end)

    const getField = (field) => {
      const re = new RegExp(`^\\s{4}${field}:\\s*'([^']*)'`, 'm')
      const m = block.match(re)
      return m ? m[1].replace(/\\'/g, "'") : ''
    }

    // Extract array of strings (tipsEn, lawsEn, strategiesEn, etc.)
    const getArray = (field) => {
      const re = new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`, 'm')
      const m = block.match(re)
      if (!m) return []
      const items = []
      const itemRe = /'([^']+)'/g
      let im
      while ((im = itemRe.exec(m[1])) !== null) {
        items.push(im[1].replace(/\\'/g, "'"))
      }
      return items
    }

    // Extract phrases array [{local, meaningEn}]
    const getPhrases = () => {
      const re = /phrases:\s*\[([\s\S]*?)\]/m
      const m = block.match(re)
      if (!m) return []
      const phrases = []
      const phraseRe = /local:\s*'([^']+)'[\s\S]*?meaningEn:\s*'([^']+)'/g
      let pm
      while ((pm = phraseRe.exec(m[1])) !== null) {
        phrases.push({ local: pm[1].replace(/\\'/g, "'"), meaning: pm[2].replace(/\\'/g, "'") })
      }
      return phrases
    }

    // Extract events [{nameEn, dateEn, descriptionEn}]
    const getEvents = () => {
      const re = /events:\s*\[([\s\S]*?)\]\s*,?\s*\}/m
      const m = block.match(re)
      if (!m) return []
      const events = []
      const evRe = /nameEn:\s*'([^']+)'[\s\S]*?dateEn:\s*'([^']+)'[\s\S]*?descriptionEn:\s*'([^']+)'/g
      let em
      while ((em = evRe.exec(m[1])) !== null) {
        events.push({ name: em[1], date: em[2], desc: em[3].replace(/\\'/g, "'") })
      }
      return events
    }

    guides.push({
      code: starts[i].code,
      name: getField('name'),
      nameEn: getField('nameEn'),
      flag: getField('flag'),
      legalityTextEn: getField('legalityTextEn'),
      difficultyTextEn: getField('difficultyTextEn'),
      culturalNotesEn: getField('culturalNotesEn'),
      tipsEn: getArray('tipsEn'),
      lawsEn: getArray('lawsEn'),
      strategiesEn: getArray('strategiesEn'),
      borderCrossingsEn: getArray('borderCrossingsEn'),
      phrases: getPhrases(),
      events: getEvents(),
    })
  }

  return guides
}

// Count spots for a country
function countSpots(code) {
  const filePath = join(SPOTS_PATH, `${code.toLowerCase()}.json`)
  if (!existsSync(filePath)) return 0
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    if (Array.isArray(data)) return data.length
    if (data.spots && Array.isArray(data.spots)) return data.spots.length
    if (data.totalSpots) return data.totalSpots
    return 0
  } catch {
    return 0
  }
}

function nearestCityName(lat, lon) {
  let best = null, bestDist = Infinity
  for (const c of KNOWN_CITIES) {
    const d = haversineKm(lat, lon, c.lat, c.lon)
    if (d < bestDist) { bestDist = d; best = c }
  }
  return best && bestDist < 200 ? best.name : null
}

// ==================== ENRICHED SECTIONS ====================

// Load guideSections-en.js as ES module
let enrichedSections = {}
try {
  const sectionsModule = await import(SECTIONS_PATH)
  enrichedSections = sectionsModule.guideSectionsData || {}
} catch (e) {
  console.warn('Could not load guideSections-en.js:', e.message)
}

const SECTION_TITLES = {
  laws: { emoji: '⚖️', title: 'Laws & Legality' },
  hitchhiking: { emoji: '👍', title: 'Hitchhiking Tips' },
  safety: { emoji: '🛡️', title: 'Safety' },
  women: { emoji: '👩', title: 'Women Travelers' },
  language: { emoji: '💬', title: 'Language' },
  budget: { emoji: '💰', title: 'Budget' },
  sleep: { emoji: '🏕️', title: 'Where to Sleep' },
  transport: { emoji: '🚌', title: 'Alternative Transport' },
  season: { emoji: '📅', title: 'Best Season' },
  culture: { emoji: '🎭', title: 'Culture' },
}

function escHTML(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderBlockToHTML(block) {
  switch (block.type) {
    case 'text':
      return `      <p>${escHTML(block.text)}</p>`
    case 'sub':
      return `      <h3>${escHTML(block.title)}</h3>`
    case 'rule':
      return `      <p>${block.icon} ${escHTML(block.text)}</p>`
    case 'tip':
      return `      <blockquote class="tip">${escHTML(block.text)}</blockquote>`
    case 'warn':
      return `      <blockquote class="warn">${escHTML(block.text)}</blockquote>`
    case 'info':
      return `      <blockquote class="info-box">${escHTML(block.text)}</blockquote>`
    case 'kv':
      return (block.items || []).map(item =>
        `      <p><strong>${escHTML(item.k)}</strong>: ${escHTML(item.v)}</p>`
      ).join('\n')
    case 'phrase':
      return `      <table class="phrases"><tbody>\n${(block.items || []).map(item =>
        `        <tr><td class="phrase-local">"${escHTML(item.local)}"</td><td>${escHTML(item.meaning)}</td></tr>`
      ).join('\n')}\n      </tbody></table>`
    case 'transport':
      return (block.items || []).map(item =>
        `      <p>${item.emoji} <strong>${escHTML(item.name)}</strong>${item.detail ? ': ' + escHTML(item.detail) : ''}${item.price ? ' <em>(' + escHTML(item.price) + ')</em>' : ''}</p>`
      ).join('\n')
    case 'event':
      return (block.items || []).map(item =>
        `      <p><strong>${escHTML(item.month)} ${escHTML(item.day)}</strong>: ${escHTML(item.name)}. ${escHTML(item.desc)}</p>`
      ).join('\n')
    case 'season':
      return `      <div class="season-bar">${(block.months || []).map(m =>
        `<span class="month-${m.level}">${escHTML(m.name)}</span>`
      ).join('')}</div>`
    default:
      return ''
  }
}

function renderSectionsToHTML(countryCode) {
  const sections = enrichedSections[countryCode]
  if (!sections) return ''

  const html = []
  for (const [key, meta] of Object.entries(SECTION_TITLES)) {
    const sectionData = sections[key]
    if (!sectionData || !sectionData.blocks) continue
    html.push(`    <section>`)
    html.push(`      <h2>${meta.emoji} ${meta.title}</h2>`)
    for (const block of sectionData.blocks) {
      html.push(renderBlockToHTML(block))
    }
    html.push(`    </section>`)
  }
  return html.join('\n')
}

function generateGuideHTML(guide, allGuides) {
  const spotCount = countSpots(guide.code)
  const codeLower = guide.code.toLowerCase()

  // Cross-links to popular guides
  const crossLinks = allGuides
    .filter(g => g.code !== guide.code && POPULAR_COUNTRIES.includes(g.code))
    .slice(0, 6)
    .map(g => `      <li><a href="${BASE_URL}/guides/${g.code.toLowerCase()}">${g.flag} Hitchhiking in ${g.nameEn}</a></li>`)
    .join('\n')

  // Build rich content sections
  const sections = []

  if (guide.tipsEn.length > 0) {
    sections.push(`    <h2>Tips for Hitchhiking in ${guide.nameEn}</h2>
    <ul>${guide.tipsEn.map(t => `\n      <li>${t}</li>`).join('')}
    </ul>`)
  }

  if (guide.lawsEn.length > 0) {
    sections.push(`    <h2>Laws &amp; Regulations</h2>
    <ul>${guide.lawsEn.map(l => `\n      <li>${l}</li>`).join('')}
    </ul>`)
  }

  if (guide.strategiesEn.length > 0) {
    sections.push(`    <h2>Strategies</h2>
    <ul>${guide.strategiesEn.map(s => `\n      <li>${s}</li>`).join('')}
    </ul>`)
  }

  if (guide.culturalNotesEn) {
    sections.push(`    <h2>Cultural Notes</h2>
    <p>${guide.culturalNotesEn}</p>`)
  }

  if (guide.phrases.length > 0) {
    sections.push(`    <h2>Useful Phrases</h2>
    <ul>${guide.phrases.map(p => `\n      <li><strong>${p.local}</strong> — ${p.meaning}</li>`).join('')}
    </ul>`)
  }

  if (guide.events.length > 0) {
    sections.push(`    <h2>Events &amp; Festivals</h2>
    <ul>${guide.events.map(e => `\n      <li><strong>${e.name}</strong> (${e.date}) — ${e.desc}</li>`).join('')}
    </ul>`)
  }

  if (guide.borderCrossingsEn.length > 0) {
    sections.push(`    <h2>Border Crossings</h2>
    <ul>${guide.borderCrossingsEn.map(b => `\n      <li>${b}</li>`).join('')}
    </ul>`)
  }

  const richContent = sections.join('\n')

  // Enriched sections content
  const enrichedHTML = renderSectionsToHTML(guide.code)

  // FAQ schema for Google rich results
  const faqItems = []
  const faqSections = enrichedSections[guide.code]
  if (faqSections) {
    if (faqSections.laws?.blocks?.[0]?.text) {
      faqItems.push({ q: `Is hitchhiking legal in ${guide.nameEn}?`, a: faqSections.laws.blocks[0].text })
    }
    if (faqSections.safety?.blocks?.[0]?.text) {
      faqItems.push({ q: `Is hitchhiking safe in ${guide.nameEn}?`, a: faqSections.safety.blocks[0].text })
    }
    if (faqSections.budget?.blocks?.[0]?.text) {
      faqItems.push({ q: `How much does it cost to travel in ${guide.nameEn}?`, a: faqSections.budget.blocks[0].text })
    }
  }
  const faqSchema = faqItems.length > 0 ? `,
    {
      "@type": "FAQPage",
      "mainEntity": [${faqItems.map(f => `
        {"@type": "Question", "name": "${escHTML(f.q)}", "acceptedAnswer": {"@type": "Answer", "text": "${escHTML(f.a)}"}}`).join(',')}
      ]
    }` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hitchhiking in ${guide.nameEn} ${guide.flag} | Complete Guide | SpotHitch</title>
  <meta name="description" content="Complete hitchhiking guide for ${guide.nameEn}: laws, best spots, safety tips, budget, transport, culture. Everything you need to hitch in ${guide.nameEn}.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/guides/${codeLower}">
  <meta property="og:title" content="Hitchhiking in ${guide.nameEn} ${guide.flag} | SpotHitch">
  <meta property="og:description" content="Complete hitchhiking guide for ${guide.nameEn}: laws, safety, budget, culture. 10 sections of verified info.">
  <meta property="og:url" content="${BASE_URL}/guides/${codeLower}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="SpotHitch">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Hitchhiking in ${guide.nameEn} ${guide.flag}">
  <meta name="twitter:description" content="Laws, safety, budget, culture. Complete hitchhiking guide.">
  <link rel="icon" href="${BASE_URL}/favicon.ico">
  <script type="application/ld+json">
  [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "name": "Hitchhiking in ${guide.nameEn}",
      "headline": "Complete Hitchhiking Guide for ${guide.nameEn}",
      "description": "Laws, safety, budget, culture and practical tips for hitchhiking in ${guide.nameEn}",
      "url": "${BASE_URL}/guides/${codeLower}",
      "publisher": { "@type": "Organization", "name": "SpotHitch", "url": "${BASE_URL}" },
      "author": { "@type": "Organization", "name": "SpotHitch" },
      "inLanguage": "en"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "SpotHitch", "item": "${BASE_URL}"},
        {"@type": "ListItem", "position": 2, "name": "Country Guides", "item": "${BASE_URL}/guides"},
        {"@type": "ListItem", "position": 3, "name": "${guide.nameEn}", "item": "${BASE_URL}/guides/${codeLower}"}
      ]
    }${faqSchema}
  ]
  </script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f1520;color:#e2e8f0;line-height:1.7}
    .hero{background:linear-gradient(135deg,#1a2332,#0f1520);padding:2.5rem 1.5rem;text-align:center;border-bottom:1px solid #1e293b}
    .hero h1{font-size:2rem;font-weight:800;margin-bottom:0.5rem;color:#fff}
    .hero .subtitle{color:#94a3b8;font-size:0.95rem}
    .hero .badges{display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap}
    .hero .badge{font-size:0.75rem;padding:0.3rem 0.7rem;border-radius:99px;font-weight:600}
    .badge-green{background:rgba(34,197,94,0.15);color:#22c55e}
    .badge-amber{background:rgba(245,158,11,0.15);color:#f59e0b}
    .badge-blue{background:rgba(59,130,246,0.15);color:#60a5fa}
    nav.breadcrumb{padding:0.8rem 1.5rem;font-size:0.8rem;color:#64748b}
    nav.breadcrumb a{color:#f59e0b;text-decoration:none}
    nav.breadcrumb a:hover{text-decoration:underline}
    .container{max-width:800px;margin:0 auto;padding:0 1.5rem 3rem}
    section{margin-top:2rem}
    h2{color:#f59e0b;font-size:1.35rem;font-weight:700;margin-bottom:0.8rem;display:flex;align-items:center;gap:0.4rem}
    h3{color:#cbd5e1;font-size:1rem;font-weight:600;margin:1.2rem 0 0.4rem;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em}
    p{margin:0.4rem 0;font-size:0.92rem;color:#cbd5e1}
    blockquote{padding:0.7rem 1rem;border-radius:0 0.5rem 0.5rem 0;margin:0.8rem 0;font-size:0.88rem;line-height:1.5}
    blockquote.tip{background:rgba(245,158,11,0.06);border-left:3px solid #f59e0b;color:#fbbf24}
    blockquote.warn{background:rgba(239,68,68,0.06);border-left:3px solid #ef4444;color:#f87171}
    blockquote.info-box{background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;color:#60a5fa}
    table.phrases{width:100%;border-collapse:collapse;margin:0.5rem 0}
    table.phrases td{padding:0.35rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.88rem}
    .phrase-local{color:#f59e0b;font-weight:600;width:45%}
    .season-bar{display:flex;gap:3px;margin:0.5rem 0}
    .season-bar span{flex:1;text-align:center;padding:0.3rem 0;border-radius:4px;font-size:0.65rem;font-weight:600}
    .month-great{background:rgba(34,197,94,0.2);color:#22c55e}
    .month-good{background:rgba(34,197,94,0.1);color:#22c55e}
    .month-ok{background:rgba(245,158,11,0.12);color:#f59e0b}
    .month-bad{background:rgba(239,68,68,0.1);color:#ef4444}
    .cta{display:inline-block;background:#f59e0b;color:#0f1520;padding:0.8rem 1.5rem;border-radius:99px;font-weight:700;margin:1.5rem 0;text-decoration:none;font-size:0.95rem}
    .cta:hover{background:#d97706}
    .cross-links{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.5rem;margin-top:1rem}
    .cross-links a{display:block;padding:0.6rem 0.8rem;background:#1a2332;border-radius:8px;color:#e2e8f0;text-decoration:none;font-size:0.85rem;border:1px solid #1e293b}
    .cross-links a:hover{border-color:#f59e0b;background:#1e293b}
    footer{text-align:center;padding:2rem;color:#475569;font-size:0.8rem;border-top:1px solid #1e293b;margin-top:3rem}
    footer a{color:#f59e0b}
    @media(max-width:600px){.hero h1{font-size:1.5rem}.container{padding:0 1rem 2rem}}
  </style>
</head>
<body>
  <nav class="breadcrumb">
    <a href="${BASE_URL}">SpotHitch</a> &rsaquo;
    <a href="${BASE_URL}/#guides">Country Guides</a> &rsaquo;
    ${guide.nameEn}
  </nav>

  <div class="hero">
    <h1>${guide.flag} Hitchhiking in ${guide.nameEn}</h1>
    <p class="subtitle">Complete hitchhiking guide with laws, safety, budget and culture</p>
    <div class="badges">
      ${guide.legalityTextEn ? `<span class="badge badge-green">${escHTML(guide.legalityTextEn).slice(0, 60)}</span>` : ''}
      ${guide.difficultyTextEn ? `<span class="badge badge-amber">Difficulty: ${escHTML(guide.difficultyTextEn)}</span>` : ''}
      ${spotCount > 0 ? `<span class="badge badge-blue">${spotCount} spots on SpotHitch</span>` : ''}
    </div>
  </div>

  <div class="container">
    <a class="cta" href="${BASE_URL}/?guide=${guide.code}">Open Interactive Guide in App &rarr;</a>

${enrichedHTML || richContent}

    <section>
      <h2>🌍 More Country Guides</h2>
      <div class="cross-links">
${allGuides
  .filter(g => g.code !== guide.code && POPULAR_COUNTRIES.includes(g.code))
  .slice(0, 8)
  .map(g => `        <a href="${BASE_URL}/guides/${g.code.toLowerCase()}">${g.flag} ${g.nameEn}</a>`)
  .join('\n')}
      </div>
    </section>
  </div>

  <footer>
    <p><a href="${BASE_URL}">SpotHitch</a> &middot; The Hitchhiking Community</p>
    <p>Find the best spots, connect with travelers, travel for free.</p>
  </footer>
</body>
</html>`
}

function generateSitemap(guides) {
  const today = new Date().toISOString().split('T')[0]
  const urls = [
    `  <url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    ...guides.map(g =>
      `  <url><loc>${BASE_URL}/guides/${g.code.toLowerCase()}</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${today}</lastmod></url>`
    ),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

// ==================== CITY PAGES ====================

// Country name mapping (ISO 2-letter code -> English name)
const COUNTRY_NAMES = {
  AD: 'Andorra', AF: 'Afghanistan', AL: 'Albania', AM: 'Armenia', AO: 'Angola',
  AR: 'Argentina', AT: 'Austria', AU: 'Australia', BA: 'Bosnia', BD: 'Bangladesh',
  BE: 'Belgium', BG: 'Bulgaria', BJ: 'Benin', BN: 'Brunei', BO: 'Bolivia',
  BR: 'Brazil', BW: 'Botswana', BZ: 'Belize', CA: 'Canada', CH: 'Switzerland',
  CI: 'Ivory Coast', CL: 'Chile', CM: 'Cameroon', CN: 'China', CO: 'Colombia',
  CR: 'Costa Rica', CY: 'Cyprus', CZ: 'Czech Republic', DE: 'Germany', DK: 'Denmark',
  DM: 'Dominica', DO: 'Dominican Republic', DZ: 'Algeria', EC: 'Ecuador', EE: 'Estonia',
  EG: 'Egypt', ES: 'Spain', FI: 'Finland', FO: 'Faroe Islands', FR: 'France',
  GB: 'United Kingdom', GD: 'Grenada', GE: 'Georgia', GG: 'Guernsey', GH: 'Ghana',
  GL: 'Greenland', GR: 'Greece', GT: 'Guatemala', GY: 'Guyana', HN: 'Honduras',
  HR: 'Croatia', HU: 'Hungary', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel',
  IM: 'Isle of Man', IN: 'India', IQ: 'Iraq', IR: 'Iran', IS: 'Iceland', IT: 'Italy',
  JE: 'Jersey', JO: 'Jordan', JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan',
  KH: 'Cambodia', KR: 'South Korea', KZ: 'Kazakhstan', LA: 'Laos', LI: 'Liechtenstein',
  LK: 'Sri Lanka', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia', MA: 'Morocco',
  MC: 'Monaco', MD: 'Moldova', ME: 'Montenegro', MK: 'North Macedonia', MN: 'Mongolia',
  MR: 'Mauritania', MT: 'Malta', MU: 'Mauritius', MX: 'Mexico', MY: 'Malaysia',
  MZ: 'Mozambique', NA: 'Namibia', NG: 'Nigeria', NI: 'Nicaragua', NL: 'Netherlands',
  NO: 'Norway', NP: 'Nepal', NZ: 'New Zealand', OM: 'Oman', PA: 'Panama',
  PE: 'Peru', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland', PT: 'Portugal',
  PY: 'Paraguay', RO: 'Romania', RS: 'Serbia', RU: 'Russia', SA: 'Saudi Arabia',
  SE: 'Sweden', SI: 'Slovenia', SK: 'Slovakia', SM: 'San Marino', SN: 'Senegal',
  SZ: 'Eswatini', TG: 'Togo', TH: 'Thailand', TL: 'Timor-Leste', TN: 'Tunisia',
  TO: 'Tonga', TR: 'Turkey', UA: 'Ukraine', UG: 'Uganda', US: 'United States',
  UY: 'Uruguay', UZ: 'Uzbekistan', VC: 'St. Vincent', VN: 'Vietnam', ZA: 'South Africa',
  ZM: 'Zambia',
}

// Well-known cities with coordinates (top hitchhiking cities)
const KNOWN_CITIES = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'DE' },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, country: 'ES' },
  { name: 'Barcelona', lat: 41.3874, lon: 2.1686, country: 'ES' },
  { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'NL' },
  { name: 'Prague', lat: 50.0755, lon: 14.4378, country: 'CZ' },
  { name: 'Vienna', lat: 48.2082, lon: 16.3738, country: 'AT' },
  { name: 'Munich', lat: 48.1351, lon: 11.5820, country: 'DE' },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937, country: 'DE' },
  { name: 'Lyon', lat: 45.7640, lon: 4.8357, country: 'FR' },
  { name: 'Marseille', lat: 43.2965, lon: 5.3698, country: 'FR' },
  { name: 'Toulouse', lat: 43.6047, lon: 1.4442, country: 'FR' },
  { name: 'Bordeaux', lat: 44.8378, lon: -0.5792, country: 'FR' },
  { name: 'Nantes', lat: 47.2184, lon: -1.5536, country: 'FR' },
  { name: 'Brussels', lat: 50.8503, lon: 4.3517, country: 'BE' },
  { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'IT' },
  { name: 'Milan', lat: 45.4642, lon: 9.1900, country: 'IT' },
  { name: 'Lisbon', lat: 38.7223, lon: -9.1393, country: 'PT' },
  { name: 'Porto', lat: 41.1579, lon: -8.6291, country: 'PT' },
  { name: 'Warsaw', lat: 52.2297, lon: 21.0122, country: 'PL' },
  { name: 'Krakow', lat: 50.0647, lon: 19.9450, country: 'PL' },
  { name: 'Budapest', lat: 47.4979, lon: 19.0402, country: 'HU' },
  { name: 'Copenhagen', lat: 55.6761, lon: 12.5683, country: 'DK' },
  { name: 'Stockholm', lat: 59.3293, lon: 18.0686, country: 'SE' },
  { name: 'Oslo', lat: 59.9139, lon: 10.7522, country: 'NO' },
  { name: 'Helsinki', lat: 60.1699, lon: 24.9384, country: 'FI' },
  { name: 'Dublin', lat: 53.3498, lon: -6.2603, country: 'IE' },
  { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, country: 'GB' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
  { name: 'Zurich', lat: 47.3769, lon: 8.5417, country: 'CH' },
  { name: 'Ljubljana', lat: 46.0569, lon: 14.5058, country: 'SI' },
  { name: 'Zagreb', lat: 45.8150, lon: 15.9819, country: 'HR' },
  { name: 'Belgrade', lat: 44.7866, lon: 20.4489, country: 'RS' },
  { name: 'Bucharest', lat: 44.4268, lon: 26.1025, country: 'RO' },
  { name: 'Sofia', lat: 42.6977, lon: 23.3219, country: 'BG' },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'TR' },
  { name: 'Athens', lat: 37.9838, lon: 23.7275, country: 'GR' },
  { name: 'Bratislava', lat: 48.1486, lon: 17.1077, country: 'SK' },
  { name: 'Tallinn', lat: 59.4370, lon: 24.7536, country: 'EE' },
  { name: 'Riga', lat: 56.9496, lon: 24.1052, country: 'LV' },
  { name: 'Vilnius', lat: 54.6872, lon: 25.2797, country: 'LT' },
  { name: 'Tbilisi', lat: 41.7151, lon: 44.8271, country: 'GE' },
  { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, country: 'IS' },
  { name: 'Marrakech', lat: 31.6295, lon: -7.9811, country: 'MA' },
  { name: 'Fez', lat: 34.0181, lon: -5.0078, country: 'MA' },
  { name: 'Strasbourg', lat: 48.5734, lon: 7.7521, country: 'FR' },
  { name: 'Nice', lat: 43.7102, lon: 7.2620, country: 'FR' },
  { name: 'Montpellier', lat: 43.6108, lon: 3.8767, country: 'FR' },
  { name: 'Cologne', lat: 50.9375, lon: 6.9603, country: 'DE' },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, country: 'DE' },
]

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ==================== DATA SOURCES ====================

/**
 * Load spots from static JSON files
 */
function loadStaticSpots() {
  if (!existsSync(SPOTS_PATH)) {
    console.log('  Static: no spot files (community data only)')
    return []
  }
  const files = readdirSync(SPOTS_PATH).filter(f => f.endsWith('.json'))
  const allSpots = []
  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(SPOTS_PATH, file), 'utf-8'))
      const country = file.replace('.json', '').toUpperCase()
      const spots = data.spots || (Array.isArray(data) ? data : [])
      for (const s of spots) {
        allSpots.push({ ...s, country, dataSource: 'static' })
      }
    } catch { /* skip broken files */ }
  }
  console.log(`  Static: ${allSpots.length} spots loaded`)
  return allSpots
}

/**
 * Load community spots from Firebase Firestore via REST API
 * Uses the Firestore REST API (no firebase-admin dependency needed)
 */
async function loadFirebaseSpots() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID
  const apiKey = process.env.VITE_FIREBASE_API_KEY
  if (!projectId || !apiKey) {
    console.log('  Firebase: skipped (no VITE_FIREBASE_PROJECT_ID or VITE_FIREBASE_API_KEY)')
    return []
  }

  try {
    // Firestore REST API - list all documents in 'spots' collection
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/spots?key=${apiKey}&pageSize=5000`
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`  Firebase: HTTP ${response.status} — ${await response.text().catch(() => '')}`)
      return []
    }

    const data = await response.json()
    const documents = data.documents || []
    const spots = []

    for (const doc of documents) {
      try {
        const fields = doc.fields || {}
        const spot = firestoreFieldsToObject(fields)
        // Normalize fields
        spots.push({
          lat: spot.coordinates?.lat || spot.lat || null,
          lon: spot.coordinates?.lng || spot.lng || null,
          wait: spot.waitTime || spot.avgWaitTime || 0,
          rating: spot.globalRating || 0,
          destLat: spot.directionCityCoords?.lat || null,
          destLon: spot.directionCityCoords?.lng || null,
          country: (spot.country || '').toUpperCase(),
          comments: spot.description ? [{ text: spot.description }] : [],
          dataSource: 'community',
          // Rich community fields
          departureCity: spot.departureCity || null,
          directionCity: spot.directionCity || null,
          method: spot.method || null,
          groupSize: spot.groupSize || null,
          timeOfDay: spot.timeOfDay || null,
          season: spot.season || null,
          tags: spot.tags || {},
          ratings: spot.ratings || {},
          spotType: spot.spotType || null,
          createdAt: spot.createdAt || null,
        })
      } catch { /* skip malformed docs */ }
    }

    console.log(`  Firebase: ${spots.length} community spots loaded`)
    return spots
  } catch (error) {
    console.warn(`  Firebase: failed to load — ${error.message}`)
    return []
  }
}

/**
 * Convert Firestore REST API field format to plain object
 * Firestore fields look like: { stringValue: "x" }, { integerValue: "1" }, { mapValue: { fields: {...} } }
 */
function firestoreFieldsToObject(fields) {
  const result = {}
  for (const [key, val] of Object.entries(fields)) {
    result[key] = firestoreValueToJS(val)
  }
  return result
}

function firestoreValueToJS(val) {
  if (!val) return null
  if ('stringValue' in val) return val.stringValue
  if ('integerValue' in val) return Number(val.integerValue)
  if ('doubleValue' in val) return val.doubleValue
  if ('booleanValue' in val) return val.booleanValue
  if ('nullValue' in val) return null
  if ('timestampValue' in val) return val.timestampValue
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(firestoreValueToJS)
  if ('mapValue' in val) return firestoreFieldsToObject(val.mapValue.fields || {})
  return null
}

/**
 * Load ALL spots from both sources (static files + Firebase community)
 */
async function loadAllSpots() {
  const [staticSpots, firebase] = await Promise.all([
    Promise.resolve(loadStaticSpots()),
    loadFirebaseSpots(),
  ])
  const all = [...staticSpots, ...firebase]
  console.log(`  Total: ${all.length} spots (${staticSpots.length} static + ${firebase.length} community)`)
  return all
}

// Common words that are NOT city names — filter these out from comment extraction
const STOP_WORDS = new Set([
  // English common words
  'the', 'this', 'that', 'here', 'there', 'where', 'when', 'from', 'with', 'about',
  'after', 'before', 'inside', 'outside', 'around', 'behind', 'between', 'under', 'over',
  'both', 'another', 'some', 'every', 'each', 'many', 'much', 'more', 'most', 'other',
  'hand', 'case', 'area', 'direction', 'road', 'exit', 'bus', 'car', 'station', 'hotel',
  'fence', 'roundabout', 'city', 'front', 'group', 'vacation', 'thursday', 'friday',
  'monday', 'tuesday', 'wednesday', 'saturday', 'sunday',
  'for', 'and', 'but', 'not', 'you', 'are', 'was', 'get', 'got', 'catch', 'which',
  'itself', 'himself', 'herself', 'yourself', 'myself',
  // French common words
  'les', 'des', 'une', 'que', 'sur', 'par', 'dans', 'avec', 'pour', 'tout', 'cette',
  'vers', 'entre', 'chez', 'aussi', 'comme', 'mais',
  // Months (English + Dutch/Swedish/German variants)
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
  'januari', 'februari', 'mars', 'juni', 'juli', 'oktober', 'dezember',
  // Transport / infrastructure
  'terminal', 'tram', 'tren', 'train', 'airport', 'metro', 'port', 'gare',
  'trainstation', 'stadium', 'park', 'plaza', 'center', 'centre',
  // Brands / stores / gas stations / hotels
  'tesco', 'texaco', 'shell', 'total', 'esso', 'lidl', 'aldi', 'carrefour',
  'crowne', 'hilton', 'ibis', 'novotel',
  // Short noise words and non-city terms
  'tel', 'adr', 'bod', 'zub', 'bar', 'talk', 'aires', 'fall', 'kirk', 'nord',
  'saint', 'outlet', 'mitte', 'lokals', 'minutes', 'casa', 'broadway', 'zona',
  'otogar', 'kamppi', 'keskustori', 'perrache', 'domb', 'gills', 'holby',
  'koda', 'kooli', 'osula', 'rudn', 'mpnaco', 'dienvidu', 'vlkol',
  // Person names commonly found in comments
  'derek', 'jake', 'johnny', 'peter', 'robert', 'sabby', 'stalin', 'marja',
  'paul', 'zamenhof', 'barrick',
  // Languages / nationalities / scripts
  'arabic', 'english', 'french', 'german', 'spanish', 'turkish', 'russian',
  'cyrillic', 'czech', 'dutch', 'greek', 'italian', 'polish', 'portuguese',
  'romanian', 'hungarian', 'swedish', 'norwegian',
  // Country / region / continent names (not cities)
  'belgium', 'denmark', 'austria', 'france', 'germany', 'spain', 'italy', 'portugal',
  'switzerland', 'netherlands', 'sweden', 'norway', 'finland', 'iceland', 'ireland',
  'poland', 'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'greece', 'turkey',
  'albania', 'bosnia', 'taiwan', 'tirol', 'bretagne', 'baltics', 'baltic', 'bavaria',
  'andorra', 'colombia', 'eritrea', 'holland', 'india', 'jordan', 'kosovo', 'latvia',
  'macedonia', 'montenegro', 'russia', 'slovakia', 'slovenia', 'tunisia', 'europe',
  'georgia', 'estonia', 'lithuania', 'morocco', 'egypt', 'china', 'japan',
  // Regions (not cities)
  'brittany', 'limousin', 'provence', 'normandy', 'catalonia', 'andalusia',
  'patagonia', 'transylvania', 'scandinavia', 'siberia',
  // Religious / cultural periods
  'ramadan', 'christmas', 'easter',
  // Geographic features (not cities)
  'rhein', 'ruhr', 'danube', 'alps',
])

/**
 * Check if a candidate city name looks like a real proper noun
 */
function isValidCityName(name) {
  if (!name || name.length < 3) return false
  // Must start with uppercase
  if (!/^[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ]/.test(name)) return false
  // Single-word names must be at least 4 chars (real short cities like Fez are in KNOWN_CITIES)
  if (!name.includes(' ') && name.length < 4) return false
  // Check each word against stop words (normalize accents for matching)
  const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const words = normalized.split(/[\s-]+/)
  if (words.some(w => STOP_WORDS.has(w))) return false
  // Reject if it ends with a preposition/conjunction
  const lastWord = words[words.length - 1]
  if (['to', 'and', 'but', 'or', 'of', 'in', 'on', 'at', 'is', 'it', 'we', 'with', 'after', 'before'].includes(lastWord)) return false
  // Reject if purely numeric or too short after cleanup
  if (/^\d+$/.test(name)) return false
  // Reject compound names ending with infrastructure words
  const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (/-(trainstation|station|airport|plaza|stadium|park|center|centre|hotel|hostel|highway|motorway|south|north|east|west|gardens|rally|bothy)$/.test(slug)) return false
  // Reject Dutch/German street/square names (weg=road, straat=street, plein=square, platz=square)
  if (/(weg|veg|straat|plein|platz|gasse|allee|tori|torget)$/.test(slug)) return false
  // Reject names with directional/infrastructure prefixes or suffixes
  if (/^(western|eastern|northern|southern|old|new)-/.test(slug)) return false
  if (/-(central|freville|canaria)$/.test(slug)) return false
  // Reject very short truncated slugs (4 chars or less = likely broken from accent stripping)
  if (slug.length <= 4) return false
  // Reject slugs that look truncated (end in consonant cluster suggesting cut-off word)
  if (/[bcdfghjklmnpqrstvwxz]{3,}$/.test(slug) && slug.length < 8) return false
  // Reject Russian/Slavic street name suffixes
  if (/(ova|evova|skaya|skiy)$/.test(slug) && slug.length < 15) return false
  return true
}

/**
 * Auto-discover cities by clustering spots geographically.
 * Groups spots within 15km of each other, names the cluster
 * after the most common comment mention or coordinates.
 */
function discoverCitiesFromSpots(allSpots) {
  const discovered = []
  const used = new Set()

  // Sort spots by density (spots with more neighbors first)
  const withNeighbors = allSpots
    .filter(s => s.lat && s.lon)
    .map(s => {
      const neighbors = allSpots.filter(other =>
        other !== s && other.lat && other.lon &&
        haversineKm(s.lat, s.lon, other.lat, other.lon) <= 15
      ).length
      return { ...s, neighbors }
    })
    .sort((a, b) => b.neighbors - a.neighbors)

  for (const spot of withNeighbors) {
    const key = `${Math.round(spot.lat * 5)}_${Math.round(spot.lon * 5)}`
    if (used.has(key)) continue

    // Find all spots in 15km radius
    const cluster = allSpots.filter(s =>
      s.lat && s.lon && haversineKm(spot.lat, spot.lon, s.lat, s.lon) <= 15
    )
    if (cluster.length < 3) continue // Need 3+ spots to be worth a page

    used.add(key)

    // Try to find a city name from comments — NO /i flag so only proper nouns match
    let cityName = null
    for (const s of cluster) {
      if (s.comments && s.comments.length > 0) {
        for (const c of s.comments) {
          const match = c.text?.match(/(?:from|near|in|leaving|quitting|depuis|près de|sortie)\s+([A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-zàâäéèêëîïôùûüçñ]+(?:\s[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇ][a-zàâäéèêëîïôùûüçñ]+)?)/)
          if (match && isValidCityName(match[1].trim())) {
            cityName = match[1].trim()
            break
          }
        }
        if (cityName) break
      }
    }

    // Skip unnamed clusters for SEO
    if (!cityName) continue

    discovered.push({
      name: cityName,
      lat: spot.lat,
      lon: spot.lon,
      country: spot.country || '',
    })
  }

  return discovered
}

/**
 * Build rich stats from community spots for city pages
 */
function buildCommunityStats(communitySpots) {
  if (communitySpots.length === 0) return null

  const stats = {
    count: communitySpots.length,
    methods: {},      // { sign: 5, thumb: 12, asking: 3 }
    groupSizes: {},   // { solo: 8, duo: 5, group: 2 }
    timesOfDay: {},   // { morning: 3, afternoon: 7, evening: 4, night: 1 }
    seasons: {},      // { spring: 2, summer: 8, autumn: 3, winter: 2 }
    spotTypes: {},    // { city_exit: 5, gas_station: 3, ... }
    waitTimes: [],    // raw array for percentile calculations
    avgSafety: 0,
    avgTraffic: 0,
    avgAccessibility: 0,
  }

  let safetySum = 0, safetyCount = 0
  let trafficSum = 0, trafficCount = 0
  let accessSum = 0, accessCount = 0

  for (const s of communitySpots) {
    if (s.method) stats.methods[s.method] = (stats.methods[s.method] || 0) + 1
    if (s.groupSize) stats.groupSizes[s.groupSize] = (stats.groupSizes[s.groupSize] || 0) + 1
    if (s.timeOfDay) stats.timesOfDay[s.timeOfDay] = (stats.timesOfDay[s.timeOfDay] || 0) + 1
    if (s.season) stats.seasons[s.season] = (stats.seasons[s.season] || 0) + 1
    if (s.spotType) stats.spotTypes[s.spotType] = (stats.spotTypes[s.spotType] || 0) + 1
    if (s.wait > 0) stats.waitTimes.push(s.wait)
    if (s.ratings?.safety > 0) { safetySum += s.ratings.safety; safetyCount++ }
    if (s.ratings?.traffic > 0) { trafficSum += s.ratings.traffic; trafficCount++ }
    if (s.ratings?.accessibility > 0) { accessSum += s.ratings.accessibility; accessCount++ }
  }

  stats.avgSafety = safetyCount > 0 ? Math.round(safetySum / safetyCount * 10) / 10 : 0
  stats.avgTraffic = trafficCount > 0 ? Math.round(trafficSum / trafficCount * 10) / 10 : 0
  stats.avgAccessibility = accessCount > 0 ? Math.round(accessSum / accessCount * 10) / 10 : 0

  // Best method (most used)
  const methodEntries = Object.entries(stats.methods).sort((a, b) => b[1] - a[1])
  stats.bestMethod = methodEntries.length > 0 ? methodEntries[0][0] : null

  // Best time of day
  const timeEntries = Object.entries(stats.timesOfDay).sort((a, b) => b[1] - a[1])
  stats.bestTimeOfDay = timeEntries.length > 0 ? timeEntries[0][0] : null

  // Median wait time
  if (stats.waitTimes.length > 0) {
    const sorted = [...stats.waitTimes].sort((a, b) => a - b)
    stats.medianWait = sorted[Math.floor(sorted.length / 2)]
  }

  return stats
}

function buildCitySEOData(allSpots) {
  const cities = []
  const processedSlugs = new Set()

  // Auto-discover cities from spot clusters (groups of 2+ spots within 15km)
  const autoCities = discoverCitiesFromSpots(allSpots)

  // Merge: KNOWN_CITIES first (higher quality), then auto-discovered
  const allCities = [...KNOWN_CITIES]
  for (const ac of autoCities) {
    const slug = slugify(ac.name)
    if (!allCities.some(kc => slugify(kc.name) === slug)) {
      allCities.push(ac)
    }
  }

  for (const city of allCities) {
    const slug = slugify(city.name)
    if (processedSlugs.has(slug)) continue
    processedSlugs.add(slug)

    const nearby = allSpots.filter(s => {
      if (!s.lat || !s.lon) return false
      return haversineKm(city.lat, city.lon, s.lat, s.lon) <= 30
    })
    if (nearby.length < 2) continue

    const waits = nearby.filter(s => s.wait > 0).map(s => s.wait)
    const avgWait = waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0
    const ratings = nearby.filter(s => s.rating > 0).map(s => s.rating)
    const avgRating = ratings.length ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0

    // Group by destination direction
    const routes = {}
    for (const spot of nearby) {
      if (!spot.destLat || !spot.destLon) continue
      let matched = false
      for (const key of Object.keys(routes)) {
        const r = routes[key]
        if (haversineKm(r.destLat, r.destLon, spot.destLat, spot.destLon) < 30) {
          r.spots.push(spot)
          matched = true
          break
        }
      }
      if (!matched) {
        const key = `${Math.round(spot.destLat * 10)}_${Math.round(spot.destLon * 10)}`
        routes[key] = { destLat: spot.destLat, destLon: spot.destLon, spots: [spot] }
      }
    }

    const routesList = Object.entries(routes)
      .map(([key, r]) => ({
        slug: key,
        destLat: r.destLat,
        destLon: r.destLon,
        spotCount: r.spots.length,
        avgWait: r.spots.filter(s => s.wait > 0).length > 0
          ? Math.round(r.spots.filter(s => s.wait > 0).reduce((a, s) => a + s.wait, 0) / r.spots.filter(s => s.wait > 0).length)
          : 0,
      }))
      .filter(r => r.spotCount >= 1)
      .sort((a, b) => b.spotCount - a.spotCount)

    // Community-only stats (rich data)
    const communitySpots = nearby.filter(s => s.dataSource === 'community')
    const communityStats = buildCommunityStats(communitySpots)

    cities.push({
      name: city.name,
      slug: slugify(city.name),
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      countryName: COUNTRY_NAMES[city.country] || city.country,
      spotCount: nearby.length,
      communitySpotCount: communitySpots.length,
      avgWait,
      avgRating,
      routesList,
      communityStats,
    })
  }

  return cities
}

/**
 * Render community stats as HTML for city SEO pages
 */
function renderCommunityStatsHTML(stats) {
  if (!stats || stats.count === 0) return ''

  const METHOD_LABELS = { sign: 'Sign/Cardboard', thumb: 'Thumb', asking: 'Asking directly' }
  const TIME_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night' }
  const SEASON_LABELS = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' }
  const TYPE_LABELS = { city_exit: 'City exit', gas_station: 'Gas station', roadside: 'Roadside', other: 'Other' }

  const sections = []

  // Summary stats
  const summaryParts = []
  if (stats.medianWait) summaryParts.push(`<strong>~${stats.medianWait} min</strong> median wait`)
  if (stats.bestMethod) summaryParts.push(`Most effective: <strong>${METHOD_LABELS[stats.bestMethod] || stats.bestMethod}</strong>`)
  if (stats.bestTimeOfDay) summaryParts.push(`Best time: <strong>${TIME_LABELS[stats.bestTimeOfDay] || stats.bestTimeOfDay}</strong>`)
  if (summaryParts.length > 0) {
    sections.push(`    <div class="info">
      <p>Based on <strong>${stats.count}</strong> community reports:</p>
      <p>${summaryParts.join(' &middot; ')}</p>
    </div>`)
  }

  // Ratings
  if (stats.avgSafety > 0 || stats.avgTraffic > 0 || stats.avgAccessibility > 0) {
    const ratingParts = []
    if (stats.avgSafety > 0) ratingParts.push(`Safety: <strong>${stats.avgSafety}/5</strong>`)
    if (stats.avgTraffic > 0) ratingParts.push(`Traffic: <strong>${stats.avgTraffic}/5</strong>`)
    if (stats.avgAccessibility > 0) ratingParts.push(`Accessibility: <strong>${stats.avgAccessibility}/5</strong>`)
    sections.push(`    <h2>Community Ratings</h2>
    <p>${ratingParts.join(' &middot; ')}</p>`)
  }

  // Method distribution
  const methodEntries = Object.entries(stats.methods).sort((a, b) => b[1] - a[1])
  if (methodEntries.length > 0) {
    const total = methodEntries.reduce((s, e) => s + e[1], 0)
    sections.push(`    <h2>Hitchhiking Methods</h2>
    <ul>${methodEntries.map(([k, v]) => `\n      <li>${METHOD_LABELS[k] || k}: ${v} report${v > 1 ? 's' : ''} (${Math.round(v / total * 100)}%)</li>`).join('')}
    </ul>`)
  }

  // Spot types
  const typeEntries = Object.entries(stats.spotTypes).sort((a, b) => b[1] - a[1])
  if (typeEntries.length > 0) {
    sections.push(`    <h2>Spot Types</h2>
    <ul>${typeEntries.map(([k, v]) => `\n      <li>${TYPE_LABELS[k] || k}: ${v} spot${v > 1 ? 's' : ''}</li>`).join('')}
    </ul>`)
  }

  // Best seasons
  const seasonEntries = Object.entries(stats.seasons).sort((a, b) => b[1] - a[1])
  if (seasonEntries.length > 0) {
    sections.push(`    <h2>Best Seasons</h2>
    <ul>${seasonEntries.map(([k, v]) => `\n      <li>${SEASON_LABELS[k] || k}: ${v} report${v > 1 ? 's' : ''}</li>`).join('')}
    </ul>`)
  }

  // Group sizes
  const groupEntries = Object.entries(stats.groupSizes).sort((a, b) => b[1] - a[1])
  if (groupEntries.length > 0) {
    const GROUP_LABELS = { solo: 'Solo', duo: 'Duo (2 people)', group: 'Group (3+)' }
    sections.push(`    <h2>Group Sizes</h2>
    <ul>${groupEntries.map(([k, v]) => `\n      <li>${GROUP_LABELS[k] || k}: ${v} report${v > 1 ? 's' : ''}</li>`).join('')}
    </ul>`)
  }

  if (sections.length === 0) return ''

  return `
    <h2>Community Insights</h2>
${sections.join('\n')}`
}

function generateCityHTML(city) {
  // Merge routes pointing to same destination city
  const merged = {}
  for (const r of city.routesList) {
    const destName = nearestCityName(r.destLat, r.destLon)
    if (destName && destName.toLowerCase() === city.name.toLowerCase()) continue
    const key = destName || `${r.destLat.toFixed(1)}_${r.destLon.toFixed(1)}`
    if (!merged[key]) {
      merged[key] = { label: destName ? `Towards ${destName}` : `Direction ${r.destLat.toFixed(1)}°N, ${r.destLon.toFixed(1)}°E`, spots: 0, waits: [] }
    }
    merged[key].spots += r.spotCount
    if (r.avgWait > 0) merged[key].waits.push(r.avgWait)
  }
  const routesHTML = Object.values(merged)
    .sort((a, b) => b.spots - a.spots)
    .slice(0, 10)
    .map(r => {
      const avgW = r.waits.length ? Math.round(r.waits.reduce((a, b) => a + b, 0) / r.waits.length) : 0
      return `      <li><strong>${r.label}</strong>: ${r.spots} spot${r.spots > 1 ? 's' : ''}${avgW > 0 ? `, ~${avgW} min average wait` : ''}</li>`
    }).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hitchhiking from ${city.name}, ${city.countryName} - ${city.spotCount} spots | SpotHitch</title>
  <meta name="description" content="Best hitchhiking spots leaving ${city.name}, ${city.countryName}. ${city.spotCount} spots${city.avgWait > 0 ? `, average wait ${city.avgWait} min` : ''}. Find the best departure points.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/city/${city.slug}">
  <meta property="og:title" content="Hitchhiking from ${city.name} | SpotHitch">
  <meta property="og:description" content="${city.spotCount} hitchhiking spots near ${city.name}${city.avgWait > 0 ? `, ~${city.avgWait} min average wait` : ''}">
  <meta property="og:url" content="${BASE_URL}/city/${city.slug}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_US">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Hitchhiking spots near ${city.name}",
    "description": "${city.spotCount} hitchhiking spots leaving ${city.name}, ${city.countryName}",
    "url": "${BASE_URL}/city/${city.slug}",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${city.lat},
      "longitude": ${city.lon}
    },
    "containedInPlace": {
      "@type": "Country",
      "name": "${city.countryName}"
    }
  }
  </script>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;background:#0f1520;color:#e2e8f0;margin:0;padding:20px}
    a{color:#f59e0b;text-decoration:none}a:hover{text-decoration:underline}
    .container{max-width:800px;margin:0 auto;padding:20px}
    h1{color:#fff;font-size:2em;margin-bottom:0.5em}
    h2{color:#f59e0b;font-size:1.3em;margin-top:1.5em}
    .info{background:#1a2332;padding:16px;border-radius:8px;margin:12px 0}
    .stat{display:inline-block;margin-right:16px;font-size:1.1em}
    .stat strong{color:#f59e0b}
    ul{padding-left:20px}li{margin:6px 0}
  </style>
</head>
<body>
  <div class="container">
    <p><a href="${BASE_URL}">&larr; Back to SpotHitch</a></p>
    <h1>Hitchhiking from ${city.name}</h1>
    <div class="info">
      <p class="stat"><strong>${city.spotCount}</strong> spots</p>
      ${city.avgWait > 0 ? `<p class="stat">Average wait: <strong>~${city.avgWait} min</strong></p>` : ''}
      ${city.avgRating > 0 ? `<p class="stat">Rating: <strong>${city.avgRating}/5</strong></p>` : ''}
      <p>Country: <a href="${BASE_URL}/guides/${city.country.toLowerCase()}">${city.countryName}</a></p>
    </div>
    <p><a href="${BASE_URL}/?city=${city.slug}&lat=${city.lat}&lon=${city.lon}">Open in SpotHitch App &rarr;</a></p>
    ${city.communityStats && city.communityStats.count > 0 ? renderCommunityStatsHTML(city.communityStats) : ''}
    ${city.routesList.length > 0 ? `
    <h2>Popular departure directions</h2>
    <ul>
${routesHTML}
    </ul>` : ''}
    <h2>More cities</h2>
    <ul>
      <li><a href="${BASE_URL}/">Find more hitchhiking spots worldwide</a></li>
    </ul>
    <p style="margin-top:2em"><a href="${BASE_URL}">&larr; Back to SpotHitch - The Hitchhiking Community</a></p>
  </div>
</body>
</html>`
}

// Main
const guides = extractGuides()
console.log(`Generating pre-rendered pages for ${guides.length} country guides...`)

// Verify extraction
for (const g of guides) {
  if (!g.nameEn || !g.flag) {
    console.warn(`  WARNING: ${g.code} missing nameEn="${g.nameEn}" flag="${g.flag}"`)
  }
}

// Create guides directory
const guidesDir = join(DIST_PATH, 'guides')
if (!existsSync(guidesDir)) mkdirSync(guidesDir, { recursive: true })

// Generate guide pages
for (const guide of guides) {
  const dir = join(guidesDir, guide.code.toLowerCase())
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), generateGuideHTML(guide, guides))
}

// City pages removed — will be re-added with real community data for beta

// Generate sitemap (guides only, no city pages)
writeFileSync(join(DIST_PATH, 'sitemap.xml'), generateSitemap(guides))

console.log(`Generated ${guides.length} guide pages + sitemap.xml`)
