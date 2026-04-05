/**
 * Legal Pages Component
 * CGU, Privacy Policy, Legal Notice
 */

import { t } from '../../i18n/index.js';
import { icon } from '../../utils/icons.js'

/**
 * Render legal page container
 */
export function renderLegalPage(page = 'cgu') {
  const content = {
    cgu: renderCGU(),
    privacy: renderPrivacyPolicy(),
    cookies: renderCookiePolicy(),
    legal: renderLegalNotice(),
    guidelines: renderCommunityGuidelines(),
    accessibility: renderAccessibilityPage(),
  };

  const titles = {
    cgu: t('legalTerms'),
    privacy: t('legalPrivacy'),
    cookies: t('legalCookies'),
    legal: t('legalNotice'),
    guidelines: t('communityGuidelines') || 'Community Guidelines',
    accessibility: t('legalAccessibility') || 'Accessibility',
  };

  return `
    <div class="legal-page pb-24 overflow-x-hidden">
      <!-- Header -->
      <div class="sticky top-0 bg-dark-primary/80 backdrop-blur-xl z-10 border-b border-white/10">
        <div class="flex items-center gap-3 p-4">
          <button onclick="closeLegal()" class="p-2 hover:bg-dark-secondary rounded-full">
            ${icon('arrow-left', 'w-5 h-5')}
          </button>
          <h1 class="text-lg font-bold text-white">
            ${titles[page] || titles.cgu}
          </h1>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-white/10 overflow-x-auto">
        <button onclick="showLegalPage('cgu')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'cgu' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabTerms')}
        </button>
        <button onclick="showLegalPage('privacy')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'privacy' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabPrivacy')}
        </button>
        <button onclick="showLegalPage('cookies')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'cookies' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabCookies')}
        </button>
        <button onclick="showLegalPage('legal')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'legal' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabNotice')}
        </button>
        <button onclick="showLegalPage('guidelines')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'guidelines' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabGuidelines') || 'Rules'}
        </button>
        <button onclick="showLegalPage('accessibility')"
                class="flex-1 py-3 text-sm font-medium whitespace-nowrap px-2 ${page === 'accessibility' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400'}">
          ${t('legalTabAccessibility') || 'A11y'}
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 prose prose-invert prose-sm max-w-none">
        ${content[page] || content.cgu}
      </div>
    </div>
  `;
}

/**
 * Render CGU (Terms of Service) — DSA-compliant, 16 articles
 */
export function renderCGU() {
  return `
    <div class="legal-content">
      <h2>${t('legalCguTitle')}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateApr2026')}</p>

      <h3>${t('legalCgu1Title')}</h3>
      <p>${t('legalCgu1Text')}</p>

      <h3>${t('legalCgu2Title')}</h3>
      <p>${t('legalCgu2Text')}</p>

      <h3>${t('legalCgu3Title')}</h3>
      <p>${t('legalCgu3Text')}</p>

      <h3>${t('legalCgu4Title')}</h3>
      <p>${t('legalCgu4Text')}</p>

      <h3>${t('legalCgu5Title')}</h3>
      <p>${t('legalCgu5Intro')}</p>
      <ul>
        <li>${t('legalCgu5Item1')}</li>
        <li>${t('legalCgu5Item2')}</li>
        <li>${t('legalCgu5Item3')}</li>
        <li>${t('legalCgu5Item4')}</li>
      </ul>

      <h3>${t('legalCgu6Title')}</h3>
      <p>${t('legalCgu6Text')}</p>

      <h3>${t('legalCgu7Title')}</h3>
      <p>${t('legalCgu7Text')}</p>

      <h3>${t('legalCgu8Title')}</h3>
      <p>${t('legalCgu8Text')}</p>

      <h3>${t('legalCgu9Title')}</h3>
      <p>${t('legalCgu9Text')}</p>

      <h3>${t('legalCgu10Title')}</h3>
      <p>${t('legalCgu10Text')}</p>

      <h3>${t('legalCgu11Title')}</h3>
      <p>${t('legalCgu11Text')}</p>

      <h3>${t('legalCgu12Title')}</h3>
      <p>${t('legalCgu12Text')}</p>

      <h3>${t('legalCgu13Title')}</h3>
      <p>${t('legalCgu13Text')}</p>

      <h3>${t('legalCgu14Title')}</h3>
      <p>${t('legalCgu14Text')}</p>

      <h3>${t('legalCgu15Title')}</h3>
      <p>${t('legalCgu15Text')}</p>

      <h3>${t('legalCgu16Title')}</h3>
      <p>${t('legalCgu16Text')}</p>
    </div>
  `;
}

