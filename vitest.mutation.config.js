import { defineConfig } from 'vitest/config'

// Focused test set for mutation testing (StrykerJS, LOCAL only — RULE #22).
// The default config runs 5300+ tests, so Stryker's dry-run alone takes minutes.
// This standalone config includes ONLY the unit tests that cover the critical
// mutated modules (parser, sanitize, geo, firebaseUtils, spotFreshness), so the
// dry-run is fast and a focused mutation pass is actually runnable locally.
export default defineConfig({
  resolve: {
    alias: {
      'mixpanel-browser': new URL('./tests/mocks/mixpanel.js', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'],
    include: [
      'tests/unit/property-based.test.js',
      'tests/unit/mapsUrlParser.test.js',
      'tests/utils/deeplink.test.js',
      'tests/spotFreshness.test.js',
      'tests/osrm.test.js',
    ],
  },
})
