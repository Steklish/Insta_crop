import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { SAMPLE_IMAGES } from '../constants/presets';

export default function EmptyState({ onFileSelect, onSampleSelect, isCheckingShare }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center max-w-xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>No More Cropping Out Photo Edges</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Fit Any Photo onto <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Any Canvas</span>
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-400">
          Transform pictures into aesthetic Instagram 4:5 portraits, 1:1 squares, or 9:16 reels with matching blurred backgrounds in seconds.
        </p>
      </div>

      {/* Main Upload Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-2xl relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-950/50">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {isDragging ? 'Drop photo here to format' : 'Select or drop an image here'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supports JPEG, PNG, WebP, HEIC/AVIF up to high-resolution camera files
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Browse Photos</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/80 transition-all"
            >
              <Camera className="w-4 h-4 text-pink-400" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Demo Samples */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or test with sample images:
          </span>
          <span className="text-[11px] text-slate-500">Instant 1-Click Load</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SAMPLE_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSampleSelect(sample.url)}
              className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/80 transition-all text-left bg-slate-900 shadow-sm"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={sample.thumb}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-slate-300 truncate group-hover:text-indigo-300">
                  {sample.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-12 pt-8 border-t border-slate-800/80">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Android Share Sheet</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Directly share from Samsung Gallery or Google Photos via Web Share Target.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Lossless Canvas Processing</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instant hardware-accelerated HTML5 Canvas with adjustable blur and tints.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">100% Private & In-Browser</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your photos never leave your device. Works fully offline as a PWA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
