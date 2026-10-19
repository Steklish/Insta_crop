import React, { useState } from 'react';
import { ASPECT_RATIO_PRESETS } from '../constants/presets';
import { Lock, Unlock, Sliders, Check } from 'lucide-react';

export default function PresetSelector({
  selectedPreset,
  onSelectPreset,
  customWidth,
  customHeight,
  onChangeCustomWidth,
  onChangeCustomHeight,
  sourceDimensions,
}) {
  const [aspectLocked, setAspectLocked] = useState(true);

  const handleWidthChange = (val) => {
    const w = parseInt(val, 10) || 0;
    onChangeCustomWidth(w);
    if (aspectLocked && customWidth > 0) {
      const ratio = customHeight / customWidth;
      onChangeCustomHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val, 10) || 0;
    onChangeCustomHeight(h);
    if (aspectLocked && customHeight > 0) {
      const ratio = customWidth / customHeight;
      onChangeCustomWidth(Math.round(h * ratio));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Aspect Ratio Presets
        </h3>
        {sourceDimensions && (
          <span className="text-[11px] text-slate-500 font-mono">
            Source: {sourceDimensions.width}×{sourceDimensions.height}
          </span>
        )}
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ASPECT_RATIO_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
              }`}
            >
              {/* Badge if available */}
              {preset.badge && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {preset.badge}
                </span>
              )}

              <div className="flex items-center gap-1.5 w-full">
                <span
                  className={`text-sm font-extrabold ${
                    isSelected ? 'text-indigo-400' : 'text-white'
                  }`}
                >
                  {preset.label}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />}
              </div>

              <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate w-full">
                {preset.name}
              </div>

              <div className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                {preset.category}
              </div>

              {preset.width && preset.height && (
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {preset.width} × {preset.height}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Dimensions Editor */}
      {selectedPreset.id === 'custom' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Sliders className="w-3.5 h-3.5" />
              Custom Canvas Resolution
            </span>
            <button
              onClick={() => setAspectLocked(!aspectLocked)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                aspectLocked
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{aspectLocked ? 'Locked' : 'Unlocked'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="100"
                max="8000"
                value={customWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="100"
                max="8000"
                value={customHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Ratios for Custom */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 flex-shrink-0">Quick Ratios:</span>
            {[
              { label: '21:9', w: 2560, h: 1080 },
              { label: '2.39:1', w: 1920, h: 803 },
              { label: '5:4', w: 1350, h: 1080 },
              { label: '1:2', w: 1080, h: 2160 },
            ].map((qr) => (
              <button
                key={qr.label}
                onClick={() => {
                  onChangeCustomWidth(qr.w);
                  onChangeCustomHeight(qr.h);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono whitespace-nowrap transition-colors"
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
