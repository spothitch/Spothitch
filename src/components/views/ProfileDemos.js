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
const _c = {
  overlay: 'fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto',
  wrap: 'w-full max-w-[420px] m-4 relative',
  close: 'absolute top-2 right-2 z-[5] bg-white/10 border-none text-white w-8 h-8 rounded-full text-[1.2rem] cursor-pointer flex items-center justify-center',
  intro: 'bg-slate-800 rounded-2xl text-center',
  btn: 'text-dark-primary font-bold border-none px-7 py-3 rounded-xl text-[0.9rem] cursor-pointer',
  bullet: 'flex items-start gap-2.5 text-left mb-2',
  bicon: 'text-[1.1rem] shrink-0 mt-px',
  btxt: 'text-[0.78rem] text-slate-300 leading-[1.4]',
  demo: 'bg-dark-primary rounded-2xl p-3.5 border border-white/[0.06]',
  tabs: 'flex gap-1 my-2 overflow-x-auto pb-1',
  card: 'bg-dark-secondary rounded-[10px] px-3 py-2.5 mb-[5px] text-xs leading-[1.4]',
  secT: 'text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-[5px]',
  stat: 'bg-dark-secondary rounded-lg p-2 text-center',
}
const _cIntro = 'px-5 py-7'
const _cBtn = 'bg-gradient-to-br from-amber-300 to-amber-600'

// Overlay needs inline style for background and backdrop-filter (not standard Tailwind)
const _overlayStyle = 'background:rgba(0,0,0,0.85);backdrop-filter:blur(8px)'
const _btnStyle = 'background:linear-gradient(135deg,#fbbf24,#d97706)'

function _createDemo(id) {
  document.getElementById(id)?.remove()
  const overlay = document.createElement('div')
  overlay.id = id
  overlay.className = _c.overlay
  overlay.style.cssText = _overlayStyle
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  return overlay
}

