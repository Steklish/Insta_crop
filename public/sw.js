// InstaCrop Service Worker with Live Tracing & IndexedDB Storage
const CACHE_NAME = 'instacrop-cache-v3';
const DB_NAME = 'instacrop-share-db';
const DB_VERSION = 1;
const STORE_NAME = 'shared-media-store';

const TRACE_DB = 'instacrop-trace-db';
const TRACE_STORE = 'logs';

// Helper to write trace logs visible in the in-app Diagnostics Panel
function traceLog(msg, details) {
  try {
    if (self.indexedDB) {
      const req = self.indexedDB.open(TRACE_DB, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(TRACE_STORE)) {
          db.createObjectStore(TRACE_STORE, { autoIncrement: true });
        }
      };
      req.onsuccess = (e) => {
        try {
          const db = e.target.result;
          const tx = db.transaction(TRACE_STORE, 'readwrite');
          tx.objectStore(TRACE_STORE).add({
            time: new Date().toLocaleTimeString(),
            source: 'SW',
            message: msg,
            details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null
          });
        } catch (err) {}
      };
    }
  } catch (e) {}
  console.log('[SW Trace]', msg, details || '');
}

// Inline IndexedDB helper for Service Worker environment
function saveFileToIndexedDB(file) {
  return new Promise((resolve) => {
    try {
      if (!self.indexedDB) {
        traceLog('IndexedDB not available in self');
        resolve(false);
        return;
      }
      const request = self.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (e) => {
        try {
          const db = e.target.result;
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);

          const record = {
            id: 'latest-shared-image',
            file: file,
            name: file.name || 'shared-image.jpg',
            type: file.type || 'image/jpeg',
            timestamp: Date.now(),
          };

          const putReq = store.put(record);
          putReq.onsuccess = () => {
            traceLog('Saved image to IndexedDB', { name: record.name, size: file.size, type: file.type });
            resolve(true);
          };
          putReq.onerror = (err) => {
            traceLog('IndexedDB store.put error', err);
            resolve(false);
          };
        } catch (txErr) {
          traceLog('Transaction error', txErr.message);
          resolve(false);
        }
      };

      request.onerror = (err) => {
        traceLog('IndexedDB open error', err);
        resolve(false);
      };
    } catch (err) {
      traceLog('saveFileToIndexedDB exception', err.message);
      resolve(false);
    }
  });
}

self.addEventListener('install', (event) => {
  traceLog('Service Worker installed (v3)');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  traceLog('Service Worker activated, claiming clients');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept Web Share Target (POST or GET to /share-target)
  if (url.pathname.includes('share-target')) {
    traceLog(`Intercepted share-target request: ${event.request.method} ${url.pathname}`);

    event.respondWith(
      (async () => {
        try {
          let imageFile = null;

          if (event.request.method === 'POST') {
            traceLog('Parsing incoming POST multipart/form-data...');
            const formData = await event.request.formData();
            
            const keysFound = [];
            for (const [key, value] of formData.entries()) {
              const isObj = value && typeof value === 'object';
              const hasSize = isObj && typeof value.size === 'number' && value.size > 0;
              keysFound.push(`${key}: (size=${hasSize ? value.size : 0})`);

              if (!imageFile && hasSize) {
                imageFile = value;
              }
            }
            traceLog('FormData entries inspected', keysFound);

            // Fallback key lookups
            if (!imageFile) {
              imageFile = formData.get('image') || formData.get('file') || formData.get('media');
            }
          }

          if (imageFile) {
            traceLog('Image file detected in share target', {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type
            });

            // Save to IndexedDB
            await saveFileToIndexedDB(imageFile);

            // Also save to Cache with full valid URL
            try {
              const cache = await caches.open('instacrop-shared-media');
              const cacheUrl = new URL('shared-media-file', self.registration.scope).href;
              const headers = new Headers();
              headers.set('content-type', imageFile.type || 'image/jpeg');
              headers.set('x-filename', encodeURIComponent(imageFile.name || 'shared-image.jpg'));
              headers.set('x-timestamp', Date.now().toString());
              await cache.put(cacheUrl, new Response(imageFile, { headers }));
              traceLog('Also saved copy to Cache Storage', cacheUrl);
            } catch (cacheErr) {
              traceLog('Cache Storage fallback skipped', cacheErr.message);
            }

            // Notify open clients
            try {
              if (typeof BroadcastChannel !== 'undefined') {
                const bc = new BroadcastChannel('instacrop-share-channel');
                bc.postMessage({ type: 'SHARED_IMAGE_AVAILABLE', timestamp: Date.now() });
                bc.close();
              }
            } catch (e) {}

            const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            for (const client of allClients) {
              client.postMessage({ type: 'SHARED_IMAGE_AVAILABLE', timestamp: Date.now() });
            }
          } else {
            traceLog('WARNING: No image file found in share target request payload');
          }
        } catch (err) {
          traceLog('ERROR in share_target fetch handler', { message: err.message, stack: err.stack });
        }

        // Redirect back into repository scope
        const scope = self.registration.scope.endsWith('/')
          ? self.registration.scope
          : self.registration.scope + '/';
        const redirectUrl = new URL('?shared=1&t=' + Date.now(), scope).href;
        traceLog('Redirecting to app URL', redirectUrl);
        return Response.redirect(redirectUrl, 303);
      })()
    );
    return;
  }

  // 2. Offline caching for app shell
  if (event.request.method === 'GET' && url.protocol.startsWith('http')) {
    if (url.origin === self.location.origin) {
      event.respondWith(
        (async () => {
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (err) {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) return cachedResponse;
            if (event.request.mode === 'navigate') {
              const indexFallback = await caches.match('./') || await caches.match('./index.html');
              if (indexFallback) return indexFallback;
            }
            throw err;
          }
        })()
      );
    }
  }
});
