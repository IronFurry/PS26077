import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function ttsProxyPlugin() {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/tts')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const tl = urlObj.searchParams.get('tl') || 'en';
            const q = urlObj.searchParams.get('q') || '';
            const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob&q=${encodeURIComponent(q)}`;
            
            const response = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
              }
            });

            if (!response.ok) {
              res.statusCode = response.status;
              return res.end();
            }

            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            const arrayBuffer = await response.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            console.error('TTS Proxy Error:', err);
            res.statusCode = 500;
            res.end();
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
})

