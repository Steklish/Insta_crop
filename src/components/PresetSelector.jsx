import React, { useState, useRef } from 'react';
import { ASPECT_RATIO_PRESETS } from '../constants/presets';
import {
  Lock,
  Unlock,
  Sliders,
  Check,
  Bookmark,
  Plus,
  Download,
  Trash2,
  FolderInput,
  X,
  FileJson,
} from 'lucide-react';
import {
  loadCustomPresets,
  saveCustomPreset,
  deleteCustomPreset,
  exportPresetToFile,
  importPresetsFromFile,
} from '../utils/presetStorage';

export default function PresetSelector({
  selectedPreset,
  onSelectPreset,
  customWidth,
  customHeight,
  onChangeCustomWidth,
  onChangeCustomHeight,
  sourceDimensions,
  currentSettings,
  onApplyPresetSettings,
  onToast,
}) {
  const [aspectLocked, setAspectLocked] = useState(true);
  const [customPresets, setCustomPresets] = useState(() => loadCustomPresets());
  const [isNamingPreset, setIsNamingPreset] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const fileInputRef = useRef(null);

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

  const handleSavePreset = () => {
    const name = presetNameInput.trim();
    if (!name) {
      if (onToast) onToast('Please enter a name for your preset');
      return;
    }
    try {
      const updated = saveCustomPreset(name, currentSettings);
      setCustomPresets(updated);
      setIsNamingPreset(false);
      setPresetNameInput('');
      if (onToast) onToast(`Saved preset "${name}" to device`);
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to save preset');
    }
  };

  const handleApplyCustomPreset = (preset) => {
    if (onApplyPresetSettings && preset.settings) {
      onApplyPresetSettings(preset.settings);
      if (onToast) onToast(`Loaded preset "${preset.name}"`);
    }
  };

  const handleExportPreset = (e, preset) => {
    e.stopPropagation();
    try {
      exportPresetToFile(preset);
      if (onToast) onToast(`Saved "${preset.name}.json" to Downloads`);
    } catch (err) {
      if (onToast) onToast('Failed to export preset file');
    }
  };

  const handleDeletePreset = (e, presetId, name) => {
    e.stopPropagation();
    const updated = deleteCustomPreset(presetId);
    setCustomPresets(updated);
    if (onToast) onToast(`Deleted preset "${name}"`);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importPresetsFromFile(file);
      if (result.type === 'single' && result.preset) {
        const updated = saveCustomPreset(result.preset.name, result.preset.settings);
        setCustomPresets(updated);
        if (onApplyPresetSettings && result.preset.settings) {
          onApplyPresetSettings(result.preset.settings);
        }
        if (onToast) onToast(`Imported & applied preset "${result.preset.name}"!`);
      } else if (result.type === 'collection' && Array.isArray(result.presets)) {
        let currentList = customPresets;
        for (const p of result.presets) {
          currentList = saveCustomPreset(p.name, p.settings);
        }
        setCustomPresets(currentList);
        if (onToast) onToast(`Imported ${result.presets.length} presets from file!`);
      }
    } catch (err) {
      console.error('Import failed:', err);
      if (onToast) onToast(err.message || 'Failed to import preset file');
    } finally {
      // Clear input so same file can be reloaded if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Custom Presets (Saved to Device Storage & File Import/Export) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#252526] border border-[#3a3a3c] space-y-2.5">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#a9967f]" />
            <h4 className="text-xs font-bold text-[#e1e1e0]">My Saved Presets</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#3a3a3c] text-[#a9967f]">
              {customPresets.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsNamingPreset(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#a9967f] hover:bg-[#7b7061] text-[#1c1c1e] text-[11px] font-bold transition-all shadow-sm active:scale-95"
              title="Save current aspect and adjustment settings as a preset on this phone"
            >
              <Plus className="w-3 h-3" />
              <span>Save Current</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#3a3a3c] hover:bg-[#4a4a4c] text-[#e1e1e0] text-[11px] font-medium transition-all active:scale-95"
              title="Import a .json preset file from Android Downloads/Files"
            >
              <FolderInput className="w-3 h-3 text-[#a9967f]" />
              <span className="hidden xs:inline">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        </div>

        {/* Inline Save Preset Form */}
        {isNamingPreset && (
          <div className="p-2.5 rounded-xl bg-[#1c1c1e] border border-[#a9967f]/40 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-[#e1e1e0]">
              <span>Name Your Custom Preset</span>
              <button
                onClick={() => {
                  setIsNamingPreset(false);
                  setPresetNameInput('');
                }}
                className="text-[#a0a0a0] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={presetNameInput}
                onChange={(e) => setPresetNameInput(e.target.value)}
                placeholder="e.g., Clean White 4:5, Dark Blur Reel"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePreset();
                  if (e.key === 'Escape') setIsNamingPreset(false);
                }}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#2a2a2c] border border-[#3a3a3c] text-[#e1e1e0] text-xs focus:outline-none focus:border-[#a9967f]"
              />
              <button
                onClick={handleSavePreset}
                className="px-3 py-1.5 rounded-lg bg-[#a9967f] hover:bg-[#7b7061] text-[#1c1c1e] text-xs font-bold transition-all active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Custom Presets Grid */}
        {customPresets.length === 0 ? (
          <p className="text-[11px] text-[#a0a0a0] py-0.5">
            Tap <strong className="text-[#e1e1e0]">+ Save Current</strong> to store your favorite margins, blur, and aspect settings, or <strong className="text-[#e1e1e0]">Import</strong> a .json file from your device.
          </p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
            {customPresets.map((cp) => (
              <div
                key={cp.id}
                onClick={() => handleApplyCustomPreset(cp)}
                className="group relative flex items-center justify-between p-2 rounded-xl bg-[#1c1c1e] hover:bg-[#2a2a2c] border border-[#3a3a3c] hover:border-[#a9967f]/60 cursor-pointer transition-all active:scale-[0.98]"
              >
                <div className="min-w-0 pr-1 flex-1">
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-xs font-bold text-[#e1e1e0] truncate group-hover:text-[#a9967f]">
                      {cp.name}
                    </span>
                    {cp.settings?.presetId && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#3a3a3c] text-[#a9967f] flex-shrink-0">
                        {cp.settings.presetId}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#a0a0a0] truncate mt-0.5">
                    Blur: {cp.settings?.blur ?? 28} • Margin: {Math.round((cp.settings?.padding ?? 0.08) * 100)}%
                  </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={(e) => handleExportPreset(e, cp)}
                    className="p-1 rounded-md text-[#a0a0a0] hover:text-[#a9967f] hover:bg-[#3a3a3c] transition-colors"
                    title="Export preset to .json file in Downloads"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeletePreset(e, cp.id, cp.name)}
                    className="p-1 rounded-md text-[#a0a0a0] hover:text-[#F44336] hover:bg-[#F44336]/20 transition-colors"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Standard Aspect Ratio Presets */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#e1e1e0]/60">
          Standard Aspect Ratios
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