// ==================== 1. POINTS & CLASSEMENT ====================
window.showPointsDemo = () => {
  const ov = _createDemo('points-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closePointsDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="points-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">🏆</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('pointsDemoIntroTitle') || 'Points, Classement & Récompenses')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('pointsDemoIntroDesc') || 'Gagne des points en aidant la communauté, grimpe au classement et débloque des réductions chez nos partenaires voyage !')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">Gagne des points en créant et validant des spots, en ajoutant des photos et des conseils (+5 à +100 pts par action)</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🏅</span><span class="${_c.btxt}">Monte dans le classement de ton pays, d'Europe et mondial. Compare-toi à tes amis</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🔔</span><span class="${_c.btxt}">Reçois une notification quand tu passes près d'un spot à valider, même sans faire de stop (+20 pts)</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🎁</span><span class="${_c.btxt}">Échange tes points contre des réductions : Hostelworld (-15%), Booking (-10%), Decathlon (-15%), Flixbus, Interrail...</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🌟</span><span class="${_c.btxt}">6 niveaux : Débutant → Explorateur → Aventurier → Voyageur → Expert → Légende</span></div>
        </div>
        <button onclick="startPointsDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="points-demo-main" class="hidden"></div>
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
    <div data-demo="overlay" class="${_c.demo}">
      <div class="text-center p-3 rounded-xl mb-2.5" style="background:linear-gradient(135deg,rgba(251,191,36,0.08),rgba(217,119,6,0.05))">
        <div class="text-[2.2rem] font-black text-amber-400">1 250</div>
        <div class="text-[0.68rem] text-slate-400">Points SpotHitch</div>
        <div class="inline-block text-[0.6rem] font-bold px-2.5 py-[3px] rounded-xl mt-1 bg-green-500/15 text-green-500">🌟 Niveau Explorateur</div>
      </div>

      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'pts-points')" role="button" tabindex="0">⭐ Mes Points</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-earn')" role="button" tabindex="0">💰 Gagner</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-rank')" role="button" tabindex="0">🏅 Classement</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'pts-partners')" role="button" tabindex="0">🎁 Réductions</span>
      </div>

      <!-- Mes Points -->
      <div data-cd-panel="pts-points" class="block">
        <div class="grid grid-cols-3 gap-[5px] mb-2">
          <div class="${_c.stat}"><div class="text-base font-extrabold text-amber-400">23</div><div class="text-[0.48rem] text-slate-500 uppercase">Spots créés</div></div>
          <div class="${_c.stat}"><div class="text-base font-extrabold text-amber-400">47</div><div class="text-[0.48rem] text-slate-500 uppercase">Validations</div></div>
          <div class="${_c.stat}"><div class="text-base font-extrabold text-amber-400">12</div><div class="text-[0.48rem] text-slate-500 uppercase">Conseils</div></div>
        </div>
        <div class="rounded-[10px] px-2.5 py-2 mb-2 flex items-center gap-2 border border-green-500/25" style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.05))">
          <span class="text-[1.1rem] animate-[shake_1s_ease_infinite]">🔔</span>
          <div class="flex-1 text-[0.68rem] font-semibold text-emerald-500">Tu passes près d'un spot !<br><span class="font-normal text-[0.6rem] text-slate-400">Aire de Fleury · Valide-le pour +20 pts</span></div>
          <span class="bg-emerald-500 text-dark-primary text-[0.6rem] font-bold px-2.5 py-[5px] rounded-md">Valider ✓</span>
        </div>
        <div class="${_c.card}">
          <div class="flex justify-between mb-1"><span class="text-[0.68rem] font-semibold">Prochain niveau : Aventurier</span><span class="text-[0.6rem] text-amber-400 font-bold">1 250 / 2 000</span></div>
          <div class="h-[5px] bg-slate-800 rounded-[3px] overflow-hidden"><div class="h-full rounded-[3px] w-[62.5%]" style="background:linear-gradient(90deg,#fbbf24,#d97706)"></div></div>
        </div>
      </div>

      <!-- Gagner -->
      <div data-cd-panel="pts-earn" class="hidden">
        <div class="${_c.secT}"><span class="text-[0.85rem]">📍</span> Actions sur les spots</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">📍</span><div class="flex-1"><div class="font-semibold">Créer un spot</div><div class="text-[0.6rem] text-slate-500">Ajoute un nouveau spot avec photo</div></div><span class="font-extrabold text-amber-400">+50</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">✅</span><div class="flex-1"><div class="font-semibold">Valider un spot</div><div class="text-[0.6rem] text-slate-500">Confirme qu'un spot existe encore</div></div><span class="font-extrabold text-amber-400">+20</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">📸</span><div class="flex-1"><div class="font-semibold">Ajouter une photo</div><div class="text-[0.6rem] text-slate-500">Photo récente d'un spot</div></div><span class="font-extrabold text-amber-400">+10</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">💬</span><div class="flex-1"><div class="font-semibold">Laisser un conseil</div><div class="text-[0.6rem] text-slate-500">Astuce utile pour la commu</div></div><span class="font-extrabold text-amber-400">+15</span></div>
        <div class="${_c.secT} mt-2.5"><span class="text-[0.85rem]">🤝</span> Actions sociales</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">👋</span><div class="flex-1"><div class="font-semibold">Inviter un ami</div><div class="text-[0.6rem] text-slate-500">Ton ami rejoint SpotHitch</div></div><span class="font-extrabold text-amber-400">+100</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">🏁</span><div class="flex-1"><div class="font-semibold">Participer à une course</div><div class="text-[0.6rem] text-slate-500">Termine une course entre potes</div></div><span class="font-extrabold text-amber-400">+50</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-base">🎉</span><div class="flex-1"><div class="font-semibold">Organiser un événement</div><div class="text-[0.6rem] text-slate-500">Crée un meetup autostoppeurs</div></div><span class="font-extrabold text-amber-400">+40</span></div>
        <div class="rounded-[10px] p-2 mt-2 text-[0.65rem] text-emerald-500 border border-green-500/25" style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.05))">
          🔔 <strong>Validation automatique</strong> : Quand tu passes près d'un spot, une notification te propose de le valider, même si tu ne fais pas de stop. +20 pts !
        </div>
      </div>

      <!-- Classement -->
      <div data-cd-panel="pts-rank" class="hidden">
        <div class="${_c.secT}"><span class="text-[0.85rem]">🏅</span> Top France · Mars 2026</div>
        <div class="${_c.card} flex items-center gap-1.5"><span class="text-[0.85rem] font-black text-amber-400 min-w-[18px]">1</span><span class="w-6 h-6 rounded-full bg-amber-400 text-dark-primary flex items-center justify-center text-[0.6rem] font-bold shrink-0">S</span><div class="flex-1"><div class="font-semibold">RoadSophie</div><div class="text-[0.58rem] text-slate-500">Lyon · 156 spots</div></div><span class="font-extrabold text-amber-400">8 420</span></div>
        <div class="${_c.card} flex items-center gap-1.5"><span class="text-[0.85rem] font-black text-slate-400 min-w-[18px]">2</span><span class="w-6 h-6 rounded-full bg-slate-400 text-dark-primary flex items-center justify-center text-[0.6rem] font-bold shrink-0">M</span><div class="flex-1"><div class="font-semibold">MarcoHitch</div><div class="text-[0.58rem] text-slate-500">Paris · 98 spots</div></div><span class="font-extrabold text-amber-400">6 890</span></div>
        <div class="${_c.card} flex items-center gap-1.5"><span class="text-[0.85rem] font-black min-w-[18px] text-[#cd7f32]">3</span><span class="w-6 h-6 rounded-full text-dark-primary flex items-center justify-center text-[0.6rem] font-bold shrink-0 bg-[#cd7f32]">L</span><div class="flex-1"><div class="font-semibold">LunaVoyage</div><div class="text-[0.58rem] text-slate-500">Toulouse · 87 spots</div></div><span class="font-extrabold text-amber-400">5 210</span></div>
        <div class="text-center p-1.5 text-[0.6rem] text-slate-500">• • •</div>
        <div class="${_c.card} flex items-center gap-1.5 border border-amber-400/30 bg-amber-400/5"><span class="text-[0.85rem] font-black text-amber-400 min-w-[18px]">42</span><span class="w-6 h-6 rounded-full text-dark-primary flex items-center justify-center text-[0.6rem] font-bold shrink-0" style="background:linear-gradient(135deg,#fbbf24,#d97706)">T</span><div class="flex-1"><div class="font-semibold text-amber-400">Toi ← C'est toi !</div><div class="text-[0.58rem] text-slate-500">Paris · 23 spots</div></div><span class="font-extrabold text-amber-400">1 250</span></div>
        <div class="mt-2.5 flex gap-1 flex-wrap">
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30">🇫🇷 France</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-transparent text-slate-400 border border-white/[0.08]">🇪🇺 Europe</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-transparent text-slate-400 border border-white/[0.08]">🌍 Monde</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-transparent text-slate-400 border border-white/[0.08]">👫 Amis</span>
        </div>
      </div>

      <!-- Réductions -->
      <div data-cd-panel="pts-partners" class="hidden">
        <div class="${_c.card} border-l-[3px] border-l-amber-400 text-[0.68rem] text-slate-400 mb-2">💡 Accumule des points en aidant la communauté puis échange-les contre des réductions chez nos partenaires voyage !</div>
        <div class="${_c.secT}"><span class="text-[0.85rem]">🏨</span> Hébergement</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🏨</span><div class="flex-1"><div class="font-bold">Hostelworld</div><div class="text-[0.58rem] text-slate-400">-15% sur toutes les auberges</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-15%</div><div class="text-[0.5rem] text-slate-500">2 000 pts</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🏠</span><div class="flex-1"><div class="font-bold">Booking.com</div><div class="text-[0.58rem] text-slate-400">-10% hébergements sélectionnés</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-10%</div><div class="text-[0.5rem] text-slate-500">3 000 pts</div></div></div>
        <div class="${_c.secT} mt-2"><span class="text-[0.85rem]">🎒</span> Équipement</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">⛺</span><div class="flex-1"><div class="font-bold">Decathlon</div><div class="text-[0.58rem] text-slate-400">-15% rayon randonnée & camping</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-15%</div><div class="text-[0.5rem] text-slate-500">2 500 pts</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🧥</span><div class="flex-1"><div class="font-bold">Patagonia</div><div class="text-[0.58rem] text-slate-400">-10% vêtements outdoor</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-10%</div><div class="text-[0.5rem] text-slate-500">4 000 pts</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🎒</span><div class="flex-1"><div class="font-bold">Osprey</div><div class="text-[0.58rem] text-slate-400">-20% sacs à dos voyage</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-20%</div><div class="text-[0.5rem] text-slate-500">3 500 pts</div></div></div>
        <div class="${_c.secT} mt-2"><span class="text-[0.85rem]">🚌</span> Transport</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🚌</span><div class="flex-1"><div class="font-bold">Flixbus</div><div class="text-[0.58rem] text-slate-400">-10% tous les trajets</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-10%</div><div class="text-[0.5rem] text-slate-500">1 000 pts</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🚂</span><div class="flex-1"><div class="font-bold">Interrail</div><div class="text-[0.58rem] text-slate-400">-15% pass ferroviaire Europe</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-15%</div><div class="text-[0.5rem] text-slate-500">8 000 pts</div></div></div>
        <div class="${_c.secT} mt-2"><span class="text-[0.85rem]">🌍</span> Expériences</div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">🎫</span><div class="flex-1"><div class="font-bold">GetYourGuide</div><div class="text-[0.58rem] text-slate-400">-10% activités et visites</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-10%</div><div class="text-[0.5rem] text-slate-500">1 500 pts</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="text-[1.1rem]">📱</span><div class="flex-1"><div class="font-bold">Airalo eSIM</div><div class="text-[0.58rem] text-slate-400">-15% forfait data voyage</div></div><div class="text-right"><div class="font-extrabold text-emerald-500">-15%</div><div class="text-[0.5rem] text-slate-500">800 pts</div></div></div>
        <div class="text-center mt-2 text-[0.68rem]"><span class="font-bold">Tes points : <span class="text-amber-400">1 250</span></span><br><span class="text-[0.6rem] text-slate-500">Tu peux déjà débloquer Flixbus (-10%) et Airalo (-15%) !</span></div>
      </div>
    </div>
  `
}

// ==================== 2. CARNET DE VOYAGE ====================
window.showJournalDemo = () => {
  const ov = _createDemo('journal-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closeJournalDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="journal-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">📔</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('journalDemoIntroTitle') || 'Carnet de Voyage')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('journalDemoIntroDesc') || 'Ton voyage enregistré automatiquement, étape par étape. Partage tes itinéraires et inspire la communauté !')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">📝</span><span class="${_c.btxt}">Chaque lift enregistré automatiquement : ville de départ, spot utilisé, temps d'attente, véhicule</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">📊</span><span class="${_c.btxt}">Stats complètes de chaque voyage : km parcourus, nombre de lifts, temps total, pays traversés</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🗺️</span><span class="${_c.btxt}">Visualise ton parcours étape par étape sur une carte avec la timeline de chaque jour</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🌍</span><span class="${_c.btxt}">Partage tes itinéraires avec la communauté. Tes spots, temps d'attente et conseils aident tout le monde</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">❤️</span><span class="${_c.btxt}">Explore les voyages des autres autostoppeurs pour trouver l'inspiration et planifier tes prochaines aventures</span></div>
        </div>
        <button onclick="startJournalDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="journal-demo-main" class="hidden"></div>
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
    <div data-demo="overlay" class="${_c.demo}">
      <div class="rounded-xl h-20 relative overflow-hidden mb-2" style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a)">
        <div class="absolute h-0.5 top-[38px] left-[30px] right-[30px]" style="background:linear-gradient(90deg,#fbbf24,#22c55e,#3b82f6,#ec4899)"></div>
        <div class="absolute w-2 h-2 rounded-full bg-amber-400 border-2 border-white top-[35px] left-[28px]"></div>
        <div class="absolute w-2 h-2 rounded-full bg-emerald-500 border-2 border-white top-[35px] left-[30%]"></div>
        <div class="absolute w-2 h-2 rounded-full bg-blue-500 border-2 border-white top-[35px] left-[55%]"></div>
        <div class="absolute w-2 h-2 rounded-full bg-pink-500 border-2 border-white top-[35px] right-[28px]"></div>
        <div class="absolute text-[0.48rem] font-bold text-amber-400 top-[48px] left-[18px]">Paris</div>
        <div class="absolute text-[0.48rem] font-bold text-emerald-500 top-[48px] left-[26%]">Lyon</div>
        <div class="absolute text-[0.48rem] font-bold text-blue-500 top-[48px] left-[48%]">Marseille</div>
        <div class="absolute text-[0.48rem] font-bold text-pink-500 top-[48px] right-[10px]">Barcelone</div>
        <div class="absolute text-[0.5rem] text-slate-500 bottom-[5px] right-[8px]">🇫🇷 → 🇪🇸</div>
      </div>

      <div class="grid grid-cols-4 gap-1 mb-2">
        <div class="${_c.stat}"><div class="text-[0.85rem] font-extrabold text-amber-400">1 085</div><div class="text-[0.45rem] text-slate-500 uppercase">km</div></div>
        <div class="${_c.stat}"><div class="text-[0.85rem] font-extrabold text-amber-400">4</div><div class="text-[0.45rem] text-slate-500 uppercase">lifts</div></div>
        <div class="${_c.stat}"><div class="text-[0.85rem] font-extrabold text-amber-400">8h30</div><div class="text-[0.45rem] text-slate-500 uppercase">trajet</div></div>
        <div class="${_c.stat}"><div class="text-[0.85rem] font-extrabold text-amber-400">2</div><div class="text-[0.45rem] text-slate-500 uppercase">pays</div></div>
      </div>

      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'jrn-current')" role="button" tabindex="0">🗺️ Voyage en cours</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'jrn-history')" role="button" tabindex="0">📚 Mes voyages</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'jrn-community')" role="button" tabindex="0">🌍 Communauté</span>
      </div>

      <!-- Voyage en cours -->
      <div data-cd-panel="jrn-current" class="block">
        <div class="${_c.secT}"><span class="text-[0.85rem]">📍</span> Étapes du voyage</div>
        <div class="relative pl-6">
          <div class="absolute w-0.5 left-[7px] top-0 bottom-0" style="background:linear-gradient(180deg,#fbbf24,#22c55e,#3b82f6,#ec4899)"></div>
          <div class="relative mb-2.5"><div class="absolute w-2 h-2 rounded-full bg-amber-400 -left-[20px] top-[5px]"></div><div class="${_c.card}"><div class="text-[0.55rem] text-slate-500">📅 15 mars · 7h30</div><div class="font-bold text-[0.78rem]">🏁 Paris · Départ</div><div class="text-[0.62rem] text-slate-400">📍 Porte d'Orléans, direction A6</div><div class="flex gap-1.5 mt-[3px] text-[0.58rem]"><span class="text-emerald-500">⏱️ 12 min</span><span class="text-slate-500">📋 Panneau "Lyon"</span></div></div></div>
          <div class="relative mb-2.5"><div class="absolute w-2 h-2 rounded-full bg-emerald-500 -left-[20px] top-[5px]"></div><div class="${_c.card}"><div class="text-[0.55rem] text-slate-500">📅 15 mars · 12h15</div><div class="font-bold text-[0.78rem]">🛑 Lyon · Étape 1</div><div class="text-[0.62rem] text-slate-400">📍 Aire de Dardilly · Pause déjeuner</div><div class="flex gap-1.5 mt-[3px] text-[0.58rem]"><span class="text-slate-500">🚗 465 km</span><span class="text-amber-400">⭐ +50 pts</span></div></div></div>
          <div class="relative mb-2.5"><div class="absolute w-2 h-2 rounded-full bg-blue-500 -left-[20px] top-[5px]"></div><div class="${_c.card}"><div class="text-[0.55rem] text-slate-500">📅 15 mars · 17h00</div><div class="font-bold text-[0.78rem]">🛑 Marseille · Étape 2</div><div class="text-[0.62rem] text-slate-400">📍 La Joliette · Nuit en auberge</div><div class="flex gap-1.5 mt-[3px] text-[0.58rem]"><span class="text-slate-500">🚗 315 km</span><span class="text-amber-400">⭐ +50 pts</span></div></div></div>
          <div class="relative"><div class="absolute w-2 h-2 rounded-full bg-pink-500 -left-[20px] top-[5px]"></div><div class="${_c.card} border border-pink-500/30"><div class="text-[0.55rem] text-pink-500">📅 16 mars · 9h00 · EN COURS</div><div class="font-bold text-[0.78rem]">🚀 Marseille → Barcelone</div><div class="text-[0.62rem] text-slate-400">📍 Sortie A50 · Direction Espagne</div><div class="flex gap-1.5 mt-[3px] text-[0.58rem]"><span class="text-pink-500">⏳ En attente...</span></div></div></div>
        </div>
      </div>

      <!-- Mes voyages -->
      <div data-cd-panel="jrn-history" class="hidden">
        <div class="${_c.card} border border-white/[0.04] p-3">
          <div class="flex items-center gap-2 mb-1.5"><span class="text-[0.9rem]">🇫🇷→🇪🇸</span><div><div class="font-bold text-[0.78rem]">Paris → Barcelone</div><div class="text-[0.58rem] text-slate-500">15-16 mars 2026 · En cours</div></div></div>
          <div class="flex gap-1"><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">1 085</div><div class="text-[0.45rem] text-slate-500 uppercase">km</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">4</div><div class="text-[0.45rem] text-slate-500 uppercase">lifts</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">8h30</div><div class="text-[0.45rem] text-slate-500 uppercase">temps</div></div></div>
        </div>
        <div class="${_c.card} border border-white/[0.04] p-3">
          <div class="flex items-center gap-2 mb-1.5"><span class="text-[0.9rem]">🇫🇷→🇩🇪</span><div><div class="font-bold text-[0.78rem]">Paris → Berlin</div><div class="text-[0.58rem] text-slate-500">28 fév au 2 mars 2026</div></div></div>
          <div class="flex gap-1"><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">1 050</div><div class="text-[0.45rem] text-slate-500 uppercase">km</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">6</div><div class="text-[0.45rem] text-slate-500 uppercase">lifts</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">14h</div><div class="text-[0.45rem] text-slate-500 uppercase">temps</div></div></div>
        </div>
        <div class="${_c.card} border border-white/[0.04] p-3">
          <div class="flex items-center gap-2 mb-1.5"><span class="text-[0.9rem]">🇫🇷→🇳🇱</span><div><div class="font-bold text-[0.78rem]">Lyon → Amsterdam</div><div class="text-[0.58rem] text-slate-500">10-12 jan 2026</div></div></div>
          <div class="flex gap-1"><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">1 100</div><div class="text-[0.45rem] text-slate-500 uppercase">km</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">7</div><div class="text-[0.45rem] text-slate-500 uppercase">lifts</div></div><div class="flex-1 text-center"><div class="text-[0.8rem] font-extrabold text-amber-400">16h</div><div class="text-[0.45rem] text-slate-500 uppercase">temps</div></div></div>
        </div>
      </div>

      <!-- Communauté -->
      <div data-cd-panel="jrn-community" class="hidden">
        <div class="${_c.secT}"><span class="text-[0.85rem]">🌍</span> Voyages récents</div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-emerald-500 text-dark-primary flex items-center justify-center text-[0.65rem] font-bold shrink-0">S</span><div class="flex-1"><div class="font-semibold">RoadSophie</div><div class="text-[0.6rem] text-amber-400">🇫🇷 Lyon → 🇮🇹 Rome</div><div class="text-[0.55rem] text-slate-500">1 200 km · 8 lifts · ❤️ 24</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-[0.65rem] font-bold shrink-0">M</span><div class="flex-1"><div class="font-semibold">MarcoHitch</div><div class="text-[0.6rem] text-amber-400">🇩🇪 Berlin → 🇵🇱 Cracovie</div><div class="text-[0.55rem] text-slate-500">640 km · 5 lifts · ❤️ 18</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-[0.65rem] font-bold shrink-0">L</span><div class="flex-1"><div class="font-semibold">LunaVoyage</div><div class="text-[0.6rem] text-amber-400">🇪🇸 Madrid → 🇵🇹 Lisbonne</div><div class="text-[0.55rem] text-slate-500">630 km · 4 lifts · ❤️ 31</div></div></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-amber-400 text-dark-primary flex items-center justify-center text-[0.65rem] font-bold shrink-0">T</span><div class="flex-1"><div class="font-semibold">TomPouce34</div><div class="text-[0.6rem] text-amber-400">🇫🇷 Paris → 🇬🇧 Londres</div><div class="text-[0.55rem] text-slate-500">460 km · 3 lifts + ferry · ❤️ 45</div></div></div>
      </div>
    </div>
  `
}

