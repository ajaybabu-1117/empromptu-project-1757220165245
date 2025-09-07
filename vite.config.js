import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/empromptu-project-1757220165245/", // 👈 must match your repo name
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // local API only
        changeOrigin: true
      }
    }
  }
})
