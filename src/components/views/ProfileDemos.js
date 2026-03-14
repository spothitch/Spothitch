/**
 * ProfileDemos.js — Interactive demo overlays for "Prochainement" features
 * Each demo: intro window with full explanation + interactive tabs from mockups
 * Pattern: show → intro screen → start → interactive demo → close
 */

import { t } from '../../i18n/index.js'
import { escapeHTML } from '../../utils/sanitize.js'

// ==================== GENERIC TAB SWITCH ====================
function _switchDemoTab(btn, tabName) {
  if (!btn || !btn.closest) return
  const container = btn.closest('[data-demo]')
  if (!container) return
  container.querySelectorAll('.cd-tab').forEach(t => t.classList.remove('cd-tab-active'))
  container.querySelectorAll('[data-cd-panel]').forEach(p => { p.style.display = 'none' })
  btn.classList.add('cd-tab-active')
  const panel = container.querySelector(`[data-cd-panel="${tabName}"]`)
  if (panel) panel.style.display = 'block'
}
window.switchDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchPointsDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchJournalDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchSocialDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchCompanionDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchHostelsDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)
window.switchSpotDemoTab = (btn, tabName) => _switchDemoTab(btn, tabName)

// ==================== HELPER ====================
const _s = {
  overlay: 'position:fixed;inset:0;z-index:80;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;overflow-y:auto',
  wrap: 'width:100%;max-width:420px;margin:16px;position:relative',
  close: 'position:absolute;top:8px;right:8px;z-index:5;background:rgba(255,255,255,0.1);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center',
  intro: 'background:#1e293b;border-radius:16px;padding:28px 20px;text-align:center',
  btn: 'background:linear-gradient(135deg,#fbbf24,#d97706);color:#0f1520;font-weight:700;border:none;padding:12px 28px;border-radius:12px;font-size:0.9rem;cursor:pointer',
  bullet: 'display:flex;align-items:start;gap:10px;text-align:left;margin-bottom:8px',
  bicon: 'font-size:1.1rem;flex-shrink:0;margin-top:1px',
  btxt: 'font-size:0.78rem;color:#cbd5e1;line-height:1.4',
  demo: 'background:#0f1520;border-radius:16px;padding:14px;border:1px solid rgba(255,255,255,0.06)',
  tabs: 'display:flex;gap:4px;margin:8px 0;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch',
  card: 'background:#1a2332;border-radius:10px;padding:10px 12px;margin-bottom:5px;font-size:0.75rem;line-height:1.4',
  secT: 'font-size:0.75rem;font-weight:700;color:#fbbf24;margin-bottom:6px;display:flex;align-items:center;gap:5px',
  stat: 'background:#1a2332;border-radius:8px;padding:8px;text-align:center',
}

function _createDemo(id) {
  document.getElementById(id)?.remove()
  const overlay = document.createElement('div')
  overlay.id = id
  overlay.style.cssText = _s.overlay
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  return overlay
}

