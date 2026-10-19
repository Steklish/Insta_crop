import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Trash2, Play } from 'lucide-react';
import { getTraces, clearTraces, addTrace } from '../utils/tracer';
import { getSharedFile, setSharedFile } from '../utils/idb';

export default function TraceModal({ isOpen, onClose, onSimulateShare }) {
  const [logs, setLogs] = useState([]);
  const [swInfo, setSwInfo] = useState({
    supported: false,
    controller: false,
    scope: 'none',
  });
  const [storedItem, setStoredItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    // 1. SW info
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      setSwInfo({
        supported: true,
        controller: Boolean(navigator.serviceWorker.controller),
        scope: reg ? reg.scope : 'Not registered yet',
      });
    }

    // 2. Traces
    const traces = await getTraces();
    setLogs(traces);

    // 3. Stored shared item
    try {
      const item = await getSharedFile(false); // don't delete on inspect
      setStoredItem(item);
    } catch (e) {
      setStoredItem(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleClear = async () => {
    await clearTraces();
    setLogs([]);
  };

  const handleSimulate = async () => {
    // Generate a test dummy blob and store it to test the pipeline
    addTrace('SIMULATOR', 'Testing local share-target simulation');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Test Shared Image', 90, 200);

    canvas.toBlob(async (blob) => {
      if (blob) {
        await setSharedFile(blob);
        addTrace('SIMULATOR', 'Wrote test blob to IndexedDB, triggering receiver');
        if (onSimulateShare) {
          onSimulateShare(blob, 'simulated-photo.png');
        }
        fetchStatus();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Share Target Trace & Diagnostics
              </h3>
              <p className="text-[11px] text-slate-400">Live inspection of Service Worker & Android share events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Health Status */}
        <div className="py-3 space-y-2 text-xs border-b border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">SW Controller:</span>
              <span className={`font-bold flex items-center gap-1 ${swInfo.controller ? 'text-emerald-400' : 'text-amber-400'}`}>
                {swInfo.controller ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {swInfo.controller ? 'Active (Intercepting)' : 'Not Controlling'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Pending IDB Photo:</span>
              <span className="font-bold text-indigo-300 truncate max-w-[120px]">
                {storedItem ? `${Math.round(storedItem.file.size / 1024)} KB` : 'None (Empty)'}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono truncate">
            <span className="text-slate-500">Scope:</span> {swInfo.scope}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between py-2 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={handleSimulate}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Simulate Share Event</span>
          </button>
        </div>

        {/* Live Trace Terminal Box */}
        <div className="flex-1 min-h-[200px] overflow-y-auto bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] space-y-1.5">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              No trace events recorded yet. Share a photo from Samsung Gallery or tap "Simulate Share Event" to view live logs.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="leading-tight flex items-start gap-2">
                <span className="text-slate-500 flex-shrink-0">[{log.time}]</span>
                <span
                  className={`px-1 rounded text-[9px] font-bold flex-shrink-0 ${
                    log.source === 'SW'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  }`}
                >
                  {log.source}
                </span>
                <span className={log.message.includes('ERROR') ? 'text-red-400 font-bold' : log.message.includes('WARNING') ? 'text-amber-300' : 'text-slate-300'}>
                  {log.message}
                  {log.details && <span className="text-indigo-400 block ml-2">{log.details}</span>}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
