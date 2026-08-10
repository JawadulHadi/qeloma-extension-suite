import { WebtimeEntry, storageGet, storageSet } from '@qeloma/shared';

const LIMIT_KEY = 'webtime_daily_limit_minutes';
const BAR_COLORS = ['#34d399', '#38bdf8', '#a78bfa', '#fbbf24', '#f87171', '#f472b6', '#94a3b8'];

function todayKey(): string {
  return `webtime_entries_${new Date().toISOString().slice(0, 10)}`;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const app = document.getElementById('app')!;

async function getLiveEntries(): Promise<Record<string, WebtimeEntry>> {
  const entries = await storageGet<Record<string, WebtimeEntry>>(todayKey(), {});
  const { webtime_active_segment: segment } = await chrome.storage.session.get('webtime_active_segment');
  if (segment) {
    const liveSeconds = Math.round((Date.now() - segment.startedAt) / 1000);
    const existing = entries[segment.domain] ?? { domain: segment.domain, totalSeconds: 0, lastVisit: Date.now() };
    entries[segment.domain] = { ...existing, totalSeconds: existing.totalSeconds + liveSeconds };
  }
  return entries;
}

async function render(): Promise<void> {
  const entries = await getLiveEntries();
  const limitMinutes = await storageGet<number>(LIMIT_KEY, 240);
  const sorted = Object.values(entries).sort((a, b) => b.totalSeconds - a.totalSeconds);
  const totalSeconds = sorted.reduce((sum, e) => sum + e.totalSeconds, 0);
  const maxSeconds = sorted[0]?.totalSeconds ?? 1;
  const limitSeconds = limitMinutes * 60;
  const pct = Math.min(100, (totalSeconds / limitSeconds) * 100);

  app.innerHTML = `
    <h1>Qeloma Webtime</h1>
    <div class="subtitle">Today · zero telemetry, all local</div>
    <div class="total">${formatDuration(totalSeconds)}</div>
    <div class="limit-bar-track"><div class="limit-bar-fill ${pct >= 100 ? 'over' : ''}" style="width:${pct}%"></div></div>
    <div class="limit-row">
      Daily limit: <input type="number" id="limit-input" value="${limitMinutes}" min="15" step="15" /> min
    </div>
    <div class="section-title">Site breakdown</div>
    ${
      sorted.length
        ? sorted
            .slice(0, 8)
            .map(
              (e, i) => `
        <div class="bar-row">
          <div class="bar-label"><span>${e.domain}</span><span>${formatDuration(e.totalSeconds)}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${(e.totalSeconds / maxSeconds) * 100}%;background:${BAR_COLORS[i % BAR_COLORS.length]}"></div></div>
        </div>`,
            )
            .join('')
        : '<div class="empty">Browse for a bit and your site breakdown will show up here.</div>'
    }
  `;

  document.getElementById('limit-input')!.addEventListener('change', async (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    if (value > 0) await storageSet(LIMIT_KEY, value);
  });
}

render();
setInterval(render, 5000);
