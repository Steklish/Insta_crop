import React from 'react';
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  CaseSensitive,
  Sparkles,
  MoveVertical,
  MoveHorizontal,
  Palette,
  Eye,
  EyeOff,
  Sun,
  Shield,
  Layers,
  RotateCcw,
} from 'lucide-react';

const FONT_FAMILIES = [
  { id: 'system-ui, -apple-system, sans-serif', name: 'Modern Sans (System)' },
  { id: 'Georgia, serif', name: 'Classic Serif (Georgia)' },
  { id: 'Impact, sans-serif', name: 'Bold Poster (Impact)' },
  { id: '"Courier New", Courier, monospace', name: 'Monospace (Courier)' },
  { id: '"Brush Script MT", cursive, sans-serif', name: 'Script (Handwritten)' },
];

const PRESET_COLORS = [
  '#ffffff',
  '#1c1c1e',
  '#a9967f',
  '#71b34f',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#a855f7',
];

const BG_BADGE_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'dark-pill', label: 'Dark Pill' },
  { id: 'light-pill', label: 'Light Pill' },
  { id: 'theme-pill', label: 'Titanium' },
  { id: 'gold-pill', label: 'Gold Pill' },
];

export default function TextOverlayPanel({
  textEnabled,
  setTextEnabled,
  textContent,
  setTextContent,
  textFontFamily,
  setTextFontFamily,
  textFontSize,
  setTextFontSize,
  textColor,
  setTextColor,
  textBold,
  setTextBold,
  textItalic,
  setTextItalic,
  textUppercase,
  setTextUppercase,
  textAlign,
  setTextAlign,
  textPositionX,
  setTextPositionX,
  textPositionY,
  setTextPositionY,
  textBgStyle,
  setTextBgStyle,
  textShadow,
  setTextShadow,
  textStroke,
  setTextStroke,
  onResetText,
}) {
  return (
    <div className="space-y-4 xs:space-y-5 animate-fade-in text-xs xs:text-sm">
      {/* Header & Master Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3a3a3c]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#3a3a3c] text-[#a9967f]">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm xs:text-base font-bold text-[#e1e1e0]">Text Overlay</h3>
            <p className="text-[10px] xs:text-xs text-[#e1e1e0]/60">Add watermark, captions, or title to canvas</p>
          </div>
        </div>

        <button
          onClick={() => setTextEnabled(!textEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
            textEnabled
              ? 'bg-[#a9967f] text-[#1c1c1e] shadow-md shadow-[#a9967f]/30'
              : 'bg-[#3a3a3c] text-[#e1e1e0]/60 hover:text-white'
          }`}
        >
          {textEnabled ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Enabled</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Disabled</span>
            </>
          )}
        </button>
      </div>

      {!textEnabled ? (
        <div className="p-6 text-center rounded-2xl bg-[#252526] border border-[#3a3a3c] text-[#e1e1e0]/60 space-y-3">
          <Type className="w-8 h-8 mx-auto text-[#a9967f]/50" />
          <p className="text-xs xs:text-sm font-medium">Text overlay is currently turned off.</p>
          <button
            onClick={() => {
              setTextEnabled(true);
              if (!textContent) setTextContent('InstaCrop');
            }}
            className="px-4 py-2 rounded-xl bg-[#a9967f] text-[#1c1c1e] font-extrabold text-xs shadow-md transition-all hover:brightness-110 active:scale-95 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enable Text on Image</span>
          </button>
        </div>
      ) : (
        <>
          {/* Text Input Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] xs:text-xs font-bold text-[#e1e1e0]/80">
                Text Content
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTextContent('')}
                  className="text-[10px] text-[#e1e1e0]/50 hover:text-[#e1e1e0] px-1.5 py-0.5 rounded transition"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Type your caption or watermark here... (multiline supported)"
              rows={2}
              className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl px-3 py-2 text-xs xs:text-sm text-[#e1e1e0] placeholder-[#e1e1e0]/30 focus:outline-none focus:border-[#a9967f] transition-all resize-none"
            />

            {/* Quick Text Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['InstaCrop', `© ${new Date().getFullYear()}`, 'Shot on Phone', 'Swipe Left ➔'].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => setTextContent(phrase)}
                  className="text-[10px] bg-[#3a3a3c]/70 hover:bg-[#3a3a3c] text-[#e1e1e0]/80 hover:text-white px-2 py-1 rounded-lg border border-[#3a3a3c] transition-all active:scale-95"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Controls */}
          <div className="p-3 rounded-2xl bg-[#252526] border border-[#3a3a3c] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#e1e1e0]/80 uppercase tracking-wider">Typography</span>
              <span className="text-[10px] text-[#a9967f] font-mono">{textFontSize}px</span>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-[10px] text-[#e1e1e0]/60 block mb-1">Font Family</label>
              <select
                value={textFontFamily}
                onChange={(e) => setTextFontFamily(e.target.value)}
                className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-xl px-2.5 py-1.5 text-xs text-[#e1e1e0] focus:outline-none focus:border-[#a9967f]"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.id} value={font.id} className="bg-[#2a2a2c] text-[#e1e1e0]">
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#e1e1e0]/70">
                <span>Font Size</span>
                <span>{textFontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="120"
                step="1"
                value={textFontSize}
                onChange={(e) => setTextFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#a9967f]"
              />
            </div>

            {/* Style Toggles: Bold, Italic, Uppercase, Alignment */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Weight & Style */}
              <div className="flex items-center gap-1 bg-[#1c1c1e] p-1 rounded-xl border border-[#3a3a3c]">
                <button
                  type="button"
                  onClick={() => setTextBold(!textBold)}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                    textBold ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextItalic(!textItalic)}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                    textItalic ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextUppercase(!textUppercase)}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                    textUppercase ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="ALL CAPS"
                >
                  <span className="text-[10px] font-black">AA</span>
                </button>
              </div>

              {/* Text Align */}
              <div className="flex items-center gap-1 bg-[#1c1c1e] p-1 rounded-xl border border-[#3a3a3c]">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs transition-all ${
                    textAlign === 'left' ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs transition-all ${
                    textAlign === 'center' ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs transition-all ${
                    textAlign === 'right' ? 'bg-[#a9967f] text-[#1c1c1e]' : 'text-[#e1e1e0]/60 hover:text-white'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Position Controls */}
          <div className="p-3 rounded-2xl bg-[#252526] border border-[#3a3a3c] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#e1e1e0]/80 uppercase tracking-wider">Position</span>
              {/* Quick Position Snap Buttons */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTextPositionY(15);
                    setTextPositionX(50);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#3a3a3c] hover:bg-[#a9967f] hover:text-[#1c1c1e] text-[#e1e1e0] transition-colors"
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextPositionY(50);
                    setTextPositionX(50);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#3a3a3c] hover:bg-[#a9967f] hover:text-[#1c1c1e] text-[#e1e1e0] transition-colors"
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTextPositionY(85);
                    setTextPositionX(50);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#3a3a3c] hover:bg-[#a9967f] hover:text-[#1c1c1e] text-[#e1e1e0] transition-colors"
                >
                  Bottom
                </button>
              </div>
            </div>

            {/* Vertical Y Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#e1e1e0]/70">
                <span className="flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-[#a9967f]" /> Vertical Position (Y)
                </span>
                <span>{Math.round(textPositionY)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={textPositionY}
                onChange={(e) => setTextPositionY(Number(e.target.value))}
                className="w-full h-1.5 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#a9967f]"
              />
            </div>

            {/* Horizontal X Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#e1e1e0]/70">
                <span className="flex items-center gap-1">
                  <MoveHorizontal className="w-3 h-3 text-[#a9967f]" /> Horizontal Position (X)
                </span>
                <span>{Math.round(textPositionX)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={textPositionX}
                onChange={(e) => setTextPositionX(Number(e.target.value))}
                className="w-full h-1.5 bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#a9967f]"
              />
            </div>
          </div>

          {/* Color & Visual Styles */}
          <div className="p-3 rounded-2xl bg-[#252526] border border-[#3a3a3c] space-y-3">
            <span className="text-[11px] font-bold text-[#e1e1e0]/80 uppercase tracking-wider">Appearance</span>

            {/* Text Color Chips */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#e1e1e0]/60 block">Text Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setTextColor(col)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      textColor.toLowerCase() === col.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-[#a9967f]'
                        : 'border-[#3a3a3c] hover:scale-105'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
                {/* Custom Color Input */}
                <label className="relative flex items-center justify-center w-6 h-6 rounded-full border border-[#3a3a3c] bg-[#1c1c1e] cursor-pointer hover:border-[#a9967f]">
                  <Palette className="w-3 h-3 text-[#e1e1e0]" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            {/* Background Badge / Pill Style */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] text-[#e1e1e0]/60 block">Badge / Pill Background</label>
              <div className="grid grid-cols-3 xs:grid-cols-5 gap-1.5">
                {BG_BADGE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setTextBgStyle(style.id)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold border transition-all text-center truncate ${
                      textBgStyle === style.id
                        ? 'bg-[#a9967f] text-[#1c1c1e] border-[#a9967f] font-bold'
                        : 'bg-[#1c1c1e] text-[#e1e1e0]/70 border-[#3a3a3c] hover:text-white'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow & Outline Contrast Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTextShadow(!textShadow)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                  textShadow
                    ? 'bg-[#3a3a3c] text-[#a9967f] border-[#a9967f]'
                    : 'bg-[#1c1c1e] text-[#e1e1e0]/60 border-[#3a3a3c]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Drop Shadow</span>
              </button>

              <button
                type="button"
                onClick={() => setTextStroke(!textStroke)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                  textStroke
                    ? 'bg-[#3a3a3c] text-[#a9967f] border-[#a9967f]'
                    : 'bg-[#1c1c1e] text-[#e1e1e0]/60 border-[#3a3a3c]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Text Outline</span>
              </button>
            </div>
          </div>

          {/* Reset Text Defaults */}
          {onResetText && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={onResetText}
                className="flex items-center gap-1 text-[11px] text-[#e1e1e0]/50 hover:text-[#e1e1e0] transition-colors py-1 px-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Text Settings</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
