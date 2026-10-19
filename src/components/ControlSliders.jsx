import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  Sparkles,
  Maximize2,
  Sun,
  Palette,
  Square,
  Shield,
  Eye,
  RotateCw,
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
          {/* Padding / Margin Slider */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Padding / Margin</span>
              <span className="font-mono text-indigo-400">{Math.round(padding * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.35"
              step="0.01"
              value={padding}
              onChange={(e) => setPadding(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Edge-to-Edge (0%)</span>
              <span>Classic (8%)</span>
              <span>Spacious (35%)</span>
            </div>
          </div>

          {/* Corner Rounding Slider + Quick Buttons */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Corner Rounding</span>
              <span className="font-mono text-indigo-400">{cornerRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="2"
              value={cornerRadius}
              onChange={(e) => setCornerRadius(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { label: 'Square', val: 0 },
                { label: 'Subtle', val: 16 },
                { label: 'Smooth', val: 32 },
                { label: 'Heavy', val: 56 },
                { label: 'Pill', val: 100 },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCornerRadius(c.val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    cornerRadius === c.val
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
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