// ==================== 1. POINTS & CLASSEMENT ====================
window.showPointsDemo = () => {
  const ov = _createDemo('points-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closePointsDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="points-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">🏆</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('pointsDemoIntroTitle') || 'Points, Classement & Récompenses')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('pointsDemoIntroDesc') || 'Gagne des points en aidant la communauté, grimpe au classement et débloque des réductions chez nos partenaires voyage !')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">Gagne des points en créant et validant des spots, en ajoutant des photos et des conseils (+5 à +100 pts par action)</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🏅</span><span style="${_s.btxt}">Monte dans le classement de ton pays, d'Europe et mondial. Compare-toi à tes amis</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🔔</span><span style="${_s.btxt}">Reçois une notification quand tu passes près d'un spot à valider, même sans faire de stop (+20 pts)</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🎁</span><span style="${_s.btxt}">Échange tes points contre des réductions : Hostelworld (-15%), Booking (-10%), Decathlon (-15%), Flixbus, Interrail...</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🌟</span><span style="${_s.btxt}">6 niveaux : Débutant → Explorateur → Aventurier → Voyageur → Expert → Légende</span></div>
        </div>
        <button onclick="startPointsDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="points-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closePointsDemo = () => { document.getElementById('points-demo-overlay')?.remove() }

window.startPointsDemo = () => {
  const intro = document.getElementById('points-demo-intro')
  const main = document.getElementById('points-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo}">
      <div style="text-align:center;padding:12px;background:linear-gradient(135deg,rgba(251,191,36,0.08),rgba(217,119,6,0.05));border-radius:12px;margin-bottom:10px">
        <div style="font-size:2.2rem;font-weight:900;color:#fbbf24">1 250</div>
        <div style="font-size:0.68rem;color:#94a3b8">Points SpotHitch</div>
        <div style="display:inline-block;background:rgba(34,197,94,0.15);color:#22c55e;font-size:0.6rem;font-weight:700;padding:3px 10px;border-radius:12px;margin-top:4px">🌟 Niveau Explorateur</div>
      </div>

      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'pts-points')" role="button" tabindex="0">⭐ Mes Points</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-earn')" role="button" tabindex="0">💰 Gagner</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-rank')" role="button" tabindex="0">🏅 Classement</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-partners')" role="button" tabindex="0">🎁 Réductions</span>
      </div>

      <!-- Mes Points -->
      <div data-cd-panel="pts-points" style="display:block">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:8px">
          <div style="${_s.stat}"><div style="font-size:1rem;font-weight:800;color:#fbbf24">23</div><div style="font-size:0.48rem;color:#64748b;text-transform:uppercase">Spots créés</div></div>
          <div style="${_s.stat}"><div style="font-size:1rem;font-weight:800;color:#fbbf24">47</div><div style="font-size:0.48rem;color:#64748b;text-transform:uppercase">Validations</div></div>
          <div style="${_s.stat}"><div style="font-size:1rem;font-weight:800;color:#fbbf24">12</div><div style="font-size:0.48rem;color:#64748b;text-transform:uppercase">Conseils</div></div>
        </div>
        <div style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.05));border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:8px 10px;margin-bottom:8px;display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem;animation:shake 1s ease infinite">🔔</span>
          <div style="flex:1;font-size:0.68rem;font-weight:600;color:#22c55e">Tu passes près d'un spot !<br><span style="font-weight:400;font-size:0.6rem;color:#94a3b8">Aire de Fleury · Valide-le pour +20 pts</span></div>
          <span style="background:#22c55e;color:#0f1520;font-size:0.6rem;font-weight:700;padding:5px 10px;border-radius:6px">Valider ✓</span>
        </div>
        <div style="${_s.card}">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.68rem;font-weight:600">Prochain niveau : Aventurier</span><span style="font-size:0.6rem;color:#fbbf24;font-weight:700">1 250 / 2 000</span></div>
          <div style="height:5px;background:#1e293b;border-radius:3px;overflow:hidden"><div style="height:100%;width:62.5%;background:linear-gradient(90deg,#fbbf24,#d97706);border-radius:3px"></div></div>
        </div>
      </div>

      <!-- Gagner -->
      <div data-cd-panel="pts-earn" style="display:none">
        <div style="${_s.secT}"><span style="font-size:0.85rem">📍</span> Actions sur les spots</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">📍</span><div style="flex:1"><div style="font-weight:600">Créer un spot</div><div style="font-size:0.6rem;color:#64748b">Ajoute un nouveau spot avec photo</div></div><span style="font-weight:800;color:#fbbf24">+50</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">✅</span><div style="flex:1"><div style="font-weight:600">Valider un spot</div><div style="font-size:0.6rem;color:#64748b">Confirme qu'un spot existe encore</div></div><span style="font-weight:800;color:#fbbf24">+20</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">📸</span><div style="flex:1"><div style="font-weight:600">Ajouter une photo</div><div style="font-size:0.6rem;color:#64748b">Photo récente d'un spot</div></div><span style="font-weight:800;color:#fbbf24">+10</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">💬</span><div style="flex:1"><div style="font-weight:600">Laisser un conseil</div><div style="font-size:0.6rem;color:#64748b">Astuce utile pour la commu</div></div><span style="font-weight:800;color:#fbbf24">+15</span></div>
        <div style="${_s.secT};margin-top:10px"><span style="font-size:0.85rem">🤝</span> Actions sociales</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">👋</span><div style="flex:1"><div style="font-weight:600">Inviter un ami</div><div style="font-size:0.6rem;color:#64748b">Ton ami rejoint SpotHitch</div></div><span style="font-weight:800;color:#fbbf24">+100</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">🏁</span><div style="flex:1"><div style="font-weight:600">Participer à une course</div><div style="font-size:0.6rem;color:#64748b">Termine une course entre potes</div></div><span style="font-weight:800;color:#fbbf24">+50</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1rem">🎉</span><div style="flex:1"><div style="font-weight:600">Organiser un événement</div><div style="font-size:0.6rem;color:#64748b">Crée un meetup autostoppeurs</div></div><span style="font-weight:800;color:#fbbf24">+40</span></div>
        <div style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.05));border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:8px;margin-top:8px;font-size:0.65rem;color:#22c55e">
          🔔 <strong>Validation automatique</strong> : Quand tu passes près d'un spot, une notification te propose de le valider, même si tu ne fais pas de stop. +20 pts !
        </div>
      </div>

      <!-- Classement -->
      <div data-cd-panel="pts-rank" style="display:none">
        <div style="${_s.secT}"><span style="font-size:0.85rem">🏅</span> Top France · Mars 2026</div>
        <div style="${_s.card};display:flex;align-items:center;gap:6px"><span style="font-size:0.85rem;font-weight:900;color:#fbbf24;min-width:18px">1</span><span style="width:24px;height:24px;border-radius:50%;background:#fbbf24;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;flex-shrink:0">S</span><div style="flex:1"><div style="font-weight:600">RoadSophie</div><div style="font-size:0.58rem;color:#64748b">Lyon · 156 spots</div></div><span style="font-weight:800;color:#fbbf24">8 420</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:6px"><span style="font-size:0.85rem;font-weight:900;color:#94a3b8;min-width:18px">2</span><span style="width:24px;height:24px;border-radius:50%;background:#94a3b8;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;flex-shrink:0">M</span><div style="flex:1"><div style="font-weight:600">MarcoHitch</div><div style="font-size:0.58rem;color:#64748b">Paris · 98 spots</div></div><span style="font-weight:800;color:#fbbf24">6 890</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:6px"><span style="font-size:0.85rem;font-weight:900;color:#cd7f32;min-width:18px">3</span><span style="width:24px;height:24px;border-radius:50%;background:#cd7f32;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;flex-shrink:0">L</span><div style="flex:1"><div style="font-weight:600">LunaVoyage</div><div style="font-size:0.58rem;color:#64748b">Toulouse · 87 spots</div></div><span style="font-weight:800;color:#fbbf24">5 210</span></div>
        <div style="text-align:center;padding:6px;font-size:0.6rem;color:#64748b">• • •</div>
        <div style="${_s.card};display:flex;align-items:center;gap:6px;border:1px solid rgba(251,191,36,0.3);background:rgba(251,191,36,0.05)"><span style="font-size:0.85rem;font-weight:900;color:#fbbf24;min-width:18px">42</span><span style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#d97706);color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;flex-shrink:0">T</span><div style="flex:1"><div style="font-weight:600;color:#fbbf24">Toi ← C'est toi !</div><div style="font-size:0.58rem;color:#64748b">Paris · 23 spots</div></div><span style="font-weight:800;color:#fbbf24">1 250</span></div>
        <div style="margin-top:10px;display:flex;gap:4px;flex-wrap:wrap">
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)">🇫🇷 France</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:transparent;color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">🇪🇺 Europe</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:transparent;color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">🌍 Monde</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:transparent;color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">👫 Amis</span>
        </div>
      </div>

      <!-- Réductions -->
      <div data-cd-panel="pts-partners" style="display:none">
        <div style="${_s.card};border-left:3px solid #fbbf24;font-size:0.68rem;color:#94a3b8;margin-bottom:8px">💡 Accumule des points en aidant la communauté puis échange-les contre des réductions chez nos partenaires voyage !</div>
        <div style="${_s.secT}"><span style="font-size:0.85rem">🏨</span> Hébergement</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🏨</span><div style="flex:1"><div style="font-weight:700">Hostelworld</div><div style="font-size:0.58rem;color:#94a3b8">-15% sur toutes les auberges</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-15%</div><div style="font-size:0.5rem;color:#64748b">2 000 pts</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🏠</span><div style="flex:1"><div style="font-weight:700">Booking.com</div><div style="font-size:0.58rem;color:#94a3b8">-10% hébergements sélectionnés</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-10%</div><div style="font-size:0.5rem;color:#64748b">3 000 pts</div></div></div>
        <div style="${_s.secT};margin-top:8px"><span style="font-size:0.85rem">🎒</span> Équipement</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">⛺</span><div style="flex:1"><div style="font-weight:700">Decathlon</div><div style="font-size:0.58rem;color:#94a3b8">-15% rayon randonnée & camping</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-15%</div><div style="font-size:0.5rem;color:#64748b">2 500 pts</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🧥</span><div style="flex:1"><div style="font-weight:700">Patagonia</div><div style="font-size:0.58rem;color:#94a3b8">-10% vêtements outdoor</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-10%</div><div style="font-size:0.5rem;color:#64748b">4 000 pts</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🎒</span><div style="flex:1"><div style="font-weight:700">Osprey</div><div style="font-size:0.58rem;color:#94a3b8">-20% sacs à dos voyage</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-20%</div><div style="font-size:0.5rem;color:#64748b">3 500 pts</div></div></div>
        <div style="${_s.secT};margin-top:8px"><span style="font-size:0.85rem">🚌</span> Transport</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🚌</span><div style="flex:1"><div style="font-weight:700">Flixbus</div><div style="font-size:0.58rem;color:#94a3b8">-10% tous les trajets</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-10%</div><div style="font-size:0.5rem;color:#64748b">1 000 pts</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🚂</span><div style="flex:1"><div style="font-weight:700">Interrail</div><div style="font-size:0.58rem;color:#94a3b8">-15% pass ferroviaire Europe</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-15%</div><div style="font-size:0.5rem;color:#64748b">8 000 pts</div></div></div>
        <div style="${_s.secT};margin-top:8px"><span style="font-size:0.85rem">🌍</span> Expériences</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">🎫</span><div style="flex:1"><div style="font-weight:700">GetYourGuide</div><div style="font-size:0.58rem;color:#94a3b8">-10% activités et visites</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-10%</div><div style="font-size:0.5rem;color:#64748b">1 500 pts</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="font-size:1.1rem">📱</span><div style="flex:1"><div style="font-weight:700">Airalo eSIM</div><div style="font-size:0.58rem;color:#94a3b8">-15% forfait data voyage</div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">-15%</div><div style="font-size:0.5rem;color:#64748b">800 pts</div></div></div>
        <div style="text-align:center;margin-top:8px;font-size:0.68rem"><span style="font-weight:700">Tes points : <span style="color:#fbbf24">1 250</span></span><br><span style="font-size:0.6rem;color:#64748b">Tu peux déjà débloquer Flixbus (-10%) et Airalo (-15%) !</span></div>
      </div>
    </div>
  `
}

// ==================== 2. CARNET DE VOYAGE ====================
window.showJournalDemo = () => {
  const ov = _createDemo('journal-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closeJournalDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="journal-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">📔</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('journalDemoIntroTitle') || 'Carnet de Voyage')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('journalDemoIntroDesc') || 'Ton voyage enregistré automatiquement, étape par étape. Partage tes itinéraires et inspire la communauté !')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">📝</span><span style="${_s.btxt}">Chaque lift enregistré automatiquement : ville de départ, spot utilisé, temps d'attente, véhicule</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">📊</span><span style="${_s.btxt}">Stats complètes de chaque voyage : km parcourus, nombre de lifts, temps total, pays traversés</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🗺️</span><span style="${_s.btxt}">Visualise ton parcours étape par étape sur une carte avec la timeline de chaque jour</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🌍</span><span style="${_s.btxt}">Partage tes itinéraires avec la communauté. Tes spots, temps d'attente et conseils aident tout le monde</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">❤️</span><span style="${_s.btxt}">Explore les voyages des autres autostoppeurs pour trouver l'inspiration et planifier tes prochaines aventures</span></div>
        </div>
        <button onclick="startJournalDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="journal-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closeJournalDemo = () => { document.getElementById('journal-demo-overlay')?.remove() }

window.startJournalDemo = () => {
  const intro = document.getElementById('journal-demo-intro')
  const main = document.getElementById('journal-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo}">
      <div style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a);border-radius:12px;height:80px;position:relative;overflow:hidden;margin-bottom:8px">
        <div style="position:absolute;top:38px;left:30px;right:30px;height:2px;background:linear-gradient(90deg,#fbbf24,#22c55e,#3b82f6,#ec4899)"></div>
        <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#fbbf24;border:2px solid #fff;top:35px;left:28px"></div>
        <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#22c55e;border:2px solid #fff;top:35px;left:30%"></div>
        <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#3b82f6;border:2px solid #fff;top:35px;left:55%"></div>
        <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#ec4899;border:2px solid #fff;top:35px;right:28px"></div>
        <div style="position:absolute;font-size:0.48rem;font-weight:700;top:48px;left:18px;color:#fbbf24">Paris</div>
        <div style="position:absolute;font-size:0.48rem;font-weight:700;top:48px;left:26%;color:#22c55e">Lyon</div>
        <div style="position:absolute;font-size:0.48rem;font-weight:700;top:48px;left:48%;color:#3b82f6">Marseille</div>
        <div style="position:absolute;font-size:0.48rem;font-weight:700;top:48px;right:10px;color:#ec4899">Barcelone</div>
        <div style="position:absolute;bottom:5px;right:8px;font-size:0.5rem;color:#64748b">🇫🇷 → 🇪🇸</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;margin-bottom:8px">
        <div style="${_s.stat}"><div style="font-size:0.85rem;font-weight:800;color:#fbbf24">1 085</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">km</div></div>
        <div style="${_s.stat}"><div style="font-size:0.85rem;font-weight:800;color:#fbbf24">4</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">lifts</div></div>
        <div style="${_s.stat}"><div style="font-size:0.85rem;font-weight:800;color:#fbbf24">8h30</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">trajet</div></div>
        <div style="${_s.stat}"><div style="font-size:0.85rem;font-weight:800;color:#fbbf24">2</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">pays</div></div>
      </div>

      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'jrn-current')" role="button" tabindex="0">🗺️ Voyage en cours</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'jrn-history')" role="button" tabindex="0">📚 Mes voyages</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'jrn-community')" role="button" tabindex="0">🌍 Communauté</span>
      </div>

      <!-- Voyage en cours -->
      <div data-cd-panel="jrn-current" style="display:block">
        <div style="${_s.secT}"><span style="font-size:0.85rem">📍</span> Étapes du voyage</div>
        <div style="position:relative;padding-left:24px">
          <div style="position:absolute;left:7px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#fbbf24,#22c55e,#3b82f6,#ec4899)"></div>
          <div style="position:relative;margin-bottom:10px"><div style="position:absolute;left:-20px;top:5px;width:8px;height:8px;border-radius:50%;background:#fbbf24"></div><div style="${_s.card}"><div style="font-size:0.55rem;color:#64748b">📅 15 mars · 7h30</div><div style="font-weight:700;font-size:0.78rem">🏁 Paris · Départ</div><div style="font-size:0.62rem;color:#94a3b8">📍 Porte d'Orléans, direction A6</div><div style="display:flex;gap:6px;margin-top:3px;font-size:0.58rem"><span style="color:#22c55e">⏱️ 12 min</span><span style="color:#64748b">📋 Panneau "Lyon"</span></div></div></div>
          <div style="position:relative;margin-bottom:10px"><div style="position:absolute;left:-20px;top:5px;width:8px;height:8px;border-radius:50%;background:#22c55e"></div><div style="${_s.card}"><div style="font-size:0.55rem;color:#64748b">📅 15 mars · 12h15</div><div style="font-weight:700;font-size:0.78rem">🛑 Lyon · Étape 1</div><div style="font-size:0.62rem;color:#94a3b8">📍 Aire de Dardilly · Pause déjeuner</div><div style="display:flex;gap:6px;margin-top:3px;font-size:0.58rem"><span style="color:#64748b">🚗 465 km</span><span style="color:#fbbf24">⭐ +50 pts</span></div></div></div>
          <div style="position:relative;margin-bottom:10px"><div style="position:absolute;left:-20px;top:5px;width:8px;height:8px;border-radius:50%;background:#3b82f6"></div><div style="${_s.card}"><div style="font-size:0.55rem;color:#64748b">📅 15 mars · 17h00</div><div style="font-weight:700;font-size:0.78rem">🛑 Marseille · Étape 2</div><div style="font-size:0.62rem;color:#94a3b8">📍 La Joliette · Nuit en auberge</div><div style="display:flex;gap:6px;margin-top:3px;font-size:0.58rem"><span style="color:#64748b">🚗 315 km</span><span style="color:#fbbf24">⭐ +50 pts</span></div></div></div>
          <div style="position:relative"><div style="position:absolute;left:-20px;top:5px;width:8px;height:8px;border-radius:50%;background:#ec4899"></div><div style="${_s.card};border:1px solid rgba(236,72,153,0.3)"><div style="font-size:0.55rem;color:#ec4899">📅 16 mars · 9h00 · EN COURS</div><div style="font-weight:700;font-size:0.78rem">🚀 Marseille → Barcelone</div><div style="font-size:0.62rem;color:#94a3b8">📍 Sortie A50 · Direction Espagne</div><div style="display:flex;gap:6px;margin-top:3px;font-size:0.58rem"><span style="color:#ec4899">⏳ En attente...</span></div></div></div>
        </div>
      </div>

      <!-- Mes voyages -->
      <div data-cd-panel="jrn-history" style="display:none">
        <div style="${_s.card};border:1px solid rgba(255,255,255,0.04);padding:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:0.9rem">🇫🇷→🇪🇸</span><div><div style="font-weight:700;font-size:0.78rem">Paris → Barcelone</div><div style="font-size:0.58rem;color:#64748b">15-16 mars 2026 · En cours</div></div></div>
          <div style="display:flex;gap:4px"><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">1 085</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">km</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">4</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">lifts</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">8h30</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">temps</div></div></div>
        </div>
        <div style="${_s.card};border:1px solid rgba(255,255,255,0.04);padding:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:0.9rem">🇫🇷→🇩🇪</span><div><div style="font-weight:700;font-size:0.78rem">Paris → Berlin</div><div style="font-size:0.58rem;color:#64748b">28 fév au 2 mars 2026</div></div></div>
          <div style="display:flex;gap:4px"><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">1 050</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">km</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">6</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">lifts</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">14h</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">temps</div></div></div>
        </div>
        <div style="${_s.card};border:1px solid rgba(255,255,255,0.04);padding:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:0.9rem">🇫🇷→🇳🇱</span><div><div style="font-weight:700;font-size:0.78rem">Lyon → Amsterdam</div><div style="font-size:0.58rem;color:#64748b">10-12 jan 2026</div></div></div>
          <div style="display:flex;gap:4px"><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">1 100</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">km</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">7</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">lifts</div></div><div style="flex:1;text-align:center"><div style="font-size:0.8rem;font-weight:800;color:#fbbf24">16h</div><div style="font-size:0.45rem;color:#64748b;text-transform:uppercase">temps</div></div></div>
        </div>
      </div>

      <!-- Communauté -->
      <div data-cd-panel="jrn-community" style="display:none">
        <div style="${_s.secT}"><span style="font-size:0.85rem">🌍</span> Voyages récents</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#22c55e;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">S</span><div style="flex:1"><div style="font-weight:600">RoadSophie</div><div style="font-size:0.6rem;color:#fbbf24">🇫🇷 Lyon → 🇮🇹 Rome</div><div style="font-size:0.55rem;color:#64748b">1 200 km · 8 lifts · ❤️ 24</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">M</span><div style="flex:1"><div style="font-weight:600">MarcoHitch</div><div style="font-size:0.6rem;color:#fbbf24">🇩🇪 Berlin → 🇵🇱 Cracovie</div><div style="font-size:0.55rem;color:#64748b">640 km · 5 lifts · ❤️ 18</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#ec4899;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">L</span><div style="flex:1"><div style="font-weight:600">LunaVoyage</div><div style="font-size:0.6rem;color:#fbbf24">🇪🇸 Madrid → 🇵🇹 Lisbonne</div><div style="font-size:0.55rem;color:#64748b">630 km · 4 lifts · ❤️ 31</div></div></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#fbbf24;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">T</span><div style="flex:1"><div style="font-weight:600">TomPouce34</div><div style="font-size:0.6rem;color:#fbbf24">🇫🇷 Paris → 🇬🇧 Londres</div><div style="font-size:0.55rem;color:#64748b">460 km · 3 lifts + ferry · ❤️ 45</div></div></div>
      </div>
    </div>
  `
}

