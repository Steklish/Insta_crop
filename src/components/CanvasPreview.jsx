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
        title="Click anywhere to view fullscreen (zoom and navigate)"
      >
        {/* The Live Render Canvas */}
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[34vh] xs:max-h-[40vh] sm:max-h-[50vh] lg:max-h-[62vh] object-contain transition-transform duration-200 group-hover:scale-[1.005]"
          style={{
            aspectRatio: `${targetDimensions.width} / ${targetDimensions.height}`,
          }}
        />

        {/* Top Left: 2-Row Compact Preset & Resolution Island */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 z-10 flex flex-col justify-center px-2.5 py-1 rounded-xl bg-[#1c1c1e]/85 backdrop-blur-md border border-[#3a3a3c]/80 text-[#e1e1e0] shadow-lg pointer-events-auto select-none leading-tight max-w-[55%] sm:max-w-xs"
        >
          <div className="font-bold text-[10px] sm:text-xs text-white truncate">
            {preset.name} <span className="text-[#a9967f] font-normal">({preset.label})</span>
          </div>
          <div className="text-[#e1e1e0]/70 font-mono text-[9px] sm:text-[10px] tracking-wide mt-0.5 truncate">
            {targetDimensions.width} × {targetDimensions.height} px
          </div>
        </div>

        {/* Right Side: Strictly Fixed-Width Vertical Floating Island */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10 flex flex-col items-center gap-1 p-1 rounded-xl bg-[#1c1c1e]/85 backdrop-blur-xl border border-[#3a3a3c]/90 shadow-2xl pointer-events-auto w-9 select-none"
        >
          {/* Fullscreen Button */}
          {onOpenFullscreen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullscreen();
              }}
              className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#252526]/80 hover:bg-[#3a3a3c] text-[#a9967f] hover:text-white transition-all active:scale-90"
              title="Open fullscreen (zoom & pan)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* New Photo Button */}
          {onReset && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#252526]/80 hover:bg-[#F44336]/20 text-[#e1e1e0]/80 hover:text-[#F44336] transition-all active:scale-90"
              title="Upload another photo / Start over"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Subtle Hairline Divider */}
          <div className="w-4 h-[1px] bg-[#3a3a3c]/80 my-0.5 flex-shrink-0" />

          {/* Rotate Button: Strict square, active gold border & corner indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotate();
            }}
            className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all active:scale-90 relative ${
              rotation !== 0
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/80 hover:bg-[#3a3a3c] border-transparent text-[#e1e1e0]'
            }`}
            title={`Rotate 90° clockwise (current: ${rotation}°)`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            {rotation !== 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#a9967f] absolute top-1 right-1" />
            )}
          </button>

          {/* Flip H Button: Strict square, active gold border & corner indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFlipH();
            }}
            className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all active:scale-90 relative ${
              flipH
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/80 hover:bg-[#3a3a3c] border-transparent text-[#e1e1e0]'
            }`}
            title="Flip horizontally"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            {flipH && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#a9967f] absolute top-1 right-1" />
            )}
          </button>

          {/* Flip V Button: Strict square, active gold border & corner indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFlipV();
            }}
            className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all active:scale-90 relative ${
              flipV
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/80 hover:bg-[#3a3a3c] border-transparent text-[#e1e1e0]'
            }`}
            title="Flip vertically"
          >
            <FlipVertical className="w-3.5 h-3.5" />
            {flipV && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#a9967f] absolute top-1 right-1" />
            )}
          </button>

          {/* Corner Toggle: Strict square, active gold border & corner indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCorners();
            }}
            className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all active:scale-90 relative ${
              enableCornerRadius && cornerRadius > 0
                ? 'bg-[#a9967f]/25 border-[#a9967f] text-[#a9967f]'
                : 'bg-[#252526]/80 hover:bg-[#3a3a3c] border-transparent text-[#e1e1e0]/60'
            }`}
            title={
              enableCornerRadius && cornerRadius > 0
                ? `Rounded corners active (${cornerRadius}px)`
                : 'Sharp corners'
            }
          >
            <Square className="w-3.5 h-3.5" />
            {enableCornerRadius && cornerRadius > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#a9967f] absolute top-1 right-1" />
            )}
          </button>

          {/* Center Position Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResetPosition();
            }}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#252526]/80 hover:bg-[#3a3a3c] text-[#e1e1e0]/70 hover:text-white transition-all active:scale-90"
            title="Center image position"
          >
            <Move className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
