/**
 * Lightweight, zero-dependency IndexedDB helper for Web Share Target
 * Compatible with both Window and ServiceWorker environments
 */

const DB_NAME = 'instacrop-share-db';
const DB_VERSION = 1;
const STORE_NAME = 'shared-media-store';

function openDB() {
  return new Promise((resolve, reject) => {
    const idb = typeof indexedDB !== 'undefined' ? indexedDB : (typeof self !== 'undefined' ? self.indexedDB : null);
    if (!idb) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a shared file/blob to IndexedDB
 */
export async function setSharedFile(file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Save as record
    const record = {
      id: 'latest-shared-image',
      file: file,
      name: file.name || 'shared-image.jpg',
      type: file.type || 'image/jpeg',
      timestamp: Date.now(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve the latest shared file from IndexedDB and optionally delete it
 */
export async function getSharedFile(deleteAfter = true) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, deleteAfter ? 'readwrite' : 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get('latest-shared-image');

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.file) {
          if (deleteAfter) {
            store.delete('latest-shared-image');
          }
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IDB] Failed to get shared file:', err);
    return null;
  }
}

/**
 * Clear any pending shared files
 */
export async function clearSharedFile() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('latest-shared-image');
  } catch (err) {
    // ignore
  }
}
