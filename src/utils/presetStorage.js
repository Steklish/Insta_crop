// Local preset management and file import/export utilities for InstaCrop
import { downloadBlob } from './canvas';

const LAST_USED_STORAGE_KEY = 'instacrop_last_used_v1';
const CUSTOM_PRESETS_STORAGE_KEY = 'instacrop_saved_presets_v1';

export const DEFAULT_PRESET_SETTINGS = {
  presetId: '4:5',
  customWidth: 1080,
  customHeight: 1350,
  blur: 28,
  bgScale: 1.25,
  darken: 0.25,
  tintColor: '#000000',
  bgSaturation: 120,
  bgBrightness: 95,
  showBackground: true,
  solidBackgroundColor: '#0b0f19',
  padding: 0.08,
  paddingX: 0.08,
  paddingY: 0.08,
  linkPadding: true,
  fgFitMode: 'contain',
  fgScale: 1.0,
  enableCornerRadius: true,
  cornerRadius: 24,
  shadowBlur: 32,
  shadowOpacity: 0.45,
  shadowOffsetY: 12,
  borderWidth: 0,
  borderColor: '#ffffff',
  exportFormat: 'image/png',
  jpegQuality: 0.92,
  resolutionMode: '1x',
  scaleMultiplier: 1.0,
  textEnabled: false,
  textContent: '',
  textFontFamily: 'system-ui, -apple-system, sans-serif',
  textFontSize: 44,
  textColor: '#ffffff',
  textBold: true,
  textItalic: false,
  textUppercase: false,
  textAlign: 'center',
  textPositionX: 50,
  textPositionY: 85,
  textBgStyle: 'none',
  textShadow: true,
  textStroke: false,
};

/**
 * Load last used settings from device localStorage
 */
export function loadLastUsedSettings() {
  try {
    const raw = localStorage.getItem(LAST_USED_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Text overlay should always remain inactive by default on startup
    return { ...DEFAULT_PRESET_SETTINGS, ...parsed, textEnabled: false };
  } catch (e) {
    console.warn('Failed to load last used settings:', e);
    return null;
  }
}

/**
 * Save current settings to device localStorage as last-used
 */
export function saveLastUsedSettings(settings) {
  try {
    localStorage.setItem(LAST_USED_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save last used settings:', e);
  }
}

/**
 * Load all saved custom presets from device localStorage
 */
export function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn('Failed to load custom presets:', e);
    return [];
  }
}

/**
 * Save a new or updated custom preset to device storage
 */
export function saveCustomPreset(name, settings) {
  const presets = loadCustomPresets();
  const cleanName = (name || '').trim() || `Preset ${presets.length + 1}`;
  
  const newPreset = {
    id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    createdAt: new Date().toISOString(),
    settings: {
      ...DEFAULT_PRESET_SETTINGS,
      ...settings,
    },
  };

  const updated = [newPreset, ...presets];
  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save preset to storage:', e);
    throw new Error('Device storage is full or disabled.');
  }
  return updated;
}

/**
 * Delete a custom preset by ID
 */
export function deleteCustomPreset(presetId) {
  const presets = loadCustomPresets();
  const updated = presets.filter((p) => p.id !== presetId);
  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete preset from storage:', e);
  }
  return updated;
}

/**
 * Export a single preset as a downloadable .json file (Android Downloads / Files)
 */
export function exportPresetToFile(preset) {
  const exportData = {
    format: 'instacrop-preset',
    version: '2.2.0',
    exportedAt: new Date().toISOString(),
    preset: {
      name: preset.name,
      settings: preset.settings,
    },
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const filename = `${(preset.name || 'preset').toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.instacrop.json`;
  downloadBlob(blob, filename);
}

/**
 * Export all presets to a backup file
 */
export function exportAllPresetsToFile(presets) {
  const exportData = {
    format: 'instacrop-presets-collection',
    version: '2.2.0',
    exportedAt: new Date().toISOString(),
    presets: presets.map((p) => ({
      name: p.name,
      settings: p.settings,
    })),
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, 'instacrop-presets-all.json');
}

/**
 * Parse an imported JSON file from local device
 */
export async function importPresetsFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Check if single preset or collection
        if (data.format === 'instacrop-preset' && data.preset) {
          resolve({
            type: 'single',
            preset: data.preset,
          });
        } else if (data.format === 'instacrop-presets-collection' && Array.isArray(data.presets)) {
          resolve({
            type: 'collection',
            presets: data.presets,
          });
        } else if (data.settings && (data.name || data.id)) {
          // Plain preset structure
          resolve({
            type: 'single',
            preset: { name: data.name || 'Imported Preset', settings: data.settings },
          });
        } else if (typeof data === 'object' && ('blur' in data || 'padding' in data)) {
          // Direct settings object
          resolve({
            type: 'single',
            preset: { name: file.name.replace(/\.[^/.]+$/, ''), settings: data },
          });
        } else {
          reject(new Error('Unrecognized preset file format'));
        }
      } catch (err) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from storage'));
    reader.readAsText(file);
  });
}
