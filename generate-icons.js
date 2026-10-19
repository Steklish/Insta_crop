// Generates valid PNG icons (192x192, 512x512) and SVG icon for PWA
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

function generateIconPNG(size, filename) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const nx = x / width;
      const ny = y / height;

      // Rounded squircle distance
      const cx = (nx - 0.5) * 2;
      const cy = (ny - 0.5) * 2;
      const cornerRadius = 0.28;
      const dist = Math.pow(Math.abs(cx), 4) + Math.pow(Math.abs(cy), 4);

      if (dist > 1.0) {
        // Transparent outside
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Gradient background: indigo -> violet -> rose
      let r = Math.round(99 + 130 * nx);
      let g = Math.round(102 - 30 * ny);
      let b = Math.round(241 - 80 * nx);

      // Inner image frame box (canvas representation)
      const inBox = nx >= 0.25 && nx <= 0.75 && ny >= 0.25 && ny <= 0.75;
      const isBorder = inBox && (
        nx <= 0.28 || nx >= 0.72 || ny <= 0.28 || ny >= 0.72
      );

      // Inner photo landscape (mountains + sun)
      const inSun = Math.hypot(nx - 0.62, ny - 0.42) < 0.08;
      const inMountain = inBox && (
        (ny > 0.65 - Math.abs(nx - 0.45) * 0.8) ||
        (ny > 0.68 - Math.abs(nx - 0.60) * 0.6)
      );

      if (isBorder) {
        r = 255; g = 255; b = 255;
      } else if (inSun) {
        r = 254; g = 240; b = 138; // golden sun
      } else if (inMountain) {
        r = 224; g = 231; b = 255; // snow peak
      } else if (inBox) {
        // slightly darker tinted glass
        r = Math.round(r * 0.75);
        g = Math.round(g * 0.75);
        b = Math.round(b * 0.75);
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, png);
  console.log(`Saved ${filename} (${width}x${height})`);
}

generateIconPNG(192, './public/icon-192.png');
generateIconPNG(512, './public/icon-512.png');
generateIconPNG(512, './public/icon-maskable-512.png');
