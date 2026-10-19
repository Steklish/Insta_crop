// Generates valid PNG icons matching insta_crop.svg
import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function isInRoundedRect(x, y, rx, ry, rw, rh, rad) {
  if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false;
  const left = x - (rx + rad);
  const right = x - (rx + rw - rad);
  const top = y - (ry + rad);
  const bottom = y - (ry + rh - rad);

  if (left < 0 && top < 0) return Math.hypot(left, top) <= rad;
  if (right > 0 && top < 0) return Math.hypot(right, top) <= rad;
  if (left < 0 && bottom > 0) return Math.hypot(left, bottom) <= rad;
  if (right > 0 && bottom > 0) return Math.hypot(right, bottom) <= rad;
  return true;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

function isNearCropStrokes(x, y, scale) {
  const halfThick = 8 * scale;
  const segs = [
    // Top-left
    [76, 186, 76, 76], [76, 76, 186, 76],
    // Top-right
    [336, 76, 446, 76], [446, 76, 446, 186],
    // Bottom-left
    [76, 326, 76, 436], [76, 436, 186, 436],
    // Bottom-right
    [336, 436, 446, 436], [446, 436, 446, 326],
  ];

  for (const [x1, y1, x2, y2] of segs) {
    if (distToSegment(x, y, x1 * scale, y1 * scale, x2 * scale, y2 * scale) <= halfThick) {
      return true;
    }
  }
  return false;
}

function generateInstaCropPNG(size, filename, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));
  const scale = size / 512;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Base background
      let inBase = false;
      if (isMaskable) {
        // Maskable fills full canvas
        inBase = true;
      } else {
        inBase = isInRoundedRect(x, y, 0, 0, width, height, 112 * scale);
      }

      if (!inBase) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Default Emerald Base: #10b981 (16, 185, 129)
      let r = 16;
      let g = 185;
      let b = 129;

      // Check shadow offset: x=116, y=116, w=288, h=288, rx=20
      if (isInRoundedRect(x, y, 116 * scale, 116 * scale, 288 * scale, 288 * scale, 20 * scale)) {
        // #047857 (4, 120, 87)
        r = 4; g = 120; b = 87;
      }

      // Check main white square canvas: x=96, y=96, w=288, h=288, rx=20
      if (isInRoundedRect(x, y, 96 * scale, 96 * scale, 288 * scale, 288 * scale, 20 * scale)) {
        r = 255; g = 255; b = 255;
      }

      // Check inner mint blurred image: x=136, y=136, w=208, h=208, rx=12 (fill #6ee7b7 with 0.5 opacity over white)
      if (isInRoundedRect(x, y, 136 * scale, 136 * scale, 208 * scale, 208 * scale, 12 * scale)) {
        // Blend #6ee7b7 (110, 231, 183) at 50% over 255, 255, 255
        r = Math.round(255 * 0.5 + 110 * 0.5); // ~182
        g = Math.round(255 * 0.5 + 231 * 0.5); // ~243
        b = Math.round(255 * 0.5 + 183 * 0.5); // ~219
      }

      // Check bold crop strokes: #065f46 (6, 95, 70)
      if (isNearCropStrokes(x, y, scale)) {
        r = 6; g = 95; b = 70;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, png);
  console.log(`Saved ${filename} (${width}x${height}) matching insta_crop.svg`);
}

generateInstaCropPNG(192, './public/icon-192.png', false);
generateInstaCropPNG(512, './public/icon-512.png', false);
generateInstaCropPNG(512, './public/icon-maskable-512.png', true);