/**
 * Render Privacy Policy — GDPR Article 13 compliant with data table
 */
export function renderPrivacyPolicy() {
  return `
    <div class="legal-content">
      <h2>${t('legalPrivacyTitle')}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateApr2026')}</p>

      <h3>${t('legalPrivacyControllerTitle')}</h3>
      <p>${t('legalPrivacyControllerText')}</p>

      <h3>${t('legalPrivacyDataTableTitle')}</h3>
      <p>${t('legalPrivacyDataTableIntro')}</p>

      <div class="overflow-x-auto">
        <table class="w-full text-sm mt-2 mb-4 min-w-[500px]">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-2 pr-2">${t('legalPrivacyColData')}</th>
              <th class="text-left py-2 pr-2">${t('legalPrivacyColPurpose')}</th>
              <th class="text-left py-2 pr-2">${t('legalPrivacyColBasis')}</th>
              <th class="text-left py-2">${t('legalPrivacyColRetention')}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowAccount')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowAccountPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowAccountBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowAccountRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowGeolocation')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowGeolocationPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowGeolocationBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowGeolocationRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowGuardian')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowGuardianPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowGuardianBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowGuardianRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowSos')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowSosPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowSosBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowSosRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowMessages')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowMessagesPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowMessagesBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowMessagesRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowSpots')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowSpotsPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowSpotsBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowSpotsRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowPhotos')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowPhotosPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowPhotosBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowPhotosRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowIdPhotos')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowIdPhotosPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowIdPhotosBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowIdPhotosRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowPushTokens')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowPushTokensPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowPushTokensBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowPushTokensRetention')}</td>
            </tr>
            <tr class="border-b border-white/10">
              <td class="py-2 pr-2">${t('legalPrivacyRowTechnical')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowTechnicalPurpose')}</td>
              <td class="py-2 pr-2">${t('legalPrivacyRowTechnicalBasis')}</td>
              <td class="py-2">${t('legalPrivacyRowTechnicalRetention')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>${t('legalPrivacyTransfersTitle')}</h3>
      <p>${t('legalPrivacyTransfersIntro')}</p>
      <ul>
        <li>${t('legalPrivacyTransferFirebase')}</li>
        <li>${t('legalPrivacyTransferCloudflare')}</li>
        <li>${t('legalPrivacyTransferSentry')}</li>
        <li>${t('legalPrivacyTransferAuthorities')}</li>
      </ul>

      <h3>${t('legalPrivacyRightsTitle')}</h3>
      <p>${t('legalPrivacyRightsIntro')}</p>
      <ul>
        <li>${t('legalPrivacyRightAccess')}</li>
        <li>${t('legalPrivacyRightRectify')}</li>
        <li>${t('legalPrivacyRightErase')}</li>
        <li>${t('legalPrivacyRightRestrict')}</li>
        <li>${t('legalPrivacyRightPortability')}</li>
        <li>${t('legalPrivacyRightObject')}</li>
        <li>${t('legalPrivacyRightComplaint')}</li>
      </ul>

      <h3>${t('legalPrivacyAutomatedTitle')}</h3>
      <p>${t('legalPrivacyAutomatedText')}</p>

      <h3>${t('legalPrivacyDpoTitle')}</h3>
      <p>${t('legalPrivacyDpoText')}</p>

      <h3>${t('legalPrivacySecurityTitle')}</h3>
      <p>${t('legalPrivacySecurityText')}</p>

      <h3>${t('legalPrivacyCookiesTitle')}</h3>
      <p>${t('legalPrivacyCookiesText')}</p>

      <h3>${t('legalPrivacyCcpaTitle') || 'California Privacy Rights (CCPA/CPRA)'}</h3>
      <p>${t('legalPrivacyCcpaIntro') || 'If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):'}</p>
      <ul>
        <li><strong>${t('legalPrivacyCcpaKnow') || 'Right to know'}</strong>: ${t('legalPrivacyCcpaKnowDesc') || 'You can request what personal information we collect, use, and share.'}</li>
        <li><strong>${t('legalPrivacyCcpaDelete') || 'Right to delete'}</strong>: ${t('legalPrivacyCcpaDeleteDesc') || 'You can request deletion of your personal information. Use "My Data" in your profile settings.'}</li>
        <li><strong>${t('legalPrivacyCcpaOptOut') || 'Right to opt out'}</strong>: ${t('legalPrivacyCcpaOptOutDesc') || 'We do NOT sell your personal information. There is nothing to opt out of.'}</li>
        <li><strong>${t('legalPrivacyCcpaNonDiscrim') || 'Non-discrimination'}</strong>: ${t('legalPrivacyCcpaNonDiscrimDesc') || 'We will not treat you differently for exercising your privacy rights.'}</li>
      </ul>
      <p>${t('legalPrivacyCcpaContact') || 'To exercise these rights, use the "My Data" section in your profile or email us at support@spothitch.com.'}</p>
    </div>
  `;
}