// ==================== 3. SOCIAL, COURSES & ÉVÉNEMENTS ====================
window.showSocialDemo = () => {
  const ov = _createDemo('social-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closeSocialDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="social-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">👥</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('socialDemoIntroTitle') || 'Social, Courses & Événements')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('socialDemoIntroDesc') || 'Rencontre des autostoppeurs, fais la course entre potes et organise des événements !')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">Vois les autostoppeurs à moins de 5 km de toi en temps réel. Active ta position pour 2h</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🏁</span><span style="${_s.btxt}">Fais la course entre potes avec classement en direct ! Crée un trajet et invite tes amis</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">Partage tes meilleurs spots en temps réel avec les participants de ta course</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🎉</span><span style="${_s.btxt}">Rejoins des événements : meetups mensuels, courses officielles, festivals, ateliers sécurité</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">💬</span><span style="${_s.btxt}">Discute avec les autostoppeurs proches et trouve des compagnons de route pour tes trajets</span></div>
        </div>
        <button onclick="startSocialDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="social-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closeSocialDemo = () => { document.getElementById('social-demo-overlay')?.remove() }

window.startSocialDemo = () => {
  const intro = document.getElementById('social-demo-intro')
  const main = document.getElementById('social-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo}">
      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'soc-nearby')" role="button" tabindex="0">📍 Proches</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-races')" role="button" tabindex="0">🏁 Courses</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-events')" role="button" tabindex="0">🎉 Événements</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-spots')" role="button" tabindex="0">📍 Spots partagés</span>
      </div>

      <!-- Proches -->
      <div data-cd-panel="soc-nearby" style="display:block">
        <div style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a);border-radius:12px;height:140px;position:relative;overflow:hidden;margin-bottom:8px">
          <div style="position:absolute;width:12px;height:12px;border-radius:50%;background:#fbbf24;border:2px solid #fff;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2"></div>
          <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#22c55e;border:2px solid #fff;top:35%;left:35%"></div>
          <div style="position:absolute;font-size:0.48rem;font-weight:700;top:28%;left:24%;color:#22c55e;background:rgba(0,0,0,0.7);padding:1px 4px;border-radius:3px">Clara · 1.2 km</div>
          <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#3b82f6;border:2px solid #fff;top:60%;left:65%"></div>
          <div style="position:absolute;font-size:0.48rem;font-weight:700;top:53%;left:56%;color:#3b82f6;background:rgba(0,0,0,0.7);padding:1px 4px;border-radius:3px">Alex · 3.5 km</div>
          <div style="position:absolute;width:8px;height:8px;border-radius:50%;background:#ec4899;border:2px solid #fff;top:30%;left:70%"></div>
          <div style="position:absolute;font-size:0.48rem;font-weight:700;top:23%;left:61%;color:#ec4899;background:rgba(0,0,0,0.7);padding:1px 4px;border-radius:3px">Luna · 5 km</div>
          <div style="position:absolute;bottom:5px;left:6px;font-size:0.5rem;color:#94a3b8">📍 3 autostoppeurs dans un rayon de 5 km</div>
        </div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:30px;height:30px;border-radius:50%;background:#22c55e;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">C</span><div style="flex:1"><div style="font-weight:600">Clara</div><div style="font-size:0.58rem;color:#94a3b8">Direction Lyon · Panneau "A6"</div></div><span style="font-size:0.62rem;font-weight:700;color:#22c55e">1.2 km</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:30px;height:30px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">A</span><div style="flex:1"><div style="font-weight:600">Alex</div><div style="font-size:0.58rem;color:#94a3b8">Direction Bordeaux · Pouce</div></div><span style="font-size:0.62rem;font-weight:700;color:#22c55e">3.5 km</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:30px;height:30px;border-radius:50%;background:#ec4899;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">L</span><div style="flex:1"><div style="font-weight:600">Luna</div><div style="font-size:0.58rem;color:#94a3b8">Direction Marseille · En attente</div></div><span style="font-size:0.62rem;font-weight:700;color:#22c55e">5 km</span></div>
      </div>

      <!-- Courses -->
      <div data-cd-panel="soc-races" style="display:none">
        <div style="${_s.card};border:1px solid rgba(236,72,153,0.3);padding:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-weight:800;font-size:0.82rem">🏁 Paris → Barcelone</span><span style="font-size:0.55rem;font-weight:700;padding:3px 6px;border-radius:6px;background:rgba(236,72,153,0.15);color:#ec4899">EN COURS</span></div>
          <div style="font-size:0.65rem;color:#94a3b8;margin-bottom:8px">1 085 km · 4 participants · Départ 15 mars</div>
          <div style="${_s.secT};font-size:0.68rem">🏅 Classement live</div>
          <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;padding:4px 0"><span style="font-weight:900;color:#fbbf24;min-width:14px;font-size:0.7rem">1</span><span style="width:20px;height:20px;border-radius:50%;background:#22c55e;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;flex-shrink:0">C</span><div style="flex:1;font-size:0.65rem">Clara<div style="font-size:0.55rem;color:#94a3b8">Marseille · 780 km</div><div style="height:3px;background:#1e293b;border-radius:2px;margin-top:2px;overflow:hidden"><div style="height:100%;width:72%;background:#22c55e;border-radius:2px"></div></div></div><span style="font-size:0.58rem;font-weight:700;color:#22c55e">72%</span></div>
          <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;padding:4px 0"><span style="font-weight:900;color:#94a3b8;min-width:14px;font-size:0.7rem">2</span><span style="width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#d97706);color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;flex-shrink:0">T</span><div style="flex:1;font-size:0.65rem"><span style="color:#fbbf24">Toi</span><div style="font-size:0.55rem;color:#94a3b8">Lyon · 600 km</div><div style="height:3px;background:#1e293b;border-radius:2px;margin-top:2px;overflow:hidden"><div style="height:100%;width:55%;background:#fbbf24;border-radius:2px"></div></div></div><span style="font-size:0.58rem;font-weight:700;color:#fbbf24">55%</span></div>
          <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;padding:4px 0"><span style="font-weight:900;color:#94a3b8;min-width:14px;font-size:0.7rem">3</span><span style="width:20px;height:20px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;flex-shrink:0">A</span><div style="flex:1;font-size:0.65rem">Alex<div style="font-size:0.55rem;color:#94a3b8">Dijon · 430 km</div><div style="height:3px;background:#1e293b;border-radius:2px;margin-top:2px;overflow:hidden"><div style="height:100%;width:40%;background:#3b82f6;border-radius:2px"></div></div></div><span style="font-size:0.58rem;font-weight:700;color:#3b82f6">40%</span></div>
          <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;padding:4px 0"><span style="font-weight:900;color:#94a3b8;min-width:14px;font-size:0.7rem">4</span><span style="width:20px;height:20px;border-radius:50%;background:#8b5cf6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;flex-shrink:0">M</span><div style="flex:1;font-size:0.65rem">Max<div style="font-size:0.55rem;color:#94a3b8">Auxerre · 270 km</div><div style="height:3px;background:#1e293b;border-radius:2px;margin-top:2px;overflow:hidden"><div style="height:100%;width:25%;background:#8b5cf6;border-radius:2px"></div></div></div><span style="font-size:0.58rem;font-weight:700;color:#8b5cf6">25%</span></div>
        </div>
        <div style="display:block;background:linear-gradient(135deg,#fbbf24,#d97706);color:#0f1520;font-weight:700;text-align:center;padding:10px;border-radius:10px;margin-top:8px;font-size:0.75rem">🏁 Créer une nouvelle course</div>
      </div>

      <!-- Événements -->
      <div data-cd-panel="soc-events" style="display:none">
        <div style="${_s.card};border:1px solid rgba(236,72,153,0.2);padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🏁</span><div><div style="font-weight:700;font-size:0.78rem">Course Paris → Barcelone</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">15-17 mars 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Course officielle ! 12 autostoppeurs, classement live, spots partagés.</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 12 inscrits · 🏆 Prix : 50€</div><span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">✅ Inscrit</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🍻</span><div><div style="font-weight:700;font-size:0.78rem">Meetup Paris</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">22 mars 2026 · 19h</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Rencontre mensuelle des autostoppeurs parisiens. Bières et aventures !</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 28 inscrits · 🆓 Gratuit</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🏕️</span><div><div style="font-weight:700;font-size:0.78rem">Festival Nomade · Ardèche</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">12-14 avril 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Camping + ateliers (panneaux, sécurité, premiers secours). Débutants bienvenus !</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 45 inscrits · 💰 15€</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🌍</span><div><div style="font-weight:700;font-size:0.78rem">Rassemblement Européen · Bruxelles</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">1-3 mai 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">200+ participants de 15 pays. Conférences, courses, ateliers.</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 142 inscrits · 🌐 15 pays</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
      </div>

      <!-- Spots partagés -->
      <div data-cd-panel="soc-spots" style="display:none">
        <div style="${_s.card};border-left:3px solid #22c55e;font-size:0.65rem;color:#94a3b8;margin-bottom:8px">💡 Pendant une course, partagez vos meilleurs spots avec les autres participants en temps réel !</div>
        <div style="${_s.secT}"><span style="font-size:0.85rem">📍</span> Course Paris→Barcelone</div>
        <div style="${_s.card}"><div style="display:flex;justify-content:space-between"><div><div style="font-weight:700">Aire de Fleury</div><div style="font-size:0.58rem;color:#94a3b8">A6 direction Lyon · Clara il y a 2h</div></div><span style="font-size:0.62rem;font-weight:700;color:#22c55e">⏱️ 8 min</span></div><div style="font-size:0.6rem;color:#94a3b8;margin-top:3px;font-style:italic">"Routier sympa, foncez !" · Clara</div></div>
        <div style="${_s.card}"><div style="display:flex;justify-content:space-between"><div><div style="font-weight:700">Station Total Valence</div><div style="font-size:0.58rem;color:#94a3b8">A7 direction Marseille · Toi il y a 1h</div></div><span style="font-size:0.62rem;font-weight:700;color:#fbbf24">⏱️ 15 min</span></div><div style="font-size:0.6rem;color:#94a3b8;margin-top:3px;font-style:italic">"Beaucoup de camions, panneau recommandé" · Toi</div></div>
        <div style="${_s.card}"><div style="display:flex;justify-content:space-between"><div><div style="font-weight:700">Sortie Nîmes</div><div style="font-size:0.58rem;color:#94a3b8">A9 direction Espagne · Alex il y a 30min</div></div><span style="font-size:0.62rem;font-weight:700;color:#22c55e">⏱️ 5 min</span></div><div style="font-size:0.6rem;color:#94a3b8;margin-top:3px;font-style:italic">"Spot incroyable, 5 min !" · Alex</div></div>
      </div>
    </div>
  `
}

// ==================== 4. MODE COMPAGNON SÉCURITÉ ====================
window.showCompanionDemo = () => {
  const ov = _createDemo('companion-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closeCompanionDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="companion-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">🛡️</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('companionDemoIntroTitle') || 'Mode Compagnon Sécurité')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('companionDemoIntroDesc') || 'Rassure tes proches pendant ton trajet en stop avec le suivi en direct et les check-ins automatiques.')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">Tes proches (gardiens) voient ta position en direct sur la carte SpotHitch</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">✅</span><span style="${_s.btxt}">Check-in régulier (30min, 1h ou 2h) : un bouton pour confirmer que tout va bien</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">⚠️</span><span style="${_s.btxt}">Si tu manques un check-in, alerte automatique à tes gardiens avec ta dernière position</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🆘</span><span style="${_s.btxt}">Bouton SOS : alerte immédiate à tous tes gardiens + appel urgences + enregistrement audio</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🛡️</span><span style="${_s.btxt}">Version améliorée du compagnon de route actuel avec position live et connexion directe au SOS</span></div>
        </div>
        <button onclick="startCompanionDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="companion-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closeCompanionDemo = () => { document.getElementById('companion-demo-overlay')?.remove() }

window.startCompanionDemo = () => {
  const intro = document.getElementById('companion-demo-intro')
  const main = document.getElementById('companion-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo}">
      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'cmp-me')" role="button" tabindex="0">🧳 Mon trajet</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'cmp-guardian')" role="button" tabindex="0">👁️ Vue Gardien</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'cmp-config')" role="button" tabindex="0">⚙️ Réglages</span>
      </div>

      <!-- Mon trajet -->
      <div data-cd-panel="cmp-me" style="display:block">
        <div style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.02));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:12px;text-align:center;margin-bottom:8px">
          <div style="font-size:1.8rem;margin-bottom:2px">🛡️</div>
          <div style="font-size:0.72rem;font-weight:700;color:#22c55e">Mode Compagnon actif</div>
          <div style="font-size:0.58rem;color:#94a3b8">Maman et Clara voient ta position en direct</div>
        </div>
        <div style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a);border-radius:12px;height:100px;position:relative;overflow:hidden;margin-bottom:8px">
          <div style="position:absolute;top:48px;left:30px;right:80px;height:2px;background:rgba(34,197,94,0.3)"></div>
          <div style="position:absolute;width:6px;height:6px;border-radius:50%;background:#fbbf24;top:46px;left:28px"></div>
          <div style="position:absolute;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff;top:43px;left:60%"></div>
          <div style="position:absolute;width:6px;height:6px;border-radius:50%;background:#ec4899;top:46px;right:78px"></div>
          <div style="position:absolute;bottom:5px;left:6px;font-size:0.5rem;color:#94a3b8;background:rgba(0,0,0,0.6);padding:2px 6px;border-radius:4px">🟢 Position partagée en direct</div>
          <div style="position:absolute;top:5px;right:6px;font-size:0.5rem;color:#22c55e;font-weight:700;background:rgba(0,0,0,0.6);padding:2px 6px;border-radius:4px">Mis à jour il y a 30s</div>
        </div>
        <div style="text-align:center;padding:12px;background:#1a2332;border-radius:10px;margin-bottom:8px">
          <div style="font-size:1.8rem;font-weight:900;color:#22c55e;font-variant-numeric:tabular-nums">47:23</div>
          <div style="font-size:0.6rem;color:#94a3b8;margin-top:2px">Prochain check-in dans</div>
          <div style="height:3px;background:#1e293b;border-radius:2px;margin-top:6px;overflow:hidden"><div style="height:100%;width:21%;background:linear-gradient(90deg,#22c55e,#10b981);border-radius:2px"></div></div>
        </div>
        <div style="background:linear-gradient(135deg,#22c55e,#10b981);color:#fff;font-size:0.82rem;font-weight:800;text-align:center;padding:12px;border-radius:12px;margin-bottom:6px;box-shadow:0 4px 20px rgba(34,197,94,0.3)">✅ Tout va bien · Envoyer check-in</div>
        <div style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:0.78rem;font-weight:800;text-align:center;padding:10px;border-radius:12px;box-shadow:0 4px 20px rgba(239,68,68,0.3)">🆘 SOS · Alerter mes gardiens + urgences</div>
        <div style="${_s.secT};margin-top:10px"><span style="font-size:0.85rem">👁️</span> Mes gardiens</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#ec4899;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">M</span><div style="flex:1"><div style="font-weight:600">Maman</div><div style="font-size:0.55rem;color:#94a3b8">Voit ta position en temps réel</div></div><span style="font-size:0.55rem;font-weight:700;color:#22c55e">🟢 En ligne</span></div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px"><span style="width:28px;height:28px;border-radius:50%;background:#22c55e;color:#0f1520;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">C</span><div style="flex:1"><div style="font-weight:600">Clara</div><div style="font-size:0.55rem;color:#94a3b8">Voit ta position en temps réel</div></div><span style="font-size:0.55rem;font-weight:700;color:#64748b">⚫ Hors ligne</span></div>
      </div>

      <!-- Vue Gardien -->
      <div data-cd-panel="cmp-guardian" style="display:none">
        <div style="${_s.card};border-left:3px solid #22c55e;font-size:0.65rem;color:#94a3b8;margin-bottom:8px">👁️ Voici ce que tes gardiens (maman, amis) voient sur leur téléphone</div>
        <div style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.04));border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:12px;text-align:center;margin-bottom:8px">
          <div style="font-size:1.5rem">🟢</div>
          <div style="font-size:0.72rem;font-weight:700;color:#22c55e">Antoine va bien</div>
          <div style="font-size:0.55rem;color:#94a3b8">Dernier check-in il y a 12 min · Lyon</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px">
          <div style="${_s.stat}"><div style="font-size:0.85rem">🏁</div><div style="font-size:0.45rem;color:#64748b">Départ</div><div style="font-size:0.65rem;font-weight:700">Paris</div></div>
          <div style="${_s.stat}"><div style="font-size:0.85rem">📍</div><div style="font-size:0.45rem;color:#64748b">Position</div><div style="font-size:0.65rem;font-weight:700;color:#22c55e">Lyon</div></div>
          <div style="${_s.stat}"><div style="font-size:0.85rem">🎯</div><div style="font-size:0.45rem;color:#64748b">Arrivée</div><div style="font-size:0.65rem;font-weight:700">Barcelone</div></div>
        </div>
        <div style="${_s.secT}"><span style="font-size:0.85rem">📋</span> Notifications reçues</div>
        <div style="${_s.card};border-left:3px solid #22c55e"><strong style="color:#22c55e">✅ Tout va bien</strong> · Antoine est à Lyon, direction Marseille<div style="font-size:0.52rem;color:#64748b;margin-top:2px">Il y a 12 min</div></div>
        <div style="${_s.card};border-left:3px solid #22c55e"><strong style="color:#22c55e">✅ Tout va bien</strong> · Aire de Fleury sur l'A6<div style="font-size:0.52rem;color:#64748b;margin-top:2px">Il y a 1h25</div></div>
        <div style="${_s.card};border-left:3px solid #3b82f6"><strong style="color:#3b82f6">🚀 Trajet démarré</strong> · Paris vers Barcelone<div style="font-size:0.52rem;color:#64748b;margin-top:2px">Il y a 6h15</div></div>
        <div style="${_s.card};border:1px solid rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);margin-top:8px"><div style="font-size:0.68rem;font-weight:700;color:#ef4444;margin-bottom:3px">⚠️ Si un check-in est manqué</div><div style="font-size:0.58rem;color:#94a3b8">Alerte immédiate + dernière position + appeler directement + contacter urgences</div></div>
      </div>

      <!-- Réglages -->
      <div data-cd-panel="cmp-config" style="display:none">
        <div style="${_s.secT}"><span style="font-size:0.85rem">⏰</span> Fréquence check-in</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px">
          <div style="${_s.card};text-align:center"><div style="font-size:0.85rem">⚡</div><div style="font-size:0.65rem;font-weight:600">30 min</div><div style="font-size:0.5rem;color:#64748b">Prudent</div></div>
          <div style="${_s.card};text-align:center;border:1px solid rgba(251,191,36,0.3);background:rgba(251,191,36,0.05)"><div style="font-size:0.85rem">✅</div><div style="font-size:0.65rem;font-weight:600;color:#fbbf24">1 heure</div><div style="font-size:0.5rem;color:#fbbf24">Recommandé</div></div>
          <div style="${_s.card};text-align:center"><div style="font-size:0.85rem">🕐</div><div style="font-size:0.65rem;font-weight:600">2 heures</div><div style="font-size:0.5rem;color:#64748b">Relax</div></div>
        </div>
        <div style="${_s.secT}"><span style="font-size:0.85rem">🔔</span> En cas de check-in manqué</div>
        <div style="${_s.card}">
          <div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:0.68rem">📱 Notification push aux gardiens</span><span style="color:#22c55e;font-size:0.6rem;font-weight:700">Oui ✓</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:0.68rem">📩 SMS d'alerte</span><span style="color:#22c55e;font-size:0.6rem;font-weight:700">Oui ✓</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:0.68rem">📍 Partager dernière position</span><span style="color:#22c55e;font-size:0.6rem;font-weight:700">Oui ✓</span></div>
          <div style="display:flex;justify-content:space-between"><span style="font-size:0.68rem">⏳ Délai avant alerte</span><span style="color:#fbbf24;font-size:0.6rem;font-weight:700">15 min</span></div>
        </div>
        <div style="${_s.secT};margin-top:8px"><span style="font-size:0.85rem">🆘</span> Bouton SOS</div>
        <div style="${_s.card};border:1px solid rgba(239,68,68,0.2)"><div style="font-size:0.68rem;font-weight:600;margin-bottom:3px">Le SOS déclenche simultanément :</div><div style="font-size:0.6rem;color:#94a3b8">🚨 Alerte tous tes gardiens<br>📱 SMS + appel au gardien principal<br>📍 Position aux urgences (112)<br>🔊 Alarme sonore<br>📹 Enregistrement audio</div></div>
      </div>
    </div>
  `
}

