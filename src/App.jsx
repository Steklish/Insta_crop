import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import CanvasPreview from './components/CanvasPreview';
import PresetSelector from './components/PresetSelector';
import ControlSliders from './components/ControlSliders';
import TextOverlayPanel from './components/TextOverlayPanel';
import ExportPanel from './components/ExportPanel';
import { ASPECT_RATIO_PRESETS } from './constants/presets';
import {
  calculateCanvasDimensions,
  renderCanvas,
  loadImageFromSource,
} from './utils/canvas';
import {
  loadLastUsedSettings,
  saveLastUsedSettings,
} from './utils/presetStorage';
import { useShareTarget } from './hooks/useShareTarget';
import { addTrace } from './utils/tracer';
import {
  Grid3X3,
  Sliders,
  Type,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Source Image State
  const [image, setImage] = useState(null);
  const [originalFilename, setOriginalFilename] = useState('photo.jpg');

  // Load last-used preferences from device storage
  const initialSettings = useRef(loadLastUsedSettings()).current;

  // Preset & Canvas Dimension State
  const [selectedPreset, setSelectedPreset] = useState(() => {
    if (initialSettings?.presetId) {
      const match = ASPECT_RATIO_PRESETS.find((p) => p.id === initialSettings.presetId);
      if (match) return match;
    }
    return ASPECT_RATIO_PRESETS[1]; // Default to 4:5 Portrait
  });
  const [customWidth, setCustomWidth] = useState(() => initialSettings?.customWidth ?? 1080);
  const [customHeight, setCustomHeight] = useState(() => initialSettings?.customHeight ?? 1350);

  // Background Controls
  const [blur, setBlur] = useState(() => initialSettings?.blur ?? 28);
  const [bgScale, setBgScale] = useState(() => initialSettings?.bgScale ?? 1.25);
  const [darken, setDarken] = useState(() => initialSettings?.darken ?? 0.25);
  const [tintColor, setTintColor] = useState(() => initialSettings?.tintColor ?? '#000000');
  const [bgSaturation, setBgSaturation] = useState(() => initialSettings?.bgSaturation ?? 120);
  const [bgBrightness, setBgBrightness] = useState(() => initialSettings?.bgBrightness ?? 95);
  const [showBackground, setShowBackground] = useState(() => initialSettings?.showBackground ?? true);
  const [solidBackgroundColor, setSolidBackgroundColor] = useState(() => initialSettings?.solidBackgroundColor ?? '#0b0f19');

  // Foreground Controls
  const [padding, setPadding] = useState(() => initialSettings?.padding ?? 0.08);
  const [paddingX, setPaddingX] = useState(() => initialSettings?.paddingX ?? 0.08);
  const [paddingY, setPaddingY] = useState(() => initialSettings?.paddingY ?? 0.08);
  const [linkPadding, setLinkPadding] = useState(() => initialSettings?.linkPadding ?? true);
  const [fgFitMode, setFgFitMode] = useState(() => initialSettings?.fgFitMode ?? 'contain');
  const [fgScale, setFgScale] = useState(() => initialSettings?.fgScale ?? 1.0);
  const [enableCornerRadius, setEnableCornerRadius] = useState(() => initialSettings?.enableCornerRadius ?? true);
  const [cornerRadius, setCornerRadius] = useState(() => initialSettings?.cornerRadius ?? 24);
  const [shadowBlur, setShadowBlur] = useState(() => initialSettings?.shadowBlur ?? 32);
  const [shadowOpacity, setShadowOpacity] = useState(() => initialSettings?.shadowOpacity ?? 0.45);
  const [shadowOffsetY, setShadowOffsetY] = useState(() => initialSettings?.shadowOffsetY ?? 12);
  const [borderWidth, setBorderWidth] = useState(() => initialSettings?.borderWidth ?? 0);
  const [borderColor, setBorderColor] = useState(() => initialSettings?.borderColor ?? '#ffffff');

  // Export Settings (saved in presets and persisted across sessions)
  const [exportFormat, setExportFormat] = useState(() => initialSettings?.exportFormat ?? 'image/png');
  const [jpegQuality, setJpegQuality] = useState(() => initialSettings?.jpegQuality ?? 0.92);
  const [resolutionMode, setResolutionMode] = useState(() => initialSettings?.resolutionMode ?? '1x');
  const [scaleMultiplier, setScaleMultiplier] = useState(() => initialSettings?.scaleMultiplier ?? 1.0);

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  // Text Overlay State (always inactive by default)
  const [textEnabled, setTextEnabled] = useState(false);
  const [textContent, setTextContent] = useState(() => initialSettings?.textContent ?? '');
  const [textFontFamily, setTextFontFamily] = useState(() => initialSettings?.textFontFamily ?? 'system-ui, -apple-system, sans-serif');
  const [textFontSize, setTextFontSize] = useState(() => initialSettings?.textFontSize ?? 44);
  const [textColor, setTextColor] = useState(() => initialSettings?.textColor ?? '#ffffff');
  const [textBold, setTextBold] = useState(() => initialSettings?.textBold ?? true);
  const [textItalic, setTextItalic] = useState(() => initialSettings?.textItalic ?? false);
  const [textUppercase, setTextUppercase] = useState(() => initialSettings?.textUppercase ?? false);
  const [textAlign, setTextAlign] = useState(() => initialSettings?.textAlign ?? 'center');
  const [textPositionX, setTextPositionX] = useState(() => initialSettings?.textPositionX ?? 50);
  const [textPositionY, setTextPositionY] = useState(() => initialSettings?.textPositionY ?? 85);
  const [textBgStyle, setTextBgStyle] = useState(() => initialSettings?.textBgStyle ?? 'none');
  const [textShadow, setTextShadow] = useState(() => initialSettings?.textShadow ?? true);
  const [textStroke, setTextStroke] = useState(() => initialSettings?.textStroke ?? false);

  // Mobile Navigation Tab: 'preset' | 'adjust' | 'text' | 'export'
  const [mobileTab, setMobileTab] = useState('preset');

  // Notifications
  const [toast, setToast] = useState(null);

  const canvasRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Load Image Handler
  const handleLoadImage = useCallback(async (source, filename = 'photo.jpg') => {
    try {
      addTrace('APP', `Loading image: ${filename}`);
      const loadedImg = await loadImageFromSource(source);
      setImage(loadedImg);
      setOriginalFilename(filename);
      // Reset transformations
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setPositionX(0);
      setPositionY(0);
      setTextEnabled(false);
      addTrace('APP', `Image successfully mounted to canvas (${loadedImg.naturalWidth}x${loadedImg.naturalHeight})`);
      showToast('Photo loaded into canvas studio');
    } catch (err) {
      console.error('Failed to load image:', err);
      addTrace('APP ERROR', `Failed to load image: ${err.message}`);
      showToast('Failed to load image file. Please try another format.');
    }
  }, []);

  // Web Share Target Hook (silent background receiver)
  useShareTarget({
    onImageReceived: (blob, filename) => {
      addTrace('APP', `useShareTarget onImageReceived event: ${filename} (${blob.size} bytes)`);
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
    paddingX,
    paddingY,
    fgFitMode,
    fgScale,
    enableCornerRadius,
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
    textEnabled,
    textContent,
    textFontFamily,
    textFontSize,
    textColor,
    textBold,
    textItalic,
    textUppercase,
    textAlign,
    textPositionX,
    textPositionY,
    textBgStyle,
    textShadow,
    textStroke,
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

  // Precise Margin Handlers
  const handleSetPadding = (val) => {
    const num = Math.max(0, Math.min(0.5, val));
    setPadding(num);
    if (linkPadding) {
      setPaddingX(num);
      setPaddingY(num);
    }
  };

  const handleSetPaddingX = (val) => {
    const num = Math.max(0, Math.min(0.5, val));
    setPaddingX(num);
    if (linkPadding) {
      setPadding(num);
      setPaddingY(num);
    }
  };

  const handleSetPaddingY = (val) => {
    const num = Math.max(0, Math.min(0.5, val));
    setPaddingY(num);
    if (linkPadding) {
      setPadding(num);
      setPaddingX(num);
    }
  };

  // Calculate and flush the shortest margin side to 0%
  const handleFlushShortestSide = useCallback(() => {
    if (!image) return;
    const isRotatedQuarter = (Math.abs(rotation) % 180) === 90;
    const effW = isRotatedQuarter ? (image.naturalHeight || image.height) : (image.naturalWidth || image.width);
    const effH = isRotatedQuarter ? (image.naturalWidth || image.width) : (image.naturalHeight || image.height);
    const imgAspect = effW / effH;
    const canvasAspect = previewDimensions.width / previewDimensions.height;

    setLinkPadding(false);
    if (imgAspect >= canvasAspect) {
      // Horizontal side touches first -> Horizontal margin is shortest
      setPaddingX(0);
      showToast('Shortest side flushed: Horizontal margin set to 0%');
    } else {
      // Vertical side touches first -> Vertical margin is shortest
      setPaddingY(0);
      showToast('Shortest side flushed: Vertical margin set to 0%');
    }
  }, [image, rotation, previewDimensions]);

  const handleClearAllMargins = useCallback(() => {
    setPadding(0);
    setPaddingX(0);
    setPaddingY(0);
    showToast('Edge-to-edge: all margins set to 0%');
  }, []);

  const handleToggleCorners = () => {
    setEnableCornerRadius((prev) => {
      const next = !prev;
      if (next && cornerRadius === 0) {
        setCornerRadius(24);
      }
      showToast(next ? `Corners: Rounded (${cornerRadius || 24}px)` : 'Corners: Turned OFF (Sharp 90°)');
      return next;
    });
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
    setPaddingX(0.08);
    setPaddingY(0.08);
    setLinkPadding(true);
    setFgFitMode('contain');
    setFgScale(1.0);
    setEnableCornerRadius(true);
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
    setTextEnabled(false);
    showToast('Adjustments reset to defaults');
  };

  // Apply preset settings payload (from custom preset or file import)
  const handleApplyPresetSettings = useCallback((settings) => {
    if (!settings) return;
    if (settings.presetId) {
      const match = ASPECT_RATIO_PRESETS.find((p) => p.id === settings.presetId);
      if (match) setSelectedPreset(match);
    }
    if (typeof settings.customWidth === 'number') setCustomWidth(settings.customWidth);
    if (typeof settings.customHeight === 'number') setCustomHeight(settings.customHeight);
    if (typeof settings.blur === 'number') setBlur(settings.blur);
    if (typeof settings.bgScale === 'number') setBgScale(settings.bgScale);
    if (typeof settings.darken === 'number') setDarken(settings.darken);
    if (typeof settings.tintColor === 'string') setTintColor(settings.tintColor);
    if (typeof settings.bgSaturation === 'number') setBgSaturation(settings.bgSaturation);
    if (typeof settings.bgBrightness === 'number') setBgBrightness(settings.bgBrightness);
    if (typeof settings.showBackground === 'boolean') setShowBackground(settings.showBackground);
    if (typeof settings.solidBackgroundColor === 'string') setSolidBackgroundColor(settings.solidBackgroundColor);
    if (typeof settings.padding === 'number') setPadding(settings.padding);
    if (typeof settings.paddingX === 'number') setPaddingX(settings.paddingX);
    if (typeof settings.paddingY === 'number') setPaddingY(settings.paddingY);
    if (typeof settings.linkPadding === 'boolean') setLinkPadding(settings.linkPadding);
    if (typeof settings.fgFitMode === 'string') setFgFitMode(settings.fgFitMode);
    if (typeof settings.fgScale === 'number') setFgScale(settings.fgScale);
    if (typeof settings.enableCornerRadius === 'boolean') setEnableCornerRadius(settings.enableCornerRadius);
    if (typeof settings.cornerRadius === 'number') setCornerRadius(settings.cornerRadius);
    if (typeof settings.shadowBlur === 'number') setShadowBlur(settings.shadowBlur);
    if (typeof settings.shadowOpacity === 'number') setShadowOpacity(settings.shadowOpacity);
    if (typeof settings.shadowOffsetY === 'number') setShadowOffsetY(settings.shadowOffsetY);
    if (typeof settings.borderWidth === 'number') setBorderWidth(settings.borderWidth);
    if (typeof settings.borderColor === 'string') setBorderColor(settings.borderColor);
    if (typeof settings.exportFormat === 'string') setExportFormat(settings.exportFormat);
    if (typeof settings.jpegQuality === 'number') setJpegQuality(settings.jpegQuality);
    if (typeof settings.resolutionMode === 'string') setResolutionMode(settings.resolutionMode);
    if (typeof settings.scaleMultiplier === 'number') setScaleMultiplier(settings.scaleMultiplier);
    if (typeof settings.textEnabled === 'boolean') setTextEnabled(settings.textEnabled);
    if (typeof settings.textContent === 'string') setTextContent(settings.textContent);
    if (typeof settings.textFontFamily === 'string') setTextFontFamily(settings.textFontFamily);
    if (typeof settings.textFontSize === 'number') setTextFontSize(settings.textFontSize);
    if (typeof settings.textColor === 'string') setTextColor(settings.textColor);
    if (typeof settings.textBold === 'boolean') setTextBold(settings.textBold);
    if (typeof settings.textItalic === 'boolean') setTextItalic(settings.textItalic);
    if (typeof settings.textUppercase === 'boolean') setTextUppercase(settings.textUppercase);
    if (typeof settings.textAlign === 'string') setTextAlign(settings.textAlign);
    if (typeof settings.textPositionX === 'number') setTextPositionX(settings.textPositionX);
    if (typeof settings.textPositionY === 'number') setTextPositionY(settings.textPositionY);
    if (typeof settings.textBgStyle === 'string') setTextBgStyle(settings.textBgStyle);
    if (typeof settings.textShadow === 'boolean') setTextShadow(settings.textShadow);
    if (typeof settings.textStroke === 'boolean') setTextStroke(settings.textStroke);
  }, []);

  const handleResetText = () => {
    setTextEnabled(false);
    setTextContent('');
    setTextFontFamily('system-ui, -apple-system, sans-serif');
    setTextFontSize(44);
    setTextColor('#ffffff');
    setTextBold(true);
    setTextItalic(false);
    setTextUppercase(false);
    setTextAlign('center');
    setTextPositionX(50);
    setTextPositionY(85);
    setTextBgStyle('none');
    setTextShadow(true);
    setTextStroke(false);
    showToast('Text overlay reset to defaults');
  };

  // Snapshot of current active settings
  const currentSettings = {
    presetId: selectedPreset.id,
    customWidth,
    customHeight,
    blur,
    bgScale,
    darken,
    tintColor,
    bgSaturation,
    bgBrightness,
    showBackground,
    solidBackgroundColor,
    padding,
    paddingX,
    paddingY,
    linkPadding,
    fgFitMode,
    fgScale,
    enableCornerRadius,
    cornerRadius,
    shadowBlur,
    shadowOpacity,
    shadowOffsetY,
    borderWidth,
    borderColor,
    exportFormat,
    jpegQuality,
    resolutionMode,
    scaleMultiplier,
    textEnabled,
    textContent,
    textFontFamily,
    textFontSize,
    textColor,
    textBold,
    textItalic,
    textUppercase,
    textAlign,
    textPositionX,
    textPositionY,
    textBgStyle,
    textShadow,
    textStroke,
  };

  // Debounced auto-save of current settings as last-used
  useEffect(() => {
    const timer = setTimeout(() => {
      saveLastUsedSettings(currentSettings);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    selectedPreset.id,
    customWidth,
    customHeight,
    blur,
    bgScale,
    darken,
    tintColor,
    bgSaturation,
    bgBrightness,
    showBackground,
    solidBackgroundColor,
    padding,
    paddingX,
    paddingY,
    linkPadding,
    fgFitMode,
    fgScale,
    enableCornerRadius,
    cornerRadius,
    shadowBlur,
    shadowOpacity,
    shadowOffsetY,
    borderWidth,
    borderColor,
    exportFormat,
    jpegQuality,
    resolutionMode,
    scaleMultiplier,
    textEnabled,
    textContent,
    textFontFamily,
    textFontSize,
    textColor,
    textBold,
    textItalic,
    textUppercase,
    textAlign,
    textPositionX,
    textPositionY,
    textBgStyle,
    textShadow,
    textStroke,
  ]);

  const handleResetAll = () => {
    setImage(null);
    setTextEnabled(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1c1e] text-[#e1e1e0] font-sans pb-20 xs:pb-24 lg:pb-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-12 xs:top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 rounded-2xl bg-[#2a2a2c] text-[#e1e1e0] text-[11px] xs:text-xs font-semibold shadow-2xl shadow-black/60 border border-[#a9967f]/50 animate-fade-in max-w-[90vw] truncate">
          <Sparkles className="w-3.5 h-3.5 text-[#a9967f] flex-shrink-0" />
          <span className="truncate">{toast}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onReset={handleResetAll}
        hasImage={Boolean(image)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-1.5 xs:p-2.5 sm:p-5">
        {!image ? (
          <EmptyState
            onFileSelect={(file) => handleLoadImage(file, file.name)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 xs:gap-4 sm:gap-5 items-start">
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
                enableCornerRadius={enableCornerRadius}
                cornerRadius={cornerRadius}
                onToggleCorners={handleToggleCorners}
              />
            </div>

            {/* RIGHT COLUMN: Controls & Settings */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-5">
              {/* Desktop Sub-tabs */}
              <div className="hidden lg:flex rounded-2xl bg-[#252526] p-1 border border-[#3a3a3c]">
                <button
                  onClick={() => setMobileTab('preset')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'preset'
                      ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/20 font-extrabold'
                      : 'text-[#e1e1e0]/70 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>

                <button
                  onClick={() => setMobileTab('adjust')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'adjust'
                      ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/20 font-extrabold'
                      : 'text-[#e1e1e0]/70 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>

                <button
                  onClick={() => setMobileTab('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'text'
                      ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/20 font-extrabold'
                      : 'text-[#e1e1e0]/70 hover:text-white'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span className="flex items-center gap-1">
                    Text
                    {textEnabled && <span className="w-1.5 h-1.5 rounded-full bg-[#71b34f]" />}
                  </span>
                </button>

                <button
                  onClick={() => setMobileTab('export')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mobileTab === 'export'
                      ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/20 font-extrabold'
                      : 'text-[#e1e1e0]/70 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Dynamic Tab Content (Active on both desktop and mobile according to mobileTab) */}
              <div className="bg-[#2a2a2c] rounded-2xl sm:rounded-3xl p-2.5 xs:p-3.5 sm:p-5 border border-[#3a3a3c] shadow-2xl">
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
                    currentSettings={currentSettings}
                    onApplyPresetSettings={handleApplyPresetSettings}
                    onToast={showToast}
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
                    setPadding={handleSetPadding}
                    paddingX={paddingX}
                    setPaddingX={handleSetPaddingX}
                    paddingY={paddingY}
                    setPaddingY={handleSetPaddingY}
                    linkPadding={linkPadding}
                    setLinkPadding={setLinkPadding}
                    fgFitMode={fgFitMode}
                    setFgFitMode={setFgFitMode}
                    fgScale={fgScale}
                    setFgScale={setFgScale}
                    onFlushShortestSide={handleFlushShortestSide}
                    onClearAllMargins={handleClearAllMargins}
                    image={image}
                    previewDimensions={previewDimensions}
                    rotation={rotation}
                    enableCornerRadius={enableCornerRadius}
                    setEnableCornerRadius={setEnableCornerRadius}
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

                {mobileTab === 'text' && (
                  <TextOverlayPanel
                    textEnabled={textEnabled}
                    setTextEnabled={setTextEnabled}
                    textContent={textContent}
                    setTextContent={setTextContent}
                    textFontFamily={textFontFamily}
                    setTextFontFamily={setTextFontFamily}
                    textFontSize={textFontSize}
                    setTextFontSize={setTextFontSize}
                    textColor={textColor}
                    setTextColor={setTextColor}
                    textBold={textBold}
                    setTextBold={setTextBold}
                    textItalic={textItalic}
                    setTextItalic={setTextItalic}
                    textUppercase={textUppercase}
                    setTextUppercase={setTextUppercase}
                    textAlign={textAlign}
                    setTextAlign={setTextAlign}
                    textPositionX={textPositionX}
                    setTextPositionX={setTextPositionX}
                    textPositionY={textPositionY}
                    setTextPositionY={setTextPositionY}
                    textBgStyle={textBgStyle}
                    setTextBgStyle={setTextBgStyle}
                    textShadow={textShadow}
                    setTextShadow={setTextShadow}
                    textStroke={textStroke}
                    setTextStroke={setTextStroke}
                    onResetText={handleResetText}
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
                    exportFormat={exportFormat}
                    setExportFormat={setExportFormat}
                    jpegQuality={jpegQuality}
                    setJpegQuality={setJpegQuality}
                    resolutionMode={resolutionMode}
                    setResolutionMode={setResolutionMode}
                    scaleSlider={scaleMultiplier}
                    setScaleSlider={setScaleMultiplier}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens when image is loaded) */}
      {image && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1c1c1e]/95 backdrop-blur-xl border-t border-[#3a3a3c] px-1 xs:px-3 py-1 xs:py-1.5 safe-area-bottom flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setMobileTab('preset')}
            className={`flex-1 flex flex-col items-center gap-0.5 xs:gap-1 py-1 px-1 xs:px-2 rounded-xl transition-all ${
              mobileTab === 'preset'
                ? 'text-[#a9967f] font-extrabold scale-105'
                : 'text-[#e1e1e0]/50 hover:text-[#e1e1e0]'
            }`}
          >
            <Grid3X3 className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] font-medium tracking-wide">Presets</span>
          </button>

          <button
            onClick={() => setMobileTab('adjust')}
            className={`flex-1 flex flex-col items-center gap-0.5 xs:gap-1 py-1 px-1 xs:px-2 rounded-xl transition-all ${
              mobileTab === 'adjust'
                ? 'text-[#a9967f] font-extrabold scale-105'
                : 'text-[#e1e1e0]/50 hover:text-[#e1e1e0]'
            }`}
          >
            <Sliders className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] font-medium tracking-wide">Adjust</span>
          </button>

          <button
            onClick={() => setMobileTab('text')}
            className={`flex-1 flex flex-col items-center gap-0.5 xs:gap-1 py-1 px-1 xs:px-2 rounded-xl transition-all relative ${
              mobileTab === 'text'
                ? 'text-[#a9967f] font-extrabold scale-105'
                : 'text-[#e1e1e0]/50 hover:text-[#e1e1e0]'
            }`}
          >
            <div className="relative">
              <Type className="w-4 h-4 xs:w-5 xs:h-5" />
              {textEnabled && (
                <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-[#71b34f]" />
              )}
            </div>
            <span className="text-[9px] xs:text-[10px] font-medium tracking-wide">Text</span>
          </button>

          <button
            onClick={() => setMobileTab('export')}
            className={`flex-1 flex flex-col items-center gap-0.5 xs:gap-1 py-1 px-1 xs:px-2 rounded-xl transition-all ${
              mobileTab === 'export'
                ? 'text-[#a9967f] font-extrabold scale-105'
                : 'text-[#e1e1e0]/50 hover:text-[#e1e1e0]'
            }`}
          >
            <Download className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="text-[9px] xs:text-[10px] font-medium tracking-wide">Export</span>
          </button>
        </nav>
      )}
    </div>
  );
}
