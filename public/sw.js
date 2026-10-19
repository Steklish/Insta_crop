const CACHE_NAME = 'instacrop-cache-v1';
const MEDIA_CACHE = 'instacrop-shared-media';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear old caches if version changes
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== MEDIA_CACHE)
          .map((name) => caches.delete(name))
      );
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
          // Extract file parameter specified in manifest.json ("image")
          const imageFile = formData.get('image') || formData.get('media') || formData.get('file');

          if (imageFile && imageFile.size > 0) {
            const cache = await caches.open(MEDIA_CACHE);
            const headers = new Headers();
            headers.set('content-type', imageFile.type || 'image/jpeg');
            headers.set('x-filename', encodeURIComponent(imageFile.name || 'shared-image.jpg'));
            headers.set('x-timestamp', Date.now().toString());

            await cache.put('shared-image', new Response(imageFile, { headers }));

            // Notify any already open client tabs
            const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            for (const client of allClients) {
              client.postMessage({ type: 'SHARED_IMAGE_AVAILABLE' });
            }
          }
        } catch (err) {
          console.error('[SW] Failed to process share_target upload:', err);
        }

        // Redirect back into the app with a query param signaling new shared content
        const redirectUrl = new URL('./?shared=1&t=' + Date.now(), self.registration.scope).href;
        return Response.redirect(redirectUrl, 303);
      })()
    );
    return;
  }

  // 2. Offline caching strategy for static resources & app shell
  if (event.request.method === 'GET' && url.protocol.startsWith('http')) {
    // Avoid caching large cross-origin media
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
