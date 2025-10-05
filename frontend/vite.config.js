import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar React y React-DOM en su propio chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor'
          }
          // Separar Three.js y relacionados en su propio chunk
          if (id.includes('node_modules/three') || 
              id.includes('node_modules/@react-three')) {
            return 'three-vendor'
          }
          // Separar OpenSeadragon si se usa
          if (id.includes('node_modules/openseadragon')) {
            return 'openseadragon-vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar el límite a 1000 kB para evitar warnings de los modelos 3D
  },
  server: {
    // Proxy API and uploads requests to the backend during development
    proxy: {
      // Frontend calls /api/images/:planet -> proxy to backend /images/:planet
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy uploads (tiles and dzi) to backend static uploads folder
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