// ==================== 3. SOCIAL, COURSES & ÉVÉNEMENTS ====================
window.showSocialDemo = () => {
  const ov = _createDemo('social-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closeSocialDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="social-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">👥</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('socialDemoIntroTitle') || 'Social, Courses & Événements')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('socialDemoIntroDesc') || 'Rencontre des autostoppeurs, fais la course entre potes et organise des événements !')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">Vois les autostoppeurs à moins de 5 km de toi en temps réel. Active ta position pour 2h</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🏁</span><span class="${_c.btxt}">Fais la course entre potes avec classement en direct ! Crée un trajet et invite tes amis</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">Partage tes meilleurs spots en temps réel avec les participants de ta course</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🎉</span><span class="${_c.btxt}">Rejoins des événements : meetups mensuels, courses officielles, festivals, ateliers sécurité</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">💬</span><span class="${_c.btxt}">Discute avec les autostoppeurs proches et trouve des compagnons de route pour tes trajets</span></div>
        </div>
        <button onclick="startSocialDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="social-demo-main" class="hidden"></div>
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
    <div data-demo="overlay" class="${_c.demo}">
      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'soc-nearby')" role="button" tabindex="0">📍 Proches</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-races')" role="button" tabindex="0">🏁 Courses</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-events')" role="button" tabindex="0">🎉 Événements</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'soc-spots')" role="button" tabindex="0">📍 Spots partagés</span>
      </div>

      <!-- Proches -->
      <div data-cd-panel="soc-nearby" class="block">
        <div class="rounded-xl h-[140px] relative overflow-hidden mb-2" style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a)">
          <div class="absolute w-3 h-3 rounded-full bg-amber-400 border-2 border-white z-[2] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute w-2 h-2 rounded-full bg-emerald-500 border-2 border-white top-[35%] left-[35%]"></div>
          <div class="absolute text-[0.48rem] font-bold text-emerald-500 rounded-[3px] top-[28%] left-[24%] bg-black/70 px-1 py-px">Clara · 1.2 km</div>
          <div class="absolute w-2 h-2 rounded-full bg-blue-500 border-2 border-white top-[60%] left-[65%]"></div>
          <div class="absolute text-[0.48rem] font-bold text-blue-500 rounded-[3px] top-[53%] left-[56%] bg-black/70 px-1 py-px">Alex · 3.5 km</div>
          <div class="absolute w-2 h-2 rounded-full bg-pink-500 border-2 border-white top-[30%] left-[70%]"></div>
          <div class="absolute text-[0.48rem] font-bold text-pink-500 rounded-[3px] top-[23%] left-[61%] bg-black/70 px-1 py-px">Luna · 5 km</div>
          <div class="absolute text-[0.5rem] text-slate-400 bottom-[5px] left-[6px]">📍 3 autostoppeurs dans un rayon de 5 km</div>
        </div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-[30px] h-[30px] rounded-full bg-emerald-500 text-dark-primary flex items-center justify-center text-[0.7rem] font-bold shrink-0">C</span><div class="flex-1"><div class="font-semibold">Clara</div><div class="text-[0.58rem] text-slate-400">Direction Lyon · Panneau "A6"</div></div><span class="text-[0.62rem] font-bold text-emerald-500">1.2 km</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-[30px] h-[30px] rounded-full bg-blue-500 text-white flex items-center justify-center text-[0.7rem] font-bold shrink-0">A</span><div class="flex-1"><div class="font-semibold">Alex</div><div class="text-[0.58rem] text-slate-400">Direction Bordeaux · Pouce</div></div><span class="text-[0.62rem] font-bold text-emerald-500">3.5 km</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-[30px] h-[30px] rounded-full bg-pink-500 text-white flex items-center justify-center text-[0.7rem] font-bold shrink-0">L</span><div class="flex-1"><div class="font-semibold">Luna</div><div class="text-[0.58rem] text-slate-400">Direction Marseille · En attente</div></div><span class="text-[0.62rem] font-bold text-emerald-500">5 km</span></div>
      </div>

      <!-- Courses -->
      <div data-cd-panel="soc-races" class="hidden">
        <div class="${_c.card} p-3 border border-pink-500/30">
          <div class="flex justify-between items-center mb-1.5"><span class="font-extrabold text-[0.82rem]">🏁 Paris → Barcelone</span><span class="text-[0.55rem] font-bold px-1.5 py-[3px] rounded-md bg-pink-500/15 text-pink-500">EN COURS</span></div>
          <div class="text-[0.65rem] text-slate-400 mb-2">1 085 km · 4 participants · Départ 15 mars</div>
          <div class="${_c.secT} text-[0.68rem]">🏅 Classement live</div>
          <div class="mb-1 flex items-center gap-1.5 py-1"><span class="font-black text-amber-400 min-w-[14px] text-[0.7rem]">1</span><span class="w-5 h-5 rounded-full bg-emerald-500 text-dark-primary flex items-center justify-center text-[0.55rem] font-bold shrink-0">C</span><div class="flex-1 text-[0.65rem]">Clara<div class="text-[0.55rem] text-slate-400">Marseille · 780 km</div><div class="h-[3px] bg-slate-800 rounded-sm mt-0.5 overflow-hidden"><div class="h-full bg-emerald-500 rounded-sm w-[72%]"></div></div></div><span class="text-[0.58rem] font-bold text-emerald-500">72%</span></div>
          <div class="mb-1 flex items-center gap-1.5 py-1"><span class="font-black text-slate-400 min-w-[14px] text-[0.7rem]">2</span><span class="w-5 h-5 rounded-full text-dark-primary flex items-center justify-center text-[0.55rem] font-bold shrink-0" style="background:linear-gradient(135deg,#fbbf24,#d97706)">T</span><div class="flex-1 text-[0.65rem]"><span class="text-amber-400">Toi</span><div class="text-[0.55rem] text-slate-400">Lyon · 600 km</div><div class="h-[3px] bg-slate-800 rounded-sm mt-0.5 overflow-hidden"><div class="h-full bg-amber-400 rounded-sm w-[55%]"></div></div></div><span class="text-[0.58rem] font-bold text-amber-400">55%</span></div>
          <div class="mb-1 flex items-center gap-1.5 py-1"><span class="font-black text-slate-400 min-w-[14px] text-[0.7rem]">3</span><span class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[0.55rem] font-bold shrink-0">A</span><div class="flex-1 text-[0.65rem]">Alex<div class="text-[0.55rem] text-slate-400">Dijon · 430 km</div><div class="h-[3px] bg-slate-800 rounded-sm mt-0.5 overflow-hidden"><div class="h-full bg-blue-500 rounded-sm w-[40%]"></div></div></div><span class="text-[0.58rem] font-bold text-blue-500">40%</span></div>
          <div class="mb-1 flex items-center gap-1.5 py-1"><span class="font-black text-slate-400 min-w-[14px] text-[0.7rem]">4</span><span class="w-5 h-5 rounded-full text-white flex items-center justify-center text-[0.55rem] font-bold shrink-0 bg-violet-500">M</span><div class="flex-1 text-[0.65rem]">Max<div class="text-[0.55rem] text-slate-400">Auxerre · 270 km</div><div class="h-[3px] bg-slate-800 rounded-sm mt-0.5 overflow-hidden"><div class="h-full rounded-sm w-[25%] bg-violet-500"></div></div></div><span class="text-[0.58rem] font-bold text-violet-500">25%</span></div>
        </div>
        <div class="block text-dark-primary font-bold text-center p-2.5 rounded-[10px] mt-2 text-xs" style="background:linear-gradient(135deg,#fbbf24,#d97706)">🏁 Créer une nouvelle course</div>
      </div>

      <!-- Événements -->
      <div data-cd-panel="soc-events" class="hidden">
        <div class="${_c.card} p-2.5 border border-pink-500/20"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🏁</span><div><div class="font-bold text-[0.78rem]">Course Paris → Barcelone</div><div class="text-[0.58rem] text-amber-400 font-semibold">15-17 mars 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Course officielle ! 12 autostoppeurs, classement live, spots partagés.</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 12 inscrits · 🏆 Prix : 50€</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-green-500/15 text-green-500">✅ Inscrit</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🍻</span><div><div class="font-bold text-[0.78rem]">Meetup Paris</div><div class="text-[0.58rem] text-amber-400 font-semibold">22 mars 2026 · 19h</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Rencontre mensuelle des autostoppeurs parisiens. Bières et aventures !</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 28 inscrits · 🆓 Gratuit</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🏕️</span><div><div class="font-bold text-[0.78rem]">Festival Nomade · Ardèche</div><div class="text-[0.58rem] text-amber-400 font-semibold">12-14 avril 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Camping + ateliers (panneaux, sécurité, premiers secours). Débutants bienvenus !</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 45 inscrits · 💰 15€</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🌍</span><div><div class="font-bold text-[0.78rem]">Rassemblement Européen · Bruxelles</div><div class="text-[0.58rem] text-amber-400 font-semibold">1-3 mai 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">200+ participants de 15 pays. Conférences, courses, ateliers.</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 142 inscrits · 🌐 15 pays</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
      </div>

      <!-- Spots partagés -->
      <div data-cd-panel="soc-spots" class="hidden">
        <div class="${_c.card} border-l-[3px] border-l-emerald-500 text-[0.65rem] text-slate-400 mb-2">💡 Pendant une course, partagez vos meilleurs spots avec les autres participants en temps réel !</div>
        <div class="${_c.secT}"><span class="text-[0.85rem]">📍</span> Course Paris→Barcelone</div>
        <div class="${_c.card}"><div class="flex justify-between"><div><div class="font-bold">Aire de Fleury</div><div class="text-[0.58rem] text-slate-400">A6 direction Lyon · Clara il y a 2h</div></div><span class="text-[0.62rem] font-bold text-emerald-500">⏱️ 8 min</span></div><div class="text-[0.6rem] text-slate-400 mt-[3px] italic">"Routier sympa, foncez !" · Clara</div></div>
        <div class="${_c.card}"><div class="flex justify-between"><div><div class="font-bold">Station Total Valence</div><div class="text-[0.58rem] text-slate-400">A7 direction Marseille · Toi il y a 1h</div></div><span class="text-[0.62rem] font-bold text-amber-400">⏱️ 15 min</span></div><div class="text-[0.6rem] text-slate-400 mt-[3px] italic">"Beaucoup de camions, panneau recommandé" · Toi</div></div>
        <div class="${_c.card}"><div class="flex justify-between"><div><div class="font-bold">Sortie Nîmes</div><div class="text-[0.58rem] text-slate-400">A9 direction Espagne · Alex il y a 30min</div></div><span class="text-[0.62rem] font-bold text-emerald-500">⏱️ 5 min</span></div><div class="text-[0.6rem] text-slate-400 mt-[3px] italic">"Spot incroyable, 5 min !" · Alex</div></div>
      </div>
    </div>
  `
}

// ==================== 4. MODE COMPAGNON SÉCURITÉ ====================
window.showCompanionDemo = () => {
  const ov = _createDemo('companion-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closeCompanionDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="companion-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">🛡️</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('companionDemoIntroTitle') || 'Mode Compagnon Sécurité')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('companionDemoIntroDesc') || 'Rassure tes proches pendant ton trajet en stop avec le suivi en direct et les check-ins automatiques.')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">Tes proches (gardiens) voient ta position en direct sur la carte SpotHitch</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">✅</span><span class="${_c.btxt}">Check-in régulier (30min, 1h ou 2h) : un bouton pour confirmer que tout va bien</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">⚠️</span><span class="${_c.btxt}">Si tu manques un check-in, alerte automatique à tes gardiens avec ta dernière position</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🆘</span><span class="${_c.btxt}">Bouton SOS : alerte immédiate à tous tes gardiens + appel urgences + enregistrement audio</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🛡️</span><span class="${_c.btxt}">Version améliorée du compagnon de route actuel avec position live et connexion directe au SOS</span></div>
        </div>
        <button onclick="startCompanionDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="companion-demo-main" class="hidden"></div>
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
    <div data-demo="overlay" class="${_c.demo}">
      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'cmp-me')" role="button" tabindex="0">🧳 Mon trajet</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'cmp-guardian')" role="button" tabindex="0">👁️ Vue Gardien</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'cmp-config')" role="button" tabindex="0">⚙️ Réglages</span>
      </div>

      <!-- Mon trajet -->
      <div data-cd-panel="cmp-me" class="block">
        <div class="rounded-xl p-3 text-center mb-2 border border-emerald-500/20" style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.02))">
          <div class="text-[1.8rem] mb-0.5">🛡️</div>
          <div class="text-[0.72rem] font-bold text-emerald-500">Mode Compagnon actif</div>
          <div class="text-[0.58rem] text-slate-400">Maman et Clara voient ta position en direct</div>
        </div>
        <div class="rounded-xl h-[100px] relative overflow-hidden mb-2" style="background:linear-gradient(135deg,#1a2a1a,#2a3a2a)">
          <div class="absolute h-0.5 top-[48px] left-[30px] right-[80px] bg-emerald-500/30"></div>
          <div class="absolute w-1.5 h-1.5 rounded-full bg-amber-400 top-[46px] left-[28px]"></div>
          <div class="absolute w-3 h-3 rounded-full bg-emerald-500 border-2 border-white top-[43px] left-[60%]"></div>
          <div class="absolute w-1.5 h-1.5 rounded-full bg-pink-500 top-[46px] right-[78px]"></div>
          <div class="absolute text-[0.5rem] text-slate-400 rounded bottom-[5px] left-[6px] bg-black/60 px-1.5 py-0.5">🟢 Position partagée en direct</div>
          <div class="absolute text-[0.5rem] text-emerald-500 font-bold rounded top-[5px] right-[6px] bg-black/60 px-1.5 py-0.5">Mis à jour il y a 30s</div>
        </div>
        <div class="text-center p-3 bg-dark-secondary rounded-[10px] mb-2">
          <div class="text-[1.8rem] font-black text-emerald-500 tabular-nums">47:23</div>
          <div class="text-[0.6rem] text-slate-400 mt-0.5">Prochain check-in dans</div>
          <div class="h-[3px] bg-slate-800 rounded-sm mt-1.5 overflow-hidden"><div class="h-full rounded-sm w-[21%]" style="background:linear-gradient(90deg,#22c55e,#10b981)"></div></div>
        </div>
        <div class="text-white text-[0.82rem] font-extrabold text-center p-3 rounded-xl mb-1.5" style="background:linear-gradient(135deg,#22c55e,#10b981);box-shadow:0 4px 20px rgba(34,197,94,0.3)">✅ Tout va bien · Envoyer check-in</div>
        <div class="text-white text-[0.78rem] font-extrabold text-center p-2.5 rounded-xl" style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 20px rgba(239,68,68,0.3)">🆘 SOS · Alerter mes gardiens + urgences</div>
        <div class="${_c.secT} mt-2.5"><span class="text-[0.85rem]">👁️</span> Mes gardiens</div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-[0.65rem] font-bold shrink-0">M</span><div class="flex-1"><div class="font-semibold">Maman</div><div class="text-[0.55rem] text-slate-400">Voit ta position en temps réel</div></div><span class="text-[0.55rem] font-bold text-emerald-500">🟢 En ligne</span></div>
        <div class="${_c.card} flex items-center gap-2"><span class="w-7 h-7 rounded-full bg-emerald-500 text-dark-primary flex items-center justify-center text-[0.65rem] font-bold shrink-0">C</span><div class="flex-1"><div class="font-semibold">Clara</div><div class="text-[0.55rem] text-slate-400">Voit ta position en temps réel</div></div><span class="text-[0.55rem] font-bold text-slate-500">⚫ Hors ligne</span></div>
      </div>

      <!-- Vue Gardien -->
      <div data-cd-panel="cmp-guardian" class="hidden">
        <div class="${_c.card} border-l-[3px] border-l-emerald-500 text-[0.65rem] text-slate-400 mb-2">👁️ Voici ce que tes gardiens (maman, amis) voient sur leur téléphone</div>
        <div class="rounded-xl p-3 text-center mb-2 border border-emerald-500/20" style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.04))">
          <div class="text-2xl">🟢</div>
          <div class="text-[0.72rem] font-bold text-emerald-500">Antoine va bien</div>
          <div class="text-[0.55rem] text-slate-400">Dernier check-in il y a 12 min · Lyon</div>
        </div>
        <div class="grid grid-cols-3 gap-1 mb-2">
          <div class="${_c.stat}"><div class="text-[0.85rem]">🏁</div><div class="text-[0.45rem] text-slate-500">Départ</div><div class="text-[0.65rem] font-bold">Paris</div></div>
          <div class="${_c.stat}"><div class="text-[0.85rem]">📍</div><div class="text-[0.45rem] text-slate-500">Position</div><div class="text-[0.65rem] font-bold text-emerald-500">Lyon</div></div>
          <div class="${_c.stat}"><div class="text-[0.85rem]">🎯</div><div class="text-[0.45rem] text-slate-500">Arrivée</div><div class="text-[0.65rem] font-bold">Barcelone</div></div>
        </div>
        <div class="${_c.secT}"><span class="text-[0.85rem]">📋</span> Notifications reçues</div>
        <div class="${_c.card} border-l-[3px] border-l-emerald-500"><strong class="text-emerald-500">✅ Tout va bien</strong> · Antoine est à Lyon, direction Marseille<div class="text-[0.52rem] text-slate-500 mt-0.5">Il y a 12 min</div></div>
        <div class="${_c.card} border-l-[3px] border-l-emerald-500"><strong class="text-emerald-500">✅ Tout va bien</strong> · Aire de Fleury sur l'A6<div class="text-[0.52rem] text-slate-500 mt-0.5">Il y a 1h25</div></div>
        <div class="${_c.card} border-l-[3px] border-l-blue-500"><strong class="text-blue-500">🚀 Trajet démarré</strong> · Paris vers Barcelone<div class="text-[0.52rem] text-slate-500 mt-0.5">Il y a 6h15</div></div>
        <div class="${_c.card} mt-2 border border-red-500/20 bg-red-500/5"><div class="text-[0.68rem] font-bold text-red-500 mb-[3px]">⚠️ Si un check-in est manqué</div><div class="text-[0.58rem] text-slate-400">Alerte immédiate + dernière position + appeler directement + contacter urgences</div></div>
      </div>

      <!-- Réglages -->
      <div data-cd-panel="cmp-config" class="hidden">
        <div class="${_c.secT}"><span class="text-[0.85rem]">⏰</span> Fréquence check-in</div>
        <div class="grid grid-cols-3 gap-1 mb-2">
          <div class="${_c.card} text-center"><div class="text-[0.85rem]">⚡</div><div class="text-[0.65rem] font-semibold">30 min</div><div class="text-[0.5rem] text-slate-500">Prudent</div></div>
          <div class="${_c.card} text-center border border-amber-400/30 bg-amber-400/5"><div class="text-[0.85rem]">✅</div><div class="text-[0.65rem] font-semibold text-amber-400">1 heure</div><div class="text-[0.5rem] text-amber-400">Recommandé</div></div>
          <div class="${_c.card} text-center"><div class="text-[0.85rem]">🕐</div><div class="text-[0.65rem] font-semibold">2 heures</div><div class="text-[0.5rem] text-slate-500">Relax</div></div>
        </div>
        <div class="${_c.secT}"><span class="text-[0.85rem]">🔔</span> En cas de check-in manqué</div>
        <div class="${_c.card}">
          <div class="flex justify-between mb-[5px]"><span class="text-[0.68rem]">📱 Notification push aux gardiens</span><span class="text-emerald-500 text-[0.6rem] font-bold">Oui ✓</span></div>
          <div class="flex justify-between mb-[5px]"><span class="text-[0.68rem]">📩 SMS d'alerte</span><span class="text-emerald-500 text-[0.6rem] font-bold">Oui ✓</span></div>
          <div class="flex justify-between mb-[5px]"><span class="text-[0.68rem]">📍 Partager dernière position</span><span class="text-emerald-500 text-[0.6rem] font-bold">Oui ✓</span></div>
          <div class="flex justify-between"><span class="text-[0.68rem]">⏳ Délai avant alerte</span><span class="text-amber-400 text-[0.6rem] font-bold">15 min</span></div>
        </div>
        <div class="${_c.secT} mt-2"><span class="text-[0.85rem]">🆘</span> Bouton SOS</div>
        <div class="${_c.card} border border-red-500/20"><div class="text-[0.68rem] font-semibold mb-[3px]">Le SOS déclenche simultanément :</div><div class="text-[0.6rem] text-slate-400">🚨 Alerte tous tes gardiens<br>📱 SMS + appel au gardien principal<br>📍 Position aux urgences (112)<br>🔊 Alarme sonore<br>📹 Enregistrement audio</div></div>
      </div>
    </div>
  `
}

