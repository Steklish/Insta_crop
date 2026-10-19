import React, { useRef, useState } from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Eye, Maximize2, Move, Square } from 'lucide-react';

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
  enableCornerRadius = true,
  cornerRadius = 24,
  onToggleCorners,
}) {
  const [isComparing, setIsComparing] = useState(false);

  const startComparing = () => setIsComparing(true);
  const stopComparing = () => setIsComparing(false);

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2.5 sm:p-5 bg-[#2a2a2c] rounded-3xl border border-[#3a3a3c] shadow-2xl overflow-hidden min-h-[290px] lg:min-h-[460px]">
      {/* Top Info Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-2.5 px-1 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#252526] border border-[#3a3a3c] text-[#e1e1e0] font-semibold tracking-wide text-[11px] sm:text-xs">
            {preset.name} ({preset.label})
          </span>
          <span className="text-[#e1e1e0]/60 font-mono text-[10px] sm:text-[11px]">
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
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all select-none active:scale-95 ${
            isComparing
              ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/30'
              : 'bg-[#252526] hover:bg-[#4a4a4c] text-[#e1e1e0] border border-[#3a3a3c]'
          }`}
          title="Press and hold to compare with source image"
        >
          <Eye className="w-3.5 h-3.5 text-[#a9967f]" />
          <span>{isComparing ? 'Original' : 'Compare'}</span>
        </button>
      </div>

      {/* Canvas Viewport Frame (Optimized max-height for mobile screens) */}
      <div className="relative flex items-center justify-center max-w-full max-h-[48vh] sm:max-h-[58vh] rounded-2xl overflow-hidden canvas-checkerboard border border-[#3a3a3c] shadow-inner">
        {/* The Live Render Canvas */}
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-[48vh] sm:max-h-[58vh] object-contain transition-opacity duration-150 ${
            isComparing ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            aspectRatio: `${targetDimensions.width} / ${targetDimensions.height}`,
          }}
        />

        {/* Raw Image Overlay when comparing */}
        {isComparing && originalImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 animate-fade-in">
            <img
              src={originalImage.src}
              alt="Original Unedited"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-3 px-3 py-1 bg-[#2a2a2c]/90 backdrop-blur-md text-[#a9967f] text-xs font-bold rounded-full border border-[#a9967f]/40">
              Original Unedited Photo
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Quick Controls Toolbar */}
      <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full">
        <button
          onClick={onRotate}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#252526] hover:bg-[#4a4a4c] text-[#e1e1e0] text-xs font-medium border border-[#3a3a3c] transition-all active:scale-95 shadow-sm"
          title="Rotate 90 degrees clockwise"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#a9967f]" />
          <span>Rotate ({rotation}°)</span>
        </button>

        <button
          onClick={onFlipH}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipH
              ? 'bg-[#a9967f]/20 border-[#a9967f] text-[#a9967f]'
              : 'bg-[#252526] hover:bg-[#4a4a4c] border-[#3a3a3c] text-[#e1e1e0]'
          }`}
          title="Flip horizontally"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>Flip H</span>
        </button>

        <button
          onClick={onFlipV}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipV
              ? 'bg-[#a9967f]/20 border-[#a9967f] text-[#a9967f]'
              : 'bg-[#252526] hover:bg-[#4a4a4c] border-[#3a3a3c] text-[#e1e1e0]'
          }`}
          title="Flip vertically"
        >
          <FlipVertical className="w-3.5 h-3.5" />
          <span>Flip V</span>
        </button>

        {/* Quick Corner Rounding Toggle */}
        <button
          onClick={onToggleCorners}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            enableCornerRadius && cornerRadius > 0
              ? 'bg-[#a9967f]/20 border-[#a9967f] text-[#a9967f]'
              : 'bg-[#252526] hover:bg-[#4a4a4c] border-[#3a3a3c] text-[#e1e1e0]/60'
          }`}
          title={
            enableCornerRadius && cornerRadius > 0
              ? `Turn off rounded corners (currently ${cornerRadius}px)`
              : 'Turn on rounded corners'
          }
        >
          <Square className="w-3.5 h-3.5" />
          <span>Corners: {enableCornerRadius && cornerRadius > 0 ? `${cornerRadius}px` : 'Sharp'}</span>
        </button>

        <button
          onClick={onResetPosition}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#252526] hover:bg-[#4a4a4c] text-[#e1e1e0]/70 hover:text-[#e1e1e0] text-xs font-medium border border-[#3a3a3c] transition-all active:scale-95"
          title="Re-center position"
        >
          <Move className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Center</span>
        </button>
      </div>
    </div>
  );
}
