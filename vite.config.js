import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
// legacy plugin disabled — breaks MapLibre v5 web worker (Ne is not defined)
// import legacy from '@vitejs/plugin-legacy';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { writeFileSync } from 'fs';

// Generate version.json on each build so the app can auto-reload
function versionPlugin() {
  return {
    name: 'version-json',
    writeBundle({ dir }) {
      const version = Date.now().toString(36)
      writeFileSync(`${dir}/version.json`, JSON.stringify({ version, built: new Date().toISOString() }))
    }
  }
}

// CSP: allow the local Firebase emulators in connect-src ONLY for the isolated E2E
// emulator build (VITE_FIREBASE_EMULATOR_E2E=true). This flag is set ONLY by the
// dedicated e2e-firebase CI job's build — NEVER by the shared build job — so production
// and the rest of the E2E suite keep the locked-down CSP (no suite-wide ripple).
function emulatorCspPlugin() {
  const isE2eEmulator = process.env.VITE_FIREBASE_EMULATOR_E2E === 'true'
  return {
    name: 'emulator-csp',
    transformIndexHtml(html) {
      if (!isE2eEmulator) return html
      return html.replace(
        /(connect-src 'self')/,
        "$1 http://127.0.0.1:9099 http://127.0.0.1:8080 ws://127.0.0.1:9099 ws://127.0.0.1:8080"
      )
    }
  }
}

// Sur Cloudflare Pages, CF_PAGES_BRANCH est injecté automatiquement.
// VITE_SHOW_BETA=true uniquement sur la branche 'dev' (ou en local via .env.local).
const showBeta = process.env.VITE_SHOW_BETA === 'true'
  || process.env.CF_PAGES_BRANCH === 'dev'

export default defineConfig({
  base: '/',
  define: {
    'import.meta.env.VITE_SHOW_BETA': JSON.stringify(showBeta ? 'true' : ''),
  },

  plugins: [
    // Tailwind CSS v4
    tailwindcss(),

    // Version check for auto-reload
    versionPlugin(),

    // Firebase emulators in CSP for the isolated E2E build only
    emulatorCspPlugin(),

    // PWA Plugin
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.ico', 'apple-touch-icon.png', 'og-image.png'],
      manifest: {
        name: 'SpotHitch',
        short_name: 'SpotHitch',
        description: 'Trouvez les meilleurs spots d\'auto-stop dans le monde. 37 000+ spots dans 170 pays.',
        theme_color: '#f59e0b',
        background_color: '#0f1520',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-72.png', sizes: '72x72', type: 'image/png' },
          { src: 'icon-96.png', sizes: '96x96', type: 'image/png' },
          { src: 'icon-128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icon-144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icon-152.png', sizes: '152x152', type: 'image/png' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          {
            name: 'Add Spot',
            short_name: 'Add Spot',
            description: 'Share a new hitchhiking spot',
            url: '/?action=addspot',
            icons: [{ src: 'icon-96.png', sizes: '96x96', type: 'image/png' }]
          },
          {
            name: 'SOS',
            short_name: 'SOS',
            description: 'Emergency SOS mode',
            url: '/?action=sos',
            icons: [{ src: 'icon-96.png', sizes: '96x96', type: 'image/png' }]
          },
          {
            name: 'Trip Planner',
            short_name: 'Trip Planner',
            description: 'Plan a hitchhiking trip',
            url: '/?action=trip',
            icons: [{ src: 'icon-96.png', sizes: '96x96', type: 'image/png' }]
          },
          {
            name: 'My Profile',
            short_name: 'Profile',
            description: 'View your profile',
            url: '/?action=profile',
            icons: [{ src: 'icon-96.png', sizes: '96x96', type: 'image/png' }]
          }
        ],
        share_target: {
          action: '/?action=share',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        // No launch_handler: let Chrome use default behavior for share_target
        // (navigates to the share URL instead of focusing existing window)
        prefer_related_applications: false,
        handle_links: 'preferred',
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'SpotHitch - Carte des spots d\'autostop'
          },
          {
            src: 'screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'SpotHitch - Vue desktop'
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: null, // index.html handled by NetworkFirst runtime cache
        globPatterns: ['assets/index-*.js', 'assets/vendor-utils-*.js', 'assets/*.css', 'fonts/*.woff2'],
      globIgnores: ['**/*.map', '**/*legacy*', '**/gamification-*', '**/vendor-maplibre-*', '**/vendor-firebase-*', '**/vendor-sentry-*', '**/social-*', '**/guides-*', '**/admin-*'],
        navigateFallbackDenylist: [/^\/design-/, /^\/debug-/, /^\/guides\//],
        runtimeCaching: [
          {
            // index.html: ALWAYS try network first (1s timeout).
            // Prevents serving stale HTML that references old JS hashes after deploy.
            urlPattern: /^\/($|\?|index\.html)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-html',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 1,
            }
          },
          {
            // Local JS/CSS assets: network first so stale hashes don't break the app
            urlPattern: /\/assets\/.*\.(js|css)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              networkTimeoutSeconds: 5,
            }
          },
          {
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'openfreemap-tiles',
              expiration: { maxEntries: 500000, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/router\.project-osrm\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'osrm-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }
            }
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nominatim-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }
            }
          },
          {
            urlPattern: /^https:\/\/[a-z0-9-]+\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
        ]
      }
    }),
    
    // Legacy browser support — disabled: breaks MapLibre v5 web worker
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // }),
    
    // Sentry Source Maps (enable in production)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**'
      }
    })
  ].filter(Boolean),
  
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('maplibre-gl')) return 'vendor-maplibre'
          if (id.includes('firebase/') || id.includes('node_modules/firebase')) return 'vendor-firebase'
          if (id.includes('dompurify')) return 'vendor-utils'
          if (id.includes('/services/gamification') || id.includes('/services/quiz') ||
              id.includes('/services/teamChallenges') || id.includes('/services/friendChallenges') ||
              id.includes('/services/dailyReward') || id.includes('/services/nearbyFriends') ||
              id.includes('/services/profileCustomization')) return 'gamification'
          if (id.includes('/services/moderation')) return 'admin'
          if (id.includes('/data/guides')) return 'guides'
        }
      }
    },
    chunkSizeWarningLimit: 350
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  preview: {
    port: 4173
  },
  
  css: {},
  
  resolve: {
    alias: {}
  },

  optimizeDeps: {
    include: ['maplibre-gl', 'firebase/app', 'dompurify', 'lucide']
  }
});
