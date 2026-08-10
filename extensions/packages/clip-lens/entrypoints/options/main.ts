import { storageGet, storageSet } from '@qeloma/shared';
import { GEMINI_API_KEY_STORAGE } from '../../lib/gemini';

const app = document.getElementById('app')!;

async function render(): Promise<void> {
  const key = await storageGet<string>(GEMINI_API_KEY_STORAGE, '');

  app.innerHTML = `
    <h1>Qeloma Clip → Lens</h1>
    <div class="subtitle">Connect your own Gemini API key to enable streaming AI summaries. Without a key, Clip → Lens automatically falls back to a local rule-based summarizer.</div>
    <label for="api-key">Gemini API key</label>
    <input type="password" id="api-key" value="${key}" placeholder="AIza…" autocomplete="off" />
    <div class="help">
      Create a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>.
      Your key is stored only in this browser's local extension storage and is never sent anywhere except directly to Google's Gemini API.
    </div>
    <button id="save">Save key</button>
    <div class="status" id="status"></div>
  `;

  document.getElementById('save')!.addEventListener('click', async () => {
    const value = (document.getElementById('api-key') as HTMLInputElement).value.trim();
    await storageSet(GEMINI_API_KEY_STORAGE, value);
    document.getElementById('status')!.textContent = value ? 'Saved. Clip → Lens will now use Gemini.' : 'Cleared. Clip → Lens will use the local fallback.';
  });
}

render();
