import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isGitHubPages = mode === 'production'
  return {
    plugins: [react()],
    base: isGitHubPages ? '/tldraw-maplibre-demo/' : '/'
  }
})