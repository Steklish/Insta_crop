import React from 'react';
import { Download, Sparkles, Share2, RefreshCw, Smartphone } from 'lucide-react';

export default function Header({
  onReset,
  hasImage,
  isInstallable,
  onInstall,
  onOpenShareGuide,
  onOpenTrace,
  isStandalone,
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="./icon.svg"
            alt="InstaCrop Logo"
            className="w-9 h-9 rounded-xl shadow-md shadow-emerald-500/25 object-contain hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                InstaCrop
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                  Studio
                </span>
              </h1>
              {isStandalone && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5 hidden xs:block">
              Blurred Background & Aspect Canvas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Trace Diagnostics Button */}
          <button
            onClick={onOpenTrace}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm"
            title="Inspect Service Worker & Share Target event traces"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono">Trace</span>
          </button>

          {/* Android Gallery Guide Button */}
          <button
            onClick={onOpenShareGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm"
            title="How to share directly from Android Gallery"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Android Share</span>
          </button>

          {/* PWA Install Button */}
          {!isStandalone && (
            <button
              onClick={isInstallable ? onInstall : onOpenShareGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all ${
                isInstallable
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white'
              }`}
              title="Install InstaCrop as Android/Desktop app"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Install App</span>
            </button>
          )}

          {/* Reset / New Photo */}
          {hasImage && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/60 text-slate-400 hover:text-red-300 text-xs font-medium transition-all"
              title="Upload another photo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Photo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
