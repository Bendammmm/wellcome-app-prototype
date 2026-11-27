#!/usr/bin/env node
/**
 * Visual Diff Triptych Generator (Figma Reference vs Actual Render)
 *
 * Usage:
 *   node scripts/visual-diff.mjs <figma.png> <actual.png> [out-triptych.png] [--threshold=0.12]
 *
 * Outputs:
 *   1. Side-by-side 3-panel PNG: [ Figma Reference | Actual Render | Pixel Diff Heatmap ]
 *   2. JSON summary to stdout: dimensions, mismatchPixels, mismatchPercent, and top mismatch zones
 */

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

function readPng(filePath) {
  const buf = fs.readFileSync(filePath);
  return PNG.sync.read(buf);
}

/** Simple bilinear resize to normalize widths (e.g., 2x/3x Figma PNG -> 1x/2x browser screenshot) */
function resizePng(src, targetW, targetH) {
  if (src.width === targetW && src.height === targetH) return src;
  const dst = new PNG({ width: targetW, height: targetH });
  const xRatio = src.width / targetW;
  const yRatio = src.height / targetH;

  for (let y = 0; y < targetH; y++) {
    const sy = Math.min(src.height - 1, y * yRatio);
    const y0 = Math.floor(sy);
    const y1 = Math.min(src.height - 1, y0 + 1);
    const fy = sy - y0;

    for (let x = 0; x < targetW; x++) {
      const sx = Math.min(src.width - 1, x * xRatio);
      const x0 = Math.floor(sx);
      const x1 = Math.min(src.width - 1, x0 + 1);
      const fx = sx - x0;

      const idx00 = (y0 * src.width + x0) * 4;
      const idx10 = (y0 * src.width + x1) * 4;
      const idx01 = (y1 * src.width + x0) * 4;
      const idx11 = (y1 * src.width + x1) * 4;
      const dstIdx = (y * targetW + x) * 4;

      for (let c = 0; c < 4; c++) {
        const top = src.data[idx00 + c] * (1 - fx) + src.data[idx10 + c] * fx;
        const bot = src.data[idx01 + c] * (1 - fx) + src.data[idx11 + c] * fx;
        dst.data[dstIdx + c] = Math.round(top * (1 - fy) + bot * fy);
      }
    }
  }
  return dst;
}

/** Pad image with light grey background (#F0F0F0) to match target height */
function padToHeight(src, targetH) {
  if (src.height === targetH) return src;
  const dst = new PNG({ width: src.width, height: targetH });
  for (let i = 0; i < dst.data.length; i += 4) {
    dst.data[i] = 240;
    dst.data[i + 1] = 240;
    dst.data[i + 2] = 240;
    dst.data[i + 3] = 255;
  }
  PNG.bitblt(src, dst, 0, 0, src.width, Math.min(src.height, targetH), 0, 0);
  return dst;
}

function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((a) => !a.startsWith('--'));
  const thresholdArg = args.find((a) => a.startsWith('--threshold='));
  const threshold = thresholdArg ? Number(thresholdArg.split('=')[1]) : 0.14;

  if (positional.length < 2) {
    console.error(
      'Usage: node scripts/visual-diff.mjs <figma.png> <actual.png> [out-triptych.png] [--threshold=0.14]'
    );
    process.exit(1);
  }

  const figmaPath = path.resolve(positional[0]);
  const actualPath = path.resolve(positional[1]);
  const outPath = path.resolve(
    positional[2] || path.join(path.dirname(actualPath), 'visual-diff-triptych.png')
  );

  const figmaRaw = readPng(figmaPath);
  const actualRaw = readPng(actualPath);

  // Normalize both images to actualRaw.width (preserving Figma aspect ratio)
  const targetW = actualRaw.width;
  const scaledFigmaH = Math.max(1, Math.round((figmaRaw.height / figmaRaw.width) * targetW));
  const figmaScaled = resizePng(figmaRaw, targetW, scaledFigmaH);

  const maxH = Math.max(figmaScaled.height, actualRaw.height);
  const figmaNorm = padToHeight(figmaScaled, maxH);
  const actualNorm = padToHeight(actualRaw, maxH);

  const diffPng = new PNG({ width: targetW, height: maxH });
  const mismatchPixels = pixelmatch(
    figmaNorm.data,
    actualNorm.data,
    diffPng.data,
    targetW,
    maxH,
    {
      threshold,
      alpha: 0.25,
      diffColor: [228, 0, 50], // Wellcome Red for clear mismatch highlight
      diffColorAlt: [255, 136, 0],
    }
  );

  const totalPixels = targetW * maxH;
  const mismatchPercent = Number(((mismatchPixels / totalPixels) * 100).toFixed(2));

  // Compute 3x3 grid hotspot breakdown so reviewers know where mismatches concentrate
  const rows = 3;
  const cols = 3;
  const rowNames = ['top', 'middle', 'bottom'];
  const colNames = ['left', 'center', 'right'];
  const cellCounts = [];

  for (let r = 0; r < rows; r++) {
    const yStart = Math.floor((r * maxH) / rows);
    const yEnd = Math.floor(((r + 1) * maxH) / rows);
    for (let c = 0; c < cols; c++) {
      const xStart = Math.floor((c * targetW) / cols);
      const xEnd = Math.floor(((c + 1) * targetW) / cols);
      let diffCount = 0;
      let cellPixels = 0;
      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          const idx = (y * targetW + x) * 4;
          cellPixels++;
          // Detect pixelmatch diffColor (228, 0, 50) or diffColorAlt (255, 136, 0)
          if (
            (diffPng.data[idx] === 228 && diffPng.data[idx + 1] === 0 && diffPng.data[idx + 2] === 50) ||
            (diffPng.data[idx] === 255 && diffPng.data[idx + 1] === 136 && diffPng.data[idx + 2] === 0)
          ) {
            diffCount++;
          }
        }
      }
      cellCounts.push({
        zone: `${rowNames[r]}-${colNames[c]}`,
        mismatchPercent: Number(((diffCount / Math.max(1, cellPixels)) * 100).toFixed(1)),
      });
    }
  }

  const topHotspots = cellCounts
    .filter((z) => z.mismatchPercent > 1.0)
    .sort((a, b) => b.mismatchPercent - a.mismatchPercent)
    .slice(0, 4);

  // Compose 3-panel triptych: [ Figma | Actual | Diff ] with 8px dark divider bars
  const divider = 8;
  const triptychW = targetW * 3 + divider * 2;
  const triptych = new PNG({ width: triptychW, height: maxH });

  // Fill divider background (#222222)
  for (let i = 0; i < triptych.data.length; i += 4) {
    triptych.data[i] = 34;
    triptych.data[i + 1] = 34;
    triptych.data[i + 2] = 34;
    triptych.data[i + 3] = 255;
  }

  PNG.bitblt(figmaNorm, triptych, 0, 0, targetW, maxH, 0, 0);
  PNG.bitblt(actualNorm, triptych, 0, 0, targetW, maxH, targetW + divider, 0);
  PNG.bitblt(diffPng, triptych, 0, 0, targetW, maxH, (targetW + divider) * 2, 0);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, PNG.sync.write(triptych));

  const report = {
    figmaSize: `${figmaRaw.width}x${figmaRaw.height}`,
    actualSize: `${actualRaw.width}x${actualRaw.height}`,
    normalizedSize: `${targetW}x${maxH}`,
    heightDeltaPx: actualRaw.height - figmaScaled.height,
    mismatchPixels,
    mismatchPercent,
    topHotspots,
    triptychPath: outPath,
  };

  console.log(JSON.stringify(report, null, 2));
}

main();
