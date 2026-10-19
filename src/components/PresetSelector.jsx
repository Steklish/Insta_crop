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
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#e1e1e0]/60">
          Aspect Ratio Presets
        </h3>
        {sourceDimensions && (
          <span className="text-[11px] text-[#e1e1e0]/50 font-mono">
            Source: {sourceDimensions.width}×{sourceDimensions.height}
          </span>
        )}
      </div>

      {/* Preset Cards Grid (Mobile-friendly 2 cols on xs, 3 cols on sm+) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
        {ASPECT_RATIO_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`relative flex flex-col items-start p-2 xs:p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#a9967f]/15 border-[#a9967f] shadow-md shadow-[#a9967f]/10'
                  : 'bg-[#252526] border-[#3a3a3c] hover:border-[#4a4a4c] hover:bg-[#2a2a2c] text-[#e1e1e0]'
              }`}
            >
              {/* Badge if available */}
              {preset.badge && (
                <span className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 px-1 xs:px-1.5 py-0.2 rounded-full text-[8px] xs:text-[9px] font-bold uppercase tracking-wide bg-[#a9967f] text-[#1c1c1e]">
                  {preset.badge}
                </span>
              )}

              <div className="flex items-center gap-1 w-full">
                <span
                  className={`text-xs xs:text-sm font-extrabold ${
                    isSelected ? 'text-[#a9967f]' : 'text-[#e1e1e0]'
                  }`}
                >
                  {preset.label}
                </span>
                {isSelected && <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-[#a9967f] ml-auto" />}
              </div>

              <div className="text-[11px] xs:text-xs font-semibold text-[#e1e1e0] mt-0.5 truncate w-full">
                {preset.name}
              </div>

              <div className="text-[9px] xs:text-[10px] text-[#e1e1e0]/60 truncate w-full mt-0.5">
                {preset.category}
              </div>

              {preset.width && preset.height && (
                <div className="text-[9px] xs:text-[10px] font-mono text-[#e1e1e0]/50 mt-0.5 xs:mt-1">
                  {preset.width} × {preset.height}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Dimensions Editor */}
      {selectedPreset.id === 'custom' && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#252526] border border-[#a9967f]/40 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-[#e1e1e0]">
            <span className="flex items-center gap-1.5 text-[#a9967f]">
              <Sliders className="w-3.5 h-3.5" />
              Custom Canvas Resolution
            </span>
            <button
              onClick={() => setAspectLocked(!aspectLocked)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                aspectLocked
                  ? 'bg-[#a9967f]/20 text-[#a9967f] border border-[#a9967f]/30'
                  : 'bg-[#3a3a3c] text-[#e1e1e0]/60'
              }`}
            >
              {aspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{aspectLocked ? 'Locked' : 'Unlocked'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#e1e1e0]/60 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="100"
                max="8000"
                value={customWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#3a3a3c] border border-[#3a3a3c] text-[#e1e1e0] font-mono text-sm focus:outline-none focus:border-[#a9967f]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#e1e1e0]/60 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="100"
                max="8000"
                value={customHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#3a3a3c] border border-[#3a3a3c] text-[#e1e1e0] font-mono text-sm focus:outline-none focus:border-[#a9967f]"
              />
            </div>
          </div>

          {/* Quick Ratios for Custom */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 text-[11px]">
            <span className="text-[#e1e1e0]/50 flex-shrink-0">Quick Ratios:</span>
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
                className="px-2 py-0.5 rounded-lg bg-[#3a3a3c] hover:bg-[#4a4a4c] text-[#e1e1e0] text-[10px] font-mono whitespace-nowrap transition-colors"
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
