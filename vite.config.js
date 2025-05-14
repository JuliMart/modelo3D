// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // 🔁 Importante si usás rutas relativas para assets (como .glb)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',     // Está bien dejarlo si también desarrollás local
    port: 8080,          // Render lo ignora en producción
    strictPort: true,
  }
});
