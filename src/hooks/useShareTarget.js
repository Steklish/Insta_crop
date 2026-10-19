import { useEffect, useState, useCallback } from 'react';

const MEDIA_CACHE = 'instacrop-shared-media';

export function useShareTarget({ onImageReceived }) {
  const [isCheckingShare, setIsCheckingShare] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

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

  // Check shared media from Service Worker Cache
  const checkSharedMedia = useCallback(async () => {
    if (!('caches' in window)) return false;

    try {
      setIsCheckingShare(true);
      const cache = await caches.open(MEDIA_CACHE);
      const response = await cache.match('shared-image');

      if (response) {
        const blob = await response.blob();
        const filename = decodeURIComponent(response.headers.get('x-filename') || 'shared-image.jpg');
        // Delete once retrieved
        await cache.delete('shared-image');

        if (blob && blob.size > 0 && onImageReceived) {
          onImageReceived(blob, filename);
          return true;
        }
      }
    } catch (err) {
      console.warn('[PWA] Error checking shared cache:', err);
    } finally {
      setIsCheckingShare(false);
    }
    return false;
  }, [onImageReceived]);

  useEffect(() => {
    // 1. Check if URL has ?shared=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared') === '1' || params.has('shared')) {
      // Clean query params from URL without refreshing
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      checkSharedMedia();
    } else {
      // Periodic or initial check
      checkSharedMedia();
    }

    // 2. Listen for SW messages
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'SHARED_IMAGE_AVAILABLE') {
        checkSharedMedia();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
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
