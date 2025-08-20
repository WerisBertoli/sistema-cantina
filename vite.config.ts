import { fileURLToPath, URL } from 'node:url'

import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

// Plugin para corrigir problemas de SPA fallback no Vite
const spaFallbackFix = (): Plugin => {
  return {
    name: 'spa-fallback-fix',
    apply: 'serve' as const,
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Log para debug
        console.log(`[SPA Fallback] Request: ${req.method} ${req.url}`);
        
        // Se for uma requisição para um arquivo estático, deixa passar
        if (req.url?.includes('.') && !req.url.includes('.html')) {
          return next();
        }
        
        // Se for uma rota da aplicação (não é arquivo estático)
        if (req.method === 'GET' && req.url && !req.url.startsWith('/src/') && !req.url.startsWith('/@') && !req.url.includes('__vite')) {
          // Para qualquer rota que não seja arquivo estático, serve o index.html
          req.url = '/index.html';
          console.log(`[SPA Fallback] Redirecting to index.html`);
        }
        
        next();
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    spaFallbackFix(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Configurações adicionais para melhor compatibilidade
    strictPort: true,
    cors: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
