import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite middleware to handle Web Share Target POST /share-target over LAN / HTTP
function shareTargetDevPlugin() {
  const handler = (req, res, next) => {
    if (req.method === 'POST' && req.url && req.url.includes('share-target')) {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const contentType = req.headers['content-type'] || '';
          let mime = 'image/jpeg';
          let base64Image = '';

          const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
          if (boundaryMatch) {
            const boundary = boundaryMatch[1] || boundaryMatch[2];
            const bodyStr = buffer.toString('binary');
            const parts = bodyStr.split('--' + boundary);

            for (const part of parts) {
              if (part.includes('filename=') || part.includes('Content-Type: image/')) {
                const headerEnd = part.indexOf('\r\n\r\n');
                if (headerEnd !== -1) {
                  const headers = part.slice(0, headerEnd);
                  const mimeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
                  if (mimeMatch) mime = mimeMatch[1].trim();

                  // Find end of file content (boundary delimiter)
                  const lastCrlf = part.lastIndexOf('\r\n');
                  const fileData = part.slice(headerEnd + 4, lastCrlf !== -1 ? lastCrlf : undefined);
                  base64Image = Buffer.from(fileData, 'binary').toString('base64');
                  break;
                }
              }
            }
          }

          // Return an HTML bridge page that writes the image to IndexedDB and redirects to the app
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Loading Shared Photo...</title>
              <style>
                body {
                  margin: 0;
                  background: #0b0f19;
                  color: #e2e8f0;
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  text-align: center;
                  padding: 20px;
                }
                .spinner {
                  width: 48px;
                  height: 48px;
                  border: 4px solid rgba(99, 102, 241, 0.2);
                  border-top-color: #6366f1;
                  border-radius: 50%;
                  animation: spin 0.8s linear infinite;
                  margin-bottom: 16px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
              </style>
            </head>
            <body>
              <div class="spinner"></div>
              <h2>Loading shared photo into InstaCrop...</h2>
              <p style="color: #94a3b8; font-size: 13px;">Please wait a moment</p>
              <script>
                (async () => {
                  try {
                    const b64 = "${base64Image}";
                    const mime = "${mime}";
                    if (b64) {
                      const res = await fetch("data:" + mime + ";base64," + b64);
                      const blob = await res.blob();

                      const openReq = indexedDB.open('instacrop-share-db', 1);
                      openReq.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains('shared-media-store')) {
                          db.createObjectStore('shared-media-store', { keyPath: 'id' });
                        }
                      };

                      openReq.onsuccess = (e) => {
                        const db = e.target.result;
                        const tx = db.transaction('shared-media-store', 'readwrite');
                        tx.objectStore('shared-media-store').put({
                          id: 'latest-shared-image',
                          file: blob,
                          name: 'shared-image.jpg',
                          type: mime,
                          timestamp: Date.now()
                        });
                        tx.oncomplete = () => {
                          window.location.replace('./?shared=1');
                        };
                      };
                      openReq.onerror = () => window.location.replace('./');
                    } else {
                      window.location.replace('./');
                    }
                  } catch (e) {
                    console.error(e);
                    window.location.replace('./');
                  }
                })();
              </script>
            </body>
            </html>
          `);
          return;
        } catch (err) {
          console.error('[ShareTarget Dev Middleware] Error:', err);
          res.writeHead(302, { Location: './' });
          res.end();
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'share-target-dev-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: true, // Listen on all network addresses (0.0.0.0)
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    tailwindcss(),
    shareTargetDevPlugin(),
  ],
})
