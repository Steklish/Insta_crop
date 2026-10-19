import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Palette,
  Square,
  Shield,
  Eye,
  RotateCw,
  Lock,
  Unlock,
  MoveHorizontal,
  MoveVertical,
  Minus,
  Plus,
  Zap,
  ZoomIn,
} from 'lucide-react';

export default function ControlSliders({
  // Background Props
  blur,
  setBlur,
  bgScale,
  setBgScale,
  darken,
  setDarken,
  tintColor,
  setTintColor,
  bgSaturation,
  setBgSaturation,
  bgBrightness,
  setBgBrightness,
  showBackground,
  setShowBackground,
  solidBackgroundColor,
  setSolidBackgroundColor,

  // Foreground Props
  padding,
  setPadding,
  paddingX,
  setPaddingX,
  paddingY,
  setPaddingY,
  linkPadding = true,
  setLinkPadding,
  fgFitMode = 'contain',
  setFgFitMode,
  fgScale = 1.0,
  setFgScale,
  onFlushShortestSide,
  onClearAllMargins,
  image,
  previewDimensions,
  rotation = 0,
  enableCornerRadius = true,
  setEnableCornerRadius,
  cornerRadius,
  setCornerRadius,
  shadowBlur,
  setShadowBlur,
  shadowOpacity,
  setShadowOpacity,
  shadowOffsetY,
  setShadowOffsetY,
  borderWidth,
  setBorderWidth,
  borderColor,
  setBorderColor,
  positionX,
  setPositionX,
  positionY,
  setPositionY,

  onResetDefaults,
}) {
  const [activeTab, setActiveTab] = useState('background'); // 'background' | 'foreground' | 'effects'

  const TINT_COLORS = [
    { label: 'Pitch Black', value: '#000000' },
    { label: 'Deep Slate', value: '#0f172a' },
    { label: 'Midnight Blue', value: '#0c1a30' },
    { label: 'Dark Violet', value: '#1e0c30' },
    { label: 'Clean White', value: '#ffffff' },
  ];

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
        <button
          onClick={() => setActiveTab('background')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'background'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Background</span>
        </button>

        <button
          onClick={() => setActiveTab('foreground')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'foreground'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Foreground</span>
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'effects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shadow & Border</span>
        </button>
      </div>

      {/* TAB 1: BACKGROUND CONTROLS */}
      {activeTab === 'background' && (
        <div className="space-y-4 animate-fade-in">
          {/* Toggle Blurred vs Solid */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200">Blurred Image Copy</span>
              <p className="text-[11px] text-slate-400">Scale and blur source image to cover canvas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBackground}
                onChange={(e) => setShowBackground(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {showBackground ? (
            <>
              {/* Blur Intensity */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Blur Intensity</span>
                  <span className="font-mono text-indigo-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="1"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Sharp (0px)</span>
                  <span>Soft (25px)</span>
                  <span>Ultra Fog (70px)</span>
                </div>
              </div>

              {/* Background Zoom / Scale */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Background Zoom</span>
                  <span className="font-mono text-indigo-400">{bgScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={bgScale}
                  onChange={(e) => setBgScale(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Fit Cover (1.0x)</span>
                  <span>Abstract Focus (2.5x)</span>
                </div>
              </div>

              {/* Darkener / Tint */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Background Dimmer / Tint</span>
                  <span className="font-mono text-indigo-400">{Math.round(darken * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.02"
                  value={darken}
                  onChange={(e) => setDarken(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                {/* Tint Color Swatches */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">Tint:</span>
                  <div className="flex items-center gap-1.5">
                    {TINT_COLORS.map((tc) => (
                      <button
                        key={tc.value}
                        type="button"
                        onClick={() => setTintColor(tc.value)}
                        className={`w-5 h-5 rounded-full border transition-all ${
                          tintColor === tc.value
                            ? 'ring-2 ring-indigo-500 border-white scale-110'
                            : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: tc.value }}
                        title={tc.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={tintColor}
                      onChange={(e) => setTintColor(e.target.value)}
                      className="w-6 h-6 rounded-md bg-transparent cursor-pointer border border-slate-700 p-0"
                      title="Custom Tint Color"
                    />
                  </div>
                </div>
              </div>

              {/* Saturation & Brightness */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300">
                    <span>Saturation</span>
                    <span className="font-mono text-indigo-400">{bgSaturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="5"
                    value={bgSaturation}
                    onChange={(e) => setBgSaturation(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300">
                    <span>Brightness</span>
                    <span className="font-mono text-indigo-400">{bgBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={bgBrightness}
                    onChange={(e) => setBgBrightness(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Solid Color Picker */
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Solid Canvas Color</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={solidBackgroundColor}
                  onChange={(e) => setSolidBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
                <input
                  type="text"
                  value={solidBackgroundColor}
                  onChange={(e) => setSolidBackgroundColor(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white uppercase"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FOREGROUND CONTROLS */}
      {activeTab === 'foreground' && (
        <div className="space-y-4 animate-fade-in">
          {/* Precise Margins & Framing Control */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3.5">
            {/* Header: Title, Metric Badge, and Link/Unlink Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">Margins & Spacing</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {linkPadding
                      ? `${(padding * 100).toFixed(1)}%`
                      : `X: ${(paddingX * 100).toFixed(1)}% • Y: ${(paddingY * 100).toFixed(1)}%`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set exact margins or eliminate padding from the shortest side
                </p>
              </div>

              {/* Link / Unlink Toggle Button */}
              <button
                type="button"
                onClick={() => setLinkPadding(!linkPadding)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  linkPadding
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={linkPadding ? 'Margins are linked (uniform). Click to separate X and Y' : 'Margins are separate. Click to link'}
              >
                {linkPadding ? <Lock className="w-3 h-3 text-indigo-400" /> : <Unlock className="w-3 h-3 text-amber-400" />}
                <span>{linkPadding ? 'Linked' : 'Separate X/Y'}</span>
              </button>
            </div>

            {/* Quick Action Buttons: Flush Shortest Side & Edge-to-Edge */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={onFlushShortestSide}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                title={`Eliminate margin from the shortest side completely (${
                  image
                    ? ((Math.abs(rotation) % 180 === 90 ? (image.naturalHeight || image.height) : (image.naturalWidth || image.width)) /
                        (Math.abs(rotation) % 180 === 90 ? (image.naturalWidth || image.width) : (image.naturalHeight || image.height)) >=
                      (previewDimensions?.width || 1080) / (previewDimensions?.height || 1080)
                        ? 'Horizontal / Sides'
                        : 'Vertical / Top & Bottom')
                    : 'Shortest Side'
                })`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Flush Shortest (0%)</span>
              </button>

              <button
                type="button"
                onClick={onClearAllMargins}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-[11px] font-semibold transition-all active:scale-95"
                title="Remove all margins on all sides (0% Full Bleed)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edge-to-Edge (0% All)</span>
              </button>
            </div>

            {/* Margin Inputs: Case 1 - Linked Uniform */}
            {linkPadding ? (
              <div className="space-y-2 pt-1 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Uniform Margin</span>
                  {/* Stepper + Number Input */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPadding(Math.max(0, parseFloat((padding - 0.01).toFixed(3))))}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Decrease margin by 1%"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5">
                      <input
                        type="number"
                        min="0"
                        max="45"
                        step="0.5"
                        value={parseFloat((padding * 100).toFixed(1))}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setPadding(isNaN(val) ? 0 : Math.max(0, Math.min(45, val)) / 100);
                        }}
                        className="w-12 bg-transparent text-right font-mono text-xs text-white focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 ml-0.5 font-mono">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPadding(Math.min(0.45, parseFloat((padding + 0.01).toFixed(3))))}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Increase margin by 1%"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="0.40"
                  step="0.005"
                  value={padding}
                  onChange={(e) => setPadding(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-0.5">
                  {[
                    { label: '0% Flush', val: 0 },
                    { label: '4%', val: 0.04 },
                    { label: '8% Std', val: 0.08 },
                    { label: '12%', val: 0.12 },
                    { label: '16%', val: 0.16 },
                    { label: '25%', val: 0.25 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setPadding(p.val)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors ${
                        Math.abs(padding - p.val) < 0.005
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Margin Inputs: Case 2 - Independent X and Y */
              <div className="space-y-3 pt-1 animate-fade-in">
                {/* Horizontal Margin (X) */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MoveHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-slate-300">Horizontal (Left & Right)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPaddingX(Math.max(0, parseFloat((paddingX - 0.01).toFixed(3))))}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
                        <input
                          type="number"
                          min="0"
                          max="45"
                          step="0.5"
                          value={parseFloat((paddingX * 100).toFixed(1))}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setPaddingX(isNaN(val) ? 0 : Math.max(0, Math.min(45, val)) / 100);
                          }}
                          className="w-10 bg-transparent text-right font-mono text-[11px] text-white focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 ml-0.5 font-mono">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaddingX(Math.min(0.45, parseFloat((paddingX + 0.01).toFixed(3))))}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaddingX(0)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          paddingX === 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title="Set horizontal margin to 0% (flush sides)"
                      >
                        0%
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.45"
                    step="0.005"
                    value={paddingX}
                    onChange={(e) => setPaddingX(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Vertical Margin (Y) */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MoveVertical className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-medium text-slate-300">Vertical (Top & Bottom)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPaddingY(Math.max(0, parseFloat((paddingY - 0.01).toFixed(3))))}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
                        <input
                          type="number"
                          min="0"
                          max="45"
                          step="0.5"
                          value={parseFloat((paddingY * 100).toFixed(1))}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setPaddingY(isNaN(val) ? 0 : Math.max(0, Math.min(45, val)) / 100);
                          }}
                          className="w-10 bg-transparent text-right font-mono text-[11px] text-white focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 ml-0.5 font-mono">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaddingY(Math.min(0.45, parseFloat((paddingY + 0.01).toFixed(3))))}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaddingY(0)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          paddingY === 0
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title="Set vertical margin to 0% (flush top/bottom)"
                      >
                        0%
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.45"
                    step="0.005"
                    value={paddingY}
                    onChange={(e) => setPaddingY(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Fit Mode & Foreground Zoom */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">Framing Fit Mode</span>
                <span className="text-[10px] text-slate-400">
                  {fgFitMode === 'contain' ? 'Fit Inside' : fgFitMode === 'fill-shortest' ? 'Flush Shortest Side' : 'Full Cover'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'contain', label: 'Contain', desc: 'Full photo' },
                  { id: 'fill-shortest', label: 'Flush Edge', desc: 'No gap on side' },
                  { id: 'cover', label: 'Cover', desc: 'Fill canvas' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFgFitMode(m.id)}
                    className={`py-1.5 px-2 rounded-xl text-center border transition-all ${
                      fgFitMode === m.id
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{m.label}</div>
                    <div className="text-[9px] text-slate-500 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Foreground Zoom */}
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3 h-3 text-indigo-400" />
                    <span>Photo Scale / Zoom</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-indigo-400">{fgScale.toFixed(2)}x</span>
                    {fgScale !== 1.0 && (
                      <button
                        type="button"
                        onClick={() => setFgScale(1.0)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 hover:text-white"
                      >
                        Reset 1x
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.02"
                  value={fgScale}
                  onChange={(e) => setFgScale(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Corner Rounding Control with ON/OFF Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            {/* Header with Title and Toggle Switch */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">Rounded Corners</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-colors ${
                      enableCornerRadius && cornerRadius > 0
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {enableCornerRadius && cornerRadius > 0
                      ? `${cornerRadius}px`
                      : 'OFF (Sharp 90°)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Smooth rounded borders or sharp crisp photo corners
                </p>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCornerRadius}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setEnableCornerRadius(next);
                    if (next && cornerRadius === 0) {
                      setCornerRadius(24);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {enableCornerRadius ? (
              <div className="space-y-2.5 pt-1 animate-fade-in">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-300">Radius Intensity</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={cornerRadius}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setCornerRadius(val);
                      }}
                      className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs text-right focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-slate-400 font-mono">px</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="140"
                  step="2"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                {/* Quick Radius Presets + Explicit Turn Off Button */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEnableCornerRadius(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50"
                    title="Turn off corner rounding and use sharp 90-degree square edges"
                  >
                    Turn Off (Sharp)
                  </button>

                  {[
                    { label: 'Subtle', val: 12 },
                    { label: 'Smooth', val: 24 },
                    { label: 'Card', val: 36 },
                    { label: 'Heavy', val: 56 },
                    { label: 'Pill', val: 100 },
                  ].map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => {
                        setEnableCornerRadius(true);
                        setCornerRadius(c.val);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                        enableCornerRadius && cornerRadius === c.val
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label} ({c.val}px)
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 flex items-center justify-between text-xs text-slate-400 animate-fade-in">
                <span>Corner rounding is turned OFF (sharp 90° edges).</span>
                <button
                  type="button"
                  onClick={() => {
                    setEnableCornerRadius(true);
                    if (cornerRadius === 0) setCornerRadius(24);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs border border-indigo-500/40 transition-colors"
                >
                  Turn On
                </button>
              </div>
            )}
          </div>

          {/* Position Offsets (Nudge) */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <span className="text-xs font-medium text-slate-300 block">Fine Position Alignment</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Horizontal (X)</span>
                  <span className="font-mono">{positionX}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={positionX}
                  onChange={(e) => setPositionX(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Vertical (Y)</span>
                  <span className="font-mono">{positionY}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={positionY}
                  onChange={(e) => setPositionY(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EFFECTS (SHADOW & BORDER) */}
      {activeTab === 'effects' && (
        <div className="space-y-4 animate-fade-in">
          {/* Drop Shadow Controls */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Drop Shadow Blur</span>
              <span className="font-mono text-indigo-400">{shadowBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="2"
              value={shadowBlur}
              onChange={(e) => setShadowBlur(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono">{Math.round(shadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.05"
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Elevation Y</span>
                  <span className="font-mono">{shadowOffsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="2"
                  value={shadowOffsetY}
                  onChange={(e) => setShadowOffsetY(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Foreground Border */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Picture Border</span>
              <span className="font-mono text-indigo-400">{borderWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={borderWidth}
              onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            {borderWidth > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Border Color:</span>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-7 h-7 rounded-md bg-transparent border border-slate-700 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-white"
                />
              </div>
            )}
          </div>

          {/* Reset Defaults button */}
          <div className="pt-2">
            <button
              onClick={onResetDefaults}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Reset Adjustments to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
