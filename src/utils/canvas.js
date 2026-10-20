/**
 * Canvas utility & rendering engine for InstaCrop
 */

export function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  if (!radius || radius <= 0) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    return;
  }

  const maxRadius = Math.min(width / 2, height / 2);
  const r = Math.max(0, Math.min(radius, maxRadius));

  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Calculates target canvas dimensions based on preset, custom inputs, and scale mode
 */
export function calculateCanvasDimensions({
  preset,
  customWidth = 1080,
  customHeight = 1080,
  sourceImage,
  scaleMultiplier = 1,
  resolutionMode = '1x',
  customExportWidth = null,
  customExportHeight = null,
}) {
  let baseW = 1080;
  let baseH = 1080;

  if (preset.id === 'original' && sourceImage) {
    baseW = sourceImage.naturalWidth || sourceImage.width || 1080;
    baseH = sourceImage.naturalHeight || sourceImage.height || 1080;
  } else if (preset.id === 'custom') {
    baseW = parseInt(customWidth, 10) || 1080;
    baseH = parseInt(customHeight, 10) || 1080;
  } else {
    baseW = preset.width || 1080;
    baseH = preset.height || 1080;
  }

  let finalW = baseW;
  let finalH = baseH;

  if (resolutionMode === 'custom' && customExportWidth && customExportHeight) {
    finalW = Math.max(32, parseInt(customExportWidth, 10) || baseW);
    finalH = Math.max(32, parseInt(customExportHeight, 10) || baseH);
  } else if (resolutionMode === '0.5x') {
    finalW = Math.round(baseW * 0.5);
    finalH = Math.round(baseH * 0.5);
  } else if (resolutionMode === '1.5x') {
    finalW = Math.round(baseW * 1.5);
    finalH = Math.round(baseH * 1.5);
  } else if (resolutionMode === '2x') {
    finalW = Math.round(baseW * 2);
    finalH = Math.round(baseH * 2);
  } else if (resolutionMode === '3x') {
    finalW = Math.round(baseW * 3);
    finalH = Math.round(baseH * 3);
  } else if (resolutionMode === '4x') {
    finalW = Math.round(baseW * 4);
    finalH = Math.round(baseH * 4);
  } else if (resolutionMode === '720p') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 1280 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === '1080p') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 1920 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === '1440p' || resolutionMode === '2k') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 2560 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === '4k') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 3840 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === '8k') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 7680 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === 'native' && sourceImage) {
    const srcMax = Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight);
    const baseMax = Math.max(baseW, baseH);
    const factor = srcMax / baseMax;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (typeof scaleMultiplier === 'number' && scaleMultiplier > 0) {
    finalW = Math.round(baseW * scaleMultiplier);
    finalH = Math.round(baseH * scaleMultiplier);
  } else {
    finalW = Math.round(baseW);
    finalH = Math.round(baseH);
  }

  // Ensure minimum dimensions
  finalW = Math.max(32, finalW);
  finalH = Math.max(32, finalH);

  return {
    width: finalW,
    height: finalH,
    baseWidth: baseW,
    baseHeight: baseH,
    aspectRatio: finalW / finalH,
  };
}

/**
 * Advanced Canvas Processing Engine
 */
