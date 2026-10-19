import React from 'react';
import { Download, Sparkles, RefreshCw, Smartphone, Layers } from 'lucide-react';

export default function Header({
  onReset,
  hasImage,
  isInstallable,
  onInstall,
  onOpenShareGuide,
  isStandalone,
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#3a3a3c] bg-[#1c1c1e]/90 backdrop-blur-md px-3 sm:px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo, Title & Version Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="./icon.svg"
            alt="InstaCrop Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md object-contain transition-transform hover:scale-105 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-[#e1e1e0] truncate">
                InstaCrop
              </h1>
              {/* Version Info Badge */}
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-md bg-[#2a2a2c] text-[#a9967f] border border-[#3a3a3c]">
                v2.2.0
              </span>
              {isStandalone && (
                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#71b34f]/20 text-[#71b34f] border border-[#71b34f]/30">
                  PWA
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#e1e1e0]/60 leading-none mt-0.5 truncate hidden sm:block">
              Aesthetic Blurred Canvas & Aspect Ratio Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Android Gallery Guide Button */}
          <button
            onClick={onOpenShareGuide}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-[#2a2a2c] hover:bg-[#4a4a4c] border border-[#3a3a3c] text-[#e1e1e0] text-xs font-medium transition-all shadow-sm active:scale-95"
            title="How to share directly from Android Gallery"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#a9967f]" />
            <span className="hidden xs:inline">Share Guide</span>
          </button>

          {/* PWA Install Button */}
          {!isStandalone && (
            <button
              onClick={isInstallable ? onInstall : onOpenShareGuide}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                isInstallable
                  ? 'bg-[#a9967f] hover:bg-[#7b7061] text-[#1c1c1e] shadow-[#a9967f]/20'
                  : 'bg-[#2a2a2c] hover:bg-[#4a4a4c] border border-[#3a3a3c] text-[#e1e1e0]'
              }`}
              title="Install InstaCrop as mobile/desktop app"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          {/* Reset / New Photo */}
          {hasImage && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#2a2a2c] hover:bg-[#F44336]/20 border border-[#3a3a3c] hover:border-[#F44336]/40 text-[#e1e1e0]/80 hover:text-[#F44336] text-xs font-medium transition-all active:scale-95"
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
