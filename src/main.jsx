import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for PWA & Android Share Target
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const swUrl = new URL('sw.js', window.location.href).href;
      navigator.serviceWorker
        .register(swUrl)
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
