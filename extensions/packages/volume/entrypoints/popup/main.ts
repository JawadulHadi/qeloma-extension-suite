import { storageGet, storageSet } from '@qeloma/shared';
import type { VolumeState } from '../background';

const STORAGE_KEY = 'volume_state';
const DEFAULT_STATE: VolumeState = { active: false, tabId: null, gain: 100, bassBoost: 0, balance: 0, mono: false };

let state: VolumeState = DEFAULT_STATE;
const app = document.getElementById('app')!;

async function load(): Promise<void> {
  state = await storageGet(STORAGE_KEY, DEFAULT_STATE);
}

async function updateSettings(partial: Partial<VolumeState>): Promise<void> {
  state = { ...state, ...partial };
  await chrome.runtime.sendMessage({ type: 'UPDATE_VOLUME_SETTINGS', settings: partial });
}

function render(): void {
  app.innerHTML = `
    <h1>Qeloma Volume</h1>
    <div class="gain-display ${state.gain > 100 ? 'boosted' : ''}">${state.gain}%</div>

    <div class="slider-row">
      <label><span>Gain</span><span>0–600%</span></label>
      <input type="range" id="gain" min="0" max="600" value="${state.gain}" />
    </div>
    <div class="slider-row">
      <label><span>Bass boost</span><span>${state.bassBoost}%</span></label>
      <input type="range" id="bass" min="0" max="100" value="${state.bassBoost}" />
    </div>
    <div class="slider-row">
      <label><span>Stereo balance</span><span>${state.balance > 0 ? 'R' : state.balance < 0 ? 'L' : 'C'} ${Math.abs(state.balance)}</span></label>
      <input type="range" id="balance" min="-100" max="100" value="${state.balance}" />
    </div>
    <div class="toggle-row">
      <span>Mono downmix</span>
      <input type="checkbox" id="mono" ${state.mono ? 'checked' : ''} />
    </div>

    <button class="primary-btn ${state.active ? 'stop' : ''}" id="toggle-boost">
      ${state.active ? 'Stop boosting this tab' : 'Boost this tab'}
    </button>
    <div class="hint">${state.active ? 'Audio is being routed through Qeloma Volume.' : 'Starts capturing and boosting the active tab\'s audio.'}</div>
  `;

  document.getElementById('gain')!.addEventListener('input', (e) => {
    updateSettings({ gain: Number((e.target as HTMLInputElement).value) });
    render();
  });
  document.getElementById('bass')!.addEventListener('input', (e) => {
    updateSettings({ bassBoost: Number((e.target as HTMLInputElement).value) });
    render();
  });
  document.getElementById('balance')!.addEventListener('input', (e) => {
    updateSettings({ balance: Number((e.target as HTMLInputElement).value) });
    render();
  });
  document.getElementById('mono')!.addEventListener('change', (e) => {
    updateSettings({ mono: (e.target as HTMLInputElement).checked });
  });

  document.getElementById('toggle-boost')!.addEventListener('click', async () => {
    if (state.active) {
      await chrome.runtime.sendMessage({ type: 'STOP_BOOST' });
      state.active = false;
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;
      await chrome.runtime.sendMessage({ type: 'START_BOOST', tabId: tab.id });
      state.active = true;
      state.tabId = tab.id;
    }
    render();
  });
}

load().then(render);
