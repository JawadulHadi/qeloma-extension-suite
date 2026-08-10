export {};

interface RegionSelection {
  x: number;
  y: number;
  width: number;
  height: number;
  devicePixelRatio: number;
}

const app = document.getElementById('app')!;

function render(status = ''): void {
  app.innerHTML = `
    <h1>Qeloma Shot</h1>
    <button class="mode-btn" id="visible"><span class="mode-icon">🖥️</span> Capture visible area</button>
    <button class="mode-btn" id="region"><span class="mode-icon">✂️</span> Capture region</button>
    <button class="mode-btn" id="fullpage"><span class="mode-icon">📜</span> Capture full page</button>
    ${status ? `<div class="status">${status}</div>` : ''}
  `;

  document.getElementById('visible')!.addEventListener('click', captureVisible);
  document.getElementById('region')!.addEventListener('click', captureRegion);
  document.getElementById('fullpage')!.addEventListener('click', captureFullPage);
}

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function openViewer(mode: string): Promise<void> {
  await chrome.tabs.create({ url: chrome.runtime.getURL(`viewer.html?mode=${mode}`) });
}

async function captureVisible(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.windowId) return;
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  await chrome.storage.session.set({ shot_single_capture: { dataUrl } });
  await openViewer('visible');
}

function regionSelectOverlay(): Promise<RegionSelection | null> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;cursor:crosshair;background:rgba(15,23,42,0.25);';
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;border:2px dashed #818cf8;background:rgba(129,140,248,0.15);display:none;';
    overlay.appendChild(box);
    document.documentElement.appendChild(overlay);

    let startX = 0;
    let startY = 0;
    let dragging = false;

    function cleanup(result: RegionSelection | null) {
      overlay.remove();
      document.removeEventListener('keydown', onKeyDown);
      resolve(result);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') cleanup(null);
    }

    overlay.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      box.style.display = 'block';
      box.style.left = `${startX}px`;
      box.style.top = `${startY}px`;
      box.style.width = '0px';
      box.style.height = '0px';
    });

    overlay.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;
    });

    overlay.addEventListener('mouseup', (e) => {
      dragging = false;
      const x = Math.min(startX, e.clientX);
      const y = Math.min(startY, e.clientY);
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);
      if (width < 4 || height < 4) {
        cleanup(null);
        return;
      }
      cleanup({ x, y, width, height, devicePixelRatio: window.devicePixelRatio });
    });

    document.addEventListener('keydown', onKeyDown);
  });
}

async function captureRegion(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id || !tab.windowId) return;

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: regionSelectOverlay,
  });
  const region = result as RegionSelection | null;
  if (!region) return;

  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  await chrome.storage.session.set({ shot_single_capture: { dataUrl, region } });
  await openViewer('region');
}

async function captureFullPage(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id || !tab.windowId) return;
  render('Capturing full page… you can close this popup.');
  await chrome.runtime.sendMessage({ type: 'CAPTURE_FULLPAGE', tabId: tab.id, windowId: tab.windowId });
}

render();