/**
 * Render Cookie Policy (detailed)
 */
export function renderCookiePolicy() {
  return `
    <div class="legal-content">
      <h2>${t('legalCookieTitle')}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateFeb2026')}</p>

      <h3>${t('legalCookie1Title')}</h3>
      <p>${t('legalCookie1Text')}</p>

      <h3>${t('legalCookie2Title')}</h3>

      <p class="text-sm text-slate-400 mb-3">${t('cookieLocalStorageNote')}</p>

      <h4 class="text-amber-400 mt-4">${t('legalCookieNecessaryTitle')}</h4>
      <p>${t('legalCookieNecessaryDesc')}</p>
      <table class="w-full text-sm mt-2 mb-4">
        <thead>
          <tr class="border-b border-white/10">
            <th class="text-left py-2">${t('legalCookieColName')}</th>
            <th class="text-left py-2">${t('legalCookieColPurpose')}</th>
            <th class="text-left py-2">${t('legalCookieColDuration')}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_v4_state</code></td>
            <td class="py-2">${t('legalCookieStateDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>cookie_consent</code></td>
            <td class="py-2">${t('legalCookieConsentDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>consent_history</code></td>
            <td class="py-2">${t('legalCookieHistoryDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_language_selected</code></td>
            <td class="py-2">${t('legalCookieLangDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
        </tbody>
      </table>

      <h4 class="text-amber-400 mt-4">${t('cookieFunctionalTitle')}</h4>
      <p>${t('cookieFunctionalDesc')}</p>
      <table class="w-full text-sm mt-2 mb-4">
        <thead>
          <tr class="border-b border-white/10">
            <th class="text-left py-2">${t('legalCookieColName')}</th>
            <th class="text-left py-2">${t('legalCookieColPurpose')}</th>
            <th class="text-left py-2">${t('legalCookieColDuration')}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_favorites</code></td>
            <td class="py-2">${t('cookieFavoritesDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_saved_trips</code></td>
            <td class="py-2">${t('cookieTripsDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_last_position</code></td>
            <td class="py-2">${t('cookiePositionDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_offline_*</code></td>
            <td class="py-2">${t('legalCookieOfflineDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_guardian</code></td>
            <td class="py-2">${t('cookieCompanionDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
        </tbody>
      </table>

      <h4 class="text-amber-400 mt-4">${t('legalCookiePersonalizationTitle')}</h4>
      <p>${t('legalCookiePersonalizationDesc')}</p>
      <table class="w-full text-sm mt-2 mb-4">
        <thead>
          <tr class="border-b border-white/10">
            <th class="text-left py-2">${t('legalCookieColName')}</th>
            <th class="text-left py-2">${t('legalCookieColPurpose')}</th>
            <th class="text-left py-2">${t('legalCookieColDuration')}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_theme_override</code></td>
            <td class="py-2">${t('legalCookieThemeDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
          <tr class="border-b border-white/10">
            <td class="py-2"><code>spothitch_preferred_nav_app</code></td>
            <td class="py-2">${t('cookieNavAppDesc')}</td>
            <td class="py-2">${t('cookiePersistent')}</td>
          </tr>
        </tbody>
      </table>

      <p class="text-sm text-slate-400 mt-2">${t('cookieNoMarketingNote')}</p>

      <h3>${t('legalCookie3Title')}</h3>
      <p>${t('legalCookie3Intro')}</p>
      <ul>
        <li>${t('legalCookie3Item1')}</li>
        <li>${t('legalCookie3Item2')}</li>
        <li>${t('legalCookie3Item3')}</li>
        <li>${t('legalCookie3Item4')}</li>
        <li>${t('legalCookie3Item5')}</li>
      </ul>
      <p class="mt-2">${t('legalCookie3NoThirdParty')}</p>

      <h3>${t('legalCookie4Title')}</h3>

      <h4 class="text-amber-400 mt-4">${t('legalCookie4AppTitle')}</h4>
      <p>${t('legalCookie4AppText')}</p>

      <h4 class="text-amber-400 mt-4">${t('legalCookie4BrowserTitle')}</h4>
      <p>${t('legalCookie4BrowserText')}</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" class="text-amber-400">Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" class="text-amber-400">Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" class="text-amber-400">Safari</a></li>
        <li><a href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies" target="_blank" class="text-amber-400">Edge</a></li>
      </ul>

      <h3>${t('legalCookie5Title')}</h3>
      <p><strong>${t('legalCookie5NecessaryLabel')}</strong> ${t('legalCookie5NecessaryText')}</p>
      <p><strong>${t('legalCookie5OptionalLabel')}</strong> ${t('legalCookie5OptionalIntro')}</p>
      <ul>
        <li>${t('legalCookie5AnalyticsRefused')}</li>
        <li>${t('legalCookie5MarketingRefused')}</li>
        <li>${t('legalCookie5PersonalizationRefused')}</li>
      </ul>

      <h3>${t('legalCookie6Title')}</h3>
      <p>${t('legalCookie6Text')}</p>

      <h3>${t('legalCookie7Title')}</h3>
      <p>${t('legalCookie7Text')}</p>

      <h3>${t('legalCookie8Title')}</h3>
      <p>
        ${t('legalCookie8Text')} <a href="mailto:support@spothitch.com" class="text-amber-400">support@spothitch.com</a>
      </p>

      <!-- Bouton pour modifier les preferences -->
      <div class="mt-6 p-4 bg-dark-secondary rounded-xl text-center">
        <p class="text-sm text-slate-400 mb-3">${t('manageCookiePrefs')}</p>
        <button onclick="showCookieCustomize()" class="btn bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl">
          ${icon('settings', 'w-5 h-5 mr-2')}
          ${t('modifyMyChoices')}
        </button>
      </div>
    </div>
  `;
}

