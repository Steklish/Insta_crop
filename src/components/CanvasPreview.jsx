import React, { useRef } from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Maximize2, Move, Square } from 'lucide-react';

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
  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2 sm:p-4 bg-[#2a2a2c] rounded-2xl sm:rounded-3xl border border-[#3a3a3c] shadow-2xl overflow-hidden min-h-0">
      {/* Top Info Bar */}
      <div className="w-full flex items-center justify-between gap-1.5 mb-2 px-0.5 text-[10px] sm:text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="px-2 py-0.5 rounded-full bg-[#252526] border border-[#3a3a3c] text-[#e1e1e0] font-semibold tracking-wide text-[10px] sm:text-xs truncate">
            {preset.name} ({preset.label})
          </span>
          <span className="text-[#e1e1e0]/60 font-mono text-[9px] sm:text-[11px] flex-shrink-0">
            {targetDimensions.width} × {targetDimensions.height} px
          </span>
        </div>
      </div>

      {/* Canvas Viewport Frame (Optimized max-height for smaller mobile screens) */}
      <div className="relative flex items-center justify-center max-w-full max-h-[36vh] xs:max-h-[42vh] sm:max-h-[55vh] rounded-xl sm:rounded-2xl overflow-hidden canvas-checkerboard border border-[#3a3a3c] shadow-inner">
        {/* The Live Render Canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[36vh] xs:max-h-[42vh] sm:max-h-[55vh] object-contain"
          style={{
            aspectRatio: `${targetDimensions.width} / ${targetDimensions.height}`,
          }}
        />
      </div>

      {/* Floating Canvas Quick Controls Toolbar (Single scrollable row on mobile) */}
      <div className="mt-2 sm:mt-2.5 flex items-center gap-1 sm:gap-2 w-full overflow-x-auto no-scrollbar py-0.5 px-0.5 justify-start sm:justify-center">
        <button
          onClick={onRotate}
          className="flex-shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#252526] hover:bg-[#4a4a4c] text-[#e1e1e0] text-[11px] sm:text-xs font-medium border border-[#3a3a3c] transition-all active:scale-95 shadow-sm"
          title="Rotate 90 degrees clockwise"
        >
          <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a9967f]" />
          <span className="hidden xs:inline">Rotate </span>
          <span>{rotation}°</span>
        </button>

        <button
          onClick={onFlipH}
          className={`flex-shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipH
              ? 'bg-[#a9967f]/20 border-[#a9967f] text-[#a9967f]'
              : 'bg-[#252526] hover:bg-[#4a4a4c] border-[#3a3a3c] text-[#e1e1e0]'
          }`}
          title="Flip horizontally"
        >
          <FlipHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Flip H</span>
        </button>

        <button
          onClick={onFlipV}
          className={`flex-shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-all active:scale-95 shadow-sm ${
            flipV
              ? 'bg-[#a9967f]/20 border-[#a9967f] text-[#a9967f]'
              : 'bg-[#252526] hover:bg-[#4a4a4c] border-[#3a3a3c] text-[#e1e1e0]'
          }`}
          title="Flip vertically"
        >
          <FlipVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Flip V</span>
        </button>

        {/* Quick Corner Rounding Toggle */}
        <button
          onClick={onToggleCorners}
          className={`flex-shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border transition-all active:scale-95 shadow-sm ${
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
          <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">Corners: </span>
          <span>{enableCornerRadius && cornerRadius > 0 ? `${cornerRadius}px` : 'Sharp'}</span>
        </button>

        <button
          onClick={onResetPosition}
          className="flex-shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-[#252526] hover:bg-[#4a4a4c] text-[#e1e1e0]/70 hover:text-[#e1e1e0] text-[11px] sm:text-xs font-medium border border-[#3a3a3c] transition-all active:scale-95"
          title="Re-center position"
        >
          <Move className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">Center</span>
        </button>
      </div>
    </div>
  );
}
