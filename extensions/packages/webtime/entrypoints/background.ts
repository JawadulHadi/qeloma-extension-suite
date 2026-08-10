import { WebtimeEntry, storageGet, storageSet } from '@qeloma/shared';

const FLUSH_ALARM = 'webtime-flush';

interface Segment {
  domain: string;
  startedAt: number;
}

let segment: Segment | null = null;
let isIdle = false;
let isWindowFocused = true;

function todayKey(): string {
  return `webtime_entries_${new Date().toISOString().slice(0, 10)}`;
}

function domainFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.hostname;
  } catch {
    return null;
  }
}

async function mirrorActiveSegment(): Promise<void> {
  await chrome.storage.session.set({ webtime_active_segment: segment });
}

async function flushSegment(closeSegment: boolean): Promise<void> {
  if (!segment) return;
  const elapsedSeconds = Math.round((Date.now() - segment.startedAt) / 1000);
  if (elapsedSeconds > 0) {
    const key = todayKey();
    const entries = await storageGet<Record<string, WebtimeEntry>>(key, {});
    const existing = entries[segment.domain] ?? { domain: segment.domain, totalSeconds: 0, lastVisit: Date.now() };
    existing.totalSeconds += elapsedSeconds;
    existing.lastVisit = Date.now();
    entries[segment.domain] = existing;
    await storageSet(key, entries);
  }

  if (closeSegment) {
    segment = null;
  } else {
    segment = { domain: segment.domain, startedAt: Date.now() };
  }
  await mirrorActiveSegment();
}

async function startSegment(domain: string | null): Promise<void> {
  if (!domain || isIdle || !isWindowFocused) {
    await flushSegment(true);
    return;
  }
  if (segment?.domain === domain) return;
  await flushSegment(true);
  segment = { domain, startedAt: Date.now() };
  await mirrorActiveSegment();
}

async function trackActiveTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  await startSegment(domainFromUrl(tab?.url));
}

export default defineBackground(() => {
  chrome.idle.setDetectionInterval(60);
  chrome.alarms.create(FLUSH_ALARM, { periodInMinutes: 1 });

  chrome.tabs.onActivated.addListener(() => {
    trackActiveTab();
  });

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.url) {
      startSegment(domainFromUrl(changeInfo.url));
    }
  });

  chrome.windows.onFocusChanged.addListener((windowId) => {
    isWindowFocused = windowId !== chrome.windows.WINDOW_ID_NONE;
    if (isWindowFocused) {
      trackActiveTab();
    } else {
      flushSegment(true);
    }
  });

  chrome.idle.onStateChanged.addListener((state) => {
    isIdle = state !== 'active';
    if (isIdle) {
      flushSegment(true);
    } else {
      trackActiveTab();
    }
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === FLUSH_ALARM) {
      flushSegment(false);
    }
  });

  trackActiveTab();
});
