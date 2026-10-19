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

  if (resolutionMode === '2x') {
    finalW = Math.round(baseW * 2);
    finalH = Math.round(baseH * 2);
  } else if (resolutionMode === '4k') {
    const maxDim = Math.max(baseW, baseH);
    const factor = 3840 / maxDim;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else if (resolutionMode === 'native' && sourceImage) {
    const srcMax = Math.max(sourceImage.naturalWidth, sourceImage.naturalHeight);
    const baseMax = Math.max(baseW, baseH);
    const factor = srcMax / baseMax;
    finalW = Math.round(baseW * factor);
    finalH = Math.round(baseH * factor);
  } else {
    finalW = Math.round(baseW * scaleMultiplier);
    finalH = Math.round(baseH * scaleMultiplier);
  }

  // Ensure minimum dimensions
  finalW = Math.max(64, finalW);
  finalH = Math.max(64, finalH);

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
  padding = 0.08, // 0 to 0.4
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

  const paddedWidth = targetWidth * Math.max(0.1, 1 - padding * 2);
  const paddedHeight = targetHeight * Math.max(0.1, 1 - padding * 2);

  // Contain fit
  const containScale = Math.min(paddedWidth / effectiveImgW, paddedHeight / effectiveImgH);
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
export function loadImageFromSource(source) {
  return new Promise((resolve, reject) => {
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
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image: file may be corrupted or format is unsupported'));
    };
  });
}