export function renderCanvas({
  canvas,
  image,
  targetWidth,
  targetHeight,
  baseWidth = 1080,
  blur = 28,
  bgScale = 1.25,
  darken = 0.25,
  tintColor = '#000000',
  bgSaturation = 120,
  bgBrightness = 95,
  padding = 0.08, // fallback uniform padding
  paddingX = null, // precise horizontal margin (0.0 to 0.5)
  paddingY = null, // precise vertical margin (0.0 to 0.5)
  fgFitMode = 'contain', // 'contain' | 'cover' | 'fill-shortest'
  fgScale = 1.0, // foreground zoom/scale multiplier
  enableCornerRadius = true,
  cornerRadius = 24,
  shadowBlur = 32,
  shadowOpacity = 0.45,
  shadowOffsetY = 12,
  borderWidth = 0,
  borderColor = '#ffffff',
  rotation = 0,
  flipH = false,
  flipV = false,
  positionX = 0, // -50 to 50
  positionY = 0,
  showBackground = true,
  solidBackgroundColor = '#0b0f19',
  // Text Overlay Props
  textEnabled = false,
  textContent = '',
  textFontFamily = 'system-ui, -apple-system, sans-serif',
  textFontSize = 44,
  textColor = '#ffffff',
  textBold = true,
  textItalic = false,
  textUppercase = false,
  textAlign = 'center',
  textPositionX = 50,
  textPositionY = 85,
  textBgStyle = 'none',
  textShadow = true,
  textStroke = false,
}) {
  if (!canvas || !image) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) return;

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.clearRect(0, 0, targetWidth, targetHeight);

  // Proportional scale factor for blur, radius, and shadows
  const scaleFactor = targetWidth / (baseWidth || 1080);
  const actualBlur = Math.max(0, blur * scaleFactor);
  const actualRadius = enableCornerRadius && cornerRadius > 0 ? Math.max(0, cornerRadius * scaleFactor) : 0;
  const actualShadowBlur = Math.max(0, shadowBlur * scaleFactor);
  const actualShadowOffsetY = shadowOffsetY * scaleFactor;
  const actualBorderWidth = Math.max(0, borderWidth * scaleFactor);

  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;

  // ==========================================
  // 1. BACKGROUND LAYER (Blurred & Scaled Cover)
  // ==========================================
  if (showBackground) {
    // Fill background base color
    ctx.fillStyle = solidBackgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    // Calculate Cover Scale with extra zoom
    const coverScale = Math.max(targetWidth / imgW, targetHeight / imgH) * Math.max(1.0, bgScale);
    const bgDrawW = imgW * coverScale;
    const bgDrawH = imgH * coverScale;
    const bgDrawX = (targetWidth - bgDrawW) / 2;
    const bgDrawY = (targetHeight - bgDrawH) / 2;

    // Apply Filter for blur, saturation, and brightness
    const filterParts = [];
    if (actualBlur > 0) filterParts.push(`blur(${actualBlur.toFixed(1)}px)`);
    if (bgBrightness !== 100) filterParts.push(`brightness(${bgBrightness}%)`);
    if (bgSaturation !== 100) filterParts.push(`saturate(${bgSaturation}%)`);

    ctx.filter = filterParts.length > 0 ? filterParts.join(' ') : 'none';

    // Draw the blurred background cover
    ctx.drawImage(image, bgDrawX, bgDrawY, bgDrawW, bgDrawH);
    ctx.filter = 'none';
    ctx.restore();

    // Darkener / Tint Overlay
    if (darken > 0) {
      ctx.save();
      ctx.fillStyle = tintColor;
      ctx.globalAlpha = Math.min(1, Math.max(0, darken));
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.restore();
    }
  } else {
    // Solid background
    ctx.fillStyle = solidBackgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // ==========================================
  // 2. FOREGROUND LAYER (Centered & Scaled Contain)
  // ==========================================
  ctx.save();

  // Determine rotated dimensions to fit properly inside padding
  const isRotatedQuarter = (Math.abs(rotation) % 180) === 90;
  const effectiveImgW = isRotatedQuarter ? imgH : imgW;
  const effectiveImgH = isRotatedQuarter ? imgW : imgH;

  // Resolve precise margins: allow exact 0 (flush to edge)
  const padX = typeof paddingX === 'number' ? Math.max(0, Math.min(0.5, paddingX)) : (typeof padding === 'number' ? Math.max(0, Math.min(0.5, padding)) : 0.08);
  const padY = typeof paddingY === 'number' ? Math.max(0, Math.min(0.5, paddingY)) : (typeof padding === 'number' ? Math.max(0, Math.min(0.5, padding)) : 0.08);

  const paddedWidth = targetWidth * Math.max(0.0, 1 - padX * 2);
  const paddedHeight = targetHeight * Math.max(0.0, 1 - padY * 2);

  // Calculate base scale according to fit mode
  let baseScale;
  if (fgFitMode === 'cover') {
    // Fills entire padded area
    baseScale = Math.max(paddedWidth / effectiveImgW, paddedHeight / effectiveImgH);
  } else if (fgFitMode === 'fill-shortest') {
    // Scales foreground up so the side with larger margin touches the edge (eliminates shortest side margin completely)
    baseScale = Math.max(targetWidth / effectiveImgW, targetHeight / effectiveImgH);
  } else {
    // Standard contain: fits entirely inside padded box
    baseScale = Math.min(paddedWidth / effectiveImgW, paddedHeight / effectiveImgH);
  }

  const containScale = baseScale * (typeof fgScale === 'number' && fgScale > 0 ? fgScale : 1.0);
  const fgDrawW = imgW * containScale;
  const fgDrawH = imgH * containScale;

  // Center position with offsets
  const centerX = targetWidth / 2 + (positionX / 100) * targetWidth;
  const centerY = targetHeight / 2 + (positionY / 100) * targetHeight;

  // Transform coordinates to image center
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  const drawX = -fgDrawW / 2;
  const drawY = -fgDrawH / 2;

  // A. Drop Shadow
  if (actualShadowBlur > 0 && shadowOpacity > 0) {
    ctx.save();
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = actualShadowBlur;
    ctx.shadowOffsetX = 0;
    // Invert Y offset if vertically flipped
    ctx.shadowOffsetY = flipV ? -actualShadowOffsetY : actualShadowOffsetY;

    ctx.fillStyle = '#000000';
    drawRoundedRectPath(ctx, drawX, drawY, fgDrawW, fgDrawH, actualRadius);
    ctx.fill();
    ctx.restore();
  }

  // B. Draw Clipped Foreground Image
  ctx.save();
  drawRoundedRectPath(ctx, drawX, drawY, fgDrawW, fgDrawH, actualRadius);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, fgDrawW, fgDrawH);
  ctx.restore();

  // C. Foreground Border
  if (actualBorderWidth > 0) {
    ctx.save();
    drawRoundedRectPath(ctx, drawX, drawY, fgDrawW, fgDrawH, actualRadius);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = actualBorderWidth;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  // ==========================================
  // 3. TEXT OVERLAY LAYER
  // ==========================================
  if (textEnabled && textContent && textContent.trim().length > 0) {
    ctx.save();

    const actualFontSize = Math.max(10, (textFontSize || 44) * scaleFactor);
    const weight = textBold ? 'bold' : 'normal';
    const style = textItalic ? 'italic' : 'normal';
    const family = textFontFamily || 'system-ui, -apple-system, sans-serif';

    ctx.font = `${style} ${weight} ${actualFontSize}px ${family}`;

    let processedText = textContent;
    if (textUppercase) processedText = processedText.toUpperCase();
    const lines = processedText.split('\n');

    const lineHeight = actualFontSize * 1.25;
    const lineMetrics = lines.map((line) => ctx.measureText(line));
    const maxLineWidth = Math.max(...lineMetrics.map((m) => m.width), 10);
    const totalTextHeight = lines.length * lineHeight;

    const posX = ((textPositionX ?? 50) / 100) * targetWidth;
    const posY = ((textPositionY ?? 85) / 100) * targetHeight;

    const align = textAlign || 'center';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    // Draw Background Badge / Pill if enabled
    if (textBgStyle && textBgStyle !== 'none') {
      const padX = 18 * scaleFactor;
      const padY = 10 * scaleFactor;
      const boxW = maxLineWidth + padX * 2;
      const boxH = totalTextHeight + padY * 2;
      const radius = textBgStyle.includes('pill')
        ? Math.min(boxH / 2, 28 * scaleFactor)
        : 10 * scaleFactor;

      let boxX = posX - boxW / 2;
      if (align === 'left') boxX = posX - padX;
      else if (align === 'right') boxX = posX - boxW + padX;
      const boxY = posY - totalTextHeight / 2 - padY;

      ctx.save();
      if (textBgStyle === 'dark-pill') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      } else if (textBgStyle === 'light-pill') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      } else if (textBgStyle === 'theme-pill') {
        ctx.fillStyle = 'rgba(42, 42, 44, 0.85)';
      } else if (textBgStyle === 'gold-pill') {
        ctx.fillStyle = 'rgba(169, 150, 127, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      }

      drawRoundedRectPath(ctx, boxX, boxY, boxW, boxH, radius);
      ctx.fill();
      ctx.restore();
    }

    // Shadow for text contrast over busy images
    if (textShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = Math.max(3, 8 * scaleFactor);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = Math.max(1, 2 * scaleFactor);
    }

    // Optional Stroke / Outline
    if (textStroke) {
      ctx.strokeStyle = textColor === '#ffffff' ? '#000000' : '#ffffff';
      ctx.lineWidth = Math.max(1.5, 3 * scaleFactor);
    }

    ctx.fillStyle = textColor || '#ffffff';

    const startY = posY - totalTextHeight / 2 + lineHeight / 2;
    lines.forEach((line, index) => {
      const lineY = startY + index * lineHeight;
      if (textStroke) {
        ctx.strokeText(line, posX, lineY);
      }
      ctx.fillText(line, posX, lineY);
    });

    ctx.restore();
  }
}

