/**
 * InstaCrop Diagnostic & Trace Logger
 * Records logs into IndexedDB accessible by both Service Worker and Window
 */

const TRACE_DB = 'instacrop-trace-db';
const TRACE_STORE = 'logs';

function openTraceDB() {
  return new Promise((resolve) => {
    try {
      const idb = typeof indexedDB !== 'undefined' ? indexedDB : (typeof self !== 'undefined' ? self.indexedDB : null);
      if (!idb) return resolve(null);

      const req = idb.open(TRACE_DB, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(TRACE_STORE)) {
          db.createObjectStore(TRACE_STORE, { autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function addTrace(source, message, details = null) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = {
    time: timestamp,
    source, // 'SW' | 'APP' | 'SYSTEM'
    message,
    details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null,
  };

  try {
    const db = await openTraceDB();
    if (db) {
      const tx = db.transaction(TRACE_STORE, 'readwrite');
      tx.objectStore(TRACE_STORE).add(entry);
    }
  } catch (e) {
    // ignore
  }

  // Also log to console
  console.log(`[${entry.source}] ${entry.message}`, details || '');
}

export async function getTraces() {
  try {
    const db = await openTraceDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(TRACE_STORE, 'readonly');
      const store = tx.objectStore(TRACE_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        resolve(results.slice(-50)); // Last 50 logs
      };
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
}

export async function clearTraces() {
  try {
    const db = await openTraceDB();
    if (db) {
      const tx = db.transaction(TRACE_STORE, 'readwrite');
      tx.objectStore(TRACE_STORE).clear();
    }
  } catch (e) {
    // ignore
  }
}
