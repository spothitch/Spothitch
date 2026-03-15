import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [tailwindcss()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3001,
  },
})
