import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/myfcd': {
        target: 'https://myfcd.moh.gov.my',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myfcd/, ''),
      }
    }
  }
})
