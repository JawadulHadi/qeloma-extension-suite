export {};

interface CapturedSlice {
  dataUrl: string;
  scrollY: number;
}

interface FullPagePayload {
  slices: CapturedSlice[];
  viewportWidth: number;
  viewportHeight: number;
  totalHeight: number;
  devicePixelRatio: number;
}

interface RegionSelection {
  x: number;
  y: number;
  width: number;
  height: number;
  devicePixelRatio: number;
}

interface SingleCapture {
  dataUrl: string;
  region?: RegionSelection;
}

type Tool = 'pen' | 'rect' | 'arrow' | 'text';

const COLORS = ['#ef4444', '#fbbf24', '#34d399', '#38bdf8', '#ffffff'];

const app = document.getElementById('app')!;
const params = new URLSearchParams(location.search);
const mode = params.get('mode') ?? 'visible';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let baseImageData: ImageData | null = null;
let activeTool: Tool = 'pen';
let activeColor = COLORS[0];
let drawing = false;
let lastPoint = { x: 0, y: 0 };
let startPoint = { x: 0, y: 0 };
let undoStack: ImageData[] = [];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function renderShell(): void {
  app.innerHTML = `
    <div class="toolbar">
      <span class="brand">Qeloma Shot</span>
      <button class="tool-btn" data-tool="pen">✏️ Pen</button>
      <button class="tool-btn" data-tool="rect">▭ Rect</button>
      <button class="tool-btn" data-tool="arrow">↗️ Arrow</button>
      <button class="tool-btn" data-tool="text">🔤 Text</button>
      ${COLORS.map((c) => `<span class="color-swatch" data-color="${c}" style="background:${c}"></span>`).join('')}
      <button class="tool-btn" id="undo">Undo</button>
      <button class="tool-btn" id="clear">Clear marks</button>
      <div class="spacer"></div>
      <button class="download-btn" id="download">Download PNG</button>
    </div>
    <div class="canvas-wrap"><div class="loading">Preparing image…</div></div>
  `;

  app.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTool = btn.dataset.tool as Tool;
      updateToolbarState();
    });
  });
  app.querySelectorAll<HTMLSpanElement>('[data-color]').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      activeColor = swatch.dataset.color!;
      updateToolbarState();
    });
  });
  document.getElementById('undo')!.addEventListener('click', undo);
  document.getElementById('clear')!.addEventListener('click', clearAnnotations);
  document.getElementById('download')!.addEventListener('click', download);
  updateToolbarState();
}

function updateToolbarState(): void {
  app.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tool === activeTool);
  });
  app.querySelectorAll<HTMLSpanElement>('[data-color]').forEach((swatch) => {
    swatch.classList.toggle('selected', swatch.dataset.color === activeColor);
  });
}

function mountCanvas(width: number, height: number): void {
  const wrap = document.querySelector('.canvas-wrap')!;
  wrap.innerHTML = '';
  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${Math.min(width, 900)}px`;
  wrap.appendChild(canvas);
  ctx = canvas.getContext('2d')!;

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
}

function canvasPoint(e: PointerEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  return { x: (e.clientX - rect.left) * scale, y: (e.clientY - rect.top) * scale };
}

function pushHistory(): void {
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (undoStack.length > 20) undoStack.shift();
}

function onPointerDown(e: PointerEvent): void {
  drawing = true;
  pushHistory();
  const point = canvasPoint(e);
  lastPoint = point;
  startPoint = point;

  if (activeTool === 'text') {
    const text = prompt('Annotation text:');
    drawing = false;
    if (text) {
      ctx.fillStyle = activeColor;
      ctx.font = `${28}px 'Segoe UI', sans-serif`;
      ctx.fillText(text, point.x, point.y);
    } else {
      undoStack.pop();
    }
  }
}

function onPointerMove(e: PointerEvent): void {
  if (!drawing) return;
  const point = canvasPoint(e);

  if (activeTool === 'pen') {
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
  } else if (activeTool === 'rect' || activeTool === 'arrow') {
    const snapshot = undoStack[undoStack.length - 1];
    ctx.putImageData(snapshot, 0, 0);
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 4;
    if (activeTool === 'rect') {
      ctx.strokeRect(startPoint.x, startPoint.y, point.x - startPoint.x, point.y - startPoint.y);
    } else {
      drawArrow(startPoint, point);
    }
  }
}

function onPointerUp(): void {
  drawing = false;
}

function drawArrow(from: { x: number; y: number }, to: { x: number; y: number }): void {
  const headLength = 16;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function undo(): void {
  const snapshot = undoStack.pop();
  if (snapshot) ctx.putImageData(snapshot, 0, 0);
}

function clearAnnotations(): void {
  if (baseImageData) {
    pushHistory();
    ctx.putImageData(baseImageData, 0, 0);
  }
}

function download(): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: `qeloma-shot-${Date.now()}.png`,
      saveAs: false,
    });
  }, 'image/png');
}

async function renderFullPage(): Promise<void> {
  const { shot_fullpage_payload: payload } = await chrome.storage.session.get('shot_fullpage_payload');
  const data = payload as FullPagePayload | undefined;
  if (!data) {
    document.querySelector('.canvas-wrap')!.innerHTML = '<div class="loading">No capture data found.</div>';
    return;
  }
  const dpr = data.devicePixelRatio;
  mountCanvas(Math.round(data.viewportWidth * dpr), Math.round(data.totalHeight * dpr));

  for (const slice of data.slices) {
    const img = await loadImage(slice.dataUrl);
    ctx.drawImage(img, 0, Math.round(slice.scrollY * dpr));
  }
  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

async function renderSingle(): Promise<void> {
  const { shot_single_capture: capture } = await chrome.storage.session.get('shot_single_capture');
  const data = capture as SingleCapture | undefined;
  if (!data) {
    document.querySelector('.canvas-wrap')!.innerHTML = '<div class="loading">No capture data found.</div>';
    return;
  }
  const img = await loadImage(data.dataUrl);

  if (data.region) {
    const dpr = data.region.devicePixelRatio;
    const width = Math.round(data.region.width * dpr);
    const height = Math.round(data.region.height * dpr);
    mountCanvas(width, height);
    ctx.drawImage(
      img,
      Math.round(data.region.x * dpr),
      Math.round(data.region.y * dpr),
      width,
      height,
      0,
      0,
      width,
      height,
    );
  } else {
    mountCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
  }
  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

renderShell();
(mode === 'fullpage' ? renderFullPage() : renderSingle());
