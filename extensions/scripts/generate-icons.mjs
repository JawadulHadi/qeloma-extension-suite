import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function roundedRectCoverage(px, py, size, radius) {
  const half = size / 2;
  const qx = Math.abs(px - half) - (half - radius);
  const qy = Math.abs(py - half) - (half - radius);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  const dist = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, qy), 0) - radius;
  return dist <= 0;
}

function dist(u, v) {
  return Math.sqrt(u * u + v * v);
}

function angleDeg(u, v) {
  let a = (Math.atan2(v, u) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
}

const GLYPHS = {
  shot: (u, v) => {
    const d = dist(u, v);
    return d >= 0.5 && d <= 0.72;
  },
  focus: (u, v) => {
    const d = dist(u, v);
    const ring = d >= 0.52 && d <= 0.7;
    const slash = Math.abs(u + v) < 0.13 && d <= 0.7;
    return ring || slash;
  },
  night: (u, v) => {
    const main = dist(u, v) <= 0.68;
    const cut = dist(u - 0.32, v - 0.22) <= 0.62;
    return main && !cut;
  },
  'clip-lens': (u, v) => {
    const a = Math.abs(u);
    const b = Math.abs(v);
    return a + b <= 0.85 && a * b < 0.11;
  },
  volume: (u, v) => {
    const cone = u >= -0.7 && u <= -0.15 && Math.abs(v) <= 0.18 + 0.62 * (u + 0.7);
    const d = dist(u + 0.05, v);
    const a = Math.abs(angleDeg(u + 0.05, v) - 0) <= 55 || Math.abs(angleDeg(u + 0.05, v) - 360) <= 55;
    const arc1 = d >= 0.42 && d <= 0.5 && u > -0.1 && a;
    const arc2 = d >= 0.62 && d <= 0.7 && u > -0.1 && a;
    return cone || arc1 || arc2;
  },
  timebox: (u, v) => {
    const gap = 0.12;
    const cellHalf = 0.32;
    const inCellX = Math.abs(u) > gap / 2 && Math.abs(u) < gap / 2 + cellHalf;
    const inCellY = Math.abs(v) > gap / 2 && Math.abs(v) < gap / 2 + cellHalf;
    return inCellX && inCellY;
  },
  webtime: (u, v) => {
    const d = dist(u, v);
    if (d > 0.72) return false;
    const a = angleDeg(u, v);
    return a >= 0 && a <= 120;
  },
  inspect: (u, v) => {
    const d = dist(u + 0.15, v + 0.15);
    const ring = d >= 0.34 && d <= 0.46;
    const handle = u - v > 0.42 && u - v < 0.75 && Math.abs(u + v - 0.15) < 0.13;
    return ring || handle;
  },
  reader: (u, v) => {
    const bands = [-0.4, -0.05, 0.3];
    return bands.some((b) => v >= b && v <= b + 0.18) && Math.abs(u) <= 0.62;
  },
  palette: (u, v) => {
    const dots = [
      [-0.35, -0.3],
      [0.35, -0.3],
      [-0.35, 0.3],
      [0.35, 0.3],
    ];
    return dots.some(([dx, dy]) => dist(u - dx, v - dy) <= 0.22);
  },
};

const PALETTE_DOT_COLORS = ['#F87171', '#34D399', '#818CF8', '#FBBF24'];

const EXTENSIONS = [
  { id: 'shot', accent: '#4F46E5', glyphColor: '#FFFFFF' },
  { id: 'focus', accent: '#DC2626', glyphColor: '#FFFFFF' },
  { id: 'night', accent: '#0F172A', glyphColor: '#FDE68A' },
  { id: 'clip-lens', accent: '#7C3AED', glyphColor: '#FFFFFF' },
  { id: 'volume', accent: '#DB2777', glyphColor: '#FFFFFF' },
  { id: 'timebox', accent: '#0EA5E9', glyphColor: '#FFFFFF' },
  { id: 'webtime', accent: '#059669', glyphColor: '#FFFFFF' },
  { id: 'inspect', accent: '#EA580C', glyphColor: '#FFFFFF' },
  { id: 'reader', accent: '#78716C', glyphColor: '#FFFFFF' },
  { id: 'palette', accent: '#334155', glyphColor: '#FFFFFF' },
];

const SIZES = [16, 48, 128];
const SUB = 4;

function renderIcon(ext, size) {
  const png = new PNG({ width: size, height: size });
  const [bgR, bgG, bgB] = hexToRgb(ext.accent);
  const glyphFn = GLYPHS[ext.id];
  const radius = size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bgCoverage = 0;
      let glyphCoverage = 0;
      for (let sy = 0; sy < SUB; sy++) {
        for (let sx = 0; sx < SUB; sx++) {
          const px = x + (sx + 0.5) / SUB;
          const py = y + (sy + 0.5) / SUB;
          if (!roundedRectCoverage(px, py, size, radius)) continue;
          bgCoverage++;
          const u = (px / size - 0.5) * 2;
          const v = (py / size - 0.5) * 2;
          if (ext.id === 'palette') {
            const dots = [
              [-0.35, -0.3, PALETTE_DOT_COLORS[0]],
              [0.35, -0.3, PALETTE_DOT_COLORS[1]],
              [-0.35, 0.3, PALETTE_DOT_COLORS[2]],
              [0.35, 0.3, PALETTE_DOT_COLORS[3]],
            ];
            if (dots.some(([dx, dy]) => Math.hypot(u - dx, v - dy) <= 0.22)) glyphCoverage++;
          } else if (glyphFn(u, v)) {
            glyphCoverage++;
          }
        }
      }
      const total = SUB * SUB;
      const bgAlpha = bgCoverage / total;
      const glyphAlpha = glyphCoverage / total;
      const idx = (size * y + x) << 2;

      if (ext.id === 'palette' && glyphAlpha > 0) {
        const u = (x / size - 0.5) * 2;
        const v = (y / size - 0.5) * 2;
        const dots = [
          [-0.35, -0.3, PALETTE_DOT_COLORS[0]],
          [0.35, -0.3, PALETTE_DOT_COLORS[1]],
          [-0.35, 0.3, PALETTE_DOT_COLORS[2]],
          [0.35, 0.3, PALETTE_DOT_COLORS[3]],
        ];
        let closest = dots[0];
        let bestD = Infinity;
        for (const d of dots) {
          const dd = Math.hypot(u - d[0], v - d[1]);
          if (dd < bestD) {
            bestD = dd;
            closest = d;
          }
        }
        const [gr, gg, gb] = hexToRgb(closest[2]);
        png.data[idx] = mix(bgR, gr, glyphAlpha);
        png.data[idx + 1] = mix(bgG, gg, glyphAlpha);
        png.data[idx + 2] = mix(bgB, gb, glyphAlpha);
      } else {
        const [gr, gg, gb] = hexToRgb(ext.glyphColor);
        png.data[idx] = mix(bgR, gr, glyphAlpha);
        png.data[idx + 1] = mix(bgG, gg, glyphAlpha);
        png.data[idx + 2] = mix(bgB, gb, glyphAlpha);
      }
      png.data[idx + 3] = Math.round(bgAlpha * 255);
    }
  }
  return png;
}

for (const ext of EXTENSIONS) {
  const outDir = path.join(root, 'packages', ext.id, 'public');
  mkdirSync(outDir, { recursive: true });
  for (const size of SIZES) {
    const png = renderIcon(ext, size);
    const buffer = PNG.sync.write(png);
    const outPath = path.join(outDir, `icon-${size}.png`);
    writeFileSync(outPath, buffer);
    console.log(`wrote ${outPath}`);
  }
}
