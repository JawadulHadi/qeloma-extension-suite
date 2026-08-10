import { FocusState, onStorageChange, storageGet, storageSet } from '@qeloma/shared';
import { removeHostPermission, requestHostPermission } from '../../lib/host-permissions';

const STORAGE_KEY = 'focus_state';
const DEFAULT_STATE: FocusState = {
  blockedDomains: [],
  strictMode: true,
  activeSession: null,
  history: [],
};
const DURATIONS = [25, 45, 60];

let state: FocusState = DEFAULT_STATE;
let selectedDuration = 25;
let countdownInterval: ReturnType<typeof setInterval> | undefined;
/** Set when a domain was added but host access was declined; cleared on next render cycle. */
let permissionNotice: string | null = null;

const app = document.getElementById('app')!;

function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '').split('/')[0];
  return value;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function load(): Promise<void> {
  state = await storageGet(STORAGE_KEY, DEFAULT_STATE);
}

async function persist(): Promise<void> {
  await storageSet(STORAGE_KEY, state);
}

function render(): void {
  clearInterval(countdownInterval);
  const session = state.activeSession;

  app.innerHTML = `
    <h1>Qeloma Focus</h1>

    <div class="session-card">
      ${
        session
          ? `<div class="countdown" id="countdown">--:--</div>
             <div class="empty">Session in progress · ${session.plannedMinutes} min</div>
             <button class="secondary-btn" id="end-session">End session</button>`
          : `<div class="duration-picker">
               ${DURATIONS.map((d) => `<button data-min="${d}" class="${d === selectedDuration ? 'selected' : ''}">${d}m</button>`).join('')}
             </div>
             <button class="primary-btn" id="start-session">Start focus session</button>`
      }
    </div>

    <div class="section-title">Blocked domains</div>
    ${
      state.blockedDomains.length
        ? state.blockedDomains.map((d) => `<div class="domain-row"><span>${d}</span><button data-domain="${d}">✕</button></div>`).join('')
        : '<div class="empty">No domains blocked yet.</div>'
    }
    <div class="add-domain">
      <input id="domain-input" placeholder="e.g. youtube.com" />
      <button id="add-domain-btn">Block</button>
    </div>
    ${permissionNotice ? `<div class="empty">${permissionNotice}</div>` : ''}

    <div class="toggle-row">
      <span>Block domains at all times</span>
      <input type="checkbox" id="strict-toggle" ${state.strictMode ? 'checked' : ''} />
    </div>

    <div class="section-title">Recent sessions</div>
    ${
      state.history.length
        ? state.history
            .slice(0, 5)
            .map(
              (h) =>
                `<div class="history-row"><span>${new Date(h.startedAt).toLocaleDateString()}</span><span>${h.plannedMinutes}m ${h.completed ? '✓' : '✕'}</span></div>`,
            )
            .join('')
        : '<div class="empty">No sessions yet.</div>'
    }
  `;

  app.querySelectorAll<HTMLButtonElement>('.duration-picker button').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedDuration = Number(btn.dataset.min);
      render();
    });
  });

  document.getElementById('start-session')?.addEventListener('click', async () => {
    state.activeSession = {
      id: crypto.randomUUID(),
      startedAt: Date.now(),
      endedAt: null,
      plannedMinutes: selectedDuration,
      completed: false,
    };
    await persist();
    render();
  });

  document.getElementById('end-session')?.addEventListener('click', async () => {
    if (state.activeSession) {
      const finished = { ...state.activeSession, endedAt: Date.now(), completed: false };
      state.history = [finished, ...state.history].slice(0, 50);
      state.activeSession = null;
      await persist();
      render();
    }
  });

  app.querySelectorAll<HTMLButtonElement>('.domain-row button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const domain = btn.dataset.domain;
      state.blockedDomains = state.blockedDomains.filter((d) => d !== domain);
      await persist();
      // Hand the host permission back — nothing needs it once the domain is gone.
      if (domain) await removeHostPermission(domain);
      permissionNotice = null;
      render();
    });
  });

  document.getElementById('add-domain-btn')!.addEventListener('click', async () => {
    const input = document.getElementById('domain-input') as HTMLInputElement;
    const domain = normalizeDomain(input.value);
    if (!domain || state.blockedDomains.includes(domain)) return;

    // This must be the first await in the handler. Chrome only shows the
    // permission prompt while the click's user gesture is still live, and
    // awaiting anything beforehand detaches it.
    const granted = await requestHostPermission(domain);

    state.blockedDomains = [...state.blockedDomains, domain];
    await persist();
    input.value = '';
    permissionNotice = granted
      ? null
      : `${domain} is blocked, but you'll see Chrome's default error page instead of the Qeloma one. Re-add it to grant access.`;
    render();
  });

  document.getElementById('strict-toggle')!.addEventListener('change', async (e) => {
    state.strictMode = (e.target as HTMLInputElement).checked;
    await persist();
  });

  if (session) startCountdown(session.startedAt, session.plannedMinutes);
}

function startCountdown(startedAt: number, plannedMinutes: number): void {
  const el = document.getElementById('countdown');
  if (!el) return;
  const endsAt = startedAt + plannedMinutes * 60_000;
  const tick = () => {
    const remaining = endsAt - Date.now();
    el.textContent = formatDuration(remaining);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      load().then(render);
    }
  };
  tick();
  countdownInterval = setInterval(tick, 1000);
}

onStorageChange(STORAGE_KEY, async () => {
  await load();
  render();
});

load().then(render);
