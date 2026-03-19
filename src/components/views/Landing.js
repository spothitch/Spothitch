/**
 * Landing Page Component
 * Marketing page shown to new users before sign-up
 * Highlights features, testimonials, and call-to-action
 */

import { t } from '../../i18n/index.js';
import { icon } from '../../utils/icons.js'

/**
 * Render the landing page for new visitors
 */
export function renderLanding(_state) {
  const communitySpots = (_state.spots || []).filter(s => s.dataSource === 'community')
  const countries = new Set(communitySpots.map(s => s.country || s.countryCode).filter(Boolean))
  const stats = {
    spots: communitySpots.length || '\u2014',
    countries: countries.size || '\u2014',
    users: '\u2014',
    checkins: '\u2014'
  };

  const carouselScreens = [
    { key: 'Map', label: t('landingCarouselMap'), img: '/images/marketing/dark-map.webp' },
    { key: 'Profile', label: t('landingCarouselProfile'), img: '/images/marketing/dark-profile.webp' },
    { key: 'Social', label: t('landingCarouselSocial'), img: '/images/marketing/dark-social.webp' },
    { key: 'SOS', label: t('landingCarouselSOS'), img: '/images/marketing/dark-sos.webp' },
    { key: 'Challenges', label: t('landingCarouselChallenges'), img: '/images/marketing/dark-challenges.webp' }
  ];

  const features = [
    {
      icon: 'map-pinned',
      title: t('landingFeatureMapTitle'),
      description: t('landingFeatureMapDesc'),
      color: 'primary'
    },
    {
      icon: 'users',
      title: t('landingFeatureCommunityTitle'),
      description: t('landingFeatureCommunityDesc'),
      color: 'emerald'
    },
    {
      icon: 'route',
      title: t('landingFeaturePlannerTitle'),
      description: t('landingFeaturePlannerDesc'),
      color: 'amber'
    },
    {
      icon: 'trophy',
      title: t('landingFeatureGamificationTitle'),
      description: t('landingFeatureGamificationDesc'),
      color: 'purple'
    },
    {
      icon: 'shield',
      title: t('landingFeatureSOSTitle'),
      description: t('landingFeatureSOSDesc'),
      color: 'rose'
    },
    {
      icon: 'smartphone',
      title: t('landingFeaturePWATitle'),
      description: t('landingFeaturePWADesc'),
      color: 'sky'
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      location: t('landingTestimonialLocation1'),
      avatar: '\uD83C\uDDEB\uD83C\uDDF7',
      text: t('landingTestimonial1'),
      rating: 5
    },
    {
      name: 'Thomas K.',
      location: t('landingTestimonialLocation2'),
      avatar: '\uD83C\uDDE9\uD83C\uDDEA',
      text: t('landingTestimonial2'),
      rating: 5
    },
    {
      name: 'Elena S.',
      location: t('landingTestimonialLocation3'),
      avatar: '\uD83C\uDDEA\uD83C\uDDF8',
      text: t('landingTestimonial3'),
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: t('landingStep1Title'),
      description: t('landingStep1Desc'),
      icon: 'user-plus'
    },
    {
      step: 2,
      title: t('landingStep2Title'),
      description: t('landingStep2Desc'),
      icon: 'search'
    },
    {
      step: 3,
      title: t('landingStep3Title'),
      description: t('landingStep3Desc'),
      icon: 'share-2'
    },
    {
      step: 4,
      title: t('landingStep4Title'),
      description: t('landingStep4Desc'),
      icon: 'thumbs-up'
    }
  ];

  return `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/50 to-slate-900"></div>
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
          <div class="mb-8 animate-bounce-slow">
            <span class="text-8xl">\uD83E\uDD19</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            SpotHitch
          </h1>

          <p class="text-xl md:text-2xl text-slate-300 mb-4">
            ${t('tagline')}
          </p>

          <p class="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            ${t('landingHeroDesc')}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onclick="document.getElementById('landing-auth-section')?.scrollIntoView({behavior:'smooth'})"
              class="btn-primary text-lg px-8 py-4"
            >
              ${icon('rocket', 'w-5 h-5 mr-2')}
              ${t('landingCtaStart')}
            </button>
            <button
              onclick="document.getElementById('landing-features')?.scrollIntoView({behavior:'smooth'})"
              class="btn-ghost text-lg px-8 py-4"
            >
              ${icon('chevron-down', 'w-5 h-5 mr-2')}
              ${t('landingScrollDown')} ↓
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-primary-400">${stats.spots}</div>
              <div class="text-sm text-slate-400">${t('landingStatsSpots')}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-emerald-400">${stats.countries}</div>
              <div class="text-sm text-slate-400">${t('landingStatsCountries')}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-amber-400">${stats.users}</div>
              <div class="text-sm text-slate-400">${t('landingStatsUsers')}</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-purple-400">${stats.checkins}</div>
              <div class="text-sm text-slate-400">Check-ins</div>
            </div>
          </div>

          <!-- Scroll indicator -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            ${icon('chevron-down', 'w-7 h-7 text-slate-400')}
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="landing-features" class="py-20 px-4 bg-slate-800/50">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
            ${t('landingFeaturesHeading')}
          </h2>
          <p class="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            ${t('landingFeaturesSubheading')}
          </p>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${features.map(feature => `
              <div class="card p-6 hover:scale-105 transition-transform">
                <div class="w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4">
                  ${icon(feature.icon, `w-7 h-7 text-${feature.color}-400`)}
                </div>
                <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
                <p class="text-slate-400">${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- How it Works Section -->
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
            ${t('landingHowItWorks')}
          </h2>
          <p class="text-slate-400 text-center mb-12">
            ${t('landingHowItWorksDesc')}
          </p>

          <div class="relative">
            <!-- Connection line -->
            <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-emerald-500 to-amber-500 -translate-y-1/2 rounded-full"></div>

            <div class="grid md:grid-cols-4 gap-8">
              ${howItWorks.map(item => `
                <div class="relative text-center">
                  <div class="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                    ${icon(item.icon, 'w-7 h-7 text-white')}
                  </div>
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center text-sm shadow-lg z-20">
                    ${item.step}
                  </div>
                  <h3 class="font-semibold text-lg mb-2">${item.title}</h3>
                  <p class="text-slate-400 text-sm">${item.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-20 px-4 bg-slate-800/50">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
            ${t('landingTestimonialsHeading')}
          </h2>
          <p class="text-slate-400 text-center mb-12">
            ${t('landingTestimonialsSubheading')}
          </p>

          <div class="grid md:grid-cols-3 gap-6">
            ${testimonials.map(testimonial => `
              <div class="card p-6">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                    ${testimonial.avatar}
                  </div>
                  <div>
                    <div class="font-semibold">${testimonial.name}</div>
                    <div class="text-sm text-slate-400">${testimonial.location}</div>
                  </div>
                </div>
                <div class="flex gap-1 mb-3">
                  ${Array(testimonial.rating).fill(icon('star', 'w-5 h-5 text-amber-400')).join('')}
                </div>
                <p class="text-slate-300 italic">"${testimonial.text}"</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- App Preview Carousel Section -->
      <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">
            ${t('landingCarouselTitle')}
          </h2>
          <p class="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            ${t('landingAppPreviewHeading')}
          </p>

          <!-- Carousel -->
          <div class="relative">
            <div id="landing-carousel" class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none scroll-smooth">
              ${carouselScreens.map((screen, i) => `
                <div class="snap-center shrink-0 first:pl-4 last:pr-4">
                  <div class="relative w-56 md:w-64">
                    <!-- iPhone frame -->
                    <div class="rounded-[2.5rem] border-4 border-slate-600 bg-slate-800 overflow-hidden shadow-2xl shadow-primary-500/10 aspect-[9/19.5]">
                      <img
                        src="${screen.img}"
                        alt="${screen.label}"
                        loading="${i === 0 ? 'eager' : 'lazy'}"
                        class="w-full h-full object-cover"
                        onerror="this.parentElement.innerHTML='<div class=\\'h-full bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center\\'><span class=\\'text-4xl\\'>\uD83E\uDD19</span></div>'"
                      />
                    </div>
                    <!-- Label -->
                    <div class="text-center mt-3 font-semibold text-slate-200">${screen.label}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Scroll indicators -->
            <div class="flex justify-center gap-2 mt-4">
              ${carouselScreens.map((_, i) => `
                <div class="w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-400' : 'bg-slate-600'}"></div>
              `).join('')}
            </div>
          </div>

          <!-- Features list below carousel -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            <div class="flex items-center gap-2 text-sm text-slate-300">
              ${icon('check', 'w-4 h-4 text-emerald-400 shrink-0')}
              ${t('landingOfflineTitle')}
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-300">
              ${icon('check', 'w-4 h-4 text-emerald-400 shrink-0')}
              ${t('landingGPSTitle')}
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-300">
              ${icon('check', 'w-4 h-4 text-emerald-400 shrink-0')}
              ${t('landingFreeTitle')}
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-300">
              ${icon('check', 'w-4 h-4 text-emerald-400 shrink-0')}
              ${t('landingMultilingualTitle')}
            </div>
          </div>
        </div>
      </section>

      <!-- Alpha CTA Section -->
      <section class="py-20 px-4 bg-gradient-to-br from-amber-900/30 via-slate-900 to-primary-900/30 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-10 right-20 w-64 h-64 bg-amber-500/40 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 left-20 w-48 h-48 bg-primary-500/30 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto text-center">
          <!-- Alpha badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-sm font-semibold mb-6">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            ${t('landingAlphaBadge')}
          </div>

          <h2 class="text-3xl md:text-5xl font-bold mb-6">
            ${t('landingAlphaHeading')}
          </h2>
          <p class="text-xl text-slate-300 mb-8 max-w-xl mx-auto">
            ${t('landingAlphaDesc')}
          </p>

          <button
            onclick="document.getElementById('landing-auth-section')?.scrollIntoView({behavior:'smooth'})"
            class="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
          >
            ${icon('rocket', 'w-5 h-5')}
            ${t('landingAlphaCta')}
          </button>
        </div>
      </section>

      <!-- Auth Section (connexion obligatoire) -->
      <section id="landing-auth-section" class="py-20 px-4 bg-gradient-to-br from-primary-900/50 to-emerald-900/50">
        <div class="max-w-md mx-auto text-center">
          <div class="text-5xl mb-4" aria-hidden="true">🔐</div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            ${t('landingAuthTitle')}
          </h2>
          <p class="text-lg text-slate-300 mb-8">
            ${t('landingAuthDesc')}
          </p>

          <!-- Google Sign-In (principal) -->
          <button
            onclick="handleGoogleSignIn()"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-colors shadow-lg mb-4"
            type="button"
            id="landing-google-btn"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            ${t('landingAuthGoogle')}
          </button>

          <!-- Email Sign-In (secondaire) -->
          <button
            onclick="openAuth(); setAuthMode('login')"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors"
            type="button"
          >
            ${icon('mail', 'w-5 h-5')}
            ${t('landingAuthEmail')}
          </button>

          <p class="mt-6 text-sm text-slate-400">
            ${t('landingLegalNotice')}
            <a href="javascript:void(0)" onclick="showLegalPage('cgu')" class="text-primary-400 hover:underline">${t('termsOfService')}</a>
            ${t('and')}
            <a href="javascript:void(0)" onclick="showLegalPage('privacy')" class="text-primary-400 hover:underline">${t('privacyPolicy')}</a>.
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 px-4 border-t border-slate-700">
        <div class="max-w-6xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl">\uD83E\uDD19</span>
                <span class="font-bold text-lg">SpotHitch</span>
              </div>
              <p class="text-slate-400 text-sm">
                ${t('landingFooterDesc')}
              </p>
            </div>

            <div>
              <h4 class="font-semibold mb-4">${t('landingFooterResources')}</h4>
              <ul class="space-y-2 text-slate-400 text-sm">
                <li><a href="javascript:void(0)" onclick="openFAQ()" class="hover:text-white">FAQ</a></li>
                <li><a href="javascript:void(0)" onclick="openChangelog()" class="hover:text-white">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-4">${t('landingFooterLegal')}</h4>
              <ul class="space-y-2 text-slate-400 text-sm">
                <li><a href="javascript:void(0)" onclick="showLegalPage('cgu')" class="hover:text-white">${t('termsOfService')}</a></li>
                <li><a href="javascript:void(0)" onclick="showLegalPage('privacy')" class="hover:text-white">${t('privacyPolicy')}</a></li>
                <li><a href="javascript:void(0)" onclick="openContactForm()" class="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-slate-400 text-sm">
              &copy; 2026 SpotHitch. ${t('landingFooterCopyright')}
            </p>
            <div class="flex gap-4">
              <a href="https://github.com/antoine626/Spothitch" target="_blank" rel="noopener" class="text-slate-400 hover:text-white">
                ${icon('github', 'w-6 h-6')}
                <span class="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

export default { renderLanding };
