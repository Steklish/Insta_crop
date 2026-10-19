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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a9967f]/15 border border-[#a9967f]/30 text-[#a9967f] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>No More Cropping Out Photo Edges</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#e1e1e0]">
          Fit Any Photo onto <span className="bg-gradient-to-r from-[#a9967f] via-[#e1e1e0] to-[#7b7061] bg-clip-text text-transparent">Any Canvas</span>
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-[#a0a0a0]">
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
            ? 'border-[#a9967f] bg-[#a9967f]/10 scale-[1.01]'
            : 'border-[#3a3a3c] bg-[#252526] hover:border-[#a9967f]/60 hover:bg-[#2a2a2c]'
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#2a2a2c] border border-[#a9967f]/30 flex items-center justify-center text-[#a9967f] shadow-xl shadow-black/40">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#e1e1e0]">
              {isDragging ? 'Drop photo here to format' : 'Select or drop an image here'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a0a0a0] mt-1">
              Supports JPEG, PNG, WebP, HEIC/AVIF up to high-resolution camera files
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a9967f] hover:bg-[#7b7061] text-[#1c1c1e] text-xs sm:text-sm font-bold shadow-lg shadow-[#a9967f]/20 transition-all hover:scale-105 active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Browse Photos</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3a3a3c] hover:bg-[#4a4a4c] text-[#e1e1e0] text-xs sm:text-sm font-medium border border-[#3a3a3c] transition-all"
            >
              <Camera className="w-4 h-4 text-[#a9967f]" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Demo Samples */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
            Or test with sample images:
          </span>
          <span className="text-[11px] text-[#a0a0a0]">Instant 1-Click Load</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SAMPLE_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSampleSelect(sample.url)}
              className="group relative rounded-xl overflow-hidden border border-[#3a3a3c] hover:border-[#a9967f] transition-all text-left bg-[#252526] shadow-sm"
            >
              <div className="aspect-video w-full overflow-hidden bg-[#1c1c1e]">
                <img
                  src={sample.thumb}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-[#e1e1e0] truncate group-hover:text-[#a9967f]">
                  {sample.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-12 pt-8 border-t border-[#3a3a3c]">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#252526] border border-[#3a3a3c]">
          <div className="p-2 rounded-lg bg-[#a9967f]/15 text-[#a9967f]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#e1e1e0]">Android Share Sheet</h4>
            <p className="text-[11px] text-[#a0a0a0] mt-0.5">
              Directly share from Samsung Gallery or Google Photos via Web Share Target.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#252526] border border-[#3a3a3c]">
          <div className="p-2 rounded-lg bg-[#a9967f]/15 text-[#a9967f]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#e1e1e0]">Lossless Canvas Processing</h4>
            <p className="text-[11px] text-[#a0a0a0] mt-0.5">
              Instant hardware-accelerated HTML5 Canvas with adjustable blur and tints.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#252526] border border-[#3a3a3c]">
          <div className="p-2 rounded-lg bg-[#71b34f]/15 text-[#71b34f]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#e1e1e0]">100% Private & In-Browser</h4>
            <p className="text-[11px] text-[#a0a0a0] mt-0.5">
              Your photos never leave your device. Works fully offline as a PWA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