/**
 * Convert Canvas to Blob with specified format and quality
 */
export function exportCanvasAsBlob(canvas, mimeType = 'image/png', quality = 0.95) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas export produced an empty blob'));
          }
        },
        mimeType,
        quality
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Triggers native download of an image blob
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies image blob to clipboard (if supported)
 */
export async function copyBlobToClipboard(blob) {
  if (navigator.clipboard && window.ClipboardItem) {
    // Clipboard item must often be PNG
    let pngBlob = blob;
    if (blob.type !== 'image/png') {
      // Convert to png
      const img = new Image();
      const url = URL.createObjectURL(blob);
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      pngBlob = await exportCanvasAsBlob(c, 'image/png', 1.0);
    }
    const item = new ClipboardItem({ 'image/png': pngBlob });
    await navigator.clipboard.write([item]);
    return true;
  }
  throw new Error('ClipboardItem not supported on this browser');
}

/**
 * Shares an image file using Web Share API
 */
export async function shareImageFile(blob, filename, title = 'InstaCrop Photo') {
  if (!navigator.share || !navigator.canShare) {
    throw new Error('Web Share API is not supported on this device/browser');
  }

  const file = new File([blob], filename, { type: blob.type });
  const shareData = {
    title,
    text: 'Created with InstaCrop Canvas Studio',
    files: [file],
  };

  if (!navigator.canShare(shareData)) {
    throw new Error('This browser does not support sharing files via Web Share API');
  }

  await navigator.share(shareData);
  return true;
}

