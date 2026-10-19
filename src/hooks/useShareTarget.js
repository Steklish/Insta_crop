import { useEffect, useState, useCallback, useRef } from 'react';
import { getSharedFile } from '../utils/idb';

const MEDIA_CACHE = 'instacrop-shared-media';

export function useShareTarget({ onImageReceived }) {
  const [isCheckingShare, setIsCheckingShare] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Keep a ref to the callback so listeners always use latest version
  const onImageReceivedRef = useRef(onImageReceived);
  useEffect(() => {
    onImageReceivedRef.current = onImageReceived;
  }, [onImageReceived]);

  // Check if running as installed standalone PWA
  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(Boolean(isStandaloneMode));
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPwa = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
    return outcome === 'accepted';
  }, [deferredPrompt]);

  // Check shared media from IndexedDB (primary) or Cache API (fallback)
  const checkSharedMedia = useCallback(async () => {
    setIsCheckingShare(true);
    let handled = false;

    // 1. Primary Method: Check IndexedDB
    try {
      const record = await getSharedFile(true);
      if (record && record.file && record.file.size > 0) {
        if (onImageReceivedRef.current) {
          onImageReceivedRef.current(record.file, record.name || 'shared-image.jpg');
          handled = true;
        }
      }
    } catch (idbErr) {
      console.warn('[ShareTarget] IndexedDB check failed, trying Cache fallback:', idbErr);
    }

    // 2. Secondary Method: Check Cache Storage API
    if (!handled && 'caches' in window) {
      try {
        const cache = await caches.open(MEDIA_CACHE);
        const keys = await cache.keys();
        for (const req of keys) {
          const res = await cache.match(req);
          if (res) {
            const blob = await res.blob();
            const filename = decodeURIComponent(res.headers.get('x-filename') || 'shared-image.jpg');
            await cache.delete(req);
            if (blob && blob.size > 0 && onImageReceivedRef.current) {
              onImageReceivedRef.current(blob, filename);
              handled = true;
              break;
            }
          }
        }
      } catch (cacheErr) {
        console.warn('[ShareTarget] Cache fallback failed:', cacheErr);
      }
    }

    setIsCheckingShare(false);
    return handled;
  }, []);

  useEffect(() => {
    // 1. Initial check on mount
    checkSharedMedia();

    // If URL has ?shared=1, check and clean URL afterwards
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared') === '1' || params.has('shared')) {
      // Small timeout to allow SW IndexedDB write to complete if needed
      setTimeout(() => checkSharedMedia(), 100);
      setTimeout(() => checkSharedMedia(), 400);

      // Clean query params while preserving repository trailing slash
      const cleanUrl = window.location.pathname.endsWith('/')
        ? window.location.pathname
        : window.location.pathname + '/';
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 2. Listen to BroadcastChannel
    let bc = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('instacrop-share-channel');
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'SHARED_IMAGE_AVAILABLE') {
            checkSharedMedia();
          }
        };
      }
    } catch (e) {
      // ignore
    }

    // 3. Listen for Service Worker postMessage
    const handleSwMessage = (event) => {
      if (event.data && event.data.type === 'SHARED_IMAGE_AVAILABLE') {
        checkSharedMedia();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    // 4. Listen for visibility changes (when user switches back from Gallery to PWA)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSharedMedia();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (bc) bc.close();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkSharedMedia]);

  return {
    isCheckingShare,
    isInstallable,
    isStandalone,
    installPwa,
    checkSharedMedia,
  };
}
