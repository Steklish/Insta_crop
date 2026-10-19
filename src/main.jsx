import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for PWA & Android Share Target
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      let path = window.location.pathname;
      if (!path.endsWith('/')) {
        if (path.includes('.')) {
          path = path.slice(0, path.lastIndexOf('/') + 1);
        } else {
          path = path + '/';
        }
      }
      const swUrl = new URL('sw.js', window.location.origin + path).href;
      const scopeUrl = window.location.origin + path;

      navigator.serviceWorker
        .register(swUrl, { scope: scopeUrl })
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
          reg.update();
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    } catch (e) {
      console.warn('[PWA] SW registration exception:', e);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
