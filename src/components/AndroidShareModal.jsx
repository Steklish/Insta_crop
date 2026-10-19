import React from 'react';
import { X, Share2, Download, Smartphone, CheckCircle, ExternalLink, Image } from 'lucide-react';

export default function AndroidShareModal({ isOpen, onClose, onInstall, isInstallable }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Android Gallery Direct Share</h3>
              <p className="text-xs text-slate-400">Share photos into InstaCrop without manual uploads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-5 space-y-4 text-sm">
          <div className="flex items-start gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
              1
            </div>
            <div>
              <h4 className="font-semibold text-white">Install InstaCrop to Home Screen</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Open this website in <strong>Chrome</strong> or <strong>Samsung Internet</strong>, tap the menu (⋮) and tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
              </p>
              {isInstallable && (
                <button
                  onClick={onInstall}
                  className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App Now
                </button>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-600/30 text-purple-400 font-bold flex items-center justify-center text-xs border border-purple-500/30">
              2
            </div>
            <div>
              <h4 className="font-semibold text-white">Open Samsung Gallery or Google Photos</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any photo you want to format for Instagram Feed, Stories, or Reels, then tap the system <strong>Share</strong> button.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center text-xs border border-pink-500/30">
              3
            </div>
            <div>
              <h4 className="font-semibold text-white">Select InstaCrop from the Share Sheet</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                InstaCrop appears directly in your Android share sheet. Tapping it opens the app with your picture already loaded with blurred background padding!
              </p>
            </div>
          </div>
        </div>

        {/* Pro-Tip */}
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3 text-xs text-indigo-200/90 flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 flex-shrink-0 text-indigo-400" />
          <span>
            Works 100% offline once installed. Powered by the W3C Web Share Target API & HTML5 Canvas.
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
