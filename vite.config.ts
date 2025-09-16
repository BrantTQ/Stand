import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api/analytics": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/analytics": {
        target: "http://localhost:4000",
        changeOrigin: true,     
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Put heavy deps in their own chunks
          "framer-motion": ["framer-motion"],
          "react-vendors": ["react", "react-dom"],
        },
      },
    },
  },
})
