import React from 'react';
import { X, Share2, Download, Smartphone, CheckCircle, ExternalLink, Image } from 'lucide-react';

export default function AndroidShareModal({ isOpen, onClose, onInstall, isInstallable }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#2a2a2c] border border-[#3a3a3c] rounded-2xl shadow-2xl p-6 text-[#e1e1e0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3c]">
          <div className="flex items-center gap-3">
            <img
              src="./icon.svg"
              alt="InstaCrop Logo"
              className="w-10 h-10 rounded-xl shadow-lg shadow-black/30 object-contain"
            />
            <div>
              <h3 className="text-lg font-bold text-[#e1e1e0]">Android Gallery Direct Share</h3>
              <p className="text-xs text-[#a0a0a0]">Share photos into InstaCrop without manual uploads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a0a0a0] hover:text-[#e1e1e0] hover:bg-[#3a3a3c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-5 space-y-4 text-sm">
          <div className="flex items-start gap-3.5 bg-[#1c1c1e] p-3.5 rounded-xl border border-[#3a3a3c]">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#a9967f]/20 text-[#a9967f] font-bold flex items-center justify-center text-xs border border-[#a9967f]/30">
              1
            </div>
            <div>
              <h4 className="font-semibold text-[#e1e1e0]">Install InstaCrop to Home Screen</h4>
              <p className="text-xs text-[#a0a0a0] mt-0.5">
                Open this website in <strong>Chrome</strong> or <strong>Samsung Internet</strong>, tap the menu (⋮) and tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
              </p>
              {isInstallable && (
                <button
                  onClick={onInstall}
                  className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#a9967f] hover:bg-[#7b7061] text-[#1c1c1e] text-xs font-bold shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App Now
                </button>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#1c1c1e] p-3.5 rounded-xl border border-[#3a3a3c]">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#a9967f]/20 text-[#a9967f] font-bold flex items-center justify-center text-xs border border-[#a9967f]/30">
              2
            </div>
            <div>
              <h4 className="font-semibold text-[#e1e1e0]">Open Samsung Gallery or Google Photos</h4>
              <p className="text-xs text-[#a0a0a0] mt-0.5">
                Select any photo you want to format for Instagram Feed, Stories, or Reels, then tap the system <strong>Share</strong> button.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#1c1c1e] p-3.5 rounded-xl border border-[#3a3a3c]">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#a9967f]/20 text-[#a9967f] font-bold flex items-center justify-center text-xs border border-[#a9967f]/30">
              3
            </div>
            <div>
              <h4 className="font-semibold text-[#e1e1e0]">Select InstaCrop from the Share Sheet</h4>
              <p className="text-xs text-[#a0a0a0] mt-0.5">
                InstaCrop appears directly in your Android share sheet. Tapping it opens the app with your picture already loaded with blurred background padding!
              </p>
            </div>
          </div>
        </div>

        {/* Pro-Tip */}
        <div className="bg-[#252526] border border-[#3a3a3c] rounded-xl p-3 text-xs text-[#e1e1e0] flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 flex-shrink-0 text-[#a9967f]" />
          <span>
            Works 100% offline once installed. Powered by the W3C Web Share Target API & HTML5 Canvas.
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#3a3a3c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3a3a3c] hover:bg-[#4a4a4c] text-[#e1e1e0] text-xs font-semibold transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
