import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Header({
  onReset,
  hasImage,
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#3a3a3c] bg-[#1c1c1e]/90 backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Title & Version Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-[#e1e1e0] truncate">
                InstaCrop
              </h1>
              {/* Version Info Badge */}
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider rounded-md bg-[#2a2a2c] text-[#a9967f] border border-[#3a3a3c]">
                v2.2.0
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#e1e1e0]/60 leading-none mt-0.5 truncate hidden sm:block">
              Aesthetic Blurred Canvas & Aspect Ratio Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Reset / New Photo */}
          {hasImage && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#2a2a2c] hover:bg-[#F44336]/20 border border-[#3a3a3c] hover:border-[#F44336]/40 text-[#e1e1e0]/90 hover:text-[#F44336] text-[11px] sm:text-xs font-medium transition-all active:scale-95"
              title="Upload another photo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Photo</span>
              <span className="xs:hidden">New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
