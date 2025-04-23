// vite.config.js
export default {
  server: {
    host: '0.0.0.0',              // Permite acceso desde otras IPs
    port: 8080,                   // Puerto que ngrok está exponiendo
    allowedHosts: 'all',         // ✅ Acepta subdominios como los de ngrok
    strictPort: true,
    cors: true,
  }
}
