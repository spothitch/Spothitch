import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'mixpanel-browser': new URL('./tests/mocks/mixpanel.js', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.js',
        '**/*.d.ts',
        'scripts/',
        'src/main.js',
        'src/handlers/**',
        'src/services/autoUpdate.js',
        'src/services/firebase.js',
        'src/services/sentry.js',
        'src/utils/image.js',
        'src/utils/backButton.js',
        'src/components/modals/AddSpot.js',
        'src/components/views/social/Voyageurs.js',
        'src/services/proximityRadar.js',
        'src/services/travelBuddies.js',
      ],
      thresholds: {
        statements: 17,
        branches: 15,
        functions: 17,
        lines: 18,
      },
    },
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
  },
});
