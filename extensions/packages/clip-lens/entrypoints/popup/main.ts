import { storageGet, storageSet } from '@qeloma/shared';
import { GEMINI_API_KEY_STORAGE, LensAction, localFallbackAnalysis, streamGeminiAnalysis } from '../../lib/gemini';

interface LensHistoryItem {
  id: string;
  action: LensAction;
  pageTitle: string;
  summary: string;
  timestamp: number;
  isLocalFallback: boolean;
}

const HISTORY_KEY = 'clip_lens_history';
const ACTIONS: { key: LensAction; label: string }[] = [
  { key: 'summarize', label: 'Summarize' },
  { key: 'extract', label: 'Extract' },
  { key: 'verdict', label: 'Verdict' },
];

let selectedText = '';
let pageTitle = '';
let pageUrl = '';
let history: LensHistoryItem[] = [];
let resultText = '';
let isFallback = false;
let busy = false;

const app = document.getElementById('app')!;

function escapeHtml(value: string): string {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function getSelectionInPage() {
  const selection = window.getSelection()?.toString() ?? '';
  return { text: selection, title: document.title, url: location.href };
}

async function refreshSelection(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: getSelectionInPage });
    const data = result as { text: string; title: string; url: string };
    selectedText = data.text;
    pageTitle = data.title;
    pageUrl = data.url;
  } catch {
    selectedText = '';
  }
}

async function runAction(action: LensAction): Promise<void> {
  if (!selectedText || busy) return;
  busy = true;
  resultText = '';
  isFallback = false;
  render();

  const apiKey = await storageGet<string>(GEMINI_API_KEY_STORAGE, '');

  try {
    if (!apiKey) throw new Error('no-api-key');
    resultText = await streamGeminiAnalysis(apiKey, action, selectedText, pageTitle, pageUrl, (partial) => {
      resultText = partial;
      render();
    });
  } catch {
    isFallback = true;
    resultText = localFallbackAnalysis(action, selectedText);
  }

  const entry: LensHistoryItem = {
    id: crypto.randomUUID(),
    action,
    pageTitle,
    summary: resultText,
    timestamp: Date.now(),
    isLocalFallback: isFallback,
  };
  history = [entry, ...history].slice(0, 20);
  await storageSet(HISTORY_KEY, history);

  busy = false;
  render();
}

function render(): void {
  app.innerHTML = `
    <h1>Qeloma Clip → Lens</h1>
    <div class="subtitle">Highlight text on the page, then choose an action.</div>

    <div class="selection-preview ${selectedText ? '' : 'empty'}">
      ${selectedText ? escapeHtml(selectedText.slice(0, 240)) + (selectedText.length > 240 ? '…' : '') : 'No text selected yet — highlight something on the page, then reopen this popup.'}
    </div>

    <div class="actions">
      ${ACTIONS.map((a) => `<button data-action="${a.key}" ${!selectedText || busy ? 'disabled' : ''}>${a.label}</button>`).join('')}
    </div>

    ${
      resultText || busy
        ? `<div class="result-card">
             <span class="result-badge ${isFallback ? 'fallback' : ''}">${isFallback ? 'Local fallback' : 'Gemini 2.5 Flash'}</span>
             <div>${escapeHtml(resultText) || 'Analyzing…'}</div>
           </div>`
        : ''
    }

    <div class="section-title">Recent analyses</div>
    ${
      history.length
        ? history
            .slice(0, 5)
            .map(
              (h) =>
                `<div class="history-item"><strong>${h.action}</strong> · ${escapeHtml(h.pageTitle).slice(0, 40)} · ${new Date(h.timestamp).toLocaleTimeString()}</div>`,
            )
            .join('')
        : '<div class="history-item">No analyses yet.</div>'
    }

    <div class="settings-link" id="open-settings">Configure Gemini API key</div>
  `;

  app.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => runAction(btn.dataset.action as LensAction));
  });
  document.getElementById('open-settings')!.addEventListener('click', () => chrome.runtime.openOptionsPage());
}

async function init(): Promise<void> {
  history = await storageGet<LensHistoryItem[]>(HISTORY_KEY, []);
  render();
  await refreshSelection();
  render();
}

init();
