import React, { useState } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  FileImage,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESOLUTION_SCALES, EXPORT_FORMATS } from '../constants/presets';
import {
  calculateCanvasDimensions,
  renderCanvas,
  exportCanvasAsBlob,
  downloadBlob,
  copyBlobToClipboard,
  shareImageFile,
} from '../utils/canvas';

export default function ExportPanel({
  image,
  preset,
  customWidth,
  customHeight,
  canvasProps,
  originalFilename,
}) {
  const [resolutionMode, setResolutionMode] = useState('1x');
  const [exportFormat, setExportFormat] = useState('image/png');
  const [jpegQuality, setJpegQuality] = useState(0.92);
  const [filename, setFilename] = useState(
    () => `instacrop-${preset.id.replace(':', '-')}-${Date.now().toString().slice(-4)}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Compute final dimensions based on selected resolution mode
  const exportDimensions = calculateCanvasDimensions({
    preset,
    customWidth,
    customHeight,
    sourceImage: image,
    resolutionMode,
  });

  const selectedFormatObj = EXPORT_FORMATS.find((f) => f.id === exportFormat) || EXPORT_FORMATS[0];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8'],
      });
    } catch (e) {
      // ignore
    }
  };

  const generateExportBlob = async () => {
    // Create an offscreen canvas with full target export dimensions
    const offscreen = document.createElement('canvas');
    offscreen.width = exportDimensions.width;
    offscreen.height = exportDimensions.height;

    renderCanvas({
      canvas: offscreen,
      image,
      targetWidth: exportDimensions.width,
      targetHeight: exportDimensions.height,
      baseWidth: exportDimensions.baseWidth,
      ...canvasProps,
    });

    const blob = await exportCanvasAsBlob(
      offscreen,
      exportFormat,
      exportFormat === 'image/jpeg' ? jpegQuality : 0.95
    );
    return blob;
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      setErrorMessage(null);
      const blob = await generateExportBlob();
      const fullFilename = `${filename.trim() || 'instacrop'}.${selectedFormatObj.ext}`;
      downloadBlob(blob, fullFilename);
      triggerConfetti();
    } catch (err) {
      console.error('Download failed:', err);
      setErrorMessage(err.message || 'Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    try {
      setIsExporting(true);
      setErrorMessage(null);
      const blob = await generateExportBlob();
      await copyBlobToClipboard(blob);
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      setErrorMessage(err.message || 'Clipboard copy not supported on this browser');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsExporting(true);
      setErrorMessage(null);
      const blob = await generateExportBlob();
      const fullFilename = `${filename.trim() || 'instacrop'}.${selectedFormatObj.ext}`;
      await shareImageFile(blob, fullFilename, `InstaCrop - ${preset.name}`);
      triggerConfetti();
    } catch (err) {
      if (err.name !== 'AbortError') {
        setErrorMessage(err.message || 'Sharing failed');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Export & Resolution
        </h3>
        <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
          {exportDimensions.width} × {exportDimensions.height} px
        </span>
      </div>

      {/* Resolution Multiplier / Target Mode */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RESOLUTION_SCALES.map((scale) => {
          const isSelected = resolutionMode === scale.id;
          return (
            <button
              key={scale.id}
              onClick={() => setResolutionMode(scale.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="text-xs font-bold">{scale.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight truncate">
                {scale.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Format & Quality */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
            File Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EXPORT_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setExportFormat(fmt.id)}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  exportFormat === fmt.id
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{fmt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* JPEG Quality Slider */}
        {exportFormat === 'image/jpeg' && (
          <div className="space-y-1 pt-1 animate-fade-in">
            <div className="flex justify-between text-[11px] font-medium text-slate-300">
              <span>JPEG Quality</span>
              <span className="font-mono text-indigo-400">{Math.round(jpegQuality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.0"
              step="0.02"
              value={jpegQuality}
              onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        )}

        {/* Filename Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Export Filename
          </label>
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 overflow-hidden px-3 py-1.5">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="bg-transparent text-white text-xs font-mono flex-1 focus:outline-none"
              placeholder="Filename"
            />
            <span className="text-slate-500 text-xs font-mono">.{selectedFormatObj.ext}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>
            {isExporting ? 'Generating High-Res Canvas...' : `Download ${selectedFormatObj.label} (${exportDimensions.width}×${exportDimensions.height})`}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Native Web Share Button (direct to Instagram / WhatsApp) */}
          <button
            onClick={handleNativeShare}
            disabled={isExporting}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            title="Share directly into Instagram, WhatsApp, or other apps"
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>Share to Apps</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyClipboard}
            disabled={isExporting}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-indigo-400" />
            )}
            <span>{copied ? 'Copied Image!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
