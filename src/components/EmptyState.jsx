import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';

export default function EmptyState({ onFileSelect }) {
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
    </div>
  );
}
