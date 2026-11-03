import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Info,
} from 'lucide-react';

export default function FullscreenViewerModal({
  isOpen,
  onClose,
  canvasRef,
  targetDimensions,
  preset,
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dataUrl, setDataUrl] = useState(null);

  // Capture canvas image whenever modal opens or canvas updates
  useEffect(() => {
    if (!isOpen || !canvasRef?.current) return;
    try {
      setDataUrl(canvasRef.current.toDataURL('image/png'));
    } catch (e) {
      console.warn('Could not generate dataURL for fullscreen viewer:', e);
    }
    // Reset view
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [isOpen, canvasRef]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(6, prev * 1.3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev / 1.3));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.15;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(6, prev * zoomFactor));
    } else {
      setScale((prev) => Math.max(0.5, prev / zoomFactor));
    }
  };

  // Mouse pan drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-zoom
  const touchStateRef = useRef({ initialDist: 0, initialScale: 1, lastX: 0, lastY: 0 });

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStateRef.current.lastX = e.touches[0].clientX - position.x;
      touchStateRef.current.lastY = e.touches[0].clientY - position.y;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStateRef.current.initialDist = Math.hypot(dx, dy);
      touchStateRef.current.initialScale = scale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - touchStateRef.current.lastX,
        y: e.touches[0].clientY - touchStateRef.current.lastY,
      });
    } else if (e.touches.length === 2 && touchStateRef.current.initialDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / touchStateRef.current.initialDist;
      setScale(Math.max(0.5, Math.min(6, touchStateRef.current.initialScale * factor)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStateRef.current.initialDist = 0;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#1c1c1e]/98 backdrop-blur-2xl animate-fade-in select-none"
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 xs:px-5 py-2.5 xs:py-3 border-b border-[#3a3a3c] bg-[#252526]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#3a3a3c] text-[#a9967f] text-[10px] xs:text-xs font-mono font-bold">
            {preset?.name || 'Canvas'} ({preset?.label || ''})
          </span>
          <span className="text-[10px] xs:text-xs text-[#e1e1e0]/60 font-mono hidden xs:inline">
            {targetDimensions?.width} × {targetDimensions?.height} px
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#1c1c1e] text-[10px] text-[#e1e1e0]/80 font-mono">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 xs:gap-2">
          <button
            onClick={handleZoomIn}
            className="p-1.5 xs:p-2 rounded-xl bg-[#2a2a2c] hover:bg-[#3a3a3c] text-[#e1e1e0] transition-colors border border-[#3a3a3c]"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4 text-[#a9967f]" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 xs:p-2 rounded-xl bg-[#2a2a2c] hover:bg-[#3a3a3c] text-[#e1e1e0] transition-colors border border-[#3a3a3c]"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4 text-[#a9967f]" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 xs:p-2 rounded-xl bg-[#2a2a2c] hover:bg-[#3a3a3c] text-[#e1e1e0] transition-colors border border-[#3a3a3c]"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-4 h-4 text-[#a9967f]" />
          </button>
          <div className="w-[1px] h-5 bg-[#3a3a3c] mx-0.5" />
          <button
            onClick={onClose}
            className="p-1.5 xs:p-2 rounded-xl bg-[#F44336]/10 hover:bg-[#F44336]/20 text-[#F44336] border border-[#F44336]/30 transition-colors"
            title="Close Fullscreen (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Zoom & Pan Viewport */}
      <div
        className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing canvas-checkerboard"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {dataUrl ? (
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              transformOrigin: 'center center',
            }}
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center pointer-events-none drop-shadow-2xl"
          >
            <img
              src={dataUrl}
              alt="InstaCrop Fullscreen Canvas"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg border border-[#3a3a3c]/70 shadow-2xl"
              style={{
                aspectRatio: `${targetDimensions?.width || 1080} / ${targetDimensions?.height || 1080}`,
              }}
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-xs text-[#e1e1e0]/60">Generating preview...</div>
        )}

        {/* Floating Bottom Navigator / Gesture Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#252526]/90 backdrop-blur-md border border-[#3a3a3c] text-[10px] text-[#e1e1e0]/70 flex items-center gap-2 pointer-events-none shadow-xl">
          <Move className="w-3 h-3 text-[#a9967f]" />
          <span>Drag to pan • Pinch / Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
