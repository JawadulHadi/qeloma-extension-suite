import { storageGet, storageSet } from '@qeloma/shared';

export interface VolumeState {
  active: boolean;
  tabId: number | null;
  gain: number;
  bassBoost: number;
  balance: number;
  mono: boolean;
}

const STORAGE_KEY = 'volume_state';
const DEFAULT_STATE: VolumeState = { active: false, tabId: null, gain: 100, bassBoost: 0, balance: 0, mono: false };
const OFFSCREEN_URL = 'offscreen.html';

async function ensureOffscreenDocument(): Promise<void> {
  const existing = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT] });
  if (existing.length > 0) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: 'Boost the active tab audio using a Web Audio GainNode graph.',
  });
}

async function closeOffscreenDocument(): Promise<void> {
  const existing = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT] });
  if (existing.length > 0) await chrome.offscreen.closeDocument();
}

function getMediaStreamId(tabId: number): Promise<string> {
  return new Promise((resolve) => chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, resolve));
}

async function startBoost(tabId: number): Promise<void> {
  const streamId = await getMediaStreamId(tabId);
  await ensureOffscreenDocument();
  const state = await storageGet<VolumeState>(STORAGE_KEY, DEFAULT_STATE);
  const next: VolumeState = { ...state, active: true, tabId };
  await storageSet(STORAGE_KEY, next);
  await chrome.runtime.sendMessage({ type: 'OFFSCREEN_START', streamId, settings: next });
}

async function stopBoost(): Promise<void> {
  const state = await storageGet<VolumeState>(STORAGE_KEY, DEFAULT_STATE);
  await storageSet(STORAGE_KEY, { ...state, active: false, tabId: null });
  await chrome.runtime.sendMessage({ type: 'OFFSCREEN_STOP' }).catch(() => {});
  await closeOffscreenDocument();
}

async function updateSettings(partial: Partial<VolumeState>): Promise<void> {
  const state = await storageGet<VolumeState>(STORAGE_KEY, DEFAULT_STATE);
  const next = { ...state, ...partial };
  await storageSet(STORAGE_KEY, next);
  if (next.active) {
    await chrome.runtime.sendMessage({ type: 'OFFSCREEN_UPDATE', settings: next }).catch(() => {});
  }
}

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    (async () => {
      if (message?.type === 'START_BOOST') {
        await startBoost(message.tabId);
        sendResponse({ ok: true });
      } else if (message?.type === 'STOP_BOOST') {
        await stopBoost();
        sendResponse({ ok: true });
      } else if (message?.type === 'UPDATE_VOLUME_SETTINGS') {
        await updateSettings(message.settings);
        sendResponse({ ok: true });
      }
    })();
    return true;
  });

  chrome.tabs.onRemoved.addListener(async (tabId) => {
    const state = await storageGet<VolumeState>(STORAGE_KEY, DEFAULT_STATE);
    if (state.active && state.tabId === tabId) {
      await stopBoost();
    }
  });
});