/**
 * Load image from File or Blob safely
 */
export async function loadImageFromSource(source) {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let objectUrl = null;
      if (typeof source === 'string') {
        img.src = source;
      } else if (source instanceof Blob || source instanceof File) {
        objectUrl = URL.createObjectURL(source);
        img.src = objectUrl;
      } else {
        reject(new Error('Invalid image source type'));
        return;
      }

      img.onload = () => {
        setTimeout(() => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }, 5000);
        resolve(img);
      };

      img.onerror = () => {
        setTimeout(() => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }, 1000);
        reject(new Error('HTMLImageElement load error'));
      };
    });
  } catch (initialErr) {
    // Fallback: Try createImageBitmap (hardware decoders on Android for HEIC/HEIF)
    if (typeof createImageBitmap === 'function' && (source instanceof Blob || source instanceof File)) {
      try {
        const bitmap = await createImageBitmap(source);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        const dataUrl = canvas.toDataURL('image/png');
        const fallbackImg = new Image();
        await new Promise((res, rej) => {
          fallbackImg.onload = res;
          fallbackImg.onerror = rej;
          fallbackImg.src = dataUrl;
        });
        return fallbackImg;
      } catch (bitmapErr) {
        console.warn('createImageBitmap fallback also failed:', bitmapErr);
      }
    }
    throw new Error('Failed to load image: file may be corrupted or format is unsupported');
  }
}