/**
 * Render Legal Notice
 */
export function renderLegalNotice() {
  return `
    <div class="legal-content">
      <h2>${t('legalNoticeTitle')}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateMar2026')}</p>

      <h3>${t('legalNoticeEditorTitle')}</h3>
      <p>
        ${t('legalNoticeEditorText')}<br>
        ${t('legalNoticeHostingLabel')} Cloudflare Pages<br>
        ${t('legalNoticeSourceLabel')} <a href="https://github.com/antoine626/Spothitch" class="text-amber-400">GitHub</a>
      </p>

      <h3>${t('legalNoticeHostingTitle')}</h3>
      <p>
        Cloudflare, Inc.<br>
        101 Townsend St<br>
        San Francisco, CA 94107<br>
        ${t('legalNoticeUSA')}
      </p>

      <h3>${t('legalNoticeServicesTitle')}</h3>
      <ul>
        <li><strong>Firebase</strong> (Google) · ${t('legalNoticeFirebaseDesc')}</li>
        <li><strong>Cloudflare Pages</strong> · ${t('legalNoticeCloudflareDesc')}</li>
        <li><strong>Sentry</strong> · ${t('legalNoticeSentryDesc')}</li>
        <li><strong>OpenStreetMap</strong> · ${t('legalNoticeOSMDesc')}</li>
        <li><strong>OpenFreeMap</strong> · ${t('legalNoticeOpenFreeMapDesc')}</li>
        <li><strong>OSRM</strong> · ${t('legalNoticeOSRMDesc')}</li>
        <li><strong>Nominatim</strong> · ${t('legalNoticeNominatimDesc')}</li>
        <li><strong>Photon</strong> (Komoot) · ${t('legalNoticePhotonDesc')}</li>
        <li><strong>Mapillary</strong> (Meta) · ${t('legalNoticeMapillaryDesc')}</li>
        <li><strong>MyMemory</strong> · ${t('legalNoticeMyMemoryDesc')}</li>
        <li><strong>Formspree</strong> · ${t('legalNoticeFormspreeDesc')}</li>
      </ul>

      <h3>${t('legalNoticeCreditsTitle')}</h3>
      <ul>
        <li>${t('legalNoticeCreditsMap')}</li>
        <li>${t('legalNoticeCreditsSpots')}</li>
        <li>${t('legalNoticeCreditsIcons')}</li>
        <li>${t('legalNoticeCreditsPhotos')}</li>
      </ul>

      <h3>${t('legalNoticeLicenseTitle')}</h3>
      <p>${t('legalNoticeLicenseText')}</p>

      <h3>${t('legalNoticeContactTitle')}</h3>
      <p>
        ${t('legalNoticeContactEmail')} contact@spothitch.com<br>
        GitHub Issues : <a href="https://github.com/antoine626/Spothitch/issues" class="text-amber-400">${t('legalNoticeReportIssue')}</a>
      </p>
    </div>
  `;
}

/**
 * Render Community Guidelines
 */
