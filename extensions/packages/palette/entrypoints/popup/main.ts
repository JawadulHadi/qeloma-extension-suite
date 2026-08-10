import { hexToRgb, nearestTailwindSwatch, rgbToHsl, storageGet, storageSet } from '@qeloma/shared';

interface DominantColor {
  hex: string;
  ratio: number;
}

declare global {
  interface Window {
    EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> };
  }
}

const STORAGE_KEY = 'palette_history';

let history: string[] = [];
let dominant: DominantColor[] = [];

const app = document.getElementById('app')!;

function toast(message: string): void {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 1200);
}

function swatchRow(hex: string, ratio?: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const tw = nearestTailwindSwatch(hex);
  return `
    <div class="swatch-row" data-hex="${hex}">
      <div class="swatch" style="background:${hex}"></div>
      <div class="swatch-info">
        <div class="swatch-hex">${hex.toUpperCase()}</div>
        <div class="swatch-meta">rgb(${r}, ${g}, ${b}) · hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%) · ~${tw.name}${ratio !== undefined ? ` · ${Math.round(ratio * 100)}%` : ''}</div>
      </div>
      <button class="copy-btn" data-copy="hex">Hex</button>
      <button class="copy-btn" data-copy="tw">TW</button>
    </div>`;
}

function render(): void {
  app.innerHTML = `
    <h1>Qeloma Palette</h1>
    <div class="actions">
      <button id="pick">Pick Pixel</button>
      <button id="extract">Extract Page Colors</button>
    </div>
    <div class="section-title">Dominant colors</div>
    ${dominant.length ? dominant.map((c) => swatchRow(c.hex, c.ratio)).join('') : '<div class="empty">Click "Extract Page Colors" to sample the current tab.</div>'}
    <div class="section-title">Picked history</div>
    ${history.length ? history.map((h) => swatchRow(h)).join('') : '<div class="empty">Use the EyeDropper to sample any pixel on screen.</div>'}
  `;

  document.getElementById('pick')!.addEventListener('click', pickPixel);
  document.getElementById('extract')!.addEventListener('click', extractPageColors);

  app.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const row = btn.closest<HTMLElement>('.swatch-row')!;
      const hex = row.dataset.hex!;
      const value = btn.dataset.copy === 'tw' ? `bg-[${hex}]` : hex;
      await navigator.clipboard.writeText(value);
      toast(`Copied ${value}`);
    });
  });
}

async function pickPixel(): Promise<void> {
  if (!window.EyeDropper) {
    toast('EyeDropper not supported in this Chrome version');
    return;
  }
  try {
    const result = await new window.EyeDropper().open();
    history = [result.sRGBHex, ...history.filter((h) => h !== result.sRGBHex)].slice(0, 8);
    await storageSet(STORAGE_KEY, history);
    render();
  } catch {
    // user cancelled the eyedropper — no-op
  }
}

async function extractPageColors(): Promise<void> {
  const button = document.getElementById('extract') as HTMLButtonElement;
  button.disabled = true;
  button.textContent = 'Sampling…';
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
    dominant = await clusterDominantColors(dataUrl);
    render();
  } catch (err) {
    toast('Could not capture this tab');
    console.error(err);
  } finally {
    if (document.getElementById('extract')) {
      (document.getElementById('extract') as HTMLButtonElement).disabled = false;
    }
  }
}

async function clusterDominantColors(dataUrl: string): Promise<DominantColor[]> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 240 / img.width);
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const bucketSize = 32;
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 200) continue;
    const r = Math.round(data[i] / bucketSize) * bucketSize;
    const g = Math.round(data[i + 1] / bucketSize) * bucketSize;
    const b = Math.round(data[i + 2] / bucketSize) * bucketSize;
    const key = `${r},${g},${b}`;
    const entry = buckets.get(key) ?? { r, g, b, count: 0 };
    entry.count++;
    buckets.set(key, entry);
    total++;
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((b) => ({
      hex: `#${[b.r, b.g, b.b].map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('')}`,
      ratio: total > 0 ? b.count / total : 0,
    }));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

storageGet<string[]>(STORAGE_KEY, []).then((h) => {
  history = h;
  render();
});