// ==================== 5. AUBERGES & ÉVÉNEMENTS ====================
window.showHostelsDemo = () => {
  const ov = _createDemo('hostels-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closeHostelsDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="hostels-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">🏨</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('hostelsDemoIntroTitle') || 'Auberges & Événements')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('hostelsDemoIntroDesc') || 'Dors pas cher avec -15% chez nos partenaires et organise des événements pour la communauté !')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">🏨</span><span class="${_c.btxt}">Auberges recommandées par la communauté dans chaque ville avec avis et photos</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">💰</span><span class="${_c.btxt}">-15% sur les réservations en utilisant tes points SpotHitch (2 000 pts = code de réduction)</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🏷️</span><span class="${_c.btxt}">Filtres par ambiance : Festif, Calme, Budget, Social, Éco. Trouve l'auberge qui te correspond</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🎉</span><span class="${_c.btxt}">Organise des meetups, courses, festivals et ateliers pour la communauté (+40 pts par événement)</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">Découvre les événements autour de toi et inscris-toi en un clic</span></div>
        </div>
        <button onclick="startHostelsDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="hostels-demo-main" class="hidden"></div>
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
    <div data-demo="overlay" class="${_c.demo}">
      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchDemoTab(this,'htl-hostels')" role="button" tabindex="0">🏨 Auberges</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'htl-events')" role="button" tabindex="0">🎉 Événements</span>
        <span class="cd-tab" onclick="switchDemoTab(this,'htl-create')" role="button" tabindex="0">✏️ Créer un event</span>
      </div>

      <!-- Auberges -->
      <div data-cd-panel="htl-hostels" class="block">
        <div class="flex gap-1 mb-1.5 overflow-x-auto pb-0.5">
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30">🇫🇷 Paris</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-dark-secondary text-slate-400">🇪🇸 Barcelona</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-dark-secondary text-slate-400">🇩🇪 Berlin</span>
          <span class="px-2.5 py-1 rounded-[10px] text-[0.58rem] font-semibold bg-dark-secondary text-slate-400">🇳🇱 Amsterdam</span>
        </div>
        <div class="flex gap-[3px] mb-1.5 flex-wrap">
          <span class="py-[3px] px-2 rounded-[10px] text-[0.52rem] font-semibold text-amber-400 border border-amber-400/30">Tous</span>
          <span class="py-[3px] px-2 rounded-[10px] text-[0.52rem] font-semibold bg-dark-secondary text-slate-400">🎉 Festif</span>
          <span class="py-[3px] px-2 rounded-[10px] text-[0.52rem] font-semibold bg-dark-secondary text-slate-400">😴 Calme</span>
          <span class="py-[3px] px-2 rounded-[10px] text-[0.52rem] font-semibold bg-dark-secondary text-slate-400">💰 Budget</span>
        </div>
        <div class="${_c.card} border-l-[3px] border-l-amber-400 text-[0.62rem] text-slate-400 mb-1.5">💡 <strong>Réduction SpotHitch</strong> : utilise tes points pour -15% chez nos partenaires !</div>
        <div class="${_c.card} p-2.5"><div class="flex items-center gap-2 mb-1.5"><span class="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0 bg-emerald-500/10">🌿</span><div class="flex-1"><div class="font-bold text-[0.78rem]">Le Village Hostel</div><div class="text-[0.55rem] text-slate-400">📍 Montmartre · Vue Sacré-Cœur</div><div class="flex gap-[3px] mt-0.5"><span class="text-[0.48rem] font-semibold px-[5px] py-px rounded text-emerald-500 bg-emerald-500/[0.12]">🌿 Éco</span><span class="text-[0.48rem] font-semibold px-[5px] py-px rounded text-amber-500 bg-amber-500/[0.12]">💰 Budget</span></div></div><div class="text-right"><div class="font-extrabold text-emerald-500">16€</div><div class="text-[0.55rem] text-slate-500 line-through">19€</div><div class="text-[0.48rem] text-emerald-500 font-bold">-15% SpotHitch</div></div></div><div class="flex gap-[5px] text-[0.55rem] text-slate-500"><span class="text-amber-400">⭐ 4.6</span><span>🛏️ Dortoir 6</span><span>🍳 Petit-déj</span><span>📶 WiFi</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex items-center gap-2 mb-1.5"><span class="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0 bg-pink-500/10">🎉</span><div class="flex-1"><div class="font-bold text-[0.78rem]">St Christopher's Inn</div><div class="text-[0.55rem] text-slate-400">📍 Gare du Nord · Bar intégré</div><div class="flex gap-[3px] mt-0.5"><span class="text-[0.48rem] font-semibold px-[5px] py-px rounded text-pink-500 bg-pink-500/[0.12]">🎉 Festif</span><span class="text-[0.48rem] font-semibold px-[5px] py-px rounded text-blue-500 bg-blue-500/[0.12]">🤝 Social</span></div></div><div class="text-right"><div class="font-extrabold text-emerald-500">19€</div><div class="text-[0.55rem] text-slate-500 line-through">22€</div><div class="text-[0.48rem] text-emerald-500 font-bold">-15% SpotHitch</div></div></div><div class="flex gap-[5px] text-[0.55rem] text-slate-500"><span class="text-amber-400">⭐ 4.4</span><span>🛏️ Dortoir 8</span><span>🍺 Bar</span><span>🎵 DJ</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex items-center gap-2 mb-1.5"><span class="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0 bg-indigo-500/10">😴</span><div class="flex-1"><div class="font-bold text-[0.78rem]">Generator Paris</div><div class="text-[0.55rem] text-slate-400">📍 Colonel Fabien · Rooftop</div><div class="flex gap-[3px] mt-0.5"><span class="text-[0.48rem] font-semibold px-[5px] py-px rounded bg-indigo-500/[0.12] text-indigo-400">😴 Calme</span></div></div><div class="text-right"><div class="font-extrabold text-emerald-500">24€</div><div class="text-[0.55rem] text-slate-500 line-through">28€</div><div class="text-[0.48rem] text-emerald-500 font-bold">-15% SpotHitch</div></div></div><div class="flex gap-[5px] text-[0.55rem] text-slate-500"><span class="text-amber-400">⭐ 4.7</span><span>🛏️ Dortoir 4</span><span>🌅 Rooftop</span><span>☕ Café</span></div></div>
      </div>

      <!-- Événements -->
      <div data-cd-panel="htl-events" class="hidden">
        <div class="${_c.card} p-2.5 border border-pink-500/20"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🏁</span><div><div class="font-bold text-[0.78rem]">Course Paris → Barcelone</div><div class="text-[0.58rem] text-amber-400 font-semibold">15-17 mars 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Course officielle ! 12 autostoppeurs, classement live.</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 12/20 · 🏆 50€</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-green-500/15 text-green-500">✅ Inscrit</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🍻</span><div><div class="font-bold text-[0.78rem]">Meetup Paris</div><div class="text-[0.58rem] text-amber-400 font-semibold">22 mars 2026 · 19h</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Rencontre mensuelle. Partage tes aventures, bière offerte !</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 28 · 🆓 Gratuit</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🏕️</span><div><div class="font-bold text-[0.78rem]">Festival Nomade · Ardèche</div><div class="text-[0.58rem] text-amber-400 font-semibold">12-14 avril 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">Camping + ateliers. Débutants bienvenus !</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 45 · 💰 15€</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
        <div class="${_c.card} p-2.5"><div class="flex gap-2 items-start mb-1"><span class="text-[1.2rem]">🌍</span><div><div class="font-bold text-[0.78rem]">Rassemblement Européen · Bruxelles</div><div class="text-[0.58rem] text-amber-400 font-semibold">1-3 mai 2026</div></div></div><div class="text-[0.62rem] text-slate-400 mb-1">200+ participants, 15 pays, conférences, courses.</div><div class="flex justify-between items-center"><div class="text-[0.55rem] text-slate-500">👥 142 · 🌐 15 pays</div><span class="text-[0.6rem] font-bold px-2.5 py-1 rounded-md bg-amber-400/15 text-amber-400">👋 J'y vais !</span></div></div>
      </div>

      <!-- Créer un event -->
      <div data-cd-panel="htl-create" class="hidden">
        <div class="${_c.card} border-l-[3px] border-l-amber-400 text-[0.62rem] text-slate-400 mb-2">💡 Organise un meetup, une course ou un atelier pour la communauté ! <span class="text-amber-400 font-semibold">+40 pts</span></div>
        <div class="mb-2"><div class="text-[0.65rem] font-semibold mb-[3px]">🎯 Type d'événement</div><div class="flex gap-[3px] flex-wrap"><span class="px-2.5 py-1 rounded-[10px] text-[0.55rem] font-semibold text-amber-400 border border-amber-400/30">🍻 Meetup</span><span class="px-2.5 py-1 rounded-[10px] text-[0.55rem] font-semibold bg-dark-secondary text-slate-400">🏁 Course</span><span class="px-2.5 py-1 rounded-[10px] text-[0.55rem] font-semibold bg-dark-secondary text-slate-400">🏕️ Festival</span><span class="px-2.5 py-1 rounded-[10px] text-[0.55rem] font-semibold bg-dark-secondary text-slate-400">📚 Atelier</span></div></div>
        <div class="mb-1.5"><div class="text-[0.65rem] font-semibold mb-[3px]">📝 Nom</div><div class="${_c.card}">Meetup Autostoppeurs Toulouse</div></div>
        <div class="mb-1.5"><div class="text-[0.65rem] font-semibold mb-[3px]">📅 Date</div><div class="${_c.card}">29 mars 2026 · 19h00</div></div>
        <div class="mb-1.5"><div class="text-[0.65rem] font-semibold mb-[3px]">📍 Lieu</div><div class="${_c.card}">Bar Le Petit Vélo, Toulouse</div></div>
        <div class="mb-1.5"><div class="text-[0.65rem] font-semibold mb-[3px]">📝 Description</div><div class="${_c.card}">Première rencontre des autostoppeurs toulousains ! Venez partager vos aventures et trouver des compagnons de route.</div></div>
        <div class="block text-dark-primary font-bold text-center p-2.5 rounded-[10px] mt-2 text-xs" style="background:linear-gradient(135deg,#fbbf24,#d97706)">🎉 Créer l'événement · +40 pts</div>
      </div>
    </div>
  `
}

// ==================== 6. FICHE SPOT (NOUVEAU DESIGN) ====================
window.showSpotDemo = () => {
  const ov = _createDemo('spot-demo-overlay')
  ov.innerHTML = `
    <div class="${_c.wrap}">
      <button onclick="closeSpotDemo()" class="${_c.close}" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>
      <div id="spot-demo-intro" class="${_c.intro} ${_cIntro}">
        <div class="text-5xl mb-3">📍</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('spotDemoIntroTitle') || 'Nouvelle fiche spot')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('spotDemoIntroDesc') || 'Voici à quoi ressemblera un spot complet avec toutes les infos, photos, avis et outils de la communauté.')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="${_c.bullet}"><span class="${_c.bicon}">📸</span><span class="${_c.btxt}">${escapeHTML(t('spotDemoBullet1') || 'Galerie photos cliquable. Vois le spot sous tous les angles avant d\'y aller')}</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">✅</span><span class="${_c.btxt}">${escapeHTML(t('spotDemoBullet2') || 'Valider = confirmer que le spot existe (en passant), Tester = donner ton avis complet (après du stop)')}</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">🏅</span><span class="${_c.btxt}">${escapeHTML(t('spotDemoBullet3') || 'Badges de statut : Basique → Fiable → Certifié → Spot d\'Or selon les validations et avis')}</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">💡</span><span class="${_c.btxt}">${escapeHTML(t('spotDemoBullet4') || 'Tips d\'experts, meilleurs créneaux, spots alternatifs proches et urgences, tout en un')}</span></div>
          <div class="${_c.bullet}"><span class="${_c.bicon}">📍</span><span class="${_c.btxt}">${escapeHTML(t('spotDemoBullet5') || 'Ouvre directement dans Google Maps pour y aller à pied. Un seul bouton')}</span></div>
        </div>
        <button onclick="startSpotDemo()" class="${_c.btn}" style="${_btnStyle}">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>
      <div id="spot-demo-main" class="hidden"></div>
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
    brd: 'rounded-[18px]',
    photoWrap: 'relative cursor-pointer rounded-2xl overflow-hidden',
    gradient: 'absolute inset-0 rounded-2xl',
    statusBadge: 'inline-flex items-center gap-[5px] px-3 py-[5px] rounded-[20px] text-[0.6rem] font-bold',
    statusGreenCrown: '',
    score: 'w-11 h-11 rounded-full flex items-center justify-center text-base font-black text-white',
    btnV: 'flex-1 px-1.5 py-3 rounded-[20px] border-none cursor-pointer text-white font-extrabold text-[0.78rem] flex flex-col items-center gap-0.5',
    btnT: 'flex-1 px-1.5 py-3 rounded-[20px] border-none cursor-pointer text-dark-primary font-extrabold text-[0.78rem] flex flex-col items-center gap-0.5',
    btnM: 'flex items-center justify-center gap-2 w-full py-[11px] rounded-[20px] border-none cursor-pointer font-extrabold text-[0.78rem] text-white',
    dateCard: 'p-2 rounded-[14px]',
    metric: 'px-1 py-2 rounded-[14px] text-center border border-white/[0.06]',
    badge: 'inline-flex items-center gap-[3px] px-2 py-0.5 rounded-[20px] text-[0.55rem] font-semibold',
    bg: '',
    ba: '',
    bb: '',
    sum: 'px-3 py-2 border border-white/[0.08] rounded-[14px] text-[0.72rem] font-semibold cursor-pointer flex justify-between items-center',
    inner: 'px-2.5 py-2 rounded-xl',
    secBtn: 'flex-1 flex items-center justify-center gap-1 p-2 rounded-2xl text-[0.6rem] font-bold border border-white/[0.12] bg-white/5 text-white cursor-pointer',
  }

  // Styles that require inline CSS (gradients, complex backgrounds, box-shadows)
  const _spotStyles = {
    statusGreenCrown: 'background:#065f46;color:#6ee7b7;border:2px solid #34d399',
    score: 'background:linear-gradient(135deg,#10b981,#059669);border:3px solid rgba(15,21,32,.8)',
    btnV: 'background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 4px 12px rgba(16,185,129,.3)',
    btnT: 'background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 4px 12px rgba(245,158,11,.3)',
    btnM: 'background:linear-gradient(135deg,#4285f4,#1a73e8);box-shadow:0 4px 12px rgba(66,133,244,.3)',
    gradient: 'background:linear-gradient(to top,rgba(15,21,32,.9) 5%,transparent 50%)',
    bg: 'background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)',
    ba: 'background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)',
    bb: 'background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.2)',
    metric: 'background:rgba(255,255,255,.03)',
    sum: 'background:rgba(255,255,255,.03)',
    inner: 'background:rgba(255,255,255,.03)',
  }

  main.innerHTML = `
    <div data-demo="overlay" class="${_c.demo} p-2.5 rounded-[22px]">
      <div class="${_c.tabs}">
        <span class="cd-tab cd-tab-active" onclick="switchSpotDemoTab(this,'spot-overview')" role="button" tabindex="0">📍 Aperçu</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-details')" role="button" tabindex="0">📊 Détails</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-community')" role="button" tabindex="0">💬 Communauté</span>
        <span class="cd-tab" onclick="switchSpotDemoTab(this,'spot-emergency')" role="button" tabindex="0">🆘 Urgence</span>
      </div>

      <!-- ===== TAB 1: APERÇU ===== -->
      <div data-cd-panel="spot-overview" class="block">
        <!-- Photo -->
        <div class="px-1 pt-1 mb-2">
          <div class="${_spot.photoWrap} aspect-[2/1]">
            <div class="w-full h-full flex items-center justify-center text-[2rem]" style="background:linear-gradient(135deg,#1a2332,#0f1520)">🏞️</div>
            <div class="${_spot.gradient}" style="${_spotStyles.gradient}"></div>
            <div class="absolute top-1.5 left-1.5 inline-flex items-center gap-[5px] px-3 py-[5px] rounded-[20px] text-[0.6rem] font-bold" style="${_spotStyles.statusGreenCrown}"><span class="text-[0.65rem]">👑</span> Fiable certifié</div>
            <div class="absolute rounded-xl text-[0.55rem] font-semibold bottom-2 right-2 bg-black/60 px-2 py-[3px]">📷 4 photos</div>
            <div class="absolute bottom-2 left-2">
              <div class="text-[0.9rem] font-extrabold">Namur → Liège</div>
              <div class="text-[0.55rem] text-white/50">🏙️ Sortie de ville · E411 · 🇧🇪</div>
            </div>
            <div class="${_spot.score} absolute bottom-1.5 right-[50px]" style="${_spotStyles.score}">4.2</div>
          </div>
        </div>

        <!-- Actions Valider / Testé -->
        <div class="flex gap-1.5 mb-1.5">
          <button class="${_spot.btnV}" style="${_spotStyles.btnV}"><span class="text-[1.1rem]">✅</span>Je valide<span class="text-[0.5rem] font-normal opacity-70">Ce spot existe</span></button>
          <button class="${_spot.btnT}" style="${_spotStyles.btnT}"><span class="text-[1.1rem]">🤙</span>J'ai testé<span class="text-[0.5rem] font-normal opacity-50">Donner mon avis</span></button>
        </div>

        <!-- Google Maps -->
        <button class="${_spot.btnM} mb-2" style="${_spotStyles.btnM}">📍 Ouvrir dans Google Maps</button>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-1.5 mb-2">
          <div class="${_spot.dateCard} bg-emerald-500/5 border border-emerald-500/10">
            <div class="text-[0.5rem] text-[#475569]">✅ Dernière validation</div>
            <div class="text-[0.65rem] font-bold text-[#6ee7b7]">il y a 2 sem.</div>
            <div class="text-[0.5rem] text-[#475569]">par @TravelMarc</div>
          </div>
          <div class="${_spot.dateCard} bg-amber-500/5 border border-amber-500/10">
            <div class="text-[0.5rem] text-[#475569]">🤙 Dernier test</div>
            <div class="text-[0.65rem] font-bold text-amber-400">il y a 3 jours</div>
            <div class="text-[0.5rem] text-[#475569]">@BenTheRoad · ★★★★★</div>
          </div>
        </div>

        <!-- Météo + Légal -->
        <div class="flex justify-between items-center px-2.5 py-1.5 rounded-2xl mb-2 text-[0.65rem] bg-white/[0.02]">
          <span>⛅ 14°C <span class="${_spot.badge} text-[0.45rem]" style="${_spotStyles.bg}">👍</span></span>
          <span class="${_spot.badge}" style="${_spotStyles.bg}">⚖️ Légal</span>
          <span class="${_spot.badge}" style="${_spotStyles.ba}">🌸 Printemps</span>
        </div>

        <!-- 4 Métriques -->
        <div class="grid grid-cols-4 gap-1 mb-2">
          <div class="${_spot.metric}" style="${_spotStyles.metric}"><div class="text-[0.55rem] text-[#475569]">⏱️</div><div class="text-[0.7rem] font-extrabold text-amber-500">8 min</div></div>
          <div class="${_spot.metric}" style="${_spotStyles.metric}"><div class="text-[0.55rem] text-[#475569]">🛡️</div><div class="text-[0.7rem] font-extrabold text-emerald-600">4/5</div></div>
          <div class="${_spot.metric}" style="${_spotStyles.metric}"><div class="text-[0.55rem] text-[#475569]">🎯</div><div class="text-[0.7rem] font-extrabold text-emerald-600">87%</div></div>
          <div class="${_spot.metric}" style="${_spotStyles.metric}"><div class="text-[0.55rem] text-[#475569]">✅</div><div class="text-[0.7rem] font-extrabold text-blue-500">12</div></div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-2">
          <span class="${_spot.badge}" style="${_spotStyles.bg}">☂️ Abri</span>
          <span class="${_spot.badge}" style="${_spotStyles.bg}">👁️ Visible</span>
          <span class="${_spot.badge}" style="${_spotStyles.bg}">🅿️ Place</span>
          <span class="${_spot.badge}" style="${_spotStyles.bb}">💡 Éclairé</span>
          <span class="${_spot.badge}" style="${_spotStyles.ba}">🤙 Pouce</span>
        </div>

        <!-- Actions secondaires -->
        <div class="flex gap-1">
          <div class="${_spot.secBtn}">🔖 Sauver</div>
          <div class="${_spot.secBtn}">📤 Partager</div>
          <div class="${_spot.secBtn}">🚩 Signaler</div>
        </div>
      </div>

      <!-- ===== TAB 2: DÉTAILS ===== -->
      <div data-cd-panel="spot-details" class="hidden">
        <div class="${_c.secT}">📊 Notation détaillée</div>
        <div class="${_c.card}">
          <div class="flex justify-between mb-1"><span class="text-[0.65rem]">🛡️ Sécurité</span><span class="text-[0.65rem] font-bold text-[#6ee7b7]">4/5</span></div>
          <div class="h-[5px] bg-slate-800 rounded-[3px] overflow-hidden mb-2"><div class="h-full bg-emerald-600 rounded-[3px] w-[80%]"></div></div>
          <div class="flex justify-between mb-1"><span class="text-[0.65rem]">🚗 Trafic</span><span class="text-[0.65rem] font-bold text-[#6ee7b7]">5/5</span></div>
          <div class="h-[5px] bg-slate-800 rounded-[3px] overflow-hidden mb-2"><div class="h-full bg-amber-500 rounded-[3px] w-full"></div></div>
          <div class="flex justify-between mb-1"><span class="text-[0.65rem]">♿ Accessibilité</span><span class="text-[0.65rem] font-bold text-amber-400">3/5</span></div>
          <div class="h-[5px] bg-slate-800 rounded-[3px] overflow-hidden"><div class="h-full bg-amber-500 rounded-[3px] w-[60%]"></div></div>
        </div>

        <div class="${_c.secT} mt-2.5">🕐 Meilleurs créneaux</div>
        <div class="${_c.card} bg-emerald-500/5 border border-emerald-500/15">
          <div class="text-[0.72rem] font-bold text-[#6ee7b7]">✨ Mardi–Vendredi 9h–12h</div>
          <div class="text-[0.58rem] text-slate-500 mt-0.5">4 min d'attente vs 15 min le dimanche soir</div>
        </div>

        <div class="${_c.secT} mt-2.5">📊 Statuts des spots</div>
        <div class="grid grid-cols-2 gap-1">
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem] bg-slate-700 text-slate-300 border border-slate-600">📍</span><span class="text-[0.5rem] text-slate-500">1+ avis</span></div>
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem] bg-slate-700 text-slate-300 border-2 border-slate-400">👑</span><span class="text-[0.5rem] text-slate-500">Certifié</span></div>
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem] bg-[#065f46] text-[#6ee7b7] border border-emerald-500">⭐</span><span class="text-[0.5rem] text-slate-500">3+ avis & valid.</span></div>
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem]" style="${_spotStyles.statusGreenCrown}">👑</span><span class="text-[0.5rem] text-slate-500">Fiable certifié</span></div>
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem] bg-red-900 text-red-300 border border-red-500">⛽</span><span class="text-[0.5rem] text-slate-500">Station</span></div>
          <div class="${_c.card} flex items-center gap-1.5 px-2 py-1.5"><span class="${_spot.statusBadge} text-[0.5rem] text-yellow-300 border-2 border-yellow-500" style="background:linear-gradient(135deg,#78350f,#92400e)">✨</span><span class="text-[0.5rem] text-slate-500">Spot d'Or</span></div>
        </div>
      </div>

      <!-- ===== TAB 3: COMMUNAUTÉ ===== -->
      <div data-cd-panel="spot-community" class="hidden">
        <div class="${_c.secT}">💡 Tips d'experts</div>
        <div class="${_c.card} mb-[5px] bg-amber-500/5 border border-amber-500/15">
          <div class="text-[0.65rem]"><strong class="text-amber-400">@TravelMarc :</strong> Se placer APRÈS le feu rouge. Les voitures tournent toutes vers l'E411.</div>
        </div>
        <div class="${_c.card} bg-amber-500/5 border border-amber-500/15">
          <div class="text-[0.65rem]"><strong class="text-amber-400">@BenTheRoad :</strong> Écrire "LIÈGE" sur la pancarte, pas "E411".</div>
        </div>

        <div class="${_c.secT} mt-2.5">💬 Avis communauté (12)</div>
        <div class="${_c.card} mb-[5px]">
          <div class="flex items-center gap-[5px] mb-1"><span>🤙</span><span class="text-[0.68rem] font-bold text-amber-400">@TravelMarc</span><span class="text-[0.55rem] text-slate-500">★★★★★ · 5 min · Solo</span></div>
          <div class="text-[0.62rem] text-slate-400">Super spot ! Pris en 5 min un lundi matin. Je recommande.</div>
        </div>
        <div class="${_c.card}">
          <div class="flex items-center gap-[5px] mb-1"><span>🌍</span><span class="text-[0.68rem] font-bold text-amber-400">@SarahVoyage</span><span class="text-[0.55rem] text-slate-500">★★★★ · 12 min · Duo</span></div>
          <div class="text-[0.62rem] text-slate-400">Bon spot, un peu long à deux mais ça passe.</div>
        </div>

        <div class="${_c.secT} mt-2.5">📍 Spots alternatifs proches</div>
        <div class="${_c.card} flex items-center gap-2">
          <div class="w-[26px] h-[26px] rounded-full bg-emerald-600 flex items-center justify-center text-[0.6rem] font-black text-white shrink-0">4.5</div>
          <div class="flex-1"><div class="font-bold text-[0.72rem]">⛽ Station Total</div><div class="text-[0.55rem] text-slate-500">800m · 5 min · 18 valid.</div></div>
          <span class="${_spot.badge} text-[0.45rem]" style="${_spotStyles.bg}">Mieux!</span>
        </div>
      </div>

      <!-- ===== TAB 4: URGENCE ===== -->
      <div data-cd-panel="spot-emergency" class="hidden">
        <div class="${_c.secT}">🆘 Urgence & plan B</div>
        <div class="${_c.card} flex items-center gap-2 mb-[5px]">
          <span class="text-[1.1rem]">🏥</span>
          <div><div class="font-bold text-[0.72rem]">CHU Namur</div><div class="text-[0.55rem] text-slate-500">2.8 km · ☎️ +32 81 72 61 11</div></div>
        </div>
        <div class="${_c.card} flex items-center gap-2 mb-[5px]">
          <span class="text-[1.1rem]">👮</span>
          <div><div class="font-bold text-[0.72rem]">Police locale</div><div class="text-[0.55rem] text-slate-500">1.5 km · ☎️ +32 81 24 81 11</div></div>
        </div>
        <div class="${_c.card} flex items-center gap-2">
          <span class="text-[1.1rem]">🚌</span>
          <div><div class="font-bold text-[0.72rem]">Bus 38 → Liège</div><div class="text-[0.55rem] text-slate-500">400m · ~7€ · Toutes les 30 min</div></div>
        </div>

        <div class="${_c.secT} mt-2.5">⚖️ Auto-stop en Belgique</div>
        <div class="${_c.card} border-l-[3px] border-l-emerald-300">
          <div class="flex items-center gap-[5px] mb-1"><span class="${_spot.badge}" style="${_spotStyles.bg}">✅ Légal</span></div>
          <div class="text-[0.62rem] text-slate-400">L'auto-stop est légal en Belgique. Interdit sur les autoroutes (accotements), mais autorisé aux entrées et aires de repos.</div>
        </div>

        <div class="${_c.secT} mt-2.5">🆘 Bouton SOS</div>
        <div class="${_c.card} text-center p-3 bg-red-500/[0.08] border border-red-500/20">
          <div class="text-2xl mb-1">🆘</div>
          <div class="text-[0.72rem] font-bold text-red-300">En cas d'urgence</div>
          <div class="text-[0.58rem] text-slate-500 mt-0.5">Envoie ta position + alerte à tes contacts</div>
        </div>
      </div>
    </div>
  `
}
