import { storageGet, storageSet } from '@qeloma/shared';
import { DEFAULT_READER_SETTINGS, READER_STORAGE_KEY, ReaderSettings } from '../../lib/settings';

let settings: ReaderSettings = DEFAULT_READER_SETTINGS;
const app = document.getElementById('app')!;

const THEMES: { key: ReaderSettings['theme']; label: string; bg: string; fg: string }[] = [
  { key: 'light', label: 'Light', bg: '#ffffff', fg: '#1e293b' },
  { key: 'sepia', label: 'Sepia', bg: '#f4ecd8', fg: '#3f3527' },
  { key: 'dark', label: 'Dark', bg: '#0f172a', fg: '#e2e8f0' },
];

async function load(): Promise<void> {
  settings = await storageGet(READER_STORAGE_KEY, DEFAULT_READER_SETTINGS);
}

async function persist(): Promise<void> {
  await storageSet(READER_STORAGE_KEY, settings);
}

function render(): void {
  app.innerHTML = `
    <h1>Qeloma Reader</h1>
    <div class="field">
      <label>Font family</label>
      <select id="font-family">
        <option value="serif" ${settings.fontFamily === 'serif' ? 'selected' : ''}>Serif</option>
        <option value="sans" ${settings.fontFamily === 'sans' ? 'selected' : ''}>Sans-serif</option>
        <option value="mono" ${settings.fontFamily === 'mono' ? 'selected' : ''}>Monospace</option>
      </select>
    </div>
    <div class="field">
      <label>Font size · ${settings.fontSize}px</label>
      <input type="range" id="font-size" min="14" max="28" value="${settings.fontSize}" />
    </div>
    <div class="field">
      <label>Theme</label>
      <div class="theme-picker">
        ${THEMES.map(
          (t) => `<button data-theme="${t.key}" class="${settings.theme === t.key ? 'selected' : ''}" style="background:${t.bg};color:${t.fg}">${t.label}</button>`,
        ).join('')}
      </div>
    </div>
    <button class="primary-btn" id="toggle">Toggle reader mode</button>
  `;

  document.getElementById('font-family')!.addEventListener('change', async (e) => {
    settings.fontFamily = (e.target as HTMLSelectElement).value as ReaderSettings['fontFamily'];
    await persist();
  });

  document.getElementById('font-size')!.addEventListener('input', async (e) => {
    settings.fontSize = Number((e.target as HTMLInputElement).value);
    await persist();
    render();
  });

  app.querySelectorAll<HTMLButtonElement>('.theme-picker button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      settings.theme = btn.dataset.theme as ReaderSettings['theme'];
      await persist();
      render();
    });
  });

  document.getElementById('toggle')!.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['reader-inject.js'],
    });
  });
}

load().then(render);
