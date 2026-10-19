// InstaCrop Service Worker with robust IndexedDB + Cache storage for Web Share Target

const CACHE_NAME = 'instacrop-cache-v2';
const DB_NAME = 'instacrop-share-db';
const DB_VERSION = 1;
const STORE_NAME = 'shared-media-store';

// Inline IndexedDB helper for Service Worker environment
function saveFileToIndexedDB(file) {
  return new Promise((resolve, reject) => {
    try {
      if (!self.indexedDB) {
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
        putReq.onsuccess = () => resolve(true);
        putReq.onerror = () => resolve(false);
      };

      request.onerror = () => resolve(false);
    } catch (err) {
      console.warn('[SW IDB] Error saving:', err);
      resolve(false);
    }
  });
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept Android Web Share Target POST multipart upload
  if (event.request.method === 'POST' && url.pathname.includes('share-target')) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          let imageFile = null;

          // Find file in formData entries
          for (const [key, value] of formData.entries()) {
            if (value && typeof value === 'object' && (value instanceof File || value instanceof Blob || value.size > 0)) {
              imageFile = value;
              break;
            }
          }

          // Fallback to known field names
          if (!imageFile) {
            imageFile = formData.get('image') || formData.get('file') || formData.get('media');
          }

          if (imageFile && imageFile.size > 0) {
            // A. Save to IndexedDB (primary & most reliable for Blobs on Android)
            await saveFileToIndexedDB(imageFile);

            // B. Also save to Cache with valid full URL
            try {
              const cache = await caches.open('instacrop-shared-media');
              const cacheUrl = new URL('shared-media-file', self.registration.scope).href;
              const headers = new Headers();
              headers.set('content-type', imageFile.type || 'image/jpeg');
              headers.set('x-filename', encodeURIComponent(imageFile.name || 'shared-image.jpg'));
              headers.set('x-timestamp', Date.now().toString());
              await cache.put(cacheUrl, new Response(imageFile, { headers }));
            } catch (cacheErr) {
              console.warn('[SW Cache] Cache fallback skipped:', cacheErr);
            }

            // C. Broadcast notification to active tabs
            try {
              if (typeof BroadcastChannel !== 'undefined') {
                const bc = new BroadcastChannel('instacrop-share-channel');
                bc.postMessage({ type: 'SHARED_IMAGE_AVAILABLE', timestamp: Date.now() });
                bc.close();
              }
            } catch (bcErr) {
              // ignore
            }

            const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            for (const client of allClients) {
              client.postMessage({ type: 'SHARED_IMAGE_AVAILABLE', timestamp: Date.now() });
            }
          }
        } catch (err) {
          console.error('[SW] Error processing share_target upload:', err);
        }

        // Ensure redirect stays inside repository scope on GitHub Pages
        const scope = self.registration.scope.endsWith('/')
          ? self.registration.scope
          : self.registration.scope + '/';
        const redirectUrl = new URL('?shared=1&t=' + Date.now(), scope).href;
        return Response.redirect(redirectUrl, 303);
      })()
    );
    return;
  }

  // 2. Offline caching strategy for static resources
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
            if (cachedResponse) {
              return cachedResponse;
            }
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
