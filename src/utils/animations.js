/**
 * Enhanced Animation Utilities
 * Success, error, and feedback animations
 */

import { launchConfettiBurst, floatingEmojisBurst } from './confetti.js';
import { icon } from './icons.js'
import { t } from '../i18n/index.js';

/**
 * Show success animation with optional confetti
 * @param {string} message - Success message
 * @param {Object} options - Animation options
 */
export function showSuccessAnimation(message, options = {}) {
 const {
 confetti = false,
 emoji = icon('check', 'w-8 h-8 text-emerald-400'),
 duration = 2000,
 position = 'center', // 'center', 'top', 'bottom'
 } = options;

 // Create overlay
 const overlay = document.createElement('div');
 overlay.className = 'success-animation-overlay';
 overlay.style.cssText = `
 position: fixed;
 inset: 0;
 display: flex;
 align-items: ${position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center'};
 justify-content: center;
 padding: ${position === 'center' ? '0' : '100px'};
 pointer-events: none;
 z-index: 9998;
 `;

 // Create animation container
 const container = document.createElement('div');
 container.className = 'success-animation';
 container.innerHTML = `
 <div class="bg-[linear-gradient(135deg,_rgba(16,_185,_129,_0.95),_rgba(5,_150,_105,_0.95))] py-[24px] px-[48px] rounded-[20px] text-center shadow-[0_20px_60px_rgba(16,_185,_129,_0.4)] [animation:successPop_0.5s_cubic-bezier(0.175,_0.885,_0.32,_1.275)]">
 <div class="text-[3rem] mb-[12px] [animation:successBounce_0.6s_ease-out]">${emoji}</div>
 <div class="text-[white] text-[1.25rem] font-semibold">${message}</div></div>
 `;

 overlay.appendChild(container);
 document.body.appendChild(overlay);

 // Launch confetti if enabled
 if (confetti) {
 setTimeout(() => launchConfettiBurst(), 200);
 }

 // Remove after duration
 setTimeout(() => {
 overlay.style.opacity = '0';
 overlay.style.transition = 'opacity 0.3s ease-out';
 setTimeout(() => overlay.remove(), 300);
 }, duration);
}

/**
 * Show error animation
 * @param {string} message - Error message
 */
export function showErrorAnimation(message) {
 const overlay = document.createElement('div');
 overlay.className = 'error-animation-overlay';
 overlay.style.cssText = `
 position: fixed;
 inset: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 pointer-events: none;
 z-index: 9998;
 `;

 const container = document.createElement('div');
 container.innerHTML = `
 <div class="bg-[linear-gradient(135deg,_rgba(239,_68,_68,_0.95),_rgba(220,_38,_38,_0.95))] py-[24px] px-[48px] rounded-[20px] text-center shadow-[0_20px_60px_rgba(239,_68,_68,_0.4)] [animation:errorShake_0.5s_ease-out]">
 <div class="mb-[12px]">${icon("x", "w-12 h-12 text-red-400")}</div>
 <div class="text-[white] text-[1.25rem] font-semibold">${message}</div></div>
 `;

 overlay.appendChild(container);
 document.body.appendChild(overlay);

 setTimeout(() => {
 overlay.style.opacity = '0';
 overlay.style.transition = 'opacity 0.3s ease-out';
 setTimeout(() => overlay.remove(), 300);
 }, 2000);
}

/**
 * Show badge unlock animation
 * @param {Object} badge - Badge object with icon, name, points
 */
export function showBadgeUnlockAnimation(badge) {
 const overlay = document.createElement('div');
 overlay.className = 'badge-unlock-overlay';
 overlay.style.cssText = `
 position: fixed;
 inset: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 background: rgba(0, 0, 0, 0.8);
 z-index: 9999;
 animation: fadeIn 0.3s ease-out;
 `;

 overlay.innerHTML = `
 <div class="bg-[linear-gradient(135deg,_#1a2332,_#0f1520)] py-[40px] px-[60px] rounded-[24px] text-center border-[2px] border-[rgba(245,_158,_11,_0.5)] shadow-[0_0_100px_rgba(245,_158,_11,_0.3)] [animation:badgeReveal_0.8s_cubic-bezier(0.175,_0.885,_0.32,_1.275)]">
 <div class="text-[1rem] text-[#f59e0b] uppercase tracking-[3px] mb-[20px]">
 Nouveau Badge !
 </div>
 <div style="
 width: 120px;
 height: 120px;
 margin: 0 auto 20px;
 background: linear-gradient(135deg, #f59e0b, #d97706);
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 4rem;
 animation: badgeSpin 1s ease-out;
 box-shadow: 0 0 50px rgba(245, 158, 11, 0.5);
 ">
 ${badge.image ? `<img class="w-[80px] h-[80px] [object-fit:contain]" src="${badge.image}" alt="${badge.name}">` : badge.icon}
 </div>
 <div class="text-[1.5rem] font-bold text-[white] mb-[8px]">
 ${badge.name}
 </div>
 <div class="text-[#94a3b8] mb-[16px]">
 ${badge.description || ''}
 </div>
 <div class="inline-flex items-center gap-[8px] py-[8px] px-[20px] bg-[rgba(245,_158,_11,_0.2)] rounded-[20px] text-[#f59e0b] font-bold">
 +${badge.points} pts
 </div></div>
 `;

 // Close on click
 overlay.onclick = () => {
 overlay.style.opacity = '0';
 overlay.style.transition = 'opacity 0.3s ease-out';
 setTimeout(() => overlay.remove(), 300);
 };

 document.body.appendChild(overlay);

 // Play sound if available
 playSound('badge');

 // Launch confetti
 setTimeout(() => launchConfettiBurst(), 500);

 // Auto close after 4 seconds
 setTimeout(() => {
 if (overlay.parentNode) {
 overlay.style.opacity = '0';
 overlay.style.transition = 'opacity 0.3s ease-out';
 setTimeout(() => overlay.remove(), 300);
 }
 }, 4000);
}

