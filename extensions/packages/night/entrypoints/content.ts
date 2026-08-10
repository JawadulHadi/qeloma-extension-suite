import { DEFAULT_NIGHT_SETTINGS, NightSettings, onStorageChange, storageGet } from '@qeloma/shared';

const STORAGE_KEY = 'night_settings';
const STYLE_ID = 'qeloma-night-style';

function buildCss(settings: NightSettings): string {
  const hueRotate = 180 - settings.warmth * 0.6;
  return `
    html {
      filter: invert(${settings.invert}%) hue-rotate(${hueRotate}deg) contrast(${settings.contrast}%) sepia(${settings.sepia}%) brightness(${settings.brightness}%) !important;
      background: #0b0f19 !important;
    }
    img, video, picture, canvas, svg, iframe {
      filter: invert(100%) hue-rotate(${180 - hueRotate}deg) !important;
    }
  `;
}

function applySettings(settings: NightSettings): void {
  const hostname = location.hostname;
  const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  const shouldApply = settings.enabled && !settings.whitelist.includes(hostname);

  if (!shouldApply) {
    existing?.remove();
    return;
  }

  const css = buildCss(settings);
  if (existing) {
    existing.textContent = css;
  } else {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head ?? document.documentElement).appendChild(style);
  }
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,
  async main() {
    const settings = await storageGet<NightSettings>(STORAGE_KEY, DEFAULT_NIGHT_SETTINGS);
    applySettings(settings);

    onStorageChange(STORAGE_KEY, (value) => {
      applySettings((value as NightSettings) ?? DEFAULT_NIGHT_SETTINGS);
    });
  },
});
