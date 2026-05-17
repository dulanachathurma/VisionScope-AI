import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to Flask backend during development
    proxy: {
      '/detect': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    }
  }
})