/**
 * Show level up animation
 * @param {number} newLevel - New level reached
 */
export function showLevelUpAnimation(newLevel) {
 floatingEmojisBurst('⬆️', 8);

 const overlay = document.createElement('div');
 overlay.style.cssText = `
 position: fixed;
 inset: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 pointer-events: none;
 z-index: 9998;
 `;

 overlay.innerHTML = `
 <div class="bg-[linear-gradient(135deg,_rgba(59,_130,_246,_0.95),_rgba(37,_99,_235,_0.95))] py-[30px] px-[60px] rounded-[20px] text-center shadow-[0_20px_60px_rgba(59,_130,_246,_0.4)] [animation:levelUp_0.8s_cubic-bezier(0.175,_0.885,_0.32,_1.275)]">
 <div class="mb-[8px]">${icon("party-popper", "w-12 h-12 text-amber-400")}</div>
 <div class="text-[white] text-[1rem] opacity-[0.8]">${t('levelLabel') || 'NIVEAU'}</div>
 <div class="text-[white] text-[3rem] font-extrabold">${newLevel}</div></div>
 `;

 document.body.appendChild(overlay);
 playSound('levelup');
 launchConfettiBurst();

 setTimeout(() => {
 overlay.style.opacity = '0';
 overlay.style.transition = 'opacity 0.3s ease-out';
 setTimeout(() => overlay.remove(), 300);
 }, 2500);
}

/**
 * Show points earned animation
 * @param {number} points - Points earned
 * @param {number} x - X position (optional)
 * @param {number} y - Y position (optional)
 */
export function showPointsAnimation(points, x, y) {
 const posX = x || window.innerWidth / 2;
 const posY = y || window.innerHeight / 2;

 const element = document.createElement('div');
 element.style.cssText = `
 position: fixed;
 left: ${posX}px;
 top: ${posY}px;
 transform: translate(-50%, -50%);
 font-size: 2rem;
 font-weight: bold;
 color: #f59e0b;
 text-shadow: 0 2px 10px rgba(245, 158, 11, 0.5);
 pointer-events: none;
 z-index: 9999;
 animation: pointsFloat 1.5s ease-out forwards;
 `;
 element.textContent = `+${points}`;

 document.body.appendChild(element);
 setTimeout(() => element.remove(), 1500);
}

/**
 * Play sound effect
 * @param {string} type - Sound type: 'badge', 'levelup', 'success', 'error', 'click'
 */
export function playSound(type) {
 // Create audio context on first interaction
 if (!window.audioContext) {
 try {
 window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
 } catch (e) {
 return; // Audio not supported
 }
 }

 const ctx = window.audioContext;
 const oscillator = ctx.createOscillator();
 const gainNode = ctx.createGain();

 oscillator.connect(gainNode);
 gainNode.connect(ctx.destination);

 // Different sounds for different events
 const sounds = {
 badge: { freq: [523, 659, 784], duration: 0.3 },
 levelup: { freq: [392, 523, 659, 784], duration: 0.4 },
 success: { freq: [523, 659], duration: 0.2 },
 error: { freq: [200, 150], duration: 0.3 },
 click: { freq: [800], duration: 0.05 },
 };

 const sound = sounds[type] || sounds.click;
 const time = ctx.currentTime;

 gainNode.gain.setValueAtTime(0.1, time);

 sound.freq.forEach((freq, i) => {
 oscillator.frequency.setValueAtTime(freq, time + i * (sound.duration / sound.freq.length));
 });

 gainNode.gain.exponentialRampToValueAtTime(0.01, time + sound.duration);

 oscillator.start(time);
 oscillator.stop(time + sound.duration);
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
 @keyframes successPop {
 0% { transform: scale(0) rotate(-10deg); opacity: 0; }
 50% { transform: scale(1.1) rotate(2deg); }
 100% { transform: scale(1) rotate(0); opacity: 1; }
 }

 @keyframes successBounce {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-10px); }
 }

 @keyframes errorShake {
 0%, 100% { transform: translateX(0); }
 20%, 60% { transform: translateX(-10px); }
 40%, 80% { transform: translateX(10px); }
 }

 @keyframes badgeReveal {
 0% { transform: scale(0) rotateY(180deg); opacity: 0; }
 60% { transform: scale(1.1) rotateY(-10deg); }
 100% { transform: scale(1) rotateY(0); opacity: 1; }
 }

 @keyframes badgeSpin {
 0% { transform: rotateY(0); }
 100% { transform: rotateY(360deg); }
 }

 @keyframes levelUp {
 0% { transform: scale(0) translateY(50px); opacity: 0; }
 60% { transform: scale(1.2) translateY(-10px); }
 100% { transform: scale(1) translateY(0); opacity: 1; }
 }

 @keyframes pointsFloat {
 0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
 50% { opacity: 1; transform: translate(-50%, -100%) scale(1.2); }
 100% { opacity: 0; transform: translate(-50%, -150%) scale(1); }
 }

 @keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
 }
`;
document.head.appendChild(style);

export default {
 showSuccessAnimation,
 showErrorAnimation,
 showBadgeUnlockAnimation,
 showLevelUpAnimation,
 showPointsAnimation,
 playSound,
};