export function renderCommunityGuidelines() {
  return `
    <div class="legal-content">
      <h2>${t('guidelinesTitle') || 'Community Guidelines'}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateFeb2026')}</p>

      <p>${t('guidelinesIntro') || 'SpotHitch is a community of hitchhikers helping each other travel safely. These rules ensure everyone has a positive experience.'}</p>

      <h3>${t('guidelinesRespectTitle') || 'Respect & Safety'}</h3>
      <ul>
        <li>${t('guidelinesRespect1') || 'Treat all members with respect regardless of gender, ethnicity, nationality, or experience level.'}</li>
        <li>${t('guidelinesRespect2') || 'Never share someone else\'s location or travel plans without their explicit consent.'}</li>
        <li>${t('guidelinesRespect3') || 'Report any behavior that makes you feel unsafe. Reports are reviewed within 24 hours.'}</li>
      </ul>

      <h3>${t('guidelinesContentTitle') || 'Content Rules'}</h3>
      <ul>
        <li>${t('guidelinesContent1') || 'Only share spots you have personally tested or that are based on reliable community data.'}</li>
        <li>${t('guidelinesContent2') || 'Be honest about wait times, conditions, and safety ratings.'}</li>
        <li>${t('guidelinesContent3') || 'Do not post spam, advertising, or unrelated content.'}</li>
        <li>${t('guidelinesContent4') || 'Photos must show the actual spot. No inappropriate or misleading images.'}</li>
      </ul>

      <h3>${t('guidelinesAccountTitle') || 'Account & Identity'}</h3>
      <ul>
        <li>${t('guidelinesAccount1') || 'One account per person. Duplicate accounts will be merged or banned.'}</li>
        <li>${t('guidelinesAccount2') || 'Do not impersonate other users or public figures.'}</li>
        <li>${t('guidelinesAccount3') || 'Keep your profile information truthful.'}</li>
      </ul>

      <h3>${t('guidelinesModTitle') || 'Moderation & Consequences'}</h3>
      <ul>
        <li>${t('guidelinesMod1') || 'First violation: warning message.'}</li>
        <li>${t('guidelinesMod2') || 'Second violation: temporary suspension (7 days).'}</li>
        <li>${t('guidelinesMod3') || 'Severe or repeated violations: permanent ban.'}</li>
        <li>${t('guidelinesMod4') || 'Illegal content or threats of violence: immediate ban + report to authorities if needed.'}</li>
      </ul>

      <h3>${t('guidelinesContactTitle') || 'Contact'}</h3>
      <p>
        ${t('guidelinesContactText') || 'If you see a violation, use the report button (flag icon) on any spot, message, or profile. You can also email us at:'} <a href="mailto:contact@spothitch.com" class="text-amber-400">contact@spothitch.com</a>
      </p>
    </div>
  `
}

/**
 * Render Accessibility Page
 */
export function renderAccessibilityPage() {
  return `
    <div class="legal-content">
      <h2>${t('accessibilityTitle')}</h2>
      <p class="text-slate-400 text-sm">${t('legalLastUpdated')} ${t('legalDateApr2026')}</p>

      <h3>${t('accessibilityStatus')}</h3>
      <p>${t('accessibilityStatusText')}</p>

      <h3>${t('accessibilityMeasures')}</h3>
      <p>${t('accessibilityMeasuresIntro')}</p>
      <ul>
        <li>${t('accessibilityMeasure1')}</li>
        <li>${t('accessibilityMeasure2')}</li>
        <li>${t('accessibilityMeasure3')}</li>
        <li>${t('accessibilityMeasure4')}</li>
        <li>${t('accessibilityMeasure5')}</li>
        <li>${t('accessibilityMeasure6')}</li>
      </ul>

      <h3>${t('accessibilityKnownIssues')}</h3>
      <p>${t('accessibilityKnownIssuesText')}</p>

      <h3>${t('accessibilityCommitment')}</h3>
      <p>${t('accessibilityCommitmentText')}</p>

      <h3>${t('accessibilityContact')}</h3>
      <p>
        ${t('accessibilityContactText')}
        <a href="mailto:contact@spothitch.com" class="text-amber-400">contact@spothitch.com</a>
      </p>

      <p class="text-slate-400 text-sm mt-4">
        ${t('accessibilityAssessmentDate')} ${t('legalDateApr2026')}
      </p>
    </div>
  `
}

export default {
  renderLegalPage,
  renderCGU,
  renderPrivacyPolicy,
  renderCookiePolicy,
  renderLegalNotice,
  renderCommunityGuidelines,
  renderAccessibilityPage,
};
