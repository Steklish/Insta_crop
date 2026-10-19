import React, { useRef, useState } from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Eye, Maximize2, Move } from 'lucide-react';

export default function CanvasPreview({
  canvasRef,
  originalImage,
  targetDimensions,
  preset,
  onRotate,
  onFlipH,
  onFlipV,
  onResetPosition,
  rotation,
  flipH,
  flipV,
}) {
  const [isComparing, setIsComparing] = useState(false);

  const startComparing = () => setIsComparing(true);
  const stopComparing = () => setIsComparing(false);

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden min-h-[360px] lg:min-h-[500px]">
      {/* Top Info Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold tracking-wide">
            {preset.name} ({preset.label})
          </span>
          <span className="text-slate-400 font-mono text-[11px] hidden xs:inline">
            {targetDimensions.width} × {targetDimensions.height} px
          </span>
        </div>

        {/* Hold to Compare button */}
        <button
          type="button"
          onMouseDown={startComparing}
          onMouseUp={stopComparing}
          onMouseLeave={stopComparing}
          onTouchStart={startComparing}
          onTouchEnd={stopComparing}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none ${
            isComparing
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
          title="Press and hold to compare with source image"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isComparing ? 'Showing Original' : 'Hold to Compare'}</span>
        </button>
      </div>

      {/* Canvas Viewport Frame */}
      <div className="relative flex items-center justify-center max-w-full max-h-[55vh] sm:max-h-[62vh] rounded-2xl overflow-hidden canvas-checkerboard border border-slate-800/80 shadow-inner">
        {/* The Live Render Canvas */}
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-[55vh] sm:max-h-[62vh] object-contain transition-opacity duration-150 ${
            isComparing ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            aspectRatio: `${targetDimensions.width} / ${targetDimensions.height}`,
          }}
        />

        {/* Raw Image Overlay when comparing */}
        {isComparing && originalImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
            <img
              src={originalImage.src}
              alt="Original Unedited"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 px-3 py-1 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
              Original Unedited Photo
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Quick Controls Toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onRotate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all active:scale-95 shadow-sm"
          title="Rotate 90 degrees clockwise"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Rotate ({rotation}°)</span>
        </button>

        <button
          onClick={onFlipH}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipH
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Flip horizontally"
        >
          <FlipHorizontal className="w-3.5 h-3.5 text-pink-400" />
          <span>Flip H</span>
        </button>

        <button
          onClick={onFlipV}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipV
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Flip vertically"
        >
          <FlipVertical className="w-3.5 h-3.5 text-purple-400" />
          <span>Flip V</span>
        </button>

        <button
          onClick={onResetPosition}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition-all active:scale-95"
          title="Re-center position"
        >
          <Move className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Center</span>
        </button>
      </div>
    </div>
  );
}
