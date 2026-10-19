import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import CanvasPreview from './components/CanvasPreview';
import PresetSelector from './components/PresetSelector';
import ControlSliders from './components/ControlSliders';
import ExportPanel from './components/ExportPanel';
import AndroidShareModal from './components/AndroidShareModal';
import { ASPECT_RATIO_PRESETS } from './constants/presets';
import {
  calculateCanvasDimensions,
  renderCanvas,
  loadImageFromSource,
} from './utils/canvas';
import { useShareTarget } from './hooks/useShareTarget';
import {
  Grid3X3,
  Sliders,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Source Image State
  const [image, setImage] = useState(null);
  const [originalFilename, setOriginalFilename] = useState('photo.jpg');

  // Preset & Canvas Dimension State
  const [selectedPreset, setSelectedPreset] = useState(ASPECT_RATIO_PRESETS[1]); // Default to 4:5 Portrait
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);

  // Background Controls
  const [blur, setBlur] = useState(28);
  const [bgScale, setBgScale] = useState(1.25);
  const [darken, setDarken] = useState(0.25);
  const [tintColor, setTintColor] = useState('#000000');
  const [bgSaturation, setBgSaturation] = useState(120);
  const [bgBrightness, setBgBrightness] = useState(95);
  const [showBackground, setShowBackground] = useState(true);
  const [solidBackgroundColor, setSolidBackgroundColor] = useState('#0b0f19');

  // Foreground Controls
  const [padding, setPadding] = useState(0.08);
  const [cornerRadius, setCornerRadius] = useState(24);
  const [shadowBlur, setShadowBlur] = useState(32);
  const [shadowOpacity, setShadowOpacity] = useState(0.45);
  const [shadowOffsetY, setShadowOffsetY] = useState(12);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  // Mobile Navigation Tab: 'preset' | 'adjust' | 'export'
  const [mobileTab, setMobileTab] = useState('preset');

  // Modals & Notifications
  const [isShareGuideOpen, setIsShareGuideOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const canvasRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Load Image Handler
  const handleLoadImage = useCallback(async (source, filename = 'photo.jpg') => {
    try {
      const loadedImg = await loadImageFromSource(source);
      setImage(loadedImg);
      setOriginalFilename(filename);
      // Reset transformations
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setPositionX(0);
      setPositionY(0);
      showToast('Photo loaded into canvas studio');
    } catch (err) {
      console.error('Failed to load image:', err);
      showToast('Failed to load image file. Please try another format.');
    }
  }, []);

  // Web Share Target & PWA Hook
  const { isInstallable, isStandalone, installPwa } = useShareTarget({
    onImageReceived: (blob, filename) => {
      handleLoadImage(blob, filename);
      showToast('Received photo directly from Android Gallery!');
    },
  });

  // Calculate live preview canvas dimensions
  const previewDimensions = calculateCanvasDimensions({
    preset: selectedPreset,
    customWidth,
    customHeight,
    sourceImage: image,
    resolutionMode: '1x',
  });

  const canvasProps = {
    blur,
    bgScale,
    darken,
    tintColor,
    bgSaturation,
    bgBrightness,
    padding,
    cornerRadius,
    shadowBlur,
    shadowOpacity,
    shadowOffsetY,
    borderWidth,
    borderColor,
    rotation,
    flipH,
    flipV,
    positionX,
    positionY,
    showBackground,
    solidBackgroundColor,
  };

  // Live Canvas Rendering
  useEffect(() => {
    if (!image || !canvasRef.current) return;

    let animFrameId = requestAnimationFrame(() => {
      renderCanvas({
        canvas: canvasRef.current,
        image,
        targetWidth: previewDimensions.width,
        targetHeight: previewDimensions.height,
        baseWidth: previewDimensions.baseWidth,
        ...canvasProps,
      });
    });

    return () => cancelAnimationFrame(animFrameId);
  }, [image, previewDimensions, canvasProps]);

  // Transformation Actions
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleFlipH = () => setFlipH((prev) => !prev);
  const handleFlipV = () => setFlipV((prev) => !prev);
  const handleResetPosition = () => {
    setPositionX(0);
    setPositionY(0);
  };

  const handleResetAdjustments = () => {
    setBlur(28);
    setBgScale(1.25);
    setDarken(0.25);
    setTintColor('#000000');
    setBgSaturation(120);
    setBgBrightness(95);
    setShowBackground(true);
    setSolidBackgroundColor('#0b0f19');
    setPadding(0.08);
    setCornerRadius(24);
    setShadowBlur(32);
    setShadowOpacity(0.45);
    setShadowOffsetY(12);
    setBorderWidth(0);
    setBorderColor('#ffffff');
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPositionX(0);
    setPositionY(0);
    showToast('Adjustments reset to defaults');
  };

  const handleResetAll = () => {
    setImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans pb-16 lg:pb-0">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-600/40 border border-indigo-400/40 animate-fade-in">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onReset={handleResetAll}
        hasImage={Boolean(image)}
        isInstallable={isInstallable}
        onInstall={installPwa}
        onOpenShareGuide={() => setIsShareGuideOpen(true)}
        isStandalone={isStandalone}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5">
        {!image ? (
          <EmptyState
            onFileSelect={(file) => handleLoadImage(file, file.name)}
            onSampleSelect={(url) => handleLoadImage(url, 'sample.jpg')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Canvas Preview */}
            <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-18">
              <CanvasPreview
                canvasRef={canvasRef}
                originalImage={image}
                targetDimensions={previewDimensions}
                preset={selectedPreset}
                onRotate={handleRotate}
                onFlipH={handleFlipH}
                onFlipV={handleFlipV}
                onResetPosition={handleResetPosition}
                rotation={rotation}
                flipH={flipH}
                flipV={flipV}
              />
            </div>

            {/* RIGHT COLUMN: Controls & Settings */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5">
              {/* Desktop Sub-tabs or Mobile Tab Content */}
              <div className="hidden lg:flex rounded-2xl bg-slate-900/80 p-1 border border-slate-800">
                <button
                  onClick={() => setMobileTab('preset')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'preset'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>

                <button
                  onClick={() => setMobileTab('adjust')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'adjust'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>

                <button
                  onClick={() => setMobileTab('export')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'export'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Dynamic Tab Content (Active on both desktop and mobile according to mobileTab) */}
              <div className="bg-slate-950/70 rounded-3xl p-4 sm:p-5 border border-slate-800/80 shadow-xl">
                {mobileTab === 'preset' && (
                  <PresetSelector
                    selectedPreset={selectedPreset}
                    onSelectPreset={setSelectedPreset}
                    customWidth={customWidth}
                    customHeight={customHeight}
                    onChangeCustomWidth={setCustomWidth}
                    onChangeCustomHeight={setCustomHeight}
                    sourceDimensions={
                      image
                        ? { width: image.naturalWidth, height: image.naturalHeight }
                        : null
                    }
                  />
                )}

                {mobileTab === 'adjust' && (
                  <ControlSliders
                    blur={blur}
                    setBlur={setBlur}
                    bgScale={bgScale}
                    setBgScale={setBgScale}
                    darken={darken}
                    setDarken={setDarken}
                    tintColor={tintColor}
                    setTintColor={setTintColor}
                    bgSaturation={bgSaturation}
                    setBgSaturation={setBgSaturation}
                    bgBrightness={bgBrightness}
                    setBgBrightness={setBgBrightness}
                    showBackground={showBackground}
                    setShowBackground={setShowBackground}
                    solidBackgroundColor={solidBackgroundColor}
                    setSolidBackgroundColor={setSolidBackgroundColor}
                    padding={padding}
                    setPadding={setPadding}
                    cornerRadius={cornerRadius}
                    setCornerRadius={setCornerRadius}
                    shadowBlur={shadowBlur}
                    setShadowBlur={setShadowBlur}
                    shadowOpacity={shadowOpacity}
                    setShadowOpacity={setShadowOpacity}
                    shadowOffsetY={shadowOffsetY}
                    setShadowOffsetY={setShadowOffsetY}
                    borderWidth={borderWidth}
                    setBorderWidth={setBorderWidth}
                    borderColor={borderColor}
                    setBorderColor={setBorderColor}
                    positionX={positionX}
                    setPositionX={setPositionX}
                    positionY={positionY}
                    setPositionY={setPositionY}
                    onResetDefaults={handleResetAdjustments}
                  />
                )}

                {mobileTab === 'export' && (
                  <ExportPanel
                    image={image}
                    preset={selectedPreset}
                    customWidth={customWidth}
                    customHeight={customHeight}
                    canvasProps={canvasProps}
                    originalFilename={originalFilename}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens when image is loaded) */}
      {image && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
          <button
            onClick={() => setMobileTab('preset')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              mobileTab === 'preset'
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px]">Presets</span>
          </button>

          <button
            onClick={() => setMobileTab('adjust')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              mobileTab === 'adjust'
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px]">Adjust</span>
          </button>

          <button
            onClick={() => setMobileTab('export')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              mobileTab === 'export'
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-5 h-5" />
            <span className="text-[10px]">Export</span>
          </button>
        </nav>
      )}

      {/* Android Direct Share Tutorial Modal */}
      <AndroidShareModal
        isOpen={isShareGuideOpen}
        onClose={() => setIsShareGuideOpen(false)}
        isInstallable={isInstallable}
        onInstall={installPwa}
      />
    </div>
  );
}
