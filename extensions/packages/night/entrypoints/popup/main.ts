import { DEFAULT_NIGHT_SETTINGS, NightSettings, onStorageChange, storageGet, storageSet } from '@qeloma/shared';

const STORAGE_KEY = 'night_settings';
let settings: NightSettings = DEFAULT_NIGHT_SETTINGS;

const app = document.getElementById('app')!;

const SLIDERS: { key: keyof NightSettings; label: string; min: number; max: number }[] = [
  { key: 'invert', label: 'Invert', min: 0, max: 100 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
  { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
  { key: 'warmth', label: 'Warmth (amber hue)', min: 0, max: 100 },
];

async function load(): Promise<void> {
  settings = await storageGet(STORAGE_KEY, DEFAULT_NIGHT_SETTINGS);
}

async function persist(): Promise<void> {
  await storageSet(STORAGE_KEY, settings);
}

async function currentHostname(): Promise<string | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return null;
  try {
    return new URL(tab.url).hostname;
  } catch {
    return null;
  }
}

function render(): void {
  app.innerHTML = `
    <h1>Qeloma Night</h1>
    <div class="toggle-row">
      <span>Enable dark mode</span>
      <input type="checkbox" id="enabled" ${settings.enabled ? 'checked' : ''} />
    </div>
    ${SLIDERS.map(
      (s) => `
      <div class="slider-row">
        <label><span>${s.label}</span><span>${settings[s.key]}${s.key === 'invert' || s.key === 'sepia' || s.key === 'warmth' ? '%' : '%'}</span></label>
        <input type="range" data-key="${s.key}" min="${s.min}" max="${s.max}" value="${settings[s.key]}" />
      </div>`,
    ).join('')}

    <button class="secondary-btn" id="whitelist-site">Whitelist this site</button>

    <div class="section-title">Whitelisted sites</div>
    ${
      settings.whitelist.length
        ? settings.whitelist.map((h) => `<div class="whitelist-row"><span>${h}</span><button data-host="${h}">✕</button></div>`).join('')
        : '<div class="empty">No sites whitelisted.</div>'
    }
  `;

  document.getElementById('enabled')!.addEventListener('change', async (e) => {
    settings.enabled = (e.target as HTMLInputElement).checked;
    await persist();
  });

  app.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((input) => {
    input.addEventListener('input', async () => {
      const key = input.dataset.key as keyof NightSettings;
      (settings as unknown as Record<string, number>)[key] = Number(input.value);
      await persist();
      render();
    });
  });

  document.getElementById('whitelist-site')!.addEventListener('click', async () => {
    const host = await currentHostname();
    if (host && !settings.whitelist.includes(host)) {
      settings.whitelist = [...settings.whitelist, host];
      await persist();
      render();
    }
  });

  app.querySelectorAll<HTMLButtonElement>('.whitelist-row button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      settings.whitelist = settings.whitelist.filter((h) => h !== btn.dataset.host);
      await persist();
      render();
    });
  });
}

onStorageChange(STORAGE_KEY, async () => {
  await load();
  render();
});

load().then(render);
