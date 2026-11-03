import React from 'react';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Move,
  Square,
  RefreshCw,
} from 'lucide-react';

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
  onOpenFullscreen,
  onReset,
}) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center p-1 sm:p-2 bg-[#2a2a2c] rounded-2xl sm:rounded-3xl border border-[#3a3a3c] shadow-2xl overflow-hidden min-h-0">
      {/* Canvas Viewport Frame */}
      <div
        onClick={onOpenFullscreen}
        className="group relative flex items-center justify-center w-full max-h-[34vh] xs:max-h-[40vh] sm:max-h-[50vh] lg:max-h-[62vh] rounded-xl sm:rounded-2xl overflow-hidden canvas-checkerboard border border-[#3a3a3c] shadow-inner cursor-zoom-in"
        title="Click to view fullscreen (zoom and navigate)"
      >
        {/* The Live Render Canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[34vh] xs:max-h-[40vh] sm:max-h-[50vh] lg:max-h-[62vh] object-contain transition-transform duration-200 group-hover:scale-[1.005]"
          style={{
            aspectRatio: `${targetDimensions.width} / ${targetDimensions.height}`,
          }}
        />

        {/* Top Floating Elements (Overlay on top of the image to save vertical space) */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10 gap-1.5">
          {/* Preset & Dimension Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1e]/85 backdrop-blur-md border border-[#3a3a3c]/80 text-[#e1e1e0] shadow-lg pointer-events-auto select-none min-w-0 truncate">
            <span className="font-semibold tracking-wide text-[10px] sm:text-xs text-white truncate">
              {preset.name} <span className="text-[#a9967f]">({preset.label})</span>
            </span>
            <span className="text-[#e1e1e0]/40 text-[9px] sm:text-[10px] flex-shrink-0">•</span>
            <span className="text-[#e1e1e0]/70 font-mono text-[9px] sm:text-[11px] flex-shrink-0">
              {targetDimensions.width} × {targetDimensions.height}
            </span>
          </div>

          {/* Action Buttons: New Photo & Fullscreen */}
          <div className="flex items-center gap-1.5 pointer-events-auto flex-shrink-0">
            {onReset && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1c1c1e]/85 hover:bg-[#F44336]/20 border border-[#3a3a3c]/80 hover:border-[#F44336]/50 text-[#e1e1e0]/80 hover:text-[#F44336] text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg transition-all active:scale-95"
                title="Upload another photo / Start over"
              >
                <RefreshCw className="w-3 h-3 text-[#e1e1e0]/70 hover:text-[#F44336]" />
                <span className="hidden xs:inline">New</span>
              </button>
            )}

            {onOpenFullscreen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFullscreen();
                }}
                className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-full bg-[#1c1c1e]/85 hover:bg-[#3a3a3c] border border-[#3a3a3c]/80 hover:border-[#a9967f] text-[#a9967f] hover:text-white text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg transition-all active:scale-95"
                title="Open fullscreen with zoom and pan navigation"
              >
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Fullscreen</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Island on top of the image: Flip, Rotate, Corners, Center */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:py-1.5 rounded-full bg-[#1c1c1e]/85 backdrop-blur-xl border border-[#3a3a3c]/90 shadow-2xl pointer-events-auto max-w-[95%] overflow-x-auto no-scrollbar"
        >
          {/* Rotate Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotate();
            }}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-[#252526]/90 hover:bg-[#3a3a3c] text-[#e1e1e0] text-[10px] sm:text-xs font-medium border border-[#3a3a3c]/80 transition-all active:scale-95"
            title="Rotate 90 degrees clockwise"
          >
            <RotateCw className="w-3 h-3 text-[#a9967f]" />
            <span>{rotation}°</span>
          </button>

          {/* Flip H Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFlipH();
            }}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border transition-all active:scale-95 ${
              flipH
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/90 hover:bg-[#3a3a3c] border-[#3a3a3c]/80 text-[#e1e1e0]'
            }`}
            title="Flip horizontally"
          >
            <FlipHorizontal className="w-3 h-3" />
            <span>Flip H</span>
          </button>

          {/* Flip V Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFlipV();
            }}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border transition-all active:scale-95 ${
              flipV
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/90 hover:bg-[#3a3a3c] border-[#3a3a3c]/80 text-[#e1e1e0]'
            }`}
            title="Flip vertically"
          >
            <FlipVertical className="w-3 h-3" />
            <span>Flip V</span>
          </button>

          {/* Quick Corner Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCorners();
            }}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border transition-all active:scale-95 ${
              enableCornerRadius && cornerRadius > 0
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/90 hover:bg-[#3a3a3c] border-[#3a3a3c]/80 text-[#e1e1e0]/60'
            }`}
            title={
              enableCornerRadius && cornerRadius > 0
                ? `Turn off rounded corners (${cornerRadius}px)`
                : 'Turn on rounded corners'
            }
          >
            <Square className="w-3 h-3" />
            <span>{enableCornerRadius && cornerRadius > 0 ? `${cornerRadius}px` : 'Sharp'}</span>
          </button>

          {/* Center Position */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResetPosition();
            }}
            className="flex-shrink-0 flex items-center gap-1 px-1.5 py-1 rounded-full bg-[#252526]/90 hover:bg-[#3a3a3c] text-[#e1e1e0]/70 hover:text-white text-[10px] sm:text-xs font-medium border border-[#3a3a3c]/80 transition-all active:scale-95"
            title="Re-center position"
          >
            <Move className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
