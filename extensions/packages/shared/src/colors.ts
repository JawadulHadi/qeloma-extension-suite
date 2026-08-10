export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

/** Nearest-neighbor match against Tailwind CSS v4 default palette (500 shades), by Euclidean RGB distance. */
export const TAILWIND_SWATCHES: { name: string; hex: string }[] = [
  { name: 'slate-500', hex: '#64748b' },
  { name: 'gray-500', hex: '#6a7282' },
  { name: 'red-500', hex: '#fb2c36' },
  { name: 'orange-500', hex: '#ff6900' },
  { name: 'amber-500', hex: '#f0b100' },
  { name: 'yellow-500', hex: '#f0c000' },
  { name: 'lime-500', hex: '#7ccf00' },
  { name: 'green-500', hex: '#00c951' },
  { name: 'emerald-500', hex: '#00bc7d' },
  { name: 'teal-500', hex: '#00bba7' },
  { name: 'cyan-500', hex: '#00b8db' },
  { name: 'sky-500', hex: '#00a6f4' },
  { name: 'blue-500', hex: '#2b7fff' },
  { name: 'indigo-500', hex: '#615fff' },
  { name: 'violet-500', hex: '#8e51ff' },
  { name: 'purple-500', hex: '#ad46ff' },
  { name: 'fuchsia-500', hex: '#e12afb' },
  { name: 'pink-500', hex: '#f6339a' },
  { name: 'rose-500', hex: '#ff2056' },
];

export function nearestTailwindSwatch(hex: string): { name: string; hex: string } {
  const [r, g, b] = hexToRgb(hex);
  let best = TAILWIND_SWATCHES[0];
  let bestDist = Infinity;
  for (const swatch of TAILWIND_SWATCHES) {
    const [sr, sg, sb] = hexToRgb(swatch.hex);
    const dist = (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = swatch;
    }
  }
  return best;
}