// ==================== 5. AUBERGES & ÉVÉNEMENTS ====================
window.showHostelsDemo = () => {
  const ov = _createDemo('hostels-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closeHostelsDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="hostels-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">🏨</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('hostelsDemoIntroTitle') || 'Auberges & Événements')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('hostelsDemoIntroDesc') || 'Dors pas cher avec -15% chez nos partenaires et organise des événements pour la communauté !')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">🏨</span><span style="${_s.btxt}">Auberges recommandées par la communauté dans chaque ville avec avis et photos</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">💰</span><span style="${_s.btxt}">-15% sur les réservations en utilisant tes points SpotHitch (2 000 pts = code de réduction)</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🏷️</span><span style="${_s.btxt}">Filtres par ambiance : Festif, Calme, Budget, Social, Éco. Trouve l'auberge qui te correspond</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🎉</span><span style="${_s.btxt}">Organise des meetups, courses, festivals et ateliers pour la communauté (+40 pts par événement)</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">Découvre les événements autour de toi et inscris-toi en un clic</span></div>
        </div>
        <button onclick="startHostelsDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="hostels-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closeHostelsDemo = () => { document.getElementById('hostels-demo-overlay')?.remove() }

window.startHostelsDemo = () => {
  const intro = document.getElementById('hostels-demo-intro')
  const main = document.getElementById('hostels-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo}">
      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'htl-hostels')" role="button" tabindex="0">🏨 Auberges</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'htl-events')" role="button" tabindex="0">🎉 Événements</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'htl-create')" role="button" tabindex="0">✏️ Créer un event</span>
      </div>

      <!-- Auberges -->
      <div data-cd-panel="htl-hostels" style="display:block">
        <div style="display:flex;gap:4px;margin-bottom:6px;overflow-x:auto;padding-bottom:2px">
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);color:#fbbf24">🇫🇷 Paris</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:#1a2332;color:#94a3b8">🇪🇸 Barcelona</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:#1a2332;color:#94a3b8">🇩🇪 Berlin</span>
          <span style="padding:4px 10px;border-radius:10px;font-size:0.58rem;font-weight:600;background:#1a2332;color:#94a3b8">🇳🇱 Amsterdam</span>
        </div>
        <div style="display:flex;gap:3px;margin-bottom:6px;flex-wrap:wrap">
          <span style="padding:3px 8px;border-radius:10px;font-size:0.52rem;font-weight:600;border:1px solid rgba(251,191,36,0.3);color:#fbbf24">Tous</span>
          <span style="padding:3px 8px;border-radius:10px;font-size:0.52rem;font-weight:600;background:#1a2332;color:#94a3b8">🎉 Festif</span>
          <span style="padding:3px 8px;border-radius:10px;font-size:0.52rem;font-weight:600;background:#1a2332;color:#94a3b8">😴 Calme</span>
          <span style="padding:3px 8px;border-radius:10px;font-size:0.52rem;font-weight:600;background:#1a2332;color:#94a3b8">💰 Budget</span>
        </div>
        <div style="${_s.card};border-left:3px solid #fbbf24;font-size:0.62rem;color:#94a3b8;margin-bottom:6px">💡 <strong>Réduction SpotHitch</strong> : utilise tes points pour -15% chez nos partenaires !</div>
        <div style="${_s.card};padding:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:36px;height:36px;border-radius:10px;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🌿</span><div style="flex:1"><div style="font-weight:700;font-size:0.78rem">Le Village Hostel</div><div style="font-size:0.55rem;color:#94a3b8">📍 Montmartre · Vue Sacré-Cœur</div><div style="display:flex;gap:3px;margin-top:2px"><span style="font-size:0.48rem;font-weight:600;padding:1px 5px;border-radius:4px;background:rgba(34,197,94,0.12);color:#22c55e">🌿 Éco</span><span style="font-size:0.48rem;font-weight:600;padding:1px 5px;border-radius:4px;background:rgba(245,158,11,0.12);color:#f59e0b">💰 Budget</span></div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">16€</div><div style="font-size:0.55rem;color:#64748b;text-decoration:line-through">19€</div><div style="font-size:0.48rem;color:#22c55e;font-weight:700">-15% SpotHitch</div></div></div><div style="display:flex;gap:5px;font-size:0.55rem;color:#64748b"><span style="color:#fbbf24">⭐ 4.6</span><span>🛏️ Dortoir 6</span><span>🍳 Petit-déj</span><span>📶 WiFi</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:36px;height:36px;border-radius:10px;background:rgba(236,72,153,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">🎉</span><div style="flex:1"><div style="font-weight:700;font-size:0.78rem">St Christopher's Inn</div><div style="font-size:0.55rem;color:#94a3b8">📍 Gare du Nord · Bar intégré</div><div style="display:flex;gap:3px;margin-top:2px"><span style="font-size:0.48rem;font-weight:600;padding:1px 5px;border-radius:4px;background:rgba(236,72,153,0.12);color:#ec4899">🎉 Festif</span><span style="font-size:0.48rem;font-weight:600;padding:1px 5px;border-radius:4px;background:rgba(59,130,246,0.12);color:#3b82f6">🤝 Social</span></div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">19€</div><div style="font-size:0.55rem;color:#64748b;text-decoration:line-through">22€</div><div style="font-size:0.48rem;color:#22c55e;font-weight:700">-15% SpotHitch</div></div></div><div style="display:flex;gap:5px;font-size:0.55rem;color:#64748b"><span style="color:#fbbf24">⭐ 4.4</span><span>🛏️ Dortoir 8</span><span>🍺 Bar</span><span>🎵 DJ</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:36px;height:36px;border-radius:10px;background:rgba(99,102,241,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">😴</span><div style="flex:1"><div style="font-weight:700;font-size:0.78rem">Generator Paris</div><div style="font-size:0.55rem;color:#94a3b8">📍 Colonel Fabien · Rooftop</div><div style="display:flex;gap:3px;margin-top:2px"><span style="font-size:0.48rem;font-weight:600;padding:1px 5px;border-radius:4px;background:rgba(99,102,241,0.12);color:#818cf8">😴 Calme</span></div></div><div style="text-align:right"><div style="font-weight:800;color:#22c55e">24€</div><div style="font-size:0.55rem;color:#64748b;text-decoration:line-through">28€</div><div style="font-size:0.48rem;color:#22c55e;font-weight:700">-15% SpotHitch</div></div></div><div style="display:flex;gap:5px;font-size:0.55rem;color:#64748b"><span style="color:#fbbf24">⭐ 4.7</span><span>🛏️ Dortoir 4</span><span>🌅 Rooftop</span><span>☕ Café</span></div></div>
      </div>

      <!-- Événements -->
      <div data-cd-panel="htl-events" style="display:none">
        <div style="${_s.card};border:1px solid rgba(236,72,153,0.2);padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🏁</span><div><div style="font-weight:700;font-size:0.78rem">Course Paris → Barcelone</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">15-17 mars 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Course officielle ! 12 autostoppeurs, classement live.</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 12/20 · 🏆 50€</div><span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">✅ Inscrit</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🍻</span><div><div style="font-weight:700;font-size:0.78rem">Meetup Paris</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">22 mars 2026 · 19h</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Rencontre mensuelle. Partage tes aventures, bière offerte !</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 28 · 🆓 Gratuit</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🏕️</span><div><div style="font-weight:700;font-size:0.78rem">Festival Nomade · Ardèche</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">12-14 avril 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">Camping + ateliers. Débutants bienvenus !</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 45 · 💰 15€</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
        <div style="${_s.card};padding:10px"><div style="display:flex;gap:8px;align-items:start;margin-bottom:4px"><span style="font-size:1.2rem">🌍</span><div><div style="font-weight:700;font-size:0.78rem">Rassemblement Européen · Bruxelles</div><div style="font-size:0.58rem;color:#fbbf24;font-weight:600">1-3 mai 2026</div></div></div><div style="font-size:0.62rem;color:#94a3b8;margin-bottom:4px">200+ participants, 15 pays, conférences, courses.</div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:0.55rem;color:#64748b">👥 142 · 🌐 15 pays</div><span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.6rem;font-weight:700;padding:4px 10px;border-radius:6px">👋 J'y vais !</span></div></div>
      </div>

      <!-- Créer un event -->
      <div data-cd-panel="htl-create" style="display:none">
        <div style="${_s.card};border-left:3px solid #fbbf24;font-size:0.62rem;color:#94a3b8;margin-bottom:8px">💡 Organise un meetup, une course ou un atelier pour la communauté ! <span style="color:#fbbf24;font-weight:600">+40 pts</span></div>
        <div style="margin-bottom:8px"><div style="font-size:0.65rem;font-weight:600;margin-bottom:3px">🎯 Type d'événement</div><div style="display:flex;gap:3px;flex-wrap:wrap"><span style="padding:4px 10px;border-radius:10px;font-size:0.55rem;font-weight:600;border:1px solid rgba(251,191,36,0.3);color:#fbbf24">🍻 Meetup</span><span style="padding:4px 10px;border-radius:10px;font-size:0.55rem;font-weight:600;background:#1a2332;color:#94a3b8">🏁 Course</span><span style="padding:4px 10px;border-radius:10px;font-size:0.55rem;font-weight:600;background:#1a2332;color:#94a3b8">🏕️ Festival</span><span style="padding:4px 10px;border-radius:10px;font-size:0.55rem;font-weight:600;background:#1a2332;color:#94a3b8">📚 Atelier</span></div></div>
        <div style="margin-bottom:6px"><div style="font-size:0.65rem;font-weight:600;margin-bottom:3px">📝 Nom</div><div style="${_s.card}">Meetup Autostoppeurs Toulouse</div></div>
        <div style="margin-bottom:6px"><div style="font-size:0.65rem;font-weight:600;margin-bottom:3px">📅 Date</div><div style="${_s.card}">29 mars 2026 · 19h00</div></div>
        <div style="margin-bottom:6px"><div style="font-size:0.65rem;font-weight:600;margin-bottom:3px">📍 Lieu</div><div style="${_s.card}">Bar Le Petit Vélo, Toulouse</div></div>
        <div style="margin-bottom:6px"><div style="font-size:0.65rem;font-weight:600;margin-bottom:3px">📝 Description</div><div style="${_s.card}">Première rencontre des autostoppeurs toulousains ! Venez partager vos aventures et trouver des compagnons de route.</div></div>
        <div style="display:block;background:linear-gradient(135deg,#fbbf24,#d97706);color:#0f1520;font-weight:700;text-align:center;padding:10px;border-radius:10px;margin-top:8px;font-size:0.75rem">🎉 Créer l'événement · +40 pts</div>
      </div>
    </div>
  `
}

// ==================== 6. FICHE SPOT (NOUVEAU DESIGN) ====================
window.showSpotDemo = () => {
  const ov = _createDemo('spot-demo-overlay')
  ov.innerHTML = `
    <div style="${_s.wrap}">
      <button onclick="closeSpotDemo()" style="${_s.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="spot-demo-intro" style="${_s.intro}">
        <div style="font-size:3rem;margin-bottom:12px">📍</div>
        <h2 style="font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 8px">${escapeHTML(t('spotDemoIntroTitle') || 'Nouvelle fiche spot')}</h2>
        <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;margin:0 0 16px">${escapeHTML(t('spotDemoIntroDesc') || 'Voici à quoi ressemblera un spot complet avec toutes les infos, photos, avis et outils de la communauté.')}</p>
        <div style="margin:0 auto 20px;max-width:340px">
          <div style="${_s.bullet}"><span style="${_s.bicon}">📸</span><span style="${_s.btxt}">${escapeHTML(t('spotDemoBullet1') || 'Galerie photos cliquable. Vois le spot sous tous les angles avant d\'y aller')}</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">✅</span><span style="${_s.btxt}">${escapeHTML(t('spotDemoBullet2') || 'Valider = confirmer que le spot existe (en passant), Tester = donner ton avis complet (après du stop)')}</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">🏅</span><span style="${_s.btxt}">${escapeHTML(t('spotDemoBullet3') || 'Badges de statut : Basique → Fiable → Certifié → Spot d\'Or selon les validations et avis')}</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">💡</span><span style="${_s.btxt}">${escapeHTML(t('spotDemoBullet4') || 'Tips d\'experts, meilleurs créneaux, spots alternatifs proches et urgences, tout en un')}</span></div>
          <div style="${_s.bullet}"><span style="${_s.bicon}">📍</span><span style="${_s.btxt}">${escapeHTML(t('spotDemoBullet5') || 'Ouvre directement dans Google Maps pour y aller à pied. Un seul bouton')}</span></div>
        </div>
        <button onclick="startSpotDemo()" style="${_s.btn}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="spot-demo-main" style="display:none"></div>
    </div>
  `
  document.body.appendChild(ov)
}

window.closeSpotDemo = () => { document.getElementById('spot-demo-overlay')?.remove() }

window.startSpotDemo = () => {
  const intro = document.getElementById('spot-demo-intro')
  const main = document.getElementById('spot-demo-main')
  if (!intro || !main) return
  intro.style.display = 'none'
  main.style.display = 'block'

  const _spot = {
    brd: 'border-radius:18px',
    photoWrap: 'position:relative;aspect-ratio:2/1;cursor:pointer;border-radius:16px;overflow:hidden',
    gradient: 'position:absolute;inset:0;background:linear-gradient(to top,rgba(15,21,32,.9) 5%,transparent 50%);border-radius:16px',
    statusBadge: 'display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:0.6rem;font-weight:700',
    statusGreenCrown: 'background:#065f46;color:#6ee7b7;border:2px solid #34d399',
    score: 'width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:900;color:#fff;border:3px solid rgba(15,21,32,.8)',
    btnV: 'flex:1;padding:12px 6px;border-radius:20px;border:none;cursor:pointer;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:800;font-size:0.78rem;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 4px 12px rgba(16,185,129,.3)',
    btnT: 'flex:1;padding:12px 6px;border-radius:20px;border:none;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0f1520;font-weight:800;font-size:0.78rem;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 4px 12px rgba(245,158,11,.3)',
    btnM: 'display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px;border-radius:20px;border:none;cursor:pointer;font-weight:800;font-size:0.78rem;background:linear-gradient(135deg,#4285f4,#1a73e8);color:#fff;box-shadow:0 4px 12px rgba(66,133,244,.3)',
    dateCard: 'padding:8px;border-radius:14px',
    metric: 'padding:8px 4px;border-radius:14px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)',
    badge: 'display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:0.55rem;font-weight:600',
    bg: 'background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)',
    ba: 'background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)',
    bb: 'background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.2)',
    sum: 'padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center',
    inner: 'padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.03)',
    secBtn: 'flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:8px;border-radius:16px;font-size:0.6rem;font-weight:700;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#fff;cursor:pointer',
  }

  main.innerHTML = `
    <div data-demo="overlay" style="${_s.demo};padding:10px;border-radius:22px">
      <div style="${_s.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchSpotDemoTab(this,'spot-overview')" role="button" tabindex="0">📍 Aperçu</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-details')" role="button" tabindex="0">📊 Détails</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-community')" role="button" tabindex="0">💬 Communauté</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-emergency')" role="button" tabindex="0">🆘 Urgence</span>
      </div>

      <!-- ===== TAB 1: APERÇU ===== -->
      <div data-cd-panel="spot-overview" style="display:block">
        <!-- Photo -->
        <div style="padding:4px 4px 0;margin-bottom:8px">
          <div style="${_spot.photoWrap}">
            <div style="width:100%;height:100%;background:linear-gradient(135deg,#1a2332,#0f1520);display:flex;align-items:center;justify-content:center;font-size:2rem">🏞️</div>
            <div style="${_spot.gradient}"></div>
            <div style="position:absolute;top:6px;left:6px;${_spot.statusBadge};${_spot.statusGreenCrown}"><span style="font-size:0.65rem">👑</span> Fiable certifié</div>
            <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:12px;font-size:0.55rem;font-weight:600">📷 4 photos</div>
            <div style="position:absolute;bottom:8px;left:8px">
              <div style="font-size:0.9rem;font-weight:800">Namur → Liège</div>
              <div style="font-size:0.55rem;color:rgba(255,255,255,.5)">🏙️ Sortie de ville · E411 · 🇧🇪</div>
            </div>
            <div style="position:absolute;bottom:6px;right:50px;${_spot.score}">4.2</div>
          </div>
        </div>

        <!-- Actions Valider / Testé -->
        <div style="display:flex;gap:6px;margin-bottom:6px">
          <button style="${_spot.btnV}"><span style="font-size:1.1rem">✅</span>Je valide<span style="font-size:0.5rem;font-weight:400;opacity:.7">Ce spot existe</span></button>
          <button style="${_spot.btnT}"><span style="font-size:1.1rem">🤙</span>J'ai testé<span style="font-size:0.5rem;font-weight:400;opacity:.5">Donner mon avis</span></button>
        </div>

        <!-- Google Maps -->
        <button style="${_spot.btnM};margin-bottom:8px">📍 Ouvrir dans Google Maps</button>

        <!-- Dates -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
          <div style="${_spot.dateCard};background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.1)">
            <div style="font-size:0.5rem;color:#475569">✅ Dernière validation</div>
            <div style="font-size:0.65rem;font-weight:700;color:#6ee7b7">il y a 2 sem.</div>
            <div style="font-size:0.5rem;color:#475569">par @TravelMarc</div>
          </div>
          <div style="${_spot.dateCard};background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.1)">
            <div style="font-size:0.5rem;color:#475569">🤙 Dernier test</div>
            <div style="font-size:0.65rem;font-weight:700;color:#fbbf24">il y a 3 jours</div>
            <div style="font-size:0.5rem;color:#475569">@BenTheRoad · ★★★★★</div>
          </div>
        </div>

        <!-- Météo + Légal -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:rgba(255,255,255,.02);border-radius:16px;margin-bottom:8px;font-size:0.65rem">
          <span>⛅ 14°C <span style="${_spot.badge};${_spot.bg};font-size:0.45rem">👍</span></span>
          <span style="${_spot.badge};${_spot.bg}">⚖️ Légal</span>
          <span style="${_spot.badge};${_spot.ba}">🌸 Printemps</span>
        </div>

        <!-- 4 Métriques -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;margin-bottom:8px">
          <div style="${_spot.metric}"><div style="font-size:0.55rem;color:#475569">⏱️</div><div style="font-size:0.7rem;font-weight:800;color:#f59e0b">8 min</div></div>
          <div style="${_spot.metric}"><div style="font-size:0.55rem;color:#475569">🛡️</div><div style="font-size:0.7rem;font-weight:800;color:#10b981">4/5</div></div>
          <div style="${_spot.metric}"><div style="font-size:0.55rem;color:#475569">🎯</div><div style="font-size:0.7rem;font-weight:800;color:#10b981">87%</div></div>
          <div style="${_spot.metric}"><div style="font-size:0.55rem;color:#475569">✅</div><div style="font-size:0.7rem;font-weight:800;color:#3b82f6">12</div></div>
        </div>

        <!-- Tags -->
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
          <span style="${_spot.badge};${_spot.bg}">☂️ Abri</span>
          <span style="${_spot.badge};${_spot.bg}">👁️ Visible</span>
          <span style="${_spot.badge};${_spot.bg}">🅿️ Place</span>
          <span style="${_spot.badge};${_spot.bb}">💡 Éclairé</span>
          <span style="${_spot.badge};${_spot.ba}">🤙 Pouce</span>
        </div>

        <!-- Actions secondaires -->
        <div style="display:flex;gap:4px">
          <div style="${_spot.secBtn}">🔖 Sauver</div>
          <div style="${_spot.secBtn}">📤 Partager</div>
          <div style="${_spot.secBtn}">🚩 Signaler</div>
        </div>
      </div>

      <!-- ===== TAB 2: DÉTAILS ===== -->
      <div data-cd-panel="spot-details" style="display:none">
        <div style="${_s.secT}">📊 Notation détaillée</div>
        <div style="${_s.card}">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.65rem">🛡️ Sécurité</span><span style="font-size:0.65rem;font-weight:700;color:#6ee7b7">4/5</span></div>
          <div style="height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:80%;background:#10b981;border-radius:3px"></div></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.65rem">🚗 Trafic</span><span style="font-size:0.65rem;font-weight:700;color:#6ee7b7">5/5</span></div>
          <div style="height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:100%;background:#f59e0b;border-radius:3px"></div></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.65rem">♿ Accessibilité</span><span style="font-size:0.65rem;font-weight:700;color:#fbbf24">3/5</span></div>
          <div style="height:5px;background:#1e293b;border-radius:3px;overflow:hidden"><div style="height:100%;width:60%;background:#f59e0b;border-radius:3px"></div></div>
        </div>

        <div style="${_s.secT};margin-top:10px">🕐 Meilleurs créneaux</div>
        <div style="${_s.card};background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.15)">
          <div style="font-size:0.72rem;font-weight:700;color:#6ee7b7">✨ Mardi–Vendredi 9h–12h</div>
          <div style="font-size:0.58rem;color:#64748b;margin-top:2px">4 min d'attente vs 15 min le dimanche soir</div>
        </div>

        <div style="${_s.secT};margin-top:10px">📊 Statuts des spots</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};background:#334155;color:#cbd5e1;border:1px solid #475569;font-size:0.5rem">📍</span><span style="font-size:0.5rem;color:#64748b">1+ avis</span></div>
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};background:#334155;color:#cbd5e1;border:2px solid #94a3b8;font-size:0.5rem">👑</span><span style="font-size:0.5rem;color:#64748b">Certifié</span></div>
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};background:#065f46;color:#6ee7b7;border:1px solid #10b981;font-size:0.5rem">⭐</span><span style="font-size:0.5rem;color:#64748b">3+ avis & valid.</span></div>
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};${_spot.statusGreenCrown};font-size:0.5rem">👑</span><span style="font-size:0.5rem;color:#64748b">Fiable certifié</span></div>
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};background:#7f1d1d;color:#fca5a5;border:1px solid #ef4444;font-size:0.5rem">⛽</span><span style="font-size:0.5rem;color:#64748b">Station</span></div>
          <div style="${_s.card};display:flex;align-items:center;gap:6px;padding:6px 8px"><span style="${_spot.statusBadge};background:linear-gradient(135deg,#78350f,#92400e);color:#fde047;border:2px solid #eab308;font-size:0.5rem">✨</span><span style="font-size:0.5rem;color:#64748b">Spot d'Or</span></div>
        </div>
      </div>

      <!-- ===== TAB 3: COMMUNAUTÉ ===== -->
      <div data-cd-panel="spot-community" style="display:none">
        <div style="${_s.secT}">💡 Tips d'experts</div>
        <div style="${_s.card};background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.15);margin-bottom:5px">
          <div style="font-size:0.65rem"><strong style="color:#fbbf24">@TravelMarc :</strong> Se placer APRÈS le feu rouge. Les voitures tournent toutes vers l'E411.</div>
        </div>
        <div style="${_s.card};background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.15)">
          <div style="font-size:0.65rem"><strong style="color:#fbbf24">@BenTheRoad :</strong> Écrire "LIÈGE" sur la pancarte, pas "E411".</div>
        </div>

        <div style="${_s.secT};margin-top:10px">💬 Avis communauté (12)</div>
        <div style="${_s.card};margin-bottom:5px">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px"><span>🤙</span><span style="font-size:0.68rem;font-weight:700;color:#fbbf24">@TravelMarc</span><span style="font-size:0.55rem;color:#64748b">★★★★★ · 5 min · Solo</span></div>
          <div style="font-size:0.62rem;color:#94a3b8">Super spot ! Pris en 5 min un lundi matin. Je recommande.</div>
        </div>
        <div style="${_s.card}">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px"><span>🌍</span><span style="font-size:0.68rem;font-weight:700;color:#fbbf24">@SarahVoyage</span><span style="font-size:0.55rem;color:#64748b">★★★★ · 12 min · Duo</span></div>
          <div style="font-size:0.62rem;color:#94a3b8">Bon spot, un peu long à deux mais ça passe.</div>
        </div>

        <div style="${_s.secT};margin-top:10px">📍 Spots alternatifs proches</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px">
          <div style="width:26px;height:26px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:900;color:#fff;flex-shrink:0">4.5</div>
          <div style="flex:1"><div style="font-weight:700;font-size:0.72rem">⛽ Station Total</div><div style="font-size:0.55rem;color:#64748b">800m · 5 min · 18 valid.</div></div>
          <span style="${_spot.badge};${_spot.bg};font-size:0.45rem">Mieux!</span>
        </div>
      </div>

      <!-- ===== TAB 4: URGENCE ===== -->
      <div data-cd-panel="spot-emergency" style="display:none">
        <div style="${_s.secT}">🆘 Urgence & plan B</div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="font-size:1.1rem">🏥</span>
          <div><div style="font-weight:700;font-size:0.72rem">CHU Namur</div><div style="font-size:0.55rem;color:#64748b">2.8 km · ☎️ +32 81 72 61 11</div></div>
        </div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="font-size:1.1rem">👮</span>
          <div><div style="font-weight:700;font-size:0.72rem">Police locale</div><div style="font-size:0.55rem;color:#64748b">1.5 km · ☎️ +32 81 24 81 11</div></div>
        </div>
        <div style="${_s.card};display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">🚌</span>
          <div><div style="font-weight:700;font-size:0.72rem">Bus 38 → Liège</div><div style="font-size:0.55rem;color:#64748b">400m · ~7€ · Toutes les 30 min</div></div>
        </div>

        <div style="${_s.secT};margin-top:10px">⚖️ Auto-stop en Belgique</div>
        <div style="${_s.card};border-left:3px solid #6ee7b7">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px"><span style="${_spot.badge};${_spot.bg}">✅ Légal</span></div>
          <div style="font-size:0.62rem;color:#94a3b8">L'auto-stop est légal en Belgique. Interdit sur les autoroutes (accotements), mais autorisé aux entrées et aires de repos.</div>
        </div>

        <div style="${_s.secT};margin-top:10px">🆘 Bouton SOS</div>
        <div style="${_s.card};background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);text-align:center;padding:12px">
          <div style="font-size:1.5rem;margin-bottom:4px">🆘</div>
          <div style="font-size:0.72rem;font-weight:700;color:#fca5a5">En cas d'urgence</div>
          <div style="font-size:0.58rem;color:#64748b;margin-top:2px">Envoie ta position + alerte à tes contacts</div>
        </div>
      </div>
    </div>
  `
}
